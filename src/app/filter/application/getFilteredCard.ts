import { mapFilterToSpecification } from '~/app/filter/application/mapper/filterMapper';
import type { FilterRepository }    from '~/app/filter/infrastructure/filter.repository';
import type { FilterDefinition }    from '~/UI/filters/models/filterDefinition.model';

export function getFilteredCard(filterRepo: FilterRepository, filters: FilterDefinition[]) {

  const specifications = mapFilterToSpecification(filters);

  return filterRepo.fetchCards(specifications);
}
