import type { UpdateDeckCommand } from '~/app/deck/application/DTO/updateDeck.command';
import { DeckCard }               from '~/app/deck/domain/models/deckCard.model';
import { SplashArt }              from '~/app/deck/domain/models/splashArt.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }            from '~/app/shared/binds/TOKENS';
import { NotFoundException } from '~/app/shared/domain/exceptions/notFound.exception';
import { IdValueObject }     from '~/app/shared/domain/VO/id.valueObject';
import { NameValueObject }   from '~/app/shared/domain/VO/name.ValueObject';
import { NumberValueObject } from '~/app/shared/domain/VO/number.valueObject';
import { StringValueObject } from '~/app/shared/domain/VO/string.valueObject';
import { UserIdValueObject } from '~/app/shared/domain/VO/userId.valueObject';

export class UpdateDeck {
  static readonly inject = [TOKENS.DECK_REPOSITORY];

  constructor(private deckRepository: DeckRepository) {
  }

  async execute(command: UpdateDeckCommand): Promise<number> {
    const deckId = new IdValueObject(command.id);

    const deck = await this.deckRepository.getDeckById(deckId);

    if (!deck) {
      throw new NotFoundException(new UserIdValueObject(''), new IdValueObject(command.id));
    }

    if (deck.name.value !== command.name) {
      deck.rename(new NameValueObject(deck.name.value));
    }

    if (deck.description?.value !== command.description) {
      deck.changeDescription(new StringValueObject(command?.description ?? ''))
    }

    if (deck.isPublic !== command.isPublic) {
      deck.changeVisibility(command.isPublic);
    }

    if (command.splashArtId) {
      deck.assignSplashArt(new SplashArt(new IdValueObject(command.splashArtId), StringValueObject.EMPTY));
    }

    // TODO replace type_1 type_2

    const cards = command.cards.map(c => {
      return new DeckCard(
        new IdValueObject(c.cardId),
        new NumberValueObject(c.quantity),
        new NumberValueObject(c.quantitySide),
      );
    })

    deck.replaceCards(cards);

    const result = await this.deckRepository.saveDeck(deck);

    return result.value;
  }

}
