import React, { useEffect, useState } from 'react';
import { CurrentUser } from '../types';

interface DeptHeaderProps {
  currentUser: CurrentUser;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportIcs: () => void;
  onPrint: () => void;
  onLogout: () => void;
}

export const DeptHeader: React.FC<DeptHeaderProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onExportIcs,
  onPrint,
  onLogout
}) => {
  const [clockText, setClockText] = useState('--:--:-- PKT');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const karachiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
        setClockText(
          karachiDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' PKT'
        );
      } catch (e) {
        setClockText(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' PKT');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="dept-header">
      <div className="header-container">
        <div className="brand-info">
          <div className="dept-logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="brand-titles">
            <h1>GOVERNMENT COLLEGE OF TECHNOLOGY, BHAKKAR</h1>
            <p>
              <i className="fas fa-laptop-code"></i> Department of Computer Information Technology (CIT) &bull; DAE Platform
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div id="liveClock" className="live-clock-pill">
            {clockText}
          </div>

          {currentUser && (
            <div id="userPill" className="user-pill">
              <i className="fas fa-user-circle"></i>
              <span>
                {currentUser.name} (
                {'rollNo' in currentUser ? currentUser.rollNo : currentUser.role.toUpperCase()}
                )
              </span>
              <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
            </div>
          )}

          <button
            id="themeToggleBtn"
            className="btn btn-outline-light"
            title={`Toggle Theme (${theme === 'dark' ? 'Light' : 'Dark'})`}
            aria-label="Toggle Theme"
            onClick={onToggleTheme}
          >
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>

          <button
            id="exportIcsBtn"
            className="btn btn-outline-light"
            title="Export Personal Calendar (.ics)"
            aria-label="Export Personal Calendar (.ics)"
            onClick={onExportIcs}
          >
            <i className="fas fa-calendar-plus"></i> Calendar (.ics)
          </button>

          <button
            id="printBtn"
            className="btn btn-outline-light"
            title="Print Official Timetable Sheet"
            aria-label="Print Official Timetable Sheet"
            onClick={onPrint}
          >
            <i className="fas fa-print"></i> Print PDF
          </button>

          <button
            id="logoutBtn"
            className="btn btn-outline-light"
            title="Logout Session"
            aria-label="Logout Session"
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
