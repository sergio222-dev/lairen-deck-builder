import { $, createContextId, useStore }               from '@builder.io/qwik';
import { Logger }                                     from '~/lib/logger';
import type { ALBUM_VIEW_STORE, AlbumViewStoreState } from '~/UI/album/models/album.model';
import { addCardToAlbumServer }                       from '~/UI/album/service/addCardToAlbumServer';
import { QueryCardServer }                            from '~/UI/album/service/QueryCardServer';
import { normalizeData }                              from '~/utils/normalize';

export const albumViewStoreInitialState: AlbumViewStoreState = {
  total:       0,
  current:     0,
  name:        '',
  sets:        [],
  id:          0,
  cards:       {},
  resultCards: {},
  tags:        [],
  addedCards:  [],
  editMode: false,
};

export const useAlbumViewStore = ((initialState: AlbumViewStoreState | null = null) => {
  return useStore<ALBUM_VIEW_STORE>({
    ...albumViewStoreInitialState,
    ...initialState ? { ...initialState } : {},
    queryCards: $(async function(this, query) {
      if (query === '' || query.length < 3) {
        this.resultCards = {};
        return;
      }

      const r          = await QueryCardServer(query);
      this.resultCards = normalizeData(r);
    }),
    addCard:    $(async function(this, cardId: number) {
      if (this.addedCards.includes(cardId)) return;

      try {
        await addCardToAlbumServer(this.id, cardId);

        const card = this.resultCards[cardId];

        this.addedCards.push(cardId);
        this.cards[cardId] = {
          ...card,
          tags: []
        };
      } catch (error) {
        Logger.error(error);
      }
    })
  });
});

export const ALBUM_VIEW_CONTEXT = createContextId<ALBUM_VIEW_STORE>('ALBUM_VIEW_CONTEXT');
