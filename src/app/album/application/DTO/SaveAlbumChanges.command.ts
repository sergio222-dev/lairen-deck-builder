export interface SaveAlbumChangesCommand {
  albumId: number;
  changes: Array<{
    cardId: number;
    tagId: number;
    amount: number;
  }>;
}
