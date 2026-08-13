import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import resumeCrudRoutes from "./routes/resumeCrud.routes.js";

dotenv.config();

const app = express();
const analysisRoutes = require("./routes/analysis");

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies or authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);

// Sample Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is initialized in app.js" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeCrudRoutes);


// 404 handler (Must be placed AFTER all valid routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler — converts thrown errors to JSON instead of HTML
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error." });
});

// Export app for server.js (or test suites like Supertest)
export default app;
