'use client';

import { useEffect, useRef, useState } from 'react';

// NVIDIA-green silicon theme — brand-correct
const T = {
  bg: '#000000',
  bgGlowA: 'rgba(118,185,0,0.32)',
  bgGlowB: 'rgba(50,90,0,0.20)',
  haloRgb: '118,185,0',
  text: '#eaf6d6',
  textDim: '#9ab27a',
  accent: '#76b900',
  accentBright: '#9ad03d',
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
};

type Chip = {
  id: string;
  vendor: 'NVIDIA' | 'AWS' | 'GOOGLE' | 'AMD' | 'CEREBRAS' | 'GROQ';
  name: string;
  arch: string;
  process: string;
  tile: { rows: number; cols: number };
  hbm: number;
  specs: string;
  // grid placement (column-row spans)
  col: [number, number];
  row: [number, number];
  // chip aspect / shape
  shape: 'square' | 'wide' | 'wafer-pair';
};

const CHIPS: Chip[] = [
  {
    id: 'b200',
    vendor: 'NVIDIA',
    name: 'B200',
    arch: 'Blackwell · NV-HBI',
    process: 'TSMC 4NP',
    tile: { rows: 14, cols: 14 },
    hbm: 8,
    specs: '208B transistors · 192GB HBM3e · 8 TB/s',
    col: [1, 5],
    row: [1, 5],
    shape: 'wafer-pair',
  },
  {
    id: 'h200',
    vendor: 'NVIDIA',
    name: 'H200',
    arch: 'Hopper',
    process: 'TSMC 4N',
    tile: { rows: 12, cols: 11 },
    hbm: 6,
    specs: '141GB HBM3e · 4.8 TB/s',
    col: [5, 8],
    row: [1, 4],
    shape: 'square',
  },
  {
    id: 'h100',
    vendor: 'NVIDIA',
    name: 'H100 SXM',
    arch: 'Hopper',
    process: 'TSMC 4N',
    tile: { rows: 12, cols: 11 },
    hbm: 5,
    specs: '80GB HBM3 · 3.35 TB/s',
    col: [8, 11],
    row: [1, 4],
    shape: 'square',
  },
  {
    id: 'gb200',
    vendor: 'NVIDIA',
    name: 'GB200 NVL72',
    arch: 'Grace + 2× Blackwell',
    process: 'TSMC 4NP',
    tile: { rows: 10, cols: 18 },
    hbm: 8,
    specs: '72-GPU domain · 1.4 EF FP4',
    col: [11, 17],
    row: [1, 4],
    shape: 'wide',
  },
  {
    id: 'a100',
    vendor: 'NVIDIA',
    name: 'A100',
    arch: 'Ampere',
    process: 'TSMC 7N',
    tile: { rows: 10, cols: 9 },
    hbm: 6,
    specs: '80GB HBM2e · 2 TB/s',
    col: [1, 3],
    row: [5, 7],
    shape: 'square',
  },
  {
    id: 'trainium2',
    vendor: 'AWS',
    name: 'Trainium2',
    arch: 'AWS Annapurna',
    process: '5nm',
    tile: { rows: 8, cols: 10 },
    hbm: 4,
    specs: '8 NeuronCores-v3 · 96GB HBM',
    col: [3, 6],
    row: [5, 7],
    shape: 'wide',
  },
  {
    id: 'trainium3',
    vendor: 'AWS',
    name: 'Trainium3',
    arch: 'AWS Annapurna',
    process: '3nm',
    tile: { rows: 9, cols: 11 },
    hbm: 4,
    specs: 'Successor · 4× perf · 40% better perf/W',
    col: [6, 9],
    row: [5, 7],
    shape: 'wide',
  },
  {
    id: 'tpu-v5p',
    vendor: 'GOOGLE',
    name: 'TPU v5p',
    arch: 'Tensor Processing',
    process: 'Google · TSMC',
    tile: { rows: 8, cols: 8 },
    hbm: 3,
    specs: '8960-chip pod · OCS torus',
    col: [9, 12],
    row: [5, 7],
    shape: 'square',
  },
  {
    id: 'mi300x',
    vendor: 'AMD',
    name: 'MI300X',
    arch: 'CDNA 3',
    process: 'TSMC 5nm + 6nm',
    tile: { rows: 10, cols: 12 },
    hbm: 8,
    specs: '192GB HBM3 · 5.3 TB/s · 8 XCDs',
    col: [12, 17],
    row: [5, 7],
    shape: 'wide',
  },
  {
    id: 'wse3',
    vendor: 'CEREBRAS',
    name: 'WSE-3',
    arch: 'Wafer-Scale',
    process: 'TSMC 5nm',
    tile: { rows: 14, cols: 14 },
    hbm: 0,
    specs: '900K AI cores · 4 trillion transistors',
    col: [1, 5],
    row: [7, 10],
    shape: 'square',
  },
  {
    id: 'lpu',
    vendor: 'GROQ',
    name: 'LPU',
    arch: 'Tensor Streaming',
    process: 'Global Foundries 14nm',
    tile: { rows: 9, cols: 9 },
    hbm: 0,
    specs: '230 MB SRAM · deterministic compiler',
    col: [5, 8],
    row: [7, 10],
    shape: 'square',
  },
  {
    id: 'h100-pcie',
    vendor: 'NVIDIA',
    name: 'H100 PCIe',
    arch: 'Hopper',
    process: 'TSMC 4N',
    tile: { rows: 11, cols: 10 },
    hbm: 5,
    specs: '80GB HBM3 · 2 TB/s',
    col: [8, 11],
    row: [7, 10],
    shape: 'square',
  },
  {
    id: 'b100',
    vendor: 'NVIDIA',
    name: 'B100',
    arch: 'Blackwell',
    process: 'TSMC 4NP',
    tile: { rows: 12, cols: 12 },
    hbm: 8,
    specs: '192GB HBM3e · 700W',
    col: [11, 14],
    row: [7, 10],
    shape: 'square',
  },
  {
    id: 'rubin',
    vendor: 'NVIDIA',
    name: 'Rubin',
    arch: 'Next-gen · 2026',
    process: 'TSMC 3nm',
    tile: { rows: 13, cols: 13 },
    hbm: 8,
    specs: 'HBM4 · NVLink 6 · post-Blackwell',
    col: [14, 17],
    row: [7, 10],
    shape: 'square',
  },
];

