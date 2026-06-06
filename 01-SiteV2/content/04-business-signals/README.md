---
title: Business Signals Publishing Index
date: 2026-05-19
status: active-publishing-index
type: content-publishing-index
encoding: UTF-8
---

# 04-business-signals｜商业信号发布索引

本目录保存前台商业信号流和成熟变化短专题，不保存长期判断资产本体。

判断资产本体写入：

```text
01-SiteV2/knowledge/01-Signal-Cards/case/
01-SiteV2/knowledge/01-Signal-Cards/product-service/
01-SiteV2/knowledge/01-Signal-Cards/funding/
01-SiteV2/knowledge/03-Asset-Candidates/change/
01-SiteV2/knowledge/03-Asset-Candidates/trend/
```

## 当前结构

| 子目录 | 用途 | 是否资产本体 |
|---|---|---|
| `signals/` | 前台商业信号流索引，只允许 product_service / funding / case 三类主类型 | 否 |
| `change-topics/` | 达到触发门槛后的变化短专题 | 否 |

前沿观点流不放在本目录，写入：

```text
01-SiteV2/content/05-frontier-opinions/
```

后台变化 / 场景 / 趋势候选不放在本目录，写入：

```text
01-SiteV2/content/06-asset-candidates/change/
01-SiteV2/content/06-asset-candidates/scene/
01-SiteV2/content/06-asset-candidates/trend/
```

## 边界

- `signals/` 决定今天商业信号流展示哪些显性事件。
- 商业信号前期只保留三种主类型：`product_service`、`funding`、`case`。
- 合作、采购、定价、风险、监管、合规等只作为 `business_variable`、`supporting_signal`、`evidence_tag` 或 `watch_reason`。
- `change-topics/` 只展示已满足触发规则的变化短专题，不展示单条材料硬生成的变化卡。
- 前沿观点流写入 `content/05-frontier-opinions/`，不是本目录的侧栏附属材料。商业信号页只能引用四档评级后为 `feature` / `sidebar` 的观点卡；`archive` / `discard` 不得在前台露出。

同步脚本应从本目录读取发布索引，再回到 `knowledge/` 和 Raw 档案补完整证据。
