import type { DeckCardInfoDto }   from '~/app/shared/application/DTO/deckCardInfo.dto';
import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';
import { CARD_TYPES }             from '~/models/CardTypes';
import type { UIDeckCardInformation, UIDeckStats, UIUserCollection } from '~/UI/deck/models/deck.store.model';
import type { UICardStackItem }                                      from '~/UI/shared/models/CardStackItem';
import { normalizeData }                                             from '~/utils/normalize';

export function calculateDeckStats(
  cardProj: CardInfoProection[],
  cards: DeckCardInfoDto[],
  collection: Record<string, number> = {}
): UIDeckStats & UIDeckCardInformation & UIUserCollection {

  const cardStack  = normalizeData<UICardStackItem>(cardProj);
  const cardInDeck = normalizeData(cards);

  // TRANSFORM FOR UI
  let quantityInMainDeck            = 0;
  let quantityInSideDeck            = 0;
  let quantityInTreasureDeck        = 0;
  let quantityUnitsCards            = 0;
  let quantityActionsCards          = 0;
  let quantityMonumentsWeaponsCards = 0;
  let treasurePoints                = 0;
  let ownedPercent                  = 0.0;

  cards.forEach(c => {

    const cardData = cardStack[c.id];

    quantityInSideDeck += c.quantityInSide;

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


  const orderedUnitCards = cards
    .filter((c) => cardStack[c.id].type === CARD_TYPES.UNIT && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id);

  const orderedActionCards = cards
    .filter((c) => cardStack[c.id].type === CARD_TYPES.ACTION && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id);

  const orderedMonumentWeaponCards = cards
    .filter((c) => (cardStack[c.id].type ===
      CARD_TYPES.MONUMENTO ||
      cardStack[c.id].type ===
      CARD_TYPES.ARMA) && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id);

  const orderedTreasureCards = cards
    .filter(c => cardStack[c.id].type === CARD_TYPES.TESORO && c.quantity > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id);

  const orderedSideCards = cards
    .filter(c => c.quantityInSide > 0)
    .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
    .map(c => c.id);

  let qd = 0;

  cards.forEach(c => {
    const albumCard = collection?.[c.id];

    if (!albumCard) {
      return;
    }

    const albumQuantity = albumCard;

    const deckQuantity = c.quantity + c.quantityInSide;

    if (albumQuantity >= deckQuantity) {
      qd += deckQuantity;
    } else {
      qd += albumQuantity;
    }
  });

  ownedPercent =
    qd /
    Math.max((quantityInMainDeck + quantityInSideDeck + quantityInTreasureDeck), 1); // prevent division by 0

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
    cardInDeck,
    ownedPercent,
    cardStack,
    collection
  };
}
