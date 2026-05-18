# Source Intelligence Model

更新时间：2026-05-18  
owner：`data-agent` / `workflow`  
状态：active

## 1. 定位

Source Intelligence 是观澜AI的输入质量治理模型。

它负责管理：

- 每日 Raw / Pool / 商业信号的监测来源。
- 前沿观点的人物、观点和原文来源。
- 关键词池。
- 查询组合。
- 噪音来源。
- 来源升权、降权和淘汰。
- Raw 原始证据的可用性门槛。当前 Raw 结构以 `agent-workflow/product/raw-evidence-schema.md` 为准。

目标是让观澜AI不是被热点牵着走，而是持续拥有更高质量、更早、更可验证的 AI 商业判断输入。

来源治理必须同时覆盖：

```text
成熟信号：大企业、大融资、大平台动作
早期信号：pre-seed / seed / angel / grant / accelerator / spinout
技术信号：模型能力、成本、协议、工具链、部署方式
开发者信号：开源项目、SDK、框架、插件市场、GitHub 采用
需求信号：设计伙伴、试点客户、首批客户、采购和招投标
反证信号：关闭、流失、毛利压力、诉讼、安全、隐私、监管执法
```

2026-05-17 当前可执行关键词表先把每日 Raw 入口压实为 4 个必须覆盖的监测层：

```text
成熟信号：大企业、大融资、并购、平台发布、客户采用、收入、定价和生态发布
早期信号：pre-seed、seed、angel、grant、YC、accelerator、stealth、spinout 和新投资方向
技术迭代信号：成本、能力、部署、协议、工具链、运行时、沙箱和评测变化
开发者生态信号：开源、SDK、框架、插件市场、GitHub 采用、云市场上架和开发者分发
```

这 4 类是日常监测入口的硬覆盖，不等于放弃销售、客服、营销、RAG、机器人等赛道。它们通过 `p0_core_tracks` 和 `p1_evidence_terms` 嵌入每类查询组合。

P0 赛道词是锚点，不是边界。每日监测必须保留外围探索层，持续扫描当前 P0 没覆盖的新行业、新岗位、新流程、新客户和弱变化。2026-05-17 起，关键词表加入 `outside-core-exploration`，用于防止所有内容被固定赛道锁死。

keyword-search 不能再使用单一路径。2026-05-17 起，keyword-search 必须按搜索意图走多路搜索：官方原始路径、开发生态路径、资本与创业公司路径、行业落地路径、采购 / 招投标 / Marketplace 路径、A 级媒体 / GDELT 路径、社区反馈路径。HN / Reddit / X 等社区路径只说明讨论、反馈、痛点和热度，不能作为唯一 keyword-search 结果，也不能单独支撑事实判断。

## 2. 来源等级与采集通道

S / A / B / C / D 是“来源证据等级”，只回答一件事：这条 Raw 能不能作为事实依据。它不回答“值不值得写”，也不等同于内容重要性。

M 不是事实证据等级，而是采集通道等级。AI HOT、follow-builders、搜索聚合、RSS 聚合流等默认写入 `acquisition_source_level=M`；回到原始页面或原帖后，再给正式 Raw 判定 `source_level=S/A/B/C/D`。

来源可信度和商业信号价值必须拆开：

- 一条 C 级来源，如果 `emerging_signal_score` 高，可以进入 Emerging Pool、User Feedback Pool 或 Watchlist。
- 一条 S 级来源，如果只是官方通稿、没有商业变化，也可以不进入 Pool。
- Pool 分流由商业价值、早期信号、证据强度、案例细节、趋势相关度共同决定，不能由来源等级单独决定。
- Pool 分流的唯一细则文档是 `agent-workflow/product/pool-routing-rules.md`；本文件只定义来源治理和采集通道，不另行定义 Pool 入池标准。

| 标记 | 类型 | 处理规则 |
|---|---|---|
| S | 一手事实来源 | 可作为事实主证据，但必须区分“官方说法”和“真实客户采用” |
| A | 高质量转述 / 权威研究 | 可作为事实证据，重要事件尽量回找 S 级原始来源 |
| B | 行业 / 生态 / 垂直来源 | 适合发现行业场景、客户采用、融资、生态变化和早期产品 |
| C | 社区 / 社媒 / 聚合 / 讨论来源 | 适合发现线索、情绪、开发者反馈、用户痛点和早期热度 |
| M | 混合获取通道 / 发现入口 | 只用于 `acquisition_source_level`，不是正式事实证据等级 |
| D | 噪音或低可信来源 | 降权或移除 |

