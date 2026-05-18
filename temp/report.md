# Classwise Review Report

Reviewed: 2026-05-16

## Built

- Express app and server are in place.
- MongoDB connects through Mongoose.
- Models exist for users, classes, and resources.
- Signup/signin flow exists with bcrypt password hashing and JWT token creation.
- Class and resource routes are protected by auth middleware.
- CRUD controllers exist for classes and resources.
- `APIFeatures` supports filtering, sorting, field selection, and pagination.
- Resource recent alias exists at `GET /api/v1/resources/recent`.
- Custom error class and global error handler have been started.

## Building Now

- Error handling is being refactored into one consistent global flow.
- Auth is implemented but still needs hardening.
- User routes/controllers exist but need cleanup before relying on them.
- Postman smoke testing is the next main work.
- Validation and bad-input behavior need to be tightened.

## Important Findings

1. The app currently cannot import because `models/User.js` imports `validtor` but uses `validator`.
2. Email validation is misspelled as `validattor`; Mongoose expects `validate`.
3. The global error handler uses `err.statuCode`, so status-code handling is typo-prone.
4. Controller catch blocks convert many errors into 400 responses, losing 401/404/409 meaning.
5. `routes/userRoutes.js` is missing `/` in `route("users/:id")`.
6. `controllers/userController.js` `updateById` responds with `user`, which is not defined.
7. `controllers/userController.js` has a stray `s;` after `updateById`.
8. `findResourcesByLevel` searches for `"Beginner"` but the schema enum uses `"beginner"`.
9. `Resource.edition` should be decided: number format or text format like `"1st"`.

## Verification Run

Passed syntax checks:

```bash
node --check app.js
node --check server.js
node --check models/User.js
node --check models/Class.js
node --check models/Resource.js
node --check controllers/userController.js
node --check controllers/classController.js
node --check controllers/resourceController.js
node --check middleware/authMiddleware.js
node --check utils/apiFeatures.js
node --check utils/appError.js
node --check routes/userRoutes.js
node --check routes/classRoutes.js
node --check routes/resourceRoutes.js
```

Failed runtime import check:

```bash
node -e "import('./app.js')"
```

Error:

```text
validator is not defined
```

## Next Work

Fix order should be:

1. `models/User.js`
2. `app.js` and `utils/appError.js`
3. `controllers/userController.js`
4. `routes/userRoutes.js`
5. Postman smoke tests
