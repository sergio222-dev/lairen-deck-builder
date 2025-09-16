import type { Signal }                  from '@builder.io/qwik';
import { $, createContextId, useStore } from '@builder.io/qwik';
import { fetchFilteredCards }           from '~/app/filter/presentation/fetchFilteredCards';
import { Logger }                       from '~/lib/logger';
import type {
  FILTER_STORE,
  FilterStoreState
}                                       from '~/UI/filters/models/filter.store.model';
import {
  CATEGORY_FILTERS,
  DEFAULT_PAGINATION,
  DEFAULT_SORT,
  generatePageFilter
}                                       from '~/UI/filters/models/filterDefinition.model';
import { normalizeArray }               from '~/utils/normalize';

export const filterStoreInitialState: FilterStoreState = {
  filterGroups: {},
  cardStack:    {},
  cards:        [],
  count:        0,
  sortBy:       DEFAULT_SORT,

  quantityRarityFilters:    0,
  quantityTextFilters:      0,
  quantityCostFilters:      0,
  quantitySetFilters:       0,
  quantitySubTypeFilters:   0,
  quantitySuperTypeFilters: 0,
  quantityTypeFilters:      0,


  rarityFilters:    [],
  textFilters:      [],
  costFilters:      [],
  setFilters:       [],
  typeFilters:      [],
  subTypeFilters:   [],
  superTypeFilters: [],

  pagination: DEFAULT_PAGINATION
};


export const useFilterStore = (initialState: Signal<FilterStoreState> | Signal<null>) => {

  return useStore<FILTER_STORE>({
    ...initialState.value ?? filterStoreInitialState,
    addFilter:    $(async function(this, id, value, label) {
      if (this.filterGroups[id].currentValues.some(v => v.value === value)) return;

      this.filterGroups[id].currentValues.push({
        value,
        label: label ?? value
      });

      switch (id) {
        case CATEGORY_FILTERS.RARITY:
          this.quantityRarityFilters++;
          this.rarityFilters.push(value);
          break;
        case CATEGORY_FILTERS.TEXT:
          this.quantityTextFilters++;
          this.textFilters.push(value);
          break;
        case CATEGORY_FILTERS.SET:
          this.quantitySetFilters++;
          this.setFilters.push(value);
          break;
        case CATEGORY_FILTERS.SUB_TYPE:
          this.quantitySubTypeFilters++;
          this.subTypeFilters.push(value);
          break;
        case CATEGORY_FILTERS.TYPE:
          this.quantityTypeFilters++;
          this.typeFilters.push(value);
          break;
        case CATEGORY_FILTERS.SUPER_TYPE:
          this.quantitySuperTypeFilters++;
          this.superTypeFilters.push(value);
          break;
        case CATEGORY_FILTERS.COST:
          this.quantityCostFilters++;
          this.costFilters.push(value);
          break;
      }

      this.pagination.page = 1;
      await this.fetchCards();
    }),
    removeFilter: $(async function(this, id, value) {
      if (!this.filterGroups[id].currentValues.some(v => v.value === value)) {
        return;
      }

      // remove from current values
      this.filterGroups[id].currentValues = this.filterGroups[id].currentValues.filter(v => v.value !== value);

      switch (id) {
        case CATEGORY_FILTERS.RARITY:
          this.quantityRarityFilters--;
          this.rarityFilters = this.rarityFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.TEXT:
          this.quantityTextFilters--;
          this.textFilters = this.textFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.SET:
          this.quantitySetFilters--;
          this.setFilters = this.setFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.SUB_TYPE:
          this.quantitySubTypeFilters--;
          this.subTypeFilters = this.subTypeFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.TYPE:
          this.quantityTypeFilters--;
          this.typeFilters = this.typeFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.SUPER_TYPE:
          this.quantitySuperTypeFilters--;
          this.superTypeFilters = this.superTypeFilters.filter(v => v !== value);
          break;
        case CATEGORY_FILTERS.COST:
          this.quantityCostFilters--;
          this.costFilters = this.costFilters.filter(v => v !== value);
      }

      this.pagination.page = 1;
      await this.fetchCards();
    }),
    toggleExclusive: $(async function(this, id) {
      this.filterGroups[id].exclusive = !this.filterGroups[id].exclusive;
      this.pagination.page = 1;
      await this.fetchCards();
    }),
    setPage:      $(async function(this, page) {
      this.pagination.page = page;
      await this.fetchCards();
    }),
    fetchCards:   $(async function(this) {
      this.filterGroups[CATEGORY_FILTERS.PAGINATION] = generatePageFilter(this.pagination);

      // execute async tasks...
      const cards           = await fetchFilteredCards(Object.values(this.filterGroups));
      this.cardStack        = normalizeArray(cards.cards);
      this.count            = cards.count;
      this.cards            = cards.cards.map(c => c.id);
      this.pagination.pages = Math.ceil(this.count / this.pagination.size);
    })
  });
};

export const FILTER_CONTEXT = createContextId<FILTER_STORE>('filter-store');
