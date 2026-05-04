# 观澜AI 工作进度账本

## 2026-05-04 GitHub 与 Netlify 更新任务派发

根据用户要求，调度中枢已新增 GitHub 同步与 Netlify 更新任务，用于把已验收、应进入版本管理的网站代码和项目工作流文件推送到 GitHub，并更新 Netlify 预览站点部署。

任务：
- 看板编号：`P0-4B`
- Task ID：`WSD-20260504-28-github-netlify-sync`
- 派发单：`agent-workflow/execution/WSD-20260504-28-github-netlify-sync.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-28-github-netlify-sync-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

任务边界：
- 这是版本同步与 Netlify 预览站点更新，不是正式 production launch。
- 必须先审计 Git 状态、分支、remote 和未提交文件。
- 只提交和部署已验收、应进入版本管理的变更。
- 不得提交或部署 `P0-2A` void / abandoned 成果。
- 不得提交或部署 `P0-2B` failed / not accepted 成果。
- 不得使用破坏性 Git 命令，不回滚或删除陌生修改。

验收要求：
- closeout 必须写清 GitHub branch、commit hash、remote URL 和 push 结果。
- closeout 必须写清 Netlify Site ID、Deploy ID、部署 URL 和默认站点 URL。
- 必须检查远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS 和 data 可访问。

自动化影响：
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 本任务可能影响上线准备路径和 Netlify 预览站点。

## 2026-05-04 网站模块与设计规范联合梳理任务派发

根据用户要求，调度中枢已新增规划评审任务，由升级后的 PM Agent 与 UI / UE Design Director 联合梳理网站模块、页面体系和设计规范，并提出修改与优化意见。

任务：
- 看板编号：`P0-10A`
- Task ID：`WSD-20260504-27-site-module-design-review`
- 派发单：`agent-workflow/execution/WSD-20260504-27-site-module-design-review.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-27-site-module-design-review-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

任务边界：
- 不直接修改 `04-Site/`。
- 不进入 Dev。
- 不生成首页海报图。
- 不新增前台栏目或后台能力，只做 PM 模块生命周期评审、Design Director 全站规范审计、DESIGN v2 修改建议和后续任务拆分。

调度建议：
- 先执行 `P0-10A`。
- `P0-10A accepted` 后，再决定是否执行或更新 `P0-10`。
- `P0-11` 仍必须等 `P0-10 accepted` 后再执行。

自动化影响：
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 如执行窗口提出改变 Markdown 命名、字段规则、同步脚本、统一同步闸门、自动化时间线或内容生成口径，只能作为建议写入报告，不得直接修改。

## 2026-05-04 调度中心交接补充

- 已生成调度中心新窗口交接文件：`agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md`。
- 已接收并验收 `WSD-pm-module-governance`，状态 `accepted`。
- PM Agent 已升级“宁缺毋滥”模块生命周期治理；后续新增功能、页面、入口、视图、筛选、后台能力、会员能力、自动化产物或数据维度，必须先过 PM 新增功能门禁、WAVE 评分和模块决策表。
- 产品功能类任务未通过 PM 门禁时，不得直接进入 Dev。

## 当前状态

更新时间：2026-05-02

已知状态：

- 项目根目录已调整为 `01-WaveSight`。
- `07-Opportunities` 已扁平化，机会卡直接位于 `07-Opportunities/`。
- 网站同步脚本路径已配置化：`04-Site/config/content-paths.json`。
- 已建立 `agent-workflow` 长任务协同目录。
- 已运行多 agent 梳理，形成 Strategy、Content/Data、UI、Dev、Copy、PM 六类角色。
- 已确认需要固定 PM Agent，作为栏目规划、产品功能规划、PRD 和验收总控。
- 已新增产品战略、栏目架构、PRD 模板、里程碑、发布计划、审批规则和工具登记。

## 当前产品判断

- 观澜AI是面向商业决策者的 AI 机会判断系统，不是 AI 新闻站或工具站。
- 核心卖点统一为：比市场早一步，看清哪些 AI 机会值得验证。
- 前台推荐导航调整为：首页 / Daily Brief / Signals / Opportunities / Trends。
- `Scoring` 保留为后台 Priority Engine，不再作为前台栏目；`Priorities` 的能力合并进入 `Opportunities`。
- `Opportunities` 是最终机会库，必须承接评分、优先级、证据等级、趋势状态和验证动作。
- Admin 必须独立隐藏，普通用户页面不能出现编辑、同步、恢复、访问状态等后台痕迹。
- Daily Brief 是每日核心付费交付物，应成为可独立阅读和邮件发送的商业内参。
- Signals 不是新闻，而是有事件、有证据、有商业含义的 AI 商业变化。
- Trends 不是趋势列表，而是趋势判断模型，需要解释升温、分化、降温、风险与反证。

## 待重点复核

1. 旧 `scoring.html` 前台如何迁移、隐藏或作为 Opportunity 排序视图，需要 PM 和 Dev 联合确认。
2. 需要设计正式的 Daily Brief 模板，并用最近一天数据生成样稿。
3. 需要把 Opportunities 字段升级为承接 Priority Engine 的正式机会卡。
4. 需要实现 schema-check、relation-check、dedupe-check、keyword-quality-report、brief-quality-check。
5. Tags 页面需要从前台一级导航降级为搜索和机会网络能力。
6. 每次改首页、栏目页、视觉或文案前，继续使用 frontend-design、awesome-design-md、copywriting 和 PM 判断。
7. 云端部署前，需要跑 deploy-check 和 release checklist。

## 本轮完成

- 参考 PM Skills Marketplace 的 Discovery、Strategy、Execution、PRD、Prioritization、Opportunity Solution Tree 方法，设立 PM Agent。
- 补充 `agent-workflow/product/`、`agent-workflow/prd/`、`agent-workflow/roadmap/`、`agent-workflow/execution/`、`agent-workflow/governance/`。
- 重写 `feature_list.json`，加入 milestone、owner、automation_level、approval_required、acceptance、verification。
- 新增 `04-Site/DESIGN.md`，沉淀观澜AI现有网站设计原则。
 - 运行健康检查，最新日志为 `agent-workflow/logs/health-20260502-143348.md`；基础文件正常，仍有 4 条历史评分项赛道为空。

## 2026-05-02 新阶段启动

本轮根据新的产品判断，正式启动多 agent 协同阶段。

新增作战手册：

- `product/strategy-single-source.md`：观澜 AI 战略单一事实源，作为所有长期 agent 的共同依据。
- `agents/`：长期 agent 岗位库，包含 Strategy、PM、UI/UE、Copy、Data、Dev、QA、Workflow 八个角色。
- `product/signal-system.md`：Signals 定义、监测来源、关键词自优化和评分算法。
- `product/daily-brief-product.md`：Daily Brief 作为付费级独立报告的结构和质量标准。
- `product/trend-model.md`：趋势状态、证据阶梯、采用曲线、机会温度、趋势分化和反证模型。
- `product/commercial-site-modules.md`：会员制官网、登录注册、7 天试读、会员订阅、企业版/私享内参申请和后台运营模块。
- `execution/agent-launch-2026-05-02.md`：本阶段多 agent 启动计划、目标、分工和验收。

新增 agent：

- Strategy Agent
- PM Agent
- UI / UE Agent
- Copy Agent
- Data Agent
- Dev Agent
- QA / Acceptance Agent
- Workflow / Automation Agent
- Signal Intelligence Agent
- Daily Brief Agent
- Opportunity Engine Agent
- Trend Intelligence Agent
- Commercial Site Agent

新增核心任务：

- `GL-M1-004` 建立 Signals 定义、监测来源与评分算法。
- `GL-M1-005` Daily Brief 产品化。
- `GL-M1-006` Trends 趋势判断模型升级。
- `GL-M2-001` 将 Priorities 合并进 Opportunities。
- `GL-M2-004` 建立内容质量与关键词质量检查。
- `GL-M3-003` 补齐会员制官网商业化模块。
- `GL-M3-004` 内部方法论资产沉淀，暂不作为当前对外页面。

## 2026-05-02 文档一致性整理

本轮统一了新战略主线：

- 前台导航固定为：首页 / Daily Brief / Signals / Opportunities / Trends。
- `Scoring` 保留为后台 `Priority Engine`。
- `Priorities` 不作为独立前台栏目，能力合并进 `Opportunities`。
- `Method` 不作为当前前台栏目，先作为内部方法论资产。
- 普通用户路径为注册 / 登录 / 7 天试读 / 订阅；企业版和私享内参保留申请入口。

新增 active PRD：

- `PRD-001-daily-brief.md`
- `PRD-002-signals-system.md`
- `PRD-003-opportunities-engine.md`
- `PRD-004-trends-model.md`
- `PRD-005-membership-access.md`

启动目标：

> 把观澜 AI 从“本地内容网站”升级为“可监测、可执行、可优化、可商业化的 AI 商业判断产品”。

## 2026-05-02 长期 Agent 岗位化

已建立长期 agent 岗位库：

- `agents/strategy-agent.md`
- `agents/pm-agent.md`
- `agents/ui-ue-agent.md`
- `agents/copy-agent.md`
- `agents/data-agent.md`
- `agents/dev-agent.md`
- `agents/qa-agent.md`
- `agents/workflow-agent.md`
- `agents/agent-registry.json`

长期 agent 不依赖某一个临时对话线程存在。临时 agent 可以关闭，但岗位说明书、任务状态、交接记录和验收标准必须保留。

后续每轮工作从 Strategy Agent 开始：

