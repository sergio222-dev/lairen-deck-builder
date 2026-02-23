// import { RequestEventBase, server$ } from '@builder.io/qwik-city';
// import { DeckRepository }            from '~/app/deck/infrastructure/deck.repository';
//
// type DeleteDeckServer = (this: RequestEventBase, deckId: number) => Promise<void>;
//
// export const deleteDeck = server$<DeleteDeckServer>(async function(deckId) {
//   const deckRepo = new DeckRepository(this);
//
//   await deckRepo.deleteDeck(deckId);
// });
