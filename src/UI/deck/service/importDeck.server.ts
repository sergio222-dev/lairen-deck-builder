import { server$ } from '@builder.io/qwik-city';
import { TOKENS }  from '~/app/shared/binds/TOKENS';
import { IoC }     from '~/lib/IoC';

export const importDeckServer = server$(async (text: string) => {

  const instance = IoC.instance;

  const importDeck = instance.resolve(TOKENS.IMPORT_DECK_PRESENTER);

  return await importDeck.execute(text);
});
