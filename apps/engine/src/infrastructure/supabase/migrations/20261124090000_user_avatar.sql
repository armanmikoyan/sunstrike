-- The avatar shown in the app. It is sticky: the first identity that supplies
-- one wins, so signing in with a second provider never replaces the face the
-- person has been seeing. Email codes supply none, which leaves the column
-- null until a provider fills it.
alter table public.users add column if not exists avatar_url text;
