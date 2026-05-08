'use client';

import { useEffect, useRef, useState } from 'react';
import { NV } from './_palette';

// Wafer fab time-lapse — cursor X scrubs through fabrication steps; layers build up
export default function WaferFab() {
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

  // Steps progress from 0 → 1
  const STEPS = [
    { name: 'BLANK SUBSTRATE', desc: 'silicon ingot · sliced 300mm wafer' },
    { name: 'OXIDATION', desc: 'thermal SiO2 grown on surface' },
    { name: 'PHOTOLITHOGRAPHY', desc: 'EUV mask exposed · pattern transferred' },
    { name: 'ETCH', desc: 'reactive ion etch · removes exposed oxide' },
    { name: 'ION IMPLANT', desc: 'doping · n-type / p-type regions' },
    { name: 'METAL DEPOSITION', desc: 'Cu interconnect · metal-1 → metal-12' },
    { name: 'CMP', desc: 'chemical-mechanical planarization' },
    { name: 'PACKAGING', desc: 'CoWoS interposer · HBM bonded · final test' },
  ];
  const progress = mouse ? mouse.x : (Math.sin(tick * 0.01) + 1) / 2;
  const stepIdx = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const sub = (progress * STEPS.length) - stepIdx; // 0..1 within step
  const step = STEPS[stepIdx];

  // Build a per-step layer set
  const cx = 700, cy = 480, r = 320;
  const showOxide = stepIdx >= 1;
  const showLitho = stepIdx >= 2;
  const showEtch = stepIdx >= 3;
  const showImplant = stepIdx >= 4;
  const showMetal = stepIdx >= 5;
  const showCmp = stepIdx >= 6;
  const showPkg = stepIdx >= 7;

  // Die grid pattern (for litho/etch/metal)
  const dieGrid: { x: number; y: number; w: number; h: number }[] = [];
  const dieW = 56, dieH = 44;
  for (let row = -7; row <= 7; row++) {
    for (let col = -9; col <= 9; col++) {
      const x = cx + col * (dieW + 4);
      const y = cy + row * (dieH + 4);
      const d = Math.hypot(x - cx, y - cy);
      if (d > r - 18) continue;
      if (y > cy + r * 0.92) continue;
      dieGrid.push({ x: x - dieW / 2, y: y - dieH / 2, w: dieW, h: dieH });
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouse(null)}
      className="relative w-full h-full overflow-hidden cursor-ew-resize"
      style={{ background: NV.bg }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 60%, rgba(118,185,0,0.10) 0%, transparent 60%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {/* wafer base substrate */}
        <defs>
          <radialGradient id="substrate">
            <stop offset="0%" stopColor="#0a1505" />
            <stop offset="100%" stopColor="#040603" />
          </radialGradient>
        </defs>
        <path
          d={`M ${cx},${cy - r}
              A ${r},${r} 0 1 0 ${cx + r * 0.34},${cy + r * 0.94}
              L ${cx - r * 0.34},${cy + r * 0.94}
              A ${r},${r} 0 0 0 ${cx},${cy - r} Z`}
          fill="url(#substrate)"
          stroke={NV.accent}
          strokeOpacity={0.65}
          strokeWidth={1.2}
        />
        <circle cx={cx} cy={cy + r * 0.94} r={6} fill={NV.bg} stroke={NV.accent} strokeOpacity={0.8} />

        {/* OXIDE layer — uniform translucent green */}
        {showOxide && (
          <circle
            cx={cx}
            cy={cy}
            r={r - 6}
            fill={NV.accent}
            fillOpacity={0.07 + (stepIdx === 1 ? sub : 1) * 0.05}
          />
        )}

        {/* LITHOGRAPHY — pattern grid overlay; appears with sub progress */}
        {showLitho &&
          dieGrid.map((d, i) => (
            <rect
              key={`l-${i}`}
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              fill="none"
              stroke={NV.accent}
              strokeOpacity={stepIdx === 2 ? sub * 0.6 : 0.45}
              strokeDasharray={stepIdx === 2 ? '3 3' : undefined}
              strokeWidth={0.7}
            />
          ))}

        {/* ETCH — die fills become darker (etched-out) */}
        {showEtch &&
          dieGrid.map((d, i) => (
            <rect
              key={`e-${i}`}
              x={d.x + 2}
              y={d.y + 2}
              width={d.w - 4}
              height={d.h - 4}
              fill="#040603"
              fillOpacity={stepIdx === 3 ? sub * 0.85 : 0.85}
            />
          ))}

        {/* ION IMPLANT — colored dopant patches */}
        {showImplant &&
          dieGrid.map((d, i) => {
            const intensity = stepIdx === 4 ? sub : 1;
            return (
              <g key={`i-${i}`}>
                <rect x={d.x + 4} y={d.y + 4} width={d.w / 2 - 4} height={d.h - 8} fill={NV.accentBright} fillOpacity={0.18 * intensity} />
                <rect x={d.x + d.w / 2} y={d.y + 4} width={d.w / 2 - 4} height={d.h - 8} fill={NV.accent} fillOpacity={0.18 * intensity} />
              </g>
            );
          })}

        {/* METAL — fine line interconnect */}
        {showMetal &&
          dieGrid.map((d, i) => {
            const intensity = stepIdx === 5 ? sub : 1;
            return (
              <g key={`m-${i}`} opacity={intensity}>
                {Array.from({ length: 4 }).map((_, ri) => (
                  <line
                    key={`mr-${ri}`}
                    x1={d.x + 6}
                    y1={d.y + 8 + ri * 8}
                    x2={d.x + d.w - 6}
                    y2={d.y + 8 + ri * 8}
                    stroke={NV.accentBright}
                    strokeWidth={0.6}
                    strokeOpacity={0.7}
                  />
                ))}
                {Array.from({ length: 5 }).map((_, ci) => (
                  <line
                    key={`mc-${ci}`}
                    x1={d.x + 8 + ci * 10}
                    y1={d.y + 6}
                    x2={d.x + 8 + ci * 10}
                    y2={d.y + d.h - 6}
                    stroke={NV.accent}
                    strokeWidth={0.4}
                    strokeOpacity={0.5}
                  />
                ))}
              </g>
            );
          })}

        {/* CMP — polish / smooth surface highlight */}
        {showCmp && (
          <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke={NV.accentBright} strokeOpacity={stepIdx === 6 ? sub * 0.4 : 0.25} strokeWidth={1.2} />
        )}

        {/* PACKAGING — show one die enlarged at corner with HBM bonded */}
        {showPkg && (
          <g opacity={stepIdx === 7 ? sub : 1}>
            <rect x={1080} y={120} width={260} height={200} rx={6} fill="#040603" stroke={NV.accent} strokeOpacity={0.85} />
            <text x={1100} y={144} fontSize={10} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
              FINAL PACKAGE
            </text>
            {/* die */}
            <rect x={1180} y={170} width={70} height={120} fill={NV.accent} fillOpacity={0.5} stroke={NV.accentBright} />
            {/* HBM stacks */}
            <rect x={1108} y={170} width={56} height={120} fill={NV.accentBright} fillOpacity={0.2} stroke={NV.accent} />
            <rect x={1262} y={170} width={56} height={120} fill={NV.accentBright} fillOpacity={0.2} stroke={NV.accent} />
            <text x={1216} y={310} textAnchor="middle" fontSize={10} fontStyle="italic" style={{ fontFamily: 'var(--font-display), serif' }} fill={NV.text}>
              compute · HBM · CoWoS
            </text>
          </g>
        )}

        {/* timeline */}
        <g>
          <line x1={120} y1={830} x2={1280} y2={830} stroke={NV.accent} strokeOpacity={0.45} />
          {STEPS.map((s, i) => {
            const x = 120 + (i / (STEPS.length - 1)) * 1160;
            const isActive = i === stepIdx;
            const isPast = i < stepIdx;
            return (
              <g key={i}>
                <circle cx={x} cy={830} r={isActive ? 7 : 4} fill={isPast || isActive ? NV.accentBright : NV.accent} fillOpacity={isPast ? 0.65 : 1} stroke={NV.bg} strokeWidth={1} />
                <text
                  x={x}
                  y={862}
                  textAnchor="middle"
                  fontSize={9}
                  letterSpacing="1.5"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                  fill={isActive ? NV.accentBright : NV.textDim}
                  opacity={isActive ? 1 : 0.7}
                >
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}
          {/* progress fill */}
          <line
            x1={120}
            y1={830}
            x2={120 + progress * 1160}
            y2={830}
            stroke={NV.accentBright}
            strokeWidth={2}
          />
        </g>
      </svg>

      {/* step name display */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 text-right pointer-events-none">
        <div
          className="text-[10px] uppercase tracking-[0.32em] mb-2"
          style={{ color: NV.accentBright, fontFamily: 'var(--font-mono), monospace' }}
        >
          STEP {String(stepIdx + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </div>
        <h3
          className="leading-none mb-3"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontStyle: 'italic',
            fontSize: '2.2rem',
            color: NV.text,
          }}
        >
          {step.name.toLowerCase()}
        </h3>
        <p className="max-w-[280px] text-[11px]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
          {step.desc}
        </p>
      </div>

      <div className="absolute top-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}>
        WAFER FAB · TIMELINE · {STEPS.length} STEPS
      </div>
      <div className="absolute bottom-5 left-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}>
        ▸ MOVE CURSOR LEFT → RIGHT · SCRUB FABRICATION
      </div>
    </div>
  );
}
