import type { DeckState } from "~/models/Deck";

export function parseToText(deck: DeckState) {

  // calculate total of main deck

 const realmTotal = Object.entries(deck.masterDeck)
    .map(([, c]) => c)
    .reduce((acc, c) => acc + c.quantity, 0);

 const treasureTotal = Object.entries(deck.treasureDeck)
    .map(([, c]) => c)
    .reduce((acc, c) => acc + c.quantity, 0);

 const sideTotal = Object.entries(deck.sideDeck)
    .map(([, c]) => c)
    .reduce((acc, c) => acc + c.quantity, 0);

  let text = `
  Reino: (total: ${realmTotal})
  `;

  Object.entries(deck.masterDeck).forEach(([, card]) => {
    text += `${card.name} x${card.quantity}
    `
  });

  text += `
  
  Bóveda: (total: ${treasureTotal})
  `;

  Object.entries(deck.treasureDeck).forEach(([, card]) => {
    text += `${card.name} x${card.quantity}
    `
  });

  text += `
  
  Side Deck: (total: ${sideTotal})
  `

  Object.entries(deck.sideDeck).forEach(([, card]) => {
    text += `${card.name} x${card.quantity}
    `
  });

  return text;
}
