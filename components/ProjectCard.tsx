'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease }}
      className="grid md:grid-cols-12 gap-8 group"
    >
      <div className={`md:col-span-5 ${flip ? 'md:order-2' : ''}`}>
        <div
          className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-amber-200/10"
          style={{
            background: `radial-gradient(120% 80% at 30% 20%, ${project.accent}26 0%, transparent 60%), linear-gradient(180deg, #15100c 0%, #070403 100%)`,
          }}
        >
          <ProjectVisual project={project} />
          <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.3em] text-amber-200/60">
            {String(index + 1).padStart(2, '0')} / {project.category}
          </div>
          <div className="absolute bottom-4 right-4 mono text-[10px] uppercase tracking-[0.3em] text-amber-200/40">
            {project.year}
          </div>
        </div>
      </div>

      <div className={`md:col-span-7 flex flex-col justify-center ${flip ? 'md:order-1 md:pr-12' : 'md:pl-8'}`}>
        <span className="mono text-[10px] uppercase tracking-[0.3em] text-amber-300/50 mb-4">
          {project.category} · {project.year}
        </span>
        <h3 className="display text-amber-50 text-4xl md:text-6xl mb-3">{project.name}</h3>
        <p className="text-ember-gradient text-xl md:text-2xl italic font-display mb-6">
          {project.pitch}
        </p>
        <p className="text-amber-100/70 leading-relaxed mb-6 max-w-xl">{project.description}</p>

        <ul className="space-y-2 mb-8 max-w-xl">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-amber-100/60 text-sm">
              <span className="mono text-ember mt-1">→</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-6 max-w-xl">
          {project.stack.map((s) => (
            <span
              key={s}
              className="mono text-[10px] uppercase tracking-[0.2em] text-amber-200/70 border border-amber-200/15 px-3 py-1.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {project.metric && (
          <div className="border-l-2 border-ember/60 pl-4">
            <div className="display text-3xl text-amber-50">{project.metric.value}</div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-amber-300/60 mt-1">
              {project.metric.label}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  switch (project.id) {
    case 'worldserve':
      return <WaveformVisual color={project.accent} />;
    case 'nki-moe':
      return <GridVisual color={project.accent} />;
    case 'erlm':
      return <TreeVisual color={project.accent} />;
    case 'longtail':
      return <LongTailVisual color={project.accent} />;
    case 'cuda-transformer':
      return <KernelVisual color={project.accent} />;
    case 'distributed':
      return <NodesVisual color={project.accent} />;
    case 'movielens-mlops':
      return <PipelineVisual color={project.accent} />;
    case 'retina':
      return <RadarVisual color={project.accent} />;
    // ----- newly added projects -----
    case 'triton-3d':
      return <KernelVisual color={project.accent} />;
    case 'agentstack':
      return <NodesVisual color={project.accent} />;
    case 'indian-legal-llm':
      return <RadarVisual color={project.accent} />;
    case 'photon-brain':
      return <TreeVisual color={project.accent} />;
    case 'alexa-at-home':
      return <NodesVisual color={project.accent} />;
    case 'cbir-depth':
      return <KernelVisual color={project.accent} />;
    case 'bert-from-scratch':
      return <TreeVisual color={project.accent} />;
    case 'smartfarm':
      return <RadarVisual color={project.accent} />;
    case 'pneumonia-detect':
      return <RadarVisual color={project.accent} />;
    case 'kanbas-lms':
      return <PipelineVisual color={project.accent} />;
    case 'premier-visual':
      return <GridVisual color={project.accent} />;
    default:
      return <WaveformVisual color={project.accent} />;
  }
}

function WaveformVisual({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="wf" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(40)].map((_, i) => {
        const y = 50 + i * 10;
        const phase = i * 0.3;
        const path = Array.from({ length: 80 }, (_, x) => {
          const px = (x / 79) * 400;
          const py = y + Math.sin(x * 0.15 + phase) * (4 + (i % 5) * 2);
          return `${x === 0 ? 'M' : 'L'}${px},${py}`;
        }).join(' ');
        return <path key={i} d={path} stroke="url(#wf)" strokeWidth="1" fill="none" opacity={0.3 + (i % 3) * 0.2} />;
      })}
    </svg>
  );
}

