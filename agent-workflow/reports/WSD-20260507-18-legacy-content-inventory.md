---
title: V2-13AUTO Legacy Content Inventory
date: 2026-05-07
task_id: WSD-20260507-18-v2-production-content-migration-autopilot
status: inventory-and-v2-candidate-import-complete
owner: Workflow Agent / Intelligence Data Agent
encoding: UTF-8
---

# Legacy Content Inventory

## 0. 结论

本轮完成 V1 历史资产与近期 V2 监测产物的盘点。处理原则是“先分类，再重加工”，不把 V1 文档原样搬进 V2。

## 1. 盘点范围

| 来源 | 数量 | asset_type | value_type | action | reason |
|---|---:|---|---|---|---|
| `10-Archive/v1.0/source-dirs/01-Signals/` | 8 内容文件，2 支撑文件 | Signal / Daily monitoring | 事实 / 来源 / 商业含义 | imported-as-v2-candidates | 已改写为 V2 Structured Signal 和 Trend Context 候选 |
| `10-Archive/v1.0/source-dirs/02-Scoring/` | 8 内容文件，1 支撑文件 | Scoring / Priority | 评分 / 机会 / 判断节点 | imported-as-v2-candidates | 已转为 HeatEvidence / Priority Engine 候选，不恢复前台 Scoring |
| `10-Archive/v1.0/source-dirs/03-Trends/` | 1 | Trend | 趋势背景 | imported-as-v2-candidate | Trends 降级为机会解码和商业内参的趋势背景 |
| `10-Archive/v1.0/source-dirs/05-point/` | 13 | Point / Source material | 观点 / 反证 / 校准 | imported-as-v2-candidates | The Point 降级为 Point Calibration |
| `10-Archive/v1.0/source-dirs/07-Opportunities/` | 30 | Opportunity | 机会 / 场景 / 风险 | imported-as-v2-candidates | 按 V2 机会解码规则重写，标题不得使用公司名 |
| `10-Archive/v1.0/v1.0-content-archive.md` | 1 | Combined archive | 回溯索引 | archive-only | 作为查证入口，不直接入库 |
| `01-SiteV2/content/01-raw/2026-05-05-raw-candidates.md` | 1 | Daily monitoring | Raw | import | V2 content path sample |
| `01-SiteV2/content/01-raw/2026-05-06-raw-candidates.md` | 1 | Daily monitoring | Raw | import | V2 content path sample |
| `01-SiteV2/content/01-raw/originals/2026-05-06/` | 30 | Raw originals | 来源追溯 | import | 与 2026-05-06 Raw 对齐 |
| `01-SiteV2/content/02-pool/2026-05-06-signal-pool.md` | 1 | Pool | 初筛 | import | 已有 12 条 pool |
| `01-SiteV2/content/03-structured-signals/2026-05-06-structured-signals.md` | 1 | Structured Signal | 结构化信号 | import | 已有 8 条 structured |
| `01-SiteV2/content/04-selected-signals/2026-05-06-front-signals.md` | 1 | Front Signal | 前台 3 条 Signal | import | 已有 3 条 selected |
| `agent-workflow/reports/daily-radar-run-2026-05-05.md` | 1 | Run report | 自动化记录 | archive-only | 作为运行证据，不作为内容资产 |
| `agent-workflow/reports/daily-radar-run-2026-05-06.md` | 1 | Run report | 自动化记录 | archive-only | 作为运行证据，不作为内容资产 |
| `agent-workflow/reports/the-point-run-2026-05-05.md` | 1 | Run report | Point 运行记录 | archive-only | 作为运行证据，不作为内容资产 |
| `agent-workflow/reports/the-point-run-2026-05-06.md` | 1 | Run report | Point 运行记录 | archive-only | 作为运行证据，不作为内容资产 |
| `01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md` | 1 | Daily monitoring | Raw | import | 今日 30 条监测链路已入 V2 raw |
| `01-SiteV2/content/01-raw/originals/2026-05-07/` | 30 | Raw originals | 来源追溯 | import | 与 2026-05-07 Raw 对齐 |
| `01-SiteV2/content/02-pool/2026-05-07-signal-pool.md` | 1 | Pool | 初筛 | import | 今日 12 条 pool 已入库 |
| `01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md` | 1 | Structured Signal | 结构化信号 | import | 今日 8 条 structured 已入库 |
| `01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md` | 1 | Front Signal | 前台 3 条 Signal | import | 今日 3 条 selected 已入库 |
| `01-SiteV2/content/07-points/2026-05-07-point-calibration.md` | 1 | Point Calibration | builder 观点校准 | import | follow-builders 产物已转为 Point Calibration |

## 2. 暂不处理

| 来源 | 处理 |
|---|---|
| `09-ai-news-radar/` | 暂不并入 V2 正式内容库 |
| failed / void / stopped 页面任务产物 | 不迁移 |
| 大量截图和审美报告 | 只保留为验收证据 |
| 纯 closeout 工作流文件 | 只作为调度记录 |

## 3. 下一步

1. V1 Signals 已批量转为 `01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md`。
2. V1 Scoring 已批量转为 `01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md`。
3. V1 Trends 已转为 `01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md`。
4. V1 Point 已转为 `01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md`。
5. V1 Opportunities 已批量转为 `01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md`。
6. 2026-05-07 今日监测链路已完成 raw / pool / structured / selected / point / trend / insight / opportunity / database 入库。
7. 后续只做逐条精修、合并和发布判断，不再把上述资产标为“未加工”。
