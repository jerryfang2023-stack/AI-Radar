---
schema_version: raw-evidence-v2
raw_id: R-032
title: "Google Cloud 推出 OKF v0.1：供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文"
original_url: "https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context"
canonical_url: "https://marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context"
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
published_at: "2026-06-16T08:18:58.000Z"
collected_at: 2026-06-17T01:51:13.123Z
language: mixed
full_text_hash: 35f6c626246a796f
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-032-google-cloud-推出-okf-v0-1-供应商中立的-markdown-规范-为-ai-智能体提供结构化上下文.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-032-google-cloud-推出-okf-v0-1-供应商中立的-markdown-规范-为-ai-智能体提供结构化上下文.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 88
extractor_diagnostics: {"readability_score":88,"text_length":7866,"paragraph_count":74,"sentence_count":74,"boilerplate_hits":3,"symbol_ratio":0.0069,"method":"article"}
has_full_text: true
content_length: 7866
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"35f6c626246a796f","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Google Cloud 推出 OKF v0.1：供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文","discovery_summary":"Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context","discovered_at":"2026-06-17T01:46:29.105Z","rank_on_page":287,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 1fa7cf6f85305781
content_hash: 35f6c626246a796f
semantic_hash: d4724d10fea50cc0
duplicate_of: ""
first_seen_at: "2026-06-16T08:18:58.000Z"
last_seen_at: 2026-06-17T01:51:13.123Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["MarkTechPost（RSS）","Google","GitHub","Meta"],"products":["agent","agents","AGENTS","CLAUDE","Agent"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队","销售 / 客服"],"workflows":["合同审阅 / 法律研究","部署 / 集成交付"],"business_actions":["发布 / 推出","合作 / 联盟"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["0.1","2026","05","28","14","30","00","0.1 M"],"quotes":["):\ntext = path.read_text()\nmeta = {}\nif text.startswith(","):\n_, fm, body = text.split(",", 2)\nmeta = yaml.safe_load(fm) or {}\nelse:\nbody = text\nconcepts[str(path)] = meta # type, title, tags, etc.\nfor target in set(re.findall(r",", body)):\nlinks.append((str(path), target)) # markdown cross-links\nreturn concepts, links\nconcepts, graph = load_bundle("]}
evidence_seed: {"company_actions":["Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Context Engineering For Devs Machine Learning New Releases Software Engineering Staff Tech News Foundation models keep getting stronger, yet they still stall on the same thing: context.","A model can write code or analyze a dataset, but only with the right internal knowledge.","That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队","销售 / 客服"],"risks_or_constraints":["Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。"]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Context Engineering For Devs Machine Learning New Releases Software Engineering Staff Tech News Foundation models keep getting stronger, yet they still stall on the same thing: context.","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"A model can write code or analyze a dataset, but only with the right internal knowledge.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Google Cloud introduced the Open Knowledge Format (OKF) , an open specification that formalizes the LLM-wiki pattern into a portable, interoperable format.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It is a vendor-neutral, agent- and human-friendly standard for the context modern AI systems need.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Google Cloud 推出 OKF v0.1：供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文

## clean_text

Editors Pick
Agentic AI
Artificial Intelligence
AI Infrastructure
Technology
AI Shorts
Applications
Context Engineering
For Devs
Machine Learning
New Releases
Software Engineering
Staff
Tech News
Foundation models keep getting stronger, yet they still stall on the same thing: context. A model can write code or analyze a dataset, but only with the right internal knowledge. That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.
Google Cloud introduced the Open Knowledge Format (OKF) , an open specification that formalizes the LLM-wiki pattern into a portable, interoperable format. It is a vendor-neutral, agent- and human-friendly standard for the context modern AI systems need.
Open Knowledge Format (OKF)
OKF is a format, not a service or a platform. OKF v0.1 represents knowledge as a directory of markdown files with YAML frontmatter. A small set of agreed-upon conventions lets wikis written by one producer be consumed by a different agent without translation.
That is the whole idea. There is no compression scheme, no new runtime, and no required SDK. A bundle of OKF documents is just markdown, just files, and just YAML frontmatter. It renders on GitHub, ships as a tarball, and mounts on any filesystem.
If you have used Obsidian, Notion, or Hugo, the shape will feel familiar. OKF only formalizes the conventions needed to make those patterns interoperable.
The Fragmented Context Problem
In most organizations, model context is overwhelmingly internal knowledge. Today it sits in incompatible silos: metadata catalogs with their own APIs, wikis, shared drives, code comments, and docstrings.
Ask an agent ‘How do I compute weekly active users from our event stream?’ It must assemble that answer from scattered, mutually incompatible surfaces. Every vendor offers its own catalog, SDK, and knowledge-graph schema. None of the knowledge is portable across products or organizations.
The result is duplicated effort. Every agent builder solves the same context-assembly problem from scratch. Every catalog vendor reinvents the same data models.
Andrej Karpathy articulated the underlying idea in his April 2026 LLM Wiki gist . His point: LLMs do not get bored, do not forget to update cross-references, and can edit many files in one pass. The bookkeeping that makes humans abandon personal wikis is exactly what LLMs handle well.
The same pattern keeps reappearing under different names. Examples include Obsidian vaults wired to coding agents, the AGENTS.md and CLAUDE.md convention files, and ‘metadata as code’ repos. Each instance is bespoke, so none of them interoperate. OKF standardizes that interoperability layer so agents can do the heavy lifting.
How OKF Works: The Design in One Screen
An OKF bundle is a directory of markdown files representing concepts — tables, datasets, metrics, playbooks, runbooks, or APIs. Each concept is one file, and the file path is its identity.
Copy Code Copied Use a different Browser
sales/
├── index.md
├── datasets/
│ ├── index.md
│ └── orders_db.md
├── tables/
│ ├── index.md
│ ├── orders.md
│ └── customers.md
└── metrics/
├── index.md
└── weekly_active_users.md
Each concept carries a small YAML front-matter block, then a markdown body for everything else.
Copy Code Copied Use a different Browser
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---
# Schema
| Column | Type | Description |
|---------------|--------|------------------------------------------|
| `order_id` | STRING | Globally unique order identifier. |
| `customer_id` | STRING | FK to [customers](/tables/customers.md). |
The reserved structured fields are type , title , description , resource , tags , and timestamp . Concepts link to each other with normal markdown links. Those links turn the directory into a graph that is richer than file-system parent/child relationships. Bundles can optionally include index.md files for progressive disclosure and log.md files for change history.
Three Principles Behind the Design
Minimally opinionated : OKF requires exactly one field on every concept: type . Everything else is left to the producer. The spec defines the interoperability surface, not the content model.
Producer/consumer independence : A human-written bundle can be read by an agent. A pipeline-generated bundle can be browsed in a visualizer. The format is the contract; tooling at each end is swappable.
Format, not platform : OKF is tied to no cloud, database, model provider, or agent framework. It will never require a proprietary account to read, write, or serve.
Use Cases, With Examples
Data team metadata-as-code : Export BigQuery table and metric definitions as a bundle. Commit it next to the SQL it describes, and review changes through pull requests.
Incident runbooks for agents : Store each runbook as a concept. An on-call agent reads index.md , follows cross-links, and resolves the join path it needs.
Cross-org knowledge exchange : A vendor ships a catalog export as OKF. Your agent consumes it directly, with no integration work.
Developer-team wiki : Replace a stale Notion or Obsidian space with versioned markdown that an agent keeps current.
How OKF Compares
Approach Storage Schema required Portable SDK/registry Agent-readable
OKF v0.1 Markdown + YAML files Only type Yes No Yes, no translation
Notion Proprietary DB Per-workspace Export-only API needed Via API
Obsidian vault Markdown files None enforced Yes No Bespoke conventions
Metadata catalog Vendor store Vendor schema Export-only Vendor SDK Vendor-specific
RAG index Vector store Embedding model No Yes Chunks, not concepts
The distinction from RAG is useful for developers. RAG re-derives knowledge at query time from raw chunks. An OKF bundle stores curated, cross-linked concepts that an agent reads and updates directly.
A Minimal OKF Consumer
OKF is parseable with standard tools. This reads a bundle and builds its link graph.
Copy Code Copied Use a different Browser
import pathlib, re, yaml
def load_bundle(root):
concepts, links = {}, []
for path in pathlib.Path(root).rglob("*.md"):
text = path.read_text()
meta = {}
if text.startswith("---"):
_, fm, body = text.split("---", 2)
meta = yaml.safe_load(fm) or {}
else:
body = text
concepts[str(path)] = meta # type, title, tags, etc.
for target in set(re.findall(r"\]\((/[^)]+\.md)\)", body)):
links.append((str(path), target)) # markdown cross-links
return concepts, links
concepts, graph = load_bundle("sales/")
No backend or install is needed to read or serve a bundle. The same files live in version control beside the code they describe.
Key Takeaways
Google’s Open Knowledge Format (OKF) v0.1 formalizes the LLM-wiki pattern into a portable, vendor-neutral spec.
A bundle is just a directory of markdown files with YAML frontmatter—no SDK, runtime, or registry.
Every concept requires only one field, type ; cross-links between files form the knowledge graph.
Google shipped reference tools: a BigQuery enrichment agent, a static HTML visualizer, and three sample bundles.
Unlike RAG, OKF stores curated, version-controlled concepts that agents read and update directly.
Check out the Technical details here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
tinyfish.ai Open Source
Big Set
Describe your ideal dataset in plain English, and BigSet builds it.
dataset.build() auto&middot;refresh
Explore on GitHub &rarr;

## full_text

Editors Pick
Agentic AI
Artificial Intelligence
AI Infrastructure
Technology
AI Shorts
Applications
Context Engineering
For Devs
Machine Learning
New Releases
Software Engineering
Staff
Tech News
Foundation models keep getting stronger, yet they still stall on the same thing: context. A model can write code or analyze a dataset, but only with the right internal knowledge. That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.
Google Cloud introduced the Open Knowledge Format (OKF) , an open specification that formalizes the LLM-wiki pattern into a portable, interoperable format. It is a vendor-neutral, agent- and human-friendly standard for the context modern AI systems need.
Open Knowledge Format (OKF)
OKF is a format, not a service or a platform. OKF v0.1 represents knowledge as a directory of markdown files with YAML frontmatter. A small set of agreed-upon conventions lets wikis written by one producer be consumed by a different agent without translation.
That is the whole idea. There is no compression scheme, no new runtime, and no required SDK. A bundle of OKF documents is just markdown, just files, and just YAML frontmatter. It renders on GitHub, ships as a tarball, and mounts on any filesystem.
If you have used Obsidian, Notion, or Hugo, the shape will feel familiar. OKF only formalizes the conventions needed to make those patterns interoperable.
The Fragmented Context Problem
In most organizations, model context is overwhelmingly internal knowledge. Today it sits in incompatible silos: metadata catalogs with their own APIs, wikis, shared drives, code comments, and docstrings.
Ask an agent ‘How do I compute weekly active users from our event stream?’ It must assemble that answer from scattered, mutually incompatible surfaces. Every vendor offers its own catalog, SDK, and knowledge-graph schema. None of the knowledge is portable across products or organizations.
The result is duplicated effort. Every agent builder solves the same context-assembly problem from scratch. Every catalog vendor reinvents the same data models.
Andrej Karpathy articulated the underlying idea in his April 2026 LLM Wiki gist . His point: LLMs do not get bored, do not forget to update cross-references, and can edit many files in one pass. The bookkeeping that makes humans abandon personal wikis is exactly what LLMs handle well.
The same pattern keeps reappearing under different names. Examples include Obsidian vaults wired to coding agents, the AGENTS.md and CLAUDE.md convention files, and ‘metadata as code’ repos. Each instance is bespoke, so none of them interoperate. OKF standardizes that interoperability layer so agents can do the heavy lifting.
How OKF Works: The Design in One Screen
An OKF bundle is a directory of markdown files representing concepts — tables, datasets, metrics, playbooks, runbooks, or APIs. Each concept is one file, and the file path is its identity.
Copy Code Copied Use a different Browser
sales/
├── index.md
├── datasets/
│ ├── index.md
│ └── orders_db.md
├── tables/
│ ├── index.md
│ ├── orders.md
│ └── customers.md
└── metrics/
├── index.md
└── weekly_active_users.md
Each concept carries a small YAML front-matter block, then a markdown body for everything else.
Copy Code Copied Use a different Browser
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---
# Schema
| Column | Type | Description |
|---------------|--------|------------------------------------------|
| `order_id` | STRING | Globally unique order identifier. |
| `customer_id` | STRING | FK to [customers](/tables/customers.md). |
The reserved structured fields are type , title , description , resource , tags , and timestamp . Concepts link to each other with normal markdown links. Those links turn the directory into a graph that is richer than file-system parent/child relationships. Bundles can optionally include index.md files for progressive disclosure and log.md files for change history.
Three Principles Behind the Design
Minimally opinionated : OKF requires exactly one field on every concept: type . Everything else is left to the producer. The spec defines the interoperability surface, not the content model.
Producer/consumer independence : A human-written bundle can be read by an agent. A pipeline-generated bundle can be browsed in a visualizer. The format is the contract; tooling at each end is swappable.
Format, not platform : OKF is tied to no cloud, database, model provider, or agent framework. It will never require a proprietary account to read, write, or serve.
Use Cases, With Examples
Data team metadata-as-code : Export BigQuery table and metric definitions as a bundle. Commit it next to the SQL it describes, and review changes through pull requests.
Incident runbooks for agents : Store each runbook as a concept. An on-call agent reads index.md , follows cross-links, and resolves the join path it needs.
Cross-org knowledge exchange : A vendor ships a catalog export as OKF. Your agent consumes it directly, with no integration work.
Developer-team wiki : Replace a stale Notion or Obsidian space with versioned markdown that an agent keeps current.
How OKF Compares
Approach Storage Schema required Portable SDK/registry Agent-readable
OKF v0.1 Markdown + YAML files Only type Yes No Yes, no translation
Notion Proprietary DB Per-workspace Export-only API needed Via API
Obsidian vault Markdown files None enforced Yes No Bespoke conventions
Metadata catalog Vendor store Vendor schema Export-only Vendor SDK Vendor-specific
RAG index Vector store Embedding model No Yes Chunks, not concepts
The distinction from RAG is useful for developers. RAG re-derives knowledge at query time from raw chunks. An OKF bundle stores curated, cross-linked concepts that an agent reads and updates directly.
A Minimal OKF Consumer
OKF is parseable with standard tools. This reads a bundle and builds its link graph.
Copy Code Copied Use a different Browser
import pathlib, re, yaml
def load_bundle(root):
concepts, links = {}, []
for path in pathlib.Path(root).rglob("*.md"):
text = path.read_text()
meta = {}
if text.startswith("---"):
_, fm, body = text.split("---", 2)
meta = yaml.safe_load(fm) or {}
else:
body = text
concepts[str(path)] = meta # type, title, tags, etc.
for target in set(re.findall(r"\]\((/[^)]+\.md)\)", body)):
links.append((str(path), target)) # markdown cross-links
return concepts, links
concepts, graph = load_bundle("sales/")
No backend or install is needed to read or serve a bundle. The same files live in version control beside the code they describe.
Key Takeaways
Google’s Open Knowledge Format (OKF) v0.1 formalizes the LLM-wiki pattern into a portable, vendor-neutral spec.
A bundle is just a directory of markdown files with YAML frontmatter—no SDK, runtime, or registry.
Every concept requires only one field, type ; cross-links between files form the knowledge graph.
Google shipped reference tools: a BigQuery enrichment agent, a static HTML visualizer, and three sample bundles.
Unlike RAG, OKF stores curated, version-controlled concepts that agents read and update directly.
Check out the Technical details here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
tinyfish.ai Open Source
Big Set
Describe your ideal dataset in plain English, and BigSet builds it.
dataset.build() auto&middot;refresh
Explore on GitHub &rarr;

## extraction_diagnostics

- extraction_method: article
- readability_score: 88
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":88,"text_length":7866,"paragraph_count":74,"sentence_count":74,"boilerplate_hits":3,"symbol_ratio":0.0069,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Context Engineering For Devs Machine Learning New Releases Software Engineering Staff Tech News Foundation models keep getting stronger, yet they still stall on the same thing: context.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   A model can write code or analyze a dataset, but only with the right internal knowledge.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Google Cloud introduced the Open Knowledge Format (OKF) , an open specification that formalizes the LLM-wiki pattern into a portable, interoperable format.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   It is a vendor-neutral, agent- and human-friendly standard for the context modern AI systems need.

## business_elements

- companies: MarkTechPost（RSS）, Google, GitHub, Meta
- products: agent, agents, AGENTS, CLAUDE, Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队, 销售 / 客服
- workflows: 合同审阅 / 法律研究, 部署 / 集成交付
- business_actions: 发布 / 推出, 合作 / 联盟
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 0.1, 2026, 05, 28, 14, 30, 00, 0.1 M
- quotes: ):
text = path.read_text()
meta = {}
if text.startswith( / ):
_, fm, body = text.split( / , 2)
meta = yaml.safe_load(fm) or {}
else:
body = text
concepts[str(path)] = meta # type, title, tags, etc.
for target in set(re.findall(r / , body)):
links.append((str(path), target)) # markdown cross-links
return concepts, links
concepts, graph = load_bundle(

## evidence_seed

- company_actions: Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Technology AI Shorts Applications Context Engineering For Devs Machine Learning New Releases Software Engineering Staff Tech News Foundation models keep getting stronger, yet they still stall on the same thing: context. / A model can write code or analyze a dataset, but only with the right internal knowledge. / That knowledge includes table schemas, metric definitions, runbooks, join paths and it lives scattered across catalogs, wikis, and a few senior engineers’ heads.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队, 销售 / 客服
- risks_or_constraints: Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
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
- user_feedback_pool: false
- watchlist: true

## pool_routes

- emerging_pool

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
- discovery_record: {"discovery_title":"Google Cloud 推出 OKF v0.1：供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文","discovery_summary":"Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context","discovered_at":"2026-06-17T01:46:29.105Z","rank_on_page":287,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Google Cloud 发布 Open Knowledge Format （OKF） v0.1，一种供应商中立的 Markdown 规范，为 AI 智能体提供结构化上下文知识。OKF 将知识表示为带 YAML 前置元数据的 markdown 文件目录，每个概念对应一个文件，通过 `type`、`title`、`description` 等少量保留字段实现互操作。无需专有服务、SDK 或运行时，目录可托管在 GitHub、以 tarball 传输或挂载到任意文件系统。OKF 旨在解决组织内部知识碎片化问题--表结构、指标定义、runbook 等散落在不同 catalog 和 wiki 中，各厂商方案互不兼容。遵循最少意见原则，只强制 `type` 字段，生产者和消费者可独立实现。使用场景包括数据团队将 BigQuery 表定义导出为代码、为智能体存储 incident runbook、跨组织知识交换等。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
