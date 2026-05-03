import { component$, useContextProvider }  from '@builder.io/qwik';
import type { FailReturn, RequestHandler } from '@builder.io/qwik-city';
import { routeLoader$ }                    from '@builder.io/qwik-city';
import { TOKENS }            from "~/app/shared/binds/TOKENS";
import { NotFoundException } from "~/app/shared/domain/exceptions/notFound.exception";
import { DeckNotOwnedByTheUserException } from "~/exceptions/DeckNotOwnedByTheUserException";
import { UnauthorizedException }          from "~/exceptions/UnauthorizedException";

import { Create }                      from '~/features/createDeck';
import { IoC }                         from "~/lib/IoC";
import { useInitialFilterStoreLoader } from "~/providers/loaders/useInitialFilterStoreLoader";

import type { DeckCreationStoreState }                 from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT, useDeckCreationStore } from "~/UI/deck/store/deckCreation.store";
import { FILTER_CONTEXT, useFilterStore }              from "~/UI/filters/store/filter.store";

// SERVER ACTIONS
export { useInitialFilterStoreLoader }

export const onRequest: RequestHandler = ({ params, redirect }) => {
    if (params.id && Number.isNaN(parseInt(params.id))) throw redirect(302, '/');
}

export const useDeckStoreLoader = routeLoader$<DeckCreationStoreState | FailReturn<{}>>(async (requestEnv) => {
    const deckId = requestEnv.params.id;

    const instance = IoC.instance;

    const getDeckPresenter = instance.resolve(TOKENS.GET_DECK_PRESENTER);

    try {

        const deck = await getDeckPresenter.execute(deckId ? parseInt(deckId) : null);

        return {
            ...deck,
        }
    } catch (error) {
        if (error instanceof NotFoundException) {
            return requestEnv.fail(404, {})
        }

        if (error instanceof UnauthorizedException) {
            throw requestEnv.redirect(302, '/');
        }

        if (error instanceof DeckNotOwnedByTheUserException) {
            throw requestEnv.redirect(302, '/');
        }

        return requestEnv.fail(500, {})
    }
});


export default component$(() => {
    const deckState   = useDeckStoreLoader();
    const filterState = useInitialFilterStoreLoader();

    const deckCreationStore = useDeckCreationStore(deckState.value.failed ? null : deckState.value);
    const filterData        = useFilterStore(filterState);

    useContextProvider(DECK_CREATION_CONTEXT, deckCreationStore);
    useContextProvider(FILTER_CONTEXT, filterData);

    if (deckState.value.failed) {
        return (
                <div class="flex justify-center mt-2 flex-1">
                    DECK NOT FOUND
                </div>
        )
    }

    return (
            <Create/>
    );
});
