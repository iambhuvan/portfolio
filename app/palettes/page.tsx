'use client';

import Link from 'next/link';

type Palette = {
  id: string;
  name: string;
  desc: string;
  reference: string;
  bg: string;
  text: string;
  textDim: string;
  accent: string;
  rule: string;
  cardBg: string;
  cardBorder: string;
};

const palettes: Palette[] = [
  {
    id: 'A',
    name: 'Ivory · Oxblood · Charcoal',
    desc: 'Penguin Classics hardcover. Warm paper background, deep wine accent, ink-black type.',
    reference: 'Penguin Classics · vintage publishing',
    bg: '#f1ead8',
    text: '#1a1614',
    textDim: 'rgba(26,22,20,0.62)',
    accent: '#7a1f24',
    rule: 'rgba(26,22,20,0.18)',
    cardBg: '#ebe2cd',
    cardBorder: 'rgba(26,22,20,0.14)',
  },
  {
    id: 'B',
    name: 'Bone · Forest · Brass',
    desc: 'Old-money library. Deep evergreen base, antique brass accent, ivory type.',
    reference: 'Loro Piana · Yale Beinecke library',
    bg: '#13241c',
    text: '#f4ebd6',
    textDim: 'rgba(244,235,214,0.65)',
    accent: '#c89b3c',
    rule: 'rgba(244,235,214,0.14)',
    cardBg: '#1a2c23',
    cardBorder: 'rgba(244,235,214,0.10)',
  },
  {
    id: 'C',
    name: 'Newsprint · Ink · Sepia',
    desc: 'Broadsheet typographic. Ecru paper, jet ink, single sepia underline. No noise.',
    reference: 'NYT Book Review · 1960s editorial',
    bg: '#f4f1e8',
    text: '#0f0f0e',
    textDim: 'rgba(15,15,14,0.6)',
    accent: '#8b4513',
    rule: 'rgba(15,15,14,0.20)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(15,15,14,0.15)',
  },
  {
    id: 'D',
    name: 'Black · Off-White · Bordeaux',
    desc: 'Couture editorial. Pure off-white text on jet black, single bordeaux for emphasis.',
    reference: 'Vogue · The Row · couture',
    bg: '#0a0a0a',
    text: '#f4f1ec',
    textDim: 'rgba(244,241,236,0.65)',
    accent: '#6b1d2c',
    rule: 'rgba(244,241,236,0.14)',
    cardBg: '#141414',
    cardBorder: 'rgba(244,241,236,0.10)',
  },
  {
    id: 'E',
    name: 'Sand · Charcoal · Camel',
    desc: 'Hermès / Aesop apothecary. Warm sand background, soft charcoal type, camel accent.',
    reference: 'Hermès · Aesop',
    bg: '#e8dfc9',
    text: '#1c1a17',
    textDim: 'rgba(28,26,23,0.6)',
    accent: '#a06a3a',
    rule: 'rgba(28,26,23,0.18)',
    cardBg: '#ddd2b8',
    cardBorder: 'rgba(28,26,23,0.16)',
  },
  {
    id: 'F',
    name: 'Pearl · Midnight · Champagne',
    desc: 'Eveningwear couture. Pearl-cream background, deep midnight type, soft champagne accent.',
    reference: 'Cartier · Tiffany & Co.',
    bg: '#f4eee2',
    text: '#0d1a30',
    textDim: 'rgba(13,26,48,0.6)',
    accent: '#a88752',
    rule: 'rgba(13,26,48,0.16)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(13,26,48,0.14)',
  },
  {
    id: 'G',
    name: 'Indigo Navy · Cream · Burnt Orange',
    desc: 'NYT Magazine editorial. Deep indigo with cream type, restrained burnt-orange accent.',
    reference: 'New York Times Magazine',
    bg: '#1a2342',
    text: '#f3ebd8',
    textDim: 'rgba(243,235,216,0.65)',
    accent: '#cc6b3d',
    rule: 'rgba(243,235,216,0.14)',
    cardBg: '#1f2a4d',
    cardBorder: 'rgba(243,235,216,0.10)',
  },
  {
    id: 'H',
    name: 'Off-White · Black · Mustard',
    desc: 'Bauhaus restraint. Bone background, sharp black grid, single mustard rule.',
    reference: 'Massimo Vignelli · Pentagram',
    bg: '#ece8dd',
    text: '#0a0a0a',
    textDim: 'rgba(10,10,10,0.6)',
    accent: '#b8860b',
    rule: 'rgba(10,10,10,0.4)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(10,10,10,0.4)',
  },
];

