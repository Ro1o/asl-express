// middleware/errorHandler.js
module.exports = function (err, req, res, next) {
  console.error("❌ Error:", err.message);

  // Customize error status
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
};
