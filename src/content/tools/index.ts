import type { Tool, ToolKind } from "./types";
import { articles, articleSlugs } from "../articles";
import { TOOL_NAV_LINKS } from "./navLinks";
import { tool as kalkulatorCbm } from "./kalkulator-cbm";
import { tool as kalkulatorMuatanTruk } from "./kalkulator-muatan-truk";
import { tool as kalkulatorDemurrage } from "./kalkulator-demurrage";
import { tool as ukuranKontainer } from "./ukuran-kontainer";
import { tool as jenisTrukIndonesia } from "./jenis-truk-indonesia";
import { tool as incoterms2020 } from "./incoterms-2020";
import { tool as kamusLogistik } from "./kamus-logistik";
import { tool as biayaOperasionalTruk } from "./biaya-operasional-truk";
import { tool as golonganTolPenyeberangan } from "./golongan-tol-penyeberangan";

/**
 * Registry of the free tools and reference pages.
 *
 * Ordered by how often the underlying question gets asked on a working day,
 * which is also roughly the order of search volume, the hub page reads top to
 * bottom as "what did you come here to find out".
 */
const registry: Tool[] = [
  kalkulatorMuatanTruk,
  biayaOperasionalTruk,
  kalkulatorCbm,
  kalkulatorDemurrage,
  jenisTrukIndonesia,
  golonganTolPenyeberangan,
  ukuranKontainer,
  incoterms2020,
  kamusLogistik,
];

export const tools: Tool[] = registry;

export const toolSlugs: string[] = registry.map((t) => t.slug);

const bySlug = new Map(registry.map((t) => [t.slug, t]));

export function getTool(slug: string): Tool | undefined {
  return bySlug.get(slug);
}

export function toolsByKind(kind: ToolKind): Tool[] {
  return registry.filter((t) => t.kind === kind);
}

/** Resolves `relatedTools` slugs, dropping anything unresolvable. */
export function relatedTools(tool: Tool, limit = 3): Tool[] {
  const picked: Tool[] = [];

  for (const slug of tool.relatedTools) {
    const found = bySlug.get(slug);
    if (found && found.slug !== tool.slug) picked.push(found);
    if (picked.length >= limit) return picked;
  }

  for (const candidate of registry) {
    if (picked.length >= limit) break;
    if (candidate.slug === tool.slug) continue;
    if (picked.some((p) => p.slug === candidate.slug)) continue;
    picked.push(candidate);
  }

  return picked;
}

/**
 * Same build-time contract the article registry enforces, extended across the
 * boundary between the two: a tool may point at an article, so a renamed
 * article has to fail here rather than silently render a dead cross-link.
 *
 * That cross-registry check is the whole reason this validation earns its keep.
 * The tools exist to catch non-branded search traffic and hand it onward to the
 * essays; if those handoffs rot, the pages still look fine and the funnel they
 * were built for quietly stops working.
 */
function assertRegistryIntegrity(): void {
  const seen = new Set<string>();
  const knownArticles = new Set(articleSlugs);

  for (const tool of registry) {
    if (seen.has(tool.slug)) throw new Error(`Duplicate tool slug: ${tool.slug}`);
    seen.add(tool.slug);

    const headingIds = new Set<string>();
    for (const block of tool.blocks) {
      if (block.type !== "h2") continue;
      if (headingIds.has(block.id)) {
        throw new Error(`Duplicate heading id "${block.id}" in tool ${tool.slug}`);
      }
      headingIds.add(block.id);
    }

    for (const slug of tool.relatedArticles) {
      if (!knownArticles.has(slug)) {
        throw new Error(`Tool ${tool.slug} links to unknown article slug: ${slug}`);
      }
    }
  }

  for (const tool of registry) {
    for (const slug of tool.relatedTools) {
      if (!seen.has(slug)) {
        throw new Error(`Tool ${tool.slug} links to unknown related tool: ${slug}`);
      }
    }
  }

  // The footer's link list is maintained separately so the client bundle stays
  // free of prose (see navLinks.ts). Separate lists drift, so the drift is made
  // into a build error in both directions.
  const navBySlug = new Map(TOOL_NAV_LINKS.map((link) => [link.slug, link]));
  for (const tool of registry) {
    const link = navBySlug.get(tool.slug);
    if (!link) {
      throw new Error(`Tool ${tool.slug} has no footer nav label in navLinks.ts`);
    }
    // The footer groups by the copy of `kind` held here. A tool filed as a
    // calculator on the hub and as a reference in the footer is worse than an
    // ungrouped list, because each page insists the other is wrong.
    if (link.kind !== tool.kind) {
      throw new Error(`Tool ${tool.slug} is a ${tool.kind} in the registry but a ${link.kind} in navLinks.ts`);
    }
  }
  for (const link of TOOL_NAV_LINKS) {
    if (!seen.has(link.slug)) {
      throw new Error(`navLinks.ts lists an unknown tool slug: ${link.slug}`);
    }
  }

  // Articles point back at tools by bare slug, because a real import there
  // would close the cycle this registry already opens by importing articles.
  // Validating from this side is what keeps those strings honest.
  for (const article of articles) {
    for (const slug of article.relatedTools || []) {
      if (!seen.has(slug)) {
        throw new Error(`Article ${article.slug} links to unknown tool: ${slug}`);
      }
    }
  }
}

assertRegistryIntegrity();

export * from "./types";
