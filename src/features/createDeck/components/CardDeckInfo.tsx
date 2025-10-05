import { $, component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import ManaCurve                                              from "~/components/charts/ManaCurve";
import { Switch }                                             from "~/components/switch/Switch";
import { CardDeckInfoFull }                                   from "~/features/createDeck/components/CardDeckInfoFull";
import type { DECK_STORE }                                    from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT }                              from "~/UI/deck/store/deckCreation.store";
import { costCalculator, getColorLever }                      from "~/utils/costCalculator";

export const CardDeckInfo = component$(() => {
    const deck = useContext<DECK_STORE>(DECK_CREATION_CONTEXT);

    const showInfo = useSignal(false);

    const costLevelDeck  = useComputed$(() => {
        return costCalculator(deck.cardStack, deck.cardInDeck);
    })
    //
    const colorLevelDeck = useComputed$(() => {
        return getColorLever(costLevelDeck.value);
    });

    const handleShowInfo = $(() => {
        showInfo.value = !showInfo.value;
    })

    return (
            <div class="p-2 shadow-lg">
                <div class="flex justify-between">
                    <div>Budget: <span style={{ color: colorLevelDeck.value }}>{costLevelDeck.value}</span></div>
                    <div>
                        <Switch name="show-info" value={showInfo.value} onChange={handleShowInfo}/>
                        Info
                    </div>
                    <div class="flex justify-center">
                        <p class="text-center">Cards: {deck.quantityInMainDeck}</p>
                    </div>
                </div>

                {showInfo.value ? <ManaCurve/> : <></>}

                {/*{d.view === 'simple' ?*/}
                <CardDeckInfoFull
                />
                {/*: <CardDeckInfoPro*/}
                {/*/>*/}
            </div>
    );
});
