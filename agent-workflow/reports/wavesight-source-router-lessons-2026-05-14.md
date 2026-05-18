# WaveSight Source Router 旧规则复用建议

日期：2026-05-14  
状态：draft / source-router-lessons  
用途：读取旧关键词表、source registry、自动化监测任务和 source-router 脚本后，总结可复用规则，避免新 6 线程监测出现来源单一、内容单一。

## 1. 已读取的关键文件

- `agent-workflow/product/source-intelligence.md`
- `01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/10-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/10-databases/source-registry-v2.json`
- `agent-workflow/tools/run-v2-daily-pipeline.mjs`
- `C:\Users\86186\.codex\automations\v2-content-site-daily-update\automation.toml`
- `agent-workflow/reports/WSD-20260510-09-v2-aihot-daily-pipeline-upgrade-closeout.md`
- `agent-workflow/reports/WSD-20260511-10-v2-keyword-monitoring-algorithm-fix-closeout.md`
- `agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage1.md`

## 2. 可直接复用的旧经验

### 2.1 三路 source-router 不能丢

旧系统已经形成稳定三路：

1. `AI HOT`：高通量热点与中文 AI 圈趋势密度。
2. `follow-builders`：Builder / Founder / Operator / Engineering practice 观点雷达。
3. `联网关键词搜索`：观澜主动搜索，覆盖融资、产品、客户、监管、反证和商业事实。

建议新 `daily-monitor-router` 继续保留这三路为核心入口。

关键复用点：

- AI HOT 和 keyword-search 是主数量池。
- follow-builders 全量扫描，不设固定 Raw / Pool 比例。
- 三者都只是 discovery / source-router，不能直接当事实主证据。
- 进入变化卡、案例卡、今日观察事实判断前，必须回看原始 URL 或补 S/A/B 来源。

### 2.2 关键词主题表值得保留

旧 `keyword-monitoring-v2.json` 已经把关键词拆成 7 组：

1. 企业 Agent / 治理。
2. 模型能力 / 成本变化。
3. 开发者工具 / 开源生态。
4. 垂直行业 / 客户采用。
5. 融资 / VC / 市场信号。
6. 监管 / 风险 / 反证。
7. 中国市场 / 本地迁移。

这些组能有效避免自动化长期偏向“企业 Agent / MCP / 治理”。

建议在新体系中继续作为 `daily-monitor-router` 的基础主题组，但名称和用途应从旧 Signal 口径升级为新资产口径：

- 变化卡候选主题组。
- 案例卡候选主题组。
- 前沿观点主题组。
- 风险 / 反证主题组。

### 2.3 主题多样性硬闸门值得保留

旧规则中最有价值的防偏机制：

- Raw 单一主题默认不得超过 35%。
- 超过 40% 输出 `theme_concentration_warning`。
- Structured 同一主题默认最多 4 条。
- Front Signal 默认同一主题最多 1 条，主题日最多 2 条。

新体系不再使用 Structured / Front Signal 作为核心分层，但逻辑可以迁移为：

- Raw 单一主题默认不得超过 35%。
- Pool 单一主题默认不得超过 40%。
- 今日精选变化卡默认同一主题最多 2 张；主题日最多 3 张，并必须说明原因。
- 今日观察文章必须说明当天是否为主题日，不能让文章只被单一主题牵着走。
- 变化卡候选如集中在一个主题，必须至少补充风险、反证、垂直行业、开发者生态或融资市场信号中的一类。

### 2.4 source registry 的“通道不等于证据”规则必须保留

旧 `source-registry-v2.json` 的核心价值：

> 来源等级分类的是解析后的原始来源，不是采集通道。

这条必须继续保留。

新体系建议：

- AI HOT、follow-builders、HN、X、Reddit、聚合页、搜索结果页都标记为 source-router / lead-only。
- 变化卡的“原始出处”必须尽量指向公司公告、产品页、原始博客、论文、客户案例、财报、监管文件、正式报道等。
- 观点卡可以使用 follow-builders / X / Blog / Podcast 作为原文出处，但事实声明仍需另找事实来源。
- 今日观察可引用市场线索，但必须区分“事实”“观点”“市场线索”。

### 2.5 旧 source registry 覆盖面值得借鉴

旧 registry 覆盖来源类型：

- 官方产品 / 公司博客：OpenAI、Anthropic、Google / DeepMind、Microsoft、GitHub、NVIDIA 等。
- A 级媒体：Reuters、TechCrunch、VentureBeat 等。
- 开发者 / 研究：GitHub、arXiv、Hugging Face。
- 融资 / VC：YC、a16z、Sequoia、Crunchbase 等。
- 市场与分发：AWS Marketplace、Azure Marketplace、Product Hunt。
- 社区与观点：HN、Reddit、X / follow-builders。

新 `daily-monitor-router` 不应该只依赖三路中的某一路，而应把三路当作入口，再主动回看这些来源类型。

### 2.6 旧脚本里的实现可复用

`run-v2-daily-pipeline.mjs` 已有可复用能力：

