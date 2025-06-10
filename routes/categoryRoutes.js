const express = require('express');
const router = express.Router();
const { createCategory } = require('../controllers/categoryController');
//const { getTotalSpentByUser } = require("../controllers/categoryController");
// POST /categories - Create a new category
router.post('/', createCategory);
// Define route to get total spent amount
//router.get("/total-spent", getTotalSpentByUser);

module.exports = router;
