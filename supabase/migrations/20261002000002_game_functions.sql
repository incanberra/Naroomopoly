-- ==============================================================================
-- Naroom-opoly Authoritative Game Functions Migration
-- ==============================================================================

-- Helper function to generate random 5-letter code
create or replace function public.generate_game_code()
returns text as $$
declare
    chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result text := '';
    i int;
begin
    for i in 1..5 loop
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;
    return result;
end;
$$ language plpgsql volatile;

-- 1. Create Game
create or replace function public.create_game(
    p_host_name text,
    p_token text,
    p_settings jsonb default '{"startingCash": 1500, "freeParkingJackpot": false, "afkTimerSeconds": 0, "maxPlayers": 6}'::jsonb
)
returns jsonb as $$
declare
    v_user_id uuid := auth.uid();
    v_game_id uuid;
    v_player_id uuid;
    v_code text;
    v_tries int := 0;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    -- Generate unique 5-letter code
    loop
        v_code := public.generate_game_code();
        exit when not exists (select 1 from public.games where code = v_code);
        v_tries := v_tries + 1;
        if v_tries > 20 then
            raise exception 'Could not generate unique game code';
        end if;
    end loop;

    -- Create game
    insert into public.games (code, host_user_id, status, settings)
    values (v_code, v_user_id, 'lobby', p_settings)
    returning id into v_game_id;

    -- Create host player
    insert into public.players (game_id, user_id, name, token, seat_index, is_host)
    values (v_game_id, v_user_id, p_host_name, p_token, 0, true)
    returning id into v_player_id;

    -- Initialize lobby state
    insert into public.game_states (game_id, phase, state_data)
    values (v_game_id, 'lobby', jsonb_build_object('code', v_code));

    -- Log event
    insert into public.game_events (game_id, player_id, event_type, message)
    values (v_game_id, v_player_id, 'GAME_CREATED', p_host_name || ' created the lobby with code ' || v_code);

    return jsonb_build_object(
        'game_id', v_game_id,
        'code', v_code,
        'player_id', v_player_id
    );
end;
$$ language plpgsql security definer;

-- 2. Join Game
create or replace function public.join_game(
    p_code text,
    p_name text,
    p_token text
)
returns jsonb as $$
declare
    v_user_id uuid := auth.uid();
    v_game record;
    v_player_id uuid;
    v_next_seat int;
    v_existing_player record;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    -- Find game by uppercase code
    select * into v_game from public.games where upper(code) = upper(p_code);
    if not found then
        raise exception 'Game with code % not found', p_code;
    end if;

    -- Check if user is already seated in this game (rejoining session)
    select * into v_existing_player from public.players where game_id = v_game.id and user_id = v_user_id;
    if found then
        update public.players
        set is_connected = true, last_seen = now()
        where id = v_existing_player.id;

        return jsonb_build_object(
            'game_id', v_game.id,
            'player_id', v_existing_player.id,
            'rejoined', true
        );
    end if;

    if v_game.status <> 'lobby' then
        raise exception 'Game has already started';
    end if;

    -- Check if token is already taken
    if exists (select 1 from public.players where game_id = v_game.id and token = p_token) then
        raise exception 'Token % is already taken by another player', p_token;
    end if;

    -- Check max players
    select count(*) into v_next_seat from public.players where game_id = v_game.id;
    if v_next_seat >= coalesce((v_game.settings->>'maxPlayers')::int, 6) then
        raise exception 'Game lobby is full';
    end if;

    -- Add player
    insert into public.players (game_id, user_id, name, token, seat_index, is_host)
    values (v_game.id, v_user_id, p_name, p_token, v_next_seat, false)
    returning id into v_player_id;

    -- Log join event
    insert into public.game_events (game_id, player_id, event_type, message)
    values (v_game.id, v_player_id, 'PLAYER_JOINED', p_name || ' joined the game as ' || p_token);

    return jsonb_build_object(
        'game_id', v_game.id,
        'player_id', v_player_id,
        'rejoined', false
    );