export default function PalettePreview() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur border-b border-stone-300 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium tracking-tight">Classic Palettes — pick one letter</h1>
          <p className="text-[11px] text-stone-500 mt-1 font-sans uppercase tracking-[0.18em]">
            Editorial · timeless · restrained
          </p>
        </div>
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.22em] border border-stone-400 px-4 py-2 hover:bg-stone-900 hover:text-stone-50 transition-colors font-sans"
        >
          ← back
        </Link>
      </header>

      <div className="grid lg:grid-cols-2">
        {palettes.map((p) => (
          <Sample key={p.id} p={p} />
        ))}
      </div>

      <footer className="px-8 py-12 border-t border-stone-300 text-sm text-stone-600 font-sans">
        After you pick a letter, I&apos;ll rebuild the full site with editorial typography
        (serif display + grotesque body), Apple-style hero pin, magnetic buttons, cursor spotlight,
        and a ⌘K command palette — all in classic register.
      </footer>
    </div>
  );
}

function Sample({ p }: { p: Palette }) {
  return (
    <div
      className="relative min-h-[100vh] p-10 md:p-14 border-b border-stone-300 lg:border-r"
      style={{ background: p.bg, color: p.text, fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="flex items-baseline justify-between mb-12 pb-4 border-b" style={{ borderColor: p.rule }}>
        <span
          className="text-[11px] uppercase tracking-[0.32em]"
          style={{ color: p.textDim, fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          Option {p.id} · No. {p.id.charCodeAt(0) - 64}
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.28em] italic"
          style={{ color: p.textDim, fontFamily: 'Georgia, serif' }}
        >
          ref. {p.reference}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl mb-3 leading-tight tracking-tight" style={{ color: p.text }}>
        {p.name}
      </h2>
      <p className="text-base mb-12 italic max-w-md leading-relaxed" style={{ color: p.textDim }}>
        {p.desc}
      </p>

      <div className="mb-3">
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: p.textDim, fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          ━━━ Bhuvan Nallamothu · AI Inference Researcher
        </span>
      </div>

      <h3
        className="leading-[0.94] tracking-[-0.03em] mb-10"
        style={{
          fontSize: 'clamp(2.6rem, 6.5vw, 4.6rem)',
          color: p.text,
        }}
      >
        I engineer{' '}
        <em style={{ color: p.accent }}>inference</em>
        <br />
        at the edge of
        <br />
        the model.
      </h3>

      <p
        className="text-base md:text-lg max-w-md leading-relaxed mb-10"
        style={{ color: p.textDim, fontFamily: 'Georgia, serif' }}
      >
        Graduate researcher at Carnegie Mellon — diffusion inference,
        recursive language models, and long-tail synthesis for driving
        vision-language models.
      </p>

      <div className="flex items-center gap-6 mb-14" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <button
          className="text-[11px] uppercase tracking-[0.28em] px-6 py-3 transition-all hover:opacity-90"
          style={{ background: p.accent, color: p.bg }}
        >
          Selected Work →
        </button>
        <button
          className="text-[11px] uppercase tracking-[0.28em] px-6 py-3 border transition-colors"
          style={{ borderColor: p.text, color: p.text }}
        >
          Curriculum Vitae
        </button>
      </div>

      <div className="border-t border-b py-6 grid grid-cols-4 gap-4 mb-12" style={{ borderColor: p.rule }}>
        <Stat label="WorldServe" value="3.54×" p={p} />
        <Stat label="ERLM" value="−64%" p={p} />
        <Stat label="AWS NKI" value="Top 15" p={p} />
        <Stat label="Configs" value="72" p={p} />
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-3">
          <div
            className="text-[10px] uppercase tracking-[0.3em] mb-1"
            style={{ color: p.textDim, fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Vol. I — No. 01
          </div>
          <div
            className="text-[11px] uppercase tracking-[0.25em]"
            style={{ color: p.accent, fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            INFERENCE
          </div>
        </div>
        <div className="col-span-9">
          <h4 className="text-2xl md:text-3xl mb-3 leading-tight">WorldServe.</h4>
          <p className="italic mb-3" style={{ color: p.accent, fontFamily: 'Georgia, serif' }}>
            A 3.54× training-free speedup recipe for autoregressive world model inference.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: p.textDim }}>
            Open-Oasis 500M is an autoregressive Minecraft world model that runs ten DDIM steps per
            frame. WorldServe stacks DPM-Solver++ 2M with an action-magnitude bucket schedule for a
            3.54× speedup at preserved self-coherence on 950 real frames.
          </p>
          <div
            className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: p.textDim, fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            <span>PyTorch</span>·<span>CUDA 12.4</span>·<span>DPM-Solver++</span>·
            <span>TaylorSeer</span>·<span>Modal H100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, p }: { label: string; value: string; p: Palette }) {
  return (
    <div>
      <div className="text-3xl tracking-tight" style={{ color: p.text }}>
        {value}
      </div>
      <div
        className="text-[10px] uppercase tracking-[0.28em] mt-1"
        style={{ color: p.textDim, fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}
