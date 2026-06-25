---
schema_version: raw-evidence-v2
raw_id: R-209
title: "GLM-5.2 魔改版让 vLLM 支持推测性解码，速度飙升至 43 token/s"
original_url: "https://x.com/karminski3/status/2069883772829622439"
canonical_url: "https://x.com/karminski3/status/2069883772829622439"
source_name: "X：karminski (@karminski3)"
source_type: community
source_level: C
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: community_feedback
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-24T20:42:02.000Z"
collected_at: 2026-06-25T03:26:01.084Z
language: mixed
full_text_hash: c0ca64aba86ad728
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-25/r-209-glm-5-2-魔改版让-vllm-支持推测性解码-速度飙升至-43-token-s.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-25/r-209-glm-5-2-魔改版让-vllm-支持推测性解码-速度飙升至-43-token-s.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: timeout-fallback-visible-text
extraction_quality: failed
extraction_method: "fetch_failed_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}
has_full_text: false
content_length: 309
fetch_error: "fetch failed (code=UND_ERR_CONNECT_TIMEOUT)"
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"present","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"c0ca64aba86ad728","missing":["missing_full_text","missing_snapshot"]}
source_volatility: high
community_name: "X：karminski (@karminski3)"
capture_scope: aihot_visible_text
visible_range: "仅保留采集通道当时可见文本，未抓到原页面正文"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"GLM-5.2 魔改版让 vLLM 支持推测性解码，速度飙升至 43 token/s","discovery_summary":"GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。","source_name":"X：karminski (@karminski3)","origin_url":"https://x.com/karminski3/status/2069883772829622439","discovered_at":"2026-06-25T03:03:30.121Z","rank_on_page":98,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "timeout"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 405027562a6518a4
content_hash: c0ca64aba86ad728
semantic_hash: 0728cb9956fe6904
duplicate_of: ""
first_seen_at: "2026-06-24T20:42:02.000Z"
last_seen_at: 2026-06-25T03:26:01.084Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["discard"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":4,"importance_reason":"technical trend or capability shift; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":2,"case_richness":5,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":3}
business_elements: {"companies":["X","karminski (@karminski3)"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["5.2","43","16","1.5","4b","430","4","8"],"quotes":[]}
evidence_seed: {"company_actions":["cpp、mlx 等推理引擎难以支持。","5TB，4bit 量化仅 430GB。","社区作者 dnhkng 制作了 GLM-5."],"case_details":["GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。","2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama."],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有变化前后流程线索","没有可用全文快照"]
key_excerpts: [{"type":"case_detail","text":"GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"cpp、mlx 等推理引擎难以支持。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"5TB，4bit 量化仅 430GB。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"社区作者 dnhkng 制作了 GLM-5.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# GLM-5.2 魔改版让 vLLM 支持推测性解码，速度飙升至 43 token/s

## clean_text

GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。

## full_text

GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。

## extraction_diagnostics

- extraction_method: fetch_failed_summary_fallback
- readability_score: 0
- fetch_status: timeout-fallback-visible-text
- extraction_quality: failed
- diagnostics: {"method":"fetch_failed_summary_fallback","error_type":"timeout"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。

2. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=medium
   2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   cpp、mlx 等推理引擎难以支持。

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   5TB，4bit 量化仅 430GB。

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   社区作者 dnhkng 制作了 GLM-5.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.

## business_elements

- companies: X, karminski (@karminski3)
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 5.2, 43, 16, 1.5, 4b, 430, 4, 8
- quotes: 暂无公开信息

## evidence_seed

- company_actions: cpp、mlx 等推理引擎难以支持。 / 5TB，4bit 量化仅 430GB。 / 社区作者 dnhkng 制作了 GLM-5.
- case_details: GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。 / 2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 4
- importance_reason: technical trend or capability shift; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 2
- case_richness: 5
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- discard

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有变化前后流程线索
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: high
- community_name: X：karminski (@karminski3)
- capture_scope: aihot_visible_text
- visible_range: 仅保留采集通道当时可见文本，未抓到原页面正文
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: timeout
- discovery_record: {"discovery_title":"GLM-5.2 魔改版让 vLLM 支持推测性解码，速度飙升至 43 token/s","discovery_summary":"GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。","source_name":"X：karminski (@karminski3)","origin_url":"https://x.com/karminski3/status/2069883772829622439","discovered_at":"2026-06-25T03:03:30.121Z","rank_on_page":98,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

GLM-5.2 自带 MTP（推测性解码）头因采用 DSA（动态稀疏注意力），导致 vLLM、llama.cpp、mlx 等推理引擎难以支持。原始 bf16 精度需 1.5TB，4bit 量化仅 430GB。社区作者 dnhkng 制作了 GLM-5.2-AWQ-INT4-FP8-MTP-delta 魔改版：底座用 INT4（Marlin 算子）+ MTP 用 FP8，使 vLLM 支持 MTP，速度从 2 token/s 提升至 43.39 token/s（绑定 NUMA+MTP-3）。SGLang 因支持混合精度可直接使用 GLM-5.2-W4AFP8；llama.cpp 和 mlx 用户仍需等待社区适配。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
