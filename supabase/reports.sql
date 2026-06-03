-- =========================================================
-- TFT Quiz - Reports Table
-- Run this in Supabase SQL Editor (after schema.sql)
-- =========================================================

create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete set null,
  report_type text not null check (report_type in ('wrong_answer', 'image_error', 'typo', 'suggestion', 'other')),
  category_slug text check (category_slug in ('champion', 'item', 'synergy', 'augment', 'other')),
  content text not null check (length(content) between 10 and 500),
  status text default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz default now() not null
);

alter table public.reports enable row level security;

-- Anyone can submit a report
create policy "reports_anyone_insert" on public.reports
  for insert with check (true);

-- Users can see their own reports
create policy "reports_self_select" on public.reports
  for select using (auth.uid() = user_id);
