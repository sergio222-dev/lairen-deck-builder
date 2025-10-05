import { routeLoader$ }     from '@builder.io/qwik-city';
import { CardRepository }   from '~/app/card/infrastructure/card.repository';
import { Logger }           from '~/lib/logger';
import { getDefaultFilter } from '~/utils/cardFilters';

// eslint-disable-next-line qwik/loader-location
export const useUnitTypeLoader = routeLoader$<string[]>(async (request) => {
  const cardRepo = new CardRepository(request);
  return await cardRepo.getViewCard("unit_types")
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
