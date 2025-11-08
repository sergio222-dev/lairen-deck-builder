import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

interface AlbumCardProps {
    name: string;
    current: number;
    total: number;
    id: number;
}

export const AlbumCard = component$<AlbumCardProps>(({ name, current, total, id }) => {
    const ratio = (current / total) * 100;
    const nav = useNavigate();

    return (
            <button onClick$={() => nav(`/album/${id}`)} class="rounded flex flex-col gap-2 p-2 min-h-[50px] border-primary border-2 hover:border-secondary text-white">
                <h2 class="self-start">{name}</h2>
                <div>
                    <div><span>{current} / {total}</span></div>
                    <div class="rounded-2xl bg-white overflow-hidden">
                        <div class="h-[18px] bg-secondary rounded-2xl" style={{ width: `${ratio}%`}}></div>
                    </div>
                </div>
            </button>
    );
})
