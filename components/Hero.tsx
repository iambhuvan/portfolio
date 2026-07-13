'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat('en-US', opts).format(now));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12 pt-28 sm:pt-32 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full hero-halo">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="mono text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.32em] uppercase text-amber-200/85 mb-5 sm:mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 hero-glow"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-ember animate-pulse shadow-[0_0_12px_#76b900] shrink-0" />
          <span>Mountain View</span>
          <span className="text-amber-200/40">·</span>
          <span>{time || '—'} PT</span>
          <span className="text-amber-200/40">·</span>
          <span>Available 2026</span>
        </motion.p>

        <h1
          className="text-amber-50 hero-glow break-words"
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.25rem, 11vw, 9rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            paddingBottom: '0.04em',
          }}
        >
          <Reveal delay={0.8}>Hi,</Reveal>
          <br />
          <Reveal delay={0.95}>
            I am <span className="text-ember-gradient">Bhuvan</span>.
          </Reveal>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease }}
          className="mt-8 sm:mt-12 max-w-xl"
        >
          <p className="text-amber-50/95 text-base sm:text-lg md:text-xl leading-relaxed hero-glow">
            {profile.shortBio}
          </p>
          <a
            href="#work"
            data-hover
            className="inline-block mt-5 sm:mt-6 mono text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-ember link-underline pointer-events-auto hero-glow"
          >
            ↓ Scroll to selected work
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.0, ease }}
          className="mt-8 sm:mt-12 mono text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.32em] text-amber-200/70 hero-glow hidden md:flex items-center gap-3"
        >
          <span className="inline-block w-12 h-px bg-amber-200/40" />
          MOVE CURSOR · REVEAL SILICON
        </motion.p>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="reveal-mask">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
