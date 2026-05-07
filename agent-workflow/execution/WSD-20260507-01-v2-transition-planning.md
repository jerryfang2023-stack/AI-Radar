# WSD-20260507-01-v2-transition-planning 派发单

日期：2026-05-07  
状态：accepted  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `pm`

## 0. 快速执行卡

- 看板编号：`SYS-9`
- Task ID：`WSD-20260507-01-v2-transition-planning`
- 任务类型：治理类 / V2 转场规划
- 派发单：`agent-workflow/execution/WSD-20260507-01-v2-transition-planning.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-01-v2-transition-planning-closeout.md`
- 调度口令：`收口：WSD-20260507-01-v2-transition-planning`
- 是否可能影响自动化：否

## 1. 任务目标

- 在 V1.0 已完成后，建立 V2.0 开发前置准备。
- 明确 V1.0 baseline、V2 规划目录、工作区策略和第一批 V2 任务。
- 不进入页面、算法或自动化代码开发。

## 2. 非目标

- 不修改 `04-Site` 页面。
- 不替换生产 Signals / The Point / ai-2 / ai-3。
- 不创建外部新项目目录。
- 不直接创建 Git tag、branch 或 worktree；该动作交给后续 Dev 任务。

## 3. 输出

- `agent-workflow/v2/`
- V2 转场、baseline、workspace、roadmap 和 brief 文档。
- 看板新增 SYS-9 和 V2 第一批 ready 任务。
- closeout：`agent-workflow/reports/WSD-20260507-01-v2-transition-planning-closeout.md`

## 4. 必跑检查

- [x] `feature_list.json` JSON 解析。
- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

