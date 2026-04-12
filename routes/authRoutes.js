const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const logger = require("../middleware/logger");

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

module.exports = router;
