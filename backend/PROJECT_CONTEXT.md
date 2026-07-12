# Classwise Project Context

Last reviewed: 2026-07-13

## Project Goal

Classwise is a backend REST API for teachers and instructors. It lets a teacher
manage their own courses, lessons, timetables, students, enrollments, and
teaching resources — and share courses/resources with other teachers through
invites and access grants.

The project is API-only. Manual testing is mainly through Postman.

## Current Stack

- Node.js with Express 5 (ES modules)
- MongoDB with Mongoose
- Redis (ioredis) for session, refresh-token, reset-token, and sudo-token storage
- Zod for request validation (with express-validator, validator, libphonenumber-js)
- bcrypt for password hashing
- jsonwebtoken for access tokens; refresh tokens tracked in Redis
- Resend for transactional email (nodemailer also available)
- Morgan for request logging
- dotenv for environment variables
- ESLint + Prettier for tooling

## Architecture

Feature-based (modular), not layer-based. Each feature owns its own routes,
controller, service, repository, model, and schema. Request flow is:

`route → middleware (auth/validation) → controller → service → repository → model`

```text
backend/
├── src/
│   ├── app.js                 # middleware, route mounting, global error handler
│   ├── server.js              # Mongo connection + server bootstrap
│   ├── config/
│   │   ├── constants.js
│   │   └── redis.js
│   ├── middleware/
│   │   ├── auth.middleware.js        # authenticate, requireRole, setMeId, requireSudoMode
│   │   └── validation.middleware.js  # validateBody, validateParams
│   ├── utils/                 # error, token, email, query, password, parser, validation
│   └── features/
│       ├── auth/              # signup, signin, logout, refresh, password reset, confirm-password
│       ├── users/             # /me routes + admin user management
│       ├── sessions/          # active session listing + revocation
│       ├── students/          # student CRUD + enrollments view
│       ├── resources/
│       │   └── access/        # per-teacher resource access grants
│       ├── nonTeachingDays/   # IMPLEMENTED but NOT mounted in app.js
│       └── courses/
│           ├── lessons/
│           ├── timetable/
│           ├── enrollments/
│           └── invites/
```

## What Is Built

- Express app with JSON parsing, Morgan logging, cookie parsing, extended query
  parsing, and `trust proxy`.
- MongoDB connection in `server.js`; Redis client in `config/redis.js`.
- Models: `User`, `Course`, `Lesson`, `Timetable`, `Enrollment`, `Invite`,
  `Student`, `Resource`, `ResourceAccess`, `NonTeachingDay`.
- Auth: signup/signin with bcrypt, JWT access tokens, refresh-token rotation via
  HTTP-only cookie with server-side tracking in Redis, logout.
- Password recovery: forgot/reset flow with reset token in Redis + Resend email.
- Sudo mode: `confirm-password` issues a short-lived sudo token; `requireSudoMode`
  guards sensitive actions (e.g. session revocation).
- Sessions feature: list active sessions, revoke one or all.
- Role restriction middleware for admin-only user routes.
- Feature CRUD scoped to the logged-in user:
  - Courses with course-teacher / course-owner authorization middleware.
  - Nested lessons, timetable, enrollments, and invites under a course.
  - Students with an enrollments view.
  - Resources with a `/recent` alias and per-teacher access sharing.
- Course invites: create (owner), list, accept, reject.
- Zod-based body/param validation via `validateBody` / `validateParams`.
- Reusable query utility for filtering, sorting, field selection, pagination.
- Custom `AppError` class and a global error handler that normalizes Mongoose
  validation errors, duplicate-key (11000) conflicts, and JWT errors, with
  dev-only error codes/details/stack.
- Course pre-delete hook cleans up related lessons, timetable, and enrollments.

## Current API Surface

- `/api/v1/auth` — signup, signin, logout, refresh, password/forgot,
  password/reset, confirm-password
- `/api/v1/users` — /me (get/patch/delete), /me/change-password, admin user CRUD, role update
- `/api/v1/sessions` — list, get by id, revoke one, revoke all (sudo)
- `/api/v1/courses` — CRUD + /:id/teachers + nested timetable/lessons/enrollments/invites
- `/api/v1/invites` — list, accept, reject
- `/api/v1/students` — CRUD + /:id/enrollments
- `/api/v1/resources` — CRUD + /recent + /:resourceId/access (grant/list/revoke)

## Current Important Issues

1. `package.json` still has the placeholder `test` script — no automated tests yet.
2. `nonTeachingDays` is fully implemented (routes/controller/service/repo/model)
   but is **not mounted** in `app.js`, so it is currently dead code.
3. No automatic TTL/cleanup verified for expired refresh/reset tokens beyond what
   Redis key expiry provides — confirm every token type sets an expiry.
4. Response shapes across single vs. list endpoints are not fully normalized.
5. Some features (courses, students) validate on create/update but authorization
   and ownership rules should be re-audited for the nested routes.

## Recommended Next Step

1. Add a real test suite or a repeatable smoke-test script covering auth, refresh,
   sessions, course + nested CRUD, resource access sharing, and admin routes.
2. Mount `nonTeachingDays` in `app.js` (or remove it if out of scope).
3. Normalize response shapes for single vs. list endpoints.
4. Audit ownership/authorization on all nested course routes.
5. Re-test the API in Postman after each change.

## Mentor Notes

- Keep each fix small and verify before moving on.
- Do not add product features until auth, sessions, and error handling are stable.
- Quick checks:

```bash
node --check src/app.js
node -e "import('./src/app.js')"
npm run dev
```
