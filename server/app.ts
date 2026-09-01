import express from 'express';
import authRoutes from './routes/auth.routes.js';
import classroomRoutes from './routes/classroom.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import materialRoutes from './routes/material.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import examRoutes from './routes/exam.routes.js';
import memberRoutes from './routes/member.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(express.json());

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/members', memberRoutes);

// ── Error Handling (must be last) ──────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
