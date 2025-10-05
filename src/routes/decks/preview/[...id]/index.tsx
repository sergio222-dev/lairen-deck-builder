import { component$, useContextProvider }            from "@builder.io/qwik";
import { routeLoader$ }                              from "@builder.io/qwik-city";
import { getCardsFromDeck }                          from "~/app/card/application/getCardsFromDeck";
import { CardRepository }                            from "~/app/card/infrastructure/card.repository";
import type { CardInfo }                             from "~/app/card/models/card.model";
import { getDeck }                                   from "~/app/deck/application/getDeck";
import { DeckRepository }                            from "~/app/deck/infrastructure/deck.repository";
import { mapToUIDeck }                               from "~/app/deck/presentation/mapper/mapToUIDeck";
import { PreviewDeck }                               from "~/features/preview";
import type { DeckPreviewStoreState }                from "~/UI/deck/models/deck.store.model";
import { DECK_PREVIEW_CONTEXT, useDeckPreviewStore } from "~/UI/deck/store/deckPreview.store";

export const useDeckPreviewStoreLoader = routeLoader$<DeckPreviewStoreState | null>(async (requestEnv) => {
    const deckRepo = new DeckRepository(requestEnv);

    const deckId = requestEnv.params.id;

    if (!deckId) {
        return null;
    }

    let data;
    try {
        data = await getDeck(deckRepo, parseInt(deckId))
    } catch (_) {
        throw requestEnv.redirect(302, '/')
    }

    const cardRepo          = new CardRepository(requestEnv);
    const cards: CardInfo[] = await getCardsFromDeck(cardRepo, parseInt(deckId));

    return mapToUIDeck(cards, data)
});

export default component$(() => {

    const deckPreviewState = useDeckPreviewStoreLoader();

    const deckPreviewStore = useDeckPreviewStore(deckPreviewState.value);

    useContextProvider(DECK_PREVIEW_CONTEXT, deckPreviewStore);

    return (
            <div class="flex-auto overflow-y-auto">
                <PreviewDeck/>
            </div>
    )
});
