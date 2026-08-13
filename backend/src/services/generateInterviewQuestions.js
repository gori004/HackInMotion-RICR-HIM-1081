const grokClient = require("../config/grokClient");
const { QUESTION_GEN_SYSTEM_PROMPT } = require("../prompts/interviewQuestions");
async function generateSplitInterviewQuestions(resumeData, jdData) {
  const [techRes, behRes] = await Promise.all([
    grokClient.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: TECHNICAL_QUESTION_PROMPT },
        { role: "user", content: JSON.stringify({ resumeData, jdData }) },
      ],
    }),
    grokClient.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: BEHAVIORAL_QUESTION_PROMPT },
        { role: "user", content: JSON.stringify({ resumeData, jdData }) },
      ],
    }),
  ]);

  return {
    technicalQuestions: JSON.parse(techRes.choices[0].message.content)
      .technicalQuestions,
    behavioralQuestions: JSON.parse(behRes.choices[0].message.content)
      .behavioralQuestions,
  };
}

module.exports = {
  generateInterviewQuestions,
  generateSplitInterviewQuestions,
};
async function generateInterviewQuestions(resumeData, jdData) {
  const response = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: QUESTION_GEN_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify({ resumeData, jdData }) },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateInterviewQuestions };
