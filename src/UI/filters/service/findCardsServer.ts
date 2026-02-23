import { server$ }                 from '@builder.io/qwik-city';
import { TOKENS }                  from '~/app/shared/binds/TOKENS';
import { IoC }                     from '~/lib/IoC';
import type { UIFilterDefinition } from '~/UI/filters/models/filterDefinition.model';
import type { UICardStackItem }    from '~/UI/shared/models/CardStackItem';

type FindCardsServer = (filters: UIFilterDefinition[], dominion?: boolean) => Promise<[UICardStackItem[], number]>

export const findCardsServer = server$<FindCardsServer>(async (filters, dominion = false) => {
  const instance = IoC.instance;

  const findCard = instance.resolve(TOKENS.FIND_CARDS_PRESENTER);

  return await findCard.execute(filters, dominion);
});
