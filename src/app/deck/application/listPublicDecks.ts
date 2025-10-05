import type { DeckRepository }      from '~/app/deck/infrastructure/deck.repository';
import type { PublicDeckItem } from '~/models/Deck';

export async function listPublicDecks(deckRepository: DeckRepository): Promise<PublicDeckItem[]> {
  return await deckRepository.listPublicDeck();
}
