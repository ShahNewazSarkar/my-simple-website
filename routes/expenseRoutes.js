const express = require('express');
const router = express.Router();
const { getExpensesBetweenDates } = require('../controllers/expenseController');

// GET /expenses/date-range?user_id=1&start_date=2025-01-01&end_date=2025-01-03
router.get('/date-range', getExpensesBetweenDates);

module.exports = router;
