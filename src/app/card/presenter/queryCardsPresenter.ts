import type { QueryCards }        from '~/app/card/application/queryCards';
import { TOKENS }                 from '~/app/shared/binds/TOKENS';
import { StringValueObject }      from '~/app/shared/models/VO/StringValueObject';

import type { UIAlbumCardSimple } from '~/UI/album/models/album.model';

interface QueryCardsPresenterOptions {
  query: string;
}

export class QueryCardsPresenter {
  static readonly inject = [TOKENS.QUERY_CARDS];

  constructor(private readonly queryCards: QueryCards) {
  }

  async execute(props: QueryCardsPresenterOptions): Promise<UIAlbumCardSimple[]> {
    const c = await this.queryCards.execute(new StringValueObject(props.query));

    return c.map(x => ({
      name: x.name,
      id:   x.id,
      image: x.image,
    }));
  }
}
