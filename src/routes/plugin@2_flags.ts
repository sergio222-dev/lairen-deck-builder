import type { RequestHandler } from '@builder.io/qwik-city';
import { FEATURES }            from '~/app/shared/application/enums/FEATURES';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IoC }                 from '~/lib/IoC';

export const onRequest: RequestHandler = async (requestEvent) => {
  const instance = IoC.instance;

  const flags = instance.resolve(TOKENS.FEATURE_FLAG);

  // check maintenance
  let isMaintenance = false;
  try {
    isMaintenance = await flags.isEnabled(FEATURES.MAINTENANCE);
    requestEvent.sharedMap.set(FEATURES.MAINTENANCE, isMaintenance);
  } catch (e) {
    requestEvent.sharedMap.set(FEATURES.MAINTENANCE, true);
  }

  if (isMaintenance) {
    if (requestEvent.pathname !== '/') throw requestEvent.redirect(302, '/');
  }
}
