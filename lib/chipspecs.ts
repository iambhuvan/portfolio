export type ZoneKey = 'compute' | 'hbm' | 'l2' | 'nvlink' | 'pcie' | 'bridge';

export type ZoneDetail = {
  title: string;
  main: string;
  unit: string;
  rows: { k: string; v: string }[];
  description: string;
};

export type FunctionBlock = { label: string; count?: number; hint?: string };

export type Architecture = {
  // GPU monolithic / dual-die
  sms_active?: number;
  sms_physical?: number;
  gpcs?: number;
  sms_per_gpc?: number;
  tcs_per_sm?: number;
  l1_per_sm_kb?: number;
  l2_mb?: number;
  l2_slices?: number;
  l2_hit_ns?: number;
  // Memory
  hbm_active?: number;
  hbm_physical?: number;
  per_stack_gb?: number;
  per_stack_bw_gbs?: number;
  hbm_bus_bits?: number;
  hbm_vendor?: string;
  hbm_height?: string;
  // Interconnect
  nvlink_lanes?: number;
  nvlink_per_lane_gbs?: number;
  pcie_lanes?: number;
  pcie_gen?: number;
  pcie_bw_gbs?: number;
  // Bridge (dual-die)
  bridge_name?: string;
  bridge_bw_tbs?: number;
  bridge_latency_ns?: number;
  // Chiplet
  xcds?: number;
  cus_per_xcd?: number;
  iods?: number;
  // Trainium
  neuron_cores?: number;
  on_chip_sram_mb?: number;
  // TPU
  matrix_units?: number;
  // Cerebras
  ai_cores?: number;
  // Function blocks shown along bottom of die
  blocks: FunctionBlock[];
  // Microarchitecture flags
  features_micro: string[];
};

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
  architecture: Architecture;
};

