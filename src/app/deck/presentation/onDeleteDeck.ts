import { server$ }        from '@builder.io/qwik-city';
import { deleteDeck }     from '~/app/deck/application/deleteDeck';
import { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

export const onDeleteDeck = server$(async function(this, deckId: number) {
  const deckRepo = new DeckRepository(this);

  await deleteDeck(deckRepo, deckId);
});
