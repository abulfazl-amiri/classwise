import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
    minLength: [8, "Passwords can not be less than 8"],
  },
});

export default mongoose.model("User", userSchema);
