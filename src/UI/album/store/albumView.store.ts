import { $, createContextId, useStore }               from '@builder.io/qwik';
import { Logger }                                     from '~/lib/logger';
import type { ALBUM_VIEW_STORE, AlbumViewStoreState } from '~/UI/album/models/album.model';
import { addCardToAlbumServer }                       from '~/UI/album/service/addCardToAlbum.server';
import { fetchNextServer }                            from '~/UI/album/service/fetchNext.server';
import { getAlbumServer }                             from '~/UI/album/service/getAlbum.server';
import { queryCardServer }                            from '~/UI/album/service/queryCard.server';
import { saveChangesServer }                          from '~/UI/album/service/saveChanges.server';
import { normalizeData }                              from '~/utils/normalize';

export function getUIDCard(cardId: number, tagId: number | string): string {
  return `${cardId}_${tagId}`;
}

export const albumViewStoreInitialState: AlbumViewStoreState = {
  total:         0,
  current:       0,
  name:          '',
  sets:          [],
  id:            0,
  cards:         {},
  cardsById:     [],
  resultCards:   {},
  tags:          {},
  tagsById:      [],
  editMode:      false,
  changes:       {},
  filterText:    '',
  cursor:        null
};

export const useAlbumViewStore = (initialState: AlbumViewStoreState | null = null) => {
  return useStore<ALBUM_VIEW_STORE>({
    ...albumViewStoreInitialState,
    ...initialState ? { ...initialState } : {},
    queryCards:       $(async function(this, query) {
      if (query === '' || query.length < 3) {
        this.resultCards = {};
        return;
      }

      const r          = await queryCardServer(query, this.sets);
      this.resultCards = normalizeData(r);
    }),
    fetchNext: $(async function(this) {
      const c = await fetchNextServer(this.id, this.filterText, this.cursor);

      this.cursor = c.cursor;
      Object.values(c.cards).forEach(x => this.cards[x.id] = x)
      c.cardsById.forEach(x => this.cardsById.push(x))
    }),
    resetResults:     $(function(this) {
      this.resultCards = {};
    }),
    applyFilter:      $(async function(this, text) {
      this.cursor = null
      this.filterText = text;

      const c = await fetchNextServer(this.id, text, this.cursor)
      this.cursor = c.cursor;
      this.cards = c.cards;
      this.cardsById = c.cardsById;
    }),
    addCard:          $(async function(this, cardId: number) {
      this.resultCards = {};
      if (this.cardsById.includes(cardId)) return;

      try {
        await addCardToAlbumServer(this.id, cardId);

        const album = await getAlbumServer(this.id);

        this.cards         = album.cards;
        this.cardsById     = album.cardsById;
        this.tags          = album.tags;
        this.tagsById      = album.tagsById;

      } catch (error) {
        Logger.error(error);
      }
    }),
    increaseQuantity: $(async function(this, cardId, tagId) {
      const uiCT       = getUIDCard(cardId, tagId);
      const prevChange = this.changes[uiCT];

      if (!prevChange) {
        this.changes[uiCT] = {
          tagId,
          amount: 1,
          cardId
        };

        return;
      }

      prevChange.amount += 1;
    }),
    decreaseQuantity: $(function(this, cardId, tagId) {
      const uiCT       = `${cardId}_${tagId}`;
      const cardTag    = this.cards[cardId].tags[tagId];
      const prevChange = this.changes[uiCT];


      if (!prevChange) {
        if (cardTag.quantity === 0) return;
        this.changes[uiCT] = {
          amount: -1,
          tagId,
          cardId
        };

        return;
      }

      if (cardTag.quantity === (prevChange.amount - 1)) {
        delete this.changes[uiCT];
        return;
      }

      const currentQuantity = cardTag.quantity + prevChange.amount;
      if (currentQuantity === 0) return;
      this.changes[uiCT].amount -= 1;
    }),
    resetChanges:     $(function(this) {
      if (Object.keys(this.changes).length === 0) return;
      this.changes = {};
    }),
    saveChanges:      $(async function(this) {
      const changes = Object.keys(this.changes).map(c => this.changes[c]);
      await saveChangesServer(this.id, changes);


      const album = await getAlbumServer(this.id);

      this.cards = album.cards;
      this.cardsById = album.cardsById;
      this.tags = album.tags;
      this.tagsById = album.tagsById;
      this.changes   = {};
      this.editMode  = false;
    })
  });
};

export const ALBUM_VIEW_CONTEXT = createContextId<ALBUM_VIEW_STORE>('ALBUM_VIEW_CONTEXT');
