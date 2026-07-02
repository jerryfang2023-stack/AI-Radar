# Tag Taxonomy｜标签体系

更新时间：2026-07-01
version：TAG-V1.1.0-v34-layered-taxonomy
owner：Intelligence Engine / Experience & Editorial
状态：current

## 1. 定位

Tags 不是前台一级栏目，也不是随手标注。它们服务搜索、筛选、关系网络和资产复盘，帮助用户按赛道、职能、场景、证据、客户类型和来源理解 WaveSight AI 的商业信号资产。

当前标签体系服务以下资产：

- 商业信号卡：`signal_card`
- 一线观点：`first_line_viewpoint`
- 关系图谱：`relationship_graph`
- 趋势候选：`trend_candidate`

旧机会中心、旧观点栏目、变化候选、场景候选、趋势报告和商业内参只作为历史兼容来源，不再作为当前标签分组、前台栏目名或 V3.3 执行目标。

## 2. 标签分层

V3.4 标签体系拆成三层，三层可以互相参照，但不能互相替代：

| layer | 字段 / 位置 | 服务对象 | 前台规则 |
|---|---|---|---|
| 正式标签 | `formal_tags` | 检索、筛选、关系图谱辅助、趋势候选上下文 | 保留完整结构，但 Business Signals 前台只展示少量高判断价值标签 |
| 机会信号 | `opportunity_signals` | Reports Center / Opportunity System / 机会地图 | 继续替代旧 `formal_tags` 聚合做机会地图；必须贴近来源，不做宽泛主题标签 |
| 栏目私有标签 | 栏目数据字段 | First-Line Viewpoints 和 Community Intelligence 的栏目内筛选 | 不混进 Business Signals；不作为商业信号事实证据 |

职责边界：

- `formal_tags` 用于后端检索、筛选、关系图辅助和趋势候选上下文，不再作为 Reports Center 机会地图的主聚合字段。
- `opportunity_signals` 是 V3.4 Reports Center / Opportunity System 的机会地图字段，字段值必须能回到原始来源或卡片来源摘录。
- First-Line Viewpoints 的栏目私有标签只使用 `opinion` / `track` / `source`，用于观点页筛选和观点时间线。
- Community Intelligence 的栏目私有标签使用 `scene` / `industry` / `tools` / `monetization`，用于社群需求和实操线索的栏目内聚合。
- First-Line Viewpoints 和 Community Intelligence 只能用于解释、需求互证或候选观察；除非另行进入 Raw / Pool / Card 链路，否则不能进入 Business Signals 的 `formal_tags`、关系图证据或趋势候选证据。

正式标签分为 9 类：

| group | 用途 | 建议使用 |
|---|---|---|
| `track` | 赛道 / 技术方向 | 核心内容必填 |
| `function` | 业务职能 | 商业信号建议补充；关系图谱重要输入 |
| `scenario` | 应用场景 | 案例、垂直部署和关系图谱建议补充 |
| `customer` | 客户类型 | 案例、融资和垂直部署建议补充 |
| `evidence` | 证据类型 | 商业信号、趋势候选建议必填 |
| `stage` | 阶段 / 成熟度 | 只用于趋势候选或确有阶段判断的资产 |
| `region` | 地域 / 市场适配 | 只在来源明确指向区域时使用 |
| `source` | 来源类型 | 商业信号和一线观点建议补充；不作为前台主视觉标签 |
| `opinion` | 一线观点主题 | 只用于 First-Line Viewpoints |

## 3. Tag 数据结构

```json
{
  "tag_id": "track-ai-agent",
  "name": "AI Agent",
  "group": "track",
  "aliases": ["AI-Agent", "智能体"],
  "description": "围绕自主执行、多步骤任务、工具调用和企业流程执行的 AI 系统。",
  "status": "active",
  "merge_to": null
}
```

## 4. 第一版正式标签字典

### track

| tag_id | name | aliases | description |
|---|---|---|---|
| `track-ai-agent` | AI Agent | AI-Agent、智能体 | 多步骤任务、工具调用、企业流程执行 |
| `track-ai-coding` | AI Coding | AI-Coding、AI 编程 | 编码助手、开发者工具、软件生成 |
| `track-enterprise-workflow` | 企业工作流 | 企业 AI 工作流、工作流自动化 | 企业流程、审批、跨系统自动化 |
| `track-enterprise-data` | 企业数据智能 | 企业数据、RAG、企业知识库 | 企业数据、知识库、RAG、数据控制面 |
| `track-ai-marketing` | AI 营销 | AI 增长、销售赋能 | 营销、增长、销售、线索和客户运营 |
| `track-ai-customer-service` | AI 客服 | Voice AI、语音客服 | 客服、售后、质检、工单和语音分流 |
| `track-ai-governance` | AI 治理 | Agent 治理、权限审计 | 权限、审计、合规、安全和治理 |
| `track-ai-infra` | AI 基础设施 | AI Infra、模型基础设施 | 推理、托管、评测、记忆层和基础设施 |
| `track-embodied-ai` | 具身智能 | 机器人、无人系统 | 机器人、物流、无人系统、物理任务执行 |
| `track-medical-ai` | 医疗 AI | 临床 AI、影像 AI | 医疗影像、临床辅助、医疗工作流 |
| `track-professional-services-ai` | 专业服务 AI | 法务 AI、咨询 AI、专家知识 Agent | 专业服务、知识工作和专家判断 |

