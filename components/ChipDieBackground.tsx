'use client';

import { useEffect, useRef, useState } from 'react';
import { CHIP_SPECS, getZoneDetail, type ChipSpec, type ZoneKey } from '@/lib/chipspecs';

export type InfoFormat = 'minimal' | 'table' | 'editorial' | 'hud';
export type ColorTone = 'green' | 'cyan' | 'amber' | 'ivory';

type Theme = {
  bg: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  accentBright: string;
  accentDeep: string;
  rule: string;
  ruleSoft: string;
};

const THEMES: Record<ColorTone, Theme> = {
  green: {
    bg: '#000000',
    text: '#eaf6d6',
    textDim: '#9ab27a',
    textFaint: '#465c34',
    accent: '#76b900',
    accentBright: '#9ad03d',
    accentDeep: '#466e00',
    rule: 'rgba(118,185,0,0.18)',
    ruleSoft: 'rgba(118,185,0,0.08)',
  },
  cyan: {
    bg: '#000000',
    text: '#e6f6fb',
    textDim: '#7d97a8',
    textFaint: '#34485a',
    accent: '#22d3ee',
    accentBright: '#67e8f9',
    accentDeep: '#0e7490',
    rule: 'rgba(34,211,238,0.20)',
    ruleSoft: 'rgba(34,211,238,0.09)',
  },
  amber: {
    bg: '#000000',
    text: '#f5e6c8',
    textDim: '#b8a07a',
    textFaint: '#5a4630',
    accent: '#d49355',
    accentBright: '#ffb86b',
    accentDeep: '#7a4a20',
    rule: 'rgba(212,147,85,0.22)',
    ruleSoft: 'rgba(212,147,85,0.10)',
  },
  ivory: {
    bg: '#000000',
    text: '#ffffff',
    textDim: '#b8b5ad',
    textFaint: '#5a5850',
    accent: '#f5f3ee',
    accentBright: '#ffffff',
    accentDeep: '#a8a59c',
    rule: 'rgba(245,243,238,0.22)',
    ruleSoft: 'rgba(245,243,238,0.10)',
  },
};

// Default theme — used by chip die rendering. The chip die itself stays brand green;
// only the side-info text + accent colors switch with colorTone.
const NV = THEMES.green;

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

export default function ChipDieBackground({
  cycleMs = 25000,
  format = 'minimal',
  colorTone = 'green',
}: {
  cycleMs?: number;
  format?: InfoFormat;
  colorTone?: ColorTone;
} = {}) {
  const T = THEMES[colorTone];
  const [chipIdx, setChipIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zone, setZone] = useState<Zone>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [inHero, setInHero] = useState(true);
  const [chipZoomed, setChipZoomed] = useState(false);

  // Compute chip-zoom from raw cursor position vs the chip die's screen bounds.
  // This bypasses any DOM event blocking and works regardless of overlapping wrappers.
  useEffect(() => {
    if (!mouse || !inHero) {
      if (chipZoomed) setChipZoomed(false);
      return;
    }
    const W = window.innerWidth;
    const H = window.innerHeight;
    // SVG viewBox = 1600 × 1000, preserveAspectRatio="xMidYMid meet".
    const aspectVB = 1.6;
    const aspectScreen = W / H;
    let svgW: number, svgH: number, offsetX: number, offsetY: number;
    if (aspectScreen > aspectVB) {
      svgH = H;
      svgW = H * aspectVB;
      offsetX = (W - svgW) / 2;
      offsetY = 0;
    } else {
      svgW = W;
      svgH = W / aspectVB;
      offsetX = 0;
      offsetY = (H - svgH) / 2;
    }
    // Chip die rect in viewBox: x ∈ [100, 1060], y ∈ [150, 850]
    const left = offsetX + (90 / 1600) * svgW;
    const right = offsetX + (1070 / 1600) * svgW;
    const top = offsetY + (140 / 1000) * svgH;
    const bottom = offsetY + (860 / 1000) * svgH;
    const inside =
      mouse.x >= left && mouse.x <= right && mouse.y >= top && mouse.y <= bottom;
    if (inside !== chipZoomed) setChipZoomed(inside);
  }, [mouse, inHero, chipZoomed]);

  // Toggle body class for content push-back when chip is hovered
  useEffect(() => {
    if (chipZoomed && inHero) document.body.classList.add('chip-zoom');
    else document.body.classList.remove('chip-zoom');
    return () => document.body.classList.remove('chip-zoom');
  }, [chipZoomed, inHero]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (paused || !inHero) return;
    const id = setInterval(() => setChipIdx((i) => (i + 1) % CHIP_SPECS.length), cycleMs);
    return () => clearInterval(id);
  }, [paused, cycleMs, inHero]);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      setInHero(window.scrollY < h * 0.25);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <>
      {/* BACKGROUND — die left, info right, in the same fixed canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* glow base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 25% 30%, rgba(118,185,0,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(70,110,0,0.10) 0%, transparent 55%), #000',
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

        {/* DIE — occupies the left portion · zooms forward on hover · dimmed by default so hero text reads as foreground */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            transform: chipZoomed ? 'scale(1.16)' : 'scale(1)',
            transformOrigin: '36% 50%',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            filter: chipZoomed ? 'drop-shadow(0 0 80px rgba(118,185,0,0.55))' : 'none',
            opacity: chipZoomed ? 1 : 0.4,
            pointerEvents: 'none', // SVG inside still has pointerEvents: auto
          }}
        >
          <FullDie
            chip={chip}
            chipKey={chipIdx}
            zone={zone}
            setZone={setZone}
            tick={tick}
            onChipEnter={() => setChipZoomed(true)}
            onChipLeave={() => setChipZoomed(false)}
          />
        </div>

        {/* SIDE INFO — beside the chip, in the right empty space */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: inHero ? 1 : 0, pointerEvents: 'none' }}
        >
          <SideInfo chip={chip} chipKey={chipIdx} zone={zone} format={format} theme={T} />
        </div>
        {/* TELEMETRY strip dim when chip not zoomed — keeps focus on hero copy */}

        {/* vignette — must not capture pointer events */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 32%, rgba(0,0,0,0.62) 100%)',
          }}
        />
      </div>

      {/* CHIP SELECTOR — right column, beneath the side info panel · hidden after hero */}
      <div
        className="fixed z-30 transition-opacity duration-500"
        style={{
          right: 'max(2vw, 24px)',
          bottom: '4vh',
          width: 'min(30vw, 440px)',
          minWidth: 340,
          fontFamily: 'var(--font-mono), monospace',
          opacity: inHero ? 1 : 0,
          pointerEvents: inHero ? 'auto' : 'none',
        }}
      >
        <div
          className="px-3 py-2.5 border backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.55)', borderColor: NV.rule }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: NV.textDim }}>
              FLEET
            </span>
            <button
              onClick={() => setPaused((p) => !p)}
              className="px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]"
              style={{ color: NV.accent, border: `1px solid ${NV.rule}` }}
              title={paused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
            >
              {paused ? '▶ play' : '⏸ pause'}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1">
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
                  className="text-[9px] uppercase tracking-[0.16em] py-1.5 transition-all truncate"
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
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================== Side info panel ============================== */

function SideInfo({
  chip,
  chipKey,
  zone,
  format = 'minimal',
  theme = NV,
}: {
  chip: ChipSpec;
  chipKey: number;
  zone: Zone;
  format?: InfoFormat;
  theme?: Theme;
}) {
  return (
    <div
      className="absolute side-info-scroll flex flex-col gap-7 px-1 py-2"
      style={{
        right: 'max(2vw, 24px)',
        top: '12vh',
        bottom: 'calc(4vh + 140px)',
        width: 'min(30vw, 440px)',
        minWidth: 340,
        fontFamily: 'var(--font-mono), monospace',
        color: theme.text,
        textShadow: '0 1px 12px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.95)',
        pointerEvents: 'auto',
        // CSS custom props so nested components can pick the theme up
        ['--si-text' as any]: theme.text,
        ['--si-dim' as any]: theme.textDim,
        ['--si-faint' as any]: theme.textFaint,
        ['--si-accent' as any]: theme.accent,
        ['--si-bright' as any]: theme.accentBright,
        ['--si-rule' as any]: theme.rule,
      }}
    >
      {zone ? (
        <ZoneDetailPanel chip={chip} chipKey={chipKey} zone={zone} theme={theme} />
      ) : format === 'table' ? (
        <TablePanel chip={chip} chipKey={chipKey} theme={theme} />
      ) : format === 'editorial' ? (
        <EditorialPanel chip={chip} chipKey={chipKey} theme={theme} />
      ) : format === 'hud' ? (
        <HudPanel chip={chip} chipKey={chipKey} theme={theme} />
      ) : (
        <IdentityPanel chip={chip} chipKey={chipKey} theme={theme} />
      )}
    </div>
  );
}

function IdentityPanel({ chip, chipKey, theme }: { chip: ChipSpec; chipKey: number; theme: Theme }) {
  const chipName = useBitDecode(chip.name, 360, chipKey);
  const chipCode = useBitDecode(chip.codename, 360, chipKey);
  const flopRows: { k: string; v: string }[] = [];
  if (chip.compute.fp4 != null) flopRows.push({ k: 'FP4', v: `${chip.compute.fp4} PFLOPS` });
  if (chip.compute.fp8 != null) flopRows.push({ k: 'FP8', v: `${chip.compute.fp8} PFLOPS` });
  if (chip.compute.bf16 != null) flopRows.push({ k: 'BF16', v: `${chip.compute.bf16} PFLOPS` });
  if (chip.compute.fp64 != null) flopRows.push({ k: 'FP64', v: `${chip.compute.fp64} PFLOPS` });
  if (chip.compute.int8 != null) flopRows.push({ k: 'INT8', v: `${chip.compute.int8} POPS` });

  return (
    <>
      <ScrollSection>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: theme.accentBright, boxShadow: `0 0 8px ${theme.accentBright}` }}
          />
          <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.accentBright }}>
            LIVE · ON DIE
          </span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.14em]" style={{ color: theme.textDim }}>
            {chip.release}
          </span>
        </div>
        <div
          className="leading-none mb-2"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 2.4vw, 2.6rem)',
            color: theme.text,
          }}
        >
          {chipName}
        </div>
        <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
          {chip.vendor} · {chipCode}
        </div>
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          peak compute
        </div>
        {chip.compute.sms && <SRow k="SMs" v={String(chip.compute.sms)} kk={chipKey} theme={theme} />}
        {flopRows.slice(0, 4).map((r) => (
          <SRow key={r.k} k={r.k} v={r.v} kk={chipKey} theme={theme} />
        ))}
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          memory
        </div>
        <SRow k="capacity" v={`${chip.memory.capacity_gb} GB`} kk={chipKey} theme={theme} />
        <SRow k="bandwidth" v={`${chip.memory.bw_tbs} TB/s`} kk={chipKey} theme={theme} />
        <SRow k="type" v={chip.memory.type} kk={chipKey} theme={theme} />
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          fabric · power
        </div>
        <SRow k="fabric" v={chip.interconnect.fabric} kk={chipKey} theme={theme} />
        <SRow k="bw" v={`${chip.interconnect.bw_tbs} TB/s`} kk={chipKey} theme={theme} />
        <SRow k="TDP" v={`${chip.power_w.toLocaleString()} W`} kk={chipKey} theme={theme} />
      </ScrollSection>

      <Divider theme={theme} />

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          why it matters
        </div>
        <DecodedText
          text={chip.why_it_matters}
          kk={chipKey}
          theme={theme}
          className="text-[11px] italic leading-relaxed"
        />
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          best for
        </div>
        <ul className="space-y-2">
          {chip.best_for.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] leading-relaxed" style={{ color: theme.text }}>
              <span className="mt-0.5" style={{ color: theme.accentBright }}>▸</span>
              <DecodedText text={b} kk={`${chipKey}-${i}`} theme={theme} />
            </li>
          ))}
        </ul>
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          features
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chip.features.map((f, i) => (
            <span
              key={i}
              className="text-[9px] px-2 py-0.5 border"
              style={{ color: theme.text, borderColor: theme.rule, background: theme.ruleSoft }}
            >
              <DecodedText text={f} kk={`${chipKey}-f-${i}`} theme={theme} />
            </span>
          ))}
        </div>
      </ScrollSection>

      <ScrollSection>
        <div className="pt-3 border-t flex items-center justify-between text-[9px] uppercase tracking-[0.18em]" style={{ borderColor: theme.rule, color: theme.textDim }}>
          <span>SHA · {chip.id}</span>
          <span style={{ color: theme.accentBright }}>● VERIFIED</span>
          <span>v 26.05</span>
        </div>
      </ScrollSection>
    </>
  );
}

