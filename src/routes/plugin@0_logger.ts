import type { RequestHandler } from '@builder.io/qwik-city';
import { initializeLogger }    from '~/lib/logger';

export const onRequest: RequestHandler = (req) => {
  const development = req.env.get('DEV');
  initializeLogger(development ? 'debug' : 'info');
};
