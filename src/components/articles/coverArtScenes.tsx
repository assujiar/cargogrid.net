import type { ReactElement } from "react";
import { articleSlugs } from "../../content/articles";

/**
 * Per-article cover illustrations.
 *
 * Each article gets one full scene built around what it's actually about —
 * cartons piling up in a warehouse corner for the returns piece, a truck
 * pinned to a weighbridge for the ODOL piece — rendered as a complete
 * environment (sky, floor, depth layers, props) in solid CargoGrid colors.
 *
 * Shapes are unstroked: silhouette and fill contrast carry the drawing, the
 * way flat spot-illustration usually works, rather than a black outline
 * around every object. Hero surfaces (trucks, cartons, panels, bubbles) use
 * the shared gradients from ArticleCoverArt.tsx for a bit of sheen instead of
 * being flat; background structure (skyline, floors, walls) stays a flatter,
 * cooler tone so it recedes behind the hero objects. The only stroked lines
 * left are ones that ARE the drawing — a checkmark, an X, a dashed route, a
 * roofline, a crane arm — not a border traced around a filled shape.
 *
 * The backdrop helpers (RoadScene, WarehouseScene, OfficeScene, DockScene)
 * exist because most scenes are one of those four settings; the object
 * helpers (Truck, Carton, ...) exist because the same objects recur across
 * several scenes. Nothing here goes further than the scenes actually use.
 *
 * No text: at 74px card height a label is unreadable anyway, so every scene
 * argues through iconography alone.
 */

const TEAL_FILL = "url(#cg-teal-sheen)";
const ORANGE_FILL = "url(#cg-orange-sheen)";
const SLATE_FILL = "url(#cg-slate-sheen)";
const TEAL_DEEP = "#006d80";
const ORANGE = "#cb3421";
const ORANGE_DEEP = "#a52313";
const INK = "#1e293b";
const SLATE = "#4a5c6e";
const WHITE = "#ffffff";

type Motif = () => ReactElement;

function Shadow({ cx, cy, rx, ry, opacity = 0.16 }: { cx: number; cy: number; rx: number; ry?: number; opacity?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx * 0.13} fill={INK} opacity={opacity} />;
}

function Panel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <Shadow cx={x + w / 2} cy={y + h + 2} rx={w / 2} ry={6} opacity={0.1} />
      <rect x={x} y={y} width={w} height={h} rx="12" fill={WHITE} />
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const s = scale;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={22 * s} ry={10 * s} fill={WHITE} />
      <circle cx={x - 14 * s} cy={y - 2 * s} r={9 * s} fill={WHITE} />
      <circle cx={x + 6 * s} cy={y - 7 * s} r={12 * s} fill={WHITE} />
      <circle cx={x + 20 * s} cy={y - 1 * s} r={8 * s} fill={WHITE} />
    </g>
  );
}

function TreeCluster({ x, yBase, scale = 1 }: { x: number; yBase: number; scale?: number }) {
  const s = scale;
  const canopyY = yBase - 26 * s;
  return (
    <g>
      <rect x={x - 3 * s} y={yBase - 14 * s} width={6 * s} height={14 * s} fill={INK} />
      <circle cx={x - 10 * s} cy={canopyY + 4 * s} r={11 * s} fill={TEAL_FILL} />
      <circle cx={x + 10 * s} cy={canopyY + 4 * s} r={11 * s} fill={TEAL_FILL} />
      <circle cx={x} cy={canopyY - 6 * s} r={13 * s} fill={TEAL_FILL} />
    </g>
  );
}

function PottedPlant({ x, yBase, scale = 1 }: { x: number; yBase: number; scale?: number }) {
  const s = scale;
  return (
    <g>
      <path d={`M ${x - 10 * s} ${yBase} L ${x - 8 * s} ${yBase - 16 * s} L ${x + 8 * s} ${yBase - 16 * s} L ${x + 10 * s} ${yBase} Z`} fill={SLATE} />
      <circle cx={x - 6 * s} cy={yBase - 22 * s} r={8 * s} fill={TEAL_FILL} />
      <circle cx={x + 6 * s} cy={yBase - 22 * s} r={8 * s} fill={TEAL_FILL} />
      <circle cx={x} cy={yBase - 30 * s} r={9 * s} fill={TEAL_FILL} />
    </g>
  );
}

function Skyline({ yBase = 58 }: { yBase?: number }) {
  const buildings = [
    { x: 20, w: 22, h: 30 },
    { x: 46, w: 16, h: 44 },
    { x: 66, w: 26, h: 26 },
    { x: 96, w: 18, h: 50 },
    { x: 300, w: 20, h: 38 },
    { x: 324, w: 26, h: 24 },
    { x: 354, w: 18, h: 46 },
  ];
  return (
    <g fill={SLATE_FILL}>
      {buildings.map((b, i) => (
        <rect key={i} x={b.x} y={yBase - b.h} width={b.w} height={b.h} />
      ))}
    </g>
  );
}

