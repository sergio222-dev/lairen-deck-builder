import { component$, useSignal } from '@builder.io/qwik';
import { Button }                from "~/components/button";
import { CardFilter }            from '~/features/cards';
import { CardDeckInfo }          from '~/features/createDeck/components/CardDeckInfo';
import { CardListDeck }          from '~/features/createDeck/components/CardListDeck';
import { CreateForm }            from "~/features/createDeck/components/CreateForm";

export const Create = component$(() => {
    const selectedSection   = useSignal(1);
    const mobileListDeckRef = useSignal<HTMLDivElement>();

    return (
            <div class="h-full flex flex-col md:flex-row w-full">
                <div
                        data-section-selected={selectedSection.value}
                        class="h-full md:basis-[50%] xl:basis-[61.8%] data-[section-selected=1]:max-md:hidden overflow-y-hidden px-2 pt-2">
                    <div class="flex flex-col h-full">
                        <div>
                            <CardFilter mobileListDeckRef={mobileListDeckRef}/>
                        </div>
                        <div class="overflow-y-auto pt-4 pb-2 px-2" ref={mobileListDeckRef}>
                            <CardListDeck/>
                        </div>
                    </div>
                </div>
                <div
                        data-section-selected={selectedSection.value}
                        class="h-full md:basis-[50%] xl:basis-[38.2%] data-[section-selected=0]:max-md:hidden overflow-y-auto py-2">
                    <div class="">
                        <CreateForm/>
                    </div>
                    <CardDeckInfo/>
                </div>
                <div class="flex items-stretch flex-1 md:hidden">
                    <div class="flex-1 p-4 bg-primary">
                        <Button onClick$={() => selectedSection.value = 0} class="w-full h-full">Cartas</Button>
                    </div>
                    <div class="flex-1 p-4 bg-primary">
                        <Button onClick$={() => selectedSection.value = 1} class="w-full h-full">Deck</Button>
                    </div>
                </div>
            </div>
    );
});
