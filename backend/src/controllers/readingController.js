
const pool = require("../config/database");

const validSlots = [
    "morning_fasting",
    "after_breakfast",
    "after_lunch",
    "after_dinner"
];

const createReading = async (req, res) => {
    try {
        const { reading_date, time_slot, glucose_value } = req.body;

        if (!reading_date || !time_slot || glucose_value === undefined) {
            return res.status(400).json({
                success: false,
                message: "Date, time slot and glucose value are required"
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(reading_date)) {
            return res.status(400).json({
                success: false,
                message: "Date must be in YYYY-MM-DD format"
            });
        }

        const parsedDate = new Date(`${reading_date}T00:00:00.000Z`);

        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== reading_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date"
            });
        }

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        if (reading_date > today) {
            return res.status(400).json({
                success: false,
                message: "Future dates are not allowed"
            });
        }

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reading time slot"
            });
        }

        const value = Number(glucose_value);

        if (
            !Number.isInteger(value) ||
            value < 40 ||
            value > 600
        ) {
            return res.status(400).json({
                success: false,
                message: "Glucose value must be a whole number between 40 and 600"
            });
        }

        const result = await pool.query(
            `INSERT INTO readings
                (user_id, reading_date, time_slot, glucose_value)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, reading_date, time_slot,
                       glucose_value, created_at`,
            [req.user.id, reading_date, time_slot, value]
        );

        return res.status(201).json({
            success: true,
            message: "Glucose reading added successfully",
            reading: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A reading already exists for this date and time slot"
            });
        }

        console.error("Create reading error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to add glucose reading"
        });
    }
};


const getReadings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
                time_slot,
                glucose_value,
                created_at
             FROM readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            readings: result.rows
        });
    } catch (error) {
        console.error("Get readings error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve readings"
        });
    }
};


const updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { reading_date, time_slot, glucose_value } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reading ID"
            });
        }

        if (!reading_date || !time_slot || glucose_value === undefined) {
            return res.status(400).json({
                success: false,
                message: "Date, time slot and glucose value are required"
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(reading_date)) {
            return res.status(400).json({
                success: false,
                message: "Date must be in YYYY-MM-DD format"
            });
        }

        const parsedDate = new Date(`${reading_date}T00:00:00.000Z`);

        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== reading_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date"
            });
        }

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        if (reading_date > today) {
            return res.status(400).json({
                success: false,
                message: "Future dates are not allowed"
            });
        }

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reading time slot"
            });
        }

        const value = Number(glucose_value);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                success: false,
                message: "Glucose value must be a whole number between 40 and 600"
            });
        }

        const result = await pool.query(
            `UPDATE readings
             SET reading_date = $1,
                 time_slot = $2,
                 glucose_value = $3,
                 updated_at = NOW()
             WHERE id = $4 AND user_id = $5
             RETURNING id,
                       user_id,
                       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
                       time_slot,
                       glucose_value,
                       updated_at`,
            [reading_date, time_slot, value, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reading not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Glucose reading updated successfully",
            reading: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A reading already exists for this date and time slot"
            });
        }

        console.error("Update reading error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update glucose reading"
        });
    }
};


const deleteReading = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reading ID"
            });
        }

        const result = await pool.query(
            `DELETE FROM readings
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reading not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Glucose reading deleted successfully"
        });
    } catch (error) {
        console.error("Delete reading error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete glucose reading"
        });
    }
};


module.exports = {
    createReading,getReadings,updateReading,deleteReading
};


