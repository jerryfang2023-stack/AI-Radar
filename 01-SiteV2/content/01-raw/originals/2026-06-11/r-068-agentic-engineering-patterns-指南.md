---
schema_version: raw-evidence-v2
raw_id: R-068
title: "Agentic Engineering Patterns 指南"
original_url: "https://x.com/shao__meng/status/2064867069167087782"
canonical_url: "https://x.com/shao__meng/status/2064867069167087782"
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
published_at: "2026-06-11T00:27:27.000Z"
collected_at: 2026-06-11T01:29:52.865Z
language: mixed
full_text_hash: e83b6942b5cb6164
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-068-agentic-engineering-patterns-指南.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-11/r-068-agentic-engineering-patterns-指南.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 94
extractor_diagnostics: {"readability_score":94,"text_length":4248,"paragraph_count":52,"sentence_count":24,"boilerplate_hits":1,"symbol_ratio":0.0113,"method":"main"}
has_full_text: true
content_length: 4248
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e83b6942b5cb6164","missing":[]}
source_volatility: high
community_name: "X：邵猛 (@shao__meng)"
capture_scope: visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: community_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Agentic Engineering Patterns 指南","discovery_summary":"Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2064867069167087782","discovered_at":"2026-06-11T01:23:43.672Z","rank_on_page":36,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e94efb434a9bc138
content_hash: e83b6942b5cb6164
semantic_hash: e74db7d441ffbe15
duplicate_of: ""
first_seen_at: "2026-06-11T00:27:27.000Z"
last_seen_at: 2026-06-11T01:29:52.865Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","user_feedback_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["X","邵猛 (@shao__meng)"],"products":["Claude","Codex","agent","Agent"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","权限 / 安全治理"],"business_actions":["部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["2026","2","1","3","4","5","12","27"],"quotes":["的软件。\n人的工作并未消失，而是上移：\n· 决定写什么代码（问题空间有数十种解法与权衡）\n· 提供工具与足够细的规格\n· 验证结果是否稳健可信\n· 把经验写回指令与 harness（LLM 本身不会从错误中学习，但系统可以）\n# 全书最重要的一个判断\n写代码变便宜了，写好代码并没有。\n过去几十年，工程习惯都建立在","之上：\n· 宏观： 大量设计、估算、排期，功能必须数倍覆盖开发成本\n· 微观： 是否重构、写测试、补文档、做 debug UI——每个决定都受时间约束\nAgent 把这个约束打碎。一个人还能并行跑多个 agent，同时实现、重构、测试、写文档。\n但","仍有明确标准：\n· 能跑、且被证明能跑\n· 解决对的问题\n· 处理错误路径，不只 happy path\n· 简洁、可维护\n· 有测试与合适文档\n· 设计留出演进空间（YAGNI 与可扩展性的平衡）\n· 满足安全、可观测性等 non-functional 要求\n新习惯： 当直觉说","时，不妨开个异步 agent 试一下——最坏情况是浪费几分钟 token；很多过去"]}
evidence_seed: {"company_actions":["Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。","Post Log in Sign up Post meng shao @shao__meng 再次强烈推荐「Agentic Engineering Patterns」 作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。","文字由他本人撰写，示例与代码借助 LLM 辅助。"],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Post Log in Sign up Post meng shao @shao__meng 再次强烈推荐「Agentic Engineering Patterns」 作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"文字由他本人撰写，示例与代码借助 LLM 辅助。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"在线阅读： simonwillison.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"product_update","text":"net/guides/agentic… 核心目标：如何用好 Claude Code、Codex 这类能写代码、也能执行代码的 coding 心概念：Agentic Engineering ≠ Vibe Coding Vibe Coding vs Agentic Engineering · 定义来源：Karpathy 提出 vs Willison 提出的专业实践 · 适用人群：常与非程序员原型相关 vs 专业工程师放大既有能力 · 代码质量：未审查、原型级 vs 审查、测试、可上线 · 人的角色：几乎不参与代码理解 vs 定义问题、验证结果、持续改进 harness Agent 的定义： 在循环中调用工具以达成目标。","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Coding agent 的关键差异是能执行代码——没有执行能力，LLM 输出价值有限；有了执行，agent 才能迭代到\"确实能跑\"的软件。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Agentic Engineering Patterns 指南

## clean_text

Post
Log in Sign up
Post
meng shao
@shao__meng
再次强烈推荐「Agentic Engineering Patterns」
作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。文字由他本人撰写，示例与代码借助 LLM 辅助。
在线阅读：
simonwillison.net/guides/agentic…
核心目标：如何用好 Claude Code、Codex 这类能写代码、也能执行代码的 coding 心概念：Agentic Engineering ≠ Vibe Coding
Vibe Coding vs Agentic Engineering
· 定义来源：Karpathy 提出 vs Willison 提出的专业实践
· 适用人群：常与非程序员原型相关 vs 专业工程师放大既有能力
· 代码质量：未审查、原型级 vs 审查、测试、可上线
· 人的角色：几乎不参与代码理解 vs 定义问题、验证结果、持续改进 harness
Agent 的定义： 在循环中调用工具以达成目标。Coding agent 的关键差异是能执行代码——没有执行能力，LLM 输出价值有限；有了执行，agent 才能迭代到"确实能跑"的软件。
人的工作并未消失，而是上移：
· 决定写什么代码（问题空间有数十种解法与权衡）
· 提供工具与足够细的规格
· 验证结果是否稳健可信
· 把经验写回指令与 harness（LLM 本身不会从错误中学习，但系统可以）
# 全书最重要的一个判断
写代码变便宜了，写好代码并没有。
过去几十年，工程习惯都建立在"代码昂贵"之上：
· 宏观： 大量设计、估算、排期，功能必须数倍覆盖开发成本
· 微观： 是否重构、写测试、补文档、做 debug UI——每个决定都受时间约束
Agent 把这个约束打碎。一个人还能并行跑多个 agent，同时实现、重构、测试、写文档。
但"好代码"仍有明确标准：
· 能跑、且被证明能跑
· 解决对的问题
· 处理错误路径，不只 happy path
· 简洁、可维护
· 有测试与合适文档
· 设计留出演进空间（YAGNI 与可扩展性的平衡）
· 满足安全、可观测性等 non-functional 要求
新习惯： 当直觉说"不值得做"时，不妨开个异步 agent 试一下——最坏情况是浪费几分钟 token；很多过去"不划算"的改进，现在值得做。
# 五大原则层（Principles）
1. 定义边界
Agentic Engineering 是专业工程师用 coding agent（能写能跑）放大能力；不等于 vibe coding（不审代码的原型玩法）。人的核心工作：定目标、给工具、验结果、把经验写回 harness。
2. 接受新约束
写代码几乎免费，写好代码仍然贵。旧习惯（过度规划、跳过测试/文档/重构）要推翻；直觉说「不值得做」时，不妨开个异步 agent 试一下。
3. 囤积可复用解法
积累带可运行证明的代码片段（仓库、笔记、小工具）。最强用法：把两个已验证例子拼进 prompt，让 agent 组合出新方案；每个技巧人类只需解决一次。
4. 质量应上升，而非下降
技术债、命名混乱、大文件拆分等「简单但耗时」的清理，交给后台 agent 做，成本已低到可零容忍 code smell；用原型并行验证技术选型；任务结束做回顾，把有效做法写进指令（复合工程）。
5. 严守反模式
绝不提交自己没审过的 PR。合格标准：确信能跑、体量小、有上下文、描述自己读过、附测试证据。否则只是把活甩给 reviewer。
# 实操层：与 Agent 更好的协作
1. 先懂机制，再谈用法
Agent = LLM + 系统提示 + 工具循环。你不必背实现细节，但要清楚：
· 对话越长越贵；agent 会尽量利用 token 缓存
· 模型无状态，每次重放上下文
· 能执行代码才是 coding agent 与普通 LLM 的分水岭
· Reasoning/Thinking 对调试复杂问题尤其有用
2. Git：大胆用，不必背
把 Git 当 agent 的「时间机器」和「安全网」：
· 新会话恢复上下文：Review changes made today
· 救场：Sort out this git mess for me
· 找丢了的代码：Find and recover my code that does ...
· 定位回归：Use git bisect to find when this bug was introduced
· 修 commit / 抽库留历史：Undo last commit / 从新 repo 复制模块并保留 commit 历史
3. Subagent：省上下文，不是炫技
上下文有限，大任务要「分身」：
· Explore：进陌生 repo 先摸清结构，汇总给主 agent
· 并行：多文件独立改动可同时跑，可用更便宜模型
· 专家（审查 / 跑测 / 调试）：隐藏冗长输出，只回报结果
原则： 为省 token 而拆，不为拆而拆；主 agent 够用就别过度分工。
4. 测试：三层防线
① TDD：先写测 → 确认失败 → 实现至通过
② 建立测试意识：新会话先跑全套测试
③ 手动验：python -c / curl / Playwright 真浏览器
④ 留证：Showboat 记录命令与真实输出，防编造
5. 理解代码：还认知债
Agent 产出若成黑盒，会积累 认知债（类似技术债，拖慢后续决策）：
· Linear walkthrough：线性导读，用 grep/cat 引用代码，禁止手抄
· Interactive explanation：在导读基础上做可暂停、可调速的动画演示
适用： 陌生代码、自己忘了细节的代码、vibe code 出来却没看过的代码。
Simon Willison
@simonw
5h
Replying to @jakedahn I've been writing a whole guide! simonwillison.net/guides/agentic…
12:27 AM · Jun 11, 2026 600 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 6 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 6
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 12

## full_text

Post
Log in Sign up
Post
meng shao
@shao__meng
再次强烈推荐「Agentic Engineering Patterns」
作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。文字由他本人撰写，示例与代码借助 LLM 辅助。
在线阅读：
simonwillison.net/guides/agentic…
核心目标：如何用好 Claude Code、Codex 这类能写代码、也能执行代码的 coding 心概念：Agentic Engineering ≠ Vibe Coding
Vibe Coding vs Agentic Engineering
· 定义来源：Karpathy 提出 vs Willison 提出的专业实践
· 适用人群：常与非程序员原型相关 vs 专业工程师放大既有能力
· 代码质量：未审查、原型级 vs 审查、测试、可上线
· 人的角色：几乎不参与代码理解 vs 定义问题、验证结果、持续改进 harness
Agent 的定义： 在循环中调用工具以达成目标。Coding agent 的关键差异是能执行代码——没有执行能力，LLM 输出价值有限；有了执行，agent 才能迭代到"确实能跑"的软件。
人的工作并未消失，而是上移：
· 决定写什么代码（问题空间有数十种解法与权衡）
· 提供工具与足够细的规格
· 验证结果是否稳健可信
· 把经验写回指令与 harness（LLM 本身不会从错误中学习，但系统可以）
# 全书最重要的一个判断
写代码变便宜了，写好代码并没有。
过去几十年，工程习惯都建立在"代码昂贵"之上：
· 宏观： 大量设计、估算、排期，功能必须数倍覆盖开发成本
· 微观： 是否重构、写测试、补文档、做 debug UI——每个决定都受时间约束
Agent 把这个约束打碎。一个人还能并行跑多个 agent，同时实现、重构、测试、写文档。
但"好代码"仍有明确标准：
· 能跑、且被证明能跑
· 解决对的问题
· 处理错误路径，不只 happy path
· 简洁、可维护
· 有测试与合适文档
· 设计留出演进空间（YAGNI 与可扩展性的平衡）
· 满足安全、可观测性等 non-functional 要求
新习惯： 当直觉说"不值得做"时，不妨开个异步 agent 试一下——最坏情况是浪费几分钟 token；很多过去"不划算"的改进，现在值得做。
# 五大原则层（Principles）
1. 定义边界
Agentic Engineering 是专业工程师用 coding agent（能写能跑）放大能力；不等于 vibe coding（不审代码的原型玩法）。人的核心工作：定目标、给工具、验结果、把经验写回 harness。
2. 接受新约束
写代码几乎免费，写好代码仍然贵。旧习惯（过度规划、跳过测试/文档/重构）要推翻；直觉说「不值得做」时，不妨开个异步 agent 试一下。
3. 囤积可复用解法
积累带可运行证明的代码片段（仓库、笔记、小工具）。最强用法：把两个已验证例子拼进 prompt，让 agent 组合出新方案；每个技巧人类只需解决一次。
4. 质量应上升，而非下降
技术债、命名混乱、大文件拆分等「简单但耗时」的清理，交给后台 agent 做，成本已低到可零容忍 code smell；用原型并行验证技术选型；任务结束做回顾，把有效做法写进指令（复合工程）。
5. 严守反模式
绝不提交自己没审过的 PR。合格标准：确信能跑、体量小、有上下文、描述自己读过、附测试证据。否则只是把活甩给 reviewer。
# 实操层：与 Agent 更好的协作
1. 先懂机制，再谈用法
Agent = LLM + 系统提示 + 工具循环。你不必背实现细节，但要清楚：
· 对话越长越贵；agent 会尽量利用 token 缓存
· 模型无状态，每次重放上下文
· 能执行代码才是 coding agent 与普通 LLM 的分水岭
· Reasoning/Thinking 对调试复杂问题尤其有用
2. Git：大胆用，不必背
把 Git 当 agent 的「时间机器」和「安全网」：
· 新会话恢复上下文：Review changes made today
· 救场：Sort out this git mess for me
· 找丢了的代码：Find and recover my code that does ...
· 定位回归：Use git bisect to find when this bug was introduced
· 修 commit / 抽库留历史：Undo last commit / 从新 repo 复制模块并保留 commit 历史
3. Subagent：省上下文，不是炫技
上下文有限，大任务要「分身」：
· Explore：进陌生 repo 先摸清结构，汇总给主 agent
· 并行：多文件独立改动可同时跑，可用更便宜模型
· 专家（审查 / 跑测 / 调试）：隐藏冗长输出，只回报结果
原则： 为省 token 而拆，不为拆而拆；主 agent 够用就别过度分工。
4. 测试：三层防线
① TDD：先写测 → 确认失败 → 实现至通过
② 建立测试意识：新会话先跑全套测试
③ 手动验：python -c / curl / Playwright 真浏览器
④ 留证：Showboat 记录命令与真实输出，防编造
5. 理解代码：还认知债
Agent 产出若成黑盒，会积累 认知债（类似技术债，拖慢后续决策）：
· Linear walkthrough：线性导读，用 grep/cat 引用代码，禁止手抄
· Interactive explanation：在导读基础上做可暂停、可调速的动画演示
适用： 陌生代码、自己忘了细节的代码、vibe code 出来却没看过的代码。
Simon Willison
@simonw
5h
Replying to @jakedahn I've been writing a whole guide! simonwillison.net/guides/agentic…
12:27 AM · Jun 11, 2026 600 Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 6 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 6
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 12

## extraction_diagnostics

- extraction_method: main
- readability_score: 94
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":94,"text_length":4248,"paragraph_count":52,"sentence_count":24,"boilerplate_hits":1,"symbol_ratio":0.0113,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Post Log in Sign up Post meng shao @shao__meng 再次强烈推荐「Agentic Engineering Patterns」 作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   文字由他本人撰写，示例与代码借助 LLM 辅助。

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   在线阅读： simonwillison.

5. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   net/guides/agentic… 核心目标：如何用好 Claude Code、Codex 这类能写代码、也能执行代码的 coding 心概念：Agentic Engineering ≠ Vibe Coding Vibe Coding vs Agentic Engineering · 定义来源：Karpathy 提出 vs Willison 提出的专业实践 · 适用人群：常与非程序员原型相关 vs 专业工程师放大既有能力 · 代码质量：未审查、原型级 vs 审查、测试、可上线 · 人的角色：几乎不参与代码理解 vs 定义问题、验证结果、持续改进 harness Agent 的定义： 在循环中调用工具以达成目标。

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Coding agent 的关键差异是能执行代码——没有执行能力，LLM 输出价值有限；有了执行，agent 才能迭代到"确实能跑"的软件。

## business_elements

- companies: X, 邵猛 (@shao__meng)
- products: Claude, Codex, agent, Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 权限 / 安全治理
- business_actions: 部署 / 上线
- affected_departments: IT / 安全
- numbers: 2026, 2, 1, 3, 4, 5, 12, 27
- quotes: 的软件。
人的工作并未消失，而是上移：
· 决定写什么代码（问题空间有数十种解法与权衡）
· 提供工具与足够细的规格
· 验证结果是否稳健可信
· 把经验写回指令与 harness（LLM 本身不会从错误中学习，但系统可以）
# 全书最重要的一个判断
写代码变便宜了，写好代码并没有。
过去几十年，工程习惯都建立在 / 之上：
· 宏观： 大量设计、估算、排期，功能必须数倍覆盖开发成本
· 微观： 是否重构、写测试、补文档、做 debug UI——每个决定都受时间约束
Agent 把这个约束打碎。一个人还能并行跑多个 agent，同时实现、重构、测试、写文档。
但 / 仍有明确标准：
· 能跑、且被证明能跑
· 解决对的问题
· 处理错误路径，不只 happy path
· 简洁、可维护
· 有测试与合适文档
· 设计留出演进空间（YAGNI 与可扩展性的平衡）
· 满足安全、可观测性等 non-functional 要求
新习惯： 当直觉说 / 时，不妨开个异步 agent 试一下——最坏情况是浪费几分钟 token；很多过去

## evidence_seed

- company_actions: Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。 / Post Log in Sign up Post meng shao @shao__meng 再次强烈推荐「Agentic Engineering Patterns」 作者 @ simonw 2026 年 2 月起撰写，每周约新增 1–2 章，目前仍在演进。 / 文字由他本人撰写，示例与代码借助 LLM 辅助。
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
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
- user_feedback_pool: true
- watchlist: true

## pool_routes

- core_pool
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
- discovery_record: {"discovery_title":"Agentic Engineering Patterns 指南","discovery_summary":"Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2064867069167087782","discovered_at":"2026-06-11T01:23:43.672Z","rank_on_page":36,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Simon Willison 撰写《Agentic Engineering Patterns》指南（2026年2月起连载），阐述专业工程师如何用 Claude Code、Codex 等 coding agent 获得可靠可维护结果。核心区分：Agentic Engineering ≠ Vibe Coding。关键判断：写代码变便宜了，写好代码并没有。五大原则：定义边界（人的工作：定目标、给工具、验结果、把经验写回 harness）、接受新约束、囤积可复用解法、质量应上升而非下降、严守反模式（绝不自审 PR）。实操：Git 作 agent 时间机器、Subagent 省上下文、三层测试防线、线性代码导读消除认知债。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
