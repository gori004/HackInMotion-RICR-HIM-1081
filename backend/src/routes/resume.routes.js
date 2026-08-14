import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";
import {
  getMyResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// File Upload Route
router.post("/upload", protect, upload.single("resume"), uploadResume);

// CRUD Routes
router.get("/my-resumes", protect, getMyResumes);
router.get("/my-resumes/:id", protect, getResumeById);
router.delete("/my-resumes/:id", protect, deleteResume);

export default router;