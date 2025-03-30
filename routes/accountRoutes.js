const express = require('express');
const { createAccount, getBalance } = require('../controllers/accountController');
const router = express.Router();

router.post('/create', createAccount);
router.get('/balance', getBalance);

module.exports = router;

