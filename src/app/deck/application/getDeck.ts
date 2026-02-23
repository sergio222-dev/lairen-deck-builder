import type { Card }  from '~/app/card/domain/models/card.model';
import CardRepository from '~/app/card/infrastructure/card.repository';

import type { Deck }           from '~/app/deck/domain/models/deck.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { NotFoundException } from '~/app/shared/domain/exceptions/notFound.exception';
import { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class GetDeck {
  static readonly inject = [TOKENS.DECK_REPOSITORY, TOKENS.CARD_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository, private readonly cardRepository: CardRepository) {
  }

  async execute(deckId: number): Promise<[Deck, Card[]]> {
    const deckIdVo = new IdValueObject(deckId);
    const deck     = await this.deckRepository.getDeckById(deckIdVo);

    if (!deck) {
      throw new NotFoundException(new UserIdValueObject(''), new IdValueObject(deckId));
    }

    const cards = await this.cardRepository.getCardsByDeckId(deckIdVo);

    return [deck, cards];
  }
}
