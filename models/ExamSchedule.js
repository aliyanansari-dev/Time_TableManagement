const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  examType: { type: String, enum: ['Mid-Term', 'Final Exam', 'Practical Exam'], default: 'Mid-Term' },
  subject: { type: String, required: true },
  year: { type: String, enum: ['1st', '2nd', '3rd'], required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  invigilator: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
