import React, { useEffect, useRef } from 'react';
import { CurrentUser } from '../types';

interface ControlsBarProps {
  activeYear: string;
  onSelectYear: (year: string) => void;
  activeView: 'timetable' | 'teachers' | 'rooms' | 'notices' | 'dashboard';
  onSelectView: (view: 'timetable' | 'teachers' | 'rooms' | 'notices' | 'dashboard') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: CurrentUser;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  activeYear,
  onSelectYear,
  activeView,
  onSelectView,
  searchQuery,
  onSearchChange,
  currentUser
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isStaff =
    currentUser &&
    (currentUser.role === 'admin' ||
      currentUser.role === 'hod' ||
      currentUser.role === 'faculty' ||
      currentUser.role === 'teacher');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="controls-bar">
      {/* Year Selection Tabs */}
      <div className="tabs-group year-tabs">
        <button
          type="button"
          className={`tab-btn year-tab-btn ${activeYear === '1st' ? 'active' : ''}`}
          onClick={() => onSelectYear('1st')}
        >
          <i className="fas fa-user-graduate"></i> 1st Year
        </button>
        <button
          type="button"
          className={`tab-btn year-tab-btn ${activeYear === '2nd' ? 'active' : ''}`}
          onClick={() => onSelectYear('2nd')}
        >
          <i className="fas fa-user-graduate"></i> 2nd Year
        </button>
        <button
          type="button"
          className={`tab-btn year-tab-btn ${activeYear === '3rd' ? 'active' : ''}`}
          onClick={() => onSelectYear('3rd')}
        >
          <i className="fas fa-user-graduate"></i> 3rd Year
        </button>
      </div>

      <div className="controls-divider"></div>

      {/* View Tabs */}
      <div className="tabs-group view-tabs">
        <button
          type="button"
          className={`tab-btn nav-view-btn ${activeView === 'timetable' ? 'active' : ''}`}
          onClick={() => onSelectView('timetable')}
        >
          <i className="fas fa-calendar-alt"></i> Timetable Grid
        </button>
        <button
          type="button"
          className={`tab-btn nav-view-btn ${activeView === 'teachers' ? 'active' : ''}`}
          onClick={() => onSelectView('teachers')}
        >
          <i className="fas fa-chalkboard-teacher"></i> Faculty Workload
        </button>
        <button
          type="button"
          className={`tab-btn nav-view-btn ${activeView === 'rooms' ? 'active' : ''}`}
          onClick={() => onSelectView('rooms')}
        >
          <i className="fas fa-desktop"></i> Lab Usage
        </button>
        <button
          type="button"
          className={`tab-btn nav-view-btn ${activeView === 'notices' ? 'active' : ''}`}
          onClick={() => onSelectView('notices')}
        >
          <i className="fas fa-bullhorn"></i> Notice Board
        </button>
        {isStaff && (
          <button
            type="button"
            className={`tab-btn nav-view-btn admin-only visible ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSelectView('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> HOD Dashboard
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="search-filter-box">
        <div className="input-icon-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            ref={searchInputRef}
            type="text"
            id="searchInput"
            className="form-input"
            placeholder="Search subject, teacher, lab..."
            aria-label="Search Timetable"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-kbd-hint">⌘K</span>
        </div>
      </div>
    </div>
  );
};
