const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const logger = require('../middleware/logger');

// Route to create a new user
router.post('/', logger, userController.createUser); // POST /users - Create a new user

module.exports = router;