### function

| tag_id | name | aliases |
|---|---|---|
| `function-sales` | 销售 | 销售赋能、CRM |
| `function-marketing` | 市场营销 | 增长、投放 |
| `function-customer-service` | 客服售后 | 客服、售后、质检 |
| `function-operations` | 运营流程 | 运营、流程 |
| `function-finance` | 财务 | 票据、报销、财务流程 |
| `function-legal-compliance` | 法务合规 | 合规、审计 |
| `function-procurement-bidding` | 采购投标 | 招投标、采购 |
| `function-engineering` | 工程研发 | 开发、仿真、工程 |

### scenario

| tag_id | name | aliases |
|---|---|---|
| `scenario-document-workflow` | 文档流程 | 文档处理、合同提取 |
| `scenario-knowledge-base` | 知识库问答 | RAG、企业知识库 |
| `scenario-customer-ticket` | 工单与质检 | 工单、质检、智能派单 |
| `scenario-sales-briefing` | 销售日报 | 销售周报、线索跟进 |
| `scenario-bidding-response` | 标书响应 | 标书解析、应标响应 |
| `scenario-clinical-imaging` | 临床影像辅助 | 影像诊断 |
| `scenario-agent-governance` | Agent 权限治理 | 审计、权限、风险控制 |
| `scenario-manufacturing-ops` | 制造运营 | 工厂、产线、工业运营 |
| `scenario-model-deployment` | 模型部署 | 模型上线、边缘部署、算力部署 |
| `scenario-coding-agent` | 编码 Agent | 开发者 Agent、代码代理 |
| `scenario-payments` | 支付流程 | 企业支付、付款、结算 |
| `scenario-local-ai-dev` | 本地 AI 开发 | 本地模型、AI PC、本地开发环境 |
| `scenario-healthcare-operations` | 医疗运营 | 排班、护理、病患运营、医疗流程 |
| `scenario-insurance-claims` | 保险理赔 | 理赔通知、审核、赔付流程 |
| `scenario-logistics-supply-chain` | 物流供应链 | 物流、配送、供应链、库存 |
| `scenario-construction-real-estate` | 建筑地产 | 建筑、地产、工程贷款、项目管理 |
| `scenario-revenue-operations` | 收入运营 | RevOps、销售运营、商业大脑 |

### customer

| tag_id | name | aliases |
|---|---|---|
| `customer-smb` | 中小企业 | SMB、中小商家 |
| `customer-enterprise` | 大中型企业 | 企业客户 |
| `customer-public-sector` | 政府 / 国企 | 政府、央国企 |
| `customer-developer-team` | 开发团队 | 工程团队 |
| `customer-healthcare-provider` | 医疗机构 | 医院、诊所 |
| `customer-heavy-industry` | 重资产行业 | 能源、电力、制造、建筑 |

### evidence

| tag_id | name | aliases |
|---|---|---|
| `evidence-funding` | 融资证据 | 投资、种子轮 |
| `evidence-customer-adoption` | 客户采用 | 部署、上线、合作 |
| `evidence-product-launch` | 产品发布 | 功能发布、平台发布 |
| `evidence-revenue` | 收入增长 | ARR、营收 |
| `evidence-regulation` | 监管政策 | 政策、合规 |
| `evidence-procurement` | 招投标 / 采购 | 招标、政府采购 |
| `evidence-partnership-integration` | 合作集成 | 合作、集成、平台接入 |
| `evidence-acquisition` | 收购并购 | 收购、并购、团队收编 |
| `evidence-pricing-cost` | 价格成本 | 定价、用量、限额、推理成本 |
| `evidence-customer-metric` | 客户指标 | 效率、收入、处理量、节省成本 |

### stage

| tag_id | name | aliases |
|---|---|---|
| `stage-emerging` | 新出现 | emerging |
| `stage-rising` | 升温 | rising |
| `stage-splitting` | 分化 | splitting |
| `stage-mature` | 成熟化 | mature |
| `stage-risk` | 风险变量 | risk |
| `stage-watch` | 观察 | watch |

### region

| tag_id | name | aliases |
|---|---|---|
| `region-global` | 全球 | 海外 |
| `region-china` | 中国适配 | 中国、本土 |
| `region-us` | 美国 | US |
| `region-eu` | 欧洲 | EU |
| `region-asia` | 亚洲 | 亚太、APAC |

### source

| tag_id | name | aliases |
|---|---|---|
| `source-first-party` | 一手来源 | 官网、官方博客 |
| `source-business-media` | 商业媒体 | 高质量媒体 |
| `source-industry-data` | 产业数据 | 数据库、招投标 |
| `source-social` | 社媒线索 | X、社区 |
| `source-podcast` | 播客 | YouTube、访谈 |
| `source-blog` | 技术博客 | Blog |

