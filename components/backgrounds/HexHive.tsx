'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Hexagonal honeycomb compute mesh; cursor pollinates ripples
export default function HexHive() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [pulses, setPulses] = useState<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  // Decay pulses
  useEffect(() => {
    setPulses((p) => p.map((q) => ({ ...q, t: q.t + 1 })).filter((q) => q.t < 110));
  }, [tick]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 1400,
      y: ((e.clientY - rect.top) / rect.height) * 900,
    });
  };
  const onClick = () => {
    if (!mouse) return;
    setPulses((p) => [...p, { x: mouse.x, y: mouse.y, t: 0 }]);
  };

  // Hex grid params
  const r = 22; // radius
  const dx = r * Math.sqrt(3);
  const dy = r * 1.5;

  type Hex = { cx: number; cy: number; q: number; r: number };
  const hexes: Hex[] = [];
  for (let row = -1; row * dy < 950; row++) {
    for (let col = -1; col * dx < 1450; col++) {
      const cx = col * dx + (row % 2 ? dx / 2 : 0);
      const cy = row * dy;
      hexes.push({ cx, cy, q: col, r: row });
    }
  }

  function hexPath(cx: number, cy: number, rad: number) {
    const pts = [0, 1, 2, 3, 4, 5].map((i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`;
    });
    return `M${pts.join(' L')} Z`;
  }

  // Anchor chips to specific hexes
  const anchors = [
    { col: 6, row: 4, chip: CHIPS[3] },
    { col: 18, row: 4, chip: CHIPS[0] },
    { col: 30, row: 4, chip: CHIPS[4] },
    { col: 42, row: 4, chip: CHIPS[5] },
    { col: 12, row: 14, chip: CHIPS[7] },
    { col: 24, row: 14, chip: CHIPS[10] },
    { col: 36, row: 14, chip: CHIPS[12] },
  ];

  // Active hex
  let activeHex: Hex | null = null;
  if (mouse) {
    let best = 1e9;
    for (const h of hexes) {
      const d = Math.hypot(h.cx - mouse.x, h.cy - mouse.y);
      if (d < best) {
        best = d;
        activeHex = h;
      }
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onClick={onClick}
      onMouseLeave={() => setMouse(null)}
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      style={{ background: NV.bg }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(118,185,0,0.12) 0%, transparent 60%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {hexes.map((h, i) => {
          // distance to cursor
          const d = mouse ? Math.hypot(h.cx - mouse.x, h.cy - mouse.y) : 9999;
          const reveal = mouse ? Math.max(0, 1 - d / 280) : 0;
          // pulse contribution
          let pulseLit = 0;
          for (const p of pulses) {
            const pd = Math.hypot(h.cx - p.x, h.cy - p.y);
            const ringR = p.t * 7;
            const onRing = Math.abs(pd - ringR) < 14;
            if (onRing) pulseLit = Math.max(pulseLit, 1 - p.t / 110);
          }
          // baseline shimmer
          const shimmer = 0.05 + ((Math.sin(tick * 0.08 + i * 0.4) + 1) / 4) * 0.08;
          const fillOp = Math.min(0.9, shimmer + reveal * 0.55 + pulseLit * 0.95);
          const isActive = activeHex === h && mouse;
          return (
            <path
              key={i}
              d={hexPath(h.cx, h.cy, r - 1.5)}
              fill={NV.accent}
              fillOpacity={fillOp}
              stroke={isActive ? NV.accentBright : NV.accent}
              strokeOpacity={isActive ? 1 : 0.18}
              strokeWidth={isActive ? 1.3 : 0.5}
            />
          );
        })}

        {/* anchor labels */}
        {anchors.map((a, i) => {
          const h = hexes.find((hh) => hh.q === a.col && hh.r === a.row);
          if (!h) return null;
          return (
            <g key={i}>
              <path
                d={hexPath(h.cx, h.cy, r + 5)}
                fill="none"
                stroke={NV.accentBright}
                strokeWidth={1.2}
                strokeOpacity={0.7}
              />
              <text
                x={h.cx}
                y={h.cy + r + 26}
                textAnchor="middle"
                fontSize={9}
                letterSpacing="2"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={NV.accent}
              >
                {a.chip.name}
              </text>
            </g>
          );
        })}

        {/* pulse rings */}
        {pulses.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.t * 7}
            fill="none"
            stroke={NV.accentBright}
            strokeOpacity={Math.max(0, 0.7 - p.t / 110)}
            strokeWidth={1.2}
          />
        ))}

        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={5} fill={NV.accentBright} />
        )}
      </svg>

      <div
        className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}
      >
        HIVE COMPUTE · {hexes.length} CELLS
      </div>
      <div
        className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        ▸ MOVE CURSOR · CLICK TO PROPAGATE A WAVE
      </div>
    </div>
  );
}
