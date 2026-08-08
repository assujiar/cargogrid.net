/**
 * Authentication for the email marketing API routes.
 *
 * Two very different callers reach these endpoints and each gets its own door:
 *
 *   requireAdmin()  — a human in the admin portal. The portal signs in with the
 *                     browser Supabase client, which keeps its session in local
 *                     storage rather than in cookies, so the server cannot read
 *                     it from the request. The client therefore sends its access
 *                     token as a bearer, and we ask the same question the RLS
 *                     policies ask: public.is_admin().
 *
 *   requireWorker() — the dispatcher, running from cron with no session at all.
 *                     It presents the shared secret that also unlocks the
 *                     privileged RPCs in the database.
 *
 * Neither path ever touches a Supabase secret key. The publishable key plus the
 * caller's own token is exactly the privilege each caller already had.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

const clean = (value: string | undefined): string =>
  (value || "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

function supabaseUrl(): string {
  return clean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function supabaseKey(): string {
  return clean(
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Length-independent comparison. Secrets here are fixed-length hex, so the
 * timing signal is largely theoretical — but a comparison that leaks its answer
 * character by character is never the version worth keeping.
 */
function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  let mismatch = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

export interface AdminContext {
  /** Supabase client acting as the signed-in admin, so RLS still applies. */
  supabase: SupabaseClient;
  userId: string;
  email: string | null;
}

/**
 * Success and failure share one shape rather than forming a discriminated
 * union. This project compiles with `strict: false`, and without
 * strictNullChecks TypeScript will not narrow a union on a boolean literal
 * discriminant — so `if (!result.ok) { result.error }` would not typecheck.
 * Optional fields on a single interface give callers the same guard-then-use
 * pattern and actually compile here.
 */
export interface AdminResult {
  ok: boolean;
  status?: number;
  error?: string;
  /** Present when `ok` is true. */
  ctx?: AdminContext;
}

export interface WorkerResult {
  ok: boolean;
  status?: number;
  error?: string;
  /** Present when `ok` is true. */
  secret?: string;
}

export async function requireAdmin(request: NextRequest): Promise<AdminResult> {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) {
    return { ok: false, status: 503, error: "Supabase is not configured on the server" };
  }

  const token = bearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: "Missing admin session token" };
  }

  // Binding the token to the client rather than only calling getUser(token)
  // matters: every subsequent query on this client runs as the admin, so RLS
  // stays the enforcement point instead of a permission check we did once and
  // then forgot about.
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return { ok: false, status: 401, error: "Invalid or expired admin session" };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) {
    return { ok: false, status: 503, error: `Cannot verify admin access: ${adminError.message}` };
  }
  if (isAdmin !== true) {
    return { ok: false, status: 403, error: "This account is not an administrator" };
  }

  return {
    ok: true,
    ctx: { supabase, userId: userData.user.id, email: userData.user.email ?? null },
  };
}

/**
 * Accepts the dispatcher's shared secret from either the Authorization header
 * (external schedulers, pg_net) or Vercel's own cron secret.
 *
 * Both are accepted because the scheduler is deployment-specific and this is
 * the one part of the pipeline the operator is most likely to swap out. What
 * cannot be swapped out is that the request has to prove it is the dispatcher.
 */
export function requireWorker(request: NextRequest): WorkerResult {
  const workerSecret = clean(process.env.EMAIL_WORKER_SECRET);
  if (!workerSecret) {
    return {
      ok: false,
      status: 503,
      error: "EMAIL_WORKER_SECRET is not set — the dispatcher cannot authenticate to the database",
    };
  }

  const presented = bearerToken(request) || request.headers.get("x-worker-secret") || "";
  if (safeEqual(presented, workerSecret)) return { ok: true, secret: workerSecret };

  const cronSecret = clean(process.env.CRON_SECRET);
  if (cronSecret && safeEqual(presented, cronSecret)) return { ok: true, secret: workerSecret };

  return { ok: false, status: 401, error: "Unauthorised dispatcher" };
}

/**
 * Anonymous Supabase client for the public tracking endpoints. The RPCs they
 * call are SECURITY DEFINER and token-scoped, so anon is all the privilege they
 * need — and all the privilege a leaked pixel URL can ever confer.
 */
export function getPublicSupabase(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Same client, used by the worker to reach the secret-guarded dispatch RPCs. */
export function getWorkerSupabase(): SupabaseClient | null {
  return getPublicSupabase();
}
