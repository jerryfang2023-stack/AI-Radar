# 观澜 AI 长任务协同工作流

这套目录用于把“长期运行的 agent 工作”变成可追踪、可交接、可验证的本地流程。

核心原则：

- 任务不靠记忆，靠文件记录。
- 每一轮先做健康检查，再决定下一步。
- 一次只推进一个明确目标。
- 做完必须验证，并把结果写回进度。
- 有风险、有异常、有未完成事项，都写进交接记录。

## 文件说明

- `guanlan-spec.md`：项目目标、数据源、栏目边界、内容规则。
- `feature_list.json`：长期任务总表，是所有 agent 的唯一任务清单。
- `progress.md`：当前进度账本，记录每一轮实际做了什么。
- `daily-run-log.md`：每日自动化监测与网站同步的运行记录。
- `handoff-template.md`：交接模板，适合每轮结束前填写。
- `prompts/worker.md`：给执行型 agent 使用的工作提示词。
- `verification/site-health.ps1`：网站与数据健康检查脚本。
- `init.ps1`：一键初始化并运行健康检查。
- `product/`：产品战略、栏目架构、机会树等 PM 规范。
- `prd/`：PRD 模板和后续活跃需求。
- `roadmap/`：里程碑和发布计划。
- `execution/`：Sprint 计划和验收清单。
- `governance/`：agent 角色、审批规则、工具登记和栏目决策记录。
- `agents/`：长期 agent 岗位说明书，可版本管理、可恢复、可复制。
- `governance/long-term-agent-dispatch-policy.md`：长期 agent 调度硬规则，禁止未经确认重复创建临时 agent。

## Agent 工作分工

- PM Agent：负责栏目规划、功能规划、PRD、路线图和验收。
- Strategy Agent：负责项目定位、商业化路径和边界判断。
- UI / Design Agent：负责视觉、排版、组件和体验质量。
- Copy Agent：负责对外文案、CTA 和表达边界。
- Content / Data Agent：负责字段、标签、关联和质量检查。
- Dev Agent：负责网站、同步脚本、验证脚本和部署能力。
- Automation / Workflow Agent：负责每日运行、日志、健康检查和交接。

PM Agent 是产品总控。新增栏目、合并栏目、重要功能和重大文案变更，先走 PM 判断，再进入设计、内容或开发。

当前战略单一事实源：

```text
product/strategy-single-source.md
```

所有长期 agent 在拆任务前都应先读取这份文件。

长期 agent 的岗位说明见：

```text
agent-workflow/agents/
```

原则：

- 不把长期 agent 只理解为一个临时对话框。
- 默认不创建临时子 agent。任务应分配到长期 agent 岗位说明书、PRD、任务池和执行计划中。
- 只有用户明确批准时，才允许创建临时子 agent；且结论必须沉淀回 `agent-workflow`。
- 新 agent 接手时，先读岗位说明书，再读 `progress.md`、`feature_list.json` 和 active PRD。
- 每轮工作从 Strategy Agent 开始，再由 PM Agent 拆成 PRD 和任务。

长期 agent 调度硬规则见：

```text
governance/long-term-agent-dispatch-policy.md
```

## 日常使用

在 `01-WaveSight` 根目录执行：

```powershell
.\agent-workflow\init.ps1
```

如果当天新增了 Markdown 文档，并希望先同步网站再检查：

```powershell
.\agent-workflow\init.ps1 -Sync
```

检查结果会写入：

```text
agent-workflow/logs/
```

## 适用场景

- 每日 08:30 自动生成商业雷达与机会评分后，确认网站是否同步成功。
- 多个 agent 或多轮对话接力维护网站时，快速知道当前状态。
- 排查重复 signal、重复机会卡、评分字段为空、栏目关系错乱等问题。
- 在改首页、Daily Brief、Signals、Opportunities、Trends、Tags 能力前先确认数据基础。

## 当前启动方向

2026-05-02 起，观澜 AI 进入多 agent 协同产品化阶段。

核心目标：

> 比市场早一步，看清哪些 AI 机会值得验证。

本阶段重点：

- Signals 从新闻列表升级为商业信号系统。
- Daily Brief 升级为每日付费级独立报告。
- Priorities 合并进 Opportunities，形成评分化机会库。
- Trends 升级为趋势判断模型。
- 官网补齐登录、注册、会员状态、权限提示、newsletter 等商业化模块；方法论暂作为内部资产，不作为当前对外栏目。

当前推荐调度顺序：

```text
Strategy -> PM -> Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

启动计划见：

```text
execution/agent-launch-2026-05-02.md
```
- 判断某个栏目是否应该保留、合并、降级为后台能力。
- 把新的产品想法写成 PRD 和可验收开发任务。
