import { server$ } from '@builder.io/qwik-city';
import { TOKENS }  from '~/app/shared/binds/TOKENS';
import { IoC }     from '~/lib/IoC';
import { Logger }  from '~/lib/logger';

export const deleteDeckServer = server$<(deckId: number) => Promise<void>>(async (deckId) => {
  const deleteDeck = IoC.instance.resolve(TOKENS.DELETE_DECK_PRESENTER);

  try {
    await deleteDeck.execute(deckId);
  } catch (e) {
    Logger.error(e);
  }
});