export function getZoneDetail(chip: ChipSpec, zone: ZoneKey): ZoneDetail {
  const c = chip.compute;
  const a = chip.architecture;
  switch (zone) {
    case 'compute': {
      const main = c.fp4 != null ? `${c.fp4}` : c.fp8 != null ? `${c.fp8}` : c.bf16 != null ? `${c.bf16}` : '—';
      const unit = c.fp4 != null ? 'PFLOPS · FP4 sparse' : c.fp8 != null ? 'PFLOPS · FP8 sparse' : 'PFLOPS · BF16';
      const rows: { k: string; v: string }[] = [];
      if (a.sms_active != null) rows.push({ k: 'SMs (active)', v: `${a.sms_active}${a.sms_physical ? ` / ${a.sms_physical}` : ''}` });
      if (a.gpcs != null) rows.push({ k: 'GPCs', v: `${a.gpcs}${a.sms_per_gpc ? ` × ${a.sms_per_gpc} SMs` : ''}` });
      if (a.tcs_per_sm != null && a.sms_active != null) rows.push({ k: 'Tensor Cores', v: `${a.tcs_per_sm * a.sms_active} (${a.tcs_per_sm}/SM)` });
      if (a.l1_per_sm_kb != null) rows.push({ k: 'L1 / SM', v: `${a.l1_per_sm_kb} KB` });
      if (a.xcds != null) rows.push({ k: 'XCDs', v: `${a.xcds}${a.cus_per_xcd ? ` × ${a.cus_per_xcd} CUs = ${a.xcds * a.cus_per_xcd}` : ''}` });
      if (a.iods != null) rows.push({ k: 'I/O dies', v: `${a.iods}` });
      if (a.neuron_cores != null) rows.push({ k: 'NeuronCore-v3', v: `${a.neuron_cores}` });
      if (a.on_chip_sram_mb != null) rows.push({ k: 'On-chip SRAM', v: `${a.on_chip_sram_mb} MB` });
      if (a.matrix_units != null) rows.push({ k: 'MMU units', v: `${a.matrix_units}` });
      if (c.fp4 != null) rows.push({ k: 'FP4 sparse', v: `${c.fp4} PFLOPS` });
      if (c.fp8 != null) rows.push({ k: 'FP8 sparse', v: `${c.fp8} PFLOPS` });
      if (c.bf16 != null) rows.push({ k: 'BF16', v: `${c.bf16} PFLOPS` });
      if (c.tf32 != null) rows.push({ k: 'TF32', v: `${c.tf32} PFLOPS` });
      if (c.fp32 != null) rows.push({ k: 'FP32', v: `${c.fp32} PFLOPS` });
      if (c.fp64 != null) rows.push({ k: 'FP64', v: `${c.fp64} PFLOPS` });
      if (c.int8 != null) rows.push({ k: 'INT8', v: `${c.int8} POPS` });
      return {
        title: 'COMPUTE',
        main,
        unit,
        rows,
        description: chip.arch + (a.features_micro?.[0] ? ' · ' + a.features_micro[0] : ''),
      };
    }
    case 'hbm': {
      const perStack = a.per_stack_bw_gbs ?? (chip.memory.stacks > 0 ? Math.round(chip.memory.bw_tbs * 1000 / chip.memory.stacks) : null);
      const rows: { k: string; v: string }[] = [
        { k: 'type', v: a.hbm_height ?? chip.memory.type },
        { k: 'capacity', v: `${chip.memory.capacity_gb} GB${a.per_stack_gb ? ` (${a.per_stack_gb} GB × ${a.hbm_active ?? chip.memory.stacks})` : ''}` },
        { k: 'bandwidth', v: `${chip.memory.bw_tbs} TB/s` },
        ...(perStack ? [{ k: 'per-stack BW', v: `${perStack} GB/s` }] : []),
        ...(a.hbm_bus_bits ? [{ k: 'bus width', v: `${a.hbm_bus_bits.toLocaleString()}-bit` }] : []),
        ...(a.hbm_active && a.hbm_physical
          ? [{ k: 'stacks', v: `${a.hbm_active} active / ${a.hbm_physical} physical` }]
          : a.hbm_active ? [{ k: 'stacks', v: String(a.hbm_active) }] : []),
        ...(a.hbm_vendor ? [{ k: 'vendor', v: a.hbm_vendor }] : []),
      ];
      return {
        title: 'MEMORY',
        main: `${chip.memory.capacity_gb}`,
        unit: `GB · ${chip.memory.type}`,
        rows,
        description:
          'High-bandwidth memory stacked vertically with through-silicon vias. The bandwidth ceiling for any inference workload — KV-cache reads live here.',
      };
    }
    case 'l2': {
      const size = a.l2_mb != null ? `${a.l2_mb} MB` : 'on-die';
      const subtitle = chip.id === 'mi300x' ? 'Infinity Cache' : 'shared L2';
      const rows: { k: string; v: string }[] = [
        { k: 'size', v: size },
        ...(a.l2_slices ? [{ k: 'slices', v: String(a.l2_slices) }] : []),
        ...(a.l2_hit_ns ? [{ k: 'hit latency', v: `~${a.l2_hit_ns} ns` }] : []),
        { k: 'sharing', v: chip.id === 'mi300x' ? 'across all XCDs' : 'all SMs · cluster scope' },
        { k: 'live data', v: 'KV-cache · partial sums · activations' },
      ];
      return {
        title: chip.id === 'mi300x' ? 'INFINITY CACHE' : 'L2 CACHE',
        main: a.l2_mb != null ? String(a.l2_mb) : '—',
        unit: a.l2_mb != null ? `MB · ${subtitle}` : subtitle,
        rows,
        description:
          'Last-level cache shared across compute. KV-cache ops live and die here — every miss hits HBM at 10× the latency. Slice count determines arbitration parallelism.',
      };
    }
    case 'nvlink': {
      const isNVLink = chip.interconnect.fabric.includes('NVLink');
      const rows: { k: string; v: string }[] = [
        { k: 'fabric', v: chip.interconnect.fabric },
        { k: 'bandwidth', v: `${chip.interconnect.bw_tbs} TB/s` },
        ...(a.nvlink_lanes ? [{ k: 'lanes', v: String(a.nvlink_lanes) }] : []),
        ...(a.nvlink_per_lane_gbs ? [{ k: 'per-lane BW', v: `${a.nvlink_per_lane_gbs} GB/s bidir` }] : []),
        { k: 'protocol', v: isNVLink ? 'NVLink + NVSwitch' : chip.interconnect.fabric },
        { k: 'used for', v: 'tensor-parallel · all-reduce' },
      ];
      return {
        title: 'INTERCONNECT',
        main: `${chip.interconnect.bw_tbs}`,
        unit: 'TB/s · ' + chip.interconnect.fabric,
        rows,
        description:
          'GPU-to-GPU fabric. Sets the ceiling for tensor-parallel scale and how aggressively you can shard MoE experts across devices.',
      };
    }
    case 'pcie': {
      const rows: { k: string; v: string }[] = [
        { k: 'spec', v: chip.interconnect.pcie || '—' },
        ...(a.pcie_bw_gbs ? [{ k: 'bandwidth', v: `${a.pcie_bw_gbs} GB/s bidir` }] : []),
        ...(a.pcie_lanes ? [{ k: 'lanes', v: `×${a.pcie_lanes}` }] : []),
        ...(a.pcie_gen ? [{ k: 'gen', v: `${a.pcie_gen}.0` }] : []),
        { k: 'role', v: 'kernel queue · weight load' },
      ];
      return {
        title: 'HOST INTERFACE',
        main: chip.interconnect.pcie?.split(' ').pop() || '—',
        unit: 'CPU ↔ GPU control',
        rows,
        description:
          'Slow path. Host writes the kernel launch queue; GPU pulls weights and writes back results. Cold-start latency lives here.',
      };
    }
    case 'bridge': {
      const rows: { k: string; v: string }[] = [
        { k: 'name', v: a.bridge_name ?? 'die-to-die' },
        { k: 'bandwidth', v: `${a.bridge_bw_tbs ?? 10} TB/s bidir` },
        ...(a.bridge_latency_ns ? [{ k: 'latency', v: `~${a.bridge_latency_ns} ns hop` }] : []),
        { k: 'topology', v: '2 reticle-limit dies' },
        { k: 'compiler', v: 'transparent · single GPU' },
      ];
      return {
        title: a.bridge_name?.toUpperCase() ?? 'DIE-TO-DIE',
        main: String(a.bridge_bw_tbs ?? 10),
        unit: 'TB/s · die-to-die',
        rows,
        description:
          "First-gen die-to-die fabric on Blackwell. Two reticle-limit dies stitched into one GPU — the model-parallel boundary doesn't have to bisect them.",
      };
    }
  }
}

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
    architecture: {
      sms_active: 160,
      sms_physical: 192,
      gpcs: 16,
      sms_per_gpc: 10,
      tcs_per_sm: 4,
      l1_per_sm_kb: 256,
      l2_mb: 100,
      l2_slices: 24,
      l2_hit_ns: 30,
      hbm_active: 8,
      hbm_physical: 8,
      per_stack_gb: 24,
      per_stack_bw_gbs: 1000,
      hbm_bus_bits: 8192,
      hbm_vendor: 'SK hynix · Micron',
      hbm_height: '8-Hi · HBM3e',
      nvlink_lanes: 18,
      nvlink_per_lane_gbs: 100,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      bridge_name: 'NV-HBI',
      bridge_bw_tbs: 10,
      bridge_latency_ns: 10,
      blocks: [
        { label: 'Transformer Engine v2', hint: 'FP4 / FP6 / FP8 native' },
        { label: 'Decompression Engine', hint: 'GPU-accelerated GZIP / Snappy / LZ4' },
        { label: 'NVDEC', count: 7, hint: '7th-gen video decode' },
        { label: 'JPEG', count: 1, hint: '5x JPEG decoder unit' },
        { label: 'OFA', count: 1, hint: 'Optical Flow Accelerator' },
        { label: 'TMA', hint: 'Tensor Memory Accelerator' },
        { label: 'Copy Engines', count: 7 },
      ],
      features_micro: [
        'FP4 native compute (2× FP8 throughput)',
        'NV-HBI die-to-die transparent to compiler',
        'Confidential Compute (TEE I/O)',
        '2nd-gen Transformer Engine with FP4 calibration',
        'RAS engine with predictive failure',
        'Decompression engine for direct-from-storage',
      ],
    },
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
    architecture: {
      sms_active: 160 * 72,
      gpcs: 16 * 72,
      tcs_per_sm: 4,
      l2_mb: 100 * 72,
      hbm_active: 8 * 72,
      per_stack_gb: 24,
      per_stack_bw_gbs: 1000,
      hbm_vendor: 'SK hynix · Micron',
      hbm_height: '8-Hi · HBM3e',
      nvlink_lanes: 18,
      bridge_name: 'NVLink Switch (rack-scale)',
      bridge_bw_tbs: 130,
      blocks: [
        { label: 'Grace CPU', count: 36, hint: '72-core Arm Neoverse V2 each' },
        { label: 'B200 GPU', count: 72, hint: 'Blackwell dual-die' },
        { label: 'NVLink Switch Tray', count: 9, hint: '14.4 TB/s each' },
        { label: 'Liquid Cooling', hint: '120 kW rack' },
      ],
      features_micro: [
        '72-GPU NVLink domain — single memory namespace',
        'Coherent CPU↔GPU via NVLink-C2C (900 GB/s)',
        '13.5 TB unified HBM3e at 576 TB/s aggregate',
        '1.4 EF FP4 sparse per rack (NVL72)',
        'Liquid-cooled, 120 kW per rack',
      ],
    },
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
    architecture: {
      sms_active: 132,
      sms_physical: 144,
      gpcs: 8,
      sms_per_gpc: 18,
      tcs_per_sm: 4,
      l1_per_sm_kb: 256,
      l2_mb: 50,
      l2_slices: 12,
      l2_hit_ns: 30,
      hbm_active: 6,
      hbm_physical: 6,
      per_stack_gb: 24,
      per_stack_bw_gbs: 800,
      hbm_bus_bits: 6144,
      hbm_vendor: 'SK hynix · Micron',
      hbm_height: '8-Hi · HBM3e',
      nvlink_lanes: 18,
      nvlink_per_lane_gbs: 50,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      blocks: [
        { label: 'Transformer Engine', hint: '1st-gen FP8' },
        { label: 'TMA', hint: 'Tensor Memory Accelerator' },
        { label: 'DPX', hint: 'Dynamic Programming X (Smith-Waterman / DP graph)' },
        { label: 'NVDEC', count: 7 },
        { label: 'JPEG', count: 1 },
        { label: 'OFA', count: 1 },
        { label: 'Copy Engines', count: 7 },
      ],
      features_micro: [
        '1.4× HBM bandwidth and 1.76× capacity vs H100',
        'Same 132 SMs · 528 Tensor Cores as H100',
        'Drop-in HGX H100 socket compatibility',
        'Confidential Compute · MIG · 7 instances',
        'TMA enables async tensor pipelines on warps',
      ],
    },
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
    architecture: {
      sms_active: 132,
      sms_physical: 144,
      gpcs: 8,
      sms_per_gpc: 18,
      tcs_per_sm: 4,
      l1_per_sm_kb: 256,
      l2_mb: 50,
      l2_slices: 12,
      l2_hit_ns: 30,
      hbm_active: 5,
      hbm_physical: 6,
      per_stack_gb: 16,
      per_stack_bw_gbs: 670,
      hbm_bus_bits: 5120,
      hbm_vendor: 'SK hynix · Samsung',
      hbm_height: '8-Hi · HBM3',
      nvlink_lanes: 18,
      nvlink_per_lane_gbs: 50,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      blocks: [
        { label: 'Transformer Engine', hint: '1st-gen FP8 · per-tensor scaling' },
        { label: 'TMA', hint: 'Tensor Memory Accelerator (async)' },
        { label: 'DPX', hint: 'Dynamic Programming X (40× CPU on Smith-Waterman)' },
        { label: 'NVDEC', count: 7 },
        { label: 'JPEG', count: 1 },
        { label: 'OFA', count: 1 },
        { label: 'Copy Engines', count: 7 },
      ],
      features_micro: [
        '4th-gen Tensor Cores · FP8 native (E4M3 + E5M2)',
        'Structured 2:4 sparsity acceleration (2×)',
        'TMA: async warp-level tensor copies',
        'Distributed Shared Memory (cluster scope)',
        'Thread Block Cluster + Async Pipelines',
        'Confidential Compute (TEE I/O) · MIG · 7 instances',
        'PTX 8.0 with mma.sync FP8 / fp8x4.e4m3 / e5m2',
      ],
    },
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
    architecture: {
      sms_active: 108,
      sms_physical: 128,
      gpcs: 7,
      sms_per_gpc: 16,
      tcs_per_sm: 4,
      l1_per_sm_kb: 192,
      l2_mb: 40,
      l2_slices: 80,
      l2_hit_ns: 35,
      hbm_active: 5,
      hbm_physical: 6,
      per_stack_gb: 16,
      per_stack_bw_gbs: 410,
      hbm_bus_bits: 5120,
      hbm_vendor: 'Samsung · SK hynix',
      hbm_height: '8-Hi · HBM2e',
      nvlink_lanes: 12,
      nvlink_per_lane_gbs: 50,
      pcie_lanes: 16,
      pcie_gen: 4,
      pcie_bw_gbs: 64,
      blocks: [
        { label: 'Sparse Tensor Cores', hint: '3rd-gen · 2:4 structured sparsity (2×)' },
        { label: 'BF16 / TF32', hint: 'Standardized formats from Ampere onward' },
        { label: 'NVDEC', count: 5 },
        { label: 'OFA', count: 1, hint: 'Optical Flow Accelerator' },
        { label: 'Copy Engines', count: 5 },
      ],
      features_micro: [
        '3rd-gen Tensor Cores · BF16 + TF32 + INT8 + INT4',
        'Structured 2:4 sparsity (first generation, 2× FP gain)',
        'MIG · 7 instances (introduced on A100)',
        '40 MB L2 across 80 slices',
        'PCIe Gen 4 ×16 · 64 GB/s host link',
        'NVLink 3rd gen · 12 links · 600 GB/s aggregate',
      ],
    },
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
    architecture: {
      neuron_cores: 8,
      on_chip_sram_mb: 96,
      hbm_active: 4,
      hbm_physical: 4,
      per_stack_gb: 24,
      per_stack_bw_gbs: 730,
      hbm_vendor: 'Samsung · SK hynix',
      hbm_height: 'HBM',
      nvlink_lanes: 0,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      blocks: [
        { label: 'NeuronCore-v3', count: 8, hint: 'Tensor + Vector + Scalar + GPSIMD' },
        { label: 'Tensor Engine', hint: 'BF16 / FP8 systolic array' },
        { label: 'Softmax + Layernorm', hint: 'Hardware accelerator' },
        { label: 'Stochastic Rounding', hint: 'On-chip RNG for FP8 training' },
        { label: 'Collective Compute', hint: 'On-chip all-reduce engine' },
        { label: 'NeuronLink-v3', count: 8, hint: '4-cube torus per instance' },
      ],
      features_micro: [
        '8 NeuronCore-v3 with 4 engine types each',
        '96 MB on-chip SRAM (per-NC partitioned)',
        'Custom NKI ISA — programmer-visible silicon',
        '4-cube NeuronLink-v3 topology',
        'Hardware FP8 stochastic rounding',
        'UltraServer interconnect: 16 chips per node',
        'Available only inside AWS (Bedrock + SageMaker)',
      ],
    },
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
    architecture: {
      xcds: 8,
      cus_per_xcd: 38,
      iods: 4,
      l2_mb: 256,
      l2_slices: 32,
      l2_hit_ns: 25,
      hbm_active: 8,
      hbm_physical: 8,
      per_stack_gb: 24,
      per_stack_bw_gbs: 660,
      hbm_bus_bits: 8192,
      hbm_vendor: 'SK hynix · Micron',
      hbm_height: '12-Hi · HBM3',
      nvlink_lanes: 0,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      blocks: [
        { label: 'XCD', count: 8, hint: '38 CUs each · CDNA 3 · 304 CUs total' },
        { label: 'IOD', count: 4, hint: 'I/O dies · Infinity Cache · stacked under XCDs' },
        { label: 'Matrix Cores', hint: 'CDNA 3 · FP8 / BF16 / FP16 / INT8' },
        { label: 'Infinity Cache', hint: '256 MB L3 across IODs' },
        { label: 'Infinity Fabric', count: 7, hint: '5.3 TB/s per chip' },
        { label: 'Video DEC', count: 4 },
      ],
      features_micro: [
        '8 XCDs × 38 CUs = 304 CUs (CDNA 3)',
        '4 IODs (I/O dies) — 3D-stacked under XCDs',
        '256 MB Infinity Cache (vs 50 MB H100 L2)',
        'Matrix Cores: FP8 / BF16 / FP16 / INT8',
        'Infinity Fabric — coherent CPU↔GPU on MI300A',
        'ROCm 6 + Triton + HIP toolchain',
        'OAM module · drop-in form factor',
      ],
    },
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
    architecture: {
      matrix_units: 4,
      l2_mb: 96,
      hbm_active: 4,
      hbm_physical: 4,
      per_stack_gb: 24,
      per_stack_bw_gbs: 690,
      hbm_bus_bits: 4096,
      hbm_vendor: 'SK hynix',
      hbm_height: '8-Hi · HBM3',
      nvlink_lanes: 0,
      pcie_lanes: 16,
      pcie_gen: 5,
      pcie_bw_gbs: 128,
      bridge_name: 'OCS Optical Switch',
      bridge_bw_tbs: 4.8,
      blocks: [
        { label: 'Matrix Multiply Unit', count: 4, hint: 'Systolic 128×128 BF16' },
        { label: 'Vector Unit', count: 4, hint: 'Per-MMU vector co-processor' },
        { label: 'Scalar Unit', count: 4 },
        { label: 'On-chip Interconnect', hint: 'High-bandwidth NoC' },
        { label: 'OCS PHY', hint: 'Optical Circuit Switch transceivers' },
      ],
      features_micro: [
        '4 Matrix Multiply Units · 459 TF BF16 / chip',
        '8960-chip pod via OCS reconfigurable torus',
        'Compiler-defined topology (XLA)',
        'JAX-native deployment path',
        '95 GB HBM3 · 2.76 TB/s',
        'Available only on Google Cloud + internal',
      ],
    },
  },
];
