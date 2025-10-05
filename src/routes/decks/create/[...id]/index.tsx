import { component$, useContextProvider }              from '@builder.io/qwik';
import { routeLoader$ }                                from '@builder.io/qwik-city';
import { getCardsFromDeck }                            from "~/app/card/application/getCardsFromDeck";
import { CardRepository }                              from "~/app/card/infrastructure/card.repository";
import type { CardInfo }                               from "~/app/card/models/card.model";
import { getDeck }                                     from "~/app/deck/application/getDeck";
import { DeckRepository }                              from "~/app/deck/infrastructure/deck.repository";
import { mapToUIDeck }                                 from "~/app/deck/presentation/mapper/mapToUIDeck";
import { Create }                                      from '~/features/createDeck';
import { Logger }                                      from "~/lib/logger";
import { useInitialFilterStoreLoader }                 from "~/providers/loaders/useInitialFilterStoreLoader";
import type { DeckCreationStoreState }                 from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT, useDeckCreationStore } from "~/UI/deck/store/deckCreation.store";
import { FILTER_CONTEXT, useFilterStore }              from "~/UI/filters/store/filter.store";


// SERVER ACTIONS
export { useInitialFilterStoreLoader }

export const useDeckStoreLoader = routeLoader$<DeckCreationStoreState | null>(async (requestEnv) => {
    const deckRepo = new DeckRepository(requestEnv);

    const deckId = requestEnv.params.id;

    if (!deckId) {
        return null;
    }
    Logger.info(`LOADING ROUTE FOR DECK ${deckId}`)

    let data;
    try {
        data = await getDeck(deckRepo, parseInt(deckId))
    } catch (_) {
        throw requestEnv.redirect(302, '/')
    }

    const cardRepo          = new CardRepository(requestEnv);
    const cards: CardInfo[] = await getCardsFromDeck(cardRepo, parseInt(deckId));

    return mapToUIDeck(cards, data);
});


export default component$(() => {
    const deckState   = useDeckStoreLoader();
    const filterState = useInitialFilterStoreLoader();

    const deckCreationStore = useDeckCreationStore(deckState);
    // Logger.info(`DATA FROM STORE`)
    // Logger.info(deckCreationStore);
    const filterData = useFilterStore(filterState);

    useContextProvider(DECK_CREATION_CONTEXT, deckCreationStore);
    useContextProvider(FILTER_CONTEXT, filterData);

    // useTask$(() => {
    //     return () => {
    //         Logger.info('RESET STATE');
    //         void deckCreationStore.resetDeck();
    //     }
    // })

    return (
            <Create/>
    );
});
