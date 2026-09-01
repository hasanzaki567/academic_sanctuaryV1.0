import { Request, Response } from 'express';
import { announcements, currentUser } from '../data/db.js';

// ── GET /api/announcements ────────────────────────────────────────────────────
export function getAnnouncements(req: Request, res: Response): void {
  const { classroomId } = req.query;
  const result = classroomId
    ? announcements.filter((a) => a.classroomId === classroomId)
    : announcements;
  res.json(result);
}

// ── POST /api/announcements ───────────────────────────────────────────────────
export function createAnnouncement(req: Request, res: Response): void {
  const { title, description, isUrgent = false, classroomId = 'cls-1' } = req.body;

  const newAnn = {
    id: `ann-${Date.now()}`,
    classroomId,
    title: title || 'New Announcement',
    description: description || '',
    timestamp: 'Just now',
    author: currentUser?.name ?? 'Admin',
    isUrgent: Boolean(isUrgent),
  };

  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
}
