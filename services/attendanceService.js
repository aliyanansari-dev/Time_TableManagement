/**
 * Attendance & QR Check-in Service Module
 */

class AttendanceService {
  generateQrCode(slotId, year, period) {
    const timeWindowMinutes = 15;
    const expiresAt = new Date(Date.now() + timeWindowMinutes * 60 * 1000);
    const code = `QR-${slotId}-${Date.now().toString(36).toUpperCase()}`;

    return {
      code,
      slotId,
      year,
      period,
      expiresAt: expiresAt.toISOString(),
      validForMinutes: timeWindowMinutes
    };
  }

  calculateStudentAttendancePercentage(totalSessions, attendedSessions) {
    if (totalSessions === 0) return 100;
    const pct = Math.round((attendedSessions / totalSessions) * 100);
    return {
      percentage: pct,
      isLowAttendance: pct < 75,
      warningMsg: pct < 75 ? `Warning: Attendance is ${pct}% (Below 75% threshold)` : null
    };
  }
}

module.exports = new AttendanceService();
