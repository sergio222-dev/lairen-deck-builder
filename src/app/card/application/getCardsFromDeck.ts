import type { CardRepository } from '~/app/card/infrastructure/card.repository';

export async function getCardsFromDeck(repo: CardRepository, deckid: number) {

  return repo.fetchCardDataByDeck(deckid);
}
