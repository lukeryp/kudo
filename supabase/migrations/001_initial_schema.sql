-- =============================================================================
-- Kudo — Initial Schema
-- Run this in your Supabase SQL editor
-- =============================================================================

-- Enable UUID extension (already enabled in Supabase by default)
-- create extension if not exists "uuid-ossp";

-- =============================================================================
-- STUDENTS TABLE
-- =============================================================================
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) >= 1 and char_length(name) <= 120),
  email       text check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  lesson_date date not null,
  stage       text not null default 'post-lesson'
              check (stage in (
                'post-lesson', 'hook-sent', '2-week', '4-week', '8-week',
                'video-received', 'approved', 'deployed'
              )),
  notes             text check (char_length(notes) <= 2000),
  testimonial_text  text check (char_length(testimonial_text) <= 5000),
  platforms         text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Index for common queries
create index if not exists students_user_id_idx on public.students(user_id);
create index if not exists students_stage_idx on public.students(stage);
create index if not exists students_lesson_date_idx on public.students(lesson_date desc);
create index if not exists students_updated_at_idx on public.students(updated_at desc);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger students_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ACTIVITIES TABLE
-- =============================================================================
create table if not exists public.activities (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  student_name  text not null check (char_length(student_name) >= 1 and char_length(student_name) <= 120),
  details       text not null check (char_length(details) >= 1 and char_length(details) <= 500),
  icon          text not null default '⚡' check (char_length(icon) <= 10),
  cls           text not null default 'g' check (cls in ('g', 'y', 'b', 'p')),
  created_at    timestamptz not null default now()
);

-- Index for feed queries (most recent first, per user)
create index if not exists activities_user_id_created_idx on public.activities(user_id, created_at desc);

-- Keep at most 100 activities per user (delete oldest on insert)
create or replace function public.trim_activities()
returns trigger as $$
begin
  delete from public.activities
  where user_id = new.user_id
    and id not in (
      select id from public.activities
      where user_id = new.user_id
      order by created_at desc
      limit 100
    );
  return null;
end;
$$ language plpgsql;

create or replace trigger activities_trim
  after insert on public.activities
  for each row execute function public.trim_activities();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.students enable row level security;
alter table public.activities enable row level security;

-- Students: users can only see/modify their own records
create policy "students_select_own"
  on public.students for select
  using (auth.uid() = user_id);

create policy "students_insert_own"
  on public.students for insert
  with check (auth.uid() = user_id);

create policy "students_update_own"
  on public.students for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "students_delete_own"
  on public.students for delete
  using (auth.uid() = user_id);

-- Activities: users can only see/modify their own records
create policy "activities_select_own"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "activities_insert_own"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "activities_delete_own"
  on public.activities for delete
  using (auth.uid() = user_id);
