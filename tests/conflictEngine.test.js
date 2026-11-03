/**
 * Automated Test Suite for Server-Side Conflict Detection Engine
 * Government College of Technology (GCT), Bhakkar
 */

const assert = require('assert');

// Mock timetable dataset
const mockDatabase = {
  timetable_1st: {
    Monday: [{ period: 1, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" }]
  },
  timetable_2nd: {
    Monday: [{ period: 1, subject: "MGM-211", teacher: "Mr. Inam Kaifi", room: "Software Lab" }]
  },
  timetable_3rd: {
    Monday: [{ period: 1, subject: "CIT-343(T)", teacher: "Muhammad Hasnain", room: "Room-6" }]
  }
};

function checkConflict(targetYear, day, period, teacher, room, dataset = mockDatabase) {
  const conflicts = [];
  const years = ['1st', '2nd', '3rd'];

  years.forEach(y => {
    const key = `timetable_${y}`;
    const slots = (dataset[key] && dataset[key][day]) || [];
    slots.forEach(s => {
      if (s.period === period) {
        if (s.teacher && s.teacher.toLowerCase() === teacher.toLowerCase()) {
          conflicts.push(`Teacher Clashing: ${teacher} is already assigned to ${y} Year (${s.subject})`);
        }
        if (s.room && s.room.toLowerCase() === room.toLowerCase() && room !== 'Room-6') {
          conflicts.push(`Room Clashing: ${room} is already assigned to ${y} Year (${s.subject})`);
        }
      }
    });
  });

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}

console.log('🧪 Running Conflict Engine Automated Unit Tests...');

// Test 1: Teacher Conflict Detection
const test1 = checkConflict('2nd', 'Monday', 1, 'Mahmood-Ul-Hassan', 'Autocad Lab');
assert.strictEqual(test1.hasConflict, true, 'Test 1 Failed: Should detect teacher Mahmood-Ul-Hassan double booking');
console.log('✅ Test 1 Passed: Teacher double booking correctly detected.');

// Test 2: Room Conflict Detection
const test2 = checkConflict('2nd', 'Monday', 1, 'Ijaz Ahmad', 'Computer Lab-1');
assert.strictEqual(test2.hasConflict, true, 'Test 2 Failed: Should detect room Computer Lab-1 double booking');
console.log('✅ Test 2 Passed: Room double booking correctly detected.');

// Test 3: Valid Free Slot
const test3 = checkConflict('2nd', 'Monday', 1, 'Khuram Shahzad', 'Physics Lab');
assert.strictEqual(test3.hasConflict, false, 'Test 3 Failed: Valid slot reported false conflict');
console.log('✅ Test 3 Passed: Valid slot allowed with zero conflicts.');

console.log('🎉 ALL CONFLICT ENGINE TESTS PASSED SUCCESSFULLY!');