### opinion

| tag_id | name | aliases |
|---|---|---|
| `opinion-ai-coding` | AI Coding 观点 | 编程、开发者工具 |
| `opinion-agent-workflow` | Agent 工作流观点 | 多 Agent、工作流 |
| `opinion-model-infra` | 模型基础设施观点 | Infra、推理、记忆 |
| `opinion-product-strategy` | 产品策略观点 | PM、产品 |
| `opinion-ai-safety-governance` | AI 安全治理观点 | 安全、权限、治理 |

## 5. 合并与别名规则

| 原标签 | 归并到 |
|---|---|
| `AI-Agent` | `AI Agent` |
| `AI编程` | `AI Coding` |
| `AI-Coding` | `AI Coding` |
| `AI增长` | `AI 营销` |
| `Voice-AI` | `AI 客服` |
| `企业知识库` | `企业数据智能` |
| 旧观点栏目 | `opinion-*` 主题标签 |
| 旧机会中心 | 历史兼容来源，不进入 V3.4 active taxonomy |

`AI创业机会` 不再作为唯一标签使用，仅保留为历史兼容标签。新商业信号至少应包含 `track` 和 `evidence`；`function`、`scenario`、`customer`、`source` 按事实补充。

## 6. 准入规则

新标签必须满足至少一项：

- 能连接 3 条以上商业信号、一线观点、关系图谱节点或趋势候选。
- 是 Product Commander 明确确认的重点赛道或商业化方向。
- 能显著提升搜索、筛选或关系网络价值。
- 是自动化质量报告中连续出现的高价值关键词。

不允许新增：

- 只有一次出现的随手词。
- 公司名标签。
- 纯情绪标签。
- 过宽泛标签，如“AI”“创业”“科技”。
- 与现有标签只是大小写、连字符或中英文差异的重复词。

## 7. 内容类型标签要求

### signal_card

- 至少 1 个 `track`
- 至少 1 个 `evidence`
- 可选 `function` / `scenario` / `customer` / `source`
- 不应默认使用 `stage-watch`；阶段标签只在确有阶段判断时使用。

### first_line_viewpoint

- 至少 1 个 `opinion`
- 至少 1 个 `track`
- 至少 1 个 `source`
- 不使用 `scenario-frontier-opinion` 或 `evidence-frontier-opinion` 表示观点。
- 标签不能替代观点质量判断；前台展示仍必须保留来源、人物、原文语境和发布时间。

### trend_candidate

- 至少 1 个 `track`
- 至少 1 个 `stage`
- 可选 `evidence` / `scenario`

## 8. 自动化生成规则

- `asset-card-generator` 生成资产时必须按本文件从别名归并到正式标签。
- `asset-card-generator` 不得默认写入 `stage-watch`；无法判断阶段时留空。
- `follow-builders` 生成 First-Line Viewpoints 时，必须同步写入 `formal_tags`；最小要求为 1 个 `track`、1 个 `source`、1 个 `opinion`。
- 一线观点不得以人物姓名作为 tag；人物进入 `speaker` / `person` / `source_name` 字段。
- 若发现新观点主题，不直接新建 tag，先写入候选主题或运行报告。
- 同步脚本不新增标签，只解析已有标签。
- 自动化不得用标签数量、人物热度或主题命中替代四档评级。
- 如果自动化无法确定标签，写 `needs_tag_review` 到报告，不要编造标签。

## 9. 前台应用规则

Tags 不进入一线导航。

前台可用于：

- 商业信号筛选。
- 一线观点筛选。
- 趋势候选相关内容聚合。
- 详情页“相关内容”。
- 未来标签网络图。

前台不应展示：

- 长标签墙。
- 内部 `tag_id`。
- 低价值泛标签。
- 未复核候选标签。

## 10. 治理节奏

每日自动化报告记录未知标签和候选标签。

每周输出：

```text
agent-workflow/reports/tag-quality-weekly-YYYY-WW.md
```

内容：

- 高频标签。
- 低价值标签。
- 新增候选标签。
- 合并建议。
- 未知标签。
- 标签到商业信号、一线观点、关系图谱和趋势候选的覆盖率。

下一步：

1. Build & Release 后续可增加 `check-tags.mjs`。
2. Intelligence Engine 每周输出 tag-quality 报告。
3. Experience & Editorial 后续设计标签筛选，不做标签墙。
4. 前台不显示内部 `tag_id`。

## 11. 候选标签

以下标签先作为候选观察，不进入 active taxonomy。连续连接 3 条以上正式商业信号后，再转入对应正式分组。

| candidate_tag_id | name | group | 进入条件 |
|---|---|---|---|
| `track-ai-science-research` | 科学研究 AI | `track` | 科学发现、化学、生物、研究智能体连续形成正式商业信号 |
| `track-creative-media-ai` | 创意媒体 AI | `track` | 视频、设计、内容生产工具连续形成正式商业信号 |
