const { Category, Expense } = require('../models'); // Assuming models are set up

const createCategory = async (req, res) => {
  try {
    const { user_id, name, amount, description } = req.body;

    // Convert amount to a number and validate
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return res.status(400).json({ message: 'Invalid amount. Must be a number.' });
    }

    // Check if the category already exists for the user
    let category = await Category.findOne({ where: { user_id, name } });

    if (category) {
      // If category exists, update the amount
      // Ensure existing amount is treated as a number
      const existingAmount = parseFloat(category.amount);
      category.amount = existingAmount + amountNum; // Perform arithmetic addition
      await category.save();
    } else {
      // Create a new category if it doesn't exist
      category = await Category.create({
        user_id,
        name,
        amount: amountNum, // Ensure the amount is stored as a number
      });
    }

    // Now, update the expenses table
    await Expense.create({
      user_id,
      category_id: category.id,
      amount: amountNum, // Ensure the amount is stored as a number
      description,
    });

    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the category.',
      error: error.message, // Send the actual error message in JSON
    });
  }
};

const getTotalSpentByUser = async (req, res) => {
  try {
    const userId = req.query.userId; // Use query param

    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const totalSpent = await Category.sum("amount", { where: { user_id: userId } });

    res.status(200).json({ message: "Total spent retrieved", total_spent: totalSpent || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total spent." });
  }
};


module.exports = { createCategory, getTotalSpentByUser };

