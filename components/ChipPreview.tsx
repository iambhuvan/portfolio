'use client';

export type ChipTheme = {
  id: string;
  name: string;
  desc: string;
  bg: string;
  bgGlowA: string;
  bgGlowB: string;
  text: string;
  textDim: string;
  accent: string;
  accentDim: string;
  chipBg: string;
  chipStroke: string;
  hbmStroke: string;
  hbmFill: string;
  tile: string;
  tileLit: string;
  tileStroke: string;
  pcbGrid: string;
  trace: string;
  bga: string;
  italicAccent: string;
  hudBg: string;
  // chip rendering style
  chipStyle: 'die' | 'wireframe' | 'iso' | 'blueprint';
};

export const themes: ChipTheme[] = [
  {
    id: 'A',
    name: 'Copper Amber',
    desc: 'Warm dark + brushed copper. Current direction.',
    bg: '#080603',
    bgGlowA: 'rgba(110,55,18,0.55)',
    bgGlowB: 'rgba(180,90,30,0.28)',
    text: '#f4e4c4',
    textDim: '#bda081',
    accent: '#e8a85a',
    accentDim: 'rgba(232,168,90,0.4)',
    chipBg: '#0d0805',
    chipStroke: '#a86a2a',
    hbmStroke: '#c87a30',
    hbmFill: '#1a0e05',
    tile: '#1c1108',
    tileLit: '#e8a85a',
    tileStroke: '#a86a2a',
    pcbGrid: '#3a2410',
    trace: '#5a3413',
    bga: '#e8a85a',
    italicAccent: '#f0d8b0',
    hudBg: '#0d0805',
    chipStyle: 'die',
  },
  {
    id: 'B',
    name: 'NVIDIA Green',
    desc: 'Signature NVIDIA green on jet black. Brand-correct.',
    bg: '#000000',
    bgGlowA: 'rgba(118,185,0,0.32)',
    bgGlowB: 'rgba(50,90,0,0.20)',
    text: '#eaf6d6',
    textDim: '#9ab27a',
    accent: '#76b900',
    accentDim: 'rgba(118,185,0,0.4)',
    chipBg: '#040804',
    chipStroke: '#3a6700',
    hbmStroke: '#76b900',
    hbmFill: '#0a1505',
    tile: '#0a1505',
    tileLit: '#76b900',
    tileStroke: '#3a6700',
    pcbGrid: '#1a2a08',
    trace: '#2a4a08',
    bga: '#76b900',
    italicAccent: '#cfeb96',
    hudBg: '#040804',
    chipStyle: 'die',
  },
  {
    id: 'C',
    name: 'Cyan Silicon',
    desc: 'Deep navy + electric cyan. Cool, technical, clinical.',
    bg: '#03060d',
    bgGlowA: 'rgba(34,211,238,0.20)',
    bgGlowB: 'rgba(99,102,241,0.16)',
    text: '#e6f6fb',
    textDim: '#7d97a8',
    accent: '#22d3ee',
    accentDim: 'rgba(34,211,238,0.4)',
    chipBg: '#04080d',
    chipStroke: '#0e7490',
    hbmStroke: '#22d3ee',
    hbmFill: '#06121c',
    tile: '#0a1521',
    tileLit: '#22d3ee',
    tileStroke: '#0e7490',
    pcbGrid: '#0e2438',
    trace: '#1a3a52',
    bga: '#22d3ee',
    italicAccent: '#a5f3fc',
    hudBg: '#04080d',
    chipStyle: 'die',
  },
  {
    id: 'D',
    name: 'Plasma Magenta',
    desc: 'HBM thermal-trace energy. Hot pink on black.',
    bg: '#0a0210',
    bgGlowA: 'rgba(236,72,153,0.30)',
    bgGlowB: 'rgba(124,58,237,0.22)',
    text: '#fde8f3',
    textDim: '#a890ad',
    accent: '#ec4899',
    accentDim: 'rgba(236,72,153,0.4)',
    chipBg: '#0c0410',
    chipStroke: '#7e1d4a',
    hbmStroke: '#ec4899',
    hbmFill: '#180820',
    tile: '#1a0820',
    tileLit: '#ec4899',
    tileStroke: '#7e1d4a',
    pcbGrid: '#2a0a30',
    trace: '#3a1248',
    bga: '#ec4899',
    italicAccent: '#fbcfe8',
    hudBg: '#0c0410',
    chipStyle: 'die',
  },
  {
    id: 'E',
    name: 'Phosphor CRT',
    desc: 'Pure terminal green on jet black. Hacker-precise, retro.',
    bg: '#000503',
    bgGlowA: 'rgba(34,255,136,0.16)',
    bgGlowB: 'rgba(34,255,136,0.08)',
    text: '#d8ffe6',
    textDim: '#6e9a82',
    accent: '#22ff88',
    accentDim: 'rgba(34,255,136,0.4)',
    chipBg: '#04120a',
    chipStroke: '#1a8a4a',
    hbmStroke: '#22ff88',
    hbmFill: '#06180c',
    tile: '#06180c',
    tileLit: '#22ff88',
    tileStroke: '#1a8a4a',
    pcbGrid: '#0a3018',
    trace: '#0e4524',
    bga: '#22ff88',
    italicAccent: '#86efac',
    hudBg: '#04120a',
    chipStyle: 'die',
  },
  {
    id: 'F',
    name: 'Architect Blueprint',
    desc: 'Deep prussian blue + ivory line-art. Engineering drawing.',
    bg: '#0a1830',
    bgGlowA: 'rgba(244,235,214,0.10)',
    bgGlowB: 'rgba(244,235,214,0.05)',
    text: '#f4ebd6',
    textDim: '#a89e85',
    accent: '#f4ebd6',
    accentDim: 'rgba(244,235,214,0.4)',
    chipBg: 'transparent',
    chipStroke: '#f4ebd6',
    hbmStroke: '#f4ebd6',
    hbmFill: 'transparent',
    tile: 'transparent',
    tileLit: '#f4ebd6',
    tileStroke: '#f4ebd6',
    pcbGrid: '#1c3055',
    trace: '#2a4475',
    bga: '#f4ebd6',
    italicAccent: '#f4ebd6',
    hudBg: '#0a1830',
    chipStyle: 'wireframe',
  },
  {
    id: 'G',
    name: 'Iridescent Silicon',
    desc: 'Multi-hue gradient like silicon under a microscope.',
    bg: '#02021a',
    bgGlowA: 'rgba(124,58,237,0.30)',
    bgGlowB: 'rgba(34,211,238,0.22)',
    text: '#fafaff',
    textDim: '#a8a8c8',
    accent: '#a78bfa',
    accentDim: 'rgba(167,139,250,0.4)',
    chipBg: '#08081f',
    chipStroke: '#7c3aed',
    hbmStroke: '#22d3ee',
    hbmFill: '#0c0a26',
    tile: '#0c0a26',
    tileLit: '#a78bfa',
    tileStroke: '#5b21b6',
    pcbGrid: '#1a1240',
    trace: '#2a1d6a',
    bga: '#ec4899',
    italicAccent: '#c4b5fd',
    hudBg: '#08081f',
    chipStyle: 'die',
  },
  {
    id: 'H',
    name: 'Carbon + Rose Gold',
    desc: 'Charcoal substrate with warm rose-gold accents. Premium hardware.',
    bg: '#0a0a0c',
    bgGlowA: 'rgba(232,168,124,0.18)',
    bgGlowB: 'rgba(192,133,82,0.12)',
    text: '#f5f0eb',
    textDim: '#a89890',
    accent: '#e8a87c',
    accentDim: 'rgba(232,168,124,0.4)',
    chipBg: '#15131a',
    chipStroke: '#c08552',
    hbmStroke: '#e8a87c',
    hbmFill: '#1a1620',
    tile: '#1a1620',
    tileLit: '#e8a87c',
    tileStroke: '#7a5a40',
    pcbGrid: '#2a2530',
    trace: '#3a3038',
    bga: '#e8a87c',
    italicAccent: '#fbd5b5',
    hudBg: '#15131a',
    chipStyle: 'die',
  },
];

