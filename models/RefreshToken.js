import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
