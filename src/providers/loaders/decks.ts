import { routeLoader$ }   from '@builder.io/qwik-city';
import type { DeckState } from '~/models/Deck';
import { DeckRepository } from '~/providers/repositories/DeckRepository';
import { on }             from '~/utils/go';

// eslint-disable-next-line qwik/loader-location
export const useListPublicDeckLoader = routeLoader$(async (requestEnv) => {
  try {
    const deckRepo = new DeckRepository(requestEnv);

    const decks = await deckRepo.listPublicDecks();

    return {
      decks
    };

  } catch (e) {
    return {
      decks: []
    };
  }
});

// eslint-disable-next-line qwik/loader-location
export const useListMyDeckLoader = routeLoader$(async (requestEnv) => {
  const deckRepo = new DeckRepository(requestEnv);

  const [decks, ok] = await on(deckRepo.listUserDecks());

  if (ok) {
    return {
      decks: []
    };
  }

  return {
    decks
  };
});

// eslint-disable-next-line qwik/loader-location
export const usePublicDeckLoader = routeLoader$<DeckState | undefined>(async (requestEnv) => {
  const deckRepo = new DeckRepository(requestEnv);

  if (!requestEnv.params.id) {
    throw new Error('Deck ID is required');
  }

  const numberId = parseInt(requestEnv.params.id);
  const [deck, error] = await on(deckRepo.getPublicDeck(numberId));

  if (error) {
    return undefined;
  }

  return deck;
});