```text
Strategy -> PM -> Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

## 工作纪律

- 新一轮开始前先查看 `feature_list.json` 和 `progress.md`。
- 新增栏目或重要功能前先写 PM 判断或 PRD。
- 修改网站前明确普通端和管理员端影响范围。
- 每轮完成后记录：改了什么、验证了什么、还有什么风险。

## 2026-05-02 Opportunities 与 Priority Engine 关系打通

已按长期 agent 规则完成 Data Agent / Dev Agent 阶段，未创建新的临时 agent。

完成事项：

- 新增 `product/opportunity-priority-schema.md`，沉淀 scoring 与 opportunity 的关系字段和匹配规则。
- 更新 `04-Site/scripts/sync-data.mjs`，自动拆分 scoring 原始名称、机会方向和代表案例。
- 同步后每个 scoring row 写入 `relatedOpportunityId`、`opportunityId`、`opportunitySlug`、`opportunityTitle`、`opportunityMatchStatus`。
- 同步后每张 opportunity card 写入 `relatedScoringIds`、`priorityRows`、`priorityScore`、`priorityRank`、`representativeCases`。
- Opportunities 右侧机会排行可点击进入匹配到的机会详情页。
- 机会卡列表显示来自 Priority Engine 的评分。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- scoring rows：26。
- matched：26。
- unmatched：0。
- opportunities with score：18。
- opportunities without score：5。

本轮报告：

- `reports/opportunity-priority-link-2026-05-02.md`

## 2026-05-02 Trends 趋势模块优化

已按长期 agent 规则完成 Trend Intelligence / Data / UI-UE / Dev 阶段，未创建新的临时 agent。

完成事项：

- Trends 引入每日 `AI机会评分` 作为第二证据层。
- 同步脚本为每个 trend 生成 `status`、`statusLabel`、`summary`、`latestScore`、`relatedScoringIds`、`topScoringRows`、`evidenceLadder`、`adoptionStage`、`opportunityTemperature`、`counterEvidence`。
- Trends 列表页从普通卡片列表升级为趋势地图。
- Trend 详情页升级为“主判断 + 评分变化 + 证据阶梯 + 机会温度 + 评分证据 + 关联机会 + 反证观察”。
- 趋势文案去掉表情符号，保持克制判断，不替用户下最终投资、经营或合作结论。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- trends：10。
- 每个 trend 均已生成状态、证据阶梯和反证观察。

本轮报告：

- `reports/trends-optimization-2026-05-02.md`

## 2026-05-02 Signal-Priority-Trend-Opportunity 关系检查

已按长期 agent 规则完成 Data / QA / Dev 阶段，未创建新的临时 agent。

完成事项：

- 新增 `product/relation-check-schema.md`，定义 Signal、Priority、Trend、Opportunity 四类数据的关系检查规范。
- 新增 `04-Site/scripts/check-relations.mjs`，可在每次同步后检查断链和关系覆盖率。
- 检查报告自动写入 `reports/relation-check-latest.md` 和按日期命名的报告。
- 关系检查区分硬错误与软提醒：硬错误代表 ID 断链，软提醒代表运营复核项。

当前检查结果：

- 硬错误：0。
- 软提醒：23。
- Priority -> Opportunity：26/26，100%。
- Priority -> Trend：26/26，100%。
- Signal -> Opportunity：22/22，100%。
- Trend -> Priority：10/10，100%。
- Trend -> Opportunity：10/10，100%。

当前待优化项：

- 4 条 Priority 缺少原始 Signal。
- 10 条 Signal 尚未进入 Trend。
- 4 条 Trend 缺少原始 Signal 证据。
- 5 张 Opportunity 暂无评分证据。

后续每次运行 `node 04-Site/scripts/sync-data.mjs` 后，应继续运行 `node 04-Site/scripts/check-relations.mjs`。

## 2026-05-02 战略事实源补充整合

本轮已根据用户补充的四个文档，统一更新 `product/strategy-single-source.md`：

- `guanlan-spec.md`
- `product/column-architecture.md`
- `product/commercial-site-modules.md`
- `product/product-strategy.md`

整合后的事实源继续作为所有长期 agent 的共同依据，覆盖产品定位、栏目结构、商业化模块、权限体系、后台运营、Signals / Daily Brief / Opportunities / Trends 的一体化关系。

补充修订：

- 新增文案风格规范：克制、有观点、有证据边界，不替客户下最终判断。
- 新增页面 UI 风格规范：高端、克制、清晰、有留白，普通用户前台不出现后台痕迹。
- 优化 Daily Brief 结构：从“行动建议”改为“今日判断、关键 Signals、机会观察、趋势变化、判断依据、风险与反证”。
- 同步修订 `product/daily-brief-product.md`，避免交付口径变成投资、经营或合作指令。

## 2026-05-02 长期 Agent 调度规则修正

用户明确要求：后续必须把工作分配给已有长期智能体，不能每次重复创建临时 agent。

已新增硬规则文件：

- `governance/long-term-agent-dispatch-policy.md`

后续执行要求：

- 默认不调用临时 agent 创建能力。
- 任务分配必须写入 `execution/`、`feature_list.json`、`prd/active/` 或对应长期 agent 岗位文件。
- 只有用户明确批准时，才允许创建临时执行线程。
- 如确需临时线程，必须先说明原因、写入范围和回填方式。

补充任务：

- 已将“首页页面布局和排版优化”加入 PM Agent 本轮任务。
- PM Agent 需要先定义首页的信息层级、模块取舍、桌面/移动端验收点，再交给 UI/UE Agent 和 Copy Agent 执行。

## 2026-05-02 PM Agent 执行结果

已按长期 agent 规则执行 PM Agent 本轮工作，未创建临时 agent。

本轮更新：

- 重写 `prd/active/PRD-001-daily-brief.md`，Daily Brief 改为每日判断内参，删除行动建议结构。
- 重写 `prd/active/PRD-002-signals-system.md`，明确 Signal 标题必须是事件 + 商业含义。
- 重写 `prd/active/PRD-003-opportunities-engine.md`，明确 Scoring 后台化为 Priority Engine，并入机会卡。
- 重写 `prd/active/PRD-004-trends-model.md`，明确趋势状态、证据阶梯和反证模型。
- 重写 `prd/active/PRD-005-membership-access.md`，明确会员访问与 Admin 权限边界。
- 新增 `prd/active/PRD-006-homepage-layout.md`，定义首页布局与排版优化。
- 新增 `execution/pm-next-sprint-2026-05-02.md`，定义 P0 / P1 执行顺序与各长期 agent 后续边界。

下一步建议：

- 用户确认 PM Sprint 后，进入 Data Agent、UI/UE Agent、Copy Agent 的规范输出阶段。

## 2026-05-02 Signals 商业信号系统补充

根据用户补充要求，已更新 Signals 系统：

- `prd/active/PRD-002-signals-system.md`
- `product/signal-system.md`
- `execution/pm-next-sprint-2026-05-02.md`

补充内容：

## 2026-05-02 Dev Agent 第一轮开发

已按长期 agent 规则进入 Dev Agent 开发阶段，未创建新的临时 agent。

完成事项：

- 更新 `04-Site/config/content-paths.json`，继续保持内容目录配置化。
- 更新 `04-Site/scripts/sync-data.mjs`，支持新版 Signals 字段，包括 Signal Score、来源层级、运营状态、相关机会、相关趋势和评分拆分项。
- 修复同步脚本中的路径斜杠转义问题。
- 已执行网站数据同步，生成新的 `04-Site/data/radar-data.json` 与 `04-Site/data/radar-data.js`。
- 同步结果：22 signals，26 score rows，10 trends，23 opportunities。
- 公开前台导航已收敛为：首页 / Daily Brief / Signals / Trends / Opportunities；普通页面不再展示 Priorities 与 Tags 一层入口，Admin 页面仍保留管理入口。
- Daily Brief 页面已升级为每日判断内参结构，包含今日判断、关键 Signals、机会卡观察和趋势观察。
- Priority Engine 已合并进入 Opportunities 页面顶部，评分说明从行动建议改为证据强度和观察状态。
- Daily Brief 已继续拆成列表页与独立详情页：列表卡片可点击进入 `daily-detail.html`，卡片中已撤掉机会优先级，只保留关键 Signals、机会卡和趋势观察。
- 首页 Decision Brief 第一栏已由优先级内容改为今日关键 Signals。
- 已按 `frontend-design` 对 Daily Brief 和首页 Decision Brief 做视觉重排，减少小卡片堆叠，改成更清晰的内参式阅读布局。
- 根据用户反馈继续修正 Daily：放宽页面左右宽度，详情页改为主 Signal 阅读区 + 右侧机会/趋势侧栏。
- Daily Detail 已继续优化文案和排版：标题改为观澜简报，主判断强调连续证据，阅读区和侧栏文字层级重新收紧。
- 已新增 `product/DESIGN.md` 作为观澜AI长期设计规范，明确 Daily Brief、首页 Decision Brief、Signals、Opportunities、文案和 UI Agent 工作流程。
- 已重写 `agents/ui-ue-agent.md`，要求 UI/UE Agent 每次改页面前必须读取 `DESIGN.md`，声明设计参考、阅读路径和验收点。
- 已新增 `product/COPY.md` 作为观澜AI长期文案规范，明确对外表达、Daily Brief、Signals、Opportunities、Trends、CTA、禁用词和文案验收标准。
- 已重写 `agents/copy-agent.md`，要求 Copy Agent 每次改文案前必须读取 `COPY.md` 与 `DESIGN.md`，避免内部流程语、过度承诺和替客户下最终判断。
- Copy Agent 文案准则已补充：言之有物、简洁克制、精炼有力、不讲废话；每句话都必须提供信息、判断或边界。
- 新增 `reports/dev-implementation-2026-05-02.md` 作为本轮开发记录。

下一步建议：

- 前台导航收敛为：首页 / Daily Brief / Signals / Opportunities / Trends。
- Scoring 后台化为 Priority Engine，并入 Opportunities。
- Daily Brief 页面升级为每日内参结构。
- 继续剥离普通前台和管理员权限入口。

- 建立可支撑实际运营的 Signal Score 模型。
- 新增 Signal 运营字段，包括分数拆解、来源层级、关键词来源、监测批次、去重键和反馈标签。
- 明确每日监测任务需要反向优化关键词、优秀网站和数据源。
- 建立每日复核、每周关键词/来源质量报告、每月模型校准、季度复盘机制。
- 明确算法分数只用于筛选、排序和复盘，不替代最终商业判断。

## 2026-05-02 会员访问与 Admin 权限边界开发

已按长期 agent 工作规范执行 PRD-005，未创建临时 agent。

执行前确认标准：

- UI 依据 `product/DESIGN.md` 与 `frontend-design`：前台保持克制、清晰、有留白，普通用户路径不出现后台痕迹。
- 文案依据 `product/COPY.md`：言之有物、简洁克制，不使用申请审批口径，不替用户下最终判断。

完成事项：

- 前台访问逻辑从“申请审批”改为“注册试读 / 登录 / 订阅 / 阅读权限”。
- 新增 `register.html`、`login.html`、`account.html`、`pricing.html`、`checkout.html`。
- 注册后自动获得试读期，默认 7 天；管理员可在后台调整默认试读天数。
- 订阅方案支持月度、季度、年度；本地演示环境用模拟支付开通阅读期限。
- Admin 新增用户权限管理与订阅记录，支持给用户加一周、一月、一季或设为到期。
- 首页、旧预览页和受限页入口已替换为注册、登录、订阅相关文案。
- 旧 `apply.html` 改为停用提示页，不再承载申请流程。

验证：

- `node --check 04-Site/js/app.js` 通过。
- 站点 HTML/JS 中已清理公开“申请访问 / 审批 / 访问申请 / 访问状态”等旧流程文案。

## 2026-05-03 商业雷达补跑

已按用户要求使用当前会话 OpenAI/Codex 内置网页检索能力补跑 2026-05-03 商业雷达。

完成事项：

- 将 05-03 原空跑文件修正为正式 Signals 文件，新增 7 条 Signals。
- 将 05-03 评分文件修正为正式评分表，新增 7 条评分项。
- 新增 4 张机会卡：专业服务AI工作流平台、临床影像AI辅助诊断平台、企业数据智能体控制平面、中小商家AI营销对话平台。
- 更新趋势总表，新增/补强专业服务AI、医疗AI、企业数据/RAG、AI Agent、AI治理、AI客服、AI营销等趋势。
- 修正 Priority Engine 机会匹配规则，确保 05-03 新评分项能稳定进入对应机会卡。
- 已同步网站数据：29 Signals / 33 Priority Rows / 13 Trends / 27 Opportunities。
- 关系检查硬错误为 0，重复 URL / opportunity_id / slug 均为 0。

报告文件：

- `agent-workflow/reports/daily-radar-rerun-2026-05-03.md`

## 2026-05-03 机会拆解补齐与自动化任务修复

完成事项：

- 已为 `01-Signals/2026-05-03-AI商业雷达.md` 的 7 条 Signal 补齐 `机会拆解（6点｜必须详细拆解）`。
- 每条 Signal 均包含 6 个固定模块：解决问题、目标客户、替代/优化流程、商业模式、关注理由、中国市场迁移。
- 已更新 `每日观澜AI商业雷达` 自动化任务说明，将机会拆解写入硬性生成与验收条件。
- 已重新同步网站数据，05-03 的 7 条 Signal 在网站数据中均解析出 6 个机会拆解模块。
- 已运行关系检查，硬错误为 0。

报告文件：

- `agent-workflow/reports/opportunity-breakdown-fix-2026-05-03.md`

## 2026-05-03 会员模块验收与 Admin 独立任务拆分

已按 PM / QA 口径完成会员模块与普通/Admin 权限边界验收。

验收通过项：

- 未登录首页显示注册和登录入口。
- 未登录访问受限内容时显示注册 / 登录提示。
- 注册页包含密码和确认密码字段。
- 注册成功后进入账户页，并显示阅读权限有效期。
- 权限有效用户可以访问受限栏目。
- 登录页使用邮箱 + 密码。
- 错误密码会被拒绝，正确密码可登录。
- 阅读权限到期后访问受限栏目会提示续订。
- Admin 本机授权可访问受限栏目。
- 普通 URL 不显示页面编辑工具。
- 显式 `?admin=1` 编辑 URL 显示编辑工具。
- 普通页面未发现申请访问、审批、访问状态、JSON、同步、页面编辑等后台痕迹。

本轮 PM 决策：

- 会员模块继续聚焦普通用户注册、登录、账户、订阅、购买和阅读权限。
- Admin 后台从会员模块中拆出，作为独立后续开发任务。
- Admin 后续需要独立优化功能、设计、页面结构、操作文案和管理效率。

新增 / 更新文件：

- `agent-workflow/reports/membership-admin-boundary-acceptance-2026-05-03.md`
- `agent-workflow/prd/active/PRD-007-admin-console.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`

## 2026-05-03 The Point 栏目 PM 立项

用户提出新增栏目 `The Point`：展示每日一线 AI 创造者观点，简要解读，评出每日 Top10，按日期观察长期热度，并融合进 Daily Brief、Trends、Opportunities 和首页 Decision Brief。

已完成：

- 安装第三方 skill：`follow-builders`。
- 安装位置：`C:\Users\86186\.codex\skills\follow-builders`。
- 已安装脚本依赖：`npm install`。
- 已读取 skill 说明、默认来源、示例 digest 和 `prepare-digest.js`。
- 已确认默认来源包括 25 位 X / Twitter 一线 AI 创造者、6 个 AI 播客、2 个官方博客来源。

PM 输出：

- 新增 `product/the-point-model.md`：定义 The Point 观点层、数据字段、评分算法、长期热度、跨栏目融合。
- 新增 `prd/active/PRD-008-the-point.md`：定义 The Point 栏目需求、页面规划、算法需求、权限边界和验收标准。
- 新增 `execution/the-point-sprint-2026-05-03.md`：定义 P0/P1/P2 开发批次和需要用户确认的问题。
- 更新 `feature_list.json`，新增 `GL-M2-005 The Point 一线观点栏目`。

当前状态：

- 仅完成 PM 立项和需求文档。
- 尚未进入 Data / UI / Copy / Dev 开发。
- 已确认 The Point 进入前台一级导航，位置在 `Signals` 之后。
- 已确认需要补充 The Point 详情页开发需求。
- 已确认 The Point 需要成为每日自动更新任务：每日 08:30，先写入 `05-Point/YYYY-MM-DD-The-Point.md`。
- 已根据用户补充要求调整：The Point 不单独触发网站同步，而是等待商业雷达统一同步流程一起入站，避免自动化任务冲突。
- 已新增 `execution/the-point-daily-automation-2026-05-03.md`，作为后续 Workflow / Dev 实现依据。
- 用户已确认开始开发 The Point 模块。
- PM Agent 已完成长期 Agent 分派，不创建临时 Agent。
- 默认显示名为 `The Point`，第一版先使用 follow-builders 默认来源。
- Daily Brief 中 The Point 放在“今日判断”之后。
- 首页 Decision Brief 用 The Point 替代原趋势线索。

## 2026-05-03 The Point 开发分派

已按长期 Agent 规则完成 GL-M2-005 开发任务分派，新增总控任务：

- `agent-workflow/execution/task-GL-M2-005-the-point-agent-dispatch.md`

分派结果：

- Data Agent：定义 `Point`、`pointTopics`、Top10 算法、Markdown schema 与关联字段。
- Workflow Agent：设计每日 08:30 自动任务，只写入 `05-Point/`，不直接同步网站。
- UI/UE Agent：设计 The Point 栏目页、每日集合页、详情页、首页 Decision Brief 模块和 Daily Brief 模块。
- Copy Agent：输出栏目、详情页、首页和 Daily Brief 文案，遵守观点边界和禁用词。
- Dev Agent：接入内容路径、同步解析、导航、栏目页、每日集合页、详情页和跨栏目渲染。
- QA Agent：验收导航、权限边界、自动化冲突、移动端可读性、文案边界和关系断链。

已同步更新：

- `agent-workflow/execution/the-point-sprint-2026-05-03.md`
- `agent-workflow/feature_list.json`

## 2026-05-03 The Point P0 开发骨架

已进入 Dev Agent P0 开发，并完成 The Point 最小可运行链路：

- `05-Point/` 内容目录与样例 Markdown。
- `sync-data.mjs` 解析 The Point，并输出 `points` / `pointTopics`。
- 前台导航新增 The Point，位于 Signals 之后。
- 新增 `the-point.html` 栏目页、`point-daily.html` 每日集合页与 `point.html` 详情页。
- 首页 Decision Brief 使用 The Point 替代原趋势线索。
- Daily Brief 列表与详情页接入 The Point。
- `check-relations.mjs` 纳入 Point 关系检查。

验证结果：

- 同步结果：29 Signals / 33 Priority Rows / 13 Trends / 2 Points / 27 Opportunities。
- 关系检查硬错误：0。

报告：

- `agent-workflow/reports/the-point-dev-p0-2026-05-03.md`

## 2026-05-03 The Point 文案与 UI 验收

Copy Agent / UI-UE Agent 已按 `COPY.md` 和 `DESIGN.md` 对 The Point 页面与文字做专项检查。

完成修正：

- 页面主标题改为“一线 AI 创造者观点”。
- 公开页旧列表称谓改为“全部一线观点”。
- 卡片和详情页以“原文摘录”为主，观澜评论保持简洁。
- 来源统一为“查看原文”文字链接，不展示裸 URL。
- 空状态去掉“同步 Markdown”等内部流程词。

验收记录：

- `agent-workflow/reports/the-point-copy-ui-acceptance-2026-05-03.md`

追加修正：

- The Point 改为三层结构：栏目页 / 每日集合页 / 详情页。
- 新增 `04-Site/point-daily.html`。
- 栏目页 `the-point.html` 只展示日期入口和长期热度。
- 每日集合页展示当日 Top10 与全部一线观点。
- 首页与 Daily Brief 中旧版直译替换为“一线观点”。

## 2026-05-03 The Point 素材层修正

根据用户反馈，确认 `follow-builders` 原始输出中 YouTube 包含完整 transcript、Blog 包含 content；此前 The Point MD 和网站只展示观点摘片，不能满足“站内阅读 + Obsidian 长期沉淀”需求。

已完成：

- 新增 `05-Point/sources/2026-05-03/` 站内素材笔记层。
- 新增 YouTube 素材笔记：`youtube-no-priors-baseten.md`。
- 新增 Claude Blog 素材笔记：`blog-claude-managed-agents-memory.md`。
- `Point` 支持 `素材笔记` 字段，网站数据新增 `pointSources`。
- 新增 `04-Site/point-source.html` 站内素材阅读页。
- 人物详情页中，同一人物多条观点会分别展示对应的“站内阅读”和“查看原文”链接。
- YouTube 字段从 `原文全文` 调整为 `原始发言段`，Blog 字段从 `原文全文` 调整为 `原始段落`，避免把选段误标为全文。
- `agent-workflow/product/the-point-model.md` 已补充 X / Podcast / Blog 的原文入库规则。

验证结果：

- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- 同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 2 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。

追加修正：

- `pointSources` 增加 `全文文档`、`全文译文`、`来源与版权` 字段。
- `point-source.html` 素材页优先展示全文文档；没有全文文档时才回退到摘要、结构和高价值原文段。
- 新增 `agent-workflow/tools/import-point-source-fulltext.mjs`，用于把已授权或自有导出的全文写入对应素材 MD，再统一同步到网站。
- The Point 规范补充：YouTube / Blog 的时间戳只作为定位辅助，不作为主要阅读结构。

页面同步优化：

- 已重新运行 `04-Site/scripts/sync-data.mjs`。
- `point-source.html` 素材页优化为长文阅读版：正文收窄、行距增大、来源与版权弱化处理、全文译文独立阅读块。
- 侧栏新增“素材状态”，区分“全文已入库”和“结构化阅读”。
- 本地访问检查通过：YouTube 素材页和 Blog 素材页均返回 200。

追加清理：

- 已统一清理 Point 展示文本中的 YouTube speaker/timecode 标记。
- 已统一清理 Point 展示文本和同步数据中的 `https://t.co/...` X 短链。
- 当前 `05-Point/2026-05-03-The-Point.md`、YouTube 素材笔记和 `04-Site/data/radar-data.json` 中已无 `Speaker 3 |`、`t.co/` 残留。

