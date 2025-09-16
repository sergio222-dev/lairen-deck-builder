import type { FilterRepository } from '~/app/filter/infrastructure/filter.repository';
import { Logger }                from '~/lib/logger';
import type { Database }         from '../../../../database.types';

export type ViewName = keyof Database['public']['Views'];

export async function getDefaultFilterValues(filterRepo: FilterRepository, view: Array<ViewName>) {

  const values: Partial<Record<ViewName, Array<string>>> = {};

  for (const v of view) {
    const { data, error } = await filterRepo.fetchViewValue(v);

    if (error) {
      Logger.error(error, `Error fetching data from view ${view}: ${error.message}`);
      throw new Error(`Error fetching data from view ${view}: ${error.message}`);
    }

    values[v] = data.map(v => v.name) as Array<string>;
  }


  return values;
}
