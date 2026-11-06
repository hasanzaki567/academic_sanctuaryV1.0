import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type {
  Classroom,
  Subject,
  Material,
  Announcement,
  Exam,
  Member,
  ChatGroup,
  ChatMessage,
} from '../types';

dotenv.config();

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://tsiyeueuisjpqsvtgmlk.supabase.co';

// Prefer service role key if available for administrative backend operations, otherwise anon key
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_wNkOnVDEhhsotWe4jDBVGg_HssinMbR';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

// ==========================================
// MAPPERS: TypeScript (camelCase) <-> Postgres (snake_case)
// ==========================================

export function classroomToRow(c: Classroom): any {
  return {
    id: c.id,
    code: c.code.toUpperCase(),
    name: c.name,
    college_name: c.collegeName || 'Academic University',
    location: c.location || 'Campus',
    department: c.department || 'General Academic',
    course: c.course || 'General Program',
    degree_level: c.degreeLevel || 'undergraduate',
    batch_year: c.batchYear || '2026',
    section: c.section || 'Section A',
    semester: c.semester || 'Semester 1',
    super_admin_id: c.superAdminId || null,
    member_count: c.memberCount || 1,
    created_at: c.createdAt || new Date().toISOString(),
  };
}

export function rowToClassroom(r: any): Classroom {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    collegeName: r.college_name || 'Academic University',
    location: r.location || 'Campus',
    department: r.department || 'General Academic',
    course: r.course || 'General Program',
    degreeLevel: r.degree_level || 'undergraduate',
    batchYear: r.batch_year || '2026',
    section: r.section || 'Section A',
    semester: r.semester || 'Semester 1',
    superAdminId: r.super_admin_id || '',
    memberCount: r.member_count ?? 1,
    createdAt: r.created_at || new Date().toISOString(),
  };
}

export function memberToRow(m: Member): any {
  return {
    id: m.id,
    classroom_id: m.classroomId,
    user_id: m.id.length === 36 ? m.id : null,
    name: m.name,
    email: m.email,
    avatar: m.avatar || null,
    role: m.role || 'student',
    roll_number: m.rollNumber || null,
    joined_date: m.joinedDate || 'Today',
  };
}

export function rowToMember(r: any): Member {
  return {
    id: r.id || r.user_id,
    classroomId: r.classroom_id,
    name: r.name,
    email: r.email,
    avatar: r.avatar || '',
    role: r.role || 'student',
    rollNumber: r.roll_number || '',
    joinedDate: r.joined_date || 'Today',
  };
}

export function subjectToRow(s: Subject): any {
  return {
    id: s.id,
    classroom_id: s.classroomId,
    code: s.code,
    name: s.name,
    professor: s.professor || 'Faculty Coordinator',
    description: s.description || '',
    credit_hours: s.creditHours || 3,
    materials_count: s.materialsCount || 0,
    notes_count: s.notesCount || 0,
    pyqs_count: s.pyqsCount || 0,
  };
}

export function rowToSubject(r: any): Subject {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    code: r.code,
    name: r.name,
    professor: r.professor || 'Faculty Coordinator',
    description: r.description || '',
    creditHours: r.credit_hours || 3,
    materialsCount: r.materials_count || 0,
    notesCount: r.notes_count || 0,
    pyqsCount: r.pyqs_count || 0,
  };
}

export function materialToRow(m: Material): any {
  return {
    id: m.id,
    subject_id: m.subjectId,
    subject_code: m.subjectCode,
    subject_name: m.subjectName,
    title: m.title,
    description: m.description || '',
    type: m.type,
    file_format: m.fileFormat,
    file_size: m.fileSize || '1.0 MB',
    file_url: m.fileUrl || null,
    uploaded_by: m.uploadedBy,
    uploaded_date: m.uploadedDate || 'Today',
    created_at: m.createdAt || Date.now(),
    downloads_count: m.downloadsCount || 0,
    views_count: m.viewsCount || 0,
    is_verified: m.isVerified ?? true,
    content_snippet: m.contentSnippet || null,
    tags: Array.isArray(m.tags) ? m.tags : [],
    unit: m.unit || 'General',
    recommended_exam: m.recommendedExam || null,
  };
}

