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
    <section id="top" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 pt-32 z-10">
      <div className="max-w-7xl mx-auto w-full hero-halo">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="mono text-xs tracking-[0.32em] uppercase text-amber-200/85 mb-8 flex items-center gap-3 hero-glow"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-ember animate-pulse shadow-[0_0_12px_#76b900]" />
          Mountain View · {time || '—'} PT · Available 2026
        </motion.p>

        <h1 className="display text-amber-50 text-[clamp(3.2rem,11vw,11rem)] hero-glow">
          <Reveal delay={0.8}>I engineer</Reveal>
          <br />
          <Reveal delay={0.95}>
            <span className="italic font-display text-ember-gradient">inference</span>{' '}
            <span className="text-amber-50">at the</span>
          </Reveal>
          <br />
          <Reveal delay={1.1}>edge of the model.</Reveal>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease }}
          className="mt-12 grid md:grid-cols-2 gap-8 items-end"
        >
          <p className="text-amber-50/95 text-lg md:text-xl max-w-lg leading-relaxed hero-glow">
            {profile.shortBio}
          </p>
          <div className="flex flex-col items-start md:items-end gap-3 hero-glow">
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/85">
              Currently
            </span>
            <span className="text-amber-50 text-base">
              CMU · Diffusion + inference systems
            </span>
            <a
              href="#work"
              data-hover
              className="mono text-xs uppercase tracking-[0.25em] text-ember mt-3 link-underline"
            >
              ↓ Scroll to selected work
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.0, ease }}
          className="mt-16 mono text-[10px] uppercase tracking-[0.32em] text-amber-200/70 hero-glow flex items-center gap-3"
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
