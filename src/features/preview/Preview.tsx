import { component$, useContext } from "@builder.io/qwik";
import { Button }                 from "~/components/button";
import { Icon }                   from "~/components/icons/Icon";
import { CardDeckInfoPreview }    from "~/features/preview/components/CardDeckInfoPreview";
import { DECK_PREVIEW_CONTEXT }   from "~/UI/deck/store/deckPreview.store";
import { parseToText }            from "~/utils/parser";

export const PreviewDeck = component$(() => {
    const deck = useContext(DECK_PREVIEW_CONTEXT);

    return (
            <div>
                <div class="flex flex-col items-center justify-center mt-2">
                    <div class="flex gap-2 items-center">
                        <h1 class="text-3xl">
                            {deck.name}
                        </h1>
                        <Button class="active:ring-2 ring-red-600"
                                onClick$={() => navigator.clipboard.writeText(parseToText(deck))}
                        >
                            <Icon name="copy" width={24} height={24} class="fill-primary"/>
                        </Button>
                    </div>
                </div>

                <CardDeckInfoPreview/>
            </div>
    )
});