function WindowView({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const buildings = [
    { dx: 6, bw: 14, bh: 30 },
    { dx: 24, bw: 12, bh: h - 6 },
    { dx: 40, bw: 16, bh: 24 },
    { dx: 60, bw: 14, bh: h - 12 },
    { dx: 78, bw: 18, bh: 20 },
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={WHITE} />
      {buildings
        .filter((b) => x + b.dx + b.bw <= x + w - 2)
        .map((b, i) => (
          <rect key={i} x={x + b.dx} y={y + h - Math.min(b.bh, h - 4)} width={b.bw} height={Math.min(b.bh, h - 4)} fill={SLATE_FILL} />
        ))}
    </g>
  );
}

/** Sky, faint skyline, a road strip with lane dashes, roadside trees. */
function RoadScene({ groundY = 128 }: { groundY?: number }) {
  return (
    <g>
      <Cloud x={70} y={26} scale={1} />
      <Cloud x={330} y={20} scale={0.8} />
      <Skyline yBase={groundY - 6} />
      <rect x="0" y={groundY} width="400" height={150 - groundY} fill={SLATE_FILL} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={8 + i * 42} y={groundY + 11} width="20" height="3" rx="1.5" fill={WHITE} />
      ))}
      <TreeCluster x={14} yBase={groundY} scale={0.65} />
      <TreeCluster x={386} yBase={groundY} scale={0.75} />
    </g>
  );
}

/** Warehouse interior: angled roofline, high windows, faint distant racking, floor. */
function WarehouseScene({ groundY = 128 }: { groundY?: number }) {
  const wallY = 16;
  return (
    <g>
      <path d={`M 0 ${wallY} L 40 4 L 400 4 L 400 ${wallY}`} fill="none" stroke={SLATE} strokeWidth="2" />
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1={i * 20} y1={wallY} x2={i * 20} y2={groundY} stroke={SLATE} strokeWidth="1" opacity="0.35" />
      ))}
      {[60, 150, 240, 330].map((x, i) => (
        <rect key={i} x={x} y={wallY + 6} width="28" height="14" rx="2" fill={WHITE} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={20 + i * 60} y={groundY - 34} width="16" height="34" fill={SLATE} opacity="0.4" />
      ))}
      <rect x="0" y={groundY} width="400" height={150 - groundY} fill={SLATE_FILL} />
    </g>
  );
}

/** Desk scene: a window with a faint skyline, desk surface, a potted plant. */
function OfficeScene({ deskY = 122 }: { deskY?: number }) {
  return (
    <g>
      <WindowView x={266} y={14} w={114} h={72} />
      <rect x="0" y={deskY} width="400" height={150 - deskY} fill={SLATE_FILL} />
      <PottedPlant x={26} yBase={deskY} scale={1} />
    </g>
  );
}

/** Dockside: sky, faint skyline, a water band with wave texture. */
function DockScene({ waterY = 120 }: { waterY?: number }) {
  return (
    <g>
      <Cloud x={60} y={24} scale={0.9} />
      <Cloud x={320} y={18} scale={0.7} />
      <Skyline yBase={waterY - 4} />
      <rect x="0" y={waterY} width="400" height={150 - waterY} fill={TEAL_FILL} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M ${i * 52} ${waterY + 10 + (i % 2) * 6} q 13 -5 26 0 t 26 0`} fill="none" stroke={TEAL_DEEP} strokeWidth="2" opacity="0.6" />
      ))}
    </g>
  );
}

function Truck({
  x,
  y,
  scale = 1,
  body = TEAL_FILL,
  cab = TEAL_DEEP,
  flagColor,
  shadow = true,
}: {
  x: number;
  y: number;
  scale?: number;
  body?: string;
  cab?: string;
  flagColor?: string;
  shadow?: boolean;
}) {
  const s = scale;
  return (
    <g>
      {shadow && <Shadow cx={x + 48 * s} cy={y + 4 * s} rx={52 * s} ry={7 * s} />}
      <rect x={x} y={y - 38 * s} width={64 * s} height={38 * s} rx={4 * s} fill={body} />
      <path d={`M ${x + 64 * s} ${y - 26 * s} h ${18 * s} l ${14 * s} ${14 * s} v ${12 * s} h ${-32 * s} z`} fill={cab} />
      <rect x={x + 68 * s} y={y - 22 * s} width={11 * s} height={9 * s} rx={1.5 * s} fill={WHITE} />
      <circle cx={x + 15 * s} cy={y} r={7 * s} fill={INK} />
      <circle cx={x + 15 * s} cy={y} r={3 * s} fill={WHITE} />
      <circle cx={x + 80 * s} cy={y} r={7 * s} fill={INK} />
      <circle cx={x + 80 * s} cy={y} r={3 * s} fill={WHITE} />
      {flagColor && <rect x={x + 24 * s} y={y - 52 * s} width={9 * s} height={7 * s} fill={flagColor} />}
    </g>
  );
}

function Carton({ x, y, w, h, fill = TEAL_FILL, shade = TEAL_DEEP }: { x: number; y: number; w: number; h: number; fill?: string; shade?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={fill} />
      <rect x={x + w / 2} y={y} width={w / 2} height={h} fill={shade} />
      <path d={`M ${x} ${y} L ${x + w / 2} ${y + h * 0.3} L ${x + w} ${y}`} fill="none" stroke={INK} strokeWidth="1.3" strokeOpacity="0.3" />
    </g>
  );
}

function RackCell({ x, y, w = 30, h = 24, on = false }: { x: number; y: number; w?: number; h?: number; on?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx="4" fill={on ? TEAL_FILL : WHITE} />;
}

function Coin({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ORANGE_FILL} />
      <circle cx={x} cy={y} r={r * 0.55} fill={ORANGE_DEEP} />
    </g>
  );
}

function Paper({
  x,
  y,
  w = 46,
  h = 60,
  rotate = 0,
  lines = 3,
  accent = false,
  dogEar = true,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  lines?: number;
  accent?: boolean;
  dogEar?: boolean;
}) {
  return (
    <g transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined}>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={WHITE} />
      {dogEar && <path d={`M ${x + w - 14} ${y} L ${x + w} ${y} L ${x + w} ${y + 14} Z`} fill="#dbe2ea" />}
      {Array.from({ length: lines }, (_, i) => {
        const isLast = accent && i === lines - 1;
        const ly = y + 14 + i * 10;
        return <line key={i} x1={x + 8} y1={ly} x2={x + w - 8} y2={ly} stroke={isLast ? ORANGE : "#3dbdd4"} strokeWidth="3" strokeLinecap="round" />;
      })}
    </g>
  );
}

function Bubble({ x, y, w, h, fill, tailSide = "right" }: { x: number; y: number; w: number; h: number; fill: string; tailSide?: "left" | "right" }) {
  const tailX = tailSide === "right" ? x + w - 18 : x + 18;
  const dir = tailSide === "right" ? 1 : -1;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} />
      <path d={`M ${tailX} ${y + h - 1} l ${10 * dir} 14 l ${14 * dir} -14 z`} fill={fill} />
    </g>
  );
}

function Puff({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M ${x} ${y} q ${8 * scale} ${-10 * scale} 0 ${-20 * scale} q ${8 * scale} ${-8 * scale} ${-2 * scale} ${-18 * scale}`}
      fill="none"
      stroke={SLATE}
      strokeWidth={2.5 * scale}
      strokeLinecap="round"
      opacity="0.6"
    />
  );
}

