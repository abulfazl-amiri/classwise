import { validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "fail",
      message:
        process.env.NODE_ENV === "development" ? errors.array() : errors.array().map((e) => e.msg),
    });
  }
  next();
};

/**
 * Takes out the _id and override the `user` property to not let clients create fake ones
 * set it to `false` if you don't want to override the user
 * @param {*} req The request object
 * @param {*} overrideUser wether to override the `user` property to logged in user or not, default: true
 * @returns the filtered body
 *
 * - Works with single entity and array of entities
 */
const sanitizeBody = function (req, overrideUser = true) {
  let safeBody;
  if (Array.isArray(req.body)) {
    safeBody = req.body.map((entity) => {
      const { _id, ...rest } = entity;
      return { ...rest, user: overrideUser ? req.user._id : entity.user };
    });
  } else {
    const { _id, ...rest } = req.body;
    safeBody = { ...rest, user: overrideUser ? req.user._id : req.body.user };
  }

  return safeBody;
};

export { handleValidationErrors, sanitizeBody };
