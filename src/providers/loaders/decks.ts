import { routeLoader$ }   from '@builder.io/qwik-city';
import { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import type { DeckState } from '~/models/Deck';
import { on }             from '~/utils/go';


// eslint-disable-next-line qwik/loader-location
export const usePublicDeckLoader = routeLoader$<DeckState | undefined>(async (requestEnv) => {
  const deckRepo = new DeckRepository(requestEnv);

  if (!requestEnv.params.id) {
    throw new Error('Deck ID is required');
  }

  const numberId      = parseInt(requestEnv.params.id);
  const [deck, error] = await on(deckRepo.getPublicDeck(numberId));

  if (error) {
    return undefined;
  }

  return deck;
});
