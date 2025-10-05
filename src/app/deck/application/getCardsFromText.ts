import type { CardRepository } from '~/app/card/infrastructure/card.repository';
import type { CardInfo }       from '~/app/card/models/card.model';
import type { DeckCardInfo }   from '~/app/deck/models/deck.model';
import { InSpecification }     from '~/app/filter/filter/models/Specification';
import { Logger }              from '~/lib/logger';

const matchCard = /x(?=\d)/;

export async function getCardsFromText(cardRepo: CardRepository, data: string): Promise<{
  cards: CardInfo[];
  deckCards: DeckCardInfo[];
}> {
  // split between reino, bóveda and side deck
  const realm = data
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
      };
    });

  const treasure = data
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
      };
    });

  const side = data
    .split('Side Deck:')[1]
    .split('\n')
    .map(c => c.trim())
    .filter(c => c !== '' && matchCard.test(c))
    .map(c => {
      const [name, quantity] = c.split(matchCard);
      return {
        name:     name.trim(),
        quantity: parseInt(quantity)
      };
    });

  const wholeDeck    = [...realm, ...treasure];
  const sideDeck     = [...side];
  const namesToFetch = new Set([...realm.map(c => c.name), ...treasure.map(c => c.name), ...side.map(c => c.name)]);

  const inFilter = new InSpecification(['name'], [ ...namesToFetch ]);

  Logger.info(inFilter);
  const cards: CardInfo[] = (await cardRepo.fetchCards([inFilter])).cards;

  const d: DeckCardInfo[] = [];

  cards.forEach(c => {
    const md = wholeDeck.find(x => x.name === c.name);
    const sd = sideDeck.find(x => x.name === c.name);
    Logger.info(`SEARCHING FOR ${c.name}, FOUND: ${md?.name} AND ${sd?.name}`);
    d.push({
      id:                 c.id,
      quantity:           md?.quantity ?? 0,
      quantityInSideDeck: sd?.quantity ?? 0
    });
  });

  return {
    deckCards: d,
    cards: cards,
  };
}
