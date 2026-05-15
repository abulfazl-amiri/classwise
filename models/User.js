import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minLength: [8, "Passwords can not be less than 8 carachters"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
