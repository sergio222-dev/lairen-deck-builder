import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Button }                      from "~/components/button";

interface AccordionProps {
    title: string;
    quantity?: number;
    isExclusive?: boolean;
    onExclusive?: () => void;
}

export const Accordion = component$<AccordionProps>(({ title, quantity, isExclusive, onExclusive }) => {

    const isOpen = useSignal(false)

    return (
            <div class="rounded">
                <hr/>
                <div class="flex items-center justify-between cursor-pointer hover:bg-primary hover:text-white hover:fill-white">
                    <div class="flex-1 px-2 py-4" onClick$={() => isOpen.value = !isOpen.value}>
                        <p class="text-lg font-bold flex-1">{title}</p>
                    </div>
                    {typeof isExclusive !== "undefined" && (
                            <Button onClick$={() => onExclusive && onExclusive()}>
                                {isExclusive ?
                                        'Exclusivo' :
                                        'Inclusivo'}
                            </Button>
                    )}
                    <p>{quantity}</p>
                </div>
                <div hidden={!isOpen.value} class="px-2">
                    <Slot/>
                </div>
                <hr/>
            </div>
    )
});
