# Sweety – Blood Glucose Tracker

A full-stack web application for securely recording, managing, and monitoring daily blood glucose readings.

## Overview

Sweety helps users maintain their blood glucose records by date and time slot. Users can view their readings, monitor trends through a dashboard, and access daily and monthly reports.

## Features

- User registration and login with password hashing and JWT authentication.
- Secure, user-specific glucose records.
- Create, view, update, and delete glucose readings.
- Four daily reading slots:
  - Morning fasting
  - After breakfast
  - After lunch
  - After dinner
- Input validation:
  - Glucose values between 40 and 600 mg/dL.
  - Integer values only.
  - No future dates.
  - One reading per time slot per date and user.
- Dashboard with glucose trends and summary statistics.
- Daily, month-to-date, and previous-month reports.
- Light and dark themes.

## Technology Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Frontend       | React, Vite, Tailwind CSS      |
| Backend        | Node.js, Express.js            |
| Database       | PostgreSQL                     |
| Authentication | JWT, bcrypt                    |
| API Testing    | Node.js Test Runner, Supertest |

## Project Structure

```text
Sweety-Blood-Glucose-Tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   └── migrations/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/shabbu016/Sweety-Blood-Glucose-Tracker.git
cd Sweety-Blood-Glucose-Tracker
```

### 2. Create the PostgreSQL database

Open PostgreSQL and execute:

```sql
CREATE DATABASE sweety_db;
```

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Update the values in `backend/.env` using your local PostgreSQL configuration.

Example configuration:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_database_password
PGDATABASE=sweety_db

JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=1d
```

Never commit your actual `.env` file or share its secrets.

### 4. Run the database migration

From the `backend` directory:

```bash
psql -U postgres -d sweety_db -f src/db/migrations/001_create_users_and_readings.sql
```

Enter your PostgreSQL password when prompted.

### 5. Start the backend server

```bash
node src/server.js
```

The backend API runs at:

`http://localhost:5000`

### 6. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```powershell
Copy-Item .env.example .env
```

Configure the API URL according to the frontend environment template.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## API Overview

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/api/auth/register`                 | Register a user         |
| POST   | `/api/auth/login`                    | Authenticate a user     |
| GET    | `/api/readings`                      | Retrieve user readings  |
| POST   | `/api/readings`                      | Create a reading        |
| PUT    | `/api/readings/:id`                  | Update a reading        |
| DELETE | `/api/readings/:id`                  | Delete a reading        |
| GET    | `/api/reports/summary`               | Retrieve report summary |
| GET    | `/api/reports/daily?date=YYYY-MM-DD` | Daily report            |
| GET    | `/api/reports/monthly`               | Current month report    |
| GET    | `/api/reports/previous-month`        | Previous month report   |

Protected endpoints require a valid JWT bearer token.

## Running Tests

Navigate to the backend directory:

```bash
cd backend
npm test
```

The test suite covers:

- Application endpoints.
- Authentication and registration.
- Reading creation and validation.
- User data isolation.
- Reading updates and deletion.
- Report calculations.

**Latest verification:** 29 backend tests passed.

## Production Build

To create the frontend production build:

```bash
cd frontend
npm run build
```

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects private API routes.
- Reading queries are scoped to the authenticated user.
- Environment variables are used for sensitive configuration.
- Actual environment files are excluded through `.gitignore`.

## Notes

- This project was developed as part of a technical assignment.
- The application uses PostgreSQL for persistent data storage.
- Configure local environment variables before running the application.
- The application is intended for recording and tracking glucose readings and is not a substitute for professional medical advice.

## Repository

GitHub: https://github.com/shabbu016/Sweety-Blood-Glucose-Tracker
