export const profile = {
  name: 'Bhuvan Nallamothu',
  firstName: 'Bhuvan',
  tagline: 'AI researcher engineering inference for the next generation of models.',
  shortBio:
    'Graduate researcher at Carnegie Mellon working at the intersection of diffusion models, autoregressive video, and the systems that make modern inference fast — from action-driven compute schedules and DPM-Solver++ on world models, to RadixAttention from first principles, to NKI kernels for MoE on Trainium.',
  longBio: [
    'I build the layer where models meet metal. My research lives at the boundary of generative models and inference systems — squeezing latency, memory, and compounding error out of frontier models so they can run at interactive frame rates.',
    'Lately that has meant 3.54× training-free speedups on autoregressive Minecraft world models, recursive language models that beat their own baseline by 4.4 points while spending 64% fewer tokens, and a closed-loop synthesis pipeline that mines, generates, and gates long-tail driving scenes for vision-language drivers.',
    'I work end-to-end: hand-tuned CUDA softmax kernels, KV-cache compression, INT4/FP8 quantization, distributed training, and the empirical discipline of measuring 72 runs across 16 optimization families before claiming a result.',
  ],
  location: 'Mountain View, CA',
  school: 'Carnegie Mellon University',
  email: 'bnallamo@andrew.cmu.edu',
  socials: {
    github: 'https://github.com/iambhuvan',
    linkedin: 'https://www.linkedin.com/in/bhuvan-nallamothu-784a061a6/',
    twitter: 'https://x.com/NallamothuBhuv2',
    email: 'mailto:bnallamo@andrew.cmu.edu',
  },
};

export type Project = {
  id: string;
  name: string;
  pitch: string;
  description: string;
  highlights: string[];
  stack: string[];
  metric?: { value: string; label: string };
  year: string;
  link?: string;
  category: 'Inference' | 'Systems' | 'MLOps' | 'Research';
  accent: string;
};

