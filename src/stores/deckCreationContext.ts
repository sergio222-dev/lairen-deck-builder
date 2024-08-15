import { $, createContextId, useStore }  from '@builder.io/qwik';
import { saveDeck }                      from '~/features/createDeck/server/saveDeck';
import { fetchDeckImport }               from "~/features/importer/server/fetchDeckImport";
import type { DeckState }                from "~/models/Deck";
import type { DeckCreationContextState } from "~/stores/models/DeckCrationModels";
import { parseToImportCardsItem }        from "~/utils/parser";

const initialDeckData: DeckState = {
  id:           0,
  name:         '',
  description:  '',
  isPrivate:    false,
  likes:        0,
  masterDeck:   {},
  sideDeck:     {},
  treasureDeck: {},
}

export const useDeckCreationStore = (deckData?: DeckState) => {
  return useStore<DeckCreationContextState>({
    deckData:     {
      ...(deckData ?? initialDeckData)
    },
    addCard:      $(async function (this, card, side = false) {
      if (side) {
        // check if the card is already in the side
        const cardInSideDeck = this.deckData.sideDeck[card.id];

        if (cardInSideDeck) {
          cardInSideDeck.quantity++;
        } else {
          this.deckData.sideDeck[card.id] = {
            ...card,
            quantity: 1
          }
        }
      } else {
        // if the card is a treasure, add to treasures
        // TODO use constant here
        if (card.type === 'TESORO') {
          // check if the card is already in the treasures
          const cardInTreasureDeck = this.deckData.treasureDeck[card.id];

          if (cardInTreasureDeck) {
            cardInTreasureDeck.quantity++;
          } else {
            this.deckData.treasureDeck[card.id] = {
              ...card,
              quantity: 1
            }
          }
        } else {
          // check if the card is already in the deck
          const cardInMasterDeck = this.deckData.masterDeck[card.id];

          if (cardInMasterDeck) {
            cardInMasterDeck.quantity++;
          } else {
            this.deckData.masterDeck[card.id] = {
              ...card,
              quantity: 1
            }
          }
        }
      }
    }),
    setSplashArt: $(async function (this, splashArt, cardId) {
      this.deckData.splashArt   = splashArt;
      this.deckData.splashArtId = cardId;
    }),
    removeCard:   $(async function (this, card, side = false) {
      // just remove one copy
      if (side) {
        const cardInSideDeck = this.deckData.sideDeck[card.id];

        if (cardInSideDeck) {
          cardInSideDeck.quantity--;
          if (cardInSideDeck.quantity === 0) {
            delete this.deckData.sideDeck[card.id];
          }
        }
      } else {
        // if the card is a treasure, remove from treasures
        if (card.type === 'TESORO') {

          const cardInTreasureDeck = this.deckData.treasureDeck[card.id];

          if (cardInTreasureDeck) {
            cardInTreasureDeck.quantity--;
            if (cardInTreasureDeck.quantity === 0) {
              delete this.deckData.treasureDeck[card.id];
            }
          }

          return;
        }

        const cardInMasterDeck = this.deckData.masterDeck[card.id];

        if (cardInMasterDeck) {
          cardInMasterDeck.quantity--;
          if (cardInMasterDeck.quantity === 0) {
            delete this.deckData.masterDeck[card.id];
          }
        }
      }
    }),
    createDeck:   $(async function (this) {
      const payload: DeckState = {
        ...this.deckData,
      };

      const result = await saveDeck(payload);

      if (this.deckData.id === 0 && result > 0) {
        this.deckData.id = result;
      }

      return result;
    }),
    cleanDeck:    $(async function (this) {
      this.deckData = {
        ...this.deckData,
        masterDeck:   {},
        sideDeck:     {},
        treasureDeck: {},
      };
    }),
    importDeck:   $(async function (this, deckString) {
      const deck = await fetchDeckImport(parseToImportCardsItem(deckString));

      this.deckData = {
        ...this.deckData,
        masterDeck:   deck.masterDeck,
        sideDeck:     deck.sideDeck,
        treasureDeck: deck.treasureDeck,
      };
    }),
  });
};

export const DeckCreationContext = createContextId<DeckCreationContextState>('deck-creation-context');
