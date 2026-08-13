import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { startInterview, submitAnswer, completeInterview } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/submit-answer", protect, submitAnswer);
router.post("/complete", protect, completeInterview);

export default router;