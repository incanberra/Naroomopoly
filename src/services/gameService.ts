import { supabase, isSupabaseConfigured, ensureAuthUser } from './supabase';
import {
  GameState,
  GameAction,
  GameEvent,
  GameSettings,
  PlayerState,
  DEFAULT_SETTINGS,
} from '../engine/types';
import {
  createInitialGameState,
  executeGameAction,
  getCurrentPlayer,
} from '../engine/rules';
import { getBotAction } from '../engine/bot';
import { audio } from './audioService';

export interface GameSession {
  gameId: string;
  code: string;
  playerId: string;
  isHost: boolean;
  isOnline: boolean;
}

type StateListener = (state: GameState) => void;
type EventListener = (event: GameEvent) => void;

class GameService {
  private localState: GameState | null = null;
  private currentSession: GameSession | null = null;
  private stateListeners: Set<StateListener> = new Set();
  private eventListeners: Set<EventListener> = new Set();
  private realtimeChannel: any = null;
  private botTimer: any = null;

  constructor() {
    // Try restoring saved session
    const saved = localStorage.getItem('naroomopoly_active_session');
    if (saved) {
      try {
        this.currentSession = JSON.parse(saved);
        const savedState = localStorage.getItem(`naroomopoly_state_${this.currentSession?.gameId}`);
        if (savedState) {
          this.localState = JSON.parse(savedState);
        }
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
  }

  public getSession(): GameSession | null {
    return this.currentSession;
  }

  public getLocalState(): GameState | null {
    return this.localState;
  }

  public subscribe(onState: StateListener, onEvent: EventListener) {
    this.stateListeners.add(onState);
    this.eventListeners.add(onEvent);
    if (this.localState) {
      onState(this.localState);
    }
    return () => {
      this.stateListeners.delete(onState);
      this.eventListeners.delete(onEvent);
    };
  }

  private notifyState(state: GameState) {
    this.localState = state;
    if (this.currentSession?.gameId) {
      localStorage.setItem(`naroomopoly_state_${this.currentSession.gameId}`, JSON.stringify(state));
    }
    this.stateListeners.forEach((fn) => fn(state));

    // Handle automated bot turn if in local/hybrid mode
    this.triggerBotTurnIfNeeded(state);
  }

  private notifyEvent(event: GameEvent) {
    // Play sound effects based on event type
    switch (event.type) {
      case 'DICE_ROLLED':
        audio.playDiceRoll();
        break;
      case 'PROPERTY_BOUGHT':
      case 'AUCTION_WON':
        audio.playBuy();
        break;
      case 'RENT_PAID':
      case 'PASSED_GO':
      case 'JACKPOT_WON':
        audio.playCash();
        break;
      case 'SENT_TO_JAIL':
        audio.playJail();
        break;
      case 'CARD_DRAWN':
        audio.playCard();
        break;
      case 'GAME_OVER':
        audio.playVictory();
        break;
    }

    this.eventListeners.forEach((fn) => fn(event));
  }

  /**
   * Create a new game lobby
   */
  public async createGame(
    hostName: string,
    token: string,
    settings: Partial<GameSettings> = {},
    mode: 'online' | 'local' | 'bots' = isSupabaseConfigured ? 'online' : 'local'
  ): Promise<GameSession> {
    const finalSettings = { ...DEFAULT_SETTINGS, ...settings };
    const userId = await ensureAuthUser();

    if (mode === 'online' && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('create_game', {
          p_host_name: hostName,
          p_token: token,
          p_settings: finalSettings,
        });

        if (error) throw error;

        const session: GameSession = {
          gameId: data.game_id,
          code: data.code,
          playerId: data.player_id,
          isHost: true,
          isOnline: true,
        };

        this.saveSession(session);
        this.setupRealtime(session.gameId);
        return session;
      } catch (err) {
        console.warn('Supabase create_game failed, falling back to local engine:', err);
      }
    }

    // Local / Bots Mode
    const gameId = 'game-' + Math.random().toString(36).substring(2, 9);
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const hostPlayerId = 'player-host-' + userId.substring(0, 6);

    const playerConfigs: Array<{ id: string; name: string; token: string; isBot?: boolean; isHost?: boolean }> = [
      { id: hostPlayerId, name: hostName, token, isHost: true },
    ];

    if (mode === 'bots') {
      const botPool = [
        { name: 'Kangaroo Keith', token: 'kangaroo' },
        { name: 'Penny Pelican', token: 'pelican' },
        { name: 'Willy Whale', token: 'whale' },
      ].filter((b) => b.token !== token);

      botPool.slice(0, 3).forEach((b, i) => {
        playerConfigs.push({
          id: `bot-${i + 1}`,
          name: b.name,
          token: b.token,
          isBot: true,
        });
      });
    }

    const initial = createInitialGameState(gameId, code, playerConfigs, finalSettings);
    initial.phase = 'lobby';

    const session: GameSession = {
      gameId,
      code,
      playerId: hostPlayerId,
      isHost: true,
      isOnline: false,
    };

    this.saveSession(session);
    this.notifyState(initial);
    return session;
  }

  /**
   * Join an existing game
   */
  public async joinGame(code: string, playerName: string, token: string): Promise<GameSession> {
    const cleanCode = code.trim().toUpperCase();
    const userId = await ensureAuthUser();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('join_game', {
          p_code: cleanCode,
          p_name: playerName,
          p_token: token,
        });

        if (error) throw error;

        const session: GameSession = {
          gameId: data.game_id,
          code: cleanCode,
          playerId: data.player_id,
          isHost: false,
          isOnline: true,
        };

        this.saveSession(session);
        this.setupRealtime(session.gameId);
        return session;
      } catch (err) {
        console.warn('Supabase join_game failed:', err);
        throw err;
      }
    }

