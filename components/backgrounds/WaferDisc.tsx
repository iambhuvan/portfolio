'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

export default function WaferDisc() {
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
      x: ((e.clientX - rect.left) / rect.width) * 1000,
      y: ((e.clientY - rect.top) / rect.height) * 1000,
    });
  };

  // Generate die grid clipped to wafer circle
  const wafer = { cx: 500, cy: 500, r: 420 };
  const dieW = 70;
  const dieH = 56;
  const dies: { x: number; y: number; chip?: typeof CHIPS[number] }[] = [];
  let chipIdx = 0;
  for (let row = -8; row <= 8; row++) {
    for (let col = -10; col <= 10; col++) {
      const x = wafer.cx + col * (dieW + 4);
      const y = wafer.cy + row * (dieH + 4);
      // inside wafer minus flat edge
      const d = Math.hypot(x - wafer.cx, y - wafer.cy);
      if (d > wafer.r - 18) continue;
      if (y > wafer.cy + wafer.r * 0.93) continue; // flat
      const chip = (chipIdx % 5 === 0) ? CHIPS[chipIdx % CHIPS.length] : undefined;
      dies.push({ x: x - dieW / 2, y: y - dieH / 2, chip });
      chipIdx++;
    }
  }

  // Find active die under cursor
  let active: typeof dies[number] | null = null;
  let activeDist = 1e9;
  if (mouse) {
    for (const d of dies) {
      const cx = d.x + dieW / 2;
      const cy = d.y + dieH / 2;
      const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
      if (dist < activeDist) {
        activeDist = dist;
        active = d;
      }
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouse(null)}
      className="relative w-full h-full overflow-hidden"
      style={{ background: NV.bg }}
    >
      {/* glow halos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            `radial-gradient(circle at 50% 50%, rgba(118,185,0,0.18) 0%, transparent 50%)`,
        }}
      />

      <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="waferShade" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0a1505" />
            <stop offset="80%" stopColor="#040603" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <pattern id="waferGrid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke={NV.accent} strokeOpacity="0.04" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* wafer disc with flat */}
        <g style={{ transformOrigin: '500px 500px', transform: `rotate(${tick * 0.06}deg)` }}>
          <path
            d={`M ${wafer.cx},${wafer.cy - wafer.r}
                A ${wafer.r},${wafer.r} 0 1 0 ${wafer.cx + wafer.r * 0.34},${wafer.cy + wafer.r * 0.94}
                L ${wafer.cx - wafer.r * 0.34},${wafer.cy + wafer.r * 0.94}
                A ${wafer.r},${wafer.r} 0 0 0 ${wafer.cx},${wafer.cy - wafer.r} Z`}
            fill="url(#waferShade)"
            stroke={NV.accent}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx={wafer.cx} cy={wafer.cy} r={wafer.r} fill="url(#waferGrid)" opacity={0.6} />

          {/* dies */}
          {dies.map((d, i) => {
            const cx = d.x + dieW / 2;
            const cy = d.y + dieH / 2;
            const distToMouse = mouse ? Math.hypot(cx - mouse.x, cy - mouse.y) : 9999;
            const lit = distToMouse < 100;
            const reveal = mouse ? Math.max(0, 1 - distToMouse / 220) : 0;
            const isActive = active === d && mouse;
            return (
              <g key={i} style={{ opacity: 0.5 + reveal * 0.5 }}>
                <rect
                  x={d.x}
                  y={d.y}
                  width={dieW}
                  height={dieH}
                  fill={lit ? NV.accent : '#0a1505'}
                  fillOpacity={lit ? 0.4 + reveal * 0.5 : 0.7}
                  stroke={isActive ? NV.accentBright : NV.accent}
                  strokeOpacity={isActive ? 0.95 : 0.25 + reveal * 0.5}
                  strokeWidth={isActive ? 1.6 : 0.6}
                />
                {/* small dies have inner SM grid */}
                {[3, 6, 9].map((cols) => null)}
                {Array.from({ length: 4 }).map((_, r) =>
                  Array.from({ length: 5 }).map((_, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={d.x + 6 + c * 11}
                      y={d.y + 6 + r * 11}
                      width={9}
                      height={9}
                      fill={lit ? NV.accentBright : 'transparent'}
                      fillOpacity={lit ? 0.6 : 0}
                      stroke={NV.accent}
                      strokeOpacity={isActive ? 0.7 : 0.2 + reveal * 0.4}
                      strokeWidth={0.4}
                    />
                  )),
                )}
                {d.chip && reveal > 0.4 && (
                  <text
                    x={d.x + dieW / 2}
                    y={d.y + dieH + 12}
                    textAnchor="middle"
                    fontSize={7}
                    letterSpacing="1.5"
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                    fill={NV.accent}
                    opacity={reveal}
                  >
                    {d.chip.name.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}

          {/* notch at bottom */}
          <circle cx={wafer.cx} cy={wafer.cy + wafer.r * 0.94} r={6} fill={NV.bg} stroke={NV.accent} strokeOpacity="0.8" />
        </g>

        {/* cursor crosshair */}
        {mouse && (
          <g>
            <circle cx={mouse.x} cy={mouse.y} r={120} fill="none" stroke={NV.accent} strokeOpacity={0.18} />
            <circle cx={mouse.x} cy={mouse.y} r={5} fill="none" stroke={NV.accentBright} strokeWidth={1} />
          </g>
        )}

        {/* HUD for active die's chip */}
        {active?.chip && mouse && (
          <g>
            <line x1={active.x + dieW} y1={active.y + dieH / 2} x2={active.x + dieW + 70} y2={active.y + dieH / 2 - 60} stroke={NV.accent} strokeWidth={0.8} />
            <rect x={active.x + dieW + 70} y={active.y + dieH / 2 - 100} width={210} height={92} rx={6} fill={NV.bgWarm} stroke={NV.accent} strokeOpacity="0.7" />
            <text x={active.x + dieW + 80} y={active.y + dieH / 2 - 78} fontSize={8} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
              ACTIVE · {active.chip.vendor}
            </text>
            <text x={active.x + dieW + 80} y={active.y + dieH / 2 - 52} fontSize={18} style={{ fontFamily: 'var(--font-display), serif' }} fill={NV.text}>
              {active.chip.name}
            </text>
            <text x={active.x + dieW + 80} y={active.y + dieH / 2 - 32} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.textDim}>
              {active.chip.arch}
            </text>
            <text x={active.x + dieW + 80} y={active.y + dieH / 2 - 14} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent}>
              {active.chip.specs}
            </text>
          </g>
        )}
      </svg>

      {/* corner labels */}
      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        WAFER · 300mm · TSMC 4NP · LOT 4221-A
      </div>
      <div className="absolute bottom-5 right-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        DIES: {dies.length} · YIELD: 91.3%
      </div>
    </div>
  );
}
