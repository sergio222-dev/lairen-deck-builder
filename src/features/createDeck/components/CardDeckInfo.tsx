import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import ManaCurve                                from "~/components/charts/ManaCurve";
import { Switch }                               from "~/components/switch/Switch";
import { CardDeckInfoFull }                     from "~/features/createDeck/components/CardDeckInfoFull";
import type { DECK_STORE }                      from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT }                from "~/UI/deck/store/deckCreation.store";

export const CardDeckInfo = component$(() => {
    const deck = useContext<DECK_STORE>(DECK_CREATION_CONTEXT);

    const showInfo = useSignal(false);

    const handleShowInfo = $(() => {
        showInfo.value = !showInfo.value;
    })

    return (
            <div class="p-2 shadow-lg">
                <div class="flex justify-around flex-wrap">
                    <div class="border-[var(--qwik-secondary)] border-2 p-4 flex flex-col items-center rounded">
                        Collection
                        <span class="text-green-400">{Math.round(deck.ownedPercent * 100)}% </span>
                    </div>
                    <div>
                        <Switch name="show-info" value={showInfo.value} onChange={handleShowInfo}/>
                        Info
                    </div>
                    <div class="border-[var(--qwik-secondary)] border-2 p-4 flex flex-col items-center rounded">
                        Cards
                        <span class="text-green-400"> {deck.quantityInMainDeck}</span>
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
