import { component$ } from '@builder.io/qwik';
import { Link }     from '@builder.io/qwik-city';
import { DeckList } from "~/features/decks/list/DeckList";

export { useListPublicDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {
  return (
    <div>
      <Link href="/decks/create/">Create  Deck</Link>
      <DeckList />
    </div>
  )
})