### S｜一手事实来源

包括：

- 公司官网、官方博客、新闻稿。
- 产品文档、API 文档、SDK changelog、价格页。
- 客户案例、合作公告、上线公告。
- 监管文件、采购公告、证券披露。
- 官方 GitHub release、README、changelog、官方仓库说明。
- 项目方官方 Hugging Face 模型页。
- 项目方官方 npm / PyPI 包页面。
- 小创业公司官网、产品页、Demo 页面。
- 创始人 / 高管 / 项目方原帖。

创始人 X 原帖可视为 S 级一手来源，但 `source_volatility=high`，必须保存截图或快照、当时可见文本和抓取时间。

### A｜高质量转述 / 权威研究

包括：

- Reuters、Bloomberg、FT、WSJ、The Information、Axios、TechCrunch 等。
- 权威研究机构、大学、CNCF、行业协会。
- 投资机构深度研究。
- 高质量商业媒体的独家报道或深度报道。
- 正式技术报告、会议论文、权威 benchmark 报告。

arXiv 预印本必须标记 `research_status=preprint`，不能直接等同于已验证结论。

### B｜行业 / 生态 / 垂直来源

包括：

- 垂直行业媒体。
- Crunchbase、Dealroom、PitchBook 等融资数据库。
- YC、VC 机构公告或项目介绍。
- Product Hunt 项目页。
- Hugging Face / npm / PyPI / 云市场 / 插件市场中的非官方榜单、推荐页、评论区。
- 第三方开源项目整理页、awesome list、生态地图。
- 垂直行业报告、Newsletter 深度整理。

如果页面是项目方官方发布页，应上调为 S；如果只是榜单、推荐或评论，保持 B/C。

### C｜社区 / 社媒 / 聚合 / 讨论来源

包括：

- X / Twitter、Reddit、Hacker News、Discord / Telegram。
- GitHub Trending。
- AI newsletter 的转述段落。
- 二次搬运、聚合站。
- 普通社群讨论、用户评论、论坛反馈。

C 级可以说明“有人在讨论”“开发者有反馈”“某个痛点升温”“某个方向开始被关注”，但不能单独证明公司动作、客户采用、收入、融资或市场规模。

C 级不是低价值。C 级可以进入 Emerging Pool、User Feedback Pool 或 Watchlist；进入正式前台内容前必须回源补证。

### M｜混合获取通道 / 发现入口

包括：

- AI HOT。
- follow-builders。
- 搜索聚合结果。
- 自动化摘要源。
- RSS 聚合流。
- 榜单聚合页。

M 只用于发现候选线索，不直接作为正式事实证据。系统必须提取 `origin_url`，优先回到原始页面抓取全文、快照、关键证据和商业要素。原始页面抓取成功后，以原始页面重新判定 S/A/B/C/D。无法回源时，M 来源可见文本只能作为 `discovery_only` / `weak_signal`，不得作为案例库、变化库、今日观察或商业内参的核心证据。

### 采信原则

- 变化卡、案例卡、趋势报告、今日观察和商业内参里的事实判断，必须同时满足 Raw 证据门槛：`has_full_text=true`、`extraction_quality=high|medium`，并且能从 `key_excerpts`、`business_elements` 或 `evidence_seed` 回源。
- 观点卡的主证据是“谁在何时何处说了什么”：必须保存人物 / title、原文链接、原文摘录或当时可见文本、发布时间、抓取时间和观察边界 / `capture_scope`。观点里的公司动作、客户采用、融资、收入、市场规模等事实主张，必须另找 S/A/B 来源补证。
- S/A/B 可作为事实证据，但仍要看是否有商业变化；没有变化的材料只保留索引或归档。
- C 级来源和 M 级采集通道可触发早期观察、用户反馈观察和补证任务，但不得单独写成事实结论。
- 不满足 Raw 证据门槛的材料只作为 discovery、热度或待补证线索。不能因为来源名看起来可靠就跳过正文质量检查。

## 3. Raw / 商业信号来源池

### 3.0 三段式默认入口

每日 Raw 默认采用三段式入口：

```text
AI HOT 全量
→ follow-builders 全量
→ 关键词规则补齐
→ 不足或重要卡片缺证时，启动外部多路搜索
```

