/**
 * App-level error used by controllers and middleware.
 *
 * `statusCode` controls the HTTP response code.
 * `status` is derived for API responses:
 * - 4xx errors become "fail"
 * - 5xx errors become "error"
 */
class appError extends Error {
  constructor(message, code) {
    super(message);

    this.statusCode = code;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}
export default appError;
