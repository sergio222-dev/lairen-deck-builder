import type { DeckCardInfoDto } from '~/app/shared/application/DTO/deckCardInfo.dto';
import { DeckZone }             from '~/app/card/application/DTO/deckParserDeckRefs.dto';
import type { CardFinder }        from '~/app/card/application/finder/card.finder';
import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';
import type { DeckParserService } from '~/app/card/application/serviecs/deckParser.service';

import { TOKENS } from '~/app/shared/binds/TOKENS';

export class ImportDeckCards {
  static readonly inject = [TOKENS.DECK_PARSER, TOKENS.CARD_FINDER];

  constructor(private readonly parser: DeckParserService, private readonly cardFinder: CardFinder) {
  }

  async execute(text: string): Promise<[CardInfoProection[], DeckCardInfoDto[]]> {
    const cardRefs = this.parser.parseText(text);

    const cardProj = await this.cardFinder.findCardsByName(cardRefs.map(x => x.name));

    const cards = cardProj.map<DeckCardInfoDto>(c => {

      const card = cardRefs.find(x => x.name === c.name);

      if (!card) throw new Error('Card Not Found');

      return {
        id:           c.id,
        quantity:     card.type === DeckZone.REALM || card.type === DeckZone.TREASURE ? card.quantity : 0,
        quantityInSide: card.type === DeckZone.SIDE ? card.quantity : 0
      };
    });

    return [cardProj, cards];
  }
}
