import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { startInterview, submitAnswer, completeInterview } from "../controllers/interview.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { startInterviewSchema, submitAnswerSchema, completeInterviewSchema } from "../validators/interview.validator.js";

const router = express.Router();

router.post("/start", protect, validate(startInterviewSchema), startInterview);
router.post("/submit-answer", protect, validate(submitAnswerSchema), submitAnswer);
router.post("/complete", protect, validate(completeInterviewSchema), completeInterview);

export default router;