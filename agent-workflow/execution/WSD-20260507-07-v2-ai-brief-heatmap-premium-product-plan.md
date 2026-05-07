# WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `data` / `strategy` / `ui-ue`

## 0. 快速执行卡

- 看板编号：`V2-4A`
- Task ID：`WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`
- 任务类型：产品功能类 / 增值产品 / 数据模型 / 设计前置
- 派发单：`agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`
- 调度口令：`收口：WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan`
- 是否可能影响自动化：可能影响，但本任务只做产品规划，不改生产自动化

执行窗口最短启动提示词：

```text
执行任务：WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md。
回调度窗口：收口：WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan
```

## 1. 任务目标

将用户提供的“观澜AI商业内参 + AI商业热力图”规划转为 V2.0 正式产品方案，判断它是否作为 V2 核心增值产品进入路线图。

必须形成：

- PM 新增功能门禁记录。
- WAVE 评分。
- 模块决策表。
- MVP / 非目标 / 延后项。
- 与四栏目、HeatEvidence、AI商业热力图、AI内参的关系。
- 对 `V2-2` 算法、`V2-3` VI、`V2-4` 产品架构的影响。

## 2. 必读

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/v2/v2-transition-charter.md`
5. `agent-workflow/v2/v2-preflight-roadmap.md`
6. `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`
7. `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
8. `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`
9. `agent-workflow/execution/WSD-20260507-05-v2-product-architecture-prd.md`

## 3. 允许改动范围

- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
- `agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`
- 如需补充，只能修改 `agent-workflow/v2/` 下相关规划文档。

## 4. 禁止改动范围

- 不修改 `04-Site/`。
- 不新增正式前台栏目代码。
- 不修改生产内容源 Markdown 的 frontmatter。
- 不修改 `sync-data.mjs`、`unified-site-sync.mjs`、`check-relations.mjs`。
- 不替换 `ai-the-point`、`ai-2`、`ai-3` 自动化本体。

## 5. 产品功能类硬闸门

本任务是产品功能类任务，必须完成：

| 门禁项 | 结论 |
|---|---|
| 功能名称 | 观澜AI商业内参 / AI商业热力图 |
| 功能类型 | 前台 / 会员 / 数据 / 商业化 |
| 对应用户任务 | 判断 AI 正在影响哪些行业、岗位和工作流 |
| 目标用户场景 |  |
| 预期商业结果 |  |
| 现有模块为什么不能承载 |  |
| 是否可改为已有模块内视图 |  |
| WAVE 评分 | W / A / V / E / 总分 |
| 数据与运营依赖 |  |
| 体验路径 |  |
| 前台 / 后台边界 |  |
| 非目标 |  |
| 决策 | 进入 PRD / 原型验证 / 合并进已有模块 / 后台化 / 延期复核 / 不做 |
| 下一步 owner |  |

任一 WAVE 维度为 0 或未达到通过线，不得进入 Dev。

## 6. 必须输出的模块决策表

| 决策项 | 结论 |
|---|---|
| 模块名称 | AI内参 / AI商业热力图 |
| 用户是谁 |  |
| 用户为什么需要 |  |
| 商业价值 |  |
| 与现有模块是否重复 |  |
| 是否可通过加强现有模块解决 |  |
| 用户是否愿意付费或持续使用 |  |
| 使用路径是否顺畅 |  |
| 是否贴合观澜战略核心 |  |
| 决策 | 新增 / 保留 / 强化 / 合并 / 优化已有 / 后台化 / 隐藏 / 延期复核 / 淘汰 / 不做 |
| 非目标 |  |
| 需要交接的 Agent |  |

## 7. 预期输出

- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
- closeout：`agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`

输出文档必须包含：

- 产品定位。
- 四栏目与 AI内参关系。
- AI商业热力图数据对象。
- HeatEvidence 产品口径。
- 周度 / 月度 Issue 口径。
- MVP 范围。
- 暂不做清单。
- PM 门禁与 WAVE。
- 对 V2-2 / V2-3 / V2-4 / V2-5 的交接要求。

## 8. 必跑检查

- [ ] 产品功能类任务：PM 新增功能门禁记录。
- [ ] 产品功能类任务：WAVE 评分。
- [ ] 产品功能类任务：模块决策表。
- [ ] 自动化影响说明。

本任务不跑浏览器截图和代码 syntax，除非执行窗口修改了代码或脚本。

