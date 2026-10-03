import {
  BOARD_TILES,
  COLOR_GROUP_CONFIG,
  ColorGroup,
  BoardTile,
  GameCard,
  COMMUNITY_NOTICE_CARDS,
  LOCAL_KNOWLEDGE_CARDS,
} from '../data/boardData';
import {
  GameState,
  PlayerState,
  PropertyState,
  AuctionState,
  TradeOffer,
  GameAction,
  GameEvent,
  GameSettings,
  DEFAULT_SETTINGS,
} from './types';
import { initializeDecks, drawCard } from './cards';
import { TOKENS, PLAYER_COLORS } from '../data/tokens';

export function createInitialGameState(
  id: string,
  code: string,
  playerConfigs: Array<{ id: string; name: string; token: string; isBot?: boolean; isHost?: boolean }>,
  settings: Partial<GameSettings> = {},
  rng = Math.random
): GameState {
  const finalSettings: GameSettings = { ...DEFAULT_SETTINGS, ...settings };
  const decks = initializeDecks(rng);

  const players: PlayerState[] = playerConfigs.map((p, index) => ({
    id: p.id,
    name: p.name,
    token: p.token,
    seatIndex: index,
    cash: finalSettings.startingCash,
    position: 0,
    inJail: false,
    jailTurns: 0,
    jailCardsNotice: 0,
    jailCardsKnowledge: 0,
    isBankrupt: false,
    isBot: !!p.isBot,
    isHost: !!p.isHost,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  }));

  const properties: Record<number, PropertyState> = {};
  BOARD_TILES.forEach((tile) => {
    if (tile.type === 'property' || tile.type === 'hardware' || tile.type === 'utility') {
      properties[tile.index] = {
        tileIndex: tile.index,
        ownerId: null,
        houses: 0,
        isMortgaged: false,
      };
    }
  });

  return {
    id,
    code,
    phase: 'turn_start',
    settings: finalSettings,
    players,
    currentTurnPlayerIndex: 0,
    dice: [1, 1],
    consecutiveDoubles: 0,
    hasRolled: false,
    properties,
    bankHousesRemaining: 32,
    bankHotelsRemaining: 12,
    freeParkingJackpotPool: 0,
    noticeDeck: decks.noticeDeck,
    noticeDiscard: decks.noticeDiscard,
    knowledgeDeck: decks.knowledgeDeck,
    knowledgeDiscard: decks.knowledgeDiscard,
    activeCard: null,
    activeAuction: null,
    activeTrade: null,
    winnerPlayerId: null,
    events: [
      {
        id: `evt-${Date.now()}-start`,
        timestamp: Date.now(),
        type: 'GAME_STARTED',
        message: 'Naroom-opoly game started! Welcome to the South Coast.',
      },
    ],
    updatedAt: Date.now(),
  };
}

export function getCurrentPlayer(state: GameState): PlayerState {
  return state.players[state.currentTurnPlayerIndex];
}

export function getPropertiesInGroup(group: ColorGroup): BoardTile[] {
  return BOARD_TILES.filter((t) => t.property && t.property.colorGroup === group);
}

export function ownsFullGroup(state: GameState, playerId: string, group: ColorGroup): boolean {
  const groupTiles = getPropertiesInGroup(group);
  return groupTiles.every((t) => state.properties[t.index]?.ownerId === playerId);
}

export function calculateRent(
  state: GameState,
  tileIndex: number,
  diceRoll = state.dice[0] + state.dice[1],
  multiplierOverride?: number
): number {
  const tile = BOARD_TILES[tileIndex];
  const propState = state.properties[tileIndex];

  if (!tile || !propState || !propState.ownerId || propState.isMortgaged) {
    return 0;
  }

  // 1. Hardware Stores (Railways)
  if (tile.type === 'hardware' && tile.hardware) {
    const hardwareIndices = [5, 15, 25, 35];
    const ownedCount = hardwareIndices.filter(
      (idx) => state.properties[idx]?.ownerId === propState.ownerId
    ).length;
    const baseHardwareRent = tile.hardware.rents[Math.max(0, ownedCount - 1)] || 25;
    return multiplierOverride ? baseHardwareRent * multiplierOverride : baseHardwareRent;
  }

  // 2. Utilities
  if (tile.type === 'utility' && tile.utility) {
    if (multiplierOverride) {
      return diceRoll * multiplierOverride;
    }
    const utilityIndices = [12, 28];
    const ownedCount = utilityIndices.filter(
      (idx) => state.properties[idx]?.ownerId === propState.ownerId
    ).length;
    const mult = ownedCount >= 2 ? tile.utility.multiplierBoth : tile.utility.multiplierOne;
    return diceRoll * mult;
  }

  // 3. Regular Properties
  if (tile.type === 'property' && tile.property) {
    const { rent, colorGroup } = tile.property;
    const houses = propState.houses;

    if (houses > 0) {
      // 1-4 houses, 5 = hotel
      return rent[houses] ?? 0;
    }

    // Unimproved: double rent if full group owned and none mortgaged
    const fullGroup = ownsFullGroup(state, propState.ownerId, colorGroup);
    if (fullGroup) {
      const groupTiles = getPropertiesInGroup(colorGroup);
      const anyMortgaged = groupTiles.some((t) => state.properties[t.index]?.isMortgaged);
      if (!anyMortgaged) {
        return rent[0] * 2;
      }
    }

    return rent[0];
  }

  return 0;
}

export function canBuildHouse(
  state: GameState,
  playerId: string,
  tileIndex: number
): { canBuild: boolean; reason?: string } {
  const tile = BOARD_TILES[tileIndex];
  const propState = state.properties[tileIndex];

  if (!tile || tile.type !== 'property' || !tile.property || !propState) {
    return { canBuild: false, reason: 'Not an improvable property' };
  }

  if (propState.ownerId !== playerId) {
    return { canBuild: false, reason: 'You do not own this property' };
  }

  if (propState.isMortgaged) {
    return { canBuild: false, reason: 'Cannot build on a mortgaged property' };
  }

  const { colorGroup, houseCost } = tile.property;
  if (!ownsFullGroup(state, playerId, colorGroup)) {
    return { canBuild: false, reason: 'You must own the entire color group first' };
  }

  const groupTiles = getPropertiesInGroup(colorGroup);
  const anyMortgaged = groupTiles.some((t) => state.properties[t.index]?.isMortgaged);
  if (anyMortgaged) {
    return { canBuild: false, reason: 'Cannot build while any property in the group is mortgaged' };
  }

  if (propState.houses >= 5) {
    return { canBuild: false, reason: 'Already reached maximum development (Hotel)' };
  }

  const player = state.players.find((p) => p.id === playerId);
  if (!player || player.cash < houseCost) {
    return { canBuild: false, reason: 'Insufficient cash' };
  }

  // Bank availability check
  if (propState.houses === 4) {
    if (state.bankHotelsRemaining <= 0) {
      return { canBuild: false, reason: 'No hotels left in the bank' };
    }
  } else {
    if (state.bankHousesRemaining <= 0) {
      return { canBuild: false, reason: 'No houses left in the bank' };
    }
  }

  // Even building rule
  for (const t of groupTiles) {
    const otherHouses = state.properties[t.index]?.houses ?? 0;
    if (propState.houses > otherHouses) {
      return { canBuild: false, reason: 'Must build evenly across the color group' };
    }
  }

  return { canBuild: true };
}

