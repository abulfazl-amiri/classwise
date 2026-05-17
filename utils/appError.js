class appError extends Error {
  constructor(message, code) {
    super(message);

    this.statusCode = code;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}
export default appError;
