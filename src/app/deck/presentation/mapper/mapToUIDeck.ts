import type { CardInfo }  from '~/app/card/domain/models/card.model';
import type { DeckModel } from '~/app/deck/domain/models/deck.model';
import { CARD_TYPES }           from '~/models/CardTypes';
import type { UICardStackItem } from '~/UI/shared/models/CardSackItem';
import { normalizeData }        from '~/utils/normalize';

export function mapToUIDeck(cards: CardInfo[], deckData: DeckModel) {
  const cardStack  = normalizeData<UICardStackItem>(cards);
  const cardInDeck = normalizeData(deckData.cards?.map(c => ({
    id:             c.id,
    quantity:       c.quantity,
    quantityInSide: c.quantityInSideDeck
  })) ?? []);

  // TRANSFORM FOR UI
  let quantityInMainDeck            = 0;
  let quantityInSideDeck            = 0;
  let quantityInTreasureDeck        = 0;
  let quantityUnitsCards            = 0;
  let quantityActionsCards          = 0;
  let quantityMonumentsWeaponsCards = 0;
  let treasurePoints                = 0;

  deckData.cards?.forEach(c => {

    const cardData = cardStack[c.id];

    quantityInSideDeck += c.quantityInSideDeck;

    if (cardData.type === CARD_TYPES.TESORO) {
      quantityInTreasureDeck += c.quantity;

      treasurePoints += cardData.cost;
    } else {
      quantityInMainDeck += c.quantity;

      if (cardData.type === CARD_TYPES.UNIT) quantityUnitsCards += c.quantity;
      if (cardData.type === CARD_TYPES.ACTION) quantityActionsCards += c.quantity;
      if (cardData.type ===
        CARD_TYPES.ARMA ||
        cardData.type ===
        CARD_TYPES.MONUMENTO) quantityMonumentsWeaponsCards += c.quantity;
    }
  });


  const orderedUnitCards = deckData.cards
    ?.filter((c) => cardStack[c.id].type === CARD_TYPES.UNIT && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id) ?? [];

  const orderedActionCards = deckData.cards
    ?.filter((c) => cardStack[c.id].type === CARD_TYPES.ACTION && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id) ?? [];

  const orderedMonumentWeaponCards = deckData.cards
    ?.filter((c) => (cardStack[c.id].type ===
      CARD_TYPES.MONUMENTO ||
      cardStack[c.id].type ===
      CARD_TYPES.ARMA) && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id) ?? [];

  const orderedTreasureCards = deckData.cards
    ?.filter(c => cardStack[c.id].type === CARD_TYPES.TESORO && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id) ?? [];

  const orderedSideCards = deckData.cards
    ?.filter(c => c.quantityInSideDeck > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id) ?? [];

  return {
    quantityMonumentsWeaponsCards,
    quantityUnitsCards,
    treasurePoints,
    quantityInMainDeck,
    quantityInSideDeck,
    quantityActionsCards,
    quantityInTreasureDeck,
    orderedActionCards,
    orderedSideCards,
    orderedUnitCards,
    orderedTreasureCards,
    orderedMonumentWeaponCards,
    cardStack,
    cardInDeck,
    deckId:      deckData.id,
    name:        deckData.name,
    description: deckData.description,
    splashArtId: deckData.splashArtId,
    type1:       deckData.type1,
    type2:       deckData.type2,
    isPublic:    deckData.isPublic
  };
}
