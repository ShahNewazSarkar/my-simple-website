const express = require('express');
const { createAccount, getBalance } = require('../controllers/accountController');
const logger = require('../middleware/logger');
const router = express.Router();

router.post('/create', logger, createAccount);
router.get('/balance', logger, getBalance);

module.exports = router;

