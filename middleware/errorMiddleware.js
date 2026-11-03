/**
 * Centralized Error Handling Middleware
 */

const logger = require('../config/logger');

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const requestId = req.requestId || 'req-' + Date.now();

  logger.error(err.message || 'Internal Server Error', {
    requestId,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    requestId,
    error: err.message || 'An unexpected error occurred on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorMiddleware;
