
//Here Cache Invalidation on Write Strategy is used
//Atomicity from ACID is applied for consistancy

const { Category, Expense } = require('../models');
const cache = require('../localCache'); // for local RAM caching
const { sequelize } = require('../models'); // Sequelize instance

const createCategory = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { user_id, name, amount, description } = req.body;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return res.status(400).json({ message: 'Invalid amount. Must be a number.' });
    }

    let category = await Category.findOne({ where: { user_id, name }, transaction });

    if (category) {
      category.amount = parseFloat(category.amount) + amountNum;
      await category.save({ transaction });
    } else {
      category = await Category.create({
        user_id,
        name,
        amount: amountNum,
      }, { transaction });
    }

    await Expense.create({
      user_id,
      category_id: category.id,
      amount: amountNum,
      description,
    }, { transaction });

    await transaction.commit();
    committed = true;

    // Invalidate cache only if it exists
    const cacheKey = `totalSpent:user:${user_id}`;
    if (cache.get(cacheKey)) {
      cache.del(cacheKey);
    }

    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while updating the category.',
      error: error.message,
    });
  }
};

module.exports = { createCategory };