export const projects: Project[] = [
  {
    id: 'worldserve',
    name: 'WorldServe',
    pitch: 'A 3.54× training-free speedup recipe for autoregressive world model inference.',
    description:
      'Open-Oasis 500M is an autoregressive Minecraft world model that runs ten DDIM steps per frame regardless of player activity, capping interactive generation at 2 fps on H100. WorldServe stacks two orthogonal step-count cuts — DPM-Solver++ 2M (5 base steps) and an action-magnitude bucket schedule that picks 2/3/5 forwards per frame from the 25-dim Minecraft action vector — for a 3.54× speedup at preserved self-coherence (Δvs_prev = −0.02 dB) on 950 real frames.',
    highlights: [
      '72 measured configurations across 16 optimization families',
      'Action-magnitude difficulty schedule — first free per-frame signal for adaptive diffusion compute',
      'Empirical proof: step-count reduction is autoregressive-safe, per-step substitution compounds 5–22 dB at length',
      'TaylorSeer port with per-frame state reset — 2.52× standalone, 0/152K validation failures',
    ],
    stack: ['PyTorch 2.4', 'CUDA 12.4', 'DPM-Solver++ 2M', 'TaylorSeer', 'Modal H100 SXM', 'fp16 autocast'],
    metric: { value: '3.54×', label: '−0.02 dB self-coherence · 950 frames' },
    year: '2026',
    category: 'Inference',
    link: 'https://github.com/iambhuvan/efficient-inference-world-models',
    accent: '#76b900',
  },
  {
    id: 'erlm',
    name: 'ERLM — Enhanced Recursive Language Models',
    pitch: 'Five composable systems optimizations that beat the RLM baseline while spending 64% fewer tokens.',
    description:
      'Recursive Language Models give an LLM a Python REPL to iteratively query long documents — but introduce five systems inefficiencies: linear retrieval, no convergence criterion, sequential sub-queries, KV recomputation, and over-provisioned weights. ERLM fixes all five through composable optimizations layered on the base RLM loop, evaluated on LongBench v2 with Qwen3-8B.',
    highlights: [
      'TF-IDF dynamic retrieval + Jaccard-based adaptive budget control',
      'Async parallel sub-calls + RadixAttention KV prefix caching',
      'FP8/INT8 quantization fitting Qwen3-8B with KV headroom',
      'MiniTorch extension: KV cache + RadixAttention + Flash Attention from scratch (8/8 tests, 72.7% prefix hit)',
      'OpenAI-compatible serving endpoint as drop-in for Ollama/vLLM',
    ],
    stack: ['Qwen3-8B', 'vLLM', 'RadixAttention', 'Flash-Attn', 'PyTorch', 'MiniTorch'],
    metric: { value: '44.4% · −63.7%', label: 'accuracy · token reduction · 63.5% cache hit' },
    year: '2026',
    category: 'Research',
    link: 'https://github.com/iambhuvan/Enhancement-on-RLM',
    accent: '#9ad03d',
  },
  {
    id: 'longtail',
    name: 'Closed-Loop Long-Tail Synthesis',
    pitch: 'A mining → generation → verification pipeline for driving vision-language models.',
    description:
      'Real long-tail driving clips constitute well under 0.1% of any open AV corpus, and that 0.1% is exactly what ships VLM drivers to regulators. Proposes a four-stage closed loop: a 5-axis high-signal scorer (DINOv3 + V-JEPA-2.1 + 5-model BEV ensemble + Westhofen criticality + Cosmos-Reason2 rarity prior), typed SceneLayout extraction, Cosmos-Transfer-2.5-2B + multi-view + LiDARGen synthesis, and a four-gate verifier that re-uses the scoring stack to reject generations that lost their seed property.',
    highlights: [
      '5-axis calibrated mining over WOD-E2E + nuScenes + CODA + nuPlan + comma2k19',
      '5-axis perturbation taxonomy: weather, agent substitution, multiplication, trajectory, layout',
      'Multi-view (8-camera) + matching synthetic LiDAR + UniAD auto-labels',
      'Registered ablation across 5 BEVFusion training recipes — quantifies targeting vs filtering vs generation',
      '~40K verified high-signal clips at full WOD-E2E scale',
    ],
    stack: ['DINOv3', 'V-JEPA-2.1', 'UniAD / VAD / BEVFormer', 'Cosmos-Transfer-2.5-2B', 'BEVFusion'],
    metric: { value: '~40K', label: 'verified clips · 4-gate closed loop' },
    year: '2026',
    category: 'Research',
    accent: '#80c310',
  },
  {
    id: 'nki-moe',
    name: 'NKI-MoE',
    pitch: 'Custom Trainium kernels for a 30B Mixture-of-Experts model.',
    description:
      'Hand-written Neuron Kernel Interface (NKI) kernels for Qwen3-30B-A3B running on AWS Trainium2 and Trainium3. Re-engineered MoE routing, expert computation, and sparse-pattern attention to compete on the AWS Annapurna kernel challenge — scoring on Accuracy × Reduced_Latency × Throughput × Normalized_NKI_FLOPs.',
    highlights: [
      'Top-15 finish — advanced to Trainium3 round 2',
      'Single-file NKI kernel covering routing + expert matmul',
      'Direct work on the Trainium silicon programming model',
      'AWS Neuron SDK 2.28 / NKI 1 + 2',
    ],
    stack: ['AWS Neuron SDK 2.28', 'NKI 1/2', 'Trainium2/3', 'Qwen3-30B-A3B', 'PyTorch'],
    metric: { value: 'Top 15', label: 'AWS Annapurna kernel challenge' },
    year: '2026',
    category: 'Systems',
    accent: '#5d9300',
  },
  {
    id: 'cuda-transformer',
    name: 'CUDA Transformer Acceleration',
    pitch: 'Hand-tuned softmax + LayerNorm kernels for transformer attention.',
    description:
      'Custom CUDA kernels replacing PyTorch ops in the attention block. Two softmax variants — warp-level reduction for short sequences, block-level with CUB BlockLoad/Store for long ones — plus a fused LayerNorm with float4 vectorized loads.',
    highlights: [
      'Causal, padding, and future-mask handling with -inf shifting',
      'Numerically stable max-shift normalization',
      'Single-pass fused LayerNorm: variance + mean + normalize',
      'CUB cooperative groups + shared-memory reductions',
    ],
    stack: ['CUDA C++', 'CUB', 'cooperative_groups', 'PyTorch C++ ext'],
    metric: { value: '~6.5×', label: 'kernel speedup over PyTorch baseline' },
    year: '2026',
    category: 'Systems',
    accent: '#b6e068',
  },
  {
    id: 'distributed',
    name: 'Distributed GPT-2 Training',
    pitch: 'DDP + pipeline parallelism from first principles.',
    description:
      'Implementation of data-parallel and pipeline-parallel training for GPT-2 — including dataset partitioning, gradient AllReduce across ranks, layer-wise model splits, microbatch scheduling, and worker thread queues. Then layered SGLang RadixAttention + DeepSpeed ZeRO + LoRA on Llama-2 7B for 2× V100 fine-tuning.',
    highlights: [
      'Custom _clock_cycles microbatch scheduler with worker threads',
      '1.5×+ throughput scaling on 2 GPUs',
      'Direct torch.distributed primitives, no Lightning',
      'Llama-2 7B LoRA on 2× V100 16GB via DeepSpeed ZeRO',
    ],
    stack: ['PyTorch Distributed', 'NCCL', 'DeepSpeed ZeRO', 'SGLang', 'FlashInfer', 'Llama-2 7B + LoRA'],
    metric: { value: '2× GPU', label: 'pipeline + DDP scaling' },
    year: '2026',
    category: 'Systems',
    accent: '#cfeb96',
  },
  {
    id: 'movielens-mlops',
    name: 'Inception of Odyssey',
    pitch: 'Production movie recommender for 1M users with full MLOps.',
    description:
      'End-to-end recommendation system: hybrid User-User CF + TF-IDF content model, intelligent routing, blue/green deploys, A/B routing via stable MD5 hashing, Kafka ingestion, automated 3-day retraining, and a Prometheus + Grafana telemetry stack. CF achieves 2.22 RMSE; cold-start TF-IDF achieves 5.80 RMSE at 123 req/s.',
    highlights: [
      'Stable hash-bucket A/B router with statistical comparison',
      'Versioned model snapshots with git-commit provenance',
      'Five Prometheus alert rules — drift, latency, availability, accuracy, new-user fraction',
      '70%+ availability target with <50h downtime / 72h window · 200+ tests · 74% coverage',
    ],
    stack: ['Flask', 'scikit-learn', 'Kafka', 'Docker', 'Prometheus', 'Grafana'],
    metric: { value: '1M users', label: '20K movies · 200+ tests · 74% cov' },
    year: '2026',
    category: 'MLOps',
    link: 'https://github.com/cmu-seai/group-project-s26-inception-of-odyssey',
    accent: '#98cf30',
  },
  {
    id: 'retina',
    name: 'Diabetic Retinopathy Explainability',
    pitch: 'Policy-compliant explainability for medical screening AI.',
    description:
      'ResNet-50 classifier across 5 severity levels of diabetic retinopathy, packaged with dual-audience explainability — Grad-CAM heatmaps and confidence reports for nurses, fairness audits and limitations docs for procurement officers under an 8-point responsible-AI policy.',
    highlights: [
      'Cohen\u2019s Kappa 0.913 against expert grading',
      'Grad-CAM spatial attention overlays per severity class',
      'Per-demographic fairness audits (age, gender)',
      '8-point responsible-AI policy compliance mapping',
    ],
    stack: ['TensorFlow', 'Grad-CAM', 'scikit-learn', 'APTOS fundus dataset'],
    metric: { value: '88.5%', label: 'classification accuracy · κ 0.913' },
    year: '2026',
    category: 'Research',
    accent: '#aad95e',
  },
];