export function rowToMaterial(r: any, fallbackClassroomId?: string): Material {
  return {
    id: r.id,
    subjectId: r.subject_id,
    subjectCode: r.subject_code,
    subjectName: r.subject_name,
    title: r.title,
    description: r.description || '',
    type: r.type,
    fileFormat: r.file_format,
    fileSize: r.file_size || '1.0 MB',
    fileUrl: r.file_url || undefined,
    uploadedBy: r.uploaded_by || {
      id: 'system',
      name: 'Academic Contributor',
      avatar: '',
      role: 'student',
    },
    uploadedDate: r.uploaded_date || 'Today',
    createdAt: Number(r.created_at) || Date.now(),
    downloadsCount: r.downloads_count || 0,
    viewsCount: r.views_count || 0,
    isVerified: r.is_verified ?? true,
    contentSnippet: r.content_snippet || undefined,
    tags: Array.isArray(r.tags) ? r.tags : [],
    unit: r.unit || 'General',
    recommendedExam: r.recommended_exam || undefined,
  };
}

export function announcementToRow(a: Announcement): any {
  return {
    id: a.id,
    classroom_id: a.classroomId,
    title: a.title,
    description: a.description || '',
    author: a.author || 'Cohort Admin',
    is_urgent: Boolean(a.isUrgent),
    timestamp: a.timestamp || 'Today',
  };
}

export function rowToAnnouncement(r: any): Announcement {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    title: r.title,
    description: r.description || '',
    author: r.author || 'Cohort Admin',
    isUrgent: Boolean(r.is_urgent),
    timestamp: r.timestamp || 'Today',
  };
}

export function examToRow(e: Exam): any {
  return {
    id: e.id,
    classroom_id: e.classroomId,
    subject_name: e.subjectName,
    subject_code: e.subjectCode,
    date: e.date,
    days_remaining: e.daysRemaining || 0,
    time: e.time || '10:00 AM - 01:00 PM',
    exam_type: e.examType || 'IAT',
    venue: e.venue || 'Academic Hall',
    syllabus: e.syllabus || '',
    progress_percent: e.progressPercent || 0,
    is_completed: Boolean(e.isCompleted),
  };
}

export function rowToExam(r: any): Exam {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    subjectName: r.subject_name,
    subjectCode: r.subject_code,
    date: r.date,
    daysRemaining: r.days_remaining || 0,
    time: r.time || '10:00 AM - 01:00 PM',
    examType: r.exam_type || 'IAT',
    venue: r.venue || 'Academic Hall',
    syllabus: r.syllabus || '',
    progressPercent: r.progress_percent || 0,
    isCompleted: Boolean(r.is_completed),
  };
}

export function chatGroupToRow(g: ChatGroup): any {
  return {
    id: g.id,
    classroom_id: g.classroomId,
    name: g.name,
    avatar: g.avatar || null,
    description: g.description || null,
    is_direct: Boolean(g.isDirect),
    created_by: g.createdBy || null,
    admin_ids: g.adminIds || [],
    member_ids: g.memberIds || [],
    banned_user_ids: g.bannedUserIds || [],
  };
}

export function rowToChatGroup(r: any): ChatGroup {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    name: r.name,
    avatar: r.avatar || '',
    description: r.description || undefined,
    isDirect: Boolean(r.is_direct),
    createdBy: r.created_by || '',
    adminIds: r.admin_ids || [],
    memberIds: r.member_ids || [],
    bannedUserIds: r.banned_user_ids || [],
    createdAt: r.created_at || new Date().toISOString(),
  };
}

export function chatMessageToRow(m: ChatMessage): any {
  return {
    id: m.id,
    group_id: m.groupId,
    sender_id: m.senderId,
    sender_name: m.senderName,
    sender_avatar: m.senderAvatar || null,
    type: m.type || 'text',
    content: m.content || '',
    file_url: m.fileUrl || null,
    file_name: m.fileName || null,
    file_size: m.fileSize || null,
    forwarded_material: m.forwardedMaterial || null,
    timestamp: m.timestamp || 'Today',
    created_at: m.createdAt || Date.now(),
    delivered_to: m.deliveredTo || [],
    read_by: m.readBy || [],
    reactions: m.reactions || [],
    reply_to: m.replyTo || null,
    is_deleted: Boolean(m.isDeleted),
    is_pinned: Boolean(m.isPinned),
    is_starred: Boolean(m.isStarred),
    starred_by: m.starredBy || [],
  };
}

