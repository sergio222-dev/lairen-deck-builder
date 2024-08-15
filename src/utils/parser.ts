import type { ImportCardItem, ImportDeckRequest } from "~/models/application/ImportCardItem";
import type { DeckState }                         from "~/models/Deck";

const matchCard = /x(?=\d)/

export function parseToImportCardsItem(text: string): ImportDeckRequest {
  // split between reino, bóveda and side deck
  const realm = text
    .split('Reino:')[1]
    .split('Bóveda:')[0]
    .split('\n')
    .map(c => c.trim())
    .filter(c => c !== '' && matchCard.test(c))
    .map(c => {
      const [name, quantity] = c.split(matchCard);
      return {
        name:     name.trim(),
        quantity: parseInt(quantity)
      }
    });

  const treasure = text
    .split('Bóveda:')[1]
    .split('Side Deck:')[0]
    .split('\n')
    .map(c => c.trim())
    .filter(c => c !== '' && matchCard.test(c))
    .map(c => {
      const [name, quantity] = c.split(matchCard);
      return {
        name:     name.trim(),
        quantity: parseInt(quantity)
      }
    });

  const side = text
    .split('Side Deck:')[1]
    .split('\n')
    .map(c => c.trim())
    .filter(c => c !== '' && matchCard.test(c))
    .map<ImportCardItem>(c => {
      const [name, quantity] = c.split(matchCard);
      return {
        name:     name.trim(),
        quantity: parseInt(quantity)
      }
    });

  return {
    realm,
    treasure,
    side
  }
}

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
