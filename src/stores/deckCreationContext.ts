import { $, createContextId, QRL, useStore } from '@builder.io/qwik';
import { z }                                 from '@builder.io/qwik-city';
import { saveDeck }                          from '~/features/decks/server/saveDeck';
import { Card }                              from '~/models/Card';
import { Deck }                              from '~/models/Deck';
import { createDeckRequest }                 from '~/models/schemes/createDeckRequest';

export interface DeckCreationContextState {
  deckData: Deck,
  addCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  removeCard: QRL<(this: DeckCreationContextState, card: Card, side?: boolean) => Promise<void>>;
  createDeck: QRL<(this: DeckCreationContextState) => Promise<void>>;
}

const initialDeckData: Deck = {
  id:           0,
  name:         '',
  description:  '',
  isPrivate:    false,
  likes:        0,
  masterDeck:   {
    id:    0,
    cards: []
  },
  sideDeck:     {
    id:    0,
    cards: []
  },
  treasureDeck: {
    id:    0,
    cards: []
  }
};

export const useDeckCreationStore = (deckData?: Deck) => {
  return useStore<DeckCreationContextState>({
    deckData:   {
      ...(deckData ?? initialDeckData)
    },
    addCard:    $(async function(this, card, side = false) {
      if (side) {
        // check if the card is already in the side
        const index = this.deckData.sideDeck.cards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          this.deckData.sideDeck.cards[index].quantity++;
        } else {
          this.deckData.sideDeck.cards.push({ id: card.id, quantity: 1 });
        }
      } else {
        // if the card is a treasure, add to treasures
        if (card.type === 'TESORO') {
          // check if the card is already in the treasures
          const index = this.deckData.treasureDeck.cards.findIndex((c) => c.id === card.id);
          if (index !== -1) {
            this.deckData.treasureDeck.cards[index].quantity++;
          } else {
            this.deckData.treasureDeck.cards.push({ id: card.id, quantity: 1 });
          }
        } else {
          // check if the card is already in the deck
          const index = this.deckData.masterDeck.cards.findIndex((c) => c.id === card.id);
          if (index !== -1) {
            this.deckData.masterDeck.cards[index].quantity++;
          } else {
            this.deckData.masterDeck.cards.push({ id: card.id, quantity: 1 });
          }
        }
      }
    }),
    removeCard: $(async function(this, card, side = false) {
      // just remove one copy
      if (side) {
        const index = this.deckData.sideDeck.cards.findIndex((c) => c.id === card.id);
        if (index === -1) return;
        this.deckData.sideDeck.cards[index].quantity--;
        if (this.deckData.sideDeck.cards[index].quantity === 0) {
          this.deckData.sideDeck.cards = this.deckData.sideDeck.cards.filter((_, i) => i !== index);
        }
      } else {
        // if the card is a treasure, remove from treasures
        if (card.type === 'TESORO') {
          const index = this.deckData.treasureDeck.cards.findIndex((c) => c.id === card.id);
          if (index === -1) return;
          this.deckData.treasureDeck.cards[index].quantity--;
          if (this.deckData.treasureDeck.cards[index].quantity === 0) {
            this.deckData.treasureDeck.cards = this.deckData.treasureDeck.cards.filter((_, i) => i !== index);
          }
          return;
        }
        const index = this.deckData.masterDeck.cards.findIndex((c) => c.id === card.id);
        console.log(card);
        console.log(this.deckData.masterDeck.cards);
        if (index === -1) return;
        this.deckData.masterDeck.cards[index].quantity--;
        if (this.deckData.masterDeck.cards[index].quantity === 0) {
          this.deckData.masterDeck.cards = this.deckData.masterDeck.cards.filter((_, i) => i !== index);
        }
      }
    }),
    createDeck: $(async function(this) {
      const payload: z.infer<typeof createDeckRequest> = {
        name:        this.deckData.name,
        description: this.deckData.description,
        isPrivate:   this.deckData.isPrivate,
        deck:        this.deckData.masterDeck.cards,
        side:        this.deckData.sideDeck.cards,
        treasures:   this.deckData.treasureDeck.cards,
        ...this.deckData.id > 0 ? { id: this.deckData.id } : {}
      };

      const result = await saveDeck(payload);

      if (this.deckData.id === 0 && result > 0) {
        this.deckData.id = result;
      }
    })
  });
};

export const DeckCreationContext = createContextId<DeckCreationContextState>('deck-creation-context');
