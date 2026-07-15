import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import courseRouter from "./features/courses/course.routes.js";
import resourceRouter from "./features/resources/resource.routes.js";
import userRouter from "./features/users/user.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import sessionRouter from "./features/sessions/session.routes.js";
import inviteRouter from "./features/courses/invites/routes/invite.routes.js";
import studentRouter from "./features/students/student.routes.js";

import AppError, { generateErrorCode } from "./utils/error.util.js";

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// configurations
app.set("query parser", "extended");
app.set("trust proxy", true);

// route mounting
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/invites", inviteRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sessions", sessionRouter);

app.get("/", function (req, res) {
  res.status(200).json({
    message: "Welcome to Classwise",
  });
});

// invalid routes
app.use((req, res, next) => {
  const err = new AppError(
    `Could not find endpoint '${req.originalUrl}' on the available endpoints`,
    404,
  );
  next(err);
});

// server error
app.use((err, req, res, next) => {
  const env = process.env.NODE_ENV || "production";
  const isDevelopment = env === "development";

  if (isDevelopment) {
    console.error(err);
  } else if (env === "production" && !(err instanceof AppError)) {
    console.error(err);
  }

  if (err.name === "ValidationError") {
    err.statusCode = 422;
    err.isOperational = true;
    err.message = "Validation failed";
    err.details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }
  if (err.code === 11000) {
    err.statusCode = 409;
    err.message = `${Object.keys(err.keyValue)[0].slice(0, 1).toUpperCase() + Object.keys(err.keyValue)[0].slice(1)} already exists`;
    err.isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Session expired, please log in again";
    err.isOperational = true;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token, please log in again";
    err.isOperational = true;
  }

  const statusCode = err.statusCode || 500;
  const response = {
    message: err.isOperational ? err.message : "Something went wrong",
    errorCode: err.errorCode || generateErrorCode(statusCode),
  };

  if (isDevelopment) {
    if (err.details) response.details = err.details;
    if (err.stack) response.stack = err.stack;
    response.errorObj = err;
  }

  res.status(statusCode).json(response);
});

export default app;
