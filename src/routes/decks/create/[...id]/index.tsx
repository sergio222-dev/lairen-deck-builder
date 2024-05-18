import { component$ }                   from '@builder.io/qwik';
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import { DeckNotFoundException }        from '~/exceptions/DeckNotFoundException';
import { UnauthorizedException }        from '~/exceptions/UnauthorizedException';
import { Create }                       from '~/features/decks/create/Create';
import { Logger }                       from '~/lib/logger';
import { createClientServer }           from '~/lib/supabase-qwik';
import { DeckRepository }               from '~/providers/repositories/DeckRepository';

export { useSubtypeLoader, useCardDeckLoader } from '~/providers/loaders/cards';

export const onRequest: RequestHandler = async (r) => {
  const supabase = createClientServer(r);

  const session = await supabase.auth.getUser();

  if (!session.data.user) {
    throw r.redirect(302, '/');
  }

  await r.next();
};

export const useDeckLoader = routeLoader$(async (requestEnv) => {
  const supabaseServer = createClientServer(requestEnv);

  const { data: auth } = await supabaseServer.auth.getSession();

  if (!auth.session?.user) {
    Logger.error('User not authenticated in DeckLoader');
    throw requestEnv.redirect(302, '/');
  }

  try {

    const deckRepo = new DeckRepository(requestEnv);

    const deckId = requestEnv.params.id;

    if (!deckId) {
      return undefined;
    }

    const deckNumber = parseInt(deckId);
    const deck       = await deckRepo.getDeck(deckNumber, auth.session.user.id);

    if (!deck) {
      return undefined;
    }

    return deck;
  } catch (error: unknown) {
    if (error instanceof DeckNotFoundException) {
      requestEnv.status(DeckNotFoundException.code);
      return undefined;
    }

    return undefined;
  }
});

export default component$(() => {

  return (
    <Create />
  );
});
