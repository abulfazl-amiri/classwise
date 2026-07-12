import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },

    fee: {
      type: Number,
      required: [true, "fee is required"],
      min: [0, "Fee must be a non-negative number"],
    },
    currencyCode: {
      type: String,
      required: [true, "Currency code is required"],
      trim: true,
      enum: ["AFN", "USD", "EUR", "GBP", "CAD", "AUD", "INR", "PKR", "IRR"],
    },

    discount: {
      type: Number,
      min: [0, "Discount must within [0-100]"],
      max: [100, "Discount cannot exceed [0-100]"],
      default: 0,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Enrollment", enrollmentSchema);
