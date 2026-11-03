const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema({
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

timetableSlotSchema.index({ year: 1, day: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('TimetableSlot', timetableSlotSchema);
