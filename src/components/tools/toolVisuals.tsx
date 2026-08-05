import React from "react";
import { BookOpen, Box, CalendarClock, Container, Handshake, Layers, Route, Truck, Wallet } from "lucide-react";

/**
 * A distinct mark for each tool.
 *
 * Nine cards of identical grey text are a directory, not a set of tools: the
 * eye has nothing to sort them by, so finding the right one means reading all
 * nine titles. An icon gives each page a shape you can recognise before you
 * read it, which is the difference between scanning and reading.
 *
 * The accompanying pattern is inline SVG rather than an image. These marks sit
 * on nine cards and again on every tool header, and nine image requests to
 * decorate a page that exists to load fast is a bad trade. Drawn from the
 * brand's own two colours so the set reads as one system.
 */

export type PatternKind = "grid" | "rings" | "bars" | "diagonal";

export interface ToolVisual {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** Which of the two brand colours carries this tool. */
  accent: "teal" | "orange";
  pattern: PatternKind;
}

const VISUALS: Record<string, ToolVisual> = {
  "kalkulator-muatan-truk": { Icon: Truck, accent: "teal", pattern: "grid" },
  "biaya-operasional-truk": { Icon: Wallet, accent: "orange", pattern: "bars" },
  "kalkulator-cbm": { Icon: Box, accent: "teal", pattern: "diagonal" },
  "kalkulator-demurrage": { Icon: CalendarClock, accent: "orange", pattern: "rings" },
  "jenis-truk-indonesia": { Icon: Layers, accent: "teal", pattern: "bars" },
  "golongan-tol-penyeberangan": { Icon: Route, accent: "orange", pattern: "diagonal" },
  "ukuran-kontainer": { Icon: Container, accent: "teal", pattern: "grid" },
  "incoterms-2020": { Icon: Handshake, accent: "orange", pattern: "rings" },
  "kamus-logistik": { Icon: BookOpen, accent: "teal", pattern: "diagonal" },
};

const FALLBACK: ToolVisual = { Icon: Box, accent: "teal", pattern: "grid" };

export function toolVisual(slug: string): ToolVisual {
  return VISUALS[slug] || FALLBACK;
}

export const ACCENT_CLASSES = {
  teal: {
    text: "text-brand-teal",
    ring: "nm-emboss bg-white/70 ring-1 ring-brand-teal/30",
    stroke: "stroke-brand-teal",
    hoverText: "group-hover:text-brand-teal",
    bar: "bg-brand-teal",
    softText: "text-brand-teal",
  },
  orange: {
    text: "text-brand-orange",
    ring: "nm-emboss bg-white/70 ring-1 ring-brand-orange/30",
    stroke: "stroke-brand-orange",
    hoverText: "group-hover:text-brand-orange",
    bar: "bg-brand-orange",
    softText: "text-brand-orange",
  },
} as const;

/**
 * Decorative background for a card or page header.
 *
 * `aria-hidden` and `pointer-events-none` throughout: this carries no meaning
 * and must never intercept a tap or reach a screen reader. Kept very low
 * contrast on purpose, the job is to stop a card looking like a blank
 * rectangle, not to compete with the text sitting on top of it.
 */
export function ToolPattern({
  kind,
  accent,
  className = "",
}: {
  kind: PatternKind;
  accent: "teal" | "orange";
  className?: string;
}) {
  const stroke = accent === "teal" ? "#006d80" : "#cb3421";

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 200 120"
      fill="none"
    >
      {kind === "grid" && (
        <g stroke={stroke} strokeWidth="0.6" opacity="0.16">
          {[20, 50, 80, 110, 140, 170].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="120" />
          ))}
          {[24, 54, 84, 114].map((y) => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} />
          ))}
        </g>
      )}

      {kind === "rings" && (
        <g stroke={stroke} strokeWidth="0.8" opacity="0.18">
          {[18, 34, 50, 66, 82].map((r) => (
            <circle key={r} cx="176" cy="18" r={r} />
          ))}
        </g>
      )}

      {kind === "bars" && (
        <g fill={stroke} opacity="0.14">
          {[
            [150, 74, 8, 46],
            [162, 58, 8, 62],
            [174, 40, 8, 80],
            [186, 66, 8, 54],
          ].map(([x, y, w, h]) => (
            <rect key={x} x={x} y={y} width={w} height={h} rx="2" />
          ))}
        </g>
      )}

      {kind === "diagonal" && (
        <g stroke={stroke} strokeWidth="1.1" opacity="0.13">
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180].map((offset) => (
            <line key={offset} x1={offset} y1="120" x2={offset + 70} y2="0" />
          ))}
        </g>
      )}
    </svg>
  );
}

/** The icon in its neumorphic badge, used on cards and page headers alike. */
export function ToolBadge({
  slug,
  size = "md",
}: {
  slug: string;
  size?: "sm" | "md" | "lg";
}) {
  const { Icon, accent } = toolVisual(slug);
  const box = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const glyph = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-2xl ${box} ${ACCENT_CLASSES[accent].ring}`}
    >
      <Icon className={`${glyph} ${ACCENT_CLASSES[accent].text}`} aria-hidden="true" />
    </span>
  );
}
