import type { ArticleCategory } from "../../content/articles/types";
import { SCENES } from "./coverArtScenes";

/**
 * Article cover art.
 *
 * Drawn rather than photographed on purpose. Each article gets one scene built
 * around what the piece actually argues — cartons piling up in a warehouse
 * corner for the returns article, a truck pinned to a weighbridge for the ODOL
 * one — rather than an abstract chart shape shared across a whole category.
 * See coverArtScenes.tsx for the scenes themselves.
 *
 * The background gradient still comes from the category and stays generic on
 * purpose: it's a wash behind the illustration, not part of the picture.
 */

const GRADIENTS: Record<ArticleCategory, [string, string]> = {
  operasional: ["#e3edf4", "#cfe4ea"],
  keuangan: ["#e7eff2", "#d3e7e1"],
  komersial: ["#edeaf4", "#dae4f0"],
  gudang: ["#eef1f4", "#dce7ed"],
  sistem: ["#e9eff3", "#d6e2ef"],
};

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function ArticleCoverArt({
  category,
  seed,
  height = 150,
}: {
  category: ArticleCategory;
  seed: string;
  height?: number;
}) {
  const [from, to] = GRADIENTS[category];
  const gid = `cg-${hash(seed).toString(36)}`;
  const Scene = SCENES[seed];

  return (
    <svg
      viewBox="0 0 400 150"
      role="presentation"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        {/* Shared object-shading gradients. Fixed ids are safe to repeat across
            the many ArticleCoverArt instances on one page (index, related-reads)
            because every instance defines identical stops. */}
        <linearGradient id="cg-teal-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3dbdd4" />
          <stop offset="100%" stopColor="#006d80" />
        </linearGradient>
        <linearGradient id="cg-orange-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2604a" />
          <stop offset="100%" stopColor="#a52313" />
        </linearGradient>
        <linearGradient id="cg-slate-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64768a" />
          <stop offset="100%" stopColor="#2f3b48" />
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill={`url(#${gid})`} />
      {Scene && <Scene />}
    </svg>
  );
}
