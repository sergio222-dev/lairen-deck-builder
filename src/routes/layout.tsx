import type { Signal }                                                                  from "@builder.io/qwik";
import { component$, createContextId, Slot, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type {
  RequestEvent
} from "@builder.io/qwik-city";
import {
  routeLoader$
} from "@builder.io/qwik-city";
import { Appbar } from '~/features/appbar';
import type {
  User
} from "supabase-auth-helpers-qwik";
import { createClientBrowser, createClientServer } from "~/lib/supabase-qwik";

export const useUserLoader = routeLoader$(async (request) => {
  const client = createClientServer(request as unknown as RequestEvent);

  const { data } = await client.auth.getSession();

  return data.session?.user;
});

type UserSupabase = User | null

export const UserContext = createContextId<Signal<UserSupabase>>('user-context');

export default component$(() => {
  const userPreloaded = useUserLoader();

  const user = useSignal<UserSupabase | undefined>(userPreloaded.value);

  useContextProvider(UserContext, user);

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
    <>
      <Appbar/>
      <main class="container mx-auto">
        <Slot/>
      </main>
    </>
  );
});
