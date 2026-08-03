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

/** Env values pasted into a dashboard routinely carry stray quotes/whitespace. */
const clean = (value: string | undefined): string =>
  (value || "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

export function getSupabaseHost(): string | null {
  const url = clean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

/**
 * Flattens the error chain `fetch` hides behind a bare "TypeError: fetch
 * failed". The actionable part (ENOTFOUND, ECONNREFUSED, a TLS error) only ever
 * lives on `error.cause`, and postgrest-js stringifies the top-level error
 * before we ever see it — so unwrap here, at the point of failure.
 */
export function describeFetchFailure(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;

  for (let depth = 0; current && depth < 5; depth++) {
    const err = current as { message?: string; code?: string; cause?: unknown };
    const code = err.code ? `${err.code}: ` : "";
    if (err.message) parts.push(`${code}${err.message}`);
    else if (err.code) parts.push(err.code);
    current = err.cause;
  }

  return truncateDetail(parts.join(" <- ") || String(error));
}

/**
 * Upstream errors are not always terse — a misrouted URL happily returns a full
 * HTML error page, and postgrest-js hands that entire body over as `message`.
 * Diagnostics stay useful only if they stay readable.
 */
export function truncateDetail(detail: string, max = 300): string {
  const collapsed = (detail || "").replace(/\s+/g, " ").trim();
  return collapsed.length > max ? `${collapsed.slice(0, max)}…` : collapsed;
}

export function getServiceSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = clean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!url || !key) return null;

  try {
    new URL(url);
  } catch {
    console.error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${JSON.stringify(url)}`);
    return null;
  }

  cached = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      // Wrap fetch so transport failures keep their root cause instead of
      // arriving as an undiagnosable "TypeError: fetch failed".
      fetch: async (input, init) => {
        try {
          return await fetch(input as RequestInfo, init as RequestInit);
        } catch (err) {
          throw new Error(`Cannot reach Supabase at ${url} — ${describeFetchFailure(err)}`, { cause: err });
        }
      },
    },
  });
  return cached;
}
