const assert = require('assert');
const authRoutes = require('../routes/authRoutes');

console.log('🧪 Running Simple Name + Roll No Authentication Tests...');

async function runTests() {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/auth`;

  try {
    // Test 1: Invalid Roll No Format
    const res1 = await fetch(`${baseUrl}/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: 'INVALID-ROLL', name: 'Aliyan Ansari' })
    });
    const data1 = await res1.json();
    assert.strictEqual(res1.status, 400);
    assert(data1.error.includes('Invalid Roll No format'));
    console.log('✅ Test 1 Passed: Invalid Roll No format correctly rejected.');

    // Test 2: New Student Registration
    const res2 = await fetch(`${baseUrl}/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: '24-CIT-015', name: 'Aliyan Ansari' })
    });
    const data2 = await res2.json();
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(data2.success, true);
    assert.strictEqual(data2.user.role, 'student');
    assert.strictEqual(data2.user.rollNo, '24-CIT-015');
    assert.strictEqual(data2.user.name, 'Aliyan Ansari');
    assert.strictEqual(data2.user.year, '3rd');
    console.log('✅ Test 2 Passed: New student 24-CIT-015 (Aliyan Ansari) registered successfully.');

    // Test 3: Returning Student Login (Matching Name)
    const res3 = await fetch(`${baseUrl}/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: '24-CIT-015', name: 'aliyan ansari' })
    });
    const data3 = await res3.json();
    assert.strictEqual(res3.status, 200);
    assert.strictEqual(data3.success, true);
    assert.strictEqual(data3.user.rollNo, '24-CIT-015');
    console.log('✅ Test 3 Passed: Returning student logged in cleanly without creating a duplicate record.');

    // Test 4: Duplicate Roll No Protection (Mismatched Name)
    const res4 = await fetch(`${baseUrl}/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: '24-CIT-015', name: 'Imposter Student' })
    });
    const data4 = await res4.json();
    assert.strictEqual(res4.status, 400);
    assert.strictEqual(data4.error, 'This Roll No is already registered under a different name.');
    console.log('✅ Test 4 Passed: Imposter login with duplicate Roll No blocked with exact error message.');

    // Test 5: Second Student Registration (1st Year)
    const res5 = await fetch(`${baseUrl}/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: '26-CIT-105', name: 'Muhammad Ali' })
    });
    const data5 = await res5.json();
    assert.strictEqual(res5.status, 200);
    assert.strictEqual(data5.user.year, '1st');
    console.log('✅ Test 5 Passed: 1st Year student (Muhammad Ali) registered successfully.');

    // Test 6: Staff Password Login
    const res6 = await fetch(`${baseUrl}/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'hod_cit', password: 'admin123' })
    });
    const data6 = await res6.json();
    assert.strictEqual(res6.status, 200);
    assert.strictEqual(data6.user.role, 'admin');
    console.log('✅ Test 6 Passed: Staff password authentication verified.');

    console.log('🎉 ALL SIMPLE NAME + ROLL NO AUTHENTICATION TESTS PASSED!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
