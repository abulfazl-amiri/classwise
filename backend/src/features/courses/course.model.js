import mongoose, { Schema } from "mongoose";
import { ALLOWED_CURRENCY_CODES } from "../../config/constants.js";
import Enrollment from "./enrollments/enrollment.model.js";
import Lesson from "./lessons/lesson.model.js";
import Timetable from "./timetable/timetable.model.js";

const courseSchema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    name: {
      type: Schema.Types.String,
      required: [true, "Name is required"],
      trim: true,
    },
    subject: {
      type: Schema.Types.String,
      required: [true, "Subject is required"],
      trim: true,
    },

    fee: {
      type: Number,
      required: [true, "Fee is required"],
      min: [0, "Fee must be a non-negative number"],
    },
    currencyCode: {
      type: String,
      required: [true, "Currency code is required"],
      trim: true,
      enum: ALLOWED_CURRENCY_CODES,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Teacher is required"],
      },
    ],
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
        required: [true, "Resource is required"],
      },
    ],
    enrollments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
        required: [true, "Enrollment is required"],
      },
    ],
  },
  { timestamps: true },
);

courseSchema.pre("findOneAndDelete", async function () {
  const courseId = this.getFilter()?._id;
  if (!courseId) return;

  await Promise.all([
    Lesson.deleteMany({ course: courseId }),
    Timetable.deleteMany({ course: courseId }),
    Enrollment.deleteMany({ course: courseId }),
  ]);
});

export default mongoose.model("Course", courseSchema);
