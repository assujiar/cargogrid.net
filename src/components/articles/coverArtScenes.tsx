import type { ReactElement } from "react";
import { articleSlugs } from "../../content/articles";

/**
 * Per-article cover illustrations.
 *
 * Each article gets one full scene built around what it's actually about —
 * cartons piling up in a warehouse corner for the returns piece, a truck
 * pinned to a weighbridge for the ODOL piece — rendered as a complete
 * environment (sky, floor, depth layers, props) rather than a couple of icons
 * floating on a blank card. The backdrop helpers (RoadScene, WarehouseScene,
 * OfficeScene, DockScene) exist because most scenes are one of those four
 * settings; the object helpers (Truck, Carton, ...) exist because the same
 * objects recur across several scenes. Nothing here goes further than the
 * scenes actually use.
 *
 * No text: at 74px card height a label is unreadable anyway, so every scene
 * argues through iconography alone.
 */

const TEAL = "#0097b2";
const ORANGE = "#cb3421";
const INK = "#1e293b";

type Motif = () => ReactElement;

function Shadow({ cx, cy, rx, ry, opacity = 0.12 }: { cx: number; cy: number; rx: number; ry?: number; opacity?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx * 0.13} fill={INK} opacity={opacity} />;
}

function Cloud({ x, y, scale = 1, opacity = 0.4 }: { x: number; y: number; scale?: number; opacity?: number }) {
  const s = scale;
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={y} rx={22 * s} ry={10 * s} fill="#ffffff" />
      <circle cx={x - 14 * s} cy={y - 2 * s} r={9 * s} fill="#ffffff" />
      <circle cx={x + 6 * s} cy={y - 7 * s} r={12 * s} fill="#ffffff" />
      <circle cx={x + 20 * s} cy={y - 1 * s} r={8 * s} fill="#ffffff" />
    </g>
  );
}

function TreeCluster({ x, yBase, scale = 1, opacity = 0.4 }: { x: number; yBase: number; scale?: number; opacity?: number }) {
  const s = scale;
  const canopyY = yBase - 26 * s;
  return (
    <g opacity={opacity}>
      <rect x={x - 3 * s} y={yBase - 14 * s} width={6 * s} height={14 * s} fill={INK} opacity="0.5" />
      <circle cx={x - 10 * s} cy={canopyY + 4 * s} r={11 * s} fill={TEAL} />
      <circle cx={x + 10 * s} cy={canopyY + 4 * s} r={11 * s} fill={TEAL} />
      <circle cx={x} cy={canopyY - 6 * s} r={13 * s} fill={TEAL} />
    </g>
  );
}

function PottedPlant({ x, yBase, scale = 1, opacity = 0.55 }: { x: number; yBase: number; scale?: number; opacity?: number }) {
  const s = scale;
  return (
    <g opacity={opacity}>
      <path d={`M ${x - 10 * s} ${yBase} L ${x - 8 * s} ${yBase - 16 * s} L ${x + 8 * s} ${yBase - 16 * s} L ${x + 10 * s} ${yBase} Z`} fill={INK} opacity="0.35" />
      <circle cx={x - 6 * s} cy={yBase - 22 * s} r={8 * s} fill={TEAL} opacity="0.55" />
      <circle cx={x + 6 * s} cy={yBase - 22 * s} r={8 * s} fill={TEAL} opacity="0.55" />
      <circle cx={x} cy={yBase - 30 * s} r={9 * s} fill={TEAL} opacity="0.6" />
    </g>
  );
}

function Skyline({ yBase = 58, opacity = 0.1 }: { yBase?: number; opacity?: number }) {
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
    <g opacity={opacity} fill={INK}>
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
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#ffffff" opacity="0.25" />
      <g opacity="0.22">
        {buildings
          .filter((b) => x + b.dx + b.bw <= x + w - 2)
          .map((b, i) => (
            <rect key={i} x={x + b.dx} y={y + h - Math.min(b.bh, h - 4)} width={b.bw} height={Math.min(b.bh, h - 4)} fill={INK} />
          ))}
      </g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="none" stroke={INK} strokeOpacity="0.15" strokeWidth="1.5" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeOpacity="0.12" strokeWidth="1.5" />
    </g>
  );
}

/** Sky, faint skyline, a road strip with lane dashes, roadside trees. */
function RoadScene({ groundY = 128 }: { groundY?: number }) {
  return (
    <g>
      <Cloud x={70} y={26} scale={1} opacity={0.4} />
      <Cloud x={330} y={20} scale={0.8} opacity={0.32} />
      <Skyline yBase={groundY - 6} opacity={0.08} />
      <rect x="0" y={groundY} width="400" height={150 - groundY} fill={INK} opacity="0.09" />
      <line x1="0" y1={groundY} x2="400" y2={groundY} stroke={INK} strokeWidth="2" opacity="0.2" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={8 + i * 42} y={groundY + 11} width="20" height="3" rx="1.5" fill={INK} opacity="0.15" />
      ))}
      <TreeCluster x={14} yBase={groundY} scale={0.65} opacity={0.32} />
      <TreeCluster x={386} yBase={groundY} scale={0.75} opacity={0.36} />
    </g>
  );
}

/** Warehouse interior: angled roofline, high windows, faint distant racking, floor. */
function WarehouseScene({ groundY = 128 }: { groundY?: number }) {
  const wallY = 16;
  return (
    <g>
      <path d={`M 0 ${wallY} L 40 4 L 400 4 L 400 ${wallY}`} fill="none" stroke={INK} strokeWidth="2" opacity="0.14" />
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1={i * 20} y1={wallY} x2={i * 20} y2={groundY} stroke={INK} strokeWidth="1" opacity="0.045" />
      ))}
      {[60, 150, 240, 330].map((x, i) => (
        <rect key={i} x={x} y={wallY + 6} width="28" height="14" rx="2" fill="#ffffff" opacity="0.3" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={20 + i * 60} y={groundY - 34} width="16" height="34" fill={TEAL} opacity="0.07" />
      ))}
      <rect x="0" y={groundY} width="400" height={150 - groundY} fill={INK} opacity="0.08" />
      <line x1="0" y1={groundY} x2="400" y2={groundY} stroke={INK} strokeWidth="2" opacity="0.18" />
    </g>
  );
}

