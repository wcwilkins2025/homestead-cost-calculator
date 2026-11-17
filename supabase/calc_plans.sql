-- Homestead Cost Calculator: saved plans.
-- Runs in the same Supabase project as Groundwork (one sign-in for both).
-- Groundwork's public.plans (one row per person) is not touched.
-- Each person can keep several named sets of calculator inputs. Safe to run more than once.

create table if not exists public.calc_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 80),
  inputs     jsonb not null default '{}'::jsonb check (pg_column_size(inputs) < 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calc_plans_user_idx on public.calc_plans (user_id, updated_at desc);

alter table public.calc_plans enable row level security;

-- signed-in people may use the table; the policies narrow that to their own rows. Visitors who are not signed in get nothing.
grant select, insert, update, delete on public.calc_plans to authenticated;
revoke all on public.calc_plans from anon;

drop policy if exists "read own calculator plans"   on public.calc_plans;
drop policy if exists "add own calculator plans"    on public.calc_plans;
drop policy if exists "change own calculator plans" on public.calc_plans;
drop policy if exists "remove own calculator plans" on public.calc_plans;

create policy "read own calculator plans"   on public.calc_plans for select using (auth.uid() = user_id);
create policy "add own calculator plans"    on public.calc_plans for insert with check (auth.uid() = user_id);
create policy "change own calculator plans" on public.calc_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "remove own calculator plans" on public.calc_plans for delete using (auth.uid() = user_id);

-- no more than 50 saved plans per person
create or replace function public.calc_plans_limit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.calc_plans where user_id = new.user_id) >= 50 then
    raise exception 'You can keep up to 50 saved plans. Delete one to save another.';
  end if;
  return new;
end $$;
drop trigger if exists calc_plans_limit on public.calc_plans;
create trigger calc_plans_limit before insert on public.calc_plans for each row execute function public.calc_plans_limit();

create or replace function public.calc_plans_touch() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists calc_plans_touch on public.calc_plans;
create trigger calc_plans_touch before update on public.calc_plans for each row execute function public.calc_plans_touch();
