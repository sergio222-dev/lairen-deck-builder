import { $, component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { CardDeckControl }                                              from '~/features/decks/components/CardDeckControl';
import { CARD_TYPES }                                                   from '~/models/CardTypes';
import { CardDeck }                                                     from '~/models/Deck';
import { DeckCreationContext }                     from '~/stores/deckCreationContext';

export const CardDeckInfo = component$(() => {
  // const orderedCards = useSignal<CardDeck[]>([]);

  const d = useContext(DeckCreationContext);

  console.log(d.deckData.masterDeck.cards);

  const deckTotalCards = useComputed$(() => {
    const cardsInDeck = d.deckData.masterDeck.cards.reduce((acc, card) => acc + card.quantity, 0);
    const cardsInTreasure = d.deckData.treasureDeck.cards.reduce((acc, card) => acc + card.quantity, 0);
    return cardsInDeck + cardsInTreasure;
  });


  // useTask$(async ({ track}) => {
  //   track(() => d.deckData.masterDeck.cards.length);
  //   console.log(d.deckData.masterDeck.cards);
  //   orderedCards.value = d.deckData.masterDeck.cards.toSorted((a, b) => a.name.localeCompare(b.name));
  // });

  const orderedUnitCards = useComputed$(() => {
    return d.deckData.masterDeck.cards.filter(c => c.type === CARD_TYPES.UNIT).toSorted((a, b) => a.name.localeCompare(b.name));
  });

  const orderedActionCards = useComputed$(() => {
    return d.deckData.masterDeck.cards.filter(c => c.type === CARD_TYPES.ACTION).toSorted((a, b) => a.name.localeCompare(b.name));
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
              <CardDeckControl key={c.id} card={c} />
            ))}
          </div>
        </div>
        <div>
          <p class="text-center">Acciones</p>
          <div class="flex flex-wrap">
            {orderedActionCards.value.map(c => (
              <CardDeckControl key={c.id} card={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
