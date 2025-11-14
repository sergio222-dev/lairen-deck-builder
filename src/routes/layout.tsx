import type { Signal }                                                                       from "@builder.io/qwik";
import { component$, createContextId, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type {
    User
}                                                                                            from "supabase-auth-helpers-qwik";
import type {
    DialogYesNoNo
}                                                                                            from "~/components/dialogs/DialogYesNo";
import { Appbar }                                                                            from '~/features/appbar';
import {
    CardPreview
}                                                                                            from "~/features/cardPreview/CardPreview";
import { createClientBrowser }                                                               from "~/lib/supabase-qwik";
import { AppContext, useAppStore }                                                           from "~/stores/appContext";
import {
    CARD_VIEW_CONTEXT,
    useCardViewerStore
}                                                                                            from "~/UI/card/store/cardViewerContext";

type UserSupabase = User | null

export const UserContext = createContextId<Signal<UserSupabase>>('user-context');

export default component$(() => {
    const user       = useSignal<UserSupabase | undefined>(undefined);
    const app        = useAppStore();
    const cardViewer = useCardViewerStore();

    const dialogYesNo = useSignal<DialogYesNoNo>()

    useContextProvider(UserContext, user);
    useContextProvider(AppContext, app);
    useContextProvider(CARD_VIEW_CONTEXT, cardViewer);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        app.dialogYesNo = dialogYesNo; // Assign ref to the app store

        // Supabase subscription
        const client = createClientBrowser();

        const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                user.value = null;
            }

            if (event === 'SIGNED_IN') {
                user.value = session?.user
            }
        });

        return () => subscription.unsubscribe();
    })

    return (
            <div class="flex flex-col h-full overflow-hidden">
                <Appbar/>
                <main class="flex flex-auto overflow-hidden relative">
                    <Slot/>
                    <CardPreview/>
                </main>
                <dialog-yes-no ref={dialogYesNo}/>
            </div>
    );
});
