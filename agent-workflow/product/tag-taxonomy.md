# Tag Taxonomy｜标签体系

Compatibility notice: this TAG-V2 taxonomy is retained only for frozen V3 Cards and downstream Industry Reports projections. Data Center V4 uses `tag-taxonomy-v3.json`; V4 tags are Claim-level evidence assertions and cannot represent structured fields, ranking, eligibility, opportunity, or trend judgment.

更新时间：2026-07-11
version：TAG-V2.0.0-semantic-boundaries
owner：Intelligence Engine / Experience & Editorial
状态：current

## 1. 唯一定位

标签用于连接可复用的商业语义，不承载来源追踪、流程状态、地域元数据或前台栏目结构。

当前体系分成四个互不替代的层：

| layer | 字段 | 作用 | 边界 |
|---|---|---|---|
| 商业语义标签 | `formal_tags` | Signal Card 检索、筛选、关系图辅助、趋势候选上下文 | 只允许 `track / function / scenario / customer / evidence` |
| 机会信号 | `opportunity_signals` | Industry Reports 的 Entry Point Map / Product Pain Map | 必须贴近来源；不从标签推导 |
| 结构化元数据 | `source_type`、`market_regions`、`trend_state` | 来源追踪、地域、趋势状态 | 不进入 `formal_tags`，不参与标签聚合 |
| 栏目私有分类 | `column_tags` 或栏目自有字段 | First-Line Viewpoints、Community Intelligence 内部筛选 | 不作为 Business Signals 事实、关系边或趋势证据 |

`tag_id` 是稳定机器键；`name` 是中文显示名；`aliases` 只负责输入归一化。禁止把显示名当作迁移目标。

## 2. 正式标签规则

### 2.1 允许分组与数量

| group | 回答的问题 | Signal Card 规则 |
|---|---|---|
| `track` | 发生在哪个 AI 商业方向？ | 必填 1 个，最多 2 个 |
| `function` | 影响哪个组织职能？ | 有明确职能才写，最多 2 个 |
| `scenario` | 落在哪个具体工作流或部署场景？ | 有来源证据才写，最多 2 个 |
| `customer` | 明确服务哪类客户或使用者？ | 有明确对象才写，最多 2 个 |
| `evidence` | 来源证明了哪类商业事件？ | 必填 1 个，最多 2 个 |

硬规则：

- 每个标签都必须能由标题、来源正文、证据摘录或 Card 事实字段直接支持。
- 不因正文出现单个宽泛词就打标签；`AI`、`enterprise`、`agent`、`customer` 不能单独触发标签。
- `track-ai-agent` 只有在自主执行、工具调用或多步骤代理是产品核心时使用；与更具体赛道共存时，只在 Agent 机制本身对商业判断不可替代时保留。
- 不写默认客户标签。无法从来源确认客户类型时，`customer` 留空。
- `evidence` 描述已发生、可核验的事件，不描述推测、热度或编辑判断。
- 单个分组超过上限时优先保留更具体、与来源事实更接近的标签。

## 3. 正式标签字典

### track

| tag_id | name | aliases | description |
|---|---|---|---|
| `track-ai-agent` | Agentic AI | AI Agent、AI-Agent、智能体 | 以自主执行、工具调用或多步骤代理为核心的产品与系统 |
| `track-ai-models` | 模型与能力 | 基础模型、大模型、多模态模型 | 模型发布、能力迭代、训练与模型商业化 |
| `track-ai-applications` | AI 应用与平台 | AI 应用、AI 平台、通用 AI 产品 | 不属于更具体垂直赛道的应用层产品和平台 |
| `track-ai-coding` | AI Coding | AI-Coding、AI编程、开发者 AI | 编码助手、软件生成和开发者工具 |
| `track-enterprise-workflow` | 企业工作流 | 企业 AI 工作流、工作流自动化 | 明确进入组织流程、审批或跨系统执行的 AI 产品 |
| `track-enterprise-data` | 企业数据智能 | 企业数据、RAG、企业知识库 | 企业数据、知识库、检索增强和数据控制面 |
| `track-ai-marketing` | AI 营销 | AI 增长、销售赋能 | 营销、增长、销售和客户运营产品 |
| `track-ai-customer-service` | AI 客服 | Voice AI、语音客服 | 客服、售后、质检、工单和语音分流 |
| `track-ai-governance` | AI 治理 | Agent 治理、权限审计 | 权限、审计、合规、安全和治理 |
| `track-ai-infra` | AI 基础设施 | AI Infra、模型基础设施 | 算力、推理、托管、评测和基础设施 |
| `track-embodied-ai` | 具身智能 | 机器人、无人系统 | 机器人、物流、无人系统和物理任务执行 |
| `track-medical-ai` | 医疗 AI | 临床 AI、影像 AI | 医疗影像、临床辅助和医疗工作流 |
| `track-professional-services-ai` | 专业服务 AI | 法务 AI、咨询 AI、专家知识 Agent | 专业服务和专家知识交付 |
| `track-creative-media-ai` | 创意媒体 AI | 生成式媒体、视频 AI、设计 AI | 视频、设计、广告和内容生产工具 |
| `track-ai-science-research` | 科学研究 AI | AI for Science、科研 AI | 科学发现、化学、生物和研究智能体 |

