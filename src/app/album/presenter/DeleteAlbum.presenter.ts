import type { DeleteAlbum } from '~/app/album/application/deleteAlbum';
import { TOKENS }        from '~/app/shared/binds/TOKENS';

export class DeleteAlbumPresenter {
  static readonly inject = [TOKENS.DELETE_ALBUM];

  constructor(private deleteAlbum: DeleteAlbum) {}

  async execute(idAlbum: number): Promise<void> {
    await this.deleteAlbum.execute(idAlbum);
  }
}
