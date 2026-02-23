import type { RequestHandler } from '@builder.io/qwik-city';
import { createContainer }     from '~/app/shared/binds/binds';
import { initializeLogger }    from '~/lib/logger';

export const onRequest: RequestHandler = async (req) => {
  const development = req.env.get('DEV');
  initializeLogger(development ? 'debug' : 'info');
};
