/**
 * CargoGrid Enterprise — Marketing attribution & cookie consent engine.
 *
 * Two responsibilities, deliberately kept together because they are the public
 * surface the UI talks to:
 *
 *  1. **Attribution** — captures UTM parameters and ad-platform click IDs, and
 *     keeps both a first-touch and a last-touch copy. First-touch answers "what
 *     originally found this company", last-touch answers "what made them fill
 *     the form today"; a single stored copy cannot answer both, and in a B2B
 *     sales cycle measured in weeks the two are rarely the same campaign.
 *  2. **Consent** — stores the visitor's choice and forwards it to Google
 *     Consent Mode v2 via `gtag.ts`.
 *
 * Everything is defensive about storage access: Safari in Lockdown Mode, a
 * hardened corporate browser or private-mode quota exhaustion all make
 * localStorage throw on *read*, and none of that is a reason to break a form.
 */

import {
  CONSENT_STORAGE_KEY,
  isAnalyticsConfigured,
  resolveGaIds,
  trackEvent,
  updateGoogleConsent,
} from "./gtag";

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

/** The full attribution envelope submitted alongside a lead. */
export interface AttributionSnapshot extends UtmParams {
  /** First campaign that ever brought this browser to the site. */
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  /** Ad-platform click identifier (gclid, fbclid, ...) as `provider:value`. */
  clickId?: string;
  /** Page the visitor originally landed on, path + query only. */
  landingPage?: string;
  /** External referrer of the first visit, origin only — never a full URL. */
  referrer?: string;
  /** GA4 identifiers, present only when analytics consent was granted. */
  gaClientId?: string;
  gaSessionId?: string;
  /** How many distinct visits preceded this submission. */
  visitCount?: number;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * Click IDs worth persisting, in priority order. Google's `gclid` outranks the
 * rest because it is the only one that also feeds offline conversion import
 * back into Google Ads; `gbraid`/`wbraid` are its iOS privacy-safe siblings.
 */
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "li_fat_id"] as const;

/** Session-scoped (last touch) — cleared when the browser tab session ends. */
const SESSION_PREFIX = "cg_utm_";
/** Long-lived (first touch) — survives across visits until cleared. */
const FIRST_TOUCH_KEY = "cg_first_touch";
const VISIT_COUNT_KEY = "cg_visit_count";

interface FirstTouch {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  clickId?: string;
  landingPage?: string;
  referrer?: string;
  timestamp: string;
}

const safeSession = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage unavailable — attribution degrades, nothing breaks */
    }
  },
};

const safeLocal = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
};

/**
 * Reads a query parameter from the search string, falling back to a hash-query
 * (`#/path?utm_source=...`). The hash form is a leftover from the site's
 * pre-App-Router hash routing, and links shaped that way are still live in
 * older campaigns and email footers.
 */
function readParam(name: string): string {
  try {
    const fromSearch = new URLSearchParams(window.location.search).get(name);
    if (fromSearch) return fromSearch;
    const hash = window.location.hash;
    if (hash.includes("?")) {
      return new URLSearchParams(hash.split("?")[1]).get(name) || "";
    }
  } catch {
    /* malformed URL */
  }
  return "";
}

/** Origin of an external referrer, or "" for direct traffic and self-referrals. */
function externalReferrer(): string {
  try {
    if (!document.referrer) return "";
    const url = new URL(document.referrer);
    if (url.hostname === window.location.hostname) return "";
    return url.origin;
  } catch {
    return "";
  }
}

function readClickId(): string {
  for (const key of CLICK_ID_KEYS) {
    const value = readParam(key);
    if (value) return `${key}:${value}`;
  }
  return "";
}

