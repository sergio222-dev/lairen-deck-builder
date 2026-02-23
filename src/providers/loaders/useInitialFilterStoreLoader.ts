import { routeLoader$ }            from '@builder.io/qwik-city';
import { TOKENS }                  from '~/app/shared/binds/TOKENS';
import { IoC }                     from '~/lib/IoC';
import type { FilterStoreState }   from '~/UI/filters/models/filter.store.model';
import { DEFAULT_PAGINATION }      from '~/UI/filters/models/filterDefinition.model';
import { filterStoreInitialState } from '~/UI/filters/store/filter.store';
import type { UICardStackItem }    from '~/UI/shared/models/CardStackItem';
import { normalizeData }           from '~/utils/normalize';

// eslint-disable-next-line qwik/loader-location
export const useInitialFilterStoreLoader = routeLoader$<FilterStoreState>(async () => {
  const ioc = IoC.instance;

  const getAllFiltersOptions = ioc.resolve(TOKENS.GET_ALL_FILTERS_OPTIONS_PRESENTER);
  const findCards            = ioc.resolve(TOKENS.FIND_CARDS_PRESENTER);

  const filterGroups   = await getAllFiltersOptions.execute();
  const [cards, count] = await findCards.execute(filterGroups, filterStoreInitialState.dominion);

  const cardsIds  = cards.map(c => c.id);
  const cardStack = normalizeData<UICardStackItem>(cards);

  const totalPages = Math.ceil(count / DEFAULT_PAGINATION.size);

  return {
    ...filterStoreInitialState,
    filterGroups: normalizeData(filterGroups),

    cardStack,
    cards:      cardsIds,
    count,
    pagination: {
      ...DEFAULT_PAGINATION,
      pages: totalPages
    }
  };
});
