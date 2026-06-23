import mongoose from "mongoose";
import validator from "validator";

import Resource from "../resources/resource.model.js";
import Class from "../classes/class.model.js";
import * as sessionService from "../sessions/session.service.js";

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
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
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

userSchema.pre("findOneAndDelete", async function () {
  const userId = this.getFilter()?._id;
  if (!userId) return;

  await Resource.deleteMany({ user: userId });

  await Class.deleteMany({ user: userId });

  await sessionService.revokeAll(userId);
});

export default mongoose.model("User", userSchema);
