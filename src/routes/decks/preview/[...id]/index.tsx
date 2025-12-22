import { component$, useContextProvider }            from "@builder.io/qwik";
import type { FailReturn, RequestHandler }           from "@builder.io/qwik-city";
import { routeLoader$ }                              from "@builder.io/qwik-city";
import { TOKENS }                                    from "~/app/shared/binds/TOKENS";
import { NotFoundException }                         from "~/app/shared/domain/exceptions/NotFound.exception";
import { PreviewDeck }                               from "~/features/preview";
import { IoC }                                       from "~/lib/IoC";
import type { DeckPreviewStoreState }                from "~/UI/deck/models/deck.store.model";
import { DECK_PREVIEW_CONTEXT, useDeckPreviewStore } from "~/UI/deck/store/deckPreview.store";

export const onRequest: RequestHandler = async ({ params, redirect }) => {
    if (!params.id) throw redirect(302, '/')
    if (Number.isNaN(parseInt(params.id))) throw redirect(302, '/')
}

export const useDeckPreviewStoreLoader = routeLoader$<DeckPreviewStoreState | FailReturn<{}>>(async (requestEnv) => {
    const deckId = requestEnv.params.id;

    const instance = IoC.instance;

    const deckPresenter = instance.resolve(TOKENS.GET_DECK_PRESENTER);

    try {
        return await deckPresenter.execute(parseInt(deckId))
    } catch (e: any) {
        if (e instanceof NotFoundException) {
            return requestEnv.fail(404, {});
        }

        return requestEnv.fail(500, {})
    }
});

export default component$(() => {

    const deckPreviewState = useDeckPreviewStoreLoader();

    const deckPreviewStore = useDeckPreviewStore(deckPreviewState.value.failed ? null : deckPreviewState.value);

    useContextProvider(DECK_PREVIEW_CONTEXT, deckPreviewStore);

    if (deckPreviewState.value.failed) {
        return (
                <div class="flex justify-center mt-2 flex-1">
                    DECK NOT FOUND
                </div>
        )
    }

    return (
            <div class="flex-auto overflow-y-auto">
                <PreviewDeck/>
            </div>
    )
});