/* -------------------------------- Table format -------------------------------- */

function TablePanel({ chip, chipKey, theme }: { chip: ChipSpec; chipKey: number; theme: Theme }) {
  const chipName = useBitDecode(chip.name, 320, chipKey);
  const groups: { label: string; rows: { k: string; v: string }[] }[] = [
    {
      label: 'process',
      rows: [
        { k: 'node', v: chip.process.node },
        { k: 'fab', v: chip.process.fab },
        ...(chip.process.transistors_b > 0 ? [{ k: 'trans', v: `${chip.process.transistors_b}B` }] : []),
        { k: 'die', v: chip.die.layout },
      ],
    },
    {
      label: 'compute',
      rows: [
        ...(chip.compute.sms ? [{ k: 'SMs', v: String(chip.compute.sms) }] : []),
        ...(chip.compute.tensor_cores ? [{ k: 'TC', v: String(chip.compute.tensor_cores) }] : []),
        ...(chip.compute.fp4 != null ? [{ k: 'FP4', v: `${chip.compute.fp4} PF` }] : []),
        ...(chip.compute.fp8 != null ? [{ k: 'FP8', v: `${chip.compute.fp8} PF` }] : []),
        ...(chip.compute.bf16 != null ? [{ k: 'BF16', v: `${chip.compute.bf16} PF` }] : []),
        ...(chip.compute.fp64 != null ? [{ k: 'FP64', v: `${chip.compute.fp64} PF` }] : []),
      ],
    },
    {
      label: 'memory',
      rows: [
        { k: 'cap', v: `${chip.memory.capacity_gb} GB` },
        { k: 'bw', v: `${chip.memory.bw_tbs} TB/s` },
        { k: 'type', v: chip.memory.type },
        { k: 'stacks', v: `${chip.memory.stacks}` },
      ],
    },
    {
      label: 'fabric',
      rows: [
        { k: 'fab', v: chip.interconnect.fabric },
        { k: 'bw', v: `${chip.interconnect.bw_tbs} TB/s` },
        ...(chip.interconnect.pcie ? [{ k: 'pcie', v: chip.interconnect.pcie }] : []),
        { k: 'tdp', v: `${chip.power_w.toLocaleString()} W` },
      ],
    },
  ];

  return (
    <>
      <ScrollSection>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: theme.accentBright }} />
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.accentBright }}>
            DATASHEET · TABLE
          </span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
            {chip.vendor} {chipName}
          </span>
        </div>
        <div className="text-[10px]" style={{ color: theme.textDim }}>
          {chip.codename} · {chip.release}
        </div>
      </ScrollSection>

      {groups.map((g, gi) => (
        <ScrollSection key={g.label}>
          <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
            {g.label}
          </div>
          <div className="border" style={{ borderColor: theme.rule }}>
            {g.rows.map((r, i) => (
              <div
                key={r.k}
                className="grid grid-cols-[80px_1fr] text-[10px]"
                style={{
                  borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
                  background: i % 2 === 0 ? 'transparent' : theme.ruleSoft,
                }}
              >
                <div
                  className="px-2 py-1 uppercase tracking-[0.18em]"
                  style={{ color: theme.textDim, borderRight: `1px solid ${theme.rule}` }}
                >
                  <DecodedText text={r.k} kk={`${chipKey}-${gi}-${i}-k`} theme={theme} />
                </div>
                <div className="px-2 py-1 text-right tabular-nums" style={{ color: theme.text }}>
                  <DecodedText text={r.v} kk={`${chipKey}-${gi}-${i}-v`} theme={theme} />
                </div>
              </div>
            ))}
          </div>
        </ScrollSection>
      ))}

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          notes
        </div>
        <DecodedText text={chip.why_it_matters} kk={`${chipKey}-w`} theme={theme} className="text-[10px] italic leading-relaxed" />
      </ScrollSection>
    </>
  );
}

/* -------------------------------- Editorial format -------------------------------- */

function EditorialPanel({ chip, chipKey, theme }: { chip: ChipSpec; chipKey: number; theme: Theme }) {
  const chipName = useBitDecode(chip.name, 320, chipKey);
  const why = useBitDecode(chip.why_it_matters, 460, chipKey);
  const positioning = useBitDecode(chip.positioning, 460, chipKey);
  const peak =
    chip.compute.fp4 != null
      ? `${chip.compute.fp4} PFLOPS FP4`
      : chip.compute.fp8 != null
        ? `${chip.compute.fp8} PFLOPS FP8`
        : `${chip.compute.bf16 ?? '—'} PFLOPS BF16`;
  return (
    <>
      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: theme.accentBright }}>
          ◇ DISPATCH · {chip.vendor}
        </div>
        <div
          className="mb-3 leading-tight"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 2vw, 2rem)',
            color: theme.text,
          }}
        >
          On the <em style={{ color: theme.accentBright }}>{chipName}</em>.
        </div>
        <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
          {chip.codename} · {chip.process.node} · {chip.release}
        </div>
      </ScrollSection>

      <ScrollSection>
        <p className="text-[12px] leading-relaxed" style={{ color: theme.text }}>
          <span className="float-left mr-1.5 leading-none" style={{ fontFamily: 'var(--font-display), serif', fontSize: '2.2rem', color: theme.accentBright, fontStyle: 'italic' }}>
            “
          </span>
          {positioning}
        </p>
      </ScrollSection>

      <ScrollSection>
        <div className="grid grid-cols-2 gap-3 text-[11px] py-2 border-y" style={{ borderColor: theme.rule }}>
          <div>
            <div className="text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>peak</div>
            <div className="font-display italic" style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', color: theme.accentBright }}>
              <DecodedText text={peak} kk={`${chipKey}-p`} theme={theme} />
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>memory</div>
            <div className="font-display italic" style={{ fontFamily: 'var(--font-display), serif', fontSize: '1.4rem', color: theme.text }}>
              <DecodedText text={`${chip.memory.capacity_gb} GB · ${chip.memory.bw_tbs} TB/s`} kk={`${chipKey}-m`} theme={theme} />
            </div>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection>
        <p className="text-[12px] leading-relaxed italic" style={{ color: theme.text }}>
          {why}
        </p>
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          where it shines
        </div>
        <ul className="space-y-2 text-[11px] leading-relaxed" style={{ color: theme.text }}>
          {chip.best_for.map((b, i) => (
            <li key={i} className="border-l-2 pl-3" style={{ borderColor: theme.accentBright }}>
              <DecodedText text={b} kk={`${chipKey}-b-${i}`} theme={theme} />
            </li>
          ))}
        </ul>
      </ScrollSection>
    </>
  );
}

