---
title: V2-13 + V2-DOC Closeout
date: 2026-05-07
task_id: WSD-20260507-18-v2-production-content-migration-autopilot
board_id: V2-13AUTO
status: accepted / v2-content-20260507-imported
owner: V2 Platform / Workflow Agent / Intelligence Data Agent / Dev Agent / QA Agent
encoding: UTF-8
---

# V2-13 + V2-DOC 合并执行 Closeout

## 1. 执行范围

本轮按用户要求在当前任务内合并执行 `V2-13 + V2-DOC`，并把 V1.0 已沉淀内容与近期监测产物迁移纳入同一 closeout。

没有二次开新任务，没有另写独立派发单。

执行边界：
- 不恢复旧 `04-Site` 为生产站。
- 不部署 Netlify。
- 不做 V2 页面 Dev。
- 不处理 `09-ai-news-radar/`。
- 不把 V1 文档原样搬进 V2。

## 2. V2 生产路径与文档索引

已完成：
- 新增 `agent-workflow/v2/v2-production-pipeline-cutover.md`。
- V2 内容生产路径锁定为 `01-SiteV2/content/`。
- V2 新站工程入口锁定为 `01-SiteV2/site/`。
- 旧站工程路径为 `10-Archive/v1.0/site/04-Site/`，只读参考。
- `01-SiteV2/content/v2/README.md` 已标记为早期骨架参考，避免成为第二个生产内容根。
- 补齐 `agent-workflow/v2/schemas/README.md` 和 `agent-workflow/v2/rules/README.md`。
- 更新 `docs/README.md`、`docs/agent-handoff.md`、`agent-workflow/progress.md` 和 `dispatch-board.md`。

## 3. V2 内容闸门

已完成：
- 新增 `agent-workflow/tools/v2-content-gate.mjs`。
- `agent-workflow/tools/run-quality-gates.mjs` 新增 `v2content` 模式。
- `agent-workflow/v2/quality-gates/v2-content-quality-gate.md` 已写入可执行闸门。

