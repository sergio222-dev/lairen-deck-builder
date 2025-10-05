import { CARD_TYPES }                  from '~/models/CardTypes';
import type { DeckCreationStoreState } from '~/UI/deck/models/deck.store.model';

// TODO this is not ordering the cards, the output text would be unsorted
export function parseToText(UIState: DeckCreationStoreState) {

  // calculate total of main deck

  const realmTotal = UIState.quantityInMainDeck;

  const treasureTotal = UIState.treasurePoints;

  const sideTotal = UIState.quantityInSideDeck;

  let text = `
Reino: (total: ${realmTotal})
`;

  Object.entries(UIState.cardInDeck).forEach(([id, card]) => {
    const cardData = UIState.cardStack[id];
    if (cardData.type === CARD_TYPES.TESORO || card.quantity === 0) {
      return;
    }
    text += `${cardData.name} x${card.quantity}
`;
  });

  text += `

Bóveda: (total: ${treasureTotal})
`;

  Object.entries(UIState.cardInDeck).forEach(([id, card]) => {
    const cardData = UIState.cardStack[id];
    if (cardData.type !== CARD_TYPES.TESORO) {
      return;
    }
    text += `${cardData.name} x${card.quantity}
`;
  });

  text += `

Side Deck: (total: ${sideTotal})
`;

  Object.entries(UIState.cardInDeck).forEach(([id, card]) => {
    const cardData = UIState.cardStack[id];

    if (cardData.type === CARD_TYPES.TESORO || card.quantityInSide === 0) {
      return;
    }
    text += `${cardData.name} x${card.quantityInSide}
`;
  });

  return text;
}
