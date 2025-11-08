import type { RequestHandler } from '@builder.io/qwik-city';
import { createContainer }     from '~/app/shared/binds/binds';

export const onRequest: RequestHandler = async (req) => {
  createContainer(req);
};