当前命令：

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
```

## 4. 历史判断资产迁移

### 4.1 历史资产 inventory 摘要

Inventory 文件：

```text
agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md
```

覆盖范围：

| 来源 | 数量 | 处理 |
|---|---:|---|
| `10-Archive/v1.0/source-dirs/01-Signals/` | 8 内容文件，2 支撑文件 | 已改写为 Structured Signal / Trend Context 候选 |
| `10-Archive/v1.0/source-dirs/02-Scoring/` | 8 内容文件，1 支撑文件 | 已改写为 Priority / HeatEvidence 候选 |
| `10-Archive/v1.0/source-dirs/03-Trends/` | 1 | 已改写为 Trend Context |
| `10-Archive/v1.0/source-dirs/05-point/` | 13 | 已改写为 Point Calibration |
| `10-Archive/v1.0/source-dirs/07-Opportunities/` | 30 | 已改写为 Opportunity Report 候选 |
| `01-SiteV2/content/01-raw/originals/2026-05-06/` | 30 | 已作为 V2 raw source sample |
| `01-SiteV2/content/01-raw/2026-05-06-raw-candidates.md` | 1 | 已作为 V2 Raw sample |
| `01-SiteV2/content/02-pool/2026-05-06-signal-pool.md` | 1 | 已作为 V2 Pool sample |
| `01-SiteV2/content/03-structured-signals/2026-05-06-structured-signals.md` | 1 | 已作为 V2 Structured sample |
| `01-SiteV2/content/04-selected-signals/2026-05-06-front-signals.md` | 1 | 已作为 V2 Front Signal sample |
| daily radar / The Point run reports | 4 | 仅归档为运行证据 |
| `follow-builders` 2026-05-07 产物 | 1 digest | 已改写为今日 Point Calibration |
| 2026-05-07 监测链路 | Raw 30 / Pool 12 / Structured 8 / Front 3 | 已入库并通过 V2 内容闸门 |

### 4.2 V2 内容迁移 map

Migration map 文件：

```text
agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md
```

映射关系：

| 旧资产 | V2 目标 | 处理 |
|---|---|---|
| V1 AI商业雷达 | `01-SiteV2/content/03-structured-signals/legacy/` | 拆分为结构化 Signal 候选 |
| V1 AI机会评分 | `01-SiteV2/content/10-databases/legacy/` | 转为 Priority / HeatEvidence 候选 |
| V1 Trends | `01-SiteV2/content/05-trend-chain/legacy/` | 转为 Trend Context |
| V1 The Point | `01-SiteV2/content/07-points/legacy/` | 转为 Point Calibration |
| V1 Opportunities | `01-SiteV2/content/08-opportunities/deep-dive/legacy/` | 转为机会解码候选 |
| 2026-05-05 / 2026-05-06 V2 monitoring | 当前 `01-SiteV2/content/` 路径 | 作为 V2 生产链路样本 |

### 4.3 已导入 / 待重加工 / 仅归档 / 拒绝导入清单

| 类别 | 清单 | 说明 |
|---|---|---|
| 已导入 | 2026-05-06 Raw 30、Raw originals 30、Pool 12、Structured 8、Front Signals 3 | 已在 `01-SiteV2/content/` 中形成可检查样本 |
| 已导入 | `01-SiteV2/content/00-inbox/legacy-import/README.md` 和 `legacy-import-index-2026-05-07.md` | 历史资产重加工入口 |
| 已导入 | 2026-05-07 Raw 30、Raw originals 30、Pool 12、Structured 8、Front Signals 3 | 今日监测数据已进入 `01-SiteV2/content/` |
| 已导入 | 2026-05-07 Point、Trend、Insight、Opportunity、Trend DB、Opportunity DB、Risk DB | follow-builders 与今日信号已并入 V2 判断链 |
| 已加工为 V2 legacy candidates | V1 Signals / Scoring / Trends / Point / Opportunities | 已按 V2 六维分析、HeatEvidence、Trend Context、Point Calibration、Opportunity 关系生成候选文件 |
| 已加工为 V2 legacy candidates | The Point 自动化产物和自动化跑出的商业机会文档 | 已作为观点校准和机会候选，不恢复独立频道 |
| 待逐条精修 | 已生成的 legacy candidates | 不是待加工；是待补证据、合并、QA 和发布判断 |
| 仅归档 | `10-Archive/v1.0/v1.0-content-archive.md` | 作为查证入口，不直接入库 |
| 仅归档 | daily radar / The Point run reports | 作为运行证据，不作为内容资产 |
| 拒绝导入 | failed / void / stopped 页面任务产物 | 不进入 V2 内容库 |
| 拒绝导入 | `09-ai-news-radar/` | 用户明确暂不处理 |

### 4.4 对 `01-SiteV2/content/` 的实际写入路径

本轮实际写入：

```text
01-SiteV2/content/00-inbox/legacy-import/
01-SiteV2/content/00-inbox/legacy-import/README.md
01-SiteV2/content/00-inbox/legacy-import/legacy-import-index-2026-05-07.md
01-SiteV2/content/README.md
01-SiteV2/content/v2/README.md
01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md
01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md
01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md
01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md
01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md
01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md
01-SiteV2/content/01-raw/originals/2026-05-07/
01-SiteV2/content/02-pool/2026-05-07-signal-pool.md
01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md
01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md
01-SiteV2/content/05-trend-chain/2026-05-07-trend-classification.md
01-SiteV2/content/06-insights/2026-05-07-insights.md
01-SiteV2/content/07-points/2026-05-07-point-calibration.md
01-SiteV2/content/08-opportunities/deep-dive/2026-05-07-opportunity-deep-dive.md
01-SiteV2/content/10-databases/trends/2026-05-07-trend-database-update.md
01-SiteV2/content/10-databases/opportunities/2026-05-07-opportunity-database-update.md
01-SiteV2/content/10-databases/risks/2026-05-07-risk-database-update.md
```

本轮创建并确认存在的后续 legacy 目标目录：

```text
01-SiteV2/content/01-raw/legacy/
01-SiteV2/content/02-pool/legacy/
01-SiteV2/content/03-structured-signals/legacy/
01-SiteV2/content/04-selected-signals/legacy/
01-SiteV2/content/05-trend-chain/legacy/
01-SiteV2/content/07-points/legacy/
01-SiteV2/content/08-opportunities/deep-dive/legacy/
01-SiteV2/content/10-databases/legacy/
```

这些 legacy 目标目录已经包含 V2 legacy candidate 文件，但不代表 V1 文档已原样搬入，也不代表候选已可前台发布。

### 4.5 已直接加工的 V2 legacy candidate 文件

| 文件 | 内容 |
|---|---|
| `01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md` | 8 个 V1 AI商业雷达批次转为 Structured Signal candidates |
| `01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md` | 8 个 V1 AI机会评分批次转为 Priority / HeatEvidence candidates |
| `01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md` | V1 Trends 转为 Trend Context |
| `01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md` | 4 个 The Point 日文件和 2026-05-06 初步观点转为 Point Calibration candidates |
| `01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md` | 28 个 V1 Opportunity 文件转为机会解码候选 |

## 5. 今日监测与 follow-builders 入库

已按用户补充要求执行 2026-05-07 今日监测任务，并执行 `follow-builders` 作为 Point 主要内容源。

今日入库：

| 阶段 | 数量 / 文件 |
|---|---|
| Raw | 30 条，`01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md` |
| Raw originals | 30 个原始档案，`01-SiteV2/content/01-raw/originals/2026-05-07/` |
| Pool | 12 条，`01-SiteV2/content/02-pool/2026-05-07-signal-pool.md` |
| Structured | 8 条，`01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md` |
| Front Signals | 3 条，`01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md` |
| Point Calibration | 6 条，`01-SiteV2/content/07-points/2026-05-07-point-calibration.md` |
| Trend / Insight / Opportunity / DB | 已写入对应 V2 目录 |

今日三条前台信号：

1. 企业 Agent 控制平面开始成为新预算层。
2. AI 编程工具的竞争焦点转向安全与执行治理。
3. 模型公司与咨询伙伴正在重写企业 AI 交付链。

## 6. 验证结果

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-06
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- `v2content` passed，报告：`agent-workflow/reports/quality-gates-v2content-2026-05-06-20260507-115050.md`。
- `v2content` passed，报告：`agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-121002.md`。
- `syntax` passed，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-121002.md`。

