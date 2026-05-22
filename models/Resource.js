import mongoose, { Schema } from "mongoose";

const resourceSchema = mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      lowercase: true,
      enum: [
        "beginner",
        "pre-intermediate",
        "intermediate",
        "upper-intermediate",
        "advanced",
        "general",
      ],
      trim: true,
    },
    edition: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Resource", resourceSchema);
