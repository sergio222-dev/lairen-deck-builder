import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { CardDeckInfoFull }                                from "~/features/createDeck/components/CardDeckInfoFull";
import { CardDeckInfoPro }                                 from "~/features/createDeck/components/CardDeckInfoPro";
import { CARD_TYPES }                                      from '~/models/CardTypes';
import { DeckCreationContext }                             from '~/stores/deckCreationContext';
import { costCalculator, getColorLever }                   from "~/utils/costCalculator";

export const CardDeckInfo = component$(() => {
  const d        = useContext(DeckCreationContext);
  const deckData = d.deckData;

  const deckTotalCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedUnitCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.UNIT)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const unitCardsQuantity = useComputed$(() => {
    return orderedUnitCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedActionCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.ACTION)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const actionCardsQuantity = useComputed$(() => {
    return orderedActionCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedTreasureCards = useComputed$(() => {
    return Object.entries(deckData.treasureDeck)
      .map(([, c]) => c)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const treasureCardsQuantity = useComputed$(() => {
    return orderedTreasureCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const treasureTotalCost = useComputed$(() => {
    return orderedTreasureCards.value.reduce((acc, c) => acc + parseInt(c.cost) * c.quantity, 0);
  });

  const orderedMonumentAndWeaponCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.MONUMENTO || c.type === CARD_TYPES.ARMA)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  const monumentAndWeaponCardsQuantity = useComputed$(() => {
    return orderedMonumentAndWeaponCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedSideCards = useComputed$(() => {
    return Object.entries(deckData.sideDeck)
      .map(([, c]) => c)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  const sideCardsQuantity = useComputed$(() => {
    return orderedSideCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const costLevelDeck = useComputed$(() => {
    const allCards = {
      ...deckData.masterDeck,
      ...deckData.treasureDeck,
      ...deckData.sideDeck
    };

    return costCalculator(allCards);
  })

  const colorLevelDeck = useComputed$(() => {
    return getColorLever(costLevelDeck.value);
  });

  return (
    <div class="p-2 shadow-lg">
      <div class="flex justify-between">
        <div>Budget: <span style={{ color: colorLevelDeck.value }}> {costLevelDeck.value}</span></div>
        <div class="flex justify-center">
          <p class="text-center">Cards: {deckTotalCards.value}</p>
        </div>
      </div>

      {d.view === 'simple' ?
        <CardDeckInfoFull
          unitCardsQuantity={unitCardsQuantity.value}
          actionCardsQuantity={actionCardsQuantity.value}
          monumentAndWeaponCardsQuantity={monumentAndWeaponCardsQuantity.value}
          treasureCardsQuantity={treasureCardsQuantity.value}
          treasureTotalCost={treasureTotalCost.value}
          orderedUnitCards={orderedUnitCards.value}
          orderedActionCards={orderedActionCards.value}
          orderedMonumentAndWeaponCards={orderedMonumentAndWeaponCards.value}
          orderedTreasureCards={orderedTreasureCards.value}
          orderedSideCards={orderedSideCards.value}
          sideCardsQuantity={sideCardsQuantity.value}
          />
        : <CardDeckInfoPro
          unitCardsQuantity={unitCardsQuantity.value}
          actionCardsQuantity={actionCardsQuantity.value}
          monumentAndWeaponCardsQuantity={monumentAndWeaponCardsQuantity.value}
          treasureCardsQuantity={treasureCardsQuantity.value}
          treasureTotalCost={treasureTotalCost.value}
          orderedUnitCards={orderedUnitCards.value}
          orderedActionCards={orderedActionCards.value}
          orderedMonumentAndWeaponCards={orderedMonumentAndWeaponCards.value}
          orderedTreasureCards={orderedTreasureCards.value}
          orderedSideCards={orderedSideCards.value}
          sideCardsQuantity={sideCardsQuantity.value}
        />
      }
    </div>
  );
});
