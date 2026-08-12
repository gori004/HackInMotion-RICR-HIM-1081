const grokClient = require("../config/grokClient");
const { ATS_SYSTEM_PROMPT } = require("../prompts/atsExtraction");
const { JD_SYSTEM_PROMPT } = require("../prompts/jdSkillCategorization");

async function analyzeResumeMatch(resumeText, jobDescriptionText) {
  const resumeExtraction = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: ATS_SYSTEM_PROMPT },
      { role: "user", content: resumeText },
    ],
  });

  const jdExtraction = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: JD_SYSTEM_PROMPT },
      { role: "user", content: jobDescriptionText },
    ],
  });

  return {
    resumeData: JSON.parse(resumeExtraction.choices[0].message.content),
    jdData: JSON.parse(jdExtraction.choices[0].message.content),
  };
}

module.exports = { analyzeResumeMatch };
