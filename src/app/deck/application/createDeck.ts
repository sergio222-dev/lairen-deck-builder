import type { UpdateDeckCommand } from '~/app/deck/application/DTO/updateDeck.command';
import { Deck }                   from '~/app/deck/domain/models/deck.model';
import { DeckCard }               from '~/app/deck/domain/models/deckCard.model';
import { SplashArt }              from '~/app/deck/domain/models/splashArt.model';
import type { DeckRepository }    from '~/app/deck/infrastructure/deck.repository';

import { TOKENS }          from '~/app/shared/binds/TOKENS';
import { IdValueObject }   from '~/app/shared/domain/VO/id.valueObject';
import { NameValueObject } from '~/app/shared/domain/VO/name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/number.valueObject';
import { StringValueObject } from '~/app/shared/domain/VO/string.valueObject';

export class CreateDeck {
  static readonly inject = [TOKENS.DECK_REPOSITORY];

  constructor(private readonly deckRepository: DeckRepository) {
  }

  async execute(data: UpdateDeckCommand): Promise<number> {

    const deck = Deck.CREATE({
      name:     new NameValueObject(data.name),
      isPublic: data.isPublic,

      type1:       data.type1 ? new StringValueObject(data.type1) : undefined,
      type2:       data.type2 ? new StringValueObject(data.type2) : undefined,
      description: data.description ? new StringValueObject(data.description) : undefined
    });

    if (data.splashArtId) {
      deck.assignSplashArt(new SplashArt(new IdValueObject(data.splashArtId), StringValueObject.EMPTY));
    }

    const cards = data.cards.map(c => {
      return new DeckCard(
        new IdValueObject(c.cardId),
        new NumberValueObject(c.quantity),
        new NumberValueObject(c.quantitySide)
      );
    });

    deck.replaceCards(cards);

    const result = await this.deckRepository.saveDeck(deck);

    return result.value;
  }
}
