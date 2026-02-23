import type { RequestHandler } from '@builder.io/qwik-city';
import { createContainer }     from '~/app/shared/binds/binds';
import { Logger }              from '~/lib/logger';

export const onRequest: RequestHandler = (req) => {
  Logger.debug(`EXECUTED PLUGIN CONTAINER`);
  createContainer(req);
};
