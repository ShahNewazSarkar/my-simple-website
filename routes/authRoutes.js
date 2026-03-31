const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const logger = require("../middleware/logger");

router.post("/login", logger, authController.login);
router.post("/refresh", logger, authController.refresh);

module.exports = router;
