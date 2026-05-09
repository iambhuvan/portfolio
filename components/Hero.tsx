'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

const TARGET = 'Hi, I am Bhuvan.';

// Standalone-renderable letters from 8 Indian scripts.
const SCRIPT_CHARS = Array.from(
  'अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह' + // Devanagari
    'அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழஷஸஹ' + // Tamil
    'అఆఇఈఉఊఎఏఐఒఓఔకఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహ' + // Telugu
    'অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ' + // Bengali
    'અઆઇઈઉઊએઐઓઔકખગઘચછજઝઞટઠડઢણતથદધનપફબભમયરલવશષસહ' + // Gujarati
    'ಅಆಇಈಉಊಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹ' + // Kannada
    'അആഇഈഉഊഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹ' + // Malayalam
    'ਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹ', // Gurmukhi
);

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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(t);
  }, []);

  const { chars, done } = useScriptScramble(started ? TARGET : '', 2400);

  if (done) {
    return (
      <motion.span
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Hi, I am <span className="text-ember-gradient">Bhuvan</span>.
      </motion.span>
    );
  }

  return (
    <span aria-label={TARGET}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden style={{ display: 'inline-block', minWidth: c === ' ' ? '0.4em' : undefined }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

// Each character of `target` independently morphs through random Indian-script
// glyphs and then resolves to its English target at a staggered time within `duration`.
function useScriptScramble(target: string, duration = 2400) {
  const [chars, setChars] = useState<string[]>(() =>
    target ? Array.from(target).map(() => '\u00A0') : [],
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!target) {
      setChars([]);
      setDone(false);
      return;
    }
    const targetChars = Array.from(target);
    const n = targetChars.length;

    // Each letter resolves at a slightly different time. Earlier letters land
    // first to give a "left-to-right settling" feel, but with jitter so it's
    // not a perfect sweep.
    const resolveAt = targetChars.map((c, i) => {
      if (c === ' ' || c === ',' || c === '.') return 0; // punctuation locks immediately
      const base = duration * (0.35 + 0.55 * (i / Math.max(1, n - 1)));
      const jitter = (Math.random() - 0.5) * duration * 0.18;
      return base + jitter;
    });

    const start = Date.now();
    let frame: number;
    setDone(false);

    const tick = () => {
      const elapsed = Date.now() - start;
      let allResolved = true;
      const next = targetChars.map((c, i) => {
        if (elapsed >= resolveAt[i]) return c;
        allResolved = false;
        return SCRIPT_CHARS[Math.floor(Math.random() * SCRIPT_CHARS.length)];
      });
      setChars(next);
      if (allResolved) {
        setDone(true);
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return { chars, done };
}
