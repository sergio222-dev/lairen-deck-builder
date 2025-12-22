import type { UpdateDeckCommand }   from '~/app/deck/application/DTO/UpdateDeck.command';
import { DeckCard }                 from '~/app/deck/domain/models/deckCard.model';
import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import { TOKENS }              from '~/app/shared/binds/TOKENS';
import { IdValueObject }            from '~/app/shared/domain/VO/Id.ValueObject';
import { NameValueObject }          from '~/app/shared/domain/VO/Name.ValueObject';
import { NumberValueObject }        from '~/app/shared/domain/VO/NumberValueObject';
import { StringValueObject }        from '~/app/shared/domain/VO/StringValueObject';

export class UpdateDeck {
  static readonly inject = [TOKENS.DECK_REPOSITORY];

  constructor(private deckRepository: DeckRepository) {
  }

  async execute(command: UpdateDeckCommand): Promise<number> {
    const deckId = new IdValueObject(command.id);

    const deck = await this.deckRepository.getDeckById(deckId);

    if (deck.name.value !== command.name) {
      deck.rename(new NameValueObject(deck.name.value));
    }

    if (deck.description?.value !== command.description) {
      deck.changeDescription(new StringValueObject(command?.description ?? ''))
    }

    if (deck.isPublic !== command.isPublic) {
      deck.changeVisibility(command.isPublic);
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
