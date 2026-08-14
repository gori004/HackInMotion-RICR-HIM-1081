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
import helmet from "helmet";





dotenv.config();

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.CLIENT_URL,  // deployed frontend, set in .env / Render dashboard
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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