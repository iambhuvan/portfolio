'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const PALETTE = {
  bg: '#0d0a06',
  bgSoft: '#14100a',
  text: '#ece0c7',
  textDim: 'rgba(236,224,199,0.55)',
  accent: '#d49355',
  accentDim: 'rgba(212,147,85,0.4)',
  rule: 'rgba(236,224,199,0.10)',
};

export default function WidgetsPreview() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: PALETTE.bg,
        color: PALETTE.text,
        fontFamily: 'var(--font-display, Georgia), serif',
      }}
    >
      <BgGlow />
      <header
        className="sticky top-0 z-50 backdrop-blur px-8 py-5 flex items-center justify-between border-b"
        style={{
          background: 'rgba(13,10,6,0.85)',
          borderColor: PALETTE.rule,
        }}
      >
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.32em] block mb-1"
            style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
          >
            Hero Widget · Preview
          </span>
          <h1 className="text-base">Pick one — A, B, C, or D</h1>
        </div>
        <Link
          href="/palettes"
          className="text-[11px] uppercase tracking-[0.24em] border px-4 py-2 transition-colors"
          style={{
            color: PALETTE.text,
            borderColor: PALETTE.rule,
            fontFamily: 'var(--font-mono), monospace',
          }}
        >
          ← palettes
        </Link>
      </header>

      <div className="grid lg:grid-cols-2 relative z-10">
        <Frame letter="A" title="Live inference dial" caption="Concentric rings · animated arcs · live-feeling metrics">
          <DialWidget />
        </Frame>
        <Frame letter="B" title="Vinyl — now playing" caption="Spinning record · tonearm · current project label">
          <VinylWidget />
        </Frame>
        <Frame letter="C" title="Status terminal" caption="tail -f research.log · scrolling mono lines">
          <TerminalWidget />
        </Frame>
        <Frame letter="D" title="Typographic mark" caption="Oversized serif monogram · slow rotation · pure typography">
          <MonogramWidget />
        </Frame>
        <Frame letter="E" title="Magnetic constellation · INTERACTIVE" caption="Move your cursor — points connect to it">
          <MagneticConstellation />
        </Frame>
        <Frame letter="F" title="Warped wireframe orb · INTERACTIVE" caption="Hover — the sphere distorts toward your cursor">
          <WarpedOrb />
        </Frame>
        <Frame letter="G" title="Scrubbable dial · INTERACTIVE" caption="Drag to rotate — scrubs through projects">
          <ScrubDial />
        </Frame>
        <Frame letter="H" title="Type-reactive waveform · INTERACTIVE" caption="Press any key — ripples through the trace">
          <TypeWaveform />
        </Frame>
        <Frame letter="I" title="Cursor-reveal portrait · INTERACTIVE" caption="Move over the panel — image resolves underneath">
          <RevealPortrait />
        </Frame>
        <Frame letter="J" title="Parallax card stack · INTERACTIVE" caption="Move cursor — stack tilts in 3D">
          <ParallaxStack />
        </Frame>
      </div>

      <footer
        className="relative z-10 px-8 py-12 border-t text-sm"
        style={{ borderColor: PALETTE.rule, color: PALETTE.textDim }}
      >
        Tell me <em style={{ color: PALETTE.accent }}>A, B, C, or D</em>. I&apos;ll then rebuild
        the full site keeping the cinematic 3D scroll, but reskinned in this warm-dark palette
        with editorial serif typography and your chosen widget anchoring the hero.
      </footer>
    </div>
  );
}

function BgGlow() {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-[60%] h-[70%] pointer-events-none opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle at 20% 20%, #6b3a14 0%, transparent 60%)' }}
      />
      <div
        className="fixed bottom-0 right-0 w-[50%] h-[50%] pointer-events-none opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle at 80% 80%, #b16a26 0%, transparent 65%)' }}
      />
    </>
  );
}

