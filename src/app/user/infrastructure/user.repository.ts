import type { SupabaseClient } from '@supabase/supabase-js';

import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { UserIdValueObject }   from '~/app/shared/models/VO/UserId.ValueObject';
import { User }                from '~/app/user/models/user.models';
import { Logger }              from '~/lib/logger';
import type { Database }       from '../../../../database.types';

export class UserRepository {
  public static inject = [TOKENS.SUPABASE] as const;

  constructor(private readonly supabase: SupabaseClient<Database, 'public'>) {
  }

  async getCurrentUser(): Promise<User> {
    const { error, data } = await this.supabase.auth.getUser();

    if (error) {
      Logger.error(error);
      throw error;
    }

    return User.CREATE({
      id: new UserIdValueObject(data.user.id)
    });
  }
}
