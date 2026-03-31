const express = require('express');
const { addMoney, removeMoney } = require('../controllers/transactionController');
const logger = require('../middleware/logger');
const router = express.Router();

router.post('/add', logger, addMoney);
router.post('/remove', logger, removeMoney);

module.exports = router;
