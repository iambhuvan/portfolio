'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Voronoi tessellation; cells flicker with activity; cursor disturbs seeds
export default function VoronoiCells() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 1400,
      y: ((e.clientY - rect.top) / rect.height) * 900,
    });
  };

  // Random-but-stable seeds (Halton-ish low-discrepancy)
  const seeds = useMemo(() => {
    const arr: { x: number; y: number; idx: number }[] = [];
    const halton = (i: number, b: number) => {
      let f = 1, r = 0;
      while (i > 0) {
        f /= b;
        r += f * (i % b);
        i = Math.floor(i / b);
      }
      return r;
    };
    for (let i = 1; i <= 80; i++) {
      arr.push({ x: halton(i, 2) * 1400, y: halton(i, 3) * 900, idx: i });
    }
    return arr;
  }, []);

  // Disturb seeds by cursor (shift toward cursor when within radius)
  const liveSeeds = seeds.map((s) => {
    if (!mouse) return s;
    const d = Math.hypot(s.x - mouse.x, s.y - mouse.y);
    const force = Math.max(0, 1 - d / 280) * 30;
    const nx = d > 0 ? (s.x - mouse.x) / d : 0;
    const ny = d > 0 ? (s.y - mouse.y) / d : 0;
    return { x: s.x + nx * force, y: s.y + ny * force, idx: s.idx };
  });

  // Sample-based "voronoi" — for each pixel-grid sample, find nearest seed.
  // Use a sparse 70×45 grid of sample points; rect-fill colored by nearest seed.
  const W = 1400, H = 900, COLS = 70, ROWS = 45;
  const sw = W / COLS, sh = H / ROWS;
  const samples: number[] = useMemo(() => {
    return new Array(COLS * ROWS).fill(0);
  }, []);

  // Fill samples
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const sx = c * sw + sw / 2;
      const sy = r * sh + sh / 2;
      let bestIdx = 0;
      let bestD = 1e9;
      for (let i = 0; i < liveSeeds.length; i++) {
        const s = liveSeeds[i];
        const d = (s.x - sx) ** 2 + (s.y - sy) ** 2;
        if (d < bestD) {
          bestD = d;
          bestIdx = i;
        }
      }
      samples[r * COLS + c] = bestIdx;
    }
  }

  // Active seed
  let activeSeed = -1;
  if (mouse) {
    let best = 1e9;
    liveSeeds.forEach((s, i) => {
      const d = Math.hypot(s.x - mouse.x, s.y - mouse.y);
      if (d < best) {
        best = d;
        activeSeed = i;
      }
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouse(null)}
      className="relative w-full h-full overflow-hidden"
      style={{ background: NV.bg }}
    >
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* fill samples */}
        {samples.map((seedIdx, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const flicker =
            (Math.sin(tick * 0.08 + seedIdx * 1.7) + 1) / 2 * 0.35 + 0.05;
          const isActive = seedIdx === activeSeed;
          return (
            <rect
              key={i}
              x={c * sw}
              y={r * sh}
              width={sw + 0.5}
              height={sh + 0.5}
              fill={NV.accent}
              fillOpacity={isActive ? flicker + 0.5 : flicker}
            />
          );
        })}

        {/* cell edges (drawn as thin lines where neighbors differ) */}
        {samples.map((seedIdx, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const right = c < COLS - 1 ? samples[i + 1] : seedIdx;
          const down = r < ROWS - 1 ? samples[i + COLS] : seedIdx;
          return (
            <g key={`e-${i}`}>
              {right !== seedIdx && (
                <line
                  x1={(c + 1) * sw}
                  y1={r * sh}
                  x2={(c + 1) * sw}
                  y2={(r + 1) * sh}
                  stroke={NV.accent}
                  strokeOpacity={0.55}
                  strokeWidth={0.6}
                />
              )}
              {down !== seedIdx && (
                <line
                  x1={c * sw}
                  y1={(r + 1) * sh}
                  x2={(c + 1) * sw}
                  y2={(r + 1) * sh}
                  stroke={NV.accent}
                  strokeOpacity={0.55}
                  strokeWidth={0.6}
                />
              )}
            </g>
          );
        })}

        {/* seeds */}
        {liveSeeds.map((s, i) => {
          const isActive = i === activeSeed;
          const chip = i < 12 ? CHIPS[i % CHIPS.length] : null;
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={isActive ? 4 : 2} fill={NV.accentBright} fillOpacity={isActive ? 1 : 0.65} />
              {chip && (
                <text
                  x={s.x}
                  y={s.y - 10}
                  textAnchor="middle"
                  fontSize={isActive ? 11 : 8}
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                  fill={isActive ? NV.text : NV.accent}
                  fillOpacity={isActive ? 1 : 0.7}
                >
                  {chip.name}
                </text>
              )}
            </g>
          );
        })}

        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={6} fill="none" stroke={NV.accentBright} strokeWidth={1} />
        )}
      </svg>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        VORONOI COMPUTE FLOOR · {seeds.length} CELLS
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ DRAG CURSOR · CELLS BEND AROUND IT
      </div>
    </div>
  );
}
