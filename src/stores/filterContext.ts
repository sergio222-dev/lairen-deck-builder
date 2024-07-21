import type { QRL }        from '@builder.io/qwik';
import { $, useStore }     from '@builder.io/qwik';
import { createContextId } from '@builder.io/qwik';
import type {
  z
}                          from '@builder.io/qwik-city';
import { serverCard }      from '~/features/cards/server/fetchCards';
import type { Card }       from '~/models/Card';
import type {
  cardGetScheme
}                          from '~/models/schemes/cardGet';

export interface CardFilters extends z.infer<typeof cardGetScheme> {
}

export interface FilterContextState {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  name: string;
  page: number;
  size: number;
  types: string[];
  cards: Card[],
  count: number,
  selectedSubtypes: string[],
  updateFilters: QRL<(this: FilterContextState, filters: CardFilters) => Promise<void>>;
  updateName: QRL<(this: FilterContextState, name: string) => Promise<void>>;
  setPage: QRL<(this: FilterContextState, page: number) => Promise<void>>;
  setSize: QRL<(this: FilterContextState, size: number) => Promise<void>>;
}

export const useFilterStore = (cards: Card[] = [], count = 0, size = 20) => {
  return useStore<FilterContextState>({
    cards,
    count,
    sortBy:           'name',
    sortDirection:    'asc',
    types:            [],
    name:             '',
    page:             1,
    size,
    selectedSubtypes: [],
    updateName:       $(async function (this, name) {
      this.name                  = name;
      this.page                  = 1;
      const payload: CardFilters = {
        page:          1,
        size:          this.size,
        sortBy:        this.sortBy,
        types:         this.types,
        sortDirection: this.sortDirection,
        name
      };

      const { cards, count } = await serverCard(payload);

      this.cards = cards;
      this.count = count;
    }),
    setPage:          $(async function (this, page) {
      this.page                  = page;
      const payload: CardFilters = {
        page,
        types:         this.types,
        size:          this.size,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        name:          this.name
      };

      const { cards, count } = await serverCard(payload);

      this.cards = cards;
      this.count = count;
    }),
    setSize:          $(async function (this, size) {
      this.size                  = size;
      const payload: CardFilters = {
        page:          this.page,
        size,
        types:         this.types,
        sortBy:        this.sortBy,
        sortDirection: this.sortDirection,
        name:          this.name
      };

      const { cards, count } = await serverCard(payload);

      this.cards = cards;
      this.count = count;
    }),
    updateFilters:    $(async function (this, cardListFilter) {
      this.sortBy        = cardListFilter.sortBy;
      this.sortDirection = cardListFilter.sortDirection;
      this.name          = cardListFilter.name;
      this.types         = cardListFilter.types;
      this.page          = 1;

      const payload: CardFilters = {
        ...cardListFilter,
        page: 1,
        size: this.size
      };


      const { cards, count } = await serverCard(payload);

      this.cards = cards;
      this.count = count;
    })
  });
}

export const FilterContext = createContextId<FilterContextState>('filter-context');
