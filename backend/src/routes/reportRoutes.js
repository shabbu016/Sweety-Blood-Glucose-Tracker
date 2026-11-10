
const express = require("express");
const { getSummary, getDailyReport, getMonthlyReport, getPreviousMonthReport } = require("../controllers/reportController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authenticate, getSummary);
router.get("/daily", authenticate, getDailyReport);
router.get("/monthly", authenticate, getMonthlyReport);
router.get("/previous-month", authenticate, getPreviousMonthReport);

module.exports = router;
