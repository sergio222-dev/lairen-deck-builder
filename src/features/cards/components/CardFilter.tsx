import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Accordion }                            from "~/components/accordion/Accordion";
import { Button, ButtonIcon }                   from "~/components/button";
import { ChipFilter, FilterField }              from "~/components/filterField/FilterField";
import { Icon }                                 from "~/components/icons/Icon";
import type { Filter }                          from "~/models/filters/Filter";
import { FILTERS_TYPES }                                                  from "~/models/filters/Filter";
import { useRarityLoader, useSetLoader, useSubtypeLoader, useTypeLoader } from "~/providers/loaders/cards";
import { FilterContext }                                                  from '~/stores/filterContext';
import { Pagination }                           from './Pagination';

const useCostFilters = () => {

  // add const filters
  const count = new Array(9).fill(0).map((_, i) => i + 1);

  const countFilters: Filter[] = count.map(c => {
    return {
      id:         `cost-${c}`,
      label:      `Cost: ${c}`,
      value:      c.toString(),
      field:      'cost',
      filterType: FILTERS_TYPES.IN,
    }
  })

  return countFilters;
}

const useTypeFilters = (types: string[]) => {
  const typeFilters: Filter[] = types.map(t => {
    return {
      id:         `type-${t}`,
      label:      `Type: ${t}`,
      value:      t,
      field:      ['type'],
      filterType: FILTERS_TYPES.IN,
    }
  })

  return typeFilters;
}

const useRarityFilters = (rarities: string[]) => {
  const rarityFilters: Filter[] = rarities.map(t => {
    return {
      id:         `rarity-${t}`,
      label:      `Rarity: ${t}`,
      value:      t,
      field:      ['rarity'],
      filterType: FILTERS_TYPES.IN,
    }
  })

  return rarityFilters;
}

const useSetFilters = (sets: string[]) => {
  const setFilters: Filter[] = sets.map(t => {
    return {
      id:         `set-${t}`,
      label:      `Set: ${t}`,
      value:      t,
      field:      ['set'],
      filterType: FILTERS_TYPES.IN,
    }
  })

  return setFilters;
}

const useSubTypeFilters = (subtypes: string[]) => {
  const subTypeFilters: Filter[] = subtypes.map(t => {
    return {
      id:         `subtype-${t}`,
      label:      `Subtype: ${t}`,
      value:      t,
      field:      ['subtype', 'subtype2'],
      filterType: FILTERS_TYPES.IN,
    }
  })

  return subTypeFilters;
}

export const CardFilter = component$(() => {
  // Loaders
  const subtypes = useSubtypeLoader();
  const types    = useTypeLoader();
  const rarities = useRarityLoader();
  const sets     = useSetLoader();

  // Context
  const c         = useContext(FilterContext);
  const refDialog = useSignal<HTMLDialogElement>();

  // STATE
  const costFilters = useCostFilters();
  const typeFilters = useTypeFilters(types.value);
  const subTypeFilters = useSubTypeFilters(subtypes.value);
  const rarityFilters = useRarityFilters(rarities.value);
  const setFilters = useSetFilters(sets.value);


  // Handlers
  const addContainsFilter = $(async (value: string | undefined) => {
    if (!value) return;

    const textFilter: Filter = {
      id:         Math.random().toString(),
      label:      `Contains: "${value}"`,
      value:      value,
      field:      'text',
      filterType: FILTERS_TYPES.LIKE,
      isContains: true,
    }

    await c.addFilter(textFilter);
  })

  const handleClearLastFilter = $(async () => {
    if (c.filters.length === 0) return;
    const lastFilter = c.filters[c.filters.length - 1];
    void c.removeFilter(lastFilter.id)
  })

  const handleDialogOpen = $(() => {
    refDialog.value?.showModal();
  })

  const handleDialogClose = $(() => {
    refDialog.value?.close();
  })

  const isFilterInList = (filter: Filter) => {
    return c.filters.find(f => f.id === filter.id);
  }

  const handleAddDialogFilter = $(async (filter: Filter) => {
    // check if the filter is already in the list
    const filterInList = c.filters.find(f => f.id === filter.id);
    if (filterInList) {
      void c.removeFilter(filterInList.id);
      return;
    }

    await c.addFilter(filter);
  });

  // Render
  return (
    <div class="flex justify-between items-center gap-2">
      <FilterField onSubmit={addContainsFilter} onClear={handleClearLastFilter}>
        {c.filters.map(f => (
          <ChipFilter key={f.id} onClick$={() => c.removeFilter(f.id)}>{f.label}</ChipFilter>
        ))}
      </FilterField>
      <Button onClick$={handleDialogOpen} class="px-2 py-3 flex items-baseline gap-2">
        Filters
        <Icon name="art" width={16} height={16} class="fill-primary"/>
      </Button>
      <dialog ref={refDialog} class="p-4 container max-w-xl">
        <div class="flex gap-2">
          <h2 class="text-xl flex-1">Filter</h2>
          <div>
            <ButtonIcon>
              <Icon onClick$={handleDialogClose} name="close" width={16} height={16} class="fill-primary"/>
            </ButtonIcon>
          </div>
        </div>
        <div class="p-4">
          <Accordion title="Cost">
            <div class="flex flex-wrap gap-2">
              {costFilters.map(f => (
                <p
                  class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1 
                  ${isFilterInList(f) ? 'bg-primary text-white' : ''}`}
                  key={f.id}
                  onClick$={() => handleAddDialogFilter(f)}
                >
                  {f.label}
                </p>
              ))}
            </div>
          </Accordion>
          <Accordion title="Types">
            <div class="flex flex-wrap gap-2">
              {typeFilters.map(f => (
                <p
                  class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1 
                  ${isFilterInList(f) ? 'bg-primary text-white' : ''}`}
                  key={f.id}
                  onClick$={() => handleAddDialogFilter(f)}
                >
                  {f.label}
                </p>
              ))}
            </div>
          </Accordion>
          <Accordion title="Subtypes">
            <div class="flex flex-wrap gap-2">
              {subTypeFilters.map(f => (
                <p
                  class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1 
                  ${isFilterInList(f) ? 'bg-primary text-white' : ''}`}
                  key={f.id}
                  onClick$={() => handleAddDialogFilter(f)}
                >
                  {f.label}
                </p>
              ))}
            </div>
          </Accordion>
          <Accordion title="Sets">
            <div class="flex flex-wrap gap-2">
              {setFilters.map(f => (
                <p
                  class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1 
                  ${isFilterInList(f) ? 'bg-primary text-white' : ''}`}
                  key={f.id}
                  onClick$={() => handleAddDialogFilter(f)}
                >
                  {f.label}
                </p>
              ))}
            </div>
          </Accordion>
          <Accordion title="Rarirty">
            <div class="flex flex-wrap gap-2">
              {rarityFilters.map(f => (
                <p
                  class={`hover:bg-primary hover:text-white ring-2 ring-primary cursor-pointer px-2 py-1 
                  ${isFilterInList(f) ? 'bg-primary text-white' : ''}`}
                  key={f.id}
                  onClick$={() => handleAddDialogFilter(f)}
                >
                  {f.label}
                </p>
              ))}
            </div>
          </Accordion>
        </div>
      </dialog>
      <Pagination/>
    </div>
  );
});
