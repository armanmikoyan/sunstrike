-- User-facing updates owned by the notifications module: one row per terminal
-- generation outcome. user_id lets the module list a user's updates without
-- reading another module's table; (generation_id, type) makes a repeated
-- outcome event a no-op. RLS is enabled without public policies; the engine
-- owns all reads and writes.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  generation_id uuid not null references public.generations (id) on delete cascade,
  type text not null check (type in ('generation_succeeded', 'generation_failed')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (generation_id, type)
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc, id desc);

alter table public.notifications enable row level security;
