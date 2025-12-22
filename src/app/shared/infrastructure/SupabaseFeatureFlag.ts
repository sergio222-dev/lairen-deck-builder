import type { SupabaseClient } from '@supabase/supabase-js';
import { FEATURES }            from '~/app/shared/application/enums/FEATURES';
import type { FeatureFlag }    from '~/app/shared/application/FeatureFlag';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { Logger }              from '~/lib/logger';
import type { Database }       from '../../../../database.extension.types';

export class SupabaseFeatureFlag implements FeatureFlag {
  static readonly inject = [TOKENS.SUPABASE];

  constructor(private readonly supabse: SupabaseClient<Database, 'public'>) {
  }

  async isEnabled(feature: FEATURES): Promise<boolean> {

    if (feature === FEATURES.MAINTENANCE) {
      try {
        const { data: auth, error: authError } = await this.supabse.auth.getUser();

        if (authError) {
          Logger.error(authError);
        }

        if (auth.user?.email === 'molinasergio91@gmail.com') {
          return false;
        }
      } catch (e) {
        Logger.error(e);
      }
    }

    const { data, error } = await this.supabse.from('feature_flags').select().eq('name', feature).single();

    if (error) {
      Logger.error(error);
      throw error;
    }

    return data.enabled;
  }
}
