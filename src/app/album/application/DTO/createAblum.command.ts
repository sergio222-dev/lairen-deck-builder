export interface CreateAlbumCommand {
  name: string;
  // owner: string;
  tags: string[];
  sets: string[];
  initializeCards: boolean;
}
