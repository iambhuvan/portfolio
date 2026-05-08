'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Network of chip nodes connected by NVLink — cursor pulls nodes; data packets flow on edges
export default function NVLinkNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
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

  // Static positions for 14 chips in a planet-like layout
  const positions = [
    { x: 700, y: 450, r: 38 }, // GB200 center
    { x: 700, y: 200, r: 28 },
    { x: 940, y: 280, r: 28 },
    { x: 1080, y: 480, r: 28 },
    { x: 980, y: 680, r: 28 },
    { x: 700, y: 740, r: 26 },
    { x: 420, y: 680, r: 26 },
    { x: 320, y: 480, r: 28 },
    { x: 420, y: 280, r: 26 },
    { x: 540, y: 380, r: 22 },
    { x: 860, y: 380, r: 22 },
    { x: 860, y: 540, r: 22 },
    { x: 540, y: 540, r: 22 },
    { x: 230, y: 220, r: 20 },
  ];

  // Cursor pulls nearby nodes
  const nodes = positions.map((p, i) => {
    const chip = CHIPS[i % CHIPS.length];
    if (!mouse) return { ...p, chip };
    const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    const force = Math.max(0, 1 - d / 320) * 18;
    const nx = d > 0 ? (mouse.x - p.x) / d : 0;
    const ny = d > 0 ? (mouse.y - p.y) / d : 0;
    return { ...p, x: p.x + nx * force, y: p.y + ny * force, chip };
  });

  // Edges between near nodes
  const edges: { a: number; b: number; dist: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 320) edges.push({ a: i, b: j, dist: d });
    }
  }

  // Active node = closest to cursor
  let activeIdx = -1;
  if (mouse) {
    let best = 1e9;
    nodes.forEach((n, i) => {
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (d < best) {
        best = d;
        activeIdx = i;
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(118,185,0,0.13) 0%, transparent 55%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* edges with packet animation */}
        {edges.map((e, i) => {
          const a = nodes[e.a];
          const b = nodes[e.b];
          // packet position moves along edge
          const phase = ((tick * 2 + i * 23) % 100) / 100;
          const px = a.x + (b.x - a.x) * phase;
          const py = a.y + (b.y - a.y) * phase;
          const isActive = activeIdx === e.a || activeIdx === e.b;
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={NV.accent}
                strokeOpacity={isActive ? 0.7 : 0.2 - e.dist / 1500}
                strokeWidth={isActive ? 1.3 : 0.6}
              />
              <circle cx={px} cy={py} r={isActive ? 2.4 : 1.6} fill={NV.accentBright} fillOpacity={isActive ? 1 : 0.5} />
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map((n, i) => {
          const isActive = i === activeIdx && mouse;
          const reveal = mouse ? Math.max(0, 1 - Math.hypot(n.x - mouse.x, n.y - mouse.y) / 380) : 0;
          return (
            <g key={i}>
              {/* outer halo */}
              {(isActive || reveal > 0.5) && (
                <circle cx={n.x} cy={n.y} r={n.r + 12} fill="none" stroke={NV.accent} strokeOpacity={isActive ? 0.55 : reveal * 0.4} strokeWidth={1} />
              )}
              {/* die */}
              <rect
                x={n.x - n.r}
                y={n.y - n.r}
                width={n.r * 2}
                height={n.r * 2}
                rx={4}
                fill={isActive ? '#0e1f06' : '#040603'}
                stroke={isActive ? NV.accentBright : NV.accent}
                strokeOpacity={isActive ? 1 : 0.4 + reveal * 0.5}
                strokeWidth={isActive ? 1.6 : 0.8}
              />
              {/* internal grid */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 4 }).map((_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={n.x - n.r + 4 + c * (n.r * 2 - 8) / 4}
                    y={n.y - n.r + 4 + r * (n.r * 2 - 8) / 4}
                    width={(n.r * 2 - 8) / 4 - 1}
                    height={(n.r * 2 - 8) / 4 - 1}
                    fill={NV.accent}
                    fillOpacity={isActive ? 0.5 + (r * c) / 16 : 0.12 + reveal * 0.3}
                  />
                )),
              )}
              {/* label below */}
              {(reveal > 0.5 || isActive) && (
                <text
                  x={n.x}
                  y={n.y + n.r + 14}
                  textAnchor="middle"
                  fontSize={8}
                  letterSpacing="2"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                  fill={NV.accent}
                  opacity={isActive ? 1 : reveal}
                >
                  {n.chip.name}
                </text>
              )}
            </g>
          );
        })}

        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={6} fill="none" stroke={NV.accentBright} strokeWidth={1} />
        )}

        {/* HUD for active node */}
        {activeIdx >= 0 && mouse && (
          <g>
            <rect x={mouse.x + 24} y={mouse.y - 90} width={240} height={100} rx={6} fill={NV.bgWarm} stroke={NV.accent} strokeOpacity={0.7} />
            <text x={mouse.x + 36} y={mouse.y - 66} fontSize={8} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
              NVLINK · {nodes[activeIdx].chip.vendor}
            </text>
            <text x={mouse.x + 36} y={mouse.y - 38} fontSize={20} style={{ fontFamily: 'var(--font-display), serif' }} fill={NV.text}>
              {nodes[activeIdx].chip.name}
            </text>
            <text x={mouse.x + 36} y={mouse.y - 20} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.textDim}>
              {nodes[activeIdx].chip.arch}
            </text>
            <text x={mouse.x + 36} y={mouse.y - 4} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent}>
              {nodes[activeIdx].chip.specs}
            </text>
          </g>
        )}
      </svg>
      <div
        className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}
      >
        TOPOLOGY · NVLink Switch · 1.8 TB/s/GPU
      </div>
      <div
        className="absolute bottom-5 right-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        ▸ DRAG CURSOR · NODES BEND TOWARD YOU
      </div>
    </div>
  );
}
