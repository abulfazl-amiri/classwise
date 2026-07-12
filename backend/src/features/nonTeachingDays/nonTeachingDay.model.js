import mongoose from "mongoose";

const nonTeachingDaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      set: (value) => {
        const d = new Date(value);
        d.setUTCHours(0, 0, 0, 0);
        return d;
      },
      validate: {
        validator: (value) => !isNaN(value),
        message: "Invalid date",
      },
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required"],
      },
    ],
    reason: {
      type: String,
      enum: ["holiday", "cancellation"],
      required: [true, "Reason is required"],
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

nonTeachingDaySchema.index({ date: 1, courses: 1 }, { unique: true });

export default mongoose.model("NonTeachingDay", nonTeachingDaySchema);
