import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import classRoutes from "./features/classes/class.routes.js";
import resourceRoutes from "./features/resources/resource.routes.js";
import userRoutes from "./features/users/user.routes.js";

import appError from "./utils/error.util.js";

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// configurations
app.set("query parser", "extended");

app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/auth", userRoutes);

app.get("/", function (req, res) {
  res.status(200).json({
    status: "success",
    message: "Welcome to Classwise",
  });
});

// invalid routes
app.use((req, res, next) => {
  const err = new appError(
    `Could not find endpoint '${req.originalUrl}' on the available endpoints`,
  );
  err.statusCode = 404;
  err.status = "fail";
  next(err);
});

// server error
app.use((err, req, res, next) => {
  const env = process.env.NODE_ENV || "production";

  if (env === "development") {
    console.error(err);
  } else if (env === "production" && !(err instanceof appError)) {
    console.error(err);
  }

  if (err.name === "ValidationError") {
    err.statusCode = 422;
    err.isOperational = true;
    console.error(JSON.stringify(err, null, 2));
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  if (err.code === 11000) {
    err.statusCode = 409;
    err.status = "fail";
    err.message = `${Object.keys(err.keyValue)[0]} is already exist`;
    err.isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Session expired, please log in again";
    err.isOperational = true;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Invalid token, please log in again";
    err.isOperational = true;
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      errObj: err,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : "Something went wrong",
    });
  }
});

export default app;
