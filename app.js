import express from "express";

import classRoutes from "./routes/classRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/classes", classRoutes);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     data: {
//       message: "App is fine, no data yet.",
//     },
//   });
// });

export default app;
