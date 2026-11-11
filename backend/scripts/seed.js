
const path = require("path");
const bcrypt = require("bcrypt");

// Load backend environment variables.
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const pool = require("../src/config/database");

const DEMO_USER = {
    name: "Sweety Demo User",
    email: "demo@sweetytracker.com",
    password: "SweetyDemo@123"
};

const timeSlots = [
    "morning_fasting",
    "after_breakfast",
    "after_lunch",
    "after_dinner"
];

// Sample values for seven days.
// Each day has one reading for each supported time slot.
const sampleReadings = [
    [105, 142, 128, 118],
    [108, 145, 132, 121],
    [102, 138, 125, 115],
    [110, 148, 135, 124],
    [106, 140, 129, 119],
    [104, 143, 131, 122],
    [107, 146, 133, 120]
];

const getTodayInIndia = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const dateParts = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return {
        year: Number(dateParts.year),
        month: Number(dateParts.month),
        day: Number(dateParts.day)
    };
};

const getDateDaysAgo = (daysAgo) => {
    const today = getTodayInIndia();

    const date = new Date(Date.UTC(
        today.year,
        today.month - 1,
        today.day - daysAgo
    ));

    return date.toISOString().slice(0, 10);
};

const seedDatabase = async () => {
    try {
        console.log("Starting Sweety demo database seed...");

        // Create demo user only if it does not already exist.
        const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);

        const userResult = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             ON CONFLICT (LOWER(email)) DO NOTHING
             RETURNING id`,
            [
                DEMO_USER.name,
                DEMO_USER.email,
                passwordHash
            ]
        );

        let userId;
        const userCreated = userResult.rowCount > 0;

        if (userCreated) {
            userId = userResult.rows[0].id;
            console.log("Demo user created successfully.");
        } else {
            const existingUser = await pool.query(
                `SELECT id FROM users
                 WHERE LOWER(email) = LOWER($1)`,
                [DEMO_USER.email]
            );

            if (existingUser.rows.length === 0) {
                throw new Error("Unable to find the demo user.");
            }

            userId = existingUser.rows[0].id;
            console.log("Demo user already exists. Reusing account.");
        }

        let insertedCount = 0;
        let skippedCount = 0;

        // Insert readings for the last seven days.
        for (let day = 0; day < 7; day++) {
            const readingDate = getDateDaysAgo(6 - day);

            for (let slot = 0; slot < timeSlots.length; slot++) {
                const result = await pool.query(
                    `INSERT INTO readings
                        (user_id, reading_date, time_slot, glucose_value)
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (user_id, reading_date, time_slot)
                     DO NOTHING`,
                    [
                        userId,
                        readingDate,
                        timeSlots[slot],
                        sampleReadings[day][slot]
                    ]
                );

                if (result.rowCount > 0) {
                    insertedCount++;
                } else {
                    skippedCount++;
                }
            }
        }

        console.log("\nSeed completed successfully.");
        console.log(`New readings inserted: ${insertedCount}`);
        console.log(`Existing readings skipped: ${skippedCount}`);

        if (userCreated) {
            console.log("\nDemo login credentials:");
            console.log(`Email: ${DEMO_USER.email}`);
            console.log(`Password: ${DEMO_USER.password}`);
        } else {
            console.log(
                "\nDemo account already existed. Its password was not changed."
            );
        }
    } catch (error) {
        console.error("Database seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

seedDatabase();