- AI HOT 使用最近 24 小时 `mode=all`，作为 Raw 主发现入口。它先经过类目、关键词、商业动作和噪音过滤；`industry`、`ai-products`、`ai-models` 默认进入候选；`paper` 必须命中技术迭代词、商业动作、开发者生态词或明确应用场景才进入候选；`tip` 必须命中关键词或商业动作才进入候选。
- AI HOT 不是事实来源。它只回答“哪里有线索”，不回答“事实是否成立”。进入重要卡片、今日观察、趋势报告或商业内参前，必须回到 `origin_url` / `original_url` 抓取全文并重新判定 S/A/B/C/D。
- follow-builders 每日全量进入前沿观点库，用于沉淀人物观点、观点时间线、分歧、转向和被验证 / 被反证线索。Builder 观点可以触发变化卡和趋势观察，但涉及公司动作、客户采用、融资、收入、市场规模等事实时，必须另找 S/A/B 来源。
- 关键词规则负责补齐 P0 赛道、P1 证据词、四类信号和外围探索，不再只做精确短语匹配。它要识别公司动作、产品变化、融资、部署、定价、客户、工作流、合规、开发生态等商业要素。
- 外部多路搜索是补齐和补证工具，不是默认抢主入口。只有默认入口不足 Raw 目标、某类信号缺口明显、或重要卡片没有 S/A/B 证据时才启动。

### 3.1 S 级优先来源

#### 公司与产品一手来源

- 公司官网、产品更新、官方博客、新闻稿。
- 开发者文档、API 文档、SDK changelog、价格页。
- 客户案例、合作公告、上线公告、设计伙伴公告。
- 招聘页、岗位变化、解决方案页面。

采信规则：

- 产品发布必须说明商业变化：客户、成本、渠道、开发者采用、部署门槛或收入模式。
- 定价页和 API 文档变化可作为推理成本、模型路由、开发者生态变化的早期证据。

#### 监管、采购与交易来源

- 监管文件、政策文件、执法公告。
- 招投标公告、政府采购、企业采购公告。
- 并购公告、上市公司披露、证券文件。
- 合同公告、合作协议、客户上线公告。

采信规则：

- 采购、招投标和监管可以作为需求侧或反证强证据。
- 需要区分招标、入围、中标、上线和续约，不混写。

#### 开发者与生态一手来源

- GitHub 官方仓库、release notes、issue / discussion 中的企业采用线索。
- npm、PyPI、Docker Hub、Hugging Face、ModelScope。
- Chrome Web Store、App Store、Slack / Teams / Salesforce / HubSpot / Shopify 插件市场。
- AWS Marketplace、Azure Marketplace、Google Cloud Marketplace。

采信规则：

- GitHub stars 只是线索；企业集成、release 频率、云市场上架、商业公司支持、融资或客户采用才可提升为 Signal 证据。
- 开源项目如涉及 license、商业化、云托管或企业客户，应优先复核。

### 3.2 A 级商业媒体

海外：

- WSJ
- FT
- Bloomberg
- The Information
- Reuters
- TechCrunch
- Axios
- CNBC
- VentureBeat
- Sifted

中文：

- 36氪
- 晚点
- 甲子光年
- 钛媒体
- 财新
- 机器之心
- 量子位
- 投中网

采信规则：

- A 级媒体适合发现融资、并购、平台动作和行业大变化。
- 若报道来自融资稿或独家采访，应尽量回找公司公告、投资方公告或产品页面。

### 3.3 B 级行业与数据来源

#### 融资与早期投资来源

- Crunchbase、PitchBook、Dealroom、Tracxn、CB Insights。
- YC、a16z、Sequoia、Index、Lightspeed、General Catalyst、Bessemer、Accel、Menlo、Founders Fund、Khosla、Lux、NEA、IVP 等机构公告。
- 加速器 Demo Day、university spinout、research spinout、grant、SBIR、NSF、EU grant、产业基金公告。
- 中文融资数据库、创投媒体、工商变更和基金公告。

采信规则：

- pre-seed / seed / angel / grant / accelerator 只作为早期线索；必须说明投向的新方向、技术路径、客户试点或生态变化。
- 小额融资不因金额低而过滤，但缺商业证据时不打高分。

#### 垂直行业来源

