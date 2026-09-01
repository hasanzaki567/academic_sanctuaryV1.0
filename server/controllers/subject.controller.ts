import { Request, Response } from 'express';
import { subjects } from '../data/db.js';

// ── GET /api/subjects ─────────────────────────────────────────────────────────
export function getSubjects(req: Request, res: Response): void {
  const { classroomId } = req.query;
  if (classroomId) {
    const filtered = subjects.filter((s) => s.classroomId === classroomId);
    res.json(filtered.length > 0 ? filtered : subjects);
    return;
  }
  res.json(subjects);
}

// ── GET /api/subjects/:id ─────────────────────────────────────────────────────
export function getSubjectById(req: Request, res: Response): void {
  const subject = subjects.find(
    (s) =>
      s.id === req.params.id ||
      s.code.toLowerCase() === req.params.id.toLowerCase(),
  );
  if (!subject) {
    res.status(404).json({ error: 'Subject not found' });
    return;
  }
  res.json(subject);
}

// ── POST /api/subjects ────────────────────────────────────────────────────────
export function createSubject(req: Request, res: Response): void {
  const {
    code,
    name,
    professor,
    description,
    classroomId = 'cls-1',
    creditHours = 4,
  } = req.body;

  const newSubject = {
    id: `sub-${Date.now()}`,
    classroomId,
    code: code || 'CS399',
    name: name || 'Special Topics in CS',
    professor: professor || 'Prof. Guest Lecturer',
    description: description || 'Advanced course curriculum and study materials.',
    creditHours: Number(creditHours) || 3,
    materialsCount: 0,
    notesCount: 0,
    pyqsCount: 0,
  };

  subjects.push(newSubject);
  res.status(201).json(newSubject);
}
