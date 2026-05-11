# 观澜AI｜WaveSight AI 项目级 Agent 规则

本项目必须按长期 `agent-workflow` 执行。新窗口、新会话或上下文恢复时，先读取本文件，再读取 `agent-workflow/governance/current-context.md` 和当前任务派发单。旧长清单不再作为默认启动要求，只有派发单指定或追溯冲突时再补读。

## 1. 项目定位

- 项目名称：观澜AI｜WaveSight AI
- 定位语：观AI之澜，识商业之势
- 产品定位：面向商业决策者的 AI 机会判断系统
- 核心逻辑：从 AI 热点中筛出商业信号，从信号形成判断，从判断发现机会
- 当前开发阶段：V2-only 生产开发，V1.0 网站与旧内容日更不再更新
- V2 建议前台导航：今日要点 / 关键信号 / 机会解码 / 商业内参
- The Point 降级为观点校准模块，Trends 降级为趋势背景和热力输入，不再作为 V2 一级导航
- Scoring 后台化为 Priority Engine，不作为普通前台栏目
- Tags 暂不作为一线栏目，作为搜索、筛选和关系网络能力

### V2 当前开发节奏

- 当前网站开发采用桌面端优先口径：先集中完成桌面端信息架构、视觉质感、栏目页和详情页体验，以加速 V2 生产开发。
- 除非派发单明确要求移动端，本阶段页面类任务默认不做移动端专项设计和开发，移动端截图不作为当前任务 accepted 的硬阻塞。
- 当前页面 QA 默认要求桌面端截图和核心交互检查；移动端只做基础不崩坏 / 无严重横向溢出的非阻塞观察，后续另派移动端专项统一处理。
- 页面 / 文案开发窗口不得自验自收。开发 closeout 后，必须另派独立 QA / Acceptance 窗口按 `agent-workflow/governance/page-copy-quality-review-skill.md` 做页面与文案质检，调度窗口只能在独立质检通过后 accepted。

### V2 目录口径

- V2 新站和新文件默认入口：`01-SiteV2/`
- V2 新网站工程入口：`01-SiteV2/site/`
- V2 内容生产线入口：`01-SiteV2/content/`
- V1 旧网站只读归档：`10-Archive/v1.0/site/04-Site/`
- V1 内容只读归档：`10-Archive/v1.0/`
- `agent-workflow/`、`docs/`、`AGENTS.md` 继续保留在项目根目录，用于长期 agent、调度、交接和质量门禁

## 2. 新会话启动必读

每次新窗口进入本项目后，默认只读取：

- `AGENTS.md`
- `agent-workflow/governance/current-context.md`
- 当前任务派发单：`agent-workflow/execution/<TASK-ID>.md`

补读规则：

- `docs/agent-handoff.md`：只在上下文恢复、收口验收、追溯最新状态时读取。
- `agent-workflow/progress.md`：只在回填进度、查近期变更或收口验收时读取。
- `agent-workflow/feature_list.json`：只在产品 / 功能 / 看板状态需要更新或验证时读取。
- `agent-workflow/governance/*.md`：只按任务类型或派发单指定补读。
- 各长期 Agent 岗位说明：只在该 Agent 牵头且派发单要求时读取。

读取或保存 handoff / 交接类文件时，统一使用 UTF-8 编码。Windows PowerShell 环境下读取中文 Markdown 时优先使用 `-Encoding UTF8`，避免把 `docs/agent-handoff.md`、`agent-workflow/progress.md`、`agent-workflow/reports/*handoff*.md` 读成乱码；新增或更新交接文件也必须保存为 UTF-8。

如果用户没有明确要求创建临时 agent，不要使用临时 agent 代替长期岗位。

## 3. 八个长期 Agent

本项目长期 agent 是岗位说明书 + 工作流文件，不是一次性对话线程。所有任务应分配给以下八个长期 agent：

| Agent | 角色文件 | 核心职责 |
|---|---|---|
| Strategy Agent | `agent-workflow/agents/strategy-agent.md` | 产品定位、战略边界、商业化方向、栏目取舍 |
| PM Agent | `agent-workflow/agents/pm-agent.md` | PRD、任务拆解、路线图、验收标准、跨 agent 分工 |
| UI / UE Agent | `agent-workflow/agents/ui-ue-agent.md` | 页面结构、视觉规范、信息层级、体验验收 |
| Copy Agent | `agent-workflow/agents/copy-agent.md` | 对外文案、栏目价值表达、标题、CTA、禁用语 |
| Intelligence Data Agent | `agent-workflow/agents/data-agent.md` | 判断资产模型、Signal / Trend / Opportunity / The Point 关系网络、标签体系、质量报告 |
| Dev Agent | `agent-workflow/agents/dev-agent.md` | 网站、脚本、同步、权限、部署、技术验证 |
| QA / Acceptance Agent | `agent-workflow/agents/qa-agent.md` | 独立验收、风险等级、发布建议、回归检查 |
| Workflow / Automation Agent | `agent-workflow/agents/workflow-agent.md` | 任务状态、交接记录、自动化、进度账本 |

