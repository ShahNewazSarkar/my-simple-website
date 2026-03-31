const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController.js');
const authMiddleware = require('../middleware/auth');
const logger = require('../middleware/logger');

router.post('/create', authMiddleware, logger, budgetController.createBudget); // User can create budget
module.exports = router;
