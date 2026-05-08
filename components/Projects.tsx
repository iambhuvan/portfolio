'use client';

import { motion } from 'framer-motion';
import { projects } from '@/lib/data';
import ProjectCard from './ProjectCard';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Projects() {
  return (
    <section id="work" className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease }}
          className="flex items-end justify-between border-b border-amber-200/10 pb-8 mb-16"
        >
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
              (02) Selected work
            </span>
            <h2 className="display text-amber-50 text-5xl md:text-7xl mt-3">
              Where ideas meet <em className="text-ember-gradient">silicon.</em>
            </h2>
          </div>
          <span className="hidden md:inline mono text-xs text-amber-200/40 uppercase tracking-[0.3em]">
            {projects.length.toString().padStart(2, '0')} projects
          </span>
        </motion.div>

        <div className="space-y-32">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