const VIEWBOX_W = 1700;
const VIEWBOX_H = 1000;
const COLS = 16; // grid columns (col indices 1..17)
const ROWS = 9; // grid rows (1..10)

function colToX(c: number) {
  return ((c - 1) / COLS) * (VIEWBOX_W - 80) + 40;
}
function rowToY(r: number) {
  return ((r - 1) / ROWS) * (VIEWBOX_H - 80) + 40;
}

export default function ChipBackground() {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * VIEWBOX_W;
      const y = ((e.clientY - rect.top) / rect.height) * VIEWBOX_H;
      setMouse({ x, y });
    };
    const onLeave = () => setMouse(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  // active chip = chip whose center is closest to cursor (within radius)
  const chipBoxes = CHIPS.map((c) => {
    const x = colToX(c.col[0]);
    const y = rowToY(c.row[0]);
    const w = colToX(c.col[1]) - x;
    const h = rowToY(c.row[1]) - y;
    return { chip: c, x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  });

  const active = mouse
    ? chipBoxes.reduce((best, b) => {
        const d = Math.hypot(b.cx - mouse.x, b.cy - mouse.y);
        return !best || d < best.d ? { ...b, d } : best;
      }, null as null | { chip: Chip; x: number; y: number; w: number; h: number; cx: number; cy: number; d: number })
    : null;

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* radial glow base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 25% 25%, ${T.bgGlowA} 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, ${T.bgGlowB} 0%, transparent 55%), ${T.bg}`,
        }}
      />

      {/* cursor reveal halo */}
      {mouse && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(mouse.x / VIEWBOX_W) * 100}%`,
            top: `${(mouse.y / VIEWBOX_H) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '40rem',
            height: '40rem',
            background: `radial-gradient(circle, rgba(${T.haloRgb},0.22) 0%, transparent 60%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {/* PCB grid backdrop */}
        <defs>
          <pattern id="pcb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={T.pcbGrid} strokeOpacity="0.45" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="halo" cx="50%" cy="50%">
            <stop offset="0%" stopColor={T.accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={T.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#pcb-grid)" />

        {/* connection traces between chips */}
        {chipBoxes.map((b, i) =>
          chipBoxes.slice(i + 1).map((b2, j) => {
            const dist = Math.hypot(b.cx - b2.cx, b.cy - b2.cy);
            if (dist > 320) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={b.cx}
                y1={b.cy}
                x2={b2.cx}
                y2={b2.cy}
                stroke={T.trace}
                strokeOpacity={0.55}
                strokeWidth={0.8}
                strokeDasharray="2 6"
              />
            );
          }),
        )}

        {/* chip dies */}
        {chipBoxes.map((b) => (
          <ChipDie
            key={b.chip.id}
            chip={b.chip}
            x={b.x}
            y={b.y}
            w={b.w}
            h={b.h}
            tick={tick}
            mouse={mouse}
            isActive={active?.chip.id === b.chip.id}
          />
        ))}

        {/* HUD label for active chip */}
        {active && (
          <ActiveHud
            chip={active.chip}
            x={active.x}
            y={active.y}
            w={active.w}
            h={active.h}
          />
        )}
      </svg>

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
        }}
      />
    </div>
  );
}

