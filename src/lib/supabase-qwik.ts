import { createBrowserClient, createServerClient }            from '@supabase/ssr';
import { Database }                                           from '../../database.types';
import { RequestEvent, RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';

export function createClientBrowser() {
  return createBrowserClient<Database>(
    import.meta.env.PUBLIC_SB_API_URL,
    import.meta.env.PUBLIC_SB_API_KEY
  );
}

export function createClientServer(request: RequestEvent | RequestEventLoader | RequestEventBase) {

  return createServerClient<Database>(
    import.meta.env.PUBLIC_SB_API_URL,
    import.meta.env.PUBLIC_SB_API_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookie.get(name)?.value;
        },
        set(name: string, value: string) {
          request.cookie.set(name, value, { path: '/' });
        },
        remove(name: string) {
          request.cookie.delete(name);
        }
      }
    }
  );
}
