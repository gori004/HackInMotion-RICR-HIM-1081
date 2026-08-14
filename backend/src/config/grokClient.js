<<<<<<< HEAD
async function fastCompletion(
  grokClient,
  { systemPrompt, userContent, maxTokens = 500 },
) {
  return grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    max_tokens: maxTokens,
    temperature: 0.3,
  });
}

module.exports = { fastCompletion };
=======
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY;

export const grokClient = new OpenAI({
  apiKey: apiKey || "placeholder-key",
  baseURL: process.env.GROQ_API_KEY 
    ? "https://api.groq.com/openai/v1" 
    : "https://api.x.ai/v1",
});

export default grokClient;
>>>>>>> db547be63a4a57e12ab8140ef03b9c95bf81e59f
