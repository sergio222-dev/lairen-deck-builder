import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';

export async function getDeck(repo: DeckRepository, deckId: number) {
    return repo.fetchDeck(deckId);
}