export function canSellHouse(
  state: GameState,
  playerId: string,
  tileIndex: number
): { canSell: boolean; reason?: string } {
  const tile = BOARD_TILES[tileIndex];
  const propState = state.properties[tileIndex];

  if (!tile || tile.type !== 'property' || !propState) {
    return { canSell: false, reason: 'Not a developable property' };
  }

  if (propState.ownerId !== playerId) {
    return { canSell: false, reason: 'You do not own this property' };
  }

  if (propState.houses <= 0) {
    return { canSell: false, reason: 'No buildings to sell on this property' };
  }

  // If selling a hotel (houses === 5) to 4 houses, bank must have 4 houses
  if (propState.houses === 5 && state.bankHousesRemaining < 4) {
    return { canSell: false, reason: 'Bank does not have 4 houses to break down this hotel' };
  }

  // Even selling rule: cannot sell if any other property in the group has more buildings
  const groupTiles = getPropertiesInGroup(tile.property!.colorGroup);
  for (const t of groupTiles) {
    const otherHouses = state.properties[t.index]?.houses ?? 0;
    if (propState.houses < otherHouses) {
      return { canSell: false, reason: 'Must sell evenly across the color group' };
    }
  }

  return { canSell: true };
}

export function canMortgage(
  state: GameState,
  playerId: string,
  tileIndex: number
): { canMortgage: boolean; reason?: string } {
  const tile = BOARD_TILES[tileIndex];
  const propState = state.properties[tileIndex];

  if (!tile || !propState) {
    return { canMortgage: false, reason: 'Invalid property' };
  }

  if (propState.ownerId !== playerId) {
    return { canMortgage: false, reason: 'You do not own this property' };
  }

  if (propState.isMortgaged) {
    return { canMortgage: false, reason: 'Property is already mortgaged' };
  }

  // Check if any property in group has buildings
  if (tile.type === 'property' && tile.property) {
    const groupTiles = getPropertiesInGroup(tile.property.colorGroup);
    const hasBuildings = groupTiles.some((t) => (state.properties[t.index]?.houses ?? 0) > 0);
    if (hasBuildings) {
      return { canMortgage: false, reason: 'Must sell all buildings in color group before mortgaging' };
    }
  }

  return { canMortgage: true };
}

export function canUnmortgage(
  state: GameState,
  playerId: string,
  tileIndex: number
): { canUnmortgage: boolean; cost: number; reason?: string } {
  const tile = BOARD_TILES[tileIndex];
  const propState = state.properties[tileIndex];

  const mortgageVal =
    tile.property?.mortgageValue ??
    tile.hardware?.mortgageValue ??
    tile.utility?.mortgageValue ??
    0;

  const cost = Math.ceil(mortgageVal * 1.1); // 10% interest

  if (!tile || !propState) {
    return { canUnmortgage: false, cost, reason: 'Invalid property' };
  }

  if (propState.ownerId !== playerId) {
    return { canUnmortgage: false, cost, reason: 'You do not own this property' };
  }

  if (!propState.isMortgaged) {
    return { canUnmortgage: false, cost, reason: 'Property is not mortgaged' };
  }

  const player = state.players.find((p) => p.id === playerId);
  if (!player || player.cash < cost) {
    return { canUnmortgage: false, cost, reason: `Insufficient cash (requires $${cost})` };
  }

  return { canUnmortgage: true, cost };
}

function sendToJail(state: GameState, playerId: string, reason: string): GameEvent[] {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return [];

  player.position = 10;
  player.inJail = true;
  player.jailTurns = 0;
  state.consecutiveDoubles = 0;
  state.phase = 'turn_end';

  return [
    {
      id: `evt-${Date.now()}-jail`,
      timestamp: Date.now(),
      type: 'SENT_TO_JAIL',
      playerId,
      message: `${player.name} was sent to Bodalla Police Station: ${reason}`,
      payload: {
        reason,
        playerId,
        playerName: player.name,
        playerColor: player.color,
        playerToken: player.token,
        tileIndex: 10,
        tileName: 'Bodalla Police Station',
      },
    },
  ];
}

/**
 * Handle landing on a board square
 */
