import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getAnalysisHistory, getInterviewHistory } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/analyses", protect, getAnalysisHistory);
router.get("/interviews", protect, getInterviewHistory);

export default router;