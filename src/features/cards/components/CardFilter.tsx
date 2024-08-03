import { $, component$, useContext } from '@builder.io/qwik';
import { ChipFilter, FilterField }   from "~/components/filterField/FilterField";
import type { Filter }               from "~/models/filters/Filter";
import { FILTERS_TYPES }             from "~/models/filters/Filter";
import { FilterContext }             from '~/stores/filterContext';
import { Pagination }                from './Pagination';

// TODO: refactor this components, move to common components folder and remove all loaders and context
export const CardFilter = component$(() => {
  // Context
  const c = useContext(FilterContext);

  // Handlers
  const addContainsFilter = $(async (value: string | undefined) => {
    if (!value) return;

    const textFilter: Filter = {
      id:         Math.random().toString(),
      label:      `Contains: "${value}"`,
      value:      value,
      field:      'text',
      filterType: FILTERS_TYPES.LIKE,
      isDisjunctive: true,
    }

    // await c.addFilter(nameFilter);
    await c.addFilter(textFilter);
  })


  // Render
  return (
    <div class="flex justify-between items-center">
      <FilterField onSubmit={addContainsFilter}>
        {c.filters.map(f => (
          <ChipFilter key={f.id} onClick$={() => c.removeFilter(f.id)}>{f.label}</ChipFilter>
        ))}
      </FilterField>
      <Pagination/>
    </div>
  );
});
