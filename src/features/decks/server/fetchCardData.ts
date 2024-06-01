import { RequestEventBase, server$ } from '@builder.io/qwik-city';
import { Card }                      from '~/models/Card';
import { CardRepository }            from '~/providers/repositories/CardRepository';

type FetchCardData = (this: RequestEventBase, cardId: string) => Promise<Card | null>

export const fetchCardData = server$<FetchCardData>(async function(cardId) {
  const cardRepo = new CardRepository(this);

  return await cardRepo.getCard(cardId);
});