`v2content` 指标：

| 2026-05-07 Metric | Count |
|---|---:|
| Raw Candidates | 30 |
| Raw Originals | 30 |
| Pool Items | 12 |
| Structured Signals | 8 |
| Front Signals | 3 |

## 7. 修改文件清单

- `agent-workflow/tools/v2-content-gate.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- `agent-workflow/v2/v2-production-pipeline-cutover.md`
- `agent-workflow/v2/schemas/README.md`
- `agent-workflow/v2/rules/README.md`
- `agent-workflow/v2/migration/content-paths-v2-draft.md`
- `agent-workflow/v2/quality-gates/v2-content-quality-gate.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/content/v2/README.md`
- `01-SiteV2/content/00-inbox/legacy-import/README.md`
- `01-SiteV2/content/00-inbox/legacy-import/legacy-import-index-2026-05-07.md`
- `01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md`
- `01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md`
- `01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md`
- `01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md`
- `01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md`
- `01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md`
- `01-SiteV2/content/01-raw/originals/2026-05-07/`
- `01-SiteV2/content/02-pool/2026-05-07-signal-pool.md`
- `01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md`
- `01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md`
- `01-SiteV2/content/05-trend-chain/2026-05-07-trend-classification.md`
- `01-SiteV2/content/06-insights/2026-05-07-insights.md`
- `01-SiteV2/content/07-points/2026-05-07-point-calibration.md`
- `01-SiteV2/content/08-opportunities/deep-dive/2026-05-07-opportunity-deep-dive.md`
- `01-SiteV2/content/10-databases/trends/2026-05-07-trend-database-update.md`
- `01-SiteV2/content/10-databases/opportunities/2026-05-07-opportunity-database-update.md`
- `01-SiteV2/content/10-databases/risks/2026-05-07-risk-database-update.md`
- `agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`
- `agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md`
- `agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/execution/dispatch-board.md`

## 8. 自动化影响

旧自动化已停止。本轮没有恢复旧 `ai-2`、`ai-3`、`ai-the-point`。

新增影响：

- V2 内容检查入口为 `node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD`。
- 后续 V2 日常内容生产必须满足 Raw 30-50、Pool 10-15、Structured 5-8、Front Signals 3。

## 9. 回滚方式

本轮没有覆盖旧站数据、没有部署、没有删除历史内容。

如需回滚：

1. 移除新增 V2 gate 脚本和 `v2content` mode。
2. 移除本轮新增文档和 reports。
3. 将 `dispatch-board.md` 中 `V2-13AUTO` 状态退回 `ready`。
4. 保留 `10-Archive/v1.0/` 不动。

## 10. 未解决风险

- V2 site generator 尚未实现，不能报告为前台已上线。
- 历史 V1 资产已批量转为 V2 legacy candidates；不是待加工，但尚未逐条精修为可发布 Structured / Opportunity / HeatEvidence。
- `09-ai-news-radar/` 本轮未纳入生产路径。
- 页面类任务仍需 V2-8AUTO / UI / Copy / QA 后续承接。

## 11. 建议

下一步按批执行 legacy candidates 精修，优先顺序：

1. V1 Opportunities -> V2 机会解码候选。
2. V1 The Point -> Point Calibration。
3. V1 Signals / Scoring -> Structured Signal / HeatEvidence 候选。

每批都必须跑 `v2content` 或后续 V2 relation gate。
