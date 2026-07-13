'use client';

import { motion } from 'framer-motion';
import { profile } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function About() {
  return (
    <section id="about" className="section">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
          className="md:col-span-4"
        >
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
            (01) About
          </span>
          <h2 className="display text-amber-50 text-[clamp(1.85rem,7vw,3.75rem)] md:text-6xl mt-3 sm:mt-4 leading-[1.1]">
            A researcher at the boundary of <em className="text-ember-gradient">model and metal.</em>
          </h2>
        </motion.div>

        <div className="md:col-span-7 md:col-start-6 space-y-5 sm:space-y-6">
          {profile.longBio.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.15 * i, ease }}
              className="text-amber-100/75 text-base sm:text-lg md:text-xl leading-relaxed"
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 gap-5 sm:gap-6 pt-8 sm:pt-10 border-t border-amber-200/10 mt-8 sm:mt-10"
          >
            <Stat label="WorldServe" value="3.54×" suffix="950-frame speedup" />
            <Stat label="ERLM token reduction" value="64%" suffix="LongBench v2" />
            <Stat label="AWS NKI Challenge" value="Top 15" suffix="Trainium3" />
            <Stat label="Configs measured" value="72" suffix="16 families" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="min-w-0">
      <div className="display text-3xl sm:text-4xl md:text-5xl text-amber-100 leading-none">{value}</div>
      <div className="mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.25em] text-amber-300/50 mt-2 leading-snug break-words">
        {label}
        <span className="text-amber-300/35"> · {suffix}</span>
      </div>
    </div>
  );
}
