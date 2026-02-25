import type { RequestHandler } from '@builder.io/qwik-city';
import { AuthSession }         from '@supabase/supabase-js';
import { Buffer }              from 'node:buffer';
import { User }                from '~/app/shared/application/DTO/user.dto';
import { AUTH }                from '~/lib/constants/auth';
import { QWIK_CONSTANTS }      from '~/lib/constants/qwik';

export const onRequest: RequestHandler = async (requestEvent) => {
  const part1 = requestEvent.cookie.get(AUTH.PART_1);
  const part2 = requestEvent.cookie.get(AUTH.PART_2);

  let user: User | null = null;

  if (part1) {
    try {
      const rawToken = part1.value + (part2?.value ?? '');
      const token =
              rawToken.startsWith('base64-')
                ? rawToken.slice('base64-'.length)
                : rawToken;

      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const session = JSON.parse(decoded) as AuthSession;

      if (session.user) {
        user = {
          id: session.user.id,
          email: session.user.email ?? '',
          avatar_url: session.user.user_metadata.avatar_url as string,
          access_token: session.access_token,
          refresh_token: session.refresh_token
        };
      }
    } catch {
      // token inválido → user queda null
    }
  }

  requestEvent.sharedMap.set(QWIK_CONSTANTS.REQUEST_USER, user);
  await requestEvent.next();
};
