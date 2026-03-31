const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController.js');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, budgetController.createBudget); // User can create budget
module.exports = router;
