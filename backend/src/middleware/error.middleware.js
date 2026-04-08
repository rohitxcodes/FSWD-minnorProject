const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const isDuplicateKeyError = error.code === 11000;
  const statusCode =
    error.status || error.statusCode || (isDuplicateKeyError ? 409 : 500);
  const message = isDuplicateKeyError
    ? "Duplicate key error"
    : error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
