-- ═══════════════════════════════════════════════════════════════════════════════
-- CineMatch — Initial Schema
-- Tables: profiles, swipe_history
-- Design reference: Stitch CineMatch UI Kit (2026-06-02)
--   - swipe_history fields match Matches Vault screen (poster, title, vote_avg,
--     genre_ids, release_date, action)
--   - % Match displayed in UI = round(movie_vote_average * 10)
--   - Sort by Score / Latest / Genres → indexes on vote_average, swiped_at
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  username    text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on any row change
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger must live on auth.users — only runs server-side, never via REST
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Revoke public EXECUTE: handle_new_user must only fire via trigger
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- RLS
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using  ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select, insert, update on public.profiles to authenticated;

-- ── swipe_history ─────────────────────────────────────────────────────────────
-- Fields mapped from Stitch Matches Vault screen:
--   movie_poster_path    → card background image
--   movie_vote_average   → "% Match" badge (round(avg * 10))
--   movie_genre_ids      → "Sort by Genres" filter + era filtering
--   movie_release_date   → era filter (Newest / 90s Cinema / Golden Age)
--   UNIQUE(user_id, movie_id) → prevents duplicate swipes per user

create table if not exists public.swipe_history (
  id                  uuid         primary key default gen_random_uuid(),
  user_id             uuid         not null references auth.users(id) on delete cascade,
  movie_id            integer      not null,
  movie_title         text         not null,
  movie_poster_path   text,
  movie_vote_average  numeric(3,1) not null default 0,
  movie_release_date  text,
  movie_genre_ids     integer[]    not null default '{}',
  action              text         not null check (action in ('like', 'dislike')),
  swiped_at           timestamptz  not null default now(),

  constraint swipe_history_unique unique (user_id, movie_id)
);

-- Indexes for the 3 sort modes shown in Stitch Matches Vault
create index if not exists swipe_history_user_score
  on public.swipe_history (user_id, movie_vote_average desc);

create index if not exists swipe_history_user_latest
  on public.swipe_history (user_id, swiped_at desc);

create index if not exists swipe_history_user_action
  on public.swipe_history (user_id, action);

-- RLS
alter table public.swipe_history enable row level security;

create policy "swipe_history_select_own"
  on public.swipe_history for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "swipe_history_insert_own"
  on public.swipe_history for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "swipe_history_update_own"
  on public.swipe_history for update
  to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "swipe_history_delete_own"
  on public.swipe_history for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.swipe_history to authenticated;
