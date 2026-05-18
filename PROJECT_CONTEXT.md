# Classwise Project Context

Last reviewed: 2026-05-16

## Project Goal

Classwise is a backend REST API for managing teaching classes, books/resources,
class progress, and future teaching-session planning.

The current project is API-only. Testing is mainly through Postman.

## Current Stack

- Node.js with Express 5
- MongoDB with Mongoose
- dotenv for environment variables
- Morgan for request logging
- bcrypt for password hashing
- jsonwebtoken for JWT auth
- validator for email validation

## Main Structure

```text
classwise/
├── app.js
├── server.js
├── models/
│   ├── User.js
│   ├── Class.js
│   └── Resource.js
├── controllers/
│   ├── userController.js
│   ├── classController.js
│   └── resourceController.js
├── routes/
│   ├── userRoutes.js
│   ├── classRoutes.js
│   └── resourceRoutes.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── apiFeatures.js
│   └── appError.js
└── temp/
    ├── report.md
    ├── todo.md
    └── todo1.md
```

## What Is Built

- Express app setup with JSON parsing, Morgan logging, and extended query parsing.
- MongoDB connection through Mongoose in `server.js`.
- `User`, `Class`, and `Resource` Mongoose models.
- Signup and signin controller logic.
- Password hashing with bcrypt during signup.
- JWT token creation during signup/signin.
- Auth middleware that protects private routes.
- Protected CRUD routes for classes and resources.
- User admin-style routes exist behind auth, but they are not fully stable yet.
- Reusable `APIFeatures` utility for filtering, sorting, field selection, and pagination.
- Resource alias route: `GET /api/v1/resources/recent`.
- Custom `appError` class started.
- Global error handler started in `app.js`.

## What Is Building Now

Current focus: hardening the API before adding new product features.

The active work is:

- Finish the error-handling refactor.
- Make controllers pass errors cleanly to the global error middleware.
- Fix runtime blockers found during review.
- Smoke test auth, classes, resources, aliases, and bad-input cases in Postman.
- Add stronger validation around request bodies and update routes.

## Current Important Issues

1. `models/User.js` has a runtime blocker: `validator` is used but the import name is misspelled as `validtor`.
2. `models/User.js` uses `validattor` instead of Mongoose's `validate` option, so email validation is not wired correctly.
3. `app.js` global error handler uses `err.statuCode`, which is a typo. It should use `err.statusCode`.
4. Controllers now pass caught errors to `next(err)`, but the global error response still needs cleanup so internal error messages are not leaked to clients.
5. `routes/userRoutes.js` has `route("users/:id")` without the leading `/`, so the user-by-id route is wrong.
6. `controllers/userController.js` `updateById` sends `user`, but only `updatedUser` exists.
7. `controllers/userController.js` has a stray `s;` after the `updateById` catch block.
8. `middleware/authMiddleware.js` verifies the token but does not attach the current user to `req.user` yet.
9. `Resource.edition` is currently a `Number`, but earlier data work used values like `"1st"` and `"2nd"`. Decide which format the API should keep.
10. `findResourcesByLevel` matches `"Beginner"` but the schema enum uses lowercase `"beginner"`.
11. Follow up on global error responses: raw database, validation, or server error messages can leak sensitive implementation details. Later, split trusted `appError` messages from generic internal errors before returning JSON to clients.

## Recommended Next Step

Work one file at a time:

1. Fix `models/User.js` first because the app currently cannot import.
2. Then fix `app.js` and `utils/appError.js` so global error handling is reliable.
3. Then finish sanitizing global error responses so unknown/internal errors return a generic client message.
4. After that, test signup, signin, protected class/resource routes, invalid IDs, and missing fields in Postman.

## Mentor Notes

- Keep the next work focused on stability, not new features.
- Do not rewrite large files unless explicitly requested.
- Prefer small review/fix cycles with syntax checks after each file.
- Useful quick checks:

```bash
node --check app.js
node --check models/User.js
node --check controllers/userController.js
node -e "import('./app.js')"
```
