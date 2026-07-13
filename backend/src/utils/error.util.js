export const generateErrorCode = function (statusCode) {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "TOO_MANY_REQUESTS";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return "SERVER_ERROR";
  }
};

/**
 * App-level error used by controllers and middleware.
 *
 * `statusCode` controls the HTTP response code.
 * `status` is derived for API responses:
 */
class AppError extends Error {
  constructor(message, code, details) {
    super(message);

    this.statusCode = code;
    this.errorCode = generateErrorCode(code);
    this.details = details;
    // all errors thrown manually by us get this field
    this.isOperational = true;
  }
}
export default AppError;
