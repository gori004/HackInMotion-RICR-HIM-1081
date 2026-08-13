export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error("[Global Error Handler]", err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({ message: `${field} already exists.` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error." });
};