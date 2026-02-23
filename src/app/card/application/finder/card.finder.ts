import type { Specification }     from '~/app/shared/domain/models/specification';
import type { CardInfoProection } from '~/app/shared/application/projections/cardInfo.proection';

export interface CardFinder {
  findCardsByName(cards: string[]): Promise<CardInfoProection[]>;
  fetchCards(specs: Specification[], dominion: boolean): Promise<[CardInfoProection[], number | null]>;
}
