import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Couse is required"],
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: [true, "Resource is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    page: {
      type: Number,
      min: [0, "Page must be a non-negative integer"],
    },
    unit: {
      type: Number,
      min: [0, "Unit must be a non-negative integer"],
    },
    note: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lesson", lessonSchema);
