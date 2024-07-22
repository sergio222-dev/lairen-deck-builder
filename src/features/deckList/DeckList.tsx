import { component$ }              from "@builder.io/qwik";
import { Link }                    from "@builder.io/qwik-city";
import { useListPublicDeckLoader } from "~/providers/loaders/decks";

export const DeckList = component$(() => {

  const decks = useListPublicDeckLoader();

  return (
    <div>
      <h1>Decks</h1>
      <table class="table-auto border-separate border border-slate-200 w-full border-spacing-2">
        <caption class="text-sm text-slate-400 caption-top">
          All decks
        </caption>
        <thead>
        <tr>
          <th class="border border-slate-200">Name</th>
          <th class="border border-slate-200">Description</th>
          <th class="border border-slate-200">Likes</th>
        </tr>
        </thead>
        <tbody>
        {decks.value.decks.map(deck => (
          <tr key={deck.id}>
            <td class="border border-slate-200">
              <Link href={`/decks/preview/${deck.id}`}>
                {deck.name}
              </Link>
            </td>
            <td class="border border-slate-200">{deck.description}</td>
            <td class="border border-slate-200">{deck.likes}</td>
          </tr>
        ))}
        </tbody>
      </table>

    </div>
  )
});
