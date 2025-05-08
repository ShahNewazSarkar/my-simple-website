const { Account } = require('../models');

exports.createAccount = async (req, res) => {
    try {
        const { user_id, balance } = req.body;
        const account = await Account.create({ user_id, balance });
        res.json({ message: `Account created successfully`, account });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const { account_id } = req.query;
        const account = await Account.findOne({ where: { user_id: account_id } });

        if (!account) return res.status(404).json({ error: `${account_id}Account not found` });
        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
