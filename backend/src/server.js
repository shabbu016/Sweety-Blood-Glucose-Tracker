const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");

const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Sweety API"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS database_time"
        );

        res.status(200).json({
            success: true,
            message: "Sweety API and PostgreSQL are connected",
            database: "connected",
            timestamp: result.rows[0].database_time
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Sweety API running on port ${PORT}`);
});