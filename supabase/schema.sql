-- OneCompilerHub Step 4: Authentication & User Profiles Schema
-- Supabase PostgreSQL Migration

-- 1. Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Add username constraint validation (lowercase alphanumeric + underscores/hyphens, 3-24 chars)
alter table public.profiles 
  drop constraint if exists username_format_check;

alter table public.profiles 
  add constraint username_format_check 
  check (username is null or (username ~ '^[a-z0-9_-]{3,24}$'));

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 4. RLS Policies:
-- Drop existing policies to allow re-running migrations safely
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Users can read only their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. Trigger to automatically provision a profile row when a new user registers in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
begin
  raw_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    raw_name,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Trigger for updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- 7. Indexes for performance
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

-- 8. Storage bucket setup for avatars (optional avatar upload)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
