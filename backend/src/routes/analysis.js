const express = require("express");
const router = express.Router();
const { analyzeResumeMatch } = require("../services/analyzeResumeMatch");

router.post("/match", async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;
    if (!resumeText || !jobDescriptionText) {
      return res
        .status(400)
        .json({ error: "resumeText and jobDescriptionText are required" });
    }
    const result = await analyzeResumeMatch(resumeText, jobDescriptionText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
