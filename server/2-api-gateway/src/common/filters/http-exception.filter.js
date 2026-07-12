export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  const isDev = process.env.NODE_ENV === "development";
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(isDev && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};