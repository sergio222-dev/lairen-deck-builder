import type { RequestHandler } from '@builder.io/qwik-city';
import { cardGetScheme }       from '~/models/schemes/cardGet';

export const onGet: RequestHandler = async ({ json, query }) => {
  try {
    const result = cardGetScheme.safeParse({
      page: query.get('page'),
      size: query.get('size')
    });

    if (!result.success) {
      json(400, result.error);

      return;
    }

    json(200, result.data);
    return;
  } catch (e) {

    json(400, e);
  }
};
