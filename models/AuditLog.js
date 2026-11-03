const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  year: { type: String, required: true },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  previousSlot: { type: Object },
  newSlot: { type: Object },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
