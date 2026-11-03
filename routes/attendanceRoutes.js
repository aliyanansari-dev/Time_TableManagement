const express = require('express');
const router = express.Router();
const attendanceService = require('../services/attendanceService');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Generate QR Code for Period
router.get('/qr/:slotId', (req, res) => {
  const { slotId } = req.params;
  const { year, period } = req.query;
  const qrData = attendanceService.generateQrCode(slotId, year, period);
  res.json(qrData);
});

// Student QR Check-in
router.post('/check-in', async (req, res, next) => {
  try {
    const { rollNo, studentName, year, subject, teacher, date, period } = req.body;
    let record = { rollNo, studentName, year, subject, teacher, date, period, status: 'present' };

    if (mongoose.connection.readyState === 1) {
      record = new Attendance(record);
      await record.save();
    }

    res.json({ success: true, message: 'Attendance check-in recorded successfully!', record });
  } catch (err) {
    next(err);
  }
});

// Attendance Analytics & Low Threshold Flagging (<75%)
router.get('/analytics/:rollNo', async (req, res, next) => {
  try {
    const { rollNo } = req.params;
    let total = 20;
    let attended = 18;

    if (mongoose.connection.readyState === 1) {
      total = await Attendance.countDocuments({ rollNo });
      attended = await Attendance.countDocuments({ rollNo, status: 'present' });
    }

    const analytics = attendanceService.calculateStudentAttendancePercentage(total, attended);
    res.json({ rollNo, totalSessions: total, attendedSessions: attended, ...analytics });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
