import { $, component$, useContext, useTask$ } from "@builder.io/qwik";
import { useLocation }                         from "@builder.io/qwik-city";
import { ButtonIcon }                          from "~/components/button";
import { Icon }                                from "~/components/icons/Icon";
import { CardViewerContext }                   from "~/stores/cardViewerContext";

export const CardPreview = component$(() => {
  const location = useLocation();

  const cardViewer = useContext(CardViewerContext);

  useTask$(({ track }) => {
    track(() => location.isNavigating);

    if (!location.isNavigating) return;

    cardViewer.isOpen = false;

  })

  const handleCloseDialog = $(() => {
    cardViewer.isOpen = false;
  })

  return (
    <div
      class="p-4 bg-[#181A1B] w-full h-full top-0 left-0 absolute overflow-y-auto z-20"
      style={{ display: cardViewer.isOpen ? 'block' : 'none' }}>
      <ButtonIcon class="absolute top-10 right-10 cursor-pointer" onClick$={handleCloseDialog}>
        <Icon name="close" width={32} height={32} class="fill-primary "/>
      </ButtonIcon>
      <div class="m-auto p-4 w-fit">
        <div class="flex lg:max-w-[min(1000px,80vw)] md:max-w-[min(600px,80vw)]">
          <div class="flex flex-wrap md:flex-nowrap">
            <img
              src={cardViewer.card?.image}
              class="w-full aspect-[2.5/3.5] md:max-w-[400px] rounded-[5%/3.571428571428571%]"/>
            <div class="p-2">
              <h1 class="text-2xl font-bold">{cardViewer.card?.name}, <span
                class="whitespace-nowrap">Costo: {cardViewer.card?.cost}</span></h1>
              <p class="text-xl text-justify font-bold whitespace-break-spaces">{cardViewer.card?.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
