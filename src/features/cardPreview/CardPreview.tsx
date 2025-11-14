import { $, component$, useContext, useTask$ } from "@builder.io/qwik";
import { useLocation }                         from "@builder.io/qwik-city";
import { ButtonIcon }                          from "~/components/button";
import { Icon }                                from "~/components/icons/Icon";
import { CARD_VIEW_CONTEXT }                   from "~/UI/card/store/cardViewerContext";

export const CardPreview = component$(() => {
    const location = useLocation();

    const cardViewer = useContext(CARD_VIEW_CONTEXT);

    useTask$(({ track }) => {
        track(() => location.isNavigating);

        if (!location.isNavigating) return;

        cardViewer.isOpen = false;
    });

    const handleCloseDialog = $(() => {
        cardViewer.isOpen = false;
    });

    return (
            <div
                    class="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center overflow-y-auto bg-[#181A1B] bg-opacity-90 p-6"
                    style={{ display: cardViewer.isOpen ? "block" : "none" }}
            >

                {/* Card Detail Container */}
                <div class="relative w-full rounded-lg bg-[#2C2F34] p-6 shadow-2xl md:w-[80vw] lg:w-[65vw]">
                    {/* Close Button */}
                    <ButtonIcon
                            class="absolute right-4 top-4 cursor-pointer z-10 rounded-full p-2 transition duration-300 ease-in-out hover:bg-secondary"
                            onClick$={handleCloseDialog}
                    >
                        <Icon name="close" width={32} height={32} class="fill-white"/>
                    </ButtonIcon>

                    <div class="flex flex-col gap-6 md:flex-row">
                        {/* Card Image */}
                        <div class="flex w-full justify-center md:w-1/2">
                            <img
                                    src={cardViewer.card?.image}
                                    alt={cardViewer.card?.name}
                                    style="clip-path: inset(3px);"
                                    class="h-auto w-full rounded-card shadow-lg transition-transform duration-300 ease-in-out"
                            />
                        </div>

                        {/* Card Details */}
                        <div class="w-full text-white md:w-1/2">
                            <h1 class="mb-4 text-3xl font-semibold">{cardViewer.card?.name}</h1>
                            <div class="mb-6">
                                <span class="text-lg font-bold">Costo:&nbsp;</span>
                                <span class="text-xl font-bold text-secondary">{cardViewer.card?.cost}</span>
                            </div>
                            <p class="text-justify text-lg">{cardViewer.card?.text}</p>
                        </div>
                    </div>
                </div>
            </div>
    );
});
