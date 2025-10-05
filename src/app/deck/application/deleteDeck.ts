import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

export async function deleteDeck(deckRepo: DeckRepository, deckId: number) {
  await deckRepo.deleteDeck(deckId);
}
