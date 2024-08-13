import { component$, useContext } from '@builder.io/qwik';
import { CardDeck }               from '~/features/createDeck/components/CardDeck';
import { FilterContext }          from '~/stores/filterContext';

export const CardListDeck = component$(() => {
  const c = useContext(FilterContext);

  return (
    <>
      {/*<div class="p-4 shadow-lg m-4 grid lg:grid-cols-5 md:grid-cols-4 gap-6">*/}
      <div class="shadow-lg flex justify-around flex-wrap gap-2">
        {c.cards.map((card) => (
          <CardDeck key={card.id} card={card}/>
        ))}
      </div>
    </>
  );
});
