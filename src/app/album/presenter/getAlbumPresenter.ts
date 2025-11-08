import type { GetAlbum } from '~/app/album/application/getAlbum';
import { TOKENS }        from '~/app/shared/binds/TOKENS';
import { IdValueObject } from '~/app/shared/models/VO/Id.ValueObject';

import type { UIAlbum, UIAlbumCard } from '~/UI/album/models/album.model';

export class GetAlbumPresenter {
  static readonly inject = [TOKENS.GET_ALBUM];

  constructor(private getAlbum: GetAlbum) {
  }

  async execute(albumId: number): Promise<UIAlbum> {
    const a = await this.getAlbum.execute(new IdValueObject(albumId));

    const cards: UIAlbumCard[] = a.cards.map(c => {

      return {
        id: c.id,
        name: c.name,
      };
    })

    return {
      id:      a.id.value,
      name:    a.name.value,
      sets:    a.sets.value,
      tags:    a.tags.value,
      current: a.current.value,
      total:   a.total.value,
      cards:   {}
    };
  }
}
