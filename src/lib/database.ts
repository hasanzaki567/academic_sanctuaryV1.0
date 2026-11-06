import { supabase } from './supabase';
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
import {
  rowToClassroom,
  classroomToRow,
  rowToSubject,
  rowToMaterial,
  materialToRow,
  rowToAnnouncement,
  announcementToRow,
  rowToExam,
  examToRow,
  rowToMember,
  rowToChatGroup,
  rowToChatMessage,
  chatMessageToRow,
} from './supabase-db';

// ==========================================
// CLIENT-SIDE DIRECT SUPABASE OPERATIONS
// ==========================================

export async function fetchClassroomsFromDb(): Promise<Classroom[]> {
  try {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToClassroom);
  } catch {
    return [];
  }
}

export async function createClassroomInDb(cls: Classroom): Promise<Classroom | null> {
  try {
    const row = classroomToRow(cls);
    const { data, error } = await supabase
      .from('classrooms')
      .upsert(row)
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return rowToClassroom(data);
  } catch {
    return null;
  }
}

export async function fetchSubjectsFromDb(classroomId?: string): Promise<Subject[]> {
  try {
    let query = supabase.from('subjects').select('*');
    if (classroomId) query = query.eq('classroom_id', classroomId);
    const { data, error } = await query.order('code', { ascending: true });
    if (error || !data) return [];
    return data.map(rowToSubject);
  } catch {
    return [];
  }
}

export async function fetchMaterialsFromDb(classroomId?: string, subjectId?: string): Promise<Material[]> {
  try {
    let query = supabase.from('materials').select('*');
    if (subjectId) query = query.eq('subject_id', subjectId);
    const { data, error } = await query.order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map((r) => rowToMaterial(r, classroomId));
  } catch {
    return [];
  }
}

export async function uploadMaterialToDb(mat: Material): Promise<Material | null> {
  try {
    const row = materialToRow(mat);
    const { data, error } = await supabase
      .from('materials')
      .upsert(row)
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return rowToMaterial(data);
  } catch {
    return null;
  }
}

export async function fetchAnnouncementsFromDb(classroomId?: string): Promise<Announcement[]> {
  try {
    let query = supabase.from('announcements').select('*');
    if (classroomId) query = query.eq('classroom_id', classroomId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToAnnouncement);
  } catch {
    return [];
  }
}

export async function postAnnouncementToDb(ann: Announcement): Promise<Announcement | null> {
  try {
    const row = announcementToRow(ann);
    const { data, error } = await supabase
      .from('announcements')
      .upsert(row)
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return rowToAnnouncement(data);
  } catch {
    return null;
  }
}

export async function fetchExamsFromDb(classroomId?: string): Promise<Exam[]> {
  try {
    let query = supabase.from('exams').select('*');
    if (classroomId) query = query.eq('classroom_id', classroomId);
    const { data, error } = await query.order('date', { ascending: true });
    if (error || !data) return [];
    return data.map(rowToExam);
  } catch {
    return [];
  }
}

export async function createExamInDb(exam: Exam): Promise<Exam | null> {
  try {
    const row = examToRow(exam);
    const { data, error } = await supabase
      .from('exams')
      .upsert(row)
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return rowToExam(data);
  } catch {
    return null;
  }
}

export async function fetchMembersFromDb(classroomId?: string): Promise<Member[]> {
  try {
    let query = supabase.from('classroom_members').select('*');
    if (classroomId) query = query.eq('classroom_id', classroomId);
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(rowToMember);
  } catch {
    return [];
  }
}

export async function fetchChatGroupsFromDb(classroomId?: string): Promise<ChatGroup[]> {
  try {
    let query = supabase.from('chat_groups').select('*');
    if (classroomId) query = query.eq('classroom_id', classroomId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToChatGroup);
  } catch {
    return [];
  }
}

export async function fetchChatMessagesFromDb(groupId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(rowToChatMessage);
  } catch {
    return [];
  }
}

export async function sendChatMessageToDb(msg: ChatMessage): Promise<ChatMessage | null> {
  try {
    const row = chatMessageToRow(msg);
    const { data, error } = await supabase
      .from('chat_messages')
      .upsert(row)
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return rowToChatMessage(data);
  } catch {
    return null;
  }
}
