import type { MetadataRoute } from "next";
import { siteUrl } from "../src/lib/seo";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/tantangan", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solusi", priority: 0.8, changeFrequency: "monthly" },
  { path: "/simulator-roi", priority: 0.7, changeFrequency: "monthly" },
  { path: "/paket", priority: 0.9, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kontak", priority: 0.9, changeFrequency: "monthly" },
  { path: "/kebijakan-privasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/syarat-ketentuan", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
