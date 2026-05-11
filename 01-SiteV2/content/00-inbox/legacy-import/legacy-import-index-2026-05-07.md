---
legacy_import_id: legacy-import-20260507
date: 2026-05-07
status: inventory-ready
source_scope:
  - 10-Archive/v1.0/source-dirs
  - 10-Archive/v1.0/v1.0-content-archive.md
  - 01-SiteV2/content/2026-05-05-to-2026-05-06
conversion_rule: transform-before-frontstage
encoding: UTF-8
---

# Legacy Import Index｜2026-05-07

## 1. 导入原则

本文件不是 V1 内容搬运结果，而是 V2 重加工入口。V1 历史资产只有在完成 V2 规则重写后，才能进入结构化信号、机会解码、观点校准、趋势背景或 HeatEvidence。

## 2. 当前批次

| 批次 | 来源 | 状态 | V2 处理 |
|---|---|---|---|
| L-01 | V1 Signals / Daily | inventoried | 按事件、证据、商业含义拆分，候选进入 `03-structured-signals/legacy/` |
| L-02 | V1 Scoring / Priority | inventoried | 转为 Priority / HeatEvidence 候选，不恢复 Scoring 前台 |
| L-03 | V1 Trends | inventoried | 转为 Trend Context，不恢复 Trends 一级频道 |
| L-04 | V1 The Point | inventoried | 转为 Point Calibration，不恢复 The Point 一级频道 |
| L-05 | V1 Opportunities | inventoried | 转为 Opportunity Report 候选，标题需避开公司名 |
| L-06 | 2026-05-05 / 2026-05-06 V2 monitoring | active-sample | 已在 `01-SiteV2/content/` 形成 Raw -> Front Signal 样本 |

## 3. 下游条件

进入下游前必须补齐：

- V2 稳定 ID。
- 原始路径。
- 原始日期。
- 转换日期。
- 关系字段。
- 证据缺口。
- 反证或边界。

## 4. 本轮结论

2026-05-06 V2 monitoring 链路已经具备生产路径验证价值。V1 历史资产先完成 inventory 和 migration map，不做未经重加工的批量搬运。
