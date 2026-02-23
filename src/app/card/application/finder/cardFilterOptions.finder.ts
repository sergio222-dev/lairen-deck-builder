import type { FiltersOptions } from '~/app/card/application/projections/filtersOptions';

export enum CardFilterOptions {
  TYPES,
  SUPERTYPES,
  SUBTYPES,
  SETS,
}

export interface CardFilterOptionsFinder {
  getTypes(): Promise<FiltersOptions[]>;

  getSuperType(): Promise<FiltersOptions[]>;

  getSubType(): Promise<FiltersOptions[]>;

  getSets(): Promise<FiltersOptions[]>;
}
