const grokClient = require("../config/grokClient");
const { QUESTION_GEN_SYSTEM_PROMPT } = require("../prompts/interviewQuestions");

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
