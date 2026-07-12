import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From is required"],
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "To is required"],
    },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expires at is required"],
    },
  },
  { timestamps: true },
);

inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Invite", inviteSchema);
