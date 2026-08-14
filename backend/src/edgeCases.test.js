const { analyzeResumeMatch } = require("../services/analyzeResumeMatch");
const { evaluateAnswer } = require("../services/evaluateAnswer");

async function testEmptyJobDescription() {
  try {
    await analyzeResumeMatch("Some resume text", "");
    console.log("FAIL: empty JD should have thrown or returned a safe default");
  } catch (err) {
    console.log("PASS: empty JD handled ->", err.message);
  }
}

async function testShortAnswer() {
  const result = await evaluateAnswer(
    "Tell me about a challenge you faced.",
    "idk",
  );
  const isLowScore = result.rubric.clarity <= 3 && result.rubric.relevance <= 3;
  console.log(
    isLowScore
      ? "PASS: short answer scored appropriately low"
      : "FAIL: short answer scored too high",
  );
}

async function testEmptyResume() {
  try {
    await analyzeResumeMatch("", "Some JD text");
    console.log(
      "FAIL: empty resume should have thrown or returned a safe default",
    );
  } catch (err) {
    console.log("PASS: empty resume handled ->", err.message);
  }
}

(async () => {
  await testEmptyJobDescription();
  await testShortAnswer();
  await testEmptyResume();
})();