function handleLanding(
  state: GameState,
  player: PlayerState,
  diceRoll: number,
  rng = Math.random
): GameEvent[] {
  const events: GameEvent[] = [];
  const tile = BOARD_TILES[player.position];

  if (!tile) return events;

  // 1. GO
  if (tile.type === 'go') {
    // Collect $200 handled during movement if passed, but if landed directly:
    // (Movement handles "passed GO", so if landed on 0, passed GO event already triggered)
    return events;
  }

  // 2. Go To Jail
  if (tile.type === 'gotojail') {
    const jailEvents = sendToJail(state, player.id, 'Landed on Go to Bodalla Police Station');
    return jailEvents;
  }

  // 3. Free Parking
  if (tile.type === 'parking') {
    if (state.settings.freeParkingJackpot && state.freeParkingJackpotPool > 0) {
      const pot = state.freeParkingJackpotPool;
      player.cash += pot;
      state.freeParkingJackpotPool = 0;
      events.push({
        id: `evt-${Date.now()}-jackpot`,
        timestamp: Date.now(),
        type: 'JACKPOT_WON',
        playerId: player.id,
        message: `${player.name} won the Free Parking jackpot of $${pot}!`,
      });
    } else {
      events.push({
        id: `evt-${Date.now()}-parking`,
        timestamp: Date.now(),
        type: 'FREE_PARKING',
        playerId: player.id,
        message: `${player.name} is resting at Free Parking at Batehaven Beach.`,
      });
    }
    state.phase = 'turn_end';
    return events;
  }

  // 4. Taxes
  if (tile.type === 'tax' && tile.tax) {
    const amount = tile.tax.amount;
    const oldCash = player.cash;
    player.cash -= amount;
    if (state.settings.freeParkingJackpot) {
      state.freeParkingJackpotPool += amount;
    }
    events.push({
      id: `evt-${Date.now()}-tax`,
      timestamp: Date.now(),
      type: 'TAX_PAID',
      playerId: player.id,
      message: `${player.name} paid $${amount} for ${tile.name}.`,
      payload: {
        amount,
        tileIndex: tile.index,
        tileName: tile.name,
        payerId: player.id,
        payerName: player.name,
        payerColor: player.color,
        payerToken: player.token,
        oldCash,
        newCash: player.cash,
      },
    });

    state.phase = 'turn_end';
    return events;
  }

  // 5. Cards: Community Notice Board or Local Knowledge
  if (tile.type === 'notice' || tile.type === 'knowledge') {
    const isNotice = tile.type === 'notice';
    const drawn = isNotice
      ? drawCard(state.noticeDeck, state.noticeDiscard, rng)
      : drawCard(state.knowledgeDeck, state.knowledgeDiscard, rng);

    if (isNotice) {
      state.noticeDeck = drawn.nextDeck;
      state.noticeDiscard = drawn.nextDiscard;
    } else {
      state.knowledgeDeck = drawn.nextDeck;
      state.knowledgeDiscard = drawn.nextDiscard;
    }

    const card = drawn.card;
    state.activeCard = card;

    events.push({
      id: `evt-${Date.now()}-card`,
      timestamp: Date.now(),
      type: 'CARD_DRAWN',
      playerId: player.id,
      message: `${player.name} drew a ${isNotice ? 'Community Notice Board' : 'Local Knowledge'} card: "${card.title}" - ${card.description}`,
      payload: {
        card,
        isNotice,
        drawerId: player.id,
        drawerName: player.name,
        drawerColor: player.color,
        drawerToken: player.token,
      },
    });

    // Apply card effect
    const cardEvents = applyCardEffect(state, player, card, diceRoll, rng);
    events.push(...cardEvents);
    return events;
  }

  // 6. Ownable Properties, Hardware, Utilities
  if (tile.type === 'property' || tile.type === 'hardware' || tile.type === 'utility') {
    const propState = state.properties[tile.index];
    if (!propState) {
      state.phase = 'turn_end';
      return events;
    }

    if (propState.ownerId === null) {
      const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? 0;
      events.push({
        id: `evt-${Date.now()}-unowned`,
        timestamp: Date.now(),
        type: 'LANDED_UNOWNED',
        playerId: player.id,
        message: `${player.name} landed on unowned ${tile.name} (Price: $${price}).`,
        payload: {
          tileIndex: tile.index,
          tileName: tile.name,
          price,
          payerId: player.id,
          payerName: player.name,
          payerColor: player.color,
          payerToken: player.token,
        },
      });
      // Unowned: player can buy or decline (declining starts auction)
      state.phase = 'rolled';
      return events;
    }

    if (propState.ownerId === player.id) {
      events.push({
        id: `evt-${Date.now()}-own`,
        timestamp: Date.now(),
        type: 'OWN_PROPERTY',
        playerId: player.id,
        message: `${player.name} landed on their own property: ${tile.name}.`,
        payload: {
          tileIndex: tile.index,
          tileName: tile.name,
          payerId: player.id,
          payerName: player.name,
          payerColor: player.color,
          payerToken: player.token,
        },
      });
      state.phase = 'turn_end';
      return events;
    }

    if (propState.isMortgaged) {
      events.push({
        id: `evt-${Date.now()}-mortgaged`,
        timestamp: Date.now(),
        type: 'MORTGAGED_TILE',
        playerId: player.id,
        message: `${player.name} landed on ${tile.name}, but it is mortgaged (no rent).`,
        payload: {
          tileIndex: tile.index,
          tileName: tile.name,
          ownerId: propState.ownerId,
        },
      });
      state.phase = 'turn_end';
      return events;
    }

    // Pay rent to owner
    const rentAmount = calculateRent(state, tile.index, diceRoll);
    const owner = state.players.find((p) => p.id === propState.ownerId);

    if (owner && rentAmount > 0) {
      const oldPayerCash = player.cash;
      const oldOwnerCash = owner.cash;
      player.cash -= rentAmount;
      owner.cash += rentAmount;
      events.push({
        id: `evt-${Date.now()}-rent`,
        timestamp: Date.now(),
        type: 'RENT_PAID',
        playerId: player.id,
        message: `${player.name} paid $${rentAmount} rent to ${owner.name} for landing on ${tile.name}.`,
        payload: {
          rentAmount,
          ownerId: owner.id,
          ownerName: owner.name,
          ownerColor: owner.color,
          ownerToken: owner.token,
          payerId: player.id,
          payerName: player.name,
          payerColor: player.color,
          payerToken: player.token,
          tileIndex: tile.index,
          tileName: tile.name,
          oldCash: oldPayerCash,
          newCash: player.cash,
          ownerOldCash: oldOwnerCash,
          ownerNewCash: owner.cash,
        },
      });
    }

    state.phase = 'turn_end';
    return events;
  }

  // 7. Bodalla Police Station (Just Visiting)
  if (tile.type === 'jail') {
    events.push({
      id: `evt-${Date.now()}-visit-jail`,
      timestamp: Date.now(),
      type: 'JUST_VISITING',
      playerId: player.id,
      message: `${player.name} is just visiting Bodalla Police Station.`,
      payload: {
        tileIndex: 10,
        tileName: 'Bodalla Police Station (Just Visiting)',
        payerId: player.id,
        payerName: player.name,
        payerColor: player.color,
        payerToken: player.token,
      },
    });
  }

  state.phase = 'turn_end';
  return events;
}

