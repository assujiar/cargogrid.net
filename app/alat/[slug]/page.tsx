import React from "react";
import { notFound } from "next/navigation";
import SiteShell from "../../../src/components/chrome/SiteShell";
import ToolShell from "../../../src/components/tools/ToolShell";
import ToolGate from "../../../src/components/tools/ToolGate";
import CbmCalculator from "../../../src/components/tools/CbmCalculator";
import TruckLoadCalculator from "../../../src/components/tools/TruckLoadCalculator";
import FreeTimeCalculator from "../../../src/components/tools/FreeTimeCalculator";
import FleetCostCalculator from "../../../src/components/tools/FleetCostCalculator";
import GlossaryBrowser from "../../../src/components/tools/GlossaryBrowser";
import FleetExplorer from "../../../src/components/tools/FleetExplorer";
import { ContainerTable, IncotermsTable, RegulationsView } from "../../../src/components/tools/ReferenceViews";
import { tools, getTool } from "../../../src/content/tools";
import { buildMetadata, nestedBreadcrumbJsonLd, toolJsonLd } from "../../../src/lib/seo";

/**
 * Every tool is known at build time, so the whole set is prerendered and an
 * unknown slug is a 404 rather than an attempted on-demand render.
 */
export const dynamicParams = false;

/**
 * Slug to instrument.
 *
 * A plain object rather than a field on the Tool model, because a content
 * module that imported React components would drag the client bundle into the
 * sitemap, the hub page, and anything else that only wants the metadata. The
 * cost of keeping them apart is this map; the check below turns a missing entry
 * into a build failure instead of a blank page.
 */
const INSTRUMENTS: Record<string, React.ComponentType> = {
  "kalkulator-cbm": CbmCalculator,
  "kalkulator-muatan-truk": TruckLoadCalculator,
  "kalkulator-demurrage": FreeTimeCalculator,
  "biaya-operasional-truk": FleetCostCalculator,
  "ukuran-kontainer": ContainerTable,
  "jenis-truk-indonesia": FleetExplorer,
  "golongan-tol-penyeberangan": RegulationsView,
  "incoterms-2020": IncotermsTable,
  "kamus-logistik": GlossaryBrowser,
};

for (const tool of tools) {
  if (!INSTRUMENTS[tool.slug]) {
    throw new Error(`Tool "${tool.slug}" is in the registry but has no instrument component mapped.`);
  }
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return buildMetadata({
    path: `/alat/${tool.slug}`,
    title: tool.metaTitle,
    description: tool.description,
    keywords: tool.keywords,
  });
}

export default async function AlatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Instrument = INSTRUMENTS[tool.slug];

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd(tool)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            nestedBreadcrumbJsonLd(
              { path: "/alat", label: "Alat & Referensi" },
              { path: `/alat/${tool.slug}`, label: tool.title },
            ),
          ),
        }}
      />
      <ToolShell tool={tool}>
        {/* Calculators sit behind the contact gate; reference tables do not.
            The tables are the whole reason those pages rank, and putting a
            lookup table behind a form would be trading the traffic for the
            lead and getting neither. */}
        {tool.kind === "kalkulator" ? (
          <ToolGate toolSlug={tool.slug} toolTitle={tool.title} toolTitleEn={tool.titleEn}>
            <Instrument />
          </ToolGate>
        ) : (
          <Instrument />
        )}
      </ToolShell>
    </SiteShell>
  );
}