/** Overloaded truck on a weighbridge, gauge needle buried in the red. */
const odolTimbanganJembatanMuatanLebih: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    <rect x="50" y="120" width="200" height="12" rx="2" fill={SLATE_FILL} />
    <rect x="66" y="132" width="10" height="10" fill={INK} />
    <rect x="220" y="132" width="10" height="10" fill={INK} />
    <Truck x={84} y={120} scale={1.3} />
    <g transform="rotate(-8 119 60)">
      <Carton x={104} y={48} w={30} h={24} fill={ORANGE_FILL} shade={ORANGE_DEEP} />
    </g>
    <g transform="rotate(6 146 52)">
      <Carton x={132} y={40} w={28} h={22} fill={ORANGE_FILL} shade={ORANGE_DEEP} />
    </g>
    <g transform="rotate(-4 128 34)">
      <Carton x={114} y={24} w={26} h={20} fill={ORANGE_FILL} shade={ORANGE_DEEP} />
    </g>
    <circle cx="322" cy="76" r="44" fill={WHITE} />
    {Array.from({ length: 10 }, (_, i) => {
      const a = Math.PI + (i / 9) * Math.PI;
      const x1 = 322 + Math.cos(a) * 36;
      const y1 = 76 + Math.sin(a) * 36;
      const x2 = 322 + Math.cos(a) * 23;
      const y2 = 76 + Math.sin(a) * 23;
      const hot = i >= 6;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? ORANGE : "#3dbdd4"} strokeWidth="5" strokeLinecap="round" />;
    })}
    <line x1="322" y1="76" x2="344" y2="50" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <circle cx="322" cy="76" r="5" fill={INK} />
  </g>
);

/** Truck stopped on the shoulder, hazard triangle out, engine steaming. */
const perawatanArmadaPreventifVsReaktif: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    <path d="M 58 126 L 74 96 L 90 126 Z" fill={WHITE} />
    <path d="M 58 126 L 74 96 L 90 126 Z" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinejoin="round" />
    <line x1="74" y1="106" x2="74" y2="116" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
    <circle cx="74" cy="121" r="1.8" fill={ORANGE} />
    <Truck x={150} y={124} scale={1.3} />
    <Puff x={270} y={72} scale={1.1} />
    <Puff x={282} y={64} scale={0.75} />
    <g transform="translate(332 46) rotate(30)">
      <rect x="-3" y="-22" width="6" height="32" rx="3" fill={SLATE} />
      <circle cx="0" cy="-24" r="7" fill="none" stroke={SLATE} strokeWidth="4" />
    </g>
  </g>
);

/** Envelope of cash and a signed receipt, coins alongside, at a desk. */
const uangJalanKasKecilSopir: Motif = () => (
  <g>
    <OfficeScene deskY={122} />
    <Shadow cx={133} cy={122} rx={70} />
    <path d="M 66 44 L 200 44 L 200 118 L 66 118 Z" fill={TEAL_FILL} />
    <path d="M 66 44 L 133 86 L 200 44 Z" fill={TEAL_DEEP} />
    <rect x="104" y="16" width="70" height="40" rx="4" fill={TEAL_FILL} />
    <rect x="112" y="24" width="54" height="24" rx="3" fill={WHITE} />
    <circle cx="139" cy="36" r="7" fill={TEAL_DEEP} />
    <Paper x={224} y={36} w={68} h={82} rotate={6} lines={4} accent />
    <Coin x={310} y={100} r={11} />
    <Coin x={332} y={110} r={8} />
    <Coin x={296} y={112} r={6} />
  </g>
);

/** A cracked carton beside a crossed-out insurance shield, camera documenting it. */
const asuransiCargoKlaimKerusakanBarang: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={96} cy={128} rx={54} />
    <Carton x={50} y={64} w={92} h={64} fill={TEAL_FILL} shade={TEAL_DEEP} />
    <path d="M 70 64 L 84 96 L 74 102 L 96 128" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <Carton x={26} y={100} w={40} h={28} fill={TEAL_FILL} shade={TEAL_DEEP} />
    <path d="M 250 30 L 288 30 L 288 62 Q 288 92 269 108 Q 250 92 250 62 Z" fill={WHITE} />
    <line x1="256" y1="46" x2="282" y2="90" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
    <line x1="282" y1="46" x2="256" y2="90" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
    <g transform="translate(336 92)">
      <Shadow cx={0} cy={20} rx={26} ry={5} />
      <rect x="-20" y="-12" width="40" height="28" rx="5" fill={INK} />
      <rect x="-8" y="-20" width="16" height="10" rx="2" fill={INK} />
      <circle cx="0" cy="2" r="9" fill={SLATE} />
    </g>
  </g>
);

