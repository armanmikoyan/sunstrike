-- Profiles owned by the Users module. The primary key is the Supabase Auth
-- user id, so a profile always points at a real signed-in account.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

-- Identity module mapping: an authenticated subject resolves to an application
-- user. Today the subject is the Supabase Auth id; later API tokens can reuse
-- the same mapping without changing callers.
create table if not exists public.identities (
  id uuid primary key default gen_random_uuid(),
  auth_subject text not null unique,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists identities_user_id_idx on public.identities (user_id);

alter table public.users enable row level security;
alter table public.identities enable row level security;

drop policy if exists "users read own" on public.users;
create policy "users read own" on public.users for select using (auth.uid() = id);

drop policy if exists "users update own" on public.users;
create policy "users update own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "identities read own" on public.identities;
create policy "identities read own" on public.identities
  for select using (auth.uid() = user_id);
