"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  GTM_ID,
  hasGa4,
  hasGtm,
  isAnalyticsConfigured,
  trackEvent,
  trackPageView,
} from "../../lib/gtag";

/**
 * Loads the Google tags and records the engagement signals GA4 cannot infer on
 * its own from a client-rendered App Router site.
 *
 * Consent is *not* handled here — `CONSENT_BOOTSTRAP_SCRIPT` (injected at the
 * top of <body> in the root layout) has already put Consent Mode v2 into a
 * denied-by-default state before any of this executes. Everything below is
 * therefore safe to load unconditionally: with consent denied the tag runs in
 * cookieless mode, sending modelled pings and writing no identifiers.
 */

/**
 * Page views for client-side navigations.
 *
 * The first view is deliberately left to the tag's own `send_page_view` on
 * load: an effect here could otherwise fire before the `config` command has
 * been processed, and GA4 drops events aimed at a property it has not
 * configured yet. Every subsequent route change is ours to report.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = searchParams?.toString();
    trackPageView(pathname + (query ? `?${query}` : ""));
  }, [pathname, searchParams]);

  return null;
}

/** Scroll milestones, in percent of document height. */
const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

/**
 * Milestones already reported for the current path, held at module scope.
 *
 * Not component state or a ref on purpose: a remount of the provider — which a
 * route transition can cause — would hand the effect a fresh, empty set and
 * every milestone would be counted a second time for the same page. Keyed by
 * path so a genuine navigation still starts from zero.
 */
const scrollProgress = { path: "", reached: new Set<number>() };

/**
 * Reports how far down a page a visitor actually got.
 *
 * GA4's enhanced measurement only reports a single 90 % event, which cannot
 * distinguish "bounced above the fold" from "read most of the article" — the
 * exact distinction that tells us which of the 25 articles are earning their
 * keep. Milestones are per-path and reset on navigation.
 */
function useScrollDepthTracking(pathname: string) {
  useEffect(() => {
    if (!isAnalyticsConfigured) return;

    if (scrollProgress.path !== pathname) {
      scrollProgress.path = pathname;
      scrollProgress.reached = new Set<number>();
    }
    const reached = scrollProgress.reached;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = ((window.scrollY || 0) / scrollable) * 100;

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent("scroll_depth", { percent_scrolled: milestone, page_path: pathname });
        }
      }
      if (reached.size === SCROLL_MILESTONES.length) window.removeEventListener("scroll", onScroll);
    };

    // rAF-coalesced: scroll fires far more often than we need, and an event
    // handler that does layout reads on every tick is a jank source on mobile.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Deferred rather than measured inline: on a client navigation this effect
    // runs before the router has reset the scroll position, so an immediate
    // read would credit the new page with the previous page's scroll depth.
    const initial = window.requestAnimationFrame(measure);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(initial);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);
}

/** Contact channels worth counting as conversions in their own right. */
function classifyLink(href: string): { event: string; params: Record<string, unknown> } | null {
  if (href.startsWith("mailto:")) {
    return { event: "contact_click", params: { method: "email" } };
  }
  if (href.startsWith("tel:")) {
    return { event: "contact_click", params: { method: "phone" } };
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  if (/(^|\.)(wa\.me|whatsapp\.com)$/.test(url.hostname)) {
    return { event: "contact_click", params: { method: "whatsapp" } };
  }
  if (url.hostname !== window.location.hostname) {
    return {
      event: "click",
      params: { outbound: true, link_domain: url.hostname, link_url: url.href },
    };
  }
  // Internal links that point at the audit form are the site's primary CTA;
  // counting them separates "saw the pitch" from "started the funnel".
  if (url.pathname === "/kontak" || url.hash === "#audit-form") {
    return { event: "cta_click", params: { cta_target: url.pathname + url.hash } };
  }
  return null;
}

/**
 * One delegated listener for every link on the site.
 *
 * Per-component handlers would mean touching a few dozen files and would still
 * miss links inside article content, which is generated from data. Delegation
 * on the document covers everything, including markup added later.
 */
function useLinkTracking(pathname: string) {
  useEffect(() => {
    if (!isAnalyticsConfigured) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const classified = classifyLink(href);
      if (!classified) return;

      trackEvent(classified.event, {
        ...classified.params,
        link_text: (anchor?.textContent || "").trim().slice(0, 100),
        page_path: pathname,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);
}

function EngagementTracking() {
  const pathname = usePathname();
  useScrollDepthTracking(pathname);
  useLinkTracking(pathname);
  return null;
}

export default function AnalyticsProvider() {
  // Nothing is injected when no measurement ID is configured, so local dev and
  // preview deployments stay clean instead of polluting production data.
  if (!isAnalyticsConfigured) return null;

  return (
    <>
      {hasGa4 && (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          {/* `linker` carries the client ID across the marketing site and the
              product app, so a visitor who signs up is not counted as a brand
              new user with no campaign history the moment the domain changes. */}
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                linker: { domains: ['cargogrid.net','www.cargogrid.net','cargogrid.app','www.cargogrid.app'] }
              });
            `}
          </Script>
        </>
      )}

      {hasGtm && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      {/* useSearchParams opts the subtree into client rendering; the Suspense
          boundary keeps that from deopting the whole route to dynamic. */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <EngagementTracking />
    </>
  );
}
