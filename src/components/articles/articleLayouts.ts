import type { ArticleLayout } from "../../content/articles/types";

/**
 * Presentation rules per editorial treatment.
 *
 * Kept as data rather than branching inside the view so the differences between
 * the five treatments are visible in one place and easy to keep genuinely
 * distinct. Every field below changes something a reader can see.
 */
export interface LayoutSpec {
  /** Reading column. Narrower for essays, wider where tables carry the argument. */
  column: string;
  /** Hero arrangement above the headline. */
  hero: "banner" | "rule" | "panel" | "split" | "none";
  /** Headline size. */
  title: string;
  /** Standfirst treatment. */
  summary: string;
  /** Where the key points panel goes, or whether it appears at all. */
  takeaways: "panel" | "inline-list" | "sidebar-strip";
  /** Table of contents treatment. */
  toc: "boxed" | "rail" | "inline" | "none";
  /** Accent used for rules and markers. */
  accent: "teal" | "orange" | "slate";
  /** Whether the opening paragraph gets a drop cap. */
  dropCap: boolean;
  /** Label shown above the headline. */
  kicker: string;
}

export const LAYOUTS: Record<ArticleLayout, LayoutSpec> = {
  // Magazine treatment: full-bleed cover art, big headline, drop cap.
  feature: {
    column: "max-w-3xl",
    hero: "banner",
    title: "text-3xl sm:text-[2.9rem] leading-[1.08]",
    summary: "text-lg sm:text-xl leading-[1.7] text-slate-700",
    takeaways: "panel",
    toc: "boxed",
    accent: "teal",
    dropCap: true,
    kicker: "Laporan",
  },

  // Argument-led piece: narrow measure, no chrome competing with the prose.
  essay: {
    column: "max-w-2xl",
    hero: "rule",
    title: "text-[1.8rem] sm:text-[2.3rem] leading-[1.15]",
    summary: "text-base sm:text-lg leading-[1.85] text-slate-600 italic",
    takeaways: "inline-list",
    toc: "none",
    accent: "slate",
    dropCap: true,
    kicker: "Esai",
  },

  // Short and operational: points first, minimum ceremony.
  brief: {
    column: "max-w-2xl",
    hero: "none",
    title: "text-2xl sm:text-[2.1rem] leading-[1.15]",
    summary: "text-[15px] sm:text-base leading-[1.8] text-slate-600",
    takeaways: "sidebar-strip",
    toc: "inline",
    accent: "orange",
    dropCap: false,
    kicker: "Ringkas",
  },

  // Evidence-heavy: wide column for tables, numbered navigation rail.
  dossier: {
    column: "max-w-4xl",
    hero: "split",
    title: "text-2xl sm:text-[2.2rem] leading-[1.15]",
    summary: "text-[15px] sm:text-base leading-[1.8] text-slate-600",
    takeaways: "panel",
    toc: "rail",
    accent: "teal",
    dropCap: false,
    kicker: "Berkas",
  },

  // Teaching piece: framed opening panel, contents up front.
  primer: {
    column: "max-w-3xl",
    hero: "panel",
    title: "text-2xl sm:text-[2.25rem] leading-[1.15]",
    summary: "text-base leading-[1.8] text-slate-600",
    takeaways: "inline-list",
    toc: "boxed",
    accent: "orange",
    dropCap: false,
    kicker: "Panduan",
  },
};

export const ACCENT_TEXT: Record<LayoutSpec["accent"], string> = {
  teal: "text-brand-teal",
  orange: "text-brand-orange",
  slate: "text-slate-500",
};

export const ACCENT_BG: Record<LayoutSpec["accent"], string> = {
  teal: "bg-brand-teal",
  orange: "bg-brand-orange",
  slate: "bg-slate-400",
};
