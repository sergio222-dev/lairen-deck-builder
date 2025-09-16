import type { PublicDeckItem }      from '~/models/Deck';
import type { DeckRepository } from '~/providers/repositories/DeckRepository';

export async function listPublicDecks(deckRepository: DeckRepository): Promise<PublicDeckItem[]> {
  return await deckRepository.listPublicDecks();
}
