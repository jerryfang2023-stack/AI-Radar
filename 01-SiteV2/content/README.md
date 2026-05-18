---
title: WaveSight Content
date: 2026-05-18
status: active-content-pipeline
type: v2-content-root
encoding: UTF-8
---

# 01-SiteV2/content｜观澜AI 内容生产与发布库

本目录承载观澜 AI 的内容生产、文章发布和自动化运行产物。

它不是判断资产主库。长期可复用的变化卡、案例卡、观点卡、趋势卡和变化簇应写入：

```text
01-SiteV2/knowledge/
```

本目录服务 6 个自动化线程：

1. `guanlan-daily-monitor`
2. `asset-card-generator`
3. `daily-observation-writer`
4. `case-signal-researcher`
5. `trend-report-writer`
6. `brief-periodical-writer`

## 1. 当前目录结构

| 目录 | 用途 | 主要线程 |
|---|---|---|
| `00-inbox/` | 手工补充线索、临时链接、待复核素材 | all |
| `01-raw/` | Raw 广泛监测候选和本地原文档案 | guanlan-daily-monitor |
| `01-raw/originals/` | 每日 Raw 原文档案 | guanlan-daily-monitor |
| `02-pool/` | Pool 候选池、入池理由和淘汰风险 | guanlan-daily-monitor |
| `03-daily-observation/` | 今日观察长文 | daily-observation-writer |
| `04-business-signals/` | 商业信号发布索引、精选变化卡 / 案例卡前台材料 | asset-card-generator / case-signal-researcher |
| `05-case-research/` | L2 案例与信号补全研究材料 | case-signal-researcher |
| `06-trend-reports/` | 趋势追踪深度报告 | trend-report-writer |
| `07-business-briefs/` | 商业内参周期刊物 | brief-periodical-writer |
| `08-publication-index/` | 今日观察、趋势报告、商业内参等发布索引 | all writers |
| `09-databases/` | 可执行配置、关键词、主题和轻量数据库 | automation / data |
| `10-distribution/` | 二创分发素材、标题、脚本、社媒版本 | brief-periodical-writer / manual |
| `11-feedback/` | 用户问题、企业需求、项目线索、内容反馈 | manual / feedback loop |
| `_archive/` | 归档旧内容结构和过期生产产物 | workflow |

## 2. 旧内容归档

2026-05-12 已按用户要求清理旧 `content/` 目录，并将旧内容移动到：

```text
01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/
```

旧目录暂不删除，等待用户手工确认。

## 3. 六个自动化线程

### 3.1 guanlan-daily-monitor

每日广泛监测线程。

职责：

- 广泛 Raw 监测。
- Pool 筛选。
- 来源覆盖检查。
- 去重。
- 主题分布。
- 初筛。
- 保存本地正文快照和关键摘录。

默认入口策略：

- 第一段：AI HOT 最近 24 小时 `mode=all` 全量作为 Raw 主入口。先按类目、关键词、商业动作和噪音规则筛选，符合条件的进入 Raw Candidate；`industry`、`ai-products`、`ai-models` 可默认进入候选，`paper` 必须命中技术迭代、商业动作、开发者生态或明确应用场景，`tip` 必须命中关键词或商业动作。AI HOT 本身仍是 M 级发现入口，不是事实主证据。
- 第二段：follow-builders 每日全量进入 `knowledge/03-Opinion-Cards/` 的前沿观点库，并择优进入 Raw / Pool。它用于观点、人物时间线、实践线索和早期变化，不直接证明公司事实。
- 第三段：用关键词规则检查 P0 赛道、P1 证据词、四类信号覆盖和外围探索覆盖。AI HOT + follow-builders 不足 Raw 目标、信号类别缺口明显，或重要卡片缺 S/A/B 来源时，才启动外部多路搜索补齐。
- 重要卡片强制回源补证：变化卡、案例卡、趋势报告、今日观察和商业内参中的事实判断，必须回到原始 URL 或二搜后的 S/A/B 来源。C 级来源和 M 级采集通道只能作为讨论升温、用户反馈、热力图或 Watchlist。

