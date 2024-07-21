import { routeLoader$ }   from "@builder.io/qwik-city";
import type { DeckState } from "~/models/Deck";
import { DeckRepository } from "~/providers/repositories/DeckRepository";
import { on }             from "~/utils/go";

// eslint-disable-next-line qwik/loader-location
export const useListPublicDeckLoader = routeLoader$(async (requestEnv) => {
  try {
    const deckRepo = new DeckRepository(requestEnv);

    const decks = await deckRepo.listPublicDecks();

    return {
      decks,
    }

  } catch (e) {
    return {
      decks: []
    }
  }
})

// eslint-disable-next-line qwik/loader-location
export const usePublicDeckLoader = routeLoader$<DeckState | undefined>(async (requestEnv) => {
  const deckRepo = new DeckRepository(requestEnv);

  const [deck, error] = await on(deckRepo.getPublicDeck(requestEnv.params.id));

  if (error) {
    return undefined;
  }

  return deck;
});
