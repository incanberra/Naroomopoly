import { GameState, GameAction, PlayerState } from './types';
import { BOARD_TILES, COLOR_GROUP_CONFIG, ColorGroup } from '../data/boardData';
import { canBuildHouse, canMortgage, getCurrentPlayer, ownsFullGroup } from './rules';

export function getBotAction(state: GameState, botPlayerId: string): GameAction | null {
  const currentPlayer = getCurrentPlayer(state);
  const isTurn = currentPlayer.id === botPlayerId;

  // 1. Handle Auction (can happen on or off turn)
  if (state.phase === 'auction' && state.activeAuction) {
    const isBidder = state.activeAuction.activeBidderIds.includes(botPlayerId);
    if (!isBidder) return null;

    // Check if bot is already the highest bidder
    if (state.activeAuction.highestBidderId === botPlayerId) {
      return null;
    }

    const tile = BOARD_TILES[state.activeAuction.tileIndex];
    const bot = state.players.find((p) => p.id === botPlayerId);
    if (!bot || !tile) return { type: 'PASS_AUCTION' };

    const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? 100;
    const maxBotWillPay = Math.min(price * 1.1, bot.cash - 100);

    if (state.activeAuction.minNextBid <= maxBotWillPay) {
      return { type: 'PLACE_AUCTION_BID', amount: state.activeAuction.minNextBid };
    } else {
      return { type: 'PASS_AUCTION' };
    }
  }

  // 2. Respond to Trade Offer if bot is recipient
  if (state.activeTrade && state.activeTrade.toPlayerId === botPlayerId) {
    // For simplicity, reject unfavorable trades or accept reasonable ones
    return { type: 'REJECT_TRADE' };
  }

  // If not bot's turn, do nothing else
  if (!isTurn) return null;

  // 3. Dismiss active card if any
  if (state.activeCard) {
    return { type: 'DISMISS_ACTIVE_CARD' };
  }

  // 4. Handle negative cash / debt
  if (currentPlayer.cash < 0) {
    // Try mortgaging unbuilt properties
    for (const [tileIdxStr, prop] of Object.entries(state.properties)) {
      const tileIndex = Number(tileIdxStr);
      if (prop.ownerId === botPlayerId && !prop.isMortgaged) {
        const canM = canMortgage(state, botPlayerId, tileIndex);
        if (canM.canMortgage) {
          return { type: 'MORTGAGE_PROPERTY', tileIndex };
        }
      }
    }
    // If still negative and cannot mortgage, declare bankruptcy
    return { type: 'DECLARE_BANKRUPTCY' };
  }

  // 5. Turn Start: Jail Handling or Roll Dice
  if (state.phase === 'turn_start') {
    if (currentPlayer.inJail) {
      if (currentPlayer.jailCardsNotice > 0 || currentPlayer.jailCardsKnowledge > 0) {
        return { type: 'USE_JAIL_CARD' };
      }
      if (currentPlayer.cash > 300) {
        return { type: 'PAY_JAIL_FINE' };
      }
    }
    return { type: 'ROLL_DICE' };
  }

  // 6. Buying property on landing
  if (state.phase === 'rolled') {
    const tile = BOARD_TILES[currentPlayer.position];
    const price = tile.property?.price ?? tile.hardware?.price ?? tile.utility?.price ?? 0;

    // Bot buys if it leaves at least $100 buffer
    if (price > 0 && currentPlayer.cash >= price + 100) {
      return { type: 'BUY_PROPERTY' };
    } else {
      return { type: 'DECLINE_PROPERTY' };
    }
  }

  // 7. Turn End: Develop houses if plenty of cash, then end turn
  if (state.phase === 'turn_end') {
    // Check if bot can build houses on any monopolies
    if (currentPlayer.cash > 400) {
      for (const [tileIdxStr, prop] of Object.entries(state.properties)) {
        const tileIndex = Number(tileIdxStr);
        if (prop.ownerId === botPlayerId) {
          const check = canBuildHouse(state, botPlayerId, tileIndex);
          if (check.canBuild) {
            return { type: 'BUILD_HOUSE', tileIndex };
          }
        }
      }
    }

    // If doubles rolled and haven't finished rolling sequence, roll again
    if (!state.hasRolled) {
      return { type: 'ROLL_DICE' };
    }

    return { type: 'END_TURN' };
  }

  return null;
}