/** Desk scene: a window with a faint skyline, desk surface, a potted plant. */
function OfficeScene({ deskY = 122 }: { deskY?: number }) {
  return (
    <g>
      <WindowView x={266} y={14} w={114} h={72} />
      <rect x="0" y={deskY} width="400" height={150 - deskY} fill={INK} opacity="0.08" />
      <line x1="0" y1={deskY} x2="400" y2={deskY} stroke={INK} strokeWidth="2" opacity="0.18" />
      <PottedPlant x={26} yBase={deskY} scale={1} />
    </g>
  );
}

/** Dockside: sky, faint skyline, a water band with wave texture. */
function DockScene({ waterY = 120 }: { waterY?: number }) {
  return (
    <g>
      <Cloud x={60} y={24} scale={0.9} opacity={0.4} />
      <Cloud x={320} y={18} scale={0.7} opacity={0.3} />
      <Skyline yBase={waterY - 4} opacity={0.07} />
      <rect x="0" y={waterY} width="400" height={150 - waterY} fill={TEAL} opacity="0.16" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M ${i * 52} ${waterY + 10 + (i % 2) * 6} q 13 -5 26 0 t 26 0`} fill="none" stroke={TEAL} strokeWidth="1.5" opacity="0.2" />
      ))}
      <line x1="0" y1={waterY} x2="400" y2={waterY} stroke={INK} strokeWidth="2" opacity="0.18" />
    </g>
  );
}

function Truck({
  x,
  y,
  scale = 1,
  color = TEAL,
  bodyOpacity = 0.6,
  cabOpacity = 0.7,
  flagColor,
  shadow = true,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  bodyOpacity?: number;
  cabOpacity?: number;
  flagColor?: string;
  shadow?: boolean;
}) {
  const s = scale;
  return (
    <g>
      {shadow && <Shadow cx={x + 48 * s} cy={y + 4 * s} rx={52 * s} ry={7 * s} opacity={0.12} />}
      <rect x={x} y={y - 38 * s} width={64 * s} height={38 * s} rx={4 * s} fill={color} opacity={bodyOpacity} />
      <line x1={x} y1={y - 12 * s} x2={x + 64 * s} y2={y - 12 * s} stroke={INK} strokeOpacity="0.12" strokeWidth={1.5 * s} />
      <rect x={x + 6 * s} y={y - 33 * s} width={52 * s} height={4 * s} rx={2 * s} fill="#ffffff" opacity="0.25" />
      <path d={`M ${x + 64 * s} ${y - 26 * s} h ${18 * s} l ${14 * s} ${14 * s} v ${12 * s} h ${-32 * s} z`} fill={color} opacity={cabOpacity} />
      <rect x={x + 68 * s} y={y - 22 * s} width={11 * s} height={9 * s} rx={1.5 * s} fill="#ffffff" opacity="0.55" />
      <circle cx={x + 15 * s} cy={y} r={7 * s} fill={INK} opacity="0.72" />
      <circle cx={x + 15 * s} cy={y} r={3 * s} fill="#ffffff" opacity="0.4" />
      <circle cx={x + 80 * s} cy={y} r={7 * s} fill={INK} opacity="0.72" />
      <circle cx={x + 80 * s} cy={y} r={3 * s} fill="#ffffff" opacity="0.4" />
      {flagColor && <rect x={x + 24 * s} y={y - 52 * s} width={9 * s} height={7 * s} fill={flagColor} opacity="0.85" />}
    </g>
  );
}

function Carton({ x, y, w, h, fill = TEAL, opacity = 0.5 }: { x: number; y: number; w: number; h: number; fill?: string; opacity?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={fill} opacity={opacity} stroke={INK} strokeOpacity="0.3" strokeWidth="1.3" />
      <rect x={x + w / 2} y={y} width={w / 2} height={h} fill={INK} opacity="0.07" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeOpacity="0.3" strokeWidth="1.3" />
      <path d={`M ${x} ${y} L ${x + w / 2} ${y + h * 0.3} L ${x + w} ${y}`} fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1.3" />
    </g>
  );
}

function RackCell({ x, y, w = 30, h = 24, on = false }: { x: number; y: number; w?: number; h?: number; on?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx="4" fill={on ? TEAL : "#ffffff"} opacity={on ? 0.5 : 0.35} stroke={TEAL} strokeWidth="1" strokeOpacity="0.22" />;
}

function Coin({ x, y, r = 9, opacity = 0.75 }: { x: number; y: number; r?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r} fill={ORANGE} />
      <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.4" />
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
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#ffffff" opacity="0.9" stroke={INK} strokeOpacity="0.18" strokeWidth="1.2" />
      {dogEar && <path d={`M ${x + w - 14} ${y} L ${x + w} ${y} L ${x + w} ${y + 14} Z`} fill={INK} opacity="0.08" />}
      {Array.from({ length: lines }, (_, i) => {
        const isLast = accent && i === lines - 1;
        const ly = y + 14 + i * 10;
        return (
          <line key={i} x1={x + 8} y1={ly} x2={x + w - 8} y2={ly} stroke={isLast ? ORANGE : TEAL} strokeOpacity={isLast ? 0.6 : 0.32} strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
    </g>
  );
}

function Bubble({ x, y, w, h, fill, tailSide = "right" }: { x: number; y: number; w: number; h: number; fill: string; tailSide?: "left" | "right" }) {
  const tailX = tailSide === "right" ? x + w - 18 : x + 18;
  const dir = tailSide === "right" ? 1 : -1;
  return (
    <g opacity="0.4">
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} />
      <path d={`M ${tailX} ${y + h} l ${10 * dir} 14 l ${14 * dir} -14 z`} fill={fill} />
    </g>
  );
}

function Puff({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M ${x} ${y} q ${8 * scale} ${-10 * scale} 0 ${-20 * scale} q ${8 * scale} ${-8 * scale} ${-2 * scale} ${-18 * scale}`}
      fill="none"
      stroke={INK}
      strokeWidth={2.5 * scale}
      strokeLinecap="round"
      opacity="0.3"
    />
  );
}

