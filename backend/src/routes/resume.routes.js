import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// File Upload & Parse Routes (supports both /upload and /parse)
router.post("/upload", upload.single("resume"), uploadResume);
router.post("/parse", upload.single("resume"), uploadResume);

// CRUD Routes (Protected)
router.get("/my-resumes", protect, getMyResumes);
router.get("/my-resumes/:id", protect, getResumeById);
router.delete("/my-resumes/:id", protect, deleteResume);

export default router;