-- =========================================================
-- TFT Quiz - Supabase Schema
-- Run this in Supabase SQL Editor
-- =========================================================

-- Profiles (auto-created from auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "profiles_public_select" on public.profiles
  for select using (true);

create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Quiz categories
create table if not exists public.quiz_categories (
  id serial primary key,
  slug text unique not null,
  display_name text not null,
  description text,
  icon text,
  color text
);

insert into public.quiz_categories (slug, display_name, description, icon, color) values
  ('champion', '챔피언', '이미지를 보고 챔피언 이름을 맞추세요', '⚔️', 'blue'),
  ('item', '아이템', '아이템 아이콘을 보고 이름을 맞추세요', '🛡️', 'yellow'),
  ('synergy', '시너지', '시너지 아이콘을 보고 이름을 맞추세요', '✨', 'purple'),
  ('augment', '증강체', '증강체 아이콘을 보고 이름을 맞추세요', '💎', 'green')
on conflict (slug) do nothing;

-- Quiz questions
create table if not exists public.quiz_questions (
  id serial primary key,
  category_id int references public.quiz_categories not null,
  image_url text not null,
  question_text text not null,
  choices jsonb not null,
  correct_answers jsonb not null,
  is_multi_answer boolean default false,
  difficulty smallint default 1 check (difficulty between 1 and 3),
  patch_version text,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

alter table public.quiz_questions enable row level security;

create policy "questions_public_select" on public.quiz_questions
  for select using (is_active = true);

-- Quiz sessions
create table if not exists public.quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  category_id int references public.quiz_categories not null,
  question_count int not null,
  correct_count int not null default 0,
  score int not null default 0,
  max_combo int not null default 0,
  duration_seconds int,
  completed_at timestamptz default now() not null
);

alter table public.quiz_sessions enable row level security;

create policy "sessions_public_select" on public.quiz_sessions
  for select using (true);

create policy "sessions_self_insert" on public.quiz_sessions
  for insert with check (auth.uid() = user_id or user_id is null);

-- Per-category leaderboard view (best score per user)
create or replace view public.category_leaderboard as
select
  qs.category_id,
  qc.slug as category_slug,
  qc.display_name as category_name,
  p.id as user_id,
  p.username,
  p.avatar_url,
  max(qs.score) as best_score,
  max(qs.max_combo) as best_combo,
  count(qs.id)::int as total_games,
  round(avg(qs.correct_count::float / qs.question_count * 100)::numeric, 1) as avg_accuracy
from public.quiz_sessions qs
join public.profiles p on p.id = qs.user_id
join public.quiz_categories qc on qc.id = qs.category_id
where qs.user_id is not null
group by qs.category_id, qc.slug, qc.display_name, p.id, p.username, p.avatar_url;

-- Overall leaderboard view (sum of best scores per category)
create or replace view public.overall_leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(sum(sub.best_score), 0)::int as total_score,
  coalesce(max(sub.best_combo), 0)::int as best_combo,
  count(distinct sub.category_id)::int as categories_played
from public.profiles p
left join (
  select
    user_id,
    category_id,
    max(score) as best_score,
    max(max_combo) as best_combo
  from public.quiz_sessions
  where user_id is not null
  group by user_id, category_id
) sub on p.id = sub.user_id
group by p.id, p.username, p.avatar_url
having coalesce(sum(sub.best_score), 0) > 0;
