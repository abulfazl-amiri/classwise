import mongoose from "mongoose";

const resourceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    author: {
      type: String,
      trim: true,
      required: [true, "Author is required"],
    },

    totalPages: {
      type: Number,
      required: [true, "Page is required"],
      min: [0, "Total pages can not be less than 0"],
    },

    totalUnits: {
      type: Number,
      required: [true, "Total Chapters is required"],
      min: [0, "Total units can not be less than 0"],
    },
    level: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Resource", resourceSchema);