export function rowToChatMessage(r: any): ChatMessage {
  return {
    id: r.id,
    groupId: r.group_id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderAvatar: r.sender_avatar || '',
    type: r.type || 'text',
    content: r.content || '',
    fileUrl: r.file_url || undefined,
    fileName: r.file_name || undefined,
    fileSize: r.file_size || undefined,
    forwardedMaterial: r.forwarded_material || undefined,
    timestamp: r.timestamp || 'Today',
    createdAt: Number(r.created_at) || Date.now(),
    deliveredTo: r.delivered_to || [],
    readBy: r.read_by || [],
    reactions: r.reactions || [],
    replyTo: r.reply_to || undefined,
    isDeleted: Boolean(r.is_deleted),
    isPinned: Boolean(r.is_pinned),
    isStarred: Boolean(r.is_starred),
    starredBy: r.starred_by || [],
  };
}

// ==========================================
// DATABASE QUERY & PERSISTENCE OPERATIONS
// ==========================================

export async function dbFetchClassrooms(): Promise<Classroom[]> {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('classrooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('dbFetchClassrooms warning:', error.message);
      return [];
    }
    return (data || []).map(rowToClassroom);
  } catch (err) {
    console.warn('dbFetchClassrooms exception:', err);
    return [];
  }
}

export async function dbSaveClassroom(cls: Classroom): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = classroomToRow(cls);
    const { error } = await sb.from('classrooms').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveClassroom warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveClassroom exception:', err);
    return false;
  }
}

export async function dbFindClassroomByCode(code: string): Promise<Classroom | null> {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('classrooms')
      .select('*')
      .ilike('code', code.trim())
      .maybeSingle();
    if (error || !data) return null;
    return rowToClassroom(data);
  } catch (err) {
    console.warn('dbFindClassroomByCode exception:', err);
    return null;
  }
}

export async function dbFetchSubjects(classroomId?: string): Promise<Subject[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('subjects').select('*');
    if (classroomId) {
      query = query.eq('classroom_id', classroomId);
    }
    const { data, error } = await query.order('code', { ascending: true });
    if (error) {
      console.warn('dbFetchSubjects warning:', error.message);
      return [];
    }
    return (data || []).map(rowToSubject);
  } catch (err) {
    console.warn('dbFetchSubjects exception:', err);
    return [];
  }
}

export async function dbSaveSubject(s: Subject): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = subjectToRow(s);
    const { error } = await sb.from('subjects').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveSubject warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveSubject exception:', err);
    return false;
  }
}

export async function dbFetchMaterials(classroomId?: string, subjectId?: string): Promise<Material[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('materials').select('*');
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) {
      console.warn('dbFetchMaterials warning:', error.message);
      return [];
    }
    return (data || []).map((r) => rowToMaterial(r, classroomId));
  } catch (err) {
    console.warn('dbFetchMaterials exception:', err);
    return [];
  }
}

export async function dbSaveMaterial(m: Material): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = materialToRow(m);
    const { error } = await sb.from('materials').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveMaterial warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveMaterial exception:', err);
    return false;
  }
}

export async function dbFetchAnnouncements(classroomId?: string): Promise<Announcement[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('announcements').select('*');
    if (classroomId) {
      query = query.eq('classroom_id', classroomId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('dbFetchAnnouncements warning:', error.message);
      return [];
    }
    return (data || []).map(rowToAnnouncement);
  } catch (err) {
    console.warn('dbFetchAnnouncements exception:', err);
    return [];
  }
}

export async function dbSaveAnnouncement(a: Announcement): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = announcementToRow(a);
    const { error } = await sb.from('announcements').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveAnnouncement warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveAnnouncement exception:', err);
    return false;
  }
}

export async function dbFetchExams(classroomId?: string): Promise<Exam[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('exams').select('*');
    if (classroomId) {
      query = query.eq('classroom_id', classroomId);
    }
    const { data, error } = await query.order('date', { ascending: true });
    if (error) {
      console.warn('dbFetchExams warning:', error.message);
      return [];
    }
    return (data || []).map(rowToExam);
  } catch (err) {
    console.warn('dbFetchExams exception:', err);
    return [];
  }
}

export async function dbSaveExam(e: Exam): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = examToRow(e);
    const { error } = await sb.from('exams').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveExam warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveExam exception:', err);
    return false;
  }
}

