# WaveSight AI 六个自动化线程草案

日期：2026-05-14  
状态：draft / automation-thread-design  
用途：定义新内容生产体系下 6 个自动化线程的职责、输入、输出、质量门槛和 prompt 草案。  

> 本文件是自动化线程设计草案，不直接修改 Codex automation 本体、现有脚本或部署配置。后续如需落地，应另行派发自动化改造任务。

## 1. 总体原则

观澜 AI 新内容生产体系拆为 6 个逻辑任务和 6 个自动化线程：

1. `daily-monitor-router`
2. `asset-card-generator`
3. `daily-observation-writer`
4. `case-signal-researcher`
5. `trend-report-writer`
6. `brief-periodical-writer`

这些线程共享同一套资产规则：

- `content/` 承载生产过程、文章、报告和刊物。
- `knowledge/` 承载长期判断资产。
- 今日观察基于 Raw 全局理解撰写，不从精选变化卡小样本倒推。
- 变化卡、案例卡、观点卡、趋势卡和变化簇按模板入库。
- 来源与数据源必须外显；没有可靠公开数据时写“暂无公开信息”。
- 深度竞品、规模、客户需求和风险反证不压给每日监测线程。

## 2. 线程依赖

每日主链：

```text
daily-monitor-router
→ asset-card-generator
→ daily-observation-writer
```

说明：

- `daily-observation-writer` 可在 `asset-card-generator` 运行时先基于 Raw / Pool 起草。
- 最终定稿必须等待精选变化卡生成，嵌入研究入口、入选理由和来源数据。

研究支链：

```text
case-signal-researcher
```

触发式运行，不做全量每日监测。

周期深度链：

```text
trend-report-writer
brief-periodical-writer
```

按趋势门槛、用户指定方向或周期刊物节奏运行。

## 3. daily-monitor-router

### 定位

每日广泛监测线程。它负责看全市场、建立 Raw / Pool，不写今日观察长文，不生成完整知识卡，不做深度研究。

### 运行频率

每天固定运行。

### 输入

- 可执行关键词与主题配置。
- follow-builders / Builders 观点源。
- AI HOT、关键词搜索、公司公告、产品发布、融资、研究报告、开源项目、社区和市场线索。
- 付费数据库或外部数据源，如后续接入。

### 输出

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

### 数量范围

- Raw：常规 80-150 条；低信号日 50-80 条。
- Pool：20-40 条。

### 质量门槛

- 每条 Raw 必须有原始 URL 或可追溯来源。
- Raw 应覆盖公司公告、产品发布、融资、可信媒体、Builders 观点、论文 / 技术报告、开源项目、客户案例、招采、应用商店、云市场、GitHub、社区讨论等来源类型。
- Pool 必须写入池理由和淘汰风险。
- AI HOT、X、Reddit、HN、聚合页、社媒等只能作为市场线索或 source-router，不作为事实主证据。
- 同一事件多来源应合并，不堆数量。
- 低信号日必须写清来源缺口和降级原因。

### Prompt 草案

```text
你是 WaveSight AI 的 daily-monitor-router。

目标：完成今天的 AI 商业变化广泛监测，生成 Raw / Pool 和 source log。

必须遵守：
- 只做监测、初筛、去重和来源覆盖，不写今日观察长文。
- 不生成完整变化卡、案例卡、观点卡或趋势卡。
- Raw 常规 80-150 条，低信号日 50-80 条。
- Pool 20-40 条，必须写入池理由和淘汰风险。
- 每条 Raw 必须保留原始 URL 或可追溯来源。
- 社媒、榜单、社区和聚合页只能作为市场线索，不作为事实主证据。

输出：
1. Raw candidates 文件。
2. Raw originals 档案。
3. Pool candidates 文件。
4. source-router log，包含来源分布、失败来源、fallback、主题分布和证据缺口。
```

## 4. asset-card-generator

### 定位

资产卡生成线程。它把 Pool / 重要 Raw 转成 L1 变化卡、L1 案例卡、观点卡候选，并自动建立关系和变化簇。

### 运行频率

每日运行，跟随 `daily-monitor-router`。

### 输入

- 当日 Raw / Pool。
- 原始来源。
- 现有 `knowledge/` 资产库。
- `knowledge/10-Templates/` 模板。
- tag taxonomy。

### 输出

```text
01-SiteV2/knowledge/01-Change-Cards/
01-SiteV2/knowledge/02-Case-Cards/
01-SiteV2/knowledge/03-Opinion-Cards/
01-SiteV2/knowledge/05-Change-Clusters/
01-SiteV2/content/04-business-signals/
```

### 数量范围

- 变化卡候选：8-15 张。
- 今日精选变化卡：常规 5-8 张；低信号日 3-5 张；高信号日 8-12 张。
- 案例卡：按变化卡和 Pool 质量生成，不硬凑。
- 观点卡：只记录重要观点，尤其是高影响 Builders / VC / Research / Operator 观点。

### 质量门槛

变化卡必须包含 7 个必填项：

