import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is initialized in app.js' });
});

// Export app for server.js (or test suites like Supertest)
export default app;