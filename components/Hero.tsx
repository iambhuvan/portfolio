'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

const PHRASES = [
  'नमस्ते, मैं भुवन हूँ।',
  'வணக்கம், நான் புவன்.',
  'హాయ్, నేను భువన్.',
  'হাই, আমি ভুবন।',
  'नमस्कार, मी भुवन आहे.',
  'નમસ્તે, હું ભુવન છું.',
  'ಹಾಯ್, ನಾನು ಭುವನ್.',
  'ഹായ്, ഞാൻ ഭുവൻ.',
  'ਹੈਲੋ, ਮੈਂ ਭੁਵਨ ਹਾਂ।',
  'Hi, I am Bhuvan.',
];

const FINAL_INDEX = PHRASES.length - 1;
const DECODE_CHARS = '01ABCDEF$%&*+=/<>?#@';

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
    <section id="top" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 pt-32 z-10 pointer-events-none">
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

        <h1
          className="text-amber-50 hero-glow"
          style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 9vw, 9rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            paddingBottom: '0.04em',
            minHeight: '1.1em',
          }}
        >
          <HeroGreeting />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease }}
          className="mt-12 max-w-xl"
        >
          <p className="text-amber-50/95 text-lg md:text-xl leading-relaxed hero-glow">
            {profile.shortBio}
          </p>
          <a
            href="#work"
            data-hover
            className="inline-block mt-6 mono text-xs uppercase tracking-[0.25em] text-ember link-underline pointer-events-auto hero-glow"
          >
            ↓ Scroll to selected work
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.0, ease }}
          className="mt-12 mono text-[10px] uppercase tracking-[0.32em] text-amber-200/70 hero-glow flex items-center gap-3"
        >
          <span className="inline-block w-12 h-px bg-amber-200/40" />
          MOVE CURSOR · REVEAL SILICON
        </motion.p>
      </div>
    </section>
  );
}

function HeroGreeting() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, []);

  const isFinal = phraseIndex === FINAL_INDEX;
  const target = PHRASES[phraseIndex];
  const decodeMs = isFinal ? 900 : 380;
  const dwellMs = isFinal ? 0 : 220;
  const { text, settled } = useBitDecode(started ? target : '', decodeMs);

  useEffect(() => {
    if (!started || isFinal || !settled) return;
    const t = setTimeout(() => setPhraseIndex((i) => i + 1), dwellMs);
    return () => clearTimeout(t);
  }, [started, settled, isFinal, dwellMs]);

  if (isFinal && settled) {
    return (
      <motion.span
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Hi, I am <span className="text-ember-gradient">Bhuvan</span>.
      </motion.span>
    );
  }

  return <span style={{ whiteSpace: 'pre-wrap' }}>{text || '\u00A0'}</span>;
}

function useBitDecode(target: string, duration = 380) {
  const [text, setText] = useState('');
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!target) {
      setText('');
      setSettled(false);
      return;
    }
    const chars = Array.from(target);
    const start = Date.now();
    let frame: number;
    setSettled(false);

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const reveal = Math.floor(t * chars.length);
      let s = chars.slice(0, reveal).join('');
      for (let i = reveal; i < chars.length; i++) {
        s += DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
      }
      setText(s);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setText(target);
        setSettled(true);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return { text, settled };
}
