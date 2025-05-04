import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    totalEnrolled: {
      type: Number,
      default: 0,
    },
    completionRates: {
      type: Number,
      default: 0, // Percentage of students who completed the course
    },
    mostActiveStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
