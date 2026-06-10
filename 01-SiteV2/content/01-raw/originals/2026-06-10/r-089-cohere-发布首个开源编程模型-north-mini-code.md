---
schema_version: raw-evidence-v2
raw_id: R-089
title: "Cohere 发布首个开源编程模型 North Mini Code"
original_url: "https://x.com/shao__meng/status/2064518114835108255"
canonical_url: "https://x.com/shao__meng/status/2064518114835108255"
source_name: "X：邵猛 (@shao__meng)"
source_type: community
source_level: C
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
published_at: "2026-06-10T01:20:50.000Z"
collected_at: 2026-06-10T04:09:42.587Z
language: mixed
full_text_hash: 937e5eaa5933f1c7
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-10/r-089-cohere-发布首个开源编程模型-north-mini-code.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-10/r-089-cohere-发布首个开源编程模型-north-mini-code.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":3831,"paragraph_count":42,"sentence_count":9,"boilerplate_hits":1,"symbol_ratio":0.0271,"method":"main"}
has_full_text: true
content_length: 3831
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"937e5eaa5933f1c7","missing":[]}
source_volatility: high
community_name: "X：邵猛 (@shao__meng)"
capture_scope: visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: community_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Cohere 发布首个开源编程模型 North Mini Code","discovery_summary":"Cohere 推出首个开源编程模型 North Mini Code（MoE 30B/3B，128 专家，每 token 激活 8 个），支持 256K 输入/64K 输出，最低 1×H100（FP8）。训练采用三阶段后训练：级联 SFT（含 Agent 工具调用与推理数据）→ RLVR（CISPO 算法，异步采样，Terminal+SWE 双环境联合训练）→ 跨脚手架泛化。Agent 编程方面，Artificial Analysis Coding Index 达 33.4，同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4 等，超过 Nemotron 3 Super 120B，稍低于 Qwen3.6 35B-A3B（约 35.2）。推理速度对比 Devstral Small 2 最高约 2.8×，词间延迟约 -30%。非编程 Agent 任务偏弱。推荐 temperature=1.0、top_p=0.95。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2064518114835108255","discovered_at":"2026-06-10T04:01:59.452Z","rank_on_page":60,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 93c6db8048361395
content_hash: 937e5eaa5933f1c7
semantic_hash: daa7f81025d52b18
duplicate_of: ""
first_seen_at: "2026-06-10T01:20:50.000Z"
last_seen_at: 2026-06-10T04:09:42.587Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","emerging_pool","user_feedback_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["X","邵猛 (@shao__meng)","Mistral"],"products":["Agent"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["30B","3B","128","8","256","64","1","100"],"quotes":[]}
evidence_seed: {"company_actions":["Post Log in Sign up Post meng shao @shao__meng Cohere 发布首个开源编程模型「North Mini Code」 小参数、高效率、专做 Agent 编程 参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个 上下文：256K 输入 / 64K 输出 最低硬件：1× H100（FP8） 官方发布 cohere.","com/blog/north-min… HuggingFace huggingface.","RLVR（可验证奖励强化学习） · 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释） · 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异 · 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent） · 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分 3."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Cohere 推出首个开源编程模型 North Mini Code（MoE 30B/3B，128 专家，每 token 激活 8 个），支持 256K 输入/64K 输出，最低 1×H100（FP8）。训练采用三阶段后训练：级联 SFT（含 Agent 工具调用与推理数据）→ RLVR（CISPO 算法，异步采样，Terminal+SWE 双环境联合训练）→ 跨脚手架泛化。Agent 编程方面，Artificial Analysis Coding Index 达 33.4，同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4 等，超过 Nemotron 3 Super 120B，稍低于 Qwen3.6 35B-A3B（约 35.2）。推理速度对比 Devstral Small 2 最高约 2.8×，词间延迟约 -30%。非编程 Agent 任务偏弱。推荐 temperature=1.0、top_p=0.95。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Post Log in Sign up Post meng shao @shao__meng Cohere 发布首个开源编程模型「North Mini Code」 小参数、高效率、专做 Agent 编程 参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个 上下文：256K 输入 / 64K 输出 最低硬件：1× H100（FP8） 官方发布 cohere.","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"com/blog/north-min… HuggingFace huggingface.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"number","text":"co/CohereLabs/Nor… # SFT · 一阶段（64K）：代码约 70% 可训练 token（43% Agent 工具调用 + 27% 单轮竞赛/科学编程），混推理与指令跟随 · 二阶段（128K）：约 4.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"number","text":"5B token，61% 为代码，全为 Agent/推理样本，工具调用与完成结果均校验可执行 · 数据来自 7 万+ 可验证任务、约 5000 个仓库；与 SWE-Bench 源去重，防泄漏 · SFT 目标不是刷榜，而是为 RL 打底：优化 pass@K 与采样多样性 2.","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"RLVR（可验证奖励强化学习） · 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释） · 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异 · 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent） · 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分 3.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Cohere 发布首个开源编程模型 North Mini Code

## clean_text

Post
Log in Sign up
Post
meng shao
@shao__meng
Cohere 发布首个开源编程模型「North Mini Code」
小参数、高效率、专做 Agent 编程
参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个
上下文：256K 输入 / 64K 输出
最低硬件：1× H100（FP8）
官方发布
cohere.com/blog/north-min…
HuggingFace
huggingface.co/CohereLabs/Nor…
# SFT
· 一阶段（64K）：代码约 70% 可训练 token（43% Agent 工具调用 + 27% 单轮竞赛/科学编程），混推理与指令跟随
· 二阶段（128K）：约 4.5B token，61% 为代码，全为 Agent/推理样本，工具调用与完成结果均校验可执行
· 数据来自 7 万+ 可验证任务、约 5000 个仓库；与 SWE-Bench 源去重，防泄漏
· SFT 目标不是刷榜，而是为 RL 打底：优化 pass@K 与采样多样性
2. RLVR（可验证奖励强化学习）
· 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释）
· 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异
· 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent）
· 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分
3. 跨 Harness 泛化
· 训练时暴露多种 Agent 脚手架（SWE-Agent、mini-SWE、OpenCode 等）
· 二阶段 SFT 中约 6% 为其他 benchmark harness 数据
· OpenCode 评估约 +10%；mini-SWE-Agent 上 pass@1 达 61.0%，属「免费迁移」
SFT 结束时：SWE-Bench Verified pass@10 = 80.2%，Terminal-Bench v2 pass@10 = 55.1%。RL 后 Terminal pass@1 +7.9%，SWE pass@1 +3.0%；轨迹更短、无效工具调用更少。
# 基准表现
Agent 编程（核心卖点）
· Artificial Analysis Coding Index：33.4
· 同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4、Devstral Small 2 等
· 甚至超过 Nemotron 3 Super（120B）、Mistral Small 4（119B）等更大模型
· 仍略低于 Qwen3.6 35B-A3B（约 35.2）
评测集：SWE-Bench Verified/Pro、Terminal-Bench v2/Hard、SciCode、LiveCodeBench v6
Harness：SWE-Agent v1.1.0、ReAct+Tmux、Terminus-2 等；temperature=1.0，top_p=0.95，3 seed 平均
非编程 Agent 任务偏弱（第三方汇总）：GDPval-AA ~14%，τ²-Bench Telecom ~37%，Agentic Index 综合约 21.7——专精编程，非通用 Agent。
推理速度（对比 Devstral Small 2，Cohere 内部测试）
· 同并发下输出吞吐最高约 2.8×
· 词间延迟约 -30%
· TTFT 略逊于 Devstral Small 2
# Agent 能力设计
模型原生支持交错思考与工具调用，格式类似 Cohere Command 系列：
<|START_THINKING|> ... <|END_THINKING|>
<|START_ACTION|> [JSON tool calls] <|END_ACTION|>
<|START_TOOL_RESULT|> ... <|END_TOOL_RESULT|>
<|START_RESPONSE|> ... <|END_RESPONSE|>
使用要点：
· 必须把 reasoning/thinking 一并写入对话历史，否则效果下降
· 工具描述建议用 JSON Schema
· 推荐采样：temperature=1.0，top_p=0.95
· 需较新 Transformers 源码、vLLM main + cohere_melody>=0.9.0
面向场景：子 Agent 编排、系统架构理解、Code Review、终端操作、多步软件工程。
Cohere
@cohere
12h
Introducing Cohere's first open-source coding model: North Mini Code
Small & efficient, designed for agentic performance and built for community input.
Nick Frosst
00:00
Nick Frosst
1:20 AM · Jun 10, 2026 692 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
Read 1 reply

## full_text

Post
Log in Sign up
Post
meng shao
@shao__meng
Cohere 发布首个开源编程模型「North Mini Code」
小参数、高效率、专做 Agent 编程
参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个
上下文：256K 输入 / 64K 输出
最低硬件：1× H100（FP8）
官方发布
cohere.com/blog/north-min…
HuggingFace
huggingface.co/CohereLabs/Nor…
# SFT
· 一阶段（64K）：代码约 70% 可训练 token（43% Agent 工具调用 + 27% 单轮竞赛/科学编程），混推理与指令跟随
· 二阶段（128K）：约 4.5B token，61% 为代码，全为 Agent/推理样本，工具调用与完成结果均校验可执行
· 数据来自 7 万+ 可验证任务、约 5000 个仓库；与 SWE-Bench 源去重，防泄漏
· SFT 目标不是刷榜，而是为 RL 打底：优化 pass@K 与采样多样性
2. RLVR（可验证奖励强化学习）
· 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释）
· 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异
· 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent）
· 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分
3. 跨 Harness 泛化
· 训练时暴露多种 Agent 脚手架（SWE-Agent、mini-SWE、OpenCode 等）
· 二阶段 SFT 中约 6% 为其他 benchmark harness 数据
· OpenCode 评估约 +10%；mini-SWE-Agent 上 pass@1 达 61.0%，属「免费迁移」
SFT 结束时：SWE-Bench Verified pass@10 = 80.2%，Terminal-Bench v2 pass@10 = 55.1%。RL 后 Terminal pass@1 +7.9%，SWE pass@1 +3.0%；轨迹更短、无效工具调用更少。
# 基准表现
Agent 编程（核心卖点）
· Artificial Analysis Coding Index：33.4
· 同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4、Devstral Small 2 等
· 甚至超过 Nemotron 3 Super（120B）、Mistral Small 4（119B）等更大模型
· 仍略低于 Qwen3.6 35B-A3B（约 35.2）
评测集：SWE-Bench Verified/Pro、Terminal-Bench v2/Hard、SciCode、LiveCodeBench v6
Harness：SWE-Agent v1.1.0、ReAct+Tmux、Terminus-2 等；temperature=1.0，top_p=0.95，3 seed 平均
非编程 Agent 任务偏弱（第三方汇总）：GDPval-AA ~14%，τ²-Bench Telecom ~37%，Agentic Index 综合约 21.7——专精编程，非通用 Agent。
推理速度（对比 Devstral Small 2，Cohere 内部测试）
· 同并发下输出吞吐最高约 2.8×
· 词间延迟约 -30%
· TTFT 略逊于 Devstral Small 2
# Agent 能力设计
模型原生支持交错思考与工具调用，格式类似 Cohere Command 系列：
<|START_THINKING|> ... <|END_THINKING|>
<|START_ACTION|> [JSON tool calls] <|END_ACTION|>
<|START_TOOL_RESULT|> ... <|END_TOOL_RESULT|>
<|START_RESPONSE|> ... <|END_RESPONSE|>
使用要点：
· 必须把 reasoning/thinking 一并写入对话历史，否则效果下降
· 工具描述建议用 JSON Schema
· 推荐采样：temperature=1.0，top_p=0.95
· 需较新 Transformers 源码、vLLM main + cohere_melody>=0.9.0
面向场景：子 Agent 编排、系统架构理解、Code Review、终端操作、多步软件工程。
Cohere
@cohere
12h
Introducing Cohere's first open-source coding model: North Mini Code
Small & efficient, designed for agentic performance and built for community input.
Nick Frosst
00:00
Nick Frosst
1:20 AM · Jun 10, 2026 692 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
Read 1 reply

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":3831,"paragraph_count":42,"sentence_count":9,"boilerplate_hits":1,"symbol_ratio":0.0271,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   Cohere 推出首个开源编程模型 North Mini Code（MoE 30B/3B，128 专家，每 token 激活 8 个），支持 256K 输入/64K 输出，最低 1×H100（FP8）。训练采用三阶段后训练：级联 SFT（含 Agent 工具调用与推理数据）→ RLVR（CISPO 算法，异步采样，Terminal+SWE 双环境联合训练）→ 跨脚手架泛化。Agent 编程方面，Artificial Analysis Coding Index 达 33.4，同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4 等，超过 Nemotron 3 Super 120B，稍低于 Qwen3.6 35B-A3B（约 35.2）。推理速度对比 Devstral Small 2 最高约 2.8×，词间延迟约 -30%。非编程 Agent 任务偏弱。推荐 temperature=1.0、top_p=0.95。

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   Post Log in Sign up Post meng shao @shao__meng Cohere 发布首个开源编程模型「North Mini Code」 小参数、高效率、专做 Agent 编程 参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个 上下文：256K 输入 / 64K 输出 最低硬件：1× H100（FP8） 官方发布 cohere.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   com/blog/north-min… HuggingFace huggingface.

4. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   co/CohereLabs/Nor… # SFT · 一阶段（64K）：代码约 70% 可训练 token（43% Agent 工具调用 + 27% 单轮竞赛/科学编程），混推理与指令跟随 · 二阶段（128K）：约 4.

5. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   5B token，61% 为代码，全为 Agent/推理样本，工具调用与完成结果均校验可执行 · 数据来自 7 万+ 可验证任务、约 5000 个仓库；与 SWE-Bench 源去重，防泄漏 · SFT 目标不是刷榜，而是为 RL 打底：优化 pass@K 与采样多样性 2.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   RLVR（可验证奖励强化学习） · 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释） · 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异 · 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent） · 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分 3.

## business_elements

- companies: X, 邵猛 (@shao__meng), Mistral
- products: Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 30B, 3B, 128, 8, 256, 64, 1, 100
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Post Log in Sign up Post meng shao @shao__meng Cohere 发布首个开源编程模型「North Mini Code」 小参数、高效率、专做 Agent 编程 参数：MoE 架构(30B, 3B)，128专家，每 token 激活 8 个 上下文：256K 输入 / 64K 输出 最低硬件：1× H100（FP8） 官方发布 cohere. / com/blog/north-min… HuggingFace huggingface. / RLVR（可验证奖励强化学习） · 算法：CISPO（token 级重要性采样，长轨迹不被短样本稀释） · 异步采样：vLLM sidecar + 窗口 FIFO 队列，缓解 Agent rollout 长度差异 · 双环境联合训练：Terminal（ReAct + bash）+ SWE（SWE-Agent） · 奖励：单元测试二值奖励；无效工具调用/不可解析输出得 0 分 3.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- core_pool
- emerging_pool
- user_feedback_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: X：邵猛 (@shao__meng)
- capture_scope: visible_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: community_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Cohere 发布首个开源编程模型 North Mini Code","discovery_summary":"Cohere 推出首个开源编程模型 North Mini Code（MoE 30B/3B，128 专家，每 token 激活 8 个），支持 256K 输入/64K 输出，最低 1×H100（FP8）。训练采用三阶段后训练：级联 SFT（含 Agent 工具调用与推理数据）→ RLVR（CISPO 算法，异步采样，Terminal+SWE 双环境联合训练）→ 跨脚手架泛化。Agent 编程方面，Artificial Analysis Coding Index 达 33.4，同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4 等，超过 Nemotron 3 Super 120B，稍低于 Qwen3.6 35B-A3B（约 35.2）。推理速度对比 Devstral Small 2 最高约 2.8×，词间延迟约 -30%。非编程 Agent 任务偏弱。推荐 temperature=1.0、top_p=0.95。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2064518114835108255","discovered_at":"2026-06-10T04:01:59.452Z","rank_on_page":60,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Cohere 推出首个开源编程模型 North Mini Code（MoE 30B/3B，128 专家，每 token 激活 8 个），支持 256K 输入/64K 输出，最低 1×H100（FP8）。训练采用三阶段后训练：级联 SFT（含 Agent 工具调用与推理数据）→ RLVR（CISPO 算法，异步采样，Terminal+SWE 双环境联合训练）→ 跨脚手架泛化。Agent 编程方面，Artificial Analysis Coding Index 达 33.4，同量级开源中领先 Qwen3.5 35B-A3B、Gemma 4 等，超过 Nemotron 3 Super 120B，稍低于 Qwen3.6 35B-A3B（约 35.2）。推理速度对比 Devstral Small 2 最高约 2.8×，词间延迟约 -30%。非编程 Agent 任务偏弱。推荐 temperature=1.0、top_p=0.95。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
