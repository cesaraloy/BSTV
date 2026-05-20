-- +BarSportTV — Supabase Schema
-- Run this in the Supabase SQL editor to create all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── users ────────────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text unique not null,
  avatar_url    text,
  default_location text default 'Madrid, España',
  created_at    timestamptz default now()
);

-- ─── teams ────────────────────────────────────────────────────────
create table if not exists public.teams (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  competition   text not null,
  logo_url      text,
  country       text,
  created_at    timestamptz default now()
);

-- ─── matches ──────────────────────────────────────────────────────
create table if not exists public.matches (
  id                 uuid primary key default uuid_generate_v4(),
  home_team          text not null,
  away_team          text not null,
  competition        text not null,
  match_date         text not null,   -- 'HOY' | 'MAÑANA' | 'DD/MM'
  match_time         text not null,   -- 'HH:MM'
  match_datetime     timestamptz,     -- actual UTC datetime for push scheduling
  home_team_logo     text,
  away_team_logo     text,
  competition_logo   text,
  venue_city         text,
  is_featured        boolean default false,
  created_at         timestamptz default now()
);

-- ─── venues ───────────────────────────────────────────────────────
create table if not exists public.venues (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  address         text not null,
  city            text default 'Madrid',
  latitude        double precision,
  longitude       double precision,
  phone           text,
  image_url       text,
  rating          numeric(3,1) default 0,
  reviews_count   integer default 0,
  is_open         boolean default false,
  open_until      text,
  competitions    text[],  -- ['LaLiga', 'Champions League']
  verified        boolean default false,
  created_at      timestamptz default now()
);

-- ─── venue_matches ────────────────────────────────────────────────
create table if not exists public.venue_matches (
  id          uuid primary key default uuid_generate_v4(),
  venue_id    uuid references public.venues(id) on delete cascade,
  match_id    uuid references public.matches(id) on delete cascade,
  confirmed   boolean default false,
  source      text,
  created_at  timestamptz default now(),
  unique(venue_id, match_id)
);

-- ─── user_followed_teams ──────────────────────────────────────────
create table if not exists public.user_followed_teams (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  team_id     uuid references public.teams(id) on delete cascade,
  enabled     boolean default true,
  created_at  timestamptz default now(),
  unique(user_id, team_id)
);

-- ─── reminders ────────────────────────────────────────────────────
create table if not exists public.reminders (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade,
  match_id       uuid references public.matches(id) on delete cascade,
  enabled        boolean default true,
  reminder_time  timestamptz,
  created_at     timestamptz default now(),
  unique(user_id, match_id)
);

-- ─── push_subscriptions ───────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  endpoint    text not null,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz default now(),
  unique(user_id, endpoint)
);

-- ─── RLS (Row Level Security) ─────────────────────────────────────
alter table public.users enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.venues enable row level security;
alter table public.venue_matches enable row level security;
alter table public.user_followed_teams enable row level security;
alter table public.reminders enable row level security;
alter table public.push_subscriptions enable row level security;

-- Drop policies before recreating (idempotent)
do $$ begin
  drop policy if exists "public read teams" on public.teams;
  drop policy if exists "public read matches" on public.matches;
  drop policy if exists "public read venues" on public.venues;
  drop policy if exists "public read venue_matches" on public.venue_matches;
  drop policy if exists "users own data" on public.users;
  drop policy if exists "own followed teams" on public.user_followed_teams;
  drop policy if exists "own reminders" on public.reminders;
  drop policy if exists "own push_subscriptions" on public.push_subscriptions;
end $$;

-- Public read for teams, matches, venues, venue_matches
create policy "public read teams" on public.teams for select using (true);
create policy "public read matches" on public.matches for select using (true);
create policy "public read venues" on public.venues for select using (true);
create policy "public read venue_matches" on public.venue_matches for select using (true);

-- Users can only read/write their own data
create policy "users own data" on public.users
  for all using (auth.uid() = id);

create policy "own followed teams" on public.user_followed_teams
  for all using (auth.uid() = user_id);

create policy "own reminders" on public.reminders
  for all using (auth.uid() = user_id);

create policy "own push_subscriptions" on public.push_subscriptions
  for all using (auth.uid() = user_id);

-- ─── pg_cron: trigger send-reminders every 5 min ──────────────────
-- Run once in the SQL editor after enabling pg_cron extension:
--
-- create extension if not exists pg_cron;
-- select cron.schedule(
--   'bstv-send-reminders',
--   '*/5 * * * *',
--   $$
--     select net.http_post(
--       url := 'https://<project-ref>.supabase.co/functions/v1/send-reminders',
--       headers := '{"Authorization":"Bearer <anon-key>","Content-Type":"application/json"}',
--       body := '{}'
--     );
--   $$
-- );
--
-- Replace <project-ref> with your Supabase project ref
-- and <anon-key> with your anon public key.
