'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Side-view chip package cross-section. Cursor X selects chip, cursor Y highlights layer
export default function CrossSectionLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Selected chip from cursor X
  const featured = [CHIPS[0], CHIPS[3], CHIPS[4], CHIPS[10], CHIPS[7]]; // B200, H100, GB200, MI300X, Trainium2
  const chipIdx = mouse ? Math.min(featured.length - 1, Math.floor(mouse.x * featured.length)) : 1;
  const chip = featured[chipIdx];

  // Layer descriptions per chip
  const layers = [
    { name: 'PACKAGE LID', desc: 'Integrated heat spreader · vapor chamber', y: 0.18 },
    { name: 'COMPUTE DIES', desc: chip.id === 'b200' ? '2 reticle-limit dies + NV-HBI bridge' : chip.id === 'mi300' ? '8 XCDs + 4 IODs · CDNA 3' : 'Monolithic compute die', y: 0.32 },
    { name: 'HBM STACKS', desc: chip.specs, y: 0.5 },
    { name: 'INTERPOSER', desc: 'CoWoS-S silicon interposer · 6× reticle area', y: 0.62 },
    { name: 'SUBSTRATE', desc: 'Organic substrate · BGA 1024 ball', y: 0.74 },
    { name: 'PCB', desc: 'SXM5 board · 700W TDP rail', y: 0.86 },
  ];

  const activeLayerIdx = mouse ? layers.reduce((best, l, i) => Math.abs(l.y - mouse.y) < Math.abs(layers[best].y - mouse.y) ? i : best, 0) : 1;

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
          background: 'radial-gradient(ellipse at 50% 30%, rgba(118,185,0,0.16) 0%, transparent 60%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* package outline */}
        <g>
          {layers.map((l, i) => {
            const yTop = l.y * 900 - 24;
            const isActive = i === activeLayerIdx && mouse;
            const isHbm = l.name === 'HBM STACKS';
            const isCompute = l.name === 'COMPUTE DIES';
            return (
              <g key={i}>
                {/* layer plate */}
                <rect
                  x={300}
                  y={yTop}
                  width={800}
                  height={48}
                  fill={isActive ? '#0e1f06' : '#040603'}
                  stroke={isActive ? NV.accentBright : NV.accent}
                  strokeOpacity={isActive ? 1 : 0.4}
                  strokeWidth={isActive ? 1.6 : 0.8}
                />
                {/* layer detail */}
                {isHbm && (
                  <g>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <g key={j}>
                        <rect x={340 + j * 90} y={yTop + 4} width={70} height={40} fill="#0a1505" stroke={NV.accent} strokeOpacity={0.7} />
                        {[0.2, 0.4, 0.6, 0.8].map((f) => (
                          <line
                            key={f}
                            x1={340 + j * 90}
                            y1={yTop + 4 + 40 * f}
                            x2={340 + j * 90 + 70}
                            y2={yTop + 4 + 40 * f}
                            stroke={NV.accent}
                            strokeOpacity={0.4}
                            strokeWidth={0.4}
                          />
                        ))}
                        <text x={340 + j * 90 + 35} y={yTop + 28} textAnchor="middle" fontSize={7} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright} opacity={0.9}>
                          HBM3e
                        </text>
                      </g>
                    ))}
                  </g>
                )}
                {isCompute && (
                  <g>
                    <rect x={380} y={yTop + 4} width={320} height={40} fill="#0a1505" stroke={NV.accent} strokeOpacity={0.8} />
                    <rect x={720} y={yTop + 4} width={320} height={40} fill="#0a1505" stroke={NV.accent} strokeOpacity={0.8} />
                    {/* SM tile array */}
                    {Array.from({ length: 4 }).map((_, r) =>
                      Array.from({ length: 16 }).map((_, c) => (
                        <g key={`${r}-${c}`}>
                          <rect x={384 + c * 19} y={yTop + 7 + r * 9} width={17} height={7} fill={(r + c + Math.floor(tick / 2)) % 6 === 0 ? NV.accent : NV.accentDeep} fillOpacity={0.7} />
                          <rect x={724 + c * 19} y={yTop + 7 + r * 9} width={17} height={7} fill={(r + c + Math.floor(tick / 2)) % 7 === 0 ? NV.accent : NV.accentDeep} fillOpacity={0.7} />
                        </g>
                      )),
                    )}
                    {/* NV-HBI bridge */}
                    <rect x={700} y={yTop + 18} width={20} height={12} fill={NV.accentBright} />
                    <text x={710} y={yTop + 60} textAnchor="middle" fontSize={7} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
                      NV-HBI
                    </text>
                  </g>
                )}
                {/* substrate balls (BGA) */}
                {l.name === 'PCB' && (
                  <g>
                    {Array.from({ length: 32 }).map((_, j) => (
                      <circle key={j} cx={310 + j * 25} cy={yTop + 60} r={3} fill={NV.accent} fillOpacity={0.8} />
                    ))}
                  </g>
                )}
                {/* layer label */}
                <text x={290} y={yTop + 30} textAnchor="end" fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={isActive ? NV.accentBright : NV.accent} opacity={isActive ? 1 : 0.6}>
                  {l.name}
                </text>
                <text x={1110} y={yTop + 22} fontSize={9} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={isActive ? NV.text : NV.textDim} opacity={isActive ? 1 : 0.6}>
                  {l.desc}
                </text>
              </g>
            );
          })}
        </g>

        {/* cursor crosshair */}
        {mouse && (
          <g>
            <line x1={mouse.x * 1400} y1={0} x2={mouse.x * 1400} y2={900} stroke={NV.accent} strokeOpacity={0.18} strokeWidth={0.5} strokeDasharray="2 8" />
            <line x1={0} y1={mouse.y * 900} x2={1400} y2={mouse.y * 900} stroke={NV.accentBright} strokeOpacity={0.3} strokeWidth={0.6} />
          </g>
        )}
      </svg>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        CROSS-SECTION · {chip.vendor} · {chip.name}
      </div>
      <div className="absolute top-5 right-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        {featured.map((c, i) => (
          <span key={c.id} style={{ marginLeft: 12, color: i === chipIdx ? NV.accentBright : 'inherit' }}>
            {c.name}
          </span>
        ))}
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ MOVE CURSOR · X SELECTS CHIP · Y HIGHLIGHTS LAYER
      </div>
    </div>
  );
}
