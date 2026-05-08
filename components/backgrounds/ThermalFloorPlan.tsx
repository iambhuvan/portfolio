'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Top-down DC floor plan; cursor causes thermal bloom that heats up nearby chips
export default function ThermalFloorPlan() {
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

  // Grid of chips arranged as racks
  const racks: { x: number; y: number; w: number; h: number; chip: typeof CHIPS[number] }[] = [];
  const rackW = 200;
  const rackH = 70;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      racks.push({
        x: 130 + c * 240,
        y: 100 + r * 140,
        w: rackW,
        h: rackH,
        chip: CHIPS[(r * 5 + c) % CHIPS.length],
      });
    }
  }

  // Cool air aisles between rows
  // Compute thermal map at low resolution; render with rectangles
  const TILES_X = 28;
  const TILES_Y = 18;
  const tileW = 1400 / TILES_X;
  const tileH = 900 / TILES_Y;

  // Active chip (closest)
  let activeRack = -1;
  if (mouse) {
    let best = 1e9;
    racks.forEach((r, i) => {
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      const d = Math.hypot(cx - mouse.x, cy - mouse.y);
      if (d < best) {
        best = d;
        activeRack = i;
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
        {/* thermal field */}
        {Array.from({ length: TILES_Y }).map((_, ty) =>
          Array.from({ length: TILES_X }).map((_, tx) => {
            const cx = tx * tileW + tileW / 2;
            const cy = ty * tileH + tileH / 2;
            // base heat from racks
            let heat = 0;
            for (const r of racks) {
              const rcx = r.x + r.w / 2;
              const rcy = r.y + r.h / 2;
              const d = Math.hypot(cx - rcx, cy - rcy);
              heat += Math.exp(-(d * d) / 9000) * 0.45;
            }
            // cursor adds heat (compute hotspot)
            if (mouse) {
              const d = Math.hypot(cx - mouse.x, cy - mouse.y);
              heat += Math.exp(-(d * d) / 22000) * 0.9;
            }
            heat = Math.min(1, heat);
            // color: green low → yellow-green high
            const r = Math.floor(118 + heat * 60);
            const g = Math.floor(185 + heat * 40);
            const b = Math.floor(heat * 20);
            return (
              <rect
                key={`${ty}-${tx}`}
                x={tx * tileW}
                y={ty * tileH}
                width={tileW + 0.5}
                height={tileH + 0.5}
                fill={`rgb(${r},${g},${b})`}
                fillOpacity={0.04 + heat * 0.55}
              />
            );
          }),
        )}

        {/* aisles */}
        {[210, 350, 490, 630, 770].map((y, i) => (
          <line key={i} x1={120} y1={y} x2={1330} y2={y} stroke={NV.accent} strokeOpacity={0.08} strokeWidth={0.5} strokeDasharray="2 6" />
        ))}

        {/* chip racks */}
        {racks.map((r, i) => {
          const cx = r.x + r.w / 2;
          const cy = r.y + r.h / 2;
          const d = mouse ? Math.hypot(cx - mouse.x, cy - mouse.y) : 9999;
          const reveal = mouse ? Math.max(0, 1 - d / 320) : 0;
          const isActive = i === activeRack && mouse;
          // utilization animates
          const util = Math.min(1, 0.4 + (Math.sin(tick * 0.06 + i) + 1) / 4 + reveal * 0.4);
          return (
            <g key={i}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={4}
                fill="#040603"
                stroke={isActive ? NV.accentBright : NV.accent}
                strokeOpacity={isActive ? 1 : 0.45 + reveal * 0.5}
                strokeWidth={isActive ? 1.5 : 0.8}
              />
              {/* tile array — utilization */}
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 12 }).map((_, col) => {
                  const tileLit = (col / 12 + row * 0.05) < util;
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={r.x + 6 + col * 15}
                      y={r.y + 6 + row * 14}
                      width={13}
                      height={12}
                      fill={tileLit ? NV.accent : '#0a1505'}
                      fillOpacity={tileLit ? 0.6 + reveal * 0.4 : 0.5}
                    />
                  );
                }),
              )}
              {/* label */}
              <text x={r.x + 6} y={r.y - 4} fontSize={8} letterSpacing="2" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={isActive ? NV.accentBright : NV.accent} opacity={0.7 + reveal * 0.3}>
                {r.chip.vendor} · {r.chip.name}
              </text>
            </g>
          );
        })}

        {/* cursor thermal halo */}
        {mouse && (
          <g>
            <circle cx={mouse.x} cy={mouse.y} r={150} fill="none" stroke={NV.accentBright} strokeOpacity={0.5} strokeWidth={0.8} strokeDasharray="3 5" />
            <circle cx={mouse.x} cy={mouse.y} r={6} fill={NV.accentBright} />
            <text x={mouse.x + 12} y={mouse.y - 16} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
              {(60 + Math.sin(tick * 0.1) * 4).toFixed(1)}°C
            </text>
          </g>
        )}
      </svg>

      {/* HUD */}
      {activeRack >= 0 && mouse && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(racks[activeRack].x / 1400) * 100}%`,
            top: `${((racks[activeRack].y + 80) / 900) * 100}%`,
          }}
        >
          <div className="rounded-md p-3 border" style={{ background: NV.bgWarm, borderColor: NV.accent }}>
            <div className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: NV.accentBright, fontFamily: 'var(--font-mono), monospace' }}>
              ACTIVE · {racks[activeRack].chip.vendor}
            </div>
            <div className="text-base mb-1" style={{ color: NV.text, fontFamily: 'var(--font-display), serif' }}>
              {racks[activeRack].chip.name}
            </div>
            <div className="text-[10px]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
              {racks[activeRack].chip.arch}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
              {racks[activeRack].chip.specs}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        DC THERMAL VIEW · {racks.length} RACKS · LIVE
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ HEAT BLOOMS UNDER CURSOR
      </div>
    </div>
  );
}
