import type { QRL }        from '@builder.io/qwik';
import { createContextId } from '@builder.io/qwik';
import type { Card }       from '~/models/Card';

interface CardFilters {
  sortBy       : string;
  sortDirection: 'asc' | 'desc';
  name         : string;
    // page: number;
    // size: number;
}

export interface FilterContextState {
  sortBy       : string;
  sortDirection: 'asc' | 'desc';
  name         : string;
  page         : number;
  size         : number;
  cards        : Card[],
  count        : number,
  updateFilters: QRL<(this: FilterContextState, filters: CardFilters) => Promise<void>>;
  updateName: QRL<(this: FilterContextState, name: string) => Promise<void>>;
  setPage      : QRL<(this: FilterContextState, page: number) => Promise<void>>;
  setSize      : QRL<(this: FilterContextState, size: number) => Promise<void>>;
}

export const FilterContext = createContextId<FilterContextState>('filter-context');