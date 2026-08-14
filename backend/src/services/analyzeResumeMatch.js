// backend/src/services/analyzeResumeMatch.js
import grokClient from "../config/grokClient.js";
import { ATS_SYSTEM_PROMPT } from "../prompts/atsExtraction.js";
import { JD_SYSTEM_PROMPT } from "../prompts/jdSkillCategorization.js";

// Helper to strip markdown code fences like ```json ... ```
if (!resumeText?.trim() || !jobDescriptionText?.trim()) {
  throw new Error("Resume text and job description text must not be empty.");
}
function parseCleanJson(text) {
  if (!text) return {};
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function analyzeResumeMatch(resumeText, jobDescriptionText) {
  const targetModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const resumeExtraction = await grokClient.chat.completions.create({
    model: targetModel,
    messages: [
      { role: "system", content: ATS_SYSTEM_PROMPT },
      { role: "user", content: resumeText },
    ],
  });

  const jdExtraction = await grokClient.chat.completions.create({
    model: targetModel,
    messages: [
      { role: "system", content: JD_SYSTEM_PROMPT },
      { role: "user", content: jobDescriptionText },
    ],
  });

  // Safely parse JSON even if the model wraps output in markdown code blocks
  const resumeData = parseCleanJson(
    resumeExtraction.choices[0].message.content,
  );
  const jdData = parseCleanJson(jdExtraction.choices[0].message.content);

  // Compute Skill Matches & Gap
  const resumeSkills = new Set([
    ...(resumeData.hardSkills || []).map((s) => s.toLowerCase()),
    ...(resumeData.softSkills || []).map((s) => s.toLowerCase()),
  ]);

  const mustHave = jdData.mustHaveSkills || [];
  const missingKeywords = mustHave.filter(
    (skill) => !resumeSkills.has(skill.toLowerCase()),
  );

  const totalRequired = mustHave.length || 1;
  const matchedCount = totalRequired - missingKeywords.length;
  const matchScore = Math.round((matchedCount / totalRequired) * 100);

  return {
    matchScore,
    resumeData,
    jdData,
    keywordGap: {
      missingKeywords,
      matchedCount,
      totalRequired,
    },
  };
}
