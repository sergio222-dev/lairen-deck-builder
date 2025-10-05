import { server$ }          from '@builder.io/qwik-city';
import { CardRepository }   from '~/app/card/infrastructure/card.repository';
import { getCardsFromText } from '~/app/deck/application/getCardsFromText';
import { mapToUIDeck }      from '~/app/deck/presentation/mapper/mapToUIDeck';

export const onImportDeck = server$(async function(this, text: string) {
  const cardRepository = new CardRepository(this);

  const c = await getCardsFromText(cardRepository, text);

  return mapToUIDeck(c.cards, {
    id:          0,
    type1:       null,
    description: null,
    type2:       null,
    cards:       c.deckCards,
    name:        '',
    splashArtId: null,
    isPublic:    true
  });
});
