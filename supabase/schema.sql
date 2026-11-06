-- ==========================================================
-- ACADEMIC SANCTUARY - COMPLETE SUPABASE DATABASE SCHEMA
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click "SQL Editor" in the left sidebar
-- 3. Click "New query" -> Paste this entire script -> Click "Run"
-- ==========================================================

-- 0. Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==========================================================
-- 1. PROFILES TABLE (Linked with Supabase auth.users)
-- ==========================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin', 'super_admin')),
  department text default 'General Academic',
  roll_number text,
  registration_number text unique,
  class_code text,
  classroom_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 2. CLASSROOMS TABLE (Cohort Sanctuaries)
-- ==========================================================
create table if not exists public.classrooms (
  id text primary key,
  code text not null unique,
  name text not null,
  college_name text default 'Academic University',
  location text default 'Main Campus',
  department text not null,
  course text not null,
  degree_level text default 'undergraduate' check (degree_level in ('undergraduate', 'postgraduate', 'doctorate', 'other')),
  batch_year text not null,
  section text not null,
  semester text not null,
  super_admin_id text,
  member_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 3. CLASSROOM MEMBERS TABLE
-- ==========================================================
create table if not exists public.classroom_members (
  id text primary key default ('mem-' || substr(md5(random()::text), 1, 10)),
  classroom_id text references public.classrooms(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar text,
  role text default 'student' check (role in ('student', 'admin', 'super_admin')),
  roll_number text,
  joined_date text default 'Just now',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (classroom_id, user_id)
);

-- ==========================================================
-- 4. SUBJECTS TABLE
-- ==========================================================
create table if not exists public.subjects (
  id text primary key,
  classroom_id text references public.classrooms(id) on delete cascade not null,
  code text not null,
  name text not null,
  professor text,
  description text,
  credit_hours integer default 4,
  materials_count integer default 0,
  notes_count integer default 0,
  pyqs_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 5. MATERIALS & REPOSITORY TABLE (Notes, Slides, PYQs)
-- ==========================================================
create table if not exists public.materials (
  id text primary key,
  classroom_id text references public.classrooms(id) on delete cascade,
  subject_id text references public.subjects(id) on delete cascade not null,
  subject_code text not null,
  subject_name text not null,
  title text not null,
  description text,
  type text not null check (type in ('notes', 'materials', 'slides', 'pyqs', 'important_questions')),
  file_format text not null check (file_format in ('PDF', 'DOCX', 'PPTX', 'ZIP', 'TXT')),
  file_size text default '1.0 MB',
  file_url text,
  uploaded_by jsonb not null,
  uploaded_date text default to_char(now(), 'Mon DD, YYYY'),
  created_at bigint default (extract(epoch from now()) * 1000)::bigint,
  downloads_count integer default 0,
  views_count integer default 0,
  is_verified boolean default true,
  content_snippet text,
  tags text[] default '{}',
  unit text,
  recommended_exam text
);

-- Add column if table already exists
alter table public.materials add column if not exists classroom_id text references public.classrooms(id) on delete cascade;

-- ==========================================================
-- 6. ANNOUNCEMENTS TABLE
-- ==========================================================
create table if not exists public.announcements (
  id text primary key,
  classroom_id text references public.classrooms(id) on delete cascade not null,
  title text not null,
  description text,
  author text not null,
  is_urgent boolean default false,
  timestamp text default to_char(now(), 'Today, HH12:MI AM'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 7. EXAMS TABLE (Schedules, IATs, SEM)
-- ==========================================================
create table if not exists public.exams (
  id text primary key,
  classroom_id text references public.classrooms(id) on delete cascade not null,
  subject_name text not null,
  subject_code text not null,
  date text not null,
  days_remaining integer default 0,
  time text,
  exam_type text default 'IAT 1',
  venue text default 'Academic Hall',
  syllabus text,
  progress_percent integer default 0,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 8. CHAT GROUPS & DMS TABLE
-- ==========================================================
create table if not exists public.chat_groups (
  id text primary key,
  classroom_id text references public.classrooms(id) on delete cascade not null,
  name text not null,
  avatar text,
  description text,
  is_direct boolean default false,
  created_by text,
  admin_ids text[] default '{}',
  member_ids text[] default '{}',
  banned_user_ids text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- 9. CHAT MESSAGES TABLE
-- ==========================================================
create table if not exists public.chat_messages (
  id text primary key,
  group_id text references public.chat_groups(id) on delete cascade not null,
  sender_id text not null,
  sender_name text not null,
  sender_avatar text,
  type text default 'text' check (type in ('text', 'file', 'camera_image', 'material_forward')),
  content text default '',
  file_url text,
  file_name text,
  file_size text,
  forwarded_material jsonb,
  timestamp text default to_char(now(), 'Today, HH12:MI AM'),
  created_at bigint default (extract(epoch from now()) * 1000)::bigint,
  delivered_to text[] default '{}',
  read_by text[] default '{}',
  reactions jsonb default '[]'::jsonb,
  reply_to jsonb,
  is_deleted boolean default false,
  is_pinned boolean default false,
  is_starred boolean default false,
  starred_by text[] default '{}'
);

-- ==========================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies allowing seamless reads and writes for
-- both authenticated users and backend proxy/anon clients.
-- ==========================================================
alter table public.profiles enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.subjects enable row level security;
alter table public.materials enable row level security;
alter table public.announcements enable row level security;
alter table public.exams enable row level security;
alter table public.chat_groups enable row level security;
alter table public.chat_messages enable row level security;

-- Drop previous restrictive policies
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Profiles public access" on public.profiles;
create policy "Profiles public access" on public.profiles for all to anon, authenticated using (true) with check (true);

drop policy if exists "Classrooms are viewable by authenticated users" on public.classrooms;
drop policy if exists "Classrooms can be created by authenticated users" on public.classrooms;
drop policy if exists "Classrooms can be updated by members" on public.classrooms;
drop policy if exists "Classrooms public access" on public.classrooms;
create policy "Classrooms public access" on public.classrooms for all to anon, authenticated using (true) with check (true);

drop policy if exists "Classroom members public access" on public.classroom_members;
create policy "Classroom members public access" on public.classroom_members for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read subjects" on public.subjects;
drop policy if exists "Allow authenticated write subjects" on public.subjects;
drop policy if exists "Subjects public access" on public.subjects;
create policy "Subjects public access" on public.subjects for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read materials" on public.materials;
drop policy if exists "Allow authenticated write materials" on public.materials;
drop policy if exists "Materials public access" on public.materials;
create policy "Materials public access" on public.materials for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read announcements" on public.announcements;
drop policy if exists "Allow authenticated write announcements" on public.announcements;
drop policy if exists "Announcements public access" on public.announcements;
create policy "Announcements public access" on public.announcements for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read exams" on public.exams;
drop policy if exists "Allow authenticated write exams" on public.exams;
drop policy if exists "Exams public access" on public.exams;
create policy "Exams public access" on public.exams for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read chat_groups" on public.chat_groups;
drop policy if exists "Allow authenticated write chat_groups" on public.chat_groups;
drop policy if exists "Chat groups public access" on public.chat_groups;
create policy "Chat groups public access" on public.chat_groups for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow authenticated read chat_messages" on public.chat_messages;
drop policy if exists "Allow authenticated write chat_messages" on public.chat_messages;
drop policy if exists "Chat messages public access" on public.chat_messages;
create policy "Chat messages public access" on public.chat_messages for all to anon, authenticated using (true) with check (true);

-- ==========================================================
-- 11. INDEXES FOR HIGH-SPEED LOOKUPS
-- ==========================================================
create index if not exists idx_profiles_registration_number on public.profiles (registration_number);
create index if not exists idx_profiles_class_code on public.profiles (class_code);
create index if not exists idx_classrooms_code on public.classrooms (code);
create index if not exists idx_classroom_members_cid on public.classroom_members (classroom_id);
create index if not exists idx_classroom_members_uid on public.classroom_members (user_id);
create index if not exists idx_subjects_classroomId on public.subjects (classroom_id);
create index if not exists idx_materials_subjectId on public.materials (subject_id);
create index if not exists idx_materials_classroomId on public.materials (classroom_id);
create index if not exists idx_materials_type on public.materials (type);
create index if not exists idx_announcements_cid on public.announcements (classroom_id);
create index if not exists idx_exams_cid on public.exams (classroom_id);
create index if not exists idx_chat_groups_cid on public.chat_groups (classroom_id);
create index if not exists idx_chat_messages_gid on public.chat_messages (group_id);

-- ==========================================================
-- 12. AUTOMATIC PROFILE TRIGGER ON AUTH.USERS SIGNUP
-- ==========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    registration_number,
    class_code,
    role,
    department
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'registration_number',
    new.raw_user_meta_data->>'class_code',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'department', 'Computer Science & Engineering')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    registration_number = coalesce(excluded.registration_number, public.profiles.registration_number),
    class_code = coalesce(excluded.class_code, public.profiles.class_code);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================================
-- 13. SEED DEFAULT COHORT (For instant demo & fresh setups)
-- ==========================================================
insert into public.classrooms (
  id, code, name, college_name, location, department, course, degree_level, batch_year, section, semester, super_admin_id, member_count
)
values (
  'cls-1',
  'BTECH26A',
  'B.Tech CSE 2026 - Section A',
  'Oxford University',
  'Oxford, United Kingdom',
  'Department of Computer Science & Engineering',
  'B.Tech Computer Science & Engineering',
  'undergraduate',
  '2026',
  'Section A',
  'Semester 5',
  'user-sarah',
  65
)
on conflict (code) do nothing;

insert into public.subjects (id, classroom_id, code, name, professor, description, credit_hours, materials_count, notes_count, pyqs_count)
values
  ('sub-ds', 'cls-1', 'CS301', 'Data Structures', 'Prof. Alan Turing', 'Fundamental concepts of data organization, algorithms, and complexity analysis.', 4, 14, 8, 5),
  ('sub-os', 'cls-1', 'CS302', 'Operating Systems', 'Prof. A. Kumar', 'Concurrency, process management, memory virtualisation, and file systems.', 4, 18, 10, 6),
  ('sub-algo', 'cls-1', 'CS303', 'Design & Analysis of Algorithms', 'Dr. Donald Knuth', 'Greedy paradigms, dynamic programming, graph algorithms, and NP-completeness.', 4, 16, 9, 4),
  ('sub-cn', 'cls-1', 'CS304', 'Computer Networks', 'Prof. Radia Perlman', 'OSI layers, TCP/IP, routing protocols, socket programming, and flow control.', 3, 12, 7, 3),
  ('sub-dbms', 'cls-1', 'CS305', 'Database Management Systems', 'Prof. E.F. Codd', 'Relational algebra, normalization (BCNF/3NF), indexing, and transactions.', 4, 15, 8, 4)
on conflict (id) do nothing;

insert into public.announcements (id, classroom_id, title, description, author, is_urgent)
values (
  'ann-1',
  'cls-1',
  'Internal Exam Schedule Released for Mid-Semesters.',
  'Mid-semester examinations will commence from next week. Please check the Exams tab for the complete timetable.',
  'Sarah Jenkins (Class Rep)',
  false
)
on conflict (id) do nothing;

insert into public.chat_groups (id, classroom_id, name, avatar, description, is_direct, created_by, admin_ids, member_ids)
values (
  'grp-cohort-cls-1',
  'cls-1',
  'B.Tech CSE 26 (Official)',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
  'Official cohort broadcast and academic discussions channel.',
  false,
  'user-sarah',
  array['user-sarah'],
  array['user-sarah', 'user-michael', 'user-elena', 'user-david']
)
on conflict (id) do nothing;
