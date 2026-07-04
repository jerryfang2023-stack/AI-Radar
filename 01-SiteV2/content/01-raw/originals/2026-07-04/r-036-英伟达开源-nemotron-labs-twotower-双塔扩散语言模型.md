---
schema_version: raw-evidence-v2
raw_id: R-036
title: "英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型"
title_zh: "英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.ithome.com/0/972/162.htm"
canonical_url: "https://ithome.com/0/972/162.htm"
source_name: "IT之家（RSS）"
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
published_at: "2026-07-03T05:21:52.000Z"
collected_at: 2026-07-04T04:50:50.266Z
language: mixed
full_text_hash: 5bb1e7936a251c63
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-036-英伟达开源-nemotron-labs-twotower-双塔扩散语言模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-036-英伟达开源-nemotron-labs-twotower-双塔扩散语言模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: medium
extraction_method: "content-container"
readability_score: 55
extractor_diagnostics: {"readability_score":55,"text_length":1130,"paragraph_count":21,"sentence_count":6,"boilerplate_hits":1,"symbol_ratio":0.0009,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 1130
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"5bb1e7936a251c63","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型","discovery_summary":"英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemotron Open Model License。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/972/162.htm","discovered_at":"2026-07-04T03:11:32.691Z","rank_on_page":214,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 908bf7382012df1a
content_hash: 5bb1e7936a251c63
semantic_hash: 0f0e1dbe8ccca4ba
duplicate_of: ""
first_seen_at: "2026-07-03T05:21:52.000Z"
last_seen_at: 2026-07-04T04:50:50.266Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["IT之家（RSS）","Nvidia"],"products":[],"people":[],"industries":[],"roles":[],"workflows":[],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["7","2","60B","30B","3B","128","98.7%","2.42倍"],"quotes":[]}
evidence_seed: {"company_actions":["IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。","在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。","其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。"],"case_details":["参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。"],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有变化前后流程线索"]
key_excerpts: [{"type":"number","text":"英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemotron Open Model License。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"product_update","text":"IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"medium"},{"type":"product_update","text":"在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"medium"},{"type":"case_detail","text":"参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"medium"},{"type":"opinion","text":"架构方面，TwoTower 最大的亮点，在于拆分传统扩散语言模型中的网络任务，将文本生成任务中的上下文表示与去噪过程分离到两个独立的神经网络“塔”中。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:50.266Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型

## clean_text

IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。
在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。
参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。
架构方面，TwoTower 最大的亮点，在于拆分传统扩散语言模型中的网络任务，将文本生成任务中的上下文表示与去噪过程分离到两个独立的神经网络“塔”中。
其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。
性能方面，英伟达表示从综合基准测试质量来看，双塔架构保留 98.7% 的质量表现，但是实际运行时间吞吐量提高了 2.42 倍。IT之家附上相关测试结果如下：
任务 Nemotron-3-Nano-30B-A3B (AR) Nemotron-Labs-TwoTower (diffusion)
MMLU (5-shot, acc) 78.56 78.24
MMLU-Pro (5-shot, CoT EM) 62.59 60.93
ARC-Challenge (25-shot, acc_norm) 91.72 92.66
WinoGrande (5-shot, acc) 76.09 76.09
RACE (0-shot, acc) 88.90 88.90
HumanEval (0-shot) 79.27 75.58
MBPP-Sanitized (3-shot) 74.71 74.28
GSM8K (8-shot, acc) 92.49 90.14
MATH-500 (4-shot) 84.40 80.60
MMLU Global Lite (5-shot) 73.97 73.94
MGSM (8-shot, avg acc) 80.80 80.40
Quality retained 100% 98.7%
Generation throughput (× AR) 1.0× 2.42×
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## full_text

IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。
在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。
参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。
架构方面，TwoTower 最大的亮点，在于拆分传统扩散语言模型中的网络任务，将文本生成任务中的上下文表示与去噪过程分离到两个独立的神经网络“塔”中。
其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。
性能方面，英伟达表示从综合基准测试质量来看，双塔架构保留 98.7% 的质量表现，但是实际运行时间吞吐量提高了 2.42 倍。IT之家附上相关测试结果如下：
任务 Nemotron-3-Nano-30B-A3B (AR) Nemotron-Labs-TwoTower (diffusion)
MMLU (5-shot, acc) 78.56 78.24
MMLU-Pro (5-shot, CoT EM) 62.59 60.93
ARC-Challenge (25-shot, acc_norm) 91.72 92.66
WinoGrande (5-shot, acc) 76.09 76.09
RACE (0-shot, acc) 88.90 88.90
HumanEval (0-shot) 79.27 75.58
MBPP-Sanitized (3-shot) 74.71 74.28
GSM8K (8-shot, acc) 92.49 90.14
MATH-500 (4-shot) 84.40 80.60
MMLU Global Lite (5-shot) 73.97 73.94
MGSM (8-shot, avg acc) 80.80 80.40
Quality retained 100% 98.7%
Generation throughput (× AR) 1.0× 2.42×
广告声明：文内含有的对外跳转链接（包括不限于超链接、二维码、口令等形式），用于传递更多信息，节省甄选时间，结果仅供参考，IT之家所有文章均包含本声明。

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 55
- fetch_status: fetched-readable-text-content-container
- extraction_quality: medium
- diagnostics: {"readability_score":55,"text_length":1130,"paragraph_count":21,"sentence_count":6,"boilerplate_hits":1,"symbol_ratio":0.0009,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=medium
   英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemotron Open Model License。

2. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=medium
   IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。

3. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=medium
   在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。

4. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=medium
   参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。

5. **opinion**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=medium
   架构方面，TwoTower 最大的亮点，在于拆分传统扩散语言模型中的网络任务，将文本生成任务中的上下文表示与去噪过程分离到两个独立的神经网络“塔”中。

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。

## business_elements

- companies: IT之家（RSS）, Nvidia
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 7, 2, 60B, 30B, 3B, 128, 98.7%, 2.42倍
- quotes: 暂无公开信息

## evidence_seed

- company_actions: IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。 / 在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。 / 其中一个塔（上下文塔）保持冻结，专注于维护文本的自回归上下文；另一个塔（去噪器塔）经过训练，负责对噪声块进行去噪，两个塔通过逐层交叉注意力连接协作。
- case_details: 参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
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

- viewpoint: true
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
- discovery_record: {"discovery_title":"英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型","discovery_summary":"英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemotron Open Model License。","source_name":"IT之家（RSS）","origin_url":"https://www.ithome.com/0/972/162.htm","discovered_at":"2026-07-04T03:11:32.691Z","rank_on_page":214,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemotron Open Model License。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