不负责：

- 写今日观察长文。
- 生成完整知识卡。
- 做深度竞品研究。
- 写趋势报告或商业内参。

输出位置：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

Raw / Pool 边界：

- Raw 是原始证据仓库和内容加工入口。每条 Raw 必须按 `agent-workflow/product/raw-evidence-schema.md` 保存来源信息、`full_text`、`clean_text`、抓取质量、去重版本、结构化摘录、商业要素、`evidence_seed`、观澜初筛评分、`emerging_signal_score`、`usable_for`、`pool_routes`、`missing_information` 和 `raw_status`。
- Raw 原文档案使用 Markdown 供人工回查，同目录 JSON 证据对象供自动化读取。Markdown 必须包含 `full_text`、`clean_text`、`key_excerpts`、`business_elements`、`evidence_seed`、`guanlan_scores`、`usable_for`、`pool_routes` 和 `missing_information`。`full_text` 是证据底座，`clean_text` 是分析入口。
- S/A/B/C/D 是回源后的事实来源等级，只判断事实可靠度，不判断商业价值和是否入池。M 只表示 `acquisition_source_level`，用于 AI HOT、follow-builders、搜索聚合、RSS 聚合等采集通道，不是事实来源等级。C 级来源如果 `emerging_signal_score` 高，可以进入 Emerging Pool、User Feedback Pool 或 Watchlist；S 级来源如果没有商业变化，可以只建索引。
- keyword-search 必须保存 `search_intent` 和 `search_path`，并按官方原始、开发生态、资本创业、行业落地、采购 / marketplace、A 级媒体 / GDELT、社区反馈七路检索。社区反馈不得作为唯一 keyword-search 结果；只找到社区讨论时，只能进入 Watchlist 或 User Feedback Pool。
- 只有 `has_full_text=true` 且 `extraction_quality=high|medium`，且 `source_level=S/A/B` 的 Raw，才可作为变化卡、案例卡、趋势报告、今日观察和商业内参事实判断的核心证据。低质量 Raw 只能作为线索或热力图弱信号。
- 观点卡的主证据是“谁在何时何处说了什么”：必须保存人物 / title、原文链接、原文摘录或当时可见文本、发布时间、抓取时间和观察边界 / `capture_scope`。观点里的公司动作、客户采用、融资、收入、市场规模等事实主张，必须另补 S/A/B 来源。
- X / HN / Reddit 等高波动 / 社区来源不得按来源类型默认降级为 `summary_only` 或 `failed`。系统必须按实际抓取结果标记：抓到帖子正文、讨论串、评论或当时可见文本时，保存可见文本、抓取时间、原始 URL、作者 / 社区 / 发布时间、可见范围，并标注 `source_volatility`、`capture_scope` 和 `evidence_level`。只有只抓到标题、链接卡片、搜索摘要或第三方摘要时才标记 `summary_only`；只有无法访问、登录限制、权限阻断、反爬失败或无有效内容时才标记 failed / blocked。
- AI HOT、follow-builders、搜索聚合、自动化摘要、RSS 聚合和榜单聚合页是 M 级发现入口，不是正式事实来源。系统必须优先回到 `origin_url` / `original_url` 抓取原始页面或原帖；原始页面抓取成功时，Raw 以原始页面为准并记录 `discovery_source=AI HOT`、`source_role=primary_source`、`origin_fetch_status=success`，并按原始页面重新判定 S/A/B/C/D。这里的 `primary_source` 指正式 Raw 以回源后的原始页面为准，不表示 AI HOT 自身成为事实主证据。原始页面失败时才保存聚合源可见文本作为 fallback，并标记 `capture_scope=aihot_visible_text`、`source_role=discovery_source`、`evidence_level=discovery_only|weak_signal`。
- Pool 是候选索引，必须记录入池理由、标签、优先级、`raw_ref`、`raw_archive`、`raw_json`、`source_url`、`extraction_quality`、`has_full_text`、`raw_content_hash`、`raw_full_text_hash`、`raw_semantic_hash`、`usable_for`、`pool_routes`、`key_excerpts`、`evidence_seed` 和 `missing_information`。Pool 不替代 Raw 正文。
- Pool 分流细则以 `agent-workflow/product/pool-routing-rules.md` 为准。本 README 只说明 content 目录如何承接 Pool；具体入池、降级、淘汰和禁止项不在这里另起一套规则。
- 今日观察、变化卡、案例卡、趋势报告和商业内参不得只基于 Pool 的标签或短摘要撰写；必须回看 Raw 快照，必要时二搜补齐来源。观点卡不得只基于二手摘要生成，必须回看观点原文或当时可见文本。
- `raw_status` 控制重加工链路：`indexed` 只建索引和快照，`candidate` 才进入候选重加工，`pooled` 已进入 Pool，`asset_used` 表示已被知识资产引用，`archived` 归档，`ignored` 只保留最低限度记录。

