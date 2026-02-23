import type { SupabaseClient } from '@supabase/supabase-js';
import { TOKENS }            from '~/app/shared/binds/TOKENS';
import type { FLAGS }        from '~/app/shared/application/constants/flags';
import type { FlagsService } from '~/app/shared/application/flags.service';
import type { Database }     from '../../../../database.extension.types';

export class PgFlagService implements FlagsService {
  static inject = [TOKENS.SUPABASE];

  constructor(private supabaseClient: SupabaseClient<Database, 'public'>) {
  }

  async getFlag(flag: FLAGS): Promise<boolean> {
    const { data, error } = await this.supabaseClient
      .from('feature_flags')
      .select('*')
      .eq('name', flag.valueOf())
      .single();

    if (error) throw error;

    return data.enabled;

  }
}
