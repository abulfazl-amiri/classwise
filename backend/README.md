# Classwise API

Classwise is a REST API that helps teachers run their teaching business from one
place. A teacher can manage courses, schedule lessons and timetables, enroll and
track students, share teaching resources with co-teachers, and hand off courses
to other teachers through invites — all scoped to their own account.

The backend is under active development. The current focus is hardening the
foundation (auth, sessions, validation, consistent error handling) before
expanding the product surface.

## Features

- **Authentication** — signup/signin with JWT access tokens and rotating,
  server-tracked refresh tokens stored in an HTTP-only cookie.
- **Sessions** — list active sessions and revoke them individually or all at
  once. Sensitive actions are protected by a short-lived "sudo" confirmation
  token (re-enter password to unlock).
- **Password recovery** — forgot/reset password flow with email delivery.
- **Courses** — full CRUD, plus nested management of:
  - **Lessons** — per-course lesson records.
  - **Timetable** — the recurring weekly schedule for a course.
  - **Enrollments** — students enrolled in a course.
  - **Invites** — invite another teacher to co-teach or take over a course.
- **Students** — CRUD for a teacher's students and a view of their enrollments.
- **Resources** — CRUD for teaching materials, with per-teacher **access
  sharing** so resources can be granted to or revoked from other teachers.
- **Users** — self-service `/me` routes plus admin-only user management.
- **List controls** — filtering, sorting, field selection, and pagination on
  list endpoints via a shared query utility.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Cache / token store:** Redis (via ioredis)
- **Validation:** Zod, express-validator, validator, libphonenumber-js
- **Auth:** jsonwebtoken, bcrypt, cookie-parser
- **Email:** Resend (with nodemailer available)
- **Logging:** Morgan
- **Config:** dotenv
- **Tooling:** ESLint, Prettier

## Architecture

The code is organized by **feature**, not by technical layer. Each feature owns
its routes, controller, service, repository, model, and schema, which keeps
related logic together and makes features easy to find and extend.

```text
backend/
├── src/
│   ├── app.js                 # Express app, middleware, route mounting, error handler
│   ├── server.js              # DB connection + server bootstrap
│   ├── config/                # constants, Redis client
│   ├── middleware/            # shared auth + validation middleware
│   ├── utils/                 # error, token, email, query, password, parser helpers
│   └── features/
│       ├── auth/              # signup, signin, refresh, password reset, sudo token
│       ├── users/             # /me routes + admin user management
│       ├── sessions/          # active session listing + revocation
│       ├── students/          # student CRUD + enrollments view
│       ├── resources/         # resource CRUD + access sharing (access/)
│       ├── nonTeachingDays/   # holidays / non-teaching day tracking
│       └── courses/           # course CRUD, plus nested:
│           ├── lessons/
│           ├── timetable/
│           ├── enrollments/
│           └── invites/
```

A typical request flows **route → middleware (auth/validation) → controller →
service → repository → model**.

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance
- A running Redis instance

### Install

```bash
npm install
```

### Configure

Create a `.env` file in the `backend/` root:

```env
NODE_ENV=development
PORT=3000

MONGO_URI=your_mongodb_connection_string
REDIS_URL=redis://127.0.0.1:6379

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
RESET_TOKEN_EXPIRES_IN=15m
SUDO_TOKEN_EXPIRES_IN=10m

RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://127.0.0.1:3000
```

### Run

```bash
npm run dev     # development, with reload (nodemon)
npm start       # production
```

The server connects to MongoDB, then listens on `PORT` (default `3000`).

## API Overview

All routes are versioned under `/api/v1`.

### Auth — `/api/v1/auth`

```http
POST /signup
POST /signin
POST /logout
POST /refresh
POST /password/forgot
POST /password/reset
POST /confirm-password        # auth required — issues a sudo token
```

### Users — `/api/v1/users`  _(auth required)_

```http
GET    /me
PATCH  /me
DELETE /me
PATCH  /me/change-password

GET    /                      # admin only
GET    /:id                   # admin only
PATCH  /:id                   # admin only
DELETE /:id                   # admin only
PATCH  /:id/role              # admin only
```

### Sessions — `/api/v1/sessions`  _(auth required)_

```http
GET    /                      # list active sessions
DELETE /                      # revoke all sessions (sudo required)
GET    /:id
DELETE /:id                   # revoke one session (sudo required)
```

### Courses — `/api/v1/courses`  _(auth required)_

```http
GET    /
POST   /
GET    /:id
PATCH  /:id
DELETE /:id                   # owner only
GET    /:id/teachers

# nested resources
/:courseId/timetable          # GET, POST, PATCH
/:courseId/lessons            # GET, POST, GET/PATCH/DELETE :id
/:courseId/enrollments        # GET, POST, GET/PATCH/DELETE :id
/:courseId/invites            # POST  (owner only)
```

### Invites — `/api/v1/invites`  _(auth required)_

```http
GET    /                      # invites addressed to the current teacher
POST   /:id/accept
POST   /:id/reject
```

### Students — `/api/v1/students`  _(auth required)_

```http
GET    /
POST   /
GET    /:id
PATCH  /:id
DELETE /:id
GET    /:id/enrollments
```

### Resources — `/api/v1/resources`  _(auth required)_

```http
GET    /
POST   /
GET    /recent                # alias: recently created resources
GET    /:id
PATCH  /:id
DELETE /:id

# access sharing
/:resourceId/access           # GET (list), POST (grant)
/:resourceId/access/:teacherId  # DELETE (revoke)
```

### List query options

List endpoints support:

```http
?sort=-createdAt,name
?fields=name,subject,fee
?page=2&limit=10
?fee[gte]=100
```

## Error Handling

A shared `AppError` class marks expected (operational) errors. The global error
handler in `app.js` normalizes Mongoose validation errors, duplicate-key
conflicts, and JWT errors into consistent status codes and messages. In
development it includes error codes, details, and stack traces; in production it
returns a generic message for unexpected errors and logs the rest.

## Status & Roadmap

Working today: auth, sessions, sudo confirmation, courses with nested
lessons/timetable/enrollments/invites, students, resources with access sharing,
and admin user management.

Next up:

- Add an automated test suite (`npm test` is still the default placeholder).
- Mount and finish the `nonTeachingDays` feature (implemented but not yet wired
  into `app.js`).
- Continue normalizing response shapes across single vs. list endpoints.
- Add token/session cleanup (TTL) for expired refresh and reset tokens.

> For the detailed running state, open issues, and next steps, see
> [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

## Author

Abulfazl Amiri
