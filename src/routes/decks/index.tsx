import { component$, useContext } from '@builder.io/qwik';
import { Link }                   from '@builder.io/qwik-city';
import { Button }                 from "~/components/button";
import { DeckList }               from "~/features/deckList";
import { UserContext }            from "~/routes/layout";

export { useListPublicDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {

  const user = useContext(UserContext);

  return (
    <div>
      <div class="flex w-full justify-between py-4 px-2">
        <h1 class="text-2xl font-bold">Decks List</h1>
        {user.value && (
          <Link href="/decks/create/">
            <Button>Create Deck</Button>
          </Link>
        )}
      </div>
      <DeckList/>
    </div>
  )
})
