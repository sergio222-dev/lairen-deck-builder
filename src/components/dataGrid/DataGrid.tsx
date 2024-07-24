import type { JSXOutput, QRL } from "@builder.io/qwik";
import { component$ }                     from "@builder.io/qwik";

export interface ColumnDefinition {
  id: string;
  label: string;
  cell?: QRL<(row: any) => JSXOutput>;
}

interface DataGridProps<T = any> {
  columns: ColumnDefinition[];
  rows: T[];
  caption?: string;
}

export const DataGrid = component$<DataGridProps>(({ columns, rows, caption }) => {
  return (
    <div>
      <table class="table-auto border border-slate-200 w-full border-spacing-2">
        {caption && <caption class="text-sm text-slate-400 caption-top">{caption}</caption>}
        <thead>
        <tr>
          {columns.map(c => (
            <th key={c.id} class="border border-slate-200 p-4 bg-primary text-white">{c.label}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            {columns.map(c => (
              <>
                {c.cell && <td key={c.id} class="border border-slate-200 p-2"> {c.cell(r)} </td>}
                {!c.cell && <td key={c.id} class="border border-slate-200 p-2">{r[c.id]}</td>}
              </>
            ))}
            {/*<td class="border border-slate-200 p-2">*/}
            {/*  <Link href={`/decks/preview/${deck.id}`}>*/}
            {/*    {deck.name}*/}
            {/*  </Link>*/}
            {/*</td>*/}
            {/*<td class="border border-slate-200 p-2">{deck.description}</td>*/}
            {/*<td class="border border-slate-200 p-2">{deck.likes}</td>*/}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
});
