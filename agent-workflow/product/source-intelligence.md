# Source Intelligence Model

更新时间：2026-05-20
owner：`intelligence-engine`
状态：active-v2.1

## 1. 核心口径

来源治理只回答两个问题：

- 这条材料从哪里来。
- 这条材料能证明什么。

它不回答“这条内容值不值得写”。内容价值只来自事件、变化、客户、案例、流程、预算、收入、成本、风险、监管、部署和趋势连接。

`S / A / B / C / D / M` 只区分来源类型与证据边界，不是价值评级，不得层层加分。

AI HOT daily 和 follow-builders 是精选入口，可以给更高采集权重；这个权重来自“精选入口”，不来自 `S/A/B/C/D/M`。

## 2. 来源类型

| 标记 | 类型 | 可证明内容 | 不可证明内容 |
|---|---|---|---|
| S | 海外一手事件源 | 海外大厂或项目方的明确发布、上线、客户、合作、监管、采购、版本变化 | 官网首页、产品陈列、目录、登录页、泛介绍 |
| A | 高质量报道 / 研究 | 具体事件报道、融资报道、监管报道、权威研究结论 | 评论、榜单、趋势综述自动变成事实 |
| B | 垂直行业 / 融资 / 生态来源 | 原文中已经写清的产品、融资、客户、市场、生态或行业变化 | 无原文的二手转述、只有页面存在但无变化 |
| C | 社区 / 观点 / 讨论 | 谁在何时何处说了什么、用户反馈、开发者阻力、讨论升温 | 公司动作、客户采用、收入、融资、市场规模 |
| D | 噪音 / SEO / 无事件页面 | 通常不采信 | 核心 Raw、Pool、前台事实 |
| M | 采集入口 | 发现线索 | 事实证据 |

## 3. S 类

S 只看海外一手事件源。

可以进入 S 的材料必须同时满足：

- 来源来自海外大厂、项目方、监管机构、采购机构或交易披露主体。
- 页面本身是事件或变化。
- 有明确主体、时间和动作。

S 的典型材料：

- 官方新闻、公告、release note、changelog。
- 客户案例、合作公告、上线公告。
- 监管文件、采购公告、证券披露。
- 官方仓库的 release / changelog / security advisory。
- 创始人、高管或项目方原帖，且保存可见文本、发布时间和抓取时间。

不得写成 S 的材料：

- 官网首页。
- 产品页、Demo 页、产品目录。
- 文档首页、API / SDK 目录。
- 价格导航页。
- GitHub README 或 repo index。
- Hugging Face / npm / PyPI 包页或模型页。
- 控制台、登录页、搜索结果页。
- 百度、阿里云、腾讯云、华为云、火山引擎等国内厂商官网和 SEO 页面。

国内大厂材料如有明确事件，可作为 B 类行业/厂商线索处理；不得作为 S 类主来源。

## 4. A 类

A 类是高质量转述或研究来源。

可以进入 A 的材料：

- Reuters、Bloomberg、FT、WSJ、The Information、Axios、TechCrunch、CNBC、VentureBeat、Sifted 等具体事件报道。
- 权威研究机构、行业协会、大学、正式技术报告。
- 明确说明融资、并购、监管、诉讼、客户、产品上线或市场变化的报道。

不得写成 A 的材料：

- 评论文章。
- 趋势综述。
- 榜单。
- 访谈摘要。
- 无主体、无时间、无动作的媒体内容。

A 类可以作为事实依据；是否进入 Pool 仍看事件和商业变化。

## 5. B 类

B 类是垂直行业、融资、生态和创业公司来源。

B 类有原文即可采信，不要求强制回到 S/A 补证。

可以进入 B 的材料：

- Crunchbase、Dealroom、PitchBook、YC、投资机构公告。
- 垂直行业媒体、垂直行业报告、产业数据库。
- Product Hunt、Marketplace、云市场、插件市场中有明确发布、客户、评价或分发变化的页面。
- 开源项目、包、模型、框架、SDK 的原文页面。
- 中小创业公司官网中的明确发布、客户、融资、部署、定价或岗位流程变化。

B 类不得只靠“页面存在”入池。页面必须写出具体变化，否则只保留 `index_only` 或 `watchlist`。

## 6. C 类

C 类用于捕捉早期反馈和观点。

可以进入 C 的材料：

- X / LinkedIn / Reddit / Hacker News / Discord / Telegram。
- GitHub issue / discussion。
- newsletter、播客、Builder 观点。
- follow-builders 原帖。

C 类可证明：

- 有人在讨论。
- 某类用户有反馈。
- 某个痛点升温。
- 某个 Builder 或创始人表达了观点。

C 类不能单独证明：

- 公司动作。
- 客户采用。
- 收入、融资、估值。
- 采购、监管、市场规模。

## 7. M 类

M 是采集入口，不是证据等级。

M 包括：

- AI HOT。
- follow-builders。
- 搜索聚合。
- RSS 聚合。
- 自动摘要。
- 榜单聚合。

AI HOT daily 是每日精选，必须完整保留，并给更高采集权重。它不自动进入 `core_pool`。

follow-builders 是精选 Builder 入口，必须完整扫描，并给更高采集权重。它默认先进入 `opinion_intake`，入库时写入中文翻译；涉及事实主张时，按原文来源重新判定。前沿观点进入前台前必须完成中文翻译并执行四档评级：`feature` / `sidebar` / `archive` / `discard`。

## 8. 搜索路径

搜索路径只代表采集意图，不代表证据等级。

当前路径：

- `official_original`
- `developer_ecosystem`
- `capital_startup`
- `industry_landing`
- `procurement_marketplace`
- `a_media_gdelt`
- `community_feedback`

任何路径命中的页面，都必须重新判断页面类型和正文证据。

HN / Reddit / X 只允许作为社区反馈路径的一部分，不得挤占海外大厂、垂直赛道产品、融资和行业落地新闻的采集量。

## 9. 噪音与硬降级

以下页面默认不得进入 `core_pool`：

- 官网首页。
- 产品陈列页。
- 文档目录。
- 价格导航页。
- README / repo index。
- 包页 / 模型页。
- Marketplace listing。
- 搜索结果页。
- AI 工具导航页。
- 中文 SEO 页面。
- 百度、阿里云等国内官网首页。

只有同一页面写明具体时间、主体和新增动作时，才允许重新判定。

## 10. 自动化要求

每日监测必须：

- 保留 AI HOT daily 和 follow-builders 的精选权重。
- 不使用 `S/A/B/C/D/M` 做内容价值加分。
- 将 Raw 目标理解为至少 150 条 active Raw candidates；Pool 至少 75 条，Core Pool 至少 30 条。不得回退到旧版 80-150 / 20-40 口径。
- 搜索结果优先补海外大厂事件、垂直产品、融资、客户和行业落地。
- 资本市场信号必须单独覆盖：YC 等知名机构投资、垂直赛道融资、前沿技术投资。
- 把 HN / 社区结果控制为反馈补充。
- 在日志中写清 `source_distribution`、`keyword_search_path_distribution`、`evidence_gaps` 和 `failed_sources`。