function ChipDie({
  chip,
  x,
  y,
  w,
  h,
  tick,
  mouse,
  isActive,
}: {
  chip: Chip;
  x: number;
  y: number;
  w: number;
  h: number;
  tick: number;
  mouse: { x: number; y: number } | null;
  isActive: boolean;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const reveal = mouse
    ? Math.max(0, 1 - Math.hypot(mouse.x - cx, mouse.y - cy) / 400)
    : 0;

  // padding inside die for tile area
  const padX = Math.max(20, w * 0.06);
  const padY = Math.max(20, h * 0.08);
  const hbmW = 18;
  const innerX = x + padX + hbmW + 6;
  const innerY = y + padY + 14;
  const innerW = w - padX * 2 - hbmW * 2 - 12;
  const innerH = h - padY * 2 - 14;
  const tileW = innerW / chip.tile.cols;
  const tileH = innerH / chip.tile.rows;

  const baseOpacity = 0.12 + reveal * 0.85;
  const glowOpacity = isActive ? 0.65 : reveal * 0.5;

  // animated activity for active chip
  const activeIdx = isActive ? Math.floor(tick / 4) % (chip.tile.rows * chip.tile.cols) : -1;

  return (
    <g style={{ opacity: baseOpacity }}>
      {/* outer halo for active */}
      {(isActive || reveal > 0.4) && (
        <rect
          x={x - 14}
          y={y - 14}
          width={w + 28}
          height={h + 28}
          rx={20}
          fill="none"
          stroke={T.accent}
          strokeOpacity={glowOpacity * 0.5}
          strokeWidth={1.2}
        />
      )}

      {/* substrate */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={T.chipBg}
        stroke={T.chipStroke}
        strokeOpacity={0.55 + reveal * 0.45}
        strokeWidth={1}
      />

      {/* corner dots (BGA balls) */}
      {[
        [x + 8, y + 8],
        [x + w - 8, y + 8],
        [x + 8, y + h - 8],
        [x + w - 8, y + h - 8],
      ].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={2} fill={T.accent} fillOpacity={0.7} />
      ))}

      {/* HBM stacks left/right */}
      {chip.hbm > 0 &&
        Array.from({ length: Math.ceil(chip.hbm / 2) }).map((_, i) => {
          const ny = innerY + (i / Math.ceil(chip.hbm / 2)) * innerH;
          const nh = innerH / Math.ceil(chip.hbm / 2) - 4;
          return (
            <g key={`hbm-l-${i}`}>
              <rect
                x={x + padX}
                y={ny}
                width={hbmW}
                height={nh}
                fill={T.hbmFill}
                stroke={T.hbmStroke}
                strokeOpacity={0.65}
                strokeWidth={0.6}
              />
              {/* stack lines */}
              {[0.2, 0.4, 0.6, 0.8].map((f) => (
                <line
                  key={f}
                  x1={x + padX}
                  y1={ny + nh * f}
                  x2={x + padX + hbmW}
                  y2={ny + nh * f}
                  stroke={T.hbmStroke}
                  strokeOpacity={0.35}
                  strokeWidth={0.4}
                />
              ))}
            </g>
          );
        })}
      {chip.hbm > 0 &&
        Array.from({ length: Math.floor(chip.hbm / 2) }).map((_, i) => {
          const ny = innerY + (i / Math.max(1, Math.floor(chip.hbm / 2))) * innerH;
          const nh = innerH / Math.max(1, Math.floor(chip.hbm / 2)) - 4;
          return (
            <g key={`hbm-r-${i}`}>
              <rect
                x={x + w - padX - hbmW}
                y={ny}
                width={hbmW}
                height={nh}
                fill={T.hbmFill}
                stroke={T.hbmStroke}
                strokeOpacity={0.65}
                strokeWidth={0.6}
              />
              {[0.2, 0.4, 0.6, 0.8].map((f) => (
                <line
                  key={f}
                  x1={x + w - padX - hbmW}
                  y1={ny + nh * f}
                  x2={x + w - padX}
                  y2={ny + nh * f}
                  stroke={T.hbmStroke}
                  strokeOpacity={0.35}
                  strokeWidth={0.4}
                />
              ))}
            </g>
          );
        })}

      {/* compute tile array */}
      {Array.from({ length: chip.tile.rows }).map((_, r) =>
        Array.from({ length: chip.tile.cols }).map((_, c) => {
          const tx = innerX + c * tileW;
          const ty = innerY + r * tileH;
          const idx = r * chip.tile.cols + c;
          const lit = activeIdx >= 0 && Math.abs(idx - activeIdx) < 6;
          const noise = ((idx * 31 + chip.id.charCodeAt(0)) % 7) / 7;
          return (
            <rect
              key={`${r}-${c}`}
              x={tx + 0.5}
              y={ty + 0.5}
              width={tileW - 1.5}
              height={tileH - 1.5}
              fill={lit ? T.tileLit : T.tile}
              fillOpacity={lit ? 0.9 : 0.85}
              stroke={T.chipStroke}
              strokeOpacity={0.18 + noise * 0.18 + (lit ? 0.6 : 0)}
              strokeWidth={0.4}
            />
          );
        }),
      )}

      {/* on-die label */}
      <text
        x={x + padX + hbmW + 8}
        y={y + padY + 4}
        fontSize={9}
        letterSpacing="2"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={T.accent}
        fillOpacity={0.6 + reveal * 0.4}
      >
        {chip.vendor} · {chip.arch}
      </text>
      <text
        x={x + padX + hbmW + 8}
        y={y + h - padY + 6}
        fontSize={11}
        letterSpacing="1"
        style={{ fontFamily: 'var(--font-display, Georgia), serif', fontStyle: 'italic' }}
        fill={T.italicAccent}
        fillOpacity={0.45 + reveal * 0.55}
      >
        {chip.name}
      </text>
    </g>
  );
}

