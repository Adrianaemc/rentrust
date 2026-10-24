-- Ejecutar en Supabase > SQL Editor (una sola vez).
create table if not exists public.properties (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (length(trim(title)) > 2),
 description text not null,
 type text not null check (type in ('apartment','house','villa','cabin','condo')),
 price numeric(12,2) not null check (price > 0),
 city text not null, country text not null, address text not null,
 bedrooms integer not null default 0 check (bedrooms >= 0),
 bathrooms integer not null default 0 check (bathrooms >= 0),
 guests integer not null default 1 check (guests > 0),
 amenities text[] not null default '{}',
 images text[] not null default '{}',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists properties_owner_idx on public.properties(owner_id);
alter table public.properties enable row level security;
drop policy if exists "Properties public read" on public.properties;
create policy "Properties public read" on public.properties for select using (true);
drop policy if exists "Properties owner insert" on public.properties;
create policy "Properties owner insert" on public.properties for insert to authenticated with check (auth.uid() = owner_id);
drop policy if exists "Properties owner update" on public.properties;
create policy "Properties owner update" on public.properties for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "Properties owner delete" on public.properties;
create policy "Properties owner delete" on public.properties for delete to authenticated using (auth.uid() = owner_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values ('property-images','property-images',true,10485760,array['image/jpeg','image/png','image/webp'])
 on conflict (id) do nothing;
drop policy if exists "Property images public read" on storage.objects;
create policy "Property images public read" on storage.objects for select using (bucket_id='property-images');
drop policy if exists "Property images owner upload" on storage.objects;
create policy "Property images owner upload" on storage.objects for insert to authenticated
 with check (bucket_id='property-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Property images owner delete" on storage.objects;
create policy "Property images owner delete" on storage.objects for delete to authenticated
 using (bucket_id='property-images' and (storage.foldername(name))[1] = auth.uid()::text);
