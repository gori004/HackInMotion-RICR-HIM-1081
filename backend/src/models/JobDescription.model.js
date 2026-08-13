import mongoose from "mongoose";

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    roleTitle: { type: String, required: true, trim: true },
    rawText: { type: String, required: true },
    extractedKeywords: {
      hardSkills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
      mustHave: { type: [String], default: [] },
      niceToHave: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobDescription", jobDescriptionSchema);