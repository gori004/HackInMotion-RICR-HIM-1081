import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY in your .env file.');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generic wrapper for Groq chat completions.
 * Specific features (resume match, interview questions, answer feedback)
 * should build their prompts and call this helper rather than
 * instantiating their own client.
 */
export const askAI = async ({
  systemPrompt,
  userPrompt,
  messages,
  model = 'llama-3.3-70b-versatile',
  temperature = 0.2,
  jsonMode = false,
}) => {
  // Allow either a pre-built messages array OR system+user prompt strings
  const formattedMessages =
    messages && messages.length > 0
      ? messages
      : [
          { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
          { role: 'user', content: userPrompt || 'Analyze the resume.' },
        ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model,
      temperature,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response received from Groq AI.');
    }

    return content;
  } catch (err) {
    console.error('[groq.service] AskAI Error:', err.message);
    throw new Error(AI Analysis Failed: ${err.message});
  }
};