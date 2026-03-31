const express = require('express');
const router = express.Router();

const { createExpense, getExpensesBetweenDates, getTotalSpentByUser } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');
const logger = require('../middleware/logger');

// POST /expenses - Create a new expense
router.post('/', authMiddleware, logger, createExpense);

// GET /expenses/date-range?user_id=1&start_date=2025-01-01&end_date=2025-01-03
router.get('/date-range', authMiddleware, logger, getExpensesBetweenDates);
router.get("/total-spent", authMiddleware, logger, getTotalSpentByUser);

module.exports = router;
