interface DeckCard {}

export interface CreateDeckCommand {
  name: string;
  description: string | null;
  isPublic: boolean;
  type1: string | null;
  type2: string | null;
  splashArtId: number | null;
}
