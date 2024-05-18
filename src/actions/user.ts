import type { RequestEvent } from "@builder.io/qwik-city";
import { globalAction$ } from "@builder.io/qwik-city";
import { createClientServer } from "~/lib/supabase-qwik";

export const useLogin = globalAction$(async (_, request) => {
  const client = createClientServer(request as unknown as RequestEvent);

  const { data } = await client.auth.signInWithOAuth({
      provider: 'google', options: {
          redirectTo: request.url.origin + '/api/callback',
      }
  });

  return data;
});

export const useLogout = globalAction$(async (_, request) => {
  const client = createClientServer(request as unknown as RequestEvent);

  client.auth.signOut();
})
