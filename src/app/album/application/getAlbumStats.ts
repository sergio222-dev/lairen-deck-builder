import { AlbumFinder } from '~/app/album/application/finder/album.finder';
import { TOKENS }      from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/domain/VO/id.valueObject';

export class GetAlbumStats {
  static inject = [TOKENS.ALBUM_FINDER]

  constructor(private readonly albumFinder: AlbumFinder) {
  }


  async execute(albumId: number) {
    const albumIdVo = new IdValueObject(albumId);
    return await this.albumFinder.getAlbumStats(albumIdVo);
  }
}
