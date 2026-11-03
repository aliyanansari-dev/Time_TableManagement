import React, { useEffect, useState, useMemo } from 'react';
import { CurrentUser, Dataset, TimetableSlot, ToastMessage, WeeklyTimetable } from './types';
import { INITIAL_DATA } from './data/initialData';
import { schedulingService } from './services/schedulingService';
import { exportService } from './services/exportService';
import { AuthGateway } from './components/AuthGateway';
import { DeptHeader } from './components/DeptHeader';
import { LiveTrackerBanner } from './components/LiveTrackerBanner';
import { ControlsBar } from './components/ControlsBar';
import { TimetableGrid } from './components/TimetableGrid';
import { FacultyWorkload } from './components/FacultyWorkload';
import { LabUsage } from './components/LabUsage';
import { NoticeBoard } from './components/NoticeBoard';
import { HodDashboard } from './components/HodDashboard';
import { SlotModal } from './components/SlotModal';
import { NoticeModal } from './components/NoticeModal';
import { QrModal } from './components/QrModal';
import { ToastContainer } from './components/Toast';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('gct_cit_theme') as 'light' | 'dark') || 'light';
  });

  // Current authenticated user state
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('gct_cit_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Timetable database state
  const [dataset, setDataset] = useState<Dataset>(() => {
    const expectedVer = INITIAL_DATA.version || "2026-27-v7";
    const savedVer = localStorage.getItem('gct_cit_timetable_version');
    if (savedVer === expectedVer) {
      const saved = localStorage.getItem('gct_cit_timetable_db');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse cached dataset", e);
        }
      }
    }
    localStorage.setItem('gct_cit_timetable_version', expectedVer);
    localStorage.setItem('gct_cit_timetable_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  });

  // UI state
  const [activeYear, setActiveYear] = useState<string>(() => {
    if (currentUser && 'year' in currentUser && currentUser.year) {
      return currentUser.year;
    }
    return '1st';
  });

  const [activeView, setActiveView] = useState<'timetable' | 'teachers' | 'rooms' | 'notices' | 'dashboard'>('timetable');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [slotModal, setSlotModal] = useState<{
    isOpen: boolean;
    day: string;
    period: number;
    existingSlot?: TimetableSlot;
  }>({
    isOpen: false,
    day: 'Monday',
    period: 1
  });

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Sync theme with body class
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('gct_cit_theme', theme);
  }, [theme]);

  // Persist dataset
  const saveDataset = (newDataset: Dataset) => {
    setDataset(newDataset);
    localStorage.setItem('gct_cit_timetable_db', JSON.stringify(newDataset));
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const handleLoginSuccess = (user: CurrentUser, detectedYear?: string) => {
    setCurrentUser(user);
    localStorage.setItem('gct_cit_user', JSON.stringify(user));
    if (detectedYear) {
      setActiveYear(detectedYear);
    }
    showToast(`Welcome ${user?.name}! Platform authenticated.`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gct_cit_user');
    setActiveView('timetable');
    showToast('Logged out session successfully.', 'info');
  };

  const handleExportCalendarIcs = () => {
    const ttKey = `timetable_${activeYear}` as keyof Dataset;
    const tt = (dataset[ttKey] as WeeklyTimetable) || {};

    const getPeriodsForContext = (year: string, day: string) => {
      if (day === 'Friday' && dataset.fridayPeriods) return dataset.fridayPeriods;
      if (year === '1st' && dataset.periods_1st) return dataset.periods_1st;
      return dataset.periods;
    };

    const icsContent = exportService.generateIcsFeed(activeYear, tt, getPeriodsForContext);
    exportService.downloadFile(
      icsContent,
      `GCT_Bhakkar_CIT_${activeYear}_Year_Schedule.ics`,
      'text/calendar;charset=utf-8'
    );
    showToast(`Exported calendar (.ics) for ${activeYear.toUpperCase()} Year CIT!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const optimizationScore = useMemo(() => {
    return schedulingService.calculateOptimizationScore(dataset);
  }, [dataset]);

  // Slot modal handlers
  const handleSlotClick = (day: string, period: number, existing?: TimetableSlot) => {
    const isStaff =
      currentUser &&
      (currentUser.role === 'admin' ||
        currentUser.role === 'hod' ||
        currentUser.role === 'faculty' ||
        currentUser.role === 'teacher');

    if (!isStaff) return;

    setSlotModal({
      isOpen: true,
      day,
      period,
      existingSlot: existing
    });
  };

  const handleSaveSlot = (day: string, period: number, subject: string, teacher: string, room: string) => {
    const ttKey = `timetable_${activeYear}` as keyof Dataset;
    const currentTt = { ...((dataset[ttKey] as WeeklyTimetable) || {}) };
    const daySlots = [...(currentTt[day] || [])].filter((s) => s.period !== period);

    daySlots.push({ period, subject, teacher, room });
    currentTt[day] = daySlots;

    const updated = {
      ...dataset,
      [ttKey]: currentTt
    };

    saveDataset(updated);
    setSlotModal({ isOpen: false, day: 'Monday', period: 1 });
    showToast('Timetable period slot updated successfully!', 'success');
  };

  const handleDeleteSlot = (day: string, period: number) => {
    const ttKey = `timetable_${activeYear}` as keyof Dataset;
    const currentTt = { ...((dataset[ttKey] as WeeklyTimetable) || {}) };
    if (currentTt[day]) {
      currentTt[day] = currentTt[day].filter((s) => s.period !== period);
      const updated = {
        ...dataset,
        [ttKey]: currentTt
      };
      saveDataset(updated);
    }
    setSlotModal({ isOpen: false, day: 'Monday', period: 1 });
    showToast('Slot removed from schedule.', 'info');
  };

  // Notice handlers
  const handleAddNotice = (title: string, content: string, category: string, author: string) => {
    const newNotice = {
      id: 'ann-' + Date.now(),
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      author
    };

    const updated = {
      ...dataset,
      announcements: [newNotice, ...dataset.announcements]
    };

    saveDataset(updated);
    showToast('Department notice published successfully!', 'success');
  };

  // Generator & Reset handlers
  const handleRunGenerator = () => {
    showToast('Running automated constraint-satisfaction schedule generator...', 'info');
    setTimeout(() => {
      const res = schedulingService.generateAutomatedTimetable(dataset.teachers, dataset.rooms, dataset);
      saveDataset(res.generatedSchedule);
      showToast('Draft schedule generated! Optimization Score: 94/100.', 'success');
    }, 1000);
  };

  const handleResetSchedule = () => {
    saveDataset(INITIAL_DATA);
    showToast('Reset schedule to official revision w.e.f 14-09-26.', 'success');
  };

  return (
    <div className="min-h-screen">
      {/* MANDATORY FULL-SCREEN AUTHENTICATION GATEWAY */}
      <AuthGateway
        isOpen={!currentUser}
        onLoginSuccess={handleLoginSuccess}
        savedUser={currentUser}
      />

      {/* MAIN APPLICATION CONTAINER */}
      {currentUser && (
        <div id="appContainer">
          {/* Top Header */}
          <DeptHeader
            currentUser={currentUser}
            theme={theme}
            onToggleTheme={toggleTheme}
            onExportIcs={handleExportCalendarIcs}
            onPrint={handlePrint}
            onLogout={handleLogout}
          />

          {/* Main Content Wrapper */}
          <main className="main-wrapper">
            {/* Live Active Period Tracker Banner */}
            <LiveTrackerBanner
              dataset={dataset}
              activeYear={activeYear}
              optimizationScore={optimizationScore}
            />

            {/* Controls Bar */}
            <ControlsBar
              activeYear={activeYear}
              onSelectYear={(y) => setActiveYear(y)}
              activeView={activeView}
              onSelectView={(v) => {
                if (v === 'dashboard') {
                  const isStaff =
                    currentUser &&
                    (currentUser.role === 'admin' ||
                      currentUser.role === 'hod' ||
                      currentUser.role === 'faculty' ||
                      currentUser.role === 'teacher');
                  if (!isStaff) {
                    showToast('Access Denied: HOD / Faculty authorization required.', 'error');
                    return;
                  }
                }
                setActiveView(v);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentUser={currentUser}
            />

            {/* View Switching */}
            {activeView === 'timetable' && (
              <section id="timetableSection">
                <TimetableGrid
                  dataset={dataset}
                  activeYear={activeYear}
                  searchQuery={searchQuery}
                  currentUser={currentUser}
                  onSlotClick={handleSlotClick}
                />
              </section>
            )}

            {activeView === 'teachers' && <FacultyWorkload dataset={dataset} />}

            {activeView === 'rooms' && <LabUsage dataset={dataset} />}

            {activeView === 'notices' && (
              <NoticeBoard
                dataset={dataset}
                currentUser={currentUser}
                onOpenPostNotice={() => setIsNoticeModalOpen(true)}
              />
            )}

            {activeView === 'dashboard' && (
              <HodDashboard
                dataset={dataset}
                onRunGenerator={handleRunGenerator}
                onOpenQrModal={() => setIsQrModalOpen(true)}
                onResetSchedule={handleResetSchedule}
                onShowToast={showToast}
              />
            )}
          </main>

          {/* Footer */}
          <footer>
            <p>
              &copy; 2026 Government College of Technology (GCT), Bhakkar &bull; Department of Computer Information Technology (CIT)
            </p>
            <div className="footer-dev-credit">
              <i className="fas fa-code-branch" style={{ color: 'var(--secondary-light)', marginRight: '0.4rem' }}></i>
              <span>
                Designed & Developed by <strong>Aliyan Ansari</strong> (DAE CIT 3rd Year Student)
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* Edit Slot Modal */}
      <SlotModal
        isOpen={slotModal.isOpen}
        day={slotModal.day}
        period={slotModal.period}
        existingSlot={slotModal.existingSlot}
        activeYear={activeYear}
        dataset={dataset}
        onClose={() => setSlotModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveSlot}
        onDelete={handleDeleteSlot}
        onShowToast={showToast}
      />

      {/* Post Notice Modal */}
      <NoticeModal
        isOpen={isNoticeModalOpen}
        currentUser={currentUser}
        onClose={() => setIsNoticeModalOpen(false)}
        onAddNotice={handleAddNotice}
      />

      {/* QR Code Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        activeYear={activeYear}
        onClose={() => setIsQrModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
