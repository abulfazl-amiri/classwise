# Classwise Project Context

Last reviewed: 2026-06-01

## Project Goal

Classwise is a backend REST API for teachers and instructors. It helps one user
manage their own classes, books/resources, class progress, notes, and plans for
future teaching sessions.

The project is currently API-only. Manual testing is mainly through Postman.

## Current Stack

- Node.js with Express 5
- MongoDB with Mongoose
- dotenv for environment variables
- Morgan for request logging
- cookie-parser for refresh-token cookies
- bcrypt for password hashing
- jsonwebtoken for access and refresh tokens
- nodemailer for password reset email
- validator for email validation

## Main Structure

```text
backend/
├── app.js
├── server.js
├── models/
│   ├── user.model.js
│   ├── class.model.js
│   ├── resource.model.js
│   ├── reset-token.model.js
│   └── reset-token.model.js
├── controllers/
│   ├── user.controller.js
│   ├── class.controller.js
│   └── resource.controller.js
├── routes/
│   ├── user.routes.js
│   ├── class.routes.js
│   └── resource.routes.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── query.util.js
│   ├── error.util.js
│   └── email.util.js
└── dev/
    ├── classes-sample.json
    ├── resources-sample.json
    ├── resrouces-sample_v2.json
    └── script.js
```

## What Is Built

- Express app setup with JSON parsing, Morgan logging, cookie parsing, and
  extended query parsing.
- MongoDB connection through Mongoose in `server.js`.
- `User`, `Class`, `Resource`, `RefreshToken`, and `ResetToken` models.
- Signup and signin with bcrypt password hashing.
- JWT access tokens through `User.createToken()`.
- Refresh-token rotation using an HTTP-only cookie and persisted token records.
- Forgot/reset password flow with reset-token storage and email sending.
- Auth middleware that validates JWTs, loads the current user, and attaches
  `req.user`.
- Role restriction middleware for admin-only user management routes.
- Protected CRUD routes for classes and resources scoped to the logged-in user.
- Protected `/me` routes that reuse the user-by-id controller through `setMeId`.
- Reusable `APIFeatures` utility for filtering, sorting, field selection, and
  pagination.
- Resource alias route: `GET /api/v1/resources/recent`.
- Resource aggregation route: `GET /api/v1/resources/level`.
- Custom `appError` class and a global error handler in `app.js`.
- User-delete cleanup hook that removes that user's classes, resources, reset
  tokens, and refresh tokens.
- Class/resource create responses now normalize single and bulk creates into an
  array and return a consistent `results` count.
- Class/resource/user not-found paths mostly flow through the shared `appError`
  pattern.

## Current API Surface

Auth and user routes are mounted under `/api/v1/auth`:

- `POST /signup`
- `POST /signin`
- `POST /refresh`
- `POST /forgot-password`
- `POST /reset-password/:resetToken`
- `GET /me`
- `PATCH /me`
- `DELETE /me`
- `PATCH /me/change-password`
- `GET /users` admin only
- `GET /users/:id` admin only
- `PATCH /users/:id` admin only
- `DELETE /users/:id` admin only
- `PATCH /users/:id/role` admin only

Class routes are mounted under `/api/v1/classes` and require auth:

- `GET /`
- `POST /`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`

Resource routes are mounted under `/api/v1/resources` and require auth:

- `GET /`
- `POST /`
- `GET /recent`
- `GET /level`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`

## Verified During This Review

- `node --check app.js` passed.
- `node --check models/user.model.js` passed.
- `node --check controllers/user.controller.js` passed.
- `node --check controllers/class.controller.js` passed.
- `node --check controllers/resource.controller.js` passed.
- `node --check middleware/authMiddleware.js` passed.
- `node -e "import('./app.js')"` passed.

## Current Important Issues

1. `package.json` still has the placeholder test script, so there is no real
   automated test suite yet.
2. The global error handler returns `err.message` for all errors. Trusted
   `appError` messages are fine, but unknown/internal errors should return a
   generic client message and keep details in server logs.
3. The global error handler logs the full error with `console.log(err)`.
   Replace this with intentional development/production logging before shipping.
4. `authenticate` checks that some token exists, but it does not enforce the
   `Bearer <token>` scheme strictly.
5. Refresh-token cookies are always created with `secure: true`, which is good
   for HTTPS but can make local HTTP testing confusing.
6. Refresh tokens and reset tokens are marked `used`, but there is no automatic
   database cleanup/TTL behavior yet.
7. Request body validation is mostly left to Mongoose. Routes still need
   explicit API-level checks for unwanted fields, empty update bodies, and
   malformed IDs.
8. Some response shapes are inconsistent: class detail returns `class`,
   resource detail/update/delete uses `resources`, and create routes always
   return arrays even for single creates. Decide the API convention and keep it
   consistent.

## Recommended Next Step

Keep the focus on hardening before adding new features:

1. Clean up global error handling so production responses do not leak internal
   error details.
2. Tighten auth header parsing and refresh-token behavior.
3. Normalize response shapes for class/resource single vs list endpoints.
4. Add explicit validation for empty update bodies, malformed IDs, and unwanted
   fields.
5. Add basic automated tests or at least a repeatable smoke-test script for
   signup, signin, refresh, protected class/resource CRUD, invalid IDs, missing
   fields, and forbidden admin routes.
6. Re-test the API manually in Postman after each small change.

## Mentor Notes

- Keep each fix small and verify it before moving to the next file.
- Do not add product features until the current auth and error-handling surface
  is stable.
- Useful quick checks:

```bash
node --check app.js
node --check models/user.model.js
node --check controllers/user.controller.js
node --check controllers/class.controller.js
node --check controllers/resource.controller.js
node --check middleware/authMiddleware.js
node -e "import('./app.js')"
```
