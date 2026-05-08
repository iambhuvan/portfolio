'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Field of particles that resolve into chip die patterns wherever cursor passes
export default function ParticleResolve() {
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

  // Static particle field
  const particles = useRef(
    Array.from({ length: 1100 }, (_, i) => ({
      x: ((i * 137) % 1400),
      y: ((i * 263) % 900),
      vx: 0,
      vy: 0,
      size: 1 + (i % 3) * 0.5,
    })),
  );

  // Define chip die "anchor points" — where particles align to form a die
  type Anchor = { x: number; y: number; chip: typeof CHIPS[number] };
  const anchors: Anchor[] = [
    { x: 280, y: 240, chip: CHIPS[3] },
    { x: 720, y: 200, chip: CHIPS[0] },
    { x: 1140, y: 260, chip: CHIPS[4] },
    { x: 380, y: 600, chip: CHIPS[5] },
    { x: 760, y: 640, chip: CHIPS[7] },
    { x: 1100, y: 600, chip: CHIPS[10] },
  ];

  // For each anchor, generate die-pattern target points
  const targetPoints: { x: number; y: number; anchor: Anchor }[] = [];
  for (const a of anchors) {
    const w = 180;
    const h = 130;
    const cols = 14;
    const rows = 10;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // skip some for HBM gap
        const insideHbmL = c < 2;
        const insideHbmR = c >= cols - 2;
        const innerC = !insideHbmL && !insideHbmR;
        if (innerC && (r + c) % 2 === 0) continue;
        targetPoints.push({
          x: a.x - w / 2 + 10 + c * (w / cols),
          y: a.y - h / 2 + 10 + r * (h / rows),
          anchor: a,
        });
      }
    }
  }

  // Active anchor = closest to cursor
  let activeAnchor: Anchor | null = null;
  if (mouse) {
    let best = 1e9;
    for (const a of anchors) {
      const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (d < best) {
        best = d;
        activeAnchor = a;
      }
    }
  }

  // Update particle physics — pull toward target if cursor near
  particles.current.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.88;
    p.vy *= 0.88;
    if (mouse) {
      // Find nearest target near cursor
      let nearestT = null as null | typeof targetPoints[number];
      let bestD = 1e9;
      for (const t of targetPoints) {
        const ad = Math.hypot(t.x - mouse.x, t.y - mouse.y);
        if (ad > 230) continue;
        const pd = Math.hypot(t.x - p.x, t.y - p.y);
        if (pd < bestD && pd < 60) {
          bestD = pd;
          nearestT = t;
        }
      }
      if (nearestT) {
        const dx = nearestT.x - p.x;
        const dy = nearestT.y - p.y;
        p.vx += dx * 0.04;
        p.vy += dy * 0.04;
      } else {
        // drift back to original
        const dx = ((i * 137) % 1400) - p.x;
        const dy = ((i * 263) % 900) - p.y;
        p.vx += dx * 0.005;
        p.vy += dy * 0.005;
      }
    } else {
      const dx = ((i * 137) % 1400) - p.x;
      const dy = ((i * 263) % 900) - p.y;
      p.vx += dx * 0.01;
      p.vy += dy * 0.01;
    }
  });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouse(null)}
      className="relative w-full h-full overflow-hidden"
      style={{ background: NV.bg }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(118,185,0,0.10) 0%, transparent 60%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* anchor labels (visible when active) */}
        {anchors.map((a) => {
          const isActive = activeAnchor === a;
          const dist = mouse ? Math.hypot(a.x - mouse.x, a.y - mouse.y) : 1000;
          const reveal = mouse ? Math.max(0, 1 - dist / 280) : 0;
          if (reveal < 0.3) return null;
          return (
            <g key={a.chip.id} opacity={reveal}>
              <line x1={a.x} y1={a.y - 90} x2={a.x} y2={a.y - 60} stroke={NV.accent} strokeOpacity={0.6} strokeWidth={0.6} />
              <text x={a.x} y={a.y - 100} textAnchor="middle" fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={isActive ? NV.accentBright : NV.accent}>
                {a.chip.vendor}
              </text>
              <text x={a.x} y={a.y + 100} textAnchor="middle" fontSize={14} fontStyle="italic" style={{ fontFamily: 'var(--font-display), serif' }} fill={isActive ? NV.text : NV.textDim}>
                {a.chip.name}
              </text>
              <text x={a.x} y={a.y + 116} textAnchor="middle" fontSize={8} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent} opacity={isActive ? 1 : 0.6}>
                {a.chip.specs}
              </text>
            </g>
          );
        })}

        {/* particles */}
        {particles.current.map((p, i) => {
          const dist = mouse ? Math.hypot(p.x - mouse.x, p.y - mouse.y) : 0;
          const reveal = mouse ? Math.max(0, 1 - dist / 320) : 0.3;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.size + reveal * 0.8}
              fill={NV.accent}
              fillOpacity={0.18 + reveal * 0.7}
            />
          );
        })}

        {/* cursor */}
        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={5} fill="none" stroke={NV.accentBright} strokeWidth={1} />
        )}
      </svg>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        SILICON FIELD · {particles.current.length} PARTICLES
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ MOVE CURSOR · PARTICLES SNAP INTO DIES
      </div>
    </div>
  );
}
