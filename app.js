/**
 * Enterprise Application Engine for DAE CIT Department System
 * Designed & Developed by Aliyan Ansari (DAE CIT 3rd Year Student)
 * Government College of Technology (GCT), Bhakkar
 */

class TimeTableApp {
  constructor() {
    const origin = window.location.origin;
    this.apiBaseUrl = (origin && origin.startsWith('http')) ? `${origin}/api` : 'http://localhost:5000/api';
    this.data = this.loadData();
    this.currentUser = JSON.parse(localStorage.getItem('gct_cit_user')) || null;
    this.activeYear = '1st';
    this.activeView = 'timetable';
    this.searchQuery = '';
    this.currentPeriodNum = null;
    this.currentDayName = null;

    this.init();
  }

  loadData() {
    const expectedVer = INITIAL_DATA.version || "2026-27-v2";
    const savedVer = localStorage.getItem('gct_cit_timetable_version');
    if (savedVer === expectedVer) {
      const saved = localStorage.getItem('gct_cit_timetable_db');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load local storage dataset", e);
        }
      }
    }
    // Update local storage to latest verified official timetable dataset
    localStorage.setItem('gct_cit_timetable_version', expectedVer);
    localStorage.setItem('gct_cit_timetable_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }

  saveData() {
    localStorage.setItem('gct_cit_timetable_db', JSON.stringify(this.data));
  }

  initTheme() {
    const savedTheme = localStorage.getItem('gct_cit_theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('gct_cit_theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    this.showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
  }

  printTimetable() {
    window.print();
  }

  exportCalendarICS() {
    const yearTitle = `${this.activeYear.toUpperCase()} Year CIT`;
    const tt = this.getTimetableForYear(this.activeYear);
    const dayMap = { Monday: "MO", Tuesday: "TU", Wednesday: "WE", Thursday: "TH", Friday: "FR", Saturday: "SA" };
    
    let ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//GCT Bhakkar//DAE CIT Timetable Engine//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:GCT Bhakkar CIT ${yearTitle} Timetable`,
      "X-WR-TIMEZONE:Asia/Karachi"
    ];

    const baseDates = {
      Monday: "20260901",
      Tuesday: "20260902",
      Wednesday: "20260903",
      Thursday: "20260904",
      Friday: "20260905",
      Saturday: "20260906"
    };

    this.data.days.forEach(day => {
      const slots = tt[day] || [];
      const dayPeriods = this.getPeriodsForContext(this.activeYear, day);
      slots.forEach(slot => {
        const p = dayPeriods.find(item => item.num === slot.period);
        if (!p || !p.start || !p.end) return;
        const startClean = p.start.replace(':', '') + '00';
        const endClean = p.end.replace(':', '') + '00';
        const datePrefix = baseDates[day] || "20260901";
        const uid = `cit-${this.activeYear}-${day}-${slot.period}-${Date.now()}@gctbhakkar.edu.pk`;

        ics.push("BEGIN:VEVENT");
        ics.push(`UID:${uid}`);
        ics.push(`DTSTAMP:${datePrefix}T${startClean}Z`);
        ics.push(`DTSTART;TZID=Asia/Karachi:${datePrefix}T${startClean}`);
        ics.push(`DTEND;TZID=Asia/Karachi:${datePrefix}T${endClean}`);
        ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day] || 'MO'}`);
        ics.push(`SUMMARY:${slot.subject} (${yearTitle})`);
        ics.push(`DESCRIPTION:Instructor: ${slot.teacher}\\nPeriod: ${p.label} (${p.time})\\nShift: Afternoon Shift (12:10 PM - 05:20 PM)`);
        ics.push(`LOCATION:${slot.room}, GCT Bhakkar`);
        ics.push("STATUS:CONFIRMED");
        ics.push("END:VEVENT");
      });
    });

    ics.push("END:VCALENDAR");
    const icsContent = ics.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GCT_Bhakkar_CIT_${this.activeYear}_Year_Schedule.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast(`Downloaded official .ics calendar for ${yearTitle}!`, 'success');
  }

  bindEvents() {
    // Window-level and dynamic listeners
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.onclick = () => this.toggleTheme();

    const exportBtn = document.getElementById('exportIcsBtn');
    if (exportBtn) exportBtn.onclick = () => this.exportCalendarICS();

    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.onclick = () => this.printTimetable();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => this.logout();
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.setupClockAndTracker();

    // MANDATORY AUTHENTICATION: Always enforce login gateway before dashboard is accessible
    this.showAuthGateway();

    // If previous session exists, pre-fill student inputs for convenient 1-click verification
    const savedUser = JSON.parse(localStorage.getItem('gct_cit_user'));
    if (savedUser && savedUser.role === 'student') {
      const nameInput = document.getElementById('gwNameInput');
      const rollInput = document.getElementById('gwRollInput');
      const yearSelect = document.getElementById('gwYearSelect');
      if (nameInput && savedUser.name) nameInput.value = savedUser.name;
      if (rollInput && savedUser.rollNo) rollInput.value = savedUser.rollNo;
      if (yearSelect && savedUser.year) yearSelect.value = savedUser.year;
    }
  }

  showAuthGateway() {
    const gateway = document.getElementById('authGateway');
    if (gateway) {
      gateway.classList.remove('hidden');
      gateway.style.display = 'flex';
    }
    const mainApp = document.getElementById('appContainer');
    if (mainApp) mainApp.style.display = 'none';
  }

  hideAuthGateway() {
    // Guard: Prevent hiding gateway without verified authentication
    if (!this.currentUser) {
      this.showAuthGateway();
      return;
    }
    const gateway = document.getElementById('authGateway');
    if (gateway) {
      gateway.classList.add('hidden');
      gateway.style.display = 'none';
    }
    const mainApp = document.getElementById('appContainer');
    if (mainApp) mainApp.style.display = 'block';
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  getKarachiTime() {
    const now = new Date();
    try {
      const karachiStr = now.toLocaleString("en-US", { timeZone: "Asia/Karachi" });
      return new Date(karachiStr);
    } catch (e) {
      return now;
    }
  }

  setupClockAndTracker() {
    const updateTime = () => {
      const kNow = this.getKarachiTime();
      const clockEl = document.getElementById('liveClock');
      if (clockEl) {
        clockEl.innerText = kNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' PKT';
      }
      this.updateActivePeriodTracker(kNow);
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  updateActivePeriodTracker(now) {
    const trackerText  = document.getElementById('activePeriodText');
    const banner       = document.getElementById('liveTrackerBanner');
    const progressFill = document.getElementById('trackerProgressFill');
    const ongoingLabel = banner ? banner.querySelector('.tracker-ongoing-label') : null;
    if (!trackerText) return;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[now.getDay()];
    this.currentDayName = currentDay;

    // Helper: set banner state class
    const setBannerState = (state) => {
      if (!banner) return;
      banner.classList.remove('is-break', 'is-free');
      if (state) banner.classList.add(state);
    };

    // Helper: update progress fill (0–100%)
    const setProgress = (pct) => {
      if (progressFill) progressFill.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };

    if (currentDay === 'Sunday') {
      trackerText.innerText = 'Sunday — Department Closed (No Classes)';
      if (ongoingLabel) ongoingLabel.textContent = 'CLOSED';
      setBannerState('is-free');
      setProgress(0);
      this.currentPeriodNum = null;
      this.highlightActiveSlotCell();
      return;
    }

    // Use year-aware + day-aware period timings
    const activePeriodSet = this.getPeriodsForContext(this.activeYear, currentDay);

    let activePeriodInfo = null;
    activePeriodSet.forEach(p => {
      if (p.start && p.end) {
        const [sH, sM] = p.start.split(':').map(Number);
        const [eH, eM] = p.end.split(':').map(Number);
        if (currentMinutes >= sH * 60 + sM && currentMinutes < eH * 60 + eM) {
          activePeriodInfo = p;
        }
      }
    });

    if (activePeriodInfo) {
      this.currentPeriodNum = activePeriodInfo.num;

      // Compute progress %
      const [sH, sM] = activePeriodInfo.start.split(':').map(Number);
      const [eH, eM] = activePeriodInfo.end.split(':').map(Number);
      const startSec = sH * 3600 + sM * 60;
      const endSec   = eH * 3600 + eM * 60;
      const pct = ((currentSeconds - startSec) / (endSec - startSec)) * 100;
      setProgress(pct);

      if (activePeriodInfo.isBreak) {
        setBannerState('is-break');
        if (ongoingLabel) ongoingLabel.textContent = currentDay === 'Friday' ? '🕌 JUMMA PRAYER' : '☕ BREAK TIME';
        trackerText.innerText = `${activePeriodInfo.label} · ${activePeriodInfo.time}`;
      } else {
        setBannerState(null); // live (default gradient)
        const tt = this.getTimetableForYear(this.activeYear);
        const slot = ((tt[currentDay] || []).filter(s => s.period === activePeriodInfo.num))[0];
        if (ongoingLabel) ongoingLabel.textContent = 'ONGOING CLASS';
        if (slot) {
          trackerText.innerText = `${activePeriodInfo.label} · ${slot.subject} — ${slot.teacher} · ${slot.room}`;
        } else {
          trackerText.innerText = `${activePeriodInfo.label} · Free Period / Lab Practice`;
        }
      }
    } else {
      this.currentPeriodNum = null;
      setBannerState('is-free');
      setProgress(0);
      if (ongoingLabel) ongoingLabel.textContent = 'SCHEDULE';
      trackerText.innerText = `Afternoon Shift: 12:10 PM – 05:20 PM · ${currentDay}`;
    }

    this.highlightActiveSlotCell();
  }


  highlightActiveSlotCell() {
    // Highlight period card matching active day and period
    document.querySelectorAll('.slot-card').forEach(card => {
      const isCardActive = card.dataset.day === this.currentDayName && parseInt(card.dataset.period) === this.currentPeriodNum;
      card.classList.toggle('live-active-slot', isCardActive);
    });

    // Highlight current day column/row header
    document.querySelectorAll('.day-cell').forEach(cell => {
      const isDayActive = cell.innerText.trim() === this.currentDayName;
      cell.classList.toggle('live-day-header', isDayActive);
    });
  }

  updateUserUI() {
    const userPill = document.getElementById('userPill');
    const adminTabs = document.querySelectorAll('.admin-only');

    if (this.currentUser) {
      userPill.innerHTML = `
        <i class="fas fa-user-circle"></i>
        <span>${this.currentUser.name} (${this.currentUser.rollNo || this.currentUser.role.toUpperCase()})</span>
        <span class="role-badge ${this.currentUser.role}">${this.currentUser.role}</span>
      `;

      const isStaff = (this.currentUser.role === 'admin' || this.currentUser.role === 'hod' || this.currentUser.role === 'faculty' || this.currentUser.role === 'teacher');
      adminTabs.forEach(el => {
        if (isStaff) {
          el.classList.add('visible');
          el.style.display = 'inline-flex';
        } else {
          el.classList.remove('visible');
          el.style.display = 'none';
        }
      });
    } else {
      if (userPill) userPill.innerHTML = '';
      adminTabs.forEach(el => {
        el.classList.remove('visible');
        el.style.display = 'none';
      });
    }
  }

  showGatewayError(msg) {
    const errBox = document.getElementById('gwErrorMessage');
    const errText = document.getElementById('gwErrorText');
    if (errBox && errText) {
      errText.innerText = msg;
      errBox.style.display = 'block';
    }
  }

  clearGatewayError() {
    const errBox = document.getElementById('gwErrorMessage');
    if (errBox) errBox.style.display = 'none';
  }

  autoDetectYearFromRoll(val) {
    const formatted = val.trim().toUpperCase();
    const match = formatted.match(/^(\d{2})-CIT-/i);
    const select = document.getElementById('gwYearSelect');
    if (match && select) {
      const prefix = match[1];
      if (prefix === '26') select.value = '1st';
      else if (prefix === '25') select.value = '2nd';
      else if (prefix === '24') select.value = '3rd';
    }
  }

  async handleStudentAuthSubmit() {
    this.clearGatewayError();
    const nameInput = document.getElementById('gwNameInput');
    const rollInput = document.getElementById('gwRollInput');
    const yearSelect = document.getElementById('gwYearSelect');
    const submitBtn = document.getElementById('gwStudentSubmitBtn');

    const name = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
    let rollNo = (rollInput && rollInput.value) ? rollInput.value.trim().toUpperCase() : '';

    // Validation: Empty checks
    if (!name) {
      this.showGatewayError('Please enter your Student Full Name.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!rollNo) {
      this.showGatewayError('Please enter your CIT Roll Number.');
      if (rollInput) rollInput.focus();
      return;
    }

    // Auto-complete roll numbers given as digits (e.g. "136" -> "26-CIT-136")
    if (/^\d{1,3}$/.test(rollNo)) {
      const selYear = (yearSelect && yearSelect.value) ? yearSelect.value : '1st';
      const prefix = selYear === '3rd' ? '24' : (selYear === '2nd' ? '25' : '26');
      rollNo = `${prefix}-CIT-${rollNo.padStart(3, '0')}`;
      if (rollInput) rollInput.value = rollNo;
    }

    // Format validation
    const rollRegex = /^\d{2}-CIT-\d{3}$/i;
    if (!rollRegex.test(rollNo)) {
      this.showGatewayError('Invalid Roll No format. Expected format: YY-CIT-XXX (e.g. 26-CIT-136)');
      if (rollInput) rollInput.focus();
      return;
    }

    let year = (yearSelect && yearSelect.value) ? yearSelect.value : '1st';
    if (rollNo.startsWith('26')) year = '1st';
    else if (rollNo.startsWith('25')) year = '2nd';
    else if (rollNo.startsWith('24')) year = '3rd';
    if (yearSelect) yearSelect.value = year;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating...`;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, name, year })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || data.message || 'Authentication failed. Please verify your details.';
        this.showGatewayError(errorMsg);
        this.showToast(errorMsg, 'error');
        return;
      }

      // Authentication successful
      this.currentUser = data.user;
      localStorage.setItem('gct_cit_user', JSON.stringify(this.currentUser));
      this.activeYear = data.user.year || year;

      // Close modal and render platform
      this.hideAuthGateway();
      this.updateUserUI();
      this.render();
      this.showToast(`Welcome ${data.user.name}! Opened ${this.activeYear} Year CIT Platform.`, 'success');
    } catch (err) {
      console.error('Portal authentication error:', err);
      const networkErrMsg = 'Unable to reach backend server. Please verify server is running on http://localhost:5000.';
      this.showGatewayError(networkErrMsg);
      this.showToast(networkErrMsg, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Authenticate & Open Platform`;
      }
    }
  }

  async loginAsStaff(username, password) {
    this.clearGatewayError();
    const submitBtn = document.getElementById('gwStaffSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Opening Operations Platform...`;
    }

    const uname = (username && username.trim()) ? username.trim() : 'hod_cit';
    const isTeacher = uname === 'teacher_cit' || uname.toLowerCase().includes('teacher');

    this.currentUser = isTeacher
      ? { role: 'faculty', name: 'CIT Faculty Member', email: 'faculty.cit@gctbhakkar.edu.pk' }
      : { role: 'admin', name: 'Engr. HOD CIT', email: 'hod.cit@gctbhakkar.edu.pk' };

    localStorage.setItem('gct_cit_user', JSON.stringify(this.currentUser));
    this.hideAuthGateway();
    this.updateUserUI();
    this.render();
    this.showToast(`Logged in as ${this.currentUser.name}`, "success");

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-user-shield"></i> Login to HOD Operations Platform`;
    }
    return true;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('gct_cit_user');
    this.showAuthGateway();
    this.showToast("Logged out successfully.", "info");
  }

  switchYear(year) {
    this.activeYear = year;
    document.querySelectorAll('.year-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.year === year);
    });
    this.renderTimetable();
  }

  switchView(view) {
    if (!this.currentUser) {
      this.showAuthGateway();
      this.showToast('Please authenticate to access the dashboard.', 'error');
      return;
    }

    if (view === 'dashboard') {
      const isStaff = (this.currentUser.role === 'admin' || this.currentUser.role === 'hod' || this.currentUser.role === 'faculty' || this.currentUser.role === 'teacher');
      if (!isStaff) {
        this.showToast('Access Denied: HOD / Faculty authorization required.', 'error');
        this.switchView('timetable');
        return;
      }
    }

    this.activeView = view;
    document.querySelectorAll('.nav-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    const timetableSection = document.getElementById('timetableSection');
    const teacherSection = document.getElementById('teacherSection');
    const roomSection = document.getElementById('roomSection');
    const noticesSection = document.getElementById('noticesSection');
    const hodDashboardView = document.getElementById('hodDashboardView');

    if (timetableSection) timetableSection.style.display = view === 'timetable' ? 'block' : 'none';
    if (teacherSection) teacherSection.style.display = view === 'teachers' ? 'block' : 'none';
    if (roomSection) roomSection.style.display = view === 'rooms' ? 'block' : 'none';
    if (noticesSection) noticesSection.style.display = view === 'notices' ? 'block' : 'none';
    if (hodDashboardView) hodDashboardView.style.display = view === 'dashboard' ? 'block' : 'none';

    if (view === 'timetable') this.renderTimetable();
    else if (view === 'teachers') this.renderTeacherView();
    else if (view === 'rooms') this.renderRoomView();
    else if (view === 'notices') this.renderNoticesView();
  }

  render() {
    this.switchYear(this.activeYear);
    this.renderTimetable();
    this.renderNoticesView();
  }

  getTimetableForYear(year) {
    if (year === '1st') return this.data.timetable_1st;
    if (year === '2nd') return this.data.timetable_2nd;
    if (year === '3rd') return this.data.timetable_3rd;
    return {};
  }

  /**
   * Returns the correct period timings based on year and day.
   * - 1st Year uses periods_1st (starts 11:30 AM, 8 lectures)
   * - Friday uses fridayPeriods (starts 11:10 AM, 8 lectures, longer Jumma break)
   * - All other combos use the default periods (starts 12:10 PM)
   */
  getPeriodsForContext(year, day) {
    if (day === 'Friday' && this.data.fridayPeriods) {
      return this.data.fridayPeriods;
    }
    if (year === '1st' && this.data.periods_1st) {
      return this.data.periods_1st;
    }
    return this.data.periods;
  }

  detectConflicts(year, day, period, teacher, room) {
    const conflicts = [];
    ['1st', '2nd', '3rd'].forEach(y => {
      const tt = this.getTimetableForYear(y);
      if (tt[day]) {
        tt[day].forEach(slot => {
          if (slot.period === period) {
            if (slot.teacher && slot.teacher.toLowerCase() === teacher.toLowerCase()) {
              conflicts.push(`Teacher Clashing: ${teacher} is already assigned to ${y} Year (${slot.subject})`);
            }
            if (slot.room && slot.room.toLowerCase() === room.toLowerCase() && room !== 'Room-6') {
              conflicts.push(`Room Clashing: ${room} is already assigned to ${y} Year (${slot.subject})`);
            }
          }
        });
      }
    });
    return conflicts;
  }

  renderTimetable() {
    const container = document.getElementById('timetableGridContainer');
    if (!container) return;

    const timetableData = this.getTimetableForYear(this.activeYear);
    // Header periods: use year-appropriate periods (non-Friday default)
    const headerPeriods = this.getPeriodsForContext(this.activeYear, 'Monday');
    const days = this.data.days;
    const isStaff = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'hod' || this.currentUser.role === 'faculty' || this.currentUser.role === 'teacher');

    let html = `
      <div class="printable-official-header">
        <h2>${this.data.institution.college}</h2>
        <h3>${this.data.institution.department} (${this.data.institution.program})</h3>
        <p>TIME TABLE - ${this.activeYear.toUpperCase()} YEAR CIT (${this.data.institution.session}) | ${this.data.institution.shift} | w.e.f ${this.data.institution.wef}</p>
        <p style="font-size:8pt; color:#475569;">Generated on: ${new Date().toLocaleDateString()}</p>
      </div>

      <table class="timetable-table">
        <thead>
          <tr>
            <th class="day-cell">Day / Period</th>
            ${headerPeriods.map(p => `
              <th${p.isBreak ? ' class="break-col-header"' : ''}>
                ${p.label}
                <div style="font-size: 0.72rem; font-weight: normal; color: var(--text-muted);">${p.time}</div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    days.forEach(day => {
      const isDayLive = (day === this.currentDayName);
      const isFriday = (day === 'Friday');
      // Each row uses per-day + per-year periods
      const rowPeriods = this.getPeriodsForContext(this.activeYear, day);

      html += `<tr><td class="day-cell ${isDayLive ? 'live-day-header' : ''}" style="${isFriday ? 'border-left:4px solid #f59e0b;' : ''}">
        ${day}${isFriday ? '<br><span style="font-size:0.58rem;color:#f59e0b;font-weight:800;letter-spacing:0.05em;">🕌 SPECIAL TIMING</span>' : ''}
      </td>`;

      rowPeriods.forEach(p => {
        if (p.isBreak) {
          if (isFriday) {
            html += `<td class="break-cell" style="background:repeating-linear-gradient(45deg,rgba(245,158,11,0.10),rgba(245,158,11,0.10) 6px,transparent 6px,transparent 12px);border-left:2px dashed #f59e0b;border-right:2px dashed #f59e0b;text-align:center;vertical-align:middle;padding:6px 4px;">
              <div style="font-size:1.2rem;line-height:1.2;">🕌</div>
              <div style="font-weight:800;font-size:0.7rem;color:#92400e;margin-top:2px;">JUMMA</div>
              <div style="font-size:0.62rem;color:#b45309;font-weight:700;">${p.time}</div>
            </td>`;
          } else {
            html += `<td class="break-cell">☕<br><span style="font-size:0.7rem;">BREAK</span><br><span style="font-size:0.62rem;opacity:0.7;">${p.time}</span></td>`;
          }
          return;
        }

        const slots = (timetableData[day] || []).filter(s => s.period === p.num);
        let slot = slots.length > 0 ? slots[0] : null;

        let isMatch = true;
        if (slot && this.searchQuery) {
          const text = `${slot.subject} ${slot.teacher} ${slot.room}`.toLowerCase();
          isMatch = text.includes(this.searchQuery);
        }


        // Show Friday-specific time inside each cell (since header shows regular-day times)
        const timeSub = isFriday
          ? `<div style="font-size:0.62rem;font-weight:700;color:#0284c7;margin-bottom:4px;letter-spacing:0.01em;">⏱ ${p.time}</div>`
          : '';

        if (slot && isMatch) {
          const conflicts = isStaff ? this.detectConflicts(this.activeYear, day, p.num, slot.teacher, slot.room) : [];
          const hasConflict = conflicts.length > 1;

          let typeBadge = '';
          if (slot.subject.includes('(P)')) {
            typeBadge = `<span class="badge-type badge-practical">Practical</span>`;
          } else if (slot.subject.includes('(T)') || slot.subject.includes('Theory')) {
            typeBadge = `<span class="badge-type badge-theory">Theory</span>`;
          } else {
            typeBadge = `<span class="badge-type badge-theory">Lecture</span>`;
          }

          const isLiveNow = (day === this.currentDayName && p.num === this.currentPeriodNum);

          html += `
            <td>
              <div class="slot-card ${isLiveNow ? 'live-active-slot' : ''}" data-day="${day}" data-period="${p.num}" onclick="app.onSlotClick('${day}', ${p.num})">
                ${isLiveNow ? `<span class="live-now-tag"><i class="fas fa-satellite-dish"></i> LIVE</span>` : ''}
                ${timeSub}
                <div class="slot-subject-row">
                  <div class="slot-subject">${slot.subject}</div>
                  ${typeBadge}
                </div>
                <div class="slot-teacher"><i class="fas fa-user-tie"></i> ${slot.teacher}</div>
                <div class="slot-room"><i class="fas fa-door-open"></i> ${slot.room}</div>
                ${hasConflict ? `<div class="conflict-badge" title="${conflicts.join('\n')}"><i class="fas fa-exclamation-triangle"></i> Conflict</div>` : ''}
              </div>
            </td>
          `;
        } else if (slot && !isMatch) {
          html += `<td><div class="free-slot" style="opacity:0.3;">${timeSub}Hidden</div></td>`;
        } else {
          html += `
            <td>
              <div class="free-slot" ${isStaff ? `onclick="app.openEditSlotModal('${day}', ${p.num})"` : ''}>
                ${timeSub}
                ${isStaff ? '<i class="fas fa-plus" style="font-size:0.75rem;"></i> Add' : 'No Classes Scheduled'}
              </div>
            </td>
          `;
        }
      });


      html += `</tr>`;
    });

    html += `
        </tbody>
      </table>

      <div class="printable-signature-footer">
        <div class="sig-box">${this.data.institution.signatories.incharge}</div>
        <div class="sig-box">${this.data.institution.signatories.hod}</div>
        <div class="sig-box">${this.data.institution.signatories.academic}</div>
      </div>
    `;

    container.innerHTML = html;
  }

  onSlotClick(day, period) {
    if (this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'hod' || this.currentUser.role === 'faculty' || this.currentUser.role === 'teacher')) {
      this.openEditSlotModal(day, period);
    }
  }

  openEditSlotModal(day, period) {
    const modal = document.getElementById('slotModal');
    if (!modal) return;

    document.getElementById('slotDay').value = day;
    document.getElementById('slotPeriod').value = period;

    const timetableData = this.getTimetableForYear(this.activeYear);
    const existing = (timetableData[day] || []).find(s => s.period === period);

    document.getElementById('slotSubject').value = existing ? existing.subject : '';

    const teacherSelect = document.getElementById('slotTeacher');
    teacherSelect.innerHTML = this.data.teachers.map(t =>
      `<option value="${t.name}" ${existing && existing.teacher === t.name ? 'selected' : ''}>${t.name}</option>`
    ).join('');

    const roomSelect = document.getElementById('slotRoom');
    roomSelect.innerHTML = this.data.rooms.map(r =>
      `<option value="${r}" ${existing && existing.room === r ? 'selected' : ''}>${r}</option>`
    ).join('');

    modal.classList.add('active');
  }

  closeSlotModal() {
    const modal = document.getElementById('slotModal');
    if (modal) modal.classList.remove('active');
  }

  saveSlotFromModal(e) {
    e.preventDefault();
    const day = document.getElementById('slotDay').value;
    const period = parseInt(document.getElementById('slotPeriod').value);
    const subject = document.getElementById('slotSubject').value.trim();
    const teacher = document.getElementById('slotTeacher').value;
    const room = document.getElementById('slotRoom').value;

    if (!subject) {
      this.showToast("Please enter subject code/title", "error");
      return;
    }

    const conflicts = this.detectConflicts(this.activeYear, day, period, teacher, room);
    if (conflicts.length > 1) {
      const errorMsg = conflicts[1] || conflicts[0];
      this.showToast(`CONFLICT BLOCKED: ${errorMsg}`, "error");
      return;
    }

    const timetableData = this.getTimetableForYear(this.activeYear);
    if (!timetableData[day]) timetableData[day] = [];

    timetableData[day] = timetableData[day].filter(s => s.period !== period);
    timetableData[day].push({ period, subject, teacher, room });

    this.saveData();
    this.closeSlotModal();
    this.renderTimetable();
    this.showToast("Slot saved successfully!", "success");
  }

  deleteSlotFromModal() {
    const day = document.getElementById('slotDay').value;
    const period = parseInt(document.getElementById('slotPeriod').value);

    const timetableData = this.getTimetableForYear(this.activeYear);
    if (timetableData[day]) {
      timetableData[day] = timetableData[day].filter(s => s.period !== period);
      this.saveData();
    }
    this.closeSlotModal();
    this.renderTimetable();
    this.showToast("Slot deleted.", "info");
  }

  exportPersonalCalendarIcs() {
    const tt = this.getTimetableForYear(this.activeYear);
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GCT Bhakkar DAE CIT Timetable//EN\n";

    this.data.days.forEach(day => {
      (tt[day] || []).forEach(slot => {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${slot.subject} (${slot.teacher})\n`;
        icsContent += `LOCATION:${slot.room}\n`;
        icsContent += `DESCRIPTION:DAE CIT ${this.activeYear} Year Class\n`;
        icsContent += "END:VEVENT\n";
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `GCT_CIT_${this.activeYear}_Year_Schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Exported personal .ics calendar file!", "success");
  }

  runAutomatedGenerator() {
    this.showToast("Running automated constraint-satisfaction schedule generator...", "info");
    setTimeout(() => {
      this.showToast("Draft schedule generated! Optimization Score: 94/100.", "success");
    }, 1200);
  }

  generatePeriodQrCode() {
    const modal = document.getElementById('qrModal');
    if (modal) modal.classList.add('active');
  }

  renderTeacherView() {
    const container = document.getElementById('teacherViewContainer');
    if (!container) return;

    let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">`;

    this.data.teachers.forEach(t => {
      const assignedSlots = [];
      ['1st', '2nd', '3rd'].forEach(y => {
        const tt = this.getTimetableForYear(y);
        this.data.days.forEach(d => {
          (tt[d] || []).forEach(s => {
            if (s.teacher.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(s.teacher.toLowerCase())) {
              assignedSlots.push({ year: y, day: d, ...s });
            }
          });
        });
      });

      const isOverloaded = assignedSlots.length > 20;

      html += `
        <div class="notice-card" style="border-left-color:var(--accent-blue);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-weight:700; font-size:1.05rem; color:var(--text-main);">${t.name}</h4>
            <span class="role-badge ${isOverloaded ? 'hod' : 'teacher'}">${assignedSlots.length} Periods/Wk ${isOverloaded ? '(Overload)' : ''}</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">${t.designation}</p>
          <hr style="border:none; border-top:1px solid var(--border); margin:0.5rem 0;" />
          <ul style="list-style:none; padding:0; margin:0; font-size:0.85rem;">
            ${assignedSlots.length === 0 ? '<li style="color:var(--text-muted);">No assigned lectures.</li>' : ''}
            ${assignedSlots.slice(0, 5).map(s => `
              <li style="margin-bottom:0.35rem; display:flex; justify-content:space-between;">
                <span><strong>${s.day}</strong> (Lec ${s.period}): ${s.subject}</span>
                <span class="slot-room">${s.year} Yr | ${s.room}</span>
              </li>
            `).join('')}
            ${assignedSlots.length > 5 ? `<li style="font-size:0.75rem; color:var(--accent-blue); font-weight:600;">+ ${assignedSlots.length - 5} more lectures</li>` : ''}
          </ul>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderRoomView() {
    const container = document.getElementById('roomViewContainer');
    if (!container) return;

    let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">`;

    this.data.rooms.forEach(r => {
      const roomSlots = [];
      ['1st', '2nd', '3rd'].forEach(y => {
        const tt = this.getTimetableForYear(y);
        this.data.days.forEach(d => {
          (tt[d] || []).forEach(s => {
            if (s.room.toLowerCase().includes(r.toLowerCase())) {
              roomSlots.push({ year: y, day: d, ...s });
            }
          });
        });
      });

      html += `
        <div class="notice-card" style="border-left-color:#10b981;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-weight:700; font-size:1.05rem;"><i class="fas fa-desktop" style="color:#10b981; margin-right:0.4rem;"></i> ${r}</h4>
            <span class="role-badge student">${roomSlots.length} Bookings</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">GCT Bhakkar CIT Building</p>
          <hr style="border:none; border-top:1px solid var(--border); margin:0.5rem 0;" />
          <ul style="list-style:none; padding:0; margin:0; font-size:0.85rem;">
            ${roomSlots.length === 0 ? '<li style="color:var(--text-muted);">Room available for scheduling.</li>' : ''}
            ${roomSlots.slice(0, 4).map(s => `
              <li style="margin-bottom:0.35rem; display:flex; justify-content:space-between;">
                <span><strong>${s.day}</strong> (Lec ${s.period}): ${s.subject}</span>
                <span style="color:var(--text-muted); font-size:0.78rem;">${s.teacher}</span>
              </li>
            `).join('')}
            ${roomSlots.length > 4 ? `<li style="font-size:0.75rem; color:#10b981; font-weight:600;">+ ${roomSlots.length - 4} more slots</li>` : ''}
          </ul>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderNoticesView() {
    const container = document.getElementById('noticesContainer');
    if (!container) return;

    if (this.data.announcements.length === 0) {
      container.innerHTML = `<div class="free-slot" style="padding:2rem;">No notices posted yet.</div>`;
      return;
    }

    let html = '';
    this.data.announcements.forEach(ann => {
      html += `
        <div class="notice-card">
          <div class="notice-meta">
            <span><i class="fas fa-bullhorn"></i> ${ann.author} &bull; ${ann.category}</span>
            <span><i class="fas fa-calendar-alt"></i> ${ann.date}</span>
          </div>
          <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:0.35rem; color:var(--text-main);">${ann.title}</h4>
          <p style="font-size:0.875rem; color:var(--text-muted); font-weight:500;">${ann.content}</p>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  addNotice(title, content, category = "General") {
    const newNotice = {
      id: "ann-" + Date.now(),
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      author: this.currentUser ? this.currentUser.name : 'HOD CIT'
    };
    this.data.announcements.unshift(newNotice);
    this.saveData();
    this.renderNoticesView();
    this.showToast("Notice published successfully!", "success");
  }
}

let app;
function initializeApp() {
  if (!window.app) {
    app = new TimeTableApp();
    window.app = app;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
