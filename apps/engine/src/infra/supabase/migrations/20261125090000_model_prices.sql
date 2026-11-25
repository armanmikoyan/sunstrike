-- Selling prices owned by the pricing module: one row per catalog model.
-- unit_price_micros is the price per second (video) or per image, in USD
-- micros. pricing_rules holds volume tiers, setting multipliers and a
-- percentage discount. RLS is enabled without public policies; the engine owns
-- all reads and writes.
create table if not exists public.model_prices (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null unique references public.generation_models (id) on delete cascade,
  unit_price_micros bigint not null check (unit_price_micros >= 0),
  pricing_rules jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.model_prices enable row level security;

insert into public.model_prices (model_id, unit_price_micros, pricing_rules)
select models.id, prices.unit_price_micros, prices.pricing_rules::jsonb
from (
  values
    ('chronolab-motion-2', 85000, '{}'),
    ('seedance', 90000, '{}'),
    ('chronolab-motion-turbo', 85000, '{}'),
    ('chronolab-camera', 100000, '{}'),
    ('chronolab-loop', 72000, '{}'),
    (
      'chronolab-image-2',
      70000,
      '{"tiers": [{"min_quantity": 10, "unit_price_micros": 60000}, {"min_quantity": 50, "unit_price_micros": 50000}]}'
    ),
    ('chronolab-image-pro', 120000, '{}'),
    ('chronolab-image-raw', 170000, '{}'),
    ('chronolab-product', 100000, '{}')
) as prices (slug, unit_price_micros, pricing_rules)
join public.generation_models as models on models.slug = prices.slug
on conflict (model_id) do nothing;
