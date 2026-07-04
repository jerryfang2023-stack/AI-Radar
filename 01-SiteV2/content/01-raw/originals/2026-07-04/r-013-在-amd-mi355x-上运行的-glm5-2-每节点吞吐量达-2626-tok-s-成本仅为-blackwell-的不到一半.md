---
schema_version: raw-evidence-v2
raw_id: R-013
title: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半"
title_zh: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.wafer.ai/blog/glm52-amd"
canonical_url: "https://wafer.ai/blog/glm52-amd"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
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
published_at: "2026-07-04T02:31:35.646Z"
collected_at: 2026-07-04T04:50:50.083Z
language: mixed
full_text_hash: fbdd025066f9383b
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-013-在-amd-mi355x-上运行的-glm5-2-每节点吞吐量达-2626-tok-s-成本仅为-blackwell-的不到一半.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-013-在-amd-mi355x-上运行的-glm5-2-每节点吞吐量达-2626-tok-s-成本仅为-blackwell-的不到一半.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":6549,"paragraph_count":25,"sentence_count":49,"boilerplate_hits":0,"symbol_ratio":0.0015,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 6549
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"fbdd025066f9383b","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半","discovery_summary":"Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% 缓存命中率的工作负载下，2.4 RPS 时达到每节点聚合吞吐 2626 tok/s，为 B200 性能的 80%，而 GPU 平均成本便宜约 2.75 倍。该结果基于 TensorWave 提供的 MI355X 算力实现。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://www.wafer.ai/blog/glm52-amd","discovered_at":"2026-07-04T03:11:32.598Z","rank_on_page":17,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 9e648bd5f97d56cc
content_hash: fbdd025066f9383b
semantic_hash: faf3666de3108924
duplicate_of: ""
first_seen_at: "2026-07-04T02:31:35.646Z"
last_seen_at: 2026-07-04T04:50:50.083Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","user_feedback_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Nvidia"],"products":["Claude","agents"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["计费 / 预算管理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["355X","5.2","2626","16","4","2","8","213"],"quotes":[]}
evidence_seed: {"company_actions":["Have you noticed we like AMD?","The demand for inference is skyrocketing and outpacing supply.","With frontier models being released almost every other week — Claude Fable, GLM5."],"case_details":[],"workflow_changes":["2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it."],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% 缓存命中率的工作负载下，2.4 RPS 时达到每节点聚合吞吐 2626 tok/s，为 B200 性能的 80%，而 GPU 平均成本便宜约 2.75 倍。该结果基于 TensorWave 提供的 MI355X 算力实现。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Have you noticed we like AMD?","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The demand for inference is skyrocketing and outpacing supply.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"product_update","text":"With frontier models being released almost every other week — Claude Fable, GLM5.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Thus, NVIDIA GPU prices are climbing fast, and tokens are getting really expensive.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:50.083Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半

## clean_text

Have you noticed we like AMD?
The demand for inference is skyrocketing and outpacing supply. With frontier models being released almost every other week — Claude Fable, GLM5.2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it. Thus, NVIDIA GPU prices are climbing fast, and tokens are getting really expensive.
In comes AMD. At around 2.75x cheaper per GPU on average (MI355X vs B300) with comparable hardware specs, the solution to cheap inference is hiding in plain sight — a message we at Wafer have been preaching for months. But although AMD’s Instinct MI350 series competes with Blackwells at the silicon level, NVIDIA’s software advantage and day-0 support typically allows providers to serve inference much faster on their hardware with much less friction.
Conversely, on the MI355X / ROCm stack SOTA performance rarely comes out of the box for these frontier models (sometimes it does!). In fact, you’re lucky if you can find an image that runs them at all. Without this day-0 support, building and optimizing for the newest models can require weeks of engineering and compute. By then, the newest model has already been released, making it so AMD is always playing catch-up.
But as agents improve at kernel and model optimization, this gap is closing in real time. At Wafer, we’ve proven this time and time again.
And again — on a 20k in / 1k out, 60% cache hit rate workload, we hit an aggregate throughput of 2626 tok/s/node @ 2.4 rps with a defined knee of ≤5s TTFT — only 80% of the performance measured on a B200, despite being over 2x cheaper.
Sustained RPS
Aggregate tok/s/node
TTFT p50 / p95
Success
0.5
449
0.59s / 0.60s
100%
1.0
974
0.60s / 0.81s
100%
1.5
1913
0.62s / 1.03s
100%
2.0
1944
0.62s / 1.05s
100%
2.25
2089
0.63s / 1.23s
100%
2.4 (saturation)
2626
0.81s / 2.22s
100%
We also hit 213 tok/s on GLM5.2 on 10k input tokens / 1.5k output tokens single stream, following Artificial Analysis standards , served on AMD MI355X capacity from TensorWave. Though this number doesn’t top the AA leaderboard, it still wins on performance per dollar.
How we did it
The first step with any model work is to choose a quantization and framework. We quantized the base bf16 GLM-5.2 to MXFP4 with AMD Quark. In comparison to z-ai’s official FP8 quantization, our MXFP4 was lossless (GPQA-Diamond, tau2, GSM8K).
Eval
FP8 baseline
MXFP4
Δ (MXFP4 − FP8)
GSM8K (200q, 5-shot, greedy)
0.965 ± 0.013
0.955 ± 0.014
−0.010
GPQA-Diamond (198q × 2 seeds, temp 1.0)
0.9217 ± 0.027
0.9026 ± 0.029
−0.019
tau2 macro
0.819
0.834
+0.015
As for the inference framework, we had three options — vLLM, ATOM, and sglang. Among the three, we chose sglang — vLLM had no working MXFP4 + GlmMoeDsa path so the MXFP4 weights provided no benefit, and ATOM’s output degraded at long context. Sglang was the inference engine with the least friction to native support, able to take advantage of the quantization while remaining coherent.
The next natural step to improving throughput was enabling speculative decode on sglang. However, the sglang ROCm image does not support this out of the box. There were two fixes needed before MTP worked properly.
First, the MTP head, like every other layer, keeps its single shared expert stored in bf16, not MXFP4. However, the MTP head is registered under a different module prefix than the main decoder stack (Quark names its bf16 shared expert model.layers.78.mlp.shared_experts.* , while the MTP layer’s real prefix is model.decoder.* ). Because of the mismatch, sglang’s quantization lookup fails and defaults to building that shared expert as MXFP4. At load it then tries to read a full-width bf16 weight into a half-width 4-bit slot and the init crashes on a shape mismatch. Quark records which weights to leave un-quantized as a list of layer names, so we copied over the layer 78 entries to that list a second time under the decoder name sglang actually uses. This fix unblocked speculative decode, netting us close to a 3x gain in single stream throughput.
Second, deep speculative decode (such as the 5/1/6 config z-ai suggests) was still blocked. The fused multi-step metadata kernel needed for draft depth ≥4 writes #include <cuda_runtime.h> with no ROCm guard. Fix: one #ifdef USE_ROCM guard.
Two trivial, but necessary changes to take full advantage of speculative decode. With spec dec working properly, alongside a few config optimizations (such as --kv-cache-dtype fp8_e4m3 and --enable-aiter-allreduce-fusion ), we reached our headline single stream decode number at 213 tok/s.
But for aggregate throughput, especially with our defined workload, decode optimizations are necessary but insufficient. At 20k in @ 60% cache, the workload is primarily prefill bound.
At TP8, which was the configuration optimized for single stream decode, the MI355X can run GLM5.2-MXFP4 at 1461 tok/s/node. Switching to TP4×DP2 netted a massive improvement on this workload, getting us to 1944 tok/s/node at 2.0 RPS — still relatively slow compared to our measured Blackwell performance, which hit 3192 tok/s/node at 3.0 RPS. A big reason for the poor prefill performance on the MI355X is that on the sglang image, GLM-5.2’s fp4 MoE was silently on a slow FlyDSL heuristic fallback (aiter only shipped tuned configs for the a8w8/fp8 path). We tuned the MoE kernel selection ourselves on GLM’s fp4 shapes ( model_dim 6144, moe_inter 2048, E=256, topk=8 ), which allowed us to reach 2626 tok/s/node at 2.4 RPS. Much better.
Why this matters
Although there was some degree of friction, achieving the best performance per dollar ratio on the MI355X wasn’t particularly hard — though there were some framework related bugs, unlike our work with Qwen3.5 397B, you’ll notice that we didn’t actually write any custom kernels this time. Though this study doesn’t take multi-node performance into consideration, single-node deployments still remain highly prevalent in practice.
SOTA on AMD is becoming more a matter of support, not software. The CUDA moat is eroding in real time.
Related articles
June 10, 2026 Balaji Varadarajan and Wafer Team
The Inference Alpha: Maximizing Frontier Models on AMD
How DigitalOcean and Wafer unlock order-of-magnitude inference speedups on AMD GPUs for Kimi 2.5, DeepSeek V3.2, and GLM-5 through deep kernel and systems engineering.
May 19, 2026 Ian Ye
Achieving Heterogeneous Compute One Kernel at a Time
How custom kernels pushed our AMD MI355X deployment from a tuned baseline to leading Qwen3.5 397B throughput.

## full_text

Have you noticed we like AMD?
The demand for inference is skyrocketing and outpacing supply. With frontier models being released almost every other week — Claude Fable, GLM5.2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it. Thus, NVIDIA GPU prices are climbing fast, and tokens are getting really expensive.
In comes AMD. At around 2.75x cheaper per GPU on average (MI355X vs B300) with comparable hardware specs, the solution to cheap inference is hiding in plain sight — a message we at Wafer have been preaching for months. But although AMD’s Instinct MI350 series competes with Blackwells at the silicon level, NVIDIA’s software advantage and day-0 support typically allows providers to serve inference much faster on their hardware with much less friction.
Conversely, on the MI355X / ROCm stack SOTA performance rarely comes out of the box for these frontier models (sometimes it does!). In fact, you’re lucky if you can find an image that runs them at all. Without this day-0 support, building and optimizing for the newest models can require weeks of engineering and compute. By then, the newest model has already been released, making it so AMD is always playing catch-up.
But as agents improve at kernel and model optimization, this gap is closing in real time. At Wafer, we’ve proven this time and time again.
And again — on a 20k in / 1k out, 60% cache hit rate workload, we hit an aggregate throughput of 2626 tok/s/node @ 2.4 rps with a defined knee of ≤5s TTFT — only 80% of the performance measured on a B200, despite being over 2x cheaper.
Sustained RPS
Aggregate tok/s/node
TTFT p50 / p95
Success
0.5
449
0.59s / 0.60s
100%
1.0
974
0.60s / 0.81s
100%
1.5
1913
0.62s / 1.03s
100%
2.0
1944
0.62s / 1.05s
100%
2.25
2089
0.63s / 1.23s
100%
2.4 (saturation)
2626
0.81s / 2.22s
100%
We also hit 213 tok/s on GLM5.2 on 10k input tokens / 1.5k output tokens single stream, following Artificial Analysis standards , served on AMD MI355X capacity from TensorWave. Though this number doesn’t top the AA leaderboard, it still wins on performance per dollar.
How we did it
The first step with any model work is to choose a quantization and framework. We quantized the base bf16 GLM-5.2 to MXFP4 with AMD Quark. In comparison to z-ai’s official FP8 quantization, our MXFP4 was lossless (GPQA-Diamond, tau2, GSM8K).
Eval
FP8 baseline
MXFP4
Δ (MXFP4 − FP8)
GSM8K (200q, 5-shot, greedy)
0.965 ± 0.013
0.955 ± 0.014
−0.010
GPQA-Diamond (198q × 2 seeds, temp 1.0)
0.9217 ± 0.027
0.9026 ± 0.029
−0.019
tau2 macro
0.819
0.834
+0.015
As for the inference framework, we had three options — vLLM, ATOM, and sglang. Among the three, we chose sglang — vLLM had no working MXFP4 + GlmMoeDsa path so the MXFP4 weights provided no benefit, and ATOM’s output degraded at long context. Sglang was the inference engine with the least friction to native support, able to take advantage of the quantization while remaining coherent.
The next natural step to improving throughput was enabling speculative decode on sglang. However, the sglang ROCm image does not support this out of the box. There were two fixes needed before MTP worked properly.
First, the MTP head, like every other layer, keeps its single shared expert stored in bf16, not MXFP4. However, the MTP head is registered under a different module prefix than the main decoder stack (Quark names its bf16 shared expert model.layers.78.mlp.shared_experts.* , while the MTP layer’s real prefix is model.decoder.* ). Because of the mismatch, sglang’s quantization lookup fails and defaults to building that shared expert as MXFP4. At load it then tries to read a full-width bf16 weight into a half-width 4-bit slot and the init crashes on a shape mismatch. Quark records which weights to leave un-quantized as a list of layer names, so we copied over the layer 78 entries to that list a second time under the decoder name sglang actually uses. This fix unblocked speculative decode, netting us close to a 3x gain in single stream throughput.
Second, deep speculative decode (such as the 5/1/6 config z-ai suggests) was still blocked. The fused multi-step metadata kernel needed for draft depth ≥4 writes #include <cuda_runtime.h> with no ROCm guard. Fix: one #ifdef USE_ROCM guard.
Two trivial, but necessary changes to take full advantage of speculative decode. With spec dec working properly, alongside a few config optimizations (such as --kv-cache-dtype fp8_e4m3 and --enable-aiter-allreduce-fusion ), we reached our headline single stream decode number at 213 tok/s.
But for aggregate throughput, especially with our defined workload, decode optimizations are necessary but insufficient. At 20k in @ 60% cache, the workload is primarily prefill bound.
At TP8, which was the configuration optimized for single stream decode, the MI355X can run GLM5.2-MXFP4 at 1461 tok/s/node. Switching to TP4×DP2 netted a massive improvement on this workload, getting us to 1944 tok/s/node at 2.0 RPS — still relatively slow compared to our measured Blackwell performance, which hit 3192 tok/s/node at 3.0 RPS. A big reason for the poor prefill performance on the MI355X is that on the sglang image, GLM-5.2’s fp4 MoE was silently on a slow FlyDSL heuristic fallback (aiter only shipped tuned configs for the a8w8/fp8 path). We tuned the MoE kernel selection ourselves on GLM’s fp4 shapes ( model_dim 6144, moe_inter 2048, E=256, topk=8 ), which allowed us to reach 2626 tok/s/node at 2.4 RPS. Much better.
Why this matters
Although there was some degree of friction, achieving the best performance per dollar ratio on the MI355X wasn’t particularly hard — though there were some framework related bugs, unlike our work with Qwen3.5 397B, you’ll notice that we didn’t actually write any custom kernels this time. Though this study doesn’t take multi-node performance into consideration, single-node deployments still remain highly prevalent in practice.
SOTA on AMD is becoming more a matter of support, not software. The CUDA moat is eroding in real time.
Related articles
June 10, 2026 Balaji Varadarajan and Wafer Team
The Inference Alpha: Maximizing Frontier Models on AMD
How DigitalOcean and Wafer unlock order-of-magnitude inference speedups on AMD GPUs for Kimi 2.5, DeepSeek V3.2, and GLM-5 through deep kernel and systems engineering.
May 19, 2026 Ian Ye
Achieving Heterogeneous Compute One Kernel at a Time
How custom kernels pushed our AMD MI355X deployment from a tuned baseline to leading Qwen3.5 397B throughput.

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":6549,"paragraph_count":25,"sentence_count":49,"boilerplate_hits":0,"symbol_ratio":0.0015,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% 缓存命中率的工作负载下，2.4 RPS 时达到每节点聚合吞吐 2626 tok/s，为 B200 性能的 80%，而 GPU 平均成本便宜约 2.75 倍。该结果基于 TensorWave 提供的 MI355X 算力实现。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Have you noticed we like AMD?

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   The demand for inference is skyrocketing and outpacing supply.

4. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   With frontier models being released almost every other week — Claude Fable, GLM5.

5. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Thus, NVIDIA GPU prices are climbing fast, and tokens are getting really expensive.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Nvidia
- products: Claude, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 计费 / 预算管理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 355X, 5.2, 2626, 16, 4, 2, 8, 213
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Have you noticed we like AMD? / The demand for inference is skyrocketing and outpacing supply. / With frontier models being released almost every other week — Claude Fable, GLM5.
- case_details: 暂无公开信息
- workflow_changes: 2, and Minimax M3, to name a few — the token craze is only getting crazier, and there aren’t enough Blackwells going around to support it.
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,adoption_context
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
- user_feedback_pool: true
- watchlist: true

## pool_routes

- core_pool
- user_feedback_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半","discovery_summary":"Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% 缓存命中率的工作负载下，2.4 RPS 时达到每节点聚合吞吐 2626 tok/s，为 B200 性能的 80%，而 GPU 平均成本便宜约 2.75 倍。该结果基于 TensorWave 提供的 MI355X 算力实现。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://www.wafer.ai/blog/glm52-amd","discovered_at":"2026-07-04T03:11:32.598Z","rank_on_page":17,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% 缓存命中率的工作负载下，2.4 RPS 时达到每节点聚合吞吐 2626 tok/s，为 B200 性能的 80%，而 GPU 平均成本便宜约 2.75 倍。该结果基于 TensorWave 提供的 MI355X 算力实现。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
