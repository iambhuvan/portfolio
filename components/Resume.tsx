'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const PDF_URL = `${BASE}/resume.pdf`;
const LAST_UPDATED = 'June 2026';

export default function Resume() {
  return (
    <section id="resume" className="section pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease }}
        >
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
                (04) Resume
              </span>
              <h2 className="display text-amber-50 text-[clamp(2.5rem,7vw,6rem)] mt-4 leading-[0.95]">
                The <em className="text-ember-gradient">full record</em>.
              </h2>
              <p className="mono text-[10px] uppercase tracking-[0.28em] text-amber-200/55 mt-5 flex items-center gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                Last updated · {LAST_UPDATED}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noreferrer"
                data-hover
                className="inline-flex items-center gap-2 px-4 py-2.5 transition-all"
                style={{
                  background: '#9ad03d',
                  color: '#000',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 18px rgba(154,208,61,0.35)',
                }}
              >
                Open PDF ↗
              </a>
              <a
                href={PDF_URL}
                download="Bhuvan-Nallamothu-Resume.pdf"
                data-hover
                className="inline-flex items-center gap-2 px-4 py-2.5 border transition-all mono text-[11px] uppercase tracking-[0.22em] text-amber-100/80 hover:text-amber-50"
                style={{ borderColor: 'rgba(255,245,224,0.25)' }}
              >
                ↓ Download
              </a>
            </div>
          </div>

          <div
            className="relative border overflow-hidden"
            style={{
              borderColor: 'rgba(118,185,0,0.22)',
              background: 'rgba(6,12,4,0.5)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 1px rgba(154,208,61,0.18)',
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3 border-b mono text-[10px] uppercase tracking-[0.24em]"
              style={{
                borderColor: 'rgba(118,185,0,0.18)',
                color: 'rgba(255,245,224,0.55)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#9ad03d' }} />
                resume.pdf
              </div>
              <span style={{ color: 'rgba(255,245,224,0.4)' }}>1 page · 80 KB · v.{LAST_UPDATED.replace(' ', '-')}</span>
            </div>

            <object
              data={`${PDF_URL}#view=FitH&toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full"
              style={{ height: 'min(1100px, 130vh)', display: 'block' }}
              aria-label="Bhuvan Nallamothu resume PDF"
            >
              <div className="p-10 text-center">
                <p className="text-amber-100/80 mb-4">
                  Your browser can&apos;t display the embedded PDF.
                </p>
                <a
                  href={PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mono text-xs uppercase tracking-[0.22em] text-ember link-underline"
                >
                  Open the resume in a new tab ↗
                </a>
              </div>
            </object>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
