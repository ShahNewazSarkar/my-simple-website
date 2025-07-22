const { Transaction, Account } = require('../models');

exports.addMoney = async (req, res) => {
    const t = await Account.sequelize.transaction({
        isolationLevel: Account.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    });

    try {
        let { account_id, amount } = req.body;
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            await t.rollback();
            return res.status(400).json({ error: "Amount must be a valid number greater than zero" });
        }

        // Lock the row to prevent concurrent updates
        const account = await Account.findOne({
            where: { user_id: account_id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!account) {
            await t.rollback();
            return res.status(404).json({ error: "Account not found" });
        }

        const currentBalance = parseFloat(account.balance);
        account.balance = currentBalance + amount;

        // Save new balance and create transaction record inside same transaction
        await account.save({ transaction: t });
        await Transaction.create({ account_id, amount, type: 'add' }, { transaction: t });

        await t.commit();

        res.json({ message: "Money added successfully", new_balance: account.balance });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.removeMoney = async (req, res) => {
    const t = await Account.sequelize.transaction({
        isolationLevel: Account.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    });

    try {
        let { account_id, amount } = req.body;
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            await t.rollback();
            return res.status(400).json({ error: "Amount must be a valid number greater than zero" });
        }

        // Lock the row
        const account = await Account.findOne({
            where: { user_id: account_id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!account) {
            await t.rollback();
            return res.status(404).json({ error: "Account not found" });
        }

        const currentBalance = parseFloat(account.balance);
        if (currentBalance < amount) {
            await t.rollback();
            return res.status(400).json({ error: "Insufficient funds" });
        }

        account.balance = currentBalance - amount;

        // Save new balance and create transaction record inside same transaction
        await account.save({ transaction: t });
        await Transaction.create({ account_id, amount: -amount, type: 'remove' }, { transaction: t });
        await t.commit();
        res.json({ message: "Money removed successfully", new_balance: account.balance });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};


