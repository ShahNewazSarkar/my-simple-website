const express = require('express');
const router = express.Router();

const { createExpense, getExpensesBetweenDates, getTotalSpentByUser } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

// POST /expenses - Create a new expense
router.post('/', authMiddleware, createExpense);

// GET /expenses/date-range?user_id=1&start_date=2025-01-01&end_date=2025-01-03
router.get('/date-range', authMiddleware, getExpensesBetweenDates);
router.get("/total-spent", authMiddleware, getTotalSpentByUser);

module.exports = router;
