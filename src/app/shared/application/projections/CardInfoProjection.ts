export interface CardInfoProjection {
  id: number;
  name: string;
  rarity: string;
  type: string;
  supertype: string;
  subtype1: string;
  subtype2: string;
  cost: number;
  text: string;
  image: string;
  thumbnail: string;
  set: string;
  clarifications: string | null;
}
