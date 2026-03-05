import { server$ }            from '@builder.io/qwik-city';
import { TOKENS }             from '~/app/shared/binds/TOKENS';
import { IoC }                from '~/lib/IoC';
import type { UIAlbumChange } from '~/UI/album/models/album.model';

type SaveChangesServerType = (albumId: number, changes: UIAlbumChange[]) => void;

export const saveChangesServer = server$<SaveChangesServerType>(async (albumId, changes) => {
  const ioc = IoC.instance;

  const saveChanges = ioc.resolve(TOKENS.SAVE_CHANGES_PRESENTER);

  try {
    await saveChanges.execute(albumId, changes);
  } catch (err) {
    console.log(changes)
    console.error(err);
  }
});
