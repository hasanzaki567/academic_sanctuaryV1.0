import { Request, Response } from 'express';
import { classrooms, subjects, currentUser, registeredUsers } from '../data/db.js';

// ── GET /api/classrooms ───────────────────────────────────────────────────────
export function getClassrooms(_req: Request, res: Response): void {
  res.json(classrooms);
}

// ── GET /api/classrooms/:id ───────────────────────────────────────────────────
export function getClassroomById(req: Request, res: Response): void {
  const cls = classrooms.find((c) => c.id === req.params.id) ?? classrooms[0];
  res.json(cls);
}

// ── POST /api/classrooms ──────────────────────────────────────────────────────
export function createClassroom(req: Request, res: Response): void {
  const {
    collegeName,
    location,
    department,
    course,
    degreeLevel,
    batchYear = '2026',
    section = 'Section A',
    semester = 'Semester 5',
    selectedSubjects = [],
  } = req.body;

  const newCode =
    `${course ? course.substring(0, 3).toUpperCase() : 'CLS'}${batchYear.slice(-2)}${section ? section.slice(-1) : 'A'}`.replace(
      /[^A-Z0-9]/g,
      '',
    ) || 'SANCT26';

  const newClassroom: any = {
    id: `cls-${Date.now()}`,
    code: newCode,
    name: `${course ?? 'Classroom'} ${batchYear} - ${section}`,
    collegeName: collegeName ?? 'Academic University',
    location: location ?? 'Campus',
    department: department ?? 'General Studies',
    course: course ?? 'General Program',
    degreeLevel: degreeLevel ?? 'undergraduate',
    batchYear,
    section,
    semester,
    superAdminId: currentUser?.id ?? 'admin',
    memberCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
  };

  classrooms.unshift(newClassroom);

  // Promote current user to super_admin of new classroom
  if (currentUser) {
    currentUser.classroomId = newClassroom.id;
    currentUser.role = 'super_admin';
    const reg = registeredUsers.find((u) => u.id === currentUser!.id);
    if (reg) { reg.classroomId = newClassroom.id; reg.role = 'super_admin'; }
  }

  // Seed selected subjects
  if (Array.isArray(selectedSubjects) && selectedSubjects.length > 0) {
    selectedSubjects.forEach((subName: string, idx: number) => {
      const match = subName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
      const name = match?.[1]?.trim() ?? subName;
      const code = match?.[2]?.trim() ?? `CS30${idx + 1}`;
      subjects.push({
        id: `sub-${Date.now()}-${idx}`,
        classroomId: newClassroom.id,
        code, name,
        professor: 'Faculty Coordinator',
        description: `Comprehensive coursework and materials for ${name}.`,
        creditHours: 4,
        materialsCount: 0, notesCount: 0, pyqsCount: 0,
      });
    });
  }

  res.status(201).json(newClassroom);
}

// ── POST /api/classrooms/join ─────────────────────────────────────────────────
export function joinClassroom(req: Request, res: Response): void {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Classroom code is required' });
    return;
  }

  const found = classrooms.find(
    (c) => c.code.toLowerCase() === code.trim().toLowerCase(),
  );

  if (found) {
    found.memberCount += 1;
    if (currentUser) {
      currentUser.classroomId = found.id;
      const reg = registeredUsers.find((u) => u.id === currentUser!.id);
      if (reg) reg.classroomId = found.id;
    }
    res.json({ success: true, classroom: found });
    return;
  }

  // Create a new classroom for unknown code
  const joined: any = {
    id: `cls-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: `Classroom ${code.trim().toUpperCase()}`,
    collegeName: 'Partner University',
    location: 'Campus',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    degreeLevel: 'undergraduate',
    batchYear: '2026',
    section: 'Section B',
    semester: 'Semester 5',
    superAdminId: currentUser?.id ?? 'admin',
    memberCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
  };
  classrooms.unshift(joined);
  if (currentUser) {
    currentUser.classroomId = joined.id;
    const reg = registeredUsers.find((u) => u.id === currentUser!.id);
    if (reg) reg.classroomId = joined.id;
  }
  res.json({ success: true, classroom: joined });
}
