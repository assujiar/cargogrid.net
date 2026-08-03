import type { MetadataRoute } from "next";
import { siteUrl } from "../src/lib/seo";

/**
 * Replaces the former public/robots.txt.
 *
 * The rules are unchanged in effect; what moves is where the domain comes
 * from. The static file hardcoded the sitemap URL, so it could silently
 * disagree with `siteUrl` — the value every canonical tag, Open Graph URL and
 * sitemap entry is built from. Deriving it here makes that disagreement
 * impossible.
 *
 * Dropped along the way: `Disallow: /super-admin/`. No such route exists — the
 * admin portal is a hash view on `/` (see HomeRouter), and a URL fragment is
 * never sent to the server, so robots.txt cannot address it either way. The
 * portal is protected by Supabase Auth and the admin_users allowlist. Listing a
 * path here would only advertise it; robots.txt is a public file, and it has
 * never been an access control.
 */

// Every one of these already falls under the `*` group below, which allows the
// whole site — so naming them changes no crawler's behaviour. They are kept
// deliberately, as a readable, auditable statement that CargoGrid welcomes AI
// search and answer engines.
//
// Worth knowing about two of them: Google-Extended and Applebot-Extended are
// opt-out tokens for AI training and grounding only. Neither has any effect on
// Google Search or Siri ranking, so allowing them is a content-licensing
// decision, not an SEO one.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "Google-Extended",
  "ClaudeBot",
  "PerplexityBot",
  "Applebot-Extended",
  "Cohere-crawler",
  "DeepSeekBot",
  "MoonshotBot",
  "xai-crawler",
  "Meta-ExternalAgent",
  "Bytespider",
  "YouBot",
  "PetalBot",
  "Amazonbot",
  "CCBot",
  "Baiduspider",
  "Baiduspider-render",
  "Sogou web spider",
  "Sogou instant spider",
  "YandexBot",
  "YandexAdditional",
  "NVIDIA-Bots",
  "iaskspider",
  "iAskBot",
  "Omgilibot",
  "diffbot",
];

// Server routes only. Nothing here is a page, and /api/inquiry answers a
// configuration diagnostic that has no business in a search index.
const DISALLOW = ["/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
