const { Budget, Category } = require('../models');

exports.createBudget = async (req, res) => {
  try {
    const { category_name, budget_amount, start_date, end_date } = req.body;
    const user_id = req.user.id; // From JWT token

    // Validate required fields
    if (!category_name || !budget_amount || !start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        message: 'category_name, budget_amount, start_date, and end_date are required.' 
      });
    }

    // Validate budget_amount is a positive number
    if (isNaN(budget_amount) || budget_amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'budget_amount must be a positive number.' 
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date format for start_date or end_date.' 
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'end_date must be after start_date.' 
      });
    }

    // Find category by name
    const category = await Category.findOne({ 
      where: { name: category_name } 
    });
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: `Category "${category_name}" not found.` 
      });
    }

    // Create budget with user_id from JWT
    const budget = await Budget.create({
      user_id,
      category_id: category.id,
      start_date: startDate,
      end_date: endDate,
      budget_amount
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully.',
      data: budget
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error.',
        error: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the budget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
