/**
 * Export & Report Generator Service Module
 * Handles .ics calendar feeds, CSV/Excel report building, and PDF accreditation reports.
 */

class ExportService {
  generateIcsFeed(year, timetableData) {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GCT Bhakkar CIT Academic Platform//EN\n";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    days.forEach(day => {
      const slots = timetableData[day] || [];
      slots.forEach(slot => {
        ics += "BEGIN:VEVENT\n";
        ics += `SUMMARY:${slot.subject} - ${slot.teacher}\n`;
        ics += `LOCATION:${slot.room}\n`;
        ics += `DESCRIPTION:DAE CIT ${year} Year Afternoon Shift Lecture\n`;
        ics += "END:VEVENT\n";
      });
    });

    ics += "END:VCALENDAR";
    return ics;
  }

  generateCsvReport(dataset) {
    let csv = "Year,Day,Period,Subject,Teacher,Room\n";
    ['1st', '2nd', '3rd'].forEach(y => {
      const tt = dataset[`timetable_${y}`] || {};
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(d => {
        (tt[d] || []).forEach(s => {
          csv += `"${y} Year","${d}","Lec ${s.period}","${s.subject}","${s.teacher}","${s.room}"\n`;
        });
      });
    });
    return csv;
  }
}

module.exports = new ExportService();