/** Two parties at a desk over a contract, the rate line ticking up. */
const negosiasiTarifTahunanKontrakShipper: Motif = () => (
  <g>
    <OfficeScene deskY={122} />
    <Shadow cx={200} cy={123} rx={58} />
    <Paper x={150} y={26} w={100} h={94} lines={5} />
    <Bubble x={54} y={40} w={78} h={48} fill={TEAL_FILL} tailSide="right" />
    <g transform="translate(93 64)">
      <circle cx="-14" cy="0" r="3.6" fill={WHITE} />
      <circle cx="0" cy="0" r="3.6" fill={WHITE} />
      <circle cx="14" cy="0" r="3.6" fill={WHITE} />
    </g>
    <Bubble x={268} y={40} w={78} h={48} fill={ORANGE_FILL} tailSide="left" />
    <path d="M 160 92 L 184 76 L 206 84 L 228 58 L 242 46" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
    <circle cx="242" cy="46" r="4.5" fill={ORANGE} />
  </g>
);

/** Trucks queued nose to tail on the shoulder, the standby one flagged, demand spiking. */
const lonjakanMusimanKapasitasPeakSeason: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    {[0, 1, 2].map((i) => (
      <Truck key={i} x={20 + i * 66} y={124} scale={0.8} body={SLATE_FILL} cab={SLATE} />
    ))}
    <Truck x={218} y={124} scale={0.8} flagColor={ORANGE} />
    <g transform="translate(318 26)">
      <path d="M 0 76 L 14 54 L 28 62 L 42 22 L 58 6" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="6" r="5" fill={ORANGE} />
    </g>
  </g>
);

/** A phone drowning in messages, standing in for a whole operational system. */
const grupWhatsappSistemOperasionalBayangan: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <g transform="translate(50 128)">
      <Shadow cx={0} cy={4} rx={26} />
      <rect x="-22" y="-46" width="44" height="52" rx="8" fill={INK} />
      <rect x="-17" y="-40" width="34" height="38" fill={TEAL_FILL} />
      <circle cx="0" cy="2" r="3" fill={WHITE} />
    </g>
    <Bubble x={72} y={18} w={82} h={42} fill={TEAL_FILL} tailSide="right" />
    <Bubble x={168} y={10} w={68} h={38} fill={TEAL_FILL} tailSide="left" />
    <Bubble x={128} y={58} w={90} h={44} fill={TEAL_FILL} tailSide="right" />
    <Bubble x={242} y={32} w={78} h={44} fill={ORANGE_FILL} tailSide="left" />
    <Bubble x={262} y={84} w={70} h={38} fill={TEAL_FILL} tailSide="right" />
    <g transform="translate(281 54)">
      <rect x="-3" y="-14" width="6" height="16" rx="3" fill={WHITE} />
      <circle cx="0" cy="8" r="3.4" fill={WHITE} />
    </g>
  </g>
);

/** An ID badge pulled away from a desk while an access panel gets crossed out. */
const aksesSistemSaatKaryawanResign: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Panel x={160} y={20} w={100} h={100} />
    <rect x="188" y="62" width="44" height="36" rx="6" fill={TEAL_FILL} />
    <path d="M 196 62 v-14 a14 14 0 0 1 28 0 v14" fill="none" stroke={TEAL_DEEP} strokeWidth="6" />
    <circle cx="210" cy="78" r="5" fill={WHITE} />
    <line x1="170" y1="30" x2="250" y2="110" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
    <line x1="250" y1="30" x2="170" y2="110" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
    <g transform="translate(70 66) rotate(-14)">
      <Shadow cx={0} cy={40} rx={28} />
      <rect x="-24" y="-32" width="48" height="64" rx="8" fill={WHITE} />
      <circle cx="0" cy="-10" r="12" fill={TEAL_FILL} />
      <rect x="-16" y="8" width="32" height="6" rx="3" fill={TEAL_FILL} />
      <rect x="-16" y="18" width="24" height="6" rx="3" fill="#dbe2ea" />
    </g>
  </g>
);

/** A leaning stack of return cartons filling a warehouse corner, a pallet jack alongside. */
const returBarangReverseLogisticsGudang: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={70} cy={128} rx={66} ry={7} />
    <g transform="translate(40 0)">
      <Carton x={0} y={92} w={54} h={36} fill={TEAL_FILL} shade={TEAL_DEEP} />
      <g transform="rotate(-6 27 74)">
        <Carton x={0} y={56} w={54} h={36} fill={TEAL_FILL} shade={TEAL_DEEP} />
      </g>
      <g transform="rotate(7 27 40)">
        <Carton x={2} y={20} w={50} h={34} fill={ORANGE_FILL} shade={ORANGE_DEEP} />
      </g>
    </g>
    <g transform="translate(67 37)">
      <path d="M -6 -7 A 9 9 0 1 1 -9 3" fill="none" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M -9 3 l -6 -2 l 2 -7 z" fill={WHITE} />
    </g>
    <Shadow cx={171} cy={128} rx={40} ry={5} />
    <Carton x={150} y={100} w={42} h={28} fill={TEAL_FILL} shade={TEAL_DEEP} />
    <g transform="rotate(-4 171 100)">
      <Carton x={150} y={76} w={42} h={28} fill={TEAL_FILL} shade={TEAL_DEEP} />
    </g>
    <Carton x={280} y={102} w={46} h={26} fill={TEAL_FILL} shade={TEAL_DEEP} />
    <g transform="translate(340 104)">
      <rect x="-8" y="16" width="46" height="6" rx="2" fill={SLATE} />
      <line x1="-8" y1="16" x2="-8" y2="-14" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
      <line x1="-8" y1="-14" x2="6" y2="-20" stroke={SLATE} strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="24" r="5" fill={INK} />
      <circle cx="30" cy="24" r="5" fill={INK} />
    </g>
  </g>
);

