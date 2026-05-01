import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema({
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
    type: Schema.Types.String,
    trim: true,
  },
  endTime: {
    type: Schema.Types.String,
    trim: true,
  },

  lastTaughtDate: {
    type: Schema.Types.Date,
  },

  students: {
    type: Number,
    default: 0,
    min: [0, "Students can not be less than 0"],
  },
});

export default mongoose.model("Class", classSchema);
