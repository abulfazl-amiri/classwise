import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
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

    resources: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: [true, "Resource is required"],
        },

        currentPage: {
          type: Number,
          default: 0,
          min: [0, "Current page can not be less than 0"],
        },

        currentUnit: {
          type: Number,
          default: 0,
          min: [0, "Current unit can not be less than 0"],
        },
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
    lastLesson: {
      date: {
        type: Schema.Types.Date,
        required: [true, "Date is required for last lesson"],
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

    students: {
      type: Number,
      default: 0,
      min: [0, "Students can not be less than 0"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Class", classSchema);
