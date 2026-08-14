const INDUSTRY_RULES = {
  "software-engineering": {
    focusAreas: [
      "system design",
      "data structures",
      "debugging",
      "code quality",
      "CI/CD",
    ],
    tone: "precise and technical",
  },
  marketing: {
    focusAreas: [
      "campaign strategy",
      "analytics/ROI",
      "brand positioning",
      "content strategy",
      "stakeholder communication",
    ],
    tone: "persuasive and metrics-driven",
  },
  finance: {
    focusAreas: [
      "financial modeling",
      "risk analysis",
      "regulatory compliance",
      "reporting accuracy",
      "forecasting",
    ],
    tone: "formal and precision-oriented",
  },
};

function buildIndustryContext(industryKey) {
  const rules =
    INDUSTRY_RULES[industryKey] || INDUSTRY_RULES["software-engineering"];
  return `Industry focus areas: ${rules.focusAreas.join(", ")}. Expected tone: ${rules.tone}.`;
}

module.exports = { INDUSTRY_RULES, buildIndustryContext };
