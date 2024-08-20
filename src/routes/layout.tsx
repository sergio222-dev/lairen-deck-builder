import type { Signal }                                                                       from "@builder.io/qwik";
import { component$, createContextId, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Appbar }                                                                            from '~/features/appbar';
import type {
  User
}                                                                                            from "supabase-auth-helpers-qwik";
import {
  CardPreview
}                                                                                            from "~/features/cardPreview/CardPreview";
import { createClientBrowser }                                                               from "~/lib/supabase-qwik";
import { AppContext, useAppStore }                                                           from "~/stores/appContext";
import {
  CardViewerContext,
  useCardViewerStore
}                                                                                            from "~/stores/cardViewerContext";

type UserSupabase = User | null

export const UserContext = createContextId<Signal<UserSupabase>>('user-context');

export default component$(() => {
  const user       = useSignal<UserSupabase | undefined>(undefined);
  const app        = useAppStore();
  const cardViewer = useCardViewerStore();

  useContextProvider(UserContext, user);
  useContextProvider(AppContext, app);
  useContextProvider(CardViewerContext, cardViewer);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
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
        <CardPreview />
      </main>
    </div>
  );
});
