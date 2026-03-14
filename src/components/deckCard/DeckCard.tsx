import { component$ } from "@builder.io/qwik";
import { Link }       from "@builder.io/qwik-city";
import styles         from "./deck-card.module.scss";

interface DeckCardProps {
    id: number;
    type1: string | null;
    type2: string | null;
    splashArt?: string;
    name: string;
    path?: string;
    likes?: number;
}

export const DeckCard = component$<DeckCardProps>(({ id, type2, type1, splashArt, likes = 0, name, path = '/decks/preview' }) => {

    return (
            <Link href={`${path}/${id}`}>
                <div class={styles.card + ` rounded-xl overflow-hidden border-2 border-secondary
  bg-[#0f0f0f] transition-transform`}>
                    <div
                            class={styles.banner + ` relative w-full h-28`}
                            style={{
                                backgroundImage: splashArt ? `url(${splashArt})` : undefined,
                                backgroundPosition: '50% 23%',
                                backgroundSize: '120% auto',
                            }}
                    >
                        <div class={styles.overlay + ` absolute inset-0`} />

                        <div class={`absolute bottom-2 left-3 right-3 text-white`}>
                            <h3 class="truncate text-shadow-lg text-white text-shadow-primary">{name}</h3>
                        </div>
                    </div>

                    <div class={"px-3 py-2 text-sm"}>
                        <div class="flex items-center gap-2 min-h-8">
                            {type1 && <span class="bg-secondary text-black rounded-xl px-2 text-sm">{type1}</span>}
                            {type2 && <span class="bg-secondary text-black rounded-xl px-2 text-sm">{type2}</span>}
                            {!type1 && !type2 && <span class="bg-secondary text-black rounded-xl px-2 text-sm">Tipo de mazo no definido</span>}
                        </div>
                    </div>
                </div>
            </Link>
    );
});
