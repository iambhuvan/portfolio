'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Isometric rack of GPU servers — cursor lights up the GPU under it
export default function ServerRackIso() {
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

  // 6 servers stacked vertically, 8 GPUs each
  const servers = Array.from({ length: 6 }, (_, sIdx) => {
    const yBase = 100 + sIdx * 110;
    const board = CHIPS[sIdx % CHIPS.length];
    return {
      idx: sIdx,
      yBase,
      label: sIdx === 0 ? 'HGX B200 · NVL8' : sIdx === 1 ? 'HGX H200' : sIdx === 2 ? 'HGX H100' : sIdx === 3 ? 'HGX A100' : sIdx === 4 ? 'GB200 NVL72 · TRAY' : 'TRAINIUM2 · UltraServer',
      chip: board,
    };
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
            'radial-gradient(ellipse at 30% 50%, rgba(118,185,0,0.14) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(70,110,0,0.16) 0%, transparent 60%)',
        }}
      />

      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* rack frame */}
        <g transform="skewY(-8)">
          <rect x={120} y={60} width={1100} height={780} fill="#040603" stroke={NV.accent} strokeOpacity="0.4" strokeWidth="1.2" rx={4} />
          <rect x={120} y={60} width={1100} height={28} fill={NV.accentDeep} fillOpacity="0.35" />
          <text x={140} y={80} fontSize={11} letterSpacing="3" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
            DGX SUPERPOD · RACK 04 · DC-EAST
          </text>
          <rect x={1180} y={66} width={32} height={16} fill={NV.accent} opacity={(Math.sin(tick * 0.08) + 1) / 2 * 0.7 + 0.3} />
        </g>

        {servers.map((s) => {
          const yServer = s.yBase;
          // skewed card transform
          return (
            <g key={s.idx} transform={`translate(0, ${yServer}) skewY(-8)`}>
              {/* server chassis */}
              <rect x={140} y={0} width={1060} height={88} rx={3} fill="#0a1005" stroke={NV.accent} strokeOpacity="0.45" strokeWidth={0.8} />
              {/* server label */}
              <text x={160} y={20} fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent}>
                {String(s.idx + 1).padStart(2, '0')}U · {s.label}
              </text>
              {/* power LEDs */}
              {Array.from({ length: 4 }).map((_, i) => (
                <circle
                  key={i}
                  cx={1180 - i * 12}
                  cy={20}
                  r={2}
                  fill={NV.accentBright}
                  opacity={(Math.sin(tick * 0.1 + i + s.idx) + 1.5) / 3}
                />
              ))}
              {/* 8 GPUs */}
              {Array.from({ length: 8 }).map((_, gIdx) => {
                const gx = 230 + gIdx * 115;
                const gy = 32;
                const gwidth = 100;
                const gheight = 50;
                // global mouse intersect approximate (skewY makes it fuzzy but acceptable)
                const cx = gx + gwidth / 2;
                const cy = yServer + gy + gheight / 2 - cx * 0.14; // approx skew
                const dist = mouse ? Math.hypot(mouse.x - cx, mouse.y - cy) : 9999;
                const reveal = mouse ? Math.max(0, 1 - dist / 240) : 0;
                const lit = dist < 80;
                const tileLitIdx = (Math.floor(tick / 5) + gIdx + s.idx) % 12;
                return (
                  <g key={gIdx}>
                    <rect
                      x={gx}
                      y={gy}
                      width={gwidth}
                      height={gheight}
                      rx={3}
                      fill={lit ? '#0e1f06' : '#080d04'}
                      stroke={lit ? NV.accentBright : NV.accent}
                      strokeOpacity={lit ? 0.95 : 0.32 + reveal * 0.5}
                      strokeWidth={lit ? 1.4 : 0.6}
                    />
                    {/* heatsink fins */}
                    {Array.from({ length: 12 }).map((_, f) => (
                      <line
                        key={f}
                        x1={gx + 6 + f * 7.5}
                        y1={gy + 4}
                        x2={gx + 6 + f * 7.5}
                        y2={gy + gheight - 4}
                        stroke={NV.accent}
                        strokeOpacity={f === tileLitIdx && lit ? 0.95 : 0.2 + reveal * 0.4}
                        strokeWidth={0.5}
                      />
                    ))}
                    {/* chip die at center of card */}
                    <rect
                      x={gx + 35}
                      y={gy + 18}
                      width={30}
                      height={14}
                      fill={lit ? NV.accent : NV.accentDeep}
                      fillOpacity={lit ? 0.85 : 0.35}
                    />
                    {/* NVLink slot */}
                    <rect
                      x={gx + 4}
                      y={gy + gheight - 6}
                      width={gwidth - 8}
                      height={2}
                      fill={NV.accent}
                      opacity={lit ? 0.9 : 0.3}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* HUD */}
      <div
        className="absolute top-5 right-6 text-[10px] uppercase tracking-[0.3em] flex flex-col items-end gap-1"
        style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>DC-EAST · 42U · NVLink Switch</span>
        <span style={{ color: NV.textDim }}>POWER: 1.2 MW · TEMP: 28.4°C</span>
      </div>
      <div
        className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}
      >
        ▸ MOVE CURSOR · ILLUMINATE GPU
      </div>
    </div>
  );
}
