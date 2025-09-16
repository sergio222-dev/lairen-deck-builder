import type { Signal }            from '@builder.io/qwik';
import { component$, useContext } from '@builder.io/qwik';
import { CardDeck }               from "~/features/createDeck/components/CardDeck";
import { FILTER_CONTEXT }         from "~/UI/filters/store/filter.store";

interface CardListDeckProps {
    ref?: Signal<HTMLDivElement | undefined>;
}

export const CardListDeck = component$<CardListDeckProps>(({ ref }) => {
    const f = useContext(FILTER_CONTEXT);

    return (
            <>
                {/*<div class="p-4 shadow-lg m-4 grid lg:grid-cols-5 md:grid-cols-4 gap-6">*/}
                <div ref={ref} class="shadow-lg flex justify-around flex-wrap gap-x-2 gap-y-4">
                    {f.cards.map(c => (
                            <CardDeck cardId={c} key={c} />
                    ))}
                </div>
            </>
    );
});
