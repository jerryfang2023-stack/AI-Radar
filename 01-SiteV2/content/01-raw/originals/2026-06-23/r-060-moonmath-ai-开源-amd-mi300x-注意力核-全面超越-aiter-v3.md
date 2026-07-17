---
schema_version: raw-evidence-v2
raw_id: R-060
title: "MoonMath AI 开源 AMD MI300X 注意力核，全面超越 AITER v3"
original_url: "https://www.marktechpost.com/2026/06/22/moonmath-ai-open-sources-a-hip-attention-kernel-for-amd-mi300x-that-beats-aiter-v3-on-every-shape-and-rounding-mode"
canonical_url: "https://marktechpost.com/2026/06/22/moonmath-ai-open-sources-a-hip-attention-kernel-for-amd-mi300x-that-beats-aiter-v3-on-every-shape-and-rounding-mode"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-22T07:13:49.000Z"
collected_at: 2026-06-23T02:03:46.626Z
language: mixed
full_text_hash: a68182f638a01ffb
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-23/r-060-moonmath-ai-开源-amd-mi300x-注意力核-全面超越-aiter-v3.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-23/r-060-moonmath-ai-开源-amd-mi300x-注意力核-全面超越-aiter-v3.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":7766,"paragraph_count":69,"sentence_count":95,"boilerplate_hits":2,"symbol_ratio":0.0059,"method":"article"}
has_full_text: true
content_length: 7766
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a68182f638a01ffb","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"MoonMath AI 开源 AMD MI300X 注意力核，全面超越 AITER v3","discovery_summary":"MoonMath AI 团队开源了一款 bf16 前向注意力核，专为 AMD MI300X（gfx942）设计，使用 HIP 编写，MIT 许可。该核在所有测试形状和三种舍入模式下均超越 AMD 官方 AITER v3：几何平均加速比 1.18×（RTNE）、1.15×（RTNA）、1.08×（RTZ），最高单形状 1.26×。性能提升来自单指令 asm 包装和内存布局优化--K 置于 LDS，V 常驻 L1，Q 和累加器保持在寄存器。该核已通过 SGLang PR 将 Wan2.1 视频扩散模型推理速度提升 1.23 倍，质量无损。当前仅支持 bf16、头维度固定 128，无因果掩码、GQA 或变长批处理。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/22/moonmath-ai-open-sources-a-hip-attention-kernel-for-amd-mi300x-that-beats-aiter-v3-on-every-shape-and-rounding-mode","discovered_at":"2026-06-23T01:57:11.635Z","rank_on_page":234,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: a07140067e1f3179
content_hash: a68182f638a01ffb
semantic_hash: c08b39caae2b3255
duplicate_of: ""
first_seen_at: "2026-06-22T07:13:49.000Z"
last_seen_at: 2026-06-23T02:03:46.626Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":5,"importance_reason":"technical trend or capability shift; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":4,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":3}
business_elements: {"companies":["MarkTechPost（RSS）","GitHub"],"products":[],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":[],"business_actions":["发布 / 推出","合作 / 联盟","融资 / 投资"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["300X","3\nM","16","942","3","1.18","1.15","1.08"],"quotes":["v_mfma_f32_16x16x16_bf16 %0, %1, %2, %0","(b));\nThe "," device string on AMD GPUs\nq = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device=",")\nk = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device=",")\nv = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="]}
evidence_seed: {"company_actions":["It is written in HIP, not hand-written assembly.","The code is open-source under the MIT license.","ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"number","text":"MoonMath AI 团队开源了一款 bf16 前向注意力核，专为 AMD MI300X（gfx942）设计，使用 HIP 编写，MIT 许可。该核在所有测试形状和三种舍入模式下均超越 AMD 官方 AITER v3：几何平均加速比 1.18×（RTNE）、1.15×（RTNA）、1.08×（RTZ），最高单形状 1.26×。性能提升来自单指令 asm 包装和内存布局优化--K 置于 LDS，V 常驻 L1，Q 和累加器保持在寄存器。该核已通过 SGLang PR 将 Wan2.1 视频扩散模型推理速度提升 1.23 倍，质量无损。当前仅支持 bf16、头维度固定 128，无因果掩码、GQA 或变长批处理。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"number","text":"Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Editors Pick New Releases Open Source Software Engineering Staff Tech News MoonMath AI team has released a bf16 forward attention kernel for AMD’s MI300X GPU.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It is written in HIP, not hand-written assembly.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The code is open-source under the MIT license.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Bare-metal access came from HotAisle, an AMD cloud provider.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
title_zh: "MoonMath AI 开源 AMD MI300X 注意力核，全面超越 AITER v3"
title_translation_status: "not_required"
title_translation_method: "source_title"
title_translation_model: "not_applicable"
---

# MoonMath AI 开源 AMD MI300X 注意力核，全面超越 AITER v3

## clean_text

Artificial Intelligence
AI Infrastructure
Technology
AI Shorts
Applications
Editors Pick
New Releases
Open Source
Software Engineering
Staff
Tech News
MoonMath AI team has released a bf16 forward attention kernel for AMD’s MI300X GPU. It is written in HIP, not hand-written assembly. The code is open-source under the MIT license. The MoonMath.ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape. Bare-metal access came from HotAisle, an AMD cloud provider.
Attention is the fused softmax(QKᵀ/√d)·V operation inside every transformer. The MI300X is AMD’s CDNA3 data-center GPU, with the ISA target (gfx942). This kernel runs on that hardware only.
TL;DR
MoonMath.ai open-sources a bf16 forward attention kernel for AMD MI300X, written in HIP, not assembly (MIT).
It beats AMD’s AITER v3 on every shape and rounding mode — geomean 1.18×/1.15×/1.08×, up to 1.26×.
The core trick: one-instruction asm wrappers let you pick the opcode while the compiler allocates registers.
Most of the speedup is memory placement — K in LDS, V hot in L1, Q and accumulators in registers.
A real SGLang PR used it to speed up Wan2.1 video diffusion by 1.23×, with no quality regression.
Understanding Kernel
A kernel is a small program that runs directly on the GPU’s many cores to perform one specific computation—here, the attention math—as fast as the hardware allows. The kernel computes forward attention in bf16 on MI300X only. It takes inputs in either BSHD or BHSD layout, with no transpose. Head dimension is fixed at 128. It supports any sequence length, including cross-attention.
There are real limits. There is no causal mask, no GQA, and no varlen batching. Outputs are bf16, and it runs on gfx942 hardware exclusively.
Numerics are tightly controlled. All three rounding modes match AITER’s per-mode rounding rule. Every finite output sits within 1 bf16 ULP of AITER. NaN and Inf handling is bit-identical, and results are deterministic.
The Core Trick: One-Instruction asm Wrappers
The core technique avoids a familiar dilemma. Compiler intrinsics keep code tidy but let the compiler reorder or rename operands. Raw inline assembly gives control but forces manual register and address management.
MoonMath wraps exactly one instruction in a __device__ __forceinline__ function. Extended asm constraints describe the operands. The research team picks the opcode. The compiler still allocates registers and tracks data flow.
Copy Code Copied Use a different Browser
// in/out tied to the SAME VGPR → no accumulator rename, no v_mov copy.
__device__ __forceinline__ void asm_mfma(bf16x4_t a, bf16x4_t b, fp32x4_t& c) {
asm volatile("v_mfma_f32_16x16x16_bf16 %0, %1, %2, %0"
: "+v"(c) : "v"(a), "v"(b));
The "+v"(c) constraint ties the accumulator input and output to the same VGPR. No copy instruction is emitted. This keeps the kernel close to ordinary HIP. It still steers the machine one instruction at a time.
The Architecture: Eight Waves, Two Groups, Two Barriers
A CDNA3 compute unit has four SIMD units. The textbook block is four waves. MoonMath instead runs eight waves per block, in two groups of four.
The two groups run the same Q*K , softmax, O += P*V sequence. They are offset by a phase. While one group saturates the matrix core, the other runs softmax and issues loads. Then they swap, so the matrix core never idles.
There are two s_barrier s per iteration. One sits at the phase handoff. One sits at the iteration boundary. Per-counter waits handle the rest of the synchronization.
This echoes FlashAttention-3’s matmul and softmax alternation. It does not copy FA3’s producer and consumer warp split. On CDNA3, every memory move is already asynchronous, so a dedicated producer wave is unnecessary.
Where Data Lives, and Why 16×16×16
Most of the speedup comes from memory placement. K streams from HBM into LDS, double-buffered, shared by all eight waves. V stays hot in L1, read on every PV matmul. Q and accumulators live in registers.
The research team picked the 16×16×16 MFMA over 32×32×8. Both shapes have identical throughput. The smaller tile accumulates into 4 fp32 elements per lane, against 16. Lower accumulator pressure leaves room for deeper prefetch and a third Q tile.
Decision Choice Reason
Waves per block 8 (two groups of 4) Plan the pipeline directly; share one K copy
MFMA shape 16×16×16 bf16 Same throughput, lower VGPR pressure, better power efficiency
K placement LDS, double-buffered, 32 KiB Shared by all 8 waves, swapped per iteration
V placement L1, resident, prefetched Reread across PV, kept hot deliberately
Q + accumulators VGPRs Read every iteration, never reloaded
Two later wins close the gap. A third Q tile (3Q) raises data reuse per loaded K and V tile. A Flash-Decoding-style tail KV split rescues the stranded fractional round across MI300X’s 304 CUs. These wins cascade. Moving V to L1 freed the LDS that the third Q tile then fills.
Benchmark
Tests ran on MI300X in bf16, head dimension 128. Each shape was measured at three rounding modes. RTNE rounds to nearest even. RTNA rounds to nearest, ties away from zero. RTZ truncates toward zero.
Shape (B, H, S, D) Round Ours (ms) AITER v3 (ms) vs AITER vs MAX
(2, 24, 8192, 128) RTNE 3.083 3.792 1.23× 1.37×
(2, 24, 16384, 128) RTNE 11.670 14.691 1.26× 1.54×
(4, 16, 16384, 128) RTZ 15.055 16.183 1.07× 1.47×
(2, 24, 32768, 128) RTNA 44.440 52.363 1.18× 1.57×
(1, 16, 131072, 128) RTNE 232.517 269.278 1.16× 1.46×
Geomeans across the sweep favor MoonMath. Versus AITER, it scores 1.18× (RTNE), 1.15× (RTNA), and 1.08× (RTZ). Versus Modular MAX, geomeans run 1.44× to 1.49×, and per-shape speedups reach 1.59×.
RTZ is AITER’s own fastest mode and the tightest race. The (4, 16, 16384) RTZ shape moved from 0.95× to 1.07×. The tail KV split is what closed that final gap.
Interactive Explainer
Use Cases
The kernel installs with pip and exposes a small API. It launches on the caller’s stream, so it overlaps inside larger pipelines.
Copy Code Copied Use a different Browser
import torch
import moonmath_attention as ma
# PyTorch's ROCm build uses the "cuda" device string on AMD GPUs
q = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
k = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
v = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
out = ma.forward(q, k, v, layout="bshd")
out_rtz = ma.forward(q, k, v, layout="bshd", round_mode="rtz")
One concrete use case is video diffusion. The team added LiteAttention support and sent a PR to SGLang diffusion. On Wan2.1-T2V-1.3B-Diffusers, they switched attention from AITER to liteattention_rocm . End-to-end generation improved by 1.23× on MI300X, with no visible quality regression.
The BSHD layout suits diffusion tensors directly. Cross-attention works with any KV length and no padding.
Key Takeaways
The kernel is bf16 forward attention for MI300X, written in HIP under MIT.
It beats AITER v3 on every shape and rounding mode, geomean 1.18×/1.15×/1.08×.
One-instruction asm wrappers give opcode control while the compiler allocates registers.
Memory placement drove most of the gain: K in LDS, V hot in L1, Q in registers.
A real SGLang PR sped up Wan2.1 video diffusion by 1.23× with no quality regression.
Check out the Technical details . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
tinyfish.ai Open Source
Big Set
Describe your ideal dataset in plain English, and BigSet builds it.
dataset.build() auto&middot;refresh
Explore on GitHub &rarr;

## full_text

Artificial Intelligence
AI Infrastructure
Technology
AI Shorts
Applications
Editors Pick
New Releases
Open Source
Software Engineering
Staff
Tech News
MoonMath AI team has released a bf16 forward attention kernel for AMD’s MI300X GPU. It is written in HIP, not hand-written assembly. The code is open-source under the MIT license. The MoonMath.ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape. Bare-metal access came from HotAisle, an AMD cloud provider.
Attention is the fused softmax(QKᵀ/√d)·V operation inside every transformer. The MI300X is AMD’s CDNA3 data-center GPU, with the ISA target (gfx942). This kernel runs on that hardware only.
TL;DR
MoonMath.ai open-sources a bf16 forward attention kernel for AMD MI300X, written in HIP, not assembly (MIT).
It beats AMD’s AITER v3 on every shape and rounding mode — geomean 1.18×/1.15×/1.08×, up to 1.26×.
The core trick: one-instruction asm wrappers let you pick the opcode while the compiler allocates registers.
Most of the speedup is memory placement — K in LDS, V hot in L1, Q and accumulators in registers.
A real SGLang PR used it to speed up Wan2.1 video diffusion by 1.23×, with no quality regression.
Understanding Kernel
A kernel is a small program that runs directly on the GPU’s many cores to perform one specific computation—here, the attention math—as fast as the hardware allows. The kernel computes forward attention in bf16 on MI300X only. It takes inputs in either BSHD or BHSD layout, with no transpose. Head dimension is fixed at 128. It supports any sequence length, including cross-attention.
There are real limits. There is no causal mask, no GQA, and no varlen batching. Outputs are bf16, and it runs on gfx942 hardware exclusively.
Numerics are tightly controlled. All three rounding modes match AITER’s per-mode rounding rule. Every finite output sits within 1 bf16 ULP of AITER. NaN and Inf handling is bit-identical, and results are deterministic.
The Core Trick: One-Instruction asm Wrappers
The core technique avoids a familiar dilemma. Compiler intrinsics keep code tidy but let the compiler reorder or rename operands. Raw inline assembly gives control but forces manual register and address management.
MoonMath wraps exactly one instruction in a __device__ __forceinline__ function. Extended asm constraints describe the operands. The research team picks the opcode. The compiler still allocates registers and tracks data flow.
Copy Code Copied Use a different Browser
// in/out tied to the SAME VGPR → no accumulator rename, no v_mov copy.
__device__ __forceinline__ void asm_mfma(bf16x4_t a, bf16x4_t b, fp32x4_t& c) {
asm volatile("v_mfma_f32_16x16x16_bf16 %0, %1, %2, %0"
: "+v"(c) : "v"(a), "v"(b));
The "+v"(c) constraint ties the accumulator input and output to the same VGPR. No copy instruction is emitted. This keeps the kernel close to ordinary HIP. It still steers the machine one instruction at a time.
The Architecture: Eight Waves, Two Groups, Two Barriers
A CDNA3 compute unit has four SIMD units. The textbook block is four waves. MoonMath instead runs eight waves per block, in two groups of four.
The two groups run the same Q*K , softmax, O += P*V sequence. They are offset by a phase. While one group saturates the matrix core, the other runs softmax and issues loads. Then they swap, so the matrix core never idles.
There are two s_barrier s per iteration. One sits at the phase handoff. One sits at the iteration boundary. Per-counter waits handle the rest of the synchronization.
This echoes FlashAttention-3’s matmul and softmax alternation. It does not copy FA3’s producer and consumer warp split. On CDNA3, every memory move is already asynchronous, so a dedicated producer wave is unnecessary.
Where Data Lives, and Why 16×16×16
Most of the speedup comes from memory placement. K streams from HBM into LDS, double-buffered, shared by all eight waves. V stays hot in L1, read on every PV matmul. Q and accumulators live in registers.
The research team picked the 16×16×16 MFMA over 32×32×8. Both shapes have identical throughput. The smaller tile accumulates into 4 fp32 elements per lane, against 16. Lower accumulator pressure leaves room for deeper prefetch and a third Q tile.
Decision Choice Reason
Waves per block 8 (two groups of 4) Plan the pipeline directly; share one K copy
MFMA shape 16×16×16 bf16 Same throughput, lower VGPR pressure, better power efficiency
K placement LDS, double-buffered, 32 KiB Shared by all 8 waves, swapped per iteration
V placement L1, resident, prefetched Reread across PV, kept hot deliberately
Q + accumulators VGPRs Read every iteration, never reloaded
Two later wins close the gap. A third Q tile (3Q) raises data reuse per loaded K and V tile. A Flash-Decoding-style tail KV split rescues the stranded fractional round across MI300X’s 304 CUs. These wins cascade. Moving V to L1 freed the LDS that the third Q tile then fills.
Benchmark
Tests ran on MI300X in bf16, head dimension 128. Each shape was measured at three rounding modes. RTNE rounds to nearest even. RTNA rounds to nearest, ties away from zero. RTZ truncates toward zero.
Shape (B, H, S, D) Round Ours (ms) AITER v3 (ms) vs AITER vs MAX
(2, 24, 8192, 128) RTNE 3.083 3.792 1.23× 1.37×
(2, 24, 16384, 128) RTNE 11.670 14.691 1.26× 1.54×
(4, 16, 16384, 128) RTZ 15.055 16.183 1.07× 1.47×
(2, 24, 32768, 128) RTNA 44.440 52.363 1.18× 1.57×
(1, 16, 131072, 128) RTNE 232.517 269.278 1.16× 1.46×
Geomeans across the sweep favor MoonMath. Versus AITER, it scores 1.18× (RTNE), 1.15× (RTNA), and 1.08× (RTZ). Versus Modular MAX, geomeans run 1.44× to 1.49×, and per-shape speedups reach 1.59×.
RTZ is AITER’s own fastest mode and the tightest race. The (4, 16, 16384) RTZ shape moved from 0.95× to 1.07×. The tail KV split is what closed that final gap.
Interactive Explainer
Use Cases
The kernel installs with pip and exposes a small API. It launches on the caller’s stream, so it overlaps inside larger pipelines.
Copy Code Copied Use a different Browser
import torch
import moonmath_attention as ma
# PyTorch's ROCm build uses the "cuda" device string on AMD GPUs
q = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
k = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
v = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device="cuda")
out = ma.forward(q, k, v, layout="bshd")
out_rtz = ma.forward(q, k, v, layout="bshd", round_mode="rtz")
One concrete use case is video diffusion. The team added LiteAttention support and sent a PR to SGLang diffusion. On Wan2.1-T2V-1.3B-Diffusers, they switched attention from AITER to liteattention_rocm . End-to-end generation improved by 1.23× on MI300X, with no visible quality regression.
The BSHD layout suits diffusion tensors directly. Cross-attention works with any KV length and no padding.
Key Takeaways
The kernel is bf16 forward attention for MI300X, written in HIP under MIT.
It beats AITER v3 on every shape and rounding mode, geomean 1.18×/1.15×/1.08×.
One-instruction asm wrappers give opcode control while the compiler allocates registers.
Memory placement drove most of the gain: K in LDS, V hot in L1, Q in registers.
A real SGLang PR sped up Wan2.1 video diffusion by 1.23× with no quality regression.
Check out the Technical details . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
tinyfish.ai Open Source
Big Set
Describe your ideal dataset in plain English, and BigSet builds it.
dataset.build() auto&middot;refresh
Explore on GitHub &rarr;

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":7766,"paragraph_count":69,"sentence_count":95,"boilerplate_hits":2,"symbol_ratio":0.0059,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   MoonMath AI 团队开源了一款 bf16 前向注意力核，专为 AMD MI300X（gfx942）设计，使用 HIP 编写，MIT 许可。该核在所有测试形状和三种舍入模式下均超越 AMD 官方 AITER v3：几何平均加速比 1.18×（RTNE）、1.15×（RTNA）、1.08×（RTZ），最高单形状 1.26×。性能提升来自单指令 asm 包装和内存布局优化--K 置于 LDS，V 常驻 L1，Q 和累加器保持在寄存器。该核已通过 SGLang PR 将 Wan2.1 视频扩散模型推理速度提升 1.23 倍，质量无损。当前仅支持 bf16、头维度固定 128，无因果掩码、GQA 或变长批处理。

2. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Editors Pick New Releases Open Source Software Engineering Staff Tech News MoonMath AI team has released a bf16 forward attention kernel for AMD’s MI300X GPU.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   It is written in HIP, not hand-written assembly.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   The code is open-source under the MIT license.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Bare-metal access came from HotAisle, an AMD cloud provider.

## business_elements

- companies: MarkTechPost（RSS）, GitHub
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 暂无公开信息
- business_actions: 发布 / 推出, 合作 / 联盟, 融资 / 投资
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 300X, 3
M, 16, 942, 3, 1.18, 1.15, 1.08
- quotes: v_mfma_f32_16x16x16_bf16 %0, %1, %2, %0 / (b));
The  /  device string on AMD GPUs
q = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device= / )
k = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device= / )
v = torch.randn(2, 8192, 24, 128, dtype=torch.bfloat16, device=

## evidence_seed

- company_actions: It is written in HIP, not hand-written assembly. / The code is open-source under the MIT license. / ai team reports it beats AITER v3, AMD’s own optimized kernel, on every tested shape.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 5
- importance_reason: technical trend or capability shift; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 4
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool

## missing_information

- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"MoonMath AI 开源 AMD MI300X 注意力核，全面超越 AITER v3","discovery_summary":"MoonMath AI 团队开源了一款 bf16 前向注意力核，专为 AMD MI300X（gfx942）设计，使用 HIP 编写，MIT 许可。该核在所有测试形状和三种舍入模式下均超越 AMD 官方 AITER v3：几何平均加速比 1.18×（RTNE）、1.15×（RTNA）、1.08×（RTZ），最高单形状 1.26×。性能提升来自单指令 asm 包装和内存布局优化--K 置于 LDS，V 常驻 L1，Q 和累加器保持在寄存器。该核已通过 SGLang PR 将 Wan2.1 视频扩散模型推理速度提升 1.23 倍，质量无损。当前仅支持 bf16、头维度固定 128，无因果掩码、GQA 或变长批处理。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/22/moonmath-ai-open-sources-a-hip-attention-kernel-for-amd-mi300x-that-beats-aiter-v3-on-every-shape-and-rounding-mode","discovered_at":"2026-06-23T01:57:11.635Z","rank_on_page":234,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

MoonMath AI 团队开源了一款 bf16 前向注意力核，专为 AMD MI300X（gfx942）设计，使用 HIP 编写，MIT 许可。该核在所有测试形状和三种舍入模式下均超越 AMD 官方 AITER v3：几何平均加速比 1.18×（RTNE）、1.15×（RTNA）、1.08×（RTZ），最高单形状 1.26×。性能提升来自单指令 asm 包装和内存布局优化--K 置于 LDS，V 常驻 L1，Q 和累加器保持在寄存器。该核已通过 SGLang PR 将 Wan2.1 视频扩散模型推理速度提升 1.23 倍，质量无损。当前仅支持 bf16、头维度固定 128，无因果掩码、GQA 或变长批处理。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
