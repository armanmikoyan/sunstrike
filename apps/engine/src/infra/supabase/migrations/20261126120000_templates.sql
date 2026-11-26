-- Curated templates owned by the templates module. Each one starts from a
-- shared source asset (a media_assets row without an owner) and declares what a
-- user may change before generating: input roles and the allowed resolutions,
-- clip lengths and aspect ratios. A source cannot be deleted while a template
-- uses it. Only active templates are served. RLS is enabled without public
-- policies; the engine owns all reads and writes.
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  source_asset_id uuid not null references public.media_assets (id) on delete restrict,
  name text not null,
  customization_options jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists templates_active_created_idx
  on public.templates (active, created_at desc, id desc);

alter table public.templates enable row level security;
