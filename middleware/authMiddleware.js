import jwt from "jsonwebtoken";
import "dotenv/config.js";

import appError from "../utils/appError.js";
import User from "../models/User.js";

const authenticate = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new appError("No token is provided");
    }

    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    console.log(decoded);
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  } catch (err) {
    throw new appError(err.message, 401);
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

export { authenticate, restrictTo };
