-- ==========================================================
-- ACADEMIC SANCTUARY - SUPABASE DATABASE SCHEMA MIGRATION
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. Create the public profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  class_code text,
  registration_number text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- 3. Create RLS Policies ensuring users can ONLY view, insert, and update their own profile
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 4. Create indices for performance
create index if not exists idx_profiles_registration_number on public.profiles (registration_number);
create index if not exists idx_profiles_class_code on public.profiles (class_code);

-- 5. Trigger to automatically populate public.profiles from auth.users metadata on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, class_code, registration_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'),
    new.raw_user_meta_data->>'class_code',
    new.raw_user_meta_data->>'registration_number'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    class_code = excluded.class_code,
    registration_number = excluded.registration_number;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
