import type { RequestHandler } from '@builder.io/qwik-city';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { AUTH }                from '~/lib/constants/auth';
import { QWIK_CONSTANTS }      from '~/lib/constants/qwik';
import { IoC }                 from '~/lib/IoC';
import { Logger }              from '~/lib/logger';

export const onRequest: RequestHandler = async (requestEvent) => {
  Logger.debug(`EXECUTED PLUGIN AUTH`);

  const authService = IoC.instance.resolve(TOKENS.AUTH_SERVICE);

  const token = requestEvent.cookie.get(AUTH.ACCESS_TOKEN);
  const user  = await authService.getUser(token?.value);

  requestEvent.sharedMap.set(QWIK_CONSTANTS.REQUEST_USER, user);
};
