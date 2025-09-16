import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

export async function getDeckData(repo: DeckRepository, deckId: number) {
    return repo.fetchDeck(deckId);
}