- 读取关键词配置。
- 通过 `laneQueries()` 把每个主题组映射到 keyword_search / HN / GDELT / builder_proxy。
- 对候选赋予 `theme`、`theme_label`、`keyword_group`。
- 计算 `keyword_group_distribution` 和 `theme_distribution`。
- 计算 `theme_concentration_warning`。
- 通过 `diversifyByTheme()` 做 Raw 主题分散排序。
- 并行采集 AI HOT、follow-builders、keyword-search、HN、GDELT。
- 优先调用本地 follow-builders skill，失败后用 proxy。
- 写 source-router log。

这些都应该迁移到新的 `daily-monitor-router`。

## 3. 当前新目录带来的路径问题

我们已按新战略重建 `content/`，旧内容归档到：

```text
01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/
```

因此旧自动化和脚本存在路径不匹配：

- 旧脚本读取：`01-SiteV2/content/10-databases/keyword-monitoring-v2.json`
- 新目录应使用：`01-SiteV2/content/09-databases/keyword-monitoring-v2.json`

同样，旧脚本输出：

- `05-trend-chain/`
- `07-points/`

新目录已不再使用这些旧路径。

建议后续改造：

- 将 `keyword-monitoring-v2.json` 和 `source-registry-v2.json` 从归档复制到新 `09-databases/`。
- 更新 `run-v2-daily-pipeline.mjs` 或新建 `daily-monitor-router.mjs`，使其读取新路径。
- 将旧 Heat Candidate 输出改为 `knowledge/05-Change-Clusters/` 或 `content/04-business-signals/` 的候选索引。
- 将旧 builders-viewpoints 输出改为 `knowledge/03-Opinion-Cards/` 和 `knowledge/07-People/`。

## 4. 对新 6 线程的具体借鉴

### 4.1 daily-monitor-router

必须继承：

- 三路 source-router。
- 7 组关键词主题。
- 主题多样性闸门。
- source registry。
- source-router log。
- failed_sources / fallback_used / evidence_gaps。

建议新输出字段：

- `raw_count_by_channel`
- `raw_count_by_source_type`
- `keyword_group_distribution`
- `theme_distribution`
- `theme_concentration_warning`
- `source_level_distribution`
- `market_signal_vs_fact_source`
- `resolved_original_url_rate`

### 4.2 asset-card-generator

借鉴旧规则：

- AI HOT / keyword-search / follow-builders 只触发卡片候选。
- 正式变化卡必须有原始出处。
- 数据源无可靠信息时写“暂无公开信息”。
- 观点卡不能替代事实主证据。
- theme / keyword_group 可用于初步 tags 和变化簇，但不能直接等于正式 tag。

### 4.3 daily-observation-writer

借鉴旧规则：

- 文章基于 Raw 全局理解。
- 不得被单一主题垄断。
- 可写市场热度和讨论升温，但必须区分事实和线索。
- 如果当天单一主题确实主导，应标记为“主题日”并说明为什么。

### 4.4 case-signal-researcher

借鉴旧 source registry：

- 回找公司公告、产品页、客户案例、融资公告、投资方博客、云市场、GitHub、招聘页、监管 / 采购文件。
- 社区热度、GitHub stars、Product Hunt 只能作为弱证据或行为信号。
- 竞品和市场规模必须二次搜索，不压给 daily-monitor-router。

### 4.5 trend-report-writer

借鉴旧 Heat Candidate 规则：

- 多日重复出现的主题才进入趋势候选。
- 只来自 M/C 来源且无法补证的内容只能保留为市场线索。
- 风险、监管、诉讼、安全、成本压力、客户流失应优先作为反证或风险趋势材料。

### 4.6 brief-periodical-writer

借鉴旧 weekly source intelligence：

- 周期刊物应复盘高产来源、低效来源、高产关键词、低效关键词、早期信号覆盖、技术迭代覆盖、垂直采用覆盖、反证覆盖和 Builder 池变化。
- 商业内参不是每日内容拼贴，而是周期内信号的二次融合、修正和升级。

## 5. 建议保留的反单一规则

### 来源反单一

- 每日必须至少覆盖 AI HOT、keyword-search、follow-builders 三路。
- 如三路任一失败，必须记录失败与 fallback。
- 不得只凭 AI HOT 完成今日观察。
- 不得只凭 follow-builders 写今日观点或趋势。
- 不得只凭搜索结果页写变化卡。

### 主题反单一

- Raw 单一主题默认不得超过 35%。
- Pool 单一主题默认不得超过 40%。
- 今日精选变化卡默认至少覆盖 4 个主题组；低信号日不少于 3 个。
- 单一主题日必须写明 `theme_day=true` 和原因。

### 证据反单一

- 变化卡必须区分原始出处和数据来源。
- 案例卡 L2 必须补竞品 / 同行或明确“暂未监测到明确同行或相邻案例”。
- 观点卡不能作为事实主证据。
- 趋势卡不能由单条新闻、单个观点或单一来源成立。

## 6. 建议下一步

1. 把归档中的 `keyword-monitoring-v2.json` 和 `source-registry-v2.json` 恢复到新目录：

```text
01-SiteV2/content/09-databases/
```

2. 新建或改造 `daily-monitor-router` 脚本，继承旧 `run-v2-daily-pipeline.mjs` 的三路采集、关键词读取、主题分散和日志能力。

3. 更新 6 线程草案，把本报告中的反单一规则写入 `daily-monitor-router` 和 `asset-card-generator`。

4. 之后再考虑是否拆分 6 个正式 prompt 文件或新建 automation。

