import { component$ } from "@builder.io/qwik";
import { Link }       from "@builder.io/qwik-city";
import { Button }     from "~/components/button";
import { MyDecks }    from "~/features/myDecks/MyDecks";

export { useListMyDeckLoader } from "~/providers/loaders/decks";

export default component$(() => {
  return (
    <div class="overflow-y-auto w-full">
      <div class="flex w-full justify-between py-4 px-2">
        <h1 class="text-2xl font-bold">My Decks</h1>
        <Link href="/decks/create/">
          <Button>Create Deck</Button>
        </Link>
      </div>
      <MyDecks/>
    </div>
  )
});
