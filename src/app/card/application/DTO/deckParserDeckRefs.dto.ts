export enum DeckZone {
  'REALM',
  'TREASURE',
  'SIDE'
}

export type CardRefs = {
  name: string;
  quantity: number;
  type: DeckZone;
}
