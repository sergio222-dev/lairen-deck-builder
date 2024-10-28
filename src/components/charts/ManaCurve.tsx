import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import Chart                                                from 'chart.js/auto'
import type { DeckState }                                   from "~/models/Deck";

interface CardDateEntry {
  cost: string;
  name: string;
  type: string;
  quantity: number;
}

const CHART_COLORS = {
  'UNIDAD': '#203bac',
  'ACCION': '#f45353',
  'MONUMENTO': '#cac04f',
}

function getLabels(): string[] {
  // from 1 to 9
  return new Array(9).fill(0).map((_, i) => i === 8 ? "9+" : (i + 1).toString());
}

function CreateDataSetFromData(data: CardDateEntry[]) {
  const labels = getLabels();
  const cardMap = new Map<string, number>();

  labels.forEach(l => {
    cardMap.set(l, 0);
  });

  // organize data by cost
  data.forEach(c => {
    const currentCost = Number(c.cost) >= 9 ? "9+" : c.cost;

    const group = cardMap.get(currentCost)!;
    cardMap.set(currentCost, group + c.quantity);
  });

  return Array.from(cardMap.values());
}

function getManaCurveData(deckData: DeckState) {
  // get all costs
  const allCosts = Object.values(deckData.masterDeck)
    .map(c => ({ cost: c.cost, name: c.name, type: c.type, quantity: c.quantity }));

  const groupedByType = new Map<string, CardDateEntry[]>();

  allCosts.forEach(c => {
    const type = c.type;

    if (groupedByType.has(type)) {
      const group = groupedByType.get(type)!;
      groupedByType.set(type, [...group, c]);
    } else {
      groupedByType.set(type, [c]);
    }
  });

  // generate datasets for each type by cost
  const datasetsMap: Map<string, number[]> = new Map();

  for (const [type, card] of groupedByType.entries()) {
    const data = CreateDataSetFromData(card);
    datasetsMap.set(type, data);
  }

  const datasets = [];

  for (const [type, data] of datasetsMap.entries()) {
    datasets.push({
      label: type,
      data,
      backgroundColor: CHART_COLORS[type as keyof typeof CHART_COLORS],
    });
  }

  return datasets;
}

interface ManaCurveProps {
  deckData: DeckState;
}

const ManaCurve = component$<ManaCurveProps>(({ deckData }) => {

  const ref = useSignal<HTMLCanvasElement>()

  useTask$(({ track }) => {
    track(() => ref.value);
    track(() => Object.values(deckData.masterDeck).reduce((acc, c) => acc + c.quantity, 0));

    if (!ref.value) return;

    const labels = getLabels();
    const ctx = ref.value;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: getManaCurveData(deckData),
      },
      options: {
        animation: false,
        scales: {
          y: {
            stacked: true,
            suggestedMin: 10,
            ticks: {
              stepSize: 2,
            }
          },
          x: {
            stacked: true,
          }
        }
      }
    });

    return () => chart.destroy();
  })

  return (
    <canvas id="mana-curve" ref={ref}>
    </canvas>
  );
})


export default ManaCurve;
