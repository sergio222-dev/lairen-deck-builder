import { component$, useComputed$ } from "@builder.io/qwik";
import { CardDeckControlPreview }   from "~/features/preview/components/CardDeckControlPreview";
import { CARD_TYPES }               from "~/models/CardTypes";
import type { DeckState }           from "~/models/Deck";

interface CardDeckInfoProps {
  deck: DeckState;
}

export const CardDeckInfoPreview = component$<CardDeckInfoProps>(({ deck }) => {

  const deckTotalCards = useComputed$(() => {
    return Object.entries(deck.masterDeck)
      .map(([, c]) => c)
      .reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedUnitCards = useComputed$(() => {
    return Object.entries(deck.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.UNIT)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const unitCardsQuantity = useComputed$(() => {
    return orderedUnitCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedActionCards = useComputed$(() => {
    return Object.entries(deck.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.ACTION)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const actionCardsQuantity = useComputed$(() => {
    return orderedActionCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedTreasureCards = useComputed$(() => {
    return Object.entries(deck.treasureDeck)
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
    return Object.entries(deck.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.MONUMENTO || c.type === CARD_TYPES.ARMA)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  const monumentAndWeaponCardsQuantity = useComputed$(() => {
    return orderedMonumentAndWeaponCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  const orderedSideCards = useComputed$(() => {
    return Object.entries(deck.sideDeck)
      .map(([, c]) => c)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  const sideCardsQuantity = useComputed$(() => {
    return orderedSideCards.value.reduce((acc, c) => acc + c.quantity, 0);
  });

  return (
    <div class="shadow-lg m-4">
      <div class="flex justify-center gap-4">
        <p class="text-center">Total number of cards in deck:<br/>{deckTotalCards.value}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Unidades ({unitCardsQuantity})</p>
          <div class="flex flex-wrap">
            {orderedUnitCards.value.map(c => (
              <CardDeckControlPreview key={c.id} card={c} deck={deck}/>
            ))}
          </div>
        </div>
        <div>
          <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Acciones ({actionCardsQuantity})</p>
          <div class="flex flex-wrap">
            {orderedActionCards.value.map(c => (
              <CardDeckControlPreview key={c.id} card={c} deck={deck}/>
            ))}
          </div>
        </div>
      </div>

      {orderedMonumentAndWeaponCards.value.length > 0 &&
        <div class="p-4">
          <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Monumentos y Armas ({monumentAndWeaponCardsQuantity})</p>
          <div class="flex flex-wrap">
            {orderedMonumentAndWeaponCards.value.map(c => (
              <CardDeckControlPreview orientation="horizontal" key={c.id} card={c} deck={deck}/>
            ))}
          </div>
        </div>
      }
      <div class="p-4">
        <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Tesoros ({treasureCardsQuantity}) Puntos: {treasureTotalCost}</p>
        <div class="flex flex-wrap">
          {orderedTreasureCards.value.map(c => (
            <CardDeckControlPreview orientation="horizontal" key={c.id} card={c} deck={deck}/>
          ))}
        </div>
      </div>

      {orderedSideCards.value.length > 0 &&
        <div class="p-4">
          <p class="text-[2rem] py-2 border-primary border-y-2 my-2">Side ({sideCardsQuantity})</p>
          <div class="flex flex-wrap">
            {orderedSideCards.value.map(c => (
              <CardDeckControlPreview orientation="horizontal" isSide key={c.id} card={c} deck={deck}/>
            ))}
          </div>
        </div>
      }
    </div>
  );
});