/** Rack grid with support posts, the fast mover stored far from a dock a picker treks to. */
const slottingTataLetakGudangProduktivitasPicking: Motif = () => {
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) cells.push({ x: 30 + c * 34, y: 24 + r * 30 });
  return (
    <g>
      <WarehouseScene groundY={128} />
      <line x1="26" y1="18" x2="26" y2="88" stroke={SLATE} strokeWidth="3" />
      <line x1="298" y1="18" x2="298" y2="88" stroke={SLATE} strokeWidth="3" />
      {cells.map((cell, i) => (
        <RackCell key={i} x={cell.x} y={cell.y} w={28} h={24} on={i % 5 === 0} />
      ))}
      <rect x="64" y="54" width="28" height="24" rx="4" fill={ORANGE_FILL} />
      <g transform="translate(200 118)">
        <circle cx="0" cy="-30" r="6" fill={INK} />
        <path d="M 0 -24 v 16 M -8 -8 L 0 -14 L 8 -8 M -6 8 L 0 -8 L 6 8" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x="326" y="98" width="50" height="32" rx="4" fill={TEAL_FILL} />
      <path d="M 326 98 l 25 -14 l 25 14" fill="none" stroke={SLATE} strokeWidth="2" />
      <path d="M 78 78 C 140 128, 260 128, 336 114" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
      <circle cx="336" cy="114" r="4.5" fill={ORANGE} />
    </g>
  );
};

/** A stack of paper PODs at a desk, one sheet flying off, coins leaking out underneath. */
const biayaTersembunyiPodKertas: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={100} cy={126} rx={56} />
    <Paper x={60} y={30} w={70} h={92} lines={5} />
    <g transform="rotate(-3 100 76)">
      <Paper x={65} y={26} w={70} h={92} lines={5} />
    </g>
    <g transform="rotate(4 106 72)">
      <Paper x={70} y={22} w={70} h={92} lines={5} accent />
    </g>
    <g transform="translate(230 20) rotate(18)">
      <path d="M 0 0 h48 v58 l-14 -6 v-46 z" fill={WHITE} />
      <line x1="8" y1="16" x2="40" y2="16" stroke={ORANGE} strokeWidth="2.6" />
      <line x1="8" y1="26" x2="40" y2="26" stroke={ORANGE} strokeWidth="2.6" />
    </g>
    <Coin x={300} y={100} r={9} />
    <Coin x={322} y={112} r={7} />
    <Coin x={340} y={98} r={6} />
    <Coin x={352} y={116} r={5} />
  </g>
);

/** A calendar with day 30 circled at a desk, stretching to a red day 60. */
const rekonsiliasiInvoiceForwarderTerlambat: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={140} cy={126} rx={104} />
    <Panel x={40} y={26} w={200} h={98} />
    <rect x="40" y="26" width="200" height="24" rx="10" fill={TEAL_FILL} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, c) => <circle key={`${r}-${c}`} cx={58 + c * 26} cy={68 + r * 14} r="2.4" fill="#c3ccd6" />))}
    <circle cx={58 + 26} cy={68} r="9" fill="none" stroke={TEAL_DEEP} strokeWidth="2.6" />
    <path d="M 96 68 C 200 40, 300 40, 330 90" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
    <g transform="translate(330 90)">
      <Shadow cx={0} cy={22} rx={20} ry={4} />
      <circle r="16" fill={ORANGE_FILL} />
      <line x1="0" y1="0" x2="0" y2="-8" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="0" y1="0" x2="6" y2="4" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  </g>
);

/** Job bars on a desk monitor, the last one dipping below zero under a magnifier. */
const marginPerJobForwarder: Motif = () => {
  const jobs = [62, 44, 70, 50, -34];
  return (
    <g>
      <OfficeScene deskY={128} />
      <Panel x={24} y={18} w={352} h={106} />
      <line x1="40" y1="90" x2="360" y2="90" stroke="#c3ccd6" strokeWidth="1.5" />
      {jobs.map((v, i) => (
        <rect key={i} x={60 + i * 62} y={v >= 0 ? 90 - v : 90} width="34" height={Math.abs(v)} rx="5" fill={v < 0 ? ORANGE_FILL : TEAL_FILL} />
      ))}
      <g transform="translate(338 107)">
        <circle r="16" fill="none" stroke={INK} strokeWidth="3.5" />
        <line x1="11" y1="11" x2="22" y2="22" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </g>
    </g>
  );
};

