const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController.js');

router.post('/create', budgetController.createBudget); // User can create budget
module.exports = router;