- 医疗：医疗器械注册、医院采购、临床试点、医疗 IT 媒体。
- 金融 / 保险：监管沙盒、保险理赔、银行科技、投研工作流案例。
- 法务 / 会计 / 专业服务：律所、会计师事务所、合规科技、专业服务 SaaS。
- 工业 / 制造 / 能源：工业软件、质检、设备维护、能源调度、工程仿真。
- 物流 / 建筑 / 教育：行业招投标、客户案例、垂直平台公告。

采信规则：

- 垂直行业来源适合补“谁在试用、谁在采购、替代什么流程”。
- 行业媒体报道必须回看客户、采购、监管或产品来源，避免把宣传稿当需求证据。

#### 采用与评价来源

- G2、Product Hunt、StackShare、Reddit / Hacker News 线索。
- 云市场、插件市场、应用商店评价。
- 企业客户案例、社区讨论、开发者 issue。

采信规则：

- 评价和社区讨论只能作为弱证据；若连续出现相同痛点，可进入候选关键词或反证观察。

### 3.4 C 级线索来源

- X / Twitter、LinkedIn、Reddit、Hacker News、Discord、Telegram。
- GitHub Trending、AI newsletter、聚合站。
- 二次搬运博客、SEO 内容站。

处理规则：

- 只用于发现线索、关键词和新公司。
- 不直接作为高分 Signal 证据。
- 必须回找 S/A/B 来源后才能写入正式 Signal。

### 3.5 D 级噪音来源

- 纯工具导航站。
- 无来源搬运站。
- 标题党。
- 只做教程、prompt 模板或 affiliate 内容的网站。
- 与 AI 商业机会无关的泛科技资讯。

处理规则：

- 连续污染结果的来源进入降权或淘汰。
- 自动化报告中记录噪音来源，不进入前台。

## 4. 早期信号采信规则

早期信号不是“更低标准”，而是“更早阶段的证据结构”。

### 4.1 早期融资

关键词：

- pre-seed
- seed
- angel
- grant
- accelerator
- YC
- stealth
- university spinout
- research spinout

可入选条件：

- 指向新投资方向，如 vertical AI、agent infra、AI security、AI evals、AI memory、robotics、on-device AI、small models、AI workflow、AI compliance。
- 出现设计伙伴、试点客户、首批客户、开源采用、开发者采用或研究转化证据。
- 能解释为什么该方向可能进入趋势观察、趋势快报或商业内参的观察池。

降级条件：

- 只有融资金额、创始人背景和愿景。
- 没有产品、客户、技术路径或场景。
- 与已有 Signal 高度重复且无新增证据。

### 4.2 技术迭代

关键词：

- model release
- inference cost
- context window
- multimodal
- voice/video model
- agent protocol
- MCP
- tool use
- AI memory
- evals
- synthetic data
- model routing

可入选条件：

- 影响推理成本、部署方式、开发者采用、客户场景、定价或商业模式。
- 被平台、开发者、企业客户或开源社区实际采用。
- 引发反证，如成本压力、安全事故、版权风险或监管执法。

降级条件：

- 只有 benchmark 或发布说明，没有商业含义。
- 只是一家公司的普通版本迭代，无法说明赛道变化。

### 4.3 开源与开发者生态

关键词：

- GitHub AI agent
- open-source model
- agent framework
- AI SDK
- plugin marketplace
- developer adoption

可入选条件：

- GitHub 增长伴随企业集成、云市场上架、商业化公司、融资或客户案例。
- SDK / framework 被多家公司或主流平台采用。
- 开源 license、托管服务或生态分发改变商业化路径。

降级条件：

- 只有 stars、forks 或社区热度。
- 只是工具集合、demo 或教程。

### 4.4 垂直行业早期采用

关键词：

- design partner
- pilot customer
- first customer
- procurement
- tender
- industry-specific AI agent

可入选条件：

- 出现明确客户类型、业务流程、采购路径或部署场景。
- 能说明某类客户开始把 AI 从试用带入预算或流程。

降级条件：

- 只有“AI for X”概念，没有客户、流程或采购证据。

### 4.5 反证与降温

关键词：

- shutdown
- churn
- gross margin pressure
- inference cost pressure
- lawsuit
- copyright risk
- security incident
- privacy enforcement

可入选条件：

- 能削弱某个趋势判断、商业内参判断或商业模式判断。
- 能说明成本、合规、客户留存或安全风险正在改变赛道优先级。

降级条件：

- 只影响单家公司，无法代表方向变化。
- 情绪化评论，无事实来源。

## 5. 关键词池

