const grokClient = require("../config/grokClient");
const { SUMMARY_SYSTEM_PROMPT } = require("../prompts/interviewSummary");

async function generateInterviewSummary(sessionQA) {
  const response = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(sessionQA) },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateInterviewSummary };
