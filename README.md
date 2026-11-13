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

## Application Screenshots

The following screenshots demonstrate the main features and user interface of Sweety Blood Glucose Tracker.

### 1. Authentication

![Login Page](submission/screenshots/01-login.png)

![Registration Page](submission/screenshots/02-register.png)

### 2. Dashboard

**Dark Theme**

![Dashboard Overview - Dark](submission/screenshots/03-dashboard-overview-dark.png)

**Recent Glucose Readings**

![Recent Readings](submission/screenshots/04-dashboard-recent-readings.png)

**Light Theme**

![Dashboard Overview - Light](submission/screenshots/11-dashboard-overview-light.png)

### 3. Glucose Readings Management

**Add Reading**

![Add Reading](submission/screenshots/05-readings-add.png)

**Edit Reading**

![Edit Reading](submission/screenshots/06-readings-edit.png)

### 4. Reports and Analytics

**Daily Report**

![Daily Report](submission/screenshots/07-daily-report.png)

**Monthly Report**

![Monthly Report](submission/screenshots/08-monthly-report.png)

### 5. User Profile

**Profile Overview**

![Profile Overview](submission/screenshots/09-profile-overview.png)

**Profile Details**

![Profile Details](submission/screenshots/10-profile-details.png)

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
│   ├── scripts/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── readingController.js
│   │   │   └── reportController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── readingRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── db/
│   │   │   └── migrations/
│   │   │       └── 001_create_users_and_readings.sql
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── app.test.js
│   │   ├── auth.test.js
│   │   ├── reading.test.js
│   │   └── report.test.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── submission/
│   └── screenshots/
│       ├── 01-login.png
│       ├── 02-register.png
│       ├── 03-dashboard-overview-dark.png
│       ├── 04-dashboard-recent-readings.png
│       ├── 05-readings-add.png
│       ├── 06-readings-edit.png
│       ├── 07-daily-report.png
│       ├── 08-monthly-report.png
│       ├── 09-profile-overview.png
│       ├── 10-profile-details.png
│       └── 11-dashboard-overview-light.png
│
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

### 5. Configure demo data (Optional)

To create a demo account and populate the database with sample glucose readings, run:

```bash
npm run seed
```

The seed script creates a demo account and inserts up to 28 sample readings covering seven days and all four supported time slots.

**Demo Login Credentials**

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | demo@sweetytracker.com |
| Password | SweetyDemo@123         |

The seed script can be run multiple times. Existing demo accounts and readings are reused, and duplicate readings are skipped.

These credentials are intended only for local assignment demonstration.

### 6. Start the backend server

From the `backend` directory:

```bash
node src/server.js
```

The backend API runs at:

`http://localhost:5000`

### 7. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```powershell
Copy-Item .env.example .env
```

The frontend API URL can be configured in `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

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

**Latest verification: 29 backend tests passed.**

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
