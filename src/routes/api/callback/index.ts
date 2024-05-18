import type { RequestHandler } from "@builder.io/qwik-city";
import { createClientServer } from "~/lib/supabase-qwik";

export const onGet: RequestHandler = async (request) => {

  const code = request.query.get('code');

  if (!code) {
    request.json(400, { error: 'No code provided' });
  }

  if (code) {
    const client = createClientServer(request);

    const { data, error } = await client.auth.exchangeCodeForSession(code);

    if (error) {
      request.json(400, { error: error.message });
    } else {
      throw request.redirect(308,
        new URL('/', request.url).toString())
    }
  }
}
