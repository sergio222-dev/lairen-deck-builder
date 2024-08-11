import { routeLoader$ }     from '@builder.io/qwik-city';
import { Logger }           from '~/lib/logger';
import { CardRepository }   from '~/providers/repositories/CardRepository';
import { getDefaultFilter } from '~/utils/cardFilters';

// eslint-disable-next-line qwik/loader-location
export const useSubtypeLoader = routeLoader$<string[]>(async (request) => {
  const cardRepo = new CardRepository(request);
  return await cardRepo.getViewCard("card_subtypes")
});

// eslint-disable-next-line qwik/loader-location
export const useTypeLoader = routeLoader$<string[]>(async (request) => {
  const cardRepo = new CardRepository(request);
  return await cardRepo.getViewCard("card_types")
});

// eslint-disable-next-line qwik/loader-location
export const useRarityLoader = routeLoader$<string[]>(async (request) => {
  const cardRepo = new CardRepository(request);
  return await cardRepo.getViewCard("card_rarity")
});

// eslint-disable-next-line qwik/loader-location
export const useSetLoader = routeLoader$<string[]>(async (request) => {
  const cardRepo = new CardRepository(request);
  return await cardRepo.getViewCard("card_sets")
});

// eslint-disable-next-line qwik/loader-location
export const useCardsLoader = routeLoader$(async (requestEnv) => {
  try {
    const cardRepo = new CardRepository(requestEnv);

    const filter = getDefaultFilter();

    const cards = await cardRepo.getCardList(filter);

    const count = await cardRepo.getCount(filter);

    return {
      cards,
      count,
    }

  } catch (e) {
    Logger.error(e, `${useCardsLoader.name}`)

    return {
      cards: [],
      count: 0
    };
  }
});

// eslint-disable-next-line qwik/loader-location
export const useCardDeckLoader = routeLoader$(async (requestEnv) => {
  try {
    const cardRepo = new CardRepository(requestEnv);

    const filter = getDefaultFilter(24);

    const cards = await cardRepo.getCardList(filter);

    const count = await cardRepo.getCount(filter);

    return {
      cards,
      count,
    }

  } catch (e) {
    Logger.error(e, `${useCardsLoader.name}`)

    return {
      cards: [],
      count: 0
    };
  }
})
