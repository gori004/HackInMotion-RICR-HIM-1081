import app from './src/app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;


// Connect Database & Start Server

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  