const express = require("express");
const router = express.Router();

const { getLogsByDate } = require("../controllers/logController");

// GET /logs?date=YYYY-MM-DD - fetch all request/response logs for a specific date from S3
router.get("/", getLogsByDate);

module.exports = router;

