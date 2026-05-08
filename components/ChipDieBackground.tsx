'use client';

import { useEffect, useRef, useState } from 'react';
import { CHIP_SPECS, type ChipSpec } from '@/lib/chipspecs';

const NV = {
  bg: '#000000',
  text: '#eaf6d6',
  textDim: '#9ab27a',
  textFaint: '#465c34',
  accent: '#76b900',
  accentBright: '#9ad03d',
  accentDeep: '#466e00',
  rule: 'rgba(118,185,0,0.18)',
  ruleSoft: 'rgba(118,185,0,0.08)',
};

const DECODE_CHARS = '01ABCDEF$%&*+=/<>?#@';

function useBitDecode(target: string, duration = 380, key?: string | number) {
  const [text, setText] = useState(target);
  useEffect(() => {
    const start = Date.now();
    let frame: number;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const reveal = Math.floor(t * target.length);
      let s = target.slice(0, reveal);
      for (let i = reveal; i < target.length; i++) {
        const c = target[i];
        if (c === ' ' || c === '\n' || c === '·') s += c;
        else s += DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
      }
      setText(s);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, key]);
  return text;
}

type Zone = 'compute' | 'hbm' | 'l2' | 'nvlink' | 'pcie' | 'bridge' | null;

export default function ChipDieBackground() {
  const [chipIdx, setChipIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [zone, setZone] = useState<Zone>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setChipIdx((i) => (i + 1) % CHIP_SPECS.length), 9000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    const onLeave = () => setMouse(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const chip = CHIP_SPECS[chipIdx];
  const chipName = useBitDecode(chip.name, 360, chipIdx);
  const chipCode = useBitDecode(chip.codename, 360, chipIdx);
  const peakLabel = peakOpForChip(chip);
  const peak = useBitDecode(peakLabel.value, 360, chipIdx);
  const peakName = useBitDecode(peakLabel.label, 360, chipIdx);
  const memLine = useBitDecode(`${chip.memory.capacity_gb} GB ${chip.memory.type} · ${chip.memory.bw_tbs} TB/s`, 360, chipIdx);
  const procLine = useBitDecode(`${chip.process.node} · ${chip.process.transistors_b > 0 ? chip.process.transistors_b + 'B trans' : chip.die.layout}`, 360, chipIdx);

  return (
    <>
      {/* Background die */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(118,185,0,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(70,110,0,0.10) 0%, transparent 55%), #000',
          }}
        />
        {/* cursor halo */}
        {mouse && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: mouse.x,
              top: mouse.y,
              transform: 'translate(-50%, -50%)',
              width: '36rem',
              height: '36rem',
              background: 'radial-gradient(circle, rgba(118,185,0,0.16) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
        )}
        <FullDie
          chip={chip}
          chipKey={chipIdx}
          zone={zone}
          setZone={setZone}
          mouse={mouse}
          tick={tick}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.62) 100%)',
          }}
        />
      </div>

      {/* MINI INFO STRIP — bottom-left */}
      <div
        className="fixed bottom-6 left-6 z-30 pointer-events-none select-none"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        <div
          className="px-4 py-3 border backdrop-blur-md"
          style={{
            background: 'rgba(0,0,0,0.55)',
            borderColor: NV.rule,
            minWidth: 280,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: NV.accentBright, boxShadow: `0 0 8px ${NV.accentBright}` }} />
            <span className="text-[9px] uppercase tracking-[0.32em]" style={{ color: NV.accentBright }}>
              ON DIE · LIVE
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: NV.textDim }}>
              {chip.vendor}
            </span>
            <span style={{ color: NV.textFaint }}>·</span>
            <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: NV.textDim }}>
              {chip.release}
            </span>
          </div>
          <div className="leading-none mb-1" style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.6rem', fontStyle: 'italic', color: NV.text }}>
            {chipName}
          </div>
          <div className="text-[10px] mb-3" style={{ color: NV.textDim }}>
            {chipCode}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <span style={{ color: NV.textDim }}>peak</span>
            <span className="text-right tabular-nums" style={{ color: NV.accentBright }}>
              {peak} <span style={{ color: NV.textDim }}>{peakName}</span>
            </span>
            <span style={{ color: NV.textDim }}>memory</span>
            <span className="text-right" style={{ color: NV.text }}>{memLine}</span>
            <span style={{ color: NV.textDim }}>process</span>
            <span className="text-right" style={{ color: NV.text }}>{procLine}</span>
          </div>
        </div>
      </div>

      {/* CHIP SELECTOR — bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-30"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        <div
          className="px-3 py-2 border backdrop-blur-md flex items-center gap-1"
          style={{ background: 'rgba(0,0,0,0.55)', borderColor: NV.rule }}
        >
          <span className="text-[9px] uppercase tracking-[0.28em] mr-2" style={{ color: NV.textDim }}>
            FLEET
          </span>
          {CHIP_SPECS.map((c, i) => {
            const active = i === chipIdx;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setChipIdx(i);
                  setPaused(true);
                }}
                onMouseEnter={() => {
                  setChipIdx(i);
                  setPaused(true);
                }}
                title={`${c.vendor} ${c.name}`}
                className="px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-all"
                style={{
                  color: active ? NV.bg : NV.textDim,
                  background: active ? NV.accentBright : 'transparent',
                  border: `1px solid ${active ? NV.accentBright : NV.rule}`,
                }}
              >
                {c.id}
              </button>
            );
          })}
          <button
            onClick={() => setPaused((p) => !p)}
            className="ml-2 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em]"
            style={{ color: NV.accent, border: `1px solid ${NV.rule}` }}
            title={paused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
          >
            {paused ? '▶ play' : '⏸ pause'}
          </button>
        </div>
      </div>

      {/* DATASHEET TOGGLE — right edge tab */}
      <button
        onClick={() => setDrawer((d) => !d)}
        className="fixed top-1/2 right-0 z-40 -translate-y-1/2 px-3 py-5 transition-transform"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: drawer ? NV.bg : NV.accentBright,
          background: drawer ? NV.accentBright : 'rgba(0,0,0,0.7)',
          border: `1px solid ${NV.accentBright}`,
          borderRight: 'none',
          writingMode: 'vertical-rl',
          backdropFilter: 'blur(8px)',
        }}
      >
        {drawer ? '× CLOSE' : '▸ DATASHEET'}
      </button>

      {/* DATASHEET DRAWER */}
      <div
        className="fixed top-0 right-0 bottom-0 z-40 transition-transform"
        style={{
          width: 'min(440px, 92vw)',
          transform: drawer ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(12px)',
          borderLeft: `1px solid ${NV.rule}`,
          fontFamily: 'var(--font-mono), monospace',
        }}
      >
        <div className="h-full overflow-y-auto">
          <CompactDatasheet chip={chip} chipKey={chipIdx} zone={zone} />
        </div>
      </div>
    </>
  );
}

