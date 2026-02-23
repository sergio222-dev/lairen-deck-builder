// import { RequestEventBase, server$ } from "@builder.io/qwik-city";
// import { DeckRepository }            from '~/app/deck/infrastructure/deck.repository';
// import { ImportDeckRequest }         from "~/models/application/ImportCardItem";
// import { DeckState }                 from "~/models/Deck";
//
// type FetchDeckImport = (this: RequestEventBase, deckImportRequest: ImportDeckRequest) => Promise<DeckState>
//
// export const fetchDeckImport = server$<FetchDeckImport>(async function (deckImportRequest) {
//   const deckRepo = new DeckRepository(this);
//
//   const deck = await deckRepo.getDeckByImport(deckImportRequest);
//
//   return deck;
// })
