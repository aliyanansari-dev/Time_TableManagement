const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { checkPermission } = require('../middleware/rbacMiddleware');
const exportService = require('../services/exportService');
const Substitution = require('../models/Substitution');
const Student = require('../models/Student');

// User Management: Get registered students
router.get('/users', checkPermission('manage:users'), async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await Student.find().sort({ registeredAt: -1 });
      return res.json(users);
    }
    res.json([]);
  } catch (err) {
    next(err);
  }
});

// Full DB Snapshot Backup API
router.get('/backup', checkPermission('manage:users'), async (req, res, next) => {
  try {
    const students = mongoose.connection.readyState === 1 ? await Student.find() : [];
    const subs = mongoose.connection.readyState === 1 ? await Substitution.find() : [];
    res.json({
      timestamp: new Date().toISOString(),
      institution: 'GCT Bhakkar DAE CIT Department',
      students,
      substitutions: subs
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