## 2026-05-03 本轮结束交接

按 `AGENTS.md` 与长期 `agent-workflow` 规则，本轮已更新交接中心：

- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/reports/the-point-handoff-2026-05-03.md`

当前状态：

- The Point 已完成 P0/P1 级别可运行链路：栏目页、每日集合页、人物详情页、素材阅读页、首页/Daily/Signals 引用。
- 数据同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 2 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。
- Point 展示正文已清理 YouTube speaker/timecode 与 X `t.co` 短链。
- 站内素材页支持 `全文文档` / `全文译文`，但第三方 Blog / YouTube 全文入库仍需确认内容来源与授权边界。

仍未完成：

- The Point 每日 08:30 自动化任务尚未完全落地。
- The Point 仍需浏览器截图验收，覆盖首页、栏目页、每日页、人物详情页、素材页、Daily Brief、Signals 卡片和移动端。
- The Point 需要新增专门质量检查脚本或检查项：同人合并、来源去重、译文完整性、短链清理、speaker/timecode 清理、素材字段完整性。
- 会员/Admin 权限边界仍需完整 QA。
- 项目目录仍非 git 仓库，正式云端部署前需要版本管理、备份、回滚方案。

下一步建议：

1. QA Agent 先按截图验收 The Point 所有入口，确认无短链、无时间戳、无重复原文、无文案冗余。
2. Workflow / Dev Agent 落地 The Point 自动化任务，与商业雷达统一同步机制协调。
3. Data Agent 增加 The Point 数据质量检查，运行在 `sync-data.mjs` 之后。
4. UI/UE Agent 用真实长文样本继续优化 `point-source.html` 的移动端阅读体验。
5. Copy Agent 检查 The Point 全站入口文字，保持“人 + 原话 + 简洁解读”的规范。

## 2026-05-03 The Point 质量检查开发

已按长期 agent-workflow 执行 Data / Dev 任务，未创建临时 agent。

完成事项：

- 新增 `04-Site/scripts/check-point-quality.mjs`，用于检查 The Point 观点字段、素材笔记、短链清理、speaker/timecode 清理、译文完整性、素材授权说明和同源多观点状态。
- 自动输出 `agent-workflow/reports/the-point-quality-check-latest.md` 与按日期命名的质量检查报告。
- 为 Point 5、Point 8、Point 24 补齐站内素材笔记。
- 新增 `05-Point/sources/2026-05-03/blog-anthropic-april-23-postmortem.md`。
- 新增 `05-Point/sources/2026-05-03/blog-claude-connectors-everyday-life.md`。
- 为 Point 23 补齐机会关联，使 Point -> Opportunity 覆盖达到 24/24。
- 调整检查规则：同一原文链接若共享同一素材笔记，记为“同源多观点”备注，不作为软提醒。

验证结果：

- `node --check 04-Site/scripts/check-point-quality.mjs` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过，同步结果为 29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 23。
- `node 04-Site/scripts/check-point-quality.mjs` 通过，硬错误 0，软提醒 0。

报告：

- `agent-workflow/reports/the-point-quality-check-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-quality-check-latest.md`

## 2026-05-03 The Point 浏览器 QA 与移动端修正

已按长期 agent-workflow 执行 QA / UI-UE / Dev 任务，未创建临时 agent。

完成事项：

- 新增 `agent-workflow/tools/the-point-browser-qa.mjs`，用于自动化检查 The Point 全入口的桌面端和移动端展示。
- QA 覆盖首页、The Point 栏目页、每日集合页、人物详情页、素材页、Daily Brief 列表页、Daily Brief 详情页和 Signals 页面。
- 自动生成 16 张截图，保存到 `agent-workflow/reports/screenshots/the-point-qa-2026-05-03/`。
- 自动生成 `agent-workflow/reports/the-point-browser-qa-2026-05-03.md`。
- 修复 Signals 移动端未折叠为单列的问题。
- 修复 Daily Brief 详情页移动端仍按桌面两栏排版的问题。
- 为 Daily Detail / Signals 增加最终响应式护栏，避免后置 CSS 覆盖移动端断点。

验证结果：

- `node --check 04-Site/js/app.js` 通过。
- `node --check agent-workflow/tools/the-point-browser-qa.mjs` 通过。
- `node agent-workflow/tools/the-point-browser-qa.mjs` 通过。
- 浏览器 QA 最终结果：8 个页面 x 2 个视口全部通过，需复核项 0。
- 未发现 X `t.co` 短链、YouTube speaker/timecode、后台流程词、横向滚动或明显文本越出视口。

报告：

- `agent-workflow/reports/the-point-browser-qa-implementation-2026-05-03.md`
- `agent-workflow/reports/the-point-browser-qa-2026-05-03.md`

## 2026-05-03 项目临时文件清理

已按用户要求清理项目中的临时截图、临时 feed 缓存、一次性回填脚本和旧备份目录，确保不影响网站运行。

已删除：

- `04-Site/` 根目录下 22 个页面验收截图 PNG。
- `agent-workflow/tmp-feed-x.json`
- `agent-workflow/tmp-feed-podcasts.json`
- `agent-workflow/tmp-feed-blogs.json`
- `agent-workflow/tmp-follow-builders-feed.json`
- `agent-workflow/tools/update-point-originals-2026-05-03.mjs`
- `09-backup/`
- `codex-recovery-backups/`

已保留：

- `04-Site/assets/` 下正式站点资产，包括 `home-hero-radar.png`、`brand-lockup.png`、`logo.svg`。
- `agent-workflow/tools/import-point-source-fulltext.mjs`，这是后续全文导入工具，不是临时文件。

同步修正：

- 已从 `05-Point/2026-05-03-The-Point.md` frontmatter 移除临时 `source_reports` 引用，避免指向已删除的 `tmp-feed-*` 文件。

验证结果：

- 未发现对已删除截图、缓存和备份目录的残留文本引用。
- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check agent-workflow/tools/import-point-source-fulltext.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 硬错误为 0。
- 本次清理约释放 22.23 MB。

## 2026-05-03 Intelligence Data Agent 升级

已按用户确认，在不改变当前 8 个长期 agent 结构的前提下，将原 `Data Agent` 升级为 `Intelligence Data Agent`。

本轮完成：

- 更新 `agent-workflow/agents/data-agent.md`，将岗位从字段、标签、质量报告维护者升级为判断资产建模负责人。
- 更新 `agent-workflow/agents/agent-registry.json`，保留 `data-agent` id，名称改为 `Intelligence Data Agent`。
- 新增 `agent-workflow/execution/intelligence-data-agent-upgrade-2026-05-03.md`，定义 P0/P1/P2 任务分派。
- 更新 `agent-workflow/feature_list.json`，新增 `GL-M3-006 Data Agent 升级为 Intelligence Data Agent`。

升级后的职责范围：

- Signal Intelligence：Signal 标准、Signal Score、来源分层、关键词质量、去重规则。
- Trend Intelligence：趋势状态、证据阶梯、机会温度、反证清单。
- Opportunity Intelligence：机会方向、Priority Engine 评分、证据等级、代表案例、验证动作。
- The Point Intelligence：人物、观点、素材来源、原文/译文、观点热度、关系归属。
- Relation Intelligence：Signal / Priority / Trend / Opportunity / Point 的证据网络。
- Quality Intelligence：字段、证据、来源、关系、标签和内容质量检查。

当前分派的 P0 任务：

1. 关系软提醒收口，优先处理 `Priority -> Signal`、`Signal -> Trend`、`Trend -> Signal`、`Opportunity -> Priority`。
2. The Point Intelligence 质量规则固化，覆盖同人多观点、来源去重、素材笔记、原文/译文完整性、短链清理、speaker/timecode 清理和授权说明。
3. 输出 `agent-workflow/product/intelligence-data-model.md`，统一 Signal / Trend / Opportunity / Point 的最小合格标准。

验证：

- `agent-workflow/feature_list.json` 已新增正式任务。
- 后续 Data Agent 工作应按 Intelligence Data Agent 岗位说明执行。

## 2026-05-03 多 Agent Operating System 治理机制建立

基于用户要求，已按《执行摘要》中 Claude Code 工作流启发，为观澜AI建立多 agent 长期治理机制。

先建立 1-3：

- `agent-workflow/governance/agent-memory.md`：观澜AI长期 agent 记忆库，记录已确认规则、反复错误、禁用表达、质量边界和自动化经验。
- `agent-workflow/governance/plan-first-policy.md`：重大任务先计划再执行，明确哪些任务必须先由 Strategy / PM 输出计划。
- `agent-workflow/governance/quality-gates.md`：内容、页面、自动化、数据模型、开发和发布前的质量闸门。

随后建立 4-6：

- `agent-workflow/governance/automation-fallback-policy.md`：自动化失败、部分失败和阻塞失败的降级策略。
- `agent-workflow/governance/agent-handoff-template.md`：长期 agent 阶段性交接模板。
- `agent-workflow/governance/intelligence-model-calibration.md`：每月一次的数据智能校准机制，复盘 Signal、The Point、Trend、Opportunity 的判断质量。

同步更新：

- `agent-workflow/feature_list.json` 新增 `GL-M3-007 建立多 Agent Operating System 治理机制`。

后续执行要求：

- 新增栏目、改权限、改数据模型、改自动化、云端部署等重大任务必须先走 Plan-first。
- 每次任务结束必须说明通过了哪些 Quality Gates。
- 可复用经验要写入 Agent Memory。
- 自动化失败必须按 fallback policy 写清失败原因、降级路径和是否影响前台。
- 每个阶段性交付建议按 handoff template 写入 reports 或 docs/agent-handoff。
- Intelligence Data Agent 每月应按 calibration 机制输出数据智能校准报告。

## 2026-05-03 Agent Operating System 1-4 落地

根据用户要求，已先执行下一步优化中的 1-4。

完成事项：

1. 建立 `agent-workflow/governance/README.md`，作为 Agent Operating System 总入口，串联长期调度、Agent Memory、Plan-first、Quality Gates、自动化降级、交接模板和月度校准。
2. 更新 `AGENTS.md`：
   - 前台导航更新为：首页 / Daily Brief / Signals / The Point / Opportunities / Trends。
   - Data Agent 更新为 Intelligence Data Agent。
   - 新会话启动必读新增 governance README、Agent Memory、Plan-first、Quality Gates、Automation Fallback。
   - 新增重大任务 Plan-first、完成后 Quality Gates、自动化影响检查等规则。
3. 新增 `agent-workflow/execution/PLAN-template.md`，作为新增栏目、权限、数据模型、自动化、云端部署等重大任务的计划模板。
4. 新增 `agent-workflow/tools/run-quality-gates.mjs`，作为质量闸门统一脚本入口。

验证：

- `node --check agent-workflow/tools/run-quality-gates.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 已生成 `agent-workflow/reports/quality-gates-syntax-latest.md`。

