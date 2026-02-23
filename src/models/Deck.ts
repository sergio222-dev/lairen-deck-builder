import type { Card }            from "~/models/Card";
import type { NormalizedModel } from "~/utils/normalize";

export interface DeckCard extends Card {
  quantity: number;
  quantityInSideDeck: number;
  rarity: string;
}

export interface DeckItem {
  id: number;
  name: string;
  description: string | null;
  splashArt?: string;
  isPublic: boolean;
  type1: string | null;
  type2: string | null;
}

export interface PublicDeckItem extends Omit<DeckItem, 'isPublic' | 'type1' | 'type2'> {}

export interface DeckState {
  quantityInMainDeck: number;
  quantityInSideDeck: number;
  quantityInTreasureDeck: number;
  quantityMonumentsWeaponsCards: number;
  quantityUnitsCards: number;
  quantityActionsCards: number;
  orderedUnitCards: number[];
  orderedActionCards:  number[];
  orderedMonumentWeaponCards:  number[];
  orderedTreasureCards:  number[];
  orderedSideCards:  number[];
  cardStack: NormalizedModel<DeckCard>
  treasurePoints: number;
}

export interface DeckData extends DeckItem, DeckState {}
