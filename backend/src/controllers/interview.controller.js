import InterviewSession from "../models/InterviewSession.model.js";

// Commit 16
export const startInterview = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required to start a session." });
    }

    const session = await InterviewSession.create({
      user: req.user._id,
      resume: resumeId || undefined,
      jobDescription: jobDescriptionId || undefined,
      questions: questions.map((q) => ({ question: q.question, type: q.type, answer: "" })),
      status: "in_progress",
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};


export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionIndex, answer, feedback } = req.body;

    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Interview session not found." });

    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      return res.status(400).json({ message: "Invalid question index." });
    }

    session.questions[questionIndex].answer = answer;
    if (feedback) session.questions[questionIndex].feedback = feedback;

    await session.save();
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};
