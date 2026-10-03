import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialGameState, executeGameAction } from '../rules';
import { getBotAction } from '../bot';
import { GameState } from '../types';

describe('Trading', () => {
  let state: GameState;
  const human = 'h1';
  const bot = 'b1';

  beforeEach(() => {
    state = createInitialGameState('trade-game', 'TRD01', [
      { id: human, name: 'Alice', token: 'whale', isHost: true },
      { id: bot, name: 'Botty', token: 'pelican', isBot: true },
    ]);
    state.properties[1].ownerId = human;
    state.properties[3].ownerId = bot;
  });

  const offer = (over: object = {}) => ({
    type: 'PROPOSE_TRADE' as const,
    offer: {
      fromPlayerId: human,
      toPlayerId: bot,
      offerCash: 0,
      offerProperties: [1],
      offerJailCards: 0,
      requestCash: 0,
      requestProperties: [3],
      requestJailCards: 0,
      ...over,
    },
  });

  it('accepts a valid proposal', () => {
    const res = executeGameAction(state, offer(), human);
    expect(res.error).toBeUndefined();
    expect(res.state.activeTrade?.toPlayerId).toBe(bot);
  });

  it('rejects empty trades and trades for properties the partner does not own', () => {
    expect(
      executeGameAction(state, offer({ offerProperties: [], requestProperties: [] }), human).error
    ).toBeTruthy();
    expect(executeGameAction(state, offer({ requestProperties: [6] }), human).error).toBeTruthy();
  });

  it('bot answers a trade addressed to it, and accepting swaps ownership', () => {
    // Bot receives a lopsided gift offer: it should accept
    const res = executeGameAction(state, offer({ requestProperties: [], offerCash: 100 }), human);
    const botAction = getBotAction(res.state, bot);
    expect(botAction?.type).toBe('ACCEPT_TRADE');
    const done = executeGameAction(res.state, botAction!, bot);
    expect(done.state.activeTrade).toBeNull();
    expect(done.state.properties[1].ownerId).toBe(bot);
  });

  it('bot rejects an unfavourable trade', () => {
    const res = executeGameAction(state, offer({ offerProperties: [], requestProperties: [3] }), human);
    expect(getBotAction(res.state, bot)?.type).toBe('REJECT_TRADE');
  });
});