/** Overloaded truck on a weighbridge, gauge needle buried in the red. */
const odolTimbanganJembatanMuatanLebih: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    <rect x="50" y="120" width="200" height="12" rx="2" fill={INK} opacity="0.2" />
    <rect x="50" y="120" width="200" height="4" fill="#ffffff" opacity="0.25" />
    <rect x="66" y="132" width="10" height="10" fill={INK} opacity="0.16" />
    <rect x="220" y="132" width="10" height="10" fill={INK} opacity="0.16" />
    <Truck x={84} y={120} scale={1.3} />
    <g transform="rotate(-8 119 60)">
      <Carton x={104} y={48} w={30} h={24} fill={ORANGE} opacity={0.85} />
    </g>
    <g transform="rotate(6 146 52)">
      <Carton x={132} y={40} w={28} h={22} fill={ORANGE} opacity={0.72} />
    </g>
    <g transform="rotate(-4 128 34)">
      <Carton x={114} y={24} w={26} h={20} fill={ORANGE} opacity={0.6} />
    </g>
    {Array.from({ length: 10 }, (_, i) => {
      const a = Math.PI + (i / 9) * Math.PI;
      const x1 = 322 + Math.cos(a) * 36;
      const y1 = 76 + Math.sin(a) * 36;
      const x2 = 322 + Math.cos(a) * 23;
      const y2 = 76 + Math.sin(a) * 23;
      const hot = i >= 6;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? ORANGE : TEAL} strokeWidth="5" strokeLinecap="round" opacity={hot ? 0.85 : 0.35} />;
    })}
    <circle cx="322" cy="76" r="44" fill="none" stroke={INK} strokeOpacity="0.12" strokeWidth="1.5" />
    <line x1="322" y1="76" x2="344" y2="50" stroke={INK} strokeWidth="3" opacity="0.8" strokeLinecap="round" />
    <circle cx="322" cy="76" r="5" fill={INK} opacity="0.85" />
  </g>
);

/** Truck stopped on the shoulder, hazard triangle out, engine steaming. */
const perawatanArmadaPreventifVsReaktif: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    <path d="M 58 126 L 74 96 L 90 126 Z" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinejoin="round" opacity="0.85" />
    <line x1="74" y1="106" x2="74" y2="116" stroke={ORANGE} strokeWidth="3" opacity="0.85" strokeLinecap="round" />
    <circle cx="74" cy="121" r="1.6" fill={ORANGE} opacity="0.85" />
    <Truck x={150} y={124} scale={1.3} />
    <Puff x={270} y={72} scale={1.1} />
    <Puff x={282} y={64} scale={0.75} />
    <g transform="translate(332 46) rotate(30)">
      <rect x="-3" y="-22" width="6" height="32" rx="3" fill={INK} opacity="0.4" />
      <circle cx="0" cy="-24" r="7" fill="none" stroke={INK} strokeWidth="4" opacity="0.4" />
    </g>
  </g>
);

/** Envelope of cash and a signed receipt, coins alongside, at a desk. */
const uangJalanKasKecilSopir: Motif = () => (
  <g>
    <OfficeScene deskY={122} />
    <Shadow cx={133} cy={122} rx={70} />
    <path d="M 66 44 L 200 44 L 200 118 L 66 118 Z" fill={TEAL} opacity="0.16" stroke={TEAL} strokeOpacity="0.42" strokeWidth="1.5" />
    <path d="M 66 44 L 133 86 L 200 44" fill="none" stroke={TEAL} strokeOpacity="0.48" strokeWidth="1.5" />
    <rect x="104" y="16" width="70" height="40" rx="4" fill={TEAL} opacity="0.58" />
    <rect x="112" y="24" width="54" height="24" rx="3" fill="#ffffff" opacity="0.55" />
    <circle cx="139" cy="36" r="7" fill={TEAL} opacity="0.72" />
    <Paper x={224} y={36} w={68} h={82} rotate={6} lines={4} accent />
    <Coin x={310} y={100} r={11} />
    <Coin x={332} y={110} r={8} opacity={0.55} />
    <Coin x={296} y={112} r={6} opacity={0.4} />
  </g>
);

/** A cracked carton beside a crossed-out insurance shield, camera documenting it. */
const asuransiCargoKlaimKerusakanBarang: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={96} cy={128} rx={54} />
    <Carton x={50} y={64} w={92} h={64} fill={TEAL} opacity={0.52} />
    <path d="M 70 64 L 84 96 L 74 102 L 96 128" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    <Carton x={26} y={100} w={40} h={28} fill={TEAL} opacity={0.3} />
    <path d="M 250 30 L 288 30 L 288 62 Q 288 92 269 108 Q 250 92 250 62 Z" fill={TEAL} opacity="0.22" stroke={TEAL} strokeOpacity="0.5" strokeWidth="2" />
    <line x1="256" y1="46" x2="282" y2="90" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <line x1="282" y1="46" x2="256" y2="90" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <g transform="translate(336 92)">
      <Shadow cx={0} cy={20} rx={26} ry={5} />
      <rect x="-20" y="-12" width="40" height="28" rx="5" fill={INK} opacity="0.55" />
      <rect x="-8" y="-20" width="16" height="10" rx="2" fill={INK} opacity="0.55" />
      <circle cx="0" cy="2" r="9" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.7" />
    </g>
  </g>
);

