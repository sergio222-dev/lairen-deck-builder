import type { SupabaseClient } from '@supabase/supabase-js';

import type { AuthService } from '~/app/shared/application/auth.service';
import type { User }        from '~/app/shared/application/DTO/user.dto';
import { TOKENS }           from '~/app/shared/binds/TOKENS';
import { Logger }           from '~/lib/logger';
import type { Database }    from '../../../../database.types';

export class SupabaseAuthService implements AuthService {
  public static inject = [TOKENS.SUPABASE];

  constructor(private supabaseClient: SupabaseClient<Database, 'public'>) {
  }

  async getUser(accessToken?: string): Promise<User | null> {

    const { data, error } = await this.supabaseClient.auth.getUser(accessToken);

    if (error) {
      Logger.warn(`Class: ${SupabaseAuthService.name}, Method: ${this.getUser.name}, Error: ${error.message}`);
      return null;
    }

    if (!data.user) return null;

    return {
      id:    data.user.id,
      email: data.user.email!,
      avatar_url: data.user.user_metadata.avatar_url,
    };
  }
}
