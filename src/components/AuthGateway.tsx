import React, { useState } from 'react';
import { CurrentUser } from '../types';

interface AuthGatewayProps {
  isOpen: boolean;
  onLoginSuccess: (user: CurrentUser, year?: string) => void;
  savedUser: CurrentUser;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  isOpen,
  onLoginSuccess,
  savedUser
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');
  const [studentName, setStudentName] = useState(
    savedUser && savedUser.role === 'student' ? savedUser.name : ''
  );
  const [rollNo, setRollNo] = useState(
    savedUser && savedUser.role === 'student' ? savedUser.rollNo : ''
  );
  const [year, setYear] = useState(
    savedUser && savedUser.role === 'student' ? savedUser.year : '3rd'
  );
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const autoDetectYearFromRoll = (val: string) => {
    setRollNo(val);
    const formatted = val.trim().toUpperCase();
    const match = formatted.match(/^(\d{2})-CIT-/i);
    if (match) {
      const prefix = match[1];
      if (prefix === '26') setYear('1st');
      else if (prefix === '25') setYear('2nd');
      else if (prefix === '24') setYear('3rd');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const name = studentName.trim();
    let roll = rollNo.trim().toUpperCase();

    if (!name) {
      setErrorMessage('Please enter your Student Full Name.');
      return;
    }

    if (!roll) {
      setErrorMessage('Please enter your CIT Roll Number.');
      return;
    }

    // Auto-complete roll numbers given as digits (e.g. "136" -> "26-CIT-136")
    if (/^\d{1,3}$/.test(roll)) {
      const prefix = year === '3rd' ? '24' : year === '2nd' ? '25' : '26';
      roll = `${prefix}-CIT-${roll.padStart(3, '0')}`;
      setRollNo(roll);
    }

    // Format validation
    const rollRegex = /^\d{2}-CIT-\d{3}$/i;
    if (!rollRegex.test(roll)) {
      setErrorMessage('Invalid Roll No format. Expected format: YY-CIT-XXX (e.g. 26-CIT-136)');
      return;
    }

    let detectedYear = year;
    if (roll.startsWith('26')) detectedYear = '1st';
    else if (roll.startsWith('25')) detectedYear = '2nd';
    else if (roll.startsWith('24')) detectedYear = '3rd';

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: CurrentUser = {
        role: 'student',
        rollNo: roll,
        name: name,
        year: detectedYear,
        lastLoginAt: new Date().toISOString()
      };
      onLoginSuccess(user, detectedYear);
    }, 400);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const uname = staffUsername.trim() || 'hod_cit';
    const isTeacher = uname === 'teacher_cit' || uname.toLowerCase().includes('teacher');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: CurrentUser = isTeacher
        ? { role: 'faculty', name: 'CIT Faculty Member', email: 'faculty.cit@gctbhakkar.edu.pk' }
        : { role: 'admin', name: 'Engr. HOD CIT', email: 'hod.cit@gctbhakkar.edu.pk' };

      onLoginSuccess(user);
    }, 400);
  };

  return (
    <div id="authGateway" className="auth-gateway" style={{ display: 'flex' }}>
      <div className="gateway-card">
        <div className="gateway-header">
          <div className="gateway-logo-badge">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2>GOVERNMENT COLLEGE OF TECHNOLOGY, BHAKKAR</h2>
          <p><i className="fas fa-laptop-code"></i> Department of Computer Information Technology (CIT)</p>
          <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, marginTop: '4px' }}>
            Self Finance Afternoon Shift (12:10 PM - 05:20 PM)
          </p>
          <div className="dev-by-badge">
            <i className="fas fa-code"></i> Developed by Aliyan Ansari (DAE CIT 3rd Year)
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="gateway-segmented-control">
          <button
            type="button"
            className={`gateway-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('student');
              setErrorMessage(null);
            }}
          >
            <i className="fas fa-user-graduate"></i> Student Login
          </button>
          <button
            type="button"
            className={`gateway-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('staff');
              setErrorMessage(null);
            }}
          >
            <i className="fas fa-user-shield"></i> HOD / Faculty
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            id="gwErrorMessage"
            className="alert alert-danger"
            style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5'
            }}
          >
            <i className="fas fa-exclamation-circle"></i> <span>{errorMessage}</span>
          </div>
        )}

        {/* Student Login Form */}
        {activeTab === 'student' ? (
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label>Student Full Name</label>
              <div className="gw-input-wrapper">
                <i className="fas fa-user gw-icon"></i>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aliyan Ansari"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>CIT Roll Number</label>
              <div className="gw-input-wrapper">
                <i className="fas fa-id-card gw-icon"></i>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 24-CIT-015"
                  value={rollNo}
                  onChange={(e) => autoDetectYearFromRoll(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Academic Year</label>
              <div className="gw-input-wrapper">
                <i className="fas fa-graduation-cap gw-icon"></i>
                <select
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="1st">1st Year (26-CIT)</option>
                  <option value="2nd">2nd Year (25-CIT)</option>
                  <option value="3rd">3rd Year (24-CIT)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Authenticate & Open Platform
                </>
              )}
            </button>
          </form>
        ) : (
          /* Staff Login Form */
          <form onSubmit={handleStaffSubmit}>
            <div className="form-group">
              <label>Staff Username / Email</label>
              <div className="gw-input-wrapper">
                <i className="fas fa-user-shield gw-icon"></i>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. hod_cit or teacher_cit"
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="gw-input-wrapper">
                <i className="fas fa-lock gw-icon"></i>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Opening Operations Platform...
                </>
              ) : (
                <>
                  <i className="fas fa-user-shield"></i> Login to HOD Operations Platform
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
