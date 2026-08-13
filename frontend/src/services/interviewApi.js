import api from "./api";

export const startInterview = async ({ role, topic, difficulty, questionCount }) => {
  const { data } = await api.post("/interviews", { role, topic, difficulty, questionCount });
  return data; // { interviewId, question, questionIndex, totalQuestions, category }
};

export const submitAnswer = async (interviewId, { questionIndex, answerText }) => {
  const { data } = await api.post(`/interviews/${interviewId}/answers`, {
    questionIndex,
    answerText,
  });
  return data; // { feedback, nextQuestion, isComplete }
};

export const getInterviewSummary = async (interviewId) => {
  const { data } = await api.get(`/interviews/${interviewId}/summary`);
  return data; // { overallScore, strengths, improvements, perQuestionBreakdown }
};

export const getInterviewHistory = async () => {
  const { data } = await api.get("/interviews/history");
  return data;
};