import { GameCard, LOCAL_KNOWLEDGE_CARDS, COMMUNITY_NOTICE_CARDS } from '../data/boardData';

/**
 * Fisher-Yates shuffle algorithm using provided or default RNG
 */
export function shuffleCards(cards: GameCard[], rng = Math.random): GameCard[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function initializeDecks(rng = Math.random) {
  return {
    noticeDeck: shuffleCards(COMMUNITY_NOTICE_CARDS, rng),
    noticeDiscard: [] as GameCard[],
    knowledgeDeck: shuffleCards(LOCAL_KNOWLEDGE_CARDS, rng),
    knowledgeDiscard: [] as GameCard[],
  };
}

export function drawCard(
  deck: GameCard[],
  discard: GameCard[],
  rng = Math.random
): { card: GameCard; nextDeck: GameCard[]; nextDiscard: GameCard[] } {
  let activeDeck = [...deck];
  let activeDiscard = [...discard];

  if (activeDeck.length === 0) {
    if (activeDiscard.length === 0) {
      throw new Error('Both deck and discard piles are empty');
    }
    activeDeck = shuffleCards(activeDiscard, rng);
    activeDiscard = [];
  }

  const card = activeDeck.shift()!;
  return { card, nextDeck: activeDeck, nextDiscard: activeDiscard };
}
