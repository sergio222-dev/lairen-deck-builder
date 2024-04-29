import { component$, useContext, useTask$ }               from '@builder.io/qwik';
import { routeAction$, routeLoader$, zod$ }               from '@builder.io/qwik-city';
import { CardFilter, CardList }                           from '~/features/cards';
import { cardGetScheme }                                  from '~/models/schemes/cardGet';
import { CardRepository }                                 from '~/providers/repositories/CardRepository';
import { FilterContext }                                  from '~/stores/filterContext';

export const useCardsLoader = routeLoader$(async () => {
  try {
    const cardRepo = new CardRepository();
    const filter = {
      page: '1',
      size: '20',
      sortBy: 'name',
      sortDirection: 'asc',
      name: '',
    };

    const filterParse = cardGetScheme.parse(filter)

    const cards = await cardRepo.getCardList(filterParse);

    const count = await cardRepo.getCount(filterParse);

    return {
      cards,
      count,
    }

  } catch (e) {
    console.log(`qxc error`, e);

    return {
      cards: [],
      count: 0
    };
  }
});

export const useFetchCards = routeAction$(async (data) => {
  const cardRepo = new CardRepository();
  console.log(data);

  const filter = {
    page: data.page,
    size: data.size,
    sortBy: data.sortBy,
    sortDirection: data.sortDirection,
    name: data.name,
  }

  const cards = await cardRepo.getCardList(filter);
  const count = await cardRepo.getCount(filter);

  console.log(`qxc cards`, cards, count);

  return {
    cards,
    count,
  }

}, zod$(cardGetScheme));

export default component$(() => {
  const c = useContext(FilterContext)
  const preLoadCards = useCardsLoader();

  useTask$(() => {
    c.cards = preLoadCards.value.cards;
    c.count = preLoadCards.value.count;
  });

  return (
    <>
      <CardFilter />
      <CardList cards={c.cards} />
    </>
  );
});
