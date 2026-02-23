import type { RequestHandler }  from '@builder.io/qwik-city';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { decodeJwt }            from 'jose';
import { User }                 from '~/app/shared/application/DTO/user.dto';
import { AUTH }                 from '~/lib/constants/auth';
import { QWIK_CONSTANTS }       from '~/lib/constants/qwik';

export const onRequest: RequestHandler = async (requestEvent) => {
  const token = requestEvent.cookie.get(AUTH.ACCESS_TOKEN);
  if (token) {
    const decoded = decodeJwt<SupabaseUser>(token.value);

    if (decoded.sub && decoded.email) {

      const user: User = {
        email:      decoded.email,
        id:         decoded.sub,
        avatar_url: decoded.user_metadata.avatar_url
      };
      requestEvent.sharedMap.set(QWIK_CONSTANTS.REQUEST_USER, user);
    }
  } else {
    requestEvent.sharedMap.set(QWIK_CONSTANTS.REQUEST_USER, null);
  }

};
