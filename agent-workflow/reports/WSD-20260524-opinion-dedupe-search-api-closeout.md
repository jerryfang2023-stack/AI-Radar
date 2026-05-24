---
title: 2026-05-24 Opinion Dedupe And Search API Closeout
date: 2026-05-24
task: opinion-card-dedupe-search-provider-freshness
status: completed
owner: Codex
---

# 2026-05-24 观点卡去重与搜索 API 收口

## 本次范围

- 检查并合并活跃观点卡重复项。
- 删除 NewsAPI 作为有效搜索入口。
- 为 Tavily / Exa / AnySearch / GDELT 统一 `published_at` 归一化。
- 加强 Exa / GDELT / AnySearch / Tavily / fallback 搜索结果跨入口去重。

## 观点卡重复处理

- 活跃观点卡检查前：206 张。
- 发现重复 URL 组：46 组。
- 已合并重复组：46 组。
- 已移入归档的重复文件：48 个。
- 活跃观点卡检查后：158 张。
- 活跃观点卡剩余重复 URL 组：0 组。
- 归档目录：`01-SiteV2/knowledge/99-Archive/Opinion-Duplicates/2026-05-24/`

处理方式：

- 以后运行 `agent-workflow/tools/govern-opinion-card-ratings.mjs` 时，会先按 `canonical_url / original_url / source_url` 合并重复观点卡。
- 保留优先级：`feature` > `sidebar` > `archive` > `discard`，同时参考前台状态、评分、人工精选 ID 和翻译状态。
- 被合并的卡片会记录到保留卡的 `merged_duplicate_count` / `merged_duplicate_refs` 和正文 `Merge Updates`，重复文件移入归档，不再参与前台同步。

## 搜索入口修改

- 已从 `agent-workflow/tools/run-guanlan-daily-monitor.mjs` 删除 NewsAPI 调用路径。
- 已从 `01-SiteV2/content/11-databases/keyword-monitoring-v2.json` 删除 NewsAPI provider 配置，并把 A-media 顺序改为：`GDELT -> AnySearch -> Tavily -> Exa -> DuckDuckGo -> Bing`。
- 已同步 `context/05-daily-monitoring.md` 与 `skills/guanlan-monitor-quality-gate/SKILL.md`。
- `rg NewsAPI|NEWSAPI|newsapi` 在相关脚本、context、skill、配置中无残留。

发布时间处理：

- Tavily / Exa / AnySearch / GDELT 结果统一写入 `published_at`。
- 优先使用 provider 返回字段：`published_at`、`publishedAt`、`published_date`、`publishedDate`、`datePublished`、`created_at`、`updated_at`。
- provider 缺日期时，只从 URL 或标题中提取可信日期格式；不再把 LinkedIn activity ID、孤立年份或标题里的普通数字误判为发布时间。

跨入口去重：

- 新增 canonical URL 去重：去除 `utm_*`、`ref`、`fbclid`、`gclid` 等参数，统一 `www/m/amp` host 和 AMP 路径。
- 新增标题 / 日期指纹去重：重点覆盖 Reuters、融资 wire 稿、产品页、公司公告和 changelog。
- 搜索结果在进入 Raw 选择前合并重复命中，并在保留项记录 `duplicate_status=merged_provider_duplicates`。

## 验证

- `node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs`：passed
- `node --check agent-workflow/tools/govern-opinion-card-ratings.mjs`：passed
- `node --check agent-workflow/tools/benchmark-search-providers.mjs`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- `node agent-workflow/tools/run-quality-gates.mjs cardcopy --date=2026-05-24`：passed
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-24`：passed
- `keyword-monitoring-v2.json` JSON parse：passed
- 搜索提供商小样本报告：`agent-workflow/reports/2026-05-24-search-provider-benchmark-final.md`

## 注意

- Tavily 如果 provider 和 URL 都不给可信发布时间，`published_at` 会保持空值；这种结果不参与“新鲜度”加分，避免用假日期比较。
- AnySearch 小样本中，URL 含日期的融资 / 报道结果已能补出 `published_at`。
- Exa 小样本中，provider 日期字段可正常进入 `published_at`。
