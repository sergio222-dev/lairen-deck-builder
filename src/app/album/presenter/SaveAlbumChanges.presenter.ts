import type { SaveAlbumChanges } from '~/app/album/application/saveAlbumChanges';
import { TOKENS }                from '~/app/shared/binds/TOKENS';

import type { UIAlbumChange } from '~/UI/album/models/album.model';

export class SaveAlbumChangesPresenter {
  static readonly inject = [TOKENS.SAVE_CHANGES];

  constructor(private _saveChanges: SaveAlbumChanges) {
  }

  async execute(albumId: number, changes: UIAlbumChange[]) {
    await this._saveChanges.execute({
      albumId,
      changes // UIAlbumChange and this command matches
    });
  }
}
