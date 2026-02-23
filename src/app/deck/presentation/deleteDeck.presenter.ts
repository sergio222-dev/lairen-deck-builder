import type { DeleteDeck } from '~/app/deck/application/deleteDeck';
import { TOKENS }          from '~/app/shared/binds/TOKENS';

export class DeleteDeckPresenter {
  static inject = [TOKENS.DELETE_DECK];

  constructor(private readonly deleteDeck: DeleteDeck) {
  }

  async execute(deckId: number): Promise<void> {
    await this.deleteDeck.execute(deckId);
  }
}