end;
$$ language plpgsql security definer;

-- 3. Start Game
create or replace function public.start_game(
    p_game_id uuid,
    p_initial_state jsonb
)
returns jsonb as $$
declare
    v_user_id uuid := auth.uid();
    v_game record;
begin
    select * into v_game from public.games where id = p_game_id;
    if not found then
        raise exception 'Game not found';
    end if;

    if v_game.host_user_id <> v_user_id then
        raise exception 'Only the host can start the game';
    end if;

    update public.games
    set status = 'playing', updated_at = now()
    where id = p_game_id;

    update public.game_states
    set phase = 'turn_start',
        version = version + 1,
        state_data = p_initial_state,
        updated_at = now()
    where game_id = p_game_id;

    insert into public.game_events (game_id, event_type, message)
    values (p_game_id, 'GAME_STARTED', 'Naroom-opoly game started! Good luck players.');

    return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer;

-- 4. Server-Authoritative Game Action
create or replace function public.game_action(
    p_game_id uuid,
    p_action_type text,
    p_new_state jsonb,
    p_events jsonb
)
returns jsonb as $$
declare
    v_user_id uuid := auth.uid();
    v_player record;
    v_event jsonb;
begin
    -- Verify player is in this game
    select * into v_player from public.players where game_id = p_game_id and user_id = v_user_id;
    if not found then
        raise exception 'Unauthorized: player not in game';
    end if;

    -- Update game state
    update public.game_states
    set version = version + 1,
        phase = coalesce(p_new_state->>'phase', 'turn_start'),
        current_player_index = coalesce((p_new_state->>'currentTurnPlayerIndex')::int, 0),
        state_data = p_new_state,
        updated_at = now()
    where game_id = p_game_id;

    -- Log events
    if p_events is not null and jsonb_array_length(p_events) > 0 then
        for v_event in select * from jsonb_array_elements(p_events)
        loop
            insert into public.game_events (game_id, player_id, event_type, message, payload)
            values (
                p_game_id,
                v_player.id,
                coalesce(v_event->>'type', 'ACTION'),
                coalesce(v_event->>'message', 'Action performed'),
                coalesce(v_event->'payload', '{}'::jsonb)
            );
        end loop;
    end if;

    -- Check if game finished
    if (p_new_state->>'phase') = 'game_over' then
        update public.games set status = 'finished', updated_at = now() where id = p_game_id;
    end if;

    return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer;

-- 5. Kick Player
create or replace function public.kick_player(
    p_game_id uuid,
    p_target_player_id uuid,
    p_new_state jsonb
)
returns jsonb as $$
declare
    v_user_id uuid := auth.uid();
    v_game record;
    v_target record;
begin
    select * into v_game from public.games where id = p_game_id;
    if not found then raise exception 'Game not found'; end if;

    if v_game.host_user_id <> v_user_id then
        raise exception 'Only the host can kick players';
    end if;

    select * into v_target from public.players where id = p_target_player_id and game_id = p_game_id;
    if not found then raise exception 'Target player not found'; end if;

    -- Mark player as disconnected / removed
    update public.players set is_connected = false where id = p_target_player_id;

    -- Update state
    update public.game_states
    set version = version + 1,
        state_data = p_new_state,
        updated_at = now()
    where game_id = p_game_id;

    insert into public.game_events (game_id, player_id, event_type, message)
    values (p_game_id, p_target_player_id, 'PLAYER_KICKED', v_target.name || ' was kicked by the host');

    return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer;

-- 6. Cleanup Stale Abandoned Games
create or replace function public.cleanup_old_games(
    p_days_old int default 7
)
returns int as $$
declare
    v_count int;
begin
    with deleted as (
        delete from public.games
        where updated_at < now() - (p_days_old || ' days')::interval
        returning *
    )
    select count(*) into v_count from deleted;
    return v_count;
end;
$$ language plpgsql security definer;
