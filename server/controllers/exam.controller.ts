import { Request, Response } from 'express';
import { exams } from '../data/db.js';

// ── GET /api/exams ────────────────────────────────────────────────────────────
export function getExams(req: Request, res: Response): void {
  const { classroomId } = req.query;
  const result = classroomId
    ? exams.filter((e) => e.classroomId === classroomId)
    : exams;
  res.json(result);
}

// ── POST /api/exams ───────────────────────────────────────────────────────────
export function createExam(req: Request, res: Response): void {
  const {
    subjectName,
    subjectCode,
    date,
    time,
    venue,
    classroomId = 'cls-1',
  } = req.body;

  const newExam = {
    id: `exam-${Date.now()}`,
    classroomId,
    subjectName: subjectName || 'Subject Exam',
    subjectCode: subjectCode || 'CS300',
    date: date || '2026-09-20',
    daysRemaining: 25,
    time: time || '10:00 AM - 01:00 PM',
    venue: venue || 'Main Exam Hall',
    progressPercent: 50,
  };

  exams.push(newExam);
  res.status(201).json(newExam);
}