/** Two parties across a contract at a desk, the rate line ticking up. */
const negosiasiTarifTahunanKontrakShipper: Motif = () => (
  <g>
    <OfficeScene deskY={122} />
    <Shadow cx={200} cy={123} rx={58} />
    <Paper x={150} y={26} w={100} h={94} lines={5} />
    <g transform="rotate(-6 172 96)">
      <Paper x={148} y={70} w={48} h={50} lines={2} />
    </g>
    <Bubble x={20} y={34} w={78} h={52} fill={TEAL} tailSide="right" />
    <Bubble x={302} y={34} w={78} h={52} fill={ORANGE} tailSide="left" />
    <path d="M 160 92 L 184 76 L 206 84 L 228 58 L 242 46" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
    <circle cx="242" cy="46" r="4" fill={ORANGE} opacity="0.85" />
  </g>
);

/** Trucks queued nose to tail on the shoulder, the standby one flagged, demand spiking. */
const lonjakanMusimanKapasitasPeakSeason: Motif = () => (
  <g>
    <RoadScene groundY={128} />
    {[0, 1, 2, 3].map((i) => (
      <Truck key={i} x={20 + i * 66} y={124} scale={0.8} bodyOpacity={i === 3 ? 0.78 : 0.32} cabOpacity={i === 3 ? 0.82 : 0.4} flagColor={i === 3 ? ORANGE : undefined} />
    ))}
    <g transform="translate(318 26)">
      <path d="M 0 76 L 14 54 L 28 62 L 42 22 L 58 6 L 58 82 L 0 82 Z" fill={ORANGE} opacity="0.08" />
      <path d="M 0 76 L 14 54 L 28 62 L 42 22 L 58 6" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" opacity="0.78" />
      <circle cx="58" cy="6" r="4.5" fill={ORANGE} opacity="0.9" />
    </g>
  </g>
);

/** A tangle of chat bubbles over a desk standing in for a system, one flagged urgent. */
const grupWhatsappSistemOperasionalBayangan: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <g transform="translate(40 96)">
      <Shadow cx={0} cy={8} rx={10} ry={3} />
      <rect x="-14" y="-4" width="28" height="10" rx="2" fill={INK} opacity="0.18" />
      <path d="M -8 -4 q 8 -10 16 0" fill="none" stroke={INK} strokeWidth="2" opacity="0.25" />
    </g>
    <Bubble x={70} y={20} w={84} h={44} fill={TEAL} tailSide="right" />
    <Bubble x={170} y={12} w={70} h={40} fill={TEAL} tailSide="left" />
    <Bubble x={130} y={62} w={92} h={46} fill={TEAL} tailSide="right" />
    <Bubble x={244} y={36} w={78} h={44} fill={ORANGE} tailSide="left" />
    <Bubble x={266} y={86} w={70} h={38} fill={TEAL} tailSide="right" />
    <g transform="translate(283 58)">
      <rect x="-3" y="-14" width="6" height="16" rx="3" fill="#ffffff" opacity="0.9" />
      <circle cx="0" cy="8" r="3.4" fill="#ffffff" opacity="0.9" />
    </g>
  </g>
);

/** An ID badge pulled away from a desk while an access panel gets crossed out. */
const aksesSistemSaatKaryawanResign: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <rect x="160" y="20" width="100" height="100" rx="14" fill={TEAL} opacity="0.14" stroke={TEAL} strokeOpacity="0.4" strokeWidth="1.5" />
    <rect x="188" y="62" width="44" height="36" rx="6" fill={TEAL} opacity="0.6" />
    <path d="M 196 62 v-14 a14 14 0 0 1 28 0 v14" fill="none" stroke={TEAL} strokeWidth="6" opacity="0.6" />
    <circle cx="210" cy="78" r="5" fill="#ffffff" opacity="0.8" />
    <line x1="170" y1="30" x2="250" y2="110" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <line x1="250" y1="30" x2="170" y2="110" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <g transform="translate(70 66) rotate(-14)">
      <Shadow cx={0} cy={40} rx={28} />
      <rect x="-24" y="-32" width="48" height="64" rx="8" fill="#ffffff" opacity="0.9" stroke={INK} strokeOpacity="0.2" strokeWidth="1.5" />
      <circle cx="0" cy="-10" r="12" fill={TEAL} opacity="0.45" />
      <rect x="-16" y="8" width="32" height="6" rx="3" fill={TEAL} opacity="0.4" />
      <rect x="-16" y="18" width="24" height="6" rx="3" fill={TEAL} opacity="0.3" />
    </g>
  </g>
);