1. 变化标题。
2. 明确变化。
3. 原始出处。
4. 数据来源。
5. 一句解释。
6. 技术路线 / 方法变化。
7. 同类产品 / 相邻案例。

规则：

- 数据来源不允许为空；没有可靠来源时写“暂无公开信息”。
- 同类产品 / 相邻案例不允许为空；未发现时写“暂未监测到同类案例”。
- 可信度边界放后台。
- 自动关联默认成立，但要记录关联理由和置信度。
- 前台只展示稳定、高置信或经批量审查保留的关系。

### Prompt 草案

```text
你是 WaveSight AI 的 asset-card-generator。

目标：基于今天的 Raw / Pool，生成 L1 变化卡、L1 案例卡、观点卡候选，并更新变化簇。

必须遵守：
- 使用 knowledge/10-Templates 下的模板。
- 变化卡是主库母体，写现象；案例卡写对象；观点卡写谁怎么看。
- 变化卡 7 个必填项不得缺失。
- 数据来源无可靠公开来源时写“暂无公开信息”，不得编造。
- 同类产品 / 相邻案例未发现时写“暂未监测到同类案例”。
- 观点卡前台核心为人物 / title / 原文摘录 / 原文出处 / 观澜解读 / tags / 关联资产。
- 自动建立关联，并记录关联理由。

输出：
1. L1 变化卡。
2. L1 案例卡。
3. 观点卡候选。
4. 变化簇更新。
5. 今日精选变化卡清单，供 daily-observation-writer 定稿。
```

## 5. daily-observation-writer

### 定位

今日观察写作线程。它负责写“每个老板每天必读的一篇 AI 商业行情综述”。

### 运行频率

每日运行。

### 输入

- 当日 Raw / Pool。
- source-router log。
- 今日精选变化卡。
- 高影响观点卡。
- 相关案例卡。
- 前日 / 近期今日观察索引。

### 输出

```text
01-SiteV2/content/03-daily-observation/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

### 篇幅

- 常规日：3000-5000 字。
- 低信号日：1500-2500 字。
- 高信号日：5000-6000 字。

### 质量门槛

- 文章基于 Raw 全局理解撰写，不得只拼接精选变化卡。
- 必须说明当天市场风向、热点分布、重点变化为什么入选。
- Builders / 前沿观点如有高质量内容，应自然写入；没有则略过，不显示空模块或后台语言。
- 文中引用具体事实、数据、融资、客户、市场规模时必须有来源或数据源。
- 精选变化卡作为研究入口和证据样本，不是文章的全部来源。
- 文章和变化卡双向关联。

### Prompt 草案

```text
你是 WaveSight AI 的 daily-observation-writer。

目标：写出今天的 AI 商业行情综述，让老板一篇文章读懂今日行情。

输入：
- Raw / Pool 全量监测结果。
- 今日精选变化卡。
- 高影响观点卡。
- source-router log。

必须遵守：
- 文章基于 Raw 全局理解撰写，不从精选变化卡小样本倒推。
- 前台是一篇自然长文，不是结构化填充页。
- 必须解释今天主要热度来自哪里，哪些只是噪音，哪些有解释价值。
- 必须说明为什么选择这几张变化卡。
- 有高质量 Builders / VC / Research / Operator 观点时自然写入；没有则略过。
- 所有事实和数据必须有来源或数据源。

输出：
1. 今日观察长文。
2. 精选变化卡引用清单。
3. 来源与数据摘要。
4. Publication Index。
```

## 6. case-signal-researcher

### 定位

案例与信号补全研究线程。它负责对高价值变化卡 / 案例卡做 L2 二次搜索，不承担全量每日监测。

### 运行频率

触发式运行。

### 触发条件

- 被今日观察引用。
- 多次关联。
- 进入“正在升温”状态。
- 属于趋势候选。
- 被用户标记重点。
- 适合二创、趋势报告或商业内参。

### 输入

- 高价值变化卡。
- 高价值案例卡。
- 相关 Raw / Pool。
- 关联观点卡。
- 现有同类案例、趋势卡和变化簇。

### 输出

```text
01-SiteV2/knowledge/01-Change-Cards/
01-SiteV2/knowledge/02-Case-Cards/
01-SiteV2/content/05-case-research/
agent-workflow/reports/
```

### 质量门槛

L2 研究应补充：

- 同行 / 竞品。
- 赛道前景。
- 市场规模 / 机构估算。
- 客户需求。
- 商业模式。
- 竞争分析。
- 风险与反证。

规则：

- 不要求每张 L1 监测卡都补全 L2。
- 没有公开信息时写“暂无公开信息”，不得编造。
- 市场规模和付费数据必须带数据源。
- 竞争分析必须基于真实公司、产品、客户、定价、技术路线或来源，不写空泛 SWOT。

### Prompt 草案

```text
你是 WaveSight AI 的 case-signal-researcher。

目标：对被触发的高价值变化卡 / 案例卡进行 L2 二次搜索和研究补全。

必须遵守：
- 不做全量每日监测。
- 只研究已触发的变化卡 / 案例卡。
- 补同行 / 竞品、赛道前景、市场规模、客户需求、商业模式、竞争分析、风险与反证。
- 有数字必须有数据源；无公开信息写“暂无公开信息”。
- 输出更新到知识库卡片，并保留研究摘要。

