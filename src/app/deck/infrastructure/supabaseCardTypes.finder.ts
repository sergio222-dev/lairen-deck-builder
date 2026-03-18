import { SupabaseClient }  from '@supabase/supabase-js';
import { CardTypesFinder } from '~/app/deck/application/finder/cardTypes.finder';
import { FindAllUnitTypesProjection } from '~/app/deck/application/projection/findAllUnitTypes.projection';
import { TOKENS }          from '~/app/shared/binds/TOKENS';
import { Logger } from '~/lib/logger';
import { Database }        from '../../../../database.extension.types';

export class SupabaseCardTypesFinder implements CardTypesFinder {
  static readonly inject = [TOKENS.SUPABASE]

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async findAllUnitTypes(): Promise<FindAllUnitTypesProjection> {
    const { data, error } = await this.supabase.from('unit_types').select('*').order('name', { ascending: true });

    if (error) {
      Logger.error(error, `Class: ${SupabaseCardTypesFinder.name}, Method: ${this.findAllUnitTypes.name}`)
      throw error;
    }

    return {
      types: data.map(x => x.name ?? '')
    }
  }

}
