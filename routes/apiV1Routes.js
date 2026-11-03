const express = require('express');
const router = express.Router();
const exportService = require('../services/exportService');
const initialData = require('../data.js');

// Dynamic .ics Calendar Feed
router.get('/calendar/feed.ics', (req, res) => {
  const year = req.query.year || '1st';
  const ttData = year === '1st' ? initialData.timetable_1st : year === '2nd' ? initialData.timetable_2nd : initialData.timetable_3rd;

  const icsFeed = exportService.generateIcsFeed(year, ttData);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=GCT_CIT_${year}_Year_Schedule.ics`);
  res.send(icsFeed);
});

// CSV / Excel Report Builder Export
router.get('/reports/export-csv', (req, res) => {
  const csv = exportService.generateCsvReport(initialData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=GCT_CIT_Timetable_Report.csv');
  res.send(csv);
});

module.exports = router;
