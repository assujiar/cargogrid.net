/**
 * Server-side Supabase client for route handlers.
 *
 * Deliberately uses the *publishable* key, not the secret key: the write paths
 * that run through here (create_inquiry, log_email) are SECURITY DEFINER
 * functions granted to `anon`, so the server needs no more privilege than the
 * browser had. Keeping it least-privilege means moving the call server-side
 * changes only the network path, never the permission model.
 *
 * Unlike src/lib/supabase.ts this never throws at module load — a missing env
 * var must surface as a clean 503 from the API route, not as an exception while
 * the module graph is being evaluated.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
