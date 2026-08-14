import Analysis from "../models/Analysis.model.js";
import InterviewSession from "../models/InterviewSession.model.js";
import Resume from "../models/Resume.model.js"; // Ensures Resume model is registered
import JobDescription from "../models/JobDescription.model.js"; // Ensures JobDescription model is registered

export const getAnalysisHistory = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .populate("resume", "fileName")
      .populate("jobDescription", "roleTitle")
      .sort({ createdAt: -1 });

    res.status(200).json(analyses);
  } catch (err) {
    next(err);
  }
};

export const getInterviewHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .populate("resume", "fileName")
      .populate("jobDescription", "roleTitle")
      .select("-questions.feedback.comment") // keep list view light; full detail via a future :id route
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
};