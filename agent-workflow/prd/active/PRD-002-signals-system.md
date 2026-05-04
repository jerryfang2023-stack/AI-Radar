# PRD-002：Signals 商业信号系统

更新时间：2026-05-02  
owner：`pm`  
协作 agent：`signal-intelligence`、`data`、`copy`、`ui-ue`、`dev`、`qa`

## 1. 背景

Signals 是观澜 AI 的证据层。它不是新闻列表、公司动态库或工具目录，而是已经出现商业证据、可能影响机会判断或趋势判断的 AI 商业变化。

本 PRD 需要补齐三件事：

1. 建立可支撑实际运营的 Signal 算法模型。
2. 用模型结果持续优化每日监测任务，包括关键词、网站和数据源。
3. 建立阶段性反馈和调整机制，让 Signals 系统越跑越准。

## 2. 用户任务

用户进入 Signals，是为了看清：

1. 发生了什么变化。
2. 为什么它不是普通新闻。
3. 它指向哪个商业方向。
4. 它关联哪些机会和趋势。
5. 这个信号的证据强度如何。

运营侧使用 Signals，是为了看清：

1. 哪些关键词带来了高价值信号。
2. 哪些来源更容易产生一手证据。
3. 哪些内容只是噪音、重复或普通新闻。
4. 哪些新方向需要进入监测词库。
5. 哪些信号最终转化成 Daily Brief、Opportunity 或 Trend。

## 3. 产品目标

建立统一 Signal 入库标准、前台展示规则和运营算法模型，让每条 Signal 都能支撑 Daily Brief、Opportunities 和 Trends，并反向优化每日监测任务。

## 4. 非目标

- 不收录普通热点。
- 不做全量新闻聚合。
- 不以公司名作为前台主标题。
- 不把融资新闻机械等同于商业机会。
- 不把算法分数作为绝对判断，只作为筛选、排序和复盘依据。

## 5. Signal 入库标准

每条 Signal 必须包含：

- 事件：融资、发布、客户采用、收入增长、并购、监管、渠道变化、招投标、重大合作等。
- 证据：客户、收入、融资、部署、复购、合作、政策、行业采用、明确产品更新等。
- 商业含义：说明某个方向正在升温、分化、成熟、受阻或出现可验证机会。

没有商业含义的新闻，不进入 Signals。

## 6. 可运营算法模型

Signal 算法模型采用“规则评分 + 人工复核 + 运营反馈”的混合机制。它不是替人做最终判断，而是帮助每天的监测、筛选、排序和复盘更稳定。

### 6.1 Signal Score

总分 100 分：

| 维度 | 权重 | 判断问题 |
|---|---:|---|
| 商业证据强度 | 25 | 是否有客户、收入、部署、复购、招投标、监管、并购等可验证证据 |
| 商业含义清晰度 | 20 | 是否能说明某个方向升温、分化、成熟、受阻或出现机会 |
| 来源可信度 | 15 | 是否来自一手来源、高质量媒体或可靠产业数据 |
| 赛道相关性 | 15 | 是否落在观澜 AI 当前重点关注赛道或机会方向 |
| 新变化程度 | 10 | 是否代表新阶段、新客户、新动作、新变量 |
| 关联价值 | 10 | 是否能关联已有 Opportunity、Trend 或高价值标签 |
| 反证与风险提示 | 5 | 是否包含会削弱判断的风险变量或反证线索 |

### 6.2 运营状态

| 分数 | 状态 | 处理方式 |
|---:|---|---|
| 85-100 | `core_signal` | 进入 Daily Brief 候选，必须人工复核 |
| 70-84 | `valid_signal` | 进入 Signals 库，可关联 Opportunity 或 Trend |
| 55-69 | `watch_signal` | 进入观察池，等待更多证据 |
| 40-54 | `weak_signal` | 暂存，不进入前台 |
| 0-39 | `noise` | 标记噪音，用于优化关键词和来源 |

### 6.3 运营字段

新增字段：

- `signal_score`
- `score_breakdown`
- `source_tier`
- `source_domain`
- `source_reliability_score`
- `keyword_origin`
- `monitor_query_id`
- `monitor_batch_id`
- `dedupe_key`
- `review_status`
- `review_notes`
- `feedback_tags`
- `rejection_reason`
- `converted_to_daily`
- `converted_to_opportunity`
- `converted_to_trend`

## 7. 每日监测任务优化

每日监测不只产出内容，还要产出监测质量反馈。

### 7.1 关键词优化

每个关键词或查询组合需要记录：

- 命中数量。
- 有效 Signal 数量。
- 平均 Signal Score。
- 噪音率。
- 重复率。
- 进入 Daily Brief 的数量。
- 转化为 Opportunity 或 Trend 的数量。
- 主要来源域名。

优化规则：

