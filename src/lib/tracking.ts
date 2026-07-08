/**
 * CargoGrid Enterprise - Marketing, UTM Tracking & GDPR Cookie Consent Engine
 */

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

/**
 * Capture UTM parameters from the current URL query parameters and save to sessionStorage.
 * Supports both traditional search queries (?utm_source=...) and hash-query strings (#.../utm_source=...)
 */
export function captureUtmParams(): UtmParams {
  const params: UtmParams = {};
  try {
    // 1. Check traditional search query
    const searchParams = new URLSearchParams(window.location.search);
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const term = searchParams.get("utm_term");
    const content = searchParams.get("utm_content");

    if (source) params.utmSource = source;
    if (medium) params.utmMedium = medium;
    if (campaign) params.utmCampaign = campaign;
    if (term) params.utmTerm = term;
    if (content) params.utmContent = content;

    // 2. Check hash string query as fallback (common in SPAs)
    if (!source && window.location.hash.includes("?")) {
      const hashQuery = window.location.hash.split("?")[1];
      const hashParams = new URLSearchParams(hashQuery);
      const hSource = hashParams.get("utm_source");
      const hMedium = hashParams.get("utm_medium");
      const hCampaign = hashParams.get("utm_campaign");
      const hTerm = hashParams.get("utm_term");
      const hContent = hashParams.get("utm_content");

      if (hSource) params.utmSource = hSource;
      if (hMedium) params.utmMedium = hMedium;
      if (hCampaign) params.utmCampaign = hCampaign;
      if (hTerm) params.utmTerm = hTerm;
      if (hContent) params.utmContent = hContent;
    }

    // Save found params to sessionStorage to persist across page navigations
    if (params.utmSource) {
      sessionStorage.setItem("cg_utm_source", params.utmSource);
      if (params.utmMedium) sessionStorage.setItem("cg_utm_medium", params.utmMedium);
      if (params.utmCampaign) sessionStorage.setItem("cg_utm_campaign", params.utmCampaign);
      if (params.utmTerm) sessionStorage.setItem("cg_utm_term", params.utmTerm);
      if (params.utmContent) sessionStorage.setItem("cg_utm_content", params.utmContent);
      
      console.log("[UTM Tracker] Saved campaign parameters:", params);
    }
  } catch (err) {
    console.warn("[UTM Tracker] Failed to parse URL parameters:", err);
  }

  return getStoredUtmParams();
}

/**
 * Retrieve current UTM parameters from session cache
 */
export function getStoredUtmParams(): UtmParams {
  const params: UtmParams = {};
  try {
    const source = sessionStorage.getItem("cg_utm_source");
    if (source) {
      params.utmSource = source;
      params.utmMedium = sessionStorage.getItem("cg_utm_medium") || undefined;
      params.utmCampaign = sessionStorage.getItem("cg_utm_campaign") || undefined;
      params.utmTerm = sessionStorage.getItem("cg_utm_term") || undefined;
      params.utmContent = sessionStorage.getItem("cg_utm_content") || undefined;
    }
  } catch (e) {
    // sessionStorage not available
  }
  return params;
}

/**
 * GDPR Cookie Consent Management
 */
const COOKIE_CONSENT_KEY = "cargogrid_cookie_consent";

export function getCookieConsent(): CookieConsent | null {
  try {
    const val = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (val) {
      return JSON.parse(val) as CookieConsent;
    }
  } catch (e) {
    // localStorage not available
  }
  return null;
}

export function saveCookieConsent(analytics: boolean, marketing: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    console.log("[Cookie Consent] Choices saved successfully:", consent);
    
    // Simulate loading analytics and marketing pixels based on choices
    if (analytics) {
      console.log("[Analytics] Initialized CargoGrid Custom Analytics Engine...");
    }
    if (marketing) {
      console.log("[Marketing] Initialized Facebook Pixel, Google Tag Manager & LinkedIn Insight tags...");
    }
  } catch (e) {
    // localStorage not available
  }

  return consent;
}
