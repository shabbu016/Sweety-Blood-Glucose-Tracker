
const pool = require("../config/database");

const getSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                MAX(glucose_value) AS highest,
                MIN(glucose_value) AS lowest,
                ROUND(AVG(glucose_value), 1) AS average,
                COUNT(*) AS total_readings
             FROM readings
             WHERE user_id = $1`,
            [req.user.id]
        );

        const summary = result.rows[0];

        return res.status(200).json({
            success: true,
            summary: {
                highest: summary.highest === null
                    ? null
                    : Number(summary.highest),
                lowest: summary.lowest === null
                    ? null
                    : Number(summary.lowest),
                average: summary.average === null
                    ? null
                    : Number(summary.average),
                total_readings: Number(summary.total_readings)
            }
        });
    } catch (error) {
        console.error("Summary report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve summary"
        });
    }
};


const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Provide a date in YYYY-MM-DD format"
            });
        }

        const parsedDate = new Date(`${date}T00:00:00.000Z`);

        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid date"
            });
        }

        const result = await pool.query(
            `SELECT
                TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
                time_slot,
                glucose_value,
                id
             FROM readings
             WHERE user_id = $1 AND reading_date = $2
             ORDER BY CASE time_slot
                WHEN 'morning_fasting' THEN 1
                WHEN 'after_breakfast' THEN 2
                WHEN 'after_lunch' THEN 3
                WHEN 'after_dinner' THEN 4
             END`,
            [req.user.id, date]
        );

        const slotNames = [
            "morning_fasting",
            "after_breakfast",
            "after_lunch",
            "after_dinner"
        ];

        const slots = slotNames.map((slot) => {
            const reading = result.rows.find(
                (item) => item.time_slot === slot
            );

            return {
                time_slot: slot,
                reading: reading || null
            };
        });

        return res.status(200).json({
            success: true,
            date,
            total_readings: result.rows.length,
            slots
        });
    } catch (error) {
        console.error("Daily report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve daily report"
        });
    }
};


const getMonthlyReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
                time_slot,
                glucose_value
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC(
                 'month',
                 NOW() AT TIME ZONE 'Asia/Kolkata'
             )::date
             AND reading_date <= (
                 NOW() AT TIME ZONE 'Asia/Kolkata'
             )::date
             ORDER BY reading_date ASC, time_slot ASC`,
            [req.user.id]
        );

        const values = result.rows.map(
            (reading) => reading.glucose_value
        );

        const total = values.length;

        const summary = {
            highest: total ? Math.max(...values) : null,
            lowest: total ? Math.min(...values) : null,
            average: total
                ? Number((values.reduce((sum, value) => sum + value, 0) / total).toFixed(1))
                : null,
            total_readings: total
        };

        return res.status(200).json({
            success: true,
            period: "month_to_date",
            summary,
            readings: result.rows
        });
    } catch (error) {
        console.error("Monthly report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve monthly report"
        });
    }
};

const getPreviousMonthReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
                time_slot,
                glucose_value
             FROM readings
             WHERE user_id = $1
             AND reading_date >= (
                 DATE_TRUNC(
                     'month',
                     NOW() AT TIME ZONE 'Asia/Kolkata'
                 ) - INTERVAL '1 month'
             )::date
             AND reading_date < DATE_TRUNC(
                 'month',
                 NOW() AT TIME ZONE 'Asia/Kolkata'
             )::date
             ORDER BY reading_date ASC, time_slot ASC`,
            [req.user.id]
        );

        const values = result.rows.map(
            (reading) => reading.glucose_value
        );

        const total = values.length;

        const summary = {
            highest: total ? Math.max(...values) : null,
            lowest: total ? Math.min(...values) : null,
            average: total
                ? Number((values.reduce((sum, value) => sum + value, 0) / total).toFixed(1))
                : null,
            total_readings: total
        };

        return res.status(200).json({
            success: true,
            period: "previous_month",
            summary,
            readings: result.rows
        });
    } catch (error) {
        console.error("Previous month report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve previous month report"
        });
    }
};


module.exports = {
    getSummary,getDailyReport,getMonthlyReport,getPreviousMonthReport
};
