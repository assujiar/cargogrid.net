/**
 * Short labels for the tool links in the footer.
 *
 * Deliberately a separate, dependency-free module rather than a read of the
 * registry. The footer is a client component, so importing `tools` there would
 * ship every tool's prose blocks and FAQ answers, tens of kilobytes of
 * Indonesian text, to every visitor on every page, in order to render seven
 * anchor tags. This file carries only what the anchors need.
 *
 * The labels are also shorter than the H1s on purpose. "Kalkulator CBM, Berat
 * Volumetrik, dan Chargeable Weight" is the right title for a page and the
 * wrong length for a footer row.
 *
 * `assertNavLinksCover` in the registry keeps the two in step: adding a tool
 * without a label here fails the build rather than silently dropping it out of
 * the site-wide link graph.
 */
export interface ToolNavLink {
  slug: string;
  label: string;
  labelEn: string;
}

export const TOOL_NAV_LINKS: ToolNavLink[] = [
  { slug: "kalkulator-muatan-truk", label: "Kalkulator Muatan Truk", labelEn: "Truck Load Calculator" },
  { slug: "biaya-operasional-truk", label: "Biaya Operasional Truk", labelEn: "Truck Cost per KM" },
  { slug: "kalkulator-cbm", label: "Kalkulator CBM", labelEn: "CBM Calculator" },
  { slug: "kalkulator-demurrage", label: "Kalkulator Demurrage", labelEn: "Demurrage Calculator" },
  { slug: "ukuran-kontainer", label: "Ukuran Kontainer", labelEn: "Container Sizes" },
  { slug: "jenis-truk-indonesia", label: "Jenis Truk Indonesia", labelEn: "Indonesian Truck Types" },
  { slug: "golongan-tol-penyeberangan", label: "Golongan Tol & Penyeberangan", labelEn: "Toll & Ferry Classes" },
  { slug: "incoterms-2020", label: "Incoterms 2020", labelEn: "Incoterms 2020" },
  { slug: "kamus-logistik", label: "Kamus Istilah Logistik", labelEn: "Logistics Glossary" },
];
