import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { Database }            from '../../database.types';

export class SupabaseProvider {
  private static supabaseClient?: SupabaseClient;

  public static getSupabaseClient(): SupabaseClient<Database> {
    if (!SupabaseProvider.supabaseClient) {
      SupabaseProvider.supabaseClient = createClient<Database>(import.meta.env.PUBLIC_SB_API_URL, import.meta.env.PUBLIC_SB_API_KEY);
    }

    if (!SupabaseProvider.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return SupabaseProvider.supabaseClient;
  }
}