输出：
1. 更新后的 L2 变化卡 / 案例卡。
2. case research 摘要。
3. 新增关联和证据缺口。
```

## 7. trend-report-writer

### 定位

趋势追踪深度报告线程。趋势追踪是“深度长文报告 + 趋势卡”双一等对象。

### 运行频率

周度、触发式或用户指定。

### 触发条件

- 变化簇达到趋势门槛。
- 用户指定方向。
- 某方向连续出现高价值变化。
- 商业内参需要前置趋势研究。

### 输入

- 变化簇。
- 趋势卡候选。
- L2 变化卡和案例卡。
- 观点卡。
- 来源与数据。
- 近期今日观察。

### 输出

```text
01-SiteV2/content/06-trend-reports/
01-SiteV2/knowledge/04-Trend-Cards/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

### 篇幅

- 常规趋势报告：8000-15000 字。
- 重点赛道报告：15000-30000 字。
- 轻量追踪更新：3000-6000 字。

### 质量门槛

趋势报告应覆盖：

- 行业分析。
- 赛道分析。
- 公司分析。
- 竞品分析。
- 技术路线。
- 客户需求。
- 商业案例。
- 变化簇。
- 观点分歧。
- 风险与反证。
- 观澜判断。

趋势卡最低门槛：

- 至少 3 张相关变化卡。
- 至少 2 个不同案例或对象。
- 至少 2 类来源。
- 至少 1 条技术路线或场景进程说明。

### Prompt 草案

```text
你是 WaveSight AI 的 trend-report-writer。

目标：基于变化簇、趋势卡、变化卡、案例卡、观点卡和来源数据，写一篇趋势追踪深度研究报告，并更新趋势卡。

必须遵守：
- 趋势追踪不是卡片聚合页，而是深度长文报告 + 趋势卡。
- 报告要像研究报告，不是结构化填空。
- 必须覆盖行业、赛道、公司、竞品、技术路线、客户需求、商业案例、观点分歧、风险反证。
- 趋势卡不由单条新闻或单个观点生成。
- 所有事实和数据必须可追溯。

输出：
1. 趋势深度报告。
2. 更新后的趋势卡。
3. Publication Index。
4. 关联资产回链建议。
```

## 8. brief-periodical-writer

### 定位

商业内参周期刊物线程。商业内参是周期性 AI 商业观察刊物，不是每日观察拼贴，也不是结构化模块填充页。

### 运行频率

- 默认周刊。
- 内容不足可合并半月刊。
- 内容更少时可做月刊。
- 重大主题可出专题增刊。

### 输入

- 周期内今日观察。
- 变化卡。
- 案例卡。
- 趋势报告。
- 趋势卡。
- 前沿观点。
- 二创反馈。
- 用户问题和反馈。

### 输出

```text
01-SiteV2/content/07-business-briefs/
01-SiteV2/content/08-publication-index/
01-SiteV2/knowledge/09-Publication-Index/
```

### 固定骨架

1. 本期总判断。
2. 周期行情回看。
3. 关键变化复盘。
4. 重点案例观察。
5. 趋势修正。
6. 前沿观点。
7. 下周期观察。
8. 内容选题池。
9. 来源与数据附录。

### 质量门槛

- 必须是一期完整刊物文章。
- 不照搬每日观察，而是基于周期内事件重新融合、修正和升级。
- 下周期观察必须基于已出现线索，不写空泛预测。
- 内容选题池可内部可见，不一定前台完整展示。
- 事实和数据必须有来源或数据源。

### Prompt 草案

```text
你是 WaveSight AI 的 brief-periodical-writer。

目标：写一期商业内参周期刊物，对一个周期内的观察、案例、趋势和前沿观点进行融合、修正和升级。

必须遵守：
- 商业内参是刊物文章，不是结构化填充页。
- 不照搬每日观察。
- 要回答这个周期真正发生了什么，哪些热点后来只是噪音，哪些变化被增强、修正或降温。
- 下周期观察必须基于已出现线索。
- 事实和数据必须有来源或数据源。

输出：
1. 商业内参刊物正文。
2. Publication Index。
3. 关联资产回链建议。
4. 内容选题池。
```

## 9. 待落地事项

1. 将本草案拆为 6 个正式自动化 prompt 文件。
2. 更新现有 `v2-content-site-daily-update` 自动化，或新建 6 条自动化。
3. 改造 `run-v2-daily-pipeline.mjs`，使其只承担 `daily-monitor-router` 范围或拆分脚本。
4. 为 `asset-card-generator` 增加模板校验。
5. 为 `daily-observation-writer` 增加今日观察文章质量门槛。
6. 为 `case-signal-researcher` 增加触发队列。
7. 为 `trend-report-writer` 增加趋势门槛检查。
8. 为 `brief-periodical-writer` 增加周期素材聚合。
9. 更新 `quality-gates` 和 `v2content` gate，使其识别新目录结构。
10. 将新战略草案升级为正式治理文件前，继续人工复核。

