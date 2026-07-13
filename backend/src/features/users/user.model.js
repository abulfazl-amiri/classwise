import mongoose from "mongoose";
import validator from "validator";

import Resource from "../resources/resource.model.js";
import Course from "../courses/course.model.js";
import Student from "../students/student.model.js";
import Invite from "../courses/invites/invite.model.js";
import * as sessionService from "../sessions/session.service.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [1, "Name can't be empty"],
      maxLength: [50, "Name can't be more than 50 chars"],
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

  // Delete owned courses/resources one-by-one via findOneAndDelete so each doc's
  // own cascade hook fires. deleteMany would skip those hooks and orphan their
  // children (lessons, timetables, enrollments, invites, resource access).
  const [ownedCourses, ownedResources, ownedStudents] = await Promise.all([
    Course.find({ owner: userId }).select("_id"),
    Resource.find({ teacher: userId }).select("_id"),
    Student.find({ createdBy: userId }).select("_id"),
  ]);

  await Promise.all([
    ...ownedCourses.map((course) => Course.findByIdAndDelete(course._id)),
    ...ownedResources.map((resource) => Resource.findByIdAndDelete(resource._id)),
    ...ownedStudents.map((student) => Student.findByIdAndDelete(student._id)),
    // Courses this user co-teaches but doesn't own: just drop them from the roster.
    Course.updateMany({ teachers: userId }, { $pull: { teachers: userId } }),
    Invite.deleteMany({ $or: [{ sender: userId }, { reciever: userId }] }),
    sessionService.revokeAll(userId),
  ]);
});

export default mongoose.model("User", userSchema);