function Frame({
  letter,
  title,
  caption,
  children,
}: {
  letter: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative px-8 py-12 md:px-12 md:py-16 border-b lg:border-r"
      style={{ borderColor: PALETTE.rule }}
    >
      <div className="flex items-baseline justify-between mb-10">
        <span
          className="text-[10px] uppercase tracking-[0.32em]"
          style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
        >
          OPTION {letter}
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
        >
          {caption}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.32em] block mb-4"
            style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
          >
            BHUVAN NALLAMOTHU
          </span>
          <h2
            className="leading-[0.95] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
          >
            I engineer
            <br />
            <em style={{ color: PALETTE.accent }}>inference</em>
            <br />
            at the edge.
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm"
            style={{ color: PALETTE.textDim }}
          >
            Carnegie Mellon — diffusion inference, recursive language models, long-tail synthesis
            for driving VLMs.
          </p>
          <div className="mt-6">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{
                color: PALETTE.accent,
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              ━━ {title}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- A · Live inference dial ---------------- */

function DialWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  const speedup = 3.54;
  const cache = 0.85;
  const fwd = 2.82;

  const cx = 175;
  const cy = 175;

  const arc = (
    cx: number,
    cy: number,
    r: number,
    start: number,
    end: number,
  ) => {
    const a1 = (start - 90) * (Math.PI / 180);
    const a2 = (end - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1},${y1} A ${r},${r} 0 ${large} 1 ${x2},${y2}`;
  };

  const breath = 0.4 * Math.sin(tick * 0.04) + 0.6;
  const sweep = (tick * 1.4) % 360;

  return (
    <div
      className="relative rounded-[28px] p-7 w-full max-w-[400px] aspect-square border"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
        boxShadow: `inset 0 0 80px rgba(212,147,85,${0.08 * breath}), 0 0 0 1px rgba(212,147,85,0.05)`,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-7">
        <defs>
          <radialGradient id="dialBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2a1d10" />
            <stop offset="100%" stopColor="#0d0a06" />
          </radialGradient>
        </defs>

        {[150, 130, 110, 92, 76].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            stroke={PALETTE.accentDim}
            strokeOpacity={0.12 + i * 0.04}
            strokeWidth={1}
            fill="none"
          />
        ))}

        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const r1 = 150;
          const r2 = i % 5 === 0 ? 142 : 146;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(a)}
              y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)}
              y2={cy + r2 * Math.sin(a)}
              stroke={PALETTE.accentDim}
              strokeOpacity={0.4}
              strokeWidth={i % 5 === 0 ? 1.2 : 0.6}
            />
          );
        })}

        <path
          d={arc(cx, cy, 130, 0, (speedup / 5) * 280)}
          stroke={PALETTE.accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={arc(cx, cy, 110, 0, cache * 280)}
          stroke={PALETTE.accent}
          strokeOpacity={0.7}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={arc(cx, cy, 92, 0, (fwd / 5) * 280)}
          stroke={PALETTE.accent}
          strokeOpacity={0.5}
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
        />

        <line
          x1={cx}
          y1={cy}
          x2={cx + 150 * Math.cos((sweep - 90) * (Math.PI / 180))}
          y2={cy + 150 * Math.sin((sweep - 90) * (Math.PI / 180))}
          stroke={PALETTE.accent}
          strokeOpacity={0.18}
          strokeWidth={1}
        />

        <circle cx={cx} cy={cy} r={64} fill="url(#dialBg)" />
        <circle cx={cx} cy={cy} r={64} fill="none" stroke={PALETTE.accent} strokeOpacity={0.3} strokeWidth={1} />

        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
          fill={PALETTE.accent}
          opacity={0.7}
        >
          SPEEDUP
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="32"
          style={{ fontFamily: 'var(--font-display, Georgia), serif' }}
          fill={PALETTE.text}
        >
          {speedup.toFixed(2)}×
        </text>
        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="1.5"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
          fill={PALETTE.textDim}
        >
          950 FRAMES · −0.02 dB
        </text>
      </svg>

      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>cache · {(cache * 100).toFixed(1)}%</span>
        <span style={{ color: PALETTE.accent }}>● live</span>
        <span>fwd/frame · {fwd.toFixed(2)}</span>
      </div>
    </div>
  );
}

/* ---------------- B · Vinyl now playing ---------------- */

function VinylWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);
  const rotation = (tick * 1.5) % 360;
  const armAngle = -28 + Math.sin(tick * 0.02) * 4;

  return (
    <div
      className="relative rounded-[28px] p-7 w-full max-w-[400px] aspect-square border"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
        boxShadow: 'inset 0 0 80px rgba(212,147,85,0.06)',
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-7">
        <defs>
          <radialGradient id="record" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0f06" />
            <stop offset="40%" stopColor="#0a0603" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <radialGradient id="label" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a2412" />
            <stop offset="100%" stopColor="#1c1207" />
          </radialGradient>
        </defs>

        <g style={{ transformOrigin: '175px 175px', transform: `rotate(${rotation}deg)` }}>
          <circle cx="175" cy="175" r="140" fill="url(#record)" />
          {[136, 128, 120, 112, 104, 96, 88, 80, 72, 64].map((r) => (
            <circle key={r} cx="175" cy="175" r={r} stroke={PALETTE.accentDim} strokeOpacity={0.18} fill="none" />
          ))}
          <circle cx="175" cy="175" r={50} fill="url(#label)" stroke={PALETTE.accent} strokeOpacity={0.4} />
          <text
            x="175"
            y="170"
            textAnchor="middle"
            fontSize="9"
            letterSpacing="2.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
            fill={PALETTE.accent}
            opacity={0.85}
          >
            BN-001
          </text>
          <text
            x="175"
            y="184"
            textAnchor="middle"
            fontSize="14"
            fontStyle="italic"
            style={{ fontFamily: 'var(--font-display, Georgia), serif' }}
            fill={PALETTE.text}
          >
            WorldServe
          </text>
          <circle cx="175" cy="175" r={4} fill={PALETTE.accent} />
        </g>

        <g style={{ transformOrigin: '290px 60px', transform: `rotate(${armAngle}deg)` }}>
          <line x1="290" y1="60" x2="190" y2="180" stroke={PALETTE.accent} strokeOpacity={0.7} strokeWidth={2.5} />
          <circle cx="290" cy="60" r="10" fill={PALETTE.bgSoft} stroke={PALETTE.accent} strokeOpacity={0.6} />
          <rect x="184" y="172" width="14" height="14" fill={PALETTE.accent} opacity={0.85} />
        </g>
      </svg>

      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>now · WorldServe</span>
        <span style={{ color: PALETTE.accent }}>33⅓ rpm</span>
        <span>side · A</span>
      </div>
    </div>
  );
}

/* ---------------- C · Status terminal ---------------- */

function TerminalWidget() {
  const lines = [
    'tail -f /var/log/research/today.log',
    '[14:02:11] worldserve.optimizer · DPM++ 2M warmup ε_prev set',
    '[14:02:14] worldserve.scheduler · action ‖a‖₁=0.31 → 2 steps',
    '[14:02:17] cache.radix · prefix hit 63.5% · saved 4.2 MB',
    '[14:02:21] erlm.budget · jaccard δ=0.04 < τ — converged',
    '[14:02:25] nki.kernel · expert routing fused · 1.42× over baseline',
    '[14:02:28] taylorseer · order=2 fired · 0/152K val failures',
    '[14:02:32] dispatch · H100 SXM · 2.82 fwd/frame · 9.37 fps',
    '[14:02:35] eval · Δvs_prev = -0.02 dB · within band',
    '∎ ready · idle',
  ];
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => (v >= lines.length ? 1 : v + 1));
    }, 700);
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div
      className="relative rounded-[24px] p-5 w-full max-w-[460px] border"
      style={{
        background: PALETTE.bgSoft,
        borderColor: PALETTE.rule,
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
      }}
    >
      <div
        className="flex items-center justify-between pb-3 mb-3 border-b text-[10px] uppercase tracking-[0.25em]"
        style={{ borderColor: PALETTE.rule, color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>● ● ●</span>
        <span style={{ color: PALETTE.accent }}>research.log</span>
        <span>▶︎ live</span>
      </div>
      <div
        className="text-[12px] leading-[1.7] font-normal min-h-[260px]"
        style={{ fontFamily: 'var(--font-mono), monospace', color: PALETTE.text }}
      >
        {lines.slice(0, visible).map((l, i) => {
          const isCommand = i === 0;
          const isFinal = l.startsWith('∎');
          return (
            <div
              key={i}
              style={{
                color: isCommand ? PALETTE.accent : isFinal ? PALETTE.accent : PALETTE.text,
                opacity: i === visible - 1 ? 1 : 0.75,
              }}
            >
              {isCommand && <span style={{ color: PALETTE.accent }}>$ </span>}
              {l}
              {i === visible - 1 && (
                <span
                  className="inline-block w-2 h-4 ml-1 align-middle"
                  style={{ background: PALETTE.accent, animation: 'blink 1s steps(2) infinite' }}
                />
              )}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

/* ---------------- E · Magnetic constellation ---------------- */

function MagneticConstellation() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  const points = useRef(
    Array.from({ length: 36 }, (_, i) => ({
      x: 30 + ((i * 47) % 290),
      y: 30 + ((i * 73) % 290),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    })),
  );

  for (const p of points.current) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 20 || p.x > 330) p.vx *= -1;
    if (p.y < 20 || p.y > 330) p.vy *= -1;
  }

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 350,
      y: ((e.clientY - rect.top) / rect.height) * 350,
    });
  };

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setMouse(null)}
      className="relative rounded-[28px] w-full max-w-[400px] aspect-square border overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-0 w-full h-full">
        <g stroke={PALETTE.accent} strokeOpacity={0.18} strokeWidth={0.5}>
          {points.current.flatMap((a, i) =>
            points.current
              .slice(i + 1)
              .map((b, j) => {
                const d = dist(a, b);
                if (d > 70) return null;
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeOpacity={Math.max(0, 0.28 - d / 250)}
                  />
                );
              }),
          )}
        </g>

        {mouse &&
          points.current.map((p, i) => {
            const d = dist(p, mouse);
            if (d > 110) return null;
            const o = Math.max(0, 1 - d / 110);
            return (
              <line
                key={`m-${i}`}
                x1={p.x}
                y1={p.y}
                x2={mouse.x}
                y2={mouse.y}
                stroke={PALETTE.accent}
                strokeOpacity={o * 0.7}
                strokeWidth={0.7}
              />
            );
          })}

        {points.current.map((p, i) => {
          const d = mouse ? dist(p, mouse) : 1000;
          const r = mouse && d < 90 ? 2 + (1 - d / 90) * 4 : 1.6;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={r}
              fill={PALETTE.accent}
              fillOpacity={mouse && d < 90 ? 0.95 : 0.55}
            />
          );
        })}

        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={5} fill="none" stroke={PALETTE.accent} strokeWidth={1} />
        )}
      </svg>
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>nodes · {points.current.length}</span>
        <span style={{ color: PALETTE.accent }}>● tracking</span>
        <span>links · {mouse ? 'on' : 'idle'}</span>
      </div>
    </div>
  );
}

/* ---------------- F · Warped wireframe orb ---------------- */

function WarpedOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // generate a 16x16 spherical grid, project to 2D with displacement toward mouse
  const cx = 175,
    cy = 175,
    R = 130;
  const cols = 28,
    rows = 14;
  const points: { x: number; y: number; depth: number }[] = [];
  for (let r = 0; r <= rows; r++) {
    const phi = (r / rows) * Math.PI;
    for (let c = 0; c < cols; c++) {
      const theta = (c / cols) * Math.PI * 2 + tick * 0.01;
      const x3 = R * Math.sin(phi) * Math.cos(theta);
      const y3 = R * Math.cos(phi);
      const z3 = R * Math.sin(phi) * Math.sin(theta);
      // displacement toward mouse
      const mx = (mouse.x - 0.5) * 350;
      const my = (mouse.y - 0.5) * 350;
      const dx = mx - x3;
      const dy = my - y3;
      const d = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - d / 200) * 30;
      const nx = d > 0 ? dx / d : 0;
      const ny = d > 0 ? dy / d : 0;
      points.push({
        x: cx + x3 + nx * force,
        y: cy + y3 + ny * force,
        depth: (z3 + R) / (2 * R),
      });
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className="relative rounded-[28px] w-full max-w-[400px] aspect-square border overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-0 w-full h-full">
        {/* horizontal rings */}
        {Array.from({ length: rows + 1 }).map((_, r) => {
          const ringPoints = points.slice(r * cols, r * cols + cols);
          const path = ringPoints
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
            .join(' ') + ' Z';
          return (
            <path
              key={r}
              d={path}
              stroke={PALETTE.accent}
              strokeOpacity={0.18 + ringPoints.reduce((a, b) => a + b.depth, 0) / cols * 0.4}
              strokeWidth={0.6}
              fill="none"
            />
          );
        })}
        {/* vertical lines */}
        {Array.from({ length: cols }).map((_, c) => {
          const path = Array.from({ length: rows + 1 }, (_, r) => points[r * cols + c])
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
            .join(' ');
          return (
            <path key={c} d={path} stroke={PALETTE.accent} strokeOpacity={0.12} strokeWidth={0.5} fill="none" />
          );
        })}
        {/* center pulse */}
        <circle
          cx={cx + (mouse.x - 0.5) * 60}
          cy={cy + (mouse.y - 0.5) * 60}
          r={3}
          fill={PALETTE.accent}
          opacity={0.8}
        />
      </svg>
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>field · live</span>
        <span style={{ color: PALETTE.accent }}>● distort</span>
        <span>{cols}×{rows} · grid</span>
      </div>
    </div>
  );
}

/* ---------------- G · Scrubbable dial ---------------- */

function ScrubDial() {
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const dragging = useRef(false);

  const projects = [
    { name: 'WorldServe', metric: '3.54×', sub: 'Open-Oasis 500M · 950 frames' },
    { name: 'TaylorSeer port', metric: '2.52×', sub: '0/152K val failures' },
    { name: 'DPM++ alone', metric: '1.98×', sub: '+4.55 dB self-coherence' },
    { name: 'ERLM', metric: '−64%', sub: 'token reduction · LongBench v2' },
    { name: 'NKI-MoE', metric: 'Top 15', sub: 'AWS Trainium3 challenge' },
    { name: 'CUDA softmax', metric: '~6.5×', sub: 'fused LayerNorm · float4' },
  ];
  const stops = projects.length;
  const idx = Math.abs(Math.round((angle / (Math.PI * 2)) * stops)) % stops;
  const cur = projects[idx];

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onUp = () => (dragging.current = false);
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx);
    setAngle(a);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerMove={onMove}
      className="relative rounded-[28px] w-full max-w-[400px] aspect-square border touch-none cursor-grab active:cursor-grabbing"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx={175} cy={175} r={140} stroke={PALETTE.accent} strokeOpacity={0.2} fill="none" />
        <circle cx={175} cy={175} r={110} stroke={PALETTE.accent} strokeOpacity={0.12} fill="none" />
        {Array.from({ length: stops }).map((_, i) => {
          const a = (i / stops) * Math.PI * 2 - Math.PI / 2;
          const x = 175 + 140 * Math.cos(a);
          const y = 175 + 140 * Math.sin(a);
          const active = i === idx;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={active ? 6 : 3}
              fill={PALETTE.accent}
              opacity={active ? 1 : 0.35}
            />
          );
        })}
        {/* indicator */}
        <line
          x1={175}
          y1={175}
          x2={175 + 140 * Math.cos(angle)}
          y2={175 + 140 * Math.sin(angle)}
          stroke={PALETTE.accent}
          strokeWidth={1.5}
        />
        <circle cx={175} cy={175} r={6} fill={PALETTE.accent} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 pointer-events-none">
        <span
          className="text-[10px] uppercase tracking-[0.32em] mb-2"
          style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
        >
          {String(idx + 1).padStart(2, '0')} / {String(stops).padStart(2, '0')}
        </span>
        <div
          className="leading-none mb-3"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: PALETTE.text,
          }}
        >
          {cur.name}
        </div>
        <div
          className="leading-none mb-2"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: PALETTE.accent,
          }}
        >
          {cur.metric}
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
        >
          {cur.sub}
        </div>
      </div>
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] pointer-events-none"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>drag · scrub</span>
        <span style={{ color: PALETTE.accent }}>{cur.name}</span>
        <span>{idx + 1}/{stops}</span>
      </div>
    </div>
  );
}

/* ---------------- H · Type-reactive waveform ---------------- */

function TypeWaveform() {
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const [pulses, setPulses] = useState<{ x: number; t: number; intensity: number }[]>([]);
  const [keyChar, setKeyChar] = useState('—');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      const ch = e.key.length === 1 ? e.key : e.key.slice(0, 3);
      setKeyChar(ch);
      setCount((c) => c + 1);
      setPulses((p) => [
        ...p.slice(-12),
        { x: Math.random() * 320 + 15, t: 0, intensity: 0.7 + Math.random() * 0.5 },
      ]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Decay pulses
  if (pulses.length && tick % 1 === 0) {
    if (pulses.some((p) => p.t > 200)) {
      setTimeout(() => setPulses((arr) => arr.filter((p) => p.t < 200)), 0);
    }
  }

  // increment tick of each pulse
  pulses.forEach((p) => (p.t += 1));

  const wavePath = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * 320 + 15;
    let y = 130;
    pulses.forEach((p) => {
      const d = Math.abs(x - p.x);
      const fall = Math.max(0, 1 - p.t / 80);
      y -= Math.cos((d / 30) * Math.PI) * 30 * fall * Math.exp(-d / 60) * p.intensity;
    });
    y += Math.sin(tick * 0.05 + i * 0.3) * 1.5;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="relative rounded-[24px] p-5 w-full max-w-[460px] border outline-none"
      style={{
        background: PALETTE.bgSoft,
        borderColor: PALETTE.rule,
      }}
    >
      <div
        className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] mb-4"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>● rec</span>
        <span style={{ color: PALETTE.accent }}>session.wav</span>
        <span>keys · {count}</span>
      </div>
      <svg viewBox="0 0 350 240" className="w-full h-[200px]">
        <line x1="15" y1="130" x2="335" y2="130" stroke={PALETTE.accent} strokeOpacity={0.2} strokeDasharray="2 4" />
        <path d={wavePath} stroke={PALETTE.accent} strokeWidth={1.4} fill="none" />
        {pulses.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={130}
            r={Math.max(0, 10 - p.t / 8)}
            fill="none"
            stroke={PALETTE.accent}
            strokeOpacity={Math.max(0, 0.6 - p.t / 200)}
          />
        ))}
        <text
          x="175"
          y="220"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="3"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
          fill={PALETTE.textDim}
        >
          PRESS ANY KEY · LAST: {keyChar}
        </text>
      </svg>
    </div>
  );
}

/* ---------------- I · Cursor-reveal portrait ---------------- */

function RevealPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const cols = 28;
  const rows = 28;
  const cell = 350 / cols;

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 350,
      y: ((e.clientY - rect.top) / rect.height) * 350,
    });
  };

  const charset = ['·', ':', '-', '+', '=', '#', '@'];

  // Procedural "portrait" mask — soft silhouette + face
  const intensity = (cx: number, cy: number) => {
    const fx = cx / 350 - 0.5;
    const fy = cy / 350 - 0.55;
    const oval = 1 - Math.hypot(fx * 1.4, fy);
    const eyes = Math.exp(-30 * (Math.pow(fy + 0.05, 2) + Math.pow(fx - 0.12, 2))) +
                 Math.exp(-30 * (Math.pow(fy + 0.05, 2) + Math.pow(fx + 0.12, 2)));
    const mouth = Math.exp(-50 * (Math.pow(fy - 0.15, 2) + Math.pow(fx, 2) * 0.4));
    return Math.max(0, oval) - eyes * 0.25 - mouth * 0.15;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setMouse(null)}
      className="relative rounded-[28px] w-full max-w-[400px] aspect-square border overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-0 w-full h-full">
        {Array.from({ length: rows }).map((_, ry) =>
          Array.from({ length: cols }).map((_, cx) => {
            const x = cx * cell + cell / 2;
            const y = ry * cell + cell / 2;
            const base = intensity(x, y);
            const reveal = mouse ? Math.max(0, 1 - Math.hypot(mouse.x - x, mouse.y - y) / 90) : 0;
            const v = Math.min(1, Math.max(0, base * (0.3 + reveal * 1.4)));
            const ch = charset[Math.min(charset.length - 1, Math.floor(v * charset.length))];
            return (
              <text
                key={`${cx}-${ry}`}
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="11"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
                fill={PALETTE.accent}
                fillOpacity={0.15 + v * 0.85}
              >
                {ch}
              </text>
            );
          }),
        )}
        {mouse && (
          <circle cx={mouse.x} cy={mouse.y} r={4} fill="none" stroke={PALETTE.accent} strokeOpacity={0.6} />
        )}
      </svg>
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>portrait · ASCII</span>
        <span style={{ color: PALETTE.accent }}>● resolve</span>
        <span>{cols}×{rows}</span>
      </div>
    </div>
  );
}

/* ---------------- J · Parallax card stack ---------------- */

function ParallaxStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setM({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const tiltX = -m.y * 18;
  const tiltY = m.x * 18;

  const layers = [
    { z: 0, opacity: 1, label: '01' },
    { z: 60, opacity: 0.7, label: '02' },
    { z: 120, opacity: 0.45, label: '03' },
  ];

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setM({ x: 0, y: 0 })}
      className="relative rounded-[28px] w-full max-w-[400px] aspect-square border flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
        perspective: 1200,
      }}
    >
      <div
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-[230px] h-[300px]"
      >
        {layers.map((l, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl border p-5 flex flex-col justify-between"
            style={{
              transform: `translateZ(-${l.z}px) translate(${i * 8}px, ${i * -10}px)`,
              opacity: l.opacity,
              background: `linear-gradient(160deg, #1f1810 0%, ${PALETTE.bgSoft} 100%)`,
              borderColor: PALETTE.rule,
              boxShadow: i === 0 ? '0 20px 60px rgba(0,0,0,0.6)' : 'none',
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
            >
              {l.label} / inference
            </div>
            <div>
              <div
                className="leading-none mb-2"
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontSize: '1.8rem',
                  color: PALETTE.text,
                }}
              >
                WorldServe
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
              >
                3.54× · −0.02 dB · 950 frames
              </div>
            </div>
            <div
              style={{
                width: '40%',
                height: 1,
                background: PALETTE.accent,
                opacity: 0.5,
              }}
            />
          </div>
        ))}
        {/* shimmer */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${(m.x + 0.5) * 100}% ${(m.y + 0.5) * 100}%, rgba(212,147,85,0.25) 0%, transparent 40%)`,
            mixBlendMode: 'screen',
          }}
        />
      </div>
      <div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
        style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
      >
        <span>tilt · {tiltY.toFixed(0)}° / {tiltX.toFixed(0)}°</span>
        <span style={{ color: PALETTE.accent }}>● parallax</span>
        <span>3 layers</span>
      </div>
    </div>
  );
}

/* ---------------- D · Typographic monogram ---------------- */

function MonogramWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);
  const r = (tick * 0.4) % 360;

  return (
    <div
      className="relative rounded-[28px] p-7 w-full max-w-[400px] aspect-square border flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at 50% 35%, #1c150c 0%, ${PALETTE.bgSoft} 70%)`,
        borderColor: PALETTE.rule,
      }}
    >
      <svg viewBox="0 0 350 350" className="absolute inset-7" style={{ transform: `rotate(${r}deg)` }}>
        {[150, 132, 114].map((rad, i) => (
          <circle
            key={rad}
            cx={175}
            cy={175}
            r={rad}
            stroke={PALETTE.accentDim}
            strokeOpacity={0.15 - i * 0.03}
            strokeDasharray={i === 0 ? '2 6' : i === 1 ? undefined : '4 8'}
            fill="none"
          />
        ))}
        <text
          x={175}
          y={170}
          textAnchor="middle"
          fontSize="11"
          letterSpacing="3"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
          fill={PALETTE.accent}
          opacity={0.7}
          transform={`rotate(${-r} 175 175)`}
        >
          ANNO 2026
        </text>
      </svg>

      <div className="relative text-center">
        <div
          className="text-[10px] uppercase tracking-[0.32em] mb-3"
          style={{ color: PALETTE.accent, fontFamily: 'var(--font-mono), monospace' }}
        >
          MAISON BN
        </div>
        <div
          className="leading-none"
          style={{
            fontFamily: 'var(--font-display, Georgia), serif',
            fontSize: 'clamp(5rem, 8vw, 8rem)',
            color: PALETTE.text,
            fontStyle: 'italic',
          }}
        >
          B<span style={{ color: PALETTE.accent }}>·</span>N
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.32em] mt-3"
          style={{ color: PALETTE.textDim, fontFamily: 'var(--font-mono), monospace' }}
        >
          AI INFERENCE · CMU
        </div>
      </div>
    </div>
  );
}
