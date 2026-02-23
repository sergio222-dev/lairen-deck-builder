import type { RequestHandler } from '@builder.io/qwik-city';

import { FLAGS }          from '~/app/shared/application/constants/flags';
import { TOKENS }         from '~/app/shared/binds/TOKENS';
import { QWIK_CONSTANTS } from '~/lib/constants/qwik';

import { IoC } from '~/lib/IoC';
import { Logger } from '~/lib/logger';

export const onRequest: RequestHandler = async (requestEvent) => {
  Logger.debug(`EXECUTED PLUGIN FLAGS`)
  const instance = IoC.instance;

  const flags          = instance.resolve(TOKENS.FLAG_SERVICE);
  const getCurrentUser = instance.resolve(TOKENS.CURRENT_USER);

  // check maintenance
  const user          = getCurrentUser();
  let isMaintenance = await flags.getFlag(FLAGS.MAINTENANCE);

  if (user && user.email === QWIK_CONSTANTS.SUPER_USER_MAIL) {
    isMaintenance = false;
    requestEvent.sharedMap.set(FLAGS.MAINTENANCE, false);
  } else {
    requestEvent.sharedMap.set(FLAGS.MAINTENANCE, isMaintenance);
  }

  if (isMaintenance) {
    if (requestEvent.pathname !==
      '/' &&
      requestEvent.pathname !==
      '/api/login' &&
      requestEvent.pathname !==
      '/api/callback') {
      Logger.debug(`UNABLE TO ACCESS, SERVER IN MAINTENANCE`)
      throw requestEvent.redirect(302, '/');
    }
  }
};
