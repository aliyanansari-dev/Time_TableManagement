const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^\d{2}-CIT-\d{3}$/i, 'Roll No must match format YY-CIT-XXX']
  },
  name: {
    type: String,
    default: 'CIT Student'
  },
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: true
  },
  loginCount: {
    type: Number,
    default: 1
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
