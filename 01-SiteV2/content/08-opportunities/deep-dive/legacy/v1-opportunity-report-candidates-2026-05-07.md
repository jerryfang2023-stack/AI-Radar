---
legacy_batch_id: legacy-opportunities-20260507
asset_type: opportunity-report-candidates
source_scope: V1 Opportunities
converted_at: 2026-05-07
status: legacy-candidates
production_readiness: needs_review
encoding: UTF-8
---

# V1 Opportunities -> V2 Opportunity Report Candidates

## 转换规则

V1 Opportunity 不原样进入 V2。它们先转为机会解码候选，后续只有完成多源论证、趋势背景、观点校准、反证和成立边界后，才能成为正式 V2 机会解码报告。

## 已加工候选清单

| v2_id | source_path | source_date | converted_at | V2 title candidate | V2 six-dimension rewrite | relations | evidence_gaps | destination |
|---|---|---|---|---|---|---|---|---|
| `legacy-opportunity-agent-governance-audit` | `10-Archive/v1.0/source-dirs/07-Opportunities/Agent治理与权限审计服务.md` | 2026-04-28 | 2026-05-07 | Agent 权限治理与审计层 | 问题：Agent 权限失控；对象：CIO/CISO/合规；流程：权限审批、调用审计、风险拦截；价值：降低安全和合规风险；触发：Agent 从问答进入执行；边界：平台内置治理可能压缩独立空间 | signals: legacy-signal-20260506-batch; points: legacy-point-20260506-claude-code-auto-mode; trends: legacy-trend-ai-governance | 需补企业采购案例、价格和事故触发点 | `01-SiteV2/content/08-opportunities/deep-dive/legacy/` |
| `legacy-opportunity-agent-infra-service` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI Agent基础设施服务.md` | legacy | 2026-05-07 | Agent 基础设施服务层 | 问题：企业 Agent 部署缺少运行底座；对象：平台工程/AI 团队；流程：部署、监控、权限、成本；价值：降低落地复杂度；触发：多 Agent 进入企业流程；边界：云厂商可能内置 | trends: legacy-trend-ai-agent | 需补客户与技术架构证据 | same |
| `legacy-opportunity-one-person-coding-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/AICoding驱动一人公司工具链.md` | legacy | 2026-05-07 | AI Coding 一人公司工具链 | 问题：小团队从构想到交付链条长；对象：独立开发者/小团队；流程：开发、测试、发布、增长；价值：压缩人力与周期；触发：Agentic coding 成熟；边界：商业化和获客仍是瓶颈 | trends: legacy-trend-ai-coding | 需补收入样本和留存证据 | same |
| `legacy-opportunity-interactive-content-platform` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI互动内容平台.md` | legacy | 2026-05-07 | AI 互动内容生产平台 | 问题：内容互动成本高；对象：媒体/教育/营销团队；流程：内容生成、互动、分发；价值：提升参与和转化；触发：多模态和对话体验成熟；边界：内容同质化与版权风险 | trends: AI营销 | 需补客户付费和内容效果数据 | same |
| `legacy-opportunity-customer-service-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI企业客服执行Agent.md` | legacy | 2026-05-07 | 企业客服执行 Agent | 问题：客服成本高、响应慢；对象：客服中心/本地服务/电商；流程：接待、工单、预约、售后；价值：降本和提升线索响应；触发：语音模型和 CRM 集成成熟；边界：体验、合规和平台内置竞争 | signals: S-2026-05-06-003; points: legacy-point-20260506-voice-interface; trends: legacy-trend-ai-customer-service | 需补转化率、投诉率、定价 | same |
| `legacy-opportunity-sales-intelligence-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI商业洞察与销售赋能Agent.md` | legacy | 2026-05-07 | 商业洞察与销售赋能 Agent | 问题：销售研究和客户洞察慢；对象：销售/BD/市场负责人；流程：线索研究、客户画像、销售话术；价值：提高销售效率；触发：企业数据与公开信息可被 Agent 编排；边界：数据质量和 CRM 集成 | trends: AI营销, AI Agent | 需补转化率和真实销售案例 | same |
| `legacy-opportunity-ai-infra-hosting` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI基础设施托管服务.md` | legacy | 2026-05-07 | AI 工程环境与托管基础设施 | 问题：Agent 开发、复现、测试环境不稳定；对象：工程团队/平台工程；流程：环境复现、调试、回放、审计；价值：降低 Agentic debug 失败成本；触发：Crabbox 等环境复现实践；边界：安全、成本和私有化 | signals: S-2026-05-06-002; points: legacy-point-20260506-crabbox-debug; trends: legacy-trend-ai-coding | 需补企业采用和成本模型 | same |
| `legacy-opportunity-ai-growth-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI增长Agent.md` | legacy | 2026-05-07 | AI 增长运营 Agent | 问题：增长实验和触达链路分散；对象：增长/营销/运营团队；流程：分群、触达、归因、复盘；价值：提高 ROI；触发：数据激活与自动化行动升温；边界：渠道规则和归因可信度 | trends: legacy-trend-ai-marketing | 需补客户增长数据 | same |
| `legacy-opportunity-cs-qa-ticket-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI客服质检与工单智能Agent.md` | legacy | 2026-05-07 | 客服质检与工单智能 Agent | 问题：质检和工单分流成本高；对象：客服运营/质检团队；流程：质检、分流、升级、复盘；价值：提升质量和效率；触发：客服 Agent 平台化；边界：误判和客户体验风险 | trends: legacy-trend-ai-customer-service | 需补处理率和质检准确率 | same |
| `legacy-opportunity-engineering-simulation` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI工程仿真软件.md` | legacy | 2026-05-07 | AI 工程仿真辅助系统 | 问题：工程仿真周期长；对象：制造/能源/工业研发；流程：建模、仿真、优化；价值：降低研发周期；触发：科学计算与 AI 工具结合；边界：专业验证和责任风险 | trends: industrial AI | 需补行业案例和精度验证 | same |
| `legacy-opportunity-bidding-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI招投标Agent.md` | legacy | 2026-05-07 | 招投标响应 Agent | 问题：标书响应慢、合规要求重；对象：售前/投标/采购团队；流程：需求解析、文档生成、合规检查；价值：提升响应效率；触发：文档工作流 AI 成熟；边界：行业知识和责任审查 | trends: enterprise workflow | 需补真实投标效率数据 | same |
| `legacy-opportunity-user-research-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI用户研究Agent.md` | legacy | 2026-05-07 | 用户研究分析 Agent | 问题：访谈、反馈和洞察整理慢；对象：产品/增长/用户研究团队；流程：访谈整理、聚类、洞察提炼；价值：提升决策速度；触发：长文本和语音转写成熟；边界：洞察质量和样本偏差 | trends: AI product workflow | 需补研究质量评估 | same |
| `legacy-opportunity-marketing-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI营销Agent.md` | legacy | 2026-05-07 | AI 营销执行 Agent | 问题：内容、投放和归因割裂；对象：营销团队/中小商家；流程：内容生成、触达、转化分析；价值：降本和提高 ROI；触发：营销数据激活升温；边界：渠道封禁和同质化 | trends: legacy-trend-ai-marketing | 需补 ROI 和留存证据 | same |
| `legacy-opportunity-memory-layer` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI记忆层基础设施.md` | legacy | 2026-05-07 | AI 记忆层基础设施 | 问题：Agent 缺少可控长期上下文；对象：AI 应用开发者/企业平台；流程：记忆存储、检索、权限；价值：提升连续任务能力；触发：Agent 长流程使用增加；边界：隐私和数据治理 | trends: AI Agent | 需补客户和数据合规证据 | same |
| `legacy-opportunity-voice-cs-triage` | `10-Archive/v1.0/source-dirs/07-Opportunities/AI语音客服首轮分流助手.md` | legacy | 2026-05-07 | 语音客服首轮分流助手 | 问题：电话接待和分流成本高；对象：本地服务/连锁/客服团队；流程：接听、意图识别、工单结构化；价值：减少漏接和人工成本；触发：语音模型体验提升；边界：延迟、隐私、话术合规 | points: legacy-point-20260506-voice-interface | 需补通话成本和转人工质量 | same |
| `legacy-opportunity-professional-services-workflow` | `10-Archive/v1.0/source-dirs/07-Opportunities/专业服务AI工作流平台.md` | legacy | 2026-05-07 | 专业服务 AI 工作流平台 | 问题：法律/咨询/审计文档工作重；对象：专业服务机构；流程：检索、审阅、摘要、交付；价值：提升交付效率；触发：法律 AI 和专业文本 AI 商业证据增强；边界：责任和专业质量 | trends: professional services AI | 需补续约、定价和错误率 | same |
| `legacy-opportunity-smb-marketing-chat` | `10-Archive/v1.0/source-dirs/07-Opportunities/中小商家AI营销对话平台.md` | legacy | 2026-05-07 | 中小商家营销对话平台 | 问题：商家私域经营和客服营销人力不足；对象：中小商家；流程：咨询、推荐、转化、复购；价值：提高成交和复购；触发：商家 AI 对话规模上升；边界：平台规则和低客单价 | trends: legacy-trend-ai-marketing | 需补付费意愿和转化数据 | same |
| `legacy-opportunity-medical-imaging-ai` | `10-Archive/v1.0/source-dirs/07-Opportunities/临床影像AI辅助诊断平台.md` | legacy | 2026-05-07 | 临床影像辅助诊断平台 | 问题：影像诊断压力和误诊风险；对象：医院/影像科；流程：阅片、提示、质控；价值：提升效率和一致性；触发：医疗 AI 成熟；边界：监管、责任和采购周期 | trends: medical AI | 需补临床验证和准入证据 | same |
| `legacy-opportunity-enterprise-agent-workspace` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业Agent工作平台.md` | legacy | 2026-05-07 | 企业 Agent 工作平台 | 问题：企业 Agent 缺少上下文、权限和工作流模板；对象：大中型企业；流程：上下文接入、流程执行、审计；价值：让 Agent 稳定进入业务流程；触发：企业部署 Agent 需求升温；边界：交付重、ROI 难证明 | points: legacy-point-20260506-enterprise-agent-change; trends: legacy-trend-ai-agent | 需补具体流程 ROI | same |
| `legacy-opportunity-workflow-template-library` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业AI工作流样板库.md` | legacy | 2026-05-07 | 企业 AI 工作流样板库 | 问题：企业不知道从哪些流程落地 AI；对象：业务负责人/咨询/实施团队；流程：场景识别、模板配置、复盘；价值：降低落地试错；触发：企业 AI 从实验进入流程改造；边界：模板泛化有限 | trends: enterprise workflow | 需补行业模板验证 | same |
| `legacy-opportunity-customer-experience-platform` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业客户体验Agent平台.md` | legacy | 2026-05-07 | 客户体验 Agent 平台 | 问题：客服、销售和体验数据割裂；对象：CX/客服/销售负责人；流程：接待、分析、跟进；价值：统一客户前台；触发：客服 Agent 平台化；边界：CRM/客服平台竞争强 | trends: legacy-trend-ai-customer-service | 需补客户留存和集成证据 | same |
| `legacy-opportunity-data-intelligence-control-plane` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业数据智能体控制平面.md` | legacy | 2026-05-07 | 企业数据智能控制平面 | 问题：数据智能从问答到业务动作缺控制层；对象：数据团队/经营负责人；流程：查询、异常识别、任务触发；价值：提高经营响应；触发：Palantir/Omni 等数据智能信号；边界：数据质量和 BI 竞争 | signals: S-2026-05-06-008 | 需补客户案例和业务指标 | same |
| `legacy-opportunity-doc-finance-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/企业文档与财务流程Agent.md` | legacy | 2026-05-07 | 企业文档与财务流程 Agent | 问题：采购、财务、文档处理人力重；对象：CFO/财务共享/采购；流程：文档抽取、匹配、审批；价值：降本和缩短周期；触发：P2P agentic automation；边界：ERP 集成和错误责任 | signals: S-2026-05-06-002 | 需补 ROI、部署周期和错误率 | same |
| `legacy-opportunity-embodied-control-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/具身智能控制栈与评测平台.md` | legacy | 2026-05-07 | 具身智能控制栈与评测平台 | 问题：机器人能力验证和控制栈复杂；对象：机器人团队/工业客户；流程：仿真、评测、控制；价值：降低开发和测试成本；触发：具身智能资本关注；边界：商业化周期长 | trends: embodied AI | 需补客户和量产证据 | same |
| `legacy-opportunity-logistics-robot` | `10-Archive/v1.0/source-dirs/07-Opportunities/具身智能物流机器人.md` | legacy | 2026-05-07 | 物流场景具身智能机器人 | 问题：仓储物流人力和效率压力；对象：物流/仓储/制造；流程：搬运、分拣、巡检；价值：自动化降本；触发：机器人能力与硬件成本变化；边界：部署成本、场景复杂度 | trends: embodied AI | 需补真实部署和单位经济模型 | same |
| `legacy-opportunity-unmanned-system-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/无人系统任务执行智能体平台.md` | legacy | 2026-05-07 | 无人系统任务执行智能体 | 问题：无人系统任务规划和执行复杂；对象：安防/巡检/工业客户；流程：任务规划、执行、监控；价值：提升自动化任务能力；触发：无人系统 AI 融资；边界：监管和安全责任 | trends: AI Agent / robotics | 需补合同与合规证据 | same |
| `legacy-opportunity-edge-inference-stack` | `10-Archive/v1.0/source-dirs/07-Opportunities/端侧推理芯片与软件栈.md` | legacy | 2026-05-07 | 端侧推理芯片与软件栈 | 问题：云端推理成本、延迟和隐私压力；对象：硬件厂商/IoT/终端应用；流程：模型压缩、部署、运行；价值：降低延迟和成本；触发：端侧模型成熟；边界：硬件周期和生态锁定 | trends: edge AI | 需补出货和开发者生态证据 | same |
| `legacy-opportunity-expert-knowledge-agent` | `10-Archive/v1.0/source-dirs/07-Opportunities/行业专家知识Agent化.md` | legacy | 2026-05-07 | 行业专家知识 Agent 化 | 问题：专家知识难规模化交付；对象：咨询/培训/行业服务机构；流程：知识沉淀、问答、交付；价值：降低交付边际成本；触发：知识库和 Agent 工具成熟；边界：知识质量、版权和责任 | trends: AI Knowledge Base | 需补客户付费和知识授权证据 | same |

## 批量重加工结论

- 已将 28 个 V1 Opportunity 文件转为 V2 机会解码候选。
- 所有候选均保留 `source_path`、`converted_at`、V2 目标目录、关系字段和证据缺口。
- 这些候选不能直接前台展示；进入正式机会解码前必须逐条补 S/A/B 来源、反证、趋势背景和观点校准。
