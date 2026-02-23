import type { RequestHandler }          from '@builder.io/qwik-city';
import type { PlatformCloudflarePages } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import { TOKENS }                       from '~/app/shared/binds/TOKENS';
import { IoC }                          from '~/lib/IoC';
import { Logger }                       from '~/lib/logger';

export const onPost: RequestHandler<PlatformCloudflarePages> = async (request) => {
  const client = IoC.instance.resolve(TOKENS.SUPABASE);

  const { error } = await client.auth.signOut();
  //
  // request.cookie.delete(AUTH.PART_1, {
  //   path:     '/',
  //   // httpOnly: true,
  //   sameSite: 'Lax',
  // })
  // request.cookie.delete(AUTH.PART_2, {
  //   path: '/',
  //   sameSite: 'Lax',
  // })

  if (error) {
    Logger.error(error);
  }

  request.json(200, '');
};
