'use client';

import { useEffect, useRef, useState } from 'react';
import { NV } from './_palette';

// Silicon crystal lattice with electron flow toward cursor
export default function CrystalLattice() {
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

  // Build a tilted (perspective) lattice of atoms
  type Atom = { x: number; y: number; z: number };
  const atoms: Atom[] = [];
  const nx = 18,
    ny = 11,
    nz = 4;
  for (let zi = 0; zi < nz; zi++) {
    for (let yi = 0; yi < ny; yi++) {
      for (let xi = 0; xi < nx; xi++) {
        const offset = (zi + yi) % 2 === 0 ? 0 : 0.5;
        atoms.push({
          x: 100 + (xi + offset) * 70,
          y: 90 + yi * 70 + zi * 8,
          z: zi,
        });
      }
    }
  }

  // Project atom to screen with z-perspective + slight rotation animation
  const proj = (a: Atom) => {
    const sway = Math.sin(tick * 0.02 + a.x * 0.005) * 4;
    const scale = 0.85 + a.z * 0.05;
    return {
      x: a.x + sway - a.z * 18,
      y: a.y - a.z * 22 + sway,
      r: 4 + a.z * 0.8,
      scale,
    };
  };

  const projected = atoms.map(proj);

  // Bonds — only between adjacent atoms
  const bonds: { a: number; b: number }[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const d = Math.hypot(projected[i].x - projected[j].x, projected[i].y - projected[j].y);
      if (d < 90) bonds.push({ a: i, b: j });
    }
  }

  // Electron particles travel along bonds toward cursor
  const electrons = bonds
    .map((b, i) => {
      const a = projected[b.a];
      const c = projected[b.b];
      // direction toward cursor heuristic
      let phase = ((tick + i * 11) % 100) / 100;
      if (mouse) {
        const dx = mouse.x - (a.x + c.x) / 2;
        const dy = mouse.y - (a.y + c.y) / 2;
        const d = Math.hypot(dx, dy);
        if (d < 320 && d > 0) {
          // bend phase to flow toward cursor
          const dir = (c.x - a.x) * dx + (c.y - a.y) * dy > 0 ? 1 : -1;
          phase = ((tick * (1 + (1 - d / 320)) * dir + i * 11) % 100 + 100) % 100 / 100;
        }
      }
      const px = a.x + (c.x - a.x) * phase;
      const py = a.y + (c.y - a.y) * phase;
      const dToMouse = mouse ? Math.hypot(mouse.x - px, mouse.y - py) : 9999;
      return { x: px, y: py, lit: dToMouse < 200 };
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
          background: 'radial-gradient(circle at 50% 50%, rgba(118,185,0,0.10) 0%, transparent 60%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* doping aura under cursor */}
        {mouse && (
          <g>
            <circle cx={mouse.x} cy={mouse.y} r={180} fill="none" stroke={NV.accent} strokeOpacity={0.18} strokeDasharray="3 6" />
            <circle cx={mouse.x} cy={mouse.y} r={90} fill={NV.accent} fillOpacity={0.05} />
          </g>
        )}

        {/* bonds */}
        {bonds.map((b, i) => {
          const a = projected[b.a];
          const c = projected[b.b];
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={c.x}
              y2={c.y}
              stroke={NV.accent}
              strokeOpacity={0.18}
              strokeWidth={0.5}
            />
          );
        })}

        {/* electrons traveling along bonds */}
        {electrons.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.lit ? 2.4 : 1.4}
            fill={e.lit ? NV.accentBright : NV.accent}
            fillOpacity={e.lit ? 1 : 0.55}
          />
        ))}

        {/* atoms (Si nuclei) */}
        {projected.map((p, i) => {
          const reveal = mouse ? Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 280) : 0;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.r + 2} fill={NV.accent} fillOpacity={0.06 + reveal * 0.4} />
              <circle cx={p.x} cy={p.y} r={p.r} fill={NV.accent} fillOpacity={0.6 + reveal * 0.4} stroke={NV.accentBright} strokeOpacity={reveal * 0.9} strokeWidth={0.6} />
              <text x={p.x} y={p.y + 1.5} textAnchor="middle" fontSize={6} style={{ fontFamily: 'var(--font-mono), monospace' }} fill="#000" fillOpacity={0.85}>
                Si
              </text>
            </g>
          );
        })}

        {/* cursor */}
        {mouse && <circle cx={mouse.x} cy={mouse.y} r={5} fill={NV.accentBright} />}
      </svg>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        SILICON LATTICE · {atoms.length} Si NUCLEI · 4 PLANES
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ ELECTRONS FLOW TOWARD YOUR CURSOR
      </div>
    </div>
  );
}
