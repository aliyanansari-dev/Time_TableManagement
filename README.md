# DAE CIT Time‑Table Management Platform

## Overview
A full‑stack Next.js 14 + TypeScript monorepo for the **Government College of Technology, Bhakkar – CIT Afternoon Shift** timetable system.

- Secure student/HOD login (JWT + bcrypt)
- Shift‑aware schedule (regular days vs. Friday)
- Double‑lecture merged blocks with `×2` badge
- Live‑class banner, dark mode, PWA, PDF/Excel export
- Faculty workload, lab usage, analytics, notices

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Zustand, TanStack Query, Framer Motion, Lucide React, Sonner
- **Backend**: Next.js API routes (Node) with Mongoose ODM, MongoDB (`gct_bhakkar_cit`)
- **Auth**: JWT, bcrypt
- **Extras**: PWA, Cmd+K palette, live clock, accessibility (WCAG AA), SEO

## Repository Layout
```
DAE‑CIT‑Timetable/
├─ backend/               # API routes and Mongoose models
├─ frontend/              # Next.js app (src/…)
├─ scripts/               # Seed script and utilities
├─ docs/                  # Architecture & design docs
├─ .env.example           # Environment variable template
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md               # (this file)
```

## Getting Started
1. **Prerequisites**
   - Node 20+ (`nvm` recommended)
   - pnpm (`npm i -g pnpm`)
   - MongoDB running locally (`mongodb://localhost:27017/gct_bhakkar_cit`)
2. **Install**
   ```bash
   pnpm install
   ```
3. **Configure**
   Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`.
4. **Seed the database**
   ```bash
   pnpm run seed
   ```
5. **Run development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

## Scripts
- `pnpm dev` – Start both backend API and frontend dev server (via turborepo).
- `pnpm build` – Production build.
- `pnpm start` – Run built app.
- `pnpm seed` – Populate MongoDB with shifts, teachers, subjects, rooms, timetable, and sample users.
- `pnpm lint` – Lint & format code.
- `pnpm test` – Run unit & integration tests.

## Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/xyz`).
3. Follow existing linting & testing scripts.
4. Submit a PR with description and screenshots (if UI changes).

---
*Developed by **Aliyan Ansari** (DAE CIT 3rd Year) – Government College of Technology, Bhakkar.*
### Government College of Technology (GCT), Bhakkar
**Session**: Self Finance (2026-27) | **Shift**: Afternoon Shift (12:10 PM - 05:20 PM)
**Designed & Developed by**: Aliyan Ansari (DAE CIT 3rd Year Student)

---

## 🌟 Production System Features

1. **Self Finance Afternoon Shift Timings (12:10 PM - 05:20 PM)**:
   - 8 daily periods + Break/Prayer slot formatted specifically for 12:10 PM to 05:20 PM.

2. **Real-Time Live Lecture Cell Highlighting**:
   - The ongoing class period cell in the active timetable grid dynamically glows with an animated pulse border, status pill (`LIVE`), and countdown tracker matching the system clock!

3. **Server-Side Conflict Engine & Toast Alerts**:
   - Blocks double booking attempts for teachers or labs across different year levels and displays an inline toast notification error.

4. **Role Enforcement & Security**:
   - **Student**: Read-only, search, personal calendar export.
   - **Faculty**: Workload analytics, substitution workflow.
   - **Admin/HOD**: Full CRUD, versioning, audit logs, database snapshot export.

5. **Personal Calendar Exporter (`.ics`)**:
   - Export your personal timetable schedule directly to Apple Calendar, Google Calendar, or Outlook (`.ics` format).

---

## 🚀 Quick Launch Instructions

### Option A: Open Directly in Web Browser (Instant)
👉 **[file:///d:/Time%20Management%20System/index.html](file:///d:/Time%20Management%20System/index.html)**

### Option B: Run Full-Stack Express + MongoDB Server
```bash
cd "D:\Time Management System"
node server.js
```
Open browser at: `http://localhost:5000`

---

## 🧪 Run Automated Conflict Engine Unit Tests