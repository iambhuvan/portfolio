'use client';

import { motion } from 'framer-motion';
import { experience } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
          className="border-b border-amber-200/10 pb-8 mb-16"
        >
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
            (03) Trajectory
          </span>
          <h2 className="display text-amber-50 text-5xl md:text-7xl mt-3">
            A research <em className="text-ember-gradient">trajectory.</em>
          </h2>
        </motion.div>

        <ol className="relative space-y-12 md:space-y-16 border-l border-amber-200/10 pl-8 md:pl-16">
          {experience.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease }}
              className="relative"
            >
              <span className="absolute -left-[42px] md:-left-[74px] top-1 w-3 h-3 rounded-full bg-ember shadow-[0_0_20px_rgba(255,122,24,0.7)]" />
              <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
                {e.period}
              </span>
              <h3 className="display text-3xl md:text-4xl text-amber-50 mt-2">{e.role}</h3>
              <p className="text-amber-200/70 mono text-sm mt-2 uppercase tracking-[0.15em]">
                {e.org}
              </p>
              <p className="text-amber-100/65 mt-4 max-w-2xl leading-relaxed">{e.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
