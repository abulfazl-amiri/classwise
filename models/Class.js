import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: Schema.Types.String,
    required: [true, "Name is required"],
  },
  subject: {
    type: Schema.Types.String,
    required: [true, "Subject is required"],
  },
  book: {
    type: Schema.Types.String,
    required: [true, "Book is required"],
  },
  lastTaughtDate: {
    type: Schema.Types.Date,
  },

  totalPages: {
    type: Schema.Types.Int32,
    required: [true, "Page is required"],
  },
  currentPage: {
    type: Schema.Types.Int32,
    default: 0,
  },
  totalChapters: {
    type: Schema.Types.Int32,
    required: [true, "Total Chapters is required"],
  },
  currentChapter: {
    type: Schema.Types.Int32,
    default: 0,
  },

  students: {
    type: Schema.Types.Int32,
    default: 0,
  },
});

export default mongoose.model("Class", classSchema);
