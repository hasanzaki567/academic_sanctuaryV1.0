import { Request, Response } from 'express';
import {
  classrooms,
  registeredUsers,
  currentUser,
  setCurrentUser,
  members,
} from '../data/db.js';

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
export function getMe(req: Request, res: Response): void {
  if (!currentUser) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const userClassroom =
    classrooms.find((c) => c.id === currentUser!.classroomId) ?? classrooms[0];
  res.json({ authenticated: true, user: currentUser, classroom: userClassroom });
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export function login(req: Request, res: Response): void {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  let foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (foundUser) {
    if (foundUser.password && password && foundUser.password !== password) {
      res.status(401).json({ error: 'Invalid password.' });
      return;
    }
  } else {
    // Auto-register unknown emails as students in the default classroom
    const defaultCls = classrooms[0];
    const newId = `user-${Date.now()}`;
    const nameFromEmail = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    foundUser = {
      id: newId,
      name: nameFromEmail || 'University Student',
      email: email.trim(),
      password: password || 'password123',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
      role: 'student' as any,
      department: 'Computer Science & Engineering',
      rollNumber: `CS26B${Math.floor(100 + Math.random() * 900)}`,
      classroomId: defaultCls.id,
    };
    registeredUsers.push(foundUser);
    members.push({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar,
      role: foundUser.role,
      rollNumber: foundUser.rollNumber,
      joinedDate: 'Just now',
    });
    defaultCls.memberCount += 1;
  }

  setCurrentUser(foundUser);
  const userClassroom =
    classrooms.find((c) => c.id === foundUser!.classroomId) ?? classrooms[0];

  res.json({
    success: true,
    user: foundUser,
    classroom: userClassroom,
    message: `Welcome back, ${foundUser.name}!`,
  });
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
export function signup(req: Request, res: Response): void {
  const {
    name,
    email,
    password,
    department = 'Computer Science',
    rollNumber,
    role = 'student',
    classroomOption = 'join',
    classroomCode,
    classroomId,
    newClassroomData,
  } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }

  const existing = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (existing) {
    res.status(400).json({
      error: 'An account with this email already exists. Please log in.',
    });
    return;
  }

  const userId = `user-${Date.now()}`;
  let assignedClassroom = classrooms[0];
  let finalRole = role;

  if (classroomOption === 'create' && newClassroomData) {
    finalRole = 'super_admin';
    const newCode =
      `${newClassroomData.course?.substring(0, 3).toUpperCase() ?? 'CLS'}${newClassroomData.batchYear?.slice(-2) ?? '26'}${newClassroomData.section?.slice(-1) ?? 'A'}`.replace(
        /[^A-Z0-9]/g,
        '',
      ) || `SANCT${Math.floor(10 + Math.random() * 90)}`;

    assignedClassroom = {
      id: `cls-${Date.now()}`,
      code: newCode,
      name: `${newClassroomData.course ?? 'Classroom'} ${newClassroomData.batchYear ?? '2026'} - ${newClassroomData.section ?? 'Section A'}`,
      collegeName: newClassroomData.collegeName ?? 'Academic University',
      location: newClassroomData.location ?? 'Campus',
      department: newClassroomData.department ?? department,
      course: newClassroomData.course ?? 'Degree Program',
      degreeLevel: newClassroomData.degreeLevel ?? 'undergraduate',
      batchYear: newClassroomData.batchYear ?? '2026',
      section: newClassroomData.section ?? 'Section A',
      semester: newClassroomData.semester ?? 'Semester 5',
      superAdminId: userId,
      memberCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    classrooms.unshift(assignedClassroom);
  } else if (classroomOption === 'join' && classroomCode) {
    const match = classrooms.find(
      (c) => c.code.toLowerCase() === classroomCode.trim().toLowerCase(),
    );
    if (match) {
      assignedClassroom = match;
      assignedClassroom.memberCount += 1;
    } else {
      assignedClassroom = {
        id: `cls-${Date.now()}`,
        code: classroomCode.trim().toUpperCase(),
        name: `Cohort ${classroomCode.trim().toUpperCase()}`,
        collegeName: 'University Campus',
        location: 'Academic Hall',
        department: department ?? 'Engineering',
        course: 'Degree Program',
        degreeLevel: 'undergraduate',
        batchYear: '2026',
        section: 'Section A',
        semester: 'Semester 5',
        superAdminId: userId,
        memberCount: 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      classrooms.unshift(assignedClassroom);
    }
  } else if (classroomId) {
    const found = classrooms.find((c) => c.id === classroomId);
    if (found) {
      assignedClassroom = found;
      assignedClassroom.memberCount += 1;
    }
  }

  const defaultAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
  ];

  const newUser = {
    id: userId,
    name: name.trim(),
    email: email.trim(),
    password: password || 'password123',
    avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    role: finalRole as any,
    department: department.trim() || 'Computer Science',
    rollNumber: rollNumber?.trim() || `STU${Math.floor(1000 + Math.random() * 9000)}`,
    classroomId: assignedClassroom.id,
  };

  registeredUsers.push(newUser);
  setCurrentUser(newUser);
  members.push({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    role: newUser.role,
    rollNumber: newUser.rollNumber,
    joinedDate: 'Just now',
  });

  res.status(201).json({
    success: true,
    user: newUser,
    classroom: assignedClassroom,
    message: `Account created! Enrolled in ${assignedClassroom.name}`,
  });
}

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
export function logout(_req: Request, res: Response): void {
  setCurrentUser(null);
  res.json({ success: true, message: 'Logged out successfully' });
}
