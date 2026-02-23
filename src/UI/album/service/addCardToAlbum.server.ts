import { server$ } from '@builder.io/qwik-city';
import { TOKENS }  from '~/app/shared/binds/TOKENS';
import { IoC }     from '~/lib/IoC';
import { Logger }  from '~/lib/logger';

export const addCardToAlbumServer = server$(async (albumId: number, cardId: number) => {
  const instance = IoC.instance;

  const addCardPresenter = instance.resolve(TOKENS.ADD_CARD_TO_ALBUM_PRESENTER);

  try {
    await addCardPresenter.execute(albumId, cardId)
  } catch (error) {
    Logger.error(error);
  }
})
