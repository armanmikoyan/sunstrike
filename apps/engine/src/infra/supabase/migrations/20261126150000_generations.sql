-- Generations owned by the generation module. One row is both the user's
-- request and its job: the worker claims due rows with a lease, and a lease
-- that expires (a worker died mid-job) makes the row claimable again.
--
-- run_after stays null until billing has reserved the quoted amount, so the
-- worker never runs an unpaid job. quote is the accepted price snapshot and is
-- never recalculated. (user_id, idempotency_key) makes a retried request return
-- the first generation instead of charging twice. RLS is enabled without public
-- policies; the engine owns all reads and writes.
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  idempotency_key text not null,
  kind text not null check (kind in ('create', 'edit')),
  prompt text,
  template_id uuid references public.templates (id) on delete set null,
  model_id uuid not null references public.generation_models (id) on delete restrict,
  settings jsonb not null,
  inputs jsonb not null default '[]'::jsonb,
  quote jsonb not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed')),
  failure_code text,
  output_asset_id uuid unique references public.media_assets (id) on delete set null,
  attempts int not null default 0,
  run_after timestamptz,
  lease_expires_at timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, idempotency_key)
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc, id desc);

create index if not exists generations_due_idx
  on public.generations (run_after, lease_expires_at)
  where status in ('queued', 'running');

alter table public.generations enable row level security;
