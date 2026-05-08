'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CHIP_SPECS, type ChipSpec } from '@/lib/chipspecs';
import { NV } from './_palette';

const DECODE_CHARS = '01ABCDEF$%&*+=/<>?#@';

function useBitDecode(target: string, duration = 450, restartKey?: string | number) {
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
        if (c === ' ' || c === '\n' || c === '·' || c === '·') s += c;
        else s += DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
      }
      setText(s);
      if (t >= 1) return;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, restartKey]);
  return text;
}

type Zone =
  | 'compute'
  | 'hbm'
  | 'l2'
  | 'nvlink'
  | 'pcie'
  | 'bridge'
  | null;

export default function InferenceConsole() {
  const [chipIdx, setChipIdx] = useState(0);
  const [zone, setZone] = useState<Zone>(null);
  const chip = CHIP_SPECS[chipIdx];
  const [revKey, setRevKey] = useState(0);

  useEffect(() => {
    setRevKey((k) => k + 1);
  }, [chipIdx]);

  return (
    <div
      className="relative w-full h-full overflow-hidden grid grid-cols-12"
      style={{ background: NV.bg, fontFamily: 'var(--font-mono), monospace' }}
    >
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(118,185,0,0.10) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(70,110,0,0.10) 0%, transparent 60%)',
        }}
      />

      {/* LEFT — fleet list */}
      <div
        className="col-span-2 relative border-r overflow-y-auto"
        style={{ borderColor: NV.rule }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: NV.rule }}>
          <div className="text-[9px] uppercase tracking-[0.32em]" style={{ color: NV.accent }}>
            FLEET · {CHIP_SPECS.length}
          </div>
          <div className="text-[10px] mt-1" style={{ color: NV.textDim }}>
            inference inventory
          </div>
        </div>
        <ul>
          {CHIP_SPECS.map((c, i) => (
            <li key={c.id}>
              <button
                onClick={() => setChipIdx(i)}
                onMouseEnter={() => setChipIdx(i)}
                className="w-full text-left px-5 py-3 border-b transition-all"
                style={{
                  borderColor: NV.ruleSoft,
                  background: i === chipIdx ? 'rgba(118,185,0,0.08)' : 'transparent',
                  borderLeft: i === chipIdx ? `2px solid ${NV.accentBright}` : '2px solid transparent',
                  color: i === chipIdx ? NV.text : NV.textDim,
                }}
              >
                <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: i === chipIdx ? NV.accentBright : NV.textFaint }}>
                  {c.vendor} · {c.release}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-display), serif',
                    fontStyle: 'italic',
                    fontSize: '1.2rem',
                  }}
                >
                  {c.name}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: NV.textDim }}>
                  {c.codename}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* CENTER — die diagram */}
      <div
        className="col-span-6 relative border-r flex flex-col"
        style={{ borderColor: NV.rule }}
      >
        <div
          className="px-6 py-4 border-b flex items-baseline justify-between"
          style={{ borderColor: NV.rule }}
        >
          <div>
            <div className="text-[9px] uppercase tracking-[0.32em]" style={{ color: NV.accent }}>
              DIE FLOOR PLAN · {chip.id}
            </div>
            <div className="text-[10px] mt-1" style={{ color: NV.textDim }}>
              Hover a block to inspect
            </div>
          </div>
          <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: NV.accentBright }}>
            ● linked
          </div>
        </div>
        <div className="flex-1 relative">
          <DieDiagram chip={chip} zone={zone} setZone={setZone} revKey={revKey} />
        </div>
        <div
          className="px-6 py-3 border-t flex items-center gap-6 text-[10px] uppercase tracking-[0.24em]"
          style={{ borderColor: NV.rule, color: NV.textDim }}
        >
          <Legend swatch={NV.accent} label="Compute" />
          <Legend swatch={NV.accentBright} label="HBM" />
          <Legend swatch="#86d92e" label="L2 / cache" />
          <Legend swatch="#3a6700" label="Fabric" />
          <span className="ml-auto" style={{ color: NV.accent }}>
            ANNO {chip.release.split('-')[0]}
          </span>
        </div>
      </div>

      {/* RIGHT — datasheet */}
      <div className="col-span-4 relative overflow-y-auto">
        <Datasheet chip={chip} zone={zone} revKey={revKey} />
      </div>
    </div>
  );
}

/* ----------------------------- Legend chip ----------------------------- */

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-block w-2.5 h-2.5" style={{ background: swatch }} />
      {label}
    </span>
  );
}

