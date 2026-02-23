import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import Chart                     from 'chart.js/auto'
import type { UICardInDeckItem } from "~/UI/deck/models/deck.store.model";
import { DECK_CREATION_CONTEXT } from "~/UI/deck/store/deckCreation.store";
import type { UICardStackItem }  from "~/UI/shared/models/CardStackItem";
import type { NormalizedModel }  from "~/utils/normalize";

const CHART_COLORS = {
    'UNIDAD':    '#203bac',
    'ACCION':    '#f45353',
    'MONUMENTO': '#cac04f',
    'ARMA':      '#34855a',
}

function getLabels(): string[] {
    // from 1 to 9
    return new Array(9).fill(0).map((_, i) => i === 8 ? "9+" : (i + 1).toString());
}

function CreateDataSetFromData(data: CardCostEntity[]) {
    const labels  = getLabels();
    const cardMap = new Map<string, number>();

    labels.forEach(l => {
        cardMap.set(l, 0);
    });

    // organize data by cost
    data.forEach(c => {
        const currentCost = c.cost >= 9 ? "9+" : c.cost.toString();

        const group = cardMap.get(currentCost)!;
        cardMap.set(currentCost, group + c.quantity);
    });

    return Array.from(cardMap.values());
}

function getManaCurveData(cardStack: NormalizedModel<UICardStackItem>,
                          cardInDeck: NormalizedModel<UICardInDeckItem>) {
    // get all costs
    const allCost: CardCostEntity[] = Object.values(cardInDeck)
            .filter(cd => cardStack[cd.id].type !== 'TESORO') // remove tesoro from the mana curve
            .map(cd => {
                return {
                    cost:     cardStack[cd.id].cost,
                    quantity: cd.quantity,
                    type:     cardStack[cd.id].type,
                }
            });

    const groupedByType = new Map<string, CardCostEntity[]>();

    allCost.forEach(c => {
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
            label:           type,
            data,
            backgroundColor: CHART_COLORS[type as keyof typeof CHART_COLORS],
        });
    }

    return datasets;
}

interface ManaCurveProps {
}

interface CardCostEntity {
    cost: number;
    type: string;
    quantity: number;
}

const ManaCurve = component$<ManaCurveProps>(() => {
    const d = useContext(DECK_CREATION_CONTEXT);

    const ref = useSignal<HTMLCanvasElement>()

    useTask$(({ track }) => {
        track(() => ref.value);
        track(() => d.quantityInMainDeck);


        if (!ref.value) return;

        const labels = getLabels();
        const ctx    = ref.value;

        const chart = new Chart(ctx, {
            type:    'bar',
            data:    {
                labels,
                datasets: getManaCurveData(d.cardStack, d.cardInDeck),
            },
            options: {
                animation: false,
                scales:    {
                    y: {
                        stacked:      true,
                        suggestedMin: 10,
                        ticks:        {
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
