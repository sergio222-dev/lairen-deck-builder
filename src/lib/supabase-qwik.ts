import { RequestEvent, RequestEventBase, RequestEventLoader }     from '@builder.io/qwik-city';
import { CookieOptions, createBrowserClient, createServerClient } from '@supabase/ssr';
import { Database }                                               from '../../database.types';

export function createClientBrowser() {
  return createBrowserClient<Database>(
    import.meta.env.PUBLIC_SB_API_URL,
    import.meta.env.PUBLIC_SB_ANON_KEY
  );
}

export function createClientServer(request: RequestEvent | RequestEventLoader | RequestEventBase) {

  return createServerClient<Database, 'public'>(
    import.meta.env.PUBLIC_SB_API_URL,
    import.meta.env.PUBLIC_SB_ANON_KEY,
    {
      auth:    {
        storage: {
          setItem(key: string, value: string) {
            request.cookie.set(key, value);
          },
          getItem(key: string) {
            return request.cookie.get(key)?.value ?? null;
          },
          removeItem(key: string) {
            request.cookie.delete(key);
          }
        }
      },
      cookies: {
        async getAll() {
          // convert all cookies to an array
          const cookies = request.cookie.getAll();
          return Object.keys(cookies).filter(k => cookies[k]).map(k => {
            return {
              name:  k,
              value: cookies[k].value
            }
          })
        },
        async setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
          cookies.forEach(cookie => {
            request.cookie.set(cookie.name, cookie.value, {
              ...cookie.options,
              path: '/',
            });
          });
        },
      }
    }
  );
}
