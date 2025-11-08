import type { RequestHandler } from '@builder.io/qwik-city';
import { initializeLogger }    from '~/lib/logger';

export const onRequest: RequestHandler = async ({ env }) => {
  const development = env.get('DEV');
  initializeLogger(development ? 'debug' : 'info');
};
