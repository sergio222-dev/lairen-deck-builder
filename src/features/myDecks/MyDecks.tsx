import { $, component$ }         from "@builder.io/qwik";
import { Link }                  from "@builder.io/qwik-city";
import type { ColumnDefinition } from "~/components/dataGrid/DataGrid";
import { DataGrid }              from "~/components/dataGrid/DataGrid";
import { useListMyDeckLoader }   from "~/providers/loaders/decks";

const columns: ColumnDefinition[] = [
  {
    id:    'name',
    label: 'Name',
    cell:  $((row) => <Link href={`/decks/create/${row.id}`}>{row.name}</Link>)
  },
  {
    id:    'description',
    label: 'Description'
  },
  {
    id:    'likes',
    label: 'Likes'
  }
];

export const MyDecks = component$(() => {
  const decks = useListMyDeckLoader();

  return (
    <div>
      <DataGrid columns={columns} rows={decks.value.decks}/>
    </div>
  )
});