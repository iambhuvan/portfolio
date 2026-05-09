'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/lib/data';

// Formsubmit AJAX endpoint — routes form to bnallamo@andrew.cmu.edu.
// First submission triggers a confirmation email to that address; click the
// "Confirm" link in that email and all future submissions deliver immediately.
const ENDPOINT = 'https://formsubmit.co/ajax/bnallamo@andrew.cmu.edu';

type Status = 'idle' | 'sending' | 'success' | 'error';

const ease = [0.16, 1, 0.3, 1] as const;

export default function BookAppointment({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    reason: '',
    date: '',
    time: '',
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.reason || !form.date || !form.time) {
      setErrorMsg('Please fill in every field.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[Portfolio] Booking · ${form.name} · ${form.date} ${form.time}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: form.email,
          _honey: '', // anti-spam honeypot, must stay empty
          name: form.name,
          email: form.email,
          reason: form.reason,
          requested_date: form.date,
          requested_time: form.time,
          timezone: form.timezone,
          source: 'iambhuvan.github.io/portfolio',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === 'true' || data.success === true)) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Submission failed. Please try again or email me directly.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please email me directly at ' + profile.email);
    }
  };

  const reset = () => {
    setForm({
      name: '',
      email: '',
      reason: '',
      date: '',
      time: '',
      timezone: form.timezone,
    });
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: 'rgba(0, 0, 0, 0.82)' }}
            onClick={() => {
              if (status !== 'sending') onClose();
            }}
          />

          {/* modal */}
          <motion.div
            className="relative w-full max-w-lg my-auto"
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div
              className="border relative"
              style={{
                background: 'rgba(6, 12, 4, 0.96)',
                borderColor: 'rgba(118, 185, 0, 0.32)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 1px rgba(154, 208, 61, 0.2)',
              }}
            >
              {/* header */}
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: 'rgba(118,185,0,0.18)' }}
              >
                <div>
                  <div
                    className="text-[10px] uppercase tracking-[0.32em] flex items-center gap-2"
                    style={{ color: '#9ad03d', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: '#9ad03d', boxShadow: '0 0 6px #9ad03d' }}
                    />
                    BOOK A MEETING
                  </div>
                  <div
                    className="mt-1.5 text-amber-50 leading-tight"
                    style={{
                      fontFamily: 'var(--font-display), serif',
                      fontStyle: 'italic',
                      fontSize: '1.6rem',
                    }}
                  >
                    Pick a time. <span style={{ color: '#9ad03d' }}>I&apos;ll confirm.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (status !== 'sending') onClose();
                  }}
                  className="text-amber-100/60 hover:text-ember transition-colors"
                  aria-label="Close"
                  disabled={status === 'sending'}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6 L18 18 M6 18 L18 6" />
                  </svg>
                </button>
              </div>

              {/* body */}
              <div className="px-6 py-6">
                {status === 'success' ? (
                  <SuccessView name={form.name} onClose={onClose} onAnother={reset} />
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <Field label="Your name" required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Jane Doe"
                        required
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="Email" required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="jane@example.com"
                        required
                        autoComplete="email"
                      />
                    </Field>

                    <Field label="Reason" required>
                      <textarea
                        value={form.reason}
                        onChange={update('reason')}
                        placeholder="What would you like to discuss?"
                        rows={3}
                        required
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Date" required>
                        <input
                          type="date"
                          value={form.date}
                          onChange={update('date')}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Field>
                      <Field label="Time" required>
                        <input type="time" value={form.time} onChange={update('time')} required />
                      </Field>
                    </div>

                    <div
                      className="text-[10px] uppercase tracking-[0.16em] flex items-center justify-between"
                      style={{ color: 'rgba(255, 245, 224, 0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      <span>Timezone</span>
                      <span style={{ color: 'rgba(255, 245, 224, 0.85)' }}>{form.timezone}</span>
                    </div>

                    {status === 'error' && errorMsg && (
                      <div
                        className="text-[11px] px-3 py-2 border"
                        style={{
                          color: '#fbb',
                          borderColor: 'rgba(248, 113, 113, 0.4)',
                          background: 'rgba(248, 113, 113, 0.08)',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 gap-3">
                      <span
                        className="text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: 'rgba(255, 245, 224, 0.45)', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        I usually reply within 24h
                      </span>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="px-5 py-2.5 transition-all text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
                        style={{
                          background: '#9ad03d',
                          color: '#000',
                          fontFamily: 'var(--font-inter), sans-serif',
                          fontWeight: 600,
                          boxShadow: status === 'sending' ? 'none' : '0 0 18px rgba(154,208,61,0.35)',
                        }}
                      >
                        {status === 'sending' ? 'Sending…' : 'Request booking →'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* footer signature */}
              <div
                className="px-6 py-3 border-t flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"
                style={{
                  borderColor: 'rgba(118,185,0,0.12)',
                  color: 'rgba(255, 245, 224, 0.4)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                <span>BHUVAN NALLAMOTHU · CMU</span>
                <span>SECURED · FORMSUBMIT</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="text-[10px] uppercase tracking-[0.18em] block mb-1.5"
        style={{ color: 'rgba(255, 245, 224, 0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label} {required && <span style={{ color: '#9ad03d' }}>*</span>}
      </span>
      <span
        className="block"
        style={{
          // Style the inner input/textarea via descendant selectors below
        }}
      >
        {children}
      </span>
      <style jsx>{`
        label :global(input),
        label :global(textarea) {
          width: 100%;
          background: rgba(154, 208, 61, 0.04);
          border: 1px solid rgba(118, 185, 0, 0.22);
          color: #fff5e0;
          padding: 0.6rem 0.75rem;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        label :global(input::placeholder),
        label :global(textarea::placeholder) {
          color: rgba(255, 245, 224, 0.32);
        }
        label :global(input:focus),
        label :global(textarea:focus) {
          border-color: rgba(154, 208, 61, 0.7);
          background: rgba(154, 208, 61, 0.08);
        }
        label :global(input[type='date']),
        label :global(input[type='time']) {
          color-scheme: dark;
        }
      `}</style>
    </label>
  );
}

function SuccessView({ name, onClose, onAnother }: { name: string; onClose: () => void; onAnother: () => void }) {
  return (
    <div className="py-4 text-center">
      <div
        className="mx-auto mb-4 w-12 h-12 flex items-center justify-center"
        style={{
          background: 'rgba(154, 208, 61, 0.15)',
          border: '1px solid rgba(154, 208, 61, 0.55)',
          borderRadius: '50%',
          boxShadow: '0 0 24px rgba(154,208,61,0.4)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ad03d" strokeWidth="2">
          <path d="M5 12 l5 5 L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3
        className="leading-tight mb-2"
        style={{
          fontFamily: 'var(--font-display), serif',
          fontStyle: 'italic',
          fontSize: '1.6rem',
          color: '#fff5e0',
        }}
      >
        Got it, {name.split(' ')[0]}.
      </h3>
      <p
        className="text-[12px] leading-relaxed mb-6 max-w-sm mx-auto"
        style={{ color: 'rgba(255, 245, 224, 0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Your request landed in my inbox. I&apos;ll confirm or propose another time within 24 hours.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onAnother}
          className="px-4 py-2 border transition-colors text-[11px] uppercase tracking-[0.18em]"
          style={{
            borderColor: 'rgba(118, 185, 0, 0.35)',
            color: '#9ab27a',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          Book another
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 transition-colors text-[11px] uppercase tracking-[0.18em]"
          style={{
            background: '#9ad03d',
            color: '#000',
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 600,
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