- 连续多日产生高分 Signal 的关键词进入 `high_yield_keywords`。
- 连续多日只产生噪音或重复内容的关键词降权。
- 新出现的公司、产品、场景、客户类型、政策词进入 `candidate_keywords`。
- 高分 Signal 中反复出现的场景词和证据词，需要扩展中英文同义词。
- 关键词必须映射到标签体系，避免同义词失控。

### 7.2 网站与数据源优化

每个来源需要记录：

- 有效 Signal 产出率。
- 一手证据比例。
- 平均分。
- 首发/早发现能力。
- 重复转载率。
- 噪音率。
- 覆盖赛道。

来源分层：

| 层级 | 类型 | 处理 |
|---|---|---|
| S | 一手证据源 | 优先监测，例如官网、产品更新、客户案例、招投标、监管文件 |
| A | 高质量商业媒体 | 保留稳定监测，例如 WSJ、FT、Bloomberg、The Information、36氪、晚点等 |
| B | 垂直产业媒体/数据库 | 按赛道监测 |
| C | 社媒/聚合站 | 只作为线索，不直接作为高分证据 |
| D | 噪音源 | 降权或移除 |

### 7.3 每日监测输出

每日监测任务除了生成 `YYYY-MM-DD-AI商业雷达.md`，还应生成或更新：

- 当日高分 Signal 清单。
- 噪音来源清单。
- 重复候选清单。
- 新增候选关键词。
- 降权关键词。
- 高价值来源。
- 需要人工复核的边界案例。

## 8. 阶段性反馈机制

### 每日复核

负责人：Data Agent / Signal Intelligence Agent

检查：

- 今日高分 Signal 是否真的进入 Daily Brief 候选。
- 是否存在公司名标题、重复 Signal、无商业含义内容。
- 是否有裸 Markdown 链接或来源不可读问题。

### 每周优化

输出：

```text
agent-workflow/reports/signal-quality-weekly-YYYY-WW.md
```

内容：

- 高产关键词。
- 低效关键词。
- 新增关键词建议。
- 待移除关键词。
- 高价值网站或数据源。
- 噪音来源。
- Signal Score 分布。
- Daily Brief 转化率。

### 每月校准

输出：

```text
agent-workflow/reports/signal-model-calibration-YYYY-MM.md
```

内容：

- 哪些高分 Signal 最终形成 Opportunity 或 Trend。
- 哪些高分 Signal 被证明只是热度。
- 哪些低分 Signal 后续变重要。
- 是否需要调整权重。
- 是否需要新增赛道或标签。

### 季度复盘

目标：

- 调整重点赛道。
- 清理长期低效来源。
- 升级关键词体系。
- 检查模型是否过度偏向融资、媒体热度或单一赛道。

## 9. 数据字段

基础必填字段：

- `signal_id`
- `date`
- `entity`
- `event_type`
- `event_title`
- `business_meaning`
- `display_title`
- `track`
- `summary`
- `evidence`
- `source_urls`
- `related_opportunity_ids`
- `related_trend_ids`
- `tags`
- `status`

运营字段见第 6.3 节。

## 10. 展示规则

- 标题必须使用“事件 + 商业含义”，不能只是公司名。
- 公司名进入 `entity` 或代表证据字段。
- 列表卡片第一眼展示 `display_title` 和 `summary`。
- 详情页前置要闻摘要，再展示证据、商业含义、关联机会和趋势。
- 首页和 Daily Brief 只展示精选 Signals。
- 重复 Signal 不新增第二条，进入合并候选。
- 前台不直接展示完整算法细节，只展示证据强度、趋势关联和判断依据。

## 11. 首页与 Daily 联动

- 首页展示 2-3 条高价值 Signals，每条必须有一句商业含义。
- Daily Brief 中的关键 Signals 必须能回链到 Signal 详情页。
- 同一事件跨日更新时，优先补充原 Signal 的证据或更新记录。
- `core_signal` 是 Daily Brief 候选，不等于自动进入 Daily Brief。

## 12. 权限边界

| 用户状态 | 可见内容 |
|---|---|
| 访客 | 少量样例 Signal |
| 试读用户 | 部分 Signal 列表与摘要 |
| 会员 | 完整 Signal 详情 |
| 管理员 | 编辑、合并、标记噪音、维护关联、查看运营评分 |

普通前台不得出现编辑入口或后台评分配置。

## 13. 验收标准

- 每条 Signal 至少有事件、证据和商业含义。
- `display_title` 不只是公司名。
- 每条入库 Signal 有 `signal_score` 和 `score_breakdown`。
- 每日监测能记录关键词、来源、批次和去重键。
- 每周能输出关键词与来源质量报告。
- 每月能进行模型权重校准建议。
- 首页、Daily、Signals 列表的展示文案一致。
- Signal 能关联至少一个 Opportunity 或 Trend；无法关联时标记 `needs_review`。
- 重复项进入 `merge_candidates`，不直接删除。
- Markdown 链接在前台展示为可读外链文字。

