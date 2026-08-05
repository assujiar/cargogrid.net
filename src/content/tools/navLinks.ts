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
 * Short enough to clear a phone column, specifically. The footer runs two
 * categories side by side, which leaves about 134px of text on a 360px screen,
 * and a label that wraps there pushes every row below it out of step with the
 * column beside it. So each one is kept under that: the group heading already
 * says "Kalkulator", and repeating it in every row spent the width that made
 * the list line up. `e2e/tools.browser.mjs` fails if a label grows past a
 * single line.
 *
 * `assertNavLinksCover` in the registry keeps the two in step: adding a tool
 * without a label here fails the build rather than silently dropping it out of
 * the site-wide link graph.
 */
export interface ToolNavLink {
  slug: string;
  label: string;
  labelEn: string;
  /** Mirrors `tool.kind` in the registry; the build fails if the two disagree. */
  kind: "kalkulator" | "referensi";
}

export const TOOL_NAV_LINKS: ToolNavLink[] = [
  { slug: "kalkulator-muatan-truk", label: "Muatan Truk", labelEn: "Truck Load", kind: "kalkulator" },
  { slug: "biaya-operasional-truk", label: "Biaya Operasional", labelEn: "Cost per KM", kind: "kalkulator" },
  { slug: "kalkulator-cbm", label: "CBM & Volumetrik", labelEn: "CBM & Volumetric", kind: "kalkulator" },
  { slug: "kalkulator-demurrage", label: "Demurrage", labelEn: "Demurrage", kind: "kalkulator" },
  { slug: "ukuran-kontainer", label: "Ukuran Kontainer", labelEn: "Container Sizes", kind: "referensi" },
  { slug: "jenis-truk-indonesia", label: "Truk Indonesia", labelEn: "Truck Types", kind: "referensi" },
  { slug: "golongan-tol-penyeberangan", label: "Golongan Tol", labelEn: "Toll & Ferry", kind: "referensi" },
  { slug: "incoterms-2020", label: "Incoterms 2020", labelEn: "Incoterms 2020", kind: "referensi" },
  { slug: "kamus-logistik", label: "Kamus Istilah", labelEn: "Glossary", kind: "referensi" },
];

export function navLinksByKind(kind: ToolNavLink["kind"]): ToolNavLink[] {
  return TOOL_NAV_LINKS.filter((link) => link.kind === kind);
}