/** A leaning stack of return cartons filling a warehouse corner, a pallet jack alongside. */
const returBarangReverseLogisticsGudang: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={70} cy={128} rx={66} ry={7} opacity={0.13} />
    <g transform="translate(40 0)">
      <Carton x={0} y={92} w={54} h={36} fill={TEAL} opacity={0.55} />
      <g transform="rotate(-6 27 74)">
        <Carton x={0} y={56} w={54} h={36} fill={TEAL} opacity={0.42} />
      </g>
      <g transform="rotate(7 27 40)">
        <Carton x={2} y={20} w={50} h={34} fill={ORANGE} opacity={0.82} />
      </g>
    </g>
    <g transform="translate(67 37)">
      <path d="M -6 -7 A 9 9 0 1 1 -9 3" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.9" strokeLinecap="round" />
      <path d="M -9 3 l -6 -2 l 2 -7 z" fill="#ffffff" opacity="0.9" />
    </g>
    <Shadow cx={171} cy={128} rx={40} ry={5} opacity={0.1} />
    <Carton x={150} y={100} w={42} h={28} fill={TEAL} opacity={0.32} />
    <g transform="rotate(-4 171 100)">
      <Carton x={150} y={76} w={42} h={28} fill={TEAL} opacity={0.26} />
    </g>
    <Carton x={280} y={102} w={46} h={26} fill={TEAL} opacity={0.4} />
    <g transform="translate(340 104)">
      <rect x="-8" y="16" width="46" height="6" rx="2" fill={INK} opacity="0.22" />
      <line x1="-8" y1="16" x2="-8" y2="-14" stroke={INK} strokeWidth="4" opacity="0.22" strokeLinecap="round" />
      <line x1="-8" y1="-14" x2="6" y2="-20" stroke={INK} strokeWidth="4" opacity="0.22" strokeLinecap="round" />
      <circle cx="0" cy="24" r="5" fill={INK} opacity="0.22" />
      <circle cx="30" cy="24" r="5" fill={INK} opacity="0.22" />
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
      <line x1="26" y1="18" x2="26" y2="88" stroke={INK} strokeWidth="2.5" opacity="0.2" />
      <line x1="298" y1="18" x2="298" y2="88" stroke={INK} strokeWidth="2.5" opacity="0.2" />
      {cells.map((cell, i) => (
        <RackCell key={i} x={cell.x} y={cell.y} w={28} h={24} on={i % 5 === 0} />
      ))}
      <rect x="64" y="54" width="28" height="24" rx="4" fill={ORANGE} opacity="0.85" />
      <g transform="translate(200 118)">
        <circle cx="0" cy="-30" r="6" fill={INK} opacity="0.4" />
        <path d="M 0 -24 v 16 M -8 -8 L 0 -14 L 8 -8 M -6 8 L 0 -8 L 6 8" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </g>
      <rect x="326" y="98" width="50" height="32" rx="4" fill={TEAL} opacity="0.5" />
      <path d="M 326 98 l 25 -14 l 25 14" fill="none" stroke={TEAL} strokeWidth="2" opacity="0.5" />
      <path d="M 78 78 C 140 128, 260 128, 336 114" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeDasharray="6 6" opacity="0.75" strokeLinecap="round" />
      <circle cx="336" cy="114" r="4" fill={ORANGE} opacity="0.85" />
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
      <path d="M 0 0 h48 v58 l-14 -6 v-46 z" fill="#ffffff" opacity="0.85" stroke={INK} strokeOpacity="0.2" strokeWidth="1.2" />
      <line x1="8" y1="16" x2="40" y2="16" stroke={ORANGE} strokeOpacity="0.5" strokeWidth="2.4" />
      <line x1="8" y1="26" x2="40" y2="26" stroke={ORANGE} strokeOpacity="0.4" strokeWidth="2.4" />
    </g>
    <Coin x={300} y={100} r={9} />
    <Coin x={322} y={112} r={7} opacity={0.55} />
    <Coin x={340} y={98} r={6} opacity={0.4} />
    <Coin x={352} y={116} r={5} opacity={0.32} />
  </g>
);

/** A calendar with day 30 circled at a desk, stretching to a red day 60. */
const rekonsiliasiInvoiceForwarderTerlambat: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={140} cy={126} rx={104} />
    <rect x="40" y="26" width="200" height="98" rx="10" fill="#ffffff" opacity="0.85" stroke={INK} strokeOpacity="0.16" strokeWidth="1.4" />
    <rect x="40" y="26" width="200" height="24" rx="10" fill={TEAL} opacity="0.5" />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, c) => <circle key={`${r}-${c}`} cx={58 + c * 26} cy={68 + r * 14} r="2.2" fill={INK} opacity="0.15" />))}
    <circle cx={58 + 26} cy={68} r="9" fill="none" stroke={TEAL} strokeWidth="2.4" opacity="0.8" />
    <path d="M 96 68 C 200 40, 300 40, 330 90" fill="none" stroke={ORANGE} strokeWidth="2.6" strokeDasharray="6 6" opacity="0.75" strokeLinecap="round" />
    <g transform="translate(330 90)">
      <Shadow cx={0} cy={22} rx={20} ry={4} />
      <circle r="16" fill={ORANGE} opacity="0.85" />
      <line x1="0" y1="0" x2="0" y2="-8" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
      <line x1="0" y1="0" x2="6" y2="4" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
    </g>
  </g>
);

/** Job bars on a desk monitor, the last one dipping below zero under a magnifier. */
const marginPerJobForwarder: Motif = () => {
  const jobs = [62, 44, 70, 50, -34];
  return (
    <g>
      <OfficeScene deskY={128} />
      <rect x="24" y="18" width="352" height="106" rx="8" fill="#ffffff" opacity="0.35" stroke={INK} strokeOpacity="0.1" strokeWidth="1.2" />
      <line x1="40" y1="90" x2="360" y2="90" stroke={INK} strokeWidth="1.5" opacity="0.18" />
      {jobs.map((v, i) => (
        <rect key={i} x={60 + i * 62} y={v >= 0 ? 90 - v : 90} width="34" height={Math.abs(v)} rx="5" fill={v < 0 ? ORANGE : TEAL} opacity={v < 0 ? 0.85 : 0.42} />
      ))}
      <g transform="translate(338 107)">
        <circle r="16" fill="none" stroke={INK} strokeWidth="3" opacity="0.55" />
        <line x1="11" y1="11" x2="22" y2="22" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      </g>
    </g>
  );
};

