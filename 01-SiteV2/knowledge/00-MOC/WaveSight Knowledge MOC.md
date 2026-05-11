---
title: WaveSight Knowledge MOC
date: 2026-05-10
status: active
type: moc
encoding: UTF-8
---

# WaveSight Knowledge MOC

## 核心库

- [[01-Signals/README|信号库]]
- [[02-Points/README|观点库]]
- [[03-Cases/README|案例库]]
- [[04-Opportunities/README|机会库]]
- [[05-Trends/README|趋势库]]
- [[06-Sources/README|来源库]]
- [[07-Companies/README|公司库]]
- [[08-People/README|人物库]]

## 工作流

1. 从 `01-SiteV2/content/04-selected-signals/` 挑选进入信号库。
2. 从 `01-SiteV2/content/07-points/` 挑选进入观点库。
3. 从 Signal / Point 中抽取公司、产品、客户、融资和部署，进入案例库与公司库。
4. 多条 Signal 指向同一方向时，沉淀为趋势库。
5. 有客户、流程、商业模式和反证后，进入机会库。

## 首批入库

- [[2026-05-10--daily-curation--first-batch]]
- [[2026-05-10--signal--cx-agent-delivery-economics]]
- [[2026-05-10--signal--auditable-knowledge-worker-agents]]
- [[2026-05-10--signal--runtime-ai-governance-control-plane]]

## 今日待处理

```dataview
TABLE type, status, source_date
FROM "01-WaveSight/01-SiteV2/knowledge"
WHERE status = "draft" OR status = "needs-review"
SORT source_date DESC
```

## 最近信号

```dataview
TABLE signal_id, primary_trend, source_date, status
FROM "01-WaveSight/01-SiteV2/knowledge/01-Signals"
SORT source_date DESC
LIMIT 20
```

## 最近观点

```dataview
TABLE point_id, person, source_date, status
FROM "01-WaveSight/01-SiteV2/knowledge/02-Points"
SORT source_date DESC
LIMIT 20
```