export const experience = [
  {
    role: 'M.S. Researcher — Diffusion & Inference Systems',
    org: 'Carnegie Mellon University',
    period: '2025 — Present',
    description:
      'Building inference frameworks for diffusion-based world models and recursive language models. Course path through CMU 11-868 LLM Systems (15-442/642), ML Systems, and ML in Production. Working on autoregressive video acceleration, KV-cache surgery, and long-tail synthesis for driving VLMs.',
  },
  {
    role: 'AWS Annapurna — Trainium Kernel Challenge',
    org: 'AWS Open Competition',
    period: '2026',
    description:
      'Top-15 finish writing custom NKI kernels for a 30B MoE model on Trainium2. Advanced to Trainium3 round 2 with the top teams.',
  },
  {
    role: 'WorldServe — World Model Inference',
    org: 'CMU 15-442 / 15-642 Final',
    period: 'Spring 2026',
    description:
      '3.54× training-free speedup on Open-Oasis 500M. 72 measured configurations across 16 optimization families. First per-frame difficulty signal exploited from the action input pipe of an autoregressive world model.',
  },
  {
    role: 'Enhanced Recursive Language Models',
    org: 'CMU 11-868 LLM Systems',
    period: 'Spring 2026',
    description:
      'Five composable systems optimizations on RLM. 44.4% accuracy on LongBench v2 (vs 40% baseline) with 63.7% token reduction and 63.5% RadixAttention prefix cache hit rate.',
  },
];

export const skills = [
  { group: 'Inference', items: ['DPM-Solver++', 'TaylorSeer caching', 'KV-cache compression', 'INT4 / FP8 quant', 'Speculative decoding', 'Sparse attention'] },
  { group: 'Systems', items: ['CUDA / CUB', 'Triton', 'AWS NKI', 'Flash-Attn', 'NCCL', 'torchao'] },
  { group: 'Distributed', items: ['DDP', 'Pipeline parallel', 'DeepSpeed ZeRO', 'vLLM', 'SGLang / RadixAttention', 'Modal'] },
  { group: 'Research', items: ['Diffusion models', 'World models', 'MoE routing', 'Long-tail mining', 'Cosmos-Transfer', 'Grad-CAM'] },
  { group: 'MLOps', items: ['Kafka', 'Prometheus', 'Grafana', 'Docker', 'A/B testing', 'Blue/green deploys'] },
  { group: 'Languages', items: ['Python', 'C++ / CUDA C', 'PyTorch', 'TensorFlow', 'JAX', 'TypeScript'] },
];
