# Classwise

Classwise is a REST API for teachers who want to keep their classes, resources,
progress notes, and next-session plans in one place.

The backend is still under active development. The current focus is hardening
auth, error handling, validation, and repeatable testing before adding more
product features.

## What It Does

- Creates user accounts and signs users in with JWT access tokens.
- Rotates refresh tokens through an HTTP-only cookie.
- Supports forgot-password and reset-password email flow.
- Lets each signed-in user create, read, update, and delete their own classes.
- Lets each signed-in user create, read, update, and delete their own resources.
- Supports filtering, sorting, field selection, and pagination on list routes.
- Includes admin-only user management routes.
- Uses a shared error class for most controller-level not-found and input
  errors.

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- nodemailer
- validator
- dotenv

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb_connection_string

JWT_SECRET=access_token_secret
JWT_EXPIRES_IN=15min

JWT_REFRESH_SECRET=refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password

CLIENT_URL=http://127.0.0.1:3000
```

Run in development:

```bash
npm run dev
```

Run normally:

```bash
npm start
```

The server listens on `127.0.0.1` and uses `PORT` from `.env`, or `3000` by
default.

## API Routes

Auth and user routes are mounted at `/api/v1/auth`.

```http
POST   /api/v1/auth/signup
POST   /api/v1/auth/signin
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:resetToken

GET    /api/v1/auth/me
PATCH  /api/v1/auth/me
DELETE /api/v1/auth/me
PATCH  /api/v1/auth/me/change-password

GET    /api/v1/auth/users
GET    /api/v1/auth/users/:id
PATCH  /api/v1/auth/users/:id
DELETE /api/v1/auth/users/:id
PATCH  /api/v1/auth/users/:id/role
```

Class routes are mounted at `/api/v1/classes` and require auth.

```http
GET    /api/v1/classes
POST   /api/v1/classes
GET    /api/v1/classes/:id
PATCH  /api/v1/classes/:id
DELETE /api/v1/classes/:id
```

Resource routes are mounted at `/api/v1/resources` and require auth.

```http
GET    /api/v1/resources
POST   /api/v1/resources
GET    /api/v1/resources/recent
GET    /api/v1/resources/level
GET    /api/v1/resources/:id
PATCH  /api/v1/resources/:id
DELETE /api/v1/resources/:id
```

## Query Options

List routes use `APIFeatures`, so they support:

```http
?sort=-createdAt,name
?fields=name,level,totalPages
?page=2&limit=10
?totalPages[gte]=100
```

## Current Status

The app imports successfully and the main files pass syntax checks. Recent
hardening cleaned up class/resource create response counts, class delete
not-found handling, and the missing-role status for role updates.

There is still no real automated test suite because `npm test` is only the
default placeholder script.

Before calling the backend production-ready, finish the error-response cleanup,
tighten auth/session edge cases, normalize response shapes, and add repeatable
tests or smoke checks for the main routes.

## Author

Abulfazl Amiri
