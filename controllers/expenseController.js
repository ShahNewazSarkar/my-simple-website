const { Expense } = require('../models');

// Get expenses between two dates
const getExpensesBetweenDates = async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    // Validate input
    if (!user_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'user_id, start_date, and end_date are required.' });
    }

    // Fetch expenses within the date range for the specific user
    const expenses = await Category.findAll({
      where: {
        user_id,
        created_at: {
          $between: [new Date(start_date), new Date(end_date)],
        },
      },
    });

    res.status(200).json({
      message: 'Expenses fetched successfully',
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getExpensesBetweenDates };
