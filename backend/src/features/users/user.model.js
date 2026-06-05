import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Resource from "../resources/resource.model.js";
import Class from "../classes/class.model.js";
import ResetToken from "./reset-token.model.js";
import RefreshToken from "./reset-token.model.js";

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

// Hooks
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

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// static methods
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email: email });
};

userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username: username });
};

userSchema.statics.findByRole = async function (role) {
  return this.find({ role: role });
};

export default mongoose.model("User", userSchema);
