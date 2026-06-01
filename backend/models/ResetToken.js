import mongoose, { Schema } from "mongoose";

const resetTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
      required: [true, "reset token is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    expiresAt: {
      type: Date,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ResetToken", resetTokenSchema);
