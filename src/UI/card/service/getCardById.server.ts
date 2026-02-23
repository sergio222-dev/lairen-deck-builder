import type { RequestEventBase } from '@builder.io/qwik-city';
import { server$ }               from '@builder.io/qwik-city';
import { TOKENS }                from '~/app/shared/binds/TOKENS';
import { IoC }                   from '~/lib/IoC';
import type { UICard }           from '~/UI/card/models/card.model';

type GetCardByIdServerType = (this: RequestEventBase, cardId: number) => Promise<UICard>;


export const getCardByIdServer = server$<GetCardByIdServerType>(async function(cardId: number) {
  this.cacheControl({
    private: true,
    maxAge: 5,
    staleWhileRevalidate: 60 * 60 * 24 * 7,
  });

  const instance = IoC.instance;

  const getCardById = instance.resolve(TOKENS.GET_CARD_BY_ID_PRESENTER);

  return await getCardById.execute(cardId);
});
