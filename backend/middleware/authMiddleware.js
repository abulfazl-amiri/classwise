import jwt from "jsonwebtoken";
import "dotenv/config.js";

import appError from "../utils/error.util.js";
import User from "../models/user.model.js";

const authenticate = async function (req, res, next) {
  try {
    if (!req.headers.authorization || !req.headers.authorization.split(" ")[1]) {
      throw new appError("No token or malformed token is provided", 401);
    }

    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new appError("User not found", 401);
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

const restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new appError("You do not have permission", 403));
    }
    next();
  };
};

// REUSE the logic in userController
const setMeId = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

export { authenticate, restrictTo, setMeId };
