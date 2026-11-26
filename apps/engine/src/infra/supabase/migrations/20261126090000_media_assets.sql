-- Media assets owned by the media module: uploads, references and generated
-- outputs. owner_user_id is null for shared assets such as template sources.
-- An upload stays pending (completed_at null) until the engine has checked the
-- stored object's size and type. RLS is enabled without public policies; the
-- engine owns all reads and writes.
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.users (id) on delete cascade,
  kind text not null check (kind in ('image', 'video', 'audio')),
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  storage_key text not null unique,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists media_assets_owner_created_idx
  on public.media_assets (owner_user_id, created_at desc);

alter table public.media_assets enable row level security;

-- A private bucket: nothing is public, every read is a short-lived signed URL.
-- Storage itself rejects a file above 50 MB or of a type outside this list; the
-- media module's constants hold the same list and the per-kind limits.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  false,
  52428800,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/mp4'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