export async function dbUpdateExam(id: string, updates: Partial<Exam>): Promise<boolean> {
  try {
    const sb = getSupabase();
    const patch: any = {};
    if (updates.isCompleted !== undefined) patch.is_completed = updates.isCompleted;
    if (updates.progressPercent !== undefined) patch.progress_percent = updates.progressPercent;
    if (updates.daysRemaining !== undefined) patch.days_remaining = updates.daysRemaining;
    if (updates.date !== undefined) patch.date = updates.date;
    if (updates.time !== undefined) patch.time = updates.time;
    if (updates.venue !== undefined) patch.venue = updates.venue;

    const { error } = await sb.from('exams').update(patch).eq('id', id);
    if (error) {
      console.warn('dbUpdateExam warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbUpdateExam exception:', err);
    return false;
  }
}

export async function dbFetchMembers(classroomId?: string): Promise<Member[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('classroom_members').select('*');
    if (classroomId) {
      query = query.eq('classroom_id', classroomId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('dbFetchMembers warning:', error.message);
      return [];
    }
    return (data || []).map(rowToMember);
  } catch (err) {
    console.warn('dbFetchMembers exception:', err);
    return [];
  }
}

export async function dbSaveMember(m: Member): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = memberToRow(m);
    const { error } = await sb.from('classroom_members').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveMember warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveMember exception:', err);
    return false;
  }
}

export async function dbUpdateMemberRole(id: string, role: string): Promise<boolean> {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('classroom_members').update({ role }).eq('id', id);
    if (error) {
      console.warn('dbUpdateMemberRole warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbUpdateMemberRole exception:', err);
    return false;
  }
}

export async function dbDeleteMember(id: string): Promise<boolean> {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('classroom_members').delete().eq('id', id);
    if (error) {
      console.warn('dbDeleteMember warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbDeleteMember exception:', err);
    return false;
  }
}

export async function dbFetchChatGroups(classroomId?: string): Promise<ChatGroup[]> {
  try {
    const sb = getSupabase();
    let query = sb.from('chat_groups').select('*');
    if (classroomId) {
      query = query.eq('classroom_id', classroomId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.warn('dbFetchChatGroups warning:', error.message);
      return [];
    }
    return (data || []).map(rowToChatGroup);
  } catch (err) {
    console.warn('dbFetchChatGroups exception:', err);
    return [];
  }
}

export async function dbSaveChatGroup(g: ChatGroup): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = chatGroupToRow(g);
    const { error } = await sb.from('chat_groups').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveChatGroup warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveChatGroup exception:', err);
    return false;
  }
}

export async function dbDeleteChatGroup(groupId: string): Promise<boolean> {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('chat_groups').delete().eq('id', groupId);
    if (error) {
      console.warn('dbDeleteChatGroup warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbDeleteChatGroup exception:', err);
    return false;
  }
}

export async function dbFetchChatMessages(groupId: string): Promise<ChatMessage[]> {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('chat_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('dbFetchChatMessages warning:', error.message);
      return [];
    }
    return (data || []).map(rowToChatMessage);
  } catch (err) {
    console.warn('dbFetchChatMessages exception:', err);
    return [];
  }
}

export async function dbSaveChatMessage(m: ChatMessage): Promise<boolean> {
  try {
    const sb = getSupabase();
    const row = chatMessageToRow(m);
    const { error } = await sb.from('chat_messages').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('dbSaveChatMessage warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbSaveChatMessage exception:', err);
    return false;
  }
}

export async function dbUpdateChatMessage(id: string, patch: Partial<ChatMessage>): Promise<boolean> {
  try {
    const sb = getSupabase();
    const rowPatch: any = {};
    if (patch.content !== undefined) rowPatch.content = patch.content;
    if (patch.reactions !== undefined) rowPatch.reactions = patch.reactions;
    if (patch.isPinned !== undefined) rowPatch.is_pinned = patch.isPinned;
    if (patch.isStarred !== undefined) rowPatch.is_starred = patch.isStarred;
    if (patch.starredBy !== undefined) rowPatch.starred_by = patch.starredBy;
    if (patch.deliveredTo !== undefined) rowPatch.delivered_to = patch.deliveredTo;
    if (patch.readBy !== undefined) rowPatch.read_by = patch.readBy;
    if (patch.isDeleted !== undefined) rowPatch.is_deleted = patch.isDeleted;

    const { error } = await sb.from('chat_messages').update(rowPatch).eq('id', id);
    if (error) {
      console.warn('dbUpdateChatMessage warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbUpdateChatMessage exception:', err);
    return false;
  }
}

export async function dbDeleteChatMessage(id: string): Promise<boolean> {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('chat_messages').delete().eq('id', id);
    if (error) {
      console.warn('dbDeleteChatMessage warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('dbDeleteChatMessage exception:', err);
    return false;
  }
}
