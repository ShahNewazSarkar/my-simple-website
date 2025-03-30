const express = require('express');
const { addMoney, removeMoney } = require('../controllers/transactionController');
const router = express.Router();

router.post('/add', addMoney);
router.post('/remove', removeMoney);

module.exports = router;
