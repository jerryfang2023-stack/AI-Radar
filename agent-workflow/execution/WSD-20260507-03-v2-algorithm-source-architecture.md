# WSD-20260507-03-v2-algorithm-source-architecture 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`data` / `pm` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-2`
- Task ID：`WSD-20260507-03-v2-algorithm-source-architecture`
- 任务类型：数据智能 / 算法 / 来源监测规划
- 派发单：`agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`
- 调度口令：`收口：WSD-20260507-03-v2-algorithm-source-architecture`
- 是否可能影响自动化：会影响 V2 正式升级路线；阶段 1 只出方案，阶段 2 只出架构规划，不直接替换生产自动化

## 0A. 两阶段执行规则

本任务采用 Plan-first 两阶段：

### 阶段 1：方案确认，不执行

执行窗口只做任务理解和执行方案，不创建正式产出文件，不修改生产代码、生产内容源或自动化任务。注意：这不是把 V2 定义为测试项目，而是在正式升级前增加用户确认门禁。

必须输出：

- 任务目标复述。
- 输入材料梳理。
- 计划产出的文档结构。
- 算法 / 来源 / HeatEvidence / 热力图 / AIBriefIssue 的拆解思路。
- 需要用户确认的问题。
- 风险与非目标。
- 建议写入 UTF-8 阶段总结：`agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-stage1-plan.md`

阶段 1 完成后回调度窗口，等待用户确认。

### 阶段 2：确认后正式执行

只有用户明确确认后，执行窗口才可创建正式输出：

- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`

## 1. 任务目标

设计 V2.0 算法、来源分层、监测规则、去重、二次搜索、反证和长期趋势数据库规则。

本任务服务 V2.0 正式升级，目标是形成后续可实际开发、迁移和生产替换的算法架构；不是仅为测试环境写一次性方案。

## 2. 必读

1. `AGENTS.md`
2. `agent-workflow/v2/v2-transition-charter.md`
3. `agent-workflow/v2/briefs/v2-algorithm-brief.md`
4. `agent-workflow/v2/briefs/v2-source-monitoring-brief.md`
5. `agent-workflow/product/daily-monitoring-algorithm-v2.md`
6. `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
7. `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`

## 3. 输出

- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- closeout：`agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md`

必须回应：

- 四栏目如何转为 `HeatEvidence`。
- 行业、岗位、流程、三元组热力如何计算。
- `AIBriefIssue` weekly / monthly 需要哪些输入。
- 哪些算法需要先隔离验证，哪些可进入生产升级路径。

## 4. 硬规则

- 不替换 `ai-2` 生产自动化。
- 不修改 `sync-data.mjs` 或 `unified-site-sync.mjs`。
- 必须明确哪些规则需要先隔离验证，哪些规则最终进入正式 V2 生产链路。
