import type { SupabaseClient } from '@supabase/supabase-js';

import type { AuthService } from '~/app/shared/application/auth.service';
import type { User }        from '~/app/shared/application/DTO/user.dto';
import { TOKENS }           from '~/app/shared/binds/TOKENS';
import { UnauthorizedException } from '~/exceptions/UnauthorizedException';
import { Logger }           from '~/lib/logger';
import type { Database }    from '../../../../database.types';

export class SupabaseAuthService implements AuthService {
  public static inject = [TOKENS.SUPABASE, TOKENS.CURRENT_USER];

  constructor(private supabaseClient: SupabaseClient<Database, 'public'>, private getCurrentUser: () => User | null) {
  }

  async authenticate(accessToken?: string): Promise<User> {
    let jwt = accessToken;

    if (!jwt) {
      const user = this.getCurrentUser();
      if (user) {
        Logger.debug('USER FOUND IN AUTH SERVICE')
        jwt = user.access_token;
      }
    }

    Logger.debug(`VALIDATE WITH JWT: ${jwt}`)
    const { data, error } = await this.supabaseClient.auth.getUser(jwt);

    if (error) {
      Logger.error(error,
        `Class: ${SupabaseAuthService.name}, Method: ${this.authenticate.name}, Error: ${error.message}`);
      throw new UnauthorizedException('Unauthorized');
    }

    if (!data.user) {
      Logger.error(error,
        `Class: ${SupabaseAuthService.name}, Method: ${this.authenticate.name}, Error: No user in session`);

      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id:         data.user.id,
      email:      data.user.email!,
      avatar_url: data.user.user_metadata.avatar_url
    };
  }
}