function applyCardEffect(
  state: GameState,
  player: PlayerState,
  card: GameCard,
  diceRoll: number,
  rng = Math.random
): GameEvent[] {
  const events: GameEvent[] = [];

  switch (card.action) {
    case 'advance_to': {
      if (card.targetIndex !== undefined) {
        if (card.targetIndex < player.position) {
          // Passed GO
          player.cash += 200;
          events.push({
            id: `evt-${Date.now()}-pass-go`,
            timestamp: Date.now(),
            type: 'PASSED_GO',
            playerId: player.id,
            message: `${player.name} passed Welcome to the South Coast and collected $200!`,
          });
        }
        player.position = card.targetIndex;
        const landEvents = handleLanding(state, player, diceRoll, rng);
        events.push(...landEvents);
      }
      break;
    }

    case 'advance_nearest_hardware': {
      const hardwareIndices = [5, 15, 25, 35];
      let nearest = hardwareIndices[0];
      for (const idx of hardwareIndices) {
        if (idx > player.position) {
          nearest = idx;
          break;
        }
      }
      if (nearest < player.position) {
        // Passed GO
        player.cash += 200;
        events.push({
          id: `evt-${Date.now()}-pass-go`,
          timestamp: Date.now(),
          type: 'PASSED_GO',
          playerId: player.id,
          message: `${player.name} passed Welcome to the South Coast and collected $200!`,
        });
      }
      player.position = nearest;
      const propState = state.properties[nearest];
      if (propState && propState.ownerId && propState.ownerId !== player.id && !propState.isMortgaged) {
        // Pay double rent
        const doubleRent = calculateRent(state, nearest, diceRoll, 2);
        const owner = state.players.find((p) => p.id === propState.ownerId);
        player.cash -= doubleRent;
        if (owner) owner.cash += doubleRent;
        events.push({
          id: `evt-${Date.now()}-hardware-rent`,
          timestamp: Date.now(),
          type: 'RENT_PAID',
          playerId: player.id,
          message: `${player.name} paid double rent ($${doubleRent}) to ${owner?.name} at ${BOARD_TILES[nearest].name}!`,
        });
        state.phase = 'turn_end';
      } else {
        const landEvents = handleLanding(state, player, diceRoll, rng);
        events.push(...landEvents);
      }
      break;
    }

    case 'advance_nearest_utility': {
      const utilityIndices = [12, 28];
      let nearest = utilityIndices[0];
      for (const idx of utilityIndices) {
        if (idx > player.position) {
          nearest = idx;
          break;
        }
      }
      if (nearest < player.position) {
        // Passed GO
        player.cash += 200;
        events.push({
          id: `evt-${Date.now()}-pass-go`,
          timestamp: Date.now(),
          type: 'PASSED_GO',
          playerId: player.id,
          message: `${player.name} passed Welcome to the South Coast and collected $200!`,
        });
      }
      player.position = nearest;
      const propState = state.properties[nearest];
      if (propState && propState.ownerId && propState.ownerId !== player.id && !propState.isMortgaged) {
        // Pay 10 times dice roll
        const utilityRent = diceRoll * 10;
        const owner = state.players.find((p) => p.id === propState.ownerId);
        player.cash -= utilityRent;
        if (owner) owner.cash += utilityRent;
        events.push({
          id: `evt-${Date.now()}-utility-rent`,
          timestamp: Date.now(),
          type: 'RENT_PAID',
          playerId: player.id,
          message: `${player.name} paid 10x dice roll ($${utilityRent}) to ${owner?.name} at ${BOARD_TILES[nearest].name}!`,
        });
        state.phase = 'turn_end';
      } else {
        const landEvents = handleLanding(state, player, diceRoll, rng);
        events.push(...landEvents);
      }
      break;
    }

    case 'collect_money': {
      if (card.amount) {
        player.cash += card.amount;
      }
      state.phase = 'turn_end';
      break;
    }

    case 'pay_money': {
      if (card.amount) {
        player.cash -= card.amount;
        if (state.settings.freeParkingJackpot) {
          state.freeParkingJackpotPool += card.amount;
        }
      }
      state.phase = 'turn_end';
      break;
    }

    case 'pay_each_player': {
      if (card.amount) {
        const otherPlayers = state.players.filter((p) => p.id !== player.id && !p.isBankrupt);
        const total = card.amount * otherPlayers.length;
        player.cash -= total;
        otherPlayers.forEach((p) => {
          p.cash += card.amount!;
        });
      }
      state.phase = 'turn_end';
      break;
    }

    case 'collect_from_each_player': {
      if (card.amount) {
        const otherPlayers = state.players.filter((p) => p.id !== player.id && !p.isBankrupt);
        otherPlayers.forEach((p) => {
          p.cash -= card.amount!;
          player.cash += card.amount!;
        });
      }
      state.phase = 'turn_end';
      break;
    }

    case 'repairs': {
      let totalHouses = 0;
      let totalHotels = 0;
      BOARD_TILES.forEach((t) => {
        const p = state.properties[t.index];
        if (p && p.ownerId === player.id) {
          if (p.houses === 5) {
            totalHotels++;
          } else {
            totalHouses += p.houses;
          }
        }
      });
      const cost =
        totalHouses * (card.perHouse ?? 0) + totalHotels * (card.perHotel ?? 0);
      player.cash -= cost;
      if (state.settings.freeParkingJackpot) {
        state.freeParkingJackpotPool += cost;
      }
      events.push({
        id: `evt-${Date.now()}-repairs`,
        timestamp: Date.now(),
        type: 'REPAIRS_PAID',
        playerId: player.id,
        message: `${player.name} paid $${cost} for repairs (${totalHouses} houses, ${totalHotels} hotels).`,
      });
      state.phase = 'turn_end';
      break;
    }

    case 'go_back_spaces': {
      const spaces = card.spaces ?? 3;
      player.position = (player.position - spaces + 40) % 40;
      const landEvents = handleLanding(state, player, diceRoll, rng);
      events.push(...landEvents);
      break;
    }

    case 'go_to_jail': {
      const jailEvents = sendToJail(state, player.id, card.title);
      events.push(...jailEvents);
      break;
    }

    case 'get_out_of_jail_free': {
      if (card.deck === 'notice') {
        player.jailCardsNotice++;
      } else {
        player.jailCardsKnowledge++;
      }
      // Remove from active discard until played
      if (card.deck === 'notice') {
        state.noticeDiscard = state.noticeDiscard.filter((c) => c.id !== card.id);
      } else {
        state.knowledgeDiscard = state.knowledgeDiscard.filter((c) => c.id !== card.id);
      }
      state.phase = 'turn_end';
      break;
    }

    default:
      state.phase = 'turn_end';
      break;
  }

  return events;
}

/**
 * Handle player turn progression
 */
export function advanceTurn(state: GameState): GameEvent[] {
  state.hasRolled = false;
  state.consecutiveDoubles = 0;
  state.activeCard = null;

  const activePlayers = state.players.filter((p) => !p.isBankrupt);
  if (activePlayers.length <= 1) {
    state.phase = 'game_over';
    state.winnerPlayerId = activePlayers[0]?.id || null;
    return [
      {
        id: `evt-${Date.now()}-win`,
        timestamp: Date.now(),
        type: 'GAME_OVER',
        playerId: state.winnerPlayerId || undefined,
        message: `Game over! ${activePlayers[0]?.name || 'Nobody'} is the champion of Naroom-opoly!`,
      },
    ];
  }

  let nextIndex = (state.currentTurnPlayerIndex + 1) % state.players.length;
  while (state.players[nextIndex].isBankrupt) {
    nextIndex = (nextIndex + 1) % state.players.length;
  }

  state.currentTurnPlayerIndex = nextIndex;
  state.phase = 'turn_start';

  const nextPlayer = state.players[nextIndex];
  return [
    {
      id: `evt-${Date.now()}-turn`,
      timestamp: Date.now(),
      type: 'TURN_STARTED',
      playerId: nextPlayer.id,
      message: `It is now ${nextPlayer.name}'s turn.`,
    },
  ];
}

/**
 * Checks a trade is currently executable. Returns an error message, or null if valid.
 */
export function validateTradeOffer(
  state: GameState,
  offer: Pick<
    TradeOffer,
    | 'fromPlayerId'
    | 'toPlayerId'
    | 'offerCash'
    | 'requestCash'
    | 'offerProperties'
    | 'requestProperties'
    | 'offerJailCards'
    | 'requestJailCards'
  >
): string | null {
  const from = state.players.find((p) => p.id === offer.fromPlayerId);
  const to = state.players.find((p) => p.id === offer.toPlayerId);
  if (!from || !to) return 'Invalid players for trade';
  if (from.isBankrupt || to.isBankrupt) return 'A bankrupt player cannot trade';
  if (offer.offerCash < 0 || offer.requestCash < 0) return 'Invalid cash amount';
  if (from.cash < offer.offerCash) return `${from.name} does not have enough cash to offer`;
  if (to.cash < offer.requestCash) return `${to.name} does not have enough cash`;
  for (const idx of offer.offerProperties) {
    if (state.properties[idx]?.ownerId !== from.id) return `${from.name} no longer owns ${BOARD_TILES[idx]?.name}`;
  }
  for (const idx of offer.requestProperties) {
    if (state.properties[idx]?.ownerId !== to.id) return `${to.name} does not own ${BOARD_TILES[idx]?.name}`;
  }
  if (from.jailCardsNotice < offer.offerJailCards) return `${from.name} does not have that many jail cards`;
  if (to.jailCardsNotice < offer.requestJailCards) return `${to.name} does not have that many jail cards`;
  return null;
}