/** A narrowing funnel over a desk, a rejected pile at the base, one quotation escaping through. */
const alurRfqFreightForwarding: Motif = () => (
  <g>
    <OfficeScene deskY={132} />
    {[0, 1, 2, 3].map((i) => {
      const w = 280 - i * 58;
      return <rect key={i} x={200 - w / 2} y={14 + i * 24} width={w} height="17" rx="7" fill={i === 3 ? TEAL : INK} opacity={i === 3 ? 0.55 : 0.1 + i * 0.06} />;
    })}
    <Shadow cx={92} cy={130} rx={40} ry={5} opacity={0.1} />
    <g transform="rotate(-8 85 128)">
      <Carton x={70} y={118} w={30} h={20} fill={INK} opacity={0.28} />
    </g>
    <g transform="rotate(6 106 131)">
      <Carton x={92} y={122} w={28} h={18} fill={INK} opacity={0.22} />
    </g>
    <path d="M 200 40 C 200 76, 280 92, 320 116" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeDasharray="5 6" opacity="0.75" />
    <g transform="translate(320 116)">
      <Shadow cx={0} cy={14} rx={14} ry={3.5} />
      <circle r="10" fill={ORANGE} opacity="0.9" />
      <path d="M -4 0 l 3 4 l 6 -8" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

/** A fleet-yard hub of trucks, reliable vendors solid, the shaky ones dashed and loud. */
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
            <line x1="200" y1="78" x2={x} y2={y} stroke={v.reliable ? TEAL : ORANGE} strokeWidth="2" strokeDasharray={v.reliable ? undefined : "4 5"} opacity={v.reliable ? 0.4 : 0.55} />
            <circle cx={x} cy={y} r="9" fill={v.reliable ? TEAL : ORANGE} opacity={v.reliable ? 0.6 : 0.5} />
          </g>
        );
      })}
      <circle cx="200" cy="78" r="18" fill={TEAL} opacity="0.75" />
      <rect x="192" y="70" width="16" height="12" rx="2" fill="#ffffff" opacity="0.8" />
    </g>
  );
};

/** A portal window on a desk with a status timeline inside, a crossed-out phone beside it. */
const customerPortalLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={155} cy={126} rx={120} />
    <rect x="40" y="20" width="230" height="106" rx="10" fill="#ffffff" opacity="0.9" stroke={INK} strokeOpacity="0.15" strokeWidth="1.4" />
    <rect x="40" y="20" width="230" height="18" rx="10" fill={TEAL} opacity="0.45" />
    <circle cx="52" cy="29" r="3" fill="#ffffff" opacity="0.8" />
    <circle cx="62" cy="29" r="3" fill="#ffffff" opacity="0.6" />
    <line x1="62" y1="78" x2="248" y2="78" stroke={INK} strokeWidth="2" opacity="0.14" />
    {[62, 124, 186, 248].map((x, i) => (
      <circle key={i} cx={x} cy="78" r={i < 3 ? 7 : 9} fill={i < 3 ? TEAL : ORANGE} opacity={i < 3 ? 0.55 : 0.85} />
    ))}
    <line x1="62" y1="100" x2="200" y2="100" stroke={TEAL} strokeWidth="6" opacity="0.25" strokeLinecap="round" />
    <line x1="62" y1="112" x2="150" y2="112" stroke={TEAL} strokeWidth="6" opacity="0.18" strokeLinecap="round" />
    <g transform="translate(330 73)">
      <Shadow cx={0} cy={30} rx={18} />
      <rect x="-14" y="-24" width="28" height="48" rx="7" fill={INK} opacity="0.35" />
      <line x1="-22" y1="22" x2="22" y2="-22" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    </g>
  </g>
);

/** A dockside crane over stacked containers, a clock ticking into the red. */
const demurrageDetentionPelabuhan: Motif = () => (
  <g>
    <DockScene waterY={122} />
    <Shadow cx={145} cy={122} rx={80} opacity={0.14} />
    <line x1="70" y1="122" x2="70" y2="24" stroke={INK} strokeWidth="4" opacity="0.3" />
    <line x1="70" y1="28" x2="180" y2="28" stroke={INK} strokeWidth="4" opacity="0.3" />
    <line x1="150" y1="28" x2="150" y2="58" stroke={INK} strokeWidth="2.5" opacity="0.3" />
    <rect x="100" y="88" width="60" height="34" rx="3" fill={TEAL} opacity="0.55" />
    <rect x="164" y="88" width="60" height="34" rx="3" fill={TEAL} opacity="0.4" />
    <rect x="112" y="50" width="60" height="34" rx="3" fill={TEAL} opacity="0.48" />
    <line x1="130" y1="50" x2="112" y2="64" stroke={INK} strokeWidth="2" opacity="0.2" />
    <circle cx="310" cy="70" r="38" fill="#ffffff" opacity="0.85" stroke={INK} strokeOpacity="0.16" strokeWidth="1.6" />
    <path d="M 310 70 L 310 36 A 34 34 0 0 1 340 88 Z" fill={ORANGE} opacity="0.4" />
    <line x1="310" y1="70" x2="310" y2="40" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    <line x1="310" y1="70" x2="332" y2="84" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    <circle cx="310" cy="70" r="4" fill={INK} opacity="0.8" />
  </g>
);

