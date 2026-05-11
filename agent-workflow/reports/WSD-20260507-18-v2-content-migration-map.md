---
title: V2 Content Migration Map
date: 2026-05-07
task_id: WSD-20260507-18-v2-production-content-migration-autopilot
status: migration-map-and-import-complete
owner: Workflow Agent / Intelligence Data Agent / Dev Agent
encoding: UTF-8
---

# V2 Content Migration Map

## 0. 迁移口径

V2 内容迁移不是移动文件，而是把历史判断资产重新映射为 V2 内容资产。所有导入必须保留原始路径、原始日期、转换日期、转换理由、关系字段和证据缺口。

## 1. 目标路径

| 旧资产 | V2 目标 | 处理 |
|---|---|---|
| V1 AI商业雷达 | `01-SiteV2/content/03-structured-signals/legacy/` | 拆分为结构化 Signal 候选 |
| V1 AI机会评分 | `01-SiteV2/content/10-databases/legacy/` | 转为 Priority / HeatEvidence 候选 |
| V1 Trends | `01-SiteV2/content/05-trend-chain/legacy/` | 转为 Trend Context |
| V1 The Point | `01-SiteV2/content/07-points/legacy/` | 转为 Point Calibration |
| V1 Opportunities | `01-SiteV2/content/08-opportunities/deep-dive/legacy/` | 转为机会解码候选 |
| V2 Raw / Pool / Structured / Front Signals | 原路径保留 | 作为 V2 生产线样本；2026-05-07 已入库 |
| follow-builders | `01-SiteV2/content/07-points/` | 转为 Point Calibration，不作为独立频道 |
| Run reports | `agent-workflow/reports/` | 保留为运行证据 |

## 2. 稳定 ID 规则

| 类型 | ID 模板 |
|---|---|
| Legacy Signal candidate | `legacy-signal-YYYYMMDD-NN` |
| Legacy Priority candidate | `legacy-priority-YYYYMMDD-NN` |
| Legacy Trend context | `legacy-trend-context-YYYYMMDD-NN` |
| Legacy Point calibration | `legacy-point-calibration-YYYYMMDD-NN` |
| Legacy Opportunity candidate | `legacy-opportunity-YYYYMMDD-slug` |
| HeatEvidence candidate | `heat-evidence-YYYYMMDD-source-slug-NN` |

## 3. 转换字段

每条迁移资产必须补齐：

```yaml
v2_id:
source_path:
source_date:
converted_at:
converted_from:
v2_destination:
title:
asset_role:
related_signal_ids:
related_point_ids:
related_trend_ids:
related_opportunity_ids:
evidence_gaps:
counter_evidence:
production_readiness: candidate | needs_review | archive_only
```

## 4. 本轮已落地

| 项 | 状态 |
|---|---|
| V2 生产路径统一到 `01-SiteV2/content/` | done |
| V2 新站入口统一到 `01-SiteV2/site/` | done |
| `content/v2/` 标记为早期骨架参考 | done |
| legacy import inbox 建立 | done |
| V1 / recent monitoring inventory | done |
| 可执行 V2 内容闸门 | done |
| V1 Signals -> Structured Signal legacy candidates | done |
| V1 Scoring -> Priority / HeatEvidence legacy candidates | done |
| V1 Trends -> Trend Context legacy candidate | done |
| V1 The Point -> Point Calibration legacy candidates | done |
| 28 V1 Opportunities -> Opportunity Report legacy candidates | done |
| 2026-05-07 Raw 30 / Pool 12 / Structured 8 / Front 3 | done |
| 2026-05-07 follow-builders -> Point Calibration | done |
| 2026-05-07 Trend / Insight / Opportunity / Databases | done |

## 5. 历史资产处理口径更新

V1 历史资产不是“待加工”，而是已经按 V2 体系改写为 legacy candidates 并写入 `01-SiteV2/content/`。后续工作是逐条精修、合并、补证据、做发布判断。

为了避免把旧判断、旧标题、旧机会卡和旧 The Point 频道口径污染 V2，这些候选仍不能直接前台发布。真正进入可发布 Structured / Opportunity / HeatEvidence 前，还需要逐条补来源等级、反证、证据权重、关系校验和 QA。

## 6. 2026-05-07 入库 map

| V2 资产 | 写入路径 |
|---|---|
| Raw candidates | `01-SiteV2/content/01-raw/2026-05-07-raw-candidates.md` |
| Raw originals | `01-SiteV2/content/01-raw/originals/2026-05-07/` |
| Pool | `01-SiteV2/content/02-pool/2026-05-07-signal-pool.md` |
| Structured Signals | `01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md` |
| Front Signals | `01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md` |
| Point Calibration | `01-SiteV2/content/07-points/2026-05-07-point-calibration.md` |
| Trend Context | `01-SiteV2/content/05-trend-chain/2026-05-07-trend-classification.md` |
| Insights | `01-SiteV2/content/06-insights/2026-05-07-insights.md` |
| Opportunity Deep Dive | `01-SiteV2/content/08-opportunities/deep-dive/2026-05-07-opportunity-deep-dive.md` |
| Trend DB | `01-SiteV2/content/10-databases/trends/2026-05-07-trend-database-update.md` |
| Opportunity DB | `01-SiteV2/content/10-databases/opportunities/2026-05-07-opportunity-database-update.md` |
| Risk DB | `01-SiteV2/content/10-databases/risks/2026-05-07-risk-database-update.md` |
