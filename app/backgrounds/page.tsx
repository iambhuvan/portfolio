'use client';

import Link from 'next/link';
import WaferDisc from '@/components/backgrounds/WaferDisc';
import ServerRackIso from '@/components/backgrounds/ServerRackIso';
import NVLinkNetwork from '@/components/backgrounds/NVLinkNetwork';
import ThermalFloorPlan from '@/components/backgrounds/ThermalFloorPlan';
import CrossSectionLayers from '@/components/backgrounds/CrossSectionLayers';
import ParticleResolve from '@/components/backgrounds/ParticleResolve';
import HexHive from '@/components/backgrounds/HexHive';
import TokenStream from '@/components/backgrounds/TokenStream';
import VoronoiCells from '@/components/backgrounds/VoronoiCells';
import CrystalLattice from '@/components/backgrounds/CrystalLattice';
import NVLinkHighway from '@/components/backgrounds/NVLinkHighway';
import WaferFab from '@/components/backgrounds/WaferFab';
import InferenceConsole from '@/components/backgrounds/InferenceConsole';

const sections = [
  {
    letter: '★',
    title: 'Inference Engineer\u2019s Chip Console',
    caption: 'Hop on a GPU \u2014 the entire datasheet decodes bit-by-bit. Hot-zones on the die link to FLOPS, HBM, fabric, positioning, and best-for tasks.',
    Comp: InferenceConsole,
  },
  {
    letter: 'A',
    title: 'Wafer Disc',
    caption: 'Real 300mm silicon wafer. Cursor lights up dies; tagged ones reveal chip identity. Slow rotation.',
    Comp: WaferDisc,
  },
  {
    letter: 'B',
    title: 'Server Rack · Isometric',
    caption: 'DGX SuperPOD rack tilted in iso. Cursor illuminates individual GPUs across HGX boards.',
    Comp: ServerRackIso,
  },
  {
    letter: 'C',
    title: 'NVLink Network',
    caption: 'Chips as nodes connected by NVLink with traveling data packets. Cursor magnetically pulls nodes.',
    Comp: NVLinkNetwork,
  },
  {
    letter: 'D',
    title: 'Thermal Floor Plan',
    caption: 'Top-down DC view. Cursor radiates heat — chips heat up; tile utilization animates.',
    Comp: ThermalFloorPlan,
  },
  {
    letter: 'E',
    title: 'Cross-Section Layers',
    caption: 'Side view of chip package. Cursor X selects chip · cursor Y highlights a layer (lid → HBM → interposer → BGA).',
    Comp: CrossSectionLayers,
  },
  {
    letter: 'F',
    title: 'Particle Resolve',
    caption: '1,100 drifting particles. Cursor proximity snaps them into chip die patterns.',
    Comp: ParticleResolve,
  },
  {
    letter: 'G',
    title: 'Hex Hive Compute',
    caption: 'Hexagonal honeycomb of compute cells. Cursor pollinates · click to send a wave ripple outward.',
    Comp: HexHive,
  },
  {
    letter: 'H',
    title: 'Dispatch Stream',
    caption: '9 vertical chip columns with falling token streams (kv.cache, fp8.matmul, NVLink.send). Hover a column to slow it.',
    Comp: TokenStream,
  },
  {
    letter: 'I',
    title: 'Voronoi Compute Floor',
    caption: 'Organic Voronoi tessellation. Each cell flickers with activity; cursor pulls cells away.',
    Comp: VoronoiCells,
  },
  {
    letter: 'J',
    title: 'Silicon Crystal Lattice',
    caption: 'Atomic Si lattice with bonds. Electrons travel toward your cursor; doping aura under the probe.',
    Comp: CrystalLattice,
  },
  {
    letter: 'K',
    title: 'NVLink Highway',
    caption: 'Side view: chip-cities left & right, 5 horizontal lanes (NVLink, NVSwitch, IF, PCIe, CXL) with bidirectional packets.',
    Comp: NVLinkHighway,
  },
  {
    letter: 'L',
    title: 'Wafer Fab Time-lapse',
    caption: 'Cursor X scrubs through 8 fabrication steps: substrate → oxide → litho → etch → implant → metal → CMP → package.',
    Comp: WaferFab,
  },
];

export default function BackgroundsPreview() {
  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <header className="sticky top-0 z-50 backdrop-blur bg-black/85 border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.32em] block mb-1"
            style={{ color: '#76b900', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Interactive Chip Backgrounds · Pick One
          </span>
          <h1 className="text-base" style={{ fontFamily: 'Georgia, serif' }}>
            Scroll through A–L · 12 distinct interactive concepts · NVIDIA green
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/widgets"
            className="text-[11px] uppercase tracking-[0.24em] border border-white/15 px-4 py-2 hover:bg-white hover:text-black transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ← widgets
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.24em] border border-white/15 px-4 py-2 hover:bg-white hover:text-black transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ← home
          </Link>
        </div>
      </header>

      <div>
        {sections.map((s) => (
          <section
            key={s.letter}
            className="relative border-b border-white/10"
            style={{ height: '100vh' }}
          >
            <s.Comp />
            {/* overlay text */}
            <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 max-w-md pointer-events-none z-20">
              <div
                className="rounded-lg p-6 border"
                style={{
                  background: 'rgba(0,0,0,0.62)',
                  borderColor: 'rgba(118,185,0,0.25)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.32em] mb-3"
                  style={{ color: '#76b900', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Option {s.letter} / 0{s.letter.charCodeAt(0) - 64}
                </div>
                <h2
                  className="text-3xl md:text-4xl mb-3 leading-tight"
                  style={{ color: '#eaf6d6', fontFamily: 'Georgia, serif' }}
                >
                  {s.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#b8d896', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                >
                  {s.caption}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="px-8 py-12 border-t border-white/10 text-sm text-zinc-400" style={{ fontFamily: 'Georgia, serif' }}>
        Tell me a letter (A–L). I&apos;ll wire that background into the homepage and tune sections so it reads cleanly behind the hero, projects, and contact.
      </footer>
    </div>
  );
}
