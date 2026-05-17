# AppError Implementation Todo

1. Create `utils/appError.js`

goal: Make one reusable error class for errors you expect, like invalid route, missing fields, wrong password, duplicate email, or not found.

hint: Your class should extend the built-in `Error`. It should receive `message` and `statusCode`, then set `status`, `statusCode`, and something like `isOperational`.

2. Replace the invalid route `new Error(...)` in `app.js`

goal: Your 404 route should use your custom error class instead of manually attaching properties to a normal `Error` object.

hint: Import `AppError`, then pass the route message and `404` into it. This also fixes the current `statuCode` typo problem.

3. Clean up the global error handler in `app.js`

goal: The global handler should become the single place that decides the HTTP status code and JSON response shape.

hint: Use `err.statusCode || 500`, not `err.statuCode`. Keep the response shape simple: `status` and `message`.

4. Update controller function signatures to accept `next`

goal: Controllers need a way to pass errors to the global error handler.

hint: Express controller functions can receive `(req, res, next)`. You only need `next` in controllers where you will stop sending errors manually.

5. Replace direct known-error responses with `next(new AppError(...))`

goal: Avoid repeating `res.status(...).json(...)` for expected failures like missing email/password, duplicate email, no user found, or wrong password.

hint: In `controllers/userController.js`, good first targets are signup/signin validation branches. After calling `next(...)`, return immediately so the function stops.

6. Replace thrown normal errors for bad request body arrays

goal: `throw new Error(...)` works, but it loses your status code unless the catch block manually handles it.

hint: For "multi account creation/sign in detected", create an `AppError` with status code `400`.

7. Change `catch` blocks to forward errors

goal: Unexpected database/JWT/bcrypt errors should go to the global handler instead of each controller deciding its own response.

hint: Inside `catch (err)`, call `next(err)`. Do not send another response there.

8. Do the same pattern later in `classController.js` and `resourceController.js`

goal: Your whole API should use one error-handling style, not mixed controller responses plus global middleware.

hint: Start with not-found branches like `if (!foundClass)` or `if (!foundResource)`. Those should become `return next(new AppError(..., 404))`.

9. Add one small syntax check after each file change

goal: Catch typo-level mistakes before testing in Postman.

hint: Run `node --check app.js`, then the controller file you changed.

10. Test in Postman by category

goal: Prove the handler works for both operational errors and unexpected errors.

hint: Test invalid route, missing signup fields, duplicate email, wrong signin password, and bad MongoDB id on class/resource endpoints.

Suggested first scope: only do `utils/appError.js`, `app.js`, and `controllers/userController.js`. That is small enough to learn the pattern without rewriting the whole project.
