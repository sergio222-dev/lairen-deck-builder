import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Switch }                               from "~/components/switch/Switch";
import { CardDeckInfoFull }      from "~/features/createDeck/components/CardDeckInfoFull";
import type { DECK_STORE }       from "~/UI/deck/store/deckCreation.store";
import { DECK_CREATION_CONTEXT } from "~/UI/deck/store/deckCreation.store";

export const CardDeckInfo = component$(() => {
    const deck = useContext<DECK_STORE>(DECK_CREATION_CONTEXT);

    const showInfo = useSignal(false);

    // const costLevelDeck = useComputed$(() => {
    //     const allCards = {
    //         ...deckData.masterDeck,
    //         ...deckData.treasureDeck,
    //         ...deckData.sideDeck
    //     };
    //
    //     return costCalculator(allCards);
    // })
    //
    // const colorLevelDeck = useComputed$(() => {
    //     return getColorLever(costLevelDeck.value);
    // });

    const handleShowInfo = $(() => {
        showInfo.value = !showInfo.value;
    })

    return (
            <div class="p-2 shadow-lg">
                <div class="flex justify-between">
                    {/*<div>Budget: <span style={{ color: colorLevelDeck.value }}>{costLevelDeck.value}</span></div>*/}
                    <div>
                        <Switch name="show-info" value={showInfo.value} onChange={handleShowInfo}/>
                        Info
                    </div>
                    <div class="flex justify-center">
                        <p class="text-center">Cards: {deck.quantityInMainDeck}</p>
                    </div>
                </div>

                {/*{showInfo.value ? <ManaCurve deckData={deckData}/> : <></>}*/}

                {/*{d.view === 'simple' ?*/}
                <CardDeckInfoFull
                />
                {/*: <CardDeckInfoPro*/}
                {/*/>*/}
            </div>
    );
});
