import type { RequestHandler } from "@builder.io/qwik-city";
import type { PlatformCloudflarePages } from "@builder.io/qwik-city/middleware/cloudflare-pages";
import { createClientServer } from "~/lib/supabase-qwik";

export const onGet: RequestHandler<PlatformCloudflarePages> = async (request) => {
  const code = request.query.get('code');

  if (!code) {
    request.json(400, { error: 'No code provided' });
  }

  if (code) {
    const client = createClientServer(request);

    const { error } = await client.auth.exchangeCodeForSession(code);

    if (error) {
      request.json(400, { error: error.message });
    } else {
      throw request.redirect(308,
        new URL('/', request.url).toString())
    }
  }
}
