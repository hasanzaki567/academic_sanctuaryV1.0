export type DegreeLevel = 'undergraduate' | 'postgraduate' | 'doctorate' | 'other';

export type UserRole = 'super_admin' | 'admin' | 'student';

export type MaterialType = 'notes' | 'materials' | 'pyqs' | 'important_questions';

export type FileFormat = 'PDF' | 'DOCX' | 'PPTX' | 'ZIP' | 'TXT';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  rollNumber?: string;
  classroomId?: string;
}

export interface Classroom {
  id: string;
  code: string; // e.g. "BTECH26A"
  name: string; // e.g. "B.Tech CSE 2026 - Section A"
  collegeName: string;
  location: string;
  department: string;
  course: string;
  degreeLevel: DegreeLevel;
  batchYear: string;
  section: string;
  semester: string;
  superAdminId: string;
  memberCount: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  classroomId: string;
  code: string; // e.g. "CS301"
  name: string; // e.g. "Data Structures"
  professor: string; // e.g. "Prof. Alan Turing"
  description: string;
  creditHours?: number;
  materialsCount: number;
  notesCount: number;
  pyqsCount: number;
}

export interface Material {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description?: string;
  type: MaterialType;
  fileFormat: FileFormat;
  fileSize: string;
  fileUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  uploadedDate: string; // e.g. "Oct 12"
  downloadsCount: number;
  viewsCount: number;
  isVerified?: boolean;
  contentSnippet?: string;
  tags?: string[];
  unit?: string;
}

export interface Announcement {
  id: string;
  classroomId: string;
  title: string;
  description?: string;
  timestamp: string; // e.g. "Today, 09:00 AM"
  author: string;
  isUrgent?: boolean;
}

export interface Exam {
  id: string;
  classroomId: string;
  subjectName: string;
  subjectCode: string;
  date: string;
  daysRemaining: number;
  time: string;
  venue: string;
  progressPercent: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  rollNumber: string;
  joinedDate: string;
}
