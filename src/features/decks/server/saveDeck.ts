import { RequestEventBase, server$, z } from '@builder.io/qwik-city';
import { createDeckRequest }            from '~/models/schemes/createDeckRequest';
import { DeckRepository }               from '~/providers/repositories/DeckRepository';

type SaveDeckServer = (this: RequestEventBase, deck: z.infer<typeof createDeckRequest>) => Promise<number>

export const saveDeck = server$<SaveDeckServer>(async function(deck) {
  const deckRepo = new DeckRepository(this);

  return await deckRepo.saveDeck(deck);
})
