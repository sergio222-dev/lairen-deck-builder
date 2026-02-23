import type { RequestHandler }          from '@builder.io/qwik-city';
import type { PlatformCloudflarePages } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import { TOKENS }                       from '~/app/shared/binds/TOKENS';
import { IoC }                          from '~/lib/IoC';
import { Logger }                       from '~/lib/logger';

export const onGet: RequestHandler<PlatformCloudflarePages> = async (request) => {
  const client = IoC.instance.resolve(TOKENS.SUPABASE);
  Logger.info(`VALIDATING CODE AND EXCHANGE`);
  const code = request.query.get('code');

  if (!code) {
    request.json(400, { error: 'No code provided' });
  }

  if (code) {
    const { data, error } = await client.auth.exchangeCodeForSession(code);

    if (error) {
      Logger.error(`ERROR IN LOGGING USER`);
      request.json(400, { error: error.message });
    } else {
      Logger.info('USER LOGGED');
      Logger.info(data.user.email);

      // request.cookie.set(AUTH.ACCESS_TOKEN, data.session.access_token, {
      //   path:     '/',
      //   // httpOnly: true,
      //   secure:   false, // true en producción
      //   sameSite: 'Lax',
      //   maxAge:   60 * 60 // 1 hora
      // });
      // request.cookie.set(AUTH.REFRESH_TOKEN, data.session.refresh_token, {
      //   path:     '/',
      //   // httpOnly: true,
      //   secure:   false, // true en producción
      //   sameSite: 'Lax',
      //   maxAge:   60 * 60 * 24 * 30
      // });

      throw request.redirect(303,
        new URL('/', request.url).toString());
    }
  }
};
