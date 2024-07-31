import { useComputed$ } from "@builder.io/qwik";
import type { DeckState }    from "~/models/Deck";

export const useDeckQuantity = (deck: DeckState, cardId: number, isSide = false) => {

  const deckQuantity = useComputed$(() => {
    const masterDeckQuantity   = Object.entries(deck.masterDeck)
      .map(([, c]) => c)
      .find(c => c.id === cardId)?.quantity ?? 0;
    const treasureDeckQuantity = Object.entries(deck.treasureDeck)
      .map(([, c]) => c)
      .find(c => c.id === cardId)?.quantity ?? 0;
    const sideDeckQuantity     = Object.entries(deck.sideDeck)
      .map(([, c]) => c)
      .find(c => c.id === cardId)?.quantity ?? 0;

    return isSide ? sideDeckQuantity : masterDeckQuantity + treasureDeckQuantity;
  });
  
  return [deckQuantity];
  
}