/** A narrowing funnel over a desk, rejected slips at the base, one quotation escaping through. */
const alurRfqFreightForwarding: Motif = () => (
  <g>
    <OfficeScene deskY={132} />
    {[0, 1, 2, 3].map((i) => {
      const w = 280 - i * 58;
      return <rect key={i} x={200 - w / 2} y={14 + i * 24} width={w} height="17" rx="7" fill={i === 3 ? TEAL_FILL : SLATE} opacity={i === 3 ? 1 : 0.3 + i * 0.15} />;
    })}
    <Shadow cx={92} cy={130} rx={40} ry={5} />
    <g transform="rotate(-8 85 122)">
      <rect x="70" y="108" width="30" height="28" rx="3" fill={WHITE} />
      <line x1="78" y1="116" x2="92" y2="128" stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="92" y1="116" x2="78" y2="128" stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" />
    </g>
    <g transform="rotate(6 108 128)">
      <rect x="94" y="114" width="26" height="24" rx="3" fill={WHITE} />
      <line x1="100" y1="120" x2="112" y2="132" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="112" y1="120" x2="100" y2="132" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <path d="M 200 40 C 200 76, 280 92, 320 116" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="5 6" />
    <g transform="translate(320 116)">
      <Shadow cx={0} cy={14} rx={14} ry={3.5} />
      <circle r="10" fill={ORANGE_FILL} />
      <path d="M -4 0 l 3 4 l 6 -8" fill="none" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

/** A fleet-yard hub of trucks, reliable vendors solid teal, the shaky ones dashed orange. */
const manajemenVendorSubkontraktor: Motif = () => {
  const vendors = [
    { a: -1.3, dist: 0.85, reliable: true },
    { a: -0.5, dist: 1.0, reliable: false },
    { a: 0.3, dist: 0.9, reliable: true },
    { a: 1.1, dist: 1.05, reliable: false },
    { a: 1.9, dist: 0.8, reliable: true },
  ];
  return (
    <g>
      <RoadScene groundY={128} />
      {vendors.map((v, i) => {
        const x = 200 + Math.cos(v.a) * 130 * v.dist;
        const y = 78 + Math.sin(v.a) * 46 * v.dist;
        return (
          <g key={i}>
            <line x1="200" y1="78" x2={x} y2={y} stroke={v.reliable ? "#3dbdd4" : ORANGE} strokeWidth="2.5" strokeDasharray={v.reliable ? undefined : "4 5"} />
            <circle cx={x} cy={y} r="9" fill={v.reliable ? TEAL_FILL : ORANGE_FILL} />
          </g>
        );
      })}
      <circle cx="200" cy="78" r="18" fill={TEAL_DEEP} />
      <rect x="192" y="70" width="16" height="12" rx="2" fill={WHITE} />
    </g>
  );
};

/** A portal window on a desk with a status timeline inside, a crossed-out phone beside it. */
const customerPortalLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={155} cy={126} rx={120} />
    <Panel x={40} y={20} w={230} h={106} />
    <rect x="40" y="20" width="230" height="18" rx="10" fill={TEAL_FILL} />
    <circle cx="52" cy="29" r="3" fill={WHITE} />
    <circle cx="62" cy="29" r="3" fill={WHITE} />
    <line x1="62" y1="78" x2="248" y2="78" stroke="#c3ccd6" strokeWidth="2" />
    {[62, 124, 186, 248].map((x, i) => (
      <circle key={i} cx={x} cy="78" r={i < 3 ? 7 : 9} fill={i < 3 ? TEAL_FILL : ORANGE_FILL} />
    ))}
    <line x1="62" y1="100" x2="200" y2="100" stroke={TEAL_FILL} strokeWidth="6" strokeLinecap="round" />
    <line x1="62" y1="112" x2="150" y2="112" stroke="#c3ccd6" strokeWidth="6" strokeLinecap="round" />
    <g transform="translate(330 73)">
      <Shadow cx={0} cy={30} rx={18} />
      <rect x="-14" y="-24" width="28" height="48" rx="7" fill={INK} />
      <line x1="-22" y1="22" x2="22" y2="-22" stroke={ORANGE} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  </g>
);

/** A dockside crane over stacked containers, a clock ticking into the red. */
const demurrageDetentionPelabuhan: Motif = () => (
  <g>
    <DockScene waterY={122} />
    <Shadow cx={145} cy={122} rx={80} opacity={0.18} />
    <line x1="70" y1="122" x2="70" y2="24" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <line x1="70" y1="28" x2="180" y2="28" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <line x1="150" y1="28" x2="150" y2="58" stroke={INK} strokeWidth="3" />
    <rect x="100" y="88" width="60" height="34" rx="3" fill={TEAL_FILL} />
    <rect x="164" y="88" width="60" height="34" rx="3" fill={TEAL_DEEP} />
    <rect x="112" y="50" width="60" height="34" rx="3" fill={TEAL_FILL} />
    <circle cx="310" cy="70" r="38" fill={WHITE} />
    <path d="M 310 70 L 310 36 A 34 34 0 0 1 340 88 Z" fill={ORANGE_FILL} />
    <line x1="310" y1="70" x2="310" y2="40" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    <line x1="310" y1="70" x2="332" y2="84" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="310" cy="70" r="4.5" fill={INK} />
  </g>
);

/** A truck and a ship strung along one dashed route where land meets water. */
const trackingMultimodaIndonesia: Motif = () => (
  <g>
    <Cloud x={70} y={22} scale={0.9} />
    <Cloud x={310} y={16} scale={0.75} />
    <Skyline yBase={70} />
    <path d="M 0 96 Q 140 108, 190 92 Q 260 74, 400 100 L 400 150 L 0 150 Z" fill={TEAL_FILL} />
    {Array.from({ length: 5 }, (_, i) => (
      <path key={i} d={`M ${140 + i * 48} ${112 + (i % 2) * 6} q 12 -5 24 0 t 24 0`} fill="none" stroke={TEAL_DEEP} strokeWidth="1.8" opacity="0.6" />
    ))}
    <rect x="0" y="122" width="150" height="28" fill={SLATE_FILL} />
    <path d="M 55 78 C 140 40, 220 100, 300 56 S 360 40, 372 30" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
    <Truck x={16} y={132} scale={0.62} />
    <g transform="translate(190 100)">
      <Shadow cx={0} cy={18} rx={30} />
      <path d="M -26 0 L 26 0 L 18 16 L -18 16 Z" fill={TEAL_FILL} />
      <line x1="0" y1="0" x2="0" y2="-24" stroke={INK} strokeWidth="2" />
      <path d="M 0 -24 L 16 -14 L 0 -8 Z" fill={TEAL_DEEP} />
    </g>
    <g transform="translate(372 30)">
      <path d="M 0 0 C -12 -14, -12 -30, 0 -30 C 12 -30, 12 -14, 0 0 Z" fill={ORANGE_FILL} />
      <circle cx="0" cy="-21" r="4.5" fill={WHITE} />
    </g>
  </g>
);

