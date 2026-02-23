import type { RequestHandler } from '@builder.io/qwik-city';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IoC }                 from '~/lib/IoC';
import { Logger }              from '~/lib/logger';
import { isRouteGuard }        from '~/routes/route.guard';

export const onRequest: RequestHandler = (requestEvent) => {
  Logger.debug(`EXECUTED PLUGIN ROUTE GUARD`)

  const getCurrentUser = IoC.instance.resolve(TOKENS.CURRENT_USER);

  const user = getCurrentUser();

  if (isRouteGuard(requestEvent.pathname)) {
    Logger.info(`RouteGuarded ${requestEvent.pathname}`);

    if (!user) throw requestEvent.redirect(302, '/');
  }
};
