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
import historyRoutes from "./routes/history.routes.js";
import { generalLimiter, aiLimiter, authLimiter } from "./middleware/rateLimit.middleware.js";



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

app.use("/api", generalLimiter); // applies to everything under /api


// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is initialized in app.js" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/analysis", aiLimiter, analysisRoutes);
app.use("/api/interview", aiLimiter, interviewRoutes);

// Mounted API Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);


// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;