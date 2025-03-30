const { Transaction, Account } = require('../models');

exports.addMoney = async (req, res) => {
    try {
        let { account_id, amount } = req.body;
        
        // Convert the incoming amount to a number
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a valid number greater than zero" });
        }
        
        const account = await Account.findOne({ where: { user_id: account_id } });
        if (!account) return res.status(404).json({ error: "Account not found" });

        // Create transaction record
        await Transaction.create({ account_id, amount, type: 'add' });

        // Ensure account.balance is treated as a number (common with DECIMAL fields)
        let currentBalance = parseFloat(account.balance);
        account.balance = currentBalance + amount;
        await account.save();

        res.json({ message: "Money added successfully", new_balance: account.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.removeMoney = async (req, res) => {
    try {
        let { account_id, amount } = req.body;
        
        // Convert amount to a number and validate
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a valid number greater than zero" });
        }
        
        const account = await Account.findOne({ where: { user_id: account_id } });
        if (!account) return res.status(404).json({ error: "Account not found" });
        
        // Ensure the current balance is treated as a number
        const currentBalance = parseFloat(account.balance);
        if (currentBalance < amount) return res.status(400).json({ error: "Insufficient funds" });
        
        // Create a transaction record for money removal
        await Transaction.create({ account_id, amount: -amount, type: 'remove' });
        
        // Subtract the amount from the balance
        account.balance = currentBalance - amount;
        await account.save();
        
        res.json({ message: "Money removed successfully", new_balance: account.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

