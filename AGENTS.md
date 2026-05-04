# 观澜AI｜WaveSight AI 项目级 Agent 规则

本项目必须按长期 `agent-workflow` 执行。新窗口、新会话或上下文恢复时，先读取本文件，再读取下方核心文件，以恢复八个长期 agent 的角色、分工、技能和交接状态。

## 1. 项目定位

- 项目名称：观澜AI｜WaveSight AI
- 定位语：观AI之澜，识商业之势
- 产品定位：面向商业决策者的 AI 机会判断系统
- 核心逻辑：从 AI 热点中筛出商业信号，从信号形成判断，从判断发现机会
- 当前前台导航：首页 / Daily Brief / Signals / The Point / Opportunities / Trends
- Scoring 后台化为 Priority Engine，不作为普通前台栏目
- Tags 暂不作为一线栏目，作为搜索、筛选和关系网络能力

## 2. 新会话启动必读

每次新窗口进入本项目后，先读取：

- `docs/agent-handoff.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/agents/agent-registry.json`
- `agent-workflow/governance/long-term-agent-dispatch-policy.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/automation-fallback-policy.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

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
- `状态`：查看调度看板。
- `看板`：查看 ready / running / review 任务。
- `下一批`：列出建议派发顺序。
- `加入看板：<优先级> <牵头 Agent> <任务描述>`：追加任务到看板，必要时生成派发单。

独立执行窗口结束前必须写 UTF-8 收口文件，默认路径为 `agent-workflow/reports/<TASK-ID>-closeout.md`，再回到调度中枢窗口汇报。

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
- `docs/agent-handoff.md`

要求：

- 每次页面或视觉调整必须使用 `frontend-design` 规范。
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

每日观澜AI商业雷达任务必须遵守：

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
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
node 04-Site/scripts/check-tags.mjs
node --check 04-Site/scripts/sync-data.mjs
node --check 04-Site/js/app.js
node agent-workflow/tools/run-quality-gates.mjs syntax
```

当前关系检查报告：

- `agent-workflow/reports/relation-check-latest.md`

## 8. 自动化影响检查

本项目已有长期自动化任务：

- `ai-the-point`：The Point 每日观点生成，只写 Markdown。
- `ai-2`：AI 商业雷达每日内容生成，只写 Markdown。
- `ai-3`：每日统一网站同步闸门，负责检查内容就绪后统一同步网站。

任何后续操作如果影响以下内容，必须先提示用户“可能影响自动化任务”，并在完成后同步更新对应自动化提示词或执行文档：

- Markdown 文件命名、目录或 frontmatter。
- Signal / Priority / Trend / Opportunity / Point 字段规则。
- `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs` 的运行口径。
- The Point 来源、素材笔记、原文/译文、授权说明规则。
- 每日商业雷达机会拆解、评分表、趋势或机会卡生成规则。
- 自动化时间线、入站顺序、备份、回滚或发布闸门。

若改动只影响普通页面样式、文案或非自动化数据展示，也应在最终回复中明确说明“未影响自动化任务”。

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
