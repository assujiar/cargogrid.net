import type { MetadataRoute } from "next";
import { siteUrl } from "../src/lib/seo";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

interface RouteEntry {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /**
   * When this page's visible content last changed — NOT when the site was last
   * deployed. Bump it by hand when you edit the copy, and leave it alone for
   * refactors, dependency bumps and styling passes.
   *
   * This used to be `new Date()`, evaluated at build. Every deploy therefore
   * told Google that all nine pages had just changed, including the two legal
   * pages nobody had touched in months. A crawler that repeatedly finds
   * unchanged content behind a fresh lastmod learns to disregard the signal
   * entirely — so the field became worthless precisely when it would have
   * mattered, on the one page that really did change.
   *
   * Seeded from the git history of each page's actual content source
   * (src/data.ts, the legal bodies, pricing.ts) rather than of the route file,
   * since a route file also changes for reasons a reader never sees.
   */
  lastModified: string;
}

const routes: RouteEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-07-10" },
  { path: "/tantangan", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-09" },
  { path: "/solusi", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-09" },
  { path: "/simulator-roi", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/paket", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-07-10" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-09" },
  { path: "/kontak", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-07-09" },
  { path: "/kebijakan-privasi", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-07-09" },
  { path: "/syarat-ketentuan", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-07-09" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
