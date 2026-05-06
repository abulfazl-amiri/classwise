import jwt from "jsonwebtoken";
import "dotenv/config.js";

const authenticate = function (req, res, next) {
  try {
    // console.log(req.headers.authorization);
    // console.log(req.headers);

    if (!req.headers.authorization) {
      throw new Error("No token is provided");
    }

    jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

export { authenticate };