### 3.2 asset-card-generator

资产卡生成线程。

职责：

- 从 Pool / 重要 Raw 生成 L1 变化卡。
- 生成 L1 案例卡。
- 生成观点卡候选。
- 自动建立关系。
- 更新变化簇。

主要输出位置：

```text
01-SiteV2/knowledge/01-Change-Cards/
01-SiteV2/knowledge/02-Case-Cards/
01-SiteV2/knowledge/03-Opinion-Cards/
01-SiteV2/knowledge/05-Change-Clusters/
```

本目录可保存发布索引或前台摘要：

```text
01-SiteV2/content/04-business-signals/
```

### 3.3 daily-observation-writer

今日观察写作线程。

定位：

> 每个老板每天必读的一篇 AI 商业行情综述。

正确写作逻辑：

```text
Raw 广泛监测
→ Pool 候选筛选
→ 对当天市场形成整体判断
→ 先基于 Raw / Pool 起草今日观察
→ 等精选变化卡生成后嵌入研究入口和入选理由
→ 发布今日观察
```

输出位置：

```text
01-SiteV2/content/03-daily-observation/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

常规篇幅：

- 常规日：3000-5000 字。
- 低信号日：1500-2500 字。
- 高信号日：5000-6000 字。

### 3.4 case-signal-researcher

案例与信号补全研究线程。

触发式运行，不做全量日更。

触发条件：

- 被今日观察引用。
- 多次关联。
- 进入“正在升温”状态。
- 属于趋势候选。
- 被用户标记重点。
- 适合二创或商业内参。

职责：

- 对高价值变化卡 / 案例卡做 L2 二次搜索。
- 补同行 / 竞品。
- 补赛道前景。
- 补市场规模 / 机构估算。
- 补客户需求。
- 补商业模式。
- 补风险与反证。

输出位置：

```text
01-SiteV2/knowledge/01-Change-Cards/
01-SiteV2/knowledge/02-Case-Cards/
01-SiteV2/content/05-case-research/
agent-workflow/reports/
```

### 3.5 trend-report-writer

趋势追踪深度报告线程。

定位：

> 趋势快报 / 深度趋势分析报告 + 趋势卡。

触发条件：

- 变化簇达到趋势门槛。
- 用户指定方向。
- 某一方向连续出现高价值变化。
- 商业内参需要前置趋势研究。
- 已批准急件候选需要临时生成趋势快报。

职责：

- 每次运行最多产出 1 篇趋势报告。
- weekly mode 最多产出 1 篇 `TRD-FULL-*` 深度报告。
- urgent mode 最多产出 1 篇 `TRD-FLASH-*` 趋势快报。
- 证据不足时输出 `no_report_decision`，不硬凑、不沉默。
- 更新趋势卡。
- 关联变化卡、变化簇、案例卡、观点卡、急件候选和来源。
- 管理趋势快报 30 天 follow-up、升级、归档或修正状态。

输出位置：

```text
01-SiteV2/content/06-trend-reports/flash/
01-SiteV2/content/06-trend-reports/full/
01-SiteV2/content/06-trend-reports/no-report-decisions/
01-SiteV2/knowledge/04-Trend-Cards/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