关键词分为 7 类：

| 类别 | 作用 | 示例 |
|---|---|---|
| 赛道词 | 定位方向 | 以 P0 赛道表为准；示例不能当作边界 |
| 成熟证据词 | 捕捉强商业证据 | 融资、客户、ARR、并购、平台发布 |
| 早期证据词 | 捕捉早期变化 | pre-seed、seed、angel、grant、spinout |
| 技术迭代词 | 捕捉能力与成本变化 | inference cost、MCP、evals、model routing |
| 开发生态词 | 捕捉开发者采用 | GitHub AI agent、AI SDK、agent framework |
| 需求侧词 | 捕捉垂直落地 | design partner、pilot customer、tender |
| 反证词 | 捕捉风险与降温 | churn、lawsuit、security incident、privacy enforcement |

关键词不直接等于 Tags。只有当关键词能稳定连接多个 Raw、商业信号、前沿观点、趋势报告或商业内参判断，才可进入 `tag-taxonomy.md` 的正式标签字典。

### 5.1 P0 赛道词

P0 赛道词是每日监测的锚点，不是搜索边界。当前完整 P0 赛道如下：

| ID | 赛道 | 覆盖方向 |
|---|---|---|
| `agent-workflow` | AI Agent / 企业工作流 | Agentic AI、企业级智能体、垂直 Agent、工作流编排、MCP、工具调用、Agent 协议 |
| `sales-service-marketing` | 销售 / 客服 / 营销 | AI SDR、销售智能体、客服智能体、语音智能体、联络中心 AI、营销自动化、广告自动化 |
| `coding-devtools` | AI 编程 / 开发者工具 | AI coding agent、软件工程智能体、AI app builder、vibe coding、开发工具、SDK、API、插件市场 |
| `knowledge-rag-memory` | 企业知识库 / RAG / AI Memory | 企业搜索、RAG 平台、AI 检索、长期记忆、知识管理 |
| `infra-model-routing` | AI 基础设施 / 模型路由 | Agent infra、LLM infra、推理平台、推理成本、模型部署、模型路由、可观测、评测、合成数据、向量数据库 |
| `model-capability-edge` | 模型能力 / 端侧 AI / 小模型 | 模型发布、开源模型、小语言模型、端侧推理、上下文窗口、多模态、语音模型、视频模型 |
| `security-governance-compliance` | AI 安全 / 治理 / 合规 | AI 安全、合规、治理、权限控制、审计、Agent 治理、安全评测 |
| `robotics-ai-native` | 机器人 / AI Native 公司 | robotics AI、具身智能、机器人基础模型、仓储机器人、AI 原生公司、一人公司 |

### 5.2 外围探索层

除 P0 赛道外，每日必须保留 `outside-core-exploration`。它负责扫描当前 P0 没覆盖的新行业、新岗位、新流程、新客户和弱变化，例如财务运营、人力资源、供应链、保险理赔、建筑软件、教育运营、能源调度、物流规划、零售运营、政务采购等。

执行上，P0 赛道不允许把搜索范围锁死。`keyword-monitoring-v2.json` 中已设置：

- `p0_tracks_are_anchors_not_boundaries=true`
- `exploration_query_share=0.15`
- `outside_core_track_min_raw=10`

如果某日 Raw 全部集中在 P0 赛道，source-router 必须写入集中度警告，并用外围探索层补齐。

## 6. 查询组合策略

每日不要只跑单词搜索，应使用“赛道词 + 证据词 + 来源词”的组合。

### 6.1 成熟信号

```text
AI Agent funding enterprise customers
AI sales agent ARR customers
AI workflow automation procurement
enterprise AI search ARR customer growth
企业级智能体 融资 客户
```

### 6.2 早期融资 / 新投资方向

```text
pre-seed AI startup vertical AI design partner
seed AI startup agent infra developer adoption
AI research spinout seed model routing
YC AI startup AI security evals
AI 种子轮 垂直 AI 试点客户
```

### 6.3 技术迭代

```text
model release inference cost reduction enterprise adoption
MCP agent protocol developer adoption
AI memory framework enterprise agent
model routing AI infrastructure customers
推理成本 下降 企业 AI 部署
```

### 6.4 开源与开发者生态

```text
open-source AI agent GitHub enterprise adoption
AI SDK developer adoption startup
AI plugin marketplace enterprise integration
AI infra open source cloud marketplace
开源 AI Agent 企业采用
```

