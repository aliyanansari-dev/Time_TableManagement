export interface Period {
  num: number | string;
  label: string;
  time: string;
  start?: string;
  end?: string;
  isBreak?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
}

export interface YearInfo {
  id: string;
  title: string;
  code: string;
  badgeColor: string;
}

export interface TimetableSlot {
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

export type WeeklyTimetable = Record<string, TimetableSlot[]>;

export interface Announcement {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  pinned?: boolean;
  content: string;
}

export interface StudentUser {
  role: 'student';
  rollNo: string;
  name: string;
  year: string;
  loginCount?: number;
  lastLoginAt?: string;
}

export interface StaffUser {
  role: 'admin' | 'faculty' | 'hod' | 'teacher';
  name: string;
  email: string;
}

export type CurrentUser = StudentUser | StaffUser | null;

export interface InstitutionInfo {
  college: string;
  department: string;
  program: string;
  session: string;
  shift: string;
  wef: string;
  signatories: {
    incharge: string;
    hod: string;
    academic: string;
  };
}

export interface Dataset {
  institution: InstitutionInfo;
  fridayPeriods: Period[];
  periods: Period[];
  periods_1st: Period[];
  days: string[];
  version: string;
  years: YearInfo[];
  teachers: Teacher[];
  rooms: string[];
  timetable_1st: WeeklyTimetable;
  timetable_2nd: WeeklyTimetable;
  timetable_3rd: WeeklyTimetable;
  announcements: Announcement[];
  sampleStudents: Array<{ rollNo: string; name: string; year: string }>;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
