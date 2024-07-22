import { RequestEventBase, server$, z } from '@builder.io/qwik-city';
import { DeckState }                    from "~/models/Deck";
import { DeckRepository }               from '~/providers/repositories/DeckRepository';

type SaveDeckServer = (this: RequestEventBase, deck: DeckState) => Promise<number>

export const saveDeck = server$<SaveDeckServer>(async function (deck) {
  const deckRepo = new DeckRepository(this);

  return await deckRepo.saveDeck(deck);
})
