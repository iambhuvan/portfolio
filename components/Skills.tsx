'use client';

import { motion } from 'framer-motion';
import { skills } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Skills() {
  return (
    <section id="stack" className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
          className="border-b border-amber-200/10 pb-8 mb-16"
        >
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
            (04) Stack
          </span>
          <h2 className="display text-amber-50 text-5xl md:text-7xl mt-3">
            Tools of the <em className="text-ember-gradient">trade.</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-amber-200/10">
          {skills.map((g, i) => (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className="bg-ink-900 p-8 group hover:bg-ink-800 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="display text-2xl text-amber-50">{g.group}</h3>
                <span className="mono text-[10px] uppercase tracking-[0.25em] text-amber-300/40">
                  0{i + 1}
                </span>
              </div>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="text-amber-100/70 text-base flex items-center gap-2 group-hover:text-amber-100 transition-colors"
                  >
                    <span className="text-ember/50 mono text-xs">▸</span>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
