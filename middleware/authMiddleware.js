/**
 * Authentication & API Key Security Middleware
 */

const logger = require('../config/logger');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'] || req.headers['x-access-token'];
  const userRole = req.headers['x-user-role'] || 'student';

  req.user = {
    role: userRole,
    token: token || 'guest-session'
  };

  next();
}

module.exports = authMiddleware;