### 6.5 垂直行业早期采用

```text
vertical AI startup pilot customer legal ops
AI for accounting firms first customer
AI insurance claims pilot deployment
AI manufacturing QA tender
AI 试点客户 法务运营
```

### 6.6 反证与降温

```text
AI workflow churn enterprise
AI inference cost pressure gross margin
AI coding lawsuit copyright risk
AI voice agent security incident
AI 客户流失 智能体
```

## 7. 质量指标

### 来源指标

- 有效 Signal 产出率。
- 一手证据比例。
- 平均 Signal Score。
- 首发或早发现能力。
- 重复转载率。
- 噪音率。
- 早期信号产出率。
- 反证信号产出率。
- 关联趋势报告 / 商业内参判断转化率。

### 关键词指标

- 命中数量。
- 有效 Signal 数量。
- 平均 Signal Score。
- 噪音率。
- 重复率。
- 成熟 / 早期 / 技术 / 开发者 / 垂直 / 反证覆盖率。
- 进入 Daily Brief 的数量。
- 转化为趋势报告 / 商业内参判断的数量。

### 前沿观点指标

- 高价值前沿观点数量。
- 原创性。
- 商业相关性。
- 观点后续被商业信号、趋势报告或商业内参判断吸收的比例。
- 观点分歧或反证价值。

## 8. 升权、降权和淘汰

### 升权

满足任一条件：

- 连续 3 次产出高分 Signal。
- 率先提供客户采用、收入、招投标、监管、开源采用或早期投资方向证据。
- 多次进入 Daily Brief。
- 支撑新的趋势报告或商业内参判断。
- 能补足早期融资、技术迭代、开发者生态、垂直行业采用或反证信号。
- Builder 观点形成长期共识或重要反证。

### 降权

满足任一条件：

- 连续 7 天只有转载或低分内容。
- 噪音率高于有效 Signal 产出率。
- 只产生大公司重复新闻，无法提供新增证据。
- 只产出 GitHub 热度或融资稿，缺少客户、技术、采用或商业化证据。
- 标题党、缺来源、不可验证。
- 与 AI 商业机会判断无关。

### 淘汰

满足任一条件：

- 长期不可访问。
- 高重复且无增量。
- 来源可信度低或版权风险高。
- 多次污染自动化结果。

## 9. 每周报告

每周输出：

```text
agent-workflow/reports/source-intelligence-weekly-YYYY-WW.md
```

结构：

```markdown
# Source Intelligence Weekly

## 1. 本周结论
## 2. 高产来源
## 3. 低效来源
## 4. 新增候选来源
## 5. 候选降权来源
## 6. 高产关键词
## 7. 低效关键词
## 8. 早期信号覆盖率
## 9. 技术迭代 / 开发者生态覆盖率
## 10. 垂直行业早期采用覆盖率
## 11. 反证信号覆盖率
## 12. Builder 池变化
## 13. 需要更新自动化的事项
```

## 10. 自动化应用

### 对 V2 source-router

- 当前 V2 每日 source-router 必须读取 `01-SiteV2/content/09-databases/keyword-monitoring-v2.json`。
- `keyword-monitoring-v2.json` 是本文件“关键词池”和“查询组合策略”的可执行版本；更新关键词或主题配额时，应同步更新该 JSON，而不是只改文档。
- 每日运行日志必须输出 `keyword_group_distribution`、`theme_distribution`、`theme_concentration_warning`。
- 精选变化卡 默认同一主题最多 1 条；确需做主题日时，必须显式标记 `theme_day=true`，并说明为什么今天同一主题值得占 2 条。
- AI HOT 使用 24 小时 `mode=all` 作为 Raw 主入口；follow-builders 每日全量进入前沿观点库；外部多路搜索只在默认入口不足、覆盖缺口明显或重要卡片缺 S/A/B 来源时启动。
- 进入公开前台的事实判断必须回源到 Raw 全文、Markdown 快照或补证后的 S/A/B 来源；M 级采集通道和 C 级社区讨论只能说明线索、热度和反馈。

## 11. 与 Tags 的关系

来源和关键词不直接等于 Tags。

只有当关键词能稳定连接多个商业信号、前沿观点、趋势报告或商业内参判断，才可进入 `tag-taxonomy.md` 的正式标签字典。

新增早期关键词若只出现一次，应进入候选关键词或运行报告，不直接进入正式标签。
