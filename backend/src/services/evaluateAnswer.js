const grokClient = require("../config/grokClient");
const { EVALUATE_ANSWER_SYSTEM_PROMPT } = require("../prompts/evaluateAnswer");

async function evaluateAnswer(question, answerText) {
  const response = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: EVALUATE_ANSWER_SYSTEM_PROMPT },
      { role: "user", content: `Question: ${question}\nAnswer: ${answerText}` },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { evaluateAnswer };
