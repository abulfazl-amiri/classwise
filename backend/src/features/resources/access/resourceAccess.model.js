import mongoose, { Schema } from "mongoose";

const resourceAccessSchema = new mongoose.Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: [true, "Resource is required"],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
    grantedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Granted by is required"],
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["viewer"],
      default: "viewer",
    },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

resourceAccessSchema.index(
  { resource: 1, teacher: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

export default mongoose.model("ResourceAccess", resourceAccessSchema);
