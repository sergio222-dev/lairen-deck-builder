import { routeLoader$ }            from '@builder.io/qwik-city';
import { getDefaultFilterGroups }  from '~/app/filter/application/getDefaultFilterGroups';
import { getFilteredCard }         from '~/app/filter/application/getFilteredCard';
import { FilterRepository }        from '~/app/filter/infrastructure/filter.repository';
import type { FilterStoreState }   from '~/UI/filters/models/filter.store.model';
import { DEFAULT_PAGINATION }      from '~/UI/filters/models/filterDefinition.model';
import { filterStoreInitialState } from '~/UI/filters/store/filter.store';
import type { UICardStackItem }    from '~/UI/shared/models/CardSackItem';
import { normalizeData }           from '~/utils/normalize';

// eslint-disable-next-line qwik/loader-location
export const useInitialFilterStoreLoader = routeLoader$<FilterStoreState>(async (request) => {
  const filterRepo = new FilterRepository(request);

  // Default filters data
  const filterGroups     = await getDefaultFilterGroups(filterRepo);
  const { cards, count } = await getFilteredCard(filterRepo, filterGroups);

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
      pages: totalPages,
    },
  }
});
