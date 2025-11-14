import type { SaveAlbumChanges }  from '~/app/album/application/saveAlbumChanges';
import { AlbumChangeValueObject } from '~/app/album/domain/VO/AlbumChange.ValueObject';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/Id.ValueObject';

import type { UIAlbumChange }     from '~/UI/album/models/album.model';

export class SaveAlbumChangesPresenter {
  static readonly inject = [TOKENS.SAVE_CHANGES];

  constructor(private _saveChanges: SaveAlbumChanges) {
  }

  async execute(albumId: number, changes: UIAlbumChange[]) {
    await this._saveChanges.execute(new IdValueObject(albumId), changes.map(c => {
      return new AlbumChangeValueObject(c.cardId, c.tagId, c.amount);
    }));
  }
}
