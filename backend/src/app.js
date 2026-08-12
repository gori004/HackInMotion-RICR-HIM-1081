import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies or authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);


// Sample Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is initialized in app.js' });
});

// Export app for server.js (or test suites like Supertest)
export default app;