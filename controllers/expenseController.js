const { Expense } = require('../models');
const localCache = require("../localCache"); // Adjust path as needed

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

//Here Cache-Aside Strategy is used
const getTotalSpentByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const cacheKey = `totalSpent:user:${userId}`;

    // Try to get from cache
    const cachedValue = localCache.get(cacheKey);
    if (cachedValue !== null) {
      return res.status(200).json({
        message: "Total spent retrieved from memory cache",
        total_spent: parseFloat(cachedValue),
      });
    }

    // Query from database
    const totalSpent = await Expense.sum("amount", {
      where: { user_id: userId },
    });

    // Save in memory cache for 10 minutes (600000 ms)
    localCache.set(cacheKey, totalSpent || 0, 600000);

    res.status(200).json({
      message: "Total spent retrieved from DB",
      total_spent: totalSpent || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total spent." });
  }
};

module.exports = { getExpensesBetweenDates, getTotalSpentByUser };