/** A cab windshield onto the road, a wheel, and an idle crossed-out phone on the dash. */
const adopsiAplikasiDriver: Motif = () => (
  <g>
    <path d="M 0 0 H 400 V 70 Q 200 30 0 70 Z" fill={TEAL_FILL} />
    <Cloud x={90} y={26} scale={0.55} />
    <Cloud x={260} y={20} scale={0.45} />
    <rect x="0" y="70" width="400" height="80" fill={SLATE_FILL} />
    <circle cx="110" cy="86" r="46" fill="none" stroke={TEAL_DEEP} strokeWidth="9" />
    <circle cx="110" cy="86" r="10" fill={TEAL_DEEP} />
    <line x1="110" y1="86" x2="110" y2="44" stroke={TEAL_DEEP} strokeWidth="7" strokeLinecap="round" />
    <line x1="110" y1="86" x2="76" y2="108" stroke={TEAL_DEEP} strokeWidth="7" strokeLinecap="round" />
    <line x1="110" y1="86" x2="144" y2="108" stroke={TEAL_DEEP} strokeWidth="7" strokeLinecap="round" />
    <rect x="60" y="130" width="100" height="10" rx="3" fill={INK} />
    <g transform="translate(230 46)">
      <Shadow cx={0} cy={70} rx={20} />
      <rect x="-16" y="-30" width="32" height="60" rx="7" fill={INK} />
      <rect x="-11" y="-24" width="22" height="40" rx="2" fill="#33404e" />
      <line x1="-20" y1="30" x2="20" y2="-30" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
    </g>
    <Paper x={286} y={76} w={64} h={54} rotate={-4} lines={3} accent />
  </g>
);

/** A dashboard on a desk: an on-time ring near full, one incident dot enlarged, an eye reading it. */
const kpiOperasionalLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Panel x={40} y={20} w={280} h={106} />
    <g transform="translate(102 74)">
      <circle r="34" fill="none" stroke="#dbe2ea" strokeWidth="10" />
      <path d="M 0 -34 A 34 34 0 1 1 -6 -33.5" fill="none" stroke={TEAL_FILL} strokeWidth="10" strokeLinecap="round" />
    </g>
    <g transform="translate(206 60)">
      <rect x="-34" y="0" width="68" height="30" rx="6" fill="#eef2f6" />
      <circle cx="-18" cy="15" r="5" fill="#c3ccd6" />
      <circle cx="0" cy="15" r="5" fill="#c3ccd6" />
      <circle cx="18" cy="15" r="7" fill={ORANGE_FILL} />
    </g>
    <g transform="translate(322 73)">
      <path d="M -28 0 C -16 -18, 16 -18, 28 0 C 16 18, -16 18, -28 0 Z" fill={WHITE} />
      <circle cx="0" cy="0" r="9" fill={TEAL_FILL} />
    </g>
  </g>
);

/** A vague, unlabeled pile of stock beside a precise, checked-off bin grid. */
const wms3plLevelBin: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={90} cy={126} rx={60} />
    <path d="M 30 124 C 20 90, 50 60, 90 66 C 110 40, 150 46, 150 76 C 170 84, 160 116, 140 124 Z" fill={SLATE_FILL} />
    <line x1="200" y1="16" x2="200" y2="134" stroke="#c3ccd6" strokeWidth="2" strokeDasharray="4 6" />
    <line x1="224" y1="24" x2="224" y2="108" stroke={SLATE} strokeWidth="2.5" />
    <line x1="368" y1="24" x2="368" y2="108" stroke={SLATE} strokeWidth="2.5" />
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 4 }, (_, c) => <RackCell key={`${r}-${c}`} x={228 + c * 34} y={30 + r * 40} w={28} h={30} on />))}
    <path d="M 236 45 l 6 6 l 12 -12" fill="none" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** A spreadsheet grid on a desk monitor with cells spilling loose past its own border. */
const kapanExcelBerhentiCukup: Motif = () => (
  <g>
    <OfficeScene deskY={132} />
    <Panel x={60} y={18} w={220} h={110} />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={64 + c * 36} y={22 + r * 21} width="34" height="19" fill="none" stroke="#c3ccd6" strokeWidth="1" />))}
    <rect x="286" y="32" width="26" height="17" rx="2" fill={ORANGE_FILL} transform="rotate(8 299 40)" />
    <rect x="300" y="56" width="26" height="17" rx="2" fill={ORANGE_FILL} transform="rotate(-6 313 64)" />
    <rect x="292" y="84" width="26" height="17" rx="2" fill={ORANGE_FILL} transform="rotate(12 305 92)" />
    <path d="M 210 18 L 224 58 L 206 76 L 230 128" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
  </g>
);