/**
 * Main Pure Engine Reducer / Dispatcher
 */
export function executeGameAction(
  state: GameState,
  action: GameAction,
  actingPlayerId: string,
  rng = Math.random
): { state: GameState; events: GameEvent[]; error?: string } {
  // Deep clone state to ensure immutability
  const next: GameState = JSON.parse(JSON.stringify(state));
  const events: GameEvent[] = [];

  const currentPlayer = getCurrentPlayer(next);

  switch (action.type) {
    case 'START_GAME': {
      if (next.phase !== 'lobby') {
        return { state, events: [], error: 'Game is already in progress' };
      }
      if (next.players.length < 2) {
        return { state, events: [], error: 'At least 2 players are required to start' };
      }
      next.phase = 'turn_start';
      events.push({
        id: `evt-${Date.now()}-start`,
        timestamp: Date.now(),
        type: 'GAME_STARTED',
        message: `The game has begun! ${currentPlayer.name} starts first.`,
      });
      return { state: next, events };
    }

    case 'ROLL_DICE': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      if (next.hasRolled && next.phase !== 'turn_start') {
        return { state, events: [], error: 'Already rolled this turn' };
      }

      // Dice roll
      const d1 = action.forcedDice ? action.forcedDice[0] : Math.floor(rng() * 6) + 1;
      const d2 = action.forcedDice ? action.forcedDice[1] : Math.floor(rng() * 6) + 1;
      next.dice = [d1, d2];
      const isDoubles = d1 === d2;
      const diceSum = d1 + d2;

      events.push({
        id: `evt-${Date.now()}-roll`,
        timestamp: Date.now(),
        type: 'DICE_ROLLED',
        playerId: currentPlayer.id,
        message: `${currentPlayer.name} rolled [${d1}, ${d2}] (${diceSum})${isDoubles ? ' - DOUBLES!' : ''}`,
        payload: {
          dice: [d1, d2],
          diceSum,
          isDoubles,
          destinationIndex: (currentPlayer.position + diceSum) % 40,
          destinationName: BOARD_TILES[(currentPlayer.position + diceSum) % 40]?.name,
          player: {
            id: currentPlayer.id,
            name: currentPlayer.name,
            color: currentPlayer.color,
            token: currentPlayer.token,
          },
        },
      });

      // Jail handling
      if (currentPlayer.inJail) {
        if (isDoubles) {
          currentPlayer.inJail = false;
          currentPlayer.jailTurns = 0;
          events.push({
            id: `evt-${Date.now()}-jail-free`,
            timestamp: Date.now(),
            type: 'JAIL_FREE_DOUBLES',
            playerId: currentPlayer.id,
            message: `${currentPlayer.name} rolled doubles and got out of Bodalla Police Station!`,
          });
          // Move by roll, but do NOT roll again for this double
          const oldPos = currentPlayer.position;
          const newPos = (oldPos + diceSum) % 40;
          currentPlayer.position = newPos;
          next.hasRolled = true;
          const landEvents = handleLanding(next, currentPlayer, diceSum, rng);
          events.push(...landEvents);
          return { state: next, events };
        } else {
          currentPlayer.jailTurns++;
          if (currentPlayer.jailTurns >= 3) {
            // Must pay $50 and move
            currentPlayer.cash -= 50;
            if (next.settings.freeParkingJackpot) next.freeParkingJackpotPool += 50;
            currentPlayer.inJail = false;
            currentPlayer.jailTurns = 0;
            events.push({
              id: `evt-${Date.now()}-jail-forced`,
              timestamp: Date.now(),
              type: 'JAIL_FORCED_PAY',
              playerId: currentPlayer.id,
              message: `${currentPlayer.name} failed doubles 3 times, paid $50 fine to get out.`,
            });
            const oldPos = currentPlayer.position;
            const newPos = (oldPos + diceSum) % 40;
            currentPlayer.position = newPos;
            next.hasRolled = true;
            const landEvents = handleLanding(next, currentPlayer, diceSum, rng);
            events.push(...landEvents);
            return { state: next, events };
          } else {
            // Remain in jail, turn ends
            events.push({
              id: `evt-${Date.now()}-jail-stay`,
              timestamp: Date.now(),
              type: 'JAIL_STAY',
              playerId: currentPlayer.id,
              message: `${currentPlayer.name} did not roll doubles and stays in Bodalla Police Station (Attempt ${currentPlayer.jailTurns}/3).`,
            });
            next.hasRolled = true;
            next.phase = 'turn_end';
            return { state: next, events };
          }
        }
      }

      // Normal movement
      if (isDoubles) {
        next.consecutiveDoubles++;
        if (next.consecutiveDoubles >= 3) {
          const jailEvts = sendToJail(next, currentPlayer.id, 'Rolled 3 consecutive doubles');
          events.push(...jailEvts);
          next.hasRolled = true;
          return { state: next, events };
        }
      } else {
        next.consecutiveDoubles = 0;
      }

      const oldPos = currentPlayer.position;
      const newPos = (oldPos + diceSum) % 40;

      // Passing GO check
      if (newPos < oldPos) {
        const oldCash = currentPlayer.cash;
        currentPlayer.cash += 200;
        events.push({
          id: `evt-${Date.now()}-pass-go`,
          timestamp: Date.now(),
          type: 'PASSED_GO',
          playerId: currentPlayer.id,
          message: `${currentPlayer.name} passed Welcome to the South Coast and collected $200!`,
          payload: {
            amount: 200,
            payerId: currentPlayer.id,
            payerName: currentPlayer.name,
            payerColor: currentPlayer.color,
            payerToken: currentPlayer.token,
            oldCash,
            newCash: currentPlayer.cash,
            tileIndex: 0,
            tileName: 'Welcome to the South Coast',
          },
        });
      }

      currentPlayer.position = newPos;
      next.hasRolled = !isDoubles; // If doubles rolled, can roll again after turn actions!

      const landEvents = handleLanding(next, currentPlayer, diceSum, rng);
      events.push(...landEvents);

      return { state: next, events };
    }

    case 'BUY_PROPERTY': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      const tile = BOARD_TILES[currentPlayer.position];
      const propState = next.properties[currentPlayer.position];

      if (!tile || !propState || propState.ownerId !== null) {
        return { state, events: [], error: 'Property is not available for purchase' };
      }

      const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? 0;
      if (currentPlayer.cash < price) {
        return { state, events: [], error: `Insufficient cash ($${currentPlayer.cash} available, $${price} required)` };
      }

      const oldCash = currentPlayer.cash;
      currentPlayer.cash -= price;
      propState.ownerId = currentPlayer.id;
      events.push({
        id: `evt-${Date.now()}-buy`,
        timestamp: Date.now(),
        type: 'PROPERTY_BOUGHT',
        playerId: currentPlayer.id,
        message: `${currentPlayer.name} bought ${tile.name} for $${price}!`,
        payload: {
          price,
          tileIndex: tile.index,
          tileName: tile.name,
          buyerId: currentPlayer.id,
          buyerName: currentPlayer.name,
          buyerColor: currentPlayer.color,
          buyerToken: currentPlayer.token,
          oldCash,
          newCash: currentPlayer.cash,
        },
      });

      next.phase = 'turn_end';
      return { state: next, events };
    }

    case 'DECLINE_PROPERTY': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      const tile = BOARD_TILES[currentPlayer.position];
      if (!tile) {
        return { state, events: [], error: 'Invalid tile' };
      }

      // Start auction for all active players
      const activeBidderIds = next.players.filter((p) => !p.isBankrupt).map((p) => p.id);
      next.activeAuction = {
        tileIndex: tile.index,
        currentBid: 0,
        highestBidderId: null,
        activeBidderIds,
        currentTurnBidderIndex: 0,
        minNextBid: 10,
      };
      next.phase = 'auction';

      events.push({
        id: `evt-${Date.now()}-auction-start`,
        timestamp: Date.now(),
        type: 'AUCTION_STARTED',
        playerId: currentPlayer.id,
        message: `${currentPlayer.name} declined to buy ${tile.name}. It is now up for auction!`,
      });

      return { state: next, events };
    }

    case 'PLACE_AUCTION_BID': {
      if (!next.activeAuction) {
        return { state, events: [], error: 'No active auction' };
      }
      const bidder = next.players.find((p) => p.id === actingPlayerId);
      if (!bidder || bidder.isBankrupt) {
        return { state, events: [], error: 'Invalid bidder' };
      }
      if (action.amount < next.activeAuction.minNextBid) {
        return { state, events: [], error: `Bid must be at least $${next.activeAuction.minNextBid}` };
      }
      if (bidder.cash < action.amount) {
        return { state, events: [], error: 'Insufficient cash for bid' };
      }

      next.activeAuction.currentBid = action.amount;
      next.activeAuction.highestBidderId = bidder.id;
      next.activeAuction.minNextBid = action.amount + 10;

      const bidTile = BOARD_TILES[next.activeAuction.tileIndex];
      events.push({
        id: `evt-${Date.now()}-bid`,
        timestamp: Date.now(),
        type: 'AUCTION_BID',
        playerId: bidder.id,
        message: `${bidder.name} placed a bid of $${action.amount} for ${bidTile?.name || 'property'}.`,
        payload: {
          bidderId: bidder.id,
          bidderName: bidder.name,
          bidderColor: bidder.color,
          bidderToken: bidder.token,
          amount: action.amount,
          minNextBid: next.activeAuction.minNextBid,
          tileIndex: bidTile?.index,
          tileName: bidTile?.name,
        },
      });

      return { state: next, events };
    }

    case 'PASS_AUCTION': {
      if (!next.activeAuction) {
        return { state, events: [], error: 'No active auction' };
      }
      const passer = next.players.find((p) => p.id === actingPlayerId);
      if (!passer) {
        return { state, events: [], error: 'Invalid bidder' };
      }

      next.activeAuction.activeBidderIds = next.activeAuction.activeBidderIds.filter(
        (id) => id !== actingPlayerId
      );

      events.push({
        id: `evt-${Date.now()}-pass-bid`,
        timestamp: Date.now(),
        type: 'AUCTION_PASS',
        playerId: passer.id,
        message: `${passer.name} passed on the auction.`,
        payload: {
          playerId: passer.id,
          playerName: passer.name,
          playerColor: passer.color,
          playerToken: passer.token,
        },
      });

      // Check if auction concluded
      const remainingBidders = next.activeAuction.activeBidderIds;
      if (
        (remainingBidders.length === 1 && next.activeAuction.highestBidderId) ||
        remainingBidders.length === 0
      ) {
        const winnerId = next.activeAuction.highestBidderId;
        const tileIndex = next.activeAuction.tileIndex;
        const tile = BOARD_TILES[tileIndex];

        if (winnerId) {
          const winner = next.players.find((p) => p.id === winnerId);
          const finalBid = next.activeAuction.currentBid;
          if (winner) {
            const oldCash = winner.cash;
            winner.cash -= finalBid;
            next.properties[tileIndex].ownerId = winner.id;
            events.push({
              id: `evt-${Date.now()}-auction-won`,
              timestamp: Date.now(),
              type: 'AUCTION_WON',
              playerId: winner.id,
              message: `${winner.name} won the auction for ${tile.name} for $${finalBid}!`,
              payload: {
                tileIndex,
                tileName: tile.name,
                winnerId: winner.id,
                winnerName: winner.name,
                winnerColor: winner.color,
                winnerToken: winner.token,
                finalBid,
                oldCash,
                newCash: winner.cash,
              },
            });
          }
        } else {
          events.push({
            id: `evt-${Date.now()}-auction-unsold`,
            timestamp: Date.now(),
            type: 'AUCTION_UNSOLD',
            message: `No bids placed for ${tile.name}. It remains unowned.`,
            payload: {
              tileIndex,
              tileName: tile.name,
            },
          });
        }

        next.activeAuction = null;
        next.phase = 'turn_end';
      }

      return { state: next, events };
    }

    case 'CONCLUDE_AUCTION': {
      if (!next.activeAuction) {
        return { state, events: [], error: 'No active auction' };
      }

      const winnerId = next.activeAuction.highestBidderId;
      const tileIndex = next.activeAuction.tileIndex;
      const tile = BOARD_TILES[tileIndex];

      if (winnerId) {
        const winner = next.players.find((p) => p.id === winnerId);
        const finalBid = next.activeAuction.currentBid;
        if (winner) {
          const oldCash = winner.cash;
          winner.cash -= finalBid;
          next.properties[tileIndex].ownerId = winner.id;
          events.push({
            id: `evt-${Date.now()}-auction-won`,
            timestamp: Date.now(),
            type: 'AUCTION_WON',
            playerId: winner.id,
            message: `${winner.name} won the auction for ${tile.name} for $${finalBid}!`,
            payload: {
              tileIndex,
              tileName: tile.name,
              winnerId: winner.id,
              winnerName: winner.name,
              winnerColor: winner.color,
              winnerToken: winner.token,
              finalBid,
              oldCash,
              newCash: winner.cash,
            },
          });
        }
      } else {
        events.push({
          id: `evt-${Date.now()}-auction-unsold`,
          timestamp: Date.now(),
          type: 'AUCTION_UNSOLD',
          message: `No bids placed for ${tile.name}. It remains unowned.`,
          payload: {
            tileIndex,
            tileName: tile.name,
          },
        });
      }

      next.activeAuction = null;
      next.phase = 'turn_end';
      return { state: next, events };
    }

    case 'PAY_JAIL_FINE': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      if (!currentPlayer.inJail) {
        return { state, events: [], error: 'You are not in jail' };
      }
      if (currentPlayer.cash < 50) {
        return { state, events: [], error: 'Insufficient funds for jail fine ($50)' };
      }

      currentPlayer.cash -= 50;
      if (next.settings.freeParkingJackpot) next.freeParkingJackpotPool += 50;
      currentPlayer.inJail = false;
      currentPlayer.jailTurns = 0;

      events.push({
        id: `evt-${Date.now()}-jail-paid`,
        timestamp: Date.now(),
        type: 'JAIL_FINE_PAID',
        playerId: currentPlayer.id,
        message: `${currentPlayer.name} paid $50 fine and is released from Bodalla Police Station.`,
      });

      return { state: next, events };
    }

    case 'USE_JAIL_CARD': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      if (!currentPlayer.inJail) {
        return { state, events: [], error: 'You are not in jail' };
      }

      if (currentPlayer.jailCardsNotice > 0) {
        currentPlayer.jailCardsNotice--;
        const card = { ...COMMUNITY_NOTICE_CARDS[4] };
        next.noticeDiscard.push(card);
      } else if (currentPlayer.jailCardsKnowledge > 0) {
        currentPlayer.jailCardsKnowledge--;
        const card = { ...LOCAL_KNOWLEDGE_CARDS[8] };
        next.knowledgeDiscard.push(card);
      } else {
        return { state, events: [], error: 'No Get Out of Jail Free card available' };
      }

      currentPlayer.inJail = false;
      currentPlayer.jailTurns = 0;

      events.push({
        id: `evt-${Date.now()}-jail-card`,
        timestamp: Date.now(),
        type: 'JAIL_CARD_USED',
        playerId: currentPlayer.id,
        message: `${currentPlayer.name} used a Get Out of Bodalla Police Station Free card!`,
      });

      return { state: next, events };
    }

    case 'BUILD_HOUSE': {
      const check = canBuildHouse(next, actingPlayerId, action.tileIndex);
      if (!check.canBuild) {
        return { state, events: [], error: check.reason };
      }

      const tile = BOARD_TILES[action.tileIndex];
      const propState = next.properties[action.tileIndex];
      const player = next.players.find((p) => p.id === actingPlayerId)!;
      const houseCost = tile.property!.houseCost;

      player.cash -= houseCost;

      if (propState.houses === 4) {
        // Upgrade to hotel: 4 houses return to bank, 1 hotel taken
        propState.houses = 5;
        next.bankHousesRemaining += 4;
        next.bankHotelsRemaining -= 1;
        events.push({
          id: `evt-${Date.now()}-hotel-built`,
          timestamp: Date.now(),
          type: 'HOTEL_BUILT',
          playerId: player.id,
          message: `${player.name} built a Hotel on ${tile.name} for $${houseCost}!`,
        });
      } else {
        propState.houses += 1;
        next.bankHousesRemaining -= 1;
        events.push({
          id: `evt-${Date.now()}-house-built`,
          timestamp: Date.now(),
          type: 'HOUSE_BUILT',
          playerId: player.id,
          message: `${player.name} built house #${propState.houses} on ${tile.name} for $${houseCost}.`,
        });
      }

      return { state: next, events };
    }

    case 'SELL_HOUSE': {
      const check = canSellHouse(next, actingPlayerId, action.tileIndex);
      if (!check.canSell) {
        return { state, events: [], error: check.reason };
      }

      const tile = BOARD_TILES[action.tileIndex];
      const propState = next.properties[action.tileIndex];
      const player = next.players.find((p) => p.id === actingPlayerId)!;
      const refund = Math.floor(tile.property!.houseCost / 2);

      player.cash += refund;

      if (propState.houses === 5) {
        // Degrade hotel: hotel returned to bank, 4 houses taken from bank
        propState.houses = 4;
        next.bankHotelsRemaining += 1;
        next.bankHousesRemaining -= 4;
        events.push({
          id: `evt-${Date.now()}-hotel-sold`,
          timestamp: Date.now(),
          type: 'HOTEL_SOLD',
          playerId: player.id,
          message: `${player.name} sold Hotel on ${tile.name} for $${refund}.`,
        });
      } else {
        propState.houses -= 1;
        next.bankHousesRemaining += 1;
        events.push({
          id: `evt-${Date.now()}-house-sold`,
          timestamp: Date.now(),
          type: 'HOUSE_SOLD',
          playerId: player.id,
          message: `${player.name} sold a house on ${tile.name} for $${refund}.`,
        });
      }

      return { state: next, events };
    }

    case 'MORTGAGE_PROPERTY': {
      const check = canMortgage(next, actingPlayerId, action.tileIndex);
      if (!check.canMortgage) {
        return { state, events: [], error: check.reason };
      }

      const tile = BOARD_TILES[action.tileIndex];
      const propState = next.properties[action.tileIndex];
      const player = next.players.find((p) => p.id === actingPlayerId)!;

      const mortgageVal =
        tile.property?.mortgageValue ??
        tile.hardware?.mortgageValue ??
        tile.utility?.mortgageValue ??
        0;

      propState.isMortgaged = true;
      player.cash += mortgageVal;

      events.push({
        id: `evt-${Date.now()}-mortgage`,
        timestamp: Date.now(),
        type: 'PROPERTY_MORTGAGED',
        playerId: player.id,
        message: `${player.name} mortgaged ${tile.name} and received $${mortgageVal}.`,
      });

      return { state: next, events };
    }

    case 'UNMORTGAGE_PROPERTY': {
      const check = canUnmortgage(next, actingPlayerId, action.tileIndex);
      if (!check.canUnmortgage) {
        return { state, events: [], error: check.reason };
      }

      const tile = BOARD_TILES[action.tileIndex];
      const propState = next.properties[action.tileIndex];
      const player = next.players.find((p) => p.id === actingPlayerId)!;

      player.cash -= check.cost;
      propState.isMortgaged = false;

      events.push({
        id: `evt-${Date.now()}-unmortgage`,
        timestamp: Date.now(),
        type: 'PROPERTY_UNMORTGAGED',
        playerId: player.id,
        message: `${player.name} lifted mortgage on ${tile.name} for $${check.cost}.`,
      });

      return { state: next, events };
    }

    case 'PROPOSE_TRADE': {
      const fromPlayer = next.players.find((p) => p.id === actingPlayerId);
      const toPlayer = next.players.find((p) => p.id === action.offer.toPlayerId);

      if (!fromPlayer || !toPlayer) {
        return { state, events: [], error: 'Invalid players for trade' };
      }
      if (fromPlayer.id === toPlayer.id) {
        return { state, events: [], error: 'You cannot trade with yourself' };
      }
      const o = action.offer;
      if (
        o.offerCash <= 0 && o.requestCash <= 0 &&
        o.offerProperties.length === 0 && o.requestProperties.length === 0 &&
        o.offerJailCards <= 0 && o.requestJailCards <= 0
      ) {
        return { state, events: [], error: 'Add something to the trade first' };
      }
      const invalid = validateTradeOffer(next, { ...o, fromPlayerId: fromPlayer.id });
      if (invalid) {
        return { state, events: [], error: invalid };
      }

      // Check properties don't have houses
      for (const tIdx of [...action.offer.offerProperties, ...action.offer.requestProperties]) {
        const tile = BOARD_TILES[tIdx];
        if (tile && tile.property) {
          const groupTiles = getPropertiesInGroup(tile.property.colorGroup);
          const hasHouses = groupTiles.some((t) => (next.properties[t.index]?.houses ?? 0) > 0);
          if (hasHouses) {
            return { state, events: [], error: `Cannot trade properties while color group has buildings` };
          }
        }
      }

      const offer: TradeOffer = {
        ...action.offer,
        id: `trade-${Date.now()}`,
        createdAt: Date.now(),
      };
      next.activeTrade = offer;

      events.push({
        id: `evt-${Date.now()}-trade-propose`,
        timestamp: Date.now(),
        type: 'TRADE_PROPOSED',
        playerId: fromPlayer.id,
        message: `${fromPlayer.name} proposed a trade to ${toPlayer.name}.`,
      });

      return { state: next, events };
    }

    case 'ACCEPT_TRADE': {
      if (!next.activeTrade) {
        return { state, events: [], error: 'No active trade offer' };
      }
      if (actingPlayerId !== next.activeTrade.toPlayerId) {
        return { state, events: [], error: 'Only the recipient can accept this trade' };
      }

      const trade = next.activeTrade;
      const fromPlayer = next.players.find((p) => p.id === trade.fromPlayerId)!;
      const toPlayer = next.players.find((p) => p.id === trade.toPlayerId)!;

      // Re-validate: circumstances may have changed since the offer was made
      const invalid = validateTradeOffer(next, trade);
      if (invalid) {
        next.activeTrade = null;
        events.push({
          id: `evt-${Date.now()}-trade-void`,
          timestamp: Date.now(),
          type: 'TRADE_REJECTED',
          message: `The trade between ${fromPlayer.name} and ${toPlayer.name} was cancelled: ${invalid}`,
        });
        return { state: next, events };
      }

      // Transfer cash
      fromPlayer.cash -= trade.offerCash;
      toPlayer.cash += trade.offerCash;
      toPlayer.cash -= trade.requestCash;
      fromPlayer.cash += trade.requestCash;

      // Transfer properties
      for (const tIdx of trade.offerProperties) {
        next.properties[tIdx].ownerId = toPlayer.id;
      }
      for (const tIdx of trade.requestProperties) {
        next.properties[tIdx].ownerId = fromPlayer.id;
      }

      // Transfer jail cards
      fromPlayer.jailCardsNotice -= trade.offerJailCards;
      toPlayer.jailCardsNotice += trade.offerJailCards;
      toPlayer.jailCardsNotice -= trade.requestJailCards;
      fromPlayer.jailCardsNotice += trade.requestJailCards;

      events.push({
        id: `evt-${Date.now()}-trade-accept`,
        timestamp: Date.now(),
        type: 'TRADE_ACCEPTED',
        playerId: toPlayer.id,
        message: `${toPlayer.name} accepted the trade with ${fromPlayer.name}!`,
      });

      next.activeTrade = null;
      return { state: next, events };
    }

    case 'REJECT_TRADE': {
      if (!next.activeTrade) {
        return { state, events: [], error: 'No active trade offer' };
      }
      events.push({
        id: `evt-${Date.now()}-trade-reject`,
        timestamp: Date.now(),
        type: 'TRADE_REJECTED',
        message: 'The trade offer was rejected.',
      });
      next.activeTrade = null;
      return { state: next, events };
    }

    case 'CANCEL_TRADE': {
      if (!next.activeTrade) {
        return { state, events: [], error: 'No active trade offer' };
      }
      next.activeTrade = null;
      return { state: next, events };
    }

    case 'DISMISS_ACTIVE_CARD': {
      next.activeCard = null;
      return { state: next, events };
    }

    case 'DECLARE_BANKRUPTCY': {
      const bankruptPlayer = next.players.find((p) => p.id === actingPlayerId);
      if (!bankruptPlayer) {
        return { state, events: [], error: 'Player not found' };
      }

      bankruptPlayer.isBankrupt = true;

      // Return all properties to bank or transfer
      Object.values(next.properties).forEach((p) => {
        if (p.ownerId === bankruptPlayer.id) {
          p.ownerId = null;
          p.houses = 0;
          p.isMortgaged = false;
        }
      });

      events.push({
        id: `evt-${Date.now()}-bankrupt`,
        timestamp: Date.now(),
        type: 'BANKRUPTCY_DECLARED',
        playerId: bankruptPlayer.id,
        message: `${bankruptPlayer.name} has gone bankrupt and is eliminated!`,
      });

      const remainingPlayers = next.players.filter((p) => !p.isBankrupt);
      if (remainingPlayers.length <= 1) {
        next.phase = 'game_over';
        next.winnerPlayerId = remainingPlayers[0]?.id || null;
        events.push({
          id: `evt-${Date.now()}-win`,
          timestamp: Date.now(),
          type: 'GAME_OVER',
          playerId: next.winnerPlayerId || undefined,
          message: `${remainingPlayers[0]?.name} is the last player standing and wins Naroom-opoly!`,
        });
      } else if (actingPlayerId === currentPlayer.id) {
        const turnEvents = advanceTurn(next);
        events.push(...turnEvents);
      }

      return { state: next, events };
    }

    case 'END_TURN': {
      if (actingPlayerId !== currentPlayer.id) {
        return { state, events: [], error: 'Not your turn' };
      }
      if (!next.hasRolled && !currentPlayer.inJail) {
        return { state, events: [], error: 'You must roll the dice before ending your turn' };
      }
      if (currentPlayer.cash < 0) {
        return { state, events: [], error: 'You have negative cash! Mortgage properties, sell houses, or declare bankruptcy' };
      }

      const turnEvents = advanceTurn(next);
      events.push(...turnEvents);

      return { state: next, events };
    }

    case 'KICK_PLAYER': {
      const host = next.players.find((p) => p.isHost);
      if (!host || host.id !== actingPlayerId) {
        return { state, events: [], error: 'Only the host can kick players' };
      }

      const target = next.players.find((p) => p.id === action.targetPlayerId);
      if (!target) {
        return { state, events: [], error: 'Target player not found' };
      }

      target.isBankrupt = true;
      Object.values(next.properties).forEach((p) => {
        if (p.ownerId === target.id) {
          p.ownerId = null;
          p.houses = 0;
          p.isMortgaged = false;
        }
      });

      events.push({
        id: `evt-${Date.now()}-kicked`,
        timestamp: Date.now(),
        type: 'PLAYER_KICKED',
        playerId: target.id,
        message: `${target.name} was removed by the host.`,
      });

      if (target.id === currentPlayer.id) {
        const turnEvents = advanceTurn(next);
        events.push(...turnEvents);
      }

      return { state: next, events };
    }

    default:
      return { state, events: [], error: 'Unknown action' };
  }
}
