import Analysis from "../models/Analysis.model.js";
import InterviewSession from "../models/InterviewSession.model.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [analyses, sessions] = await Promise.all([
      Analysis.find({ user: userId }).sort({ createdAt: 1 }).select("matchScore createdAt"),
      InterviewSession.find({ user: userId }).sort({ createdAt: 1 }).select("overallSummary status createdAt"),
    ]);

    const scoreTrend = analyses.map((a) => ({
      date: a.createdAt,
      score: a.matchScore,
    }));

    const interviewTrend = sessions
      .filter((s) => s.status === "completed" && s.overallSummary?.averageScore != null)
      .map((s) => ({
        date: s.createdAt,
        score: s.overallSummary.averageScore,
      }));

    res.status(200).json({
      totalAnalyses: analyses.length,
      totalInterviewSessions: sessions.length,
      completedInterviews: sessions.filter((s) => s.status === "completed").length,
      averageMatchScore: analyses.length
        ? Math.round(analyses.reduce((sum, a) => sum + a.matchScore, 0) / analyses.length)
        : null,
      scoreTrend,
      interviewTrend,
    });
  } catch (err) {
    next(err);
  }
};