自动化影响：

- 本轮未修改 `ai-the-point`、`ai-2`、`ai-3` 的定时任务口径。
- `run-quality-gates.mjs automation` 默认只检查统一同步闸门脚本语法；真实运行 `unified-site-sync.mjs` 必须显式传入 `--run-sync-gate`。

## 2026-05-03 Agent Operating System 5-9 落地

根据用户要求，已继续执行 5-8，并新增任务 9：由 Intelligence Data Agent 解决 Tags 膨胀问题。

完成事项：

1. 新增 `agent-workflow/reports/automation-first-run-2026-05-04.md`，由于 2026-05-04 自动化真实运行尚未发生，当前状态为 `pending_first_run`，报告中定义了 09:35 后的验收步骤、通过标准和阻塞标准。
2. 新增 `agent-workflow/reports/opportunity-priority-gap-review-2026-05-03.md`，评审 5 张无 Priority 评分证据的早期 Opportunity，结论是不为清零硬绑评分，分别给出 watch、合并候选、补评分或保留观察建议。
3. 新增 `agent-workflow/product/source-intelligence.md`，建立来源、关键词和 Builder 池治理模型。
4. 新增 `agent-workflow/product/commercial-operating-model.md`，定义会员制、试读、newsletter、样例内容、企业版和续订路径。
5. 新增 `agent-workflow/product/tag-taxonomy.md`，将 Tags 从随手标注升级为可搜索、可筛选、可关系网络化的判断资产。
6. 新增 `agent-workflow/reports/automation-impact-review-2026-05-03.md`，明确 source/tag 规则影响三段式自动化。
7. 已通过 Codex 自动化接口更新 `ai-the-point`、`ai-2`、`ai-3`：
   - `ai-the-point` 读取 `source-intelligence.md` 和 `tag-taxonomy.md`，Point 至少使用 point / track / source 三类标签。
   - `ai-2` 读取来源治理和标签字典，Signal / Opportunity / Trend 按标签分层生成，不再只写 `AI创业机会`。
   - `ai-3` 读取标签与来源模型，未知标签作为软提醒或 `needs_tag_review`，不作为硬错误。
8. 已更新 `AGENTS.md`，数据智能读取规范纳入 `source-intelligence.md` 和 `tag-taxonomy.md`。

验证：

- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- `feature_list.json` 和 `agent-registry.json` JSON 解析通过。
- 自动化 TOML 中已确认包含 `source-intelligence`、`tag-taxonomy` 和 `needs_tag_review` 等新口径。

自动化影响：

- 本轮确实影响 `ai-the-point`、`ai-2`、`ai-3` 的读取文件和生成规则，因此已更新三条自动化任务。
- 三段式边界未改变：The Point 和商业雷达只写 Markdown，统一入站仍由 `ai-3` 执行。
- 旧自动化 `ai` 仍为 `PAUSED`，本轮未更新。

## 2026-05-03 The Point 每日自动化落地

已按长期 agent-workflow 执行 Workflow / Automation / Dev 任务，未创建临时 agent。

完成事项：

- 创建 Codex cron automation：`观澜AI The Point 每日观点生成`。
- 自动化 ID：`ai-the-point`。
- 计划时间：每日 08:30，按当前项目环境 Asia/Shanghai 理解。
- 运行目录固定为 `C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`。
- 自动化只生成 `05-Point/YYYY-MM-DD-The-Point.md`、必要的 `05-Point/sources/YYYY-MM-DD/` 素材笔记、运行日志和运行报告。
- 自动化明确不得运行网站同步、不得运行关系检查、不得直接写入 `04-Site/data/radar-data.json` 或 `radar-data.js`。
- The Point 生成后的状态设为 `pending_unified_sync`，等待商业雷达统一同步流程入站。
- 已确认 `follow-builders` 技能目录存在，可作为自动化素材准备来源。

报告：

- `agent-workflow/reports/the-point-automation-setup-2026-05-03.md`

## 2026-05-03 每日自动化协调与同步防护

已按用户要求补强 AI 商业雷达与 The Point 两个内容自动化任务的协同关系，并新增统一网站同步闸门。

完成事项：

- 新增 `agent-workflow/tools/unified-site-sync.mjs`。
- 更新 The Point 自动化 `ai-the-point`：只生成 The Point Markdown，不运行网站同步。
- 新建 AI 商业雷达内容生成自动化 `ai-2`：只生成 Signals、Scoring、Trends、Opportunities Markdown，不运行网站同步。
- 新建统一网站同步闸门自动化 `ai-3`：每日 09:30 检查内容就绪后，统一备份、同步和质量检查。
- 同步闸门会检查当天 AI商业雷达、AI机会评分、The Point 三类 Markdown；任何缺失、空跑、失败、待补充、`needs_review` 或字段不完整都会阻止同步。
- 同步前备份 `04-Site/data/radar-data.json` 和 `04-Site/data/radar-data.js`；同步后关系检查或 The Point 质量检查失败会恢复备份。

验证结果：

- `node --check agent-workflow/tools/unified-site-sync.mjs` 通过。
- `node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03` 最终通过。
- 内容就绪检查：7 Signals / 7 Scoring Rows / 24 Points。
- 网站同步结果：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- 关系检查硬错误：0。
- The Point 质量检查硬错误：0。

报告：

- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/unified-site-sync-2026-05-03.md`

## 2026-05-03 Intelligence Data Agent P0 执行

已按升级后的 Intelligence Data Agent 执行用户指定的三项 P0 任务。

完成事项：

- 关系软提醒收口：
  - 更新 `04-Site/scripts/sync-data.mjs`，补充跨日期同产品/代表案例回链原始 Signal 的规则。
  - 更新 Trend 吸收 Signal 的规则：除赛道别名外，参考评分项和趋势具体产品证据。
  - 关系软提醒从 23 降至 5。
  - `Priority -> Signal` 从 29/33 提升到 33/33。
  - `Signal -> Trend` 从 19/29 提升到 29/29。
  - `Trend -> Signal` 从 9/13 提升到 13/13。
- The Point 质量规则固化：
  - 更新 `04-Site/scripts/check-point-quality.mjs`，在报告中输出固化规则。
  - 固化来源去重、同人多观点、素材笔记、原文/译文完整性、短链和 timecode 清理、授权说明。
  - 当前 The Point 质量检查硬错误 0、软提醒 0。
- 统一判断资产模型：
  - 新增 `agent-workflow/product/intelligence-data-model.md`。
  - 统一 Signal / Priority / Trend / Opportunity / Point 的入库、关系和质量标准。

保留结论：

- 剩余 5 条软提醒均为早期 Opportunity 暂无 Priority 评分证据。
- 按 Intelligence Data Agent 规则，不为清零而硬绑评分；已分别给出观察、合并或后续补评分建议。

验证结果：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-point-quality.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 5。
- `node 04-Site/scripts/check-point-quality.mjs` 通过，硬错误 0，软提醒 0。
- `agent-workflow/feature_list.json` 解析通过。

报告：

- `agent-workflow/reports/intelligence-data-relation-review-2026-05-03.md`
- `agent-workflow/reports/intelligence-data-point-rules-2026-05-03.md`
- `agent-workflow/product/intelligence-data-model.md`

## 2026-05-03 自动化任务同步更新

根据 Intelligence Data Agent 的规则调整，已同步更新三个长期自动化任务：

- `ai-the-point`：新增读取 `intelligence-data-model.md` 与 The Point 规则报告；生成时必须遵守来源去重、同人多观点、素材笔记、原文/译文完整性、短链/timecode 清理和授权说明。
- `ai-2`：新增读取 `intelligence-data-model.md`；生成商业雷达时必须遵守统一判断资产标准，且早期 Opportunity 暂无评分证据时不得为清零强行绑定。
- `ai-3`：新增读取 `intelligence-data-model.md`；同步闸门报告需要关注关系检查硬错误、软提醒数量，以及 Priority -> Signal / Signal -> Trend / Trend -> Signal 覆盖基线。

同时已更新 `AGENTS.md` 和 `docs/agent-handoff.md`：

- 后续任何影响 Markdown 结构、数据字段、同步脚本、质量检查、入站顺序或发布闸门的操作，都必须先提示可能影响自动化任务。
- 若改动不影响自动化，也应在最终回复中说明未影响自动化任务。

## 2026-05-03 Tag Taxonomy 源文件与网站公开标签治理

已按 Intelligence Data Agent 规则完成原始 Markdown 与网站公开 tags 治理。

完成事项：
- 批量整理 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/` 的 frontmatter tags。
- 将 `AI创业机会`、`AI-Agent`、`AI编程`、`AI-Coding`、`AI增长`、`Voice-AI`、`企业数据`、`企业知识库` 等泛标签或别名归并到正式标签。
- 新增 `agent-workflow/tools/normalize-source-tags.mjs`，用于后续复跑源文件标签归并。
- 新增 `04-Site/scripts/check-tags.mjs`，输出 `agent-workflow/reports/tag-quality-check-latest.md`。
- 更新 `04-Site/scripts/sync-data.mjs`：公开 `tags` 只允许正式字典标签进入；详细行业、能力、动作、产品词保留在 `taxonomy` 中用于关系匹配。
- 更新 `agent-workflow/tools/unified-site-sync.mjs`：统一网站同步闸门纳入 `check-tags.mjs`。
- 更新 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务，纳入正式标签字典与 tag 检查要求。

验证结果：
- 网站公开 tags 收敛为 46 个正式标签。
- `check-tags.mjs`：禁用别名 0，未知公开标签 0。
- 统一同步闸门 `node agent-workflow/tools/unified-site-sync.mjs --date=2026-05-03` 通过。
- 关系检查硬错误 0，保留 10 条早期 Opportunity 暂无评分证据软提醒。
- The Point 质量检查硬错误 0，保留 3 条 Point -> Trend 软提醒。

报告：`agent-workflow/reports/tag-taxonomy-source-cleanup-2026-05-03.md`

## 2026-05-03 Signal 事件类型标准化

按 Intelligence Data Agent 口径，已将 Daily Brief `变化类型` 的底层来源从混写 `newsType` 收敛为标准 Signal 主事件类型。

完成事项：
- 批量整理 `01-Signals/*.md` 中全部 `新闻类型` 字段，只保留一个主事件类型。
- 标准事件类型限定为：融资、客户采用、收入验证、产品发布、监管/政策、采购/招标、并购整合、平台数据。
- 更新 `04-Site/scripts/sync-data.mjs`，生成标准 `eventTypes` 字段，并避免把标签归一逻辑误用于事件类型。
- 更新 `04-Site/js/app.js`，Daily Brief `变化类型` 只展示标准事件类型汇总。
- 更新 `agent-workflow/product/intelligence-data-model.md` 与报告 `agent-workflow/reports/intelligence-data-event-type-normalization-2026-05-03.md`。
- 已更新自动化 `ai-2` 与 `ai-3`；`ai-the-point` 不受影响。

验证：
- Markdown 源文件事件类型检查全部为标准值。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0。
- `node 04-Site/scripts/check-tags.mjs` 通过，forbidden alias 0，unknown public tag 0。
## 2026-05-03 Signals 首页改版任务分配

已按 PM Agent 视角将 Signals 首页改版推进为 active PRD 与执行任务单，未创建临时 agent。

新增文件：
- `agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md`
- `agent-workflow/execution/signals-homepage-redesign-2026-05-03.md`

本轮分配：
- UI / UE Agent：负责证据雷达页布局、日期分组、筛选区、Signal 卡片、详情预览和移动端行为。
- Copy Agent：负责页面标题、指标标签、筛选标签、卡片字段、详情模块、来源入口和空状态文案。

