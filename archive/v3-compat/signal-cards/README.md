---
title: Legacy Signal Cards
status: compatibility-archive
encoding: UTF-8
---

# 旧 Signal Card 兼容档案

本目录保留 V3 时期生成的 `product_service`、`funding` 与 `case` Markdown Card，用于历史追踪、旧页面兼容与下游应用输入。它不再是 SITE-V4.1 网站或事实数据库的来源。

## 与 V4 商业事件的关系

- 旧 Signal Card 是历史候选与解释资产，不等于 V4 CanonicalEvent。
- 一个旧 Card 可能对应一个 V4 事件、多个事件、仅对应 RawDocument，或没有可靠映射。
- V4 的 `compatibility-cards.json` 是 CanonicalEvent 的一对一投影，与本目录中的旧 Markdown Card 不是同一对象。
- 逐条结果见 `../../content/11-databases/data-center-v4/legacy-card-event-mappings.json`。

## 本地来源状态

- `legacy_source_status: local_snapshot`：旧 Card 已重新连接到仍存在的本地 Raw Markdown 与 JSON。
- `legacy_source_status: external_only`：历史本地快照已退役，保留来源 URL，不伪造本地路径。
- `legacy_source_status: ambiguous_source`：旧 Card 聚合了多个来源，无法安全指定单一本地快照。

不要在此目录新增 V4 商业事件。新的事实对象由 Data Center V4 构建器生成。