/* ----------------------------- Die diagram ----------------------------- */

function DieDiagram({
  chip,
  zone,
  setZone,
  revKey,
}: {
  chip: ChipSpec;
  zone: Zone;
  setZone: (z: Zone) => void;
  revKey: number;
}) {
  // Layout dimensions
  const W = 1000;
  const H = 700;
  const isDual = chip.die.layout === 'dual-die';
  const isChiplet = chip.die.layout === 'chiplet' && (chip.die.xcds || 0) >= 8;
  const isTrainium = chip.id === 'tr2';
  const isWafer = chip.die.layout === 'wafer-scale';

  const padX = 80;
  const padY = 80;
  const dieX = padX;
  const dieY = padY;
  const dieW = W - padX * 2;
  const dieH = H - padY * 2;

  const hbmW = 70;
  const hbmGap = 12;
  const hbmStacks = chip.memory.stacks || 4;
  const hbmLeft = Math.ceil(hbmStacks / 2);
  const hbmRight = Math.floor(hbmStacks / 2);

  const innerX = dieX + hbmW + hbmGap;
  const innerY = dieY + 50;
  const innerW = dieW - hbmW * 2 - hbmGap * 2;
  const innerH = dieH - 100;

  // SM grid (compute area)
  const cols = isChiplet ? 16 : isDual ? 24 : 14;
  const rows = isChiplet ? 8 : isDual ? 12 : 12;

  return (
    <div className="absolute inset-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="ic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={NV.accent} strokeOpacity="0.06" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="comp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1505" />
            <stop offset="100%" stopColor="#040603" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#ic-grid)" />

        {/* substrate */}
        <rect
          x={dieX - 8}
          y={dieY - 8}
          width={dieW + 16}
          height={dieH + 16}
          rx={10}
          fill="#040603"
          stroke={NV.accent}
          strokeOpacity={0.45}
          strokeWidth={1}
        />

        {/* BGA dots */}
        {[
          [dieX - 4, dieY - 4],
          [dieX + dieW + 4, dieY - 4],
          [dieX - 4, dieY + dieH + 4],
          [dieX + dieW + 4, dieY + dieH + 4],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={NV.accentBright} />
        ))}

        {/* die body */}
        <rect
          x={dieX}
          y={dieY}
          width={dieW}
          height={dieH}
          rx={6}
          fill="url(#comp)"
          stroke={NV.accent}
          strokeOpacity={0.7}
          strokeWidth={1}
        />

        {/* HBM left */}
        {Array.from({ length: hbmLeft }).map((_, i) => {
          const sH = (innerH - (hbmLeft - 1) * 12) / hbmLeft;
          const y = innerY + i * (sH + 12);
          return (
            <HbmStack
              key={`hl-${i}`}
              x={dieX + 8}
              y={y}
              w={hbmW}
              h={sH}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}
        {/* HBM right */}
        {Array.from({ length: hbmRight }).map((_, i) => {
          const sH = (innerH - (hbmRight - 1) * 12) / hbmRight;
          const y = innerY + i * (sH + 12);
          return (
            <HbmStack
              key={`hr-${i}`}
              x={dieX + dieW - hbmW - 8}
              y={y}
              w={hbmW}
              h={sH}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}

        {/* Compute area(s) */}
        {isDual ? (
          <>
            <ComputeBlock
              x={innerX}
              y={innerY}
              w={innerW / 2 - 14}
              h={innerH}
              cols={cols / 2}
              rows={rows}
              active={zone === 'compute'}
              setZone={setZone}
              label="DIE A"
            />
            <ComputeBlock
              x={innerX + innerW / 2 + 14}
              y={innerY}
              w={innerW / 2 - 14}
              h={innerH}
              cols={cols / 2}
              rows={rows}
              active={zone === 'compute'}
              setZone={setZone}
              label="DIE B"
            />
            {/* NV-HBI bridge */}
            <g
              onMouseEnter={() => setZone('bridge')}
              onMouseLeave={() => setZone(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={innerX + innerW / 2 - 12}
                y={innerY + innerH / 2 - 80}
                width={24}
                height={160}
                fill={zone === 'bridge' ? NV.accentBright : NV.accent}
                fillOpacity={zone === 'bridge' ? 0.95 : 0.7}
              />
              <text
                x={innerX + innerW / 2}
                y={innerY + innerH / 2 + 100}
                textAnchor="middle"
                fontSize={9}
                letterSpacing="2.5"
                fill={zone === 'bridge' ? NV.accentBright : NV.accent}
                opacity={zone === 'bridge' ? 1 : 0.7}
              >
                NV-HBI · 10 TB/s
              </text>
            </g>
          </>
        ) : isChiplet ? (
          // 8 XCDs + 4 IODs
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 2 }).map((_, c) => (
                <ComputeBlock
                  key={`xcd-${r}-${c}`}
                  x={innerX + c * (innerW / 2 + 8)}
                  y={innerY + r * (innerH / 4 + 4)}
                  w={innerW / 2 - 8}
                  h={innerH / 4 - 4}
                  cols={6}
                  rows={3}
                  active={zone === 'compute'}
                  setZone={setZone}
                  label={`XCD ${r * 2 + c}`}
                />
              )),
            )}
          </g>
        ) : isTrainium ? (
          // 8 NeuronCores
          <g>
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 2 }).map((_, c) => (
                <ComputeBlock
                  key={`nc-${r}-${c}`}
                  x={innerX + c * (innerW / 2 + 8)}
                  y={innerY + r * (innerH / 4 + 4)}
                  w={innerW / 2 - 8}
                  h={innerH / 4 - 4}
                  cols={5}
                  rows={3}
                  active={zone === 'compute'}
                  setZone={setZone}
                  label={`NC-v3 ${r * 2 + c}`}
                />
              )),
            )}
          </g>
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
            label="COMPUTE · TENSOR CORES"
          />
        )}

        {/* L2 strip across center top */}
        <g
          onMouseEnter={() => setZone('l2')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={innerX}
            y={dieY + 18}
            width={innerW}
            height={20}
            fill={zone === 'l2' ? '#86d92e' : NV.accentDeep}
            fillOpacity={zone === 'l2' ? 0.95 : 0.65}
          />
          <text
            x={innerX + innerW / 2}
            y={dieY + 32}
            textAnchor="middle"
            fontSize={9}
            letterSpacing="2.5"
            fill={zone === 'l2' ? '#0a1505' : NV.text}
            opacity={zone === 'l2' ? 1 : 0.85}
          >
            L2 CACHE
          </text>
        </g>

        {/* NVLink ports — top edge & bottom edge */}
        <g
          onMouseEnter={() => setZone('nvlink')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={`nl-t-${i}`}
              x={innerX + 30 + (i * (innerW - 60)) / 8}
              y={dieY - 10}
              width={28}
              height={8}
              fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
              fillOpacity={zone === 'nvlink' ? 1 : 0.6}
            />
          ))}
          <text
            x={dieX + dieW / 2}
            y={dieY - 18}
            textAnchor="middle"
            fontSize={9}
            letterSpacing="2.5"
            fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
            opacity={zone === 'nvlink' ? 1 : 0.7}
          >
            {chip.interconnect.fabric}
          </text>
        </g>

        {/* PCIe ports — bottom */}
        <g
          onMouseEnter={() => setZone('pcie')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={`pc-${i}`}
              x={innerX + 80 + i * 90}
              y={dieY + dieH + 2}
              width={50}
              height={8}
              fill={zone === 'pcie' ? NV.accentBright : NV.accent}
              fillOpacity={zone === 'pcie' ? 1 : 0.5}
            />
          ))}
          {chip.interconnect.pcie && (
            <text
              x={dieX + dieW / 2}
              y={dieY + dieH + 26}
              textAnchor="middle"
              fontSize={9}
              letterSpacing="2.5"
              fill={zone === 'pcie' ? NV.accentBright : NV.accent}
              opacity={zone === 'pcie' ? 1 : 0.7}
            >
              {chip.interconnect.pcie}
            </text>
          )}
        </g>

        {/* corner labels */}
        <text
          x={dieX + 8}
          y={dieY - 14}
          fontSize={9}
          letterSpacing="2.5"
          fill={NV.accent}
          opacity={0.7}
        >
          {chip.vendor.toUpperCase()} · {chip.codename.toUpperCase()}
        </text>
        <text
          x={dieX + dieW - 8}
          y={dieY - 14}
          textAnchor="end"
          fontSize={9}
          letterSpacing="2.5"
          fill={NV.accent}
          opacity={0.7}
        >
          {chip.process.node}
        </text>
        <text
          x={dieX + dieW - 8}
          y={dieY + dieH + 26}
          textAnchor="end"
          fontSize={9}
          letterSpacing="2.5"
          fill={NV.accent}
          opacity={0.7}
        >
          {chip.process.transistors_b > 0 ? `${chip.process.transistors_b}B TRANSISTORS` : ''}
        </text>
      </svg>
    </div>
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
        fillOpacity={active ? 0.4 : 0.85}
        stroke={active ? NV.accentBright : NV.accent}
        strokeOpacity={active ? 1 : 0.6}
        strokeWidth={active ? 1.4 : 0.7}
      />
      {/* stack divider lines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={x}
          y1={y + ((i + 1) * h) / 8}
          x2={x + w}
          y2={y + ((i + 1) * h) / 8}
          stroke={active ? NV.accentBright : NV.accent}
          strokeOpacity={0.45}
          strokeWidth={0.5}
        />
      ))}
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize={9}
        letterSpacing="2"
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
  label?: string;
}) {
  const tw = w / cols;
  const th = h / rows;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);
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
        strokeOpacity={active ? 1 : 0.45}
        strokeWidth={active ? 1.4 : 0.6}
      />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const lit = (idx + Math.floor(tick / 2)) % 13 === 0 || ((idx + tick) % 17 === 0 && active);
          return (
            <rect
              key={idx}
              x={x + c * tw + 0.6}
              y={y + r * th + 0.6}
              width={tw - 1.2}
              height={th - 1.2}
              fill={lit ? NV.accentBright : '#0a1505'}
              fillOpacity={lit ? 0.85 : 0.7}
              stroke={NV.accent}
              strokeOpacity={active ? 0.55 : 0.22}
              strokeWidth={0.4}
            />
          );
        }),
      )}
      {label && (
        <text
          x={x + 8}
          y={y + h - 6}
          fontSize={8}
          letterSpacing="1.5"
          fill={active ? NV.accentBright : NV.accent}
          opacity={active ? 1 : 0.7}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ----------------------------- Datasheet ----------------------------- */

function Datasheet({ chip, zone, revKey }: { chip: ChipSpec; zone: Zone; revKey: number }) {
  const c = chip.compute;
  const flopRows: { label: string; v: number | undefined; unit: string }[] = [
    { label: 'FP4 sparse', v: c.fp4, unit: 'PFLOPS' },
    { label: 'FP8 sparse', v: c.fp8, unit: 'PFLOPS' },
    { label: 'BF16', v: c.bf16, unit: 'PFLOPS' },
    { label: 'TF32', v: c.tf32, unit: 'PFLOPS' },
    { label: 'FP32', v: c.fp32, unit: 'PFLOPS' },
    { label: 'FP64', v: c.fp64, unit: 'PFLOPS' },
    { label: 'INT8', v: c.int8, unit: 'POPS' },
  ].filter((r) => r.v !== undefined);

  return (
    <div className="px-6 py-5 text-[12px] leading-relaxed" style={{ color: NV.text }}>
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b" style={{ borderColor: NV.rule }}>
        <div>
          <div className="text-[9px] uppercase tracking-[0.32em]" style={{ color: NV.accent }}>
            DATASHEET · {chip.id.toUpperCase()}
          </div>
          <div className="mt-1" style={{ color: NV.textDim, fontSize: '10px' }}>
            {chip.release} · {chip.vendor}
          </div>
        </div>
        <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: NV.accentBright }}>
          ▸ DECODED
        </div>
      </div>

      <Section title="Identity" highlight={false}>
        <Row k="vendor" v={chip.vendor} rk={revKey} />
        <Row k="codename" v={chip.codename} rk={revKey} />
        <Row k="architecture" v={chip.arch} rk={revKey} />
        <Row k="release" v={chip.release} rk={revKey} />
      </Section>

      <Section title="Process" highlight={zone === 'compute'}>
        <Row k="node" v={chip.process.node} rk={revKey} />
        <Row k="fab" v={chip.process.fab} rk={revKey} />
        {chip.process.transistors_b > 0 && (
          <Row k="transistors" v={`${chip.process.transistors_b.toLocaleString()} billion`} rk={revKey} />
        )}
        <Row k="die layout" v={chip.die.layout + (chip.die.bridge ? ` · ${chip.die.bridge}` : '')} rk={revKey} />
      </Section>

      <Section title="Compute (sparse)" highlight={zone === 'compute'}>
        {chip.compute.sms && <Row k="SMs" v={String(chip.compute.sms)} rk={revKey} />}
        {chip.compute.tensor_cores && <Row k="Tensor Cores" v={String(chip.compute.tensor_cores)} rk={revKey} />}
        {flopRows.map((r) => (
          <Row key={r.label} k={r.label} v={`${formatNum(r.v!)} ${r.unit}`} rk={revKey} highlight={zone === 'compute'} />
        ))}
      </Section>

      <Section title="Memory" highlight={zone === 'hbm'}>
        <Row k="type" v={chip.memory.type} rk={revKey} highlight={zone === 'hbm'} />
        <Row k="capacity" v={`${chip.memory.capacity_gb} GB`} rk={revKey} highlight={zone === 'hbm'} />
        <Row k="bandwidth" v={`${chip.memory.bw_tbs} TB/s`} rk={revKey} highlight={zone === 'hbm'} />
        {chip.memory.stacks > 0 && (
          <Row k="stacks" v={`${chip.memory.stacks} × ${chip.memory.type.replace('e', '')}`} rk={revKey} highlight={zone === 'hbm'} />
        )}
      </Section>

      <Section title="Interconnect" highlight={zone === 'nvlink' || zone === 'pcie' || zone === 'bridge'}>
        <Row k="fabric" v={chip.interconnect.fabric} rk={revKey} highlight={zone === 'nvlink' || zone === 'bridge'} />
        <Row k="bandwidth" v={`${chip.interconnect.bw_tbs} TB/s`} rk={revKey} highlight={zone === 'nvlink' || zone === 'bridge'} />
        {chip.interconnect.pcie && <Row k="PCIe" v={chip.interconnect.pcie} rk={revKey} highlight={zone === 'pcie'} />}
        {chip.interconnect.links && <Row k="links" v={String(chip.interconnect.links)} rk={revKey} />}
      </Section>

      <Section title="Power" highlight={false}>
        <Row k="TDP" v={`${chip.power_w.toLocaleString()} W`} rk={revKey} />
      </Section>

      <Section title="Why it matters">
        <Decoded text={chip.why_it_matters} rk={revKey} className="text-[12px] italic leading-relaxed" style={{ color: NV.text }} />
      </Section>

      <Section title="Best for">
        <ul className="space-y-1.5 mt-1">
          {chip.best_for.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: NV.text }}>
              <span className="mt-1" style={{ color: NV.accentBright }}>▸</span>
              <Decoded text={b} rk={`${revKey}-${i}`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Features">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {chip.features.map((f, i) => (
            <span
              key={i}
              className="text-[10px] px-2.5 py-1 border"
              style={{
                color: NV.text,
                borderColor: NV.rule,
                background: 'rgba(118,185,0,0.06)',
              }}
            >
              <Decoded text={f} rk={`${revKey}-${i}`} />
            </span>
          ))}
        </div>
      </Section>

      <div className="mt-6 pt-4 border-t flex items-center justify-between text-[9px] uppercase tracking-[0.28em]" style={{ borderColor: NV.rule, color: NV.textDim }}>
        <span>SHA · {chip.id.padEnd(8, '·')}</span>
        <span style={{ color: NV.accentBright }}>● VERIFIED</span>
        <span>v 26.05</span>
      </div>
    </div>
  );
}

function Section({ title, children, highlight = false }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className="my-3 py-3 border-b"
      style={{
        borderColor: NV.ruleSoft,
        background: highlight ? 'rgba(118,185,0,0.04)' : 'transparent',
        marginLeft: highlight ? '-1.5rem' : 0,
        marginRight: highlight ? '-1.5rem' : 0,
        paddingLeft: highlight ? '1.5rem' : 0,
        paddingRight: highlight ? '1.5rem' : 0,
        borderLeft: highlight ? `2px solid ${NV.accentBright}` : 'none',
      }}
    >
      <div className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: highlight ? NV.accentBright : NV.accent }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v, rk, highlight }: { k: string; v: string; rk: number; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: NV.textDim }}>
        {k}
      </span>
      <span
        className="text-right tabular-nums"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '11px',
          color: highlight ? NV.accentBright : NV.text,
        }}
      >
        <Decoded text={v} rk={`${rk}-${k}`} />
      </span>
    </div>
  );
}

function Decoded({
  text,
  rk,
  className,
  style,
}: {
  text: string;
  rk: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const dec = useBitDecode(text, 380, rk);
  return (
    <span className={className} style={style}>
      {dec}
    </span>
  );
}

function formatNum(n: number) {
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(3);
}