/** A logistics panel and an accounting panel on a desk, plugged together in the middle. */
const integrasiErpAkuntansiLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Panel x={30} y={28} w={130} h={94} />
    <Truck x={64} y={100} scale={0.85} shadow={false} />
    <Panel x={240} y={28} w={130} h={94} />
    <Coin x={290} y={70} r={14} />
    <Coin x={314} y={84} r={10} />
    <Paper x={286} y={92} w={54} h={30} lines={2} />
    <line x1="160" y1="76" x2="240" y2="76" stroke={SLATE} strokeWidth="2.5" strokeDasharray="5 6" />
    <circle cx="200" cy="76" r="13" fill={TEAL_FILL} />
    <path d="M 194 76 h12 M 200 70 v12" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" />
  </g>
);

/** A wall of shelved binders behind one dusty ring binder handing off to a checked digital folder. */
const dokumenKepabeananArsipDigital: Motif = () => (
  <g>
    {[10, 34, 58, 82, 106].map((x, i) => (
      <rect key={i} x={x} y="26" width="18" height="34" fill={SLATE} opacity={0.5 + (i % 2) * 0.15} />
    ))}
    {[10, 34, 58, 82, 106].map((x, i) => (
      <rect key={`b-${i}`} x={x} y="60" width="18" height="34" fill={SLATE} opacity={0.4 + (i % 3) * 0.12} />
    ))}
    <rect x="0" y="128" width="400" height="22" fill={SLATE_FILL} />
    <g transform="translate(150 20)">
      <Shadow cx={35} cy={108} rx={42} />
      <rect x="0" y="0" width="70" height="104" rx="4" fill={SLATE_FILL} />
      <rect x="0" y="0" width="14" height="104" fill={INK} />
      {[16, 40, 64, 88].map((y, i) => (
        <circle key={i} cx="7" cy={y} r="3" fill={WHITE} />
      ))}
    </g>
    <path d="M 246 72 L 300 72" stroke={ORANGE} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
    <path d="M 292 64 L 304 72 L 292 80" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(320 44)">
      <Shadow cx={35} cy={82} rx={42} />
      <path d="M 0 12 h28 l8 -10 h34 a6 6 0 0 1 6 6 v60 a6 6 0 0 1 -6 6 h-62 a6 6 0 0 1 -6 -6 v-50 a6 6 0 0 1 6 -6 z" fill={TEAL_FILL} />
      <circle cx="35" cy="46" r="9" fill={WHITE} />
      <path d="M 31 46 l 3 3 l 6 -7" fill="none" stroke={TEAL_DEEP} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

/** A fork from one decision at a desk: a short 30-day strip, or a long full-speed run. */
const memilihSoftwareLogistikPilot30Hari: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <circle cx="46" cy="75" r="10" fill={TEAL_FILL} />
    <path d="M 56 70 C 110 44, 160 40, 210 40" fill="none" stroke="#3dbdd4" strokeWidth="3" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={216 + i * 16} y="30" width="12" height="20" rx="2" fill={TEAL_FILL} />
    ))}
    <path d="M 56 80 C 140 108, 220 118, 300 120" fill="none" stroke={ORANGE} strokeWidth="3" strokeDasharray="7 6" />
    <path d="M 300 120 h 40 l -10 -8 M 340 120 l -10 8" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const SCENES: Record<string, Motif> = {
  "odol-timbangan-jembatan-muatan-lebih": odolTimbanganJembatanMuatanLebih,
  "perawatan-armada-preventif-vs-reaktif": perawatanArmadaPreventifVsReaktif,
  "uang-jalan-kas-kecil-sopir": uangJalanKasKecilSopir,
  "asuransi-cargo-klaim-kerusakan-barang": asuransiCargoKlaimKerusakanBarang,
  "negosiasi-tarif-tahunan-kontrak-shipper": negosiasiTarifTahunanKontrakShipper,
  "lonjakan-musiman-kapasitas-peak-season": lonjakanMusimanKapasitasPeakSeason,
  "grup-whatsapp-sistem-operasional-bayangan": grupWhatsappSistemOperasionalBayangan,
  "akses-sistem-saat-karyawan-resign": aksesSistemSaatKaryawanResign,
  "retur-barang-reverse-logistics-gudang": returBarangReverseLogisticsGudang,
  "slotting-tata-letak-gudang-produktivitas-picking": slottingTataLetakGudangProduktivitasPicking,
  "biaya-tersembunyi-pod-kertas": biayaTersembunyiPodKertas,
  "rekonsiliasi-invoice-forwarder-terlambat": rekonsiliasiInvoiceForwarderTerlambat,
  "margin-per-job-forwarder": marginPerJobForwarder,
  "alur-rfq-freight-forwarding": alurRfqFreightForwarding,
  "manajemen-vendor-subkontraktor": manajemenVendorSubkontraktor,
  "customer-portal-logistik": customerPortalLogistik,
  "demurrage-detention-pelabuhan": demurrageDetentionPelabuhan,
  "tracking-multimoda-indonesia": trackingMultimodaIndonesia,
  "adopsi-aplikasi-driver": adopsiAplikasiDriver,
  "kpi-operasional-logistik": kpiOperasionalLogistik,
  "wms-3pl-level-bin": wms3plLevelBin,
  "kapan-excel-berhenti-cukup": kapanExcelBerhentiCukup,
  "integrasi-erp-akuntansi-logistik": integrasiErpAkuntansiLogistik,
  "dokumen-kepabeanan-arsip-digital": dokumenKepabeananArsipDigital,
  "memilih-software-logistik-pilot-30-hari": memilihSoftwareLogistikPilot30Hari,
};

/** Catches a new article shipping without matching art — at build time, not at a support ticket. */
function assertCoverage(): void {
  for (const slug of articleSlugs) {
    if (!SCENES[slug]) throw new Error(`No cover art scene defined for article: ${slug}`);
  }
}

assertCoverage();
