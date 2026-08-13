import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import resumeCrudRoutes from "./routes/resumeCrud.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app = express();


// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies or authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(express.json());




// Sample Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is initialized in app.js" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeCrudRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);


app.use(notFound);
app.use(errorHandler);

// Export app for server.js (or test suites like Supertest)
export default app;