type Chip = {
  id: string;
  vendor: string;
  name: string;
  arch: string;
  specs: string;
  tile: { rows: number; cols: number };
  hbm: number;
  col: [number, number];
  row: [number, number];
};

const PREVIEW_CHIPS: Chip[] = [
  {
    id: 'b200',
    vendor: 'NVIDIA',
    name: 'B200',
    arch: 'Blackwell',
    specs: '208B trans · 192GB HBM3e',
    tile: { rows: 12, cols: 14 },
    hbm: 8,
    col: [1, 5],
    row: [1, 5],
  },
  {
    id: 'h100',
    vendor: 'NVIDIA',
    name: 'H100 SXM',
    arch: 'Hopper',
    specs: '80GB HBM3 · 3.35 TB/s',
    tile: { rows: 11, cols: 10 },
    hbm: 5,
    col: [5, 8],
    row: [1, 4],
  },
  {
    id: 'gb200',
    vendor: 'NVIDIA',
    name: 'GB200',
    arch: 'Grace + 2× B100',
    specs: '72-GPU · 1.4 EF FP4',
    tile: { rows: 9, cols: 16 },
    hbm: 8,
    col: [8, 13],
    row: [1, 4],
  },
  {
    id: 'a100',
    vendor: 'NVIDIA',
    name: 'A100',
    arch: 'Ampere',
    specs: '80GB HBM2e · 2 TB/s',
    tile: { rows: 9, cols: 9 },
    hbm: 6,
    col: [1, 3],
    row: [5, 7],
  },
  {
    id: 'tr2',
    vendor: 'AWS',
    name: 'Trainium2',
    arch: 'Annapurna',
    specs: '8 NeuronCores · 96GB',
    tile: { rows: 8, cols: 9 },
    hbm: 4,
    col: [3, 6],
    row: [5, 7],
  },
  {
    id: 'mi300',
    vendor: 'AMD',
    name: 'MI300X',
    arch: 'CDNA 3',
    specs: '192GB HBM3 · 5.3 TB/s',
    tile: { rows: 9, cols: 11 },
    hbm: 8,
    col: [6, 10],
    row: [5, 7],
  },
  {
    id: 'tpu',
    vendor: 'GOOGLE',
    name: 'TPU v5p',
    arch: 'Tensor Pod',
    specs: '8960-chip · OCS torus',
    tile: { rows: 8, cols: 8 },
    hbm: 3,
    col: [10, 13],
    row: [5, 7],
  },
];

