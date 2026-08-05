import type { MetadataRoute } from "next";
import { siteUrl } from "../src/lib/seo";
import { articles } from "../src/content/articles";
import { tools } from "../src/content/tools";

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
  { path: "/artikel", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-08-03" }, // bump when a new article lands
  { path: "/alat", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-05" }, // bump when a new tool lands
  { path: "/kebijakan-privasi", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-07-09" },
  { path: "/syarat-ketentuan", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-07-09" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Articles carry their own dates, so unlike the pages above they need no
  // hand-maintained table -- editing a piece and bumping its `updatedAt` is one
  // action, and the sitemap follows.
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/artikel/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Tools carry their own dates for the same reason articles do. Priority sits
  // above the articles': these are the pages built to be the first contact with
  // people who have never heard of CargoGrid and are not searching for it, so
  // they are the ones whose freshness is worth signalling.
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/alat/${tool.slug}`,
    lastModified: new Date(tool.updatedAt || tool.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...toolRoutes];
}
