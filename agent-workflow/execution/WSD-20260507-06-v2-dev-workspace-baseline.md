# WSD-20260507-06-v2-dev-workspace-baseline 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`dev` / `qa` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-5`
- Task ID：`WSD-20260507-06-v2-dev-workspace-baseline`
- 任务类型：开发治理 / 分支 / worktree / 发布基线
- 派发单：`agent-workflow/execution/WSD-20260507-06-v2-dev-workspace-baseline.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`
- 调度口令：`收口：WSD-20260507-06-v2-dev-workspace-baseline`
- 是否可能影响自动化：否，除非执行窗口明确改动部署或自动化配置

## 1. 任务目标

确认 V1.0 代码基线、创建 V2 分支或 worktree 策略，并提出安全迁移与回滚方案。

## 2. 必读

1. `AGENTS.md`
2. `agent-workflow/v2/v1-baseline-freeze.md`
3. `agent-workflow/v2/v2-workspace-strategy.md`
4. `agent-workflow/execution/dispatch-board.md`

## 3. 输出

- `agent-workflow/v2/v2-dev-workspace-baseline.md`
- 是否建议创建 Git tag / branch / worktree。
- 如执行 Git 操作，必须写清当前状态、命令结果和回滚方式。
- closeout：`agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md`

## 4. 硬规则

- 不得使用破坏性回滚。
- 不得删除或覆盖未归属本任务的修改。
- 创建外部 worktree 前必须确认目标路径。

