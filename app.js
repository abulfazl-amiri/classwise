import express from "express";
import morgan from "morgan";

import classRoutes from "./routes/classRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/auth", userRoutes);

// invalid routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Could not find endpoint '${req.originalUrl}' on the available endpoints`,
  });
});

// server error
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
