import app from './src/app.js';
import mongoose from 'mongoose';
import connectDB from './src/config/connectDB.js';

const PORT = process.env.PORT || 5000;

connectDB();
// Connect Database & Start Server

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  