import type { Signal } from "@builder.io/qwik";
import { component$, createContextId, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestEvent, RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Appbar } from '~/features/appbar';
import type { User } from "supabase-auth-helpers-qwik";
import { createClientBrowser, createClientServer } from "~/lib/supabase-qwik";

// export const onGet: RequestHandler = async (request) => {
//     const client = createClientServer(request);
//
//     await client.auth.getUser();
// }

export const useUser = routeLoader$(async (request) => {
    const client = createClientServer(request as unknown as RequestEvent);

    const { data } = await client.auth.getUser();

    return data.user;
});

// export const onGet: RequestHandler = async ({ cacheControl }) => {
//     // Control caching for this request for best performance and to reduce hosting costs:
//     // https://qwik.dev/docs/caching/
//     cacheControl({
//         // Always serve a cached response by default, up to a week stale
//         staleWhileRevalidate: 60 * 60 * 24 * 7,
//         // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
//         maxAge: 5,
//     });
// };

type UserSupabase = User | null

export const UserContext = createContextId<Signal<UserSupabase>>('user-context');

export default component$(() => {

    const userPreloaded = useUser();

    const user = useSignal<UserSupabase>(userPreloaded.value);

    useContextProvider(UserContext, user);

    useVisibleTask$(() => {
        const client = createClientBrowser();

        const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                user.value = null;
            }
        });

        return () => subscription.unsubscribe();
    })

    return (
        <>
            <Appbar />
            <main class="container mx-auto">
                <Slot />
            </main>
        </>
    );
});
