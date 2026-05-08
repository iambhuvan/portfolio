'use client';

import { useEffect, useRef, useState } from 'react';
import { NV, CHIPS } from './_palette';

// Vertical streaming tokens through GPU columns; cursor slows and highlights one column
export default function TokenStream() {
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
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const columns = CHIPS.slice(0, 9);
  const tokens = [
    'fp8.matmul', 'kv.cache.write', '0xA3F21B', 'mha.softmax', 'rope.rotate',
    'tensor.add', 'allreduce.ring', 'flash.attn.v3', 'INT4.dequant', 'silu',
    'norm.RMS', 'embed.lookup', 'gate.experts', 'router.top2', 'logits.argmax',
    'paged.attn', 'kv.evict.LRU', 'speculate.draft', 'verify.target', 'sample.topk',
    'fwd.0', 'bwd.0', 'optim.adam', 'gradAccum', 'bf16→fp32',
    'NVLink.send', 'NVLink.recv', 'p2p.copy', 'cudaMemcpy', 'overlap.compute',
  ];

  // Each column has its own falling token list
  const colWidth = 1 / columns.length;

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
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
      <svg viewBox="0 0 1400 900" className="absolute inset-0 w-full h-full">
        {columns.map((col, ci) => {
          const cxFrac = (ci + 0.5) * colWidth;
          const cx = cxFrac * 1400;
          // cursor proximity by X
          const dist = mouse ? Math.abs(mouse.x - cxFrac) : 1;
          const isActive = dist < colWidth * 0.6;
          const reveal = mouse ? Math.max(0, 1 - dist / (colWidth * 1.5)) : 0;
          const speed = isActive ? 0.6 : 1.6 + (ci % 3) * 0.4;
          const offset = (tick * speed) % 50;
          // column header card
          return (
            <g key={col.id}>
              {/* column glow when active */}
              {isActive && (
                <rect
                  x={cx - 70}
                  y={0}
                  width={140}
                  height={900}
                  fill={NV.accent}
                  fillOpacity={0.05}
                />
              )}
              {/* column rule */}
              <line
                x1={cx}
                y1={0}
                x2={cx}
                y2={900}
                stroke={NV.accent}
                strokeOpacity={isActive ? 0.18 : 0.06}
                strokeWidth={0.5}
              />
              {/* falling tokens */}
              {Array.from({ length: 26 }).map((_, ri) => {
                const yPos = ((ri * 36 - offset * 4) % 1000) - 50;
                const tokenIdx = (ri * 13 + ci * 7 + Math.floor(tick / 30)) % tokens.length;
                const lit = ri === 0;
                const opacity = lit ? 1 : Math.max(0.1, 0.85 - ri * 0.04);
                return (
                  <text
                    key={ri}
                    x={cx}
                    y={yPos}
                    textAnchor="middle"
                    fontSize={isActive ? 12 : 10}
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                    fill={lit ? NV.accentBright : NV.accent}
                    fillOpacity={opacity * (0.4 + reveal * 0.6)}
                  >
                    {tokens[tokenIdx]}
                  </text>
                );
              })}
              {/* column header */}
              <rect
                x={cx - 70}
                y={20}
                width={140}
                height={70}
                fill={isActive ? '#0e1f06' : '#040603'}
                stroke={isActive ? NV.accentBright : NV.accent}
                strokeOpacity={isActive ? 1 : 0.4}
                strokeWidth={isActive ? 1.4 : 0.7}
                rx={4}
              />
              <text
                x={cx}
                y={42}
                textAnchor="middle"
                fontSize={9}
                letterSpacing="2.5"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={NV.accent}
              >
                {col.vendor}
              </text>
              <text
                x={cx}
                y={66}
                textAnchor="middle"
                fontSize={isActive ? 16 : 14}
                fontStyle="italic"
                style={{ fontFamily: 'var(--font-display), serif' }}
                fill={isActive ? NV.accentBright : NV.text}
              >
                {col.name}
              </text>
              <text
                x={cx}
                y={82}
                textAnchor="middle"
                fontSize={8}
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={NV.textDim}
              >
                {col.arch.split('·')[0].trim()}
              </text>
              {/* footer bar */}
              <rect
                x={cx - 60}
                y={850}
                width={120}
                height={3}
                fill={NV.accent}
                fillOpacity={isActive ? 0.95 : 0.4}
              />
              <text
                x={cx}
                y={878}
                textAnchor="middle"
                fontSize={8}
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={NV.accent}
                fillOpacity={isActive ? 1 : 0.5}
              >
                {isActive ? `${(98.4 - dist * 100).toFixed(1)}% util` : `${(40 + (ci * 11) % 50).toFixed(0)}%`}
              </text>
            </g>
          );
        })}

        {mouse && (
          <line
            x1={mouse.x * 1400}
            y1={0}
            x2={mouse.x * 1400}
            y2={900}
            stroke={NV.accentBright}
            strokeOpacity={0.4}
            strokeWidth={1}
          />
        )}
      </svg>
      <div
        className="absolute top-5 right-6 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.accent, fontFamily: 'var(--font-mono), monospace' }}
      >
        DISPATCH STREAM · {columns.length} CHIPS
      </div>
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: NV.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        ▸ HOVER A COLUMN · STREAM SLOWS, CHIP IS HIGHLIGHTED
      </div>
    </div>
  );
}
