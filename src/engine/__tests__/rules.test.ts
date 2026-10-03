import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialGameState,
  executeGameAction,
  calculateRent,
  canBuildHouse,
  canSellHouse,
  canMortgage,
  canUnmortgage,
  ownsFullGroup,
} from '../rules';
import { GameState } from '../types';
import { BOARD_TILES } from '../../data/boardData';

describe('Naroom-opoly Rules Engine', () => {
  let state: GameState;
  const p1Id = 'player-1';
  const p2Id = 'player-2';
  const p3Id = 'player-3';

  beforeEach(() => {
    state = createInitialGameState('test-game', 'TEST1', [
      { id: p1Id, name: 'Alice', token: 'whale', isHost: true },
      { id: p2Id, name: 'Bob', token: 'pelican' },
      { id: p3Id, name: 'Charlie', token: 'oyster' },
    ]);
  });

  describe('1. Movement and Passing GO', () => {
    it('moves player by dice roll and collects $200 on passing GO', () => {
      state.players[0].position = 38;
      const initialCash = state.players[0].cash;

      // Roll 5 (moves from 38 to 3: passes 0)
      const res = executeGameAction(state, { type: 'ROLL_DICE', forcedDice: [2, 3] }, p1Id);
      expect(res.state.players[0].position).toBe(3);
      expect(res.state.players[0].cash).toBe(initialCash + 200);
    });

    it('sends player to Bodalla Police Station when rolling 3 consecutive doubles', () => {
      state.players[0].position = 3;
      let current = state;
      // Double 1: moves from 3 to 5 (Bunnings BB)
      let res = executeGameAction(current, { type: 'ROLL_DICE', forcedDice: [1, 1] }, p1Id);
      current = res.state;
      expect(current.consecutiveDoubles).toBe(1);
      expect(current.players[0].inJail).toBe(false);

      // Double 2
      res = executeGameAction(current, { type: 'ROLL_DICE', forcedDice: [2, 2] }, p1Id);
      current = res.state;
      expect(current.consecutiveDoubles).toBe(2);
      expect(current.players[0].inJail).toBe(false);

      // Double 3 -> Jail!
      res = executeGameAction(current, { type: 'ROLL_DICE', forcedDice: [3, 3] }, p1Id);
      current = res.state;
      expect(current.players[0].inJail).toBe(true);
      expect(current.players[0].position).toBe(10);
    });

    it('sends player to jail when landing on Go to Bodalla Police Station (tile 30)', () => {
      state.players[0].position = 25;
      const res = executeGameAction(state, { type: 'ROLL_DICE', forcedDice: [2, 3] }, p1Id); // roll 5 -> tile 30
      expect(res.state.players[0].position).toBe(10);
      expect(res.state.players[0].inJail).toBe(true);
    });
  });

  describe('2. Rent Calculations', () => {
    it('calculates single unimproved property rent', () => {
      // Tile 1: Clyde River (Brown, base rent $2)
      state.properties[1].ownerId = p1Id;
      expect(calculateRent(state, 1)).toBe(2);
    });

    it('calculates double rent for complete unimproved color group', () => {
      // Brown group: Tile 1 (Clyde River, base $2) and Tile 3 (Batemans Bay Bridge, base $4)
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;
      expect(calculateRent(state, 1)).toBe(4); // 2 * 2 = 4
      expect(calculateRent(state, 3)).toBe(8); // 4 * 2 = 8
    });

    it('calculates improved house and hotel rent', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;

      // 1 house on Clyde River: rent is $10
      state.properties[1].houses = 1;
      expect(calculateRent(state, 1)).toBe(10);

      // Hotel (5) on Clyde River: rent is $250
      state.properties[1].houses = 5;
      expect(calculateRent(state, 1)).toBe(250);
    });

    it('awards $0 rent if property is mortgaged', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[1].isMortgaged = true;
      expect(calculateRent(state, 1)).toBe(0);
    });

    it('calculates hardware store rent based on count owned (25, 50, 100, 200)', () => {
      const hw1 = 5;  // Bunnings Batemans Bay
      const hw2 = 15; // Camerons Moruya
      const hw3 = 25; // Woody's
      const hw4 = 35; // Mitre 10 Glasshouse Rocks

      state.properties[hw1].ownerId = p1Id;
      expect(calculateRent(state, hw1)).toBe(25);

      state.properties[hw2].ownerId = p1Id;
      expect(calculateRent(state, hw1)).toBe(50);
      expect(calculateRent(state, hw2)).toBe(50);

      state.properties[hw3].ownerId = p1Id;
      expect(calculateRent(state, hw1)).toBe(100);

      state.properties[hw4].ownerId = p1Id;
      expect(calculateRent(state, hw1)).toBe(200);
    });

    it('calculates utility rent based on 4x or 10x dice roll', () => {
      const util1 = 12; // Eurobodalla Shire Water
      const util2 = 28; // Essential Energy

      state.properties[util1].ownerId = p1Id;
      // 1 utility owned: 4x dice roll
      expect(calculateRent(state, util1, 7)).toBe(28);

      state.properties[util2].ownerId = p1Id;
      // 2 utilities owned: 10x dice roll
      expect(calculateRent(state, util1, 7)).toBe(70);
      expect(calculateRent(state, util2, 8)).toBe(80);
    });
  });

  describe('3. Even Building Rules', () => {
    it('requires owning full color group before building', () => {
      state.properties[1].ownerId = p1Id;
      // Player 1 only owns 1 of 2 brown properties
      const check = canBuildHouse(state, p1Id, 1);
      expect(check.canBuild).toBe(false);
      expect(check.reason).toContain('entire color group');
    });

    it('enforces even building rule across the group', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;

      // Can build 1st house on tile 1
      expect(canBuildHouse(state, p1Id, 1).canBuild).toBe(true);

      // Give tile 1 one house
      state.properties[1].houses = 1;

      // Cannot build 2nd house on tile 1 until tile 3 also has 1 house
      const checkSecond = canBuildHouse(state, p1Id, 1);
      expect(checkSecond.canBuild).toBe(false);
      expect(checkSecond.reason).toContain('evenly');

      // But can build on tile 3!
      expect(canBuildHouse(state, p1Id, 3).canBuild).toBe(true);
    });

    it('deducts cash and bank inventory when building houses and hotels', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;

      const initialCash = state.players[0].cash;
      const initialBankHouses = state.bankHousesRemaining;

      // Build house on Clyde River (cost $50)
      const res = executeGameAction(state, { type: 'BUILD_HOUSE', tileIndex: 1 }, p1Id);
      expect(res.state.properties[1].houses).toBe(1);
      expect(res.state.players[0].cash).toBe(initialCash - 50);
      expect(res.state.bankHousesRemaining).toBe(initialBankHouses - 1);
    });

    it('enforces even selling rule and refunds 50% house cost', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;
      state.properties[1].houses = 2;
      state.properties[3].houses = 1;

      // Cannot sell from tile 3 because tile 1 has more houses
      expect(canSellHouse(state, p1Id, 3).canSell).toBe(false);

      // Can sell from tile 1
      expect(canSellHouse(state, p1Id, 1).canSell).toBe(true);

      const cashBefore = state.players[0].cash;
      const res = executeGameAction(state, { type: 'SELL_HOUSE', tileIndex: 1 }, p1Id);
      expect(res.state.properties[1].houses).toBe(1);
      expect(res.state.players[0].cash).toBe(cashBefore + 25); // $50 / 2 = $25
    });
  });

  describe('4. Mortgaging & Unmortgaging', () => {
    it('prevents mortgaging if any property in color group has houses', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;
      state.properties[1].houses = 1;

      const check = canMortgage(state, p1Id, 3);
      expect(check.canMortgage).toBe(false);
      expect(check.reason).toContain('sell all buildings');
    });

    it('mortgages property, gives cash, and unmortgages with 10% interest', () => {
      state.properties[1].ownerId = p1Id;
      const cashBefore = state.players[0].cash;
      const mortgageVal = BOARD_TILES[1].property!.mortgageValue; // 30

      // Mortgage
      let res = executeGameAction(state, { type: 'MORTGAGE_PROPERTY', tileIndex: 1 }, p1Id);
      expect(res.state.properties[1].isMortgaged).toBe(true);
      expect(res.state.players[0].cash).toBe(cashBefore + mortgageVal);

      // Unmortgage cost = 30 + ceil(3) = 33
      const checkUnmortgage = canUnmortgage(res.state, p1Id, 1);
      expect(checkUnmortgage.canUnmortgage).toBe(true);
      expect(checkUnmortgage.cost).toBe(33);

      res = executeGameAction(res.state, { type: 'UNMORTGAGE_PROPERTY', tileIndex: 1 }, p1Id);
      expect(res.state.properties[1].isMortgaged).toBe(false);
      expect(res.state.players[0].cash).toBe(cashBefore + mortgageVal - 33);
    });
  });

  describe('5. Jail Mechanics', () => {
    beforeEach(() => {
      state.players[0].inJail = true;
      state.players[0].position = 10;
    });

    it('allows player to pay $50 fine to get out of jail', () => {
      const initialCash = state.players[0].cash;
      const res = executeGameAction(state, { type: 'PAY_JAIL_FINE' }, p1Id);
      expect(res.state.players[0].inJail).toBe(false);
      expect(res.state.players[0].cash).toBe(initialCash - 50);
    });

    it('allows player to use Get Out of Jail Free card', () => {
      state.players[0].jailCardsNotice = 1;
      const res = executeGameAction(state, { type: 'USE_JAIL_CARD' }, p1Id);
      expect(res.state.players[0].inJail).toBe(false);
      expect(res.state.players[0].jailCardsNotice).toBe(0);
    });

    it('releases player from jail upon rolling doubles', () => {
      const res = executeGameAction(state, { type: 'ROLL_DICE', forcedDice: [4, 4] }, p1Id);
      expect(res.state.players[0].inJail).toBe(false);
      expect(res.state.players[0].position).toBe(18); // 10 + 8
    });

    it('forces player to pay $50 after failing 3 doubles attempts', () => {
      state.players[0].jailTurns = 2; // on 3rd attempt
      const cashBefore = state.players[0].cash;
      const res = executeGameAction(state, { type: 'ROLL_DICE', forcedDice: [2, 3] }, p1Id);
      expect(res.state.players[0].inJail).toBe(false);
      expect(res.state.players[0].cash).toBe(cashBefore - 50);
      expect(res.state.players[0].position).toBe(15); // 10 + 5
    });
  });

  describe('6. Auctions', () => {
    it('initiates auction when player declines to buy unowned property', () => {
      state.players[0].position = 1; // Clyde River
      state.phase = 'rolled';

      const res = executeGameAction(state, { type: 'DECLINE_PROPERTY' }, p1Id);
      expect(res.state.phase).toBe('auction');
      expect(res.state.activeAuction).not.toBeNull();
      expect(res.state.activeAuction?.tileIndex).toBe(1);
    });

    it('conducts bids and awards property to highest bidder when others pass', () => {
      state.players[0].position = 1;
      state.phase = 'rolled';
      let current = executeGameAction(state, { type: 'DECLINE_PROPERTY' }, p1Id).state;

      // P2 bids $50
      current = executeGameAction(current, { type: 'PLACE_AUCTION_BID', amount: 50 }, p2Id).state;
      expect(current.activeAuction?.highestBidderId).toBe(p2Id);
      expect(current.activeAuction?.currentBid).toBe(50);

      // P1 passes
      current = executeGameAction(current, { type: 'PASS_AUCTION' }, p1Id).state;
      // P3 passes
      current = executeGameAction(current, { type: 'PASS_AUCTION' }, p3Id).state;

      // Auction concluded: P2 wins!
      expect(current.phase).toBe('turn_end');
      expect(current.activeAuction).toBeNull();
      expect(current.properties[1].ownerId).toBe(p2Id);
      expect(current.players[1].cash).toBe(1500 - 50);
    });
  });

  describe('7. Trading', () => {
    it('executes valid trade between two players', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[6].ownerId = p2Id;

      // P1 proposes: gives Clyde River (1) + $100 for Corrigans Beach (6)
      let res = executeGameAction(
        state,
        {
          type: 'PROPOSE_TRADE',
          offer: {
            fromPlayerId: p1Id,
            toPlayerId: p2Id,
            offerCash: 100,
            offerProperties: [1],
            offerJailCards: 0,
            requestCash: 0,
            requestProperties: [6],
            requestJailCards: 0,
          },
        },
        p1Id
      );

      expect(res.state.activeTrade).not.toBeNull();

      // P2 accepts
      res = executeGameAction(res.state, { type: 'ACCEPT_TRADE' }, p2Id);
      expect(res.state.activeTrade).toBeNull();
      expect(res.state.properties[1].ownerId).toBe(p2Id);
      expect(res.state.properties[6].ownerId).toBe(p1Id);
      expect(res.state.players[0].cash).toBe(1500 - 100);
      expect(res.state.players[1].cash).toBe(1500 + 100);
    });
  });

  describe('8. Bankruptcy & Win Condition', () => {
    it('eliminates bankrupt player and declares winner when one remains', () => {
      // Eliminate P2
      let current = executeGameAction(state, { type: 'DECLARE_BANKRUPTCY' }, p2Id).state;
      expect(current.players[1].isBankrupt).toBe(true);
      expect(current.phase).not.toBe('game_over');

      // Eliminate P3
      current = executeGameAction(current, { type: 'DECLARE_BANKRUPTCY' }, p3Id).state;
      expect(current.players[2].isBankrupt).toBe(true);
      expect(current.phase).toBe('game_over');
      expect(current.winnerPlayerId).toBe(p1Id);
    });
  });

  describe('9. Cards & Jackpots', () => {
    it('awards Free Parking jackpot when enabled', () => {
      state.settings.freeParkingJackpot = true;
      state.freeParkingJackpotPool = 350;
      state.players[0].position = 17;

      // Roll 3 to land on Free Parking (tile 20)
      const res = executeGameAction(state, { type: 'ROLL_DICE', forcedDice: [1, 2] }, p1Id);
      expect(res.state.players[0].position).toBe(20);
      expect(res.state.players[0].cash).toBe(1500 + 350);
      expect(res.state.freeParkingJackpotPool).toBe(0);
    });

    it('prevents building if bank has run out of houses', () => {
      state.properties[1].ownerId = p1Id;
      state.properties[3].ownerId = p1Id;
      state.bankHousesRemaining = 0; // Bank is dry!

      const check = canBuildHouse(state, p1Id, 1);
      expect(check.canBuild).toBe(false);
      expect(check.reason).toContain('No houses left in the bank');
    });
  });

  describe('10. Auction System & Conclusion', () => {
    it('initiates an auction on declined property and resolves when bidders pass', () => {
      state.players[0].position = 1; // Nelligen ($60)
      state.phase = 'rolled';

      // P1 declines property
      let res = executeGameAction(state, { type: 'DECLINE_PROPERTY' }, p1Id);
      expect(res.state.phase).toBe('auction');
      expect(res.state.activeAuction).not.toBeNull();
      expect(res.state.activeAuction?.activeBidderIds).toEqual([p1Id, p2Id, p3Id]);

      // P2 bids $10
      res = executeGameAction(res.state, { type: 'PLACE_AUCTION_BID', amount: 10 }, p2Id);
      expect(res.state.activeAuction?.currentBid).toBe(10);
      expect(res.state.activeAuction?.highestBidderId).toBe(p2Id);
      expect(res.state.activeAuction?.minNextBid).toBe(20);

      // P3 passes
      res = executeGameAction(res.state, { type: 'PASS_AUCTION' }, p3Id);
      expect(res.state.activeAuction?.activeBidderIds).toEqual([p1Id, p2Id]);

      // P1 passes -> Only P2 remains with highest bid -> Auction finishes!
      res = executeGameAction(res.state, { type: 'PASS_AUCTION' }, p1Id);
      expect(res.state.phase).toBe('turn_end');
      expect(res.state.activeAuction).toBeNull();
      expect(res.state.properties[1].ownerId).toBe(p2Id);
      expect(res.state.players[1].cash).toBe(1500 - 10);
    });

    it('concludes auction automatically via CONCLUDE_AUCTION when timer expires', () => {
      state.players[0].position = 6; // Surf Beach ($100)
      state.phase = 'rolled';

      let res = executeGameAction(state, { type: 'DECLINE_PROPERTY' }, p1Id);
      expect(res.state.phase).toBe('auction');

      // P3 bids $50
      res = executeGameAction(res.state, { type: 'PLACE_AUCTION_BID', amount: 50 }, p3Id);
      expect(res.state.activeAuction?.highestBidderId).toBe(p3Id);

      // Timer expires, CONCLUDE_AUCTION is called
      res = executeGameAction(res.state, { type: 'CONCLUDE_AUCTION' }, p1Id);
      expect(res.state.phase).toBe('turn_end');
      expect(res.state.activeAuction).toBeNull();
      expect(res.state.properties[6].ownerId).toBe(p3Id);
      expect(res.state.players[2].cash).toBe(1500 - 50);
    });

    it('marks property unsold when CONCLUDE_AUCTION is called with no bids', () => {
      state.players[0].position = 6; // Surf Beach ($100)
      state.phase = 'rolled';

      let res = executeGameAction(state, { type: 'DECLINE_PROPERTY' }, p1Id);
      expect(res.state.phase).toBe('auction');

      // No bids placed, timer runs out
      res = executeGameAction(res.state, { type: 'CONCLUDE_AUCTION' }, p1Id);
      expect(res.state.phase).toBe('turn_end');
      expect(res.state.activeAuction).toBeNull();
      expect(res.state.properties[6].ownerId).toBeNull();
    });
  });
});

