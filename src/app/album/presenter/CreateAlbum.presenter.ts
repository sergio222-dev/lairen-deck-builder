import type { CreateAlbum }        from '~/app/album/application/createAlbum';
import type { CreateAlbumCommand } from '~/app/album/application/DTO/CreateAblum.command';

import { TOKENS } from '~/app/shared/binds/TOKENS';

export class CreateAlbumPresenter {
  public static inject = [TOKENS.CREATE_ALBUM];

  constructor(private readonly createAlbum: CreateAlbum) {
  }

  async execute(props: CreateAlbumCommand) {

    return await this.createAlbum.execute(props);
  }
}
