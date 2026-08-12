import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI in your .env file.");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("[db] Using existing MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Modern mongoose (6+) doesn't need useNewUrlParser/useUnifiedTopology,
      // but keeping options object here in case you add more later.
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[db] MongoDB disconnected.");
  isConnected = false;
});

export default connectDB;