// server.ts
import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";

// src/lib/supabase-db.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
var SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://tsiyeueuisjpqsvtgmlk.supabase.co";
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_wNkOnVDEhhsotWe4jDBVGg_HssinMbR";
var supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabaseClient;
}
function classroomToRow(c) {
  return {
    id: c.id,
    code: c.code.toUpperCase(),
    name: c.name,
    college_name: c.collegeName || "Academic University",
    location: c.location || "Campus",
    department: c.department || "General Academic",
    course: c.course || "General Program",
    degree_level: c.degreeLevel || "undergraduate",
    batch_year: c.batchYear || "2026",
    section: c.section || "Section A",
    semester: c.semester || "Semester 1",
    super_admin_id: c.superAdminId || null,
    member_count: c.memberCount || 1,
    created_at: c.createdAt || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function rowToClassroom(r) {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    collegeName: r.college_name || "Academic University",
    location: r.location || "Campus",
    department: r.department || "General Academic",
    course: r.course || "General Program",
    degreeLevel: r.degree_level || "undergraduate",
    batchYear: r.batch_year || "2026",
    section: r.section || "Section A",
    semester: r.semester || "Semester 1",
    superAdminId: r.super_admin_id || "",
    memberCount: r.member_count ?? 1,
    createdAt: r.created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function memberToRow(m) {
  return {
    id: m.id,
    classroom_id: m.classroomId,
    user_id: m.id.length === 36 ? m.id : null,
    name: m.name,
    email: m.email,
    avatar: m.avatar || null,
    role: m.role || "student",
    roll_number: m.rollNumber || null,
    joined_date: m.joinedDate || "Today"
  };
}
function rowToMember(r) {
  return {
    id: r.id || r.user_id,
    classroomId: r.classroom_id,
    name: r.name,
    email: r.email,
    avatar: r.avatar || "",
    role: r.role || "student",
    rollNumber: r.roll_number || "",
    joinedDate: r.joined_date || "Today"
  };
}
function subjectToRow(s) {
  return {
    id: s.id,
    classroom_id: s.classroomId,
    code: s.code,
    name: s.name,
    professor: s.professor || "Faculty Coordinator",
    description: s.description || "",
    credit_hours: s.creditHours || 3,
    materials_count: s.materialsCount || 0,
    notes_count: s.notesCount || 0,
    pyqs_count: s.pyqsCount || 0
  };
}
function rowToSubject(r) {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    code: r.code,
    name: r.name,
    professor: r.professor || "Faculty Coordinator",
    description: r.description || "",
    creditHours: r.credit_hours || 3,
    materialsCount: r.materials_count || 0,
    notesCount: r.notes_count || 0,
    pyqsCount: r.pyqs_count || 0
  };
}
function materialToRow(m) {
  return {
    id: m.id,
    classroom_id: m.classroomId || null,
    subject_id: m.subjectId,
    subject_code: m.subjectCode,
    subject_name: m.subjectName,
    title: m.title,
    description: m.description || "",
    type: m.type,
    file_format: m.fileFormat,
    file_size: m.fileSize || "1.0 MB",
    file_url: m.fileUrl || null,
    uploaded_by: m.uploadedBy,
    uploaded_date: m.uploadedDate || "Today",
    created_at: m.createdAt || Date.now(),
    downloads_count: m.downloadsCount || 0,
    views_count: m.viewsCount || 0,
    is_verified: m.isVerified ?? true,
    content_snippet: m.contentSnippet || null,
    tags: Array.isArray(m.tags) ? m.tags : [],
    unit: m.unit || "General",
    recommended_exam: m.recommendedExam || null
  };
}
function rowToMaterial(r, fallbackClassroomId) {
  return {
    id: r.id,
    classroomId: r.classroom_id || fallbackClassroomId || void 0,
    subjectId: r.subject_id,
    subjectCode: r.subject_code,
    subjectName: r.subject_name,
    title: r.title,
    description: r.description || "",
    type: r.type,
    fileFormat: r.file_format,
    fileSize: r.file_size || "1.0 MB",
    fileUrl: r.file_url || void 0,
    uploadedBy: r.uploaded_by || {
      id: "system",
      name: "Academic Contributor",
      avatar: "",
      role: "student"
    },
    uploadedDate: r.uploaded_date || "Today",
    createdAt: Number(r.created_at) || Date.now(),
    downloadsCount: r.downloads_count || 0,
    viewsCount: r.views_count || 0,
    isVerified: r.is_verified ?? true,
    contentSnippet: r.content_snippet || void 0,
    tags: Array.isArray(r.tags) ? r.tags : [],
    unit: r.unit || "General",
    recommendedExam: r.recommended_exam || void 0
  };
}
function announcementToRow(a) {
  return {
    id: a.id,
    classroom_id: a.classroomId,
    title: a.title,
    description: a.description || "",
    author: a.author || "Cohort Admin",
    is_urgent: Boolean(a.isUrgent),
    timestamp: a.timestamp || "Today"
  };
}
function rowToAnnouncement(r) {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    title: r.title,
    description: r.description || "",
    author: r.author || "Cohort Admin",
    isUrgent: Boolean(r.is_urgent),
    timestamp: r.timestamp || "Today"
  };
}
function examToRow(e) {
  return {
    id: e.id,
    classroom_id: e.classroomId,
    subject_name: e.subjectName,
    subject_code: e.subjectCode,
    date: e.date,
    days_remaining: e.daysRemaining || 0,
    time: e.time || "10:00 AM - 01:00 PM",
    exam_type: e.examType || "IAT",
    venue: e.venue || "Academic Hall",
    syllabus: e.syllabus || "",
    progress_percent: e.progressPercent || 0,
    is_completed: Boolean(e.isCompleted)
  };
}
function rowToExam(r) {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    subjectName: r.subject_name,
    subjectCode: r.subject_code,
    date: r.date,
    daysRemaining: r.days_remaining || 0,
    time: r.time || "10:00 AM - 01:00 PM",
    examType: r.exam_type || "IAT",
    venue: r.venue || "Academic Hall",
    syllabus: r.syllabus || "",
    progressPercent: r.progress_percent || 0,
    isCompleted: Boolean(r.is_completed)
  };
}
function chatGroupToRow(g) {
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
    banned_user_ids: g.bannedUserIds || []
  };
}
function rowToChatGroup(r) {
  return {
    id: r.id,
    classroomId: r.classroom_id,
    name: r.name,
    avatar: r.avatar || "",
    description: r.description || void 0,
    isDirect: Boolean(r.is_direct),
    createdBy: r.created_by || "",
    adminIds: r.admin_ids || [],
    memberIds: r.member_ids || [],
    bannedUserIds: r.banned_user_ids || [],
    createdAt: r.created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function chatMessageToRow(m) {
  return {
    id: m.id,
    group_id: m.groupId,
    sender_id: m.senderId,
    sender_name: m.senderName,
    sender_avatar: m.senderAvatar || null,
    type: m.type || "text",
    content: m.content || "",
    file_url: m.fileUrl || null,
    file_name: m.fileName || null,
    file_size: m.fileSize || null,
    forwarded_material: m.forwardedMaterial || null,
    timestamp: m.timestamp || "Today",
    created_at: m.createdAt || Date.now(),
    delivered_to: m.deliveredTo || [],
    read_by: m.readBy || [],
    reactions: m.reactions || [],
    reply_to: m.replyTo || null,
    is_deleted: Boolean(m.isDeleted),
    is_pinned: Boolean(m.isPinned),
    is_starred: Boolean(m.isStarred),
    starred_by: m.starredBy || [],
    ...m.isEdited ? { is_edited: true, edited_at: m.editedAt ?? Date.now() } : {}
  };
}
function rowToChatMessage(r) {
  return {
    id: r.id,
    groupId: r.group_id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    senderAvatar: r.sender_avatar || "",
    type: r.type || "text",
    content: r.content || "",
    fileUrl: r.file_url || void 0,
    fileName: r.file_name || void 0,
    fileSize: r.file_size || void 0,
    forwardedMaterial: r.forwarded_material || void 0,
    timestamp: r.timestamp || "Today",
    createdAt: Number(r.created_at) || Date.now(),
    deliveredTo: r.delivered_to || [],
    readBy: r.read_by || [],
    reactions: r.reactions || [],
    replyTo: r.reply_to || void 0,
    isDeleted: Boolean(r.is_deleted),
    isPinned: Boolean(r.is_pinned),
    isStarred: Boolean(r.is_starred),
    starredBy: r.starred_by || [],
    isEdited: Boolean(r.is_edited),
    editedAt: r.edited_at ? Number(r.edited_at) : void 0
  };
}
async function dbFetchClassrooms() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("classrooms").select("*").order("created_at", { ascending: false });
    if (error) {
      console.warn("dbFetchClassrooms warning:", error.message);
      return [];
    }
    return (data || []).map(rowToClassroom);
  } catch (err) {
    console.warn("dbFetchClassrooms exception:", err);
    return [];
  }
}
async function dbSaveClassroom(cls) {
  try {
    const sb = getSupabase();
    const row = classroomToRow(cls);
    const { error } = await sb.from("classrooms").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveClassroom warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveClassroom exception:", err);
    return false;
  }
}
async function dbFindClassroomByCode(code) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("classrooms").select("*").ilike("code", code.trim()).maybeSingle();
    if (error || !data) return null;
    return rowToClassroom(data);
  } catch (err) {
    console.warn("dbFindClassroomByCode exception:", err);
    return null;
  }
}
async function dbFetchSubjects(classroomId) {
  try {
    const sb = getSupabase();
    let query = sb.from("subjects").select("*");
    if (classroomId) {
      query = query.eq("classroom_id", classroomId);
    }
    const { data, error } = await query.order("code", { ascending: true });
    if (error) {
      console.warn("dbFetchSubjects warning:", error.message);
      return [];
    }
    return (data || []).map(rowToSubject);
  } catch (err) {
    console.warn("dbFetchSubjects exception:", err);
    return [];
  }
}
async function dbSaveSubject(s) {
  try {
    const sb = getSupabase();
    const row = subjectToRow(s);
    const { error } = await sb.from("subjects").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveSubject warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveSubject exception:", err);
    return false;
  }
}
async function dbFetchMaterials(classroomId, subjectId) {
  try {
    const sb = getSupabase();
    let query = sb.from("materials").select("*");
    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }
    const { data, error } = await query.order("created_at", { ascending: true });
    if (error) {
      console.warn("dbFetchMaterials warning:", error.message);
      return [];
    }
    return (data || []).map((r) => rowToMaterial(r, classroomId));
  } catch (err) {
    console.warn("dbFetchMaterials exception:", err);
    return [];
  }
}
async function dbSaveMaterial(m) {
  try {
    const sb = getSupabase();
    const row = materialToRow(m);
    const { error } = await sb.from("materials").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveMaterial warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveMaterial exception:", err);
    return false;
  }
}
async function dbFetchAnnouncements(classroomId) {
  try {
    const sb = getSupabase();
    let query = sb.from("announcements").select("*");
    if (classroomId) {
      query = query.eq("classroom_id", classroomId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.warn("dbFetchAnnouncements warning:", error.message);
      return [];
    }
    return (data || []).map(rowToAnnouncement);
  } catch (err) {
    console.warn("dbFetchAnnouncements exception:", err);
    return [];
  }
}
async function dbSaveAnnouncement(a) {
  try {
    const sb = getSupabase();
    const row = announcementToRow(a);
    const { error } = await sb.from("announcements").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveAnnouncement warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveAnnouncement exception:", err);
    return false;
  }
}
async function dbFetchExams(classroomId) {
  try {
    const sb = getSupabase();
    let query = sb.from("exams").select("*");
    if (classroomId) {
      query = query.eq("classroom_id", classroomId);
    }
    const { data, error } = await query.order("date", { ascending: true });
    if (error) {
      console.warn("dbFetchExams warning:", error.message);
      return [];
    }
    return (data || []).map(rowToExam);
  } catch (err) {
    console.warn("dbFetchExams exception:", err);
    return [];
  }
}
async function dbSaveExam(e) {
  try {
    const sb = getSupabase();
    const row = examToRow(e);
    const { error } = await sb.from("exams").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveExam warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveExam exception:", err);
    return false;
  }
}
async function dbUpdateExam(id, updates) {
  try {
    const sb = getSupabase();
    const patch = {};
    if (updates.isCompleted !== void 0) patch.is_completed = updates.isCompleted;
    if (updates.progressPercent !== void 0) patch.progress_percent = updates.progressPercent;
    if (updates.daysRemaining !== void 0) patch.days_remaining = updates.daysRemaining;
    if (updates.date !== void 0) patch.date = updates.date;
    if (updates.time !== void 0) patch.time = updates.time;
    if (updates.venue !== void 0) patch.venue = updates.venue;
    const { error } = await sb.from("exams").update(patch).eq("id", id);
    if (error) {
      console.warn("dbUpdateExam warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbUpdateExam exception:", err);
    return false;
  }
}
async function dbFetchMembers(classroomId) {
  try {
    const sb = getSupabase();
    let query = sb.from("classroom_members").select("*");
    if (classroomId) {
      query = query.eq("classroom_id", classroomId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("dbFetchMembers warning:", error.message);
      return [];
    }
    return (data || []).map(rowToMember);
  } catch (err) {
    console.warn("dbFetchMembers exception:", err);
    return [];
  }
}
async function dbSaveMember(m) {
  try {
    const sb = getSupabase();
    const row = memberToRow(m);
    const { error } = await sb.from("classroom_members").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveMember warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveMember exception:", err);
    return false;
  }
}
async function dbUpdateMemberRole(id, role) {
  try {
    const sb = getSupabase();
    const { error } = await sb.from("classroom_members").update({ role }).eq("id", id);
    if (error) {
      console.warn("dbUpdateMemberRole warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbUpdateMemberRole exception:", err);
    return false;
  }
}
async function dbDeleteMember(id) {
  try {
    const sb = getSupabase();
    const { error } = await sb.from("classroom_members").delete().eq("id", id);
    if (error) {
      console.warn("dbDeleteMember warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbDeleteMember exception:", err);
    return false;
  }
}
async function dbFetchChatGroups(classroomId) {
  try {
    const sb = getSupabase();
    let query = sb.from("chat_groups").select("*");
    if (classroomId) {
      query = query.eq("classroom_id", classroomId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.warn("dbFetchChatGroups warning:", error.message);
      return [];
    }
    return (data || []).map(rowToChatGroup);
  } catch (err) {
    console.warn("dbFetchChatGroups exception:", err);
    return [];
  }
}
async function dbSaveChatGroup(g) {
  try {
    const sb = getSupabase();
    const row = chatGroupToRow(g);
    const { error } = await sb.from("chat_groups").upsert(row, { onConflict: "id" });
    if (error) {
      console.warn("dbSaveChatGroup warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("dbSaveChatGroup exception:", err);
    return false;
  }
}
async function dbFetchChatMessages(groupId) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("chat_messages").select("*").eq("group_id", groupId).order("created_at", { ascending: true });
    if (error) {
      console.warn("dbFetchChatMessages warning:", error.message);
      return [];
    }
    return (data || []).map(rowToChatMessage);
  } catch (err) {
    console.warn("dbFetchChatMessages exception:", err);
    return [];
  }
}
async function withEditColumnsFallback(payload, execute, label) {
  const { error } = await execute(payload);
  if (!error) return true;
  if (error.message?.includes("is_edited") || error.message?.includes("edited_at")) {
    const { is_edited: _ie, edited_at: _ea, ...legacyPayload } = payload;
    if (Object.keys(legacyPayload).length === 0) return true;
    const retry = await execute(legacyPayload);
    if (!retry.error) return true;
    console.warn(`${label} warning:`, retry.error.message);
    return false;
  }
  console.warn(`${label} warning:`, error.message);
  return false;
}
async function dbSaveChatMessage(m) {
  try {
    const sb = getSupabase();
    const row = chatMessageToRow(m);
    return await withEditColumnsFallback(
      row,
      (body) => sb.from("chat_messages").upsert(body, { onConflict: "id" }),
      "dbSaveChatMessage"
    );
  } catch (err) {
    console.warn("dbSaveChatMessage exception:", err);
    return false;
  }
}
async function dbUpdateChatMessage(id, patch) {
  try {
    const sb = getSupabase();
    const rowPatch = {};
    if (patch.content !== void 0) rowPatch.content = patch.content;
    if (patch.reactions !== void 0) rowPatch.reactions = patch.reactions;
    if (patch.isPinned !== void 0) rowPatch.is_pinned = patch.isPinned;
    if (patch.isStarred !== void 0) rowPatch.is_starred = patch.isStarred;
    if (patch.starredBy !== void 0) rowPatch.starred_by = patch.starredBy;
    if (patch.deliveredTo !== void 0) rowPatch.delivered_to = patch.deliveredTo;
    if (patch.readBy !== void 0) rowPatch.read_by = patch.readBy;
    if (patch.isDeleted !== void 0) rowPatch.is_deleted = patch.isDeleted;
    if (patch.isEdited !== void 0) rowPatch.is_edited = patch.isEdited;
    if (patch.editedAt !== void 0) rowPatch.edited_at = patch.editedAt;
    if (Object.keys(rowPatch).length === 0) return true;
    return await withEditColumnsFallback(
      rowPatch,
      (body) => sb.from("chat_messages").update(body).eq("id", id),
      "dbUpdateChatMessage"
    );
  } catch (err) {
    console.warn("dbUpdateChatMessage exception:", err);
    return false;
  }
}

// server.ts
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  if (process.env.VERCEL && !req.url.startsWith("/api") && !req.url.startsWith("/ws")) {
    req.url = "/api" + req.url;
  }
  next();
});
var server = http.createServer(app);
var wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (request, socket, head) => {
  const host = request.headers.host || "localhost:3000";
  const urlObj = new URL(request.url || "", `http://${host}`);
  if (urlObj.pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});
function daysFromToday(offsetDays) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}
function mergeRecordsById(incoming, existing) {
  const map = /* @__PURE__ */ new Map();
  incoming.forEach((item) => map.set(item.id, item));
  existing.forEach((item) => {
    if (!map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
}
var classrooms = [
  {
    id: "cls-1",
    code: "BTECH26A",
    name: "B.Tech CSE 2026 - Section A",
    collegeName: "Oxford University",
    location: "Oxford, United Kingdom",
    department: "Department of Computer Science & Engineering",
    course: "B.Tech Computer Science & Engineering",
    degreeLevel: "undergraduate",
    batchYear: "2026",
    section: "Section A",
    semester: "Semester 5",
    superAdminId: "user-sarah",
    memberCount: 64,
    createdAt: "2024-08-15"
  },
  {
    id: "cls-2",
    code: "AIDS26A",
    name: "B.Tech AI & Data Science 2026",
    collegeName: "Stanford University",
    location: "Stanford, California, USA",
    department: "School of Engineering & AI",
    course: "B.Tech Artificial Intelligence",
    degreeLevel: "undergraduate",
    batchYear: "2026",
    section: "Section A",
    semester: "Semester 5",
    superAdminId: "user-alex",
    memberCount: 42,
    createdAt: "2024-08-20"
  }
];
var registeredUsers = [
  {
    id: "user-sarah",
    name: "Sarah Jenkins",
    email: "sarah.j@oxford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
    role: "super_admin",
    department: "Computer Science",
    rollNumber: "CS22B042",
    classroomId: "cls-1"
  },
  {
    id: "user-michael",
    name: "Michael Klein",
    email: "michael.k@oxford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg",
    role: "admin",
    department: "Computer Science",
    rollNumber: "CS22B018",
    classroomId: "cls-1"
  },
  {
    id: "user-elena",
    name: "Elena Rostova",
    email: "elena.r@oxford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS22B029",
    classroomId: "cls-1"
  },
  {
    id: "user-david",
    name: "David Chen",
    email: "david.c@oxford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
    role: "student",
    department: "Computer Science",
    rollNumber: "CS22B011",
    classroomId: "cls-1"
  },
  {
    id: "user-alex",
    name: "Alex Turner",
    email: "alex.t@stanford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A",
    role: "super_admin",
    department: "School of Engineering & AI",
    rollNumber: "AI24B001",
    classroomId: "cls-2"
  },
  {
    id: "user-maya",
    name: "Maya Lin",
    email: "maya.l@stanford.edu",
    password: "password123",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    role: "student",
    department: "School of Engineering & AI",
    rollNumber: "AI24B014",
    classroomId: "cls-2"
  }
];
var currentUser = null;
var subjects = [
  {
    id: "sub-ds",
    classroomId: "cls-1",
    code: "CS301",
    name: "Data Structures",
    professor: "Prof. Alan Turing",
    description: "Fundamental concepts of data organization, algorithms, and complexity analysis essential for efficient software development.",
    creditHours: 4,
    materialsCount: 4,
    notesCount: 3,
    pyqsCount: 1
  },
  {
    id: "sub-os",
    classroomId: "cls-1",
    code: "CS302",
    name: "Operating Systems",
    professor: "Prof. A. Kumar",
    description: "Concurrency, process management, memory virtualisation, file systems and distributed operating system architectures.",
    creditHours: 4,
    materialsCount: 1,
    notesCount: 0,
    pyqsCount: 0
  },
  {
    id: "sub-algo",
    classroomId: "cls-1",
    code: "CS303",
    name: "Algorithm Analysis",
    professor: "Dr. S. Gupta",
    description: "Asymptotic notation, dynamic programming, divide-and-conquer, greedy heuristics, NP-completeness and graph algorithms.",
    creditHours: 4,
    materialsCount: 1,
    notesCount: 1,
    pyqsCount: 0
  },
  {
    id: "sub-cn",
    classroomId: "cls-1",
    code: "CS304",
    name: "Computer Networks",
    professor: "Dr. N. Singh",
    description: "OSI & TCP/IP stack layers, routing protocols, flow and congestion control, socket programming and network security.",
    creditHours: 3,
    materialsCount: 1,
    notesCount: 0,
    pyqsCount: 0
  },
  {
    id: "sub-dbms",
    classroomId: "cls-1",
    code: "CS305",
    name: "Database Management Systems",
    professor: "Dr. E. Codd",
    description: "Relational algebra, SQL schema normalization, indexing, ACID transactions and distributed NoSQL systems.",
    creditHours: 4,
    materialsCount: 1,
    notesCount: 1,
    pyqsCount: 0
  },
  {
    id: "sub-toc",
    classroomId: "cls-1",
    code: "CS306",
    name: "Theory of Computation",
    professor: "Prof. N. Chomsky",
    description: "Automata theory, regular expressions, context-free grammars, Turing machines, decidability and computational complexity.",
    creditHours: 3,
    materialsCount: 1,
    notesCount: 0,
    pyqsCount: 0
  },
  {
    id: "sub-ml",
    classroomId: "cls-2",
    code: "AI301",
    name: "Machine Learning Foundations",
    professor: "Prof. Andrew Ng",
    description: "Supervised and unsupervised learning, generalization bounds, gradient optimization, SVMs, and ensemble methods.",
    creditHours: 4,
    materialsCount: 2,
    notesCount: 1,
    pyqsCount: 1
  },
  {
    id: "sub-dl",
    classroomId: "cls-2",
    code: "AI302",
    name: "Deep Learning & Transformers",
    professor: "Dr. Fei-Fei Li",
    description: "Backpropagation, convolutional networks, sequence modeling, self-attention mechanisms, and modern LLM architectures.",
    creditHours: 4,
    materialsCount: 1,
    notesCount: 0,
    pyqsCount: 0
  },
  {
    id: "sub-stat",
    classroomId: "cls-2",
    code: "AI303",
    name: "Statistical Data Science",
    professor: "Prof. T. Hastie",
    description: "Bayesian inference, maximum likelihood estimation, hypothesis testing, and high-dimensional data analysis.",
    creditHours: 3,
    materialsCount: 0,
    notesCount: 0,
    pyqsCount: 0
  }
];
var materials = [
  {
    id: "mat-1",
    classroomId: "cls-1",
    subjectId: "sub-ds",
    subjectCode: "CS301",
    subjectName: "Data Structures",
    title: "Trees & Graphs Deep Dive",
    description: "Comprehensive guide covering Binary Search Trees, AVL Trees, Red-Black Trees, Graph traversals (BFS/DFS), Dijkstra & A* shortest paths.",
    type: "notes",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: {
      id: "user-sarah",
      name: "Sarah J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
      role: "super_admin"
    },
    uploadedDate: "Aug 20, 2026",
    createdAt: 17865e8,
    downloadsCount: 142,
    viewsCount: 389,
    isVerified: true,
    tags: ["Trees", "Graphs", "BFS/DFS", "AVL Trees"],
    unit: "Unit 3 & 4",
    recommendedExam: "SEM",
    contentSnippet: "# Trees & Graphs Deep Dive\n\n## 1. Binary Search Trees (BST)\nA binary tree where every node in the left subtree has key <= node key, and right subtree has key > node key.\n\n### Balanced Trees\n- **AVL Trees**: Strict height balancing where balance factor BF = |h_L - h_R| <= 1.\n- **Rotations**: Single left (LL), single right (RR), double left-right (LR), double right-left (RL).\n\n## 2. Graph Algorithms\n- BFS: Uses Queue, O(V + E), shortest path in unweighted graphs.\n- DFS: Uses Stack / Recursion, cycle detection, topological sorting.\n- Dijkstra Algorithm: Greedy single-source shortest path with priority queue O((V + E) log V)."
  },
  {
    id: "mat-2",
    classroomId: "cls-1",
    subjectId: "sub-ds",
    subjectCode: "CS301",
    subjectName: "Data Structures",
    title: "Sorting Algorithms Summary & Cheat Sheet",
    description: "Time & space complexity cheat sheet for Quicksort, Mergesort, Heapsort, Radix Sort, with stability analysis and edge-case code samples.",
    type: "notes",
    fileFormat: "PDF",
    fileSize: "1.8 MB",
    uploadedBy: {
      id: "user-michael",
      name: "Michael K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg",
      role: "admin"
    },
    uploadedDate: "Aug 24, 2026",
    createdAt: 17868e8,
    downloadsCount: 98,
    viewsCount: 245,
    isVerified: true,
    tags: ["Sorting", "Complexity", "Quicksort", "Heapsort"],
    unit: "Unit 2",
    recommendedExam: "IAT 1",
    contentSnippet: "# Sorting Algorithms Quick Reference\n\n| Algorithm | Best | Average | Worst | Space | Stable? |\n|---|---|---|---|---|---|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |\n| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |"
  },
  {
    id: "mat-3",
    classroomId: "cls-1",
    subjectId: "sub-ds",
    subjectCode: "CS301",
    subjectName: "Data Structures",
    title: "Midterm Review Notes & Solved Problems",
    description: "Consolidated review questions and high-yield theorems for Midterm Exam 1. Includes solved problems from past 3 years.",
    type: "notes",
    fileFormat: "DOCX",
    fileSize: "540 KB",
    uploadedBy: {
      id: "user-elena",
      name: "Elena R.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
      role: "student"
    },
    uploadedDate: "Aug 28, 2026",
    createdAt: 17871e8,
    downloadsCount: 167,
    viewsCount: 412,
    isVerified: true,
    tags: ["Midterm", "Exam Prep", "Formulas"],
    unit: "Unit 1-3",
    recommendedExam: "IAT 1",
    contentSnippet: "# Data Structures Midterm Review\n\n## Important Concepts Checklist:\n1. Array vs Linked List trade-offs in cache locality\n2. Stack applications (Infix to Postfix evaluation, Parentheses matching)\n3. Circular Queue implementation and modular arithmetic\n4. Hashing collision resolution (Chaining vs Open Addressing)"
  },
  {
    id: "mat-4",
    classroomId: "cls-1",
    subjectId: "sub-os",
    subjectCode: "CS302",
    subjectName: "Operating Systems",
    title: "Process Synchronization & Semaphores",
    description: "Process Synchronization, Semaphores, Mutex Locks, Monitors, and Classic Synchronization Problems (Dining Philosophers, Readers-Writers).",
    type: "materials",
    fileFormat: "PDF",
    fileSize: "3.1 MB",
    uploadedBy: {
      id: "user-sarah",
      name: "Prof. A. Kumar",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
      role: "super_admin"
    },
    uploadedDate: "Aug 31, 2026",
    createdAt: 17874e8,
    downloadsCount: 215,
    viewsCount: 520,
    isVerified: true,
    tags: ["Synchronization", "Semaphores", "Deadlocks"],
    unit: "Chapter 4",
    recommendedExam: "IAT 2",
    contentSnippet: "# Process Synchronization\n\n## Critical Section Problem\nA code segment that accesses shared variables and must be executed atomically.\n\n### Requirements:\n1. Mutual Exclusion\n2. Progress\n3. Bounded Waiting\n\n### Semaphores\nInteger variable accessed only via atomic wait() [P] and signal() [V] operations."
  },
  {
    id: "mat-5",
    classroomId: "cls-1",
    subjectId: "sub-algo",
    subjectCode: "CS303",
    subjectName: "Algorithm Analysis",
    title: "Master Theorem & Divide and Conquer Recurrences",
    description: "Master Theorem proofs, divide and conquer recurrences, amortized analysis with aggregate and potential method.",
    type: "notes",
    fileFormat: "DOCX",
    fileSize: "1.2 MB",
    uploadedBy: {
      id: "user-michael",
      name: "Michael K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg",
      role: "admin"
    },
    uploadedDate: "Sep 02, 2026",
    createdAt: 17877e8,
    downloadsCount: 180,
    viewsCount: 390,
    isVerified: true,
    tags: ["Master Theorem", "Recurrences", "Amortized"],
    unit: "Unit 1 & 2",
    recommendedExam: "IAT 2",
    contentSnippet: "# Master Theorem Guide\n\nFor recurrence: `T(n) = aT(n/b) + f(n)`\n\nCompare f(n) with n^(log_b a):\n1. If f(n) = O(n^(log_b a - epsilon)), then T(n) = Theta(n^(log_b a))\n2. If f(n) = Theta(n^(log_b a)), then T(n) = Theta(n^(log_b a) * log n)\n3. If f(n) = Omega(n^(log_b a + epsilon)), then T(n) = Theta(f(n))"
  },
  {
    id: "mat-6",
    classroomId: "cls-1",
    subjectId: "sub-cn",
    subjectCode: "CS304",
    subjectName: "Computer Networks",
    title: "OSI Model & Data Link Layer Lecture Slides",
    description: "Physical & Data Link Layer fundamentals, framing, CRC error detection, Sliding Window Protocols and HDLC.",
    type: "slides",
    fileFormat: "PPTX",
    fileSize: "4.5 MB",
    uploadedBy: {
      id: "user-michael",
      name: "Dr. N. Singh",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
      role: "admin"
    },
    uploadedDate: "Sep 04, 2026",
    createdAt: 1788e9,
    downloadsCount: 132,
    viewsCount: 290,
    isVerified: true,
    tags: ["OSI Model", "Data Link", "CRC", "Sliding Window"],
    unit: "Lecture 2",
    recommendedExam: "IAT 1",
    contentSnippet: "# Computer Networks Lecture 2\n\n- Framing techniques: Character count, Byte stuffing, Bit stuffing\n- Cyclic Redundancy Check (CRC) polynomial division\n- Stop-and-Wait vs Go-Back-N vs Selective Repeat ARQ"
  },
  {
    id: "mat-7",
    classroomId: "cls-1",
    subjectId: "sub-ds",
    subjectCode: "CS301",
    subjectName: "Data Structures",
    title: "2023 Fall Midterm PYQ with Solutions",
    description: "Official Previous Year Question paper from Fall 2023 with step-by-step verified solutions and grading rubrics.",
    type: "pyqs",
    fileFormat: "PDF",
    fileSize: "3.4 MB",
    uploadedBy: {
      id: "user-sarah",
      name: "Sarah J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
      role: "super_admin"
    },
    uploadedDate: "Sep 05, 2026",
    createdAt: 17883e8,
    downloadsCount: 310,
    viewsCount: 650,
    isVerified: true,
    tags: ["PYQ", "2023", "Solved Paper"],
    unit: "Past Exam",
    recommendedExam: "IAT 1",
    contentSnippet: "# 2023 Fall Midterm Exam Solutions\n\n### Q1: Construct an AVL tree by inserting [15, 20, 24, 10, 13, 7, 30, 36, 25]\nSolution: Shows step-by-step tree drawings and rotation triggers.\n\n### Q2: Prove that Dijkstra does not work for negative edge weights.\nSolution: Counterexample graph with 3 vertices."
  },
  {
    id: "mat-8",
    classroomId: "cls-1",
    subjectId: "sub-dbms",
    subjectCode: "CS305",
    subjectName: "Database Management Systems",
    title: "SQL, Normalization & ACID Transactions Sheet",
    description: "BCNF vs 3NF decomposition algorithms, serializability testing with precedence graphs, and 2-phase locking protocol.",
    type: "notes",
    fileFormat: "PDF",
    fileSize: "3.0 MB",
    uploadedBy: {
      id: "user-david",
      name: "David C.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
      role: "student"
    },
    uploadedDate: "Sep 04, 2026",
    createdAt: 17881e8,
    downloadsCount: 240,
    viewsCount: 510,
    isVerified: true,
    tags: ["BCNF", "Normalization", "ACID", "Transactions"],
    unit: "Unit 3 & 4",
    recommendedExam: "IAT 2",
    contentSnippet: "# Database Normalization & Transactions\n\n## Normal Forms:\n- 1NF: Atomic attribute values\n- 2NF: 1NF + No partial dependencies\n- 3NF: 2NF + No transitive dependencies (X -> A implies X is superkey OR A is prime attribute)\n- BCNF: X -> A implies X is superkey\n\n## ACID Properties:\n- Atomicity (All or nothing)\n- Consistency (Preserves database integrity)\n- Isolation (Concurrent transactions do not interfere)\n- Durability (Committed updates persist)"
  },
  {
    id: "mat-9",
    classroomId: "cls-1",
    subjectId: "sub-toc",
    subjectCode: "CS306",
    subjectName: "Theory of Computation",
    title: "Pumping Lemma, CFG & Turing Machine High-Yield Questions",
    description: "Curated important exam questions covering DFA/NFA minimization, Pumping Lemma proofs, Pushdown Automata, and Undecidability.",
    type: "important_questions",
    fileFormat: "PDF",
    fileSize: "1.6 MB",
    uploadedBy: {
      id: "user-sarah",
      name: "Sarah J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
      role: "super_admin"
    },
    uploadedDate: "Sep 06, 2026",
    createdAt: 17885e8,
    downloadsCount: 194,
    viewsCount: 430,
    isVerified: true,
    tags: ["Automata", "Pumping Lemma", "Turing Machines", "Important"],
    unit: "Unit 1-4",
    recommendedExam: "IAT 1",
    contentSnippet: "# Theory of Computation High-Yield Questions\n\n1. Prove L = { a^n b^n c^n | n >= 1 } is not context-free using the Pumping Lemma for CFLs.\n2. Convert the given NFA with epsilon-transitions into an equivalent minimized DFA.\n3. Show that the Halting Problem HALT_TM is undecidable via reduction from A_TM."
  },
  {
    id: "mat-10",
    classroomId: "cls-2",
    subjectId: "sub-ml",
    subjectCode: "AI301",
    subjectName: "Machine Learning Foundations",
    title: "Gradient Descent, Regularization & Bias-Variance Tradeoff",
    description: "Complete lecture notes on L1/L2 regularization, SGD with momentum, Adam optimizer, cross-validation, and generalization bounds.",
    type: "notes",
    fileFormat: "PDF",
    fileSize: "2.7 MB",
    uploadedBy: {
      id: "user-alex",
      name: "Alex T.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A",
      role: "super_admin"
    },
    uploadedDate: "Sep 01, 2026",
    createdAt: 17876e8,
    downloadsCount: 158,
    viewsCount: 342,
    isVerified: true,
    tags: ["Gradient Descent", "Regularization", "Bias-Variance"],
    unit: "Unit 1 & 2",
    recommendedExam: "IAT 1",
    contentSnippet: "# Machine Learning Foundations\n\n## Bias-Variance Decomposition\nExpected MSE = Bias^2 + Variance + Irreducible Noise.\n\n- **L2 (Ridge)**: Penalizes sum of squared weights; shrinks parameters smoothly.\n- **L1 (Lasso)**: Penalizes sum of absolute weights; induces sparsity for feature selection."
  },
  {
    id: "mat-11",
    classroomId: "cls-2",
    subjectId: "sub-dl",
    subjectCode: "AI302",
    subjectName: "Deep Learning & Transformers",
    title: "Transformers, Multi-Head Attention & Positional Encoding Slides",
    description: "Annotated lecture slides covering scaled dot-product attention, causal masking, layer normalization, and encoder-decoder architectures.",
    type: "slides",
    fileFormat: "PPTX",
    fileSize: "5.1 MB",
    uploadedBy: {
      id: "user-alex",
      name: "Alex T.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A",
      role: "super_admin"
    },
    uploadedDate: "Sep 05, 2026",
    createdAt: 17882e8,
    downloadsCount: 204,
    viewsCount: 475,
    isVerified: true,
    tags: ["Transformers", "Attention", "Deep Learning"],
    unit: "Module 3",
    recommendedExam: "IAT 2",
    contentSnippet: "# Attention Is All You Need\n\n`Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V`\n\n- Scaling by `1/sqrt(d_k)` prevents softmax saturation in high dimensions.\n- Multi-head attention projects queries, keys, and values into `h` parallel subspaces."
  },
  {
    id: "mat-12",
    classroomId: "cls-2",
    subjectId: "sub-ml",
    subjectCode: "AI301",
    subjectName: "Machine Learning Foundations",
    title: "2025 Fall ML Midterm PYQ with Worked Solutions",
    description: "Previous year midterm paper with derivations for Logistic Regression gradients, Kernel trick, and Decision Tree Gini impurity.",
    type: "pyqs",
    fileFormat: "PDF",
    fileSize: "2.2 MB",
    uploadedBy: {
      id: "user-maya",
      name: "Maya L.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
      role: "student"
    },
    uploadedDate: "Sep 06, 2026",
    createdAt: 17884e8,
    downloadsCount: 121,
    viewsCount: 288,
    isVerified: true,
    tags: ["PYQ", "Kernel Trick", "Logistic Regression"],
    unit: "Past Exam",
    recommendedExam: "IAT 1",
    contentSnippet: "# 2025 Fall ML Midterm Solutions\n\n1. Derive the log-loss gradient with respect to weights w.\n2. Prove that the RBF kernel is a valid Mercer kernel.\n3. Compute information gain for the root split."
  }
];
var announcements = [
  {
    id: "ann-1",
    classroomId: "cls-1",
    title: "Internal Exam Schedule Released for Mid-Semesters.",
    description: "Mid-semester examinations will commence shortly. Please check the Exams tab for the complete timetable, recommended study sheets, and hall allocations.",
    timestamp: "Today, 09:00 AM",
    author: "Admin Office",
    isUrgent: true
  },
  {
    id: "ann-2",
    classroomId: "cls-1",
    title: "Guest Lecture: Advances in Machine Learning by Dr. V. Sharma in Hall 3.",
    description: "All 3rd-year CS students are requested to attend. Attendance will be counted towards the lab curriculum.",
    timestamp: "Yesterday",
    author: "Prof. Alan Turing",
    isUrgent: false
  },
  {
    id: "ann-3",
    classroomId: "cls-1",
    title: "Data Structures Assignment 3 Deadline Extended to Sunday Midnight.",
    description: "Submit your Tree traversal and Graph cycle detection assignments directly via the portal or notes submission tab.",
    timestamp: "3 days ago",
    author: "Sarah Jenkins (Class Rep)",
    isUrgent: false
  },
  {
    id: "ann-4",
    classroomId: "cls-2",
    title: "AI301 Midterm Review Workshop & GPU Cluster Access Updated.",
    description: "Review the Gradient Descent notes and Fall 2025 PYQ in the library before Friday\u2019s live lab walkthrough.",
    timestamp: "Today, 10:30 AM",
    author: "Alex Turner (Class Rep)",
    isUrgent: true
  },
  {
    id: "ann-5",
    classroomId: "cls-2",
    title: "Transformer Lab Notebook Templates Published in AI302.",
    description: "Download the lecture slides and starter attention module benchmarks before next week\u2019s seminar.",
    timestamp: "2 days ago",
    author: "Dr. Fei-Fei Li",
    isUrgent: false
  }
];
var exams = [
  {
    id: "exam-1",
    classroomId: "cls-1",
    subjectName: "Data Structures",
    subjectCode: "CS301",
    date: daysFromToday(5),
    daysRemaining: 5,
    time: "10:00 AM - 01:00 PM",
    examType: "IAT 1",
    venue: "Hall 201",
    progressPercent: 80,
    isCompleted: false
  },
  {
    id: "exam-2",
    classroomId: "cls-1",
    subjectName: "Theory of Computation",
    subjectCode: "CS306",
    date: daysFromToday(9),
    daysRemaining: 9,
    time: "10:00 AM - 01:00 PM",
    examType: "IAT 1",
    venue: "Hall 201",
    progressPercent: 70,
    isCompleted: false
  },
  {
    id: "exam-3",
    classroomId: "cls-1",
    subjectName: "Computer Networks",
    subjectCode: "CS304",
    date: daysFromToday(13),
    daysRemaining: 13,
    time: "02:00 PM - 05:00 PM",
    examType: "IAT 1",
    venue: "Hall 204",
    progressPercent: 65,
    isCompleted: false
  },
  {
    id: "exam-4",
    classroomId: "cls-1",
    subjectName: "Operating Systems",
    subjectCode: "CS302",
    date: daysFromToday(24),
    daysRemaining: 24,
    time: "10:00 AM - 01:00 PM",
    examType: "IAT 2",
    venue: "Hall 202",
    progressPercent: 45,
    isCompleted: false
  },
  {
    id: "exam-5",
    classroomId: "cls-1",
    subjectName: "Database Management Systems",
    subjectCode: "CS305",
    date: daysFromToday(-10),
    daysRemaining: -10,
    time: "10:00 AM - 01:00 PM",
    examType: "IAT 0",
    venue: "Hall 105",
    progressPercent: 100,
    isCompleted: true
  },
  {
    id: "exam-6",
    classroomId: "cls-2",
    subjectName: "Machine Learning Foundations",
    subjectCode: "AI301",
    date: daysFromToday(6),
    daysRemaining: 6,
    time: "09:30 AM - 12:30 PM",
    examType: "IAT 1",
    venue: "Gates Auditorium",
    progressPercent: 75,
    isCompleted: false
  },
  {
    id: "exam-7",
    classroomId: "cls-2",
    subjectName: "Deep Learning & Transformers",
    subjectCode: "AI302",
    date: daysFromToday(16),
    daysRemaining: 16,
    time: "02:00 PM - 05:00 PM",
    examType: "IAT 2",
    venue: "NVIDIA Lab 102",
    progressPercent: 50,
    isCompleted: false
  }
];
var members = [
  {
    id: "user-sarah",
    classroomId: "cls-1",
    name: "Sarah Jenkins",
    email: "sarah.j@oxford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
    role: "super_admin",
    rollNumber: "CS22B042",
    joinedDate: "Aug 2024"
  },
  {
    id: "user-michael",
    classroomId: "cls-1",
    name: "Michael Klein",
    email: "michael.k@oxford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg",
    role: "admin",
    rollNumber: "CS22B018",
    joinedDate: "Aug 2024"
  },
  {
    id: "user-elena",
    classroomId: "cls-1",
    name: "Elena Rostova",
    email: "elena.r@oxford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    role: "student",
    rollNumber: "CS22B029",
    joinedDate: "Sep 2024"
  },
  {
    id: "user-david",
    classroomId: "cls-1",
    name: "David Chen",
    email: "david.c@oxford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
    role: "student",
    rollNumber: "CS22B011",
    joinedDate: "Sep 2024"
  },
  {
    id: "user-alex",
    classroomId: "cls-2",
    name: "Alex Turner",
    email: "alex.t@stanford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A",
    role: "super_admin",
    rollNumber: "AI24B001",
    joinedDate: "Aug 2024"
  },
  {
    id: "user-maya",
    classroomId: "cls-2",
    name: "Maya Lin",
    email: "maya.l@stanford.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    role: "student",
    rollNumber: "AI24B014",
    joinedDate: "Sep 2024"
  }
];
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const key = parts.shift()?.trim();
      if (key) {
        try {
          list[key] = decodeURIComponent(parts.join("="));
        } catch (e) {
          list[key] = parts.join("=");
        }
      }
    });
  }
  return list;
}
function setAuthCookies(res, user, classroomId) {
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    department: user.department,
    rollNumber: user.rollNumber,
    classroomId: classroomId || user.classroomId
  };
  const maxAge = 30 * 24 * 60 * 60;
  const cookieUser = `as_auth_user=${encodeURIComponent(JSON.stringify(sanitizedUser))}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  const cookieClassroom = `as_active_classroom_id=${encodeURIComponent(sanitizedUser.classroomId || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  res.setHeader("Set-Cookie", [cookieUser, cookieClassroom]);
}
function clearAuthCookies(res) {
  res.setHeader("Set-Cookie", [
    "as_auth_user=; Path=/; Max-Age=0; SameSite=Lax",
    "as_active_classroom_id=; Path=/; Max-Age=0; SameSite=Lax"
  ]);
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/auth/demo-users", (req, res) => {
  const sanitized = registeredUsers.map((u) => {
    const cls = classrooms.find((c) => c.id === u.classroomId);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: u.role,
      department: u.department,
      rollNumber: u.rollNumber,
      classroomId: u.classroomId,
      classroomName: cls ? cls.name : "Unknown Cohort",
      classroomCode: cls ? cls.code : ""
    };
  });
  res.json(sanitized);
});
app.get("/api/auth/me", async (req, res) => {
  let userToReturn = null;
  const cookies = parseCookies(req);
  if (cookies.as_auth_user) {
    try {
      const parsed = JSON.parse(cookies.as_auth_user);
      if (parsed && parsed.id) {
        let registered = registeredUsers.find(
          (u) => u.id === parsed.id || parsed.email && u.email?.toLowerCase() === parsed.email.toLowerCase()
        );
        if (!registered) {
          registeredUsers.push(parsed);
          registered = parsed;
        }
        currentUser = registered;
        userToReturn = registered;
      }
    } catch (e) {
      console.warn("Error parsing auth cookie in /api/auth/me:", e);
    }
  }
  if (!userToReturn && req.headers["x-user-id"]) {
    const headerId = req.headers["x-user-id"];
    const found = registeredUsers.find((u) => u.id === headerId) || members.find((m) => m.id === headerId);
    if (found) {
      currentUser = found;
      userToReturn = found;
    }
  }
  if (!userToReturn && currentUser) {
    userToReturn = currentUser;
  }
  if (!userToReturn) {
    return res.json({ authenticated: false, user: null, classroom: null });
  }
  const activeClsId = cookies.as_active_classroom_id || userToReturn.classroomId;
  let userClassroom = activeClsId ? classrooms.find((c) => c.id === activeClsId) || null : null;
  if (!userClassroom && userToReturn.classroomId) {
    userClassroom = classrooms.find((c) => c.id === userToReturn.classroomId) || null;
  }
  if (!userClassroom && activeClsId) {
    try {
      const dbCls = await dbFetchClassrooms();
      userClassroom = dbCls.find((c) => c.id === activeClsId) || null;
      if (userClassroom && !classrooms.some((c) => c.id === userClassroom.id)) {
        classrooms.push(userClassroom);
      }
    } catch (e) {
      console.warn("Classroom lookup in /api/auth/me notice:", e);
    }
  }
  const { password: _pwd, ...safeUser } = userToReturn;
  res.json({
    authenticated: true,
    user: safeUser,
    classroom: userClassroom
  });
});
app.get("/api/user", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (!activeUser || activeUser.id === "user-guest") {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(activeUser);
});
app.post("/api/auth/switch-cohort", (req, res) => {
  const { classroomId } = req.body;
  const targetClassroom = classrooms.find((c) => c.id === classroomId);
  if (!targetClassroom) {
    return res.status(404).json({ error: "Cohort not found." });
  }
  const activeUser = getCurrentOrReqUser(req);
  activeUser.classroomId = classroomId;
  if (currentUser && currentUser.id === activeUser.id) {
    currentUser.classroomId = classroomId;
  }
  const reg = registeredUsers.find((u) => u.id === activeUser.id);
  if (reg) reg.classroomId = classroomId;
  setAuthCookies(res, activeUser, classroomId);
  res.json({ success: true, classroom: targetClassroom, user: activeUser });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Institutional email is required." });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: "Password is required." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  let foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  if (!foundUser) {
    return res.status(404).json({ error: "No account found with this email address. Please check your email or sign up." });
  }
  if (foundUser.password && cleanPassword && foundUser.password !== cleanPassword) {
    return res.status(401).json({ error: "Incorrect password. Please verify your credentials or use Forgot Password." });
  }
  currentUser = foundUser;
  const userClassroom = foundUser.classroomId ? classrooms.find((c) => c.id === foundUser.classroomId) || null : null;
  setAuthCookies(res, foundUser, userClassroom?.id);
  const { password: _pwd, ...safeUser } = foundUser;
  res.json({
    success: true,
    user: safeUser,
    classroom: userClassroom,
    message: `Welcome back, ${foundUser.name}!`
  });
});
var signupOtpStore = /* @__PURE__ */ new Map();
function registerUserInternal(data) {
  const {
    name,
    email,
    password,
    department,
    rollNumber,
    regNo,
    role = "student",
    classroomOption = "join",
    // 'join' | 'select' | 'create'
    classroomCode,
    classroomId,
    newClassroomData
  } = data;
  const resolvedRegNo = (regNo || rollNumber || "").trim();
  const cleanEmail = email.trim().toLowerCase();
  const userId = `user-${Date.now()}`;
  let assignedClassroom = null;
  let finalRole = role;
  if (classroomOption === "create" && newClassroomData) {
    finalRole = "super_admin";
    const newCode = `${newClassroomData.course ? newClassroomData.course.substring(0, 3).toUpperCase() : "CLS"}${newClassroomData.batchYear ? newClassroomData.batchYear.slice(-2) : "26"}${newClassroomData.section ? newClassroomData.section.slice(-1) : "A"}`.replace(/[^A-Z0-9]/g, "") || `SANCT${Math.floor(10 + Math.random() * 90)}`;
    assignedClassroom = {
      id: `cls-${Date.now()}`,
      code: newCode,
      name: `${newClassroomData.course || "Classroom"} ${newClassroomData.batchYear || "2026"} - ${newClassroomData.section || "Section A"}`,
      collegeName: newClassroomData.collegeName || "Academic University",
      location: newClassroomData.location || "Campus",
      department: newClassroomData.department || department,
      course: newClassroomData.course || "Degree Program",
      degreeLevel: newClassroomData.degreeLevel || "undergraduate",
      batchYear: newClassroomData.batchYear || "2026",
      section: newClassroomData.section || "Section A",
      semester: newClassroomData.semester || "Semester 5",
      superAdminId: userId,
      memberCount: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    classrooms.unshift(assignedClassroom);
    if (Array.isArray(newClassroomData.selectedSubjects) && newClassroomData.selectedSubjects.length > 0) {
      newClassroomData.selectedSubjects.forEach((subName, idx) => {
        const match = subName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
        const sName = match && match[1] ? match[1].trim() : subName;
        const sCode = match && match[2] ? match[2].trim() : `CS30${idx + 1}`;
        subjects.push({
          id: `sub-${Date.now()}-${idx}`,
          classroomId: assignedClassroom.id,
          code: sCode,
          name: sName,
          professor: "Faculty Coordinator",
          description: `Comprehensive coursework and materials for ${sName}.`,
          creditHours: 4,
          materialsCount: 0,
          notesCount: 0,
          pyqsCount: 0
        });
      });
    }
  } else if (classroomOption === "join" && classroomCode) {
    const codeMatch = classrooms.find((c) => c.code.toLowerCase() === classroomCode.trim().toLowerCase());
    if (codeMatch) {
      assignedClassroom = codeMatch;
      assignedClassroom.memberCount += 1;
    } else {
      assignedClassroom = {
        id: `cls-${Date.now()}`,
        code: classroomCode.trim().toUpperCase(),
        name: `Cohort ${classroomCode.trim().toUpperCase()}`,
        collegeName: "University Campus",
        location: "Academic Hall",
        department: department || "Engineering",
        course: "Degree Program",
        degreeLevel: "undergraduate",
        batchYear: "2026",
        section: "Section A",
        semester: "Semester 5",
        superAdminId: userId,
        memberCount: 1,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
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
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg"
  ];
  const newUser = {
    id: userId,
    name: name.trim(),
    email: cleanEmail,
    password: (password || "").trim(),
    avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    role: finalRole,
    department: (department || "Computer Science").trim(),
    rollNumber: resolvedRegNo,
    classroomId: assignedClassroom ? assignedClassroom.id : null
  };
  registeredUsers.push(newUser);
  currentUser = newUser;
  if (assignedClassroom) {
    members.push({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role,
      rollNumber: newUser.rollNumber,
      joinedDate: "Just now"
    });
  }
  return { newUser, assignedClassroom };
}
app.post("/api/auth/send-signup-otp", (req, res) => {
  const { name, email, password, department, rollNumber, regNo } = req.body;
  const resolvedRegNo = (regNo || rollNumber || "").trim();
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Full name is required." });
  }
  if (!resolvedRegNo) {
    return res.status(400).json({ error: "Registration number (Reg No) is required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Institutional email is required." });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists. Please sign in instead." });
  }
  const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  const expiresAt = Date.now() + 10 * 60 * 1e3;
  signupOtpStore.set(cleanEmail, {
    code: otpCode,
    expiresAt,
    userData: {
      ...req.body,
      email: cleanEmail,
      regNo: resolvedRegNo,
      department: department || "Computer Science & Engineering"
    }
  });
  console.log(`[Auth Service] Sign-up OTP generated for ${cleanEmail}: ${otpCode}`);
  res.json({
    success: true,
    message: `A 6-digit verification OTP has been sent to ${cleanEmail}.`,
    email: cleanEmail,
    otp: otpCode
    // Provided for instant preview, testing & fallback
  });
});
app.post("/api/auth/verify-signup-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email address is required." });
  }
  if (!otp || !otp.trim()) {
    return res.status(400).json({ error: "Please enter the 6-digit OTP code." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const record = signupOtpStore.get(cleanEmail);
  if (!record) {
    return res.status(400).json({ error: "No pending registration found for this email. Please sign up again." });
  }
  if (Date.now() > record.expiresAt) {
    signupOtpStore.delete(cleanEmail);
    return res.status(400).json({ error: "The OTP code has expired. Please request a new code." });
  }
  if (record.code !== cleanOtp) {
    return res.status(400).json({ error: "Invalid OTP code. Please enter the correct 6-digit code sent to your email." });
  }
  const { newUser, assignedClassroom } = registerUserInternal(record.userData);
  signupOtpStore.delete(cleanEmail);
  setAuthCookies(res, newUser, assignedClassroom?.id);
  res.status(201).json({
    success: true,
    user: newUser,
    classroom: assignedClassroom,
    message: assignedClassroom ? `Account verified! Enrolled in ${assignedClassroom.name}` : `Account verified successfully! Welcome to Academic Sanctuary.`
  });
});
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, regNo, rollNumber } = req.body;
  const resolvedRegNo = (regNo || rollNumber || "").trim();
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Full name is required." });
  }
  if (!resolvedRegNo) {
    return res.status(400).json({ error: "Registration number (Reg No) is required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Institutional email ID is required." });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: "Institutional mail password is required." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: "An account with this institutional email already exists. Please log in with your institutional credentials." });
  }
  const { newUser, assignedClassroom } = registerUserInternal(req.body);
  setAuthCookies(res, newUser, assignedClassroom?.id);
  res.status(201).json({
    success: true,
    user: newUser,
    classroom: assignedClassroom,
    message: assignedClassroom ? `Account created! Enrolled in ${assignedClassroom.name}` : `Account created successfully! Welcome to Academic Sanctuary.`
  });
});
app.post("/api/auth/switch-user", (req, res) => {
  const { userId } = req.body;
  const user = registeredUsers.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  currentUser = user;
  const userClassroom = classrooms.find((c) => c.id === user.classroomId) || classrooms[0];
  setAuthCookies(res, user, userClassroom?.id);
  res.json({ success: true, user, classroom: userClassroom });
});
app.post("/api/auth/logout", (req, res) => {
  currentUser = null;
  clearAuthCookies(res);
  res.json({ success: true, message: "Logged out successfully" });
});
var otpStore = /* @__PURE__ */ new Map();
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Please enter your registered email address." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!foundUser) {
    return res.status(404).json({ error: "No account found with this email address. Please check spelling or register an account." });
  }
  const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  const expiresAt = Date.now() + 10 * 60 * 1e3;
  otpStore.set(cleanEmail, { code: otpCode, expiresAt });
  console.log(`[Auth Service] Password reset OTP generated for ${cleanEmail}: ${otpCode}`);
  res.json({
    success: true,
    message: `A 6-digit verification OTP has been sent to ${cleanEmail}.`,
    email: cleanEmail,
    otp: otpCode
    // Provided for instant demo testing and verification
  });
});
app.post("/api/auth/verify-reset-otp", (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email address is required." });
  }
  if (!otp || !otp.trim()) {
    return res.status(400).json({ error: "Please enter the 6-digit OTP code." });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const record = otpStore.get(cleanEmail);
  if (!record) {
    return res.status(400).json({ error: "No OTP request found for this email. Please request a new code." });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ error: "The OTP code has expired. Please request a new one." });
  }
  if (record.code !== cleanOtp) {
    return res.status(400).json({ error: "Invalid OTP code. Please enter the correct 6-digit code." });
  }
  const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!foundUser) {
    return res.status(404).json({ error: "User account not found." });
  }
  foundUser.password = newPassword.trim();
  otpStore.delete(cleanEmail);
  console.log(`[Auth Service] Password successfully reset for ${cleanEmail}`);
  res.json({
    success: true,
    message: "Password successfully updated! You can now log in with your new password."
  });
});
app.get("/api/classrooms", async (req, res) => {
  try {
    const dbCls = await dbFetchClassrooms();
    if (dbCls && dbCls.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbCls.forEach((c) => map.set(c.id, c));
      classrooms.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });
      classrooms = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Classroom query warning:", err);
  }
  res.json(classrooms);
});
app.get("/api/classrooms/:id", async (req, res) => {
  let cls = classrooms.find((c) => c.id === req.params.id);
  if (!cls) {
    try {
      const dbCls = await dbFetchClassrooms();
      cls = dbCls.find((c) => c.id === req.params.id);
      if (cls && !classrooms.some((c) => c.id === cls.id)) {
        classrooms.push(cls);
      }
    } catch (err) {
      console.warn("Classroom lookup warning:", err);
    }
  }
  if (!cls) {
    return res.status(404).json({ error: "Cohort classroom not found." });
  }
  res.json(cls);
});
app.post("/api/classrooms", async (req, res) => {
  const {
    collegeName,
    location,
    department,
    course,
    degreeLevel,
    batchYear = "2026",
    section = "Section A",
    semester = "Semester 5",
    selectedSubjects = []
  } = req.body;
  const rawBase = `${course ? course.substring(0, 3).toUpperCase() : "CLS"}${batchYear.slice(-2)}${section ? section.slice(-1) : "A"}`.replace(/[^A-Z0-9]/g, "") || "SANCT26";
  let uniqueCode = rawBase;
  let counter = 2;
  while (classrooms.some((c) => c.code.toLowerCase() === uniqueCode.toLowerCase())) {
    uniqueCode = `${rawBase}-${counter}`;
    counter++;
  }
  const activeUser = getCurrentOrReqUser(req);
  const newClassroom = {
    id: `cls-${Date.now()}`,
    code: uniqueCode,
    name: `${course || "Classroom"} ${batchYear} - ${section}`,
    collegeName: collegeName || "Academic University",
    location: location || "Campus",
    department: department || "General Studies",
    course: course || "General Program",
    degreeLevel: degreeLevel || "undergraduate",
    batchYear,
    section,
    semester,
    superAdminId: activeUser.id,
    memberCount: 1,
    createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  classrooms.unshift(newClassroom);
  dbSaveClassroom(newClassroom).catch((e) => console.warn("Supabase save classroom warning:", e));
  activeUser.classroomId = newClassroom.id;
  activeUser.role = "super_admin";
  currentUser = activeUser;
  const regIndex = registeredUsers.findIndex((u) => u.id === activeUser.id);
  if (regIndex >= 0) {
    registeredUsers[regIndex].classroomId = newClassroom.id;
    registeredUsers[regIndex].role = "super_admin";
  } else {
    registeredUsers.push(activeUser);
  }
  const memRecord = {
    id: activeUser.id,
    name: activeUser.name,
    email: activeUser.email,
    avatar: activeUser.avatar,
    role: "super_admin",
    rollNumber: activeUser.rollNumber || "ADM001",
    joinedDate: "Today",
    classroomId: newClassroom.id,
    department: activeUser.department
  };
  const memIndex = members.findIndex((m) => m.id === activeUser.id);
  if (memIndex >= 0) {
    members[memIndex].classroomId = newClassroom.id;
    members[memIndex].role = "super_admin";
  } else {
    members.push(memRecord);
  }
  dbSaveMember(memRecord).catch((e) => console.warn("Supabase save member warning:", e));
  if (Array.isArray(selectedSubjects) && selectedSubjects.length > 0) {
    selectedSubjects.forEach((subName, idx) => {
      const match = subName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
      const name = match && match[1] ? match[1].trim() : subName;
      const code = match && match[2] ? match[2].trim() : `CS30${idx + 1}`;
      const newSub = {
        id: `sub-${Date.now()}-${idx}`,
        classroomId: newClassroom.id,
        code,
        name,
        professor: "Faculty Coordinator",
        description: `Comprehensive coursework and materials for ${name}.`,
        creditHours: 4,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0
      };
      subjects.push(newSub);
      dbSaveSubject(newSub).catch((e) => console.warn("Supabase save subject warning:", e));
    });
  }
  const generalChatGroup = {
    id: `group-${Date.now()}`,
    classroomId: newClassroom.id,
    name: `${newClassroom.name} General`,
    description: `Official cohort discussion group for ${newClassroom.name}`,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newClassroom.code)}`,
    createdBy: activeUser.id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    isDirect: false,
    bannedUserIds: []
  };
  chatGroups.push(generalChatGroup);
  chatGroupMembers.push({
    groupId: generalChatGroup.id,
    userId: activeUser.id,
    role: "admin",
    joinedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  dbSaveChatGroup(generalChatGroup).catch((e) => console.warn("Supabase save chat group warning:", e));
  setAuthCookies(res, activeUser, newClassroom.id);
  res.status(201).json(newClassroom);
});
app.post("/api/classrooms/join", async (req, res) => {
  const { code } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ error: "Classroom access code is required." });
  }
  const cleanCode = code.trim().toLowerCase();
  let targetClassroom = classrooms.find((c) => c.code.toLowerCase() === cleanCode);
  if (!targetClassroom) {
    try {
      const dbCls = await dbFindClassroomByCode(cleanCode);
      if (dbCls) {
        targetClassroom = dbCls;
        if (!classrooms.some((c) => c.id === dbCls.id)) {
          classrooms.unshift(dbCls);
        }
      }
    } catch (err) {
      console.warn("Supabase find classroom warning:", err);
    }
  }
  if (!targetClassroom) {
    return res.status(404).json({
      error: `Invalid classroom code "${code.trim().toUpperCase()}". No cohort found with this code. Please verify the code with your instructor or peers.`
    });
  }
  const activeUser = getCurrentOrReqUser(req);
  activeUser.classroomId = targetClassroom.id;
  if (currentUser) {
    currentUser.classroomId = targetClassroom.id;
  }
  const reg = registeredUsers.find((u) => u.id === activeUser.id);
  if (reg) reg.classroomId = targetClassroom.id;
  const alreadyMember = members.some((m) => m.id === activeUser.id && m.classroomId === targetClassroom.id);
  const memberRecord = {
    id: activeUser.id,
    name: activeUser.name,
    email: activeUser.email,
    avatar: activeUser.avatar,
    role: "student",
    rollNumber: activeUser.rollNumber || `STU${members.length + 101}`,
    joinedDate: "Today",
    classroomId: targetClassroom.id,
    department: targetClassroom.department
  };
  if (!alreadyMember) {
    members.push(memberRecord);
    dbSaveMember(memberRecord).catch((e) => console.warn("Supabase save member warning:", e));
  }
  targetClassroom.memberCount = members.filter((m) => m.classroomId === targetClassroom.id).length;
  dbSaveClassroom(targetClassroom).catch((e) => console.warn("Supabase update classroom member count warning:", e));
  let generalGroup = chatGroups.find((g) => g.classroomId === targetClassroom.id && !g.isDirect);
  if (!generalGroup) {
    generalGroup = {
      id: `group-${Date.now()}`,
      classroomId: targetClassroom.id,
      name: `${targetClassroom.name} General`,
      description: `Official cohort discussion group for ${targetClassroom.name}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(targetClassroom.code)}`,
      createdBy: targetClassroom.superAdminId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isDirect: false,
      bannedUserIds: []
    };
    chatGroups.push(generalGroup);
    dbSaveChatGroup(generalGroup).catch((e) => console.warn("Supabase save chat group warning:", e));
  }
  if (!chatGroupMembers.some((m) => m.groupId === generalGroup.id && m.userId === activeUser.id)) {
    chatGroupMembers.push({
      groupId: generalGroup.id,
      userId: activeUser.id,
      role: "member",
      joinedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  setAuthCookies(res, activeUser, targetClassroom.id);
  res.json({ success: true, classroom: targetClassroom });
});
app.get("/api/subjects", async (req, res) => {
  const { classroomId } = req.query;
  try {
    const dbSubs = await dbFetchSubjects(classroomId);
    if (dbSubs && dbSubs.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbSubs.forEach((s) => map.set(s.id, s));
      subjects.forEach((s) => {
        if (!map.has(s.id)) map.set(s.id, s);
      });
      subjects = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch subjects warning:", err);
  }
  const list = classroomId ? subjects.filter((s) => s.classroomId === classroomId) : subjects;
  const subjectsWithLiveCounts = list.map((s) => {
    const subMats = materials.filter(
      (m) => m.subjectId === s.id || (!m.classroomId || m.classroomId === s.classroomId) && m.subjectCode?.toLowerCase() === s.code?.toLowerCase()
    );
    return {
      ...s,
      materialsCount: subMats.length,
      notesCount: subMats.filter((m) => m.type === "notes").length,
      pyqsCount: subMats.filter((m) => m.type === "pyqs").length
    };
  });
  res.json(subjectsWithLiveCounts);
});
app.get("/api/subjects/:id", async (req, res) => {
  let subject = subjects.find((s) => s.id === req.params.id || s.code.toLowerCase() === req.params.id.toLowerCase());
  if (!subject) {
    try {
      const dbSubs = await dbFetchSubjects();
      subject = dbSubs.find((s) => s.id === req.params.id || s.code.toLowerCase() === req.params.id.toLowerCase());
      if (subject && !subjects.some((s) => s.id === subject.id)) {
        subjects.push(subject);
      }
    } catch (err) {
      console.warn("Supabase find subject warning:", err);
    }
  }
  if (!subject) {
    return res.status(404).json({ error: "Subject not found" });
  }
  const subMats = materials.filter(
    (m) => m.subjectId === subject.id || (!m.classroomId || m.classroomId === subject.classroomId) && m.subjectCode?.toLowerCase() === subject.code?.toLowerCase()
  );
  res.json({
    ...subject,
    materialsCount: subMats.length,
    notesCount: subMats.filter((m) => m.type === "notes").length,
    pyqsCount: subMats.filter((m) => m.type === "pyqs").length
  });
});
app.post("/api/subjects", async (req, res) => {
  const { code, name, professor, description, classroomId = "cls-1", creditHours = 4 } = req.body;
  const newSubject = {
    id: `sub-${Date.now()}`,
    classroomId,
    code: code || "CS399",
    name: name || "Special Topics in CS",
    professor: professor || "Prof. Guest Lecturer",
    description: description || "Advanced course curriculum and study materials.",
    creditHours: Number(creditHours) || 3,
    materialsCount: 0,
    notesCount: 0,
    pyqsCount: 0
  };
  subjects.push(newSubject);
  dbSaveSubject(newSubject).catch((e) => console.warn("Supabase save subject warning:", e));
  res.status(201).json(newSubject);
});
app.get("/api/materials", async (req, res) => {
  const { subjectId, type, search, classroomId } = req.query;
  try {
    const dbMats = await dbFetchMaterials(classroomId, subjectId);
    if (dbMats && dbMats.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbMats.forEach((m) => map.set(m.id, m));
      materials.forEach((m) => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
      materials = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch materials warning:", err);
  }
  let result = [...materials];
  if (classroomId) {
    const classroomSubjectIds = new Set(
      subjects.filter((s) => s.classroomId === classroomId).map((s) => s.id)
    );
    result = result.filter(
      (m) => m.classroomId === classroomId || classroomSubjectIds.has(m.subjectId)
    );
  }
  if (subjectId) {
    result = result.filter((m) => m.subjectId === subjectId);
  }
  if (type && type !== "all") {
    result = result.filter((m) => m.type === type);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (m) => m.title.toLowerCase().includes(q) || m.description && m.description.toLowerCase().includes(q) || m.subjectName && m.subjectName.toLowerCase().includes(q) || m.subjectCode && m.subjectCode.toLowerCase().includes(q) || m.tags && m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  res.json(result);
});
app.post("/api/materials", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const {
    subjectId,
    subjectName,
    subjectCode,
    professor,
    title,
    description = "",
    type = "notes",
    fileFormat = "PDF",
    fileSize = "1.5 MB",
    tags = [],
    unit = "General",
    contentSnippet = "",
    recommendedExam = "",
    classroomId
  } = req.body;
  let subject = subjects.find((s) => s.id === subjectId);
  const targetClassroomId = classroomId || activeUser.classroomId || classrooms[0]?.id || "";
  if ((!subject || subjectId === "custom") && (subjectName || subjectCode)) {
    const sName = (subjectName || "General Studies").trim();
    const sCode = (subjectCode || "GEN101").trim().toUpperCase();
    const existing = subjects.find(
      (s) => s.code.toLowerCase() === sCode.toLowerCase() && (!targetClassroomId || s.classroomId === targetClassroomId)
    );
    if (existing) {
      subject = existing;
    } else {
      subject = {
        id: `sub-${Date.now()}`,
        classroomId: targetClassroomId,
        code: sCode,
        name: sName,
        professor: professor ? professor.trim() : "Faculty Instructor",
        description: `Course syllabus and student study repository for ${sName}.`,
        creditHours: 3,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0
      };
      subjects.push(subject);
      dbSaveSubject(subject).catch((e) => console.warn("Supabase save dynamic subject warning:", e));
    }
  }
  if (!subject) {
    const classroomSubjects = subjects.filter((s) => s.classroomId === targetClassroomId);
    if (classroomSubjects.length > 0) {
      subject = classroomSubjects[0];
    } else {
      subject = {
        id: `sub-${Date.now()}`,
        classroomId: targetClassroomId,
        code: subjectCode || "ACAD101",
        name: subjectName || "General Academic Course",
        professor: professor ? professor.trim() : "Faculty Coordinator",
        description: "Comprehensive course materials.",
        creditHours: 3,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0
      };
      subjects.push(subject);
      dbSaveSubject(subject).catch((e) => console.warn("Supabase save default subject warning:", e));
    }
  }
  const now = Date.now();
  const dateFormatted = new Date(now).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const newMaterial = {
    id: `mat-${now}`,
    classroomId: targetClassroomId,
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    title: title || "New Study Material",
    description: description || `Study guide for ${subject.name}`,
    type,
    fileFormat,
    fileSize,
    uploadedBy: {
      id: activeUser.id,
      name: activeUser.name,
      avatar: activeUser.avatar,
      role: activeUser.role
    },
    uploadedDate: dateFormatted,
    createdAt: now,
    downloadsCount: 0,
    viewsCount: 1,
    isVerified: true,
    tags: Array.isArray(tags) ? tags : [tags],
    unit,
    recommendedExam: recommendedExam || "",
    contentSnippet: contentSnippet || `# ${title}

Uploaded notes and study guide for ${subject.name}.`
  };
  materials.push(newMaterial);
  dbSaveMaterial(newMaterial).catch((e) => console.warn("Supabase save material warning:", e));
  if (type === "notes") subject.notesCount += 1;
  if (type === "pyqs") subject.pyqsCount += 1;
  subject.materialsCount += 1;
  res.status(201).json(newMaterial);
});
app.get("/api/announcements", async (req, res) => {
  const { classroomId } = req.query;
  try {
    const dbAnns = await dbFetchAnnouncements(classroomId);
    if (dbAnns && dbAnns.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbAnns.forEach((a) => map.set(a.id, a));
      announcements.forEach((a) => {
        if (!map.has(a.id)) map.set(a.id, a);
      });
      announcements = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch announcements warning:", err);
  }
  if (classroomId) {
    return res.json(announcements.filter((a) => a.classroomId === classroomId));
  }
  res.json(announcements);
});
app.post("/api/announcements", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { title, description, isUrgent = false, classroomId } = req.body;
  const newAnn = {
    id: `ann-${Date.now()}`,
    classroomId: classroomId || activeUser.classroomId || (classrooms[0]?.id || ""),
    title: title || "New Announcement",
    description: description || "",
    timestamp: "Just now",
    author: activeUser.name,
    isUrgent: Boolean(isUrgent)
  };
  announcements.unshift(newAnn);
  dbSaveAnnouncement(newAnn).catch((e) => console.warn("Supabase save announcement warning:", e));
  res.status(201).json(newAnn);
});
app.get("/api/exams", async (req, res) => {
  const { classroomId } = req.query;
  try {
    const dbExs = await dbFetchExams(classroomId);
    if (dbExs && dbExs.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbExs.forEach((e) => map.set(e.id, e));
      exams.forEach((e) => {
        if (!map.has(e.id)) map.set(e.id, e);
      });
      exams = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch exams warning:", err);
  }
  if (classroomId) {
    return res.json(exams.filter((e) => e.classroomId === classroomId));
  }
  res.json(exams);
});
app.post("/api/exams", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only cohort administrators can publish examination schedules." });
  }
  const { subjectName, subjectCode, date, time, examType, venue, isCompleted, classroomId } = req.body;
  let daysRemaining = 14;
  if (date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = /* @__PURE__ */ new Date(date + "T00:00:00");
    const diff = examDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diff / (1e3 * 60 * 60 * 24));
  }
  const newExam = {
    id: `exam-${Date.now()}`,
    classroomId: classroomId || activeUser.classroomId || (classrooms[0]?.id || ""),
    subjectName: subjectName || "Subject Exam",
    subjectCode: subjectCode || "CS300",
    date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    daysRemaining,
    time: time || "10:00 AM - 01:00 PM",
    examType: examType || venue || "Exam",
    venue: venue || examType || "Main Exam Hall",
    progressPercent: isCompleted || daysRemaining < 0 ? 100 : 40,
    isCompleted: Boolean(isCompleted || daysRemaining < 0)
  };
  exams.push(newExam);
  dbSaveExam(newExam).catch((e) => console.warn("Supabase save exam warning:", e));
  res.status(201).json(newExam);
});
app.patch("/api/exams/:id", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only cohort administrators can modify examination schedules." });
  }
  const exam = exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ error: "Exam not found" });
  }
  if (typeof req.body.isCompleted === "boolean") {
    exam.isCompleted = req.body.isCompleted;
    if (exam.isCompleted) exam.progressPercent = 100;
  }
  if (typeof req.body.progressPercent === "number") {
    exam.progressPercent = req.body.progressPercent;
  }
  dbUpdateExam(req.params.id, {
    isCompleted: exam.isCompleted,
    progressPercent: exam.progressPercent
  }).catch((e) => console.warn("Supabase update exam warning:", e));
  res.json(exam);
});
app.get("/api/members", async (req, res) => {
  const { classroomId } = req.query;
  try {
    const dbMems = await dbFetchMembers(classroomId);
    if (dbMems && dbMems.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbMems.forEach((m) => map.set(m.id, m));
      members.forEach((m) => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
      members = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch members warning:", err);
  }
  if (classroomId) {
    const userIdsInClassroom = registeredUsers.filter((u) => u.classroomId === classroomId).map((u) => u.id);
    const filtered = members.filter(
      (m) => m.classroomId === classroomId || userIdsInClassroom.includes(m.id)
    );
    return res.json(filtered);
  }
  res.json(members);
});
app.post("/api/members", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Only cohort administrators can add members." });
  }
  const { email, name, rollNumber, role = "student", department, classroomId } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Institutional email is required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const targetClassroomId = classroomId || activeUser.classroomId || classrooms[0]?.id;
  if (!targetClassroomId) {
    return res.status(400).json({ error: "No active classroom found to enroll member into." });
  }
  const existingInClass = members.find(
    (m) => (m.classroomId === targetClassroomId || registeredUsers.some((u) => u.id === m.id && u.classroomId === targetClassroomId)) && m.email.toLowerCase() === cleanEmail
  );
  if (existingInClass) {
    return res.status(400).json({ error: "A member with this institutional email is already enrolled in this cohort." });
  }
  const memberName = name && name.trim() ? name.trim() : cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const memberRoll = rollNumber && rollNumber.trim() ? rollNumber.trim().toUpperCase() : `ROLL-${Math.floor(100 + Math.random() * 900)}`;
  const memberRole = role === "admin" ? "admin" : "student";
  const defaultAvatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg"
  ];
  const newMemberId = `user-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
  const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  const newUser = {
    id: newMemberId,
    name: memberName,
    email: cleanEmail,
    password: "password123",
    avatar,
    role: memberRole,
    department: department || activeUser.department || "Academic Studies",
    rollNumber: memberRoll,
    classroomId: targetClassroomId
  };
  registeredUsers.push(newUser);
  const newMemberRecord = {
    id: newMemberId,
    name: memberName,
    email: cleanEmail,
    avatar,
    role: memberRole,
    rollNumber: memberRoll,
    joinedDate: "Today",
    classroomId: targetClassroomId,
    department: newUser.department
  };
  members.push(newMemberRecord);
  dbSaveMember(newMemberRecord).catch((e) => console.warn("Supabase save member warning:", e));
  const targetClassroom = classrooms.find((c) => c.id === targetClassroomId);
  if (targetClassroom) {
    targetClassroom.memberCount = (targetClassroom.memberCount || 0) + 1;
    dbSaveClassroom(targetClassroom).catch((e) => console.warn("Supabase update classroom member count warning:", e));
  }
  res.status(201).json(newMemberRecord);
});
app.patch("/api/members/:id/role", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Only cohort administrators can manage member roles." });
  }
  const { id } = req.params;
  const { role } = req.body;
  if (!role || !["admin", "student"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be admin or student." });
  }
  const member = members.find((m) => m.id === id);
  if (!member) {
    return res.status(404).json({ error: "Member not found." });
  }
  if (member.role === "super_admin") {
    return res.status(403).json({ error: "Cannot modify permissions of Super Admin." });
  }
  if (activeUser.role === "admin" && member.role === "admin" && role === "student") {
    return res.status(403).json({ error: "Only the Super Admin can demote other administrators." });
  }
  member.role = role;
  dbUpdateMemberRole(id, role).catch((e) => console.warn("Supabase update member role warning:", e));
  const regUser = registeredUsers.find((u) => u.id === id);
  if (regUser) {
    regUser.role = role;
  }
  if (currentUser && currentUser.id === id) {
    currentUser.role = role;
  }
  res.json({ success: true, member });
});
app.delete("/api/members/:id", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Only cohort administrators can remove members." });
  }
  const { id } = req.params;
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Member not found." });
  }
  if (members[index].role === "super_admin") {
    return res.status(403).json({ error: "Cannot remove Super Admin." });
  }
  const removed = members.splice(index, 1)[0];
  dbDeleteMember(id).catch((e) => console.warn("Supabase delete member warning:", e));
  const regIdx = registeredUsers.findIndex((u) => u.id === id);
  if (regIdx !== -1) {
    registeredUsers.splice(regIdx, 1);
  }
  const cls = classrooms.find((c) => c.id === removed.classroomId);
  if (cls && cls.memberCount > 1) {
    cls.memberCount -= 1;
  }
  res.json({ success: true, member: removed });
});
var bannedCohortUsers = [];
app.post("/api/members/:id/ban", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({ error: "Only cohort administrators can ban members." });
  }
  const { id } = req.params;
  if (id === activeUser.id) {
    return res.status(400).json({ error: "You cannot ban yourself from the cohort." });
  }
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Member not found." });
  }
  if (members[index].role === "super_admin") {
    return res.status(403).json({ error: "Cannot ban the Super Admin." });
  }
  const memberToBan = members.splice(index, 1)[0];
  const regIdx = registeredUsers.findIndex((u) => u.id === id);
  if (regIdx !== -1) {
    registeredUsers.splice(regIdx, 1);
  }
  bannedCohortUsers.push({
    classroomId: memberToBan.classroomId || "",
    userId: memberToBan.id,
    email: memberToBan.email.toLowerCase(),
    name: memberToBan.name,
    rollNumber: memberToBan.rollNumber,
    bannedAt: (/* @__PURE__ */ new Date()).toISOString(),
    bannedBy: activeUser.name
  });
  const cls = classrooms.find((c) => c.id === memberToBan.classroomId);
  if (cls && cls.memberCount > 1) {
    cls.memberCount -= 1;
  }
  const affectedGroups = chatGroups.filter((g) => g.classroomId === memberToBan.classroomId);
  for (const grp of affectedGroups) {
    chatGroupMembers = chatGroupMembers.filter(
      (m) => !(m.groupId === grp.id && m.userId === id)
    );
    if (!grp.bannedUserIds) grp.bannedUserIds = [];
    if (!grp.bannedUserIds.includes(id)) grp.bannedUserIds.push(id);
    broadcastToGroup(grp.id, {
      type: "chat:member_banned",
      groupId: grp.id,
      userId: id,
      bannedBy: activeUser.name
    });
  }
  res.json({ success: true, banned: true, member: memberToBan });
});
app.get("/api/classrooms/:id/banned", (req, res) => {
  const list = bannedCohortUsers.filter((b) => b.classroomId === req.params.id);
  res.json(list);
});
var chatGroups = [
  {
    id: "grp-cls1-general",
    classroomId: "cls-1",
    name: "B.Tech CSE '26 \u2014 General Hub",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
    description: "Main cohort channel for lecture updates, notes sharing, and batch announcements.",
    isDirect: false,
    createdBy: "user-sarah",
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-09-06T10:30:00.000Z"
  },
  {
    id: "grp-cls1-exams",
    classroomId: "cls-1",
    name: "IAT 1 & Midterms Study Group",
    avatar: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80",
    description: "Past papers, formula sheets, and doubt-clearing for upcoming internals.",
    isDirect: false,
    createdBy: "user-michael",
    createdAt: "2026-08-25T11:00:00.000Z",
    updatedAt: "2026-09-06T11:15:00.000Z"
  },
  {
    id: "dm-sarah-michael",
    classroomId: "cls-1",
    name: "Direct Message",
    avatar: "",
    description: "",
    isDirect: true,
    createdBy: "user-sarah",
    createdAt: "2026-09-01T14:00:00.000Z",
    updatedAt: "2026-09-05T16:20:00.000Z"
  },
  {
    id: "grp-cls2-general",
    classroomId: "cls-2",
    name: "Stanford AI & Data '26 Hub",
    avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80",
    description: "AI & Data Science cohort channel for paper discussions, lab notes, and exam prep.",
    isDirect: false,
    createdBy: "user-alex",
    createdAt: "2026-08-20T09:00:00.000Z",
    updatedAt: "2026-09-06T12:00:00.000Z"
  }
];
var chatGroupMembers = [
  { groupId: "grp-cls1-general", userId: "user-sarah", role: "admin", joinedAt: "2026-08-15T09:00:00.000Z" },
  { groupId: "grp-cls1-general", userId: "user-michael", role: "admin", joinedAt: "2026-08-15T09:05:00.000Z" },
  { groupId: "grp-cls1-general", userId: "user-elena", role: "member", joinedAt: "2026-08-16T10:00:00.000Z" },
  { groupId: "grp-cls1-general", userId: "user-david", role: "member", joinedAt: "2026-08-16T10:30:00.000Z" },
  { groupId: "grp-cls1-exams", userId: "user-sarah", role: "admin", joinedAt: "2026-08-25T11:00:00.000Z" },
  { groupId: "grp-cls1-exams", userId: "user-michael", role: "admin", joinedAt: "2026-08-25T11:05:00.000Z" },
  { groupId: "grp-cls1-exams", userId: "user-elena", role: "member", joinedAt: "2026-08-25T11:10:00.000Z" },
  { groupId: "grp-cls1-exams", userId: "user-david", role: "member", joinedAt: "2026-08-25T11:15:00.000Z" },
  { groupId: "dm-sarah-michael", userId: "user-sarah", role: "admin", joinedAt: "2026-09-01T14:00:00.000Z" },
  { groupId: "dm-sarah-michael", userId: "user-michael", role: "admin", joinedAt: "2026-09-01T14:00:00.000Z" },
  { groupId: "grp-cls2-general", userId: "user-alex", role: "admin", joinedAt: "2026-08-20T09:00:00.000Z" },
  { groupId: "grp-cls2-general", userId: "user-maya", role: "member", joinedAt: "2026-08-21T09:30:00.000Z" }
];
var chatMessages = [
  {
    id: "msg-demo-1",
    groupId: "grp-cls1-general",
    senderId: "user-sarah",
    senderName: "Sarah Jenkins",
    senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
    type: "text",
    content: "Welcome to the B.Tech CSE 2026 Sanctuary! All verified Data Structures, OS, Networks, and TOC notes are now live in the library.",
    timestamp: "09:15 AM",
    createdAt: Date.now() - 1e3 * 60 * 90,
    deliveredTo: ["user-sarah", "user-michael", "user-elena", "user-david"],
    readBy: ["user-sarah", "user-michael"],
    isPinned: true
  },
  {
    id: "msg-demo-2",
    groupId: "grp-cls1-general",
    senderId: "user-elena",
    senderName: "Elena Rostova",
    senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    type: "text",
    content: "Thanks Sarah! I also uploaded the Midterm Review Notes with solved past problems for CS301.",
    timestamp: "09:24 AM",
    createdAt: Date.now() - 1e3 * 60 * 75,
    deliveredTo: ["user-sarah", "user-michael", "user-elena"],
    readBy: ["user-sarah", "user-elena"]
  },
  {
    id: "msg-demo-3",
    groupId: "grp-cls1-exams",
    senderId: "user-sarah",
    senderName: "Sarah Jenkins",
    senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA",
    type: "material_forward",
    content: "Check out the Trees & Graphs guide before the CS301 IAT 1!",
    forwardedMaterial: {
      id: "mat-1",
      title: "Trees & Graphs Deep Dive",
      subjectCode: "CS301",
      subjectName: "Data Structures",
      type: "notes",
      fileFormat: "PDF",
      fileSize: "2.4 MB",
      snippet: "# Trees & Graphs Deep Dive\n\nComprehensive guide covering BST, AVL Trees, BFS/DFS & Dijkstra."
    },
    timestamp: "10:05 AM",
    createdAt: Date.now() - 1e3 * 60 * 50,
    deliveredTo: ["user-sarah", "user-michael", "user-elena", "user-david"],
    readBy: ["user-sarah"]
  },
  {
    id: "msg-demo-4",
    groupId: "dm-sarah-michael",
    senderId: "user-michael",
    senderName: "Michael Klein",
    senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg",
    type: "text",
    content: "Hey Sarah, I verified the Sorting Cheat Sheet and Master Theorem notes for IAT 1 & 2.",
    timestamp: "10:15 AM",
    createdAt: Date.now() - 1e3 * 60 * 35,
    deliveredTo: ["user-sarah", "user-michael"],
    readBy: ["user-michael"]
  },
  {
    id: "msg-demo-5",
    groupId: "grp-cls2-general",
    senderId: "user-alex",
    senderName: "Alex Turner",
    senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A",
    type: "text",
    content: "Welcome to Stanford AI & Data 2026! Check out the AI301 notes and Fall 2025 Midterm PYQ in the Notes Library.",
    timestamp: "11:00 AM",
    createdAt: Date.now() - 1e3 * 60 * 25,
    deliveredTo: ["user-alex", "user-maya"],
    readBy: ["user-alex"],
    isPinned: true
  }
];
async function syncWithSupabase() {
  try {
    const [dbCls, dbSubs, dbMats, dbAnns, dbExs, dbMems, dbGrps] = await Promise.all([
      dbFetchClassrooms(),
      dbFetchSubjects(),
      dbFetchMaterials(),
      dbFetchAnnouncements(),
      dbFetchExams(),
      dbFetchMembers(),
      dbFetchChatGroups()
    ]);
    if (dbCls && dbCls.length > 0) {
      classrooms = mergeRecordsById(dbCls, classrooms);
    }
    if (dbSubs && dbSubs.length > 0) {
      subjects = mergeRecordsById(dbSubs, subjects);
    }
    if (dbMats && dbMats.length > 0) {
      materials = mergeRecordsById(dbMats, materials);
    }
    if (dbAnns && dbAnns.length > 0) {
      announcements = mergeRecordsById(dbAnns, announcements);
    }
    if (dbExs && dbExs.length > 0) {
      exams = mergeRecordsById(dbExs, exams);
    }
    if (dbMems && dbMems.length > 0) {
      members = mergeRecordsById(dbMems, members);
    }
    if (dbGrps && dbGrps.length > 0) {
      chatGroups = mergeRecordsById(dbGrps, chatGroups);
      dbGrps.forEach((g) => {
        (g.memberIds || []).forEach((uid) => {
          if (!chatGroupMembers.some((m) => m.groupId === g.id && m.userId === uid)) {
            chatGroupMembers.push({
              groupId: g.id,
              userId: uid,
              role: (g.adminIds || []).includes(uid) ? "admin" : "member",
              joinedAt: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
        });
      });
    }
  } catch (err) {
    console.warn("[Supabase Sync] Background startup sync notice:", err);
  }
}
syncWithSupabase();
function getCurrentOrReqUser(req) {
  const headerUserId = req ? req.headers["x-user-id"] || req.query.userId || req.body && req.body.userId : void 0;
  if (headerUserId) {
    if (currentUser && currentUser.id === headerUserId) return currentUser;
    const found = registeredUsers.find((u) => u.id === headerUserId) || members.find((m) => m.id === headerUserId);
    if (found) return found;
    const headerUserName = req ? req.headers["x-user-name"] || req.body && req.body.userName : void 0;
    const headerUserRole = req ? req.headers["x-user-role"] || req.body && req.body.userRole : void 0;
    const headerUserEmail = req ? req.headers["x-user-email"] || req.body && req.body.userEmail : void 0;
    return {
      id: headerUserId,
      name: headerUserName || "Classmate",
      email: headerUserEmail || "student@academic.edu",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(headerUserId)}`,
      role: headerUserRole || "super_admin",
      department: "Academic Sanctuary",
      rollNumber: "STU001",
      classroomId: classrooms[0]?.id || ""
    };
  }
  if (req) {
    const cookies = parseCookies(req);
    if (cookies.as_auth_user) {
      try {
        const cookieUser = JSON.parse(cookies.as_auth_user);
        if (cookieUser && cookieUser.id) {
          const existing = registeredUsers.find((u) => u.id === cookieUser.id);
          if (existing) return existing;
          registeredUsers.push(cookieUser);
          return cookieUser;
        }
      } catch (e) {
      }
    }
  }
  if (currentUser) return currentUser;
  return {
    id: "user-guest",
    name: "Classmate",
    email: "student@academic.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A",
    role: "super_admin",
    department: "General Studies",
    rollNumber: "STU001",
    classroomId: classrooms[0]?.id || ""
  };
}
var connectedSockets = /* @__PURE__ */ new Map();
function isUserOnline(userId) {
  for (const [clientWs, info] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN && info.userId === userId) {
      return true;
    }
  }
  return false;
}
function getInitialDeliveredUsers(groupId, senderId) {
  const delivered = /* @__PURE__ */ new Set([senderId]);
  const membersInGroup = chatGroupMembers.filter((m) => m.groupId === groupId);
  for (const member of membersInGroup) {
    if (member.userId !== senderId && isUserOnline(member.userId)) {
      delivered.add(member.userId);
    }
  }
  return Array.from(delivered);
}
function markUserDeliveredInGroups(userId, targetGroupIds) {
  if (!userId || userId === "user-guest") return;
  const userGroupSet = new Set(
    chatGroupMembers.filter((m) => m.userId === userId).map((m) => m.groupId)
  );
  const allowedGroups = targetGroupIds ? new Set(targetGroupIds.filter((gid) => userGroupSet.has(gid))) : userGroupSet;
  if (allowedGroups.size === 0) return;
  const updatedByGroup = /* @__PURE__ */ new Map();
  for (const m of chatMessages) {
    if (!allowedGroups.has(m.groupId)) continue;
    if (!m.deliveredTo.includes(userId)) {
      m.deliveredTo.push(userId);
      if (!updatedByGroup.has(m.groupId)) {
        updatedByGroup.set(m.groupId, []);
      }
      updatedByGroup.get(m.groupId).push(m.id);
      dbUpdateChatMessage(m.id, { deliveredTo: m.deliveredTo }).catch(() => {
      });
    }
  }
  for (const [groupId, messageIds] of updatedByGroup.entries()) {
    broadcastToGroup(groupId, {
      type: "chat:delivered_receipt",
      groupId,
      userId,
      messageIds
    });
  }
}
function markGroupMessagesRead(groupId, userId) {
  if (!groupId || !userId || userId === "user-guest") return 0;
  const unread = chatMessages.filter(
    (m) => m.groupId === groupId && !m.readBy.includes(userId)
  );
  if (unread.length === 0) return 0;
  const messageIds = [];
  unread.forEach((m) => {
    m.readBy.push(userId);
    if (!m.deliveredTo.includes(userId)) {
      m.deliveredTo.push(userId);
    }
    messageIds.push(m.id);
    dbUpdateChatMessage(m.id, { readBy: m.readBy, deliveredTo: m.deliveredTo }).catch(() => {
    });
  });
  broadcastToGroup(groupId, {
    type: "chat:read_receipt",
    groupId,
    userId,
    messageIds
  });
  return unread.length;
}
function broadcastToGroup(groupId, data, excludeWs) {
  const memberEntries = chatGroupMembers.filter((m) => m.groupId === groupId);
  const memberUserIds = new Set(memberEntries.map((m) => m.userId));
  const payload = JSON.stringify(data);
  for (const [clientWs, info] of connectedSockets.entries()) {
    if (clientWs !== excludeWs && clientWs.readyState === WebSocket.OPEN && memberUserIds.has(info.userId)) {
      clientWs.send(payload);
    }
  }
}
function broadcastPresence(userId, isOnline, lastSeen) {
  const payload = JSON.stringify({
    type: "chat:presence",
    userId,
    isOnline,
    lastSeen: lastSeen || (isOnline ? "Online" : "Last seen recently")
  });
  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(payload);
    }
  }
}
wss.on("connection", (ws) => {
  ws.on("message", (messageRaw) => {
    try {
      const data = JSON.parse(messageRaw.toString());
      if (data.type === "auth") {
        const userId = data.userId || (currentUser ? currentUser.id : "user-guest");
        const classroomId = data.classroomId || (currentUser ? currentUser.classroomId : "");
        connectedSockets.set(ws, { userId, classroomId });
        const onlineUserIds = Array.from(
          new Set(
            Array.from(connectedSockets.entries()).filter(([clientWs]) => clientWs.readyState === WebSocket.OPEN).map(([, c]) => c.userId)
          )
        );
        ws.send(
          JSON.stringify({
            type: "chat:online_users",
            onlineUserIds
          })
        );
        broadcastPresence(userId, true);
        markUserDeliveredInGroups(userId);
      } else if (data.type === "delivered") {
        if (data.groupId && data.userId) {
          if (data.messageId) {
            const msg = chatMessages.find((m) => m.id === data.messageId && m.groupId === data.groupId);
            if (msg && !msg.deliveredTo.includes(data.userId)) {
              msg.deliveredTo.push(data.userId);
              dbUpdateChatMessage(msg.id, { deliveredTo: msg.deliveredTo }).catch(() => {
              });
              broadcastToGroup(data.groupId, {
                type: "chat:delivered_receipt",
                groupId: data.groupId,
                userId: data.userId,
                messageIds: [msg.id]
              });
            }
          } else {
            markUserDeliveredInGroups(data.userId, [data.groupId]);
          }
        }
      } else if (data.type === "typing") {
        if (data.groupId && data.userId) {
          broadcastToGroup(
            data.groupId,
            {
              type: "chat:typing",
              groupId: data.groupId,
              userId: data.userId,
              userName: data.userName || "Someone",
              isTyping: Boolean(data.isTyping)
            },
            ws
          );
        }
      } else if (data.type === "read") {
        if (data.groupId && data.userId) {
          markGroupMessagesRead(data.groupId, data.userId);
        }
      }
    } catch (err) {
      console.error("Error handling WebSocket message:", err);
    }
  });
  ws.on("close", () => {
    const client = connectedSockets.get(ws);
    connectedSockets.delete(ws);
    if (client) {
      const stillConnected = Array.from(connectedSockets.values()).some(
        (c) => c.userId === client.userId
      );
      if (!stillConnected) {
        broadcastPresence(client.userId, false, "Just now");
      }
    }
  });
});
function getMemberProfile(userId) {
  const reg = registeredUsers.find((u) => u.id === userId);
  if (reg) return reg;
  const mem = members.find((m) => m.id === userId);
  if (mem) {
    return {
      id: mem.id,
      name: mem.name,
      email: mem.email,
      avatar: mem.avatar,
      role: mem.role,
      rollNumber: mem.rollNumber
    };
  }
  return {
    id: userId,
    name: "Classmate",
    email: "student@sanctuary.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "student",
    rollNumber: ""
  };
}
app.get("/api/chat/groups", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const classroomId = req.query.classroomId || activeUser.classroomId || (classrooms[0]?.id || "");
  const userId = req.query.userId || activeUser.id;
  try {
    const dbGrps = await dbFetchChatGroups(classroomId);
    if (dbGrps && dbGrps.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbGrps.forEach((g) => map.set(g.id, g));
      chatGroups.forEach((g) => {
        if (!map.has(g.id)) map.set(g.id, g);
      });
      chatGroups = Array.from(map.values());
      dbGrps.forEach((g) => {
        (g.memberIds || []).forEach((uid) => {
          if (!chatGroupMembers.some((m) => m.groupId === g.id && m.userId === uid)) {
            chatGroupMembers.push({
              groupId: g.id,
              userId: uid,
              role: (g.adminIds || []).includes(uid) ? "admin" : "member",
              joinedAt: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
        });
      });
    }
  } catch (err) {
    console.warn("Supabase fetch chat groups warning:", err);
  }
  const userMemberships = chatGroupMembers.filter((m) => m.userId === userId);
  const userGroupIds = new Set(userMemberships.map((m) => m.groupId));
  markUserDeliveredInGroups(userId, Array.from(userGroupIds));
  const relevantGroups = chatGroups.filter((g) => userGroupIds.has(g.id) && (!classroomId || g.classroomId === classroomId)).map((g) => {
    const groupMembersList = chatGroupMembers.filter((m) => m.groupId === g.id);
    const adminIds = groupMembersList.filter((m) => m.role === "admin").map((m) => m.userId);
    const memberIds = groupMembersList.map((m) => m.userId);
    let displayName = g.name;
    let displayAvatar = g.avatar;
    if (g.isDirect) {
      const otherMemberId = memberIds.find((id) => id !== userId) || userId;
      const otherProfile = getMemberProfile(otherMemberId);
      displayName = otherProfile.name;
      displayAvatar = otherProfile.avatar;
    }
    const groupMsgs = chatMessages.filter((m) => m.groupId === g.id).sort((a, b) => b.createdAt - a.createdAt);
    const lastMsg = groupMsgs[0];
    const unreadCount = chatMessages.filter(
      (m) => m.groupId === g.id && m.senderId !== userId && !m.readBy.includes(userId)
    ).length;
    return {
      id: g.id,
      classroomId: g.classroomId,
      name: displayName,
      avatar: displayAvatar,
      description: g.description,
      isDirect: g.isDirect,
      createdBy: g.createdBy,
      adminIds,
      memberIds,
      createdAt: g.createdAt,
      unreadCount,
      lastMessage: lastMsg ? {
        text: lastMsg.type === "material_forward" ? `\u{1F4C4} Forwarded: ${lastMsg.forwardedMaterial?.title || "Material"}` : lastMsg.type === "camera_image" ? "\u{1F4F7} Photo snapshot" : lastMsg.type === "file" ? `\u{1F4CE} File: ${lastMsg.fileName || "Attachment"}` : lastMsg.content,
        timestamp: lastMsg.timestamp,
        senderName: lastMsg.senderName,
        senderId: lastMsg.senderId,
        type: lastMsg.type,
        createdAt: lastMsg.createdAt
      } : void 0
    };
  }).sort((a, b) => {
    const timeA = a.lastMessage?.createdAt || new Date(a.createdAt).getTime() || 0;
    const timeB = b.lastMessage?.createdAt || new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });
  res.json(relevantGroups);
});
app.post("/api/chat/groups", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== "super_admin" && activeUser.role !== "admin") {
    return res.status(403).json({
      error: "Only cohort administrators can create group channels. You can message classmates directly via direct message."
    });
  }
  const { name, avatar, description, memberIds = [], classroomId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Group name is required" });
  }
  const groupId = `grp-${Date.now()}`;
  const effectiveClassroomId = classroomId || activeUser.classroomId || (classrooms[0]?.id || "");
  const groupAvatar = avatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80";
  const newGroup = {
    id: groupId,
    classroomId: effectiveClassroomId,
    name: name.trim(),
    avatar: groupAvatar,
    description: (description || "").trim(),
    isDirect: false,
    createdBy: activeUser.id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  chatGroups.push(newGroup);
  chatGroupMembers.push({
    groupId,
    userId: activeUser.id,
    role: "admin",
    joinedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  const uniqueMemberIds = Array.from(new Set(memberIds)).filter(
    (id) => id !== activeUser.id
  );
  uniqueMemberIds.forEach((uid) => {
    chatGroupMembers.push({
      groupId,
      userId: uid,
      role: "member",
      joinedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  dbSaveChatGroup({
    id: newGroup.id,
    classroomId: newGroup.classroomId,
    name: newGroup.name,
    avatar: newGroup.avatar,
    description: newGroup.description,
    isDirect: false,
    createdBy: newGroup.createdBy,
    adminIds: [activeUser.id],
    memberIds: [activeUser.id, ...uniqueMemberIds],
    createdAt: newGroup.createdAt
  }).catch((e) => console.warn("Supabase save chat group warning:", e));
  const welcomeMsg = {
    id: `msg-${Date.now()}`,
    groupId,
    senderId: activeUser.id,
    senderName: activeUser.name,
    senderAvatar: activeUser.avatar,
    type: "text",
    content: `Created group "${newGroup.name}". Welcome everyone!`,
    timestamp: "Just now",
    createdAt: Date.now(),
    deliveredTo: [activeUser.id],
    readBy: [activeUser.id]
  };
  chatMessages.push(welcomeMsg);
  broadcastToGroup(groupId, {
    type: "chat:group_created",
    group: newGroup
  });
  res.status(201).json({
    ...newGroup,
    adminIds: [activeUser.id],
    memberIds: [activeUser.id, ...uniqueMemberIds],
    unreadCount: 0,
    lastMessage: {
      text: welcomeMsg.content,
      timestamp: welcomeMsg.timestamp,
      senderName: welcomeMsg.senderName,
      senderId: welcomeMsg.senderId,
      type: "text"
    }
  });
});
app.post("/api/chat/direct", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { targetUserId, classroomId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: "Target user ID is required" });
  }
  const effectiveClassroomId = classroomId || activeUser.classroomId || (classrooms[0]?.id || "");
  const myDms = chatGroupMembers.filter((m) => m.userId === activeUser.id).map((m) => m.groupId);
  let existingGroupId = null;
  for (const gid of myDms) {
    const grp = chatGroups.find((g) => g.id === gid && g.isDirect);
    if (grp) {
      const otherMember = chatGroupMembers.find(
        (m) => m.groupId === gid && m.userId === targetUserId
      );
      if (otherMember) {
        existingGroupId = gid;
        break;
      }
    }
  }
  if (existingGroupId) {
    const grp = chatGroups.find((g) => g.id === existingGroupId);
    const targetUser2 = getMemberProfile(targetUserId);
    return res.json({
      ...grp,
      name: targetUser2.name,
      avatar: targetUser2.avatar,
      adminIds: [activeUser.id, targetUserId],
      memberIds: [activeUser.id, targetUserId]
    });
  }
  const newDmId = `dm-${[activeUser.id, targetUserId].sort().join("-")}`;
  const targetUser = getMemberProfile(targetUserId);
  const newDm = {
    id: newDmId,
    classroomId: effectiveClassroomId,
    name: targetUser.name,
    avatar: targetUser.avatar,
    description: "Direct Message",
    isDirect: true,
    createdBy: activeUser.id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  chatGroups.push(newDm);
  chatGroupMembers.push({
    groupId: newDmId,
    userId: activeUser.id,
    role: "admin",
    joinedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  chatGroupMembers.push({
    groupId: newDmId,
    userId: targetUserId,
    role: "admin",
    joinedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.status(201).json({
    ...newDm,
    name: targetUser.name,
    avatar: targetUser.avatar,
    adminIds: [activeUser.id, targetUserId],
    memberIds: [activeUser.id, targetUserId]
  });
});
app.get("/api/chat/groups/:id", (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }
  const memberRecords = chatGroupMembers.filter((m) => m.groupId === group.id);
  const populatedMembers = memberRecords.map((rec) => {
    const profile = getMemberProfile(rec.userId);
    return {
      userId: rec.userId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: rec.role,
      rollNumber: profile.rollNumber,
      isOnline: isUserOnline(rec.userId),
      lastSeen: isUserOnline(rec.userId) ? "Online" : "Recently active"
    };
  });
  res.json({
    ...group,
    adminIds: memberRecords.filter((m) => m.role === "admin").map((m) => m.userId),
    memberIds: memberRecords.map((m) => m.userId),
    members: populatedMembers
  });
});
app.patch("/api/chat/groups/:id", (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }
  const activeUser = getCurrentOrReqUser(req);
  const userMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!userMember || userMember.role !== "admin") {
    return res.status(403).json({ error: "Only group admins can update group settings" });
  }
  const { name, avatar, description } = req.body;
  if (name && name.trim()) group.name = name.trim();
  if (avatar && avatar.trim()) group.avatar = avatar.trim();
  if (typeof description === "string") group.description = description.trim();
  group.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  broadcastToGroup(group.id, {
    type: "chat:group_updated",
    groupId: group.id,
    group
  });
  res.json(group);
});
app.delete("/api/chat/groups/:id", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupIndex = chatGroups.findIndex((g) => g.id === req.params.id);
  if (groupIndex === -1) {
    return res.status(404).json({ error: "Group not found" });
  }
  const group = chatGroups[groupIndex];
  const userMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!userMember || userMember.role !== "admin") {
    return res.status(403).json({ error: "Only group admins can delete the group" });
  }
  broadcastToGroup(group.id, {
    type: "chat:group_deleted",
    groupId: group.id
  });
  chatGroups.splice(groupIndex, 1);
  chatGroupMembers = chatGroupMembers.filter((m) => m.groupId !== group.id);
  chatMessages = chatMessages.filter((m) => m.groupId !== group.id);
  res.json({ success: true, message: "Group deleted successfully" });
});
app.post("/api/chat/groups/:id/members", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const adminMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!adminMember || adminMember.role !== "admin") {
    return res.status(403).json({ error: "Only group admins can add members" });
  }
  const { memberIds = [] } = req.body;
  const existingUserIds = new Set(
    chatGroupMembers.filter((m) => m.groupId === group.id).map((m) => m.userId)
  );
  const added = [];
  memberIds.forEach((uid) => {
    if (!existingUserIds.has(uid)) {
      chatGroupMembers.push({
        groupId: group.id,
        userId: uid,
        role: "member",
        joinedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      added.push(uid);
    }
  });
  if (added.length > 0) {
    broadcastToGroup(group.id, {
      type: "chat:members_added",
      groupId: group.id,
      addedUserIds: added
    });
  }
  res.json({ success: true, addedCount: added.length });
});
app.delete("/api/chat/groups/:id/members/:userId", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const targetUserId = req.params.userId;
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  const isSelf = targetUserId === activeUser.id;
  const isAdmin = callerMember && callerMember.role === "admin";
  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: "Unauthorized to remove this member" });
  }
  chatGroupMembers = chatGroupMembers.filter(
    (m) => !(m.groupId === group.id && m.userId === targetUserId)
  );
  broadcastToGroup(group.id, {
    type: "chat:member_removed",
    groupId: group.id,
    userId: targetUserId
  });
  res.json({ success: true });
});
app.post("/api/chat/groups/:id/members/:userId/ban", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const targetUserId = req.params.userId;
  if (targetUserId === activeUser.id) {
    return res.status(400).json({ error: "You cannot ban yourself from the group." });
  }
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  const isCohortAdmin = activeUser.role === "super_admin" || activeUser.role === "admin";
  const isGroupAdmin = callerMember && callerMember.role === "admin";
  if (!isCohortAdmin && !isGroupAdmin) {
    return res.status(403).json({ error: "Only group administrators can ban members from this group" });
  }
  const targetMember = members.find((m) => m.id === targetUserId);
  if (targetMember && targetMember.role === "super_admin") {
    return res.status(403).json({ error: "Cannot ban the Super Admin." });
  }
  chatGroupMembers = chatGroupMembers.filter(
    (m) => !(m.groupId === group.id && m.userId === targetUserId)
  );
  if (!group.bannedUserIds) group.bannedUserIds = [];
  if (!group.bannedUserIds.includes(targetUserId)) {
    group.bannedUserIds.push(targetUserId);
  }
  broadcastToGroup(group.id, {
    type: "chat:member_banned",
    groupId: group.id,
    userId: targetUserId,
    bannedBy: activeUser.name
  });
  res.json({ success: true, banned: true, userId: targetUserId });
});
app.get("/api/chat/groups/:id/banned", (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  res.json(group.bannedUserIds || []);
});
app.patch("/api/chat/groups/:id/members/:userId/role", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!callerMember || callerMember.role !== "admin") {
    return res.status(403).json({ error: "Only admins can change member roles" });
  }
  const targetMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === req.params.userId
  );
  if (!targetMember) return res.status(404).json({ error: "Member not found in group" });
  const { role } = req.body;
  if (role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "Invalid role" });
  }
  targetMember.role = role;
  broadcastToGroup(group.id, {
    type: "chat:role_changed",
    groupId: group.id,
    userId: req.params.userId,
    newRole: role
  });
  res.json({ success: true, newRole: role });
});
app.get("/api/chat/groups/:id/messages", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;
  try {
    const dbMsgs = await dbFetchChatMessages(groupId);
    if (dbMsgs && dbMsgs.length > 0) {
      const map = /* @__PURE__ */ new Map();
      dbMsgs.forEach((m) => map.set(m.id, m));
      chatMessages.forEach((m) => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
      chatMessages = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Supabase fetch chat messages warning:", err);
  }
  const isMember = chatGroupMembers.some(
    (m) => m.groupId === groupId && m.userId === activeUser.id
  );
  if (!isMember) {
    return res.status(403).json({ error: "Access denied: You are not a member of this conversation" });
  }
  markUserDeliveredInGroups(activeUser.id, [groupId]);
  const groupMsgs = chatMessages.filter((m) => m.groupId === groupId);
  res.json(groupMsgs);
});
app.post("/api/chat/groups/:id/messages", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;
  const isMember = chatGroupMembers.some(
    (m) => m.groupId === groupId && m.userId === activeUser.id
  );
  if (!isMember) {
    return res.status(403).json({ error: "Cannot send message to a group you do not belong to" });
  }
  const { type = "text", content, fileUrl, fileName, fileSize, forwardedMaterial, replyTo, clientTempId } = req.body;
  if (!content && !fileUrl && !forwardedMaterial) {
    return res.status(400).json({ error: "Message content or attachment is required" });
  }
  const now = /* @__PURE__ */ new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    groupId,
    senderId: activeUser.id,
    senderName: activeUser.name,
    senderAvatar: activeUser.avatar,
    type,
    content: (content || "").trim(),
    fileUrl,
    fileName,
    fileSize,
    forwardedMaterial,
    replyTo: replyTo || void 0,
    reactions: [],
    timestamp: timeFormatted,
    createdAt: Date.now(),
    deliveredTo: getInitialDeliveredUsers(groupId, activeUser.id),
    readBy: [activeUser.id]
  };
  chatMessages.push(newMsg);
  dbSaveChatMessage(newMsg).catch((e) => console.warn("Supabase save chat message warning:", e));
  const group = chatGroups.find((g) => g.id === groupId);
  if (group) {
    group.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  broadcastToGroup(groupId, {
    type: "chat:message_new",
    groupId,
    message: newMsg,
    clientTempId
  });
  res.status(201).json(newMsg);
});
app.post("/api/chat/messages/:id/react", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  const { emoji } = req.body;
  if (!emoji) return res.status(400).json({ error: "Emoji is required" });
  if (!msg.reactions) msg.reactions = [];
  const existingIndex = msg.reactions.findIndex(
    (r) => r.userId === activeUser.id && r.emoji === emoji
  );
  if (existingIndex > -1) {
    msg.reactions.splice(existingIndex, 1);
  } else {
    msg.reactions.push({
      emoji,
      userId: activeUser.id,
      userName: activeUser.name
    });
  }
  dbUpdateChatMessage(msg.id, { reactions: msg.reactions }).catch((e) => console.warn("Supabase update reactions warning:", e));
  broadcastToGroup(msg.groupId, {
    type: "chat:message_reaction",
    groupId: msg.groupId,
    messageId: msg.id,
    reactions: msg.reactions
  });
  res.json({ success: true, reactions: msg.reactions });
});
app.post("/api/chat/messages/:id/pin", (req, res) => {
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  const group = chatGroups.find((g) => g.id === msg.groupId);
  const willBePinned = !msg.isPinned;
  if (willBePinned) {
    chatMessages.filter((m) => m.groupId === msg.groupId).forEach((m) => {
      m.isPinned = false;
    });
    msg.isPinned = true;
    if (group) group.pinnedMessageId = msg.id;
  } else {
    msg.isPinned = false;
    if (group && group.pinnedMessageId === msg.id) {
      group.pinnedMessageId = void 0;
    }
  }
  dbUpdateChatMessage(msg.id, { isPinned: msg.isPinned }).catch((e) => console.warn("Supabase update pin warning:", e));
  broadcastToGroup(msg.groupId, {
    type: "chat:message_pinned",
    groupId: msg.groupId,
    messageId: msg.id,
    isPinned: msg.isPinned,
    pinnedMessage: willBePinned ? msg : null
  });
  res.json({ success: true, isPinned: msg.isPinned, message: msg });
});
app.post("/api/chat/messages/:id/star", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  if (!msg.starredBy) msg.starredBy = [];
  const idx = msg.starredBy.indexOf(activeUser.id);
  let isStarred = false;
  if (idx > -1) {
    msg.starredBy.splice(idx, 1);
    isStarred = false;
  } else {
    msg.starredBy.push(activeUser.id);
    isStarred = true;
  }
  msg.isStarred = isStarred;
  dbUpdateChatMessage(msg.id, { isStarred: msg.isStarred, starredBy: msg.starredBy }).catch((e) => console.warn("Supabase update star warning:", e));
  res.json({ success: true, isStarred, messageId: msg.id });
});
app.post("/api/chat/messages/forward", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { messageId, targetGroupIds } = req.body;
  const sourceMsg = chatMessages.find((m) => m.id === messageId);
  if (!sourceMsg) return res.status(404).json({ error: "Source message not found" });
  if (!Array.isArray(targetGroupIds) || targetGroupIds.length === 0) {
    return res.status(400).json({ error: "targetGroupIds must be non-empty array" });
  }
  const now = /* @__PURE__ */ new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const createdMsgs = [];
  for (const tGroupId of targetGroupIds) {
    const isMember = chatGroupMembers.some(
      (m) => m.groupId === tGroupId && m.userId === activeUser.id
    );
    if (!isMember) continue;
    const fwdMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      groupId: tGroupId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      type: sourceMsg.type,
      content: sourceMsg.content,
      fileUrl: sourceMsg.fileUrl,
      fileName: sourceMsg.fileName,
      fileSize: sourceMsg.fileSize,
      forwardedMaterial: sourceMsg.forwardedMaterial,
      timestamp: timeFormatted,
      createdAt: Date.now(),
      deliveredTo: getInitialDeliveredUsers(tGroupId, activeUser.id),
      readBy: [activeUser.id]
    };
    chatMessages.push(fwdMsg);
    createdMsgs.push(fwdMsg);
    dbSaveChatMessage(fwdMsg).catch((e) => console.warn("Supabase save forwarded msg warning:", e));
    const grp = chatGroups.find((g) => g.id === tGroupId);
    if (grp) grp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    broadcastToGroup(tGroupId, {
      type: "chat:message_new",
      groupId: tGroupId,
      message: fwdMsg
    });
  }
  res.json({ success: true, forwardedCount: createdMsgs.length });
});
app.post("/api/chat/materials/forward", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { material, targetGroupIds, targetUserIds, note } = req.body;
  if (!material) {
    return res.status(400).json({ error: "Material is required" });
  }
  const effectiveClassroomId = activeUser.classroomId || (classrooms[0]?.id || "");
  const resolvedGroupIds = /* @__PURE__ */ new Set();
  if (Array.isArray(targetGroupIds)) {
    targetGroupIds.forEach((gid) => {
      if (typeof gid === "string" && gid.trim()) resolvedGroupIds.add(gid.trim());
    });
  }
  if (Array.isArray(targetUserIds)) {
    for (const targetUserId of targetUserIds) {
      if (!targetUserId || targetUserId === activeUser.id) continue;
      const myDms = chatGroupMembers.filter((m) => m.userId === activeUser.id).map((m) => m.groupId);
      let existingGroupId = null;
      for (const gid of myDms) {
        const grp = chatGroups.find((g) => g.id === gid && g.isDirect);
        if (grp) {
          const otherMember = chatGroupMembers.find(
            (m) => m.groupId === gid && m.userId === targetUserId
          );
          if (otherMember) {
            existingGroupId = gid;
            break;
          }
        }
      }
      if (existingGroupId) {
        resolvedGroupIds.add(existingGroupId);
      } else {
        const newDmId = `dm-${[activeUser.id, targetUserId].sort().join("-")}`;
        const targetUser = getMemberProfile(targetUserId);
        const newDm = {
          id: newDmId,
          classroomId: effectiveClassroomId,
          name: targetUser.name,
          avatar: targetUser.avatar,
          description: "Direct Message",
          isDirect: true,
          createdBy: activeUser.id,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        chatGroups.push(newDm);
        chatGroupMembers.push({
          groupId: newDmId,
          userId: activeUser.id,
          role: "admin",
          joinedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        chatGroupMembers.push({
          groupId: newDmId,
          userId: targetUserId,
          role: "admin",
          joinedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        resolvedGroupIds.add(newDmId);
      }
    }
  }
  if (resolvedGroupIds.size === 0) {
    return res.status(400).json({ error: "At least one target group or user is required" });
  }
  const now = /* @__PURE__ */ new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const createdMsgs = [];
  const forwardedMaterialInfo = {
    id: material.id,
    title: material.title,
    subjectCode: material.subjectCode || "ACAD",
    subjectName: material.subjectName || material.title,
    type: material.type || "notes",
    fileFormat: material.fileFormat || "PDF",
    fileSize: material.fileSize || "1.5 MB",
    snippet: material.contentSnippet || `${material.title} - Shared from Academic Sanctuary Notes Repository.`
  };
  for (const tGroupId of resolvedGroupIds) {
    const isMember = chatGroupMembers.some(
      (m) => m.groupId === tGroupId && m.userId === activeUser.id
    );
    if (!isMember) continue;
    const fwdMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      groupId: tGroupId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      type: "material_forward",
      content: note && typeof note === "string" && note.trim() ? note.trim() : material.title,
      forwardedMaterial: forwardedMaterialInfo,
      timestamp: timeFormatted,
      createdAt: Date.now(),
      deliveredTo: getInitialDeliveredUsers(tGroupId, activeUser.id),
      readBy: [activeUser.id]
    };
    chatMessages.push(fwdMsg);
    createdMsgs.push(fwdMsg);
    dbSaveChatMessage(fwdMsg).catch((e) => console.warn("Supabase save forwarded msg warning:", e));
    const grp = chatGroups.find((g) => g.id === tGroupId);
    if (grp) {
      grp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    broadcastToGroup(tGroupId, {
      type: "chat:message_new",
      groupId: tGroupId,
      message: fwdMsg
    });
  }
  res.json({
    success: true,
    forwardedCount: createdMsgs.length,
    groupIds: Array.from(resolvedGroupIds)
  });
});
app.patch("/api/chat/messages/:id", async (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  let msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg && req.body?.groupId) {
    try {
      const dbMsgs = await dbFetchChatMessages(String(req.body.groupId));
      if (dbMsgs && dbMsgs.length > 0) {
        chatMessages = mergeRecordsById(dbMsgs, chatMessages);
        msg = chatMessages.find((m) => m.id === req.params.id);
      }
    } catch {
    }
  }
  if (!msg) return res.status(404).json({ error: "Message not found" });
  if (msg.senderId !== activeUser.id) {
    return res.status(403).json({ error: "You can only edit your own messages" });
  }
  if (msg.isDeleted) {
    return res.status(400).json({ error: "Deleted messages cannot be edited" });
  }
  if (msg.type === "material_forward") {
    return res.status(400).json({ error: "Forwarded materials cannot be edited" });
  }
  const { content } = req.body;
  const trimmedContent = typeof content === "string" ? content.trim() : "";
  if (!trimmedContent) {
    return res.status(400).json({ error: "Message content cannot be empty" });
  }
  msg.content = trimmedContent;
  msg.isEdited = true;
  msg.editedAt = Date.now();
  dbUpdateChatMessage(msg.id, {
    content: msg.content,
    isEdited: true,
    editedAt: msg.editedAt
  }).catch((e) => console.warn("Supabase update edited message warning:", e));
  broadcastToGroup(msg.groupId, {
    type: "chat:message_edited",
    groupId: msg.groupId,
    messageId: msg.id,
    content: msg.content,
    isEdited: true,
    editedAt: msg.editedAt
  });
  res.json({ success: true, message: msg });
});
app.delete("/api/chat/messages/:id", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  const isSender = msg.senderId === activeUser.id;
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === msg.groupId && m.userId === activeUser.id
  );
  const isAdmin = callerMember && callerMember.role === "admin";
  if (!isSender && !isAdmin) {
    return res.status(403).json({ error: "You are not authorized to delete this message" });
  }
  msg.isDeleted = true;
  msg.content = "This message was deleted";
  msg.fileUrl = void 0;
  msg.forwardedMaterial = void 0;
  dbUpdateChatMessage(msg.id, {
    isDeleted: true,
    content: "This message was deleted"
  }).catch((e) => console.warn("Supabase update delete message warning:", e));
  broadcastToGroup(msg.groupId, {
    type: "chat:message_deleted",
    groupId: msg.groupId,
    messageId: msg.id
  });
  res.json({ success: true, message: msg });
});
app.post("/api/chat/groups/:id/read", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;
  const readCount = markGroupMessagesRead(groupId, activeUser.id);
  res.json({ success: true, readCount });
});
app.patch("/api/users/profile", (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (!activeUser || activeUser.id === "user-guest") {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const { name, avatar } = req.body;
  if (name && typeof name === "string" && name.trim()) {
    activeUser.name = name.trim();
    if (currentUser && currentUser.id === activeUser.id) currentUser.name = activeUser.name;
  }
  if (avatar && typeof avatar === "string" && avatar.trim()) {
    activeUser.avatar = avatar.trim();
    if (currentUser && currentUser.id === activeUser.id) currentUser.avatar = activeUser.avatar;
  }
  const reg = registeredUsers.find((u) => u.id === activeUser.id);
  if (reg) {
    if (name && typeof name === "string" && name.trim()) reg.name = name.trim();
    if (avatar && typeof avatar === "string" && avatar.trim()) reg.avatar = avatar.trim();
  }
  const mem = members.find((m) => m.id === activeUser.id);
  if (mem) {
    if (name && typeof name === "string" && name.trim()) mem.name = name.trim();
    if (avatar && typeof avatar === "string" && avatar.trim()) mem.avatar = avatar.trim();
  }
  chatMessages.forEach((m) => {
    if (m.senderId === activeUser.id) {
      if (name && typeof name === "string" && name.trim()) m.senderName = name.trim();
      if (avatar && typeof avatar === "string" && avatar.trim()) m.senderAvatar = avatar.trim();
    }
  });
  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: "chat:user_profile_updated",
          userId: activeUser.id,
          name: activeUser.name,
          avatar: activeUser.avatar
        })
      );
    }
  }
  setAuthCookies(res, activeUser, activeUser.classroomId);
  const { password: _pwd, ...safeUser } = activeUser;
  res.json({ success: true, user: safeUser });
});
app.patch("/api/chat/friend-name", (req, res) => {
  const { targetUserId, name, groupId } = req.body;
  if (!targetUserId || !name || !name.trim()) {
    return res.status(400).json({ error: "Target user ID and new name are required" });
  }
  const newName = name.trim();
  const reg = registeredUsers.find((u) => u.id === targetUserId);
  if (reg) {
    reg.name = newName;
  }
  const mem = members.find((m) => m.id === targetUserId);
  if (mem) {
    mem.name = newName;
  }
  if (groupId) {
    const grp = chatGroups.find((g) => g.id === groupId);
    if (grp && grp.isDirect) {
      grp.name = newName;
    }
  }
  chatMessages.forEach((m) => {
    if (m.senderId === targetUserId) {
      m.senderName = newName;
    }
  });
  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: "chat:friend_renamed",
          userId: targetUserId,
          newName,
          groupId
        })
      );
    }
  }
  res.json({ success: true, targetUserId, newName });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  if (!process.env.VERCEL) {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Academic Sanctuary server running on http://0.0.0.0:${PORT}`);
    });
  }
}
var server_default = app;
if (!process.env.VERCEL) {
  startServer();
}

// src/api-handler.ts
function handler(req, res) {
  if (req.url === "/api" || req.url === "/api/" || req.url === "/api/index.js" || req.url === "/api/index") {
    const rawUrl = req.headers["x-matched-path"] || req.headers["x-forwarded-uri"] || req.headers["x-rewrite-url"];
    if (rawUrl) {
      req.url = rawUrl;
    }
  }
  return server_default(req, res);
}
export {
  handler as default
};
