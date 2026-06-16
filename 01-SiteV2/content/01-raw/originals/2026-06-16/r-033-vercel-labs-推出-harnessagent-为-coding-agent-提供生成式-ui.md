---
schema_version: raw-evidence-v2
raw_id: R-033
title: "Vercel Labs 推出 HarnessAgent：为 Coding Agent 提供生成式 UI"
original_url: "https://x.com/shao__meng/status/2066690742727409944"
canonical_url: "https://x.com/shao__meng/status/2066690742727409944"
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
published_at: "2026-06-16T01:14:04.000Z"
collected_at: 2026-06-16T03:08:04.929Z
language: mixed
full_text_hash: 8723d516971ac701
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-16/r-033-vercel-labs-推出-harnessagent-为-coding-agent-提供生成式-ui.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-16/r-033-vercel-labs-推出-harnessagent-为-coding-agent-提供生成式-ui.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 87
extractor_diagnostics: {"readability_score":87,"text_length":3507,"paragraph_count":34,"sentence_count":17,"boilerplate_hits":1,"symbol_ratio":0.0137,"method":"main"}
has_full_text: true
content_length: 3507
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"8723d516971ac701","missing":[]}
source_volatility: high
community_name: "X：邵猛 (@shao__meng)"
capture_scope: visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: community_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Vercel Labs 推出 HarnessAgent：为 Coding Agent 提供生成式 UI","discovery_summary":"Vercel Labs 利用 AI SDK 7 实验 API 推出 HarnessAgent，结合 json-render 为 Claude Code / Codex / Pi 等 Coding Agent 提供生成式 UI。Agent 在 Vercel Sandbox 隔离 Linux 环境中执行写文件、跑测试等真实操作，输出受 Zod schema 约束的 JSONL UI 规格（仅限 Steps、FileChange、Terminal 等预定义组件），前端通过 useChat + useJsonRenderMessage 实时渲染。核心设计：Harness 抽象允许像换模型一样互换 Agent；UI 层与执行层完全解耦；Session 绑定 Sandbox，10 分钟空闲或\"Start Over\" 销毁。Agent 不得虚构结果，失败必须展示 error step、非零 exit code 或失败测试。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2066690742727409944","discovered_at":"2026-06-16T03:02:46.994Z","rank_on_page":36,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: a59d914471c05646
content_hash: 8723d516971ac701
semantic_hash: 1ae0b6c66d3b6c5e
duplicate_of: ""
first_seen_at: "2026-06-16T01:14:04.000Z"
last_seen_at: 2026-06-16T03:08:04.929Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":true,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["X","邵猛 (@shao__meng)","GitHub"],"products":["Agent","Claude","Codex","codex","agent"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["7","10","212","1","2","3","4","5"],"quotes":["Start Over"]}
evidence_seed: {"company_actions":["Post Log in Sign up Post meng shao @shao__meng Generative UI × Agent Harness Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。","com/vercel-labs/js… 心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工： x.","com/trq212/status/… 技术架构（三层解耦） 用户 Prompt HarnessAgent（AI SDK 7 实验 API） ├─ Claude Code / Codex / Pi（可互换） └─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test） Agent 输出：短 prose + ```spec 围栏内的 JSONL pipeJsonRender（从流中提取 spec → data-spec parts） 前端 useChat + useJsonRenderMessage → 渲染组件树 关键设计点： 1."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"Vercel Labs 利用 AI SDK 7 实验 API 推出 HarnessAgent，结合 json-render 为 Claude Code / Codex / Pi 等 Coding Agent 提供生成式 UI。Agent 在 Vercel Sandbox 隔离 Linux 环境中执行写文件、跑测试等真实操作，输出受 Zod schema 约束的 JSONL UI 规格（仅限 Steps、FileChange、Terminal 等预定义组件），前端通过 useChat + useJsonRenderMessage 实时渲染。核心设计：Harness 抽象允许像换模型一样互换 Agent；UI 层与执行层完全解耦；Session 绑定 Sandbox，10 分钟空闲或\"Start Over\" 销毁。Agent 不得虚构结果，失败必须展示 error step、非零 exit code 或失败测试。","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Post Log in Sign up Post meng shao @shao__meng Generative UI × Agent Harness Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"com/vercel-labs/js… 心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工： x.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"com/trq212/status/… 技术架构（三层解耦） 用户 Prompt HarnessAgent（AI SDK 7 实验 API） ├─ Claude Code / Codex / Pi（可互换） └─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test） Agent 输出：短 prose + ```spec 围栏内的 JSONL pipeJsonRender（从流中提取 spec → data-spec parts） 前端 useChat + useJsonRenderMessage → 渲染组件树 关键设计点： 1.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"opinion","text":"Harness 抽象与模型抽象对称 AI SDK 7 的 HarnessAgent 让你像换模型一样换 Harness——claudeCode 换成 codex 或 pi，调用方式不变。","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Harness 管 skills、sandbox、session、权限、compaction 等「模型之上的层」。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Vercel Labs 推出 HarnessAgent：为 Coding Agent 提供生成式 UI

## clean_text

Post
Log in Sign up
Post
meng shao
@shao__meng
Generative UI × Agent Harness
Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。
github.com/vercel-labs/js…
心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工：
x.com/trq212/status/…
技术架构（三层解耦）
用户 Prompt
HarnessAgent（AI SDK 7 实验 API）
├─ Claude Code / Codex / Pi（可互换）
└─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test）
Agent 输出：短 prose + ```spec 围栏内的 JSONL
pipeJsonRender（从流中提取 spec → data-spec parts）
前端 useChat + useJsonRenderMessage → 渲染组件树
关键设计点：
1. Harness 抽象与模型抽象对称
AI SDK 7 的 HarnessAgent 让你像换模型一样换 Harness——claudeCode 换成 codex 或 pi，调用方式不变。Harness 管 skills、sandbox、session、权限、compaction 等「模型之上的层」。
2. UI 层与执行层完全解耦
HarnessAgent. stream() 返回标准 AI SDK StreamTextResult，因此 json-render 管道与单模型 chat 示例 完全相同。换 Agent Harness，前端代码不用改。
3. Catalog 约束 = 安全 + 可预测
Agent 只能使用预定义组件（Steps、FileChange、Terminal、TestResults、Metric、BarChart…），输出必须符合 Zod schema。AI 生成 UI，但 在你划定的组件边界内。
4. Session 绑定 Sandbox
每个 chat 维护一个 live session + sandbox；首条消息冷启动较慢，后续复用同一工作区。10 分钟 idle 或「Start Over」会销毁 sandbox。
一次完整交互里发生了什么
1. 用户选 Agent（Claude Code / Codex / Pi）并发送任务
2. 服务端 getSession(chatId, agent) 创建或复用 Harness session
3. Agent 在 sandbox 内执行真实操作（写文件、跑测试、benchmark 等）
4. 回合结束时 Agent 输出：
· 一两句 conversational 总结
· 一个 ```spec 围栏包裹的 JSONL UI 报告
5. pipeJsonRender 把 spec 从文本流中拆出，变成 typed data-spec parts
6. 前端同时渲染：Markdown prose、工具调用活动行（bash/edit/read…）、结构化报告组件
Agent 的 system instructions 明确要求：不得虚构结果——失败就展示 error step、非零 exit code、失败测试；Terminal 必须用 session 中真实捕获的输出。
Chris Tate
@ctatedev
10h
Introducing Generative UI for Claude Code, Codex and Pi
Charts, forms, 3D, anything
Your agent renders real UI for users while it works in a sandbox
Powered by AI SDK's experimental HarnessAgent + json-render
00:00
1:14 AM · Jun 16, 2026 580 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
Read 1 reply

## full_text

Post
Log in Sign up
Post
meng shao
@shao__meng
Generative UI × Agent Harness
Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。
github.com/vercel-labs/js…
心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工：
x.com/trq212/status/…
技术架构（三层解耦）
用户 Prompt
HarnessAgent（AI SDK 7 实验 API）
├─ Claude Code / Codex / Pi（可互换）
└─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test）
Agent 输出：短 prose + ```spec 围栏内的 JSONL
pipeJsonRender（从流中提取 spec → data-spec parts）
前端 useChat + useJsonRenderMessage → 渲染组件树
关键设计点：
1. Harness 抽象与模型抽象对称
AI SDK 7 的 HarnessAgent 让你像换模型一样换 Harness——claudeCode 换成 codex 或 pi，调用方式不变。Harness 管 skills、sandbox、session、权限、compaction 等「模型之上的层」。
2. UI 层与执行层完全解耦
HarnessAgent. stream() 返回标准 AI SDK StreamTextResult，因此 json-render 管道与单模型 chat 示例 完全相同。换 Agent Harness，前端代码不用改。
3. Catalog 约束 = 安全 + 可预测
Agent 只能使用预定义组件（Steps、FileChange、Terminal、TestResults、Metric、BarChart…），输出必须符合 Zod schema。AI 生成 UI，但 在你划定的组件边界内。
4. Session 绑定 Sandbox
每个 chat 维护一个 live session + sandbox；首条消息冷启动较慢，后续复用同一工作区。10 分钟 idle 或「Start Over」会销毁 sandbox。
一次完整交互里发生了什么
1. 用户选 Agent（Claude Code / Codex / Pi）并发送任务
2. 服务端 getSession(chatId, agent) 创建或复用 Harness session
3. Agent 在 sandbox 内执行真实操作（写文件、跑测试、benchmark 等）
4. 回合结束时 Agent 输出：
· 一两句 conversational 总结
· 一个 ```spec 围栏包裹的 JSONL UI 报告
5. pipeJsonRender 把 spec 从文本流中拆出，变成 typed data-spec parts
6. 前端同时渲染：Markdown prose、工具调用活动行（bash/edit/read…）、结构化报告组件
Agent 的 system instructions 明确要求：不得虚构结果——失败就展示 error step、非零 exit code、失败测试；Terminal 必须用 session 中真实捕获的输出。
Chris Tate
@ctatedev
10h
Introducing Generative UI for Claude Code, Codex and Pi
Charts, forms, 3D, anything
Your agent renders real UI for users while it works in a sandbox
Powered by AI SDK's experimental HarnessAgent + json-render
00:00
1:14 AM · Jun 16, 2026 580 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 1
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
Read 1 reply

## extraction_diagnostics

- extraction_method: main
- readability_score: 87
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":87,"text_length":3507,"paragraph_count":34,"sentence_count":17,"boilerplate_hits":1,"symbol_ratio":0.0137,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=high
   Vercel Labs 利用 AI SDK 7 实验 API 推出 HarnessAgent，结合 json-render 为 Claude Code / Codex / Pi 等 Coding Agent 提供生成式 UI。Agent 在 Vercel Sandbox 隔离 Linux 环境中执行写文件、跑测试等真实操作，输出受 Zod schema 约束的 JSONL UI 规格（仅限 Steps、FileChange、Terminal 等预定义组件），前端通过 useChat + useJsonRenderMessage 实时渲染。核心设计：Harness 抽象允许像换模型一样互换 Agent；UI 层与执行层完全解耦；Session 绑定 Sandbox，10 分钟空闲或"Start Over" 销毁。Agent 不得虚构结果，失败必须展示 error step、非零 exit code 或失败测试。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Post Log in Sign up Post meng shao @shao__meng Generative UI × Agent Harness Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   com/vercel-labs/js… 心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工： x.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   com/trq212/status/… 技术架构（三层解耦） 用户 Prompt HarnessAgent（AI SDK 7 实验 API） ├─ Claude Code / Codex / Pi（可互换） └─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test） Agent 输出：短 prose + ```spec 围栏内的 JSONL pipeJsonRender（从流中提取 spec → data-spec parts） 前端 useChat + useJsonRenderMessage → 渲染组件树 关键设计点： 1.

5. **opinion**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=high
   Harness 抽象与模型抽象对称 AI SDK 7 的 HarnessAgent 让你像换模型一样换 Harness——claudeCode 换成 codex 或 pi，调用方式不变。

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Harness 管 skills、sandbox、session、权限、compaction 等「模型之上的层」。

## business_elements

- companies: X, 邵猛 (@shao__meng), GitHub
- products: Agent, Claude, Codex, codex, agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 7, 10, 212, 1, 2, 3, 4, 5
- quotes: Start Over

## evidence_seed

- company_actions: Post Log in Sign up Post meng shao @shao__meng Generative UI × Agent Harness Coding Agent（Claude Code / Codex / Pi）在 Vercel Sandbox 里真实改代码、跑命令、测用例；汇报时不再只返回 Markdown，它基于「json-render」输出受约束的 JSON UI 规格，前端实时渲染成步骤、Diff、终端、测试结果、图表等组件。 / com/vercel-labs/js… 心开发者 @ trq212 「Using Claude Code: The Unreasonable Effectiveness of HTML」异曲同工： x. / com/trq212/status/… 技术架构（三层解耦） 用户 Prompt HarnessAgent（AI SDK 7 实验 API） ├─ Claude Code / Codex / Pi（可互换） └─ Vercel Sandbox（隔离 Linux 环境，真实 bash/edit/test） Agent 输出：短 prose + ```spec 围栏内的 JSONL pipeJsonRender（从流中提取 spec → data-spec parts） 前端 useChat + useJsonRenderMessage → 渲染组件树 关键设计点： 1.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: true
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

- emerging_pool
- user_feedback_pool
- watchlist

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
- discovery_record: {"discovery_title":"Vercel Labs 推出 HarnessAgent：为 Coding Agent 提供生成式 UI","discovery_summary":"Vercel Labs 利用 AI SDK 7 实验 API 推出 HarnessAgent，结合 json-render 为 Claude Code / Codex / Pi 等 Coding Agent 提供生成式 UI。Agent 在 Vercel Sandbox 隔离 Linux 环境中执行写文件、跑测试等真实操作，输出受 Zod schema 约束的 JSONL UI 规格（仅限 Steps、FileChange、Terminal 等预定义组件），前端通过 useChat + useJsonRenderMessage 实时渲染。核心设计：Harness 抽象允许像换模型一样互换 Agent；UI 层与执行层完全解耦；Session 绑定 Sandbox，10 分钟空闲或\"Start Over\" 销毁。Agent 不得虚构结果，失败必须展示 error step、非零 exit code 或失败测试。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2066690742727409944","discovered_at":"2026-06-16T03:02:46.994Z","rank_on_page":36,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Vercel Labs 利用 AI SDK 7 实验 API 推出 HarnessAgent，结合 json-render 为 Claude Code / Codex / Pi 等 Coding Agent 提供生成式 UI。Agent 在 Vercel Sandbox 隔离 Linux 环境中执行写文件、跑测试等真实操作，输出受 Zod schema 约束的 JSONL UI 规格（仅限 Steps、FileChange、Terminal 等预定义组件），前端通过 useChat + useJsonRenderMessage 实时渲染。核心设计：Harness 抽象允许像换模型一样互换 Agent；UI 层与执行层完全解耦；Session 绑定 Sandbox，10 分钟空闲或"Start Over" 销毁。Agent 不得虚构结果，失败必须展示 error step、非零 exit code 或失败测试。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
