export type DegreeLevel = 'undergraduate' | 'postgraduate' | 'doctorate' | 'other';

export type UserRole = 'super_admin' | 'admin' | 'student';

export type MaterialType = 'notes' | 'materials' | 'slides' | 'pyqs' | 'important_questions';

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
  classCode?: string;
  registrationNumber?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  class_code?: string | null;
  registration_number?: string | null;
  created_at?: string;
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
  createdAt?: number; // timestamp for upload order
  downloadsCount: number;
  viewsCount: number;
  isVerified?: boolean;
  contentSnippet?: string;
  tags?: string[];
  unit?: string;
  recommendedExam?: string; // e.g. "IAT 1", "IAT 2", "SEM", "All Exams"
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
  examType?: string; // e.g. "IAT 1", "IAT 2", "SEM"
  venue?: string;
  syllabus?: string;
  progressPercent: number;
  isCompleted?: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  rollNumber: string;
  joinedDate: string;
  classroomId?: string;
  department?: string;
}

export type ChatRole = 'admin' | 'member';

export type ChatMessageType = 'text' | 'file' | 'camera_image' | 'material_forward';

export interface ForwardedMaterialInfo {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  type: MaterialType;
  fileFormat: FileFormat;
  fileSize: string;
  snippet?: string;
}

export interface ChatMessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatMessageReplyInfo {
  id: string;
  senderName: string;
  content: string;
  type?: ChatMessageType;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: ChatMessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  forwardedMaterial?: ForwardedMaterialInfo;
  timestamp: string;
  createdAt: number;
  deliveredTo: string[];
  readBy: string[];
  isDeleted?: boolean;
  reactions?: ChatMessageReaction[];
  replyTo?: ChatMessageReplyInfo;
  isPinned?: boolean;
  isStarred?: boolean;
  starredBy?: string[];
}

export interface ChatGroupMember {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: ChatRole;
  rollNumber?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatGroup {
  id: string;
  classroomId: string;
  name: string;
  avatar: string;
  description?: string;
  isDirect: boolean;
  createdBy: string;
  adminIds: string[];
  memberIds: string[];
  createdAt: string;
  pinnedMessageId?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderName: string;
    senderId: string;
    type?: ChatMessageType;
  };
  unreadCount?: number;
  bannedUserIds?: string[];
}
