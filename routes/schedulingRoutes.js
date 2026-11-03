const express = require('express');
const router = express.Router();
const schedulingService = require('../services/schedulingService');

router.post('/check-conflict', (req, res) => {
  const { year, day, period, teacher, room, dataset } = req.body;
  const result = schedulingService.checkConflicts(year, day, period, teacher, room, dataset);
  res.json(result);
});

router.post('/optimization-score', (req, res) => {
  const { dataset } = req.body;
  const score = schedulingService.calculateOptimizationScore(dataset || {});
  res.json({ score, maxScore: 100, label: score >= 85 ? 'Optimal' : 'Good' });
});

router.post('/suggest-substitute', (req, res) => {
  const { absentTeacher, subject, day, period, teachers, dataset } = req.body;
  const substitutes = schedulingService.rankSubstitutes(absentTeacher, subject, day, period, teachers || [], dataset || {});
  res.json({ success: true, substitutes });
});

router.post('/generate', (req, res) => {
  const { teachers, rooms } = req.body;
  const result = schedulingService.generateAutomatedTimetable(teachers || [], rooms || []);
  res.json(result);
});

module.exports = router;
