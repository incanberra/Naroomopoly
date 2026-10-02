-- ==============================================================================
-- Naroom-opoly Initial Schema Migration
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Games Table
create table if not exists public.games (
    id uuid primary key default gen_random_uuid(),
    code varchar(5) not null unique,
    host_user_id uuid not null default auth.uid(),
    status varchar(20) not null default 'lobby' check (status in ('lobby', 'playing', 'finished')),
    settings jsonb not null default '{"startingCash": 1500, "freeParkingJackpot": false, "afkTimerSeconds": 0, "maxPlayers": 6}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index for fast lookup by join code
create index if not exists idx_games_code on public.games(code);
create index if not exists idx_games_updated_at on public.games(updated_at);

-- 2. Players Table
create table if not exists public.players (
    id uuid primary key default gen_random_uuid(),
    game_id uuid not null references public.games(id) on delete cascade,
    user_id uuid not null default auth.uid(),
    name varchar(50) not null,
    token varchar(30) not null,
    seat_index integer not null default 0,
    is_host boolean not null default false,
    is_bot boolean not null default false,
    is_connected boolean not null default true,
    last_seen timestamptz not null default now(),
    created_at timestamptz not null default now(),
    unique(game_id, token),
    unique(game_id, seat_index)
);

create index if not exists idx_players_game_id on public.players(game_id);
create index if not exists idx_players_user_id on public.players(user_id);

-- 3. Game States Table (Authoritative state snapshot)
create table if not exists public.game_states (
    game_id uuid primary key references public.games(id) on delete cascade,
    version integer not null default 1,
    current_player_index integer not null default 0,
    phase varchar(30) not null default 'lobby',
    dice integer[] not null default '{1, 1}',
    consecutive_doubles integer not null default 0,
    state_data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

-- 4. Game Events Table (Log of rolls, buys, rents, cards, trades)
create table if not exists public.game_events (
    id bigserial primary key,
    game_id uuid not null references public.games(id) on delete cascade,
    player_id uuid references public.players(id) on delete set null,
    event_type varchar(50) not null,
    message text not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_game_events_game_id on public.game_events(game_id);
create index if not exists idx_game_events_created_at on public.game_events(created_at);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================

alter table public.games enable row level security;
alter table public.players enable row level security;
alter table public.game_states enable row level security;
alter table public.game_events enable row level security;

-- Policies for Games
create policy "Allow anyone to read games"
    on public.games for select
    using (true);

create policy "Allow authenticated/anon to create games"
    on public.games for insert
    with check (auth.uid() is not null);

create policy "Allow host to update game status"
    on public.games for update
    using (auth.uid() = host_user_id);

-- Policies for Players
create policy "Allow anyone in game to read players"
    on public.players for select
    using (true);

create policy "Allow players to insert themselves"
    on public.players for insert
    with check (auth.uid() = user_id);

create policy "Allow players to update their own heartbeat"
    on public.players for update
    using (auth.uid() = user_id);

-- Policies for Game States
create policy "Allow anyone to view game states"
    on public.game_states for select
    using (true);

-- Policies for Game Events
create policy "Allow anyone in game to read events"
    on public.game_events for select
    using (true);

-- Enable Supabase Realtime for live multiplayer sync
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.game_states;
alter publication supabase_realtime add table public.game_events;
