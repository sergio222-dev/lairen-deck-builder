import { RequestEventBase, server$ } from '@builder.io/qwik-city';
import { DeckRepository }            from '~/providers/repositories/DeckRepository';

type DeleteDeckServer = (this: RequestEventBase, deckId: number) => Promise<void>;

export const deleteDeck = server$<DeleteDeckServer>(async function(deckId) {
  const deckRepo = new DeckRepository(this);

  await deckRepo.deleteDeck(deckId);
});
