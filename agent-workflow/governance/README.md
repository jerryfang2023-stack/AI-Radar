# Agent Operating System

更新时间：2026-05-10
owner：`workflow` / `pm`  
状态：长期生效

## 1. 定位

本目录是观澜AI多 agent 协作的治理入口。

它把长期 agent 从“岗位分工”升级为一套可恢复、可计划、可校验、可降级、可交接、可复盘的 Agent Operating System。

新窗口、新会话或任务恢复时，除 `AGENTS.md` 和 `docs/agent-handoff.md` 外，应优先读取本文件，再按任务类型读取下方治理文件。

## 2. 先读顺序

通用接手顺序：

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/README.md`
4. `agent-workflow/governance/long-term-agent-dispatch-policy.md`
5. `agent-workflow/governance/agent-memory.md`
6. `agent-workflow/governance/plan-first-policy.md`
7. `agent-workflow/governance/quality-gates.md`
8. `agent-workflow/progress.md`
9. `agent-workflow/feature_list.json`

自动化、发布、交接或月度复盘任务，还应读取对应专项治理文件。

## 3. 治理文件地图

| 文件 | 解决什么问题 | 何时读取 |
|---|---|---|
| `long-term-agent-dispatch-policy.md` | 防止重复创建临时 agent | 每轮开始、任务分派前 |
| `agent-memory.md` | 长期规则、反复错误和纠偏经验 | 每轮开始、改内容/页面/自动化前 |
| `plan-first-policy.md` | 重大任务先计划再执行 | 新栏目、权限、模型、自动化、部署前 |
| `quality-gates.md` | 完成前必须通过哪些检查 | 任务收尾、QA、发布前 |
| `v2-current-rule-overrides.md` | V2 当前规则覆盖表，解决旧 PRD / 旧派发单 / V1 / test-only 口径冲突 | 新窗口接手、发现规则冲突、E 类清理后 |
| `skill-pattern-gate.md` | 为每个任务标注 Tool Wrapper / Generator / Reviewer / Inversion / Pipeline 执行模式 | 派发任务前、收口验收前 |
| `dispatch-state-reconciliation.md` | 解决看板、feature、progress、handoff、closeout 状态冲突，禁止继承失败任务 | 派发任务前、收口验收前、看板刷新时 |
| `automation-fallback-policy.md` | 自动化失败如何降级 | 自动化异常、内容缺失、同步失败 |
| `agent-handoff-template.md` | agent 如何写交接报告 | 阶段结束、交给下一个 agent 前 |
| `window-dispatch-hub.md` | 当前窗口如何分配任务、接收独立窗口收口并回填进度 | 使用多窗口并行执行任务时 |
| `intelligence-model-calibration.md` | 每月如何复盘判断模型 | 月度/季度复盘、模型权重调整 |
| `approval-rules.md` | 哪些事项需要人工确认 | 涉及战略、商业、权限或发布风险 |
| `column-decision-log.md` | 栏目增删合并的决策记录 | 改导航、改栏目结构前后 |
| `tool-registry.md` | 工具和脚本登记 | 新增脚本、自动化或外部工具后 |
| `agent-roles.md` | 早期角色记录 | 仅在追溯历史角色时读取 |

## 4. 默认工作流

重大任务默认流程：

```text
Strategy -> PM -> Intelligence Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

执行原则：

- Strategy 和 PM 先判断是否值得做、如何做、哪些不做。
- Intelligence Data、UI/UE、Copy 可在 PM 计划明确后并行输出规范。
- Dev 只在关键输入稳定后整合实现。
- QA 不参与实现，独立验收。
- Workflow 收口报告、进度账本和 handoff。

## 5. Plan-first 触发器

以下任务必须先写计划：

- 新增、删除、合并或调整前台栏目。
- 改账号、会员、Admin、权限、支付或云端部署。
- 改 Signal / Trend / Opportunity / The Point / Tags 数据模型。
- 改每日自动化、统一同步、质量检查、发布闸门。
- 新增或合并长期 agent。
- 改商业化路径、样例报告、newsletter 或企业版服务。

计划模板：

```text
agent-workflow/execution/PLAN-template.md
```

## 6. Quality Gates 执行入口

规则文件：

```text
agent-workflow/governance/quality-gates.md
```

脚本入口：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs content
node agent-workflow/tools/run-quality-gates.mjs point
node agent-workflow/tools/run-quality-gates.mjs site
node agent-workflow/tools/run-quality-gates.mjs all
```

自动化同步闸门默认只做语法检查。若确需真实运行统一同步闸门，必须显式传入：

```powershell
node agent-workflow/tools/run-quality-gates.mjs automation --date=YYYY-MM-DD --run-sync-gate
```

## 7. 自动化影响提醒

V2-only 生产开发阶段的默认口径：

- 后续任务不再判断是否影响已停止的 V1 旧自动化 `ai-the-point`、`ai-2`、`ai-3`。
- 但凡影响 V2 每日 09:00 内容自动化、`01-SiteV2/content/`、`01-SiteV2/site/` 数据生成器、source registry、V2 quality gates、Netlify 或 GitHub 发布，仍必须说明影响、降级路径和回滚方式。
- 治理文件中的 `04-Site` 命令仅作 V1 历史参考；V2 当前任务默认读取 `01-SiteV2/` 和 V2 脚本。

如果任务影响以下内容，必须先提醒用户“可能影响自动化任务”，并在完成后更新相关自动化说明或执行文档：

- Markdown 命名、目录、frontmatter。
- Signal / Priority / Trend / Opportunity / Point 字段。
- `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs`。
- The Point 来源、素材笔记、原文/译文、授权说明。
- 每日雷达机会拆解、评分表、趋势或机会卡生成规则。
- 自动化时间线、入站顺序、备份、回滚或发布闸门。

## 8. 收口要求

每轮结束至少说明：

- 做了什么。
- 改了哪些文件。
- 通过了哪些 Quality Gates。
- 哪些检查未运行，原因是什么。
- 是否影响自动化任务。
- 下一步应由哪个 agent 接。

阶段性任务建议按 `agent-handoff-template.md` 写入 `agent-workflow/reports/`。

交接类文件必须统一保存为 UTF-8。包括 `docs/agent-handoff.md`、`agent-workflow/progress.md`、`agent-workflow/reports/*handoff*.md`、`agent-workflow/reports/*closeout*.md` 等用于新窗口恢复状态的文件。Windows PowerShell 读取中文交接文件时应显式使用 UTF-8。

如果当前窗口被指定为调度中枢窗口，按 `window-dispatch-hub.md` 执行：本窗口只做派发、收口、验收和进度回填；独立执行窗口必须生成 UTF-8 closeout 文件后再回到本窗口汇报。

## 9. 禁止事项

- 不用临时 agent 代替长期岗位文件。
- 不在没有计划的情况下推进重大任务。
- 不把未验证结果报告为通过。
- 不让自动化失败静默覆盖有效数据。
- 不把经验只留在对话中，必须写入项目文件。
