import { $, createContextId, useStore }               from '@builder.io/qwik';
import { Logger }                                     from '~/lib/logger';
import type { ALBUM_VIEW_STORE, AlbumViewStoreState } from '~/UI/album/models/album.model';
import { addCardToAlbumServer }                       from '~/UI/album/service/addCardToAlbumServer';
import { getAlbumServer }    from '~/UI/album/service/getAlbumServer';
import { queryCardServer }   from '~/UI/album/service/queryCardServer';
import { saveChangesServer } from '~/UI/album/service/saveChangesServer';
import { normalizeData }                              from '~/utils/normalize';

export function getUIDCard(cardId: number, tagId: number | string): string {
  return `${cardId}_${tagId}`;
}

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
  editMode:    false,
  changes:     {},
  cardTags:    {},
  totalTags:   {},
  filteredCards: [],
  filterText: '',
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
    applyFilter: $(function (this, text) {
      if (text === '') this.filteredCards = this.addedCards;

      this.filteredCards = this.addedCards.filter(id => {
        return this.cards[id].name.toLowerCase().includes(text.toLowerCase());
      });
    }),
    addCard:          $(async function(this, cardId: number) {
      if (this.addedCards.includes(cardId)) return;

      try {
        await addCardToAlbumServer(this.id, cardId);

        const album = await getAlbumServer(this.id);

        this.cards = album.cards;
        this.filteredCards = this.addedCards = album.addedCards;
        this.cardTags = album.cardTags;

      } catch (error) {
        Logger.error(error);
      }
    }),
    increaseQuantity: $(async function(this, cardId, tagId) {
      const uiCT       = `${cardId}_${tagId}`;
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
      const cardTag    = this.cardTags[uiCT];
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

      this.cardTags = album.cardTags;
      this.changes  = {};
      this.editMode = false;
      this.totalTags = album.totalTags;
    })
  });
};

export const ALBUM_VIEW_CONTEXT = createContextId<ALBUM_VIEW_STORE>('ALBUM_VIEW_CONTEXT');
