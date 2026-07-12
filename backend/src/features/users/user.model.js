import mongoose from "mongoose";
import validator from "validator";

import Resource from "../resources/resource.model.js";
import Course from "../courses/course.model.js";
import * as sessionService from "../sessions/session.service.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
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
      enum: ["teacher", "admin"],
      default: "teacher",
    },
  },
  { timestamps: true },
);

userSchema.pre("findOneAndDelete", async function () {
  const userId = this.getFilter()?._id;
  if (!userId) return;

  await Promise.all([
    Resource.deleteMany({ teacher: userId }),
    Course.deleteMany({ owner: userId }),
    Course.updateMany({ teachers: userId }, { $pull: { teachers: userId } }),
    sessionService.revokeAll(userId),
  ]);
});

export default mongoose.model("User", userSchema);
