import mongoose from "mongoose";

const dayField = {
  topics: [
    {
      type: String,
      trim: true,
    },
  ],
  startTime: {
    type: Number,
    min: [0, "Start time cannot be less than 0 (00:00)"],
    max: [1439, "Start time cannot exceed 1439 (23:59)"],
  },
  endTime: {
    type: Number,
    min: [0, "End time cannot be less than 0 (00:00)"],
    max: [1439, "End time cannot exceed 1439 (23:59)"],
  },
  isTeachingDay: {
    type: Boolean,
    default: true,
  },
};

const timetableSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    sunday: dayField,
    monday: dayField,
    tuesday: dayField,
    wednesday: dayField,
    thursday: dayField,
    friday: dayField,
    saturday: dayField,
  },
  { timestamps: true },
);

timetableSchema.index({ course: 1 }, { unique: true });

export default mongoose.model("Timetable", timetableSchema);
