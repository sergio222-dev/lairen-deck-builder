import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { CardDeckControl }                      from '~/features/createDeck/components/CardDeckControl';
import { CARD_TYPES }                           from '~/models/CardTypes';
import { DeckCreationContext }                  from '~/stores/deckCreationContext';

export const CardDeckInfo = component$(() => {
  const d = useContext(DeckCreationContext);

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

  const orderedActionCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.ACTION)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const orderedTreasureCards = useComputed$(() => {
    return Object.entries(deckData.treasureDeck)
      .map(([, c]) => c)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const orderedMonumentCards = useComputed$(() => {
    return Object.entries(deckData.masterDeck)
      .map(([, c]) => c)
      .filter(c => c.type === CARD_TYPES.MONUMENTO)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  const orderedSideCards = useComputed$(() => {
    return Object.entries(deckData.sideDeck)
      .map(([, c]) => c)
      .toSorted((a, b) => a.name.localeCompare(b.name))
  });

  return (
    <div class="p-4 shadow-lg m-4">
      <div class="flex justify-center">
        <p class="text-center">Total number of cards in deck:<br/>{deckTotalCards.value}</p>
      </div>

      <div class="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <p class="text-center">Unidades</p>
          <div class="flex flex-wrap">
            {orderedUnitCards.value.map(c => (
              <CardDeckControl key={c.id} card={c}/>
            ))}
          </div>
        </div>
        <div>
          <p class="text-center">Acciones</p>
          <div class="flex flex-wrap">
            {orderedActionCards.value.map(c => (
              <CardDeckControl key={c.id} card={c}/>
            ))}
          </div>
        </div>
        {/*<div>*/}
        {/*  <p class="text-center">Monumentos</p>*/}
        {/*  <div class="flex flex-wrap">*/}
        {/*    {orderedMonumentCards.value.map(c => (*/}
        {/*      <CardDeckControl key={c.id} card={c}/>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  <p class="text-center">Tesoros</p>*/}
        {/*  <div class="flex flex-wrap">*/}
        {/*    {orderedTreasureCards.value.map(c => (*/}
        {/*      <CardDeckControl key={c.id} card={c}/>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      {orderedMonumentCards.value.length > 0 &&
        <div class="p-4">
          <p class="text-center">Monumentos</p>
          <div class="flex flex-wrap">
            {orderedMonumentCards.value.map(c => (
              <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
            ))}
          </div>
        </div>
      }

      <div class="p-4">
        <p class="text-center">Tesoros</p>
        <div class="flex flex-wrap">
          {orderedTreasureCards.value.map(c => (
            <CardDeckControl orientation="horizontal" key={c.id} card={c}/>
          ))}
        </div>
      </div>

      {orderedSideCards.value.length > 0 &&
        <div class="p-4">
          <p class="text-center">Side</p>
          <div class="flex flex-wrap">
            {orderedSideCards.value.map(c => (
              <CardDeckControl orientation="horizontal" isSide key={c.id} card={c}/>
            ))}
          </div>
        </div>
      }
    </div>
  );
});
