import { component$, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate }                           from "@builder.io/qwik-city";
import {
    FLAGS
}                                                                           from "~/app/shared/application/constants/flags";
import { TOKENS }                                                           from "~/app/shared/binds/TOKENS";
import type { DialogYesNoNo }                                               from "~/components/dialogs/DialogYesNo";
import { Appbar }                                                           from '~/features/appbar';
import { CardPreview }                                                      from "~/features/cardPreview/CardPreview";
import { IoC }                                                              from "~/lib/IoC";
import { createClientBrowser }                                              from "~/lib/supabase-qwik";
import { AppContext, useAppStore }                                          from "~/stores/appContext";
import { CARD_VIEW_CONTEXT, useCardViewerStore }                            from "~/UI/card/store/cardViewer.storet";
import type { UserStoreState }                                              from "~/UI/user/models/user.model";
import { USER_CONTEXT, useUserStore }                                       from "~/UI/user/store/user.store";


export const useMaintenanceLoader = routeLoader$(async ({ sharedMap }) => {
    return sharedMap.get(FLAGS.MAINTENANCE) as boolean;
})

export const useUserLoader = routeLoader$<UserStoreState>(() => {
    const getCurrentUser = IoC.instance.resolve(TOKENS.CURRENT_USER)
    const loggedUser     = getCurrentUser();

    return {
        user: loggedUser,
    }
})

export default component$(() => {
    const isInMaintenance = useMaintenanceLoader();
    const initialUser     = useUserLoader();
    const navigate        = useNavigate();
    const location        = useLocation();

    const userStore = useUserStore(initialUser.value)

    const app        = useAppStore(isInMaintenance.value);
    const cardViewer = useCardViewerStore();

    const dialogYesNo = useSignal<DialogYesNoNo>()

    useContextProvider(USER_CONTEXT, userStore);
    useContextProvider(AppContext, app);
    useContextProvider(CARD_VIEW_CONTEXT, cardViewer);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        app.dialogYesNo = dialogYesNo; // Assign ref to the app store

        // Supabase subscription
        const client = createClientBrowser();

        const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                userStore.user = null;

                window.location.href = "/"
            }

            if (event === 'SIGNED_IN' && !userStore.user) {
                userStore.user = {
                    email:      session!.user.email!,
                    id:         session!.user.id,
                    avatar_url: session!.user.user_metadata.avatar_url,

                }
            }
        });

        return () => subscription.unsubscribe();
    })

    return (
            <div class="flex flex-col h-full overflow-hidden">
                <Appbar/>
                <main class="flex flex-auto overflow-hidden relative">
                    {!isInMaintenance.value && (
                            <>
                                <Slot/>
                                <CardPreview/>
                            </>
                    )}

                    {isInMaintenance.value && (
                            <div class="flex flex-1 justify-center h-[100vh]">
                                <div class="max-w-md mt-[10rem]">
                                    <h1 class="text-3xl text-[var(--qwik-secondary)]">Actualizando/Arreglando cosas</h1>
                                    <hr/>
                                    <p class="mt-2">
                                        Probablemente estoy arreglando algo que se rompio, si necesitas un deck urgente
                                        podes mandarme un mail a <span>molinasergio91@gmail.com</span> o mandar un
                                        mensaje en el wsp de venado
                                    </p>
                                </div>
                            </div>
                    )}
                </main>
                <dialog-yes-no ref={dialogYesNo}/>
            </div>
    );
});
