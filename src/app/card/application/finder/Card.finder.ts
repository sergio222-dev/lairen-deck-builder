import type { CardInfoProjection } from '~/app/shared/application/projections/CardInfoProjection';
import type { CardRefs }           from '~/app/card/application/DTO/DeckParserDeckRefs.dto';

export interface CardFinder {
  findCards(cards: string[]): Promise<CardInfoProjection[]>;
}
