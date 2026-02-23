import { server$ }                                       from '@builder.io/qwik-city';
import { TOKENS }                                        from '~/app/shared/binds/TOKENS';
import { IoC }                                           from '~/lib/IoC';
import type { UIBasicDeckInformation, UICardInDeckItem } from '~/UI/deck/models/deck.store.model';

export const saveDeckServer = server$<(data: UIBasicDeckInformation, cards: UICardInDeckItem[]) => Promise<number>>(
  async (data, cards) => {
    const instance = IoC.instance;

    try {
      const saveDeck = instance.resolve(TOKENS.SAVE_DECK_PRESENTER);
      return await saveDeck.execute(data, cards);
    } catch (e) {
      return 0;
    }
  });
