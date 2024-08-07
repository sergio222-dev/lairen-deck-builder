import { routeLoader$ }     from '@builder.io/qwik-city';
import { Logger }           from '~/lib/logger';
import { CardRepository }   from '~/providers/repositories/CardRepository';
import { getDefaultFilter } from '~/utils/cardFilters';

// eslint-disable-next-line qwik/loader-location
export const useSubtypeLoader = routeLoader$(async (request) => {
  const cardRepo = new CardRepository(request);
  const subtypes = await cardRepo.getCardSubtype();

  function removeEmptyAndNull<T>(v: T | null): v is T {
    return v !== null && v !== undefined && v !== '-';
  }

  return subtypes.map(s => s.subtype).filter(removeEmptyAndNull);
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
