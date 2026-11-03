const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, uppercase: true },
  studentName: { type: String, required: true },
  year: { type: String, enum: ['1st', '2nd', '3rd'], required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  date: { type: String, required: true },
  period: { type: Number, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  checkInTime: { type: Date, default: Date.now }
});

attendanceSchema.index({ rollNo: 1, date: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
