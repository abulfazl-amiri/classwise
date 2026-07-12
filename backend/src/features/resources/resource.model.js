import mongoose, { Schema } from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
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
      required: [true, "Total pages is required"],
      min: [1, "Total pages must be an integer greater than 0"],
    },

    totalUnits: {
      type: Number,
      required: [true, "Total Chapters is required"],
      min: [1, "Total units must be an integer greater than 0"],
    },
    level: {
      type: String,
      lowercase: true,
      required: [true, "Level is required"],
      enum: ["beginner", "pre-intermediate", "intermediate", "upper-intermediate", "advanced"],
      trim: true,
    },
    edition: {
      type: Number,
      min: [0, "Edition can not be less than 0"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Resource", resourceSchema);
