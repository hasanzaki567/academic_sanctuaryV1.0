import { Request, Response } from 'express';
import { members } from '../data/db.js';

// ── GET /api/members ──────────────────────────────────────────────────────────
export function getMembers(req: Request, res: Response): void {
  const { classroomId } = req.query;
  const result = classroomId
    ? members.filter((m) => m.classroomId === classroomId)
    : members;
  res.json(result);
}
