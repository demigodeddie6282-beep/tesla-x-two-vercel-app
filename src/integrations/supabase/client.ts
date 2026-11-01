import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

function getEnvVar(key: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
}

function createSupabaseClient() {
  const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
  const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['VITE_SUPABASE_URL'] : []),
      ...(!SUPABASE_ANON_KEY ? ['VITE_SUPABASE_ANON_KEY'] : []),
    ];
    console.warn(`[Supabase] Missing environment variable(s): ${missing.join(', ')}. Using fallback demo mode.`);
    throw new Error(`Missing Supabase configuration: ${missing.join(', ')}`);
  }

  console.log('[Supabase] Initializing client for:', SUPABASE_URL);

  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

