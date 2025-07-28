-- Tabelle erstellen
create table game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  topic text
);

-- RLS aktivieren
alter table game_sessions enable row level security;

-- Nur Besitzer der Session dürfen lesen
create policy "Users can read their own game_sessions"
on game_sessions for select
using (auth.uid() = user_id);

-- Nur Besitzer der Session dürfen schreiben
create policy "Users can insert their own game_sessions"
on game_sessions for insert
with check (auth.uid() = user_id);
