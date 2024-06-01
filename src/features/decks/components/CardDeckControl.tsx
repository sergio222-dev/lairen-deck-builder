import { component$ } from '@builder.io/qwik';
import { CardDeck }                  from '~/models/Deck';

interface CardDeckControlProps {
  card: CardDeck;
}

export const CardDeckControl = component$<CardDeckControlProps>(({ card }) => {
  return (
    <div
      class="aspect-[3/4] md:w-1/3 sm:w-1/2 lg:w-1/4 xl:w-1/5 2xl:w-1/6 bg-no-repeat bg-[length:100%_100%]"
      style={{
        backgroundImage: `url(${card.image})`
      }}
    >
    </div>
  )
});
