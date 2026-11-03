/**
 * Production-Grade Timetable Database for DAE CIT Department
 * Government College of Technology (GCT), Bhakkar
 * Session: Self Finance (2026-27) - Revised w.e.f 14-09-26
 *
 * Afternoon Shift Timings: 12:10 PM to 05:20 PM
 * Designed & Developed by Aliyan Ansari (DAE CIT 3rd Year Student)
 */

const INITIAL_DATA = {
  institution: {
    college: "GOVERNMENT COLLEGE OF TECHNOLOGY, BHAKKAR",
    department: "Computer Information Technology (CIT)",
    program: "Diploma of Associate Engineer (DAE)",
    session: "Self Finance (2026-27)",
    shift: "Afternoon Shift (12:10 PM - 05:20 PM)",
    wef: "14-09-26",
    signatories: {
      incharge: "Time Table Incharge",
      hod: "HOD CIT",
      academic: "Academic Incharge"
    }
  },

  // Friday schedule (special start 11:10 AM, 8 lectures, longer break)
  fridayPeriods: [
    { num: 1, label: "1st Lec", time: "11:10 - 11:50", start: "11:10", end: "11:50" },
    { num: 2, label: "2nd Lec", time: "11:50 - 12:30", start: "11:50", end: "12:30" },
    { num: 3, label: "3rd Lec", time: "12:30 - 13:10", start: "12:30", end: "13:10" },
    { num: "BREAK", label: "Break / Jumma", time: "13:10 - 14:00", start: "13:10", end: "14:00", isBreak: true },
    { num: 4, label: "4th Lec", time: "14:00 - 14:40", start: "14:00", end: "14:40" },
    { num: 5, label: "5th Lec", time: "14:40 - 15:20", start: "14:40", end: "15:20" },
    { num: 6, label: "6th Lec", time: "15:20 - 16:00", start: "15:20", end: "16:00" },
    { num: 7, label: "7th Lec", time: "16:00 - 16:40", start: "16:00", end: "16:40" },
    { num: 8, label: "8th Lec", time: "16:40 - 17:20", start: "16:40", end: "17:20" }
  ],

  // Normal Monday to Thursday / Saturday schedule
  periods: [
    { num: 1, label: "1st Lec", time: "12:10 - 12:50", start: "12:10", end: "12:50" },
    { num: 2, label: "2nd Lec", time: "12:50 - 13:30", start: "12:50", end: "13:30" },
    { num: 3, label: "3rd Lec", time: "13:30 - 14:10", start: "13:30", end: "14:10" },
    { num: "BREAK", label: "Break", time: "14:10 - 14:40", start: "14:10", end: "14:40", isBreak: true },
    { num: 4, label: "4th Lec", time: "14:40 - 15:20", start: "14:40", end: "15:20" },
    { num: 5, label: "5th Lec", time: "15:20 - 16:00", start: "15:20", end: "16:00" },
    { num: 6, label: "6th Lec", time: "16:00 - 16:40", start: "16:00", end: "16:40" },
    { num: 7, label: "7th Lec", time: "16:40 - 17:20", start: "16:40", end: "17:20" },
    { num: 8, label: "8th Lec", time: "17:20 - 18:00", start: "17:20", end: "18:00" }
  ],

  // 1st Year periods — starts 40 min earlier at 11:30 AM (8 lectures before and after break)
  periods_1st: [
    { num: 1, label: "1st Lec", time: "11:30 - 12:10", start: "11:30", end: "12:10" },
    { num: 2, label: "2nd Lec", time: "12:10 - 12:50", start: "12:10", end: "12:50" },
    { num: 3, label: "3rd Lec", time: "12:50 - 13:30", start: "12:50", end: "13:30" },
    { num: 4, label: "4th Lec", time: "13:30 - 14:10", start: "13:30", end: "14:10" },
    { num: "BREAK", label: "Break", time: "14:10 - 14:40", start: "14:10", end: "14:40", isBreak: true },
    { num: 5, label: "5th Lec", time: "14:40 - 15:20", start: "14:40", end: "15:20" },
    { num: 6, label: "6th Lec", time: "15:20 - 16:00", start: "15:20", end: "16:00" },
    { num: 7, label: "7th Lec", time: "16:00 - 16:40", start: "16:00", end: "16:40" },
    { num: 8, label: "8th Lec", time: "16:40 - 17:20", start: "16:40", end: "17:20" }
  ],

  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

  version: "2026-27-v7",

  years: [
    { id: "1st", title: "1st Year CIT", code: "26-CIT", badgeColor: "blue" },
    { id: "2nd", title: "2nd Year CIT", code: "25-CIT", badgeColor: "emerald" },
    { id: "3rd", title: "3rd Year CIT", code: "24-CIT", badgeColor: "purple" }
  ],

  teachers: [
    { id: "t1", name: "Mahmood-Ul-Hassan", designation: "Lecturer / Senior Instructor" },
    { id: "t2", name: "Ijaz Ahmad", designation: "Instructor CIT" },
    { id: "t3", name: "Rao M. Haziq", designation: "Instructor CIT" },
    { id: "t4", name: "Mr. Ehsan", designation: "Instructor CIT" },
    { id: "t5", name: "Muhammad Hasnain", designation: "Instructor CIT/Electronics" },
    { id: "t6", name: "Zohaib Hassan", designation: "Lecturer Chemistry" },
    { id: "t7", name: "Shah Hussain", designation: "Lecturer Physics" },
    { id: "t8", name: "Joun Abbas", designation: "Lecturer English" },
    { id: "t9", name: "Khuram Shahzad", designation: "Lecturer Mathematics" },
    { id: "t10", name: "Inyat Ali Khan", designation: "Lecturer Islamiat/Pak Studies" },
    { id: "t11", name: "Umair Khalil", designation: "Student Counselor" },
    { id: "t12", name: "Mohib Mahdi", designation: "Lecturer Quran/TTQ" },
    { id: "t13", name: "Mr. Inam Kaifi", designation: "Lecturer Management" }
  ],

  rooms: [
    "Computer Lab-1",
    "Software Lab",
    "Autocad Lab",
    "Applied Electronics Lab",
    "Basic Electrical Lab",
    "Basic Electronics Lab",
    "Chemistry Lab",
    "Physics Lab",
    "Room-6",
    "Multipurpose Hall",
    "Room-6/Software Lab"
  ],

  // ===================== 1st Year Timetable (26-CIT) =====================
  timetable_1st: {
    Monday: [
      { period: 1, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 3, subject: "CH-132(T,P)", teacher: "Zohaib Hassan", room: "Chemistry Lab" },
      { period: 4, subject: "CH-132(T,P)", teacher: "Zohaib Hassan", room: "Chemistry Lab" },
      { period: 5, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 6, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 7, subject: "Eng-112", teacher: "Joun Abbas", room: "Room-6" },
      { period: 8, subject: "Math-123", teacher: "Khuram Shahzad", room: "Room-6" }
    ],

    Tuesday: [
      { period: 1, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 3, subject: "CH-132(P)", teacher: "Zohaib Hassan", room: "Chemistry Lab" },
      { period: 4, subject: "CH-132(P)", teacher: "Zohaib Hassan", room: "Chemistry Lab" },
      { period: 5, subject: "Phy-132(T,P)", teacher: "Shah Hussain", room: "Physics Lab" },
      { period: 6, subject: "Phy-132(T,P)", teacher: "Shah Hussain", room: "Physics Lab" },
      { period: 7, subject: "Math-123", teacher: "Khuram Shahzad", room: "Room-6" },
      { period: 8, subject: "CIT-103(T)", teacher: "Ijaz Ahmad", room: "Software Lab" }
    ],

    Wednesday: [
      { period: 1, subject: "CIT-114(T)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Applied Electronics Lab" },
      { period: 3, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Applied Electronics Lab" },
      { period: 4, subject: "Eng-112", teacher: "Joun Abbas", room: "Room-6" },
      { period: 5, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 6, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 7, subject: "Math-123", teacher: "Khuram Shahzad", room: "Room-6" },
      { period: 8, subject: "Gen-111", teacher: "Inyat Ali Khan", room: "Room-6" }
    ],

    Thursday: [
      { period: 1, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 3, subject: "Eng-112", teacher: "Joun Abbas", room: "Room-6" },
      { period: 4, subject: "CIT-124(T)", teacher: "Muhammad Hasnain", room: "Room-6" },
      { period: 5, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Room-6" },
      { period: 6, subject: "Math-123", teacher: "Khuram Shahzad", room: "Room-6" },
      { period: 7, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 8, subject: "CIT-103(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" }
    ],

    Friday: [
      { period: 1, subject: "CIT-114(T)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 2, subject: "Career Counseling", teacher: "Umair Khalil", room: "Multipurpose Hall" },
      { period: 3, subject: "CIT-124(T)", teacher: "Muhammad Hasnain", room: "Room-6" },
      { period: 4, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Room-6" },
      { period: 5, subject: "Math-123", teacher: "Khuram Shahzad", room: "Room-6" },
      { period: 6, subject: "CIT-141(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 7, subject: "CIT-141(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" },
      { period: 8, subject: "CIT-141(P)", teacher: "Ijaz Ahmad", room: "Autocad Lab" }
    ],

    Saturday: [
      { period: 1, subject: "TTQ-111", teacher: "Mohib Mahdi", room: "Room-6" },
      { period: 2, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Applied Electronics Lab" },
      { period: 3, subject: "CIT-124(P)", teacher: "Muhammad Hasnain", room: "Applied Electronics Lab" },
      { period: 4, subject: "Eng-112", teacher: "Joun Abbas", room: "Room-6" },
      { period: 5, subject: "Phy-132(P)", teacher: "Shah Hussain", room: "Physics Lab" },
      { period: 6, subject: "Phy-132(P)", teacher: "Shah Hussain", room: "Physics Lab" },
      { period: 7, subject: "CIT-101(T)", teacher: "Ijaz Ahmad", room: "Software Lab" }
    ]
  },

  // ===================== 2nd Year Timetable (25-CIT) =====================
  timetable_2nd: {
    Monday: [
      { period: 1, subject: "MGM-211", teacher: "Mr. Inam Kaifi", room: "Software Lab" },
      { period: 2, subject: "CIT-204(T,P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-204(T,P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-203 (T)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 5, subject: "Math-223", teacher: "Khuram Shahzad", room: "Software Lab" },
      { period: 6, subject: "CIT-283(T)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 7, subject: "CIT-283(T)", teacher: "Ijaz Ahmad", room: "Software Lab" }
    ],

    Tuesday: [
      { period: 1, subject: "CIT-283(P)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 2, subject: "CIT-204(T,P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-204(T,P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 5, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 6, subject: "CIT-273 (T)", teacher: "Muhammad Hasnain", room: "Software Lab" },
      { period: 7, subject: "Math-223", teacher: "Khuram Shahzad", room: "Room-6" }
    ],

    Wednesday: [
      { period: 1, subject: "CIT-283(P)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 2, subject: "CIT-203 (T,P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 3, subject: "CIT-203 (T,P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 4, subject: "CIT-273 (T,P)", teacher: "Muhammad Hasnain", room: "Software Lab" },
      { period: 5, subject: "CIT-273 (T,P)", teacher: "Muhammad Hasnain", room: "Software Lab" },
      { period: 6, subject: "Gen-211", teacher: "Inyat Ali Khan", room: "Software Lab" },
      { period: 7, subject: "Math-223", teacher: "Khuram Shahzad", room: "Software Lab" }
    ],

    Thursday: [
      { period: 1, subject: "CIT-283(P)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 2, subject: "CIT-204(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-204(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 5, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 6, subject: "Math-223", teacher: "Khuram Shahzad", room: "Software Lab" },
      { period: 7, subject: "Career Counseling", teacher: "Umair Khalil", room: "Multipurpose Hall" }
    ],

    Friday: [
      { period: 1, subject: "TTQ-211", teacher: "Mohib Mahdi", room: "Software Lab" },
      { period: 2, subject: "CIT-204(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-204(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-222(T)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 5, subject: "CIT-222(T)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 6, subject: "Math-223", teacher: "Khuram Shahzad", room: "Software Lab" },
      { period: 7, subject: "CIT-203 (P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 8, subject: "CIT-203 (P)", teacher: "Mr. Ehsan", room: "Software Lab" }
    ],

    Saturday: [
      { period: 1, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 2, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 3, subject: "CIT-293(P)", teacher: "Mr. Ehsan", room: "Software Lab" },
      { period: 4, subject: "CIT-222(P)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 5, subject: "CIT-222(P)", teacher: "Ijaz Ahmad", room: "Software Lab" },
      { period: 6, subject: "CIT-273 (P)", teacher: "Muhammad Hasnain", room: "Basic Electrical Lab" },
      { period: 7, subject: "CIT-273 (P)", teacher: "Muhammad Hasnain", room: "Basic Electrical Lab" }
    ]
  },

  // ===================== 3rd Year Timetable (24-CIT) =====================
  timetable_3rd: {
    Monday: [
      { period: 1, subject: "CIT-343(T)", teacher: "Muhammad Hasnain", room: "Room-6" },
      { period: 2, subject: "CIT-312 (T,P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 3, subject: "CIT-312 (T,P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 4, subject: "Gen-311", teacher: "Inyat Ali Khan", room: "Room-6" },
      { period: 5, subject: "CIT-381 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-381 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-381 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" }
    ],

    Tuesday: [
      { period: 1, subject: "CIT-313 (T)", teacher: "Mr. Ehsan", room: "Room-6" },
      { period: 2, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 3, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 4, subject: "CIT-322 (T,P)", teacher: "Ijaz Ahmad", room: "Computer Lab-1" },
      { period: 5, subject: "CIT-322 (T,P)", teacher: "Ijaz Ahmad", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" }
    ],

    Wednesday: [
      { period: 1, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-372 (T,P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 5, subject: "CIT-372 (T,P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-322 (P)", teacher: "Ijaz Ahmad", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-322 (P)", teacher: "Ijaz Ahmad", room: "Computer Lab-1" }
    ],

    Thursday: [
      { period: 1, subject: "CIT-343(T,P)", teacher: "Muhammad Hasnain", room: "Room-6/Software Lab" },
      { period: 2, subject: "CIT-343(T,P)", teacher: "Muhammad Hasnain", room: "Room-6/Software Lab" },
      { period: 3, subject: "CIT-314 (T)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 4, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 5, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" }
    ],

    Friday: [
      { period: 1, subject: "Career Counseling", teacher: "Umair Khalil", room: "Multipurpose Hall" },
      { period: 2, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 3, subject: "CIT-314 (P)", teacher: "Mahmood-Ul-Hassan", room: "Software Lab" },
      { period: 4, subject: "CIT-314 (T)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 5, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-313 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-343(T,P)", teacher: "Muhammad Hasnain", room: "Basic Electronics Lab" },
      { period: 8, subject: "CIT-343(T,P)", teacher: "Muhammad Hasnain", room: "Basic Electronics Lab" }
    ],

    Saturday: [
      { period: 1, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 2, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 3, subject: "CIT-392(P)", teacher: "Rao M. Haziq", room: "Computer Lab-1" },
      { period: 4, subject: "CIT-372 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 5, subject: "CIT-372 (P)", teacher: "Mr. Ehsan", room: "Computer Lab-1" },
      { period: 6, subject: "CIT-312 (P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" },
      { period: 7, subject: "CIT-312 (P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" }
    ]
  },

  announcements: [
    {
      id: "ann-1",
      title: "Afternoon Shift Self Finance Timetable Active (12:10 PM - 05:20 PM)",
      date: "2026-09-01",
      author: "HOD CIT",
      category: "Important",
      pinned: true,
      content:
        "All CIT students are notified that classes run in Afternoon Shift from 12:10 PM to 05:20 PM with Break/Prayer at 02:30 PM."
    },
    {
      id: "ann-2",
      title: "Updated Schedule: Rao M. Haziq Lectures",
      date: "2026-09-12",
      author: "HOD CIT",
      category: "Schedule Notice",
      pinned: true,
      content:
        "Attention 3rd Year CIT: Rao M. Haziq conducts 3 continuous practical lectures (Lec 1, 2, and 3) on Wednesday and Saturday in Computer Lab-1."
    },
    {
      id: "ann-3",
      title: "Revised Timetable Effective 14-09-2026",
      date: "2026-09-14",
      author: "HOD CIT",
      category: "Important",
      pinned: true,
      content:
        "The revised CIT timetable (Self Finance 2026-27) is effective from 14-09-2026. Please check your year's updated schedule, including the new lab allocations (Applied Electronics Lab, Basic Electrical Lab, Basic Electronics Lab)."
    }
  ],

  sampleStudents: [
    { rollNo: "26-CIT-105", name: "Muhammad Ali", year: "1st" },
    { rollNo: "25-CIT-042", name: "Hamza Farooq", year: "2nd" },
    { rollNo: "24-CIT-015", name: "Aliyan Ansari", year: "3rd" }
  ]
};

module.exports = INITIAL_DATA;