/* ============================== Full die ============================== */

function FullDie({
  chip,
  chipKey,
  zone,
  setZone,
  mouse,
  tick,
}: {
  chip: ChipSpec;
  chipKey: number;
  zone: Zone;
  setZone: (z: Zone) => void;
  mouse: { x: number; y: number } | null;
  tick: number;
}) {
  const W = 1600;
  const H = 1000;
  const padX = 220;
  const padY = 160;
  const dieX = padX;
  const dieY = padY;
  const dieW = W - padX * 2;
  const dieH = H - padY * 2;

  const isDual = chip.die.layout === 'dual-die';
  const isChiplet = chip.die.layout === 'chiplet' && (chip.die.xcds || 0) >= 8;
  const isTrainium = chip.id === 'tr2';

  const hbmW = 100;
  const hbmGap = 14;
  const hbmStacks = chip.memory.stacks || 4;
  const hbmLeft = Math.ceil(hbmStacks / 2);
  const hbmRight = Math.floor(hbmStacks / 2);

  const innerX = dieX + hbmW + hbmGap;
  const innerY = dieY + 60;
  const innerW = dieW - hbmW * 2 - hbmGap * 2;
  const innerH = dieH - 110;

  const cols = isChiplet ? 16 : isDual ? 24 : 14;
  const rows = isChiplet ? 8 : isDual ? 12 : 12;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
      onMouseLeave={() => setZone(null)}
    >
      <defs>
        <pattern id="bg-pcb" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 22 0 L 0 0 0 22" fill="none" stroke={NV.accent} strokeOpacity="0.05" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#bg-pcb)" opacity={0.5} />

      {/* substrate */}
      <rect
        x={dieX - 10}
        y={dieY - 10}
        width={dieW + 20}
        height={dieH + 20}
        rx={12}
        fill="#040603"
        fillOpacity={0.55}
        stroke={NV.accent}
        strokeOpacity={0.4}
        strokeWidth={1}
      />
      {[
        [dieX - 6, dieY - 6],
        [dieX + dieW + 6, dieY - 6],
        [dieX - 6, dieY + dieH + 6],
        [dieX + dieW + 6, dieY + dieH + 6],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={NV.accent} fillOpacity={0.7} />
      ))}

      {/* die body */}
      <g key={`die-${chipKey}`} style={{ animation: 'fadein 0.6s ease-out' }}>
        <rect
          x={dieX}
          y={dieY}
          width={dieW}
          height={dieH}
          rx={8}
          fill="#040603"
          stroke={NV.accent}
          strokeOpacity={0.55}
          strokeWidth={1}
        />

        {/* HBM left */}
        {Array.from({ length: hbmLeft }).map((_, i) => {
          const sH = (innerH - (hbmLeft - 1) * 14) / hbmLeft;
          const y = innerY + i * (sH + 14);
          return (
            <HbmStack
              key={`hl-${i}`}
              x={dieX + 12}
              y={y}
              w={hbmW}
              h={sH}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}
        {Array.from({ length: hbmRight }).map((_, i) => {
          const sH = (innerH - (hbmRight - 1) * 14) / hbmRight;
          const y = innerY + i * (sH + 14);
          return (
            <HbmStack
              key={`hr-${i}`}
              x={dieX + dieW - hbmW - 12}
              y={y}
              w={hbmW}
              h={sH}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}

        {/* Compute */}
        {isDual ? (
          <>
            <ComputeBlock
              x={innerX}
              y={innerY}
              w={innerW / 2 - 18}
              h={innerH}
              cols={cols / 2}
              rows={rows}
              active={zone === 'compute'}
              setZone={setZone}
              tick={tick}
              label="DIE A"
            />
            <ComputeBlock
              x={innerX + innerW / 2 + 18}
              y={innerY}
              w={innerW / 2 - 18}
              h={innerH}
              cols={cols / 2}
              rows={rows}
              active={zone === 'compute'}
              setZone={setZone}
              tick={tick}
              label="DIE B"
            />
            <g
              onMouseEnter={() => setZone('bridge')}
              onMouseLeave={() => setZone(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={innerX + innerW / 2 - 14}
                y={innerY + innerH / 2 - 100}
                width={28}
                height={200}
                fill={zone === 'bridge' ? NV.accentBright : NV.accent}
                fillOpacity={zone === 'bridge' ? 0.95 : 0.7}
              />
              <text
                x={innerX + innerW / 2}
                y={innerY + innerH / 2 + 130}
                textAnchor="middle"
                fontSize={11}
                letterSpacing="2.5"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={zone === 'bridge' ? NV.accentBright : NV.accent}
                opacity={zone === 'bridge' ? 1 : 0.7}
              >
                NV-HBI · 10 TB/s
              </text>
            </g>
          </>
        ) : isChiplet ? (
          Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 2 }).map((_, c) => (
              <ComputeBlock
                key={`xcd-${r}-${c}`}
                x={innerX + c * (innerW / 2 + 10)}
                y={innerY + r * (innerH / 4 + 6)}
                w={innerW / 2 - 10}
                h={innerH / 4 - 6}
                cols={6}
                rows={3}
                active={zone === 'compute'}
                setZone={setZone}
                tick={tick}
                label={`XCD ${r * 2 + c}`}
              />
            )),
          )
        ) : isTrainium ? (
          Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 2 }).map((_, c) => (
              <ComputeBlock
                key={`nc-${r}-${c}`}
                x={innerX + c * (innerW / 2 + 10)}
                y={innerY + r * (innerH / 4 + 6)}
                w={innerW / 2 - 10}
                h={innerH / 4 - 6}
                cols={5}
                rows={3}
                active={zone === 'compute'}
                setZone={setZone}
                tick={tick}
                label={`NC-v3 ${r * 2 + c}`}
              />
            )),
          )
        ) : (
          <ComputeBlock
            x={innerX}
            y={innerY}
            w={innerW}
            h={innerH}
            cols={cols}
            rows={rows}
            active={zone === 'compute'}
            setZone={setZone}
            tick={tick}
            label="COMPUTE · TENSOR CORES"
          />
        )}

        {/* L2 strip */}
        <g
          onMouseEnter={() => setZone('l2')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={innerX}
            y={dieY + 24}
            width={innerW}
            height={26}
            fill={zone === 'l2' ? '#86d92e' : NV.accentDeep}
            fillOpacity={zone === 'l2' ? 0.95 : 0.55}
          />
          <text
            x={innerX + innerW / 2}
            y={dieY + 42}
            textAnchor="middle"
            fontSize={10}
            letterSpacing="2.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
            fill={zone === 'l2' ? '#0a1505' : NV.text}
            opacity={zone === 'l2' ? 1 : 0.85}
          >
            L2 CACHE
          </text>
        </g>

        {/* NVLink */}
        <g
          onMouseEnter={() => setZone('nvlink')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={`nl-${i}`}
              x={innerX + 30 + (i * (innerW - 60)) / 11}
              y={dieY - 14}
              width={36}
              height={10}
              fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
              fillOpacity={zone === 'nvlink' ? 1 : 0.55}
            />
          ))}
          <text
            x={dieX + dieW / 2}
            y={dieY - 24}
            textAnchor="middle"
            fontSize={11}
            letterSpacing="2.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
            fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
            opacity={zone === 'nvlink' ? 1 : 0.7}
          >
            {chip.interconnect.fabric}
          </text>
        </g>

        {/* PCIe */}
        <g
          onMouseEnter={() => setZone('pcie')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={`pc-${i}`}
              x={innerX + 100 + i * 110}
              y={dieY + dieH + 4}
              width={70}
              height={10}
              fill={zone === 'pcie' ? NV.accentBright : NV.accent}
              fillOpacity={zone === 'pcie' ? 1 : 0.5}
            />
          ))}
          {chip.interconnect.pcie && (
            <text
              x={dieX + dieW / 2}
              y={dieY + dieH + 36}
              textAnchor="middle"
              fontSize={11}
              letterSpacing="2.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
              fill={zone === 'pcie' ? NV.accentBright : NV.accent}
              opacity={zone === 'pcie' ? 1 : 0.7}
            >
              {chip.interconnect.pcie}
            </text>
          )}
        </g>
      </g>

      {/* corner labels */}
      <text x={dieX + 12} y={dieY - 22} fontSize={11} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent} opacity={0.7}>
        {chip.vendor} · {chip.codename.toUpperCase()}
      </text>
      <text x={dieX + dieW - 12} y={dieY - 22} textAnchor="end" fontSize={11} letterSpacing="2.5" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accent} opacity={0.7}>
        {chip.process.node}
      </text>

      {/* Hot-zone tooltip near cursor */}
      {zone && mouse && <ZoneTooltip zone={zone} chip={chip} mouse={mouse} />}

      <style>{`@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </svg>
  );
}

function HbmStack({
  x,
  y,
  w,
  h,
  active,
  setZone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  active: boolean;
  setZone: (z: Zone) => void;
}) {
  return (
    <g
      onMouseEnter={() => setZone('hbm')}
      onMouseLeave={() => setZone(null)}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active ? NV.accentBright : '#0a1505'}
        fillOpacity={active ? 0.45 : 0.85}
        stroke={active ? NV.accentBright : NV.accent}
        strokeOpacity={active ? 1 : 0.55}
        strokeWidth={active ? 1.4 : 0.7}
      />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={x}
          y1={y + ((i + 1) * h) / 8}
          x2={x + w}
          y2={y + ((i + 1) * h) / 8}
          stroke={active ? NV.accentBright : NV.accent}
          strokeOpacity={0.42}
          strokeWidth={0.5}
        />
      ))}
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        letterSpacing="2"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
        fill={active ? NV.bg : NV.accent}
        opacity={active ? 1 : 0.85}
      >
        HBM
      </text>
    </g>
  );
}

function ComputeBlock({
  x,
  y,
  w,
  h,
  cols,
  rows,
  active,
  setZone,
  tick,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  active: boolean;
  setZone: (z: Zone) => void;
  tick: number;
  label?: string;
}) {
  const tw = w / cols;
  const th = h / rows;
  return (
    <g
      onMouseEnter={() => setZone('compute')}
      onMouseLeave={() => setZone(null)}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#040603"
        stroke={active ? NV.accentBright : NV.accent}
        strokeOpacity={active ? 1 : 0.4}
        strokeWidth={active ? 1.4 : 0.6}
      />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const lit = (idx + Math.floor(tick / 2)) % 13 === 0 || ((idx + tick) % 17 === 0 && active);
          return (
            <rect
              key={idx}
              x={x + c * tw + 0.7}
              y={y + r * th + 0.7}
              width={tw - 1.4}
              height={th - 1.4}
              fill={lit ? NV.accentBright : '#0a1505'}
              fillOpacity={lit ? 0.85 : 0.65}
              stroke={NV.accent}
              strokeOpacity={active ? 0.5 : 0.18}
              strokeWidth={0.4}
            />
          );
        }),
      )}
      {label && (
        <text
          x={x + 8}
          y={y + h - 8}
          fontSize={10}
          letterSpacing="2"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
          fill={active ? NV.accentBright : NV.accent}
          opacity={active ? 1 : 0.7}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function ZoneTooltip({ zone, chip, mouse }: { zone: Zone; chip: ChipSpec; mouse: { x: number; y: number } }) {
  const c = chip.compute;
  let title = '';
  let main = '';
  let sub = '';
  if (zone === 'compute') {
    title = 'COMPUTE';
    if (c.fp4) {
      main = `${c.fp4} PFLOPS FP4`;
      sub = `${c.fp8 ?? '—'} FP8 · ${c.bf16 ?? '—'} BF16`;
    } else if (c.fp8) {
      main = `${c.fp8} PFLOPS FP8`;
      sub = `${c.bf16 ?? '—'} BF16 · ${c.tf32 ?? '—'} TF32`;
    } else if (c.bf16) {
      main = `${c.bf16} PFLOPS BF16`;
      sub = `${c.tf32 ?? '—'} TF32`;
    }
    if (c.sms) sub = `${c.sms} SMs · ` + sub;
  } else if (zone === 'hbm') {
    title = 'MEMORY';
    main = `${chip.memory.capacity_gb} GB ${chip.memory.type}`;
    sub = `${chip.memory.bw_tbs} TB/s · ${chip.memory.stacks} stacks`;
  } else if (zone === 'l2') {
    title = 'L2 CACHE';
    main = chip.id === 'h100' || chip.id === 'h200' ? '50 MB' : chip.id === 'a100' ? '40 MB' : 'on-die';
    sub = 'shared across SMs';
  } else if (zone === 'nvlink') {
    title = 'INTERCONNECT';
    main = `${chip.interconnect.bw_tbs} TB/s`;
    sub = chip.interconnect.fabric;
  } else if (zone === 'pcie') {
    title = 'HOST INTERFACE';
    main = chip.interconnect.pcie || 'PCIe';
    sub = 'host control plane';
  } else if (zone === 'bridge') {
    title = 'NV-HBI';
    main = '10 TB/s';
    sub = 'die-to-die · transparent';
  }
  // Use absolute screen positioning via foreignObject is awkward; we use SVG text in a fixed corner instead
  return (
    <g pointerEvents="none">
      <rect
        x={1180}
        y={36}
        width={400}
        height={120}
        rx={6}
        fill="#040603"
        fillOpacity={0.92}
        stroke={NV.accentBright}
        strokeOpacity={0.7}
      />
      <text x={1200} y={64} fontSize={10} letterSpacing="2.8" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.accentBright}>
        ZONE · {title}
      </text>
      <text x={1200} y={102} fontSize={28} style={{ fontFamily: 'var(--font-display), serif', fontStyle: 'italic' }} fill={NV.text}>
        {main}
      </text>
      <text x={1200} y={130} fontSize={11} letterSpacing="1.2" style={{ fontFamily: 'var(--font-mono), monospace' }} fill={NV.textDim}>
        {sub}
      </text>
    </g>
  );
}

function peakOpForChip(chip: ChipSpec): { value: string; label: string } {
  const c = chip.compute;
  if (c.fp4) return { value: `${c.fp4}`, label: 'PFLOPS FP4' };
  if (c.fp8) return { value: `${c.fp8}`, label: 'PFLOPS FP8' };
  if (c.bf16) return { value: `${c.bf16}`, label: 'PFLOPS BF16' };
  return { value: '—', label: '—' };
}

/* ============================== Compact datasheet ============================== */

function CompactDatasheet({ chip, chipKey, zone }: { chip: ChipSpec; chipKey: number; zone: Zone }) {
  return (
    <div className="px-6 py-6 text-[12px] leading-relaxed" style={{ color: NV.text }}>
      <div className="flex items-baseline justify-between mb-5 pb-4 border-b" style={{ borderColor: NV.rule }}>
        <div>
          <div className="text-[9px] uppercase tracking-[0.32em]" style={{ color: NV.accent }}>
            DATASHEET
          </div>
          <div className="leading-none mt-2" style={{ fontFamily: 'var(--font-display), serif', fontStyle: 'italic', fontSize: '1.7rem', color: NV.text }}>
            {chip.name}
          </div>
          <div className="text-[10px] mt-1" style={{ color: NV.textDim }}>
            {chip.codename}
          </div>
        </div>
        <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: NV.accentBright }}>
          ▸ DECODED
        </div>
      </div>

      <DSection title="process" highlight={zone === 'compute'}>
        <DRow k="node" v={chip.process.node} kk={chipKey} />
        <DRow k="fab" v={chip.process.fab} kk={chipKey} />
        {chip.process.transistors_b > 0 && <DRow k="transistors" v={`${chip.process.transistors_b}B`} kk={chipKey} />}
        <DRow k="die" v={chip.die.layout + (chip.die.bridge ? ' · ' + chip.die.bridge : '')} kk={chipKey} />
      </DSection>

      <DSection title="compute (sparse)" highlight={zone === 'compute'}>
        {chip.compute.sms && <DRow k="SMs" v={String(chip.compute.sms)} kk={chipKey} />}
        {chip.compute.tensor_cores && <DRow k="Tensor Cores" v={String(chip.compute.tensor_cores)} kk={chipKey} />}
        {chip.compute.fp4 != null && <DRow k="FP4" v={`${chip.compute.fp4} PFLOPS`} kk={chipKey} hl={zone === 'compute'} />}
        {chip.compute.fp8 != null && <DRow k="FP8" v={`${chip.compute.fp8} PFLOPS`} kk={chipKey} hl={zone === 'compute'} />}
        {chip.compute.bf16 != null && <DRow k="BF16" v={`${chip.compute.bf16} PFLOPS`} kk={chipKey} hl={zone === 'compute'} />}
        {chip.compute.tf32 != null && <DRow k="TF32" v={`${chip.compute.tf32} PFLOPS`} kk={chipKey} />}
        {chip.compute.fp32 != null && <DRow k="FP32" v={`${chip.compute.fp32} PFLOPS`} kk={chipKey} />}
        {chip.compute.fp64 != null && <DRow k="FP64" v={`${chip.compute.fp64} PFLOPS`} kk={chipKey} />}
        {chip.compute.int8 != null && <DRow k="INT8" v={`${chip.compute.int8} POPS`} kk={chipKey} />}
      </DSection>

      <DSection title="memory" highlight={zone === 'hbm'}>
        <DRow k="type" v={chip.memory.type} kk={chipKey} hl={zone === 'hbm'} />
        <DRow k="capacity" v={`${chip.memory.capacity_gb} GB`} kk={chipKey} hl={zone === 'hbm'} />
        <DRow k="bandwidth" v={`${chip.memory.bw_tbs} TB/s`} kk={chipKey} hl={zone === 'hbm'} />
        {chip.memory.stacks > 0 && <DRow k="stacks" v={`${chip.memory.stacks}`} kk={chipKey} hl={zone === 'hbm'} />}
      </DSection>

      <DSection title="interconnect" highlight={zone === 'nvlink' || zone === 'pcie' || zone === 'bridge'}>
        <DRow k="fabric" v={chip.interconnect.fabric} kk={chipKey} hl={zone === 'nvlink' || zone === 'bridge'} />
        <DRow k="bandwidth" v={`${chip.interconnect.bw_tbs} TB/s`} kk={chipKey} hl={zone === 'nvlink' || zone === 'bridge'} />
        {chip.interconnect.pcie && <DRow k="PCIe" v={chip.interconnect.pcie} kk={chipKey} hl={zone === 'pcie'} />}
      </DSection>

      <DSection title="power">
        <DRow k="TDP" v={`${chip.power_w.toLocaleString()} W`} kk={chipKey} />
      </DSection>

      <DSection title="why it matters">
        <DText text={chip.why_it_matters} kk={chipKey} className="text-[12px] italic" />
      </DSection>

      <DSection title="best for">
        <ul className="space-y-1.5 mt-1">
          {chip.best_for.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: NV.text }}>
              <span className="mt-1" style={{ color: NV.accentBright }}>▸</span>
              <DText text={b} kk={`${chipKey}-${i}`} />
            </li>
          ))}
        </ul>
      </DSection>

      <DSection title="features">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {chip.features.map((f, i) => (
            <span
              key={i}
              className="text-[10px] px-2.5 py-1 border"
              style={{ color: NV.text, borderColor: NV.rule, background: 'rgba(118,185,0,0.06)' }}
            >
              <DText text={f} kk={`${chipKey}-${i}`} />
            </span>
          ))}
        </div>
      </DSection>

      <div className="mt-6 pt-4 border-t flex items-center justify-between text-[9px] uppercase tracking-[0.28em]" style={{ borderColor: NV.rule, color: NV.textDim }}>
        <span>SHA · {chip.id.padEnd(8, '·')}</span>
        <span style={{ color: NV.accentBright }}>● VERIFIED</span>
        <span>v 26.05</span>
      </div>
    </div>
  );
}

function DSection({ title, children, highlight = false }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className="my-3 py-3 border-b"
      style={{
        borderColor: NV.ruleSoft,
        borderLeft: highlight ? `2px solid ${NV.accentBright}` : 'none',
        paddingLeft: highlight ? '0.75rem' : 0,
        marginLeft: highlight ? '-0.75rem' : 0,
        background: highlight ? 'rgba(118,185,0,0.04)' : 'transparent',
      }}
    >
      <div className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: highlight ? NV.accentBright : NV.accent }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DRow({ k, v, kk, hl }: { k: string; v: string; kk: string | number; hl?: boolean }) {
  const dec = useBitDecode(v, 360, `${kk}-${k}`);
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: NV.textDim }}>
        {k}
      </span>
      <span className="text-right tabular-nums" style={{ fontSize: 11, color: hl ? NV.accentBright : NV.text }}>
        {dec}
      </span>
    </div>
  );
}

function DText({ text, kk, className }: { text: string; kk: string | number; className?: string }) {
  const dec = useBitDecode(text, 360, kk);
  return <span className={className} style={{ color: NV.text }}>{dec}</span>;
}
