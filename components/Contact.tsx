'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { profile } from '@/lib/data';
import BookAppointment from '@/components/BookAppointment';

const ease = [0.16, 1, 0.3, 1] as const;

const links = [
  { label: 'Email', value: profile.email, href: profile.socials.email },
  { label: 'GitHub', value: '@iambhuvan', href: profile.socials.github },
  { label: 'LinkedIn', value: 'Bhuvan Nallamothu', href: profile.socials.linkedin },
  { label: 'X / Twitter', value: '@NallamothuBhuv2', href: profile.socials.twitter },
];

export default function Contact() {
  const [bookOpen, setBookOpen] = useState(false);
  return (
    <section id="contact" className="section pb-32">
      <BookAppointment open={bookOpen} onClose={() => setBookOpen(false)} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50">
            (06) Get in touch
          </span>
          <h2 className="display text-amber-50 text-[clamp(3rem,11vw,10rem)] mt-4 leading-[0.92]">
            Let&apos;s build the <br />
            <em className="text-ember-gradient">next inference</em> stack.
          </h2>

          <p className="text-amber-100/70 text-lg max-w-2xl mt-10 leading-relaxed">
            Open to research collaborations, internships, and conversations about diffusion
            inference, kernel work, or any system that needs to be made fast. Best way to reach me
            is email — I read everything.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href={profile.socials.email}
              data-hover
              className="inline-flex items-center gap-3 text-2xl md:text-4xl display text-amber-50 hover:text-ember transition-colors"
            >
              <span className="mono text-sm text-ember">→</span>
              {profile.email}
            </a>
            <button
              type="button"
              onClick={() => setBookOpen(true)}
              data-hover
              className="ml-0 md:ml-6 inline-flex items-center gap-2 px-5 py-3 transition-all"
              style={{
                background: '#9ad03d',
                color: '#000',
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                boxShadow: '0 0 22px rgba(154,208,61,0.4)',
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#000' }}
              />
              Book a Meeting →
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-amber-200/10 mt-20 border-y border-amber-200/10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-hover
                target={l.label !== 'Email' ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-ink-900 hover:bg-ink-800 p-8 group transition-colors"
              >
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-amber-300/50 mb-3">
                  {l.label}
                </div>
                <div className="text-amber-100 group-hover:text-ember transition-colors flex items-center justify-between">
                  <span className="truncate">{l.value}</span>
                  <span className="text-ember opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </div>
              </a>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
