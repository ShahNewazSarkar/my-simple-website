const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
//const { getTotalSpentByUser } = require("../controllers/categoryController");

// POST /categories - Create a new category
router.post('/', authMiddleware, createCategory);

// GET /categories - Fetch all categories
router.get('/', authMiddleware, getAllCategories);

// Define route to get total spent amount
//router.get("/total-spent", getTotalSpentByUser);

module.exports = router;
