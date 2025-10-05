import { server$ } from '@builder.io/qwik-city';
import { listUserDecks } from '~/app/deck/application/listUserDecks';
import { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

export const onListUserDecks = server$(async function(this, userId: string){
  const deckRepo = new DeckRepository(this);

  return listUserDecks(deckRepo, userId);
});