### function

| tag_id | name | aliases | description |
|---|---|---|---|
| `function-sales` | 销售 | 销售赋能、CRM | 获客、销售执行和客户转化 |
| `function-marketing` | 市场营销 | 增长、投放 | 品牌、内容、增长和广告投放 |
| `function-customer-service` | 客服售后 | 客服、售后、质检 | 服务、工单、质检和客户成功 |
| `function-operations` | 运营流程 | 运营、流程 | 组织运营和跨系统流程 |
| `function-finance` | 财务 | 票据、报销、财务流程 | 财务核算、报销、支付和分析 |
| `function-legal-compliance` | 法务合规 | 合规、审计 | 法务、合规、风险和审计 |
| `function-procurement-bidding` | 采购投标 | 招投标、采购 | 采购、招标和供应商流程 |
| `function-engineering` | 工程研发 | 开发、仿真、工程 | 软件、产品和工程研发 |

### scenario

| tag_id | name | aliases | description |
|---|---|---|---|
| `scenario-document-workflow` | 文档流程 | 文档处理、合同提取 | 文档生成、提取、审核和流转 |
| `scenario-knowledge-base` | 知识库问答 | RAG、企业知识库 | 企业检索、问答和知识管理 |
| `scenario-customer-ticket` | 工单与质检 | 工单、质检、智能派单 | 客服工单、质检与分流 |
| `scenario-sales-briefing` | 销售情报与跟进 | 销售日报、销售周报、线索跟进 | 销售准备、线索跟进和情报汇总 |
| `scenario-bidding-response` | 标书响应 | 标书解析、应标响应 | 招投标材料解析与生成 |
| `scenario-clinical-imaging` | 临床影像辅助 | 影像诊断 | 医疗影像分析和辅助诊断 |
| `scenario-agent-governance` | Agent 权限治理 | 审计、权限、风险控制 | Agent 权限、审计与运行治理 |
| `scenario-manufacturing-ops` | 制造运营 | 工厂、产线、工业运营 | 工厂、产线和工业运营 |
| `scenario-model-deployment` | 模型部署 | 模型上线、边缘部署、算力部署 | 模型上线、服务和边缘部署 |
| `scenario-coding-agent` | 编码 Agent | 开发者 Agent、代码代理 | 代码生成、修改、测试和工程代理 |
| `scenario-payments` | 支付流程 | 企业支付、付款、结算 | 支付、付款与结算 |
| `scenario-local-ai-dev` | 本地 AI 开发 | 本地模型、AI PC、本地开发环境 | 本地模型和端侧开发环境 |
| `scenario-healthcare-operations` | 医疗运营 | 排班、护理、病患运营、医疗流程 | 医疗机构运营流程 |
| `scenario-insurance-claims` | 保险理赔 | 理赔通知、审核、赔付流程 | 理赔审核与赔付 |
| `scenario-logistics-supply-chain` | 物流供应链 | 物流、配送、供应链、库存 | 配送、库存和供应链流程 |
| `scenario-construction-real-estate` | 建筑地产 | 建筑、地产、工程贷款、项目管理 | 建筑、地产和项目管理 |
| `scenario-revenue-operations` | 收入运营 | RevOps、销售运营、商业大脑 | 收入流程和商业运营 |

### customer

| tag_id | name | aliases | description |
|---|---|---|---|
| `customer-smb` | 中小企业 | SMB、中小商家 | 明确面向中小企业或商户 |
| `customer-public-sector` | 政府 / 公共部门 | 政府、央国企、公共部门 | 明确面向政府或公共部门 |
| `customer-developer-team` | 开发团队 | 工程团队 | 明确面向开发者或工程团队 |
| `customer-healthcare-provider` | 医疗机构 | 医院、诊所 | 明确面向医疗服务机构 |
| `customer-heavy-industry` | 重资产行业 | 能源、电力、制造、建筑 | 明确面向重资产行业客户 |

### evidence

