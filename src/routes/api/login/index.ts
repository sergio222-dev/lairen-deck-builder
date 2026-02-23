import type { RequestHandler }          from '@builder.io/qwik-city';
import type { PlatformCloudflarePages } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import { TOKENS }                       from '~/app/shared/binds/TOKENS';
import { IoC }                          from '~/lib/IoC';
import { Logger }                       from '~/lib/logger';

export const onPost: RequestHandler<PlatformCloudflarePages> = async (request) => {
  const client = IoC.instance.resolve(TOKENS.SUPABASE);

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google', options: {
      redirectTo:          request.url.origin + '/api/callback',
      skipBrowserRedirect: true,
    }
  });

  if (error) {
    Logger.error(error);
  }

  request.json(200, JSON.stringify(data));
};
