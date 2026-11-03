const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  year: { type: String, required: true },
  absentTeacher: { type: String, required: true },
  substituteTeacher: { type: String, default: 'TBA' },
  subject: { type: String, required: true },
  room: { type: String, required: true },
  status: { type: String, enum: ['pending', 'assigned', 'tba'], default: 'tba' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Substitution', substitutionSchema);
