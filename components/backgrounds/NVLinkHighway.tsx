'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Side-scrolling NVLink highway between chip "cities"
export default function NVLinkHighway() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 35);
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

  // 5 horizontal lanes, each with a label
  const lanes = [
    { y: 220, label: 'NVLINK 5 · 1.8 TB/s', color: NV.accentBright },
    { y: 340, label: 'NVSWITCH · 14.4 TB/s', color: NV.accentBright },
    { y: 460, label: 'INFINITY FABRIC · 5.3 TB/s', color: NV.accent },
    { y: 580, label: 'PCIe Gen 5 · 128 GB/s', color: NV.accent },
    { y: 700, label: 'CXL 3.0 · 64 GB/s', color: NV.accent },
  ];

  // City silhouettes on left and right
  const leftCity = CHIPS.slice(0, 5);
  const rightCity = CHIPS.slice(5, 10);

  // Active lane = closest to cursor Y
  let activeLane = -1;
  if (mouse) {
    let best = 1e9;
    lanes.forEach((l, i) => {
      const d = Math.abs(l.y - mouse.y);
      if (d < best) {
        best = d;
        activeLane = i;
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
          background: 'linear-gradient(180deg, transparent 0%, rgba(118,185,0,0.05) 60%, transparent 100%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* horizon line */}
        <line x1={0} y1={150} x2={1400} y2={150} stroke={NV.accent} strokeOpacity={0.25} strokeDasharray="2 8" />

        {/* left city — vertical stack of chip cards */}
        <g>
          <rect x={20} y={170} width={170} height={580} fill="#040603" stroke={NV.accent} strokeOpacity={0.5} />
          <text x={105} y={194} textAnchor="middle" fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
            CITY · WEST
          </text>
          {leftCity.map((c, i) => {
            const yc = 220 + i * 105;
            return (
              <g key={c.id}>
                <rect x={36} y={yc} width={140} height={86} rx={3} fill="#0a1505" stroke={NV.accent} strokeOpacity={0.55} />
                {/* heatsink fins */}
                {Array.from({ length: 8 }).map((_, j) => (
                  <line
                    key={j}
                    x1={42 + j * 16}
                    y1={yc + 6}
                    x2={42 + j * 16}
                    y2={yc + 80}
                    stroke={NV.accent}
                    strokeOpacity={0.32}
                  />
                ))}
                {/* glowing window */}
                <rect x={50} y={yc + 30} width={108} height={26} fill={NV.accent} fillOpacity={0.18} />
                <text x={106} y={yc + 47} textAnchor="middle" fontSize={11} fontStyle="italic" style={{ fontFamily: 'var(--font-display), serif' }} fill={NV.text}>
                  {c.name}
                </text>
                <text x={106} y={yc + 76} textAnchor="middle" fontSize={7} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent}>
                  {c.arch.split('·')[0].trim()}
                </text>
              </g>
            );
          })}
        </g>

        {/* right city */}
        <g>
          <rect x={1210} y={170} width={170} height={580} fill="#040603" stroke={NV.accent} strokeOpacity={0.5} />
          <text x={1295} y={194} textAnchor="middle" fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
            CITY · EAST
          </text>
          {rightCity.map((c, i) => {
            const yc = 220 + i * 105;
            return (
              <g key={c.id}>
                <rect x={1226} y={yc} width={140} height={86} rx={3} fill="#0a1505" stroke={NV.accent} strokeOpacity={0.55} />
                {Array.from({ length: 8 }).map((_, j) => (
                  <line
                    key={j}
                    x1={1232 + j * 16}
                    y1={yc + 6}
                    x2={1232 + j * 16}
                    y2={yc + 80}
                    stroke={NV.accent}
                    strokeOpacity={0.32}
                  />
                ))}
                <rect x={1240} y={yc + 30} width={108} height={26} fill={NV.accent} fillOpacity={0.18} />
                <text x={1296} y={yc + 47} textAnchor="middle" fontSize={11} fontStyle="italic" style={{ fontFamily: 'var(--font-display), serif' }} fill={NV.text}>
                  {c.name}
                </text>
                <text x={1296} y={yc + 76} textAnchor="middle" fontSize={7} style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent}>
                  {c.arch.split('·')[0].trim()}
                </text>
              </g>
            );
          })}
        </g>

        {/* lanes with traffic */}
        {lanes.map((lane, li) => {
          const isActive = li === activeLane && mouse;
          return (
            <g key={li}>
              <line
                x1={196}
                y1={lane.y}
                x2={1204}
                y2={lane.y}
                stroke={isActive ? lane.color : NV.accent}
                strokeOpacity={isActive ? 0.55 : 0.18}
                strokeWidth={isActive ? 1.4 : 0.7}
              />
              <text x={700} y={lane.y - 8} textAnchor="middle" fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={isActive ? lane.color : NV.accent} opacity={isActive ? 1 : 0.7}>
                {lane.label}
              </text>
              {/* packets */}
              {Array.from({ length: 12 }).map((_, pi) => {
                const dir = pi % 2 === 0 ? 1 : -1;
                const speed = isActive ? 2 : 1.2;
                let phase = ((tick * speed + pi * 18) % 1000) / 1000;
                let px = dir > 0 ? 196 + phase * 1008 : 1204 - phase * 1008;
                // bend toward cursor when active
                let py = lane.y;
                if (mouse && isActive) {
                  const dxm = mouse.x - px;
                  const force = Math.max(0, 1 - Math.abs(dxm) / 200) * 22;
                  py = lane.y + (mouse.y - lane.y) * 0.18 * force / 22;
                }
                return (
                  <g key={pi}>
                    <line x1={px - dir * 14} y1={py} x2={px} y2={py} stroke={lane.color} strokeOpacity={isActive ? 0.95 : 0.55} strokeWidth={isActive ? 2 : 1.2} />
                    <circle cx={px} cy={py} r={isActive ? 2.4 : 1.6} fill={lane.color} />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* cursor probe */}
        {mouse && (
          <g>
            <line x1={mouse.x} y1={150} x2={mouse.x} y2={760} stroke={NV.accentBright} strokeOpacity={0.18} strokeDasharray="2 6" />
            <circle cx={mouse.x} cy={mouse.y} r={6} fill={NV.accentBright} />
          </g>
        )}
      </svg>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        NVLINK HIGHWAY · 5 LANES · BIDIRECTIONAL
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ MOVE CURSOR Y · SELECTS LANE · PACKETS BEND
      </div>
    </div>
  );
}
