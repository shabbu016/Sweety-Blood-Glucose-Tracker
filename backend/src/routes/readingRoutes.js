
const express = require("express");
const { createReading ,getReadings, updateReading, deleteReading} = require("../controllers/readingController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createReading);
router.get("/", authenticate, getReadings);
router.put("/:id", authenticate, updateReading);
router.delete("/:id", authenticate, deleteReading);


module.exports = router;
