const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  events: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Webhook', webhookSchema);
