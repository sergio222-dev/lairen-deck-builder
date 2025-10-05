import { component$ } from "@builder.io/qwik";
import { Button }     from "~/components/button";

export const ListAlbums = component$(() => {
    return (
            <div class="overflow-y-auto w-full">
                <div class="flex w-full justify-between py-4 px-2">
                    <h1 class="text-2xl font-bold">My Albums</h1>
                </div>
            </div>
    )
});
