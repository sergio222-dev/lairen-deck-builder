import type { Signal }                                          from '@builder.io/qwik';
import { $, createContextId, useStore }                         from '@builder.io/qwik';
import { Logger }                                               from '~/lib/logger';
import { CARD_TYPES }                                           from '~/models/CardTypes';
import type { DeckCreationStoreAction, DeckCreationStoreState } from '~/UI/deck/models/deck.store.model';
import type { CardStackItem }                                   from '~/UI/shared/models/CardSackItem';
import type { NormalizedModel }                                 from '~/utils/normalize';

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
  type2:                         null,
  splashArtId:                   null
};

export type DECK_STORE = DeckCreationStoreState & DeckCreationStoreAction;

export const useDeckCreationStore = (initialState: Signal<DeckCreationStoreState> | Signal<null>) => {

  return useStore<DECK_STORE>({
    ...initialState.value ?? deckCreationStoreInitialState,
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
            break;
          case CARD_TYPES.ARMA:
            this.quantityMonumentsWeaponsCards++;
            break;
          case CARD_TYPES.MONUMENTO:
            this.quantityMonumentsWeaponsCards++;
            this.treasurePoints += cardData.cost;
            break;
          default:
            break;
        }
      }

      // ORDER CARDS
      if (!shouldOrder) return;

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
    )
  });
};

export const DECK_CREATION_CONTEXT = createContextId<DECK_STORE>('DECK_CREATION_CONTEXT');
