export interface QrData {
  code: string;
  slotId: string;
  year: string;
  period: number;
  expiresAt: string;
  validForMinutes: number;
}

export class AttendanceService {
  generateQrCode(slotId: string, year: string, period: number): QrData {
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

  calculateStudentAttendancePercentage(totalSessions: number, attendedSessions: number) {
    if (totalSessions === 0) return { percentage: 100, isLowAttendance: false, warningMsg: null };
    const pct = Math.round((attendedSessions / totalSessions) * 100);
    return {
      percentage: pct,
      isLowAttendance: pct < 75,
      warningMsg: pct < 75 ? `Warning: Attendance is ${pct}% (Below 75% threshold)` : null
    };
  }
}

export const attendanceService = new AttendanceService();
