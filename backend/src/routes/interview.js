const express = require("express");
const router = express.Router();
const {
  generateSplitInterviewQuestions,
} = require("../services/generateInterviewQuestions");
const { evaluateAnswer } = require("../services/evaluateAnswer");
const {
  generateInterviewSummary,
} = require("../services/generateInterviewSummary");

router.post("/questions", async (req, res) => {
  try {
    const { resumeData, jdData } = req.body;
    const questions = await generateSplitInterviewQuestions(resumeData, jdData);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/evaluate", async (req, res) => {
  try {
    const { question, answerText } = req.body;
    const feedback = await evaluateAnswer(question, answerText);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/summary", async (req, res) => {
  try {
    const { sessionQA } = req.body;
    const summary = await generateInterviewSummary(sessionQA);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
