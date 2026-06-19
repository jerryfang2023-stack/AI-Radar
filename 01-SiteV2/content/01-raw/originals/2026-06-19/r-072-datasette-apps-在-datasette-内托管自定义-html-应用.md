---
schema_version: raw-evidence-v2
raw_id: R-072
title: "Datasette Apps：在 Datasette 内托管自定义 HTML 应用"
original_url: "https://simonwillison.net/2026/Jun/18/datasette-apps"
canonical_url: "https://simonwillison.net/2026/Jun/18/datasette-apps"
source_name: "Simon Willison 博客"
source_type: builder
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: false
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-18T23:58:38.000Z"
collected_at: 2026-06-19T07:43:57.735Z
language: mixed
full_text_hash: dca1568f26c0eed7
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-19/r-072-datasette-apps-在-datasette-内托管自定义-html-应用.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-19/r-072-datasette-apps-在-datasette-内托管自定义-html-应用.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":6583,"paragraph_count":34,"sentence_count":40,"boilerplate_hits":2,"symbol_ratio":0.0033,"method":"content-container"}
has_full_text: true
content_length: 6583
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page","discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"dca1568f26c0eed7","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Datasette Apps：在 Datasette 内托管自定义 HTML 应用","discovery_summary":"今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jun/18/datasette-apps","discovered_at":"2026-06-19T07:39:27.744Z","rank_on_page":82,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 5de808e16934fe2b
content_hash: dca1568f26c0eed7
semantic_hash: d430fe2595cfea6c
duplicate_of: ""
first_seen_at: "2026-06-18T23:58:38.000Z"
last_seen_at: 2026-06-19T07:43:57.735Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Simon Willison 博客","GitHub","Meta"],"products":["Claude","agent","Agent","GPT-5"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["计费 / 预算管理","权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["18","2026","5.5","1.0","31","06","20"],"quotes":["allow-scripts allow-forms","allow-scripts","> + <meta http-equiv="," content=","Content-Security-Policy"]}
evidence_seed: {"company_actions":["Datasette Apps: Host custom HTML applications inside Datasette 18th June 2026 Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog.","That post has the what , but I’m going to expand on that a little bit here to provide the why .","The TL;DR Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":["今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。"]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Datasette Apps: Host custom HTML applications inside Datasette 18th June 2026 Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog.","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"That post has the what , but I’m going to expand on that a little bit here to provide the why .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The TL;DR Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"They can use JavaScript to run read-only SQL queries against data in Datasette, and can run write queries too if you configure them with some stored queries .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Here’s a very simple example and a more complex custom timeline example —the latter looks like this: Apps are allowed to run JavaScript and render HTML and CSS.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Datasette Apps：在 Datasette 内托管自定义 HTML 应用

## clean_text

Datasette Apps: Host custom HTML applications inside Datasette
18th June 2026
Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog. That post has the what , but I’m going to expand on that a little bit here to provide the why .
The TL;DR
Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application. They can use JavaScript to run read-only SQL queries against data in Datasette, and can run write queries too if you configure them with some stored queries .
Here’s a very simple example and a more complex custom timeline example —the latter looks like this:
Apps are allowed to run JavaScript and render HTML and CSS. They are limited in terms of access—the <iframe sandbox="allow-scripts allow-forms"> they run in prevents them from accessing cookies or localStorage and they also have an injected CSP header (thanks to this research ) which prevents them from making HTTP requests to outside hosts, preventing a malicious or buggy app from exfiltrating private data.
Datasette Apps started out as my attempt at building a Claude Artifacts mechanism for Datasette Agent , but I quickly realised that the sandboxed pattern is interesting for way more than just adding custom apps to the interface surface and promoted it to its own top-level concept within the Datasette ecosystem.
They’re also a fun way to turn my multi-year experiment in vibe-coded HTML tools into a core feature of my main project!
You can try out Datasette Apps by signing in with GitHub to the agent.datasette.io demo instance.
Why build this?
Since the very first release, Datasette has offered a flexible backend for creating custom HTML apps via its JSON API.
One of my earliest Datasette projects was an internal search engine for documentation when I worked at Eventbrite—it worked by importing documents from different systems into SQLite on a cron and then serving them through a Datasette instance with a custom HTML+JavaScript search interface that directly queried the Datasette API.
I had client-side JavaScript constructing SQL queries, which originally was intended as an engineering joke but turned out to be a really productive way of iterating on the app!
That project, combined with my experience building my HTML tools collection and my experiments with Claude Artifacts , has convinced me that adding a Datasette-style backend to a self-contained HTML frontend is an astonishingly powerful combination.
Imagine how much more useful Claude Artifacts could be if they had access to a persistent relational database. That’s what I’m building with Datasette Apps!
Neat ideas in Datasette Apps
Here are a few of the ideas and patterns I’ve figured out building this which I think have staying power.
<iframe sandbox="allow-scripts" srcdoc="..."> + <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:;">
This is the magic combination that makes Datasette Apps feasible in the first place. I need to run untrusted HTML and JavaScript on a highly sensitive domain—an authenticated Datasette instance can contain all sorts of private data. The sandbox= attribute lets me run that untrusted code in a way that cannot interact with the parent application—it can’t read the DOM, or access cookies, or steal secrets from localStorage . It can however use fetch() and friends to load content (or exfiltrate data) from other domains. But... it turns out if you start an HTML page with a <meta http-equiv="Content-Security-Policy"> header you can set additional policies that lock down access to other domains. I was worried that malicious JavaScript would be able to update or remove that header but it turns out that doesn’t work —once set, the CSP policy is immutable for the content of that frame.
Locked down APIs with postMessage() and MessageChannel()
Having locked down those iframes to the point that they couldn’t do anything interesting at all, the challenge was to open them back again such that they could run an allow-list of operations, starting with read-only SQL queries against specified databases.
I built the first version of this with postMessage() , which allows a child iframe to send messages to the parent window. I created a simple protocol for requesting that the parent run a SQL query—the parent could then verify it was against an allow-listed database before executing it.
One of the LLM tools, I think it was GPT-5.5, suggested that postMessage() on its own can be exploited if the iframe somehow loads additional code from an untrusted domain. I don’t think that applies to Datasette Apps, but I also believe in defense in depth, so I had GPT-5.5 help me port to a MessageChannel() based transport instead.
MessageChannel() has the advantage that if a page navigates to somewhere else the channel closes automatically, removing any chance of executing commands sent from an untrusted external page.
Visible logs, for queries and errors
If you navigate to the timeline demo and search for the string usercontent you’ll pull in some search results that embed images from the user-images.githubusercontent.com domain. This domain is not in the CSP allow-list, so it trips an error.
Those errors are captured and transmitted back to the parent frame, where they can be displayed in a useful error log. This is meant to make hacking on apps more productive by surfacing otherwise-invisible problems.
I built an experiment demonstrating that you can even turn this into a one-click-to-allow mechanism for building the CSP allow-list based on what breaks, but I haven’t integrated that idea into datasette-apps just yet.
SQL queries are also visibly logged—scroll to the bottom of the timeline page to see that in action.
Stored queries for write operations
I want apps to be able to conditionally write to the database, but this is an even more dangerous proposition than SQL reads!
My solution involves Datasette’s stored queries feature, rebranded from “canned queries” and given a major upgrade in the recent Datasette 1.0a31 —work that was directly inspired by Datasette Apps.
Users can create a stored write query that performs an insert or update, then allow-list that specific query for an app to use. Usage from code inside an app looks like this:
const result = await datasette . storedQuery ( "todos" , "add_todo" , {
title : "Buy milk" ,
due_date : "2026-06-20" ,
priority : "high" ,
completed : false
} ) ;

## full_text

Datasette Apps: Host custom HTML applications inside Datasette
18th June 2026
Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog. That post has the what , but I’m going to expand on that a little bit here to provide the why .
The TL;DR
Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application. They can use JavaScript to run read-only SQL queries against data in Datasette, and can run write queries too if you configure them with some stored queries .
Here’s a very simple example and a more complex custom timeline example —the latter looks like this:
Apps are allowed to run JavaScript and render HTML and CSS. They are limited in terms of access—the <iframe sandbox="allow-scripts allow-forms"> they run in prevents them from accessing cookies or localStorage and they also have an injected CSP header (thanks to this research ) which prevents them from making HTTP requests to outside hosts, preventing a malicious or buggy app from exfiltrating private data.
Datasette Apps started out as my attempt at building a Claude Artifacts mechanism for Datasette Agent , but I quickly realised that the sandboxed pattern is interesting for way more than just adding custom apps to the interface surface and promoted it to its own top-level concept within the Datasette ecosystem.
They’re also a fun way to turn my multi-year experiment in vibe-coded HTML tools into a core feature of my main project!
You can try out Datasette Apps by signing in with GitHub to the agent.datasette.io demo instance.
Why build this?
Since the very first release, Datasette has offered a flexible backend for creating custom HTML apps via its JSON API.
One of my earliest Datasette projects was an internal search engine for documentation when I worked at Eventbrite—it worked by importing documents from different systems into SQLite on a cron and then serving them through a Datasette instance with a custom HTML+JavaScript search interface that directly queried the Datasette API.
I had client-side JavaScript constructing SQL queries, which originally was intended as an engineering joke but turned out to be a really productive way of iterating on the app!
That project, combined with my experience building my HTML tools collection and my experiments with Claude Artifacts , has convinced me that adding a Datasette-style backend to a self-contained HTML frontend is an astonishingly powerful combination.
Imagine how much more useful Claude Artifacts could be if they had access to a persistent relational database. That’s what I’m building with Datasette Apps!
Neat ideas in Datasette Apps
Here are a few of the ideas and patterns I’ve figured out building this which I think have staying power.
<iframe sandbox="allow-scripts" srcdoc="..."> + <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:;">
This is the magic combination that makes Datasette Apps feasible in the first place. I need to run untrusted HTML and JavaScript on a highly sensitive domain—an authenticated Datasette instance can contain all sorts of private data. The sandbox= attribute lets me run that untrusted code in a way that cannot interact with the parent application—it can’t read the DOM, or access cookies, or steal secrets from localStorage . It can however use fetch() and friends to load content (or exfiltrate data) from other domains. But... it turns out if you start an HTML page with a <meta http-equiv="Content-Security-Policy"> header you can set additional policies that lock down access to other domains. I was worried that malicious JavaScript would be able to update or remove that header but it turns out that doesn’t work —once set, the CSP policy is immutable for the content of that frame.
Locked down APIs with postMessage() and MessageChannel()
Having locked down those iframes to the point that they couldn’t do anything interesting at all, the challenge was to open them back again such that they could run an allow-list of operations, starting with read-only SQL queries against specified databases.
I built the first version of this with postMessage() , which allows a child iframe to send messages to the parent window. I created a simple protocol for requesting that the parent run a SQL query—the parent could then verify it was against an allow-listed database before executing it.
One of the LLM tools, I think it was GPT-5.5, suggested that postMessage() on its own can be exploited if the iframe somehow loads additional code from an untrusted domain. I don’t think that applies to Datasette Apps, but I also believe in defense in depth, so I had GPT-5.5 help me port to a MessageChannel() based transport instead.
MessageChannel() has the advantage that if a page navigates to somewhere else the channel closes automatically, removing any chance of executing commands sent from an untrusted external page.
Visible logs, for queries and errors
If you navigate to the timeline demo and search for the string usercontent you’ll pull in some search results that embed images from the user-images.githubusercontent.com domain. This domain is not in the CSP allow-list, so it trips an error.
Those errors are captured and transmitted back to the parent frame, where they can be displayed in a useful error log. This is meant to make hacking on apps more productive by surfacing otherwise-invisible problems.
I built an experiment demonstrating that you can even turn this into a one-click-to-allow mechanism for building the CSP allow-list based on what breaks, but I haven’t integrated that idea into datasette-apps just yet.
SQL queries are also visibly logged—scroll to the bottom of the timeline page to see that in action.
Stored queries for write operations
I want apps to be able to conditionally write to the database, but this is an even more dangerous proposition than SQL reads!
My solution involves Datasette’s stored queries feature, rebranded from “canned queries” and given a major upgrade in the recent Datasette 1.0a31 —work that was directly inspired by Datasette Apps.
Users can create a stored write query that performs an insert or update, then allow-list that specific query for an app to use. Usage from code inside an app looks like this:
const result = await datasette . storedQuery ( "todos" , "add_todo" , {
title : "Buy milk" ,
due_date : "2026-06-20" ,
priority : "high" ,
completed : false
} ) ;

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 91
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":6583,"paragraph_count":34,"sentence_count":40,"boilerplate_hits":2,"symbol_ratio":0.0033,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   Datasette Apps: Host custom HTML applications inside Datasette 18th June 2026 Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   That post has the what , but I’m going to expand on that a little bit here to provide the why .

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   The TL;DR Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   They can use JavaScript to run read-only SQL queries against data in Datasette, and can run write queries too if you configure them with some stored queries .

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Here’s a very simple example and a more complex custom timeline example —the latter looks like this: Apps are allowed to run JavaScript and render HTML and CSS.

## business_elements

- companies: Simon Willison 博客, GitHub, Meta
- products: Claude, agent, Agent, GPT-5
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 计费 / 预算管理, 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 18, 2026, 5.5, 1.0, 31, 06, 20
- quotes: allow-scripts allow-forms / allow-scripts / > + <meta http-equiv= /  content= / Content-Security-Policy

## evidence_seed

- company_actions: Datasette Apps: Host custom HTML applications inside Datasette 18th June 2026 Today we launched a new plugin for Datasette, datasette-apps , with this launch announcement post on the Datasette project blog. / That post has the what , but I’m going to expand on that a little bit here to provide the why . / The TL;DR Datasette Apps are self-contained HTML+JavaScript applications that run in a tightly constrained <iframe> sandbox hosted on your Datasette application.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。

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
- 疑似官网首页、产品目录或导航页，只能索引留存
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
- discovery_record: {"discovery_title":"Datasette Apps：在 Datasette 内托管自定义 HTML 应用","discovery_summary":"今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。","source_name":"Simon Willison 博客","origin_url":"https://simonwillison.net/2026/Jun/18/datasette-apps","discovered_at":"2026-06-19T07:39:27.744Z","rank_on_page":82,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

今日发布的 datasette-apps 插件允许用户在 Datasette 实例中运行自包含的 HTML+JavaScript 应用。这些应用运行在严格 iframe 沙盒内，配合 CSP 头阻止外发 HTTP 请求，无法访问 cookies 或 localStorage。应用可通过 JavaScript 对 Datasette 数据执行只读 SQL 查询，也可通过配置存储查询执行写入操作。通信采用 postMessage（） 后迁移至更安全的 MessageChannel（）。所有查询和 CSP 错误均可在父框架中记录。该功能源自作者对 Claude Artifacts 机制的探索，现已独立为 Datasette 核心特性。演示实例可通过 GitHub 登录 agent.datasette.io 体验。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
