/**
 * Enterprise Academic Operations Platform REST API Engine
 * Layered Architecture: Routes → Controllers → Services → Models
 * GCT Bhakkar DAE CIT Department
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config/env');
const { connectDatabase } = require('./config/db');
const logger = require('./config/logger');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiV1Routes = require('./routes/apiV1Routes');

const app = express();

// Request Tracing & Logging Middleware
app.use((req, res, next) => {
  req.requestId = 'req-' + Math.random().toString(36).substring(2, 9);
  logger.info(`HTTP ${req.method} ${req.originalUrl}`, { requestId: req.requestId, ip: req.ip });
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(authMiddleware);

// Connect to Database
connectDatabase();

// 1. UPTIME HEALTH & READINESS PROBES
app.get(['/health', '/ready', '/api/v1/health', '/api/v1/ready'], (req, res) => {
  const mongoose = require('mongoose');
  const isDbReady = mongoose.connection.readyState === 1;

  res.status(isDbReady ? 200 : 503).json({
    status: isDbReady ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    institution: 'GCT Bhakkar DAE CIT Department',
    shift: 'Afternoon Shift (12:10 PM - 05:20 PM)',
    tenant: config.tenantId,
    database: isDbReady ? 'connected' : 'disconnected'
  });
});

// 2. OPENAPI SWAGGER DOCS API
app.get('/api/docs', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "GCT Bhakkar Academic Operations API",
      version: "3.5.0",
      description: "Enterprise Academic Operations API for Scheduling Engine, Attendance, Substitutions, & RBAC Security"
    },
    paths: {
      "/health": { get: { summary: "System Uptime Probe" } },
      "/api/v1/scheduling/check-conflict": { post: { summary: "Server-side conflict engine check" } },
      "/api/v1/scheduling/generate": { post: { summary: "Automated timetable generator" } },
      "/api/v1/attendance/check-in": { post: { summary: "QR attendance check-in" } },
      "/api/v1/calendar/feed.ics": { get: { summary: "Dynamic .ics calendar subscription feed" } }
    }
  });
});

// 3. ROUTE MODULES
app.use('/api/auth', authRoutes);
app.use('/api/v1/scheduling', schedulingRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1', apiV1Routes);

// Catch-all 404 for API routes (guarantee JSON error responses)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found',
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

// Fallback to SPA index.html (excluding API endpoints)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API route not found',
      message: `API route ${req.path} not found`
    });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Bootstrapper
app.listen(config.port, () => {
  logger.info(`🚀 GCT Bhakkar Academic Operations Platform running on http://localhost:${config.port}`);
});
