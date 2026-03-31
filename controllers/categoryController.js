
//Here Cache Invalidation on Write Strategy is used
//Atomicity from ACID is applied for consistancy

const { Category, Expense } = require('../models');
const cache = require('../localCache'); // for local RAM caching
const { sequelize } = require('../models'); // Sequelize instance

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const category = await Category.create({
      name,
    });

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the category.',
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching categories.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  createCategory,
  getAllCategories
};
