'use client';

const tags = [
  'CUDA',
  'Triton',
  'FlashAttention',
  'Diffusion',
  'KV-Cache',
  'INT4',
  'Trainium NKI',
  'MoE',
  'Speculative Decoding',
  'Modal',
  'vLLM',
  'SGLang',
  'PyTorch',
];

export default function Marquee() {
  const repeated = [...tags, ...tags];
  return (
    <div className="relative z-10 border-y border-amber-200/10 py-4 sm:py-6 overflow-hidden" style={{ background: 'rgba(8,5,3,0.92)', backdropFilter: 'blur(10px)' }}>
      <div className="marquee-track whitespace-nowrap">
        {repeated.map((t, i) => (
          <span
            key={i}
            className="mono text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-100/40 inline-flex items-center gap-8 sm:gap-12"
          >
            <span className="text-ember/60">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
