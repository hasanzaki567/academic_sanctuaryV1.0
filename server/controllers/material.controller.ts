import { Request, Response } from 'express';
import { materials, subjects, currentUser } from '../data/db.js';

// ── GET /api/materials ────────────────────────────────────────────────────────
export function getMaterials(req: Request, res: Response): void {
  const { subjectId, type, search } = req.query;
  let result = [...materials];

  if (subjectId) result = result.filter((m) => m.subjectId === subjectId);
  if (type && type !== 'all') result = result.filter((m) => m.type === type);
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some((t: string) => t.toLowerCase().includes(q))),
    );
  }

  res.json(result);
}

// ── POST /api/materials ───────────────────────────────────────────────────────
export function createMaterial(req: Request, res: Response): void {
  const {
    subjectId = 'sub-ds',
    title,
    description = '',
    type = 'notes',
    fileFormat = 'PDF',
    fileSize = '1.5 MB',
    tags = [],
    unit = 'General',
    contentSnippet = '',
  } = req.body;

  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];

  const newMaterial = {
    id: `mat-${Date.now()}`,
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    title: title || 'New Study Material',
    description: description || `Study guide for ${subject.name}`,
    type,
    fileFormat,
    fileSize,
    uploadedBy: {
      id: currentUser?.id ?? 'guest',
      name: currentUser?.name ?? 'Student',
      avatar: currentUser?.avatar ?? '',
      role: currentUser?.role ?? 'student',
    },
    uploadedDate: 'Just now',
    downloadsCount: 1,
    viewsCount: 1,
    isVerified: true,
    tags: Array.isArray(tags) ? tags : [tags],
    unit,
    contentSnippet:
      contentSnippet || `# ${title}\n\nUploaded notes and study guide for ${subject.name}.`,
  };

  materials.unshift(newMaterial);

  // Update subject counters
  if (type === 'notes') subject.notesCount += 1;
  if (type === 'pyqs') subject.pyqsCount += 1;
  subject.materialsCount += 1;

  res.status(201).json(newMaterial);
}
