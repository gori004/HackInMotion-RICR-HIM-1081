import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);

    // Log index status for key collections — helps catch missing indexes before deploy
    const collections = ["users", "resumes", "analyses", "interviewsessions"];
    for (const name of collections) {
      const exists = await conn.connection.db.listCollections({ name }).hasNext();
      if (exists) {
        const indexes = await conn.connection.db.collection(name).indexes();
        console.log(`[db] Indexes on '${name}':`, indexes.map((i) => i.name).join(", "));
      }
    }
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;