## 4. 分配任务的正确方式

长期 agent 的工作要写入项目文件，而不是重新创建同名临时 agent。

优先写入或更新：

- `agent-workflow/execution/*.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/prd/active/*.md`
- `agent-workflow/progress.md`
- `agent-workflow/reports/*.md`
- `agent-workflow/governance/*.md`

### 调度中枢窗口机制

本项目允许把当前窗口作为“调度中枢窗口”：本窗口只负责分配任务、生成派发单、接收各独立执行窗口的收口文件、验收并更新进度。具体执行任务应单独打开新窗口完成。

调度中枢规则见：

- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`

快捷口令：

- `执行：<看板编号或 Task ID>`：从 `dispatch-board.md` 领取已预生成任务，输出独立执行窗口提示词。
- `派发：<任务描述>`：生成任务 ID、派发单和执行窗口提示词。
- `收口：<closeout 文件路径>`：读取收口文件，验收并回填进度。
- `检查收口箱`：读取 `agent-workflow/inbox/closeout-queue.jsonl`，发现执行窗口已登记的 closeout。
- `验收收口箱`：按收口箱队列逐个读取 closeout 并执行标准验收。
- `状态`：查看调度看板。
- `看板`：查看 ready / running / review 任务。
- `下一批`：列出建议派发顺序。
- `加入看板：<优先级> <牵头 Agent> <任务描述>`：追加任务到看板，必要时生成派发单。

独立执行窗口结束前必须写 UTF-8 收口文件，默认路径为 `agent-workflow/reports/<TASK-ID>-closeout.md`，并向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记；调度窗口可通过收口箱自动发现，但仍必须按派发单硬闸门验收。

如果确需临时 agent，必须先说明：

1. 为什么长期文档分配不足以完成任务
2. 临时 agent 的写入范围
3. 完成后如何回填到 `agent-workflow`
4. 等待用户明确同意

重大任务必须遵守 Plan-first：

- 新增或调整前台栏目、权限、数据模型、自动化、云端部署、商业化路径前，先按 `agent-workflow/governance/plan-first-policy.md` 写计划。
- 计划模板使用 `agent-workflow/execution/PLAN-template.md`。

每轮完成必须说明通过了哪些 Quality Gates：

- 规则见 `agent-workflow/governance/quality-gates.md`。
- 统一脚本入口为 `node agent-workflow/tools/run-quality-gates.mjs <mode>`。
- 未运行的检查必须说明原因和风险。

## 5. 按任务类型读取规范

### 战略 / 定位 / 栏目取舍

读取：

- `agent-workflow/agents/strategy-agent.md`
- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/product-strategy.md`
- `agent-workflow/product/column-architecture.md`
- `docs/agent-handoff.md`

### PM / PRD / 任务拆解

读取：

- `agent-workflow/agents/pm-agent.md`
- `agent-workflow/prd/active/README.md`
- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`
- `agent-workflow/feature_list.json`
- `docs/agent-handoff.md`

### UI / 页面 / 排版 / 视觉

读取：

- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
- `docs/brand/wavesight-ai-vi/typography-guidelines.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- `docs/brand/wavesight-ai-vi/motion-tokens.css`
- `docs/brand/wavesight-ai-vi/executable-svg/README.md`
- `docs/agent-handoff.md`

要求：

