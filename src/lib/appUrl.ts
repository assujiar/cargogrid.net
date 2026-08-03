/**
 * Canonical origin used for self-referential links (the questionnaire link in
 * the customer welcome email, the admin dashboard link in alert emails, ...).
 *
 * Transactional email HTML is generated server-side now (see
 * app/api/inquiry/route.ts), where `window.location.origin` does not exist, so
 * the origin has to come from configuration. In the browser we still prefer the
 * live origin so preview deployments and local dev produce links back to
 * themselves rather than to production.
 */
const FALLBACK_ORIGIN = "https://www.cargogrid.net";

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");

  // Vercel injects these for preview/production deployments.
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return FALLBACK_ORIGIN;
}
