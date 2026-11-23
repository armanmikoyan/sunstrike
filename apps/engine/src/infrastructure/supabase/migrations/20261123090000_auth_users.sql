-- Application profiles, keyed by the Supabase Auth user id. A profile always
-- points at a real signed-in account and is removed together with it.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "users read own" on public.users;
create policy "users read own" on public.users for select using (auth.uid() = id);

drop policy if exists "users update own" on public.users;
create policy "users update own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);
