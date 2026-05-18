import express from "express";
import morgan from "morgan";

import classRoutes from "./routes/classRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import appError from "./utils/appError.js";

const app = express();

// middle wares
app.use(express.json());
app.use(morgan("dev"));

// configurations
app.set("query parser", "extended");

app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/auth", userRoutes);

// invalid routes
app.use((req, res, next) => {
  // res.status(404).json({
  //   status: "error",
  //   message: `Could not find endpoint '${req.originalUrl}' on the available endpoints`,
  // });

  const err = new appError(
    `Could not find endpoint '${req.originalUrl}' on the available endpoints`,
  );
  err.statusCode = 404;
  err.status = "fail";
  next(err);
});

// server error
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    err.statusCode = 422;
  }
  err.statuCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statuCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