/** A truck and a ship strung along one dashed route where land meets water. */
const trackingMultimodaIndonesia: Motif = () => (
  <g>
    <Cloud x={70} y={22} scale={0.9} opacity={0.4} />
    <Cloud x={310} y={16} scale={0.75} opacity={0.32} />
    <Skyline yBase={70} opacity={0.08} />
    <path d="M 0 96 Q 140 108, 190 92 Q 260 74, 400 100 L 400 150 L 0 150 Z" fill={TEAL} opacity="0.15" />
    {Array.from({ length: 5 }, (_, i) => (
      <path key={i} d={`M ${140 + i * 48} ${112 + (i % 2) * 6} q 12 -5 24 0 t 24 0`} fill="none" stroke={TEAL} strokeWidth="1.4" opacity="0.16" />
    ))}
    <rect x="0" y="122" width="150" height="28" fill={INK} opacity="0.07" />
    <path d="M 55 78 C 140 40, 220 100, 300 56 S 360 40, 372 30" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeDasharray="6 6" opacity="0.7" strokeLinecap="round" />
    <Truck x={16} y={132} scale={0.62} />
    <g transform="translate(190 100)">
      <Shadow cx={0} cy={18} rx={30} />
      <path d="M -26 0 L 26 0 L 18 16 L -18 16 Z" fill={TEAL} opacity="0.55" />
      <line x1="0" y1="0" x2="0" y2="-24" stroke={INK} strokeWidth="2" opacity="0.4" />
      <path d="M 0 -24 L 16 -14 L 0 -8 Z" fill={TEAL} opacity="0.4" />
    </g>
    <g transform="translate(372 30)">
      <path d="M 0 0 C -12 -14, -12 -30, 0 -30 C 12 -30, 12 -14, 0 0 Z" fill={ORANGE} opacity="0.85" />
      <circle cx="0" cy="-21" r="4.5" fill="#ffffff" opacity="0.9" />
    </g>
  </g>
);

/** A cab windshield onto the road, a wheel, and an idle crossed-out phone on the dash. */
const adopsiAplikasiDriver: Motif = () => (
  <g>
    <path d="M 0 0 H 400 V 70 Q 200 30 0 70 Z" fill={TEAL} opacity="0.06" />
    <Cloud x={90} y={26} scale={0.55} opacity={0.35} />
    <Cloud x={260} y={20} scale={0.45} opacity={0.28} />
    <rect x="0" y="70" width="400" height="80" fill={INK} opacity="0.05" />
    <circle cx="110" cy="86" r="46" fill="none" stroke={TEAL} strokeWidth="8" opacity="0.35" />
    <circle cx="110" cy="86" r="10" fill={TEAL} opacity="0.4" />
    <line x1="110" y1="86" x2="110" y2="44" stroke={TEAL} strokeWidth="6" opacity="0.35" />
    <line x1="110" y1="86" x2="76" y2="108" stroke={TEAL} strokeWidth="6" opacity="0.35" />
    <line x1="110" y1="86" x2="144" y2="108" stroke={TEAL} strokeWidth="6" opacity="0.35" />
    <rect x="60" y="130" width="100" height="10" rx="3" fill={INK} opacity="0.14" />
    <g transform="translate(230 46)">
      <Shadow cx={0} cy={70} rx={20} />
      <rect x="-16" y="-30" width="32" height="60" rx="7" fill={INK} opacity="0.55" />
      <rect x="-11" y="-24" width="22" height="40" rx="2" fill={INK} opacity="0.35" />
      <line x1="-20" y1="30" x2="20" y2="-30" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    </g>
    <Paper x={286} y={76} w={64} h={54} rotate={-4} lines={3} accent />
  </g>
);

/** A dashboard on a desk: an on-time ring near full, one incident dot enlarged, an eye reading it. */
const kpiOperasionalLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={155} cy={126} rx={120} />
    <rect x="40" y="20" width="230" height="106" rx="12" fill="#ffffff" opacity="0.88" stroke={INK} strokeOpacity="0.14" strokeWidth="1.4" />
    <g transform="translate(102 74)">
      <circle r="34" fill="none" stroke={TEAL} strokeOpacity="0.18" strokeWidth="10" />
      <path d="M 0 -34 A 34 34 0 1 1 -6 -33.5" fill="none" stroke={TEAL} strokeWidth="10" strokeLinecap="round" opacity="0.7" />
    </g>
    <g transform="translate(206 60)">
      <rect x="-34" y="0" width="68" height="30" rx="6" fill={ORANGE} opacity="0.12" />
      <circle cx="-18" cy="15" r="5" fill={ORANGE} opacity="0.3" />
      <circle cx="0" cy="15" r="5" fill={ORANGE} opacity="0.3" />
      <circle cx="18" cy="15" r="7" fill={ORANGE} opacity="0.85" />
    </g>
    <g transform="translate(330 75)">
      <path d="M -30 0 C -18 -20, 18 -20, 30 0 C 18 20, -18 20, -30 0 Z" fill="none" stroke={TEAL} strokeWidth="3" opacity="0.5" />
      <circle cx="0" cy="0" r="9" fill={TEAL} opacity="0.55" />
    </g>
  </g>
);

/** A vague, unlabeled pile of stock beside a precise, checked-off bin grid. */
const wms3plLevelBin: Motif = () => (
  <g>
    <WarehouseScene groundY={128} />
    <Shadow cx={90} cy={126} rx={60} />
    <path d="M 30 124 C 20 90, 50 60, 90 66 C 110 40, 150 46, 150 76 C 170 84, 160 116, 140 124 Z" fill={INK} opacity="0.16" />
    <line x1="200" y1="16" x2="200" y2="134" stroke={INK} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.16" />
    <line x1="224" y1="24" x2="224" y2="108" stroke={INK} strokeWidth="2" opacity="0.16" />
    <line x1="368" y1="24" x2="368" y2="108" stroke={INK} strokeWidth="2" opacity="0.16" />
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 4 }, (_, c) => <RackCell key={`${r}-${c}`} x={228 + c * 34} y={30 + r * 40} w={28} h={30} on />))}
    <path d="M 236 45 l 6 6 l 12 -12" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
  </g>
);

