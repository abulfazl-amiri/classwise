import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Resource from "./Resource.js";
import Class from "./Class.js";
import ResetToken from "./ResetToken.js";
import RefreshToken from "./RefreshToken.js";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid Email.",
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Passwords can not be less than 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

// HOOKS
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.pre("findOneAndDelete", async function () {
  const user = this.getFilter()?._id;
  if (!user) return;

  await Resource.deleteMany({ user: user });

  await Class.deleteMany({ user: user });

  await ResetToken.deleteMany({ user: user });

  await RefreshToken.deleteMany({ user: user });
});

// INSTANCE METHODS
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default mongoose.model("User", userSchema);
