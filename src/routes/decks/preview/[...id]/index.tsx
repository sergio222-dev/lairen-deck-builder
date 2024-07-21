import { component$ }  from "@builder.io/qwik";
import { PreviewDeck } from "~/features/decks/preview/Preview";

export { usePublicDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {

  return (
    <div>
      <PreviewDeck />
    </div>
  )
});
