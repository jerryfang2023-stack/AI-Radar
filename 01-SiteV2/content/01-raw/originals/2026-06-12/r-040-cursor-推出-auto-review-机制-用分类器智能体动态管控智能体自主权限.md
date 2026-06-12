---
schema_version: raw-evidence-v2
raw_id: R-040
title: "Cursor 推出 Auto-review 机制：用分类器智能体动态管控智能体自主权限"
original_url: "https://cursor.com/blog/auto-review"
canonical_url: "https://cursor.com/blog/auto-review"
source_name: "Cursor Blog"
source_type: official
source_level: S
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
published_at: "2026-06-11T12:00:00.000Z"
collected_at: 2026-06-12T03:53:39.180Z
language: mixed
full_text_hash: 24a2f4065c8c68e9
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-12/r-040-cursor-推出-auto-review-机制-用分类器智能体动态管控智能体自主权限.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-12/r-040-cursor-推出-auto-review-机制-用分类器智能体动态管控智能体自主权限.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":8138,"paragraph_count":42,"sentence_count":65,"boilerplate_hits":0,"symbol_ratio":0.0001,"method":"main"}
has_full_text: true
content_length: 8138
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"24a2f4065c8c68e9","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Cursor 推出 Auto-review 机制：用分类器智能体动态管控智能体自主权限","discovery_summary":"Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。","source_name":"Cursor Blog","origin_url":"https://cursor.com/blog/auto-review","discovered_at":"2026-06-12T03:48:20.900Z","rank_on_page":272,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 11e0263d9c7d68ea
content_hash: 24a2f4065c8c68e9
semantic_hash: 71115e00ad597328
duplicate_of: ""
first_seen_at: "2026-06-11T12:00:00.000Z"
last_seen_at: 2026-06-12T03:53:39.180Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","market_shaping_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Cursor Blog","Cursor"],"products":["Cursor","agents","MCP","agent","Agents"],"people":[],"industries":["医疗","开发者工具","企业服务"],"roles":["开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["12","6122","6","122","4%","7%","40%","18"],"quotes":["classifier"]}
evidence_seed: {"company_actions":["Blog / research To be their most productive for coding and other tasks, agents need a healthy level of autonomy.","That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission.","This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":["Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。","However, greater autonomy introduces security risks if agents take unintended actions."]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Blog / research To be their most productive for coding and other tasks, agents need a healthy level of autonomy.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"supporting_context","text":"However, greater autonomy introduces security risks if agents take unintended actions.","supports":["daily_observation","heatmap"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The easy answer is to ask the user before any action happens, but asking for permission too often creates its own safety problem.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: early-direction-signal
keyword_group: early-direction-signal
copyright_note: local research archive only
---

# Cursor 推出 Auto-review 机制：用分类器智能体动态管控智能体自主权限

## clean_text

Blog / research
To be their most productive for coding and other tasks, agents need a healthy level of autonomy. That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission.
However, greater autonomy introduces security risks if agents take unintended actions. This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems.
The easy answer is to ask the user before any action happens, but asking for permission too often creates its own safety problem. After enough repeated prompts, people stop reading carefully, and the approval flow becomes less meaningful.
This week we launched Auto-review, which makes decisions around agent autonomy behave more like a dial than a switch. The core idea is that an agent should be able to move freely when the stakes are low, but slow down when its next action crosses a meaningful boundary.
We determine where an action sits along that continuum with a specialized classifier agent that reviews actions in context before they run. Building it meant turning our intuition for how agent autonomy should be governed into a working model of consequence, intent, and feedback that we could test against real agent behavior.
# Judging risk in context
Whether an agent action poses risk depends on the situation. The same command can be harmless in one workflow and unacceptable in another. What matters is the relationship between the action, the user's request, and the consequence of being wrong.
That recognition pushed us toward developing a "classifier" agent that would govern overall agent autonomy. We wanted it to be a small model, so that it stayed fast and inexpensive to run, while still making a nuanced judgment about whether the next action was consistent with the user's intent.
The central rule we gave the classifier was that it should be more lenient when the security stakes are lower, and more cautious when they're higher. With that broad understanding in place, we began building the classifier as a fast, contextual reviewer that could sit directly in the agent's execution path.
# Building the classifier
The first technical decision was model choice. The classifier runs before a tool call executes, so it sits directly in the agent loop and needs to be fast as well as accurate. Being a multi-model company helped here because we could try a wide range of models and reasoning modes, then choose the one that sat at the right point between speed and judgment.
One early surprise was that lower-reasoning models were not always faster. When a model struggled to understand the policy or the tool call, it could spend more time and tokens searching for what ultimately became a worse answer. The better trade-off was a small model with enough reasoning to make the decision cleanly.
We also made the classifier agentic, because some actions cannot be judged from the command alone. A command like python script.py might be safe or unsafe depending on what is inside the file, so the classifier can inspect the workspace with tools like ReadFile, Grep, Glob, and ListDir before deciding.
We avoided a separate classification endpoint, because an extra round trip would add latency directly before every reviewed tool call. Instead, the classifier runs in the same RPC stream as the parent agent, using an architecture similar to subagents.
# Designing the feedback loop
The next decision was what a block should do. We did not want the classifier to become another approval prompt generator. When it blocks an action, it returns an explanation to the parent agent, and the parent agent can often use that feedback to choose a safer path without interrupting the user.
User intent is what makes that feedback useful. The question is not whether an action looks risky in isolation. The question is whether the action is justified by what the user asked the agent to do. That is what lets normal development work keep moving while higher-consequence actions require a clearer signal from the user.
That design only works if the classifier is tuned against the actions it should let through and the ones it should stop, so we needed evals that covered both.
# Testing the classifier
Our first set of evals came from internal usage data to understand the normal shape of agent work. The classifier had to catch risky actions without blocking routine development work, and internal sessions were the best way to see that baseline. We started with roughly 12 hours of internal developer sessions, then cut that down and deduplicated common actions into 6,122 labeled rows.
We also needed synthetic data, because the worst cases do not appear often enough in normal usage. We generated cases where the agent might read secrets, touch production data, follow untrusted instructions, or take actions with large side effects. Those examples gave us coverage for the failures we most wanted the classifier to catch.
The policy changed as we learned, which made the data work more complicated. When we changed the categories of behavior the classifier should recognize, we had to relabel or rematerialize the eval set. Otherwise, we would be testing the current classifier against an outdated understanding of the problem.
We ran the evals through the same backend classifier loop used in production. That let us test the full path, including tool use, final classification, model overrides, and parse failures. The evals checked the final allow or block decision, along with the context the classifier used when it needed to inspect the workspace before deciding.
We also looked for flapping. If the same case allowed six times and blocked four times, that usually meant the policy or prompt was underspecified. Repeated runs gave us a way to find those unstable cases and tighten the classifier until its behavior was more consistent.
# Minimizing outright blocks
In practice, only a small share of agent actions need to be reviewed by the classifier. Many commands are already covered by allowlists or sandboxing, so the classifier mostly runs when the action needs contextual judgment.
When the classifier does run, it currently blocks around 4% of actions, though a block does not immediately become a user prompt. The classifier sends an explanation back to the parent agent, which can often narrow the action, choose a different tool, or avoid the risky step entirely.
Some blocks from the classifier become user interruptions, but globally we're seeing that only about 7% of total chats in Auto-review mode lead to at least one interruption. To put that in perspective, some enterprise customers we're working with previously saw roughly 40% of actions blocked within their organization.
This early data is consistent with the main product behavior we wanted. The classifier rarely interrupts the user directly, and in most blocked cases the parent agent can use the feedback to continue in a safer, narrower way.
# Refining agent autonomy
Auto-review is still early, and our understanding of the autonomy continuum will keep changing as agents become more capable. Today, it is focused on local agents in the desktop app, and we expect the same ideas to shape how we govern agent autonomy in more places over time.
We want agents to have real autonomy, while making the decision to slow them down depend on context rather than a single global permission setting. The classifier lets us improve safety without turning autonomy back into a stream of approval prompts. It catches actions that need more scrutiny, gives the parent agent feedback, and lets the agent keep working when there is a safer way to proceed.
Auto-review is now the default for new users. For existing users, you can enable it in Settings > Agents.
Related posts
Feb 18, 2026 · Research
Implementing a secure sandbox for local agents
Ani, Yash & Alex · 6 min read
Jun 2, 2026 · Research
What we’ve learned building cloud agents
Josh Ma · 9 min read
May 18, 2026 · Research
Introducing Composer 2.5
Cursor Team · 7 min read
View more posts →

## full_text

Blog / research
To be their most productive for coding and other tasks, agents need a healthy level of autonomy. That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission.
However, greater autonomy introduces security risks if agents take unintended actions. This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems.
The easy answer is to ask the user before any action happens, but asking for permission too often creates its own safety problem. After enough repeated prompts, people stop reading carefully, and the approval flow becomes less meaningful.
This week we launched Auto-review, which makes decisions around agent autonomy behave more like a dial than a switch. The core idea is that an agent should be able to move freely when the stakes are low, but slow down when its next action crosses a meaningful boundary.
We determine where an action sits along that continuum with a specialized classifier agent that reviews actions in context before they run. Building it meant turning our intuition for how agent autonomy should be governed into a working model of consequence, intent, and feedback that we could test against real agent behavior.
# Judging risk in context
Whether an agent action poses risk depends on the situation. The same command can be harmless in one workflow and unacceptable in another. What matters is the relationship between the action, the user's request, and the consequence of being wrong.
That recognition pushed us toward developing a "classifier" agent that would govern overall agent autonomy. We wanted it to be a small model, so that it stayed fast and inexpensive to run, while still making a nuanced judgment about whether the next action was consistent with the user's intent.
The central rule we gave the classifier was that it should be more lenient when the security stakes are lower, and more cautious when they're higher. With that broad understanding in place, we began building the classifier as a fast, contextual reviewer that could sit directly in the agent's execution path.
# Building the classifier
The first technical decision was model choice. The classifier runs before a tool call executes, so it sits directly in the agent loop and needs to be fast as well as accurate. Being a multi-model company helped here because we could try a wide range of models and reasoning modes, then choose the one that sat at the right point between speed and judgment.
One early surprise was that lower-reasoning models were not always faster. When a model struggled to understand the policy or the tool call, it could spend more time and tokens searching for what ultimately became a worse answer. The better trade-off was a small model with enough reasoning to make the decision cleanly.
We also made the classifier agentic, because some actions cannot be judged from the command alone. A command like python script.py might be safe or unsafe depending on what is inside the file, so the classifier can inspect the workspace with tools like ReadFile, Grep, Glob, and ListDir before deciding.
We avoided a separate classification endpoint, because an extra round trip would add latency directly before every reviewed tool call. Instead, the classifier runs in the same RPC stream as the parent agent, using an architecture similar to subagents.
# Designing the feedback loop
The next decision was what a block should do. We did not want the classifier to become another approval prompt generator. When it blocks an action, it returns an explanation to the parent agent, and the parent agent can often use that feedback to choose a safer path without interrupting the user.
User intent is what makes that feedback useful. The question is not whether an action looks risky in isolation. The question is whether the action is justified by what the user asked the agent to do. That is what lets normal development work keep moving while higher-consequence actions require a clearer signal from the user.
That design only works if the classifier is tuned against the actions it should let through and the ones it should stop, so we needed evals that covered both.
# Testing the classifier
Our first set of evals came from internal usage data to understand the normal shape of agent work. The classifier had to catch risky actions without blocking routine development work, and internal sessions were the best way to see that baseline. We started with roughly 12 hours of internal developer sessions, then cut that down and deduplicated common actions into 6,122 labeled rows.
We also needed synthetic data, because the worst cases do not appear often enough in normal usage. We generated cases where the agent might read secrets, touch production data, follow untrusted instructions, or take actions with large side effects. Those examples gave us coverage for the failures we most wanted the classifier to catch.
The policy changed as we learned, which made the data work more complicated. When we changed the categories of behavior the classifier should recognize, we had to relabel or rematerialize the eval set. Otherwise, we would be testing the current classifier against an outdated understanding of the problem.
We ran the evals through the same backend classifier loop used in production. That let us test the full path, including tool use, final classification, model overrides, and parse failures. The evals checked the final allow or block decision, along with the context the classifier used when it needed to inspect the workspace before deciding.
We also looked for flapping. If the same case allowed six times and blocked four times, that usually meant the policy or prompt was underspecified. Repeated runs gave us a way to find those unstable cases and tighten the classifier until its behavior was more consistent.
# Minimizing outright blocks
In practice, only a small share of agent actions need to be reviewed by the classifier. Many commands are already covered by allowlists or sandboxing, so the classifier mostly runs when the action needs contextual judgment.
When the classifier does run, it currently blocks around 4% of actions, though a block does not immediately become a user prompt. The classifier sends an explanation back to the parent agent, which can often narrow the action, choose a different tool, or avoid the risky step entirely.
Some blocks from the classifier become user interruptions, but globally we're seeing that only about 7% of total chats in Auto-review mode lead to at least one interruption. To put that in perspective, some enterprise customers we're working with previously saw roughly 40% of actions blocked within their organization.
This early data is consistent with the main product behavior we wanted. The classifier rarely interrupts the user directly, and in most blocked cases the parent agent can use the feedback to continue in a safer, narrower way.
# Refining agent autonomy
Auto-review is still early, and our understanding of the autonomy continuum will keep changing as agents become more capable. Today, it is focused on local agents in the desktop app, and we expect the same ideas to shape how we govern agent autonomy in more places over time.
We want agents to have real autonomy, while making the decision to slow them down depend on context rather than a single global permission setting. The classifier lets us improve safety without turning autonomy back into a stream of approval prompts. It catches actions that need more scrutiny, gives the parent agent feedback, and lets the agent keep working when there is a safer way to proceed.
Auto-review is now the default for new users. For existing users, you can enable it in Settings > Agents.
Related posts
Feb 18, 2026 · Research
Implementing a secure sandbox for local agents
Ani, Yash & Alex · 6 min read
Jun 2, 2026 · Research
What we’ve learned building cloud agents
Josh Ma · 9 min read
May 18, 2026 · Research
Introducing Composer 2.5
Cursor Team · 7 min read
View more posts →

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":8138,"paragraph_count":42,"sentence_count":65,"boilerplate_hits":0,"symbol_ratio":0.0001,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Blog / research To be their most productive for coding and other tasks, agents need a healthy level of autonomy.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission.

4. **supporting_context**｜supports=daily_observation, heatmap｜importance=high｜confidence=high
   However, greater autonomy introduces security risks if agents take unintended actions.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   The easy answer is to ask the user before any action happens, but asking for permission too often creates its own safety problem.

## business_elements

- companies: Cursor Blog, Cursor
- products: Cursor, agents, MCP, agent, Agents
- people: 暂无公开信息
- industries: 医疗, 开发者工具, 企业服务
- roles: 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 12, 6122, 6, 122, 4%, 7%, 40%, 18
- quotes: classifier

## evidence_seed

- company_actions: Blog / research To be their most productive for coding and other tasks, agents need a healthy level of autonomy. / That means they should be able to operate independently, be creative, and accomplish work without stopping too often to ask for permission. / This is especially true for local agents, which often run near files, credentials, environment variables, MCP tools, and have access to production systems.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。 / However, greater autonomy introduces security risks if agents take unintended actions.

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,market_shaping_risk_context,adoption_context
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

- core_pool

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
- discovery_record: {"discovery_title":"Cursor 推出 Auto-review 机制：用分类器智能体动态管控智能体自主权限","discovery_summary":"Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。","source_name":"Cursor Blog","origin_url":"https://cursor.com/blog/auto-review","discovered_at":"2026-06-12T03:48:20.900Z","rank_on_page":272,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Cursor 近日推出 Auto-review，通过一个专门的分类器智能体在工具调用前审查动作风险。该分类器根据上下文判断动作是否与用户意图一致，高风险时阻止并返回解释给父智能体，低风险时放行。分类器采用小模型，运行在智能体循环内以避免额外延迟，并能读取工作区文件辅助判断。测试基于约12小时内部开发会话生成的6122条标签数据，以及针对读取密钥、操作生产数据等危险场景的合成数据。设计目标是在不频繁阻断日常开发的前提下，拦截风险动作。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
