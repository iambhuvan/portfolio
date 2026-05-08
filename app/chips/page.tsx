'use client';

import Link from 'next/link';
import ChipPreview, { themes } from '@/components/ChipPreview';

export default function ChipPalettesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="sticky top-0 z-50 backdrop-blur bg-zinc-950/85 border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.32em] block mb-1"
            style={{ color: '#e8a85a', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Chip Background · Palette Variants
          </span>
          <h1 className="text-base">Pick one — A through H</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/widgets"
            className="text-[11px] uppercase tracking-[0.24em] border border-white/15 px-4 py-2 hover:bg-white hover:text-zinc-950 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ← widgets
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.24em] border border-white/15 px-4 py-2 hover:bg-white hover:text-zinc-950 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ← home
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-2">
        {themes.map((t, i) => (
          <Card key={t.id} theme={t} highlightIdx={i % 7} />
        ))}
      </div>

      <footer className="px-8 py-12 border-t border-white/10 text-sm text-zinc-400">
        Tell me a letter — I&apos;ll repaint the entire site (chip background, hero, sections,
        marquee, project cards) in that palette and tune typography contrast accordingly.
      </footer>
    </div>
  );
}

const HIGHLIGHTS = ['b200', 'h100', 'gb200', 'a100', 'tr2', 'mi300', 'tpu'];

function Card({ theme, highlightIdx }: { theme: typeof themes[number]; highlightIdx: number }) {
  return (
    <div
      className="relative border-b lg:border-r border-white/10 p-6 md:p-8 min-h-[80vh] flex flex-col"
      style={{ background: '#0a0a0c' }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <span
          className="text-[10px] uppercase tracking-[0.32em]"
          style={{ color: theme.accent, fontFamily: 'JetBrains Mono, monospace' }}
        >
          Option {theme.id}
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.28em] text-zinc-500"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {theme.chipStyle === 'wireframe' ? 'Blueprint mode' : 'Detailed die'}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl mb-1" style={{ color: '#fafafa' }}>
        {theme.name}
      </h2>
      <p className="text-sm text-zinc-400 mb-6 max-w-md italic">{theme.desc}</p>

      <div className="flex-1 relative min-h-[420px]">
        <ChipPreview theme={theme} highlightId={HIGHLIGHTS[highlightIdx % HIGHLIGHTS.length]} />

        {/* hero overlay sample */}
        <div className="absolute top-6 left-6 max-w-[55%]">
          <span
            className="text-[10px] uppercase tracking-[0.3em] mb-2 inline-flex items-center gap-2"
            style={{ color: theme.accent, fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.accent }}
            />
            BHUVAN NALLAMOTHU · CMU
          </span>
          <h3
            className="leading-[0.92] tracking-[-0.02em] mt-3"
            style={{
              color: theme.text,
              fontFamily: 'var(--font-display, Georgia), serif',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              textShadow: '0 1px 30px rgba(0,0,0,0.85), 0 1px 6px rgba(0,0,0,0.9)',
            }}
          >
            I engineer{' '}
            <em style={{ color: theme.accent, fontStyle: 'italic' }}>inference</em>
            <br />
            at the edge of
            <br />
            the model.
          </h3>
        </div>

        {/* swatches */}
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          {[theme.bg, theme.chipBg, theme.tile, theme.accent, theme.hbmStroke, theme.italicAccent].map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border border-white/20"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.22em]" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#888' }}>
        <Spec label="Vibe" value={theme.id === 'A' ? 'warm-dark' : theme.id === 'B' ? 'brand-NVIDIA' : theme.id === 'C' ? 'cool-clinical' : theme.id === 'D' ? 'thermal-hot' : theme.id === 'E' ? 'terminal-retro' : theme.id === 'F' ? 'blueprint' : theme.id === 'G' ? 'iridescent' : 'premium-metal'} />
        <Spec label="Mood" value={theme.id === 'A' ? 'editorial' : theme.id === 'B' ? 'bold' : theme.id === 'C' ? 'precise' : theme.id === 'D' ? 'electric' : theme.id === 'E' ? 'hacker' : theme.id === 'F' ? 'engineering' : theme.id === 'G' ? 'shifting' : 'restrained'} />
        <Spec label="Render" value={theme.chipStyle} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-zinc-500">{label}</div>
      <div className="text-zinc-300 mt-1">{value}</div>
    </div>
  );
}
