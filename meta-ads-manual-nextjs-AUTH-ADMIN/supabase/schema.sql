-- Run this entire file once in Supabase -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  access_status text not null default 'pending'
    check (access_status in ('pending', 'approved', 'revoked', 'blocked')),
  access_expires_at timestamptz null,
  approved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "users_read_own_profile" on public.profiles;
create policy "users_read_own_profile"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "admins_read_all_profiles" on public.profiles;
create policy "admins_read_all_profiles"
on public.profiles
for select
using (public.is_admin());

drop policy if exists "admins_update_profiles" on public.profiles;
create policy "admins_update_profiles"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

-- Optional: update timestamp trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- IMPORTANT:
-- After YOU create your own account, make it admin using:
--
-- update public.profiles
-- set role = 'admin',
--     access_status = 'approved',
--     access_expires_at = null,
--     approved_at = now()
-- where email = 'YOUR_ADMIN_EMAIL@example.com';
-- Vercel deployment trigger
