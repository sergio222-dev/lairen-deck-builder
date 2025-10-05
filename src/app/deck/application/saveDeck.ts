import type { DeckRepository } from '~/app/deck/infrastructure/deck.repository';
import type { DeckModel }         from '~/app/deck/models/deck.model';
import type { DeckInformationUI } from '~/UI/deck/models/deck.store.model';

export async function saveDeck(deckRepository: DeckRepository, deck: DeckInformationUI) {

  const deckModel: DeckModel = {
    id: deck.deckId,
    isPublic: deck.isPublic,
    type1: deck.type1,
    type2: deck.type2,
    name: deck.name,
    description: deck.description,
    splashArtId: deck.splashArtId,
    cards: Object.values(deck.cardInDeck).map(c => ({
      id: c.id,
      quantity: c.quantity,
      quantityInSideDeck: c.quantityInSide
    }))
  }

  return await deckRepository.saveDeck(deckModel);

}
