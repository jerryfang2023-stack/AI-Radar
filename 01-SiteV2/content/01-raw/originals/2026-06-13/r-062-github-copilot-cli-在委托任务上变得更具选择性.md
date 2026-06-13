---
schema_version: raw-evidence-v2
raw_id: R-062
title: "GitHub Copilot CLI 在委托任务上变得更具选择性"
original_url: "https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation"
canonical_url: "https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation"
source_name: "GitHub Blog"
source_type: developer
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
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
published_at: "2026-06-12T22:26:23.000Z"
collected_at: 2026-06-13T05:32:37.283Z
language: mixed
full_text_hash: a491a589b74e379c
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-13/r-062-github-copilot-cli-在委托任务上变得更具选择性.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-13/r-062-github-copilot-cli-在委托任务上变得更具选择性.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":10666,"paragraph_count":61,"sentence_count":83,"boilerplate_hits":0,"symbol_ratio":0.0001,"method":"content-container"}
has_full_text: true
content_length: 10666
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"a491a589b74e379c","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"GitHub Copilot CLI 在委托任务上变得更具选择性","discovery_summary":"GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。","source_name":"GitHub Blog","origin_url":"https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation","discovered_at":"2026-06-13T05:25:16.548Z","rank_on_page":105,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: merged_provider_duplicates
url_hash: a66a7c2b8ef281c7
content_hash: a491a589b74e379c
semantic_hash: 72a5d0b684f74d06
duplicate_of: "merged 1 duplicate provider hit(s) before Raw selection"
first_seen_at: "2026-06-12T22:26:23.000Z"
last_seen_at: 2026-06-13T05:32:37.283Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["GitHub Blog","GitHub"],"products":["Copilot","agent","agents"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["12","2026","8 m","100%","1.0","42","23%","27%"],"quotes":[]}
evidence_seed: {"company_actions":["Pingping Lin & Yu Hu June 12, 2026 8 minutes Share: In agentic systems, more delegation isn&rsquo;t always better.","Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls.","Work that should have taken one step now takes three."],"case_details":["GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。","Imagine asking Copilot CLI to make a simple change."],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Pingping Lin & Yu Hu June 12, 2026 8 minutes Share: In agentic systems, more delegation isn&rsquo;t always better.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"Imagine asking Copilot CLI to make a simple change.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Work that should have taken one step now takes three.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"While some tasks genuinely benefit from a specialist subagent&mdash;like exploring an unfamiliar repository, checking an independent area of the code, or running a long command while the main agent keeps moving&mdash;delegation isn&rsquo;t free.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# GitHub Copilot CLI 在委托任务上变得更具选择性

## clean_text

Pingping Lin & Yu Hu
June 12, 2026
8 minutes
Share:
In agentic systems, more delegation isn&rsquo;t always better. Imagine asking Copilot CLI to make a simple change. Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls. Work that should have taken one step now takes three. While some tasks genuinely benefit from a specialist subagent&mdash;like exploring an unfamiliar repository, checking an independent area of the code, or running a long command while the main agent keeps moving&mdash;delegation isn&rsquo;t free. Every handoff adds coordination overhead, tool calls, and wait time. If an agent delegates too eagerly, the &ldquo;help&rdquo; can become friction.
We recently released an improvement to our agentic harness called smarter subagent delegation. This makes Copilot CLI more selective by helping the main agent:
Stay focused when it can move faster on its own.
Delegate when a specialist creates real leverage.
Parallelize work when tasks are truly independent.
Smarter subagent delegation has now rolled out to 100% of Copilot CLI production traffic. If you want to get started today, simply update GitHub Copilot CLI by running the /update command in your terminal to version 1.0.42 or later.
In a production A/B test, this improvement reduced tool failures per session by 23% , including a 27% reduction in search tool failures and an 18% reduction in edit tool failures. It also improved total user wait time by 5% at P95 and 3% at P75, with no quality regression . Here, P95 captures wait time near the slowest 5% of sessions, while P75 reflects wait time toward the slower end of typical sessions. This means fewer unnecessary handoffs, fewer repeated searches, fewer failure-prone tool paths, and less waiting during long-running coding tasks.
In this post, we&rsquo;ll walk through how we identified unnecessary delegation in Copilot CLI, what we changed to make delegation more selective, and how we validated those changes through offline evaluation and production A/B testing. We&rsquo;ll also show why those changes led to fewer failures and less waiting&mdash;and what that looks like for developers using Copilot CLI day to day.
The problem: Delegation is powerful, but not free
Subagents are one of the most important capabilities in an agentic CLI. They let Copilot break down complex work, run investigations in parallel, and keep the main agent focused on coordinating the final answer. For large codebases and multi-step engineering tasks, that can be the difference between a slow linear workflow and an efficient parallel one.
But delegation introduces its own failure modes:
Unnecessary handoffs for simple tasks that the main agent could complete faster on its own.
Overuse of exploration subagents when the handoff already contains enough context.
Repeated or overlapping searches across the main agent and subagents.
Sequential delegation, where the main agent waits for a subagent instead of treating delegation as an opportunity for parallel work.
Failure-prone subagent paths, including stale file paths, moved files, incorrect relative paths, and workspace mismatches.
Figure 1. Example: tool call failure by subagents while main agent is idling.
Our goal: help developers use subagents when they create leverage, avoid them when they add overhead, and parallelize work when the task genuinely benefits from independent execution.
From problem signals to shipped improvement
The way we identified the problem became the way we solved it. Instead of treating agent trajectory analysis, product changes, evaluation, and rollout as separate activities, we used them as one feedback loop: observe the agent behavior, isolate the orchestration bottleneck, make a targeted change, validate it offline, measure it online, and ship only once the end-to-end workflow improved.
Figure 2. The end-to-end improvement loop: analyze, change, validate, and ship.
1. Analyze: Let LLMs identify the delegation bottleneck
Instead of manually reviewing agent sessions, we used LLMs to analyze full trajectories and identify where orchestration was helping versus where it was adding overhead. That analysis surfaced a consistent pattern: subagents were sometimes being invoked for tasks that were already narrow, obvious, or fully described in the handoff.
In those cases, the subagent could spend time re-searching the repository even though the main agent already had enough context to act directly. That clarified the improvement target: keep simple discovery-and-edit tasks in the main agent, and reserve subagents for work that is broader, cross-cutting, or naturally parallelizable.
2. Change: Refine the orchestration policy
After identifying the bottleneck, we used LLMs to help translate that diagnosis into a more selective orchestration policy.
Copilot CLI should handle focused work directly: find a file, read it, make a targeted change, and verify it. Delegation is more useful when the work requires independent context, broad exploration, or parallel execution.
In practice, that means starting with the narrowest effective path, escalating when complexity or uncertainty creates value, and stepping back down when the task becomes focused again. Subagents should be treated as a parallelism tool, not a pause button. When Copilot launches a subagent, the main agent should continue making progress on independent work rather than simply waiting for the result.
When a subagent is used, the handoff should also be specific: what the user asked, what is already known, what the subagent owns, and what kind of result the main agent needs back.
3. Validate: Test offline, confirm online, then ship
Before broad rollout, we validated the change with automatically generated regression cases and existing benchmarks. This helped confirm that the new delegation guidance reduced avoidable overhead without breaking cases where subagents genuinely add value.
Finally, we moved through staff and public A/B testing, then analyzed production metrics across reliability, responsiveness, subagent workload, and quality. The gains did not come primarily from making individual LLM calls faster. Instead, it reduced orchestration overhead by avoiding unnecessary subagent paths and lowering subagent workload per user.
That end-to-end process let us move from problem signal to shipped improvement while keeping the user experience stable: fewer avoidable handoffs, fewer failure-prone tool paths, and no quality regression.
Outcomes
After rolling smarter subagent delegation to production traffic, we saw measurable percentage improvements across reliability and responsiveness (Table 1):
Dimension Metric Delta
Reliability Tool failures per session 23% reduction
Reliability Search tool failures 27% reduction
Reliability Edit tool failures 18% reduction
Responsiveness Total user wait time at P95 5% lower
Responsiveness Total user wait time at P75 3% lower
Quality Quality metrics No regression
Table 1. Production A/B test outcomes
Metric Delta vs. control Interpretation
Failed raw subagent search calls 15% reduction Reliability &ndash; fewer failure-prone subagent search paths.
Average subagent LLM duration per user 12% lower Responsiveness &ndash; reduced orchestration overhead per user.
P95 subagent LLM duration per user 18% lower Responsiveness &ndash; better worst-case subagent overhead.
Table 2. Directional agent trajectory analysis behind the A/B test outcome
These results show that better orchestration can improve the developer experience even when the visible feature surface doesn&rsquo;t change. By teaching Copilot CLI when to delegate, when not to delegate, and how to parallelize the right work, we reduced friction in the agent loop itself.
That is the power of GitHub Copilot as a system: the experience gets better not because developers are given more switches to manage, but because Copilot becomes better at allocating models, tools, and subagents behind the scenes.
How this benefits developers today
For developers using Copilot CLI, this should feel like a smoother day-to-day experience. Straightforward tasks are more likely to be handled directly, complex tasks still get specialist help when it adds value, and long-running sessions keep moving with less unnecessary waiting. In practice, Copilot CLI becomes more efficient and less noisy without asking developers to work differently.
The change is intentionally behind the scenes. Your workflow stays the same, but Copilot CLI is better at coordinating the work: fewer unnecessary handoffs, less repeated search work, fewer failed tool paths, and faster progress on long-running or multi-step tasks.
What&rsquo;s next
This work is one step toward our larger goal of improving how Copilot CLI chooses the right model, agent, and tools across your workflow. While having more agents and models available expands what Copilot can do, the value to developers depends on how well Copilot applies them across the work they are already doing, like reading files, running commands, and moving from an issue toward a pull request.
As tasks become more complex, the quality of that orchestration matters more. The best system is not the one that delegates the most, but the one that knows when to act directly, when to delegate, and how to keep work moving without adding friction.
The next step is making Copilot CLI more adaptive across models, agents, skills, and tools, so developers don&rsquo;t have to decide whether a task needs a larger model, a specialist subagent, or a procedural skill. Copilot should make that decision based on the task, repository context, policy, and expected outcome.
We will continue improving how Copilot CLI plans work, coordinates subagents, and measures end-to-end outcomes. That includes better visibility into main-agent and subagent behavior, deeper analysis of failure reasons, and stronger proxy metrics for orchestration quality. The goal is simple: less waiting, fewer avoidable failures, and more useful progress from every agent session.
Get started today and share feedback
Update GitHub Copilot CLI by running the /update command in your terminal to version 1.0.42 or later.
Already tried it? We&rsquo;d love to hear what you think. Share feedback with the  /feedback  command in a CLI session or open an issue in  our public repository .
Acknowledgements
Smarter subagent delegation was made possible by collaboration across Code|AI, Copilot CLI, experimentation, human evaluation, and product teams. Thanks to everyone who helped identify the problem, design the process, validate the outcome, and ship the improvement to production.

## full_text

Pingping Lin & Yu Hu
June 12, 2026
8 minutes
Share:
In agentic systems, more delegation isn&rsquo;t always better. Imagine asking Copilot CLI to make a simple change. Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls. Work that should have taken one step now takes three. While some tasks genuinely benefit from a specialist subagent&mdash;like exploring an unfamiliar repository, checking an independent area of the code, or running a long command while the main agent keeps moving&mdash;delegation isn&rsquo;t free. Every handoff adds coordination overhead, tool calls, and wait time. If an agent delegates too eagerly, the &ldquo;help&rdquo; can become friction.
We recently released an improvement to our agentic harness called smarter subagent delegation. This makes Copilot CLI more selective by helping the main agent:
Stay focused when it can move faster on its own.
Delegate when a specialist creates real leverage.
Parallelize work when tasks are truly independent.
Smarter subagent delegation has now rolled out to 100% of Copilot CLI production traffic. If you want to get started today, simply update GitHub Copilot CLI by running the /update command in your terminal to version 1.0.42 or later.
In a production A/B test, this improvement reduced tool failures per session by 23% , including a 27% reduction in search tool failures and an 18% reduction in edit tool failures. It also improved total user wait time by 5% at P95 and 3% at P75, with no quality regression . Here, P95 captures wait time near the slowest 5% of sessions, while P75 reflects wait time toward the slower end of typical sessions. This means fewer unnecessary handoffs, fewer repeated searches, fewer failure-prone tool paths, and less waiting during long-running coding tasks.
In this post, we&rsquo;ll walk through how we identified unnecessary delegation in Copilot CLI, what we changed to make delegation more selective, and how we validated those changes through offline evaluation and production A/B testing. We&rsquo;ll also show why those changes led to fewer failures and less waiting&mdash;and what that looks like for developers using Copilot CLI day to day.
The problem: Delegation is powerful, but not free
Subagents are one of the most important capabilities in an agentic CLI. They let Copilot break down complex work, run investigations in parallel, and keep the main agent focused on coordinating the final answer. For large codebases and multi-step engineering tasks, that can be the difference between a slow linear workflow and an efficient parallel one.
But delegation introduces its own failure modes:
Unnecessary handoffs for simple tasks that the main agent could complete faster on its own.
Overuse of exploration subagents when the handoff already contains enough context.
Repeated or overlapping searches across the main agent and subagents.
Sequential delegation, where the main agent waits for a subagent instead of treating delegation as an opportunity for parallel work.
Failure-prone subagent paths, including stale file paths, moved files, incorrect relative paths, and workspace mismatches.
Figure 1. Example: tool call failure by subagents while main agent is idling.
Our goal: help developers use subagents when they create leverage, avoid them when they add overhead, and parallelize work when the task genuinely benefits from independent execution.
From problem signals to shipped improvement
The way we identified the problem became the way we solved it. Instead of treating agent trajectory analysis, product changes, evaluation, and rollout as separate activities, we used them as one feedback loop: observe the agent behavior, isolate the orchestration bottleneck, make a targeted change, validate it offline, measure it online, and ship only once the end-to-end workflow improved.
Figure 2. The end-to-end improvement loop: analyze, change, validate, and ship.
1. Analyze: Let LLMs identify the delegation bottleneck
Instead of manually reviewing agent sessions, we used LLMs to analyze full trajectories and identify where orchestration was helping versus where it was adding overhead. That analysis surfaced a consistent pattern: subagents were sometimes being invoked for tasks that were already narrow, obvious, or fully described in the handoff.
In those cases, the subagent could spend time re-searching the repository even though the main agent already had enough context to act directly. That clarified the improvement target: keep simple discovery-and-edit tasks in the main agent, and reserve subagents for work that is broader, cross-cutting, or naturally parallelizable.
2. Change: Refine the orchestration policy
After identifying the bottleneck, we used LLMs to help translate that diagnosis into a more selective orchestration policy.
Copilot CLI should handle focused work directly: find a file, read it, make a targeted change, and verify it. Delegation is more useful when the work requires independent context, broad exploration, or parallel execution.
In practice, that means starting with the narrowest effective path, escalating when complexity or uncertainty creates value, and stepping back down when the task becomes focused again. Subagents should be treated as a parallelism tool, not a pause button. When Copilot launches a subagent, the main agent should continue making progress on independent work rather than simply waiting for the result.
When a subagent is used, the handoff should also be specific: what the user asked, what is already known, what the subagent owns, and what kind of result the main agent needs back.
3. Validate: Test offline, confirm online, then ship
Before broad rollout, we validated the change with automatically generated regression cases and existing benchmarks. This helped confirm that the new delegation guidance reduced avoidable overhead without breaking cases where subagents genuinely add value.
Finally, we moved through staff and public A/B testing, then analyzed production metrics across reliability, responsiveness, subagent workload, and quality. The gains did not come primarily from making individual LLM calls faster. Instead, it reduced orchestration overhead by avoiding unnecessary subagent paths and lowering subagent workload per user.
That end-to-end process let us move from problem signal to shipped improvement while keeping the user experience stable: fewer avoidable handoffs, fewer failure-prone tool paths, and no quality regression.
Outcomes
After rolling smarter subagent delegation to production traffic, we saw measurable percentage improvements across reliability and responsiveness (Table 1):
Dimension Metric Delta
Reliability Tool failures per session 23% reduction
Reliability Search tool failures 27% reduction
Reliability Edit tool failures 18% reduction
Responsiveness Total user wait time at P95 5% lower
Responsiveness Total user wait time at P75 3% lower
Quality Quality metrics No regression
Table 1. Production A/B test outcomes
Metric Delta vs. control Interpretation
Failed raw subagent search calls 15% reduction Reliability &ndash; fewer failure-prone subagent search paths.
Average subagent LLM duration per user 12% lower Responsiveness &ndash; reduced orchestration overhead per user.
P95 subagent LLM duration per user 18% lower Responsiveness &ndash; better worst-case subagent overhead.
Table 2. Directional agent trajectory analysis behind the A/B test outcome
These results show that better orchestration can improve the developer experience even when the visible feature surface doesn&rsquo;t change. By teaching Copilot CLI when to delegate, when not to delegate, and how to parallelize the right work, we reduced friction in the agent loop itself.
That is the power of GitHub Copilot as a system: the experience gets better not because developers are given more switches to manage, but because Copilot becomes better at allocating models, tools, and subagents behind the scenes.
How this benefits developers today
For developers using Copilot CLI, this should feel like a smoother day-to-day experience. Straightforward tasks are more likely to be handled directly, complex tasks still get specialist help when it adds value, and long-running sessions keep moving with less unnecessary waiting. In practice, Copilot CLI becomes more efficient and less noisy without asking developers to work differently.
The change is intentionally behind the scenes. Your workflow stays the same, but Copilot CLI is better at coordinating the work: fewer unnecessary handoffs, less repeated search work, fewer failed tool paths, and faster progress on long-running or multi-step tasks.
What&rsquo;s next
This work is one step toward our larger goal of improving how Copilot CLI chooses the right model, agent, and tools across your workflow. While having more agents and models available expands what Copilot can do, the value to developers depends on how well Copilot applies them across the work they are already doing, like reading files, running commands, and moving from an issue toward a pull request.
As tasks become more complex, the quality of that orchestration matters more. The best system is not the one that delegates the most, but the one that knows when to act directly, when to delegate, and how to keep work moving without adding friction.
The next step is making Copilot CLI more adaptive across models, agents, skills, and tools, so developers don&rsquo;t have to decide whether a task needs a larger model, a specialist subagent, or a procedural skill. Copilot should make that decision based on the task, repository context, policy, and expected outcome.
We will continue improving how Copilot CLI plans work, coordinates subagents, and measures end-to-end outcomes. That includes better visibility into main-agent and subagent behavior, deeper analysis of failure reasons, and stronger proxy metrics for orchestration quality. The goal is simple: less waiting, fewer avoidable failures, and more useful progress from every agent session.
Get started today and share feedback
Update GitHub Copilot CLI by running the /update command in your terminal to version 1.0.42 or later.
Already tried it? We&rsquo;d love to hear what you think. Share feedback with the  /feedback  command in a CLI session or open an issue in  our public repository .
Acknowledgements
Smarter subagent delegation was made possible by collaboration across Code|AI, Copilot CLI, experimentation, human evaluation, and product teams. Thanks to everyone who helped identify the problem, design the process, validate the outcome, and ship the improvement to production.

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":10666,"paragraph_count":61,"sentence_count":83,"boilerplate_hits":0,"symbol_ratio":0.0001,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Pingping Lin & Yu Hu June 12, 2026 8 minutes Share: In agentic systems, more delegation isn&rsquo;t always better.

3. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   Imagine asking Copilot CLI to make a simple change.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Work that should have taken one step now takes three.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   While some tasks genuinely benefit from a specialist subagent&mdash;like exploring an unfamiliar repository, checking an independent area of the code, or running a long command while the main agent keeps moving&mdash;delegation isn&rsquo;t free.

## business_elements

- companies: GitHub Blog, GitHub
- products: Copilot, agent, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 12, 2026, 8 m, 100%, 1.0, 42, 23%, 27%
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Pingping Lin & Yu Hu June 12, 2026 8 minutes Share: In agentic systems, more delegation isn&rsquo;t always better. / Instead of handling it directly, it spins up a helper agent that searches the repository, waits on a result, and stalls. / Work that should have taken one step now takes three.
- case_details: GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。 / Imagine asking Copilot CLI to make a simple change.
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
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

- watchlist

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
- discovery_record: {"discovery_title":"GitHub Copilot CLI 在委托任务上变得更具选择性","discovery_summary":"GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。","source_name":"GitHub Blog","origin_url":"https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation","discovered_at":"2026-06-13T05:25:16.548Z","rank_on_page":105,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

GitHub Copilot CLI 通过更好的编排实现了更少的任务交接和更快的进度，且没有新增任何配置选项。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
