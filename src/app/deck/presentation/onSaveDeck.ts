import { server$ } from '@builder.io/qwik-city';
import { saveDeck } from '~/app/deck/application/saveDeck';
import { DeckRepository }         from '~/app/deck/infrastructure/deck.repository';
import type { DeckInformationUI } from '~/UI/deck/models/deck.store.model';

export const onSaveDeck = server$(async function(this, deck: DeckInformationUI) {
  const deckRepo = new DeckRepository(this);

  return saveDeck(deckRepo, deck)
});
