import { server$ }               from '@builder.io/qwik-city';
import { getFilteredCard }       from '~/app/filter/application/getFilteredCard';
import { FilterRepository }      from '~/app/filter/infrastructure/filter.repository';
import type { FilterDefinition } from '~/UI/filters/models/filterDefinition.model';

export const fetchFilteredCards = server$(async function(filters: FilterDefinition[]) {
  const filterRepo = new FilterRepository(this);

  return getFilteredCard(filterRepo, filters);
});
