import type { Metadata } from "next";
import { faqList } from "../data";
import { tools } from "../content/tools";
import { GLOSSARY, glossaryAnchor } from "../content/reference/glossary";
import { companyAddress, companyAddressLine, companyPhone, companyEmail } from "./companyInfo";

// The apex domain (cargogrid.net) 308-redirects to www in production, so
// canonical/OG/JSON-LD URLs point directly at the domain that actually
// serves content — avoids an unnecessary redirect hop for crawlers and
// social unfurlers that don't follow redirects before reading meta tags.
export const siteUrl = "https://www.cargogrid.net";
export const siteName = "CargoGrid OS";

// Company contact details live in a dependency-free module so client components
// can import them without pulling `src/data.ts` into the browser bundle. The
// JSON-LD builders below consume them; re-exporting keeps existing `lib/seo`
// importers working unchanged.
export { companyAddress, companyAddressLine, companyPhone, companyEmail };

interface BuildMetadataInput {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}

// Served by app/opengraph-image.tsx. Referenced explicitly rather than left to
// Next's file convention: every page below sets its own `openGraph` object,
// which replaces the parent segment's — so the auto-injected image silently
// disappeared from all of them, leaving summary_large_image cards with no image.
export const ogImage = {
  url: `${siteUrl}/opengraph-image`,
  width: 1200,
  height: 630,
  type: "image/png",
};

export function buildMetadata({ path, title, description, keywords }: BuildMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName,
      locale: "id_ID",
      images: [{ ...ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "CargoGrid OS Indonesia",
    url: siteUrl,
    logo: `${siteUrl}/cargogrid_vertical.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: companyPhone,
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
      email: companyEmail,
    },
    address: {
      "@type": "PostalAddress",
      ...companyAddress,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android, PWA",
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: "0",
    },
    description:
      "CargoGrid OS adalah sistem operasi logistik terintegrasi dan software ERP end-to-end untuk Freight Forwarder, 3PL Warehouse, armada Trucking, dan Corporate Shipper.",
    browserRequirements: "Requires HTML5 compatible browser",
  };
}

export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), softwareApplicationJsonLd()],
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/faq/#faq`,
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface ArticleJsonLdInput {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  keywords: string[];
  faq?: { q: string; a: string }[];
}

/**
 * Article + FAQPage schema for a single post.
 *
 * Emitted as one @graph rather than two separate script tags so the FAQ can
 * reference the article it belongs to via isPartOf, instead of floating as an
 * unattached FAQ block on the same URL.
 */
export function articleJsonLd(input: ArticleJsonLdInput) {
  const url = `${siteUrl}/artikel/${input.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}/#article`,
      headline: input.title,
      description: input.description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: input.publishedAt,
      dateModified: input.updatedAt || input.publishedAt,
      inLanguage: "id-ID",
      keywords: input.keywords.join(", "),
      image: `${siteUrl}/opengraph-image`,
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    organizationJsonLd(),
  ];

  if (input.faq && input.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      isPartOf: { "@id": `${url}/#article` },
      mainEntity: input.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * Schema for a tool or reference page.
 *
 * The primary node's type is chosen by what the page actually is, which is not
 * pedantry: a calculator that describes itself as an Article and a glossary
 * that describes itself as a WebApplication are both making a claim a search
 * engine can check against the page and find false.
 *
 * - Calculators are `WebApplication`. They are software the visitor runs.
 * - The glossary is a `DefinedTermSet` carrying every entry as a `DefinedTerm`,
 *   which is the one schema type built for exactly this and lets an individual
 *   term be surfaced with its own anchor.
 * - Other reference pages are `Article`, the same as anything else that is
 *   mostly prose and a table.
 */
export function toolJsonLd(tool: {
  slug: string;
  kind: "kalkulator" | "referensi";
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  faq: { q: string; a: string }[];
}) {
  const url = `${siteUrl}/alat/${tool.slug}`;
  const graph: Record<string, unknown>[] = [];

  if (tool.kind === "kalkulator") {
    graph.push({
      "@type": "WebApplication",
      "@id": `${url}/#tool`,
      name: tool.title,
      description: tool.description,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires HTML5 compatible browser",
      inLanguage: "id-ID",
      isAccessibleForFree: true,
      // Stated explicitly because "free tool" is a claim people have learned to
      // distrust — most are free until the result appears behind an email gate.
      offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  } else if (tool.slug === "kamus-logistik") {
    graph.push({
      "@type": "DefinedTermSet",
      "@id": `${url}/#termset`,
      name: tool.title,
      description: tool.description,
      url,
      inLanguage: "id-ID",
      publisher: { "@id": `${siteUrl}/#organization` },
      hasDefinedTerm: GLOSSARY.map((entry) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#${glossaryAnchor(entry)}`,
        name: entry.expansion ? `${entry.term} (${entry.expansion})` : entry.term,
        description: entry.definition,
        inDefinedTermSet: { "@id": `${url}/#termset` },
        url: `${url}#${glossaryAnchor(entry)}`,
      })),
    });
  } else {
    graph.push({
      "@type": "Article",
      "@id": `${url}/#article`,
      headline: tool.title,
      description: tool.description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: tool.publishedAt,
      dateModified: tool.updatedAt || tool.publishedAt,
      inLanguage: "id-ID",
      keywords: tool.keywords.join(", "),
      image: `${siteUrl}/opengraph-image`,
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }

  if (tool.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: tool.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  graph.push(organizationJsonLd());

  return { "@context": "https://schema.org", "@graph": graph };
}

/** ItemList for the /alat hub, so the set is understood as a collection. */
export function toolCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/alat/#tools`,
    name: "Alat & Referensi Logistik CargoGrid",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `${siteUrl}/alat/${tool.slug}`,
    })),
  };
}

/** Breadcrumb for a page nested one level below a section, e.g. /artikel/<slug>. */
export function nestedBreadcrumbJsonLd(
  section: { path: string; label: string },
  page: { path: string; label: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: section.label, item: `${siteUrl}${section.path}` },
      { "@type": "ListItem", position: 3, name: page.label, item: `${siteUrl}${page.path}` },
    ],
  };
}

export function breadcrumbJsonLd(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `${siteUrl}${path}`,
      },
    ],
  };
}
