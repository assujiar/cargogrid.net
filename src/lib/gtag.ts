/**
 * CargoGrid Enterprise — Google tag plumbing (GA4 + GTM + Consent Mode v2).
 *
 * This is the low-level layer: it owns the `dataLayer`, the consent signals and
 * the GA4 identifiers, and nothing else. Consent *storage* and campaign
 * attribution live in `tracking.ts`, which imports from here — never the other
 * way round, so there is no cycle between the two.
 *
 * Nothing in this file loads a Google script. `AnalyticsProvider` decides when
 * the tag is injected; every function here is a no-op until it is, and stays a
 * no-op forever when no measurement ID is configured (local dev, previews).
 */

import type { CookieConsent } from "./tracking";

/** GA4 property, e.g. `G-XXXXXXXXXX`. Empty string disables GA4 entirely. */
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim();
/** GTM container, e.g. `GTM-XXXXXXX`. Empty string disables the container. */
export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID || "").trim();

export const hasGa4 = GA_MEASUREMENT_ID.startsWith("G-");
export const hasGtm = GTM_ID.startsWith("GTM-");
/** True when at least one Google tag is configured for this deployment. */
export const isAnalyticsConfigured = hasGa4 || hasGtm;

/** localStorage key holding the visitor's consent record. Mirrored by the
 *  bootstrap script below, which cannot import from `tracking.ts`. */
export const CONSENT_STORAGE_KEY = "cargogrid_cookie_consent";

type ConsentState = "granted" | "denied";

export interface GoogleConsentSignals {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
  functionality_storage: ConsentState;
  personalization_storage: ConsentState;
  security_storage: ConsentState;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Pushes a raw gtag command. Uses the real `arguments` object rather than an
 * array on purpose: gtag.js inspects `arguments` and ignores plain arrays, so a
 * spread-into-array push would be silently dropped.
 */
export function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Pushes a plain GTM-style event object (Custom Event triggers match these). */
export function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Maps CargoGrid's three consent buckets onto the seven signals Consent Mode v2
 * expects. `security_storage` and `functionality_storage` follow the necessary
 * bucket, which is always granted — they cover CSRF/session and language
 * preference, not tracking.
 */
export function consentSignalsFor(consent: CookieConsent | null): GoogleConsentSignals {
  const analytics: ConsentState = consent?.analytics ? "granted" : "denied";
  const marketing: ConsentState = consent?.marketing ? "granted" : "denied";
  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
    functionality_storage: "granted",
    personalization_storage: marketing,
    security_storage: "granted",
  };
}

/** Sends a Consent Mode v2 update. Safe to call before the tag has loaded —
 *  the command queues on the dataLayer and is replayed on load. */
export function updateGoogleConsent(consent: CookieConsent | null): void {
  if (!isAnalyticsConfigured) return;
  gtag("consent", "update", consentSignalsFor(consent));
  // Redaction only lifts once ad storage is granted; re-asserting it on every
  // update keeps a later withdrawal from leaving ad identifiers in flight.
  gtag("set", "ads_data_redaction", !consent?.marketing);
}

/**
 * The synchronous bootstrap that must execute before gtag.js/GTM loads.
 *
 * Order matters and is the whole reason this is an inline string rather than a
 * React component: Consent Mode only suppresses cookies if `default` is on the
 * dataLayer *before* the tag initialises. Anything React renders is too late.
 *
 * It also replays a returning visitor's stored choice immediately, so someone
 * who already accepted is measured on their very first hit instead of losing it
 * to the 500 ms `wait_for_update` window.
 */
