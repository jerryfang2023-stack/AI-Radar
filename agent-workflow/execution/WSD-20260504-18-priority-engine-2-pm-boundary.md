# WSD-20260504-18-priority-engine-2-pm-boundary 派发单

日期：2026-05-04  
状态：merged  
调度窗口：当前主窗口  
牵头 Agent：`pm`  
协作 Agent：`strategy` / `data` / `copy`

## 1. 任务目标

> 2026-05-04 调度中枢更新：本任务已按用户要求合并进 `WSD-20260504-22-priority-engine-2-fast-track-implementation`，不再单独派发执行。

- 由 PM Agent 确认 Priority Engine 2.0 的产品边界、PRD 归属和验收口径。
- 明确哪些能力进入后台判断引擎，哪些结果通过 Daily Brief / Trends / Opportunities 对外呈现。
- 明确不新增前台栏目、不投资化表达、不直接替换现有 30 分评分表的过渡策略。

## 2. 必读文件

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/agents/pm-agent.md`
4. `agent-workflow/product/priority-engine-2.md`
5. `agent-workflow/reports/priority-engine-2-2026-05-04.md`
6. `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
7. `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
8. `agent-workflow/prd/active/PRD-004-trends-model.md`

## 3. 输出要求

- 输出 PM 确认报告：`agent-workflow/reports/WSD-20260504-18-priority-engine-2-pm-boundary-closeout.md`
- 必要时更新 PRD 后续迭代说明，但不要改网站代码或同步脚本。

## 4. 验收标准

- 确认 Priority Engine 2.0 是后台判断能力，不新增普通前台栏目。
- 确认 Judgment Node 的产品定位、过渡策略和对外表达边界。
- 给出 ai-2、ai-the-point、ai-3、Dev、QA 的后续优先级。
- 明确哪些内容需要用户确认后才能进入实现。

## 5. 自动化影响

本任务为 PM 边界确认，默认不直接影响 `ai-the-point`、`ai-2`、`ai-3`。若提出自动化提示词改动，必须作为后续单独任务执行。
