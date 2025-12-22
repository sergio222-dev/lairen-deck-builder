import type { CardRefs } from '~/app/card/application/DTO/DeckParserDeckRefs.dto';
import { DeckZone }      from '~/app/card/application/DTO/DeckParserDeckRefs.dto';

const matchCard = /x(?=\d)/;

export class DeckParserService {

  parseText(text: string): CardRefs[] {
    const realm = text
      .split('Reino:')[1]
      .split('Bóveda:')[0]
      .split('\n')
      .map(c => c.trim())
      .filter(c => c !== '' && matchCard.test(c))
      .map<CardRefs>(c => {
        const [name, quantity] = c.split(matchCard);
        return {
          name:     name.trim(),
          quantity: parseInt(quantity),
          type:     DeckZone.REALM
        };
      });

    const treasure = text
      .split('Bóveda:')[1]
      .split('Side Deck:')[0]
      .split('\n')
      .map(c => c.trim())
      .filter(c => c !== '' && matchCard.test(c))
      .map<CardRefs>(c => {
        const [name, quantity] = c.split(matchCard);
        return {
          name:     name.trim(),
          quantity: parseInt(quantity),
          type:     DeckZone.TREASURE
        };
      });

    const side = text
      .split('Side Deck:')[1]
      .split('\n')
      .map(c => c.trim())
      .filter(c => c !== '' && matchCard.test(c))
      .map<CardRefs>(c => {
        const [name, quantity] = c.split(matchCard);
        return {
          name:     name.trim(),
          quantity: parseInt(quantity),
          type:     DeckZone.SIDE
        };
      });

    return [...realm, ...treasure, ...side];

  }
}
