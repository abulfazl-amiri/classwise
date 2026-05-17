we are doing

1. Run quick smoke tests on API endpoints

- goal: confirm core endpoints (signup/login, GET /classes, GET /resources, /resources/recent) work end-to-end so we surface obvious crashes, auth failures, bad input handling, or cast errors quickly.

2. Add/verify input validation and error handling

- goal: catch bad input early and ensure consistent error responses (reduce Postman/manual testing noise and prevent server crashes).

3. Fix any critical bugs found and re-run smoke tests

- goal: close immediate blockers discovered by tests so the API is stable for further hardening.