const W = 1300;
const H = 800;

function colToX(c: number) {
  return ((c - 1) / 12) * (W - 60) + 30;
}
function rowToY(r: number) {
  return ((r - 1) / 7) * (H - 60) + 30;
}

export default function ChipPreview({
  theme,
  highlightId,
  showHud = true,
}: {
  theme: ChipTheme;
  highlightId?: string;
  showHud?: boolean;
}) {
  const highlight = highlightId ?? PREVIEW_CHIPS[2].id;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{ background: theme.bg }}
    >
      {/* glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 25% 25%, ${theme.bgGlowA} 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, ${theme.bgGlowB} 0%, transparent 55%)`,
        }}
      />
      {/* iridescent extra for theme G */}
      {theme.id === 'G' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"
          style={{
            background:
              'conic-gradient(from 0deg at 60% 40%, #7c3aed, #22d3ee, #ec4899, #f59e0b, #7c3aed)',
          }}
        />
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <pattern id={`grid-${theme.id}`} width="34" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M 34 0 L 0 0 0 34"
              fill="none"
              stroke={theme.pcbGrid}
              strokeOpacity={theme.id === 'F' ? 0.45 : 0.25}
              strokeWidth={0.5}
            />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#grid-${theme.id})`} />

        {/* traces */}
        {PREVIEW_CHIPS.map((c, i) => {
          const a = chipBox(c);
          return PREVIEW_CHIPS.slice(i + 1).map((c2, j) => {
            const b = chipBox(c2);
            const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
            if (dist > 460) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={a.cx}
                y1={a.cy}
                x2={b.cx}
                y2={b.cy}
                stroke={theme.trace}
                strokeOpacity={0.5}
                strokeWidth={0.7}
                strokeDasharray="2 6"
              />
            );
          });
        })}

        {PREVIEW_CHIPS.map((c) => {
          const b = chipBox(c);
          const isHi = c.id === highlight;
          return (
            <ChipDie
              key={c.id}
              chip={c}
              x={b.x}
              y={b.y}
              w={b.w}
              h={b.h}
              theme={theme}
              highlight={isHi}
            />
          );
        })}

        {showHud && <ChipHud chip={PREVIEW_CHIPS.find((c) => c.id === highlight)!} theme={theme} />}
      </svg>

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}

