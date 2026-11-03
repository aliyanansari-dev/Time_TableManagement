/**
 * Automated Unit Test Suite for SchedulingService Isolated Module
 */

const assert = require('assert');
const schedulingService = require('../services/schedulingService');

console.log('🧪 Running SchedulingService Automated Unit Tests...');

const mockDataset = {
  timetable_1st: {
    Monday: [{ period: 1, subject: "CIT-114(P)", teacher: "Mahmood-Ul-Hassan", room: "Computer Lab-1" }]
  }
};

// Test 1: Conflict Detection via Service
const conflictCheck = schedulingService.checkConflicts('2nd', 'Monday', 1, 'Mahmood-Ul-Hassan', 'Software Lab', mockDataset);
assert.strictEqual(conflictCheck.hasConflict, true, 'Test 1 Failed: Should detect teacher Mahmood-Ul-Hassan double booking');
console.log('✅ Test 1 Passed: SchedulingService detected double booking.');

// Test 2: Optimization Score Calculation
const score = schedulingService.calculateOptimizationScore(mockDataset);
assert.strictEqual(typeof score, 'number', 'Test 2 Failed: Optimization score must be a number');
assert.ok(score >= 60 && score <= 100, 'Test 2 Failed: Score must be between 60 and 100');
console.log(`✅ Test 2 Passed: Optimization Score calculated successfully (${score}/100).`);

// Test 3: Substitute Ranking Engine
const mockTeachers = [
  { name: "Mahmood-Ul-Hassan", designation: "Lecturer CIT" },
  { name: "Ijaz Ahmad", designation: "Instructor CIT" },
  { name: "Khuram Shahzad", designation: "Lecturer Mathematics" }
];

const subs = schedulingService.rankSubstitutes('Mahmood-Ul-Hassan', 'CIT-114(P)', 'Monday', 1, mockTeachers, mockDataset);
assert.ok(Array.isArray(subs), 'Test 3 Failed: Substitutes must be an array');
assert.strictEqual(subs[0].teacher, 'Ijaz Ahmad', 'Test 3 Failed: Should rank available CIT instructor first');
console.log('✅ Test 3 Passed: Smart Substitution Ranking Engine correctly ranked qualified staff.');

console.log('🎉 ALL SCHEDULING SERVICE TESTS PASSED SUCCESSFULLY!');
