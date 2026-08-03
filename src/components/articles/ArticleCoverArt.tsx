import type { ArticleCategory } from "../../content/articles/types";

/**
 * Generated cover art.
 *
 * Drawn rather than photographed on purpose. These pieces argue from diagrams
 * (queues, timelines, distributions), and a stock photo of a warehouse would
 * say nothing about which one you are opening.
 *
 * There are as many motifs as there are articles, and each article claims one.
 * An earlier version varied a single motif per category by jittering point
 * positions, which looked fine in isolation and turned out to be useless at
 * card size: two articles in one category read as the same picture. Structure
 * has to differ, not coordinates.
 *
 * Everything is deterministic. Colour comes from the category, geometry from
 * the variant index, and the handful of random-looking offsets are hashed from
 * the slug, so the server and the browser always draw the same thing.
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

function rand(seed: number, n: number): number {
  const x = Math.sin(seed * 9301 + n * 49297) * 233280;
  return x - Math.floor(x);
}

const GRADIENTS: Record<ArticleCategory, [string, string]> = {
  operasional: ["#e3edf4", "#cfe4ea"],
  keuangan: ["#e7eff2", "#d3e7e1"],
  komersial: ["#edeaf4", "#dae4f0"],
  gudang: ["#eef1f4", "#dce7ed"],
  sistem: ["#e9eff3", "#d6e2ef"],
};

export const MOTIF_COUNT = 15;

export default function ArticleCoverArt({
  category,
  seed,
  variant,
  height = 150,
}: {
  category: ArticleCategory;
  seed: string;
  variant: number;
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
      {MOTIFS[((variant % MOTIF_COUNT) + MOTIF_COUNT) % MOTIF_COUNT](s)}
    </svg>
  );
}

type Motif = (s: number) => React.ReactElement;

/** 0. Multi-leg route: nodes joined by a polyline, last leg flagged. */
const routeLine: Motif = (s) => {
  const pts = Array.from({ length: 5 }, (_, i) => ({ x: 40 + i * 80, y: 42 + rand(s, i) * 66 }));
  return (
    <g>
      <path d={pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ")} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === 4 ? 8 : 5} fill={i === 4 ? ORANGE : TEAL} opacity={i === 4 ? 0.9 : 0.6} />
      ))}
    </g>
  );
};

/** 1. Distribution of bars with one short outlier. */
const barSpread: Motif = (s) => {
  const bars = Array.from({ length: 9 }, (_, i) => 22 + rand(s, i) * 78);
  const weak = Math.floor(rand(s, 99) * 9);
  return (
    <g>
      {bars.map((h, i) => (
        <rect key={i} x={32 + i * 38} y={126 - h} width="18" height={h} rx="5" fill={i === weak ? ORANGE : TEAL} opacity={i === weak ? 0.85 : 0.38} />
      ))}
      <line x1="20" y1="128" x2="380" y2="128" stroke={INK} strokeWidth="1.5" opacity="0.16" />
    </g>
  );
};

/** 2. Stacked request cards, the front one active. */
const stackedCards: Motif = (s) => (
  <g>
    {Array.from({ length: 4 }, (_, i) => (
      <rect key={i} x={44 + i * 74} y={30 + rand(s, i) * 26} width="92" height="66" rx="12" fill={i === 0 ? TEAL : "#ffffff"} opacity={i === 0 ? 0.35 : 0.55} stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.3" />
    ))}
    <circle cx="332" cy="114" r="9" fill={ORANGE} opacity="0.8" />
  </g>
);

/** 3. Bin grid with occupied cells. */
const binGrid: Motif = (s) => {
  const cells: { x: number; y: number; on: boolean }[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) cells.push({ x: 30 + c * 38, y: 30 + r * 34, on: rand(s, r * 9 + c) > 0.62 });
  return (
    <g>
      {cells.map((cell, i) => (
        <rect key={i} x={cell.x} y={cell.y} width="30" height="26" rx="5" fill={cell.on ? TEAL : "#ffffff"} opacity={cell.on ? 0.5 : 0.38} stroke={TEAL} strokeWidth="1" strokeOpacity="0.22" />
      ))}
    </g>
  );
};

/** 4. Hub and spokes. */
const hubSpokes: Motif = (s) => {
  const spokes = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + rand(s, i) * 0.5;
    return { x: 200 + Math.cos(a) * (78 + rand(s, i + 20) * 32), y: 75 + Math.sin(a) * (42 + rand(s, i + 40) * 18) };
  });
  return (
    <g>
      {spokes.map((p, i) => <line key={i} x1="200" y1="75" x2={p.x} y2={p.y} stroke={TEAL} strokeWidth="1.5" opacity="0.32" />)}
      {spokes.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="6" fill={i % 3 === 0 ? ORANGE : TEAL} opacity="0.6" />)}
      <circle cx="200" cy="75" r="15" fill={TEAL} opacity="0.75" />
    </g>
  );
};

/** 5. Horizontal timeline with milestones and one overrun segment. */
const timeline: Motif = (s) => {
  const marks = [50, 118, 186, 254, 322];
  const late = 1 + Math.floor(rand(s, 3) * 3);
  return (
    <g>
      <line x1="34" y1="75" x2="366" y2="75" stroke={INK} strokeWidth="2" opacity="0.14" />
      <line x1={marks[late]} y1="75" x2={marks[late] + 68} y2="75" stroke={ORANGE} strokeWidth="4" opacity="0.6" strokeLinecap="round" />
      {marks.map((x, i) => (
        <g key={i}>
          <line x1={x} y1="58" x2={x} y2="92" stroke={TEAL} strokeWidth="2" opacity="0.4" />
          <circle cx={x} cy="75" r={i === late ? 8 : 6} fill={i === late ? ORANGE : TEAL} opacity="0.75" />
        </g>
      ))}
    </g>
  );
};

