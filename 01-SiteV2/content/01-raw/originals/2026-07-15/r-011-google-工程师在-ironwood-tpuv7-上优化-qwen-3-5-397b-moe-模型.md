---
schema_version: raw-evidence-v2
raw_id: R-011
title: "Google 工程师在 Ironwood （TPUv7） 上优化 Qwen 3.5-397B MoE 模型"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://developers.googleblog.com/systems-engineering-playbook-optimizing-qwen-35-397b-moe-on-ironwood-tpu7x"
canonical_url: "https://developers.googleblog.com/systems-engineering-playbook-optimizing-qwen-35-397b-moe-on-ironwood-tpu7x"
source_name: "Google Developers Blog（RSS）"
source_type: official
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
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
published_at: "2026-07-14T00:00:00.000Z"
collected_at: 2026-07-15T04:28:37.577Z
language: mixed
full_text_hash: 91eb4b8a1cd4ab06
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-011-google-工程师在-ironwood-tpuv7-上优化-qwen-3-5-397b-moe-模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-011-google-工程师在-ironwood-tpuv7-上优化-qwen-3-5-397b-moe-模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":30466,"paragraph_count":141,"sentence_count":194,"boilerplate_hits":0,"symbol_ratio":0.0014,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 30466
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"91eb4b8a1cd4ab06","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Google 工程师在 Ironwood （TPUv7） 上优化 Qwen 3.5-397B MoE 模型","discovery_summary":"Google 工程师为在 Ironwood （TPUv7） 上部署 397B 参数的 Qwen 3.5 MoE 模型，开发了一套模块化 JAX/Pallas 优化栈。通过混合数据并行与专家并行（DP+EP）拓扑绕过硬件分片限制，结合层级化 reduce-scatter 等自定义底层通信融合优化跨设备 token 路由，并利用硬件感知的自定义内核（如 Batched Ragged Page Attention 和全融合 Gated DeltaNet 块），最终在 prefill 密集型负载上实现了高达 4.7 倍的推理加速，使系统吞吐量接近理论 roofline 极限。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/systems-engineering-playbook-optimizing-qwen-35-397b-moe-on-ironwood-tpu7x","discovered_at":"2026-07-15T04:20:27.093Z","rank_on_page":130,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: abcea663a4148a73
content_hash: bd5e00348327aea9
semantic_hash: ffff13329dd7dd20
duplicate_of: ""
first_seen_at: "2026-07-14T00:00:00.000Z"
last_seen_at: 2026-07-15T04:28:37.577Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"AI hardware scenario or service deployment; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","ai_hardware_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Google Developers Blog（RSS）","Google"],"products":[],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["计费 / 预算管理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["7","3.5","397B","3.5 M","4.7 倍","7x","14","2026"],"quotes":[]}
evidence_seed: {"company_actions":["Systems Engineering Playbook: Optimizing Qwen 3.","5-397B on specialized hardware accelerators presents significant systems engineering challenges.","Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Google 工程师为在 Ironwood （TPUv7） 上部署 397B 参数的 Qwen 3.5 MoE 模型，开发了一套模块化 JAX/Pallas 优化栈。通过混合数据并行与专家并行（DP+EP）拓扑绕过硬件分片限制，结合层级化 reduce-scatter 等自定义底层通信融合优化跨设备 token 路由，并利用硬件感知的自定义内核（如 Batched Ragged Page Attention 和全融合 Gated DeltaNet 块），最终在 prefill 密集型负载上实现了高达 4.7 倍的推理加速，使系统吞吐量接近理论 roofline 极限。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Systems Engineering Playbook: Optimizing Qwen 3.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"number","text":"5-397B MoE on Ironwood (TPU7x) JULY 14, 2026 Google for Developers Share Facebook Twitter LinkedIn Mail Executive Summary Deploying and serving a Mixture-of-Experts (MoE) model like Qwen3.","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"5-397B on specialized hardware accelerators presents significant systems engineering challenges.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Crucially, as the landscape of open-weights models grows in complexity, engineering teams can no longer afford to spend months optimizing each new model family in isolation.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-15T04:28:37.577Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Google 工程师在 Ironwood （TPUv7） 上优化 Qwen 3.5-397B MoE 模型

## clean_text

Systems Engineering Playbook: Optimizing Qwen 3.5-397B MoE on Ironwood (TPU7x)
JULY 14, 2026
Google for Developers
Share
Facebook
Twitter
LinkedIn
Mail
Executive Summary
Deploying and serving a Mixture-of-Experts (MoE) model like Qwen3.5-397B on specialized hardware accelerators presents significant systems engineering challenges. Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications.
Crucially, as the landscape of open-weights models grows in complexity, engineering teams can no longer afford to spend months optimizing each new model family in isolation. To solve this scalability challenge, our performance team has pioneered a modular, model-agnostic optimization strategy. Rather than tackling models as monolithic systems, we decompose them into self-contained, independent building blocks (such as Batched RPA, Grouped GEMMs, and SparseCore unpermutation) accompanied by hardware-aware cost models. When a new architecture arrives, these pre-optimized modules are ported with near-zero engineering friction. This allows our engineers to deliver state-of-the-art serving performance well ahead of initial projections, shifting our focus from localized model optimization to global, platform-level scalability.
This technical report details how we systematically applied this global optimization playbook to Qwen 3.5 MoE on the Ironwood (TPU v7x) platform. By leveraging our library of reusable JAX/Pallas kernels and targeting only Qwen 3.5’s novel components—such as Gated DeltaNet (GDN) linear attention and Attention Data Parallelism—our team achieved significant performance uplift for both decode-heavy and prefill-heavy workloads.
The optimizations discussed below allowed us to improve inference performance by approximately 3.1x for Decode-heavy and by approximately 4.7x for Prefill-heavy workloads (512 Concurrency tier) between April and June 2026. Furthermore, by integrating these modular optimizations natively into open-source serving frameworks like vLLM and SGLang, we have neutralized legacy software barriers, providing a seamless, production-ready migration path for global enterprise workloads at scale.
1. Qwen 3.5 Architecture Overview & Model Configuration
The model consists of 397 billion total parameters, but leverages a highly sparse routing scheme that activates exactly 17 billion parameters per token per forward pass. This sparse configuration represents a 4.3% routing activation ratio, enabling the model to deliver the expressive capacity and intelligence of a 400B-class model while maintaining the inference footprint and execution speed of a much smaller 20B-class system.
The official model weights and configuration can be accessed directly via the Qwen3.5-397B-A17B Hugging Face Repository . For a comprehensive structural analysis of Qwen 3.5's hybrid linear attention and gating components, see the technical deep-dives on Qwen3.5: Nobody Agrees on Attention Anymore (Hugging Face Blog) and Gated DeltaNet for Linear Attention (Sebastian Raschka, PhD) .
Architectural Layout & Interleaving
The network consists of 60 layers in total, hidden dimension D=4096, and a padded vocabulary size of 248,320 tokens. Rather than utilizing a uniform Transformer layer stack, Qwen 3.5 employs a highly customized hybrid layout composed of 15 repeating structural blocks. Each block is arranged in a 3:1 ratio:
Gated DeltaNet Layers (75% of layers): 3 consecutive layers that combine Gated DeltaNet (linear attention) with routed sparse MoE.
Grouped Query Attention (GQA) Layers (25% of layers): 1 layer of standard GQA coupled with routed sparse MoE.
This repeating sequence can be expressed as:
Key Mathematical Elements
The model's hybrid nature integrates three distinct mathematical formulations:
Gated DeltaNet (GDN)
Standard self-attention mechanisms scale quadratically with sequence length ( O(S 2 ) ), creating a computational bottleneck for long-context generation. GDN solves this by computing linear attention, utilizing 64 linear attention heads for Values (V) and 16 heads for Queries and Keys (QK) with a head dimension of 128. Instead of constructing a pairwise softmax attention matrix, GDN maintains a constant-sized hidden state matrix per head (matching the d k d v key-value dimensions) that functions as a recurrent memory.
At each token step t , the state matrix is updated using the delta rule:
Where q t , k t , and v t are the query, key, and value vectors, and t is a learned gating parameter. This recurrent update is preceded by a causal 1D convolution ( K =4) to capture local spatial dependencies. This recurrent formulation allows the context window to scale linearly ( O(S) ) in memory, keeping the recurrent state footprint constant.
2. Grouped Query Attention (GQA)
To anchor the linear attention retrieval, the model uses standard GQA in 25% of its layers. GQA uses 32 query heads ( N q =32) and exactly 2 key-value (KV) heads ( N kv =2) globally, with a head dimension of 256 and a Rotary Position Embedding (RoPE) dimension of 64. This extreme GQA layout compresses the KV cache footprint during generation, but imposes strict hardware-level sharding constraints, as detailed in Section 3.
3. Sparse Mixture-of-Experts (MoE)
The feed-forward network (FFN) layers are sharded into 512 small experts with an intermediate expert dimension of 1024. During execution, a router gate projects token representations and selects the top 10 routed experts via a soft-max probability distribution. Crucially, the model also incorporates one shared expert path that is always executed, functioning as a common representation layer:
This native multimodal MoE architecture natively processes text, image, and video inputs via an early-fusion training paradigm on trillions of multimodal tokens. The context window supports a native context length of 262,144 tokens, extensible to over 1,010,000 tokens using YaRN RoPE scaling.
2. Benchmark Setup & Workload Configurations
To systematically isolate, profile, and resolve compiler and kernel bottlenecks, the systems engineering team established a rigorous multi-dimensional evaluation matrix based on real-world, asymmetric workloads.
The Multi-Dimensional Evaluation Matrix
Our benchmarking sweeps across asymmetric workloads designed to stress separate hardware execution subsystems:
Prefill-Heavy Workloads (8K Input / 1K Output): Characterized by long input prompt sequences and short token generation outputs. These workloads are compute-bound and heavily stress the physical floating-point matrix multiplication capacity of the TPU’s TensorCore Matrix Execution Units (MXUs).
Decode-Heavy Workloads (1K Input / 8K Output): Characterized by short input prompts and prolonged token-by-token generation phases. These workloads are memory-bound, as the system must continuously stream all 400 GB of parameters from High Bandwidth Memory (HBM) to the execution cores to generate a single token per request.
Concurrency Tiers: To observe system scaling curves and identify hardware queuing/memory bottlenecks under load, both workloads are evaluated across four concurrency tiers: 64, 128, 256, and 512 concurrent requests.
Mixed-Engine Orchestration & Topology
The benchmark was executed on an enterprise-grade single-host cluster:
Accelerator Topology: A single physical host housing 4 physical Ironwood chips. Each physical chip is composed of 2 logical chiplets, exposing a logical topology of 8 distinct execution cores (devices) interconnected via a high-speed, sub-microsecond Inter-Chip Interconnect (ICI) plane.
Inference Server Engine: Engineered using vllm-project/tpu-inference . For the final optimized runs utilizing Attention DP, the server execution loop was configured with --max-num-batched-tokens=1024 and --max-num-seqs=64 per core (compared to --max-num-batched-tokens=8192 and --max-num-seqs=512 utilized in early tensor-parallel baselines).
Metrics Tracking: Performance is tracked and reported as Token-Throughput-per-Chip (TPS/chip), calculated as the total tokens processed (input + output) divided by the execution duration and the number of physical chips (4).
3. Sharding Strategies & Distributed Collectives
The specific architectural constraints of Qwen 3.5—namely, having exactly 2 KV heads in the GQA layers and 512 experts in the MoE layers—invalidate traditional uniform sharding approaches.
Parallelism Trade-offs: Tensor Parallelism vs. Data Parallelism
In standard Attention Tensor-Parallel (TP) + Expert MoE configurations, attention weights are sliced and sharded across the device dimension. However, attempting to shard the GQA layers with a tensor parallelism size of 8 (TP=8) forces fractional head sharding (2/8 = 0.25 heads per device), which is physically impossible on hardware.
Replicating the heads locally across 8 cores duplicates the physical KV cache memory footprint on every device, neutralizing the memory-saving benefits of GQA. This memory redundancy severely restricts the HBM headroom available for active KV caches under high-load workloads. This capacity limitation forces the server engine to cap the actual achieved concurrency far below expected targets—limiting the system to roughly ~200 concurrent requests instead of the planned 512.
To eliminate this bottleneck, we co-designed a hybrid sharding scheme ( PR #2577 ): 8-way Attention Batch Sharding (Data Parallelism, DP=8) combined with 8-way Expert Parallelism (EP=8) in the MoE layers.
Replicating GQA and GDN weights across all 8 devices allows each core to process attention locally with the full 2 KV heads, preserving local KV cache consistency and eliminating intra-attention sharding communication. In the feed-forward MoE layers, we switch to Expert Parallelism (EP=8). The 512 routed experts are distributed evenly (64 experts per device), which avoids duplicating the 400 GB parameter footprint across all nodes while keeping collective payload sizes manageable.
Deep Dive into Distributed Collective Sequences
Transitioning between Attention DP and MoE EP requires cross-device token routing. In designing our Mixture-of-Experts (MoE) routing layer, we evaluated two primary structural approaches to handle this cross-device transition:
Option A (All-to-All Shuffling): This approach utilizes an All-to-All -> Local MoE -> All-to-All pipeline. Tokens are dynamically shuffled across the network to the specific chips hosting their target experts, computed locally, and shuffled back. While this minimizes redundant computation, it incurs massive, unpredictable network routing overhead due to global All-to-All steps under variable workloads.
Option B (Full Token Replication): This approach utilizes an All - Gather -> Local MoE -> Reduce-Scatter pipeline. An All-Gather replicates all token vectors across all devices. Each chip then filters and computes inputs exclusively for its local experts, aggregating the outputs later via a Reduce-Scatter. This completely bypasses the unpredictable All-to-All routing penalties at the cost of higher local memory consumption.
Because deterministic latency is critical for real-world serving, we opted for Option B and subsequently developed low-level communication fusions to optimize its collective pathways.
1. The 3-to-2 All-Gather Optimization
Under a naive Option B implementation, preparing for local MoE computation requires broadcasting three distinct pieces of data across the cluster to every device rank. Assuming a local tensor slice with a shape of [1024,4096] for token hidden dimensions, we typically must perform three separate collective operations:
All-Gather 1: The token hidden dimensions ([1024,4096]).
All-Gather 2: The selected expert indices ([1024,10], assuming topk=10).
All-Gather 3: The gating topk weights ([1024,10]).
Every collective communication call carries a fixed kernel launch and network synchronization latency penalty on the TPU. To optimize Expert Parallelism (EP) efficiency, we consolidated these three All-Gathers down to two in PR #2836 . Because the expert indices (integers) and the topk weights (floats) share identical tensor shapes ([1024,10]), we stack, bitcast, and pack them together along a new dimension into a single dense 32-bit integer array (blob). This allows us to run a single All-Gather across the data dimension ( ShardingAxisName.MLP_DATA ) for both routing metadata blocks, unpacking them locally and halving the routing metadata collective latency.
2. Hierarchical Reduce-Scatter
After expert execution, token outputs must return to their data-parallel ranks. A standard All-Reduce over the 8-device mesh is highly inefficient. We replaced this with a custom, TPU-native Hierarchical Reduce-Scatter written in Pallas/Mosaic (see PR #2679 . The collective runs in two pipelined phases:
Intra-chip Reduce-Scatter: Logical chiplets on the same physical chip exchange and sum their data using fast, local shared-memory transfers (which are 6x faster than chip-to-chip ICI bandwidth).
Inter-chip Reduce-Scatter: Partially reduced data is exchanged across physical chips using a recursive-doubling hypercube algorithm over the TPU's physical ICI links.
To prevent VMEM Out-of-Memory (OOM) errors, the data is sliced into 2 to 4 micro-batches. The kernel pipelines remote DMA transfers of micro-batch i while the TensorCore is performing vector additions for micro-batch i -1, hiding the communication latency behind the compute.
4. Prefill vs. Decode Roofline Analysis
To identify the theoretical bounds of our systems engineering and understand where execution stalls occurred, we conducted a first-principles roofline analysis for the Qwen 3.5 workload under a standard 8K/1K configuration at 64 concurrency.
Ironwood Hardware Specifications
Tensor Core (TC) Frequency: 2.2 GHz
Tensor Cores per chip: 2
MXUs (Matrix Execution Units) per TC: 2 (total 4 MXUs per chip)
Peak BF16 performance: 2,307 TFLOPS/chip ((262,144 FLOP/cycle/MXU × 2.2 GHz × 4 MXUs = 2,307 TFLOPS))
Peak FP8 performance: 4,614 TFLOPS/chip
1. Prefill Phase (Compute-Bound)
During the prefill phase, a batch of 64 prompts with 8,192 input tokens each yields 524,288 tokens processed in parallel.
Arithmetic Intensity: The GEMM operations in the projection layers scale quadratically with sequence length and batch size. The arithmetic intensity (FLOPs/Byte) is extremely high, placing execution deep in the compute-bound regime of the roofline model.
Operational Boundary: Bounded by the peak floating-point execution capacity of the TPU v7 TensorCore MXUs (4,614 TFLOPS in FP8).
Systems Bottlenecks: MXU underutilization occurs primarily due to ragged token distribution across experts. If one expert receives significantly more tokens than others in a given batch, the corresponding device becomes a straggler. Minimizing padding in our Grouped GEMM kernels was critical to closing the gap between actual TFLOPS and the theoretical peak.
2. Decode Phase (Memory-Bound)
During the decode phase, the model processes 64 tokens per step (1 token per active request).
Arithmetic Intensity: To generate one token, the system must stream all 400 GB of model weights from HBM to the processor. The arithmetic intensity is near-unit (~1 FLOP/Byte) , placing the workload squarely in the memory-bound regime.
Operational Boundary: Bounded by the HBM memory bandwidth.
Systems Bottlenecks: The primary latency contributors are HBM transfer latency for model parameters, VPU indexing stalls during sparse KV cache retrieval, and recurrent state update round-trips in the Gated DeltaNet (GDN) layers.
Quantifying our Roofline Boundaries (BS=64)
To translate these first-principles hardware constraints into plannable software engineering metrics, we modeled our standard evaluation workload (Concurrency 64, with an 8K/1K prefill-heavy and 1K/8K decode-heavy sequence length layout) using our end-to-end roofline model. This analysis establishes the absolute, application-level throughput bounds (in tokens-per-second per physical chip) for each serving phase:
Prefill-Heavy Phase (8K Input / 1K Output): Because the prefill phase is compute-bound, it is limited by the peak floating-point execution capacity of the TensorCore Matrix Execution Units (MXUs) (4,614 TFLOPS FP8 per chip). Taking into account the quadratic scaling of GQA attention operations over 8,192 tokens and standard hardware execution overheads, our model establishes an estimated maximum theoretical roofline throughput of 5,170 tokens/s/chip (undiscounted), and 4,500 tokens/s/chip under standard scheduling de-rate factors.
Decode-Heavy Phase (1K Input / 8K Output): Because generating one token per active stream is memory-bound, performance is strictly limited by the HBM interface bandwidth. The total execution latency across all 60 layers is calculated at 16.36 ms per token step. This results in a peak theoretical throughput of 978 tokens/s/chip (undiscounted) and a realistic, discounted serving roofline limit of 850 tokens/s/chip .
Kernel Optimizations
"By authoring custom kernels using the JAX custom kernel language, Pallas, we bypassed the standard XLA lowering path to control VMEM layout, registers, and memory scheduling directly across the three primary execution tracks:
Attention Track: PR #1820 (RPA v3) and PR #1961 (Batched RPA)
MoE Track: PR #1688 (GMM v2) and PR #2137 (SparseCore Ragged Gather)
GDN Track: PR #2149 (Chunked GDN) and PR #3016 (Fully-Fused Conv1D and Recurrent / Chunked GDN)
By authoring custom kernels using the JAX custom kernel language, Pallas , we bypassed the standard XLA lowering path to control VMEM layout, registers, and memory scheduling directly.
A. Attention Track: Ragged Page Attention (RPA)
Managing the KV cache for the 25% GQA layers requires dynamic memory allocation. We employ Ragged Page Attention (RPA) to index non-contiguous memory blocks in HBM (see #PR 2632 ).
1. KV Page Size Tun

## full_text

Systems Engineering Playbook: Optimizing Qwen 3.5-397B MoE on Ironwood (TPU7x)
JULY 14, 2026
Google for Developers
Share
Facebook
Twitter
LinkedIn
Mail
Executive Summary
Deploying and serving a Mixture-of-Experts (MoE) model like Qwen3.5-397B on specialized hardware accelerators presents significant systems engineering challenges. Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications.
Crucially, as the landscape of open-weights models grows in complexity, engineering teams can no longer afford to spend months optimizing each new model family in isolation. To solve this scalability challenge, our performance team has pioneered a modular, model-agnostic optimization strategy. Rather than tackling models as monolithic systems, we decompose them into self-contained, independent building blocks (such as Batched RPA, Grouped GEMMs, and SparseCore unpermutation) accompanied by hardware-aware cost models. When a new architecture arrives, these pre-optimized modules are ported with near-zero engineering friction. This allows our engineers to deliver state-of-the-art serving performance well ahead of initial projections, shifting our focus from localized model optimization to global, platform-level scalability.
This technical report details how we systematically applied this global optimization playbook to Qwen 3.5 MoE on the Ironwood (TPU v7x) platform. By leveraging our library of reusable JAX/Pallas kernels and targeting only Qwen 3.5’s novel components—such as Gated DeltaNet (GDN) linear attention and Attention Data Parallelism—our team achieved significant performance uplift for both decode-heavy and prefill-heavy workloads.
The optimizations discussed below allowed us to improve inference performance by approximately 3.1x for Decode-heavy and by approximately 4.7x for Prefill-heavy workloads (512 Concurrency tier) between April and June 2026. Furthermore, by integrating these modular optimizations natively into open-source serving frameworks like vLLM and SGLang, we have neutralized legacy software barriers, providing a seamless, production-ready migration path for global enterprise workloads at scale.
1. Qwen 3.5 Architecture Overview & Model Configuration
The model consists of 397 billion total parameters, but leverages a highly sparse routing scheme that activates exactly 17 billion parameters per token per forward pass. This sparse configuration represents a 4.3% routing activation ratio, enabling the model to deliver the expressive capacity and intelligence of a 400B-class model while maintaining the inference footprint and execution speed of a much smaller 20B-class system.
The official model weights and configuration can be accessed directly via the Qwen3.5-397B-A17B Hugging Face Repository . For a comprehensive structural analysis of Qwen 3.5's hybrid linear attention and gating components, see the technical deep-dives on Qwen3.5: Nobody Agrees on Attention Anymore (Hugging Face Blog) and Gated DeltaNet for Linear Attention (Sebastian Raschka, PhD) .
Architectural Layout & Interleaving
The network consists of 60 layers in total, hidden dimension D=4096, and a padded vocabulary size of 248,320 tokens. Rather than utilizing a uniform Transformer layer stack, Qwen 3.5 employs a highly customized hybrid layout composed of 15 repeating structural blocks. Each block is arranged in a 3:1 ratio:
Gated DeltaNet Layers (75% of layers): 3 consecutive layers that combine Gated DeltaNet (linear attention) with routed sparse MoE.
Grouped Query Attention (GQA) Layers (25% of layers): 1 layer of standard GQA coupled with routed sparse MoE.
This repeating sequence can be expressed as:
Key Mathematical Elements
The model's hybrid nature integrates three distinct mathematical formulations:
Gated DeltaNet (GDN)
Standard self-attention mechanisms scale quadratically with sequence length ( O(S 2 ) ), creating a computational bottleneck for long-context generation. GDN solves this by computing linear attention, utilizing 64 linear attention heads for Values (V) and 16 heads for Queries and Keys (QK) with a head dimension of 128. Instead of constructing a pairwise softmax attention matrix, GDN maintains a constant-sized hidden state matrix per head (matching the d k d v key-value dimensions) that functions as a recurrent memory.
At each token step t , the state matrix is updated using the delta rule:
Where q t , k t , and v t are the query, key, and value vectors, and t is a learned gating parameter. This recurrent update is preceded by a causal 1D convolution ( K =4) to capture local spatial dependencies. This recurrent formulation allows the context window to scale linearly ( O(S) ) in memory, keeping the recurrent state footprint constant.
2. Grouped Query Attention (GQA)
To anchor the linear attention retrieval, the model uses standard GQA in 25% of its layers. GQA uses 32 query heads ( N q =32) and exactly 2 key-value (KV) heads ( N kv =2) globally, with a head dimension of 256 and a Rotary Position Embedding (RoPE) dimension of 64. This extreme GQA layout compresses the KV cache footprint during generation, but imposes strict hardware-level sharding constraints, as detailed in Section 3.
3. Sparse Mixture-of-Experts (MoE)
The feed-forward network (FFN) layers are sharded into 512 small experts with an intermediate expert dimension of 1024. During execution, a router gate projects token representations and selects the top 10 routed experts via a soft-max probability distribution. Crucially, the model also incorporates one shared expert path that is always executed, functioning as a common representation layer:
This native multimodal MoE architecture natively processes text, image, and video inputs via an early-fusion training paradigm on trillions of multimodal tokens. The context window supports a native context length of 262,144 tokens, extensible to over 1,010,000 tokens using YaRN RoPE scaling.
2. Benchmark Setup & Workload Configurations
To systematically isolate, profile, and resolve compiler and kernel bottlenecks, the systems engineering team established a rigorous multi-dimensional evaluation matrix based on real-world, asymmetric workloads.
The Multi-Dimensional Evaluation Matrix
Our benchmarking sweeps across asymmetric workloads designed to stress separate hardware execution subsystems:
Prefill-Heavy Workloads (8K Input / 1K Output): Characterized by long input prompt sequences and short token generation outputs. These workloads are compute-bound and heavily stress the physical floating-point matrix multiplication capacity of the TPU’s TensorCore Matrix Execution Units (MXUs).
Decode-Heavy Workloads (1K Input / 8K Output): Characterized by short input prompts and prolonged token-by-token generation phases. These workloads are memory-bound, as the system must continuously stream all 400 GB of parameters from High Bandwidth Memory (HBM) to the execution cores to generate a single token per request.
Concurrency Tiers: To observe system scaling curves and identify hardware queuing/memory bottlenecks under load, both workloads are evaluated across four concurrency tiers: 64, 128, 256, and 512 concurrent requests.
Mixed-Engine Orchestration & Topology
The benchmark was executed on an enterprise-grade single-host cluster:
Accelerator Topology: A single physical host housing 4 physical Ironwood chips. Each physical chip is composed of 2 logical chiplets, exposing a logical topology of 8 distinct execution cores (devices) interconnected via a high-speed, sub-microsecond Inter-Chip Interconnect (ICI) plane.
Inference Server Engine: Engineered using vllm-project/tpu-inference . For the final optimized runs utilizing Attention DP, the server execution loop was configured with --max-num-batched-tokens=1024 and --max-num-seqs=64 per core (compared to --max-num-batched-tokens=8192 and --max-num-seqs=512 utilized in early tensor-parallel baselines).
Metrics Tracking: Performance is tracked and reported as Token-Throughput-per-Chip (TPS/chip), calculated as the total tokens processed (input + output) divided by the execution duration and the number of physical chips (4).
3. Sharding Strategies & Distributed Collectives
The specific architectural constraints of Qwen 3.5—namely, having exactly 2 KV heads in the GQA layers and 512 experts in the MoE layers—invalidate traditional uniform sharding approaches.
Parallelism Trade-offs: Tensor Parallelism vs. Data Parallelism
In standard Attention Tensor-Parallel (TP) + Expert MoE configurations, attention weights are sliced and sharded across the device dimension. However, attempting to shard the GQA layers with a tensor parallelism size of 8 (TP=8) forces fractional head sharding (2/8 = 0.25 heads per device), which is physically impossible on hardware.
Replicating the heads locally across 8 cores duplicates the physical KV cache memory footprint on every device, neutralizing the memory-saving benefits of GQA. This memory redundancy severely restricts the HBM headroom available for active KV caches under high-load workloads. This capacity limitation forces the server engine to cap the actual achieved concurrency far below expected targets—limiting the system to roughly ~200 concurrent requests instead of the planned 512.
To eliminate this bottleneck, we co-designed a hybrid sharding scheme ( PR #2577 ): 8-way Attention Batch Sharding (Data Parallelism, DP=8) combined with 8-way Expert Parallelism (EP=8) in the MoE layers.
Replicating GQA and GDN weights across all 8 devices allows each core to process attention locally with the full 2 KV heads, preserving local KV cache consistency and eliminating intra-attention sharding communication. In the feed-forward MoE layers, we switch to Expert Parallelism (EP=8). The 512 routed experts are distributed evenly (64 experts per device), which avoids duplicating the 400 GB parameter footprint across all nodes while keeping collective payload sizes manageable.
Deep Dive into Distributed Collective Sequences
Transitioning between Attention DP and MoE EP requires cross-device token routing. In designing our Mixture-of-Experts (MoE) routing layer, we evaluated two primary structural approaches to handle this cross-device transition:
Option A (All-to-All Shuffling): This approach utilizes an All-to-All -> Local MoE -> All-to-All pipeline. Tokens are dynamically shuffled across the network to the specific chips hosting their target experts, computed locally, and shuffled back. While this minimizes redundant computation, it incurs massive, unpredictable network routing overhead due to global All-to-All steps under variable workloads.
Option B (Full Token Replication): This approach utilizes an All - Gather -> Local MoE -> Reduce-Scatter pipeline. An All-Gather replicates all token vectors across all devices. Each chip then filters and computes inputs exclusively for its local experts, aggregating the outputs later via a Reduce-Scatter. This completely bypasses the unpredictable All-to-All routing penalties at the cost of higher local memory consumption.
Because deterministic latency is critical for real-world serving, we opted for Option B and subsequently developed low-level communication fusions to optimize its collective pathways.
1. The 3-to-2 All-Gather Optimization
Under a naive Option B implementation, preparing for local MoE computation requires broadcasting three distinct pieces of data across the cluster to every device rank. Assuming a local tensor slice with a shape of [1024,4096] for token hidden dimensions, we typically must perform three separate collective operations:
All-Gather 1: The token hidden dimensions ([1024,4096]).
All-Gather 2: The selected expert indices ([1024,10], assuming topk=10).
All-Gather 3: The gating topk weights ([1024,10]).
Every collective communication call carries a fixed kernel launch and network synchronization latency penalty on the TPU. To optimize Expert Parallelism (EP) efficiency, we consolidated these three All-Gathers down to two in PR #2836 . Because the expert indices (integers) and the topk weights (floats) share identical tensor shapes ([1024,10]), we stack, bitcast, and pack them together along a new dimension into a single dense 32-bit integer array (blob). This allows us to run a single All-Gather across the data dimension ( ShardingAxisName.MLP_DATA ) for both routing metadata blocks, unpacking them locally and halving the routing metadata collective latency.
2. Hierarchical Reduce-Scatter
After expert execution, token outputs must return to their data-parallel ranks. A standard All-Reduce over the 8-device mesh is highly inefficient. We replaced this with a custom, TPU-native Hierarchical Reduce-Scatter written in Pallas/Mosaic (see PR #2679 . The collective runs in two pipelined phases:
Intra-chip Reduce-Scatter: Logical chiplets on the same physical chip exchange and sum their data using fast, local shared-memory transfers (which are 6x faster than chip-to-chip ICI bandwidth).
Inter-chip Reduce-Scatter: Partially reduced data is exchanged across physical chips using a recursive-doubling hypercube algorithm over the TPU's physical ICI links.
To prevent VMEM Out-of-Memory (OOM) errors, the data is sliced into 2 to 4 micro-batches. The kernel pipelines remote DMA transfers of micro-batch i while the TensorCore is performing vector additions for micro-batch i -1, hiding the communication latency behind the compute.
4. Prefill vs. Decode Roofline Analysis
To identify the theoretical bounds of our systems engineering and understand where execution stalls occurred, we conducted a first-principles roofline analysis for the Qwen 3.5 workload under a standard 8K/1K configuration at 64 concurrency.
Ironwood Hardware Specifications
Tensor Core (TC) Frequency: 2.2 GHz
Tensor Cores per chip: 2
MXUs (Matrix Execution Units) per TC: 2 (total 4 MXUs per chip)
Peak BF16 performance: 2,307 TFLOPS/chip ((262,144 FLOP/cycle/MXU × 2.2 GHz × 4 MXUs = 2,307 TFLOPS))
Peak FP8 performance: 4,614 TFLOPS/chip
1. Prefill Phase (Compute-Bound)
During the prefill phase, a batch of 64 prompts with 8,192 input tokens each yields 524,288 tokens processed in parallel.
Arithmetic Intensity: The GEMM operations in the projection layers scale quadratically with sequence length and batch size. The arithmetic intensity (FLOPs/Byte) is extremely high, placing execution deep in the compute-bound regime of the roofline model.
Operational Boundary: Bounded by the peak floating-point execution capacity of the TPU v7 TensorCore MXUs (4,614 TFLOPS in FP8).
Systems Bottlenecks: MXU underutilization occurs primarily due to ragged token distribution across experts. If one expert receives significantly more tokens than others in a given batch, the corresponding device becomes a straggler. Minimizing padding in our Grouped GEMM kernels was critical to closing the gap between actual TFLOPS and the theoretical peak.
2. Decode Phase (Memory-Bound)
During the decode phase, the model processes 64 tokens per step (1 token per active request).
Arithmetic Intensity: To generate one token, the system must stream all 400 GB of model weights from HBM to the processor. The arithmetic intensity is near-unit (~1 FLOP/Byte) , placing the workload squarely in the memory-bound regime.
Operational Boundary: Bounded by the HBM memory bandwidth.
Systems Bottlenecks: The primary latency contributors are HBM transfer latency for model parameters, VPU indexing stalls during sparse KV cache retrieval, and recurrent state update round-trips in the Gated DeltaNet (GDN) layers.
Quantifying our Roofline Boundaries (BS=64)
To translate these first-principles hardware constraints into plannable software engineering metrics, we modeled our standard evaluation workload (Concurrency 64, with an 8K/1K prefill-heavy and 1K/8K decode-heavy sequence length layout) using our end-to-end roofline model. This analysis establishes the absolute, application-level throughput bounds (in tokens-per-second per physical chip) for each serving phase:
Prefill-Heavy Phase (8K Input / 1K Output): Because the prefill phase is compute-bound, it is limited by the peak floating-point execution capacity of the TensorCore Matrix Execution Units (MXUs) (4,614 TFLOPS FP8 per chip). Taking into account the quadratic scaling of GQA attention operations over 8,192 tokens and standard hardware execution overheads, our model establishes an estimated maximum theoretical roofline throughput of 5,170 tokens/s/chip (undiscounted), and 4,500 tokens/s/chip under standard scheduling de-rate factors.
Decode-Heavy Phase (1K Input / 8K Output): Because generating one token per active stream is memory-bound, performance is strictly limited by the HBM interface bandwidth. The total execution latency across all 60 layers is calculated at 16.36 ms per token step. This results in a peak theoretical throughput of 978 tokens/s/chip (undiscounted) and a realistic, discounted serving roofline limit of 850 tokens/s/chip .
Kernel Optimizations
"By authoring custom kernels using the JAX custom kernel language, Pallas, we bypassed the standard XLA lowering path to control VMEM layout, registers, and memory scheduling directly across the three primary execution tracks:
Attention Track: PR #1820 (RPA v3) and PR #1961 (Batched RPA)
MoE Track: PR #1688 (GMM v2) and PR #2137 (SparseCore Ragged Gather)
GDN Track: PR #2149 (Chunked GDN) and PR #3016 (Fully-Fused Conv1D and Recurrent / Chunked GDN)
By authoring custom kernels using the JAX custom kernel language, Pallas , we bypassed the standard XLA lowering path to control VMEM layout, registers, and memory scheduling directly.
A. Attention Track: Ragged Page Attention (RPA)
Managing the KV cache for the 25% GQA layers requires dynamic memory allocation. We employ Ragged Page Attention (RPA) to index non-contiguous memory blocks in HBM (see #PR 2632 ).
1. KV Page Size Tuning
Historically, a block size of 16 tokens was used to minimize memory fragmentation. However, on TPU, smaller block sizes result in massive indexing overhead, causing the Vector Processing Unit (VPU) to stall during the decode phase. We resolved this by coarse-graining the indexing to a KV page size of 256 (enabled via the server command --block-size=256 ). This coarse-grained indexing reduced the decode step latency under Concurrency-512 from 428µs to 283µs, achieving a 33.8% kernel-level speedup.
2. Batched RPA
To further saturate the memory bus, we designed batched RPA kernels. This design groups multiple decode streams together into a single compiled Pallas kernel ( #PR 2632 ), amortizing VPU instruction dispatch latency, breaking the data dependency stalls of sequential requests, and improving memory alignment.
B. MoE Track: SparseCore & TensorCore Co-Design
The fine-grained routing factor of top_k=10 in Qwen 3.5 introduces non-power-of-two tensor dimensions. Permuting and unpermuting these arrays on the TensorCore previously resulted in heavily padded, unaligned HBM memory writes. We resolved this through a SparseCore-TensorCore co-design flow:
1. Custom SparseCore Ragged Gather Kernel
We authored a custom Pallas/Mosaic kernel that offloads token routing to the TPU's SparseCore (SC), a hardware unit optimized for indirect addressing (see PR #2137 ). The SC reads the routing indices, performs an indirect DMA gather of token embeddings directly from HBM, and writes them into a contiguous virtual buffer. This bypasses the materialization of heavily-padded, unaligned intermediate tensors in HBM, saving massive memory bandwidth.
2. Grouped GEMM (GMM) V2 with Fused Activation
In the GMM V2 kernel, we fused the SwiGLU activation functions directly into the main matrix multiplication loops (gating and up-projection are packed and processed in a single tile via dual DMA reads), avoiding register spills to HBM. Additionally, we implemented dynamic bounded slices to process the variable token payloads of each expert with minimal padding. We transitioned to 512 subchannel activation quantization for FP8 operations to eliminate VREG spills and memory load stalls, doubling vector arithmetic throughput on the VPU.
3. Fused Ragged Gather Reduce Kernel
Offloads the token-unpermutation and local reduction operations entirely to the SparseCore. By performing indirect gather and local reduction directly on the SC, we bypassed the materialization of intermediate, padded activation tensors in HBM, reducing the HBM read requirements from 20 down to 10 and writes from 15 down to 5, slashing MoE overhead.
To maximize hardware efficiency, our implementation leverages a chunk-level pipelined architecture rather than performing local reduction and the 8-device Reduce-Scatter sequentially on the full [81920,4096] tensor. The workload is partitioned into 4 distinct chunks. As soon as Chunk 1 completes its local unpermutation and gather-reduce on the SparseCore, it asynchronously kicks off its Reduce-Scatter collective across physical ICI links. Simultaneously, the SparseCore begins the local gather-reduce for Chunk 2. This strict chunk-level pipelining effectively overlaps and hides the cross-device network latency of the Reduce-Scatter behind the local compute of subsequent chunks.
C. GDN Track: Gated DeltaNet Optimization
The recurrent state updates in the 75% Gated DeltaNet (GDN) layers are highly susceptible to memory bandwidth bottlenecks due to constant recurrent state updates
To optimize this track, the performance team implemented a series of algorithmic fusions and precision co-designs:
1. Causal Conv1D Fusion
The GDN recurrent update is preceded by a causal 1D convolution ( K =4). Initially, this was compiled as an independent operation, forcing the intermediate convolution outputs to be written to and read from HBM. We designed a register-level sliding window algorithm that caches historical token states directly within the TPU's VPU registers. Fusing the 1D convolution and the GDN recurrent state update into a single execution block eliminated 6 redundant HBM round-trips (see PR #2823 ).
2. Algebraic Identity Optimizations
We restructured the linear attention update equations to exploit algebraic identities. By mathematically rearranging the operations, we completely skipped the expensive post-rank-1 matrix multiplication in the fused GDN kernels, reducing the computational footprint (see PR #2498 ).
Additionally, to further saturate the Vector Processing Unit (VPU), we transitioned the recurrent State Space Model (SSM) state variables from Float32 to BFloat16 precision. This doubled the vector arithmetic throughput on the VPU without compromising numerical convergence or output quality.
3. Ragged Sequence Handling & Chunked GDN
To prevent padding overhead from wasting MXU FLOPs during batched prefill execution, we optimized JAX-native chunked layouts in and introduced specialized sequence-handling routines that natively process ragged inputs in PR #2218 , ensuring that variable sequence lengths do not introduce processing stragglers.
4. Fully-Fused Conv1D and GDN Kernel
Rather than relying on separate execution stages, we designed and merged a fully-fused Pallas kernel in PR #3016 that compiles the causal 1D convolution and the entire GDN recurrent linear attention block into a single, unified execution unit on the VPU. By caching intermediate sequence and recurrent states directly within the local registers, this kernel completely bypasses the need to read and write intermediate activation tensors to VMEM or HBM.
This register-level fusion eliminates register-to-memory synchronization latency and provides a critical performance boost for both serving phases:
Prefill Phase: It significantly reduces the memory bandwidth footprint when processing long input sequence prompts, maximizing TensorCore MXU floating-point efficiency.
Decode Phase: It eliminates memory-bound round-trip stalls during prolonged token-by-token generation.
D. Memory Track: Hybrid Attention KV Layout Optimization
Serving Qwen 3.5 requires managing two heterogeneous attention state structures: the fixed-size recurrent linear attention state of Gated DeltaNet (GDN) and the dynamically growing standard attention Key-Value (KV) cache of Grouped Query Attention (GQA). Because the TPU v7 features 192GB of HBM capacity per chip (e.g. compared to the 288GB available on Blackwell GB300 GPUs - a ~50% capacity difference), HBM footprint optimization under high concurrency is a severe systems constraint. In PR #2416 , we introduced a custom memory layout designed to align and store these hybrid attention states together in HBM. This layout minimizes padding and prevents memory fragmentation, directly reclaiming critical HBM headroom. This optimization increases the maximum supportable batch sizes, allowing the TPU to scale smoothly and sustain high serving throughput under heavy client concurrencies.
6. Current Performance Results
The systems engineering optimizations were validated under rigorous, empirical benchmarking scenarios. Below, we present the raw throughput results with our optimized JAX/Pallas stack on Ironwood TPU across 4 concurrency tiers.
Closing the Headroom Gap: Actual Throughput vs. Roofline Limits
Placing our empirical serving results side-by-side with our first-principles roofline limits at the baseline Concurrency 64 tier demonstrates the real-world efficiency of our custom Pallas kernels and DP+EP sharding topology:
Prefill-Heavy Efficiency: Under the 8K/1K prefill-heavy workload, our JAX serving stack delivers an actual throughput of 3,707 tokens/s/chip . Compared to our estimated prefill roofline limit of 4,500 tokens/s/chip (discounted), our custom SparseCore and TensorCore co-designed GEMMs successfully extract 82.4% of the absolute compute capacity of the TPU v7 TensorCores.
Decode-Heavy Efficiency: Under the 1K/8K decode-heavy workload, our stack delivers an actual throughput of 677 tokens/s/chip . Compared to our memory-bound decode roofline limit of 850 tokens/s/chip (discounted), our Ragged Page Attention (RPA) and Gated DeltaNet (GDN) fusions successfully achieve 79.6% of the theoretical HBM bandwidth limit.
This close alignment demonstrates that our low-level compiler and kernel fusions push the TPU hardware close to its physical execution limits, leaving minimal remaining headroom and proving the extreme efficiency of the open-source software stack.
Rigorous Numerical Verification & Correctness
Running large-scale Mixture-of-Experts models at scale requires not just raw throughput, but strict mathematical correctness. Under high concurrency, gating and routing matrices are highly sensitive to low-precision accumulation errors. In designing our custom JAX/Pallas gating kernels, the systems engineering team incorporated a dedicated Numerical Verification Layer to audit accumulation precision across our FP8 scaling blocks. By continuously monitoring the softmax distribution ranges and expert load balances, we verified that our Pallas-lowered gating weights maintain zero deviation from the high-precision Float32 reference path (see PR #2328 and PR #2674 ), guaranteeing high throughput alongside strict output quality.
7. Future Optimizations Roadmap
To eliminate the remaining bottlenecks, our engineering team has structured an active optimization roadmap divided into two primary technical tracks:
1. Collectives Optimization Track
Low-Bandwidth FP8 All-Gather Collectives: We are designing low-bandwidth FP8 collectives for the Token/Metadata All-Gather step. Quantizing the routing metadata to FP8 prior to cross-node transmission will halve the communication volume over the physical ICI links, directly reducing the routing latency barrier.
Hierarchical Reduce-Scatter Tuning: We will continue to refine the block sizes and micro-batch pipelining parameters within the custom Hierarchical Reduce-Scatter kernel. Specifically, we aim to implement dynamic, token-dependent micro-batch sizing to optimize bandwidth utilization under variable routing distributions.
2. Kernel & Gating Fusion Track
Router Gate & Top-K Fusion: We plan to fuse the routing gate projection and the subsequent top_k selection kernel directly on the VPU. Currently, routing logits are computed on the TensorCore and transferred to the VPU for top_k selection, introducing a serialization bottleneck. Fusing these operations will keep the routing pipeline local to the VPU.
Conclusion
Optimizing massive open-weights models like Qwen 3.5 on modern accelerators is a challenge that cannot be solved by brute-force empirical changes. It requires a disciplined, first-principles systems engineering approach: mapping theoretical hardware limits via Roofline Modeling, systematically isolating bottlenecks through profile traces, and bridging the remaining gaps with hand-scheduled custom Pallas kernels and hardware-aware sharding topologies.
The optimization playbook developed for this deployment does more than just accelerate Qwen 3.5; it establishes a hardened, reusable open-source software stack that makes Google Cloud TPUs a highly general-purpose and competitive engine for the next generation of sparse Mixture-of-Experts architectures.
To explore our complete technical guides, access ready-to-run code templates, and learn more about optimizing frontier-class models on Google Cloud hardware, check out our new Google Cloud TPU Developer Hub .
Acknowledgements
This optimization work was a massive collaborative effort across multiple engineering, compiler, and management teams. We would like to express our gratitude to the following contributors who drove this initiative to success:
Engineering Team: Alyssa Nie, Amy Zhang, Clemens Schaefer, Daniel Ning, Dawn Han, Donghyun Cho, Gai Liu, George Polovets, Guangxiang Du, Guowei Jiang, Haowen Ning, Jacob Platin, Jaehong Kim, Jevin Jiang, Jiaxin Cao, Kunjan Patel, Kyuyeun Kim, Liqun Cheng, Mani Ananth, Ming Liu, Muhuan Huang, Patrick Ji, Pritha Doddahosahally Narayanappa, Qi Zhou, Qiliang Cui, Renee Zhu, Sanjay Gupta, Seher Ellis, Songyi Han, Srinath Mandalapu, Tomas Longeri, Vipan Nalla, Wangyuan Zhang, WenXin Dong, Wonpyo Park, Xiongfei Wei, Yijia Jin, Yixiu Liu, Yuyan Peng.
Program & Product Team : Brittany Rockwell, Krunal Sharma, Sayce Falk, Santosh D, Vivek Sharma and Max Sapo.
posted in:
Optimization
Pallas
Qwen 3.5
vLLM
MoE
JAX
kernel
TPU
Previous
Next

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":30466,"paragraph_count":141,"sentence_count":194,"boilerplate_hits":0,"symbol_ratio":0.0014,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Google 工程师为在 Ironwood （TPUv7） 上部署 397B 参数的 Qwen 3.5 MoE 模型，开发了一套模块化 JAX/Pallas 优化栈。通过混合数据并行与专家并行（DP+EP）拓扑绕过硬件分片限制，结合层级化 reduce-scatter 等自定义底层通信融合优化跨设备 token 路由，并利用硬件感知的自定义内核（如 Batched Ragged Page Attention 和全融合 Gated DeltaNet 块），最终在 prefill 密集型负载上实现了高达 4.7 倍的推理加速，使系统吞吐量接近理论 roofline 极限。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Systems Engineering Playbook: Optimizing Qwen 3.

3. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   5-397B MoE on Ironwood (TPU7x) JULY 14, 2026 Google for Developers Share Facebook Twitter LinkedIn Mail Executive Summary Deploying and serving a Mixture-of-Experts (MoE) model like Qwen3.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   5-397B on specialized hardware accelerators presents significant systems engineering challenges.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Crucially, as the landscape of open-weights models grows in complexity, engineering teams can no longer afford to spend months optimizing each new model family in isolation.

## business_elements

- companies: Google Developers Blog（RSS）, Google
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 计费 / 预算管理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 7, 3.5, 397B, 3.5 M, 4.7 倍, 7x, 14, 2026
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Systems Engineering Playbook: Optimizing Qwen 3. / 5-397B on specialized hardware accelerators presents significant systems engineering challenges. / Loading the 400 GB weight footprint into High Bandwidth Memory (HBM) and maximizing hardware utilization requires a disciplined, first-principles engineering methodology over empirical trial-and-error modifications.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: AI hardware scenario or service deployment; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,ai_hardware_lens,commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Google 工程师在 Ironwood （TPUv7） 上优化 Qwen 3.5-397B MoE 模型","discovery_summary":"Google 工程师为在 Ironwood （TPUv7） 上部署 397B 参数的 Qwen 3.5 MoE 模型，开发了一套模块化 JAX/Pallas 优化栈。通过混合数据并行与专家并行（DP+EP）拓扑绕过硬件分片限制，结合层级化 reduce-scatter 等自定义底层通信融合优化跨设备 token 路由，并利用硬件感知的自定义内核（如 Batched Ragged Page Attention 和全融合 Gated DeltaNet 块），最终在 prefill 密集型负载上实现了高达 4.7 倍的推理加速，使系统吞吐量接近理论 roofline 极限。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/systems-engineering-playbook-optimizing-qwen-35-397b-moe-on-ironwood-tpu7x","discovered_at":"2026-07-15T04:20:27.093Z","rank_on_page":130,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Google 工程师为在 Ironwood （TPUv7） 上部署 397B 参数的 Qwen 3.5 MoE 模型，开发了一套模块化 JAX/Pallas 优化栈。通过混合数据并行与专家并行（DP+EP）拓扑绕过硬件分片限制，结合层级化 reduce-scatter 等自定义底层通信融合优化跨设备 token 路由，并利用硬件感知的自定义内核（如 Batched Ragged Page Attention 和全融合 Gated DeltaNet 块），最终在 prefill 密集型负载上实现了高达 4.7 倍的推理加速，使系统吞吐量接近理论 roofline 极限。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