/* -------------------------------- HUD bars format -------------------------------- */

function HudPanel({ chip, chipKey, theme }: { chip: ChipSpec; chipKey: number; theme: Theme }) {
  const chipName = useBitDecode(chip.name, 320, chipKey);
  // Define a global max for normalization across the fleet
  const MAX = { fp4: 25, fp8: 25, bf16: 12, fp64: 0.1, mem: 200, bw: 10, fabric: 2, tdp: 1500 };

  const bars: { label: string; v: number; max: number; unit: string; hl?: boolean }[] = [];
  if (chip.compute.fp4 != null) bars.push({ label: 'FP4', v: chip.compute.fp4, max: MAX.fp4, unit: 'PF', hl: true });
  if (chip.compute.fp8 != null) bars.push({ label: 'FP8', v: chip.compute.fp8, max: MAX.fp8, unit: 'PF' });
  if (chip.compute.bf16 != null) bars.push({ label: 'BF16', v: chip.compute.bf16, max: MAX.bf16, unit: 'PF' });
  if (chip.compute.fp64 != null) bars.push({ label: 'FP64', v: chip.compute.fp64, max: MAX.fp64, unit: 'PF' });
  bars.push({ label: 'MEM', v: chip.memory.capacity_gb, max: MAX.mem, unit: 'GB' });
  bars.push({ label: 'BW', v: chip.memory.bw_tbs, max: MAX.bw, unit: 'TB/s' });
  bars.push({ label: 'FABRIC', v: chip.interconnect.bw_tbs, max: MAX.fabric, unit: 'TB/s' });
  bars.push({ label: 'TDP', v: chip.power_w / 1000, max: MAX.tdp / 1000, unit: 'kW' });

  return (
    <>
      <ScrollSection>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accentBright }} />
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.accentBright }}>
            HUD · LIVE TELEMETRY
          </span>
        </div>
        <div className="leading-none mb-1.5" style={{ fontFamily: 'var(--font-display), serif', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2vw, 2rem)', color: theme.text }}>
          {chipName}
        </div>
        <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
          {chip.vendor} · {chip.codename}
        </div>
      </ScrollSection>

      {bars.map((b, i) => (
        <ScrollSection key={`${chipKey}-${b.label}`}>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
              {b.label}
            </span>
            <span className="text-[11px] tabular-nums" style={{ color: b.hl ? theme.accentBright : theme.text }}>
              <DecodedText text={`${b.v} ${b.unit}`} kk={`${chipKey}-${i}`} theme={theme} />
            </span>
          </div>
          <div className="relative h-2 border" style={{ borderColor: theme.rule, background: theme.ruleSoft }}>
            <div
              className="absolute inset-y-0 left-0 transition-all duration-700"
              style={{
                width: `${Math.min(100, (b.v / b.max) * 100)}%`,
                background: b.hl ? theme.accentBright : theme.accent,
                boxShadow: b.hl ? `0 0 12px ${theme.accentBright}` : 'none',
              }}
            />
            {/* tick marks at 25/50/75 */}
            {[0.25, 0.5, 0.75].map((t) => (
              <div
                key={t}
                className="absolute top-0 bottom-0 w-px"
                style={{ left: `${t * 100}%`, background: theme.rule }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-0.5 text-[8px]" style={{ color: theme.textFaint }}>
            <span>0</span>
            <span>{b.max} {b.unit}</span>
          </div>
        </ScrollSection>
      ))}

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          best for
        </div>
        <ul className="space-y-1">
          {chip.best_for.slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] leading-relaxed" style={{ color: theme.text }}>
              <span className="mt-0.5" style={{ color: theme.accentBright }}>▸</span>
              <DecodedText text={b} kk={`${chipKey}-h-${i}`} theme={theme} />
            </li>
          ))}
        </ul>
      </ScrollSection>
    </>
  );
}

function ZoneDetailPanel({ chip, chipKey, zone, theme }: { chip: ChipSpec; chipKey: number; zone: Exclude<Zone, null>; theme: Theme }) {
  const detail = getZoneDetail(chip, zone);
  const chipName = useBitDecode(chip.name, 320, `${chipKey}-${zone}`);
  const headerKey = `${chipKey}-${zone}`;

  return (
    <>
      <ScrollSection>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: theme.accentBright, boxShadow: `0 0 8px ${theme.accentBright}` }}
          />
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.accentBright }}>
            ZONE · {detail.title}
          </span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
            {chip.vendor} {chipName}
          </span>
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className="leading-none"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontStyle: 'italic',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              color: theme.text,
            }}
          >
            <DecodedText text={detail.main} kk={headerKey} theme={theme} />
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: theme.accentBright }}>
          <DecodedText text={detail.unit} kk={`${headerKey}-u`} theme={theme} />
        </div>
      </ScrollSection>

      <Divider theme={theme} />

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          {detail.title.toLowerCase()} · spec
        </div>
        {detail.rows.map((r, i) => (
          <SRow key={`${headerKey}-${i}-${r.k}`} k={r.k} v={r.v} kk={`${headerKey}-${i}`} hl theme={theme} />
        ))}
      </ScrollSection>

      <ScrollSection>
        <div className="text-[9px] uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: theme.accent, borderColor: theme.rule }}>
          context
        </div>
        <DecodedText
          text={detail.description}
          kk={`${headerKey}-d`}
          theme={theme}
          className="text-[11px] italic leading-relaxed"
        />
      </ScrollSection>

      <ScrollSection>
        <div className="pt-3 border-t flex items-center justify-between text-[9px] uppercase tracking-[0.18em]" style={{ borderColor: theme.rule, color: theme.textDim }}>
          <span>← move cursor off chip to return</span>
          <span style={{ color: theme.accentBright }}>● PROBED</span>
        </div>
      </ScrollSection>
    </>
  );
}

function ScrollSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { root: node.closest('.side-info-scroll'), threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`side-info-section ${inView ? 'in-view' : ''}`}>
      {children}
    </div>
  );
}

function Divider({ theme = NV }: { theme?: Theme }) {
  return <div style={{ height: 1, background: theme.rule }} />;
}

function SRow({ k, v, kk, hl, theme = NV }: { k: string; v: string; kk: string | number; hl?: boolean; theme?: Theme }) {
  const dec = useBitDecode(v, 360, `${kk}-${k}`);
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: theme.textDim }}>
        {k}
      </span>
      <span className="text-right tabular-nums" style={{ fontSize: 11, color: hl ? theme.accentBright : theme.text }}>
        {dec}
      </span>
    </div>
  );
}

function DecodedText({ text, kk, className, theme = NV }: { text: string; kk: string | number; className?: string; theme?: Theme }) {
  const dec = useBitDecode(text, 360, kk);
  return <span className={className} style={{ color: theme.text }}>{dec}</span>;
}

/* ============================== Full die ============================== */

