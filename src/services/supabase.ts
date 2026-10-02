import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Ensure Anonymous Auth session is established, returning user id
 */
export async function ensureAuthUser(): Promise<string> {
  // If Supabase is not configured, generate or retrieve a persistent local user id
  if (!supabase) {
    let localId = localStorage.getItem('naroomopoly_local_user_id');
    if (!localId) {
      localId = 'local-user-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('naroomopoly_local_user_id', localId);
    }
    return localId;
  }

  // Check current session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }

  // Sign in anonymously
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    console.warn('Anonymous auth failed or disabled, falling back to local UUID', error);
    let fallbackId = localStorage.getItem('naroomopoly_fallback_user_id');
    if (!fallbackId) {
      fallbackId = 'anon-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('naroomopoly_fallback_user_id', fallbackId);
    }
    return fallbackId;
  }

  return data.user.id;
}
