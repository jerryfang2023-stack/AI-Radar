---
schema_version: raw-evidence-v2
raw_id: R-022
title: "EEVEE：面向真实世界的测试时提示学习框架"
original_url: "https://arxiv.org/abs/2606.11182"
canonical_url: "https://arxiv.org/abs/2606.11182"
source_name: "HuggingFace Daily Papers（社区热门论文）"
source_type: research
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: preprint
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-09T17:57:16.000Z"
collected_at: 2026-06-10T04:09:42.376Z
language: mixed
full_text_hash: 4c80f2e0674ff7e7
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-10/r-022-eevee-面向真实世界的测试时提示学习框架.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-10/r-022-eevee-面向真实世界的测试时提示学习框架.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":4210,"paragraph_count":50,"sentence_count":31,"boilerplate_hits":0,"symbol_ratio":0.0036,"method":"main"}
has_full_text: true
content_length: 4210
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"4c80f2e0674ff7e7","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"EEVEE：面向真实世界的测试时提示学习框架","discovery_summary":"EEVEE是首个面向LLM智能体的多数据集测试时提示学习框架，用于在真实任务流下自改进。为解决跨数据集干扰，它引入路由器将异构输入流划分到任务簇并分配适配提示配置，并通过路由器-提示协同进化策略（交替执行路由器和提示学习阶段）优化二者依赖。实验表明，EEVEE在保持单基准学习能力与效率的同时，提升异构数据流鲁棒性：平均多基准得分比Qwen3-4B-Instruct高10.38分，比DeepSeek-V3.2高24.32分，超越SOTA方法GEPA和ACE最高达37.2%和48.2%。","source_name":"HuggingFace Daily Papers（社区热门论文）","origin_url":"https://arxiv.org/abs/2606.11182","discovered_at":"2026-06-10T04:01:59.484Z","rank_on_page":220,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 45ae4b6a12b6d551
content_hash: 4c80f2e0674ff7e7
semantic_hash: 2c658ec9c9c703af
duplicate_of: ""
first_seen_at: "2026-06-09T17:57:16.000Z"
last_seen_at: 2026-06-10T04:09:42.376Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":4,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["HuggingFace Daily Papers（社区热门论文）","Google"],"products":["Agents","agents"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":[],"business_actions":["合作 / 联盟"],"affected_departments":["IT / 安全"],"numbers":["3","4B","10.38","3.2","24.32","37.2%","48.2%","2606.11182"],"quotes":[]}
evidence_seed: {"company_actions":["Computer Science > Machine Learning arXiv:2606.","11182 (cs) [Submitted on 9 Jun 2026] Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents Authors: Weixian Xu , Shilong Liu , Mengdi Wang View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors View PDF HTML (experimental) Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under rea","Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"number","text":"EEVEE是首个面向LLM智能体的多数据集测试时提示学习框架，用于在真实任务流下自改进。为解决跨数据集干扰，它引入路由器将异构输入流划分到任务簇并分配适配提示配置，并通过路由器-提示协同进化策略（交替执行路由器和提示学习阶段）优化二者依赖。实验表明，EEVEE在保持单基准学习能力与效率的同时，提升异构数据流鲁棒性：平均多基准得分比Qwen3-4B-Instruct高10.38分，比DeepSeek-V3.2高24.32分，超越SOTA方法GEPA和ACE最高达37.2%和48.2%。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Computer Science > Machine Learning arXiv:2606.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"11182 (cs) [Submitted on 9 Jun 2026] Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents Authors: Weixian Xu , Shilong Liu , Mengdi Wang View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors View PDF HTML (experimental) Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under rea","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"To mitigate cross-dataset interference, EEVEE introduces a router that partitions incoming inputs into task clusters and assigns them to suitable prompt configurations.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This design is optimized via a router-prompt co-evolution strategy, which employs interleaved router and prompt learning phases to address their mutual dependency.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# EEVEE：面向真实世界的测试时提示学习框架

## clean_text

Computer Science > Machine Learning
arXiv:2606.11182 (cs)
[Submitted on 9 Jun 2026]
Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents
Authors: Weixian Xu , Shilong Liu , Mengdi Wang
View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors
View PDF
HTML (experimental)
Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under real-world task streams. Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability. To mitigate cross-dataset interference, EEVEE introduces a router that partitions incoming inputs into task clusters and assigns them to suitable prompt configurations. This design is optimized via a router-prompt co-evolution strategy, which employs interleaved router and prompt learning phases to address their mutual dependency. Experiments across multiple datasets demonstrate that the framework improves robustness under heterogeneous data streams while maintaining single-benchmark learning capability and efficiency. Specifically, EEVEE improves average multi-benchmark scores by 10.38 and 24.32 points over Qwen3-4B-Instruct and DeepSeek-V3.2, surpassing SOTA methods GEPA and ACE by up to 37.2% and 48.2%.
Comments:
19 pages, 6 figures
Subjects:
Machine Learning (cs.LG) ; Artificial Intelligence (cs.AI)
Cite as:
arXiv:2606.11182 [cs.LG]
(or
arXiv:2606.11182v1 [cs.LG] for this version)
https://doi.org/10.48550/arXiv.2606.11182
Focus to learn more
arXiv-issued DOI via DataCite (pending registration)
Submission history
From: Weixian Xu [ view email ]
[v1]
Tue, 9 Jun 2026 17:57:16 UTC (881 KB)
Full-text links:
Access Paper:
View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors
View PDF
HTML (experimental)
TeX Source
view license
Current browse context:
cs.LG
< prev
next >
new
recent
| 2026-06
Change to browse by:
cs
cs.AI
References & Citations
NASA ADS
Google Scholar
Semantic Scholar
export BibTeX citation
Loading...
BibTeX formatted citation
&times;
loading...
Data provided by:
Bookmark
Bibliographic Tools
Bibliographic and Citation Tools
Bibliographic Explorer Toggle
Bibliographic Explorer ( What is the Explorer? )
Connected Papers Toggle
Connected Papers ( What is Connected Papers? )
Litmaps Toggle
Litmaps ( What is Litmaps? )
scite.ai Toggle
scite Smart Citations ( What are Smart Citations? )
Code, Data, Media
Code, Data and Media Associated with this Article
alphaXiv Toggle
alphaXiv ( What is alphaXiv? )
Links to Code Toggle
CatalyzeX Code Finder for Papers ( What is CatalyzeX? )
DagsHub Toggle
DagsHub ( What is DagsHub? )
GotitPub Toggle
Gotit.pub ( What is GotitPub? )
Huggingface Toggle
Hugging Face ( What is Huggingface? )
ScienceCast Toggle
ScienceCast ( What is ScienceCast? )
Demos
Demos
Replicate Toggle
Replicate ( What is Replicate? )
Spaces Toggle
Hugging Face Spaces ( What is Spaces? )
Spaces Toggle
TXYZ.AI ( What is TXYZ.AI? )
Related Papers
Recommenders and Search Tools
Link to Influence Flower
Influence Flower ( What are Influence Flowers? )
Core recommender toggle
CORE Recommender ( What is CORE? )
IArxiv recommender toggle
IArxiv Recommender
( What is IArxiv? )
Author
Venue
Institution
Topic
About arXivLabs
arXivLabs: experimental projects with community collaborators
arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.
Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.
Have an idea for a project that will add value for arXiv's community? Learn more about arXivLabs .
Which authors of this paper are endorsers? |
Disable MathJax ( What is MathJax? )

## full_text

Computer Science > Machine Learning
arXiv:2606.11182 (cs)
[Submitted on 9 Jun 2026]
Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents
Authors: Weixian Xu , Shilong Liu , Mengdi Wang
View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors
View PDF
HTML (experimental)
Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under real-world task streams. Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability. To mitigate cross-dataset interference, EEVEE introduces a router that partitions incoming inputs into task clusters and assigns them to suitable prompt configurations. This design is optimized via a router-prompt co-evolution strategy, which employs interleaved router and prompt learning phases to address their mutual dependency. Experiments across multiple datasets demonstrate that the framework improves robustness under heterogeneous data streams while maintaining single-benchmark learning capability and efficiency. Specifically, EEVEE improves average multi-benchmark scores by 10.38 and 24.32 points over Qwen3-4B-Instruct and DeepSeek-V3.2, surpassing SOTA methods GEPA and ACE by up to 37.2% and 48.2%.
Comments:
19 pages, 6 figures
Subjects:
Machine Learning (cs.LG) ; Artificial Intelligence (cs.AI)
Cite as:
arXiv:2606.11182 [cs.LG]
(or
arXiv:2606.11182v1 [cs.LG] for this version)
https://doi.org/10.48550/arXiv.2606.11182
Focus to learn more
arXiv-issued DOI via DataCite (pending registration)
Submission history
From: Weixian Xu [ view email ]
[v1]
Tue, 9 Jun 2026 17:57:16 UTC (881 KB)
Full-text links:
Access Paper:
View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors
View PDF
HTML (experimental)
TeX Source
view license
Current browse context:
cs.LG
< prev
next >
new
recent
| 2026-06
Change to browse by:
cs
cs.AI
References & Citations
NASA ADS
Google Scholar
Semantic Scholar
export BibTeX citation
Loading...
BibTeX formatted citation
&times;
loading...
Data provided by:
Bookmark
Bibliographic Tools
Bibliographic and Citation Tools
Bibliographic Explorer Toggle
Bibliographic Explorer ( What is the Explorer? )
Connected Papers Toggle
Connected Papers ( What is Connected Papers? )
Litmaps Toggle
Litmaps ( What is Litmaps? )
scite.ai Toggle
scite Smart Citations ( What are Smart Citations? )
Code, Data, Media
Code, Data and Media Associated with this Article
alphaXiv Toggle
alphaXiv ( What is alphaXiv? )
Links to Code Toggle
CatalyzeX Code Finder for Papers ( What is CatalyzeX? )
DagsHub Toggle
DagsHub ( What is DagsHub? )
GotitPub Toggle
Gotit.pub ( What is GotitPub? )
Huggingface Toggle
Hugging Face ( What is Huggingface? )
ScienceCast Toggle
ScienceCast ( What is ScienceCast? )
Demos
Demos
Replicate Toggle
Replicate ( What is Replicate? )
Spaces Toggle
Hugging Face Spaces ( What is Spaces? )
Spaces Toggle
TXYZ.AI ( What is TXYZ.AI? )
Related Papers
Recommenders and Search Tools
Link to Influence Flower
Influence Flower ( What are Influence Flowers? )
Core recommender toggle
CORE Recommender ( What is CORE? )
IArxiv recommender toggle
IArxiv Recommender
( What is IArxiv? )
Author
Venue
Institution
Topic
About arXivLabs
arXivLabs: experimental projects with community collaborators
arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.
Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.
Have an idea for a project that will add value for arXiv's community? Learn more about arXivLabs .
Which authors of this paper are endorsers? |
Disable MathJax ( What is MathJax? )

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":4210,"paragraph_count":50,"sentence_count":31,"boilerplate_hits":0,"symbol_ratio":0.0036,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   EEVEE是首个面向LLM智能体的多数据集测试时提示学习框架，用于在真实任务流下自改进。为解决跨数据集干扰，它引入路由器将异构输入流划分到任务簇并分配适配提示配置，并通过路由器-提示协同进化策略（交替执行路由器和提示学习阶段）优化二者依赖。实验表明，EEVEE在保持单基准学习能力与效率的同时，提升异构数据流鲁棒性：平均多基准得分比Qwen3-4B-Instruct高10.38分，比DeepSeek-V3.2高24.32分，超越SOTA方法GEPA和ACE最高达37.2%和48.2%。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Computer Science > Machine Learning arXiv:2606.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   11182 (cs) [Submitted on 9 Jun 2026] Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents Authors: Weixian Xu , Shilong Liu , Mengdi Wang View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors View PDF HTML (experimental) Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under rea

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   To mitigate cross-dataset interference, EEVEE introduces a router that partitions incoming inputs into task clusters and assigns them to suitable prompt configurations.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   This design is optimized via a router-prompt co-evolution strategy, which employs interleaved router and prompt learning phases to address their mutual dependency.

## business_elements

- companies: HuggingFace Daily Papers（社区热门论文）, Google
- products: Agents, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 合作 / 联盟
- affected_departments: IT / 安全
- numbers: 3, 4B, 10.38, 3.2, 24.32, 37.2%, 48.2%, 2606.11182
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Computer Science > Machine Learning arXiv:2606. / 11182 (cs) [Submitted on 9 Jun 2026] Title: EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents Authors: Weixian Xu , Shilong Liu , Mengdi Wang View a PDF of the paper titled EEVEE: Towards Test-time Prompt Learning in the Real World for Self-Improving Agents, by Weixian Xu and 1 other authors View PDF HTML (experimental) Abstract: In this paper, we propose EEVEE, the first multi-dataset test-time prompt learning framework for LLM agents, enabling test-time prompt learning under rea / Existing methods are largely designed for single-dataset settings, while real-world applications require models to handle heterogeneous input streams drawn from multiple datasets, domains, and task distributions, limiting their practical applicability.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 4
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 2

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

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"EEVEE：面向真实世界的测试时提示学习框架","discovery_summary":"EEVEE是首个面向LLM智能体的多数据集测试时提示学习框架，用于在真实任务流下自改进。为解决跨数据集干扰，它引入路由器将异构输入流划分到任务簇并分配适配提示配置，并通过路由器-提示协同进化策略（交替执行路由器和提示学习阶段）优化二者依赖。实验表明，EEVEE在保持单基准学习能力与效率的同时，提升异构数据流鲁棒性：平均多基准得分比Qwen3-4B-Instruct高10.38分，比DeepSeek-V3.2高24.32分，超越SOTA方法GEPA和ACE最高达37.2%和48.2%。","source_name":"HuggingFace Daily Papers（社区热门论文）","origin_url":"https://arxiv.org/abs/2606.11182","discovered_at":"2026-06-10T04:01:59.484Z","rank_on_page":220,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

EEVEE是首个面向LLM智能体的多数据集测试时提示学习框架，用于在真实任务流下自改进。为解决跨数据集干扰，它引入路由器将异构输入流划分到任务簇并分配适配提示配置，并通过路由器-提示协同进化策略（交替执行路由器和提示学习阶段）优化二者依赖。实验表明，EEVEE在保持单基准学习能力与效率的同时，提升异构数据流鲁棒性：平均多基准得分比Qwen3-4B-Instruct高10.38分，比DeepSeek-V3.2高24.32分，超越SOTA方法GEPA和ACE最高达37.2%和48.2%。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
