import type { Filter} from "~/models/filters/Filter";
import { FILTERS_TYPES } from "~/models/filters/Filter";
import { useDominionLoader } from "~/providers/loaders/cards";

export const useDominionFilters = () => {
  const dominions = useDominionLoader();

  const dominionFilter: Filter = {
    id:         `dominion-filter`,
    label:      `Dominion`,
    value:      dominions.value.join(','),
    field:      ['set'],
    filterType: FILTERS_TYPES.IN,
  }

  return dominionFilter;
}