function GridVisual({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      {[...Array(8)].map((_, r) =>
        [...Array(6)].map((_, c) => {
          const x = 40 + c * 55;
          const y = 60 + r * 50;
          const active = (r * 6 + c) % 5 === 0;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={40}
                height={36}
                rx={4}
                fill={active ? color : 'none'}
                fillOpacity={active ? 0.55 : 0}
                stroke={color}
                strokeOpacity={active ? 0.9 : 0.2}
                strokeWidth={1}
              />
              {active && (
                <text x={x + 20} y={y + 22} textAnchor="middle" fontSize="9" fill="#070403" fontFamily="monospace">
                  E{r * 6 + c}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

function TreeVisual({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      <g stroke={color} strokeOpacity="0.6" strokeWidth="1" fill="none">
        <line x1="200" y1="80" x2="200" y2="160" />
        <line x1="200" y1="160" x2="100" y2="240" />
        <line x1="200" y1="160" x2="300" y2="240" />
        <line x1="100" y1="240" x2="60" y2="320" />
        <line x1="100" y1="240" x2="140" y2="320" />
        <line x1="300" y1="240" x2="260" y2="320" />
        <line x1="300" y1="240" x2="340" y2="320" />
        <line x1="60" y1="320" x2="40" y2="400" />
        <line x1="60" y1="320" x2="80" y2="400" />
        <line x1="140" y1="320" x2="120" y2="400" />
        <line x1="140" y1="320" x2="160" y2="400" />
        <line x1="260" y1="320" x2="240" y2="400" />
        <line x1="260" y1="320" x2="280" y2="400" />
      </g>
      {[
        [200, 80],
        [200, 160],
        [100, 240],
        [300, 240],
        [60, 320],
        [140, 320],
        [260, 320],
        [340, 320],
        [40, 400],
        [80, 400],
        [120, 400],
        [160, 400],
        [240, 400],
        [280, 400],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 7 : 4} fill={color} fillOpacity={0.85} />
      ))}
    </svg>
  );
}

function KernelVisual({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      {[...Array(12)].map((_, r) =>
        [...Array(12)].map((_, c) => {
          const v = ((r * 7 + c * 13) % 17) / 17;
          return (
            <rect
              key={`${r}-${c}`}
              x={40 + c * 26}
              y={70 + r * 26}
              width={22}
              height={22}
              fill={color}
              fillOpacity={v * 0.9}
            />
          );
        })
      )}
      <text x="50" y="450" fontFamily="monospace" fontSize="11" fill={color} fillOpacity="0.7">
        softmax · LayerNorm · float4
      </text>
    </svg>
  );
}

function NodesVisual({ color }: { color: string }) {
  const nodes = [
    [80, 120],
    [200, 80],
    [320, 120],
    [80, 250],
    [200, 250],
    [320, 250],
    [80, 380],
    [200, 420],
    [320, 380],
  ];
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      <g stroke={color} strokeOpacity="0.25" strokeWidth="1">
        {nodes.flatMap((a, i) =>
          nodes.slice(i + 1).map((b, j) => (
            <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))
        )}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={14} fill={color} fillOpacity="0.2" />
          <circle cx={x} cy={y} r={6} fill={color} />
          <text x={x} y={y + 30} fontFamily="monospace" fontSize="9" fill={color} fillOpacity="0.6" textAnchor="middle">
            GPU{i}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PipelineVisual({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      <g stroke={color} strokeOpacity="0.6" strokeWidth="1.2" fill="none">
        {['Kafka', 'Train', 'Snapshot', 'A/B Route', 'Serve'].map((label, i) => {
          const y = 80 + i * 75;
          return (
            <g key={i}>
              <rect x="60" y={y} width="280" height="48" rx="6" />
              <text x="80" y={y + 30} fontFamily="monospace" fontSize="13" fill={color} fillOpacity="0.85">
                {label}
              </text>
              {i < 4 && <line x1="200" y1={y + 48} x2="200" y2={y + 75} markerEnd="url(#arr)" />}
            </g>
          );
        })}
      </g>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
    </svg>
  );
}

function LongTailVisual({ color }: { color: string }) {
  // power-law histogram with a callout on the rare tail
  const bars = Array.from({ length: 36 }, (_, i) => {
    const v = Math.pow(0.85, i);
    return v;
  });
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      <text x="40" y="60" fontFamily="monospace" fontSize="10" fill={color} fillOpacity="0.7">
        scene frequency · log scale
      </text>
      {bars.map((v, i) => {
        const h = v * 240;
        const x = 40 + i * 9;
        const tail = i > 26;
        return (
          <rect
            key={i}
            x={x}
            y={320 - h}
            width={6}
            height={h}
            fill={color}
            fillOpacity={tail ? 0.95 : 0.35}
          />
        );
      })}
      <line x1="40" y1="320" x2="380" y2="320" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="280" y1="320" x2="280" y2="360" stroke={color} strokeOpacity="0.6" strokeDasharray="3 3" />
      <text x="300" y="380" fontFamily="monospace" fontSize="11" fill={color} fillOpacity="0.85">
        long tail · &lt; 0.1%
      </text>
      <text x="40" y="440" fontFamily="monospace" fontSize="11" fill={color} fillOpacity="0.55">
        Mine → Generate → Verify → Train
      </text>
      <text x="40" y="460" fontFamily="monospace" fontSize="9" fill={color} fillOpacity="0.4">
        DINOv3 · V-JEPA-2.1 · Cosmos-Transfer-2.5-2B
      </text>
    </svg>
  );
}

function RadarVisual({ color }: { color: string }) {
  const cx = 200,
    cy = 250;
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full">
      {[40, 80, 120, 160].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke={color} strokeOpacity="0.18" fill="none" />
      ))}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(angle) * 160}
            y2={cy + Math.sin(angle) * 160}
            stroke={color}
            strokeOpacity="0.15"
          />
        );
      })}
      <polygon
        points={[1, 0.7, 0.85, 0.6, 0.92, 0.5, 0.88, 0.8, 0.95, 0.9, 0.7, 0.6]
          .map((v, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * 140 * v},${cy + Math.sin(a) * 140 * v}`;
          })
          .join(' ')}
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  );
}