    // Local join check
    if (this.localState && this.localState.code.toUpperCase() === cleanCode) {
      if (this.localState.players.some((p) => p.token === token)) {
        throw new Error('This token has already been taken.');
      }
      const newPlayerId = 'player-' + Math.random().toString(36).substring(2, 7);
      const newPlayer: PlayerState = {
        id: newPlayerId,
        name: playerName,
        token,
        seatIndex: this.localState.players.length,
        cash: this.localState.settings.startingCash,
        position: 0,
        inJail: false,
        jailTurns: 0,
        jailCardsNotice: 0,
        jailCardsKnowledge: 0,
        isBankrupt: false,
        isBot: false,
        isHost: false,
        color: '#4ADE80',
      };

      const next = { ...this.localState, players: [...this.localState.players, newPlayer] };
      const session: GameSession = {
        gameId: next.id,
        code: cleanCode,
        playerId: newPlayerId,
        isHost: false,
        isOnline: false,
      };

      this.saveSession(session);
      this.notifyState(next);
      return session;
    }

    throw new Error(`Game with code "${cleanCode}" not found.`);
  }

  /**
   * Add a bot to the lobby (Host only)
   */
  public addBot(name: string, token: string) {
    if (!this.localState || this.localState.phase !== 'lobby') return;
    if (this.localState.players.length >= this.localState.settings.maxPlayers) return;
    if (this.localState.players.some((p) => p.token === token)) return;

    const botId = 'bot-' + Math.random().toString(36).substring(2, 7);
    const newBot: PlayerState = {
      id: botId,
      name,
      token,
      seatIndex: this.localState.players.length,
      cash: this.localState.settings.startingCash,
      position: 0,
      inJail: false,
      jailTurns: 0,
      jailCardsNotice: 0,
      jailCardsKnowledge: 0,
      isBankrupt: false,
      isBot: true,
      isHost: false,
      color: '#FB923C',
    };

    const next = {
      ...this.localState,
      players: [...this.localState.players, newBot],
    };
    this.notifyState(next);
  }

  /**
   * Remove a player from the lobby
   */
  public removePlayer(playerId: string) {
    if (!this.localState || this.localState.phase !== 'lobby') return;
    const nextPlayers = this.localState.players.filter((p) => p.id !== playerId);
    const next = {
      ...this.localState,
      players: nextPlayers.map((p, idx) => ({ ...p, seatIndex: idx })),
    };
    this.notifyState(next);
  }

  /**
   * Start Game
   */
  public async startGame() {
    if (!this.localState) return;

    if (this.currentSession?.isOnline && supabase) {
      const initial = createInitialGameState(
        this.localState.id,
        this.localState.code,
        this.localState.players.map((p) => ({
          id: p.id,
          name: p.name,
          token: p.token,
          isBot: p.isBot,
          isHost: p.isHost,
        })),
        this.localState.settings
      );
      initial.phase = 'turn_start';

      const { error } = await supabase.rpc('start_game', {
        p_game_id: this.currentSession.gameId,
        p_initial_state: initial,
      });

      if (error) {
        console.error('Failed to start online game', error);
        throw error;
      }
      return;
    }

    // Local start
    const initial = createInitialGameState(
      this.localState.id,
      this.localState.code,
      this.localState.players.map((p) => ({
        id: p.id,
        name: p.name,
        token: p.token,
        isBot: p.isBot,
        isHost: p.isHost,
      })),
      this.localState.settings
    );
    initial.phase = 'turn_start';
    this.notifyState(initial);
  }

  /**
   * Dispatch authoritative game action
   */
  public async dispatchAction(action: GameAction): Promise<{ success: boolean; error?: string }> {
    if (!this.localState || !this.currentSession) {
      return { success: false, error: 'No active game' };
    }

    const actingPlayerId = this.currentSession.playerId;

    // Run rules engine validation
    const result = executeGameAction(this.localState, action, actingPlayerId);
    if (result.error) {
      return { success: false, error: result.error };
    }

    // If online, propagate to Supabase
    if (this.currentSession.isOnline && supabase) {
      try {
        const { error } = await supabase.rpc('game_action', {
          p_game_id: this.currentSession.gameId,
          p_action_type: action.type,
          p_new_state: result.state,
          p_events: result.events,
        });

        if (error) {
          console.error('RPC game_action failed:', error);
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Update local state and trigger events
    this.notifyState(result.state);
    result.events.forEach((evt) => this.notifyEvent(evt));

    return { success: true };
  }

  /**
   * Trigger bot decision loop
   */
  private triggerBotTurnIfNeeded(state: GameState) {
    if (state.phase === 'lobby' || state.phase === 'game_over') return;

    const currentPlayer = getCurrentPlayer(state);
    const isBotTurn = currentPlayer?.isBot;
    const isAuctionWithBots =
      state.phase === 'auction' &&
      state.activeAuction &&
      state.activeAuction.activeBidderIds.some(
        (id) => state.players.find((p) => p.id === id)?.isBot
      );

    const tradeRecipientBotId =
      state.activeTrade &&
      state.players.find((p) => p.id === state.activeTrade!.toPlayerId)?.isBot
        ? state.activeTrade.toPlayerId
        : null;

    if (!isBotTurn && !isAuctionWithBots && !tradeRecipientBotId) return;

    if (this.botTimer) clearTimeout(this.botTimer);

    // Adaptive bot pacing so card draws, landing implications, and moves remain visible for 3.5s
    let delay = 1200;
    if (tradeRecipientBotId) {
      delay = 2200; // let the human see "waiting for response" before the bot answers
    } else if (state.activeCard) {
      // Action card drawn! Keep visible for 3.7s so players can read the 3.5s notification
      delay = 3700;
    } else if (state.phase === 'rolled') {
      // Bot landed on unowned property. 3.5s delay before deciding to buy or decline
      delay = 3500;
    } else if (state.phase === 'turn_end') {
      // Bot landed and resolved rent/tax/go. 3.5s delay so human can read the landing implication
      delay = 3500;
    } else if (state.phase === 'auction') {
      delay = 1200;
    }

    this.botTimer = setTimeout(() => {
      if (!this.localState) return;

      // Identify which bot needs to act
      let botIdToAct: string | null = null;

      // Pending trade offered to a bot: that bot answers (works on anyone's turn)
      const pendingTrade = this.localState.activeTrade;
      const tradeBot = pendingTrade
        ? this.localState.players.find((p) => p.id === pendingTrade.toPlayerId && p.isBot)
        : null;

      if (tradeBot) {
        botIdToAct = tradeBot.id;
      } else if (this.localState.phase === 'auction' && this.localState.activeAuction) {
        const auction = this.localState.activeAuction;
        const activeBot = auction.activeBidderIds.find((id) => {
          const p = this.localState!.players.find((pl) => pl.id === id);
          return p?.isBot && id !== auction.highestBidderId;
        });
        if (activeBot) {
          botIdToAct = activeBot;
        }
      } else if (isBotTurn) {
        botIdToAct = currentPlayer.id;
      }

      if (!botIdToAct) return;

      const botAction = getBotAction(this.localState, botIdToAct);
      if (botAction) {
        const res = executeGameAction(this.localState, botAction, botIdToAct);
        if (!res.error) {
          this.notifyState(res.state);
          res.events.forEach((evt) => this.notifyEvent(evt));
        }
      }
    }, delay);
  }

  /**
   * Setup Supabase Realtime channel
   */
  private setupRealtime(gameId: string) {
    if (!supabase) return;

    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }

    this.realtimeChannel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_states', filter: `game_id=eq.${gameId}` },
        (payload) => {
          if (payload.new && payload.new.state_data) {
            this.notifyState(payload.new.state_data);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'game_events', filter: `game_id=eq.${gameId}` },
        (payload) => {
          if (payload.new) {
            this.notifyEvent({
              id: String(payload.new.id),
              timestamp: new Date(payload.new.created_at).getTime(),
              type: payload.new.event_type,
              playerId: payload.new.player_id,
              message: payload.new.message,
              payload: payload.new.payload,
            });
          }
        }
      )
      .subscribe();
  }

  private saveSession(session: GameSession) {
    this.currentSession = session;
    localStorage.setItem('naroomopoly_active_session', JSON.stringify(session));
  }

  public leaveGame() {
    if (this.realtimeChannel && supabase) {
      supabase.removeChannel(this.realtimeChannel);
    }
    if (this.botTimer) clearTimeout(this.botTimer);
    localStorage.removeItem('naroomopoly_active_session');
    this.currentSession = null;
    this.localState = null;
    this.stateListeners.forEach((fn) => fn(null as any));
  }
}

export const gameService = new GameService();
