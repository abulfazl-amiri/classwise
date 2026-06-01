import mongoose from "mongoose";
import "dotenv/config.js";
import app from "./app.js";

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed: ", err);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, "127.0.0.1", () => console.log(`Server is running on port ${PORT}`));
