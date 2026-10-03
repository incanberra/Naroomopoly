import { BoardTile, ColorGroup, GameCard } from '../data/boardData';

export type GamePhase =
  | 'lobby'
  | 'turn_start'       // Turn has started, player needs to roll or handle jail
  | 'rolled'           // Dice rolled, moved, pending tile action (buy/card/tax/rent)
  | 'auction'          // Property being auctioned
  | 'turn_end'         // Tile action completed, can build/mortgage/trade or end turn
  | 'game_over';

export interface GameSettings {
  startingCash: number;
  freeParkingJackpot: boolean;
  afkTimerSeconds: number; // 0 for off, e.g. 60
  maxPlayers: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  startingCash: 1500,
  freeParkingJackpot: false,
  afkTimerSeconds: 0,
  maxPlayers: 6,
};

export interface PlayerState {
  id: string;
  name: string;
  token: string;
  seatIndex: number;
  cash: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  jailCardsNotice: number;
  jailCardsKnowledge: number;
  isBankrupt: boolean;
  isBot: boolean;
  isHost: boolean;
  color: string;
}

export interface PropertyState {
  tileIndex: number;
  ownerId: string | null;
  houses: number; // 0-4 = houses, 5 = hotel
  isMortgaged: boolean;
}

export interface AuctionState {
  tileIndex: number;
  currentBid: number;
  highestBidderId: string | null;
  activeBidderIds: string[]; // Players still in auction
  currentTurnBidderIndex: number;
  minNextBid: number;
}

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offerCash: number;
  offerProperties: number[]; // Tile indices
  offerJailCards: number;
  requestCash: number;
  requestProperties: number[]; // Tile indices
  requestJailCards: number;
  createdAt: number;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: string;
  playerId?: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface GameState {
  id: string;
  code: string;
  phase: GamePhase;
  settings: GameSettings;
  players: PlayerState[];
  currentTurnPlayerIndex: number;
  dice: [number, number];
  consecutiveDoubles: number;
  hasRolled: boolean;
  properties: Record<number, PropertyState>;
  bankHousesRemaining: number; // starts at 32
  bankHotelsRemaining: number; // starts at 12
  freeParkingJackpotPool: number;
  noticeDeck: GameCard[];
  noticeDiscard: GameCard[];
  knowledgeDeck: GameCard[];
  knowledgeDiscard: GameCard[];
  activeCard: GameCard | null;
  activeAuction: AuctionState | null;
  activeTrade: TradeOffer | null;
  winnerPlayerId: string | null;
  events: GameEvent[];
  updatedAt: number;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE'; forcedDice?: [number, number] } // forcedDice used in unit tests
  | { type: 'BUY_PROPERTY' }
  | { type: 'DECLINE_PROPERTY' }
  | { type: 'PLACE_AUCTION_BID'; amount: number }
  | { type: 'PASS_AUCTION' }
  | { type: 'CONCLUDE_AUCTION' }
  | { type: 'PAY_JAIL_FINE' }
  | { type: 'USE_JAIL_CARD' }
  | { type: 'BUILD_HOUSE'; tileIndex: number }
  | { type: 'SELL_HOUSE'; tileIndex: number }
  | { type: 'MORTGAGE_PROPERTY'; tileIndex: number }
  | { type: 'UNMORTGAGE_PROPERTY'; tileIndex: number }
  | { type: 'PROPOSE_TRADE'; offer: Omit<TradeOffer, 'id' | 'createdAt'> }
  | { type: 'ACCEPT_TRADE' }
  | { type: 'REJECT_TRADE' }
  | { type: 'CANCEL_TRADE' }
  | { type: 'DISMISS_ACTIVE_CARD' }
  | { type: 'DECLARE_BANKRUPTCY' }
  | { type: 'END_TURN' }
  | { type: 'KICK_PLAYER'; targetPlayerId: string };

export interface ActionResponse {
  success: boolean;
  error?: string;
  state: GameState;
  events: GameEvent[];
}
