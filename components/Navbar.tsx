'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BookAppointment from '@/components/BookAppointment';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: -40, duration: 1.5 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-500 ${
        scrolled ? 'py-4 backdrop-blur-md bg-ink-900/40' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => onClickLink(e, '#top')}
          className="text-base md:text-lg tracking-tight text-amber-50 hover:text-ember transition-colors whitespace-nowrap"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 600 }}
        >
          Bhuvan Nallamothu
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => onClickLink(e, link.href)}
                className="mono text-xs uppercase tracking-[0.2em] text-amber-100/70 hover:text-amber-200 link-underline"
              >
                <span className="text-ember/60 mr-2">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setBookOpen(true)}
          data-hover
          className="inline-flex items-center gap-2 px-4 py-2 transition-all"
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
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#000' }}
          />
          Book a Meeting →
        </button>
      </div>
      <BookAppointment open={bookOpen} onClose={() => setBookOpen(false)} />
    </motion.nav>
  );
}