篇幅：

- 趋势快报：2000-3500 中文字。
- 深度报告：6000-10000 中文字。

关键规则：

- Trend Report ID 使用 `TRD-FLASH-YYYYMMDD-XX` / `TRD-FULL-YYYYMMDD-XX`。
- 急件候选 ID 使用 `UTCAND-YYYYMMDD-XX`。
- 前台第一版只展示 `watching` / `upgraded`。
- `no_report_decision` 不进入前台索引，不进入知识库。
- 新报告只写入 `flash/` 或 `full/`，不写入 `06-trend-reports/` 根目录。

### 3.6 brief-periodical-writer

商业内参周期刊物线程。

定位：

> 周期性 AI 商业观察刊物。

节奏：

- 默认周刊。
- 内容不足可合并半月刊。
- 内容更少时可做月刊。
- 重大主题可出专题增刊。

职责：

- 基于周期内今日观察、变化卡、案例卡、趋势报告、前沿观点和二创反馈，重新融合、修正和升级判断。
- 输出一期完整刊物文章。

输出位置：

```text
01-SiteV2/content/07-business-briefs/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

## 4. 每日主链与研究支链

每日主链：

```text
09:00 guanlan-daily-monitor
→ 09:20 asset-card-generator
→ 09:40 daily-observation-writer
```

其中 `daily-observation-writer` 可在 `asset-card-generator` 生成卡片时并行起草，但最终定稿必须等待精选变化卡。

研究支链：

```text
10:10 case-signal-researcher
```

基于触发条件运行，不承担全量 Raw 监测。

周期深度链：

```text
trend-report-writer
brief-periodical-writer
```

按趋势门槛、用户指定方向或周期刊物节奏运行。

## 5. Raw / Pool 规则

今日观察文章基于 Raw 全量监测后的市场理解撰写，不是基于精选变化卡小样本倒推。

每日生产漏斗范围：

- Raw 广泛监测：常规 80-150 条。
- 低信号日：50-80 条。
- Pool 候选：20-40 条。
- 变化卡候选：8-15 张。
- 今日精选变化卡：常规 5-8 张；低信号日 3-5 张；高信号日 8-12 张。
- 文章重点详写：3-5 张。

Raw 覆盖：

- 公司公告和产品发布。
- 融资、并购、资本市场动态。
- 可信媒体报道。
- 前沿观点：Builder、VC、Researcher、创始人、产品负责人和重要技术作者的原文观点。
- 论文、技术报告、开源项目。
- 客户案例、招采、合作、企业采用。
- 应用商店、云市场、GitHub、社区讨论等市场线索。
- 如有条件，加入付费数据库或市场规模数据。

## 6. 与 knowledge 的关系

本目录产出内容，`knowledge/` 沉淀资产。

```text
content/01-raw              -> 不直接进入 knowledge，除非被筛选
content/02-pool             -> 触发资产卡候选
content/03-daily-observation -> 发布文章，索引进入 Publication Index
content/04-business-signals  -> 商业信号前台材料，关联变化卡 / 案例卡
content/05-case-research     -> 更新 L2 变化卡 / 案例卡
content/06-trend-reports     -> 发布报告，更新趋势卡
content/07-business-briefs   -> 发布刊物，索引进入 Publication Index
```

## 7. Tags

沿用 `agent-workflow/product/tag-taxonomy.md`，不重建失控标签。

前台筛选表达应自然化，不展示内部 tag_id 或机械 group 名称。

## 8. 质量边界

- 今日观察必须体现 Raw 全局理解，不得只拼接精选卡片。
- 变化卡和案例卡必须进入 `knowledge/`，不能只留在文章里。
- 深度竞品、市场规模和客户需求分析不压给每日监测线程，由 `case-signal-researcher` 触发式补全。
- 趋势追踪必须是深度研究报告 + 趋势卡，不是卡片聚合页。
- 商业内参必须是周期刊物文章，不是结构化模块填充页。
