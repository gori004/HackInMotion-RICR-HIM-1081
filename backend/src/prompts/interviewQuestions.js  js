const TECHNICAL_QUESTION_PROMPT = `
You are a technical interviewer.
Given resume and JD data, generate exactly 3 technical questions that test
hands-on knowledge of the candidate's listed skills and the role's must-have skills.

Return ONLY valid JSON:
{ "technicalQuestions": [{ "id": number, "question": string, "skillTested": string }] }
`;

const BEHAVIORAL_QUESTION_PROMPT = `
You are a behavioral interviewer.
Given resume and JD data, generate exactly 2 behavioral questions (STAR-style)
relevant to the seniority level and responsibilities of the role.

Return ONLY valid JSON:
{ "behavioralQuestions": [{ "id": number, "question": string, "competency": string }] }
`;

module.exports = { QUESTION_GEN_SYSTEM_PROMPT, TECHNICAL_QUESTION_PROMPT, BEHAVIORAL_QUESTION_PROMPT };