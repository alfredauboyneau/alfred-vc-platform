-- ============================================================
-- HARDENING SUPABASE — Alfred
-- À exécuter dans Supabase SQL Editor sur la base existante
-- ============================================================

alter table if exists public.venture_capitals
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_startups_user_id on public.startups(user_id);
create index if not exists idx_venture_capitals_user_id on public.venture_capitals(user_id);

alter table public.startups enable row level security;
alter table public.venture_capitals enable row level security;
alter table public.matches enable row level security;

drop policy if exists "startups_select_own" on public.startups;
drop policy if exists "startups_insert_own" on public.startups;
drop policy if exists "startups_update_own" on public.startups;
drop policy if exists "startups_delete_own" on public.startups;

create policy "startups_select_own"
  on public.startups for select
  to authenticated
  using (auth.uid() = user_id);

create policy "startups_insert_own"
  on public.startups for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "startups_update_own"
  on public.startups for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "startups_delete_own"
  on public.startups for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "venture_capitals_select_authenticated" on public.venture_capitals;
drop policy if exists "venture_capitals_insert_own" on public.venture_capitals;
drop policy if exists "venture_capitals_update_own" on public.venture_capitals;
drop policy if exists "venture_capitals_delete_own" on public.venture_capitals;

create policy "venture_capitals_select_authenticated"
  on public.venture_capitals for select
  to authenticated
  using (true);

create policy "venture_capitals_insert_own"
  on public.venture_capitals for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "venture_capitals_update_own"
  on public.venture_capitals for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "venture_capitals_delete_own"
  on public.venture_capitals for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "matches_select_for_startup_owner" on public.matches;
drop policy if exists "matches_select_for_vc_owner" on public.matches;
drop policy if exists "matches_insert_for_startup_owner" on public.matches;
drop policy if exists "matches_delete_for_startup_owner" on public.matches;
drop policy if exists "matches_update_for_vc_owner" on public.matches;

create policy "matches_select_for_startup_owner"
  on public.matches for select
  to authenticated
  using (
    exists (
      select 1
      from public.startups s
      where s.id = matches.startup_id
        and s.user_id = auth.uid()
    )
  );

create policy "matches_select_for_vc_owner"
  on public.matches for select
  to authenticated
  using (
    exists (
      select 1
      from public.venture_capitals v
      where v.id = matches.vc_id
        and v.user_id = auth.uid()
    )
  );

create policy "matches_insert_for_startup_owner"
  on public.matches for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.startups s
      where s.id = matches.startup_id
        and s.user_id = auth.uid()
    )
  );

create policy "matches_delete_for_startup_owner"
  on public.matches for delete
  to authenticated
  using (
    exists (
      select 1
      from public.startups s
      where s.id = matches.startup_id
        and s.user_id = auth.uid()
    )
  );

create policy "matches_update_for_vc_owner"
  on public.matches for update
  to authenticated
  using (
    exists (
      select 1
      from public.venture_capitals v
      where v.id = matches.vc_id
        and v.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.venture_capitals v
      where v.id = matches.vc_id
        and v.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('pitch-decks', 'pitch-decks', false)
on conflict (id) do update set public = false;

drop policy if exists "pitch_decks_insert_own" on storage.objects;
drop policy if exists "pitch_decks_select_own" on storage.objects;
drop policy if exists "pitch_decks_delete_own" on storage.objects;

create policy "pitch_decks_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "pitch_decks_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "pitch_decks_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pitch-decks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Important:
-- 1. Exécuter ce script dans Supabase SQL Editor.
-- 2. Vérifier que le bucket "pitch-decks" est bien privé dans le dashboard.
-- 3. Si des pitch decks sensibles ont déjà été uploadés en public, les supprimer ou les réuploader.