| tag_id | name | aliases | description |
|---|---|---|---|
| `evidence-funding` | 融资 | 投资、种子轮 | 已披露的融资或投资事件 |
| `evidence-customer-adoption` | 客户采用 | 部署、上线 | 已披露的客户采用、部署或上线 |
| `evidence-product-launch` | 产品发布 | 功能发布、平台发布 | 已发布的产品、服务或功能 |
| `evidence-revenue` | 收入增长 | ARR、营收 | 已披露的收入或商业增长指标 |
| `evidence-regulation` | 监管政策 | 政策、合规 | 已发布的监管、执法或政策动作 |
| `evidence-procurement` | 采购合同 | 招投标、政府采购、合同 | 已披露的采购、招标或合同事件 |
| `evidence-partnership-integration` | 合作集成 | 合作、集成、平台接入 | 已宣布的合作、集成或渠道接入 |
| `evidence-acquisition` | 收购并购 | 收购、并购、团队收编 | 已发生或已宣布的并购事件 |
| `evidence-pricing-cost` | 定价与成本 | 定价、用量、限额、推理成本 | 已披露的定价、计费或成本变化 |
| `evidence-customer-metric` | 客户结果指标 | 效率、处理量、节省成本 | 来源披露的客户结果或运营指标 |

## 4. First-Line Viewpoints 私有字典

观点使用 `column_tags`，只允许 `track` 与 `opinion`。来源写入 `source_type`，不再生成 `source-*` 标签。

### opinion

| tag_id | name | aliases | description |
|---|---|---|---|
| `opinion-ai-coding` | AI Coding 观点 | 编程、开发者工具 | 对 AI 编程与软件工程的判断 |
| `opinion-agent-workflow` | Agent 工作流观点 | 多 Agent、工作流 | 对 Agent 机制与组织工作流的判断 |
| `opinion-model-infra` | 模型基础设施观点 | Infra、推理、记忆 | 对模型、推理和基础设施的判断 |
| `opinion-product-strategy` | 产品策略观点 | PM、产品 | 对产品、创业和市场策略的判断 |
| `opinion-ai-safety-governance` | AI 安全治理观点 | 安全、权限、治理 | 对安全、治理和风险的判断 |

First-Line Viewpoints 最少 1 个 `opinion`；`track` 有明确主题时再写，最多各 2 个。人物姓名、热度和来源平台都不是标签。

## 5. 结构化元数据枚举

- `source_type`：`first_party / business_media / industry_data / social / podcast / blog / research / regulatory`
- `market_regions`：ISO 国家或区域值；仅来源明确时填写，不写默认 `global`
- `trend_state`：`emerging / rising / splitting / mature / risk / watch`；只允许趋势候选使用

这些值没有 tag_id，不进入标签字典、标签统计、关系边或前台标签墙。

## 6. 历史清理与迁移

| 旧值 | 当前处理 |
|---|---|
| `source-*` | 从 `formal_tags` 删除；迁移到 `source_type` 或已有来源字段 |
| `region-*` | 从 `formal_tags` 删除；明确地域迁移到 `market_regions`；`region-global` 直接删除 |
| `stage-*` | Signal Card 直接删除；趋势候选迁移到 `trend_state` |
| `customer-enterprise` | 删除，不设默认替代值 |
| `track-ai-agent` 与更具体 track 共存 | Agent 机制非核心时删除；清理器默认保留更具体 track |
| `AI创业机会`、旧机会中心标签 | 删除；机会判断进入 `opportunity_signals` |
| 旧观点栏目、人物名标签 | 删除；观点主题进入 `column_tags.opinion` |

历史版本不做兼容回填。生成器、校验器、前台和资产都必须使用当前合同。

## 7. 新标签准入与退役

新增标签必须同时满足：

1. 维度唯一，不与现有标签、元数据或机会信号重复；
2. 已连接至少 3 条正式资产，或由 Product Commander 明确批准为战略观察方向；
3. 能提升检索、筛选或关系分析，而不是复述标题；
4. 有明确正例、反例和触发边界。

以下情况禁止新增：公司名、人物名、一次性事件词、纯情绪词、流程状态、来源平台、宽泛词（如“AI”“创业”“科技”）以及中英文/大小写重复词。

标签满足任一条件应进入退役审查：连续 90 天零使用；覆盖率长期过高而不具区分力；与结构化字段重复；无法稳定由来源事实支持。退役必须提供 `remove / merge_to / move_to_field` 之一，不允许静默改义。

## 8. 自动化与质量门

- 生成器先判断 Card 事实类型，再按本字典打标签；不得为满足数量补默认标签。
- Signal Card 缺 `track` 或 `evidence` 时进入 `needs_tag_review`，不得编造。
- 同步脚本只解析已有标签，不创建标签。
- 质量门必须阻止：未知标签、退役标签、错误分组、超出数量上限、Signal Card 缺必填组、非趋势资产使用 `trend_state`、栏目私有标签进入 Business Signals。
- 每周审计覆盖率、低频标签、共现泛化、未知值和待审候选；候选在批准前不得进入 active taxonomy。

前台最多展示 3 个高判断价值标签，不显示 tag_id、来源元数据、趋势状态或内部诊断字段。
