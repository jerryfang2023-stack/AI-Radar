---
schema_version: raw-evidence-v2
raw_id: R-021
title: "Show HN: ContextFort – Visibility and controls for browser agents"
original_url: "https://contextfort.ai/"
canonical_url: "https://contextfort.ai"
source_name: "Hacker News"
source_type: community
source_level: C
acquisition_source_level: ""
acquisition_channel: hn
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-01-14T09:22:42Z"
collected_at: 2026-05-18T07:52:02.253Z
language: mixed
full_text_hash: 5cdc23394532fd2c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-021-show-hn-contextfort-visibility-and-controls-for-browser-agents.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-021-show-hn-contextfort-visibility-and-controls-for-browser-agents.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-clean-text
extraction_quality: medium
has_full_text: true
content_length: 2248
fetch_error: ""
source_volatility: high
community_name: "Hacker News"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: ""
discovery_record: null
source_role: primary_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 187b523e58bfa735
content_hash: 5cdc23394532fd2c
semantic_hash: 0ecbc4c5217eb2c2
duplicate_of: ""
first_seen_at: "2026-01-14T09:22:42Z"
last_seen_at: 2026-05-18T07:52:02.253Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":false,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
guanlan_scores: {"commercial_value":3,"novelty":3,"evidence_strength":3,"case_richness":4,"trend_relevance":4,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News","GitHub","AWS","Cursor"],"products":["agents","agent","Agents","Cursor","Claude","Agent"],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["权限 / 安全治理"],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["14","1","7M","51","7"],"quotes":["understand your project","Is this process malicious?","What did this agent access?","is this malicious?","what did this agent do?"]}
evidence_seed: {"company_actions":["14 points / 1 comments / query=open source AI agent enterprise adoption","ContextFort Backed by Y Combinator Visibility and Controls for AI Agents in the Endpoint Know exactly what coding agents are doing on your engineers' machines.","Every file, every credential, every network connection."],"case_details":[],"workflow_changes":["Cursor Claude Code Every file touched Network connections Processes spawned Book a demo View GitHub The problem What AI coding agents can access When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例","缺少一手来源或可靠转述来源"]
key_excerpts: [{"type":"company_action","text":"14 points / 1 comments / query=open source AI agent enterprise adoption","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"ContextFort Backed by Y Combinator Visibility and Controls for AI Agents in the Endpoint Know exactly what coding agents are doing on your engineers' machines.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"workflow_change","text":"Cursor Claude Code Every file touched Network connections Processes spawned Book a demo View GitHub The problem What AI coding agents can access When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Every file, every credential, every network connection.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Secrets & Keys SSH & Git Filesystem Network Shell Execution Data Exfiltration Environment variables & secrets AWS keys, database credentials, API tokens in .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"env files — all readable by the agent as context.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Show HN: ContextFort – Visibility and controls for browser agents

## clean_text

ContextFort
Backed by Y
Combinator
Visibility and Controls for AI Agents in the Endpoint
Know exactly what coding agents are doing
on your engineers' machines.
Cursor
Claude Code
Every file touched
Network connections
Processes spawned
Book a demo View GitHub
The problem What AI coding agents can access
When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions. No sandbox. No restrictions. Every file, every credential, every network connection.
Secrets & Keys
SSH & Git
Filesystem
Network
Shell Execution
Data Exfiltration
Environment variables & secrets
AWS keys, database credentials, API tokens in .env files — all readable by the agent as context. The agent doesn't need to be malicious. It reads .env to "understand your project" and sends it to the AI provider's API.
$ cat .env
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG...
DATABASE_URL=postgres://admin:password@prod.db...
STRIPE_SECRET_KEY=sk_live_51H7...
Traditional EDR
ContextFort
Detects malware & known threats
Logs all AI agent activity — malicious or not
Asks: "Is this process malicious?"
Asks: "What did this agent access?"
No concept of AI-generated actions
Built specifically for AI coding agents
Agent self-reported logs
Independent OS-level monitoring
No audit trail for AI actions
Complete audit trail of every agent action
The gap Why CrowdStrike isn't enough
EDR detects threats. It doesn't audit what AI agents are doing. These are fundamentally different questions — one asks “is this malicious?”, the other asks “what did this agent do?”
The solution OS-level telemetry for AI coding agents
ContextFort monitors from the kernel — independently of the agent. Built with eBPF on Linux, Endpoint Security Framework on macOS, and ETW + Minifilter on Windows.
Telemetry Sandboxing Platforms
File access telemetry
Every file the agent reads or writes — .env, credentials, SSH keys, source code.
Network monitoring
Every outbound connection — what data is sent, where it goes, which process initiated it.
Process tree tracking
Full visibility into every subprocess — shell commands, package installs, builds.
Independent audit trail
OS-level logs the agent can't tamper with. Know exactly what happened and when.
Book a demo View GitHub

## full_text

ContextFort
Backed by Y
Combinator
Visibility and Controls for AI Agents in the Endpoint
Know exactly what coding agents are doing
on your engineers' machines.
Cursor
Claude Code
Every file touched
Network connections
Processes spawned
Book a demo View GitHub
The problem What AI coding agents can access
When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions. No sandbox. No restrictions. Every file, every credential, every network connection.
Secrets & Keys
SSH & Git
Filesystem
Network
Shell Execution
Data Exfiltration
Environment variables & secrets
AWS keys, database credentials, API tokens in .env files — all readable by the agent as context. The agent doesn't need to be malicious. It reads .env to "understand your project" and sends it to the AI provider's API.
$ cat .env
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG...
DATABASE_URL=postgres://admin:password@prod.db...
STRIPE_SECRET_KEY=sk_live_51H7...
Traditional EDR
ContextFort
Detects malware & known threats
Logs all AI agent activity — malicious or not
Asks: "Is this process malicious?"
Asks: "What did this agent access?"
No concept of AI-generated actions
Built specifically for AI coding agents
Agent self-reported logs
Independent OS-level monitoring
No audit trail for AI actions
Complete audit trail of every agent action
The gap Why CrowdStrike isn't enough
EDR detects threats. It doesn't audit what AI agents are doing. These are fundamentally different questions — one asks “is this malicious?”, the other asks “what did this agent do?”
The solution OS-level telemetry for AI coding agents
ContextFort monitors from the kernel — independently of the agent. Built with eBPF on Linux, Endpoint Security Framework on macOS, and ETW + Minifilter on Windows.
Telemetry Sandboxing Platforms
File access telemetry
Every file the agent reads or writes — .env, credentials, SSH keys, source code.
Network monitoring
Every outbound connection — what data is sent, where it goes, which process initiated it.
Process tree tracking
Full visibility into every subprocess — shell commands, package installs, builds.
Independent audit trail
OS-level logs the agent can't tamper with. Know exactly what happened and when.
Book a demo View GitHub

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   14 points / 1 comments / query=open source AI agent enterprise adoption

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   ContextFort Backed by Y Combinator Visibility and Controls for AI Agents in the Endpoint Know exactly what coding agents are doing on your engineers' machines.

3. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Cursor Claude Code Every file touched Network connections Processes spawned Book a demo View GitHub The problem What AI coding agents can access When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Every file, every credential, every network connection.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Secrets & Keys SSH & Git Filesystem Network Shell Execution Data Exfiltration Environment variables & secrets AWS keys, database credentials, API tokens in .

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   env files — all readable by the agent as context.

## business_elements

- companies: Hacker News, GitHub, AWS, Cursor
- products: agents, agent, Agents, Cursor, Claude, Agent
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 权限 / 安全治理
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 14, 1, 7M, 51, 7
- quotes: understand your project / Is this process malicious? / What did this agent access? / is this malicious? / what did this agent do?

## evidence_seed

- company_actions: 14 points / 1 comments / query=open source AI agent enterprise adoption / ContextFort Backed by Y Combinator Visibility and Controls for AI Agents in the Endpoint Know exactly what coding agents are doing on your engineers' machines. / Every file, every credential, every network connection.
- case_details: 暂无公开信息
- workflow_changes: Cursor Claude Code Every file touched Network connections Processes spawned Book a demo View GitHub The problem What AI coding agents can access When an engineer runs Cursor or Claude Code, the agent inherits their full system permissions.
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- commercial_value: 3
- novelty: 3
- evidence_strength: 3
- case_richness: 4
- trend_relevance: 4
- guanlan_relevance: 4
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: false
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- emerging_pool
- user_feedback_pool
- watchlist

## missing_information

- 没有具体客户或真实企业案例
- 缺少一手来源或可靠转述来源

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: none
- source_role: primary_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

14 points / 1 comments / query=open source AI agent enterprise adoption

## 采集备注

该条目由 hn 发现，事实来源等级初判为 C。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。
