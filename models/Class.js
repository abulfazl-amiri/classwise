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
  resources: {
    type: [String],
    required: [true, "Resources is required"],
  },

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

  totalPages: {
    type: Number,
    required: [true, "Page is required"],
    min: [0, "Total pages can not be less than 0"],
  },
  currentPage: {
    type: Number,
    default: 0,
    min: [0, "Current page can not be less than 0"],
  },
  totalChapters: {
    type: Number,
    required: [true, "Total Chapters is required"],
    min: [0, "Total chapters can not be less than 0"],
  },
  currentChapter: {
    type: Number,
    default: 0,
    min: [0, "Current chapter can not be less than 0"],
  },

  students: {
    type: Number,
    default: 0,
    min: [0, "Students can not be less than 0"],
  },
});

export default mongoose.model("Class", classSchema);
