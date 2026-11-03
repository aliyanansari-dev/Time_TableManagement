/**
 * Structured Logging Module with Request ID Tracing
 */

const logger = {
  info: (msg, meta = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message: msg, ...meta }));
  },
  warn: (msg, meta = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', message: msg, ...meta }));
  },
  error: (msg, meta = {}) => {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'ERROR', message: msg, ...meta }));
  }
};

module.exports = logger;