设计参考：
- `frontend-design + Bloomberg/FT 内参式阅读 + Linear 信息密度`

当前边界：
- P0 只做前台价值表达和筛选体验。
- 不新增 Markdown 必填字段。
- 不修改同步脚本入口。
- 不改变 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务。
## 2026-05-03 Signals 首页二次优化方案

在新增 `04-Site/signal.html` 独立详情页后，PM Agent 与 UI / UE Agent 已重新定义 Signals 首页职责：栏目首页负责雷达筛选、日期复盘和进入详情，独立详情页负责完整来源、事实与信号脉络阅读。

新增方案报告：
- `agent-workflow/reports/pm-ue-signals-homepage-second-optimization-2026-05-03.md`

核心建议：
- 首页卡片瘦身为判断入口卡片。
- 右侧从完整详情预览改为当前视图摘要 + 选中 Signal 简短预览。
- 日期组头增强为当日小结。
- 所有 Signal 阅读入口统一进入 `signal.html?slug=...`。

自动化影响：本方案只涉及前台结构和跳转，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 独立详情页边界落地

已按用户确认修正：Signal 详情页是独立页面，Signals 栏目首页不再承担完整详情阅读。

完成事项：
- `04-Site/signals.html` 保持为 Signals 雷达首页：日期分组、筛选、顶部指标、紧凑 Signal 卡片、右侧当前视图摘要和选中 Signal 简短预览。
- `04-Site/signal.html` 作为独立详情页：展示完整证据、原始来源链接、机会拆解、评分依据、关联 Opportunity / Trend 和相关 Signals。
- `04-Site/js/app.js` 已清理 Signals 渲染边界：所有卡片与预览 CTA 均跳转 `signal.html?slug=...`，首页右侧不再渲染完整详情正文。
- `04-Site/css/styles.css` 补充首页雷达与独立详情页样式，并修正变化类型分布按钮的交互状态。
- `agent-workflow/feature_list.json` 中 `GL-M3-010` 已进入 `verify`。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过：29 Signals / 33 Priority Rows / 13 Trends / 24 Points / 4 Point Sources / 27 Opportunities。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：46 个公开标签，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页桌面/移动端无横向溢出，29 张卡片、29 个独立详情跳转；Signal 详情页桌面/移动端无横向溢出，来源链接与 4 个详情模块正常渲染。

截图记录：
- `agent-workflow/reports/signals-independent-homepage-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-independent-homepage-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-independent-detail-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-independent-detail-mobile-2026-05-03.png`

自动化影响：本轮只调整前台 HTML/CSS/JS 展示和跳转，不改变 Markdown 模板、同步脚本入口、数据字段、质量闸门或自动化顺序，因此不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 首页右栏与详情页排版修正

根据用户反馈，已继续收敛 Signals 首页右侧和 Signal 独立详情页的信息密度。

