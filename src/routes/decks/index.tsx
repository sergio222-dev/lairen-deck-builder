import { component$ } from '@builder.io/qwik';
import { Link }       from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div>
      <Link href="/decks/create/">Create  Deck</Link>
    </div>
  )
})
