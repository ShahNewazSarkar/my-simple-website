const { Budget } = require('../models');

exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
