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