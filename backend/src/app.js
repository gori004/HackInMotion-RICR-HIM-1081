import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // 1. Import cookie-parser

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.middleware.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


dotenv.config();

const app = express();

// 2. Enable CORS with credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Required for cookies!
  })
);

app.use(express.json());
app.use(cookieParser()); // 3. Use cookie-parser middleware

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is initialized in app.js" });
});

// Mounted API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;