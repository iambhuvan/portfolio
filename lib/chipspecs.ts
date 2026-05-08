export type ChipSpec = {
  id: string;
  vendor: string;
  name: string;
  codename: string;
  arch: string;
  release: string;
  process: { node: string; fab: string; transistors_b: number };
  die: { layout: 'monolithic' | 'dual-die' | 'chiplet' | 'wafer-scale'; bridge?: string; xcds?: number; ncores?: number };
  memory: { type: string; capacity_gb: number; bw_tbs: number; stacks: number };
  compute: {
    sms?: number;
    tensor_cores?: number;
    fp4?: number; // PFLOPS sparse
    fp8?: number;
    bf16?: number;
    fp16?: number;
    tf32?: number;
    fp32?: number;
    fp64?: number;
    int8?: number; // POPS / TOPS
  };
  interconnect: {
    fabric: string;
    bw_tbs: number;
    pcie?: string;
    links?: number;
  };
  power_w: number;
  features: string[];
  positioning: string;
  best_for: string[];
  why_it_matters: string;
};

export const CHIP_SPECS: ChipSpec[] = [
  {
    id: 'b200',
    vendor: 'NVIDIA',
    name: 'B200',
    codename: 'Blackwell',
    arch: 'Blackwell · 2nd-gen Transformer Engine',
    release: '2024-Q1',
    process: { node: 'TSMC 4NP', fab: 'TSMC Hsinchu', transistors_b: 208 },
    die: { layout: 'dual-die', bridge: 'NV-HBI · 10 TB/s die-to-die' },
    memory: { type: 'HBM3e', capacity_gb: 192, bw_tbs: 8.0, stacks: 8 },
    compute: {
      sms: 160,
      tensor_cores: 640,
      fp4: 20,
      fp8: 10,
      bf16: 5.0,
      fp16: 5.0,
      tf32: 2.5,
      fp32: 0.08,
      fp64: 0.04,
      int8: 10,
    },
    interconnect: { fabric: 'NVLink 5', bw_tbs: 1.8, pcie: 'Gen 5 ×16', links: 18 },
    power_w: 1000,
    features: ['Native FP4', '2nd-gen Transformer Engine', 'Confidential Compute', 'Decompression Engine', 'RAS engine'],
    positioning:
      'First-class FP4 inference at 20 PFLOPS sparse. Two reticle-limit dies stitched by NV-HBI present as a single GPU — the largest piece of silicon NVIDIA can ship.',
    best_for: [
      'Trillion-parameter LLM inference',
      'Mixture-of-Experts serving (100s of experts)',
      'FP4 fine-tuning + post-training quantization',
      'Long-context attention (>128K tokens)',
    ],
    why_it_matters:
      'FP4 doubles compute density vs FP8 at minimal accuracy loss with the right calibration. The model-parallel boundary stays at the chip, not the die.',
  },
  {
    id: 'gb200',
    vendor: 'NVIDIA',
    name: 'GB200 NVL72',
    codename: 'Grace + 2× Blackwell',
    arch: 'Rack-scale Grace-Blackwell SuperChip',
    release: '2024-Q3',
    process: { node: 'TSMC 4NP + N5 (Grace)', fab: 'TSMC', transistors_b: 0 /* per-rack n/a */ },
    die: { layout: 'chiplet', bridge: '36× Grace + 72× B200 · NVLink Switch fabric' },
    memory: { type: 'HBM3e + LPDDR5X', capacity_gb: 13500, bw_tbs: 576, stacks: 0 },
    compute: {
      fp4: 1440, // 1.44 EF rack-aggregate
      fp8: 720,
      bf16: 360,
      fp16: 360,
    },
    interconnect: { fabric: 'NVLink Switch · 130 TB/s rack', bw_tbs: 130 },
    power_w: 120000,
    features: ['72-GPU NVLink domain', 'Liquid-cooled rack', '1.4 EF FP4 sparse / rack', '13.5 TB unified HBM3e'],
    positioning:
      'The first rack-scale GPU. Seventy-two B200 dies and 36 Grace CPUs present as one accelerator over an NVLink Switch fabric — the fabric IS the chip.',
    best_for: [
      'Trillion-parameter dense + sparse training',
      'Real-time MoE inference at hyperscale',
      'Single-job HPC at >1 EF FP4',
      '1M+ token serving with full KV cache resident',
    ],
    why_it_matters:
      'Eliminates the model-parallel boundary across 72 chips. Workloads that previously required complex pipeline+TP+EP partitioning collapse into a single-domain program.',
  },
  {
    id: 'h200',
    vendor: 'NVIDIA',
    name: 'H200',
    codename: 'Hopper Refresh',
    arch: 'Hopper · 4th-gen Tensor Cores',
    release: '2024-Q1',
    process: { node: 'TSMC 4N', fab: 'TSMC', transistors_b: 80 },
    die: { layout: 'monolithic' },
    memory: { type: 'HBM3e', capacity_gb: 141, bw_tbs: 4.8, stacks: 6 },
    compute: {
      sms: 132,
      tensor_cores: 528,
      fp8: 3.96,
      bf16: 1.98,
      fp16: 1.98,
      tf32: 0.99,
      fp32: 0.067,
      fp64: 0.067,
      int8: 3.96,
    },
    interconnect: { fabric: 'NVLink 4', bw_tbs: 0.9, pcie: 'Gen 5 ×16', links: 18 },
    power_w: 700,
    features: ['1.76× memory vs H100', '1.4× HBM bandwidth vs H100', 'Drop-in HGX H100 replacement'],
    positioning:
      'H100 die with 141 GB HBM3e instead of 80 GB HBM3. The KV-cache headroom upgrade — 70B-class models stop fragmenting across two GPUs.',
    best_for: [
      '70B model serving on a single GPU',
      'Long-context FP8 inference',
      'KV-cache-bound batched serving',
      'Drop-in HGX upgrade without retooling',
    ],
    why_it_matters:
      'Memory capacity, not FLOPs, is the bottleneck for most production LLM serving. H200 fixes that without forcing a Blackwell migration.',
  },
  {
    id: 'h100',
    vendor: 'NVIDIA',
    name: 'H100 SXM',
    codename: 'Hopper',
    arch: 'Hopper · 4th-gen Tensor Cores · Transformer Engine',
    release: '2022-Q4',
    process: { node: 'TSMC 4N', fab: 'TSMC', transistors_b: 80 },
    die: { layout: 'monolithic' },
    memory: { type: 'HBM3', capacity_gb: 80, bw_tbs: 3.35, stacks: 5 },
    compute: {
      sms: 132,
      tensor_cores: 528,
      fp8: 3.96,
      bf16: 1.98,
      fp16: 1.98,
      tf32: 0.99,
      fp32: 0.067,
      fp64: 0.067,
      int8: 3.96,
    },
    interconnect: { fabric: 'NVLink 4', bw_tbs: 0.9, pcie: 'Gen 5 ×16', links: 18 },
    power_w: 700,
    features: ['1st-gen FP8 Transformer Engine', 'DPX instructions (dynamic programming)', 'Confidential Compute', 'MIG · 7 instances', 'Asynchronous TMA'],
    positioning:
      'The deployment baseline. Every modern serving stack — vLLM, SGLang, TensorRT-LLM, TGI — is hand-tuned for H100, and FP8 Transformer Engine is its killer feature.',
    best_for: [
      'LLM training (BF16 / FP8)',
      'Production FP8 inference serving',
      'KV-cache sharding (GQA / MLA)',
      'MIG-partitioned multi-tenant inference',
    ],
    why_it_matters:
      'Defined the modern inference stack. 4th-gen Tensor Cores + FP8 made structured-sparse acceleration practical for transformer attention, and TMA unlocked async memory pipelines.',
  },
  {
    id: 'a100',
    vendor: 'NVIDIA',
    name: 'A100 80GB',
    codename: 'Ampere',
    arch: 'Ampere · 3rd-gen Tensor Cores',
    release: '2020-Q3',
    process: { node: 'TSMC 7N', fab: 'TSMC', transistors_b: 54 },
    die: { layout: 'monolithic' },
    memory: { type: 'HBM2e', capacity_gb: 80, bw_tbs: 2.0, stacks: 6 },
    compute: {
      sms: 108,
      tensor_cores: 432,
      bf16: 0.624,
      fp16: 0.624,
      tf32: 0.312,
      fp32: 0.0195,
      fp64: 0.0195,
      int8: 1.248,
    },
    interconnect: { fabric: 'NVLink 3', bw_tbs: 0.6, pcie: 'Gen 4 ×16', links: 12 },
    power_w: 400,
    features: ['Structured 2:4 sparsity', '3rd-gen Tensor Cores', 'TF32 default', 'MIG · 7 instances'],
    positioning:
      'The workhorse. Still the cheapest path to BF16 training and the academic standard. Most published results 2020–2023 ran here.',
    best_for: [
      'Pre-training small/medium models',
      'Multi-GPU BF16 / TF32 training',
      'Cost-efficient research compute',
      'Inference where latency budget is not tight',
    ],
    why_it_matters:
      'Defined "modern AI" hardware: Tensor Cores became mainstream, sparsity got a hardware path, and the SXM4 form factor became the rack standard.',
  },
  {
    id: 'tr2',
    vendor: 'AWS',
    name: 'Trainium2',
    codename: 'Annapurna',
    arch: '8 NeuronCores-v3 · MIMD',
    release: '2024-Q4',
    process: { node: '5nm', fab: 'TSMC', transistors_b: 96 },
    die: { layout: 'chiplet', ncores: 8 },
    memory: { type: 'HBM', capacity_gb: 96, bw_tbs: 2.9, stacks: 4 },
    compute: { fp8: 1.3, bf16: 0.667, fp16: 0.667 },
    interconnect: { fabric: 'NeuronLink-v3 · 4-cube torus', bw_tbs: 1.0 },
    power_w: 500,
    features: ['Stochastic rounding', 'Custom NKI kernel ISA', 'Available only on AWS', 'UltraServer · 16 chips per node'],
    positioning:
      "Vertically integrated AWS silicon — 30–40% better perf/$ on Bedrock and SageMaker for matched LLM workloads. PyTorch path via Neuron SDK + custom NKI.",
    best_for: [
      'AWS-native training pipelines (PyTorch + Neuron)',
      'Cost-sensitive bulk inference on Bedrock',
      'NKI-tuned MoE serving',
      'Cluster-scale FP8 fine-tuning',
    ],
    why_it_matters:
      "Breaks the NVIDIA monopoly inside one of the largest cloud footprints. The NKI kernel ISA gives you direct silicon access — closer to writing CUDA than calling cuDNN.",
  },
  {
    id: 'mi300x',
    vendor: 'AMD',
    name: 'MI300X',
    codename: 'CDNA 3 · Aqua Vanjaram',
    arch: '8 XCDs + 4 IODs (chiplet) · Matrix Cores',
    release: '2023-Q4',
    process: { node: 'TSMC N5 + N6', fab: 'TSMC', transistors_b: 153 },
    die: { layout: 'chiplet', xcds: 8 },
    memory: { type: 'HBM3', capacity_gb: 192, bw_tbs: 5.3, stacks: 8 },
    compute: {
      fp8: 5.23,
      bf16: 2.61,
      fp16: 2.61,
      tf32: 0.654,
      fp32: 0.163,
      fp64: 0.163,
      int8: 5.23,
    },
    interconnect: { fabric: 'Infinity Fabric', bw_tbs: 0.896, pcie: 'Gen 5 ×16' },
    power_w: 750,
    features: ['Largest GPU memory pre-B200', 'ROCm 6 toolchain', 'Drop-in OAM module', '8 XCD chiplets + 4 IODs'],
    positioning:
      'Until B200, the largest GPU memory shipping — 192 GB HBM3 fits 70B at FP16 on a single device with KV-cache headroom for long context.',
    best_for: [
      'Single-GPU 70B model serving',
      'Memory-bandwidth-bound inference',
      'ROCm-native fine-tuning',
      'AMD-procurement-mandated deployments',
    ],
    why_it_matters:
      'Validates the chiplet inference thesis (8 compute dies + 4 I/O dies) at production scale. Proves CUDA is not the only path; ROCm+Triton is now production-credible.',
  },
  {
    id: 'tpu-v5p',
    vendor: 'GOOGLE',
    name: 'TPU v5p',
    codename: 'Viperfish',
    arch: 'Tensor Pod · OCS torus',
    release: '2023-Q4',
    process: { node: 'TSMC 5nm', fab: 'TSMC', transistors_b: 0 },
    die: { layout: 'monolithic' },
    memory: { type: 'HBM3', capacity_gb: 95, bw_tbs: 2.76, stacks: 4 },
    compute: { bf16: 0.459, int8: 0.918 },
    interconnect: { fabric: 'OCS Torus · 8960 chips/pod', bw_tbs: 4.8 },
    power_w: 600,
    features: ['Optical Circuit Switch reconfigurable topology', '8960-chip pod', 'JAX-native', 'Internal Google + Cloud TPU'],
    positioning:
      'Highest-density pre-training silicon per pod. The OCS reconfigurable torus is the secret weapon for Gemini-scale training; JAX/XLA is the only first-class path.',
    best_for: [
      'Massive-scale model pre-training',
      'JAX/Flax + XLA workloads',
      'Multi-pod model parallelism via OCS',
      'Workloads where Google Cloud is the deployment target',
    ],
    why_it_matters:
      'Optical circuit switching reconfigures the topology at runtime — the network becomes part of the compiler. No GPU vendor has shipped this at scale.',
  },
];
