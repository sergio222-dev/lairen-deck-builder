import { component$ } from "@builder.io/qwik";
import { Link }       from "@builder.io/qwik-city";
import styles         from "./deck-card.module.scss";

interface DeckCardProps {
    id: number;
    splashArt?: string;
    name: string;
    path?: string;
    likes?: number;
}

export const DeckCard = component$<DeckCardProps>(({ id, splashArt, likes = 0, name, path = '/decks/preview' }) => {

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
                            <h3 class="truncate text-shadow-lg absolute bottom-2 left-3 right-3 text-white">{name}</h3>
                            <span class="text-sm opacity-80">Enano</span>
                        </div>
                    </div>

                    <div class={"px-3 py-2 text-sm opacity-70"}>
                        <span>24 cartas</span>
                    </div>
                </div>
            </Link>
    );
});
