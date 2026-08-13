import Resume from "../models/Resume.model.js";

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-rawText")
      .sort({ createdAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    next(err);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    res.status(200).json(resume);
  } catch (err) {
    next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    res.status(200).json({ message: "Resume deleted." });
  } catch (err) {
    next(err);
  }
};