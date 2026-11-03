const mongoose = require('mongoose');

const studentRosterSchema = new mongoose.Schema({
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
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('StudentRoster', studentRosterSchema);