/** 6. Funnel narrowing through stages. */
const funnel: Motif = () => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const w = 300 - i * 62;
      return <rect key={i} x={200 - w / 2} y={22 + i * 28} width={w} height="20" rx="7" fill={i === 3 ? ORANGE : TEAL} opacity={0.25 + i * 0.13} />;
    })}
  </g>
);

/** 7. Scatter with a trend line. */
const scatter: Motif = (s) => {
  const pts = Array.from({ length: 22 }, (_, i) => ({ x: 34 + rand(s, i) * 330, y: 24 + rand(s, i + 60) * 100 }));
  return (
    <g>
      <line x1="34" y1="118" x2="366" y2="38" stroke={ORANGE} strokeWidth="2.5" opacity="0.45" strokeDasharray="7 5" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={TEAL} opacity="0.42" />)}
    </g>
  );
};

/** 8. Layered flow bands. */
const flowBands: Motif = (s) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const y = 34 + i * 24;
      const amp = 10 + rand(s, i) * 12;
      return (
        <path
          key={i}
          d={`M 10 ${y} C 110 ${y - amp}, 180 ${y + amp}, 260 ${y} S 360 ${y - amp / 2}, 396 ${y}`}
          fill="none"
          stroke={i === 2 ? ORANGE : TEAL}
          strokeWidth={i === 2 ? 3.5 : 2.5}
          opacity={i === 2 ? 0.6 : 0.32}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

/** 9. Segmented gauge arc. */
const gauge: Motif = (s) => {
  const segs = 12;
  const filled = 4 + Math.floor(rand(s, 7) * 6);
  return (
    <g>
      {Array.from({ length: segs }, (_, i) => {
        const a = Math.PI + (i / (segs - 1)) * Math.PI;
        const x1 = 200 + Math.cos(a) * 96, y1 = 118 + Math.sin(a) * 96;
        const x2 = 200 + Math.cos(a) * 70, y2 = 118 + Math.sin(a) * 70;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i < filled ? TEAL : INK} strokeWidth="8" strokeLinecap="round" opacity={i < filled ? 0.55 : 0.1} />;
      })}
      <circle cx="200" cy="118" r="8" fill={ORANGE} opacity="0.8" />
    </g>
  );
};

/** 10. Matrix of dots with one highlighted row. */
const dotMatrix: Motif = (s) => {
  const hot = Math.floor(rand(s, 11) * 4);
  return (
    <g>
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 13 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={38 + c * 27} cy={36 + r * 26} r={r === hot ? 6 : 4.5} fill={r === hot ? ORANGE : TEAL} opacity={r === hot ? 0.65 : 0.3} />
        )),
      )}
    </g>
  );
};

/** 11. Two diverging paths from a single decision point. */
const fork: Motif = () => (
  <g>
    <circle cx="66" cy="75" r="11" fill={TEAL} opacity="0.8" />
    <path d="M 78 72 C 160 40, 240 32, 350 30" fill="none" stroke={TEAL} strokeWidth="3" opacity="0.45" strokeLinecap="round" />
    <path d="M 78 80 C 160 112, 240 118, 350 120" fill="none" stroke={ORANGE} strokeWidth="3" opacity="0.5" strokeLinecap="round" strokeDasharray="8 6" />
    <circle cx="350" cy="30" r="7" fill={TEAL} opacity="0.7" />
    <circle cx="350" cy="120" r="7" fill={ORANGE} opacity="0.75" />
  </g>
);

/** 12. Nested frames, an index narrowing on one record. */
const nestedFrames: Motif = () => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={40 + i * 26} y={22 + i * 15} width={320 - i * 52} height={106 - i * 30} rx={10 - i * 2} fill="none" stroke={i === 3 ? ORANGE : TEAL} strokeWidth={i === 3 ? 3 : 1.8} opacity={i === 3 ? 0.65 : 0.28} />
    ))}
    <circle cx="200" cy="75" r="6" fill={ORANGE} opacity="0.8" />
  </g>
);

/** 13. Two columns exchanging records. */
const exchange: Motif = (s) => (
  <g>
    <rect x="34" y="26" width="86" height="98" rx="12" fill={TEAL} opacity="0.16" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.35" />
    <rect x="280" y="26" width="86" height="98" rx="12" fill={TEAL} opacity="0.16" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.35" />
    {[0, 1, 2].map((i) => {
      const y = 48 + i * 27;
      const back = rand(s, i) > 0.6;
      return (
        <g key={i}>
          <line x1={back ? 276 : 124} y1={y} x2={back ? 124 : 276} y2={y} stroke={back ? ORANGE : TEAL} strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          <circle cx={back ? 124 : 276} cy={y} r="5" fill={back ? ORANGE : TEAL} opacity="0.7" />
        </g>
      );
    })}
  </g>
);

/** 14. Stepped staircase, a staged rollout. */
const staircase: Motif = () => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={34 + i * 68} y={112 - i * 20} width="58" height={20 + i * 20} rx="6" fill={i === 4 ? ORANGE : TEAL} opacity={i === 4 ? 0.55 : 0.2 + i * 0.07} />
    ))}
  </g>
);

const MOTIFS: Motif[] = [
  routeLine,
  barSpread,
  stackedCards,
  binGrid,
  hubSpokes,
  timeline,
  funnel,
  scatter,
  flowBands,
  gauge,
  dotMatrix,
  fork,
  nestedFrames,
  exchange,
  staircase,
];