/**
 * Captures campaign context for the current pageview. Called once per page
 * load from `UtmCapture`.
 *
 * Last touch is overwritten whenever a campaign-tagged URL arrives, so a
 * visitor who returns through a different ad is attributed to that ad. First
 * touch is written exactly once and never modified.
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const params: UtmParams = {};
  const source = readParam("utm_source");
  const clickId = readClickId();

  if (source) {
    params.utmSource = source;
    params.utmMedium = readParam("utm_medium") || undefined;
    params.utmCampaign = readParam("utm_campaign") || undefined;
    params.utmTerm = readParam("utm_term") || undefined;
    params.utmContent = readParam("utm_content") || undefined;

    for (const key of UTM_KEYS) {
      const value = readParam(key);
      if (value) safeSession.set(SESSION_PREFIX + key.replace("utm_", ""), value);
    }
  }
  if (clickId) safeSession.set(SESSION_PREFIX + "click_id", clickId);

  recordFirstTouch({ source, clickId });
  countVisit();

  return source ? params : getStoredUtmParams();
}

/** Writes the first-touch record once per browser. Later calls are ignored. */
function recordFirstTouch({ source, clickId }: { source: string; clickId: string }): void {
  if (safeLocal.get(FIRST_TOUCH_KEY)) return;

  const firstTouch: FirstTouch = {
    utmSource: source || undefined,
    utmMedium: readParam("utm_medium") || undefined,
    utmCampaign: readParam("utm_campaign") || undefined,
    clickId: clickId || undefined,
    landingPage: window.location.pathname + window.location.search,
    referrer: externalReferrer() || undefined,
    timestamp: new Date().toISOString(),
  };
  safeLocal.set(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
}

function getFirstTouch(): FirstTouch | null {
  const raw = safeLocal.get(FIRST_TOUCH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirstTouch;
  } catch {
    return null;
  }
}

/**
 * Increments the visit counter once per browser session. A returning visitor is
 * a far stronger buying signal than a first-time one, and it is the cheapest
 * qualification input we have — no extra request, no extra cookie.
 */
function countVisit(): void {
  const SESSION_FLAG = "cg_visit_counted";
  if (safeSession.get(SESSION_FLAG)) return;
  safeSession.set(SESSION_FLAG, "1");
  const current = Number.parseInt(safeLocal.get(VISIT_COUNT_KEY) || "0", 10);
  safeLocal.set(VISIT_COUNT_KEY, String((Number.isFinite(current) ? current : 0) + 1));
}

/** Last-touch UTM parameters for the current session. */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const source = safeSession.get(SESSION_PREFIX + "source");
  if (!source) return {};
  return {
    utmSource: source,
    utmMedium: safeSession.get(SESSION_PREFIX + "medium") || undefined,
    utmCampaign: safeSession.get(SESSION_PREFIX + "campaign") || undefined,
    utmTerm: safeSession.get(SESSION_PREFIX + "term") || undefined,
    utmContent: safeSession.get(SESSION_PREFIX + "content") || undefined,
  };
}

/**
 * Assembles everything known about how this visitor arrived, for submission
 * with a lead.
 *
 * Async only because the GA4 client ID may need one round-trip through the tag;
 * that call is internally time-boxed, so awaiting this never stalls a form for
 * more than a few hundred milliseconds even when GA is blocked outright.
 */
export async function getAttributionSnapshot(): Promise<AttributionSnapshot> {
  if (typeof window === "undefined") return {};

  const lastTouch = getStoredUtmParams();
  const firstTouch = getFirstTouch();
  const visitCount = Number.parseInt(safeLocal.get(VISIT_COUNT_KEY) || "1", 10);

  const snapshot: AttributionSnapshot = {
    ...lastTouch,
    firstUtmSource: firstTouch?.utmSource,
    firstUtmMedium: firstTouch?.utmMedium,
    firstUtmCampaign: firstTouch?.utmCampaign,
    clickId: safeSession.get(SESSION_PREFIX + "click_id") || firstTouch?.clickId || undefined,
    landingPage: firstTouch?.landingPage,
    referrer: firstTouch?.referrer,
    visitCount: Number.isFinite(visitCount) ? visitCount : 1,
  };

  // GA identifiers exist only where analytics consent was granted — a denied
  // visitor simply submits without them rather than being probed for an ID.
  if (isAnalyticsConfigured && getCookieConsent()?.analytics) {
    const { clientId, sessionId } = await resolveGaIds();
    snapshot.gaClientId = clientId || undefined;
    snapshot.gaSessionId = sessionId || undefined;
  }

  return snapshot;
}

/* -------------------------------------------------------------------------- */
/* Cookie consent                                                             */
/* -------------------------------------------------------------------------- */

export function getCookieConsent(): CookieConsent | null {
  const raw = safeLocal.get(CONSENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    // A record with no explicit booleans is treated as no consent at all:
    // under UU PDP 27/2022 and GDPR, ambiguity means "not granted".
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      timestamp: parsed.timestamp || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Persists the visitor's choice and pushes it straight to Consent Mode.
 *
 * The Google update is what actually switches cookies on or off — storing the
 * record without it would leave the banner decorative, which is exactly the
 * state this codebase was in before the tag was wired up.
 */
export function saveCookieConsent(analytics: boolean, marketing: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  };

  safeLocal.set(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  updateGoogleConsent(consent);

  // Logged as an event so consent rates are visible in GA4 alongside traffic.
  // Consent Mode keeps this cookieless when analytics was declined, so it is
  // measurable without contradicting the choice it is recording.
  trackEvent("consent_update", {
    consent_analytics: analytics,
    consent_marketing: marketing,
  });

  return consent;
}

/** Event name the footer link dispatches to reopen the preferences dialog. */
export const OPEN_CONSENT_PREFERENCES_EVENT = "cargogrid:open-cookie-preferences";

/**
 * Reopens the consent banner. Withdrawing consent has to be as easy as giving
 * it (UU PDP 27/2022 Pasal 9, GDPR Art. 7(3)), and the banner is otherwise
 * unreachable once a choice has been stored.
 */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_PREFERENCES_EVENT));
}
