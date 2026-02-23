// import { RequestEventBase, server$, z } from '@builder.io/qwik-city';
// import { DeckRepository }               from '~/app/deck/infrastructure/deck.repository';
// import { DeckState }                    from "~/models/Deck";
//
// type SaveDeckServer = (this: RequestEventBase, deck: DeckState) => Promise<number>
//
// export const saveDeck = server$<SaveDeckServer>(async function (deck) {
//   const deckRepo = new DeckRepository(this);
//
//   return await deckRepo.saveDeck(deck);
// })