function ActiveHud({ chip, x, y, w, h }: { chip: Chip; x: number; y: number; w: number; h: number }) {
  const hudX = x + w + 14;
  const hudY = y;
  const hudW = 240;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <line
        x1={x + w}
        y1={y + h / 2}
        x2={hudX - 4}
        y2={y + h / 2}
        stroke={T.accent}
        strokeWidth={1}
      />
      <rect
        x={hudX}
        y={hudY}
        width={hudW}
        height={108}
        rx={8}
        fill={T.chipBg}
        stroke={T.accent}
        strokeOpacity={0.6}
      />
      <text
        x={hudX + 12}
        y={hudY + 22}
        fontSize={9}
        letterSpacing="2.5"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={T.accent}
      >
        ACTIVE · {chip.vendor}
      </text>
      <text
        x={hudX + 12}
        y={hudY + 50}
        fontSize={20}
        style={{ fontFamily: 'var(--font-display, Georgia), serif' }}
        fill={T.text}
      >
        {chip.name}
      </text>
      <text
        x={hudX + 12}
        y={hudY + 70}
        fontSize={10}
        letterSpacing="1.2"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={T.textDim}
      >
        {chip.arch} · {chip.process}
      </text>
      <text
        x={hudX + 12}
        y={hudY + 92}
        fontSize={10}
        letterSpacing="1"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={T.accent}
      >
        {chip.specs}
      </text>
    </g>
  );
}
