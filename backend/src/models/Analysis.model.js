import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescription: { type: mongoose.Schema.Types.ObjectId, ref: "JobDescription", required: true },
    matchScore: { type: Number, min: 0, max: 100, required: true },
    missingKeywords: { type: [String], default: [] },
    weakKeywords: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);