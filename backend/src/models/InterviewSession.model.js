import mongoose from "mongoose";

const questionAnswerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    type: { type: String, enum: ["technical", "behavioral"], required: true },
    answer: { type: String, default: "" },
    feedback: {
      clarity: { type: Number, min: 0, max: 10 },
      relevance: { type: Number, min: 0, max: 10 },
      completeness: { type: Number, min: 0, max: 10 },
      comment: { type: String, default: "" },
    },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    jobDescription: { type: mongoose.Schema.Types.ObjectId, ref: "JobDescription" },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    questions: { type: [questionAnswerSchema], default: [] },
    overallSummary: {
      averageScore: { type: Number, default: null },
      strengths: { type: [String], default: [] },
      areasToImprove: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);