function chipBox(c: Chip) {
  const x = colToX(c.col[0]);
  const y = rowToY(c.row[0]);
  const w = colToX(c.col[1]) - x;
  const h = rowToY(c.row[1]) - y;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

function ChipDie({
  chip,
  x,
  y,
  w,
  h,
  theme,
  highlight,
}: {
  chip: Chip;
  x: number;
  y: number;
  w: number;
  h: number;
  theme: ChipTheme;
  highlight: boolean;
}) {
  const padX = Math.max(16, w * 0.06);
  const padY = Math.max(14, h * 0.08);
  const hbmW = 14;
  const innerX = x + padX + hbmW + 4;
  const innerY = y + padY + 12;
  const innerW = w - padX * 2 - hbmW * 2 - 8;
  const innerH = h - padY * 2 - 12;
  const tileW = innerW / chip.tile.cols;
  const tileH = innerH / chip.tile.rows;
  const wireframe = theme.chipStyle === 'wireframe';
  const opacity = highlight ? 1 : 0.35;
  const isBlueprint = theme.id === 'F';

  return (
    <g style={{ opacity }}>
      {highlight && (
        <rect
          x={x - 10}
          y={y - 10}
          width={w + 20}
          height={h + 20}
          rx={14}
          fill="none"
          stroke={theme.accent}
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      )}

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={wireframe ? 'none' : theme.chipBg}
        stroke={highlight ? theme.accent : theme.chipStroke}
        strokeOpacity={highlight ? 0.95 : 0.55}
        strokeWidth={1}
      />

      {/* corners */}
      {[
        [x + 6, y + 6],
        [x + w - 6, y + 6],
        [x + 6, y + h - 6],
        [x + w - 6, y + h - 6],
      ].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={1.6} fill={theme.bga} fillOpacity={0.7} />
      ))}

      {/* HBM */}
      {chip.hbm > 0 &&
        Array.from({ length: Math.ceil(chip.hbm / 2) }).map((_, i) => {
          const ny = innerY + (i / Math.ceil(chip.hbm / 2)) * innerH;
          const nh = innerH / Math.ceil(chip.hbm / 2) - 3;
          return (
            <g key={`l-${i}`}>
              <rect
                x={x + padX}
                y={ny}
                width={hbmW}
                height={nh}
                fill={wireframe ? 'none' : theme.hbmFill}
                stroke={theme.hbmStroke}
                strokeOpacity={0.65}
                strokeWidth={0.55}
              />
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1={x + padX}
                  y1={ny + nh * f}
                  x2={x + padX + hbmW}
                  y2={ny + nh * f}
                  stroke={theme.hbmStroke}
                  strokeOpacity={0.32}
                  strokeWidth={0.4}
                />
              ))}
            </g>
          );
        })}
      {chip.hbm > 0 &&
        Array.from({ length: Math.floor(chip.hbm / 2) }).map((_, i) => {
          const ny = innerY + (i / Math.max(1, Math.floor(chip.hbm / 2))) * innerH;
          const nh = innerH / Math.max(1, Math.floor(chip.hbm / 2)) - 3;
          return (
            <g key={`r-${i}`}>
              <rect
                x={x + w - padX - hbmW}
                y={ny}
                width={hbmW}
                height={nh}
                fill={wireframe ? 'none' : theme.hbmFill}
                stroke={theme.hbmStroke}
                strokeOpacity={0.65}
                strokeWidth={0.55}
              />
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1={x + w - padX - hbmW}
                  y1={ny + nh * f}
                  x2={x + w - padX}
                  y2={ny + nh * f}
                  stroke={theme.hbmStroke}
                  strokeOpacity={0.32}
                  strokeWidth={0.4}
                />
              ))}
            </g>
          );
        })}

      {/* compute tiles */}
      {Array.from({ length: chip.tile.rows }).map((_, r) =>
        Array.from({ length: chip.tile.cols }).map((_, c) => {
          const tx = innerX + c * tileW;
          const ty = innerY + r * tileH;
          const idx = r * chip.tile.cols + c;
          const lit = highlight && (idx % 7 === 0 || idx % 11 === 0);
          return (
            <rect
              key={`${r}-${c}`}
              x={tx + 0.4}
              y={ty + 0.4}
              width={tileW - 1}
              height={tileH - 1}
              fill={wireframe ? 'none' : lit ? theme.tileLit : theme.tile}
              fillOpacity={lit ? 0.95 : isBlueprint ? 0 : 0.85}
              stroke={lit ? theme.accent : theme.tileStroke}
              strokeOpacity={isBlueprint ? 0.6 : lit ? 0.8 : 0.22}
              strokeWidth={0.4}
            />
          );
        }),
      )}

      <text
        x={x + padX + hbmW + 6}
        y={y + padY + 2}
        fontSize={8}
        letterSpacing="2"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={theme.accent}
        fillOpacity={0.85}
      >
        {chip.vendor} · {chip.arch}
      </text>
      <text
        x={x + padX + hbmW + 6}
        y={y + h - padY + 4}
        fontSize={11}
        style={{
          fontFamily: 'var(--font-display, Georgia), serif',
          fontStyle: 'italic',
        }}
        fill={theme.italicAccent}
        fillOpacity={highlight ? 1 : 0.65}
      >
        {chip.name}
      </text>
    </g>
  );
}

function ChipHud({ chip, theme }: { chip: Chip; theme: ChipTheme }) {
  const b = chipBox(chip);
  const hudX = b.x + b.w + 14;
  const hudY = b.y;
  const hudW = 220;
  return (
    <g>
      <line x1={b.x + b.w} y1={b.y + b.h / 2} x2={hudX - 4} y2={b.y + b.h / 2} stroke={theme.accent} strokeWidth={1} />
      <rect x={hudX} y={hudY} width={hudW} height={104} rx={8} fill={theme.hudBg} stroke={theme.accent} strokeOpacity={0.6} />
      <text x={hudX + 12} y={hudY + 22} fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={theme.accent}>
        ACTIVE · {chip.vendor}
      </text>
      <text x={hudX + 12} y={hudY + 50} fontSize={20} style={{ fontFamily: 'var(--font-display), serif' }} fill={theme.text}>
        {chip.name}
      </text>
      <text x={hudX + 12} y={hudY + 70} fontSize={10} letterSpacing="1.2" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={theme.textDim}>
        {chip.arch}
      </text>
      <text x={hudX + 12} y={hudY + 90} fontSize={10} letterSpacing="1" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={theme.accent}>
        {chip.specs}
      </text>
    </g>
  );
}
