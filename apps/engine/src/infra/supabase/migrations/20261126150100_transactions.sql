-- The balance ledger owned by the billing module. Rows are only ever added;
-- the balance is derived from them. amount_micros is always positive (USD
-- micros) and the type says how it moves money:
--   top_up, refund, release  add to the available balance
--   reserve                  moves available into reserved
--   capture                  spends a reservation
--   release                  returns a reservation to available
-- idempotency_key makes every write happen once: `reserve:<generation>` holds
-- a generation's price once, and `settle:<generation>` is shared by capture
-- and release, so a generation is settled once and never both ways. RLS is
-- enabled without public policies; the engine owns all reads and writes.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  generation_id uuid references public.generations (id) on delete set null,
  type text not null check (type in ('top_up', 'reserve', 'capture', 'release', 'refund')),
  amount_micros bigint not null check (amount_micros > 0),
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_created_idx
  on public.transactions (user_id, created_at desc, id desc);

alter table public.transactions enable row level security;