function FullDie({
  chip,
  chipKey,
  zone,
  setZone,
  tick,
  onChipEnter,
  onChipLeave,
}: {
  chip: ChipSpec;
  chipKey: number;
  zone: Zone;
  setZone: (z: Zone) => void;
  tick: number;
  onChipEnter?: () => void;
  onChipLeave?: () => void;
}) {
  // ============== Layout: Substrate → CoWoS interposer → Die + HBM ==============
  const W = 1600;
  const H = 1000;
  const padLeft = 60;
  const padRight = 540;
  const padY = 130;

  // Substrate (organic substrate · BGA on bottom)
  const subX = padLeft;
  const subY = padY;
  const subW = W - padLeft - padRight;
  const subH = H - padY * 2;

  // CoWoS interposer (silicon · holds die + HBM stacks)
  const intX = subX + 16;
  const intY = subY + 16;
  const intW = subW - 32;
  const intH = subH - 32;

  const isDual = chip.die.layout === 'dual-die';
  const isChiplet = chip.die.layout === 'chiplet' && (chip.die.xcds || 0) >= 8;
  const isTrainium = chip.id === 'tr2';

  // HBM stacks live on the interposer, flanking the die
  const hbmW = 64;
  const hbmGap = 8;
  const hbmStacks = chip.memory.stacks || 4;
  const hbmLeft = Math.ceil(hbmStacks / 2);
  const hbmRight = Math.floor(hbmStacks / 2);

  // The die sits between the HBM groups
  const dieX = intX + hbmW + hbmGap + 8;
  const dieY = intY + 12;
  const dieW = intW - (hbmW + hbmGap + 8) * 2;
  const dieH = intH - 24;

  // PHY/MC strips ON the die edge, adjacent to HBM
  const phyW = 14;
  const mcW = 18;

  // Vertical band budget (top → bottom of die):
  //   4-18   : NVLink PHY strip          (14)
  //   24-40  : status / corner block row (16)
  //   48-74  : L2 cache top strip        (26)
  //   90-…   : compute area (GPCs)
  //   …      : GigaThread Engine band    (18)
  //   …      : L2 SOUTH strip            (24)
  //   …      : function-block row        (18)
  //   …      : PCIe PHY strip            (14)
  const TOP_BAND_END = 96; // compute starts at dieY + TOP_BAND_END (more breathing room)
  const BOT_BAND = 108;    // reserved at bottom of die

  // Inner compute area — between PHY/MC strips horizontally and the top/bottom bands vertically
  const innerX = dieX + phyW + mcW + 6;
  const innerY = dieY + TOP_BAND_END;
  const innerW = dieW - (phyW + mcW + 6) * 2;
  const innerH = dieH - TOP_BAND_END - BOT_BAND;

  // Per-chip architecture data
  const arch = chip.architecture;
  const gpcCount = arch.gpcs ?? (isDual ? 16 : isChiplet ? 8 : 8);
  const nvlinkLanes = arch.nvlink_lanes ?? 18;
  const pcieLanes = arch.pcie_lanes ?? 16;
  const l2Slices = arch.l2_slices ?? 12;
  const blocks = arch.blocks ?? [];

  // GPC grid — true layout: rows × cols depends on per-chip count
  const gpcRows = gpcCount >= 16 ? 4 : gpcCount === 7 ? 4 : 4;
  const gpcCols = gpcCount >= 16 ? 4 : gpcCount === 7 ? 2 : 2;
  // For dual-die: each die has gpcCount/2; we render 2 side-by-side regions
  const tpcsPerGpc =
    chip.id === 'h100' || chip.id === 'h200' ? 6 : chip.id === 'b200' ? 5 : chip.id === 'a100' ? 4 : 4;
  const cols = isChiplet ? 16 : isDual ? 22 : 14;
  const rows = isChiplet ? 8 : isDual ? 12 : 12;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
      onMouseLeave={() => {
        setZone(null);
        onChipLeave?.();
      }}
    >
      <defs>
        <pattern id="bg-pcb" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 22 0 L 0 0 0 22" fill="none" stroke={NV.accent} strokeOpacity="0.05" strokeWidth="0.5" />
        </pattern>
        <pattern id="powerRail" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 0 60 L 60 0" fill="none" stroke={NV.accent} strokeOpacity="0.04" strokeWidth="0.5" />
          <path d="M -10 30 L 30 -10" fill="none" stroke={NV.accent} strokeOpacity="0.03" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#bg-pcb)" opacity={0.5} />

      {/* ===== Live telemetry strip ABOVE substrate ===== */}
      <g pointerEvents="none">
        <rect
          x={subX}
          y={subY - 32}
          width={subW}
          height={22}
          fill="rgba(0,0,0,0.55)"
          stroke={NV.accent}
          strokeOpacity={0.3}
          strokeWidth={0.5}
        />
        <text x={subX + 12} y={subY - 17} fontSize={9} letterSpacing="2.5" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }} fill={NV.accentBright}>
          ●  TELEMETRY
        </text>
        <text x={subX + 130} y={subY - 17} fontSize={9} letterSpacing="1.5" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }} fill={NV.text}>
          CLK <tspan fill={NV.accentBright}>{(1.83 + Math.sin(tick * 0.04) * 0.04).toFixed(2)} GHz</tspan>
        </text>
        <text x={subX + 280} y={subY - 17} fontSize={9} letterSpacing="1.5" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }} fill={NV.text}>
          TEMP <tspan fill={NV.accentBright}>{(74 + Math.sin(tick * 0.025) * 4).toFixed(1)}°C</tspan>
        </text>
        <text x={subX + 420} y={subY - 17} fontSize={9} letterSpacing="1.5" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }} fill={NV.text}>
          POWER <tspan fill={NV.accentBright}>{Math.round(chip.power_w * (0.86 + Math.sin(tick * 0.03) * 0.06))}/{chip.power_w} W</tspan>
        </text>
        <text x={subX + 600} y={subY - 17} fontSize={9} letterSpacing="1.5" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }} fill={NV.text}>
          UTIL <tspan fill={NV.accentBright}>{Math.round(82 + Math.sin(tick * 0.02) * 8)}%</tspan>
        </text>
        <text x={subX + subW - 12} y={subY - 17} textAnchor="end" fontSize={9} letterSpacing="2" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }} fill={NV.textDim}>
          {chip.vendor} · {chip.name}
        </text>
      </g>

      {/* ===== Organic substrate (BGA package · 1024 ball) ===== */}
      <rect
        x={subX}
        y={subY}
        width={subW}
        height={subH}
        rx={10}
        fill="#020503"
        fillOpacity={0.78}
        stroke={NV.accent}
        strokeOpacity={0.32}
        strokeWidth={0.8}
        onMouseEnter={() => onChipEnter?.()}
        style={{ cursor: 'crosshair' }}
      />
      {/* substrate corner labels */}
      <text x={subX + 8} y={subY + 12} fontSize={7} letterSpacing="1.5" fill={NV.accent} fillOpacity={0.45} style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}>
        SXM5 SUBSTRATE · BGA-1024
      </text>
      <text x={subX + subW - 8} y={subY + 12} fontSize={7} textAnchor="end" letterSpacing="1.5" fill={NV.accent} fillOpacity={0.45} style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}>
        ECN {chip.id.toUpperCase()}-A1
      </text>

      {/* substrate microbump grid */}
      <g pointerEvents="none">
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 11;
          return (
            <g key={`bga-${i}`}>
              <circle cx={subX + 4} cy={subY + t * subH} r={1.2} fill={NV.accent} fillOpacity={0.4} />
              <circle cx={subX + subW - 4} cy={subY + t * subH} r={1.2} fill={NV.accent} fillOpacity={0.4} />
              <circle cx={subX + t * subW} cy={subY + 4} r={1.2} fill={NV.accent} fillOpacity={0.4} />
              <circle cx={subX + t * subW} cy={subY + subH - 4} r={1.2} fill={NV.accent} fillOpacity={0.4} />
            </g>
          );
        })}
      </g>

      {/* substrate decoupling capacitors (low-ESL caps along substrate edge — real chip detail) */}
      <g pointerEvents="none">
        {Array.from({ length: 24 }).map((_, i) => {
          const t = (i + 0.5) / 24;
          return (
            <g key={`dcap-${i}`}>
              <rect x={subX + 8} y={subY + t * subH - 1.5} width={3} height={3} fill="#1a2a08" stroke={NV.accent} strokeOpacity={0.55} strokeWidth={0.3} />
              <rect x={subX + subW - 11} y={subY + t * subH - 1.5} width={3} height={3} fill="#1a2a08" stroke={NV.accent} strokeOpacity={0.55} strokeWidth={0.3} />
            </g>
          );
        })}
        {Array.from({ length: 28 }).map((_, i) => {
          const t = (i + 0.5) / 28;
          return (
            <g key={`dcap-h-${i}`}>
              <rect x={subX + t * subW - 1.5} y={subY + 8} width={3} height={3} fill="#1a2a08" stroke={NV.accent} strokeOpacity={0.55} strokeWidth={0.3} />
            </g>
          );
        })}
        {/* SXM5 connector pads on bottom edge */}
        {Array.from({ length: 32 }).map((_, i) => {
          const t = (i + 0.5) / 32;
          return (
            <rect
              key={`sxm-${i}`}
              x={subX + t * subW - 2}
              y={subY + subH - 6}
              width={4}
              height={4}
              fill={NV.accent}
              fillOpacity={0.65}
              stroke={NV.accentBright}
              strokeOpacity={0.4}
              strokeWidth={0.3}
            />
          );
        })}
        <text
          x={subX + subW / 2}
          y={subY + subH - 12}
          textAnchor="middle"
          fontSize={6}
          letterSpacing="1.4"
          fill={NV.accent}
          fillOpacity={0.55}
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        >
          SXM5 CONNECTOR · 32 SIGNAL PADS
        </text>
      </g>

      {/* ===== CoWoS-S silicon interposer (holds die + HBM) ===== */}
      <rect
        x={intX}
        y={intY}
        width={intW}
        height={intH}
        rx={6}
        fill="#06120a"
        fillOpacity={0.88}
        stroke={NV.accent}
        strokeOpacity={0.42}
        strokeWidth={0.7}
      />
      <text x={intX + 8} y={intY + 12} fontSize={7} letterSpacing="1.5" fill={NV.accent} fillOpacity={0.55} style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}>
        COWOS-{chip.id === 'b200' ? 'L' : 'S'} INTERPOSER · {chip.id === 'b200' ? '6×' : '~3.3×'} RETICLE
      </text>
      {/* interposer μbump field — densely populated */}
      <g pointerEvents="none">
        {Array.from({ length: 36 }).map((_, i) =>
          Array.from({ length: 22 }).map((_, j) => (
            <circle
              key={`uib-${i}-${j}`}
              cx={intX + 16 + (i * (intW - 32)) / 35}
              cy={intY + 24 + (j * (intH - 36)) / 21}
              r={0.5}
              fill={NV.accent}
              fillOpacity={0.18}
            />
          )),
        )}
      </g>

      {/* package corner BGA balls */}
      {[
        [subX + 6, subY + 6],
        [subX + subW - 6, subY + 6],
        [subX + 6, subY + subH - 6],
        [subX + subW - 6, subY + subH - 6],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={NV.accent} fillOpacity={0.85} />
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

        {/* Confidential Compute fence — dashed amber ring (TEE I/O perimeter) */}
        {chip.architecture.features_micro?.some((f) => f.toLowerCase().includes('confidential')) && (
          <rect
            x={dieX + 6}
            y={dieY + 6}
            width={dieW - 12}
            height={dieH - 12}
            rx={6}
            fill="none"
            stroke={NV.accent}
            strokeOpacity={0.4}
            strokeWidth={0.5}
            strokeDasharray="4 3"
            pointerEvents="none"
          />
        )}

        {/* Status row — PMU · PLL · GSP · JTAG inline blocks at dieY + 22..36 */}
        {!isDual && !isChiplet && !isTrainium && (
          <g pointerEvents="none">
            <rect x={dieX + phyW + mcW + 10} y={dieY + 22} width={56} height={14} fill={NV.accentDeep} fillOpacity={0.82} stroke={NV.accent} strokeOpacity={0.6} strokeWidth={0.4} />
            <text x={dieX + phyW + mcW + 38} y={dieY + 32} textAnchor="middle" fontSize={6.5} letterSpacing="0.9" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }} fill={NV.text} opacity={0.95}>
              PMU · DVFS
            </text>
            <rect x={dieX + phyW + mcW + 70} y={dieY + 22} width={50} height={14} fill={NV.accentDeep} fillOpacity={0.82} stroke={NV.accent} strokeOpacity={0.6} strokeWidth={0.4} />
            <text x={dieX + phyW + mcW + 95} y={dieY + 32} textAnchor="middle" fontSize={6.5} letterSpacing="0.9" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }} fill={NV.text} opacity={0.95}>
              PLL · CLK
            </text>
            <rect x={dieX + phyW + mcW + 124} y={dieY + 22} width={50} height={14} fill={NV.accentDeep} fillOpacity={0.82} stroke={NV.accent} strokeOpacity={0.6} strokeWidth={0.4} />
            <text x={dieX + phyW + mcW + 149} y={dieY + 32} textAnchor="middle" fontSize={6.5} letterSpacing="0.9" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }} fill={NV.text} opacity={0.95}>
              JTAG · SCAN
            </text>
            <rect x={dieX + dieW - phyW - mcW - 86} y={dieY + 22} width={80} height={14} fill={NV.accentDeep} fillOpacity={0.85} stroke={NV.accent} strokeOpacity={0.6} strokeWidth={0.45} />
            <text x={dieX + dieW - phyW - mcW - 46} y={dieY + 32} textAnchor="middle" fontSize={6.5} letterSpacing="0.9" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }} fill={NV.text} opacity={0.95}>
              GSP · μC · BOOT
            </text>
          </g>
        )}

        {/* Thermal sensor diodes — distributed across the compute area (real chip detail) */}
        <g pointerEvents="none">
          {[
            [0.2, 0.3], [0.45, 0.25], [0.7, 0.3], [0.85, 0.5],
            [0.7, 0.7], [0.45, 0.75], [0.2, 0.7], [0.15, 0.5],
            [0.5, 0.5],
          ].map(([fx, fy], i) => {
            const px = dieX + fx * dieW;
            const py = dieY + fy * dieH;
            const phase = (tick + i * 12) % 60;
            const lit = phase < 6;
            return (
              <g key={`tsense-${i}`}>
                <circle cx={px} cy={py} r={lit ? 2 : 1.2} fill={lit ? NV.accentBright : NV.accent} fillOpacity={lit ? 0.95 : 0.5} />
                {lit && <circle cx={px} cy={py} r={4} fill="none" stroke={NV.accentBright} strokeOpacity={0.4} strokeWidth={0.4} />}
              </g>
            );
          })}
        </g>

        {/* Live data-flow packets — HBM → MC → L2 → GPC → back. Animated dots. */}
        <g pointerEvents="none">
          {Array.from({ length: hbmStacks }).map((_, i) => {
            const isLeft = i < hbmLeft;
            const localIdx = isLeft ? i : i - hbmLeft;
            const stackCount = isLeft ? hbmLeft : hbmRight;
            const slotH = (innerH - (stackCount - 1) * 4) / stackCount;
            const y0 = innerY + localIdx * (slotH + 4) + slotH / 2;
            const x0 = isLeft ? dieX + phyW + mcW + 6 : dieX + dieW - phyW - mcW - 6;
            const x1 = isLeft ? innerX + 6 : innerX + innerW - 6;
            const y1 = dieY + 38; // top L2 strip Y
            const phase = ((tick * 1.4 + i * 9) % 100) / 100;
            // Two-segment path: horizontal from MC to compute, then up to L2
            const seg1End = 0.55;
            let px: number, py: number;
            if (phase < seg1End) {
              const t = phase / seg1End;
              px = x0 + (x1 - x0) * t;
              py = y0;
            } else {
              const t = (phase - seg1End) / (1 - seg1End);
              px = x1;
              py = y0 + (y1 - y0) * t;
            }
            return (
              <g key={`flow-${i}`}>
                <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={NV.accent} strokeOpacity={0.18} strokeWidth={0.5} strokeDasharray="2 3" />
                <line x1={x1} y1={y0} x2={x1} y2={y1} stroke={NV.accent} strokeOpacity={0.18} strokeWidth={0.5} strokeDasharray="2 3" />
                <circle cx={px} cy={py} r={1.8} fill={NV.accentBright} fillOpacity={0.9} />
                <circle cx={px} cy={py} r={3.5} fill="none" stroke={NV.accentBright} strokeOpacity={0.35} strokeWidth={0.4} />
              </g>
            );
          })}
        </g>

        {/* LIVE COUNTERS — single line ABOVE the substrate, won't collide with anything on-die */}
        {/* power rail crosshatch on substrate (decorative, suggests metal layers) */}
        <rect
          x={dieX + 4}
          y={dieY + 4}
          width={dieW - 8}
          height={dieH - 8}
          rx={6}
          fill="url(#powerRail)"
          pointerEvents="none"
        />

        {/* HBM stacks — placed ON the interposer, flanking the die */}
        {Array.from({ length: hbmLeft }).map((_, i) => {
          const sH = (intH - 32 - (hbmLeft - 1) * 8) / hbmLeft;
          const y = intY + 24 + i * (sH + 8);
          const hbmType = arch.hbm_height ?? `${chip.memory.type}`;
          return (
            <HbmDetailed
              key={`hl-${i}`}
              x={intX + 8}
              y={y}
              w={hbmW}
              h={sH}
              idx={i}
              type={hbmType}
              perStack={arch.per_stack_gb}
              vendor={arch.hbm_vendor}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}
        {Array.from({ length: hbmRight }).map((_, i) => {
          const sH = (intH - 32 - (hbmRight - 1) * 8) / hbmRight;
          const y = intY + 24 + i * (sH + 8);
          const hbmType = arch.hbm_height ?? `${chip.memory.type}`;
          return (
            <HbmDetailed
              key={`hr-${i}`}
              x={intX + intW - 8 - hbmW}
              y={y}
              w={hbmW}
              h={sH}
              idx={hbmLeft + i}
              type={hbmType}
              perStack={arch.per_stack_gb}
              vendor={arch.hbm_vendor}
              active={zone === 'hbm'}
              setZone={setZone}
            />
          );
        })}

        {/* HBM PHY + Memory Controller — on-die strips adjacent to HBM */}
        <HbmPhyMcColumn
          x={dieX + 4}
          y={innerY}
          h={innerH}
          phyW={phyW}
          mcW={mcW}
          count={hbmLeft}
          startIdx={0}
          side="L"
          active={zone === 'hbm'}
        />
        <HbmPhyMcColumn
          x={dieX + dieW - phyW - mcW - 4}
          y={innerY}
          h={innerH}
          phyW={phyW}
          mcW={mcW}
          count={hbmRight}
          startIdx={hbmLeft}
          side="R"
          active={zone === 'hbm'}
        />

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
              {/* NV-HBI bridge — full-height inter-die fabric with microbump array */}
              <rect
                x={innerX + innerW / 2 - 14}
                y={innerY}
                width={28}
                height={innerH}
                fill={zone === 'bridge' ? NV.accentBright : NV.accentDeep}
                fillOpacity={zone === 'bridge' ? 0.7 : 0.85}
                stroke={zone === 'bridge' ? NV.accentBright : NV.accent}
                strokeOpacity={zone === 'bridge' ? 1 : 0.85}
                strokeWidth={0.7}
              />
              {/* dense microbump field across the bridge */}
              {Array.from({ length: 28 }).map((_, ri) =>
                Array.from({ length: 4 }).map((_, ci) => (
                  <circle
                    key={`hbi-${ri}-${ci}`}
                    cx={innerX + innerW / 2 - 10 + ci * 7}
                    cy={innerY + 6 + (ri * (innerH - 12)) / 27}
                    r={zone === 'bridge' ? 1.1 : 0.7}
                    fill={zone === 'bridge' ? NV.bg : NV.accent}
                    fillOpacity={zone === 'bridge' ? 0.95 : 0.65}
                  />
                )),
              )}
              {/* live data packets traveling vertically */}
              {Array.from({ length: 4 }).map((_, i) => {
                const phase = ((tick * 2 + i * 25) % 100) / 100;
                const py = innerY + phase * innerH;
                return (
                  <circle
                    key={`hbi-pkt-${i}`}
                    cx={innerX + innerW / 2 + (i % 2 === 0 ? -7 : 7)}
                    cy={py}
                    r={2}
                    fill={NV.accentBright}
                    fillOpacity={0.95}
                  />
                );
              })}
              <text
                x={innerX + innerW / 2}
                y={innerY + innerH / 2}
                textAnchor="middle"
                fontSize={9}
                letterSpacing="2.5"
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, transform: `rotate(-90deg)`, transformOrigin: `${innerX + innerW / 2}px ${innerY + innerH / 2}px` }}
                fill={zone === 'bridge' ? NV.bg : NV.text}
                opacity={0.95}
              >
                NV-HBI · 10 TB/s · TRANSPARENT
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

        {/* L2 CACHE TOP — sits between status row and compute */}
        <g
          onMouseEnter={() => setZone('l2')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {(() => {
            const yPos = dieY + 48;
            const slicesShown = Math.min(l2Slices, 16);
            return (
              <>
                {Array.from({ length: slicesShown }).map((_, i) => (
                  <rect
                    key={`l2t-${i}`}
                    x={innerX + (i * (innerW - 4)) / slicesShown + 1}
                    y={yPos}
                    width={(innerW - 4) / slicesShown - 2}
                    height={26}
                    fill={zone === 'l2' ? '#86d92e' : NV.accentDeep}
                    fillOpacity={zone === 'l2' ? 0.95 : 0.55}
                    stroke={zone === 'l2' ? NV.accentBright : NV.accent}
                    strokeOpacity={zone === 'l2' ? 0.9 : 0.35}
                    strokeWidth={0.5}
                  />
                ))}
                <text
                  x={innerX + 12}
                  y={yPos + 17}
                  fontSize={9}
                  letterSpacing="2.5"
                  style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
                  fill={zone === 'l2' ? '#0a1505' : NV.text}
                  opacity={zone === 'l2' ? 1 : 0.95}
                >
                  {chip.id === 'mi300x' ? 'INFINITY CACHE' : 'L2 CACHE NORTH'}{arch.l2_mb ? ` · ${arch.l2_mb} MB` : ''} · {l2Slices} SLICES
                </text>
              </>
            );
          })()}
        </g>

        {/* L2 CACHE SOUTH — bottom strip, paired with TOP */}
        <g
          onMouseEnter={() => setZone('l2')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {(() => {
            const yPos = dieY + dieH - 76;
            const slicesShown = Math.min(l2Slices, 16);
            return (
              <>
                {Array.from({ length: slicesShown }).map((_, i) => (
                  <rect
                    key={`l2b-${i}`}
                    x={innerX + (i * (innerW - 4)) / slicesShown + 1}
                    y={yPos}
                    width={(innerW - 4) / slicesShown - 2}
                    height={22}
                    fill={zone === 'l2' ? '#86d92e' : NV.accentDeep}
                    fillOpacity={zone === 'l2' ? 0.95 : 0.55}
                    stroke={zone === 'l2' ? NV.accentBright : NV.accent}
                    strokeOpacity={zone === 'l2' ? 0.9 : 0.35}
                    strokeWidth={0.5}
                  />
                ))}
                <text
                  x={innerX + 12}
                  y={yPos + 14}
                  fontSize={8}
                  letterSpacing="2.2"
                  style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
                  fill={zone === 'l2' ? '#0a1505' : NV.text}
                  opacity={zone === 'l2' ? 1 : 0.85}
                >
                  L2 SOUTH · CROSSBAR · TAG · ECC
                </text>
              </>
            );
          })()}
        </g>

        {/* GigaThread Engine — dedicated band BETWEEN compute and L2 SOUTH */}
        {!isDual && (
          <g pointerEvents="none">
            <rect
              x={innerX}
              y={dieY + dieH - 100}
              width={innerW}
              height={18}
              fill={zone === 'compute' ? NV.accentBright : '#0a1505'}
              fillOpacity={zone === 'compute' ? 0.55 : 0.92}
              stroke={zone === 'compute' ? NV.accentBright : NV.accent}
              strokeOpacity={zone === 'compute' ? 1 : 0.85}
              strokeWidth={0.7}
            />
            <text
              x={innerX + innerW / 2}
              y={dieY + dieH - 87}
              textAnchor="middle"
              fontSize={9}
              letterSpacing="2.2"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }}
              fill={zone === 'compute' ? NV.bg : NV.accentBright}
            >
              GIGATHREAD ENGINE · COMPUTE WORK DISTRIBUTOR
            </text>
          </g>
        )}

        {/* Function blocks — top 5 most distinctive, sits between L2 SOUTH and PCIe PHY */}
        {!isDual && blocks.length > 0 && (
          <FunctionBlockRow
            x={innerX + 4}
            y={dieY + dieH - 48}
            w={innerW - 8}
            h={18}
            blocks={blocks.slice(0, 5)}
            active={zone === 'compute'}
          />
        )}

        {/* NVLink / fabric — PHY strip + ports (chip-specific lane count) */}
        {nvlinkLanes > 0 && (
          <g
            onMouseEnter={() => setZone('nvlink')}
            onMouseLeave={() => setZone(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={innerX}
              y={dieY + 4}
              width={innerW}
              height={14}
              fill={zone === 'nvlink' ? NV.accentBright : '#0a1505'}
              fillOpacity={zone === 'nvlink' ? 0.4 : 0.85}
              stroke={zone === 'nvlink' ? NV.accentBright : NV.accent}
              strokeOpacity={zone === 'nvlink' ? 1 : 0.55}
              strokeWidth={0.6}
            />
            {Array.from({ length: nvlinkLanes }).map((_, i) => (
              <line
                key={`nlp-${i}`}
                x1={innerX + 8 + (i * (innerW - 16)) / Math.max(1, nvlinkLanes - 1)}
                y1={dieY + 4}
                x2={innerX + 8 + (i * (innerW - 16)) / Math.max(1, nvlinkLanes - 1)}
                y2={dieY + 18}
                stroke={zone === 'nvlink' ? NV.accentBright : NV.accent}
                strokeOpacity={zone === 'nvlink' ? 1 : 0.45}
                strokeWidth={0.6}
              />
            ))}
            <text
              x={innerX + 6}
              y={dieY + 14}
              fontSize={8}
              letterSpacing="2"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
              fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
              opacity={zone === 'nvlink' ? 1 : 0.95}
            >
              {chip.interconnect.fabric.toUpperCase()} PHY · {nvlinkLanes} LANES
            </text>
            {Array.from({ length: nvlinkLanes }).map((_, i) => (
              <rect
                key={`nl-${i}`}
                x={innerX + 4 + (i * (innerW - 8)) / nvlinkLanes}
                y={dieY - 14}
                width={(innerW - 8) / nvlinkLanes - 4}
                height={10}
                fill={zone === 'nvlink' ? NV.accentBright : NV.accent}
                fillOpacity={zone === 'nvlink' ? 1 : 0.55}
              />
            ))}
          </g>
        )}

        {/* PCIe — PHY strip + ports */}
        <g
          onMouseEnter={() => setZone('pcie')}
          onMouseLeave={() => setZone(null)}
          style={{ cursor: 'pointer' }}
        >
          {/* on-die PCIe PHY strip (above the off-die ports) */}
          <rect
            x={innerX}
            y={dieY + dieH - 18}
            width={innerW}
            height={14}
            fill={zone === 'pcie' ? NV.accentBright : '#0a1505'}
            fillOpacity={zone === 'pcie' ? 0.4 : 0.85}
            stroke={zone === 'pcie' ? NV.accentBright : NV.accent}
            strokeOpacity={zone === 'pcie' ? 1 : 0.55}
            strokeWidth={0.6}
          />
          {Array.from({ length: pcieLanes }).map((_, i) => (
            <line
              key={`pcp-${i}`}
              x1={innerX + 8 + (i * (innerW - 16)) / Math.max(1, pcieLanes - 1)}
              y1={dieY + dieH - 18}
              x2={innerX + 8 + (i * (innerW - 16)) / Math.max(1, pcieLanes - 1)}
              y2={dieY + dieH - 4}
              stroke={zone === 'pcie' ? NV.accentBright : NV.accent}
              strokeOpacity={zone === 'pcie' ? 1 : 0.45}
              strokeWidth={0.6}
            />
          ))}
          <text
            x={innerX + 6}
            y={dieY + dieH - 8}
            fontSize={8}
            letterSpacing="2"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
            fill={zone === 'pcie' ? NV.accentBright : NV.accent}
            opacity={zone === 'pcie' ? 1 : 0.85}
          >
            PCIe PHY · {chip.interconnect.pcie ?? 'Gen 5 ×16'}
          </text>
          {/* off-die ports */}
          {Array.from({ length: 4 }).map((_, i) => (
            <rect
              key={`pc-${i}`}
              x={innerX + 80 + i * 100}
              y={dieY + dieH + 4}
              width={64}
              height={10}
              fill={zone === 'pcie' ? NV.accentBright : NV.accent}
              fillOpacity={zone === 'pcie' ? 1 : 0.5}
            />
          ))}
        </g>
      </g>

      {/* corner labels removed — redundant with telemetry strip + side info panel */}

      <style>{`@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </svg>
  );
}

function HbmDetailed({
  x,
  y,
  w,
  h,
  idx,
  type,
  perStack,
  vendor,
  active,
  setZone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  idx: number;
  type: string;
  perStack?: number;
  vendor?: string;
  active: boolean;
  setZone: (z: Zone) => void;
}) {
  // Stack: top label band → 8 channel-die rectangles → base logic die at bottom
  const labelH = 11;
  const baseH = 9;
  const channelArea = h - labelH - baseH;
  const channels = 8; // HBM3/3e is 8 channels; HBM2e was 8 ps too
  const chH = channelArea / channels;
  return (
    <g
      onMouseEnter={() => setZone('hbm')}
      onMouseLeave={() => setZone(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* outer stack outline — brighter to read as off-die HBM, distinct from on-die green */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active ? NV.accentBright : '#0e1f08'}
        fillOpacity={active ? 0.45 : 0.95}
        stroke={active ? NV.accentBright : NV.accentBright}
        strokeOpacity={active ? 1 : 0.85}
        strokeWidth={active ? 1.6 : 0.95}
      />
      {/* top label band */}
      <rect x={x} y={y} width={w} height={labelH} fill={active ? NV.bg : NV.accentBright} fillOpacity={active ? 0.95 : 0.85} />
      <text
        x={x + 3}
        y={y + 8}
        fontSize={6}
        letterSpacing="1.2"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }}
        fill={active ? NV.accentBright : NV.bg}
      >
        HBM{idx}
      </text>
      <text
        x={x + w - 3}
        y={y + 8}
        textAnchor="end"
        fontSize={5.5}
        letterSpacing="0.5"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        fill={active ? NV.accentBright : NV.bg}
        opacity={0.95}
      >
        {perStack ? `${perStack}G` : ''}
      </text>
      {/* 8 channel dies */}
      {Array.from({ length: channels }).map((_, i) => (
        <g key={i}>
          <rect
            x={x + 2}
            y={y + labelH + i * chH + 0.5}
            width={w - 4}
            height={chH - 1}
            fill={active ? NV.accent : '#040603'}
            fillOpacity={active ? 0.55 : 0.85}
            stroke={NV.accent}
            strokeOpacity={active ? 0.85 : 0.42}
            strokeWidth={0.4}
          />
          {/* channel separator dashes */}
          <line
            x1={x + w / 2}
            y1={y + labelH + i * chH + 1}
            x2={x + w / 2}
            y2={y + labelH + (i + 1) * chH - 1}
            stroke={NV.accent}
            strokeOpacity={0.3}
            strokeWidth={0.3}
            strokeDasharray="1 2"
          />
        </g>
      ))}
      {/* base logic die */}
      <rect
        x={x + 2}
        y={y + h - baseH}
        width={w - 4}
        height={baseH - 1}
        fill={active ? NV.accentBright : NV.accentDeep}
        fillOpacity={active ? 0.85 : 0.7}
        stroke={NV.accent}
        strokeOpacity={active ? 1 : 0.7}
        strokeWidth={0.5}
      />
      <text
        x={x + w / 2}
        y={y + h - 2}
        textAnchor="middle"
        fontSize={5.5}
        letterSpacing="1.2"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }}
        fill={active ? NV.bg : NV.text}
        opacity={0.95}
      >
        BASE LOGIC
      </text>
    </g>
  );
}

function HbmPhyMcColumn({
  x,
  y,
  h,
  phyW,
  mcW,
  count,
  startIdx,
  side,
  active,
}: {
  x: number;
  y: number;
  h: number;
  phyW: number;
  mcW: number;
  count: number;
  startIdx: number;
  side: 'L' | 'R';
  active: boolean;
}) {
  // PHY = analog, closest to HBM. MC = digital, deeper in die. Stacked vertically.
  const slotH = (h - (count - 1) * 4) / count;
  const phyX = side === 'L' ? x : x + mcW + 2;
  const mcX = side === 'L' ? x + phyW + 2 : x;
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const yPos = y + i * (slotH + 4);
        return (
          <g key={i}>
            {/* PHY block — striped, suggesting analog SerDes lanes */}
            <rect
              x={phyX}
              y={yPos}
              width={phyW}
              height={slotH}
              fill={active ? NV.accentBright : '#0a1505'}
              fillOpacity={active ? 0.5 : 0.95}
              stroke={active ? NV.accentBright : NV.accent}
              strokeOpacity={active ? 1 : 0.75}
              strokeWidth={0.5}
            />
            {Array.from({ length: 8 }).map((_, k) => (
              <line
                key={k}
                x1={phyX + 1}
                y1={yPos + ((k + 1) * slotH) / 9}
                x2={phyX + phyW - 1}
                y2={yPos + ((k + 1) * slotH) / 9}
                stroke={NV.accent}
                strokeOpacity={active ? 0.85 : 0.45}
                strokeWidth={0.35}
              />
            ))}
            {/* MC block — denser grid suggesting CAM + arbiter + ECC */}
            <rect
              x={mcX}
              y={yPos}
              width={mcW}
              height={slotH}
              fill={active ? NV.accentBright : '#040603'}
              fillOpacity={active ? 0.4 : 0.92}
              stroke={active ? NV.accentBright : NV.accent}
              strokeOpacity={active ? 1 : 0.65}
              strokeWidth={0.5}
            />
            {Array.from({ length: 4 }).map((_, k) =>
              Array.from({ length: 3 }).map((_, j) => (
                <rect
                  key={`${k}-${j}`}
                  x={mcX + 2 + j * (mcW - 4) / 3}
                  y={yPos + 2 + k * (slotH - 4) / 4}
                  width={(mcW - 4) / 3 - 1}
                  height={(slotH - 4) / 4 - 1}
                  fill={NV.accent}
                  fillOpacity={active ? 0.45 : 0.18}
                />
              )),
            )}
            {/* labels */}
            <text
              x={side === 'L' ? phyX + phyW / 2 : phyX + phyW / 2}
              y={yPos + 6}
              textAnchor="middle"
              fontSize={5}
              letterSpacing="0.6"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
              fill={NV.text}
              opacity={active ? 1 : 0.7}
            >
              PHY
            </text>
            <text
              x={mcX + mcW / 2}
              y={yPos + 6}
              textAnchor="middle"
              fontSize={5}
              letterSpacing="0.6"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
              fill={NV.text}
              opacity={active ? 1 : 0.7}
            >
              MC{String(startIdx + i).padStart(2, '0')}
            </text>
          </g>
        );
      })}
    </g>
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
    <g onMouseEnter={() => setZone('hbm')} onMouseLeave={() => setZone(null)} style={{ cursor: 'pointer' }}>
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
        fontSize={10}
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
  // Subdivide into GPC partitions (graphics-processing-cluster equivalent groups)
  // 4 columns × 2 rows of GPCs by default; each GPC contains a tile sub-grid (TPC/SM)
  const gpcCols = cols >= 18 ? 4 : cols >= 12 ? 4 : 2;
  const gpcRows = rows >= 10 ? 2 : 2;
  const gpcW = w / gpcCols;
  const gpcH = h / gpcRows;
  const subCols = Math.max(2, Math.floor(cols / gpcCols));
  const subRows = Math.max(2, Math.floor(rows / gpcRows));
  const tw = (gpcW - 4) / subCols;
  const th = (gpcH - 4) / subRows;

  return (
    <g onMouseEnter={() => setZone('compute')} onMouseLeave={() => setZone(null)} style={{ cursor: 'pointer' }}>
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

      {Array.from({ length: gpcRows }).map((_, gr) =>
        Array.from({ length: gpcCols }).map((_, gc) => {
          const gx = x + gc * gpcW;
          const gy = y + gr * gpcH;
          const gIdx = gr * gpcCols + gc;
          const tpcGridCols = subCols >= 4 ? 3 : 2;
          const tpcGridRows = Math.max(2, Math.ceil(subRows / 2));
          const tpcW = (gpcW - 4) / tpcGridCols;
          const tpcH = (gpcH - 18) / tpcGridRows;
          return (
            <g key={`gpc-${gr}-${gc}`}>
              {/* GPC boundary */}
              <rect
                x={gx + 1.5}
                y={gy + 1.5}
                width={gpcW - 3}
                height={gpcH - 3}
                fill="none"
                stroke={NV.accent}
                strokeOpacity={active ? 0.55 : 0.32}
                strokeWidth={0.55}
              />
              {/* GPC raster engine band at top */}
              <rect
                x={gx + 1.5}
                y={gy + 1.5}
                width={gpcW - 3}
                height={11}
                fill={active ? NV.accentBright : NV.accentDeep}
                fillOpacity={active ? 0.55 : 0.45}
              />
              <text
                x={gx + 4}
                y={gy + 9.5}
                fontSize={6.5}
                letterSpacing="1.1"
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }}
                fill={active ? NV.bg : NV.text}
                opacity={0.95}
              >
                GPC {String(gIdx).padStart(2, '0')} · RASTER
              </text>
              {/* TPC blocks inside GPC */}
              {Array.from({ length: tpcGridRows }).map((_, tr) =>
                Array.from({ length: tpcGridCols }).map((_, tc) => {
                  const tpcIdx = tr * tpcGridCols + tc;
                  const tpcX = gx + 2 + tc * tpcW;
                  const tpcY = gy + 14 + tr * tpcH;
                  return (
                    <g key={`tpc-${tpcIdx}`}>
                      <rect
                        x={tpcX + 0.5}
                        y={tpcY + 0.5}
                        width={tpcW - 1}
                        height={tpcH - 1}
                        fill="none"
                        stroke={NV.accent}
                        strokeOpacity={active ? 0.45 : 0.18}
                        strokeWidth={0.35}
                        strokeDasharray="1.5 1.5"
                      />
                      {/* Two SMs side-by-side per TPC */}
                      <SmCell
                        x={tpcX + 1}
                        y={tpcY + 1}
                        w={(tpcW - 4) / 2}
                        h={tpcH - 3}
                        idx={gIdx * 16 + tpcIdx * 2}
                        tick={tick}
                        active={active}
                      />
                      <SmCell
                        x={tpcX + 2 + (tpcW - 4) / 2}
                        y={tpcY + 1}
                        w={(tpcW - 4) / 2}
                        h={tpcH - 3}
                        idx={gIdx * 16 + tpcIdx * 2 + 1}
                        tick={tick}
                        active={active}
                      />
                    </g>
                  );
                }),
              )}
            </g>
          );
        }),
      )}

      {label && (
        <text
          x={x + 8}
          y={y + h - 4}
          fontSize={9}
          letterSpacing="2"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
          fill={active ? NV.accentBright : NV.accent}
          opacity={active ? 1 : 0.85}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ============================== Detail helpers ============================== */

function SmCell({
  x,
  y,
  w,
  h,
  idx,
  tick,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  idx: number;
  tick: number;
  active: boolean;
}) {
  // SM = 4 sub-partitions in a 2×2 grid + L1 / shared memory strip at bottom
  const l1H = Math.max(2, h * 0.16);
  const subArea = h - l1H;
  const subW = (w - 1) / 2;
  const subH = subArea / 2;
  const subs: [number, number][] = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];
  // tensor-core indicator dot in 1 of the 4 sub-partitions per cycle
  const tcSub = (idx + Math.floor(tick / 4)) % 4;
  const litSub = (idx + Math.floor(tick / 2)) % 4;

  return (
    <g pointerEvents="none">
      {/* SM outer frame */}
      <rect x={x} y={y} width={w} height={h} fill="#040603" stroke={NV.accent} strokeOpacity={active ? 0.55 : 0.22} strokeWidth={0.3} />
      {/* 4 sub-partitions */}
      {subs.map(([sx, sy], i) => {
        const x0 = x + sx * subW + (sx > 0 ? 1 : 0);
        const y0 = y + sy * subH + (sy > 0 ? 0.5 : 0);
        const isLit = i === litSub && active;
        const hasTc = i === tcSub;
        return (
          <g key={i}>
            <rect
              x={x0}
              y={y0}
              width={subW - 0.5}
              height={subH - 0.5}
              fill={isLit ? NV.accentBright : '#0a1505'}
              fillOpacity={isLit ? 0.95 : 0.78}
              stroke={NV.accent}
              strokeOpacity={active ? 0.45 : 0.2}
              strokeWidth={0.25}
            />
            {/* tensor-core dot */}
            {hasTc && subW > 3 && (
              <circle
                cx={x0 + subW / 2}
                cy={y0 + subH / 2}
                r={Math.min(subW, subH) * 0.18}
                fill={NV.accentBright}
                fillOpacity={active ? 1 : 0.6}
              />
            )}
          </g>
        );
      })}
      {/* L1 / shared memory strip at bottom of SM */}
      <rect
        x={x}
        y={y + h - l1H}
        width={w}
        height={l1H}
        fill={NV.accentDeep}
        fillOpacity={active ? 0.85 : 0.55}
      />
    </g>
  );
}


function Tsvs({ x, y, w, active }: { x: number; y: number; w: number; active: boolean }) {
  // Through-silicon-via dot array on top of HBM stack
  const cols = 6;
  return (
    <g pointerEvents="none">
      {Array.from({ length: cols }).map((_, i) => (
        <circle
          key={i}
          cx={x + 6 + (i * (w - 12)) / (cols - 1)}
          cy={y}
          r={1.4}
          fill={active ? NV.accentBright : NV.accent}
          fillOpacity={active ? 1 : 0.65}
        />
      ))}
    </g>
  );
}

function McStrip({
  x,
  y,
  h,
  side,
  idx,
  active,
}: {
  x: number;
  y: number;
  h: number;
  side: 'L' | 'R';
  idx: number;
  active: boolean;
}) {
  // On-die memory controller block adjacent to its HBM stack
  const w = 8;
  return (
    <g pointerEvents="none">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active ? NV.accentBright : '#0a1505'}
        fillOpacity={active ? 0.6 : 0.92}
        stroke={active ? NV.accentBright : NV.accent}
        strokeOpacity={active ? 1 : 0.7}
        strokeWidth={0.55}
      />
      {/* phy lanes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={i}
          x1={x + 1.5}
          y1={y + ((i + 1) * h) / 5}
          x2={x + w - 1.5}
          y2={y + ((i + 1) * h) / 5}
          stroke={active ? NV.accentBright : NV.accent}
          strokeOpacity={0.55}
          strokeWidth={0.4}
        />
      ))}
      <text
        x={side === 'L' ? x + w + 2 : x - 2}
        y={y + 9}
        textAnchor={side === 'L' ? 'start' : 'end'}
        fontSize={6}
        letterSpacing="1"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        fill={NV.accent}
        opacity={active ? 1 : 0.55}
      >
        MC{String(idx).padStart(2, '0')}
      </text>
    </g>
  );
}

function FunctionBlock({
  x,
  y,
  w,
  h,
  label,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  active: boolean;
}) {
  return (
    <g pointerEvents="none">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active ? NV.accentBright : '#0a1505'}
        fillOpacity={active ? 0.4 : 0.9}
        stroke={active ? NV.accentBright : NV.accent}
        strokeOpacity={active ? 1 : 0.55}
        strokeWidth={0.55}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize={8}
        letterSpacing="1.6"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        fill={active ? NV.accentBright : NV.accent}
        opacity={active ? 1 : 0.95}
      >
        {label}
      </text>
    </g>
  );
}

function FunctionBlockRow({
  x,
  y,
  w,
  h,
  blocks,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  blocks: { label: string; count?: number }[];
  active: boolean;
}) {
  // Width-weighted by approximate label length so important blocks (Transformer Engine, etc.) get more room
  const labels = blocks.map((b) => (b.count ? `${b.label} × ${b.count}` : b.label));
  const lengths = labels.map((l) => Math.max(4, l.length));
  const total = lengths.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return (
    <g pointerEvents="none">
      {labels.map((label, i) => {
        const wF = (lengths[i] / total) * w - 2;
        const xF = x + cursor;
        cursor += (lengths[i] / total) * w;
        return <FunctionBlock key={i} x={xF} y={y} w={wF} h={h} label={label} active={active} />;
      })}
    </g>
  );
}
