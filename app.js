import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "App is fine, no data yet.",
    },
  });
});

export default app;
