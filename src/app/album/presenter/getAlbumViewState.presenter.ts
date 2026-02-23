import type { GetAlbum } from '~/app/album/application/getAlbum';
import { TOKENS }        from '~/app/shared/binds/TOKENS';

import type { AlbumViewStoreState, UIAlbumCard, UIAlbumCardTag } from '~/UI/album/models/album.model';
import { getUIDCard }                                            from '~/UI/album/store/albumView.store';
import { normalizeData }                                         from '~/utils/normalize';

export class GetAlbumViewStatePresenter {
  static readonly inject = [TOKENS.GET_ALBUM];

  constructor(private getAlbum: GetAlbum) {
  }

  async execute(albumId: number): Promise<AlbumViewStoreState> {
    const [a, c] = await this.getAlbum.execute(albumId);

    const cards: UIAlbumCard[] = c.map(c => {
      const cc = a.cards.find(card => card.cardId.equals(c.id));

      if (!cc) throw new Error('Unknown card with id ' + c.id);
      const t: Record<number, UIAlbumCardTag> = cc.tags.reduce((a, v) => {
        return {
          ...a,
          [v.id.value]: {
            name:     v.name.value,
            quantity: v.quantity.value,
            id:       v.id.value
          }
        };
      }, {});

      return {
        id:    c.id.value,
        name:  c.name.value,
        image: c.image.value,
        tags:  t
      };
    });

    const nc = normalizeData(cards);

    const nct: Record<string, UIAlbumCardTag> = {};

    cards.forEach(c => {
      Object.keys(c.tags).forEach(tId => {
        const uiID = getUIDCard(c.id, tId);
        nct[uiID]  = c.tags[tId];
      });
    });

    const tags = a.tags.map(t => t.name.value);


    const t: Record<string, number> = {};

    a.cards.forEach(c => {
      c.tags.forEach(tt => {

        if (!t[tt.name.value]) {
          t[tt.name.value] = tt.quantity.value;
        } else {
          t[tt.name.value] += tt.quantity.value;
        }
      });
    });

    return {
      id:            a.id.value,
      name:          a.name.value,
      sets:          a.sets.value,
      tags,
      current:       a.current.value,
      total:         a.total.value,
      cards:         nc,
      editMode:      false,
      addedCards:    cards.map(c => c.id),
      filteredCards: cards.map(c => c.id),
      resultCards:   {},
      changes:       {},
      cardTags:      nct,
      totalTags:     t,
      filterText:    ''
    };
  }
}
