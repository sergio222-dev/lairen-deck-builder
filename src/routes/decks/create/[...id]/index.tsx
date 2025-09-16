import { component$, useContextProvider }                          from '@builder.io/qwik';
import { routeLoader$ }                                            from '@builder.io/qwik-city';
import { getCardsFromDeck }                                        from "~/app/card/application/getCardsFromDeck";
import { CardRepository }                                          from "~/app/card/infrastructure/card.repository";
import type { CardInfo }                                           from "~/app/card/models/card.model";
import { getDeckData }                                             from "~/app/deck/application/getDeckData";
import { DeckRepository }                                          from "~/app/deck/infrastructure/deck.repository";
import {
    getDefaultFilterGroups
}                                                                  from "~/app/filter/application/getDefaultFilterGroups";
import { getFilteredCard }                                         from "~/app/filter/application/getFilteredCard";
import { FilterRepository }                                        from "~/app/filter/infrastructure/filter.repository";
import { Create }                                                  from '~/features/createDeck';
import { CARD_TYPES }                                              from "~/models/CardTypes";
import type { DeckCreationStoreState }                             from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT, useDeckCreationStore }             from "~/UI/deck/store/deckCreation.store";
import type { FilterStoreState }                                   from "~/UI/filters/models/filter.store.model";
import { DEFAULT_PAGINATION }                                      from "~/UI/filters/models/filterDefinition.model";
import { FILTER_CONTEXT, filterStoreInitialState, useFilterStore } from "~/UI/filters/store/filter.store";
import type { CardStackItem }                                      from "~/UI/shared/models/CardSackItem";
import { normalizeData }                                           from "~/utils/normalize";

export {
    useSubtypeLoader, useTypeLoader, useRarityLoader, useSetLoader, useUnitTypeLoader, useSuperTypeLoader
} from '~/providers/loaders/cards';

// SERVER ACTIONS
export const useInitialFilterStoreLoader = routeLoader$<FilterStoreState>(async (request) => {
    const filterRepo = new FilterRepository(request);

    // Default filters data
    const filterGroups     = await getDefaultFilterGroups(filterRepo);
    const { cards, count } = await getFilteredCard(filterRepo, filterGroups);

    const cardsIds  = cards.map(c => c.id);
    const cardStack = normalizeData<CardStackItem>(cards);

    const totalPages = Math.ceil(count / DEFAULT_PAGINATION.size);

    return {
        ...filterStoreInitialState,
        filterGroups: normalizeData(filterGroups),

        cardStack,
        cards:      cardsIds,
        count,
        pagination: {
            ...DEFAULT_PAGINATION,
            pages: totalPages,
        },
    }
});

export const useDeckStoreLoader = routeLoader$<DeckCreationStoreState | null>(async (requestEnv) => {
    const deckRepo = new DeckRepository(requestEnv);

    const deckId = requestEnv.params.id;

    if (!deckId) {
        return null;
    }

    const data = await getDeckData(deckRepo, parseInt(deckId))

    const cardRepo          = new CardRepository(requestEnv);
    const cards: CardInfo[] = await getCardsFromDeck(cardRepo, parseInt(deckId));
    // CardInfo and CardStackState are equals interfaces
    const cardStack         = normalizeData<CardStackItem>(cards);
    const cardInDeck        = normalizeData(data.cards?.map(c => ({
        id:             c.id,
        quantity:       c.quantity,
        quantityInSide: c.quantityInSideDeck
    })) ?? []);

    // TRANSFORM FOR UI
    let quantityInMainDeck            = 0;
    let quantityInSideDeck            = 0;
    let quantityInTreasureDeck        = 0;
    let quantityUnitsCards            = 0;
    let quantityActionsCards          = 0;
    let quantityMonumentsWeaponsCards = 0;
    let treasurePoints                = 0;

    data.cards?.forEach(c => {

        const cardData = cardStack[c.id];

        quantityInSideDeck += c.quantityInSideDeck;

        if (cardData.type === CARD_TYPES.TESORO) {
            quantityInTreasureDeck += c.quantity;

            treasurePoints += cardData.cost;
        } else {
            quantityInMainDeck += c.quantity;

            if (cardData.type === CARD_TYPES.UNIT) quantityUnitsCards += c.quantity;
            if (cardData.type === CARD_TYPES.ACTION) quantityActionsCards += c.quantity;
            if (cardData.type ===
                    CARD_TYPES.ARMA ||
                    cardData.type ===
                    CARD_TYPES.MONUMENTO) quantityMonumentsWeaponsCards += c.quantity;
        }
    });


    const orderedUnitCards = data.cards
            ?.filter((c) => cardStack[c.id].type === CARD_TYPES.UNIT && c.quantity > 0)
            .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
            .map(c => c.id) ?? [];

    const orderedActionCards = data.cards
            ?.filter((c) => cardStack[c.id].type === CARD_TYPES.ACTION && c.quantity > 0)
            .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
            .map(c => c.id) ?? [];

    const orderedMonumentWeaponCards = data.cards
            ?.filter((c) => (cardStack[c.id].type ===
                    CARD_TYPES.MONUMENTO ||
                    cardStack[c.id].type ===
                    CARD_TYPES.ARMA) && c.quantity > 0)
            .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
            .map(c => c.id) ?? [];

    const orderedTreasureCards = data.cards
            ?.filter(c => cardStack[c.id].type === CARD_TYPES.TESORO && c.quantity > 0)
            .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
            .map(c => c.id) ?? [];

    const orderedSideCards = data.cards
            ?.filter(c => c.quantityInSideDeck > 0)
            .toSorted((a, b) => cardStack[a.id].name.localeCompare(cardStack[b.id].name))
            .map(c => c.id) ?? [];

    return {
        quantityMonumentsWeaponsCards,
        quantityUnitsCards,
        treasurePoints,
        quantityInMainDeck,
        quantityInSideDeck,
        quantityActionsCards,
        quantityInTreasureDeck,
        orderedActionCards,
        orderedSideCards,
        orderedUnitCards,
        orderedTreasureCards,
        orderedMonumentWeaponCards,
        cardStack,
        cardInDeck,
        deckId:      data.id,
        name:        data.name,
        description: data.description,
        splashArtId: data.splashArtId,
        type1:       data.type1,
        type2:       data.type2,
        isPublic:    data.isPublic,
    };
});


export default component$(() => {
    const deckState   = useDeckStoreLoader();
    const filterState = useInitialFilterStoreLoader();

    const data       = useDeckCreationStore(deckState);
    const filterData = useFilterStore(filterState);

    useContextProvider(DECK_CREATION_CONTEXT, data);
    useContextProvider(FILTER_CONTEXT, filterData);

    return (
            <Create/>
    );
});
