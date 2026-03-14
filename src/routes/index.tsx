import { component$ } from '@builder.io/qwik';
import { GithubLink } from "~/components/github/GithubLink";

export default component$(() => {
    return (
            <div class="p-4 w-full">
                <div class="absolute right-0 top-0">
                    <GithubLink/>
                </div>

                <div class="flex justify-center">
                    <div class="mx-auto max-w-md">
                        <h1 class="text-xl">Anuncio</h1>
                        <p>
                            Me da pereza hacer un landing page, así que de momento dejo esto aquí.
                            Jueguen Guardian que esta lindo.
                        </p>
                    </div>
                </div>
                {/*<div>*/}
                {/*    <img*/}
                {/*            src="https://i.postimg.cc/4d8HSNdH/nicol-huelga.webp" alt="Nicol Huelga"*/}
                {/*            class="container mx-auto aspect-video max-w-[400px] rounded-lg shadow-md"/>*/}
                {/*</div>*/}
            </div>
    );
});
