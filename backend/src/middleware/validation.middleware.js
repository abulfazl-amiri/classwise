const validate =
  (schema, target = "body") =>
  (req, res, next) => {
    const source = target === "params" ? req.params : target === "query" ? req.query : req.body;
    const result = schema.safeParse(source);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path,
        code: issue.code,
        message: issue.message,
      }));

      return res.status(422).json({
        message: "Validation failed",
        ...(process.env.NODE_ENV === "development" ? { details } : {}),
      });
    }

    if (target === "params") {
      req.params = result.data;
    } else if (target === "query") {
      req.query = result.data;
    } else {
      req.body = result.data;
    }

    next();
  };

const validateBody = (schema) => validate(schema, "body");
const validateParams = (schema) => validate(schema, "params");
const validateQuery = (schema) => validate(schema, "query");

export { validate, validateBody, validateParams, validateQuery };