- 每次页面或视觉调整禁止继续使用 `frontend-design` 作为项目技能或设计口径；当前有效口径为“观澜 AI VI + Apple / Linear / Stripe 高级商业网站方向 + `design-taste-frontend` / `gpt-taste` / `redesign-existing-projects` / `high-end-visual-design` + `awesome-design-md` 真实设计系统参考”。
- 每次页面、视觉、商业内参和动效调整必须读取 `docs/brand/wavesight-ai-vi/`，并按真实 SVG、`typography-guidelines.md` 与 `brand-tokens.css` 执行；Logo 不允许用 CSS、图标库或手写 SVG 重新绘制。
- 设计相关工作必须读取 VI、字体规范及 SVG 组件相关文件；不要根据截图重画元素；所有 Logo、符号、信息卡片和动效分镜都优先引用 SVG 资产；页面颜色和字体使用 `brand-tokens.css`；公开页面全局背景按最新收口统一为 `#fffdf8` / `--gl-bg-page`，卡片保留半透明纸面层次；页面字体角色使用 `typography-guidelines.md`；动效使用 `motion-tokens.css`；新增组件必须基于现有 SVG 风格扩展，保持深海蓝、暖白、雾灰和少量香槟金。
- Logo 使用最新高还原 SVG 资产：正式横版 Logo 默认不低于 `160px`；小于 `120px` 宽时优先使用 symbol；不得改变香槟金地平线、三道主澜线、中文字标和 `WAVESIGHT AI` 英文字标。
- 需要时参考 `awesome-design-md`。
- 普通前台不能出现 Admin、JSON、同步、恢复、编辑等后台痕迹。
- 栏目页标题必须与其他一级栏目保持同一套位置、字号、行高和首屏节奏；标题背景默认与页面背景一致，不随意添加突兀色块。
- 公开前台不能粗糙、简陋、像模板页或像后台组件堆叠；若用户反馈主次不明、占位过大或页面粗糙，先修信息架构和阅读路径，再调细节。

### 文案 / 标题 / CTA / 对外表达

读取：

- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/DESIGN.md`
- `docs/agent-handoff.md`

要求：

- 文案必须言之有物、简洁克制、精炼有力，不讲废话。
- 有观点，但不替用户下最终经营、投资或合作判断。
- 不把内部流程语言写给外部用户。
- 公开前台文案只阐述信号、事实、来源和观察边界，不以说服别人为目标。
- 避免“本页用于”“入口”“同步”“字段”“后台”“证据链”“强证据”“来源明确”“阅读证据”“机会确定”“下一步验证”等内部或说服式表达。
- Opportunity 标题不能写公司名，公司只能作为证据、案例或来源。

### 数据智能 / 标签 / 关系 / 去重

读取：

- `agent-workflow/agents/data-agent.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/relation-check-schema.md`
- `agent-workflow/reports/relation-check-latest.md`
- `04-Site/config/content-paths.json`
- `docs/agent-handoff.md`

要求：

- 核心实体必须有稳定 ID 和 slug。
- Signal / Priority / Trend / Opportunity / Point 必须可追溯、可关联、可检查。
- Tags 不允许无限膨胀，应逐步字典化。
- 不为了清零软提醒硬绑评分证据；应由 PM / Intelligence Data Agent 判断补评分、合并、降级观察或保留。
- Tags 不是随手标注，必须按 `tag-taxonomy.md` 作为可搜索、可筛选、可关系网络化的判断资产治理。

### 开发 / 同步 / 权限 / 云端部署

读取：

- `agent-workflow/agents/dev-agent.md`
- `agent-workflow/prd/active/`
- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`
- `04-Site/README.md`
- `04-Site/config/content-paths.json`
- `docs/agent-handoff.md`

要求：

- 改动前先确认文件范围。
- 改动后至少运行相关语法检查和同步/关系检查。
- 不破坏普通前台与 Admin 的边界。
- 云端部署前必须处理版本管理、备份、回滚、权限和数据写入方案。

### QA / 验收 / 发布检查

读取：

- `agent-workflow/agents/qa-agent.md`
- `agent-workflow/execution/acceptance-checklist.md`
- `agent-workflow/reports/relation-check-latest.md`
- `docs/agent-handoff.md`

要求：

- QA 不参与实现，避免自验自收。
- 必须检查普通用户、登录用户、到期用户和管理员四种状态。
- 阻塞问题未清零，不建议发布。

### 自动化 / 进度 / 交接

读取：

- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/progress.md`
- `agent-workflow/daily-run-log.md`
- `agent-workflow/governance/long-term-agent-dispatch-policy.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/tag-taxonomy.md`
- `docs/agent-handoff.md`

要求：

- 每轮结束必须更新进度或报告。
- 自动化任务异常必须写清楚尝试过的检索方式、降级路径和失败原因。
- 任意新会话都应能通过 `docs/agent-handoff.md` 恢复状态。

## 6. 每日雷达自动化特殊要求

V2 每日监测当前生产口径由 `v2-content-site-daily-update` 执行，必须遵守：

- 默认每天 09:00 运行。
- Raw 原始候选：80-150 条；低信号或关键接口失败日可降级为 50-80，但必须写明原因。
- Pool：20-30 条。
- Structured Signals：8-15 条。
- Front Signals：3-5 条。
- Opportunity Deep Dive：1-2 条，证据不足时不得硬凑。
- Trend Updates：3-5 条。
- 必须合并 AI HOT、follow-builders、HN、GitHub、GDELT、官方产品 / 平台、A 级媒体、融资 / VC、developer / research、market / customer / regulation 等来源。
- AI HOT、follow-builders、HN、X、Reddit 等只作为 M 级 discovery / source-router，不直接作为事实主证据。
- 每条线索必须回看原始 URL，并按原始来源重新分级为 S/A/B/C/D；C 级或 M 级通道不得作为事实主证据。
- 每日日志必须写入 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count`。
- Front Signal 必须二搜，且每条至少 3 个解析后的 S/A/B 原始来源。
- Deep Dive 必须至少 5 个来源，其中至少 2 个 S 级或一手来源。

V1 历史商业雷达文件如需读取，保留以下旧格式约束；不得把它当作 V2 每日生产漏斗：

- Signals 命名：`YYYY-MM-DD-AI商业雷达.md`
- Scoring 命名：`YYYY-MM-DD-AI机会评分.md`
- 每条 Signal 必须包含 `机会拆解（6点｜必须详细拆解）`
- 机会拆解必须包含 6 个独立模块：
  1. 解决什么具体问题？
  2. 目标客户是谁？
  3. 替代或优化什么流程？
  4. 商业模式（怎么赚钱）？
  5. 为什么现在值得关注？
  6. 是否可迁移中国市场？
- 同步后网站数据中每条当天 Signal 应解析出 6 个机会拆解模块
- 缺失时任务不得报告完成，必须补齐后重新同步

## 7. 常用验证

在 `01-WaveSight` 目录下常用：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content
node --check 01-SiteV2/site/assets/app.js
```

V1 旧脚本只在读取或修复归档内容时作为历史参考，不作为 V2 当前生产线默认验证。

当前关系检查报告：

- `agent-workflow/reports/relation-check-latest.md`

## 8. V2-only 生产开发口径

从 2026-05-07 起，本项目进入 V2.0 专注开发模式：

- V1.0 网站不再更新。
- 旧自动化任务 `ai-the-point`、`ai-2`、`ai-3` 已停止，不再作为后续任务的影响判断对象。
- 后续调度不再要求说明“是否影响旧自动化 / V1 网站 / 旧内容日更”。
- 不再围绕旧 V1 链路做兼容性优先判断；默认目标是推进 V2.0 正式生产线。

仍需保留的 V2 生产开发要求：

- 生产线改造必须写清楚当前 V2 目标、改动范围、质量检查、备份和回滚。
- 页面类任务仍必须经过 UI / UE Design Director、Copy、Dev、QA 桌面端截图验收；移动端专项设计 / 开发 / 截图验收暂缓，除非派发单明确要求。
- 页面 / 文案开发任务必须接入独立质检流程：开发 closeout -> 调度窗口派发独立质检 -> 按定位一致性、信息架构、商业判断、文案自然度、视觉体验、页面节奏和可信度 7 维评分 -> 未达标退回 Dev / Copy -> 独立质检 accepted 后调度窗口才可 accepted。
- 独立质检硬闸门：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8；页面不像观澜AI或文案明显像 AI 模板时，即使语法、链接和截图通过，也不得 accepted。
- 产品功能类任务仍必须经过 PM 门禁、WAVE 评分和模块决策表。
- 自动化、同步脚本、内容路径和数据 schema 的后续改动，只按 V2.0 新生产线验收，不再按 V1 影响口径阻塞。

## 9. 下一步接手顺序

新会话接手时建议顺序：

1. 读取本文件
2. 读取 `docs/agent-handoff.md`
3. 读取 `agent-workflow/governance/README.md`
4. 读取 `agent-workflow/governance/long-term-agent-dispatch-policy.md`
5. 读取 `agent-workflow/governance/agent-memory.md`
6. 读取 `agent-workflow/governance/plan-first-policy.md`
7. 读取 `agent-workflow/governance/quality-gates.md`
8. 读取 `agent-workflow/progress.md`
9. 读取 `agent-workflow/feature_list.json`
10. 判断用户当前任务属于哪个长期 agent
11. 读取对应 agent 岗位说明和相关产品规范
12. 执行任务并写回进度、报告或任务状态
