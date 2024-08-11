import { component$ }            from '@builder.io/qwik';
import type { RequestHandler }   from '@builder.io/qwik-city';
import { routeLoader$ }          from '@builder.io/qwik-city';
import { DeckNotFoundException } from '~/exceptions/DeckNotFoundException';
import { Create }                from '~/features/createDeck';
import { Logger }                from '~/lib/logger';
import { createClientServer }    from '~/lib/supabase-qwik';
import type { DeckState }        from "~/models/Deck";
import { DeckRepository }        from '~/providers/repositories/DeckRepository';

export { useSubtypeLoader, useCardDeckLoader, useTypeLoader, useRarityLoader, useSetLoader } from '~/providers/loaders/cards';

export const onRequest: RequestHandler = async (r) => {
  const supabase = createClientServer(r);

  const session = await supabase.auth.getUser();

  if (!session.data.user) {
    Logger.error('User not authenticated in DeckLoader');
    throw r.redirect(302, '/');
  }

  await r.next();
};

export const useDeckLoader = routeLoader$<DeckState | undefined>(async (requestEnv) => {
  const supabaseServer = createClientServer(requestEnv);

  const session = await supabaseServer.auth.getUser();

  if (!session.data.user) {
    return undefined;
  }

  try {
    const deckRepo = new DeckRepository(requestEnv);

    const deckId = requestEnv.params.id;

    if (!deckId) {
      return undefined;
    }

    const deckNumber = parseInt(deckId);
    const deck       = await deckRepo.getDeck(deckNumber, session.data.user.id);

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
    <Create/>
  );
});
