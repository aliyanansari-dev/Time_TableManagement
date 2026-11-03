const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Token automatically removed after 5 minutes (300 seconds)
  }
});

module.exports = mongoose.model('OtpToken', otpTokenSchema);
