---
schema_version: raw-evidence-v2
raw_id: R-032
title: "DiffusionGemma 开发者指南"
original_url: "https://developers.googleblog.com/diffusiongemma-the-developer-guide"
canonical_url: "https://developers.googleblog.com/diffusiongemma-the-developer-guide"
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
published_at: "2026-06-10T16:39:35.025Z"
collected_at: 2026-06-11T01:29:52.751Z
language: mixed
full_text_hash: 4cdfc0cc3e03f17d
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-032-diffusiongemma-开发者指南.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-032-diffusiongemma-开发者指南.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":8217,"paragraph_count":51,"sentence_count":52,"boilerplate_hits":0,"symbol_ratio":0.0013,"method":"content-container"}
has_full_text: true
content_length: 8217
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"4cdfc0cc3e03f17d","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"DiffusionGemma 开发者指南","discovery_summary":"DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/diffusiongemma-the-developer-guide","discovered_at":"2026-06-11T01:23:43.700Z","rank_on_page":167,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: dc6832fcc6a72df8
content_hash: 4cdfc0cc3e03f17d
semantic_hash: e0b50a24263b61d7
duplicate_of: ""
first_seen_at: "2026-06-10T16:39:35.025Z"
last_seen_at: 2026-06-11T01:29:52.751Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Google Developers Blog（RSS）","OpenAI","Google","Nvidia"],"products":[],"people":[],"industries":["开发者工具","企业服务"],"roles":["开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["4","256","10","2026","4 b","4x","700","5090"],"quotes":["look backward,"," earlier mistakes. If a token's confidence drops during a pass, the sampler can re-noise and replace it. This is a capability AR models lack since they are "," with a token once it is generated, especially during long output sequences.\nEfficient Long-Context Scaling : The ","diffusion_sampler","entropy_bound"]}
evidence_seed: {"company_actions":["DiffusionGemma: The Developer Guide JUNE 10, 2026 Ian Ballantyne Senior Developer Relations Engineer Omar Sanseviero Member of the Technical Staff Share Facebook Twitter LinkedIn Mail Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model.","Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation.","Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3."],"case_details":["DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。","8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits."],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"product_update","text":"DiffusionGemma: The Developer Guide JUNE 10, 2026 Ian Ballantyne Senior Developer Relations Engineer Omar Sanseviero Member of the Technical Staff Share Facebook Twitter LinkedIn Mail Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model.","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"},{"type":"number","text":"Built on the Gemma 4 backbone, DiffusionGemma introduces several milestones for developer workflows: Compute-bound parallel generation : Bypasses memory-bandwidth limitations by shifting the bottleneck to compute, delivering up to 4x faster token generation on GPUs (up to 700+ tokens per second on NVIDIA GeForce RTX 5090 and 1000+ tokens per second on a single NVIDIA H100).","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
title_zh: "DiffusionGemma 开发者指南"
title_translation_status: "not_required"
title_translation_method: "source_title"
title_translation_model: "not_applicable"
---

# DiffusionGemma 开发者指南

## clean_text

DiffusionGemma: The Developer Guide
JUNE 10, 2026
Ian Ballantyne
Senior Developer Relations Engineer
Omar Sanseviero
Member of the Technical Staff
Share
Facebook
Twitter
LinkedIn
Mail
Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model.
Built on the Gemma 4 backbone, DiffusionGemma introduces several milestones for developer workflows:
Compute-bound parallel generation : Bypasses memory-bandwidth limitations by shifting the bottleneck to compute, delivering up to 4x faster token generation on GPUs (up to 700+ tokens per second on NVIDIA GeForce RTX 5090 and 1000+ tokens per second on a single NVIDIA H100).
Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation.
Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3.8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits.
The Architecture
For developers building with traditional LLMs on GPUs, the primary bottleneck is memory bandwidth. Autoregressive language models must repeatedly load model weights from memory to generate text one token at a time. DiffusionGemma bypasses this limitation by shifting the bottleneck from memory bandwidth to compute, generating and refining a 256-token canvas in parallel. By providing the GPU with a large parallel workload, it utilizes tensor cores that would otherwise sit idle during local serving.
Uniform State Diffusion: Instead of predicting tokens sequentially, DiffusionGemma starts with a canvas of random placeholder tokens and iteratively refines them in parallel. Over multiple denoising passes, highly confident tokens help resolve adjacent positions, causing the entire sequence to snap into focus.
Block Autoregressive Diffusion for Variable Length Generation: For sequences longer than 256 tokens, once a 256-token block is fully denoised, the model processes and commits it to the KV cache. The model then transitions to the next block, initializing a fresh 256-token canvas conditioned on the previously committed history. This combines parallel block speed with the sequential stability of autoregressive models.
Showcase: Solving Sudoku with Parallel Denoising
Traditional autoregressive models struggle with strict, multivariable constrained problems like Sudoku. Because they generate text strictly from left to right, they cannot evaluate future placeholders or backtrack.
To demonstrate customization of DiffusionGemma, we are releasing a fine-tuning recipe and results using Hackable Diffusion , a modular JAX research toolbox. This training setup focuses on a classic multi-variable grid task: the Sudoku Solver .
Why Sudoku is Interesting for Diffusion
In an 81-character Sudoku string representation (where empty cells are marked with periods), every digit is bound by strict intersecting horizontal, vertical, and 9x9 grid constraints.
Bidirectional Context Propagation: Unlike autoregressive models, DiffusionGemma’s denoising step allows every canvas query to attend to all positions in parallel. Information flows symmetrically across the board, resolving global dependencies in each step.
Error Correction via Re-Noising : Under Uniform State Diffusion , the model evaluates the entire board simultaneously. If confidence drops, the sampler replaces digits with random ones, allowing for continuous self-correction.
Efficient Early Stopping : Fine-tuning on Sudoku shows that adapters enhance early stopping. The SFT-tuned model stabilizes faster than the base model, allowing the engine to halt sooner, reducing latency and compute costs.
Sorry, your browser doesn't support playback for this video
Left: DiffusionGemma generating Sudoku output. The base model is unable to solve the Sudoku after 48 steps. Right: Fine-tuned (SFT) DiffusionGemma solves the puzzle after 12 steps. It is able to complete early thanks to adaptive stopping.
The Performance Impact: While the base DiffusionGemma model is not specifically trained to solve Sudoku puzzles (~0% success rate), applying the simple JAX SFT recipe on a Sudoku dataset raises correctness to 80% success , while decreasing the overall inference step count.
Block Autoregressive Denoising
To enable block autoregressive denoising, DiffusionGemma alternates between incremental prefill and denoising during inference:
Prefill / Incremental Prefill (Causal): Uses causal attention to ingest the prompt context and write to the KV cache. This runs once to prefill the initial context and then once per block to append each finalized 256-token canvas to the KV cache before proceeding to denoising the next canvas.
Denoising (Bidirectional): Uses bidirectional attention to iteratively denoise the canvas. Query tokens at any position on the canvas can attend to all other canvas tokens (as well as KV cache), letting the model process context bidirectionally.
This architectural choice makes the following possible:
Global Context Awareness : Unlike autoregressive (AR) models that only "look backward," the Denoiser's bidirectional attention allows every token on the canvas to attend to every other token. This makes the model much more effective at solving non-sequential problems, such as Sudoku, where a digit in the first cell must respect constraints in the last cell.
Self-Correction : Because the model iteratively refines the whole canvas, it can "fix" earlier mistakes. If a token's confidence drops during a pass, the sampler can re-noise and replace it. This is a capability AR models lack since they are "stuck" with a token once it is generated, especially during long output sequences.
Efficient Long-Context Scaling : The "block-autoregressive" approach allows the model to handle long sequences. It combines the parallel speed of diffusion for blocks with the proven sequential stability of AR models for long-form text.
Simplified Deployment : Using the same architecture as the Gemma 4 26B A4B model means developers only need to implement a denoising step, making it easier to integrate into existing serving frameworks like vLLM.
Serving DiffusionGemma
To serve this experimental architecture efficiently, we worked with the vLLM team to implement DiffusionGemma into vLLM. This integration allows the engine to run the iterative parallel denoising loops efficiently across batched request streams.
Developers can deploy DiffusionGemma out of the box using vLLM's standard OpenAI-compatible local server.
vllm serve google/diffusiongemma-26B-A4B-it \
--max-model-len 262144 \
--max-num-seqs 4 \
--gpu-memory-utilization 0.85 \
--attention-backend TRITON_ATTN \
--generation-config vllm \
--hf-overrides '{"diffusion_sampler": "entropy_bound", "diffusion_entropy_bound": 0.1}' \
--diffusion-config '{"canvas_length": 256}' \
--enable-chunked-prefill
Shell
Copied
Getting Started Today
Ready to explore the frontier of non-autoregressive text generation? Take a look at the following resources to find out more:
Download the Weights: Access the weights of the experimental model (released under the Apache 2.0 license) directly on Hugging Face.
Integrate & Learn: Review the Visual Guide to DiffusionGemma to understand the mechanics of text-based diffusion models. Read more about DiffusionGemma in the Gemma documentation .
Use Your Favorite Inference Frameworks: Run the model efficiently using vLLM , Hugging Face Transformers , SGLang, and MLX .
Adapt & Fine-Tune: For rapid experimentation, we are releasing the official training recipes using Hackable Diffusion You can also explore efficient fine-tuning using Unsloth or NVIDIA NeMo .
Deploy Your Way: Instantly deploy on Google Cloud using Model Garden or via NVIDIA NIM . The model is optimized natively across the hardware stack from consumer RTX 4090 and 5090 cards to enterprise Hopper and Blackwell servers.
posted in:
AI
Announcements
Explore
Previous
Next
Related Posts
AI
Announcements
Explore
Gemma 4 12B: The Developer Guide
JUNE 3, 2026
AI
Cloud
Announcements
Learn
Introducing the Google Colab CLI
JUNE 5, 2026

## full_text

DiffusionGemma: The Developer Guide
JUNE 10, 2026
Ian Ballantyne
Senior Developer Relations Engineer
Omar Sanseviero
Member of the Technical Staff
Share
Facebook
Twitter
LinkedIn
Mail
Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model.
Built on the Gemma 4 backbone, DiffusionGemma introduces several milestones for developer workflows:
Compute-bound parallel generation : Bypasses memory-bandwidth limitations by shifting the bottleneck to compute, delivering up to 4x faster token generation on GPUs (up to 700+ tokens per second on NVIDIA GeForce RTX 5090 and 1000+ tokens per second on a single NVIDIA H100).
Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation.
Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3.8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits.
The Architecture
For developers building with traditional LLMs on GPUs, the primary bottleneck is memory bandwidth. Autoregressive language models must repeatedly load model weights from memory to generate text one token at a time. DiffusionGemma bypasses this limitation by shifting the bottleneck from memory bandwidth to compute, generating and refining a 256-token canvas in parallel. By providing the GPU with a large parallel workload, it utilizes tensor cores that would otherwise sit idle during local serving.
Uniform State Diffusion: Instead of predicting tokens sequentially, DiffusionGemma starts with a canvas of random placeholder tokens and iteratively refines them in parallel. Over multiple denoising passes, highly confident tokens help resolve adjacent positions, causing the entire sequence to snap into focus.
Block Autoregressive Diffusion for Variable Length Generation: For sequences longer than 256 tokens, once a 256-token block is fully denoised, the model processes and commits it to the KV cache. The model then transitions to the next block, initializing a fresh 256-token canvas conditioned on the previously committed history. This combines parallel block speed with the sequential stability of autoregressive models.
Showcase: Solving Sudoku with Parallel Denoising
Traditional autoregressive models struggle with strict, multivariable constrained problems like Sudoku. Because they generate text strictly from left to right, they cannot evaluate future placeholders or backtrack.
To demonstrate customization of DiffusionGemma, we are releasing a fine-tuning recipe and results using Hackable Diffusion , a modular JAX research toolbox. This training setup focuses on a classic multi-variable grid task: the Sudoku Solver .
Why Sudoku is Interesting for Diffusion
In an 81-character Sudoku string representation (where empty cells are marked with periods), every digit is bound by strict intersecting horizontal, vertical, and 9x9 grid constraints.
Bidirectional Context Propagation: Unlike autoregressive models, DiffusionGemma’s denoising step allows every canvas query to attend to all positions in parallel. Information flows symmetrically across the board, resolving global dependencies in each step.
Error Correction via Re-Noising : Under Uniform State Diffusion , the model evaluates the entire board simultaneously. If confidence drops, the sampler replaces digits with random ones, allowing for continuous self-correction.
Efficient Early Stopping : Fine-tuning on Sudoku shows that adapters enhance early stopping. The SFT-tuned model stabilizes faster than the base model, allowing the engine to halt sooner, reducing latency and compute costs.
Sorry, your browser doesn't support playback for this video
Left: DiffusionGemma generating Sudoku output. The base model is unable to solve the Sudoku after 48 steps. Right: Fine-tuned (SFT) DiffusionGemma solves the puzzle after 12 steps. It is able to complete early thanks to adaptive stopping.
The Performance Impact: While the base DiffusionGemma model is not specifically trained to solve Sudoku puzzles (~0% success rate), applying the simple JAX SFT recipe on a Sudoku dataset raises correctness to 80% success , while decreasing the overall inference step count.
Block Autoregressive Denoising
To enable block autoregressive denoising, DiffusionGemma alternates between incremental prefill and denoising during inference:
Prefill / Incremental Prefill (Causal): Uses causal attention to ingest the prompt context and write to the KV cache. This runs once to prefill the initial context and then once per block to append each finalized 256-token canvas to the KV cache before proceeding to denoising the next canvas.
Denoising (Bidirectional): Uses bidirectional attention to iteratively denoise the canvas. Query tokens at any position on the canvas can attend to all other canvas tokens (as well as KV cache), letting the model process context bidirectionally.
This architectural choice makes the following possible:
Global Context Awareness : Unlike autoregressive (AR) models that only "look backward," the Denoiser's bidirectional attention allows every token on the canvas to attend to every other token. This makes the model much more effective at solving non-sequential problems, such as Sudoku, where a digit in the first cell must respect constraints in the last cell.
Self-Correction : Because the model iteratively refines the whole canvas, it can "fix" earlier mistakes. If a token's confidence drops during a pass, the sampler can re-noise and replace it. This is a capability AR models lack since they are "stuck" with a token once it is generated, especially during long output sequences.
Efficient Long-Context Scaling : The "block-autoregressive" approach allows the model to handle long sequences. It combines the parallel speed of diffusion for blocks with the proven sequential stability of AR models for long-form text.
Simplified Deployment : Using the same architecture as the Gemma 4 26B A4B model means developers only need to implement a denoising step, making it easier to integrate into existing serving frameworks like vLLM.
Serving DiffusionGemma
To serve this experimental architecture efficiently, we worked with the vLLM team to implement DiffusionGemma into vLLM. This integration allows the engine to run the iterative parallel denoising loops efficiently across batched request streams.
Developers can deploy DiffusionGemma out of the box using vLLM's standard OpenAI-compatible local server.
vllm serve google/diffusiongemma-26B-A4B-it \
--max-model-len 262144 \
--max-num-seqs 4 \
--gpu-memory-utilization 0.85 \
--attention-backend TRITON_ATTN \
--generation-config vllm \
--hf-overrides '{"diffusion_sampler": "entropy_bound", "diffusion_entropy_bound": 0.1}' \
--diffusion-config '{"canvas_length": 256}' \
--enable-chunked-prefill
Shell
Copied
Getting Started Today
Ready to explore the frontier of non-autoregressive text generation? Take a look at the following resources to find out more:
Download the Weights: Access the weights of the experimental model (released under the Apache 2.0 license) directly on Hugging Face.
Integrate & Learn: Review the Visual Guide to DiffusionGemma to understand the mechanics of text-based diffusion models. Read more about DiffusionGemma in the Gemma documentation .
Use Your Favorite Inference Frameworks: Run the model efficiently using vLLM , Hugging Face Transformers , SGLang, and MLX .
Adapt & Fine-Tune: For rapid experimentation, we are releasing the official training recipes using Hackable Diffusion You can also explore efficient fine-tuning using Unsloth or NVIDIA NeMo .
Deploy Your Way: Instantly deploy on Google Cloud using Model Garden or via NVIDIA NIM . The model is optimized natively across the hardware stack from consumer RTX 4090 and 5090 cards to enterprise Hopper and Blackwell servers.
posted in:
AI
Announcements
Explore
Previous
Next
Related Posts
AI
Announcements
Explore
Gemma 4 12B: The Developer Guide
JUNE 3, 2026
AI
Cloud
Announcements
Learn
Introducing the Google Colab CLI
JUNE 5, 2026

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":8217,"paragraph_count":51,"sentence_count":52,"boilerplate_hits":0,"symbol_ratio":0.0013,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   DiffusionGemma: The Developer Guide JUNE 10, 2026 Ian Ballantyne Senior Developer Relations Engineer Omar Sanseviero Member of the Technical Staff Share Facebook Twitter LinkedIn Mail Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model.

3. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   Built on the Gemma 4 backbone, DiffusionGemma introduces several milestones for developer workflows: Compute-bound parallel generation : Bypasses memory-bandwidth limitations by shifting the bottleneck to compute, delivering up to 4x faster token generation on GPUs (up to 700+ tokens per second on NVIDIA GeForce RTX 5090 and 1000+ tokens per second on a single NVIDIA H100).

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3.

6. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits.

## business_elements

- companies: Google Developers Blog（RSS）, OpenAI, Google, Nvidia
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 4, 256, 10, 2026, 4 b, 4x, 700, 5090
- quotes: look backward, /  earlier mistakes. If a token's confidence drops during a pass, the sampler can re-noise and replace it. This is a capability AR models lack since they are  /  with a token once it is generated, especially during long output sequences.
Efficient Long-Context Scaling : The  / diffusion_sampler / entropy_bound

## evidence_seed

- company_actions: DiffusionGemma: The Developer Guide JUNE 10, 2026 Ian Ballantyne Senior Developer Relations Engineer Omar Sanseviero Member of the Technical Staff Share Facebook Twitter LinkedIn Mail Following our announcement in our launch blog post , we are sharing this developer guide to help you understand, serve and customize this experimental model. / Bidirectional context & self-correction: Uses bidirectional attention to evaluate the entire text block simultaneously during generation, enabling real-time error correction and parallel context propagation. / Developer-friendly sizes : Designed as a 26B Mixture of Experts (MoE) model that activates only 3.
- case_details: DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。 / 8B parameters during inference, allowing quantized deployment within 18 GB VRAM limits.
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
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

- none

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"DiffusionGemma 开发者指南","discovery_summary":"DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/diffusiongemma-the-developer-guide","discovered_at":"2026-06-11T01:23:43.700Z","rank_on_page":167,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

DiffusionGemma 是 Google 基于 Gemma 4 架构的实验性文本生成模型，采用扩散式并行生成替代逐 token 自回归，实现更快推理、双向上下文感知和实时自我修正，并可在消费级 GPU 上部署。模型通过迭代去噪并行生成并细化 256-token 块，在处理数独等复杂约束任务上优于传统语言模型，且微调效果显著。它已集成 vLLM 等推理框架，为开发者提供一种高性能、高效长上下文扩展且易于定制部署的非自回归新方法。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
