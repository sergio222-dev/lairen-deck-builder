import type { DeckRepository }         from '~/app/deck/infrastructure/deck.repository';
import type { DeckInfoWithImage } from '~/app/deck/models/deck.model';

export async function listUserDecks(deckRepo: DeckRepository, deckId: string): Promise<DeckInfoWithImage[]> {
  return await deckRepo.listUserDecks(deckId);
}