/** A spreadsheet grid on a desk monitor with cells spilling loose past its own border. */
const kapanExcelBerhentiCukup: Motif = () => (
  <g>
    <OfficeScene deskY={132} />
    <Shadow cx={170} cy={130} rx={120} />
    <rect x="60" y="18" width="220" height="110" rx="6" fill="#ffffff" opacity="0.85" stroke={INK} strokeOpacity="0.16" strokeWidth="1.4" />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={64 + c * 36} y={22 + r * 21} width="34" height="19" fill="none" stroke={TEAL} strokeOpacity="0.28" strokeWidth="1" />))}
    <rect x="286" y="32" width="26" height="17" rx="2" fill={ORANGE} opacity="0.6" transform="rotate(8 299 40)" />
    <rect x="300" y="56" width="26" height="17" rx="2" fill={ORANGE} opacity="0.75" transform="rotate(-6 313 64)" />
    <rect x="292" y="84" width="26" height="17" rx="2" fill={ORANGE} opacity="0.5" transform="rotate(12 305 92)" />
    <path d="M 210 18 L 224 58 L 206 76 L 230 128" fill="none" stroke={ORANGE} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
  </g>
);

/** A logistics panel and an accounting panel on a desk, plugged together in the middle. */
const integrasiErpAkuntansiLogistik: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <Shadow cx={95} cy={126} rx={70} />
    <Shadow cx={305} cy={126} rx={70} />
    <rect x="30" y="28" width="130" height="94" rx="12" fill={TEAL} opacity="0.14" stroke={TEAL} strokeOpacity="0.35" strokeWidth="1.4" />
    <Truck x={64} y={100} scale={0.85} shadow={false} />
    <rect x="240" y="28" width="130" height="94" rx="12" fill={ORANGE} opacity="0.12" stroke={ORANGE} strokeOpacity="0.35" strokeWidth="1.4" />
    <Coin x={290} y={70} r={14} />
    <Coin x={314} y={84} r={10} opacity={0.6} />
    <Paper x={286} y={92} w={54} h={30} lines={2} />
    <line x1="160" y1="76" x2="240" y2="76" stroke={INK} strokeWidth="2.5" strokeDasharray="5 6" opacity="0.4" />
    <circle cx="200" cy="76" r="13" fill={TEAL} opacity="0.7" />
    <path d="M 194 76 h12 M 200 70 v12" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
  </g>
);

/** A wall of shelved binders behind one dusty ring binder handing off to a checked digital folder. */
const dokumenKepabeananArsipDigital: Motif = () => (
  <g>
    <rect x="0" y="10" width="400" height="118" fill={INK} opacity="0.04" />
    {Array.from({ length: 3 }, (_, i) => (
      <line key={i} x1="0" y1={26 + i * 34} x2="400" y2={26 + i * 34} stroke={INK} strokeWidth="3" opacity="0.14" />
    ))}
    {[10, 34, 58, 82, 106].map((x, i) => (
      <rect key={i} x={x} y="26" width="18" height="34" fill={INK} opacity={0.12 + (i % 2) * 0.05} />
    ))}
    {[10, 34, 58, 82, 106].map((x, i) => (
      <rect key={`b-${i}`} x={x} y="60" width="18" height="34" fill={INK} opacity={0.1 + (i % 3) * 0.04} />
    ))}
    <rect x="0" y="128" width="400" height="22" fill={INK} opacity="0.07" />
    <g transform="translate(150 20)">
      <Shadow cx={35} cy={108} rx={42} />
      <rect x="0" y="0" width="70" height="104" rx="4" fill={INK} opacity="0.32" />
      <rect x="0" y="0" width="14" height="104" fill={INK} opacity="0.2" />
      {[16, 40, 64, 88].map((y, i) => (
        <circle key={i} cx="7" cy={y} r="3" fill="#ffffff" opacity="0.5" />
      ))}
      <circle cx="30" cy="-8" r="1.4" fill={INK} opacity="0.3" />
      <circle cx="46" cy="-14" r="1.8" fill={INK} opacity="0.25" />
      <circle cx="58" cy="-6" r="1.2" fill={INK} opacity="0.3" />
    </g>
    <path d="M 246 72 L 300 72" stroke={ORANGE} strokeWidth="2.5" strokeDasharray="6 6" opacity="0.7" strokeLinecap="round" />
    <path d="M 292 64 L 304 72 L 292 80" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    <g transform="translate(320 44)">
      <Shadow cx={35} cy={82} rx={42} />
      <path d="M 0 12 h28 l8 -10 h34 a6 6 0 0 1 6 6 v60 a6 6 0 0 1 -6 6 h-62 a6 6 0 0 1 -6 -6 v-50 a6 6 0 0 1 6 -6 z" fill={TEAL} opacity="0.5" />
      <circle cx="35" cy="46" r="9" fill="#ffffff" opacity="0.7" />
      <path d="M 31 46 l 3 3 l 6 -7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </g>
  </g>
);

/** A fork from one decision at a desk: a short 30-day strip, or a long full-speed run. */
const memilihSoftwareLogistikPilot30Hari: Motif = () => (
  <g>
    <OfficeScene deskY={128} />
    <circle cx="46" cy="75" r="10" fill={TEAL} opacity="0.8" />
    <path d="M 56 70 C 110 44, 160 40, 210 40" fill="none" stroke={TEAL} strokeWidth="2.5" opacity="0.45" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={216 + i * 16} y="30" width="12" height="20" rx="2" fill={TEAL} opacity="0.5" />
    ))}
    <path d="M 56 80 C 140 108, 220 118, 300 120" fill="none" stroke={ORANGE} strokeWidth="2.5" opacity="0.5" strokeDasharray="7 6" />
    <path d="M 300 120 h 40 l -10 -8 M 340 120 l -10 8" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
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
