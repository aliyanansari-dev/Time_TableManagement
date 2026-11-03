import { Dataset, WeeklyTimetable } from '../types';

export class ExportService {
  /**
   * Generates standard RFC-5545 iCalendar data
   */
  generateIcsFeed(year: string, timetableData: WeeklyTimetable, periodsContext: (year: string, day: string) => any[]): string {
    const yearTitle = `${year.toUpperCase()} Year CIT`;
    const dayMap: Record<string, string> = {
      Monday: "MO",
      Tuesday: "TU",
      Wednesday: "WE",
      Thursday: "TH",
      Friday: "FR",
      Saturday: "SA"
    };

    const baseDates: Record<string, string> = {
      Monday: "20260901",
      Tuesday: "20260902",
      Wednesday: "20260903",
      Thursday: "20260904",
      Friday: "20260905",
      Saturday: "20260906"
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//GCT Bhakkar//DAE CIT Timetable Engine//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:GCT Bhakkar CIT ${yearTitle} Timetable`,
      "X-WR-TIMEZONE:Asia/Karachi"
    ];

    days.forEach(day => {
      const slots = timetableData[day] || [];
      const dayPeriods = periodsContext(year, day);

      slots.forEach(slot => {
        const p = dayPeriods.find(item => item.num === slot.period);
        if (!p || !p.start || !p.end) return;

        const startClean = p.start.replace(':', '') + '00';
        const endClean = p.end.replace(':', '') + '00';
        const datePrefix = baseDates[day] || "20260901";
        const uid = `cit-${year}-${day}-${slot.period}-${Date.now()}@gctbhakkar.edu.pk`;

        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${datePrefix}T${startClean}Z`);
        lines.push(`DTSTART;TZID=Asia/Karachi:${datePrefix}T${startClean}`);
        lines.push(`DTEND;TZID=Asia/Karachi:${datePrefix}T${endClean}`);
        lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day] || 'MO'}`);
        lines.push(`SUMMARY:${slot.subject} (${yearTitle})`);
        lines.push(`DESCRIPTION:Instructor: ${slot.teacher}\\nPeriod: ${p.label} (${p.time})\\nShift: Afternoon Shift (12:10 PM - 05:20 PM)`);
        lines.push(`LOCATION:${slot.room}, GCT Bhakkar`);
        lines.push("STATUS:CONFIRMED");
        lines.push("END:VEVENT");
      });
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  /**
   * Generates CSV string for DAE Accreditation Report
   */
  generateCsvReport(dataset: Dataset): string {
    let csv = "Year,Day,Period,Subject,Teacher,Room\n";
    const years = ['1st', '2nd', '3rd'] as const;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    years.forEach(y => {
      const key = `timetable_${y}` as keyof Dataset;
      const tt = (dataset[key] as WeeklyTimetable) || {};
      days.forEach(d => {
        (tt[d] || []).forEach(s => {
          csv += `"${y} Year","${d}","Lec ${s.period}","${s.subject}","${s.teacher}","${s.room}"\n`;
        });
      });
    });

    return csv;
  }

  downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();
