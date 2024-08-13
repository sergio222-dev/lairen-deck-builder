import { component$ }  from "@builder.io/qwik";
import { Container }   from "~/components/container/Container";
import { PreviewDeck } from "~/features/preview";

export { usePublicDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {

  return (
    <Container>
      <PreviewDeck />
    </Container>
  )
});
