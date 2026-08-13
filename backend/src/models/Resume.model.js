import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    parsedProfile: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      skills: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      education: { type: [String], default: [] },
      projects: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);