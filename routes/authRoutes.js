const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const logger = require('../config/logger');

// In-memory cache fallback for unit testing and offline execution
const memoryStudents = new Map();

// Student Login & MongoDB Database Persistence
router.post('/student-login', async (req, res, next) => {
  try {
    const { rollNo, name, year: inputYear } = req.body;

    // 1. Validation: Required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Student Full Name is required.',
        message: 'Student Full Name is required.'
      });
    }

    if (!rollNo || typeof rollNo !== 'string' || !rollNo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'CIT Roll Number is required.',
        message: 'CIT Roll Number is required.'
      });
    }

    const formattedName = name.trim();
    let formattedRoll = rollNo.trim().toUpperCase();

    // Auto-complete roll numbers given as digits (e.g. "136" -> "26-CIT-136")
    if (/^\d{1,3}$/.test(formattedRoll)) {
      formattedRoll = `26-CIT-${formattedRoll.padStart(3, '0')}`;
    }

    // 2. Validate Roll No Format: YY-CIT-XXX
    const rollRegex = /^\d{2}-CIT-\d{3}$/i;
    if (!rollRegex.test(formattedRoll)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Roll No format. Expected format: YY-CIT-XXX (e.g. 26-CIT-105)',
        message: 'Invalid Roll No format. Expected format: YY-CIT-XXX (e.g. 26-CIT-105)'
      });
    }

    // 3. Determine Academic Year
    let year = inputYear;
    if (formattedRoll.startsWith('26')) year = '1st';
    else if (formattedRoll.startsWith('25')) year = '2nd';
    else if (formattedRoll.startsWith('24')) year = '3rd';
    else if (!year) year = '1st';

    const isDbConnected = mongoose.connection.readyState === 1;

    // 4. Check existing record
    let existingStudent = null;
    if (isDbConnected) {
      existingStudent = await Student.findOne({ rollNo: formattedRoll });
    } else {
      existingStudent = memoryStudents.get(formattedRoll);
    }

    if (existingStudent) {
      // Compare entered name against stored name (case-insensitive, trimmed)
      const storedName = (existingStudent.name || '').trim().toLowerCase();
      const incomingName = formattedName.toLowerCase();

      if (storedName !== incomingName) {
        return res.status(400).json({
          success: false,
          error: 'This Roll No is already registered under a different name.',
          message: 'This Roll No is already registered under a different name.'
        });
      }

      // Name matches -> update lastLoginAt and increment loginCount
      let updatedUser = null;
      if (isDbConnected) {
        existingStudent.lastLoginAt = new Date();
        existingStudent.loginCount = (existingStudent.loginCount || 1) + 1;
        existingStudent.year = year;
        await existingStudent.save();
        updatedUser = {
          role: 'student',
          rollNo: existingStudent.rollNo,
          name: existingStudent.name,
          year: existingStudent.year
        };
        logger.info(`💾 [MONGODB LOGIN] Returning student authenticated: ${existingStudent.name} (${existingStudent.rollNo})`);
      } else {
        existingStudent.lastLoginAt = new Date();
        existingStudent.loginCount = (existingStudent.loginCount || 1) + 1;
        existingStudent.year = year;
        memoryStudents.set(formattedRoll, existingStudent);
        updatedUser = {
          role: 'student',
          rollNo: existingStudent.rollNo,
          name: existingStudent.name,
          year: existingStudent.year
        };
      }

      return res.status(200).json({
        success: true,
        dbSaved: isDbConnected,
        isNew: false,
        message: 'Student authenticated successfully.',
        user: updatedUser
      });
    } else {
      // 5. New Student Registration
      let newUser = null;
      if (isDbConnected) {
        const doc = await Student.create({
          rollNo: formattedRoll,
          name: formattedName,
          year: year,
          loginCount: 1,
          registeredAt: new Date(),
          lastLoginAt: new Date()
        });
        newUser = {
          role: 'student',
          rollNo: doc.rollNo,
          name: doc.name,
          year: doc.year
        };
        logger.info(`💾 [MONGODB REGISTER] New student enrolled: ${doc.name} (${doc.rollNo})`);
      } else {
        const memDoc = {
          rollNo: formattedRoll,
          name: formattedName,
          year: year,
          loginCount: 1,
          registeredAt: new Date(),
          lastLoginAt: new Date()
        };
        memoryStudents.set(formattedRoll, memDoc);
        newUser = {
          role: 'student',
          rollNo: memDoc.rollNo,
          name: memDoc.name,
          year: memDoc.year
        };
      }

      return res.status(200).json({
        success: true,
        dbSaved: isDbConnected,
        isNew: true,
        message: 'Student registered and logged in successfully.',
        user: newUser
      });
    }
  } catch (err) {
    logger.error(`[AUTH ERROR] student-login failure: ${err.message}`);
    next(err);
  }
});

// Staff Login
router.post('/staff-login', (req, res) => {
  const { username, password } = req.body;
  const uname = (username && username.trim()) ? username.trim() : 'hod_cit';

  if (uname === 'teacher_cit' || uname.toLowerCase().includes('teacher')) {
    return res.json({
      success: true,
      user: { role: 'faculty', name: 'CIT Faculty Member', email: 'faculty.cit@gctbhakkar.edu.pk' }
    });
  }

  return res.json({
    success: true,
    user: { role: 'admin', name: 'Engr. HOD CIT', email: 'hod.cit@gctbhakkar.edu.pk' }
  });
});

// GET all registered students from MongoDB
router.get('/students', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const students = await Student.find().sort({ lastLoginAt: -1 });
      return res.json({ success: true, count: students.length, students });
    }
    const memList = Array.from(memoryStudents.values());
    res.json({ success: true, count: memList.length, students: memList, note: 'Serving from in-memory fallback' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
