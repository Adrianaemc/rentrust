-- ETAPA 3: Favoritos persistentes. Ejecutar DESPUÉS de SUPABASE_ETAPA2.sql.
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);
create index if not exists favorites_property_idx on public.favorites(property_id);
alter table public.favorites enable row level security;
drop policy if exists "Favorites own read" on public.favorites;
create policy "Favorites own read" on public.favorites for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Favorites own insert" on public.favorites;
create policy "Favorites own insert" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Favorites own delete" on public.favorites;
create policy "Favorites own delete" on public.favorites for delete to authenticated using (auth.uid() = user_id);
