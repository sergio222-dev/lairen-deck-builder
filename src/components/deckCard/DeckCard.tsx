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
            <div class={`${styles['card-container']}`}>
                <div class={`${styles['card-header']} min-w-0 flex`}>
                    <h3 class={`text-xl truncate`}>{name}</h3>
                </div>
                <div>
                    <span>Enano</span>
                </div>
                <div class={`${styles['card-preview']}`}>
                    <div class={`${styles['card-stack']}`}>
                        <div class={`${styles['card-center']}`}>
                            {([0, 1, 2]).map((_, i) => (
                                    <div key={i} class={`${styles['card-ghost']}`} {...splashArt ? {
                                        style: {
                                            backgroundRepeat:   "no-repeat",
                                            backgroundPosition: "50% 50%",
                                            backgroundSize:     "100% 100%",
                                            backgroundImage:    `url(${splashArt})`,
                                        },
                                    } : {}} ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <Link href={path + `/${id}`} class={`${styles['card-edit']}`}>
                    {path.includes('preview') ? 'Ver mazo →' : 'Editar mazo →'}
                </Link>
            </div>
    );
});
