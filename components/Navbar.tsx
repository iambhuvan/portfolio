'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 transition-all duration-500 ${
        scrolled || menuOpen ? 'py-3 sm:py-4 backdrop-blur-md bg-ink-900/70' : 'py-4 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <a
          href="https://www.linkedin.com/in/bhuvan-nallamothu-784a061a6/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm sm:text-base md:text-lg tracking-tight text-amber-50 hover:text-ember transition-colors truncate min-w-0"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 600 }}
        >
          <span className="sm:hidden">Bhuvan</span>
          <span className="hidden sm:inline">Bhuvan Nallamothu</span>
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setBookOpen(true)}
            data-hover
            className="hidden sm:inline-flex items-center gap-2 px-3 md:px-4 py-2 transition-all"
            style={{
              background: '#9ad03d',
              color: '#000',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              boxShadow: '0 0 18px rgba(154,208,61,0.35)',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#000' }}
            />
            <span className="hidden lg:inline">Book a Meeting →</span>
            <span className="lg:hidden">Book →</span>
          </button>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-amber-50"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {menuOpen ? (
                <path d="M6 6 L18 18 M6 18 L18 6" />
              ) : (
                <>
                  <path d="M4 7 H20" />
                  <path d="M4 12 H20" />
                  <path d="M4 17 H20" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 border-t border-amber-200/10 mt-3">
              <ul className="flex flex-col gap-1">
                {links.map((link, i) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => onClickLink(e, link.href)}
                      className="flex items-center gap-3 px-1 py-3 mono text-sm uppercase tracking-[0.2em] text-amber-100/80"
                    >
                      <span className="text-ember/70">0{i + 1}</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setBookOpen(true);
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3"
                style={{
                  background: '#9ad03d',
                  color: '#000',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Book a Meeting →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookAppointment open={bookOpen} onClose={() => setBookOpen(false)} />
    </motion.nav>
  );
}
