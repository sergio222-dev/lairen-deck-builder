import type { Signal }                             from '@builder.io/qwik';
import { $, createContextId, useStore }            from '@builder.io/qwik';
import { onDeleteDeck }                            from '~/app/deck/presentation/onDeleteDeck';
import { onImportDeck }                            from '~/app/deck/presentation/onImportDeck';
import { onSaveDeck }                              from '~/app/deck/presentation/onSaveDeck';
import { Logger }                                  from '~/lib/logger';
import { CARD_TYPES }                              from '~/models/CardTypes'; // TODO: MOVE THIS TO APP
import type { DECK_STORE, DeckCreationStoreState } from '~/UI/deck/models/deck.store.model';
import type { CardStackItem }                      from '~/UI/shared/models/CardSackItem';
import type { NormalizedModel }                    from '~/utils/normalize';

function orderCard(cardId: number, cardName: string, list: number[], stack: NormalizedModel<CardStackItem>) {
  let left  = 0;
  let right = list.length;

  while (left < right) {
    const mid     = Math.floor((left + right) / 2);
    const midCard = stack[list[mid]];

    if (midCard.name.localeCompare(cardName) < 0) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return list.toSpliced(left, 0, cardId);
}


const deckCreationStoreInitialState: DeckCreationStoreState = {
  deckId:                        0,
  name:                          '',
  description:                   '',
  cardStack:                     {},
  cardInDeck:                    {},
  isPublic:                      false,
  orderedActionCards:            [],
  orderedSideCards:              [],
  orderedMonumentWeaponCards:    [],
  orderedTreasureCards:          [],
  orderedUnitCards:              [],
  quantityInMainDeck:            0,
  quantityActionsCards:          0,
  quantityInSideDeck:            0,
  quantityInTreasureDeck:        0,
  quantityMonumentsWeaponsCards: 0,
  quantityUnitsCards:            0,
  treasurePoints:                0,
  type1:                         null,
  type2:                         null
};

export const useDeckCreationStore = (initialState: Signal<DeckCreationStoreState> | Signal<null>) => {

  return useStore<DECK_STORE>({
    ...initialState.value ?? deckCreationStoreInitialState,
    cardStack:  initialState.value ? initialState.value.cardStack : {},
    cardInDeck: initialState.value ? initialState.value.cardInDeck : {},
    addCard:    $(function(this, cardData, side = false) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!this.cardStack[cardData.id]) {
        this.cardStack[cardData.id] = cardData;
      }

      let shouldOrder = false;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!this.cardInDeck[cardData.id]) {
        this.cardInDeck[cardData.id] = {
          id:             cardData.id,
          quantity:       0,
          quantityInSide: 0
        };

        shouldOrder = true;
      }

      const quantity                              = this.cardInDeck[cardData.id].quantity;
      const quantityInSide                        = this.cardInDeck[cardData.id].quantityInSide;
      this.cardInDeck[cardData.id].quantity       = side ? quantity : quantity + 1;
      this.cardInDeck[cardData.id].quantityInSide = side ? quantityInSide + 1 : quantityInSide;
      if (quantity === 0 && !side) shouldOrder = true;
      if (quantityInSide === 0 && side) shouldOrder = true;

      if (side) {
        this.quantityInSideDeck++;
      } else {
        if (cardData.type !== CARD_TYPES.TESORO)
          this.quantityInMainDeck++;
      }

      if (!side) {
        switch (cardData.type) {
          case CARD_TYPES.UNIT:
            this.quantityUnitsCards++;
            break;
          case CARD_TYPES.ACTION:
            this.quantityActionsCards++;
            break;
          case CARD_TYPES.TESORO:
            this.quantityInTreasureDeck++;
            this.treasurePoints += cardData.cost;
            break;
          case CARD_TYPES.ARMA:
            this.quantityMonumentsWeaponsCards++;
            break;
          case CARD_TYPES.MONUMENTO:
            this.quantityMonumentsWeaponsCards++;
            break;
          default:
            break;
        }
      }

      // ORDER CARDS
      Logger.info(`INFO`);
      Logger.info(this.cardStack);
      Logger.info(this.cardInDeck);
      Logger.info(this.orderedActionCards);
      if (!shouldOrder) return;

      Logger.info(`Will order:`);
      if (side) {
        this.orderedSideCards = orderCard(cardData.id, cardData.name, this.orderedSideCards, this.cardStack);
        return;
      }

      switch (cardData.type) {
        case CARD_TYPES.UNIT:
          this.orderedUnitCards = orderCard(cardData.id, cardData.name, this.orderedUnitCards, this.cardStack);
          break;
        case CARD_TYPES.ACTION:
          this.orderedActionCards = orderCard(cardData.id, cardData.name, this.orderedActionCards, this.cardStack);
          break;
        case CARD_TYPES.TESORO:
          this.orderedTreasureCards = orderCard(cardData.id, cardData.name, this.orderedTreasureCards, this.cardStack);
          break;
        case CARD_TYPES.ARMA:
          this.orderedMonumentWeaponCards =
            orderCard(cardData.id, cardData.name, this.orderedMonumentWeaponCards, this.cardStack);
          break;
        case CARD_TYPES.MONUMENTO:
          this.orderedMonumentWeaponCards =
            orderCard(cardData.id, cardData.name, this.orderedMonumentWeaponCards, this.cardStack);
          break;
        default:
          break;
      }
      Logger.info(this.orderedActionCards);
      Logger.info(`Finished Order`);
    }),
    removeCard: $(function(this: DeckCreationStoreState, cardId: number, side = false) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const quantity       = this.cardInDeck[cardId]?.quantity ?? 0;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const quantityInSide = this.cardInDeck[cardId]?.quantityInSide ?? 0;

        if ((quantity === 0 && !side) || (quantityInSide === 0 && side)) {
          return;
        }

        const cardData = this.cardStack[cardId];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cardData) {
          Logger.error(`Card with id ${cardId} not found in stack`);
          return;
        }

        this.cardInDeck[cardData.id].quantity       = side ? quantity : quantity - 1;
        this.cardInDeck[cardData.id].quantityInSide = side ? quantityInSide - 1 : quantityInSide;
        const shouldRemove                          = !side && quantity - 1 <= 0 ? true : side && quantityInSide - 1 <= 0;

        if (side) {
          this.quantityInSideDeck--;
        } else {
          this.quantityInMainDeck--;
        }

        if (!side) {
          switch (cardData.type) {
            case CARD_TYPES.UNIT:
              this.quantityUnitsCards--;
              break;
            case CARD_TYPES.ACTION:
              this.quantityActionsCards--;
              break;
            case CARD_TYPES.TESORO:
              this.quantityInTreasureDeck--;
              break;
            case CARD_TYPES.ARMA:
              this.quantityMonumentsWeaponsCards--;
              break;
            case CARD_TYPES.MONUMENTO:
              this.quantityMonumentsWeaponsCards--;
              this.treasurePoints -= cardData.cost;
              break;
            default:
              break;
          }
        }

        // check for removing card
        if (!shouldRemove) return;

        if (!side) {
          switch (cardData.type) {
            case CARD_TYPES.UNIT:
              this.orderedUnitCards = this.orderedUnitCards.filter(i => i != cardId);
              break;
            case CARD_TYPES.ACTION:
              this.orderedActionCards = this.orderedActionCards.filter(i => i != cardId);
              break;
            case CARD_TYPES.TESORO:
              this.orderedTreasureCards = this.orderedTreasureCards.filter(i => i != cardId);
              break;
            case CARD_TYPES.ARMA:
              this.orderedMonumentWeaponCards = this.orderedMonumentWeaponCards.filter(i => i != cardId);
              break;
            case CARD_TYPES.MONUMENTO:
              this.orderedMonumentWeaponCards = this.orderedMonumentWeaponCards.filter(i => i != cardId);
              break;
            default:
              break;
          }
        } else {
          this.orderedSideCards = this.orderedSideCards.filter(i => i != cardId);
        }


        // removing from the stacks and cards if no quantity in both decks
        if (this.cardInDeck[cardData.id].quantity <= 0 && this.cardInDeck[cardData.id].quantityInSide <= 0) {
          delete this.cardInDeck[cardId];
          delete this.cardStack[cardId];
        }
      }
    ),
    saveDeck:   $(async function(this) {
      const result = await onSaveDeck(this);

      this.deckId = result;

      return result;
    }),
    deleteDeck: $(async function(this) {
      if (this.deckId < 1) return;
      await onDeleteDeck(this.deckId);
    }),
    resetDeck:  $(function(this) {
      this.orderedActionCards            = [];
      this.orderedSideCards              = [];
      this.orderedTreasureCards          = [];
      this.orderedUnitCards              = [];
      this.orderedMonumentWeaponCards    = [];
      this.quantityInSideDeck            = 0;
      this.quantityInTreasureDeck        = 0;
      this.quantityInMainDeck            = 0;
      this.quantityUnitsCards            = 0;
      this.quantityActionsCards          = 0;
      this.quantityMonumentsWeaponsCards = 0;
      this.treasurePoints                = 0;
      this.splashArt                     = undefined;
      this.cardInDeck                    = deckCreationStoreInitialState.cardInDeck;
      this.cardStack                     = deckCreationStoreInitialState.cardStack;
    }),
    importDeck: $(async function(this, text: string) {
      Logger.info(`Importing DECK`);
      Logger.info(text);
      const d = await onImportDeck(text);

      Logger.info(d);

      this.cardStack  = d.cardStack;
      this.cardInDeck = d.cardInDeck;

      this.orderedUnitCards           = d.orderedUnitCards;
      this.orderedActionCards         = d.orderedActionCards;
      this.orderedSideCards           = d.orderedSideCards;
      this.orderedTreasureCards       = d.orderedTreasureCards;
      this.orderedMonumentWeaponCards = d.orderedMonumentWeaponCards;

      this.quantityMonumentsWeaponsCards = d.quantityMonumentsWeaponsCards;
      this.quantityActionsCards          = d.quantityActionsCards;
      this.quantityUnitsCards            = d.quantityUnitsCards;
      this.quantityInTreasureDeck        = d.quantityInTreasureDeck;
      this.quantityInMainDeck            = d.quantityInMainDeck;
      this.quantityInSideDeck            = d.quantityInSideDeck;

      this.treasurePoints = d.treasurePoints;
    }),
    copyDeck:   $(function(this) {

    })
  });
};

export const DECK_CREATION_CONTEXT = createContextId<DECK_STORE>('DECK_CREATION_CONTEXT');
