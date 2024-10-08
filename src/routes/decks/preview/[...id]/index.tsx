import { component$ }  from "@builder.io/qwik";
import { PreviewDeck } from "~/features/preview";

export { usePublicDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {

  return (
    <div class="flex-auto overflow-y-auto">
    <PreviewDeck/>
    </div>
  )
});
