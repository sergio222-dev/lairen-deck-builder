import type { RequestHandler } from '@builder.io/qwik-city';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IoC }                 from '~/lib/IoC';
import { Logger }              from '~/lib/logger';
import { isRouteGuard }        from '~/routes/route.guard';

export const onRequest: RequestHandler = async (requestEvent) => {

  if (isRouteGuard(requestEvent.pathname)) {
    Logger.info(`RouteGuard ${requestEvent.pathname}`);
    const getCurrentUser = IoC.instance.resolve(TOKENS.GET_CURRENT_USER);

    try {
      await getCurrentUser.execute();
    } catch (e) {
      Logger.warn(`RouteGuard: No auth in route ${requestEvent.pathname}`);
      throw requestEvent.redirect(302, '/');
    }
  }
};