export const CONSENT_BOOTSTRAP_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=window.gtag||gtag;
gtag('consent','default',{
'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied',
'analytics_storage':'denied','functionality_storage':'granted',
'personalization_storage':'denied','security_storage':'granted','wait_for_update':500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
try{
var s=localStorage.getItem('${CONSENT_STORAGE_KEY}');
if(s){var c=JSON.parse(s);var a=c&&c.analytics?'granted':'denied';var m=c&&c.marketing?'granted':'denied';
gtag('consent','update',{'ad_storage':m,'ad_user_data':m,'ad_personalization':m,
'analytics_storage':a,'functionality_storage':'granted','personalization_storage':m,'security_storage':'granted'});
gtag('set','ads_data_redaction',m!=='granted');}
}catch(e){}
`.trim();

/**
 * Emits an event to whichever tags are configured.
 *
 * GA4 gets it through `gtag('event', ...)`. GTM gets a `cg_`-prefixed mirror as
 * a plain object, because Custom Event triggers match `{event: '...'}` and not
 * the `arguments` objects gtag pushes. The prefix is what stops a container
 * that also holds a GA4 tag from double-counting a name like `generate_lead`.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!isAnalyticsConfigured) return;
  if (hasGa4) gtag("event", name, params);
  if (hasGtm) pushDataLayer({ event: `cg_${name}`, ...params });
}

/**
 * Records a page view for a client-side navigation.
 *
 * GA4 is configured with `send_page_view: false` (see AnalyticsProvider) so the
 * automatic pageview does not race the App Router: on a client navigation the
 * tag would otherwise read the previous URL from `document.location`.
 */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsConfigured || typeof window === "undefined") return;
  const location = window.location.origin + path;
  if (hasGa4) {
    gtag("event", "page_view", {
      page_path: path,
      page_location: location,
      page_title: title || document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }
  if (hasGtm) {
    pushDataLayer({ event: "cg_page_view", page_path: path, page_location: location, page_title: title || document.title });
  }
}

const readCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : "";
};

/**
 * GA4 client ID from the `_ga` cookie (`GA1.1.<client_id>`), i.e. the same ID
 * that lands in BigQuery/GA4 reports. Empty when analytics consent is denied —
 * there is no cookie to read, which is the intended outcome, not a bug.
 */
export function readGaClientId(): string {
  const raw = readCookie("_ga");
  if (!raw) return "";
  const parts = raw.split(".");
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : "";
}

/**
 * GA4 session ID from the per-property `_ga_<container>` cookie. Google has
 * shipped two encodings for it — `GS1.1.<session_id>.<n>...` and the newer
 * `GS2.1.s<session_id>$o<n>$...` — so both are handled rather than assuming
 * whichever one is current today.
 */
export function readGaSessionId(): string {
  if (!hasGa4) return "";
  const raw = readCookie(`_ga_${GA_MEASUREMENT_ID.replace(/^G-/, "")}`);
  if (!raw) return "";
  const parts = raw.split(".");
  const payload = parts[2] || "";
  if (payload.startsWith("s")) {
    const match = payload.match(/^s(\d+)/);
    return match ? match[1] : "";
  }
  return /^\d+$/.test(payload) ? payload : "";
}

export interface GaIds {
  clientId: string;
  sessionId: string;
}

/**
 * Resolves the GA4 identifiers for stitching a lead to its browsing history.
 *
 * Reads the cookies first because that is synchronous and always agrees with
 * what GA itself reports. `gtag('get', ...)` is only a fallback for the window
 * where the tag has minted an ID but the cookie has not been written yet; it is
 * raced against a timeout so a blocked or slow tag can never hold up a form
 * submission — a missing ID costs attribution, a hung submit costs the lead.
 */
export function resolveGaIds(timeoutMs = 700): Promise<GaIds> {
  const fromCookies: GaIds = { clientId: readGaClientId(), sessionId: readGaSessionId() };
  if (!hasGa4 || typeof window === "undefined" || fromCookies.clientId) {
    return Promise.resolve(fromCookies);
  }

  return new Promise<GaIds>((resolve) => {
    let settled = false;
    const finish = (ids: GaIds) => {
      if (settled) return;
      settled = true;
      resolve(ids);
    };

    const timer = setTimeout(() => finish(fromCookies), timeoutMs);

    try {
      gtag("get", GA_MEASUREMENT_ID, "client_id", (clientId: unknown) => {
        clearTimeout(timer);
        finish({
          clientId: typeof clientId === "string" ? clientId : "",
          sessionId: readGaSessionId(),
        });
      });
    } catch {
      clearTimeout(timer);
      finish(fromCookies);
    }
  });
}
