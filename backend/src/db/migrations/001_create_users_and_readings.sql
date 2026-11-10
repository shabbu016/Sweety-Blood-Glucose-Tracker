
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS readings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    glucose_value SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_time_slot CHECK (
        time_slot IN (
            'morning_fasting',
            'after_breakfast',
            'after_lunch',
            'after_dinner'
        )
    ),

    CONSTRAINT valid_glucose_value CHECK (
        glucose_value BETWEEN 40 AND 600
    ),

    CONSTRAINT unique_user_reading_slot
    UNIQUE (user_id, reading_date, time_slot)
);

CREATE INDEX IF NOT EXISTS readings_user_date_idx
ON readings (user_id, reading_date DESC);
