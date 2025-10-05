import type { CardRepository } from '~/app/card/infrastructure/card.repository';

export async function getAvailableSet(cardRepository: CardRepository): Promise<string[]> {
  return cardRepository.getAvailableSet();
}
