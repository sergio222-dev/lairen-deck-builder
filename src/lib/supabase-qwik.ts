import { RequestEvent, RequestEventBase, RequestEventLoader } from '@builder.io/qwik-city';
import { createBrowserClient, createServerClient }            from '@supabase/ssr';
import { Database }                                           from "../../database.types";

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
        getAll() {
          // convert all cookies to an array
          const cookies = request.cookie.getAll();
          return Object.keys(cookies).filter(k => cookies[k]).map(k => {
            return {
              name:  k,
              value: cookies[k].value
            }
          });
        },
        setAll(cookies) {
          cookies.forEach(cookie => {
            request.cookie.set(cookie.name, cookie.value, { path: '/' });
          });
        },
      }
    }
  );
}
