const mongoose = require('mongoose');

const timetableVersionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  session: {
    type: String,
    default: 'Self Finance (2026-27)'
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    default: 'Engr. HOD CIT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimetableVersion', timetableVersionSchema);
