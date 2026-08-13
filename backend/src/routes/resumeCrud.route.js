import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyResumes, getResumeById, deleteResume } from "../controllers/resumeCrud.controller.js";

const router = express.Router();

router.get("/my-resumes", protect, getMyResumes);
router.get("/my-resumes/:id", protect, getResumeById);
router.delete("/my-resumes/:id", protect, deleteResume);

export default router;