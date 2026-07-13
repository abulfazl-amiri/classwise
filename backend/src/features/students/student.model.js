import mongoose from "mongoose";
import validator from "validator";
import { isValidPhoneNumber } from "libphonenumber-js";
import Enrollment from "../courses/enrollments/enrollment.model.js";

const studentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,

      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid Email.",
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: isValidPhoneNumber,
        message: "Invalid phone number",
      },
    },

    enrollments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enrollment",
        required: [true, "Enrollment is required"],
      },
    ],
  },
  { timestamps: true },
);

studentSchema.pre("findOneAndDelete", async function () {
  const studentId = this.getFilter()?._id;
  if (!studentId) return;

  await Enrollment.deleteMany({ student: studentId });
});

export default mongoose.model("Student", studentSchema);
