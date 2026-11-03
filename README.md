# DAE CIT Academic Operations Platform — React Application

Enterprise Academic Operations Platform for the **Department of Computer Information Technology (CIT)** at **Government College of Technology (GCT), Bhakkar**.

- **Session**: Self Finance (2026–27)
- **Shift**: Afternoon Shift (12:10 PM – 05:20 PM)
- **Revised**: Effective w.e.f 14-09-2026
- **Designed & Developed by**: Aliyan Ansari (DAE CIT 3rd Year)

---

## 🌟 Core Features & Business Logic Preserved

1. **Mandatory Authentication Gateway**:
   - **Student Access**: Roll number validation with year auto-detection (`26-CIT` → 1st Year, `25-CIT` → 2nd Year, `24-CIT` → 3rd Year) and shorthand completion (e.g. `105` → `26-CIT-105`).
   - **HOD / Faculty Portal**: Dedicated administrative portal for Department Head and Teaching Staff.
   - Persistent user sessions and profile badge in header.

2. **Live Active Period Tracker**:
   - Real-time time synchronization with Pakistan Standard Time (`Asia/Karachi`).
   - Period-specific progress bar indicator (0–100%).
   - Automatic handling of Jumma Prayer timing on Friday (11:10 AM start with extended 1:10 PM – 2:00 PM Jumma break) and 1st Year shifted schedule (11:30 AM start).
   - Live glowing card indicator with `LIVE` satellite pulse.

3. **Timetable Matrix & Conflict Detection**:
   - Multi-year switching (1st Year, 2nd Year, 3rd Year).
   - Interactive schedule with theory vs practical badges.
   - Conflict detection blocking clashing room or teacher allocations across sections.
   - Official signature block (Time Table Incharge, HOD CIT, Academic Incharge).

4. **Faculty Workload & Lab Utilization Views**:
   - Faculty view tracking assigned periods per week and overload alerts (>20 periods/week).
   - Lab usage tracking across Computer Lab-1, Software Lab, Autocad Lab, Applied Electronics Lab, etc.

5. **HOD Operations Platform**:
   - Constraint-satisfaction automated draft timetable generator.
   - Dynamic 15-minute rotating QR code attendance generator.
   - Accreditation CSV export for PBTE & DAE quality audits.
   - Smart substitution engine recommending available faculty members based on specialization and workload.
   - Timetable reset to official w.e.f 14-09-2026 revision.

6. **Calendar & PDF Export**:
   - RFC-5545 `.ics` iCalendar subscription export.
   - Print-optimized PDF timetable layout.
   - Instant search filter with `⌘K` / `Ctrl+K` shortcut.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Premium GCT Bhakkar Glassmorphism Design System (CSS tokens, dark/light theme)
- **Icons & Typography**: FontAwesome 6, Plus Jakarta Sans, Inter, JetBrains Mono

---

## 💻 Development

```bash
# Start development server
npm run dev

# Build production bundle
npm run build
```