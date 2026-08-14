import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./src/config/connectDB.js";
import User from "./src/models/User.model.js";
import Resume from "./src/models/Resume.model.js";
import JobDescription from "./src/models/JobDescription.model.js";
import Analysis from "./src/models/Analysis.model.js";
import InterviewSession from "./src/models/InterviewSession.model.js";

const seed = async () => {
  await connectDB();

  console.log("Clearing existing seed-flagged data...");
  await Promise.all([
    User.deleteMany({ email: /@seed\.test$/ }),
  ]);

  console.log("Creating seed user...");
  const user = await User.create({
    name: "Seed Tester",
    email: "seed.user@seed.test",
    password: "seedpass123",
  });

  const resume = await Resume.create({
    user: user._id,
    fileName: "seed-resume.pdf",
    rawText: "Experienced full-stack developer skilled in React, Node.js, MongoDB...",
    parsedProfile: {
      name: "Seed Tester",
      email: "seed.user@seed.test",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      experience: ["2 years as a full-stack developer"],
      education: ["B.Tech in Computer Science"],
      projects: ["InterviewX", "PropVista"],
    },
  });

  const jobDescription = await JobDescription.create({
    user: user._id,
    roleTitle: "Full-Stack Developer",
    rawText: "We are looking for a Full-Stack Developer skilled in React, Node.js...",
    extractedKeywords: {
      hardSkills: ["React", "Node.js", "MongoDB", "TypeScript"],
      softSkills: ["Communication", "Teamwork"],
      mustHave: ["React", "Node.js"],
      niceToHave: ["TypeScript"],
    },
  });

  await Analysis.create({
    user: user._id,
    resume: resume._id,
    jobDescription: jobDescription._id,
    matchScore: 78,
    missingKeywords: ["TypeScript"],
    weakKeywords: ["MongoDB"],
    suggestions: ["Add a TypeScript project to your resume.", "Highlight MongoDB schema design experience."],
  });

  await InterviewSession.create({
    user: user._id,
    resume: resume._id,
    jobDescription: jobDescription._id,
    status: "completed",
    questions: [
      {
        question: "Tell me about a challenging bug you fixed.",
        type: "behavioral",
        answer: "I debugged a race condition in our upload pipeline...",
        feedback: { clarity: 8, relevance: 9, completeness: 7, comment: "Good structure, could add more detail on the fix." },
      },
    ],
    overallSummary: {
      averageScore: 8,
      strengths: ["Clear communication", "Structured answers"],
      areasToImprove: ["More technical depth"],
    },
  });

  console.log("Seed data created successfully.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});