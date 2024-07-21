import type { Entity } from "~/utils/normalize";

export interface Card extends Entity {
  id: number;
  name: string;
  rarity: string;
  type: string;
  supertype: string;
  subtype: string;
  subtype2: string;
  cost: string;
  text: string;
  image: string;
  set: string;
}
