import type { ArticleCategory } from "../../content/articles/types";

/**
 * Generated cover art.
 *
 * Drawn rather than photographed on purpose. These pieces argue from diagrams
 * (queues, timelines, distributions), and a stock photo of a warehouse would
 * say nothing about which one you are opening. Each category gets its own
 * motif, and the slug seeds small variations so two articles in the same
 * category never render the same picture.
 *
 * Deterministic by construction: the seed is hashed from the slug, never from
 * Math.random, so the server and the browser draw exactly the same thing.
 */

const TEAL = "#0097b2";
const ORANGE = "#cb3421";
const INK = "#1e293b";

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic pseudo-random in [0,1) for the nth draw from a seed. */
function rand(seed: number, n: number): number {
  const x = Math.sin(seed * 9301 + n * 49297) * 233280;
  return x - Math.floor(x);
}

const GRADIENTS: Record<ArticleCategory, [string, string]> = {
  operasional: ["#e2ecf3", "#cfe3ea"],
  keuangan: ["#e6eef2", "#d5e6e2"],
  komersial: ["#eceaf3", "#dbe4ef"],
  gudang: ["#eef0f3", "#dde6ec"],
  sistem: ["#e8eef2", "#d7e2ee"],
};

export default function ArticleCoverArt({
  category,
  seed,
  height = 150,
}: {
  category: ArticleCategory;
  seed: string;
  height?: number;
}) {
  const s = hash(seed);
  const [from, to] = GRADIENTS[category];
  const gid = `cg-${s.toString(36)}`;

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
      </defs>
      <rect width="400" height="150" fill={`url(#${gid})`} />
      {motif(category, s)}
    </svg>
  );
}

function motif(category: ArticleCategory, s: number) {
  switch (category) {
    // A multi-leg route: the shape every operations article is really about.
    case "operasional": {
      const pts = Array.from({ length: 5 }, (_, i) => ({
        x: 40 + i * 80,
        y: 40 + rand(s, i) * 70,
      }));
      const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
      return (
        <g>
          <path d={d} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === pts.length - 1 ? 8 : 5}
              fill={i === pts.length - 1 ? ORANGE : TEAL}
              opacity={i === pts.length - 1 ? 0.9 : 0.65}
            />
          ))}
        </g>
      );
    }

    // Columns with one short bar: margin distributions and cash timelines.
    case "keuangan": {
      const bars = Array.from({ length: 9 }, (_, i) => 20 + rand(s, i) * 80);
      const weak = Math.floor(rand(s, 99) * 9);
      return (
        <g>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={32 + i * 38}
              y={125 - h}
              width="18"
              height={h}
              rx="5"
              fill={i === weak ? ORANGE : TEAL}
              opacity={i === weak ? 0.85 : 0.4}
            />
          ))}
          <line x1="20" y1="127" x2="380" y2="127" stroke={INK} strokeWidth="1.5" opacity="0.18" />
        </g>
      );
    }

    // Overlapping request cards: RFQ, vendors, customer conversations.
    case "komersial": {
      return (
        <g>
          {Array.from({ length: 4 }, (_, i) => (
            <rect
              key={i}
              x={44 + i * 74}
              y={30 + rand(s, i) * 28}
              width="92"
              height="66"
              rx="12"
              fill={i === 0 ? TEAL : "#ffffff"}
              opacity={i === 0 ? 0.35 : 0.55}
              stroke={TEAL}
              strokeWidth="1.5"
              strokeOpacity="0.35"
            />
          ))}
          <circle cx="330" cy="112" r="9" fill={ORANGE} opacity="0.8" />
        </g>
      );
    }

    // A bin grid with a few occupied cells: the whole point of a location ledger.
    case "gudang": {
      const cells: { x: number; y: number; on: boolean }[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 9; c++) {
          cells.push({ x: 30 + c * 38, y: 30 + r * 34, on: rand(s, r * 9 + c) > 0.62 });
        }
      }
      return (
        <g>
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={cell.x}
              y={cell.y}
              width="30"
              height="26"
              rx="5"
              fill={cell.on ? TEAL : "#ffffff"}
              opacity={cell.on ? 0.5 : 0.4}
              stroke={TEAL}
              strokeWidth="1"
              strokeOpacity="0.25"
            />
          ))}
        </g>
      );
    }

    // Hub and spokes: integration, sources of truth, systems talking.
    case "sistem":
    default: {
      const spokes = Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 + rand(s, i) * 0.5;
        return { x: 200 + Math.cos(a) * (78 + rand(s, i + 20) * 34), y: 75 + Math.sin(a) * (44 + rand(s, i + 40) * 18) };
      });
      return (
        <g>
          {spokes.map((p, i) => (
            <line key={i} x1="200" y1="75" x2={p.x} y2={p.y} stroke={TEAL} strokeWidth="1.5" opacity="0.35" />
          ))}
          {spokes.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6" fill={i % 3 === 0 ? ORANGE : TEAL} opacity="0.6" />
          ))}
          <circle cx="200" cy="75" r="15" fill={TEAL} opacity="0.75" />
        </g>
      );
    }
  }
}
