import type { SupabaseClient }          from '@supabase/supabase-js';
import type { CardFilterOptionsFinder } from '~/app/card/application/finder/cardFilterOptions.finder';
import type { FiltersOptions }          from '~/app/card/application/projections/filtersOptions';
import { TOKENS }                       from '~/app/shared/binds/TOKENS';
import type { Database }                from '../../../../database.extension.types';

export class SupabaseCardFilterOptionsFinder implements CardFilterOptionsFinder {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getSuperType(): Promise<FiltersOptions[]> {
    const { data, error } = await this.supabase.from('card_supertypes').select();

    if (error) throw error;

    return this.toResults(data);
  }

  async getSubType(): Promise<FiltersOptions[]> {
    const { data, error } = await this.supabase.from('card_subtypes').select();

    if (error) throw error;

    return this.toResults(data);
  }

  async getTypes(): Promise<FiltersOptions[]> {
    const { data, error } = await this.supabase.from('card_types').select();

    if (error) throw error;

    return this.toResults(data);
  }

  async getSets(): Promise<FiltersOptions[]> {
    const { data, error } = await this.supabase.from('card_sets').select('name').order('created_at');

    if (error) throw error;

    return this.toResults(data);
  }

  private toResults(data: { name: string | null }[]) {
    return data.filter(x => x.name !== null).map<FiltersOptions>(x => ({ value: x.name! }));
  }
}
