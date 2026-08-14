import api from "./api";

// 1️⃣ Start a new interview session
export const startInterview = async (config) => {
  const { data } = await api.post("/interview/start", {
    jobTitle: config.role || config.jobTitle || "Full Stack Developer",
    resumeText: config.resumeText || "",
    jobDescription: config.jobDescription || config.topic || "",
    difficulty: config.difficulty || "mid",
    questionCount: config.questionCount || 5,
  });
  return data;
};

// 2️⃣ Submit an answer for evaluation
export const submitAnswer = async (sessionId, { questionIndex, question, answerText, answer }) => {
  const { data } = await api.post("/interview/submit-answer", {
    sessionId,
    questionIndex,
    question: question || "",
    answer: answerText || answer || "",
  });
  return data;
};

// 3️⃣ Complete session & generate AI summary
export const completeInterview = async (sessionId) => {
  const { data } = await api.post("/interview/complete", { sessionId });
  return data;
};

// Alias for backward compatibility with older components
export const getInterviewSummary = completeInterview;