修正事项：
- Signals 首页右侧删除 `Radar View`、`这页只做筛选和判断入口` 等内部话术。
- 右侧改为客户可理解的“当前筛选”摘要：信号数、多信源、已连到机会/趋势、仍需观察、变化类型 chips。
- 删除右侧大四宫格指标和重复证据条，降低占位。
- Signal 详情页从“大卡片堆叠”改为研究笔记式阅读结构。
- 顶部判断区改为紧凑导语，不再用大面积深色块承载长摘要。
- “为什么这是 Signal”改成事实 / 含义两条紧凑判断，不再使用大卡片。
- “机会拆解”和“评分依据”改为分隔线条目，减少边框、阴影和大留白。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-tags.mjs` 通过：46 个公开标签，禁用别名 0，未知公开标签 0。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页和 Signal 详情页桌面 / 移动端无横向溢出；详情页主内容不再使用巨型卡片，`analysis-card` 在 Signal 详情页中为 0。

截图记录：
- `agent-workflow/reports/signals-compact-panel-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-editorial-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-editorial-mobile-2026-05-03.png`

自动化影响：本轮只修改前台 JS/CSS 展示层，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 双页面成品感重构

根据用户继续反馈“粗糙，两个页面都要改”，已对 Signals 首页与 Signal 详情页做第二轮 UI / Copy 联合重构。

重构方向：
- Signals 首页从“卡片墙 + 右侧小面板”改为“情报筛选台”。
- Signal 详情页从“正文 + 超长侧栏”改为“商业信号报告页”。

Signals 首页改动：
- 顶部指标从大卡片改为横向情报条。
- Signal 列表从双列卡片墙改为单列情报行，降低视觉噪音，增强扫读效率。
- 单条 Signal 改为：变化类型 / 标题 / 商业含义 / 机会与趋势连接 / 证据入口。
- 右侧改为深墨绿判断面板，文案从内部说明转为“本组信号”的外部表达。
- CTA 从“查看详情”收敛为“查看信号”。

Signal 详情页改动：
- 主内容收进一张克制的报告纸面，不再散落在页面底色上。
- 详情侧栏限制展示数量：Opportunity 前 5 个、Trend 前 3 条，避免侧栏压过正文。
- 侧栏关联卡改为紧凑列表，减少边框、阴影、重复卡片感。
- 评分、机会拆解、事实 / 含义继续保留，但排版更像研究报告条目。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页和 Signal 详情页桌面 / 移动端无横向溢出；Signals 首页 29 条 Signal 正常展示；详情页 Opportunity 侧栏限制为 5 条。

截图记录：
- `agent-workflow/reports/signals-polished-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-polished-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-detail-polished-desktop-2026-05-03.png`
- `agent-workflow/reports/signal-detail-polished-mobile-2026-05-03.png`

自动化影响：本轮只改前台展示与文案，不改变 Markdown 结构、同步脚本入口、数据字段、质量闸门或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-03 Signals 直达详情与短标题修正

根据用户反馈，继续修正 Signals 首页与 Signal 详情页：

- 移除 Signals 首页右侧“当前选中”预览栏。
- Signal 列表行整体变为详情页入口，左侧可直接点击进入 `signal.html`。
- Signal 行重新整理主次：标题为主，商业含义为辅，赛道、机会、趋势、来源降级为弱标签。
- Signal 详情页 H1 改为短判断标题，优先取冒号后的商业判断，不再把完整事件标题作为超大标题。
- 示例验证：`Legora 估值升至 56 亿美元：法律 AI 从工具试用进入专业服务工作流竞争` 在详情页 H1 中显示为 `法律 AI 进入专业服务工作流竞争`。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：Signals 首页右侧栏 `display: none`，29 条 Signal 行均可点击进入详情；桌面和移动端无横向溢出；详情页测试 H1 长度为 17。

截图记录：
- `agent-workflow/reports/signals-direct-list-desktop-2026-05-03.png`
- `agent-workflow/reports/signals-direct-list-mobile-2026-05-03.png`
- `agent-workflow/reports/signal-detail-short-title-desktop-2026-05-03.png`

自动化影响：本轮只改前台展示和标题派生逻辑，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页新闻源展示修正

根据用户反馈，修正 Signal 详情页顶部主内容语义：

- 顶部主块改为展示新闻详情源 / 事件事实，而不是观澜判断。
- 新增 `signalNewsDetail()` 展示派生逻辑，优先取 `summary` 中 `补充:` 之前的原始事实段。
- 展示层会截断 `它的商业含义`、`其核心价值`、`核心商业意义`、`商业意义在于`、`这说明`、`这意味着` 之后的判断句，避免新闻源位置混入分析判断。
- 商业判断仍保留在后续“为什么这是 Signal / 商业含义”模块。

验证结果：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器检查通过：测试页顶部新闻源段不再包含“商业含义”，无横向溢出。

截图记录：
- `agent-workflow/reports/signal-detail-news-source-top-2026-05-03.png`

自动化影响：本轮只改前台展示派生逻辑，不改变 Markdown、同步脚本入口、数据字段或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signal 详情页原始新闻内容扩展

根据用户反馈“详情页引用更多的原始新闻内容”，已扩展详情页新闻源展示。

完成事项：
- `signalNewsDetail()` 现在会合并 `summary` 中多个事实块，仍会剔除“商业含义 / 这意味着”等判断句。
- 顶部新闻源块新增来源、发布时间、事件类型 meta。
- 扩充 `01-Signals/2026-05-03-AI商业雷达.md` 中 Legora 的原始新闻事实，补充融资轮次、ARR、估值、客户、市场覆盖、Harvey 对比和区域扩张信息。
- 重新运行 `sync-data.mjs`，网站数据已同步。

验证结果：
- Legora 详情页顶部新闻源事实段从短句扩展为 309 字，且不包含“商业含义”。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过：禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

截图记录：
- `agent-workflow/reports/signal-detail-expanded-news-source-2026-05-04.png`

自动化影响：本轮调整了单条历史 Signal 的新闻内容简介，并同步网站数据；不改变 Markdown 模板、字段名、同步脚本入口、质量闸门或自动化顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 Signals 栏目标题一致性与关系清理

本轮处理两类用户反馈：Signals 栏目标题与其他栏目不一致；Signal 指向 Opportunity 存在多关联和语义错配。

UI / UE 完成事项：
- Signals 栏目标题区已与 Daily / Opportunities / Trends 对齐。
- 桌面端实测四个栏目 `.page-title` 坐标、高度、h1 字号、行高一致。
- Signals 标题背景保持透明，不再使用额外色块。

Intelligence Data Agent 完成事项：
- 定位到 `sync-data.mjs` 中 Signal -> Opportunity 的弱标签关联过宽。
- 清理前：29 条 Signals 每条都关联 8 个 Opportunity，总关系数 232。
- 清理后：29 条 Signals 每条只关联 1 个主 Opportunity，总关系数 29。
- 修正 ARI / Meta 具身智能并购 Signal 被错误匹配到“专业服务AI工作流平台”的问题。
- Signal -> Opportunity 改为优先使用 Priority Engine 直接命中的主机会；无评分项时才使用源 Markdown 显式机会。
- Opportunity -> Signal 反向关系改为只来自评分项或显式关系，不再靠弱标签补齐。

报告：
- `agent-workflow/reports/signal-opportunity-relation-cleanup-2026-05-04.md`

验证结果：
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- 浏览器测量通过：Signals / Daily / Opportunities / Trends 标题位置与字号一致，无横向溢出。

截图记录：
- `agent-workflow/reports/signals-title-consistency-2026-05-04.png`

自动化影响：
- 标题样式调整不影响自动化。
- 关系清理修改了 `sync-data.mjs` 的关系生成规则，会影响 `ai-3` 统一同步后的关系结果。
- 已复核并更新自动化：`ai-the-point` 不受影响，保持不变；`ai-2` 已补充“每条 Signal 只写一个主 Opportunity”的内容生成规则；`ai-3` 已补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。
- `ai-3` 后续会得到更严格的 Signal / Opportunity 关系。Opportunity -> Signal 覆盖率从虚高状态降为 22/27，是更真实的软提醒状态。

追加确认：
- 已修正 `04-Site/js/app.js` 展示层的 `signalOpportunityLinks()`：当 Signal 存在规范 `relatedOpportunityIds` 时，栏目页和详情页只按该主机会 ID 计数；旧机会名称、反向关系和赛道关系不再把数量扩成 10/19/27。
- 已修正 `loadState()`：浏览器本地缓存中的旧 Signal-Opportunity 关系不得覆盖最新同步数据，避免用户页面继续显示旧数量。
- 页面实测通过：Signals 栏目页 29 张 Signal 卡片均显示 `1 个机会`；Signal 详情页“指向机会”为 `1 个`，侧栏机会卡为 1 张。
- 额外模拟本地缓存仍保存旧多机会关系的情况，页面仍显示 1 个机会。

## 2026-05-04 当前窗口收口与长期规范更新

用户准备结束当前窗口，本轮已完成 Workflow / Automation Agent 收口。

新增收口报告：
- `agent-workflow/reports/current-run-closeout-2026-05-04.md`

长期规范更新：
- `AGENTS.md`：新增 UI 标题一致性、成品感、公开文案克制和禁用内部话术的启动红线。
- `agent-workflow/agents/ui-ue-agent.md`：新增栏目标题一致性、标题背景、成品感、粗糙/简陋反馈处理规则。
- `agent-workflow/product/DESIGN.md`：新增栏目标题规范、成品感与精致度、Signals 栏目页主 Opportunity 口径。
- `agent-workflow/agents/copy-agent.md`：新增公开前台不得使用内部话术、不以说服为目标、Signals 用词推荐与禁用规则。
- `agent-workflow/product/COPY.md`：新增“不用内部话术，不以说服为目标”与 Signals 前台克制用词规范。

自动化复核：
- `ai-the-point` 不受影响，保持不变。
- `ai-2` 已更新：每日内容生成必须让每条 Signal 默认只写 1 个主 Opportunity。
- `ai-3` 已更新：统一同步闸门必须检查 Signal -> Opportunity 主机会口径，以及前台“指向机会”数量不得被旧缓存或宽关系放大。
- 旧 `ai` 自动化仍处于 `PAUSED`，未纳入当前三任务链路。

最新验证：
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过，46 unique tags，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查全部 passed。

## 2026-05-04 Handoff 文件 UTF-8 编码规则

根据用户要求，后续所有 handoff / 交接类 Markdown 文件统一保存为 UTF-8，避免新窗口或 Windows PowerShell 默认读取时出现中文乱码。

已更新：
- `AGENTS.md`
- `agent-workflow/governance/agent-handoff-template.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/progress.md`

执行规则：
- `docs/agent-handoff.md`、`agent-workflow/progress.md`、`agent-workflow/reports/*handoff*.md`、`agent-workflow/reports/*closeout*.md` 等交接类文件必须保存为 UTF-8。
- Windows PowerShell 读取中文交接文件时，优先显式使用 `-Encoding UTF8`。
- 新增或更新交接报告时，Workflow / Automation Agent 负责检查编码规则是否被遵守。

自动化影响：本次只更新交接与治理文档，不改变 Markdown 内容模板字段、同步脚本、质量闸门或自动化运行顺序，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 调度中枢窗口机制建立

根据用户要求，建立“当前窗口用于分配任务和接收收口文件，具体任务单独开窗口执行”的长期机制。

新增文件：
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`

已更新：
- `AGENTS.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

机制说明：
- 当前窗口作为调度中枢，只做任务派发、收口验收和进度回填。
- 每个任务生成独立任务 ID 和派发单，默认写入 `agent-workflow/execution/<TASK-ID>.md`。
- 每个执行窗口结束前必须写 UTF-8 收口文件，默认写入 `agent-workflow/reports/<TASK-ID>-closeout.md`。
- 用户可用 `派发：<任务描述>`、`收口：<closeout 文件路径>`、`状态`、`下一批`、`阻塞：<task-id> <原因>` 快速操作。
- 调度中枢收到收口文件后，检查派发单一致性、改动范围、Quality Gates、自动化影响和进度回填，再标记 accepted。

自动化影响：本次只更新工作流治理、派发模板、收口模板和任务看板，不改变 `ai-the-point`、`ai-2`、`ai-3` 的提示词、运行顺序或同步脚本。

## 2026-05-04 调度中枢升级为任务看板驱动

根据用户要求，调度中枢窗口已从“每次临时派发任务”升级为“任务看板驱动”。

已升级：
- `agent-workflow/governance/window-dispatch-hub.md`：新增 `ready` 状态、`执行：<看板编号>`、`看板`、`加入看板：...` 等口令。
- `agent-workflow/execution/dispatch-board.md`：改为固定看板编号 + Task ID + 状态 + 派发单 + 收口文件。
- `AGENTS.md`：补充看板驱动快捷口令。
- `agent-workflow/governance/agent-memory.md`：写入长期记忆。

已预生成首批任务派发单：
- `P0-1` / `WSD-20260504-01-copy-audit`：全站前台 Copy 语气审计。
- `P0-2` / `WSD-20260504-02-ui-screenshot-matrix`：Signals / Daily / Opportunities / Trends UI 截图矩阵验收。
- `P0-3` / `WSD-20260504-03-admin-boundary-qa`：普通前台与 Admin 边界复查。
- `P1-1` / `WSD-20260504-04-daily-brief-detail-productization`：Daily Brief 详情页产品化收口。
- `P1-2` / `WSD-20260504-05-automation-first-run-log-review`：自动化首跑与日志复查。

新使用方式：
- 用户说 `执行：P0-1`，调度中枢直接读取该任务派发单并输出独立窗口提示词。
- 用户说 `收口：agent-workflow/reports/<TASK-ID>-closeout.md`，调度中枢读取收口文件并验收。
- 用户说 `看板` 或 `状态`，调度中枢展示当前任务状态。

验证：
- `feature_list.json` 可正常解析。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

自动化影响：本次只更新任务看板、派发单和治理文档，不改变 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 看板任务池补充与综合排序

根据用户补充，调度中枢已将 6 个新任务加入任务池，并与已有任务综合排序。

新增任务：
- `P0-1` / `WSD-20260504-07-the-point-home-redesign-plan`：The Point 首页改版方向制定，Strategy Agent 与 PM Agent 先定方向，后续 Copy / UI 执行。
- `P0-2` / `WSD-20260504-09-homepage-hero-optimization-plan`：首页优化，重点解决首屏海报图和第一屏价值表达。
- `P0-3` / `WSD-20260504-08-admin-console-requirements`：Admin 管理功能模块设计和页面设计，由 PM Agent 输出开发需求并推进执行。
- `P0-4` / `WSD-20260504-11-launch-readiness-plan`：上线前准备，覆盖服务器、数据库、版本、备份、回滚、权限和部署方案。
- `P1-1` / `WSD-20260504-10-mobile-design-system`：移动端设计独立任务，建立全站移动端规则和关键页面验收。
- `P1-2` / `WSD-20260504-12-ai-assistant-product-plan`：观澜AI 助理产品规划，网页端或手机端与客户对话交流。

综合排序原则：
- 先处理直接影响前台价值感和用户第一印象的任务：The Point 首页、首页首屏。
- 再处理影响运营效率和上线条件的任务：Admin 后台、上线准备。
- 再处理跨端体验和新产品能力：移动端设计、AI 助理。
- 已有 Copy 审计、UI 截图矩阵、Admin 边界 QA 等任务保留，但顺序后移到对应战略/PM方向之后执行。

自动化影响：本次只新增任务卡和派发单，不改变自动化任务、同步脚本或 Markdown 数据字段。

## 2026-05-04 长期 Agent GitHub 能力学习收口

调度中枢已验收能力训练窗口提交的计划外收口：

- `agent-workflow/reports/WSD-agent-github-capability-learning-closeout-2026-05-04.md`

本轮确认：
- 已安装并学习 `taste-skill`，安装路径为 `C:\Users\86186\.codex\skills\taste-skill`。
- 已抽查并学习 `openai/skills`、`phuryn/pm-skills`、`VoltAgent/awesome-design-md`、`Leonxlnx/taste-skill`、`Tencent/AI-Infra-Guard`。
- 八个长期 Agent 岗位文件已补充外部 GitHub 能力学习方式和适配边界。
- `agent-workflow/governance/agent-memory.md` 已写入“GitHub 外部能力学习”长期规则。
- 已新增学习报告：`agent-workflow/reports/agent-github-capability-learning-2026-05-04.md`。
- 调度看板已补登记为 `SYS-2` / `WSD-agent-github-capability-learning`，状态为 `accepted`。

机制补强：
- `agent-workflow/execution/TASK-window-dispatch-template.md` 已补充外部 GitHub skill / repo 安全审查要求。
- `agent-workflow/governance/window-dispatch-hub.md` 已补充收口验收时对外部 GitHub skill / repo 的检查项。

验证：
- 收口窗口已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。
- 调度中枢已校验 `agent-workflow/feature_list.json` 可正常解析。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-094538.md`。

自动化影响：本次只影响长期 Agent 能力说明、治理记忆、报告、调度看板和派发模板，不改变 `ai-the-point`、`ai-2`、`ai-3` 的提示词、时间线、Markdown 字段、同步脚本或质量闸门。

## 2026-05-04 首页首屏轮播图派生工作树任务

根据用户要求，调度中枢已新增并派发首页首屏执行型任务：

- 看板编号：`P0-2A`
- Task ID：`WSD-20260504-13-homepage-hero-carousel-assets`
- 派发单：`agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

Agent 安排：
- UI / UE Agent 牵头，负责三张轮播图视觉方向、首屏层级和桌面/移动端验收点。
- Copy Agent 协作，负责首屏叠加文案，避免空泛营销语和内部话术。
- Dev Agent 协作，在派生工作树中新增图片资产并替换首页首屏轮播。
- QA Agent 协作，负责桌面端、移动端、无横向溢出和轮播可用性验收。
- PM Agent 控制边界，确保本任务不扩散为整站首页重构。

执行边界：
- 允许改动 `04-Site/index.html`、`04-Site/css/styles.css`、`04-Site/js/app.js`、`04-Site/assets/hero/`。
- 不改内容源 Markdown、网站数据、同步脚本、关系检查脚本、统一同步脚本或自动化任务。

自动化影响：预计不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 本地环境与派生工作树修复

用户反馈派生工作树任务初始化失败，提示本地环境不可用。经核查，项目根目录 `01-WaveSight` 不是 git 仓库，缺少 `.git`，因此无法创建派生工作树。

已修复：
- 初始化 git 仓库，默认分支为 `main`。
- 新增 `.gitignore`，排除依赖、缓存、备份和大型截图类验收文件。
- 新增 `.gitattributes`，固定文本换行策略并标记图片等二进制文件。
- 设置本仓库 `core.autocrlf=false`，降低 Windows 环境下 Markdown 文档换行被反复转换的风险。
- 创建初始提交：`5428909 chore: initialize WaveSight repository baseline`。

验证：
- 已创建临时派生工作树并读取 git 状态，随后移除临时 worktree 和测试分支。
- 冒烟测试结果：`WORKTREE_SMOKE_OK`。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。

报告：
- `agent-workflow/reports/local-environment-worktree-fix-2026-05-04.md`

自动化影响：本次只修复本地版本管理与派生工作树能力，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 GitHub 仓库基线同步

用户已安装 GitHub 插件，并创建 `radar` 相关仓库。调度中枢确认可访问 GitHub 仓库：

- `jerryfang2023-stack/AI-Radar`
- `https://github.com/jerryfang2023-stack/AI-Radar`

已完成：
- 本地仓库已绑定远端 `origin`。
- 起初发现远端 `main` 已有测试提交，因此先将当前观澜AI完整项目基线推送到分支：`wavesight-baseline-20260504`。
- 用户确认远端测试 / 命名规则文件没有价值，可以删除。
- 已使用 `--force-with-lease` 将观澜AI正式基线推送为远端 `main`。
- 当前远端 `main` 提交：`504a155 chore: document GitHub baseline sync`。

同步范围：
- `04-Site/` 网站代码、页面、样式、脚本、静态资产和当前数据文件。
- `agent-workflow/` 长期 Agent 工作流、治理、派发单、PRD、产品规范、脚本和报告。
- `docs/agent-handoff.md`。
- 当前内容源目录：`01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/`。
- `AGENTS.md`、`.gitignore`、`.gitattributes`、`提示词/`、`测试期文档/`。

已排除：
- 依赖、缓存、备份、大型截图验收文件和本地环境变量。

报告：
- `agent-workflow/reports/github-baseline-sync-2026-05-04.md`

自动化影响：本次只同步版本管理仓库和必要文件，不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 The Point 首页改版规划收口与落地派发

调度中枢已验收并接受 `P0-1 / WSD-20260504-07-the-point-home-redesign-plan` 收口：

- 收口文件：`agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`
- 规划报告：`agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`

验收结论：
- Strategy / PM 规划完整，未修改页面、内容源、数据模型、同步脚本或自动化任务。
- 已明确 The Point 首页不做观点列表、人物墙或来源聚合，而是“一线观点如何帮助商业判断”的解释层。
- 固定 H1 为：`从一线观点中，看见 AI 共识、分歧与边界。`
- 今日一线观点区是页面核心，必须突出 builders / 机构、来源类型和原文出处链接，观澜解读作为第二层增值。
- 规划任务已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 并通过。

后续已派发：
- 看板编号：`P0-1A`
- Task ID：`WSD-20260504-14-the-point-home-redesign-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

执行要求：
- 一个执行窗口连续完成 Copy、UI / UE、Dev、QA。
- 不要中途回调度窗口；全部页面修改、检查和截图完成后，再提交 closeout。
- 允许改动 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css`。
- 禁止改动 `05-point/`、内容源、网站数据、同步脚本和自动化任务。

自动化影响：规划收口与后续派发本身不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 2026-05-04 每日 Signal 关键词与来源优化派发

根据用户要求，调度中枢已派发 Intelligence Data Agent 任务，用于优化每日 AI 商业雷达的监测关键词和来源策略。

任务：
- 看板编号：`P0-7`
- Task ID：`WSD-20260504-15-signal-keyword-source-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

牵头 Agent：
- Intelligence Data Agent

协作 Agent：
- Workflow / Automation Agent
- PM Agent

任务目标：
- 修正每日 Signal 过度偏向大企业、大融资和高曝光新闻的风险。
- 补齐新趋势、新投资方向、小额起步融资、技术更新迭代、开源 / 开发者生态、垂直行业早期采用和反证信号。
- 更新 `提示词/关键词列表.md`、`提示词/监测提示词V4.0.md` 和 `agent-workflow/product/source-intelligence.md`。

自动化影响：
- 本任务可能影响 `ai-2` 每日商业雷达生成口径。
- 默认不影响 `ai-the-point`。
- 默认不影响 `ai-3`，除非后续改同步闸门或检查规则。

## 2026-05-04 The Point 首页改版落地验收

调度中枢已验收并接受 `P0-1A / WSD-20260504-14-the-point-home-redesign-implementation` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

完成事项：
- `04-Site/the-point.html` 已从旧日期归档列表升级为 The Point 首页判断入口。
- H1 固定为 `从一线观点中，看见 AI 共识、分歧与边界。`
- 页面结构调整为栏目标题、主观点、共识 / 分歧 / 早期信号、今日一线观点、往期观点和主题侧栏。
- 今日观点展示 10 条少而精内容，单条观点只保留 `查看观点` 一个动作。
- `正在升温的主题` 已改为可点击主题集合。
- `往期观点` 可进入历史日期集合页。
- The Point 首页底部 `相关判断` 已删除，避免不明指向关联内容压过首页主线。
- 已修复每日集合页超过 10 条时序号重置问题。
- 已撤销 The Point 对一级栏目标题区的单独 CSS 覆盖，标题位置、字号、行高回到全站栏目统一规范。

调度中枢复核：
- 改动范围符合派发单，集中在 `04-Site/the-point.html`、`04-Site/js/app.js`、`04-Site/css/styles.css` 和报告截图。
- 截图文件存在：
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-desktop.png`
  - `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-mobile.png`
- `04-Site/the-point.html` 未命中 `Admin`、`JSON`、`同步`、`编辑`、`恢复`、`字段`、`后台`、`证据链`、`强证据`、`机会确定`、`下一步验证` 等前台禁用话术。
- 调度中枢已运行 `node --check 04-Site/js/app.js` 通过。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-112652.md`。

未运行检查：
- 调度中枢未重新运行浏览器截图和多身份验收；执行窗口 closeout 已记录其完成桌面端、移动端、链接抽查和四种访问状态轻量验收。残余风险低。
- 调度中枢未运行 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`，因为本任务禁止且未修改内容源、网站数据、同步脚本和关系检查口径。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只改 The Point 首页展示层，不改 `05-point/` 内容源、Markdown 字段、网站数据、同步脚本或自动化任务。

## 2026-05-04 Admin 后台需求规划收口

调度中枢已验收并接受 `P0-3 / WSD-20260504-08-admin-console-requirements` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md`

需求产出：
- `agent-workflow/prd/active/PRD-007-admin-console.md`
- `agent-workflow/reports/admin-console-requirements-2026-05-04.md`

验收结论：
- 本任务为 PM 需求规划任务，未修改 `04-Site/admin.html`、普通前台、权限代码或自动化代码。
- 已明确 Admin 从本地控制台原型升级为后台专属工作台。
- 已补齐模块清单：今日工作台、内容管理、用户与权限、订阅与订单、质量检查、发布准备、系统设置。
- 已明确 P0 保持单页 `admin.html`，P1 再考虑拆多页后台。
- 已将 `feature_list.json` 中 `GL-M3-005` 更新为 `in_progress`。

后续已加入看板：
- 看板编号：`P0-3A`
- Task ID：`WSD-20260504-16-admin-console-p0-workbench-implementation`
- 派发单：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是需求规划未改变 Markdown 命名、目录、frontmatter、数据字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 首页首屏与海报图规划收口

调度中枢已验收并接受 `P0-2 / WSD-20260504-09-homepage-hero-optimization-plan` 收口。

收口文件：
- `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

规划报告：
- `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`

验收结论：
- 首页首屏不应继续以抽象雷达流程图作为主要记忆点。
- 首屏主方向确认为“情报桌面 + 真实判断样张”，突出观澜AI作为 AI 商业机会判断系统的价值。
- 推荐 H1 为：`在市场形成共识前，看见 AI 商业变化`。
- 推荐副标题为：`每天从融资、客户采用、产品落地和产业变化中筛出关键信号，形成可追踪的机会观察与趋势判断。`
- 推荐 CTA 为：`查看今日简报` / `申请进入完整情报层`。
- 用户已认可本轮生成的展示图风格，后续落地应保留象牙白底、深石墨文字、深墨绿重点面板和少量铜棕强调。
- 展示图仅作为风格参考，不是最终站点资产：`C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png`

调度中枢回填：
- `dispatch-board.md` 已将 P0-2 更新为 `accepted`。
- `feature_list.json` 中 `GL-M3-002` 继续保持 `in_progress`，等待 P0-2A 首页轮播图实现和截图验收。
- P0-2A 派发单和执行窗口提示词已补充 P0-2 验收结论与展示图参考路径。
- 调度中枢已复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-114355.md`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只做首页方向规划和派发单回填，未修改内容源、Markdown 字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 首页首屏轮播图任务作废收口

调度中枢已将 `P0-2A / WSD-20260504-13-homepage-hero-carousel-assets` 标记为 `void / abandoned`。

收口文件：
- `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

作废原因：
- 当前首页首屏轮播方向未被采用，需要重新派发新的首页首屏 P0 方向任务。
- 本任务提前终止，没有交付物。
- 不再继续设计、生成图片、改页面或优化代码。
- 不合并、不推送、不把本任务成果带回主工作树。
- 派生工作树不删除，保留现场供后续参考。

已尝试或曾被派发探索的方向：
- 抽象图：雷达、信号节点、关系网络。
- 现实商业图：商业情报桌面、董事会桌面、产业地图。
- 情报样张：Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系样张。

调度结论：
- 当前成果不可合并。
- 若派生工作树中已有图片、截图或代码修改，只作为现场参考，不进入主工作树。
- 后续需要重新派发首页首屏 P0 方向任务，不沿用本轮“三张轮播图替换首屏”的实现假设。
- 调度中枢已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-115314.md`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务提前终止，未改变内容源、Markdown 字段、同步脚本、检查脚本或自动化入站顺序。

## 2026-05-04 Netlify 预览部署任务加入看板

根据用户要求，调度中枢已新增 Netlify 预览部署任务。

任务：
- 看板编号：`P0-4A`
- Task ID：`WSD-20260504-17-netlify-preview-deploy`
- 派发单：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

牵头 Agent：
- Dev Agent

协作 Agent：
- PM Agent
- QA / Acceptance Agent
- Workflow / Automation Agent

任务目标：
- 将当前项目网站部署到 Netlify 预览环境。
- 返回一个可外部访问的 Netlify Preview URL。
- 本任务只做预览部署，不做正式域名、生产发布、数据库迁移或自动化上线。

自动化影响：
- 本任务可能影响上线准备路径。
- 默认不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 如果执行过程中需要改变 Markdown 命名、内容字段、同步脚本或自动化入站顺序，必须停止并回调度中枢确认。

调度中枢检查：
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-120012.md`。

## 2026-05-04 Priority Engine 2.0 模型收口与快速落地合并派发

调度中枢已验收 `priority-engine-2-2026-05-04`，Priority Engine 2.0 第一版模型形成。

完成产物：
- `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/reports/priority-engine-2-2026-05-04.md`

核心结论：
- Priority Engine 2.0 是后台判断引擎，不新增前台栏目。
- 核心对象为 `Judgment Node = 赛道 + 能力 + 客户场景 + 证据阶段`。
- 评分从每日公司 / 新闻评分升级为可追踪、可复盘、可校准的判断节点。
- The Point 不作为事实证据直接加权，只作为观点共识、分歧和边界信号。
- 对外状态为：优先验证、持续观察、早期观察、谨慎观察、暂缓关注。

用户要求：
- 原计划拆分的 PM 确认、ai-2 提示词升级、Dev 解析实现、QA 验收四个任务合并为一个任务。
- 优先级提高。
- 尽快开发上线。

调度更新：
- `WSD-20260504-18-priority-engine-2-pm-boundary` 已标记为 merged。
- `WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade` 已标记为 merged。
- `WSD-20260504-20-judgment-node-dev-plan` 已标记为 merged。
- `WSD-20260504-21-priority-engine-2-qa-criteria` 已标记为 merged。
- 新增合并任务：`P0-8A / WSD-20260504-22-priority-engine-2-fast-track-implementation`。
- 看板建议顺序已将 `执行：P0-8A` 提升为第一位。

自动化影响：
- `ai-2`：有影响，合并任务必须更新每日机会评分提示词并保留旧 30 分表兼容。
- `ai-the-point`：本轮不强制改，但 closeout 必须说明后续轻量增强项。
- `ai-3`：短期不改闸门；若 Judgment Node 字段进入同步结果，closeout 必须说明后续检查口径。

调度中枢检查：
- `feature_list.json` 已通过 JSON 解析。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-120819.md`。

## 2026-05-04 Netlify 预览部署验收

调度中枢已验收 `P0-4A / WSD-20260504-17-netlify-preview-deploy`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

可访问链接：
- 不可变部署链接：`https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app`
- 站点默认链接：`https://wavesight-ai-preview.netlify.app`
- Netlify 项目后台：`https://app.netlify.com/projects/wavesight-ai-preview`

部署信息：
- Netlify 站点名称：`wavesight-ai-preview`
- Site ID：`7ab8a5d2-477b-439d-ad4b-57f449ebad9e`
- Deploy ID：`69f88cb84d559e9a6e9354bd`
- 发布目录：`04-Site/`
- 新增 `netlify.toml`，仅固定 `[build] publish = "04-Site"`。

调度中枢复核：
- 外部 HTTP 抽查 `/`、`/daily.html`、`/signals.html`、`/the-point.html`、`/opportunities.html`、`/trends.html`、`/css/styles.css`、`/js/app.js`、`/data/radar-data.js` 均返回 200。
- `netlify.toml` 未包含 token、账号、域名、数据库或敏感配置。
- `feature_list.json` 中 `GL-M4-001` 已更新为 `in_progress`，表示云端部署准备已完成预览部署阶段，但正式上线仍需发布清单、权限边界、备份和回滚方案。

遗留风险：
- Netlify closeout 发现 `/signals.html` 源码中仍有历史遗留隐藏 `editorDialog` 编辑弹窗。
- 该问题不是本次部署引入，不阻塞预览部署验收。
- 调度中枢已将该风险回挂到 `P0-6 / WSD-20260504-03-admin-boundary-qa`。

自动化影响：
- 不影响 `ai-the-point`、`ai-2`、`ai-3`。
- 原因是本任务只新增 Netlify 预览部署配置和收口文件，未改内容源、数据字段、同步脚本、检查脚本或自动化入站顺序。

调度中枢检查：
- `feature_list.json` 已通过 JSON 解析。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-121824.md`。

## 2026-05-04 Priority Engine 2.0 快速落地验收

调度中枢已验收 `P0-8A / WSD-20260504-22-priority-engine-2-fast-track-implementation`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`

完成事项：
- PM 边界确认：Priority Engine 2.0 保持后台判断能力，不新增普通前台栏目。
- `ai-2` 提示词已升级：保留旧 30 分表，新增 Priority Engine 2.0 Judgment Node 拆解段。
- Dev 已实现第一版 Judgment Node 入站能力：`sync-data.mjs` 输出 `judgmentNodes` 与 `priorityEngine` 摘要。
- 关系检查已扩展：覆盖 `Priority -> Judgment Node` 和 `Judgment Node -> Priority / Signal / Trend / Opportunity`。
- QA 已抽查 5 条 Priority / Opportunity / Trend 样本，确认 The Point 未作为事实证据直接加权。

当前数据：
- Signals：33
- Priority Rows：39
- Judgment Nodes：22
- Trends：13
- Points：34
- Point Sources：5
- Opportunities：27
- Priority -> Judgment Node：39/39
- Judgment Node -> Priority / Signal / Trend / Opportunity：22/22

调度中枢复核：
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-relations.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123257.md`。
- `feature_list.json` 中 `GL-M2-006` 已更新为 `verify`。
- 调度中枢最终复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123443.md`。

非阻塞遗留：
- Netlify 未重新部署本轮 Priority Engine 2.0 数据；执行窗口已说明远端部署遇到授权 / 绑定问题，不冒充上线。
- 浏览器截图验收未运行；本轮主要验收数据解析、提示词和关系检查。
- 旧 `04-Site/scoring.html` 中存在否定式文案 `不是投资建议`，属于历史前台表达边界项，后续 Copy / Admin 边界 QA 可处理。

自动化影响：
- `ai-2`：已影响，提示词已升级。后续每日评分应继续输出旧 30 分表，并新增 Priority Engine 2.0 拆解段。
- `ai-the-point`：本轮未改。后续可轻量补充观点立场、支持 / 质疑 / 修正的 Judgment Node、可验证边界和反证观察。
- `ai-3`：本轮未改统一同步闸门。因 `judgmentNodes` 已进入网站数据，后续应补充 Priority Row -> Judgment Node 的同步闸门摘要。

## 2026-05-04 ai-3 Judgment Node 同步闸门派发

根据用户要求，调度中枢已新增 P0 任务，升级 `ai-3` 统一网站同步闸门，加入 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查。

任务：
- 看板编号：`P0-8B`
- Task ID：`WSD-20260504-23-ai-3-judgment-node-sync-gate`
- 派发单：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

牵头 Agent：
- Workflow / Automation Agent
- Dev Agent

协作 Agent：
- Intelligence Data Agent
- QA / Acceptance Agent
- PM Agent

任务目标：
- 在 `ai-3` 统一同步闸门中补充 Priority Engine 2.0 Judgment Node 覆盖率检查。
- Priority Row 无 Judgment Node、Judgment Node 无 Priority、覆盖率摘要缺失或不一致、Judgment Node 断链等情况应成为硬错误，阻止入站并恢复备份。
- 更新 `ai-3` 运行说明或实际自动化提示词；如果无法直接更新实际自动化配置，必须写清阻塞和替代执行文档。

自动化影响：
- 本任务可能影响自动化任务。
- `ai-the-point`：默认不影响。
- `ai-2`：间接影响，后续每日评分必须继续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门口径将升级。

调度中枢检查：
- 已生成派发单、窗口提示词并更新 `dispatch-board.md`。
- 已运行 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125015.md`。

## 2026-05-04 ai-3 Judgment Node 同步闸门执行验收

用户要求将 `P0-8B / WSD-20260504-23-ai-3-judgment-node-sync-gate` 进入执行，本轮已完成。

完成事项：
- `agent-workflow/tools/unified-site-sync.mjs` 已新增 Priority Engine 2.0 Judgment Node 硬闸门。
- `ai-3` 真实自动化本体提示词已更新，新增 Judgment Node 覆盖率、硬错误代码和成功汇总要求。
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md` 已同步更新 `ai-3` 运行说明。
- `dispatch-board.md` 已将 `P0-8B` 标记为 `accepted`。
- 收口文件：`agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`

硬闸门规则：
- Priority Row -> Judgment Node 覆盖率必须为 100%。
- 每个 Judgment Node 必须至少关联一个 Priority Row。
- Judgment Node 关联的 Priority / Signal / Trend / Opportunity / Point 不得断链。
- `priorityEngine` 摘要必须与实际数据一致。
- The Point 只能作为观点共识、分歧或边界信号，不能作为事实证据直接加权。

验证：
- `node --check agent-workflow/tools/unified-site-sync.mjs` 通过。
- `node --check agent-workflow/tools/run-quality-gates.mjs` 通过。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-relations.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12。
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-125900.md`。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04` 通过，报告为 `agent-workflow/reports/quality-gates-automation-2026-05-04-20260504-130129.md`。
- `feature_list.json` 中 `GL-M2-006` 已确认回到 `verify`。

真实 `ai-3` 闸门结果：
- 状态：`synced`
- 阻塞项：0
- Priority Rows：39
- Judgment Nodes：22
- Priority Row -> Judgment Node 覆盖率：39/39
- 备份目录：`agent-workflow/backups/unified-site-sync/20260504-125611`
- 报告：`agent-workflow/reports/unified-site-sync-2026-05-04.md`

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：间接影响，后续每日评分必须持续输出 Judgment Node 或可解析候选。
- `ai-3`：直接影响，统一同步闸门已升级并验证通过。

## 2026-05-04 Signal 关键词与来源优化验收

调度中枢已验收 `P0-7 / WSD-20260504-15-signal-keyword-source-optimization`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`

完成产物：
- `提示词/关键词列表.md`：升级为 V4.2。
- `提示词/监测提示词V4.0.md`：升级为 V4.2。
- `agent-workflow/product/source-intelligence.md`：补充早期来源、开发者来源、投资来源、垂直行业来源和反证来源分层。
- `agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`。

核心变化：
- 每日监测从“大企业 / 大融资 / 高曝光新闻优先”调整为六类候选池：成熟信号、早期融资 / 新投资方向、技术迭代、开源 / 开发者生态、垂直行业早期采用、反证与降温。
- 新增候选配额，避免成熟大融资和大公司新闻挤占全部每日 Signal 名额。
- 每条 Signal 后续应记录 `触发查询` 和 `监测维度`。
- C 级线索必须回找 S/A/B 来源，不直接支撑高分 Signal。

调度中枢复核：
- 改动范围符合派发单，未修改 `04-Site/`、历史正式内容源、同步脚本、关系检查脚本或自动化配置对象。
- `feature_list.json` 中 `GL-M2-004` 已更新为 `in_progress`，因为关键词策略已优化，但关键词质量检查脚本 / 周期复盘仍待继续完善。
- 2026-05-04 21:08 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-130820.md`。

下一次每日雷达观察指标：
- 3-6 条正式 Signal 中是否至少有 1 条早期融资 / 新投资方向。
- 是否覆盖技术迭代、开源 / 开发者生态、垂直早期采用或反证候选。
- 大企业 / 大融资新闻是否控制在 1-2 条。
- 每条 Signal 是否记录 `触发查询`、`监测维度`、1 个主 Opportunity 和 6 点机会拆解。

自动化影响：
- `ai-2`：有影响，下一次每日商业雷达将受到新版关键词、候选配额和来源采信口径影响。
- `ai-the-point`：不影响。
- `ai-3`：不影响。

## 2026-05-04 页面类任务派发闸门规则验收

调度中枢已验收计划外治理任务 `SYS-3 / WSD-page-dispatch-gate-rules`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md`

规则报告：
- `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`

完成产物：
- `agent-workflow/governance/window-dispatch-hub.md`：新增页面类任务派发硬规则。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：新增 `7A 页面类任务硬性要求`。
- `agent-workflow/reports/TASK-window-closeout-template.md`：新增 `4A 页面类任务验收`。
- `agent-workflow/governance/agent-memory.md`：写入页面类任务派发闸门失效的长期记忆和新硬规则。

核心规则：
- 凡涉及首页、栏目页、详情页、会员页、Admin、移动端、`04-Site/*.html` 或 `04-Site/css/styles.css` 页面体验改动，一律视为页面类任务。
- 页面类任务必须经过 `PM 范围确认 -> UI/UE 页面规范表 -> Dev 按表实现 -> QA 独立截图/测量验收 -> Workflow 收口`。
- 缺少 UI/UE 页面规范表、Dev 逐条实现说明、QA 桌面 / 移动端截图或坐标 / 字号 / 间距 / 首屏节奏验收时，调度中枢不得标记 `accepted`。

调度中枢回填：
- `dispatch-board.md` 已新增 `SYS-3 / WSD-page-dispatch-gate-rules`，状态为 `accepted`。
- `page-dispatch-gate-rules-2026-05-04.md` 与 closeout frontmatter 已更新为 `accepted`。
- 2026-05-04 21:26 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-132602.md`。

后续影响：
- 重新派发首页首屏 P0 时，必须先产出 UI/UE 页面规范表。
- `P0-3A` Admin 工作台 closeout 需要按新页面类闸门验收；若缺少规范表、逐条实现说明或截图/测量验收，不得 accepted。
- 后续栏目标题矩阵、移动端设计和页面返修任务均必须套用新模板。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 Admin P0 工作台落地验收

调度中枢已验收 `P0-3A / WSD-20260504-16-admin-console-p0-workbench-implementation`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

完成事项：
- `admin.html` 已从本地控制台原型升级为后台专属单页工作台。
- 已覆盖运营仪表盘、内容管理、用户与权限、订阅与订单、邀请码、质量检查和系统设置。
- 内容管理从纯 JSON 默认编辑升级为新闻 CMS 式列表筛选、频道切换和独立稿件编辑页；JSON 降为高级模式。
- 用户与权限、订阅与订单、质量检查、系统设置均作为独立视图呈现。
- 新增邀请码模块，支持生成、筛选、复制、暂停 / 启用、删除、申请审批和通过后生成单次邀请码。
- 新增本地访问统计，用于 Admin 运营仪表盘展示 PV / UV 和栏目热度。

调度中枢复核：
- closeout 提供 Admin 桌面 / 移动端、多模块间距、内容管理、邀请码、控件对齐等截图，截图文件均存在。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 调度中枢复跑通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-145011.md`。
- `dispatch-board.md` 已将 `P0-3A` 标记为 `accepted`。
- `feature_list.json` 中 `GL-M3-005` 已更新为 `verify`，表示 Admin P0 工作台已落地，仍等待权限边界复查。

范围与风险：
- 本轮范围扩展到邀请码、邀请申请审批、本地访问统计和注册邀请码闭环；调度中枢接受本次扩展。
- 邀请码、邀请申请和访问统计仍为本地浏览器演示数据，不是正式云端系统。
- 四种身份完整权限边界仍需由 `P0-6 / WSD-20260504-03-admin-boundary-qa` 独立覆盖。
- `signals.html` 隐藏编辑弹窗源码风险仍需纳入 P0-6。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 首页 UI / Copy 重设计失败收口

调度中枢已收到 `WSD-20260504-18-homepage-ui-copy-redesign` 收口，并按失败任务处理。

收口文件：
- `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`

结论：
- 状态：`failed / not accepted`。
- 不合并，不作为首页最终方向。
- 用户复核后判定当前结果仍未达到参考 demo 的首页质感要求。
- closeout 中引用的桌面 / 移动端截图未同步到主工作树，调度中枢无法完成截图复核。
- `WSD-20260504-18` 编号曾被 Priority Engine 2.0 PM 边界任务使用，后续不再复用该编号派发首页任务。

调度中枢回填：
- `dispatch-board.md` 已新增 `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign`，状态为 `failed / not accepted`。
- 已新增后续任务 `P0-10 / WSD-20260504-25-site-ui-design-direction`：网站 UI 优化，由 Design Director 先输出全站 Art Direction、页面母版、DESIGN v2 草案和验收基线。
- 已新增后续任务 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`：首页右侧海报图 / Intelligence Desk 样张优化，等待 P0-10 accepted 后执行。
- 2026-05-04 22:48 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144808.md`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 UI / UE Design Director 升级验收

调度中枢已验收计划外长期 Agent 能力升级任务 `SYS-4 / WSD-ui-ue-design-director-upgrade`，状态更新为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-ui-ue-design-director-upgrade-closeout-2026-05-04.md`

完成产物：
- `agent-workflow/agents/ui-ue-agent.md`：原地升级为 `UI / UE Design Director`。
- `agent-workflow/agents/agent-registry.json`：`ui-ue-agent` 名称和 primary outputs 已更新。
- `agent-workflow/governance/agent-memory.md`：写入 Design Director 长期记忆。
- `agent-workflow/execution/ui-ue-design-director-upgrade-2026-05-04.md`：升级计划。
- `agent-workflow/reports/ui-ue-design-director-upgrade-2026-05-04.md`：升级报告。

核心规则：
- 不新增第九个长期 Agent，仍保留八 Agent 架构。
- `ui-ue-agent` 从页面修补角色升级为全站视觉总监。
- 后续全站 UI、首页、栏目体系、Admin、移动端和海报 / 首屏视觉任务，必须先由 Design Director 输出 Art Direction、页面母版、字体 / 间距系统、视觉资产规则和审美阻塞项。
- 对“不高级、粗糙、简陋、模板感、海报不合调性、排版乱、字体随意、栏目不紧凑”等问题，Design Director 拥有阻塞权。

调度中枢复核：
- `agent-registry.json` 与 `feature_list.json` 解析正常。
- 2026-05-04 22:41 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144158.md`。
- `dispatch-board.md` 已新增 `SYS-4 / WSD-ui-ue-design-director-upgrade`，状态为 `accepted`。

后续影响：
- 重新派发首页首屏 P0 时，必须先由 Design Director 输出 Art Direction、页面母版和 UI/UE 页面规范表。
- 全站 UI 重设计任务不得直接进入 Dev；缺少 Design Director 输出和截图验收时不得 accepted。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 登录 / 注册页面优化验收

用户要求在当前调度窗口直接执行 `P0-9 / WSD-20260504-24-login-register-page-optimization`，本轮已完成并标记为 `accepted`。

收口文件：
- `agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

完成事项：
- 登录页升级为“回到今日 AI 商业判断”的账号返回页。
- 注册页升级为“创建账号，开始阅读 AI 商业信号”的账号创建页。
- 注册页明确默认 7 天阅读有效期。
- 注册页新增邀请码输入；没有有效邀请码不能创建新账号。
- 邀请码申请已拆到独立页面 `04-Site/invite-request.html`，用户需填写邮箱、公司 / 机构、身份和申请理由；审核后通过邮箱发放邀请码。
- Admin 邀请码页新增申请记录列表，可复制邮箱、标记已发放或删除记录。
- 登录 / 注册 CTA 分别收敛为 `登录并继续阅读`、`创建账号并开始阅读`。
- 注册页已去掉“补充公司和身份”折叠区；有邀请码时只填写账号、邮箱、邀请码和密码。
- 邀请码申请页旧版内嵌申请框和旧两列申请样式已清理，版式回到登录 / 注册同一套左表单、右说明结构。
- 登录 / 注册后的本地跳转逻辑已调整：有效账号默认进入 `daily.html`，到期账号进入 `account.html`。
- 普通前台已清理 Admin、JSON、同步、编辑、恢复、字段、后台、申请访问、申请试读等表达。

验证：
- `node --check 04-Site/js/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，最新报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-142439.md`。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-143023.md`。
- 已生成登录 / 注册 / 邀请码申请页桌面与移动端截图。
- Playwright / Chrome 验证无横向溢出，注册和登录交互通过。
- Playwright / Chrome 验证：无效邀请码不创建用户；有效邀请码注册成功并消耗一次；未设密码旧账号不能绕过邀请码校验。
- Playwright / Chrome 验证：邀请码申请可写入本地演示数据；Admin `#invites` 可查看申请记录。
- Playwright / Chrome 返修验证：注册页无“补充公司和身份”折叠区；邀请码申请页无旧申请表布局类。

调度中枢复核：
- closeout 包含 UI/UE 页面规范表、Copy 文案规范表、Dev 逐条实现说明、QA 桌面 / 移动截图和文案验收，满足页面 / 文案类硬闸门。
- 原派发单主要允许登录 / 注册页面与相关交互逻辑；执行中扩展到 `invite-request.html` 与 `admin.html` 邀请码申请 / 发放链路。该扩展与邀请码注册闭环相关，调度中枢本轮接受，但后续 Admin 邀请码管理应归入 Admin 或权限边界任务。
- 邀请码与申请记录仍为本地浏览器演示数据，不是云端账号或邮件发放系统。
- 四种身份完整权限验收仍归 `P0-6 / WSD-20260504-03-admin-boundary-qa`。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 2026-05-04 登录 / 注册页面优化任务派发

根据用户要求，调度中枢已新增登录 / 注册页面优化任务。

任务：
- 看板编号：`P0-9`
- Task ID：`WSD-20260504-24-login-register-page-optimization`
- 派发单：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md`
- 执行窗口短提示：`agent-workflow/execution/WSD-20260504-24-login-register-page-optimization-window-prompt.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

牵头 Agent：
- UI / UE Agent
- Copy Agent
- Dev Agent
- QA / Acceptance Agent

任务目标：
- 优化 `04-Site/login.html` 和 `04-Site/register.html`。
- 让用户清楚理解账号入口、注册后的默认阅读有效期、登录后的去向。
- 登录 / 注册页面必须符合上线前前台页面质量要求，不能像模板表单或后台组件堆叠。

新闸门要求：
- 必须先输出 UI/UE 页面规范表。
- 必须先输出 Copy 文案规范表。
- Dev 必须按两个规范表逐条实现，不得自行补写关键文案。
- QA 必须提供登录页和注册页桌面 / 移动截图，并做坐标 / 字号 / 间距 / 文案验收。

自动化影响：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
