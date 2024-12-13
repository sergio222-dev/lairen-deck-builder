import { $, createContextId, useStore } from "@builder.io/qwik";
import { deleteDeck } from "~/features/createDeck/server/deleteDeck";
import { saveDeck } from "~/features/createDeck/server/saveDeck";
import { fetchDeckImport } from "~/features/importer/server/fetchDeckImport";
import type { DeckCard, DeckState } from "~/models/Deck";
import { useUnitTypeLoader }        from "~/providers/loaders/cards";
import type { DeckCreationContextState } from "~/stores/models/DeckCrationModels";
import { parseToImportCardsItem } from "~/utils/parser";

const initialDeckData: DeckState = {
  id: 0,
  name: "",
  description: "",
  isPrivate: false,
  likes: 0,
  masterDeck: {},
  sideDeck: {},
  treasureDeck: {},
  subType1: null,
  subType2: null,
};

export const useDeckCreationStore = (deckData?: DeckState) => {
  return useStore<DeckCreationContextState>({
    deckData: {
      ...(deckData ?? initialDeckData),
    },
    view: "simple",
    isDeckValid: false,
    isDeckIgnored: true,
    types: useUnitTypeLoader(),

    validateDeck: $(async function (this) {
      const mainSubtype = this.deckData.subType1;
      const secondarySubtype = this.deckData.subType2;
      const masterDeckCards = Object.values(this.deckData.masterDeck);

      this.isDeckValid = false;
      this.isDeckIgnored = false;

      if (!mainSubtype && !secondarySubtype) {
        this.isDeckIgnored = true;
        return;
      }

      const totalCards = masterDeckCards.reduce((sum, card) => sum + card.quantity, 0);
      if (totalCards < 45 || totalCards > 60) {
        return;
      }

      const isCardValid = (card: DeckCard) => {
        // Ignore "RAPIDA", "-" and "COMUN" and evaluate the second subtype if it is present
        const cardSubtypes = [card.subtype, card.subtype2].filter(
          (subtype) => subtype && subtype !== "RAPIDA" && subtype !== "-" && subtype !== "COMUN",
        );

        if (card.quantity > 4) {
          return false;
        }

        // If card type is action, monumento or arma without subtype, it is always valid
        if (["ACCION", "MONUMENTO", "ARMA"].includes(card.type) && cardSubtypes.length === 0) {
          return true;
        }

        // If one of the selected deck types is NOT mimetico, mimetico cards are always valid
        if (cardSubtypes.includes("MIMETICO")) {
          return true;
        }

        // Check every deck card to match subtypes with selected deck types
        return cardSubtypes.some((subtype) => subtype === mainSubtype || subtype === secondarySubtype);
      };

      this.isDeckValid = masterDeckCards.every((card) => isCardValid(card));
    }),

    addCard: $(async function (this, card, side = false) {
      if (side) {
        // check if the card is already in the side
        const cardInSideDeck = this.deckData.sideDeck[card.id];

        if (cardInSideDeck) {
          cardInSideDeck.quantity++;
        } else {
          this.deckData.sideDeck[card.id] = {
            ...card,
            quantity: 1,
          };
        }
      } else {
        // if the card is a treasure, add to treasures
        // TODO use constant here
        if (card.type === "TESORO") {
          // check if the card is already in the treasures
          const cardInTreasureDeck = this.deckData.treasureDeck[card.id];

          if (cardInTreasureDeck) {
            cardInTreasureDeck.quantity++;
          } else {
            this.deckData.treasureDeck[card.id] = {
              ...card,
              quantity: 1,
            };
          }
        } else {
          // check if the card is already in the deck
          const cardInMasterDeck = this.deckData.masterDeck[card.id];

          if (cardInMasterDeck) {
            cardInMasterDeck.quantity++;
          } else {
            this.deckData.masterDeck[card.id] = {
              ...card,
              quantity: 1,
            };
          }
        }
      }
      await this.validateDeck();
    }),
    setSplashArt: $(async function (this, splashArt, cardId) {
      this.deckData.splashArt = splashArt;
      this.deckData.splashArtId = cardId;
    }),
    removeCard: $(async function (this, card, side = false) {
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
        if (card.type === "TESORO") {
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
      await this.validateDeck();
    }),
    createDeck: $(async function (this) {
      const payload: DeckState = {
        ...this.deckData,
      };

      const result = await saveDeck(payload);

      if (this.deckData.id === 0 && result > 0) {
        this.deckData.id = result;
      }

      return result;
    }),
    deleteDeck: $(async function (this) {
      const deckId = this.deckData.id;

      if (!deckId || deckId < 1) return;

      await deleteDeck(deckId);
    }),
    cleanDeck: $(async function (this, partial = false) {
      if (partial) {
        this.deckData = {
          ...this.deckData,
          masterDeck: {},
          sideDeck: {},
          treasureDeck: {},
        };
      } else {
        this.deckData = initialDeckData;
      }
    }),
    importDeck: $(async function (this, deckString) {
      const deck = await fetchDeckImport(parseToImportCardsItem(deckString));

      this.deckData = {
        ...this.deckData,
        masterDeck: deck.masterDeck,
        sideDeck: deck.sideDeck,
        treasureDeck: deck.treasureDeck,
      };
    }),
  });
};

export const DeckCreationContext = createContextId<DeckCreationContextState>("deck-creation-context");
