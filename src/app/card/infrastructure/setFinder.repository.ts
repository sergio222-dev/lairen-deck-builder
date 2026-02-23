import type { SupabaseClient } from '@supabase/supabase-js';

import { TOKENS }    from '~/app/shared/binds/TOKENS';
import { Logger }    from '~/lib/logger';
import type { Database } from '../../../../database.types';

export class SetFinderRepository {
  public static inject = [TOKENS.SUPABASE];

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {}

  async getAvailableSet(): Promise<string[]> {
    const { data, error } = await this.supabase.from('card_sets').select();

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    return data.map(s => s.name);
  }

  async getDominionSets(): Promise<string[]> {
    const { data, error } = await this.supabase.from('dominion').select().overrideTypes<{name: string} []>();

    if (error) {
      Logger.error(error, error.message);
      throw error;
    }

    return data.map(s => s.name);
  }
}
