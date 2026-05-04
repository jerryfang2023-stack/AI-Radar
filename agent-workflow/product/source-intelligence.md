# Source Intelligence Model

更新时间：2026-05-04  
owner：`data-agent` / `workflow`  
状态：active

## 1. 定位

Source Intelligence 是观澜AI的输入质量治理模型。

它负责管理：

- 每日 Signals 的监测来源。
- The Point 的 Builder / Podcast / Blog 来源。
- 关键词池。
- 查询组合。
- 噪音来源。
- 来源升权、降权和淘汰。

目标是让观澜AI不是被热点牵着走，而是持续拥有更高质量、更早、更可验证的 AI 商业判断输入。

2026-05-04 之后，Signals 来源治理必须同时覆盖：

```text
成熟信号：大企业、大融资、大平台动作
早期信号：pre-seed / seed / angel / grant / accelerator / spinout
技术信号：模型能力、成本、协议、工具链、部署方式
开发者信号：开源项目、SDK、框架、插件市场、GitHub 采用
需求信号：设计伙伴、试点客户、首批客户、采购和招投标
反证信号：关闭、流失、毛利压力、诉讼、安全、隐私、监管执法
```

## 2. 来源分层

| 层级 | 类型 | 处理规则 |
|---|---|---|
| S | 一手证据 | 优先采信，可进入高分 Signal 候选 |
| A | 高质量商业媒体 / 通讯社 | 可作为 Signal 证据，但尽量回找一手来源 |
| B | 垂直行业媒体 / 数据库 / 市场 listing | 适合补行业场景、融资、采用和需求侧信号 |
| C | 社媒 / 社区 / 聚合 / GitHub trending | 只作为线索，不直接作为高证据 |
| D | 噪音或低可信来源 | 降权或移除 |

采信原则：

- S/A 来源可以作为正式 Signal 主证据。
- B 来源可以作为垂直场景、采购、融资、客户采用和开发者生态证据，但重要内容应补 S/A 佐证。
- C 来源可以触发检索，不可单独支撑高分 Signal。
- D 来源只用于识别噪音，不进入前台判断。

## 3. Signals 来源池

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
- 能解释为什么该方向可能进入 Trend emerging 或 Opportunity watch。

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

- 能削弱某个 Trend、Opportunity 或商业模式判断。
- 能说明成本、合规、客户留存或安全风险正在改变赛道优先级。

降级条件：

- 只影响单家公司，无法代表方向变化。
- 情绪化评论，无事实来源。

## 5. 关键词池

关键词分为 7 类：

| 类别 | 作用 | 示例 |
|---|---|---|
| 赛道词 | 定位方向 | AI Agent、AI Coding、AI营销、企业知识库 |
| 成熟证据词 | 捕捉强商业证据 | 融资、客户、ARR、并购、平台发布 |
| 早期证据词 | 捕捉早期变化 | pre-seed、seed、angel、grant、spinout |
| 技术迭代词 | 捕捉能力与成本变化 | inference cost、MCP、evals、model routing |
| 开发生态词 | 捕捉开发者采用 | GitHub AI agent、AI SDK、agent framework |
| 需求侧词 | 捕捉垂直落地 | design partner、pilot customer、tender |
| 反证词 | 捕捉风险与降温 | churn、lawsuit、security incident、privacy enforcement |

关键词不直接等于 Tags。只有当关键词能稳定连接多个 Signal、Point、Trend 或 Opportunity，才可进入 `tag-taxonomy.md` 的正式标签字典。

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
- 关联 Opportunity / Trend 转化率。

### 关键词指标

- 命中数量。
- 有效 Signal 数量。
- 平均 Signal Score。
- 噪音率。
- 重复率。
- 成熟 / 早期 / 技术 / 开发者 / 垂直 / 反证覆盖率。
- 进入 Daily Brief 的数量。
- 转化为 Opportunity / Trend 的数量。

### Builder 指标

- 高分 Point 数量。
- 原创性。
- 商业相关性。
- 观点后续被 Signal / Trend / Opportunity 吸收的比例。
- 观点分歧或反证价值。

## 8. 升权、降权和淘汰

### 升权

满足任一条件：

- 连续 3 次产出高分 Signal。
- 率先提供客户采用、收入、招投标、监管、开源采用或早期投资方向证据。
- 多次进入 Daily Brief。
- 支撑新 Opportunity 或 Trend。
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

### 对 `ai-the-point`

- 读取本文件与 `the-point-model.md`。
- 使用 Builder 池准入和降权原则。
- 不因单个来源失败生成空文件。
- 将来源质量问题写入 `daily-run-log.md` 或运行报告。

本次 2026-05-04 更新默认不改变 The Point Builder 池。

### 对 `ai-2`

- 读取本文件、`signal-system.md`、`提示词/关键词列表.md` 和 `提示词/监测提示词V4.0.md`。
- 每日候选池必须覆盖成熟信号、早期融资 / 新投资方向、技术迭代、开源 / 开发者生态、垂直早期采用、反证与降温。
- 优先使用 S / A 来源。
- 对 C 级社媒、GitHub trending 和聚合线索必须回找 S/A/B 证据。
- 记录高产词、低效词、噪音来源和早期信号覆盖率。
- 不因早期信号降低 Signal 标准；早期内容必须说明新方向、新客户、新技术路径、新生态或反证价值。

### 对 `ai-3`

- 不直接使用来源池。
- 同步报告应保留来源质量软提醒。
- 若内容状态为 `needs_review`，不得入站。
- 本次 2026-05-04 更新不改变同步闸门、脚本入口或关系检查规则。

## 11. 与 Tags 的关系

来源和关键词不直接等于 Tags。

只有当关键词能稳定连接多个 Signal、Point、Trend 或 Opportunity，才可进入 `tag-taxonomy.md` 的正式标签字典。

新增早期关键词若只出现一次，应进入候选关键词或运行报告，不直接进入正式标签。
