import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inferOpportunitySignals, opportunitySignalsYaml } from "./opportunity-signals-utils.mjs";

const root = process.cwd();
const sourceTitleTranslationsFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date");
if (!date) {
  console.error("Missing --date=YYYY-MM-DD");
  process.exit(2);
}

const now = new Date().toISOString();
const autoSignalEnabled = args.get("auto-signals") !== "false" && args.get("manual-only") !== "true";
const rawDirectEnabled = args.get("from-raw") !== "false";
const includeBusinessObservations = args.get("include-business-observations") === "true";
const assetGenerationLimit = args.has("asset-generation-limit")
  ? nonNegativeInt(args.get("asset-generation-limit"), Number.POSITIVE_INFINITY)
  : Number.POSITIVE_INFINITY;
const generateTrendCandidates = args.get("trend-candidates") === "true";

const signalSpecs = {
  "2026-06-06": [
    {
      id: "SIG-20260606-E01",
      poolRef: "P-030",
      type: "case",
      dir: "case",
      slug: "contrario-launches-ai-agent-human-recruiter-workflow",
      company: "Contrario",
      title: "Contrario launches AI agents paired with human recruiters",
      eventLine: "Contrario launched a recruiting workflow that pairs AI agents with human recruiters instead of replacing them outright.",
      whyWatch: "This is a workflow-positioning signal in a concrete business function, not a generic AI-agent list.",
      businessMeaning: "It points to a hybrid adoption pattern where AI handles repeatable recruiting work while human recruiters remain accountable for judgment and candidate relationships.",
      evidenceBoundary: "The source confirms the product positioning; customer outcomes and deployment metrics still need follow-up.",
      watchWindow: "Watch for customer pilots, placement metrics, recruiter productivity claims, and integrations with ATS or HR systems.",
    },
  ],
  "2026-05-20": [
    {
      id: "SIG-20260520-01",
      poolRef: "P-001",
      type: "funding",
      dir: "funding",
      slug: "trace-raises-3m-for-enterprise-agent-context",
      company: "Trace",
      title: "Trace 融资 300 万美元，瞄准企业智能体上下文管理",
      eventLine: "Trace 获得 300 万美元融资，产品方向是把企业环境和流程映射给智能体使用。",
      whyWatch: "这条信号把融资和企业智能体落地难题连在一起，问题落在流程、权限和上下文交付。",
      businessMeaning: "企业采用智能体时，预算不只花在模型调用上，也会流向流程梳理、系统上下文和部署管理。",
      evidenceBoundary: "公开材料能确认融资金额、公司方向和产品定位，暂未看到客户部署名单。",
      watchWindow: "未来 30 天观察是否出现设计伙伴、企业客户或与现有系统集成的更多说明。",
    },
    {
      id: "SIG-20260520-02",
      poolRef: "P-006",
      type: "funding",
      dir: "funding",
      slug: "lio-raises-30m-for-procurement-agent-platform",
      company: "Lio",
      title: "Lio 融资 3000 万美元，推进企业采购智能体平台",
      eventLine: "Lio 宣布 3000 万美元 A 轮融资，方向是用虚拟劳动力处理企业采购流程。",
      whyWatch: "采购是流程重、审批多、系统分散的企业场景，适合观察智能体是否进入实际运营环节。",
      businessMeaning: "如果这类产品能跑通，影响的是采购岗位、审批流程、预算责任和供应商协作方式。",
      evidenceBoundary: "公开信息确认融资和产品方向，客户规模和部署深度仍需后续补充。",
      watchWindow: "继续看 Lio 是否披露客户案例、采购系统集成和端到端处理结果。",
    },
    {
      id: "SIG-20260520-03",
      poolRef: "P-004",
      type: "case",
      dir: "case",
      slug: "snowflake-anthropic-expand-claude-enterprise-agent-deployment",
      company: "Snowflake / Anthropic",
      title: "Snowflake 与 Anthropic 扩大合作，推进企业智能体部署",
      eventLine: "Anthropic 公布与 Snowflake 的多年合作，Claude 将面向 Snowflake 客户和内部业务流程使用。",
      whyWatch: "这不是单一模型发布，而是模型进入数据平台、销售流程和工程组织的部署信号。",
      businessMeaning: "企业客户会更关心数据边界、销售效率、工程交付和平台采购之间的责任划分。",
      evidenceBoundary: "材料来自 Anthropic 官方发布，能确认合作范围；具体客户效果仍需案例补充。",
      watchWindow: "继续看 Snowflake 客户是否公开采用 Claude 智能体，以及销售和工程流程指标是否披露。",
    },
    {
      id: "SIG-20260520-04",
      poolRef: "P-005",
      type: "case",
      dir: "case",
      slug: "nhs-sbs-salesforce-ai-platform-for-finance-and-procurement",
      company: "NHS Shared Business Services / Salesforce",
      title: "NHS SBS 与 Salesforce 部署 AI 平台，处理财务和采购服务",
      eventLine: "NHS SBS 与 Salesforce 推出统一财务和采购服务中的 AI 数字帮助中心。",
      whyWatch: "材料落在公共服务的财务和采购流程，不只是工具试用，而是工作流改造。",
      businessMeaning: "影响的是供应商响应、员工服务体验、采购交付速度和公共部门流程责任。",
      evidenceBoundary: "Salesforce 官方材料确认部署方向和服务范围，仍需观察实际效率指标。",
      watchWindow: "继续看 NHS SBS 是否公布处理时长、满意度或采购结算效率变化。",
    },
    {
      id: "SIG-20260520-05",
      poolRef: "P-007",
      type: "funding",
      dir: "funding",
      slug: "wonderful-raises-150m-for-enterprise-agent-expansion",
      company: "Wonderful",
      title: "Wonderful 融资 1.5 亿美元，扩张企业 AI Agent 平台",
      eventLine: "Wonderful 宣布 1.5 亿美元 B 轮融资，用于扩大企业 AI Agent 平台和全球市场。",
      whyWatch: "大额融资说明企业 Agent 的竞争已经延伸到跨市场交付，而不只是模型能力。",
      businessMeaning: "后续重点会落在客户扩张、交付队伍、区域市场和企业采购周期。",
      evidenceBoundary: "材料能确认融资金额和扩张方向，客户留存、收入质量和部署深度还需补证。",
      watchWindow: "未来 90 天观察 Wonderful 是否披露行业客户、区域增长和交付指标。",
    },
    {
      id: "SIG-20260520-06",
      poolRef: "P-008",
      type: "funding",
      dir: "funding",
      slug: "nexus-raises-4-3m-for-business-team-agent-deployment",
      company: "Nexus",
      title: "Nexus 融资 430 万美元，帮助业务团队部署 AI Agents",
      eventLine: "Nexus 宣布 430 万美元种子轮融资，目标是让业务团队部署 AI Agents。",
      whyWatch: "这类产品把 Agent 从工程团队推向业务团队，关键会变成权限、流程和可复用模板。",
      businessMeaning: "影响的是业务部门能否自己配置流程，以及 IT 团队如何管理访问和风险。",
      evidenceBoundary: "材料确认融资和产品方向，缺少公开客户案例和部署指标。",
      watchWindow: "继续看 Nexus 是否公布业务团队使用场景、模板市场或治理能力。",
    },
    {
      id: "SIG-20260520-07",
      poolRef: "P-050",
      type: "case",
      dir: "case",
      slug: "veltrisone-launches-vertical-ai-orchestration-platform",
      company: "Veltris",
      title: "Veltris 发布 VeltrisOne，面向多行业工作流编排 AI",
      eventLine: "Veltris 发布 VeltrisOne，覆盖医疗、通信和制造等微行业工作流。",
      whyWatch: "这条材料带有部署指标，能把垂直 AI 从产品介绍推进到具体行业流程。",
      businessMeaning: "影响的是行业流程中的理赔、运维、质检和系统集成责任。",
      evidenceBoundary: "PRNewswire 材料给出若干效率指标，但仍需后续客户独立案例验证。",
      watchWindow: "继续看这些指标是否被客户案例、合作伙伴或行业渠道二次确认。",
    },
  ],
  "2026-05-21": [
    {
      id: "SIG-20260521-01",
      poolRef: "P-007",
      type: "funding",
      dir: "funding",
      slug: "camgraphic-raises-25m-for-ai-energy-efficiency",
      company: "CamGraPhIC",
      title: "CamGraPhIC 获得 2500 万欧元融资，推进 AI 光互连",
      eventLine: "Cambridge 披露 CamGraPhIC 获得 2500 万欧元融资，用于能效和带宽相关的光子互连技术。",
      whyWatch: "AI 成本不只来自模型，也来自算力基础设施的能耗、延迟和带宽。",
      businessMeaning: "如果技术路线成立，影响的是数据中心成本、芯片互连预算和基础设施采购判断。",
      evidenceBoundary: "大学来源确认融资和技术方向，商业客户和量产时间仍需观察。",
      watchWindow: "继续看 CamGraPhIC 是否披露产业合作、试点客户或量产计划。",
    },
    {
      id: "SIG-20260521-02",
      poolRef: "P-008",
      type: "product_service",
      dir: "product-service",
      slug: "openai-launches-frontier-for-enterprise-customers",
      company: "OpenAI",
      title: "OpenAI 推出 Frontier，争取更多企业客户",
      eventLine: "OpenAI 推出面向企业的新平台 Frontier，并把它与既有企业产品组合连接起来。",
      whyWatch: "这条信号说明头部模型公司在从模型订阅走向企业平台和客户份额争夺。",
      businessMeaning: "企业客户会把模型能力、账号治理、合同承诺和容量保障放在同一轮采购里比较。",
      evidenceBoundary: "CNBC 材料能确认产品动作和企业客户诉求，具体价格和客户名单仍需补充。",
      watchWindow: "继续看 Frontier 是否披露功能边界、定价方式和企业客户采用案例。",
    },
    {
      id: "SIG-20260521-03",
      poolRef: "P-044",
      type: "case",
      dir: "case",
      slug: "ltm-uses-copilot-agents-for-hr-and-sales",
      company: "LTM / Microsoft",
      title: "LTM 在 HR 和销售组织部署 Copilot Agents",
      eventLine: "Microsoft 案例显示，LTM 将 Copilot Agents 用于 HR 和销售组织流程。",
      whyWatch: "这是企业内部职能部门使用智能体的案例，重点不在模型，而在岗位流程。",
      businessMeaning: "影响的是 HR 服务、销售跟进、员工支持和管理者对流程结果的复核。",
      evidenceBoundary: "Microsoft 案例确认部署方向，具体节省时间、使用人数和业务结果仍需更多公开指标。",
      watchWindow: "继续看 LTM 是否披露使用规模、节省时间或销售流程改进数据。",
    },
    {
      id: "SIG-20260521-04",
      poolRef: "P-045",
      type: "case",
      dir: "case",
      slug: "built-mightybot-draw-agent-for-construction-lending",
      company: "Built / MightyBot",
      title: "Built 与 MightyBot 发布建设贷款 Draw Agent 生产案例",
      eventLine: "Built 和 MightyBot 披露 Draw Agent 生产案例，服务建设贷款相关工作流。",
      whyWatch: "它把 AI Agent 放进垂直金融流程，关注点是材料处理、准确率和交付周期。",
      businessMeaning: "影响的是贷款运营、风控复核、文件处理和专业服务交付成本。",
      evidenceBoundary: "案例披露了三个月构建窗口和效果描述，仍需更细的生产指标。",
      watchWindow: "继续看是否出现更多建设金融客户、准确率口径和人工复核安排。",
    },
    {
      id: "SIG-20260521-05",
      poolRef: "P-046",
      type: "case",
      dir: "case",
      slug: "druid-ai-voice-agents-cut-surgery-scheduling-time",
      company: "Druid AI",
      title: "Druid AI 部署语音 Agent，手术预约时间减少 50%",
      eventLine: "Druid AI 案例显示，欧洲眼科集团用语音 Agent 改造患者体验和手术预约流程。",
      whyWatch: "这条医疗运营案例带有明确数字，能观察 AI 是否进入高摩擦服务流程。",
      businessMeaning: "影响的是患者服务、排班效率、前台人力和医疗机构的运营体验。",
      evidenceBoundary: "案例披露了 50% 时间缩短，仍需确认样本范围和统计口径。",
      watchWindow: "继续看是否有更多医院、科室或患者体验指标被公开。",
    },
    {
      id: "SIG-20260521-06",
      poolRef: "P-047",
      type: "case",
      dir: "case",
      slug: "druid-ai-agents-automate-insurance-claims-notification",
      company: "Druid AI",
      title: "欧洲保险公司部署 Druid AI Agent 处理理赔通知",
      eventLine: "Druid AI 案例显示，欧洲保险公司用 AI Agent 处理理赔通知和顾问分配流程。",
      whyWatch: "理赔通知是保险运营里的高频流程，适合观察 AI Agent 是否降低人工流转。",
      businessMeaning: "影响的是理赔处理、客户响应、销售顾问路由和后台系统录入。",
      evidenceBoundary: "案例确认流程范围，缺少公开的处理时长、准确率和投诉变化数据。",
      watchWindow: "继续看保险客户是否披露规模、节省人力或合规复核安排。",
    },
    {
      id: "SIG-20260521-07",
      poolRef: "P-048",
      type: "case",
      dir: "case",
      slug: "choco-uses-openai-agents-for-food-distribution-orders",
      company: "Choco / OpenAI",
      title: "Choco 部署 OpenAI Agent 处理食品分销订单",
      eventLine: "OpenAI 案例显示，Choco 用 OrderAgent 和 VoiceAgent 减少分销商人工录单。",
      whyWatch: "它落在传统分销行业的订单流，不是通用聊天，而是具体运营任务。",
      businessMeaning: "影响的是订单录入、电话沟通、分销商人力和供应链响应速度。",
      evidenceBoundary: "OpenAI 案例确认应用方向，仍需观察第三方指标和客户侧复盘。",
      watchWindow: "继续看 Choco 是否披露订单量、错误率和分销商采用范围。",
    },
  ],
  "2026-05-22": [
    {
      id: "SIG-20260522-01",
      poolRef: "P-002",
      type: "funding",
      dir: "funding",
      slug: "inference-net-raises-11-8m-for-custom-ai-models",
      company: "Inference.net",
      title: "Inference.net 融资 1180 万美元，推进企业定制模型部署",
      eventLine: "Inference.net 宣布 1180 万美元种子轮融资，方向是帮助企业训练和部署成本更低的定制 AI 模型。",
      whyWatch: "这条信号把模型能力拉回企业成本问题：企业不一定只买通用模型，也会评估能否用定制模型降低调用和部署成本。",
      businessMeaning: "影响的是企业 AI 预算、模型选型、部署方式和应用公司的毛利空间。",
      evidenceBoundary: "公开材料能确认融资金额、投资方和产品方向，暂未看到客户名单或生产部署指标。",
      watchWindow: "未来 30 到 90 天观察是否披露企业客户、模型成本对比和部署规模。",
    },
    {
      id: "SIG-20260522-02",
      poolRef: "P-003",
      type: "case",
      dir: "case",
      slug: "snowflake-anthropic-200m-partnership-for-enterprise-agents",
      company: "Snowflake / Anthropic",
      title: "Snowflake 与 Anthropic 扩大合作，把 Claude 推向企业 Agent 部署",
      eventLine: "Anthropic 公布与 Snowflake 的多年合作，协议金额为 2 亿美元，并面向 Snowflake 客户推进 AI Agent 部署。",
      whyWatch: "模型进入数据平台后，企业比较的不是单次调用，而是数据边界、销售流程、工程效率和平台采购责任。",
      businessMeaning: "这会影响数据平台客户的 AI 采购路径，也会把模型公司和云数据平台放进同一轮预算讨论。",
      evidenceBoundary: "材料来自 Anthropic 官方发布，能确认合作范围和内部使用方向；客户成效和外部采用规模仍需案例补充。",
      watchWindow: "继续看 Snowflake 客户是否公开采用 Claude Agent，以及销售和工程流程指标是否披露。",
    },
    {
      id: "SIG-20260522-03",
      poolRef: "P-005",
      type: "funding",
      dir: "funding",
      slug: "wonderful-raises-150m-for-enterprise-agent-expansion",
      company: "Wonderful",
      title: "Wonderful 融资 1.5 亿美元，扩张企业 AI Agent 平台",
      eventLine: "Wonderful 宣布 1.5 亿美元 B 轮融资，用于扩大企业 AI Agent 平台和全球交付团队。",
      whyWatch: "这条融资把企业 Agent 从产品能力推向本地交付和跨市场复制，说明落地成本正在进入资本判断。",
      businessMeaning: "后续重点会落在客户扩张、交付队伍、区域市场和企业采购周期。",
      evidenceBoundary: "材料能确认融资金额、扩张方向和行业覆盖，客户留存、收入质量和部署深度还需补证。",
      watchWindow: "未来 90 天观察 Wonderful 是否披露行业客户、区域增长和交付指标。",
    },
    {
      id: "SIG-20260522-04",
      poolRef: "P-007",
      type: "funding",
      dir: "funding",
      slug: "temporal-raises-300m-for-agentic-ai-production-layer",
      company: "Temporal",
      title: "Temporal 融资 3 亿美元，补企业 Agent 的生产运行层",
      eventLine: "Temporal 宣布 3 亿美元 D 轮融资，定位是为长时间运行、有状态的 AI 系统提供可靠执行层。",
      whyWatch: "企业 Agent 卡在试点到生产之间时，问题常常不是模型会不会，而是任务能否稳定运行、恢复和审计。",
      businessMeaning: "这会影响开发团队、平台团队和 CIO 对 Agent 基础设施预算的判断。",
      evidenceBoundary: "材料确认融资、估值和产品定位，真实客户部署深度和运行指标仍需补充。",
      watchWindow: "继续看 Temporal 是否披露生产客户、任务失败后的恢复方式和系统集成案例。",
    },
    {
      id: "SIG-20260522-05",
      poolRef: "P-008",
      type: "funding",
      dir: "funding",
      slug: "trace-raises-3m-for-enterprise-agent-context",
      company: "Trace",
      title: "Trace 融资 300 万美元，解决企业 Agent 上下文缺口",
      eventLine: "TechCrunch 披露 Trace 获得 300 万美元融资，产品方向是映射企业环境和流程，让 Agent 具备可执行上下文。",
      whyWatch: "Agent 进入企业后，难点会从生成答案转向理解组织流程、系统边界和任务分配。",
      businessMeaning: "企业预算可能流向流程梳理、上下文管理、权限配置和部署服务，而不只是模型调用。",
      evidenceBoundary: "材料能确认融资、团队方向和产品定位，缺少公开客户案例和部署指标。",
      watchWindow: "继续看 Trace 是否公布设计伙伴、企业客户或与现有系统集成的更多说明。",
    },
    {
      id: "SIG-20260522-06",
      poolRef: "P-014",
      type: "funding",
      dir: "funding",
      slug: "sycamore-labs-raises-65m-for-enterprise-agent-platform",
      company: "Sycamore Labs",
      title: "Sycamore Labs 融资 6500 万美元，建设企业 AI Agent 平台",
      eventLine: "Sycamore Labs 宣布 6500 万美元种子轮融资，目标是构建、部署和管理企业级自主 Agent。",
      whyWatch: "这笔融资把企业 Agent 的竞争点放在安全、人类监督和组织知识沉淀，而不是单纯模型能力。",
      businessMeaning: "企业采用时会关心谁能批准 Agent 行动、如何复核输出，以及知识和权限如何留在组织内部。",
      evidenceBoundary: "材料能确认融资金额、投资方和平台方向，暂未看到客户名单或实际生产案例。",
      watchWindow: "未来 60 到 90 天观察是否披露客户、治理能力和部署流程。",
    },
    {
      id: "SIG-20260522-07",
      poolRef: "P-041",
      type: "case",
      dir: "case",
      slug: "adventhealth-uses-chatgpt-for-healthcare-care-workflows",
      company: "AdventHealth / OpenAI",
      title: "AdventHealth 部署 ChatGPT for Healthcare，推进医疗服务工作流",
      eventLine: "OpenAI 发布 AdventHealth 案例，说明 ChatGPT for Healthcare 正进入具名医疗机构的服务和照护工作流。",
      whyWatch: "医疗案例比通用办公更能暴露 AI 落地边界：使用者、责任、流程范围和临床措辞都需要被管住。",
      businessMeaning: "影响的是医疗机构的服务流程、员工支持、患者体验和合规复核责任。",
      evidenceBoundary: "材料来自 OpenAI 官方案例，能确认具名机构和垂直场景；公开写作前仍需复核具体临床或运营指标措辞。",
      watchWindow: "继续看 AdventHealth 是否披露更具体的科室、流程、使用规模和效果指标。",
    },
  ],
  "2026-05-23": [
    {
      id: "SIG-20260523-01",
      poolRef: "P-004",
      type: "funding",
      dir: "funding",
      slug: "netomi-raises-110m-for-agentic-customer-experience",
      company: "Netomi",
      title: "Netomi 融资 1.1 亿美元，扩展高风险客户体验智能体",
      eventLine: "Netomi 宣布完成 1.1 亿美元融资，用于扩展面向复杂企业环境的 agentic CX 平台。",
      whyWatch: "这条信号把大额融资、企业级客户体验和可审计运行环境放在一起，说明智能体预算正在从通用工具走向高风险业务流程。",
      businessMeaning: "企业老板需要关注的不是客服机器人本身，而是客服回复、合规审核、升级转人工和断线后的恢复责任被打包进同一套 AI 交付责任。",
      evidenceBoundary: "材料确认融资金额、投资方、平台定位和若干客户名称；客户部署深度、续约数据和具体 ROI 仍需后续材料补证。",
      watchWindow: "未来 60 到 90 天观察 Netomi 是否披露行业客户案例、部署规模、处理量、留存或合规指标。",
    },
    {
      id: "SIG-20260523-02",
      poolRef: "P-008",
      type: "case",
      dir: "case",
      slug: "accenture-amazon-business-ai-ordering-agent-for-procurement",
      company: "Accenture / Amazon Business / AWS",
      title: "Accenture 与 Amazon Business 推出企业采购 Ordering Agent",
      eventLine: "Accenture、Amazon Business 和 AWS 在 Marketplace 发布 AI Ordering Agent，用于自动处理企业采购下单与跟踪流程。",
      whyWatch: "采购是预算、审批、供应商和系统集成高度交织的流程，这类产品能观察智能体是否开始进入企业后台运营。",
      businessMeaning: "如果采购智能体跑通，影响的是采购岗位分工、供应商响应、审批责任和企业对云市场软件的购买方式。",
      evidenceBoundary: "AWS Marketplace 页面可确认产品、参与方和功能描述；真实客户效果、处理量和成本改善仍需独立案例补证。",
      watchWindow: "继续观察是否出现客户采用案例、采购系统集成说明、私有报价转化或端到端处理指标。",
    },
  ],
};

const candidateSpecs = {
  "2026-05-20": {
    scene: {
      id: "SCN-20260520-01",
      slug: "enterprise-agents-enter-procurement-data-and-public-service-workflows",
      title: "企业智能体开始进入采购、数据平台和公共服务流程",
      industry: "企业服务、公共服务、采购、数据平台",
      role: "采购负责人、销售团队、公共服务运营团队、IT 管理者",
      workflow: "采购审批、销售问答、财务服务、行业工作流编排",
      changedStep: "AI 从问答工具转向流程节点，开始承担信息汇总、请求处理和系统协同。",
      evidenceGap: "这些材料仍分散在公司发布和融资新闻里，缺少统一的客户使用深度对比。",
      relatedSignals: ["SIG-20260520-02", "SIG-20260520-03", "SIG-20260520-04", "SIG-20260520-07"],
    },
  },
  "2026-05-21": {
    scene: {
      id: "SCN-20260521-01",
      slug: "vertical-agents-enter-hr-healthcare-insurance-and-distribution",
      title: "垂直 Agent 进入 HR、医疗、保险和食品分销流程",
      industry: "HR、医疗服务、保险、食品分销、建设金融",
      role: "HR 团队、销售团队、前台服务人员、理赔顾问、分销运营人员",
      workflow: "员工服务、手术预约、理赔通知、订单录入、贷款材料处理",
      changedStep: "AI Agent 开始承接重复沟通、材料处理、路由分配和订单录入。",
      evidenceGap: "部分案例有指标，部分案例仍缺少样本范围、连续运行表现和人工复核成本。",
      relatedSignals: ["SIG-20260521-03", "SIG-20260521-04", "SIG-20260521-05", "SIG-20260521-06", "SIG-20260521-07"],
    },
    trend: {
      id: "TRC-20260521-01",
      slug: "enterprise-agent-budget-and-workflow-signals-are-accumulating",
      title: "企业 Agent 的预算和工作流信号开始积累",
      hypothesis: "两天材料共同指向一个候选方向：企业 Agent 不再只按模型能力被讨论，而是被放进预算、容量、行业流程和运营指标里评估。",
      sourceTypes: ["公司发布", "融资新闻", "客户案例"],
      riskBoundary: "目前仍缺少跨公司连续数据，不能写成正式趋势判断。",
      followUpVariables: "继续观察是否出现更多客户部署、容量合同、用量治理和流程指标。",
      relatedSignals: ["SIG-20260520-01", "SIG-20260520-02", "SIG-20260521-02", "SIG-20260521-05", "SIG-20260521-07"],
      relatedOpinions: ["OPN-20260520-01", "OPN-20260521-01"],
    },
  },
  "2026-05-22": {
    scene: {
      id: "SCN-20260522-01",
      slug: "enterprise-agents-enter-data-platform-healthcare-and-agent-ops",
      title: "企业 Agent 进入数据平台、医疗服务和生产运行流程",
      industry: "数据平台、医疗服务、企业软件、Agent 基础设施",
      role: "CIO、开发团队、销售团队、医疗服务团队、平台运营负责人",
      workflow: "数据分析、销售问答、医疗服务支持、Agent 生产运行、企业上下文配置",
      changedStep: "AI 从单点工具走向已有业务系统，开始触碰数据、服务流程、任务失败后的恢复和人工复核责任。",
      evidenceGap: "这些信号仍来自公司发布、融资新闻和单一客户案例，缺少跨客户的连续运行数据。",
      relatedSignals: ["SIG-20260522-02", "SIG-20260522-04", "SIG-20260522-05", "SIG-20260522-07"],
    },
    trend: {
      id: "TRC-20260522-01",
      slug: "enterprise-agent-deployment-shifts-to-workflow-context-and-governance",
      title: "企业 Agent 部署问题转向流程上下文和治理",
      hypothesis: "5 月 22 日的 Snowflake、Temporal、Trace、Sycamore Labs 和 AdventHealth 信号指向同一个问题：企业 Agent 要进入真实流程，必须同时解决上下文、稳定运行和人工复核。",
      sourceTypes: ["公司发布", "融资新闻", "客户案例"],
      riskBoundary: "当前仍缺少跨公司连续指标，尤其缺少部署成本、人工复核成本和长期留存数据，不能写成正式趋势判断。",
      followUpVariables: "继续观察客户案例、生产运行指标、治理功能和实施岗位需求是否继续增加。",
      relatedSignals: ["SIG-20260522-02", "SIG-20260522-04", "SIG-20260522-05", "SIG-20260522-06", "SIG-20260522-07"],
      relatedOpinions: ["OPN-20260522-01"],
    },
  },
};

function runReadiness() {
  const result = spawnSync(process.execPath, [
    "agent-workflow/tools/assert-guanlan-automation-readiness.mjs",
    "--command=assets",
    `--date=${date}`,
    `--require-final-qc=${args.get("require-final-qc") || "true"}`,
    ...(args.get("repair-allow-degraded-assets") === "true" ? ["--repair-allow-degraded-assets=true"] : []),
    ...(args.get("manual-release-override") === "true" ? ["--manual-release-override=true"] : []),
  ], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    process.exit(result.status || 2);
  }
  process.stdout.write(result.stdout || "");
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function write(file, text) {
  ensureDir(file);
  fs.writeFileSync(file, `${text.trimEnd()}\n`, "utf8");
}

function signalCardDirs() {
  return ["funding", "case", "product-service"].map((name) => path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", name));
}

function signalCardFiles() {
  return signalCardDirs().flatMap((dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => path.join(dir, name));
  });
}

function yamlValue(text, key) {
  return text.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "mu"))?.[1]?.trim() || "";
}

function nestedYamlValue(text, key) {
  return text.match(new RegExp(`^  ${key}:\\s*"?([^"\\n]+)"?`, "mu"))?.[1]?.trim() || "";
}

function yamlArrayValue(text, key) {
  const raw = text.match(new RegExp(`^${key}:\\s*\\[(.*)\\]`, "mu"))?.[1] || "";
  return raw.split(",").map((item) => item.trim().replace(/^"|"$/g, "")).filter(Boolean);
}

function normalizedUrl(raw) {
  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/u, "").toLowerCase();
  } catch {
    return String(raw || "").replace(/[?#].*$/u, "").replace(/\/$/u, "").toLowerCase();
  }
}

function normalizedSignalText(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/\blabs?\b/gu, "")
    .replace(/\binc\b|\bcorp\b|\bcorporation\b|\bltd\b/gu, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function publicCardCopy(raw = "") {
  return String(raw || "")
    .replace(/\u95ed\u73af/gu, "\u4eff\u771f\u53cd\u9988\u94fe\u8def")
    .replace(/\u6a21\u5757\u5316\u8f6f\u4ef6\u7528\u4e8e\u89c4\u6a21\u5316/gu, "\u53ef\u7ec4\u5408\u8f6f\u4ef6\u652f\u6491\u5927\u89c4\u6a21")
    .replace(/\u6a21\u5757\u5316/gu, "\u53ef\u7ec4\u5408")
    .replace(/\u7528\u4e8e\u89c4\u6a21\u5316/gu, "\u652f\u6491\u5927\u89c4\u6a21");
}

function hasCjk(value = "") {
  return /[\u4e00-\u9fff]/u.test(String(value || ""));
}

function parseJsonValue(section, key, fallback) {
  const raw = value(section, key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readRawJson(section) {
  const rawJsonPath = value(section, "raw_json");
  if (!rawJsonPath) return {};
  try {
    const rawPath = path.resolve(root, rawJsonPath.replace(/^`|`$/gu, ""));
    return JSON.parse(fs.readFileSync(rawPath, "utf8"));
  } catch {
    return {};
  }
}

function stripSourceNoise(raw = "") {
  return String(raw || "")
    .replace(/\s*\/\s*query=.*$/iu, "")
    .replace(/\s*\/\s*intent=.*$/iu, "")
    .replace(/\s*\/\s*path=.*$/iu, "")
    .replace(/^Skip to Main Content\s*/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function sourceSentences(raw = "") {
  const text = stripSourceNoise(raw);
  if (!text) return [];
  return text
    .split(/(?<=[.!?。！？])\s+|\n+/u)
    .map(stripSourceNoise)
    .filter((item) => item.length >= 28)
    .filter((item) => !/Navigation Menu|Sign in|Search or jump to|Saved searches|Provide feedback|Appearance settings|Twitter|Facebook|LinkedIn|Email Updates/iu.test(item))
    .slice(0, 16);
}

function extractNumbers(raw = "") {
  return [...String(raw || "").matchAll(/(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|K|million|billion)?|\d+(?:\.\d+)?\s?(?:%|M|B|K|million|billion|companies|customers|days|months|tools|vendors)|Fortune\s?\d+)/giu)]
    .map((match) => match[0].replace(/\s+/gu, " ").trim());
}

function sourcePointLooksTemplate(value = "") {
  return /属于 AI 资金流向|属于企业工作流应用信号|属于产品化和企业采用信号|披露 AI (?:产品|客户部署)|相关材料记录了|可用于观察|原文未提供更多可拆分事实点/iu.test(String(value || ""));
}

function sourcePointIsUsable(value = "") {
  const text = stripSourceNoise(value);
  if (!text || sourcePointLooksTemplate(text) || hasTextContamination(text)) return false;
  if (/strategic investment|战略投资/iu.test(text)) return true;
  return /AI|agent|agentic|LLM|model|enterprise|customer|workflow|deployment|platform|cloud|inference|public preview|funding|raises|raised|launched|announced|released|introduced|case study|融资|客户|部署|平台|模型|企业|美元|\$|\d/iu.test(text);
}

function countHan(value = "") {
  return String(value || "").match(/[\u4e00-\u9fff]/gu)?.length || 0;
}

function countLatinWords(value = "") {
  return String(value || "").match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu)?.length || 0;
}

function sourcePointReadyForPublic(value = "") {
  const text = stripSourceNoise(value);
  if (!sourcePointIsUsable(text)) return false;
  const han = countHan(text);
  const latin = countLatinWords(text);
  if (text.length > 90 && latin >= 10 && han < 18) return false;
  if (latin >= 16 && han < 24) return false;
  return true;
}

function sourceTitleFactFromSection(section) {
  const sourceTitle = originalSourceTitleFromSection(section);
  const translated = sourceTitleDisplayTitle(sourceTitle);
  return translated ? `原始来源标题显示：${translated}。` : "";
}

function chineseAmount(raw = "") {
  const text = String(raw || "").replace(/\s+/gu, " ").trim();
  const match = text.match(/([$€£])\s?(\d+(?:\.\d+)?)\s?(M|B|K|million|billion)?/iu);
  if (!match) return "";
  const currency = match[1] === "$" ? "美元" : match[1] === "€" ? "欧元" : "英镑";
  const amount = Number(match[2]);
  const unit = String(match[3] || "").toLowerCase();
  if (!Number.isFinite(amount)) return text;
  if (unit === "b" || unit === "billion") return `${amount}0亿${currency}`.replace(/\.0亿/u, "亿");
  if (unit === "m" || unit === "million") {
    const tenThousands = amount * 100;
    if (tenThousands >= 10000) {
      const yi = tenThousands / 10000;
      return `${Number.isInteger(yi) ? yi : yi.toFixed(2)}亿${currency}`;
    }
    return Number.isInteger(tenThousands) ? `${tenThousands}万${currency}` : `${tenThousands.toFixed(1)}万${currency}`;
  }
  if (unit === "k") return `${amount}千${currency}`;
  return `${amount}${currency}`;
}

function chineseRound(raw = "") {
  const text = String(raw || "").toLowerCase();
  if (/pre[- ]seed/u.test(text)) return "Pre-seed";
  if (/\bseed\b/u.test(text)) return "种子轮";
  const series = text.match(/\bseries\s+([a-z])\b/u)?.[1];
  return series ? `${series.toUpperCase()} 轮` : "";
}

function chinesePurpose(raw = "") {
  const text = stripSourceNoise(raw);
  const purpose = text.match(/\bto\s+(continue\s+building|build|scale|expand|accelerate|support|develop|deliver)\s+([^.;]{12,180})/iu)?.[0] || "";
  if (!purpose) return "";
  return purpose
    .replace(/^to\s+continue\s+building\s+/iu, "继续建设")
    .replace(/^to\s+build\s+/iu, "建设")
    .replace(/^to\s+scale\s+/iu, "扩展")
    .replace(/^to\s+expand\s+/iu, "扩展")
    .replace(/^to\s+accelerate\s+/iu, "加速")
    .replace(/^to\s+support\s+/iu, "支持")
    .replace(/^to\s+develop\s+/iu, "开发")
    .replace(/^to\s+deliver\s+/iu, "交付")
    .replace(/\bagentic operating system\b/giu, "agentic operating system")
    .replace(/\bregulated industries\b/giu, "受监管行业")
    .replace(/\bAI agents?\b/giu, "AI Agent")
    .replace(/\benterprise\b/giu, "企业")
    .replace(/\bworkflow(s)?\b/giu, "工作流")
    .trim();
}

function chineseInvestorLine(raw = "") {
  const text = stripSourceNoise(raw);
  const led = text.match(/\bled by\s+([^.;]+?)(?:,\s+with participation from\s+([^.;]+))?[.;]?$/iu);
  if (!led) return "";
  return `该轮融资由 ${led[1].trim()} 领投${led[2] ? `，${led[2].trim()} 等参与` : ""}。`;
}

function sourceBackedChineseFact(raw = "", context = {}) {
  const text = stripSourceNoise(raw);
  if (!sourcePointIsUsable(text)) return "";
  if (/[\u4e00-\u9fff]/u.test(text) && !sourcePointLooksTemplate(text)) return text.length > 260 ? `${text.slice(0, 259)}...` : text;
  const company = publicCardCopy(context.company || "") || shortCompany(text.match(/^([A-Z][A-Za-z0-9.&' -]{1,80}?)(?:,|\s+(?:announced|has|raised|raises|secured|secures|launched|launches|released|introduced|collaborates|collaboration))/u)?.[1] || "");
  const owner = company || "原文";
  const amount = chineseAmount(extractAmount(text) || text);
  const round = chineseRound(text);
  if (/\b(raises?|raised|funding|financing|seed|series\s+[a-z])\b/iu.test(text)) {
    const purpose = chinesePurpose(text);
    const investorMatch = text.match(/\bfunding from\s+([^.;]+?)(?:,\s+(?:building|with|and)|\.)/iu);
    const buildingMatch = text.match(/\bbuilding\s+([^.;]{20,180}?)(?:,\s+enabling|\.)/iu);
    const investors = investorMatch?.[1]?.replace(/\s+/gu, " ").trim() || "";
    const building = buildingMatch?.[1]
      ?.replace(/\ba learned memory layer\b/giu, "学习型记忆层")
      .replace(/\bAI models?\b/giu, "AI 模型")
      .replace(/\bstudy an organization’s world in advance\b/giu, "提前学习组织知识")
      .replace(/\s+that trains AI 模型 to 提前学习组织知识/giu, "，用于让 AI 模型提前学习组织知识")
      .replace(/\s+/gu, " ")
      .trim() || "";
    const metric = /\bup to\s+100x fewer tokens\b/iu.test(text) ? "并称可将 token 使用量最多减少 100x" : "";
    const details = [
      purpose ? `用于${purpose}` : "",
      investors ? `投资方包括 ${investors}` : "",
      building ? `方向是建设${building}` : "",
      metric,
    ].filter(Boolean);
    return `${owner}宣布完成${amount ? amount : ""}${round ? `${round}` : ""}融资${details.length ? `，${details.join("，")}` : ""}。`.replace(/完成融资/u, "完成融资");
  }
  const investorLine = chineseInvestorLine(text);
  if (investorLine) return investorLine;
  if (/\bstrategic collaboration with\s+([A-Z][A-Za-z0-9.&' -]{1,80})/iu.test(text)) {
    const partner = text.match(/\bstrategic collaboration with\s+([A-Z][A-Za-z0-9.&' -]{1,80})/iu)?.[1]?.trim() || "";
    return `${owner}宣布与 ${partner} 达成战略合作，建设可扩展的 AI 驱动转型基础，并改善企业流程效率与服务体验。`;
  }
  if (/\bCollaboration focuses on improving efficiency\b/iu.test(text)) {
    return "原文称，合作聚焦通过 AI 提升 IT、医院运营和临床支持等企业流程效率，并形成可衡量结果。";
  }
  if (/\bTopaz Fabric\b/iu.test(text)) {
    return "Infosys 使用 Topaz Fabric agentic services suite，将基础设施、模型、数据、应用和工作流整合为可组合的 agent-ready 生态。";
  }
  if (/\bframework will allow\b.*\bembed AI across\b/iu.test(text)) {
    return "该框架将帮助 Sentara 建立参考架构、AI-first SDLC 现代化和治理扩展能力，把 AI 嵌入医院和企业核心工作流。";
  }
  if (/\bplatform is designed for regulated industries\b/iu.test(text)) {
    return "原文称，该平台面向受监管行业设计，强调安全、治理、主权、可审计性和可预测性。";
  }
  if (/\bfull-stack AI company\b/iu.test(text)) {
    return `${owner}是一家全栈 AI 公司，提供面向高风险环境的 agentic operating system 和 AI Agent。`;
  }
  if (/\b(launches?|launched|announces?|announced|released|introduced|available)\b/iu.test(text)) {
    const cleaned = text.replace(/\s+/gu, " ").replace(/\s+\|\s+.*$/u, "").slice(0, 180);
    return `原文称，${cleaned}`;
  }
  if (/\b(customer|case study|deployment|deployed|adopted|used by|rollout|production)\b/iu.test(text)) {
    const cleaned = text.replace(/\s+/gu, " ").slice(0, 180);
    return `原文称，${cleaned}`;
  }
  return "";
}

function translatedSourcePoint(raw = "", type = "", context = {}) {
  const text = stripSourceNoise(raw);
  if (!text) return "";
  if (context.strategicInvestment && /\bstrategic investment\b/iu.test(text)) {
    const investor = text.match(/\bstrategic investment from\s+([^.;]+?)(?:\.|$)/iu)?.[1]?.replace(/\s+/gu, " ").trim() || "";
    return `${context.company || "AI 公司"} 获得${investor ? ` ${investor} ` : ""}战略投资。`;
  }
  if (context.strategicInvestment && /\b(?:series\s+[a-z]|funding|financing|total capital|has raised|raised|raises?|led by)\b|[$€£]\s?\d/iu.test(text) && !/\bstrategic investment\b/iu.test(text)) return "";
  if (/[\u4e00-\u9fff]/u.test(text)) return text.length > 220 ? `${text.slice(0, 219)}...` : text;
  if (type === "funding") {
    const amount = extractAmount(text);
    const company = shortCompany(text.match(/^([A-Z][A-Za-z0-9.&' -]{1,70}?)(?:,|\s+has\s+raised|\s+raises|\s+landed|\s+lands|\s+secured|\s+secures)/u)?.[1] || "");
    const round = text.match(/\b(pre-seed|seed|series\s+[A-Z])\b/iu)?.[0] || "";
    if (amount && company && !isWeakCompanyName(company)) return `${company} 获得 ${amount}${round ? ` ${round}` : ""} 融资。`;
  }
  if (/\b(designed to take action|automatically execute tasks|updates? records|generating follow-up actions|identifying deal risks|coordinating workflows|customer deployment|case study)\b/iu.test(text)) {
    return "原文描述产品把会议、邮件、工单、CRM 或业务数据转为可执行动作。";
  }
  return sourceBackedChineseFact(text, context);
}

function sourcePointsFromSection(section) {
  const raw = readRawJson(section);
  const context = {
    company: companyFromSection(section),
    scenario: scenarioFromText(textForInference(section)),
    strategicInvestment: isConfirmedStrategicInvestment(section, originalSourceTitleFromSection(section)),
  };
  const keyExcerpts = Array.isArray(raw.key_excerpts)
    ? raw.key_excerpts
    : parseJsonValue(section, "key_excerpts", []);
  const evidenceSeed = raw.evidence_seed || parseJsonValue(section, "evidence_seed", {});
  const seedItems = [
    ...(Array.isArray(evidenceSeed.company_actions) ? evidenceSeed.company_actions : []),
    ...(Array.isArray(evidenceSeed.case_details) ? evidenceSeed.case_details : []),
    ...(Array.isArray(evidenceSeed.workflow_changes) ? evidenceSeed.workflow_changes : []),
    ...(Array.isArray(evidenceSeed.risks_or_constraints) ? evidenceSeed.risks_or_constraints : []),
  ];
  const excerptItems = Array.isArray(keyExcerpts) ? keyExcerpts.map((item) => ({ text: item?.text || "", type: item?.type || "" })) : [];
  const titleFact = sourceTitleFactFromSection(section);
  const fromExcerpts = excerptItems.map((item) => translatedSourcePoint(item.text, item.type, context)).filter(sourcePointReadyForPublic);
  const fromSeed = seedItems.map((item) => translatedSourcePoint(item, "", context)).filter(sourcePointReadyForPublic);
  const fromFullText = sourceSentences(raw.full_text || raw.clean_text || "")
    .map((item) => translatedSourcePoint(item, "", context))
    .filter(sourcePointReadyForPublic);
  return [...new Set([titleFact, ...fromExcerpts, ...fromSeed, ...fromFullText].filter(sourcePointReadyForPublic))].slice(0, 6);
}

function sourceExcerptFromSection(section, points = []) {
  const raw = readRawJson(section);
  const context = {
    company: companyFromSection(section),
    scenario: scenarioFromText(textForInference(section)),
    strategicInvestment: isConfirmedStrategicInvestment(section, originalSourceTitleFromSection(section)),
  };
  const firstRaw = sourceSentences(raw.full_text || raw.clean_text || "")
    .map((item) => translatedSourcePoint(item, "", context))
    .find(sourcePointReadyForPublic);
  return points.find(sourcePointReadyForPublic) || firstRaw || sourceTitleFactFromSection(section) || "";
}

function isSameSourcePoint(a = "", b = "") {
  return normalizedSignalText(a) === normalizedSignalText(b);
}

function generatedValueSummary(spec, section) {
  return spec.sourceExcerpt || spec.eventLine || sourceExcerptFromSection(section, spec.sourcePoints || []) || "";
}

function cleanEvidenceBoundary(value = "") {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (!text) return "证据边界：本卡只使用已保留的 Raw / Pool 原文标题、摘录和来源链接。";
  if (/没有具体客户|没有检测到明确动作词|不能单独阻断|需以可见原文片段核对/iu.test(text)) {
    return "证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。";
  }
  return text;
}

function normalizeSignalSpec(spec) {
  return {
    ...spec,
    company: publicCardCopy(spec.company),
    title: publicCardCopy(spec.title),
    eventLine: publicCardCopy(spec.eventLine),
    whyWatch: publicCardCopy(spec.whyWatch),
    businessMeaning: publicCardCopy(spec.businessMeaning),
    evidenceBoundary: cleanEvidenceBoundary(publicCardCopy(spec.evidenceBoundary)),
    watchWindow: publicCardCopy(spec.watchWindow),
    sourcePoints: (spec.sourcePoints || []).map(publicCardCopy),
    sourceExcerpt: publicCardCopy(spec.sourceExcerpt || ""),
  };
}

function signalFingerprints(spec, section) {
  const sourceUrl = value(section, "source_url");
  const hash = value(section, "raw_full_text_hash") || value(section, "full_text_hash");
  const titleKey = normalizedSignalText(`${spec.type} ${spec.company} ${spec.title}`);
  const eventKey = normalizedSignalText(`${spec.type} ${spec.company} ${spec.eventLine}`);
  return [
    sourceUrl ? `url:${normalizedUrl(sourceUrl)}` : "",
    hash ? `hash:${hash}` : "",
    titleKey ? `title:${titleKey}` : "",
    eventKey ? `event:${eventKey}` : "",
  ].filter(Boolean);
}

function existingSignalCardIndex() {
  const index = new Map();
  for (const file of signalCardFiles()) {
    const text = fs.readFileSync(file, "utf8");
    const cardDate = path.basename(file).match(/^(\d{4}-\d{2}-\d{2})--signal--/u)?.[1] || "";
    const type = yamlValue(text, "signal_type");
    const owner = yamlValue(text, "signal_owner");
    const title = yamlValue(text, "title");
    const sourceUrl = nestedYamlValue(text, "source_url");
    const hash = nestedYamlValue(text, "full_text_hash");
    const fingerprints = [
      sourceUrl ? `url:${normalizedUrl(sourceUrl)}` : "",
      hash ? `hash:${hash}` : "",
      title ? `title:${normalizedSignalText(`${type} ${owner} ${title}`)}` : "",
    ].filter(Boolean);
    for (const fingerprint of fingerprints) {
      if (!index.has(fingerprint)) {
        index.set(fingerprint, { file, id: yamlValue(text, "id"), title, type, owner, date: cardDate });
      }
    }
  }
  return index;
}

function findExistingSignalCard(index, spec, section) {
  for (const fingerprint of signalFingerprints(spec, section)) {
    const existing = index.get(fingerprint);
    if (existing && existing.date === date) return existing;
  }
  return null;
}

function quotedYamlArray(items) {
  return `[${uniq(items).map((item) => `"${item}"`).join(", ")}]`;
}

function appendMergeUpdate(text, { rawRef, poolRef, sourceUrl }) {
  if (text.includes(`raw_ref: ${rawRef}`) || text.includes(`raw_ref: "${rawRef}"`)) return text;
  const entry = [
    "  - date: " + date,
    `    pool_ref: ${poolRef}`,
    `    raw_ref: ${rawRef}`,
    `    source_url: "${sourceUrl}"`,
  ].join("\n");
  if (/^merged_updates:\n(?:  - .*\n(?:    .*\n?)*)+/mu.test(text)) {
    return text.replace(/^merged_updates:\n((?:  - .*\n(?:    .*\n?)*)+)/mu, (match) => `${match}${entry}\n`);
  }
  return text.replace(/\nprimary_raw:/u, `\nmerged_updates:\n${entry}\n\nprimary_raw:`);
}

function upsertExistingSignalCard(existing, spec, section) {
  const rawRef = value(section, "raw_ref");
  const poolRef = spec.poolRef;
  const sourceUrl = value(section, "source_url");
  const current = fs.readFileSync(existing.file, "utf8");
  let next = current
    .replace(/^updated_at:.*$/mu, `updated_at: ${now}`)
    .replace(/^raw_refs:\s*\[.*\]$/mu, `raw_refs: ${quotedYamlArray([...yamlArrayValue(current, "raw_refs"), rawRef])}`)
    .replace(/^pool_refs:\s*\[.*\]$/mu, `pool_refs: ${quotedYamlArray([...yamlArrayValue(current, "pool_refs"), poolRef])}`);
  next = appendMergeUpdate(next, { rawRef, poolRef, sourceUrl });
  if (!next.includes(`- ${date}: merged duplicate capture ${rawRef} / ${poolRef}`)) {
    next = `${next.trimEnd()}\n\n## Merge Updates\n\n- ${date}: merged duplicate capture ${rawRef} / ${poolRef}.\n`;
  }
  write(existing.file, next);
  return existing;
}

function poolSections() {
  const file = path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
  const text = fs.readFileSync(file, "utf8");
  const sections = text.split(/\n(?=## P-\d+)/u).filter((section) => /^## P-\d+/mu.test(section));
  const map = new Map();
  for (const section of sections) {
    const poolRef = section.match(/^##\s+(P-\d+)/mu)?.[1];
    if (poolRef) map.set(poolRef, section);
  }
  return map;
}

function rawFilesForDate() {
  const dir = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .map((name) => path.join(dir, name));
}

function rawField(raw, key, fallback = "") {
  const value = raw?.[key];
  if (Array.isArray(value) || (value && typeof value === "object")) return JSON.stringify(value);
  return String(value ?? fallback ?? "");
}

function rawDirectSection(raw, file) {
  const rawRef = raw.raw_id || path.basename(file, ".json").match(/r-\d+/iu)?.[0]?.toUpperCase() || "";
  const title = raw.title || raw.source_title || raw.original_url || raw.canonical_url || rawRef;
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const sourceUrl = raw.canonical_url || raw.original_url || raw.url || "";
  const lines = [
    `## RAW-${rawRef}｜${title}`,
    `- raw_to_card_direct: true`,
    `- raw_ref: ${rawRef}`,
    `- source: ${raw.source_name || raw.source || ""}`,
    `- source_url: ${sourceUrl}`,
    `- source_type: ${raw.source_type || ""}`,
    `- source_level: ${raw.source_level || raw.acquisition_source_level || "B"}`,
    `- source_role: ${raw.source_role || "resolved_original_source"}`,
    `- acquisition_channel: ${raw.acquisition_channel || ""}`,
    `- search_path: ${raw.search_path || ""}`,
    `- search_intent: ${raw.search_intent || ""}`,
    `- evidence_object_type: ${raw.evidence_object_type || (raw.event_evidence ? "event" : "")}`,
    `- raw_qc_decision: ${raw.raw_qc_decision || ""}`,
    `- has_full_text: ${String(Boolean(raw.has_full_text || raw.full_text || raw.clean_text))}`,
    `- extraction_method: ${raw.extraction_method || raw.fetch_status || ""}`,
    `- extraction_quality: ${raw.extraction_quality || ""}`,
    `- readability_score: ${raw.readability_score || raw.extractor_diagnostics?.readability_score || ""}`,
    `- pool_routes: raw_direct`,
    `- raw_archive: ${raw.markdown_snapshot_path || ""}`,
    `- raw_json: ${rel}`,
    `- raw_full_text_hash: ${raw.full_text_hash || raw.content_hash || raw.evidence_completeness?.evidence_hash || ""}`,
    `- full_text_hash: ${raw.full_text_hash || raw.content_hash || raw.evidence_completeness?.evidence_hash || ""}`,
    `- key_excerpts: ${rawField(raw, "key_excerpts", "[]")}`,
    `- evidence_seed: ${rawField(raw, "evidence_seed", "{}")}`,
    `- evidence_completeness: ${rawField(raw, "evidence_completeness", "{}")}`,
    `- degradation_reasons: ${rawField(raw, "degradation_reasons", "[]")}`,
    `- missing_information: ${rawField(raw, "missing_information", "")}`,
  ];
  return `${lines.join("\n")}\n`;
}

function addRawDirectSections(sections) {
  const existingRawRefs = new Set(
    [...sections.values()].map((section) => value(section, "raw_ref")).filter(Boolean)
  );
  for (const file of rawFilesForDate()) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      const rawRef = raw.raw_id || path.basename(file, ".json").match(/r-\d+/iu)?.[0]?.toUpperCase();
      if (!rawRef || existingRawRefs.has(rawRef)) continue;
      sections.set(`RAW-${rawRef}`, rawDirectSection(raw, file));
    } catch {
      // Ignore malformed raw artifacts; raw QC will surface source issues.
    }
  }
  return sections;
}

function candidateSections() {
  const sections = candidateSections();
  return rawDirectEnabled ? addRawDirectSections(sections) : sections;
}

function value(section, key) {
  return section.match(new RegExp(`^- ${key}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^`|`$/g, "") || "";
}

function nonNegativeInt(raw, fallback) {
  const value = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, value);
}

function poolTitle(section) {
  const heading = section.match(/^##\s+(?:P-\d+|RAW-R-\d+)(.*)$/mu)?.[1] || "";
  return heading.replace(/^[^\p{L}\p{N}$]+/u, "").trim();
}

function isRawDirectSection(section) {
  return value(section, "raw_to_card_direct") === "true";
}

function textForInference(section) {
  return [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "evidence_object_type"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
    value(section, "missing_information"),
  ].join(" ");
}

const coreImportanceTypes = new Set([
  "important_case",
  "important_funding",
  "important_market_structure",
  "important_product_or_service",
  "important_vertical_solution",
]);

const indexOnlyEvidenceTypes = new Set([
  "homepage",
  "home_page",
  "directory",
  "index",
  "index_only",
  "product_page",
  "product_directory",
  "docs_index",
  "documentation_index",
  "readme",
  "repo_index",
  "package_page",
  "model_page",
  "marketplace_listing",
  "search_result",
  "search_results",
  "seo_page",
  "tool_directory",
  "login_page",
]);

const indexOnlyUrlPattern = /(^|\/)(category|categories|tag|tags|topics?|search|docs?|documentation|api|sdk|pricing|marketplace|models?|packages?|tools?|login|signin|sign-in)(\/|$)|readme|readme-ov-file|\/blog\/category\//iu;
const discoveryOnlyPattern = /\b(aihot|ai hot|hacker news|reddit|hn|linkedin|twitter|x\.com|duckduckgo|bing|tavily|exa|anysearch|gdelt)\b/iu;
const mojibakeMarkerNeedles = [
  "\u947e\u5cf0\u7df1",
  "\u93c9\u30e6\u7c2e",
  "\u93c4\u5267\u305a",
  "\u6d7c\u4f77\u7b1f",
  "\u935f\u55d5\u7b1f",
  "\u93af\u546e",
  "\u5bf0\u546f",
  "\u9359\u621d\u7af7",
  "\u94fb\u5d88\u796b",
  "\u7039\u5c7e\u579a",
  "\u934f\ue100\u7d11",
  "\u6769\u501f\u91dc",
  "\u9358\u71b8\u6783",
  "\u9422\u3129\u20ac",
  "\u6d93\u6c2c\u59df",
  "\u6d5c\u0443\u6427",
  "\u59af\u2033\u7037",
  "\u93ba\u3125\u56ad",
  "\u5bee\u20ac\u9359",
  "\u93c5\u9e3f\u5158",
];
const CARD_ENTRY_GATES = Object.freeze({
  sourceAuditability: "source_auditability",
  evidenceQuality: "evidence_quality",
  businessSignalScope: "business_signal_scope",
  validPageType: "valid_page_type",
  commercialImportance: "commercial_importance",
  factTypeConstraints: "fact_type_constraints",
});
const monthNames = new Map([
  ["january", 0],
  ["february", 1],
  ["march", 2],
  ["april", 3],
  ["may", 4],
  ["june", 5],
  ["july", 6],
  ["august", 7],
  ["september", 8],
  ["october", 9],
  ["november", 10],
  ["december", 11],
]);

function hostFromUrl(raw = "") {
  try {
    return new URL(raw).hostname.toLowerCase().replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function pathSegmentsFromUrl(raw = "") {
  try {
    return new URL(raw).pathname.split("/").map((part) => part.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isSocialOrCommunitySection(section) {
  const sourceUrl = value(section, "source_url");
  const host = hostFromUrl(sourceUrl);
  if (host && !/(^|\.)instagram\.com$|(^|\.)linkedin\.com$|(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)reddit\.com$|news\.ycombinator\.com$/u.test(host)
    && value(section, "source_role") === "resolved_original_source") {
    return false;
  }
  const text = [
    sourceUrl,
    value(section, "source"),
    value(section, "source_type"),
    value(section, "acquisition_channel"),
    value(section, "source_role"),
  ].join(" ").toLowerCase();
  return /(^|\.)instagram\.com|(^|\.)linkedin\.com|(^|\.)x\.com|(^|\.)twitter\.com|(^|\.)reddit\.com|news\.ycombinator\.com|hn\.algolia|hacker news|community|social/u.test(text);
}

function isRepositoryOrCatalogSection(section) {
  const sourceUrl = value(section, "source_url");
  const host = hostFromUrl(sourceUrl);
  const segments = pathSegmentsFromUrl(sourceUrl).map((part) => part.toLowerCase());
  const pathText = `/${segments.join("/")}`;
  const text = `${poolTitle(section)} ${sourceUrl} ${value(section, "source")}`.toLowerCase();
  if (/github\.com$/u.test(host)) {
    if (segments.includes("releases") || segments.includes("tags")) return false;
    if (segments.length <= 2) return true;
    if (segments[2] === "tree" || segments[2] === "blob") return true;
  }
  if (/docs\.github\.com|learn\.microsoft\.com|docs\./u.test(host)) return true;
  if (/npmjs\.com|pypi\.org|chromewebstore\.google\.com|appsource\.microsoft\.com/u.test(host)) return true;
  if (/huggingface\.co/u.test(host) && /^\/(?:models|datasets|spaces)\//u.test(pathText)) return true;
  return /(^|\/)(docs?|documentation|api|sdk|marketplace|models?|packages?|tools?|catalog)(\/|$)|readme|readme-ov-file|product catalog|model page|package page|marketplace listing/iu.test(text)
    && !/blog|news|press|release|announc|changelog|customer|case-study/iu.test(text);
}

function cardGateIssue(gate, detail) {
  return `${gate}:${detail}`;
}

function isRootOrHomeSourceUrl(value = "") {
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname.replace(/\/+$/u, "");
    return pathname === "" || /^\/(?:index\.html?|home)$/iu.test(parsed.pathname);
  } catch {
    return false;
  }
}

function sectionHasUsableEvidenceObject(section) {
  const evidenceCompleteness = value(section, "evidence_completeness");
  const keyExcerpts = value(section, "key_excerpts");
  const evidenceSeed = value(section, "evidence_seed");
  return Boolean(
    value(section, "raw_archive") &&
    value(section, "raw_json") &&
    (value(section, "raw_full_text_hash") || value(section, "full_text_hash")) &&
    keyExcerpts &&
    keyExcerpts !== "[]" &&
    evidenceSeed &&
    evidenceSeed !== "{}" &&
    !/"missing":\s*\[[^\]]*[^\s\]][^\]]*\]/u.test(evidenceCompleteness)
  );
}

function evidenceStrengthForSection(section) {
  const sourceUrl = value(section, "source_url");
  const evidenceObjectType = value(section, "evidence_object_type");
  const extractionQuality = value(section, "extraction_quality");
  const readability = Number(value(section, "readability_score"));
  const degradationReasons = value(section, "degradation_reasons");
  const rawQc = value(section, "raw_qc_decision");
  const hasFullTextValue = value(section, "has_full_text") === "true";
  const hasSource = Boolean(sourceUrl && sourceUrl !== "no-url");
  const hasMaterial = Boolean(
    value(section, "raw_archive")
    && value(section, "raw_json")
    && (value(section, "raw_full_text_hash") || value(section, "full_text_hash") || value(section, "raw_content_hash"))
  );
  const hasExcerpts = Boolean(
    (value(section, "key_excerpts") && value(section, "key_excerpts") !== "[]")
    || (value(section, "evidence_seed") && value(section, "evidence_seed") !== "{}")
  );
  const hardBlocked =
    !hasSource
    || rawQc === "block"
    || hasTextContamination(textForInference(section))
    || value(section, "index_only_evidence") === "true"
    || indexOnlyEvidenceTypes.has(evidenceObjectType)
    || /index_only_or_directory_page|raw_evidence_unusable|missing_snapshot|missing_hash|missing_excerpt/iu.test(degradationReasons);

  if (hardBlocked || !hasMaterial || !hasExcerpts) return "blocked";

  const extractionOk = ["high", "medium"].includes(extractionQuality);
  const readabilityOk = Number.isFinite(readability) && readability >= 24;
  if (rawQc === "allow" && hasFullTextValue && extractionOk && readabilityOk && sectionHasUsableEvidenceObject(section)) {
    return "rich_evidence";
  }
  if (hasFullTextValue) return "source_backed_event";
  return "traceable_summary";
}

function evidenceStrengthBlocksCard(section, hasCardableEvent) {
  const strength = evidenceStrengthForSection(section);
  if (strength === "blocked") return "missing_source_material";
  if (!hasCardableEvent && strength === "traceable_summary") return "summary_without_formal_event";
  return "";
}

function parsePublicationDate(value = "") {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateFromUrl(value = "") {
  const match = String(value || "").match(/\/(20\d{2})\/(0?\d{1,2})\/(0?\d{1,2})(?:\/|$)/u);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function dateFromText(value = "") {
  const match = String(value || "").slice(0, 2000).match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})\b/iu);
  if (!match) return null;
  const month = monthNames.get(match[1].toLowerCase());
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
}

function rawPublicationDate(section) {
  const rawJsonPath = value(section, "raw_json");
  const sourceUrl = value(section, "source_url");
  if (rawJsonPath) {
    try {
      const rawPath = path.resolve(root, rawJsonPath.replace(/^`|`$/gu, ""));
      const rawData = JSON.parse(fs.readFileSync(rawPath, "utf8"));
      return parsePublicationDate(rawData.published_at)
        || dateFromUrl(rawData.canonical_url || rawData.original_url || sourceUrl)
        || dateFromText(rawData.full_text || rawData.clean_text || "");
    } catch {
      // Fall through to URL-only parsing below.
    }
  }
  return dateFromUrl(sourceUrl);
}

function isStalePublication(section, maxAgeDays = 30) {
  const published = rawPublicationDate(section);
  if (!published) return false;
  const runDate = new Date(`${date}T12:00:00Z`);
  const ageMs = runDate.getTime() - published.getTime();
  return ageMs > maxAgeDays * 24 * 60 * 60 * 1000;
}

function isGenericReportOrListSection(section) {
  const titleUrlSource = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
  ].join(" ");
  const urlSource = [
    value(section, "source"),
    value(section, "source_url"),
  ].join(" ");
  if (/yc\.com\/companies\/industry|startuply\.vc\/startup\/|\/research\/enterprise-ai-agent|data-room\/ycombinator|\.pdf(?:$|[?#])|docs\.github\.com|dev\.to|aws marketplace:|docs\.aws\.com\/marketplace|pypi|\/packages?\//iu.test(urlSource)) {
    return true;
  }
  if (isRepositoryOrCatalogSection(section)) return true;
  return /startup ideas|buying criteria|adoption 2026|massive ai deals|funding record|pre-seed slowdown|fund focused on ai|ranked by funding|top ai pre-seed investors|pre-seed investors|top ai agent startups|ai agent marketplace|marketplaces landscape|procurement guide|procurement playbook|enterprise business model shift|enterprise ai adoption stalls|agentic ai tools mapped|artificial intelligence startups funded by y combinator|funded companies|companies\s*&\s*verified leads|complete batch breakdown|market report|implementation report|complete guide|framework for investors|vertical report|fastest growing|venture funding quarter|building vertical ai|\btop\s+\d+\b|\buse cases\b|future of ai is vertical|hallucination tax|y combinator w26 batch|field guide|glossary|open source toolkit|ai in procurement orchestration|ai citations\s*&\s*visibility|about github copilot cloud agent|series-b-enterprise-ai-agents|ai agent startups insight partners funding/iu.test(titleUrlSource);
}

function hasMojibakeMarker(value = "") {
  const text = String(value || "");
  return mojibakeMarkerNeedles.some((marker) => text.includes(marker));
}

function hasTextContamination(text = "") {
  const value = String(text || "");
  const length = value.length || 1;
  const replacementCount = (value.match(/\uFFFD/gu) || []).length;
  const controlCount = (value.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu) || []).length;
  return /%PDF|endobj|xref|JFIF|Exif|Photoshop 3\.0|stream\s+x/iu.test(value)
    || hasMojibakeMarker(value)
    || controlCount >= 3
    || replacementCount >= 8
    || replacementCount / length > 0.003;
}

function sectionEvidenceText(section) {
  return [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "source_type"),
    value(section, "acquisition_channel"),
    value(section, "search_path"),
    value(section, "search_intent"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
    value(section, "missing_information"),
  ].join(" ");
}

function hasConcreteFundingEvent(section) {
  return isSingleCompanyFundingSignal(section);
}

function hasConcreteProductEvent(section) {
  const text = sectionEvidenceText(section);
  if (isWorkforceRetrainingProgram(section)) return false;
  if (isNewsletterRoundupSource(section)) return false;
  return /\b(launch(?:es|ed)?|release(?:s|d)?|introduc(?:es|ed)?|announc(?:es|ed)?|general availability|GA|new API|new SDK|new platform|new product|pricing|available now)\b|发布|推出|上线|正式可用|开放|定价/iu.test(text)
    && !/guide|tutorial|how to|core concepts|scaling dimensions|architecture overview|field guide|glossary|market map|roundup|list|指南|教程|概念|综述|清单|榜单/iu.test(text);
}

function hasConcreteCaseEvent(section) {
  const text = sectionEvidenceText(section);
  if (/\b(case study|customer story|customer deployment|customer adopts?|adopted by|deployed (?:at|by|with)|deploys?|deployment|used by|uses? (?:Amazon Bedrock|Claude|Glean|AI|agentic AI|machine learning|voice AI|AI voice)|rollout|production rollout|pilot customer|design partner|implementation case|internal automation agents|across enterprise|saved \d|reduced|cut|boosts?|increas(?:es|ed)|improv(?:es|ed)|hours per person|ARR|annual recurring revenue)\b/iu.test(text)) return true;
  if (/没有具体客户|没有检测到明确动作词|no concrete customer|no specific customer|not a customer case|missing customer/iu.test(text)) return false;
  return /\b(case study|customer story|customer deployment|customer adopts?|adopted by|deployed (?:at|by|with)|used by|rollout|production rollout|pilot customer|design partner|implementation case)\b|客户案例|客户采用|客户部署|生产部署|落地|试点客户|真实客户/iu.test(text);
}

function hasConcreteMarketStructureEvent(section) {
  const text = sectionEvidenceText(section);
  if (isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(section)) return false;
  if (isNewsletterRoundupSource(section) || isBuilderOrOpinionOnlySource(section)) return false;
  const action = /\b(acquires?|acquired|acquisition|merger|buyout|strategic partnership|partners? with|collaborates? with|procurement|tender|rfp|contract|pricing|price increase|price cut|rate limit|billing change|regulatory approval|clearance|antitrust|lawsuit|settlement)\b|收购|并购|合并|战略合作|合作伙伴|采购|招标|投标|合同|签约|定价|价格|计费|监管批准|审批|反垄断|诉讼|和解/iu.test(text);
  const businessAiContext = /\b(AI|agent|agentic|model|platform|cloud|enterprise|customer|workflow|developer|API|SDK|SaaS|inference|data center|GPU)\b|人工智能|模型|平台|企业|客户|工作流|开发者|算力|数据中心/iu.test(text);
  const commentaryOnly = /\b(opinion|analysis|analyst|market map|roundup|guide|tutorial|what is|why we built)\b|观点|评论|研报|指南|教程|清单|榜单/iu.test(text);
  return action && businessAiContext && !commentaryOnly;
}

function hasFormalCardEvent(section) {
  const importanceType = value(section, "importance_type");
  if (importanceType === "important_funding") return hasConcreteFundingEvent(section);
  if (importanceType === "important_product_or_service") return hasConcreteProductEvent(section);
  if (importanceType === "important_market_structure") return hasConcreteMarketStructureEvent(section);
  if (importanceType === "important_case" || importanceType === "important_vertical_solution") {
    return hasConcreteCaseEvent(section) || hasConcreteProductEvent(section) || hasConcreteMarketStructureEvent(section);
  }
  return hasConcreteFundingEvent(section)
    || hasConcreteProductEvent(section)
    || hasConcreteCaseEvent(section)
    || hasConcreteMarketStructureEvent(section);
}

function isBusinessObservationSignal(section) {
  if (!includeBusinessObservations) return false;
  const text = sectionEvidenceText(section);
  if (isSocialOrCommunitySection(section) || isRepositoryOrCatalogSection(section) || isNewsletterRoundupSource(section)) return false;
  if (value(section, "index_only_evidence") === "true" || indexOnlyEvidenceTypes.has(value(section, "evidence_object_type"))) return false;
  const sourceIdentity = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "source_type"),
  ].join(" ");
  const observationFormat = /\b(ceo|founder|co-founder|interview|conversation|podcast|episode|simplecast)\b|CEO|创始人|访谈|采访|对谈|播客/iu.test(sourceIdentity);
  const observationTopic = /\b(strategy|trend|future of|market|analysis|commercial|business model|pricing|gtm|go-to-market|sales|revenue|customer|enterprise|competition|valuation|daily active users|productivity tooling)\b|趋势|商业|收入|定价|客户|企业|市场/iu.test(text);
  const aiContext = /\b(AI|GenAI|agent|agents|LLM|LLMs|model|enterprise AI|workflow|inference|developer platform|search|productivity tooling)\b|人工智能|模型|智能体|企业 AI|工作流/iu.test(text);
  const traceable = evidenceStrengthForSection(section) !== "blocked";
  return observationFormat && observationTopic && aiContext && traceable;
}

function allowsObservationSummaryEvidence(section) {
  return isBusinessObservationSignal(section);
}

function isBuilderOrOpinionOnlySource(section) {
  const text = [
    value(section, "source_type"),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "acquisition_channel"),
  ].join(" ");
  return /\bbuilder\b|opinion|newsletter|eugeneyan\.com|simonwillison\.net|lilianweng\.github\.io|interconnects\.ai|ben-evans\.com/iu.test(text)
    && !hasConcreteFundingEvent(section)
    && !hasConcreteProductEvent(section)
    && !hasConcreteCaseEvent(section);
}

function isTechnicalArticleWithoutBusinessEvent(section) {
  const text = sectionEvidenceText(section);
  const technicalArticle = /\b(core concepts|scaling dimensions|architecture|architecting|how to|tutorial|guide|reference|concepts|open source solutions|developer article|engineering blog)\b|技术文章|架构|概念|教程|指南|开源方案/iu.test(text);
  return technicalArticle && !hasConcreteFundingEvent(section) && !hasConcreteProductEvent(section) && !hasConcreteCaseEvent(section);
}

function hasNamedCommercialDeploymentEvidence(section) {
  const text = commercialEvidenceText(section);
  return /\b(customer story|case study|customer deployment|customer adopts?|adopted by|deployed (?:at|by|with)|used by|uses? (?:Amazon Bedrock|Claude|Glean|AI|agentic AI|machine learning)|one of (?:the )?.{0,40}\b(?:bank|hospital|retailer|manufacturer|insurer|pharma|law firm)s?\b|paid enterprise|annual recurring revenue|ARR|saved \d|reduced \d|cut \d|Bristol Myers|Navien|Aon|7-Eleven|Morgan Stanley|Pooldoktor|Yp[eê]|Linkup)\b/iu.test(text);
}

function commercialEvidenceText(section) {
  return [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "source_type"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ")
    .replace(/\/\s*query=[^"'\]}]+/giu, " ")
    .replace(/"before_after_clues"\s*:\s*\[[^\]]*\]/giu, " ")
    .replace(/"affected_roles"\s*:\s*\[[^\]]*\]/giu, " ")
    .replace(/"search_path"\s*:\s*"[^"]*"/giu, " ")
    .replace(/"search_intent"\s*:\s*"[^"]*"/giu, " ");
}

function isResearchBenchmarkContext(section) {
  const text = commercialEvidenceText(section);
  return value(section, "research_status") === "formal_report"
    || /\b(benchmark|benchmarks|bench|evaluation|evals?|leaderboard|paper|research|technical report|dataset|arxiv|openreview|ACL|NeurIPS|ICML|ICLR|DiscoBench|OCR|OmniDocBench|retrieval benchmark)\b/iu.test(text);
}

function hasStrictMarketStructureEvent(section) {
  const text = commercialEvidenceText(section);
  return /\b(acquires?|acquired|acquisition|merger|buyout|strategic partnership|partners? with|collaborates? with|procurement contract|contract award(?:ed)?|signed (?:a )?contract|tender award(?:ed)?|rfp award(?:ed)?|pricing|price increase|price cut|billing change|regulatory approval|clearance|antitrust|lawsuit|settlement)\b|鏀惰喘|骞惰喘|鍚堝苟|鎴樼暐鍚堜綔|閲囪喘鍚堝悓|涓爣|绛剧害|瀹氫环|璁¤垂|鐩戠鎵瑰噯|鍙嶅瀯鏂瓅璇夎|鍜岃В/iu.test(text);
}

function hasStrongCommercialActionEvent(section) {
  const text = commercialEvidenceText(section);
  if (isResearchBenchmarkContext(section)) {
    return hasConcreteFundingEvent(section)
      || hasStrictMarketStructureEvent(section)
      || hasNamedCommercialDeploymentEvidence(section);
  }
  const commercialProductEvent = hasConcreteProductEvent(section)
    && /\b(product|platform|API|SDK|pricing|commercial|enterprise|customer|paid|general availability|GA)\b/iu.test(text);
  return hasConcreteFundingEvent(section)
    || hasStrictMarketStructureEvent(section)
    || hasNamedCommercialDeploymentEvidence(section)
    || commercialProductEvent;
}

function isResearchBenchmarkContextWithoutCommercialEvent(section) {
  return isResearchBenchmarkContext(section) && !hasStrongCommercialActionEvent(section);
}

function isGenericFdeExplainerOrServicePage(section) {
  const text = commercialEvidenceText(section);
  const genericFde = /\b(forward[- ]deployed|FDE|field engineer|applied AI implementation|implementation services|consulting services|service landing|what is|guide|playbook|field guide|role explainer|hiring|job opening)\b/iu.test(text);
  return genericFde
    && !hasConcreteFundingEvent(section)
    && !hasStrictMarketStructureEvent(section)
    && !hasNamedCommercialDeploymentEvidence(section);
}

function isSustainabilityReportWithoutCommercialAiEvent(section) {
  const text = commercialEvidenceText(section);
  const sustainabilityContext = /\b(environment(?:al)? report|sustainability report|carbon emissions?|renewable energy|electricity demand|energy efficiency|data center energy|ESG)\b|环境报告|用电量|碳排放|可再生能源|能源效率|数据中心能耗/iu.test(text);
  return sustainabilityContext
    && !hasConcreteFundingEvent(section)
    && !hasStrictMarketStructureEvent(section)
    && !hasNamedCommercialDeploymentEvidence(section)
    && !/\b(product launch|platform launch|commercial launch|customer deployment|procurement contract|contract awarded|pricing|billing change)\b/iu.test(text);
}

function isWorkforceRetrainingProgram(section) {
  const text = sectionEvidenceText(section);
  return /\b(retrain(?:ing)?|reskill(?:ing)?|workforce|jobs?|employment|worker|labor|training program)\b/iu.test(text)
    && /\b(\$?\s?\d+(?:\.\d+)?\s?(?:m|b|million|billion)|fund(?:ing|ed)?|grant|initiative|pledge|commitment|program)\b/iu.test(text)
    && !/\b(product launch|platform launch|released?|api|sdk|customer deployment|case study|funding round|series\s+[a-z]|seed round)\b/iu.test(text);
}

function isNewsletterRoundupSource(section) {
  const text = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "source_type"),
    value(section, "acquisition_channel"),
  ].join(" ");
  return /\btldr\.tech\b|TLDR AI Newsletter|newsletter|roundup|daily digest|weekly digest|briefing/iu.test(text);
}

function isJobListingSection(section) {
  const titleUrl = [
    poolTitle(section),
    value(section, "source_url"),
  ].join(" ");
  if (/\b(jobs\.lever\.co|greenhouse\.io|workdayjobs|ashbyhq|builtin\.com\/job|apply for this job|job opening|job listing|solutions architect|forward deployed ai engineer)\b/iu.test(titleUrl)) {
    return true;
  }
  const text = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  return /\b(careers?|hiring)\b/iu.test(text)
    && !/\b(customer deployment|customer story|case study|product launch|funding round|series\s+[a-z]|raises?|raised|secures?|secured|\$\s?\d|procurement|contract|saves? \d|saved \d|hours annually)\b/iu.test(text);
}

function isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(section) {
  const text = textForInference(section);
  if (/monthly update|roundup|latest AI news|recap of .*AI updates|Google 2026.*AI.*updates?|Google 2026.*AI.*更新|AI更新汇总|更新汇总/iu.test(text)) return true;
  if (/AI\s*存储蓝图|存储蓝图|大规模\s*AI\s*存储|large-scale AI storage|storage blueprint|architecture blueprint|technical blueprint/iu.test(text)
    && !/customer deployment|procurement|contract|pricing|funding|commercial launch/iu.test(text)) return true;
  if (/brain2qwerty|brain-to-text|brain interface|non-invasive brain/iu.test(text)
    && !/enterprise deployment|customer deployment|procurement|contract|funding|commercial launch/iu.test(text)) return true;
  if (/storage blueprint|architecture blueprint|technical blueprint/iu.test(text)
    && !/customer deployment|procurement|contract|pricing|funding|commercial launch/iu.test(text)) return true;
  if (/Workbench Notebooks|GLM Coding Pro|Coding Pro|ZCode|VS Code|Jupyter|coding assistant|developer environment/iu.test(text)
    && !/enterprise deployment|customer deployment|case study|procurement|contract|pricing|funding|annual recurring revenue|ARR/iu.test(text)) return true;
  if (/\b(deploys?|deployment|deployed|rollout|production rollout|case study|customer story|customer deployment|uses? (?:Amazon Bedrock|Claude|Glean|AI|agentic AI|machine learning)|saved \d|reduced|cut|hours per person|ARR|annual recurring revenue|acquires?|acquisition|to buy|strategic partnership|partners? with|collaborates? with|pricing|billing|monetization gateway|contract|procurement)\b/iu.test(text)) return false;
  const consumerEntertainment = /Just Dance|舞力全开|mobile game|手游|游戏快报|玩家|曲库|K-POP|音舞|体感音乐|育碧|腾讯游戏/iu.test(text);
  const minorPlatformPolicy = /肖像保护|仿冒带货|带货达人|达人账号|素材盗用|侵权账号|侵权内容|平台治理|内容安全|相似内容阻断|举报|处置侵权/iu.test(text);
  const roundupOrExplainer = /更新汇总|月度更新|latest AI news|monthly update|roundup|weekly digest|why we built|我们为何构建/iu.test(text);
  const marketCommentary = /瑞银|UBS|分析师|研报|调研|spending|budget|cost concern|analyst/iu.test(text)
    && /开支|支出|成本|预算|ROI|回报|受益|承压|spending|budget|cost|concern|benefit|pressure|analyst/iu.test(text);
  const ventureFormation = /离开.*VC基金|创办.*VC基金|launch new VC firm|start a separate VC fund|new VC fund/iu.test(text)
    && !/raises|raised|closed|closes|fund size|\$\s?\d|完成.*募资|基金规模/iu.test(text);
  const businessAiSignal = /enterprise|B2B|customer deployment|production rollout|procurement|workflow|case study|SaaS|API|SDK|developer platform|paid enterprise|企业|客户|部署|采购|工作流|生产环境|融资|收购|合作伙伴|营收|合同|招标/iu.test(text);
  return ((consumerEntertainment || minorPlatformPolicy) && !businessAiSignal) || roundupOrExplainer || marketCommentary || ventureFormation;
}

function cardabilitySemanticIssues(section) {
  const issues = [];
  const text = textForInference(section);
  const sourceUrl = value(section, "source_url");
  const evidenceObjectType = value(section, "evidence_object_type");
  const importanceScore = Number(value(section, "importance_score"));
  const importanceType = value(section, "importance_type");
  const degradationReasons = value(section, "degradation_reasons");
  const hasFormalEvent = hasFormalCardEvent(section);
  const observationSummaryEvidenceAllowed = allowsObservationSummaryEvidence(section);
  const hasCardableEvent = hasFormalEvent || observationSummaryEvidenceAllowed;
  const evidenceBlockReason = evidenceStrengthBlocksCard(section, hasCardableEvent);

  if (evidenceBlockReason) issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, evidenceBlockReason));
  if (hasTextContamination(text)) issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "binary_or_mojibake_text_contamination"));
  if (isGenericReportOrListSection(section)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "generic_report_or_list_not_fact_signal"));
  if (!sourceUrl || sourceUrl === "no-url") issues.push(cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "missing_source_url"));
  if ((/user_feedback_pool/u.test(value(section, "pool_routes")) || evidenceObjectType === "community_feedback" || value(section, "evidence_level") === "user_feedback_signal") && !hasCardableEvent) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "user_feedback_or_commentary_not_verified_fact"));
  }
  if (isSocialOrCommunitySection(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "social_or_community_source_not_verified_fact"));
  }
  if (isRepositoryOrCatalogSection(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "repository_catalog_or_directory_page"));
  }
  if (isStalePublication(section, 90)) issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "stale_source_date"));
  if (value(section, "index_only_evidence") === "true") issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "index_only_evidence"));
  if (indexOnlyEvidenceTypes.has(evidenceObjectType)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, `index_only_evidence_type:${evidenceObjectType}`));
  if (isRootOrHomeSourceUrl(sourceUrl) || (indexOnlyUrlPattern.test(sourceUrl) && !/\/\d{4}\/|\/20\d{2}[/-]|press|news|release|announc|blog\/[^/]+/iu.test(sourceUrl))) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "index_or_directory_url"));
  }
  if (discoveryOnlyPattern.test(`${value(section, "acquisition_channel")} ${value(section, "source_role")}`) && value(section, "source_role") !== "resolved_original_source") {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "discovery_source_not_resolved"));
  }
  if (!coreImportanceTypes.has(importanceType) && !hasCardableEvent) issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, `unsupported_importance_type:${importanceType || "missing"}`));
  if (importanceType === "important_technical_trend" && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "technical_trend_is_context_not_signal_card"));
  }
  if (isBuilderOrOpinionOnlySource(section) && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "builder_or_opinion_source_not_business_fact"));
  }
  if (isTechnicalArticleWithoutBusinessEvent(section) && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "technical_article_without_business_event"));
  }
  if (isResearchBenchmarkContextWithoutCommercialEvent(section) && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "research_benchmark_without_commercial_event"));
  }
  if (isGenericFdeExplainerOrServicePage(section) && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "generic_fde_explainer_or_service_page_without_customer_event"));
  }
  if (isSustainabilityReportWithoutCommercialAiEvent(section) && !observationSummaryEvidenceAllowed) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "sustainability_report_without_commercial_ai_event"));
  }
  if (isWorkforceRetrainingProgram(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "workforce_retraining_program_not_formal_signal_card"));
  }
  if (isJobListingSection(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "job_listing_not_formal_signal_card"));
  }
  if (isNewsletterRoundupSource(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "newsletter_roundup_requires_original_event_source"));
  }
  if (isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "low_value_consumer_or_platform_policy_not_business_signal"));
  }
  if (!hasCardableEvent) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "missing_concrete_funding_product_or_case_event"));
  }
  if ((!Number.isFinite(importanceScore) || importanceScore < 4) && !hasCardableEvent) issues.push(cardGateIssue(CARD_ENTRY_GATES.commercialImportance, "low_importance_score"));
  if (/missing_snapshot|missing_hash|missing_excerpt|raw_evidence_unusable/iu.test(degradationReasons) && !issues.includes(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "missing_source_material"))) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "missing_source_material"));
  }
  if (/index_only_or_directory_page/iu.test(degradationReasons)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "degradation_reason_index_only"));
  }
  if (/官网首页|产品目录|文档目录|README|包页|模型页|搜索结果|SEO|工具导航|目录页|首页|category page|directory|search result/iu.test(text)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "text_indicates_index_only"));
  }
  return issues;
}

function signalEventClusterKey(spec, section) {
  const sourceUrl = value(section, "source_url");
  const title = poolTitle(section) || spec.title;
  const text = `${title} ${spec.title || ""} ${spec.summary || ""} ${sourceUrl}`.toLowerCase();
  const company = normalizedSignalText(spec.company || companyFromSection(section));
  if (/minimax/iu.test(text) && /\bm3\b/iu.test(text)) return "event:product_service:minimax:m3";
  if (/gemini\s+spark/iu.test(text)) return "event:product_service:google:gemini-spark";
  if (/cloudflare/iu.test(text) && /content-independence-day-ai-options|ai traffic/iu.test(text)) return "event:case:cloudflare:ai-traffic-control";
  if (/mistral/iu.test(text) && /(funding|financing|valuation|round|融资|估值|欧元|billion|30亿|200亿)/iu.test(text)) {
    return "event:funding:mistral";
  }
  const amount = text.match(/(?:\$|€|eur|usd)?\s?\d+(?:\.\d+)?\s?(?:m|b|million|billion|亿|万)?/iu)?.[0] || "";
  const normalizedAmount = (text.match(/\$?\s?\d+(?:\.\d+)?\s?(?:m|b|million|billion)\b/iu)?.[0] || amount)
    .replace(/\s+/gu, "")
    .replace(/million$/iu, "m")
    .replace(/billion$/iu, "b")
    .toLowerCase();
  const normalizedTitle = normalizedSignalText(`${spec.type} ${title}`).slice(0, 96);
  if (company && (normalizedAmount || normalizedTitle)) return `event:${spec.type}:${company}:${normalizedAmount || normalizedTitle}`;
  return "";
}

function signalClusterKey(spec, section) {
  const eventKey = signalEventClusterKey(spec, section);
  if (eventKey) return eventKey;
  const sourceUrl = value(section, "source_url");
  const hash = value(section, "raw_full_text_hash") || value(section, "full_text_hash");
  if (hash) return `hash:${hash}`;
  const title = poolTitle(section) || spec.title;
  const company = normalizedSignalText(spec.company || companyFromSection(section));
  if (sourceUrl) return `url:${normalizedUrl(sourceUrl)}`;
  return `event:${company}:${normalizedSignalText(`${spec.type} ${title}`).slice(0, 120)}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 88) || "auto-signal";
}

function shortCompany(value) {
  return String(value || "")
    .replace(/\s+case\s+study$/iu, "")
    .replace(/^the\s+/iu, "")
    .replace(/\s+\|\s+.*$/u, "")
    .replace(/\s+-\s+.*$/u, "")
    .trim()
    .slice(0, 56);
}

function companyFromUrl(sourceUrl = "", title = "") {
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.toLowerCase().replace(/^www\./u, "");
    const pathname = parsed.pathname.toLowerCase();
    const haystack = `${host} ${pathname} ${title}`.toLowerCase();
    const rules = [
      [/aws\.amazon\.com.*genaiic|partner-agent-factory/u, "AWS GenAIIC"],
      [/appliedai\.de.*mckinsey|mckinsey.*appliedai/u, "AppliedAI / McKinsey"],
      [/claude\.com.*customers\/smartsheet/u, "Smartsheet / Anthropic"],
      [/apnews\.com.*glean-surpasses/u, "Glean"],
      [/aws\.amazon\.com.*inscribe.*bedrock/u, "Inscribe / AWS"],
      [/hitconsultant\.net.*houston-methodist.*midstream/u, "Houston Methodist / Midstream Health"],
      [/theapplied\.co.*zillow.*glean/u, "Zillow / Glean"],
      [/bloomberg\.com.*salesforce.*fin/u, "Salesforce / Fin"],
      [/cloudflare\.com.*monetization-gateway/u, "Cloudflare"],
      [/cloudflare\.com.*content-independence-day-ai-options|cloudflare\.com.*making-ai-search-smarter/u, "Cloudflare"],
      [/meta\.com|engineering\.fb\.com/u, "Meta"],
      [/zoneandco\.com/u, "Zone & Co"],
      [/lio\.ai/u, "Lio"],
      [/druidai\.com/u, "Druid AI"],
      [/snowflake\.com/u, "Snowflake"],
      [/itwire\.com.*asus/u, "ASUS"],
      [/github\.blog.*agent-hq|github\.blog.*welcome-home-agents/u, "GitHub"],
      [/metronome\.com.*hugging-face/u, "Hugging Face"],
      [/ycombinator\.com\/companies\/pipeshift/u, "Pipeshift"],
      [/blog\.google.*gemma|googleblog\.com.*gemma/u, "Google DeepMind"],
      [/github\.com\/googlecloudplatform\/agent-starter-pack/u, "Google Cloud"],
      [/agno\.com.*github-release-notes-agent/u, "Agno"],
      [/techcrunch\.com.*openai.*lockdown/u, "OpenAI"],
      [/techcrunch\.com.*equity-stake.*openai|techcrunch\.com.*government-stake.*openai/u, "OpenAI"],
      [/the-decoder\.com.*sakana-ai/u, "Sakana AI"],
      [/banyan-vc\.com/u, "Banyan VC"],
      [/ithome\.com.*960\/880/u, "Apple"],
      [/ithome\.com.*961\/045/u, "UK police"],
      [/ithome\.com.*960\/909/u, "CCTV"],
      [/cnbc\.com.*google-to-pay-spacex/u, "Google / SpaceX"],
      [/techcrunch\.com.*google-will-pay-spacex/u, "Google / SpaceX"],
      [/growthlist\.co.*yc-startups/u, "Y Combinator"],
      [/saasmag\.com.*monetizing-ai-agents/u, "SaaS companies"],
      [/vercel\.com\/changelog\/ai-sdk-7/u, "Vercel"],
      [/globenewswire\.com.*talkdesk/u, "Talkdesk"],
      [/upbound\.io/u, "Upbound"],
      [/pfizer/iu, "Pfizer"],
      [/sentara|infosys.*sentara/iu, "Infosys / Sentara"],
      [/oxmiq/iu, "OXMIQ"],
      [/savi(?:-|%20|\s)?security|savis-app/iu, "Savi Security"],
      [/rocketlane/iu, "Rocketlane"],
      [/bespoke(?:-|%20|\s)?labs/iu, "Bespoke Labs"],
      [/\bnorm(?:-|%20|\s)?ai\b|\bnorm-ai\b|\bnorm\b.*(?:raises?|raised|funding|financing|series|120\s?m|\$120)/iu, "Norm AI"],
      [/\bornn\b/iu, "Ornn"],
      [/withone\.ai|\bone\b.*(?:pre-seed|ai recruiter)/iu, "One"],
      [/together\.ai|together-ai|neocloud-together-ai/iu, "Together AI"],
      [/sigmanticai|sigmantic-ai/iu, "SigmanticAI"],
      [/zeiss/iu, "ZEISS"],
      [/amgen/iu, "Amgen"],
      [/peraton/iu, "Peraton"],
    ];
    const match = rules.find(([pattern]) => pattern.test(haystack));
    if (match) return match[1];
  } catch {
    return "";
  }
  return "";
}

function domainLabelFromUrl(value = "") {
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/^www\./u, "");
    const labels = host.split(".").filter(Boolean);
    const primary = labels.length > 2 && ["com", "co", "org", "net"].includes(labels.at(-2))
      ? labels.at(-3)
      : labels.at(-2) || labels[0];
    const known = new Map([
      ["github", "GitHub"],
      ["microsoft", "Microsoft"],
      ["google", "Google"],
      ["apple", "Apple"],
      ["amazon", "Amazon"],
      ["aws", "AWS"],
      ["arxiv", "arXiv"],
      ["digitalapplied", "Digital Applied"],
    ]);
    return known.get(primary) || primary.replace(/(^|-)([a-z])/gu, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);
  } catch {
    return "";
  }
}

function isWeakCompanyName(value = "") {
  const text = String(value || "").trim();
  if (/buying criteria|adoption|startup ideas|massive ai deals|funding record|pre-seed slowdown|fund focused on ai|introducing|top ai|complete guide|release notes agent|with quantization|brings enterprise|monetizing ai agents|company is led by/iu.test(text)) return true;
  if (!text) return true;
  if (/^(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Company|The company|TechCrunch|Prnewswire|PR Newswire|EdgarFiling|Ithome|IT之家|Marktechpost|Arstechnica|Ars Technica|Labs|Medicine|Shares)$/iu.test(text)) return true;
  const hanChars = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  return text.length > 42
    || hanChars > 18
    || /\b(launch YC|case study|google'?s pixel|first autonomous ground vehicles|deepseek.*seeking|it daily|morning briefing)\b/iu.test(text)
    || /发布会|首批自主地面车辆|乌克兰参战|寻求.*融资|计划.*融资|消息称.*融资|早报/iu.test(text)
    || /[？?。；;！!]/u.test(text)
    || /(发布|推出|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|将|支付|获取|聚焦|是 AIScraping|报告|榜单|指南|清单|研究|论文|引用|大型语言模型|替代的搜索引擎|right answers|state of)/iu.test(text);
}

function companyFromSection(section) {
  const title = poolTitle(section);
  const text = textForInference(section);
  const sourceUrl = value(section, "source_url");
  const specialCases = [
    [/netris/iu, "Netris"],
    [/c-h-robinson|c\.h\.\s*robinson/iu, "C.H. Robinson"],
    [/bentocloud/iu, "BentoCloud"],
    [/aws\.amazon\.com\/marketplace\/solutions\/ai-agents-and-tools|aws-partner-guide-to-ai-agents-and-tools-in-aws-marketplace/iu, "AWS Marketplace"],
    [/microsoft\s+foundry|learn\.microsoft\.com/iu, "Microsoft Foundry"],
    [/sierra-ai-giving-the-enterprise-a-voice|\bsierra\b/iu, "Sierra"],
    [/featherless\.ai|featherless ai/iu, "Featherless.ai"],
  ];
  for (const [pattern, company] of specialCases) {
    if (pattern.test(`${title} ${text} ${sourceUrl}`)) return company;
  }
  const urlCompany = companyFromUrl(sourceUrl, title);
  if (urlCompany) return urlCompany;
  const interviewCompany =
    title.match(/\b([A-Z][A-Za-z0-9.& -]{1,50}?)\s+(?:Founder\/CEO|CEO|Co-?founder|Product\s*&\s*Eng\s+Leads?)\b/u)?.[1]
    || title.match(/\b(?:Founder\/CEO|CEO|Co-?founder)\s+(?:of\s+)?([A-Z][A-Za-z0-9.& -]{1,50}?)(?:\s+[A-Z][a-z]+|\s+on\b|\s*$)/u)?.[1]
    || text.match(/\b([A-Z][A-Za-z0-9.& -]{1,50}?)\s+(?:Founder\/CEO|CEO|Co-?founder)\b/u)?.[1];
  const interviewCompanyClean = shortCompany(String(interviewCompany || "").replace(/^Ep\s+\d+:\s*/iu, ""));
  if (interviewCompanyClean && !isWeakCompanyName(interviewCompanyClean)) return interviewCompanyClean;
  const patterns = [
    /\b([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})(?:'s|&#8217;s|&rsquo;s|鈥檚)\s+(?:app|platform|product|tool|agent|service)\b/iu,
    /\b([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:unveils?|launches?|introduces?|debuts?|announces?)\s+[A-Z][A-Za-z0-9.[\]&™-]+/iu,
    /\bstartup\s+([A-Z][A-Za-z0-9.&-]+)\s+(?:raises|raised|secures|secured|said|announced)\b/iu,
    /\bseed\s+for\s+([A-Z][A-Za-z0-9.&-]+)\s+to\b/iu,
    /\b([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:on\s+\w+\s+)?(?:today\s+)?(?:announced|said|revealed|has raised|raised|secures|secured|will use|pulls in|pitches)\b/u,
    /\b([A-Z][A-Za-z0-9.&-]*(?:\.ai)?)(?:\s+Inc\.)?,\s+a\s+/u,
    /#\s*([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:raises|raised|secures|secured|pulls|launches|announces|deploys|uses)\b/iu,
    /^(.+?)\s+(?:raises|raised|secures|secured|pulls in|launches|announces|deploys|uses|wins|partners)\b/iu,
    /^AWS Marketplace:\s*(.+)$/iu,
  ];
  for (const pattern of patterns) {
    const found = text.match(pattern)?.[1] || title.match(pattern)?.[1];
    const company = shortCompany(found);
    if (company && !isWeakCompanyName(company) && !/^(Former|Exclusive|UPDATED|Image Credits|Source|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/iu.test(company)) return company;
  }
  const fallback = shortCompany(title.split(/[:|｜-]/u)[0] || "");
  if (!isWeakCompanyName(fallback)) return fallback;
  return domainLabelFromUrl(sourceUrl) || "Unknown";
}

function extractAmount(text) {
  return text.match(/(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)|\d+(?:\.\d+)?\s?(?:million|billion))/u)?.[0] || "";
}

const fundingAmountPattern = /(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|K|m|b|k|million|billion)?|\d+(?:\.\d+)?\s?(?:million|billion|万美元|亿美元|万人民币|亿人民币|万元|亿元)|\d+(?:\.\d+)?\s?(?:\u4e07\u7f8e\u5143|\u4ebf\u7f8e\u5143|\u4e07\u4eba\u6c11\u5e01|\u4ebf\u4eba\u6c11\u5e01|\u4e07\u5143|\u4ebf\u5143))/iu;
const fundingRoundPattern = /\b(?:pre[- ]seed|seed|series\s+[a-z]|debt financing|bridge round)\b|(?:\u79cd\u5b50|\u5929\u4f7f|[A-Ha-h]\s?\u8f6e|\u6218\u7565)\s?(?:\u8f6e|\u878d\u8d44)?/iu;

function isCorporateCapexOrCommunityInvestment(section) {
  const haystack = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  const largeVendor = /\b(Google|Microsoft|Amazon|AWS|Meta|Apple|Oracle|NVIDIA|Nvidia|Salesforce|IBM)\b/iu.test(haystack);
  const capexContext = /\b(strengthening our presence|new investments? and community support|community support|community investment|invest(?:ing|ment)? in (?:Alabama|Virginia|Ohio|Missouri|Texas|Iowa|Georgia|Tennessee|Nevada|Arizona|Oregon|region)|data centers?|cloud region|campus|office expansion|local jobs?|workforce development|infrastructure investment|economic development)\b/iu.test(haystack);
  const financingContext = /\b(raises?|raised|lands?|landed|secures?|secured|closes?|closed|seed|pre[- ]seed|series\s+[a-z]|funding round|financing round|led by|participation from|investors?)\b/iu.test(haystack);
  return largeVendor && capexContext && !financingContext;
}

function isSingleCompanyFundingSignal(section) {
  const title = poolTitle(section);
  const text = textForInference(section);
  const sourceUrl = value(section, "source_url");
  const haystack = `${title} ${text} ${sourceUrl}`;
  const sourceIdentity = `${title} ${value(section, "source")} ${sourceUrl}`;
  if (isCorporateCapexOrCommunityInvestment(section)) {
    return false;
  }
  if (/(funding map|top ai pre-seed investors|pre-seed investors|top ai agent startups|hottest ai startups|coolest ai startups|startup investment surge|ranked by funding|growing share|startup funding|best pre-seed investors|venture capital observatory|vc attention|valuation bubble|agentmarketcap|aifundingtracker|funding tracker|ai agent startups insight partners funding|series-b-enterprise-ai-agents|crn\.com\/news\/ai\/2026\/the-10-hottest-ai-startups|crunchbase\.com\/venture\/seed-seriesa-startup-megadeals)/iu.test(sourceIdentity)) {
    return false;
  }
  if (/\b(employee tender|tender offer|secondary sale|share buyback|commitment|committed capital|new operating business|deployment company|frontier company)\b/iu.test(haystack)) {
    return false;
  }
  const unconfirmedFundingPattern = /(?:rumou?red|reportedly|in talks to|plans to|may raise|could raise|is seeking|will complete|消息称|据悉|拟|将完成|有望完成|寻求融资|计划融资).{0,100}\b(?:funding|financing|investment|round|seed|series|valuation)\b|(?:消息称|据悉|拟|将完成|有望完成|寻求融资|计划融资).{0,100}(?:融资|投资|估值|轮)/iu;
  if (unconfirmedFundingPattern.test(haystack)) {
    return false;
  }
  const amount = fundingAmountPattern.test(haystack);
  const round = fundingRoundPattern.test(haystack);
  const action = /\b(raises?|raised|lands?|landed|secures?|secured|closes?|closed|announc(?:es|ed|ing)?|snags?|bags?|pulls in|gets|receives|launches with|launched with|debuts with|emerged from stealth with|emerges from stealth with)\b|(?:\u5b8c\u6210|\u83b7\u5f97|\u83b7|\u5ba3\u5e03|\u62ff\u5230|\u878d\u8d44|\u4f30\u503c)/iu.test(haystack);
  const fundingTerm = /\b(funding|financing|investment|round|seed|series|pre-seed|valuation|led by|participation from)\b|(?:\u878d\u8d44|\u6295\u8d44|\u4f30\u503c|\u9886\u6295|\u53c2\u6295|\u8f6e)/iu.test(haystack);
  const directRoundAnnouncement =
    /\bannounc(?:es|ed|ing|ement)?\b.{0,160}(?:[$€£]\s?\d|\d+(?:\.\d+)?\s?(?:million|billion)).{0,120}\b(?:pre[- ]seed|seed|series\s+[a-z])\b/iu.test(haystack)
    || /\b(?:launches|launched|debuts|emerged from stealth|emerges from stealth)\s+with\b.{0,120}(?:[$€£]\s?\d|\d+(?:\.\d+)?\s?(?:million|billion)).{0,120}\b(?:funding|financing|seed|series|round)?\b/iu.test(haystack)
    || /(?:\u5b8c\u6210|\u83b7\u5f97|\u83b7|\u5ba3\u5e03).{0,120}(?:\u878d\u8d44|\u6295\u8d44|\u4f30\u503c|\u8f6e)/iu.test(haystack);
  const directRaiseAmount = /\b(?:raises?|raised|lands?|landed|secures?|secured|closes?|closed|snags?|bags?|pulls in|gets|receives)\b.{0,140}(?:[$€£]\s?\d|\d+(?:\.\d+)?\s?(?:million|billion))/iu.test(haystack);
  return directRoundAnnouncement || directRaiseAmount || (action && fundingTerm && (amount || round));
}

function hasStrictFundingAnnouncement(section, sourceEventTitle = "") {
  const identityHaystack = [
    sourceEventTitle,
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
  ].join(" ");
  const evidenceHaystack = [
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].map(stripSourceNoise).join(" ");
  const haystack = `${identityHaystack} ${evidenceHaystack}`.replace(/\b(?:chips?|data centers?|data center)\b/giu, "");
  if (/\b(contract|procurement|tender|vehicle|autonomous ground vehicles|war|military|defense contract|export curbs?|chips?|self-developed chip|stake|equity stake|capital expenditure|capex|data center|investment plan|is seeking|seeks to raise|plans to raise|reportedly|rumou?red|in talks)\b|乌克兰|参战|车辆|芯片|出口管制|寻求融资|计划融资|消息称|据悉|入股/iu.test(haystack)) {
    return false;
  }
  const amountOrRound = fundingAmountPattern.test(haystack) || fundingRoundPattern.test(haystack);
  const announcedRound = /\b(?:raises?|raised|lands?|landed|secures?|secured|closes?|closed|snags?|bags?|pulls in|receives|announces?|announced|launched with|launches with|emerged from stealth with|emerges from stealth with)\b.{0,180}\b(?:funding|financing|investment|round|seed|pre[- ]seed|series\s+[a-z])\b/iu.test(haystack)
    || /\b(?:funding|financing|investment|round|seed|pre[- ]seed|series\s+[a-z])\b.{0,180}\b(?:led by|participation from|investors?|valuation|raises?|raised|secured|closed)\b/iu.test(haystack)
    || /(?:完成|获得|获|宣布|拿到).{0,120}(?:融资|投资|轮|领投|参投)/iu.test(haystack);
  const directAmountRaise = /\b(?:raises?|raised|lands?|landed|secures?|secured|closes?|closed|snags?|bags?|pulls in|receives)\b.{0,160}(?:\$\s?\d|\d+(?:\.\d+)?\s?(?:million|billion))/iu.test(haystack);
  const confirmedStrategicInvestment = isConfirmedStrategicInvestment(section, sourceEventTitle);
  return (amountOrRound && (announcedRound || directAmountRaise)) || confirmedStrategicInvestment;
}

function isConfirmedStrategicInvestment(section, sourceEventTitle = "") {
  const haystack = [
    sourceEventTitle,
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    stripSourceNoise(value(section, "key_excerpts")),
    stripSourceNoise(value(section, "evidence_seed")),
  ].join(" ");
  return /\b(?:announces?|announced|makes?|made)\b.{0,180}\bstrategic investment\b|\bstrategic investment\b.{0,180}\b(?:from|by)\b.{0,100}\b(?:ventures?|capital|partners?|investors?)\b/iu.test(haystack);
}

function titleHasFundingAmountOrRound(title = "") {
  return fundingAmountPattern.test(title) || fundingRoundPattern.test(title);
}

function scenarioFromText(text) {
  if (/c\.h\.\s*robinson|shipment|shipments|freight|logistics|carrier|email-based shipment/iu.test(text)) return "物流订单和邮件处理流程";
  if (/real estate|architect|construction|aec|building|地产|建筑/iu.test(text)) return "地产开发和建筑设计流程";
  if (/multiplayer|collaborative|collaboration|isolated AI assistants|orchestrate|enterprise workers/iu.test(text)) return "企业智能体协作流程";
  if (/\b(sales|revenue|rfp|business case)\b|销售|收入/iu.test(text)) return "销售和收入团队流程";
  if (/procurement|order|ordering|采购|下单/iu.test(text)) return "采购下单流程";
  if (/model|inference|serverless|hosting|compute|foundry|cloud|算力|模型/iu.test(text)) return "模型部署和算力调用";
  if (/agent|assistant|workflow|orchestrate|enterprise|企业/iu.test(text)) return "企业智能体协作流程";
  if (/customer|cx|support|service|voice|chat|email|客服|客户体验/iu.test(text)) return "客服和客户体验流程";
  return "企业业务流程";
}

function inferSignalType(section) {
  const text = textForInference(section);
  const sourceUrl = value(section, "source_url");
  const importanceType = value(section, "importance_type");
  if (allowsObservationSummaryEvidence(section)) return "product_service";
  if (isSingleCompanyFundingSignal(section)) return "funding";
  if (importanceType === "important_market_structure") {
    if (/\b(pricing|price|billing|rate limit)\b|定价|价格|计费/iu.test(text)) return "product_service";
    return "case";
  }
  if (importanceType === "important_case" || importanceType === "important_vertical_solution") return "case";
  if (importanceType === "important_funding" && /\b(pivoted?|renamed|compute cluster|infrastructure|platform|deploy|deployment|service|product|business|AI biz)\b|转型|更名|托管计算|基础设施|部署|产品|业务/iu.test(`${text} ${sourceUrl}`)) return "product_service";
  if (importanceType === "important_funding") return "funding";
  if (/c\.h\.\s*robinson|snaplogic|pwc|deployment|deploys|automates|orders automated|customer case|case study|customer story/iu.test(`${text} ${sourceUrl}`)) return "case";
  if (importanceType === "important_product_or_service" || /\b(launch|release|released|introduced|deploy|marketplace|platform|api|sdk|model|tool)\b|发布|推出|上线/iu.test(text)) return "product_service";
  return "case";
}

function dirForSignalType(type) {
  if (type === "funding") return "funding";
  if (type === "product_service") return "product-service";
  return "case";
}

function fundingAngleFromScenario(scenario) {
  if (/销售|收入/iu.test(scenario)) return "销售线索和收入团队协作";
  if (/采购|下单/iu.test(scenario)) return "采购下单自动化";
  if (/模型|算力|部署/iu.test(scenario)) return "模型部署和算力服务";
  if (/地产|建筑/iu.test(scenario)) return "地产和建筑设计工作流";
  if (/客服|客户体验/iu.test(scenario)) return "客服和客户体验自动化";
  if (/智能体协作|企业/iu.test(scenario)) return "企业 Agent 协作平台";
  if (/物流/iu.test(scenario)) return "物流订单处理";
  return scenario.replace(/流程$/u, "");
}

function cleanSourceTitleForPublicTitle(title = "") {
  return publicCardCopy(String(title || "")
    .replace(/&amp;/gu, "&")
    .replace(/&#8217;|&rsquo;/gu, "'")
    .replace(/&quot;/gu, "\"")
    .replace(/\s+/gu, " ")
    .trim());
}

function sourceTitleTranslationKey(title = "") {
  return cleanSourceTitleForPublicTitle(title)
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function loadSourceTitleTranslations() {
  if (!fs.existsSync(sourceTitleTranslationsFile)) return new Map();
  try {
    const json = JSON.parse(fs.readFileSync(sourceTitleTranslationsFile, "utf8"));
    const entries = Array.isArray(json) ? json : (Array.isArray(json.translations) ? json.translations : []);
    const map = new Map();
    for (const entry of entries) {
      const sourceTitle = String(entry?.sourceTitle || "").trim();
      const zhTitle = String(entry?.zhTitle || entry?.translation || "").trim();
      if (!sourceTitle || !zhTitle || hasTextContamination(sourceTitle) || hasTextContamination(zhTitle)) continue;
      map.set(sourceTitleTranslationKey(sourceTitle), cleanSourceTitleForPublicTitle(zhTitle));
    }
    return map;
  } catch {
    return new Map();
  }
}

function sourceTitleNeedsChineseTranslation(title = "") {
  const text = String(title || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  return text.length > 12 && hanCount < 4 && latinWords.length >= 2;
}

function sourceTitleDisplayTitle(title = "") {
  const cleaned = cleanSourceTitleForPublicTitle(title);
  if (!cleaned || hasTextContamination(cleaned)) return "";
  if (!sourceTitleNeedsChineseTranslation(cleaned)) return cleaned;
  return sourceTitleTranslations.get(sourceTitleTranslationKey(cleaned)) || "";
}

const sourceTitleTranslations = loadSourceTitleTranslations();

function rawTitleZhFromSection(section) {
  const raw = readRawJson(section);
  const title = cleanSourceTitleForPublicTitle(raw.title_zh || raw.titleZh || "");
  if (!title || hasTextContamination(title) || !hasCjk(title)) return "";
  return title;
}

function compactLaunchTitle(company = "", title = "") {
  const cleanCompany = shortCompany(company);
  const text = cleanSourceTitleForPublicTitle(title);
  if (!cleanCompany || !text) return "";
  const escapedCompany = cleanCompany.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const pattern = new RegExp(`^${escapedCompany}\\s+(?:unveils?|launches?|introduces?|debuts?|announces?)\\s+(.+?)(?:[:：]|\\s+-\\s+|\\s+for\\s+|\\s+to\\s+|$)`, "iu");
  const product = shortCompany(text.match(pattern)?.[1] || "");
  if (!product || isWeakCompanyName(product)) return "";
  return `${cleanCompany} 发布 ${product}`;
}

function publicTitleForAutoSignal({ type, company, sourceEventTitle, amount, translatedTitle = "" }) {
  const translated = translatedTitle || sourceTitleDisplayTitle(sourceEventTitle);
  if (translated) return translated;
  if (sourceTitleNeedsChineseTranslation(sourceEventTitle)) return "";
  if (type === "funding" && company && amount && !hasTextContamination(company)) {
    const round = chineseRound(sourceEventTitle);
    return `${company} 获得 ${amount}${round ? ` ${round}` : ""} 融资`;
  }
  if ((type === "product_service" || type === "case") && sourceEventTitleCanBackAutoCard(sourceEventTitle)) {
    if (sourceTitleNeedsChineseTranslation(sourceEventTitle)) return "";
    const compact = compactLaunchTitle(company, sourceEventTitle);
    if (compact) return compact;
    return sourceEventTitle;
  }
  return "";
}

function sourceEventTitleCanBackAutoCard(title = "") {
  const text = cleanSourceTitleForPublicTitle(title);
  if (!text || hasTextContamination(text)) return false;
  if (/(roundup|guide|what is|what'?s real|how to|landscape|report|trends?|top \d+|ranked|list|directory|buyer'?s guide|comparison|ideas|use cases|may become|roles? in the ai era|job opening|job listing|careers?|hiring)\b/iu.test(text)) return false;
  return /\b(launch(?:es|ed)?|announc(?:es|ed|ing)?|introduc(?:es|ed|ing)?|public preview|generally available|GA|available now|reach(?:es|ed)? the next phase|live transactions?|partners? with|partnership|procurement|contract|customer story|case study|deploy(?:s|ed|ment)?|rollout|adopt(?:s|ed|ion)?|uses?|used by|boosts?|increas(?:es|ed)|reduc(?:es|ed)|cuts?|saves?|improv(?:es|ed)|internal automation agents|expands?|unveils?)\b/iu.test(text);
}

function sourceTitleLineFromText(text = "") {
  const lines = String(text || "")
    .split(/\r?\n/u)
    .map((line) => line.replace(/\s+/gu, " ").trim())
    .filter(Boolean);
  for (const line of lines) {
    if (line.length < 12 || line.length > 180) continue;
    if (hasTextContamination(line)) continue;
    if (/^(Image Credits?|Credit|Photo|Topics?|Most Popular|Loading the next article|Error loading|REGISTER NOW|Skip to content)\b/iu.test(line)) continue;
    if (/^(AI|Startups?|Government & Policy|Enterprise|News|Opinion|Sponsored)$/iu.test(line)) continue;
    if (/^(UPDATED|By)\b/iu.test(line)) continue;
    if (/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s+\d{4}\b/iu.test(line)) continue;
    const words = line.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
    const hasEventWord = /\b(AI|agent|agents|FDE|Forward Deployed|raises?|raised|funding|seed|launches?|announces?|introducing|available|case|platform|models?|enterprise|robot|robots|workflow)\b|融资|发布|推出|上线|合作|采购|部署|落地|客户|案例/iu.test(line);
    if (!hasEventWord) continue;
    if (!hasCjk(line) && words.length < 4) continue;
    return cleanSourceTitleForPublicTitle(line);
  }
  return "";
}

function originalSourceTitleFromSection(section) {
  const raw = readRawJson(section);
  const rawTitle = cleanSourceTitleForPublicTitle(raw.title || "");
  if (rawTitle && !hasTextContamination(rawTitle) && !/AI\s*business signal|来源材料显示|公开材料显示/iu.test(rawTitle)) {
    return rawTitle;
  }
  const fullTextTitle = sourceTitleLineFromText(raw.full_text || raw.clean_text || "");
  if (fullTextTitle) return fullTextTitle;
  return "";
}

function sourcePointMatchesSignalType(point = "", type = "") {
  const text = String(point || "");
  if (!text) return false;
  if (type === "funding" && /funding|financing|round|valuation|raises?|raised|closed|ARR|annual recurring revenue/iu.test(text)) return true;
  if (type === "product_service" && /product|platform|service|launch|release|released|introduc|available|public preview|general availability|pricing|API|SDK|partnership|partners? with|integration/iu.test(text)) return true;
  if (type === "case" && /case study|customer story|customer|deployed|deployment|adopted|adoption|used by|uses?|production|workflow|procurement|contract|partnership|partners? with|rollout|saved|reduced|cut|hours per person|ARR|annual recurring revenue/iu.test(text)) return true;
  if (type === "funding") return /融资|资金流向|资本事件|战略投资|\$|美元|Series|Seed/iu.test(text);
  if (type === "product_service") return /产品|平台|服务|发布|推出|上线|API|SDK|可采购|可部署/iu.test(text);
  return /客户|部署|采用|生产落地|企业工作流|案例|试点/iu.test(text);
}

function cleanSourceEventTitle(title = "") {
  const text = String(title || "")
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/\s*\|\s*[^|]{2,80}$/u, "")
    .replace(/\s+-\s*(TechCrunch|SiliconANGLE|BusinessWire|PR Newswire|Markets Insider|CFO Dive|Google Cloud Press Corner)$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (!text || /^https?:\/\//iu.test(text) || /^P-\d+\b/iu.test(text)) return "";
  if (/案例：\s*AI\s*进入|信号：\s*AI\s*进入/iu.test(text)) return "";
  return text.slice(0, 120);
}

function isNonCommercialPolicyOrEthicsSignal(section) {
  const hasCommercialAction = hasConcreteProductEvent(section)
    || hasConcreteCaseEvent(section)
    || hasStrictMarketStructureEvent(section);
  const purePolicyConflict = /\b(ban|banned|prohibit|controversy)\b|绂佷护|绂佹|浜夎/iu;
  const text = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  if (hasCommercialAction && !purePolicyConflict.test(text)) return false;
  if (/\b(government|ban|banned|prohibit|national security|policy|regulat(?:ion|or)|controversy)\b|政府|禁令|禁止|国家安全|政策|监管|争议/iu.test(text)) {
    return true;
  }
  return /(教皇|通谕|梵蒂冈|人类尊严|深刻的人性|公共伦理|Pope|Vatican|encyclical|humanitas|human dignity)/iu.test(text);
}

function isEligibleAutoSignal(section) {
  return autoSignalEligibilityIssues(section).length === 0;
}

function autoSignalSpec(poolRef, section, index) {
  const text = textForInference(section);
  const type = inferSignalType(section);
  const company = companyFromSection(section);
  const summaryOperatorMaterial = evidenceStrengthForSection(section) === "traceable_summary"
    && /\b(podcast|simplecast|interview|episode|ceo|founder|co-founder)\b|CEO|创始人|访谈|播客/iu.test(sectionEvidenceText(section));

  if (!allowsObservationSummaryEvidence(section)) {
    const maxAgeDays = type === "product_service" ? 14 : 180;
    if (isStalePublication(section, maxAgeDays)) return null;
  }

  let scenario = scenarioFromText(text);
  if (/^(BentoCloud|Microsoft Foundry)$/u.test(company)) {
    scenario = "模型部署和算力调用";
  }
  let amount = extractAmount(text);
  const prefix = `SIG-${date.replaceAll("-", "")}-A${String(index).padStart(2, "0")}`;
  const sourceTitle = originalSourceTitleFromSection(section);
  if (!sourceTitle) return null;
  const sourceEventTitle = cleanSourceEventTitle(sourceTitle);
  if (!sourceEventTitle) return null;
  if (isWeakCompanyName(company)) return null;
  if (type === "funding" && !hasStrictFundingAnnouncement(section, sourceEventTitle)) return null;
  const strategicInvestment = isConfirmedStrategicInvestment(section, sourceEventTitle);
  if (strategicInvestment && !titleHasFundingAmountOrRound(sourceEventTitle)) amount = "";
  const translatedTitle = rawTitleZhFromSection(section) || sourceTitleDisplayTitle(sourceTitle) || sourceTitleDisplayTitle(sourceEventTitle);
  let title = publicTitleForAutoSignal({ type, company, sourceEventTitle, amount, translatedTitle });
  if (!title && type === "funding" && strategicInvestment && !sourceTitleNeedsChineseTranslation(sourceEventTitle)) {
    title = `${company} 获得战略投资`;
  }
  if (!title && (allowsObservationSummaryEvidence(section) || summaryOperatorMaterial)) {
    title = `${company || "AI 公司"} 的 AI 商业观察`;
  }
  if (!title) return null;
  const sourcePoints = sourcePointsFromSection(section);
  const sourceExcerpt = sourceExcerptFromSection(section, sourcePoints);
  const observationSummaryEvidenceAllowed = allowsObservationSummaryEvidence(section);
  let eventLine = sourcePoints.find((point) => sourcePointMatchesSignalType(point, type)) || sourcePoints[0] || sourceExcerpt;
  if (!sourcePointIsUsable(eventLine) && sourceEventTitleCanBackAutoCard(sourceEventTitle) && hasFormalCardEvent(section)) {
    eventLine = sourceEventTitle;
  }
  if (!sourcePointIsUsable(eventLine) && (observationSummaryEvidenceAllowed || summaryOperatorMaterial)) {
    eventLine = `${company || "AI 公司"} 的公开访谈或趋势材料讨论 AI 商业化、产品方向、客户采用或市场结构变化：${sourceEventTitle}`;
  }
  if (!sourcePointIsUsable(eventLine)) return null;
  return {
    id: prefix,
    poolRef,
    type,
    dir: dirForSignalType(type),
    slug: `${slugify(company)}-${slugify(scenario)}-${poolRef.toLowerCase()}`,
    company,
    title,
    sourceTitle,
    eventLine,
    whyWatch: sourcePoints[1] || sourcePoints[0] || (observationSummaryEvidenceAllowed ? "该材料不是正式融资、产品发布或客户案例，但可作为 CEO / 经营者视角的商业观察线索。" : ""),
    businessMeaning: sourcePoints[2] || sourcePoints[1] || sourcePoints[0] || (observationSummaryEvidenceAllowed ? "用于观察 AI 产品商业化、客户采用、推理成本、分发或市场结构变化，不能单独当作强事实事件。" : ""),
    evidenceBoundary: value(section, "missing_information") || "证据边界以 Raw / Pool 中保留的原文、摘录和缺失项为准。",
    watchWindow: "",
    sourcePoints,
    sourceExcerpt,
    autoGenerated: true,
  };
}

function isLargeVendorSignal(section) {
  return /\b(Google|Microsoft|Anthropic|OpenAI|NVIDIA|Nvidia|Oracle|AWS|Amazon|Meta|Apple|IBM|Salesforce|DeepMind)\b/iu.test(textForInference(section));
}

function signalPriorityScore(spec, section) {
  const importance = Number(value(section, "importance_score")) || 0;
  const capture = Number(value(section, "raw_capture_priority")) || 0;
  let score = importance * 20 + capture;
  if (spec.type === "funding" && !isLargeVendorSignal(section)) score += 35;
  if (spec.type === "case" && value(section, "importance_type") === "important_vertical_solution") score += 25;
  if (hasNamedCommercialDeploymentEvidence(section)) score += 35;
  if (hasStrictMarketStructureEvent(section)) score += 25;
  if (isResearchBenchmarkContextWithoutCommercialEvent(section)) score -= 60;
  if (isGenericFdeExplainerOrServicePage(section)) score -= 60;
  if (spec.type === "product_service" && isLargeVendorSignal(section)) score -= 10;
  if (isLargeVendorSignal(section) && spec.type !== "product_service") score -= 5;
  return score;
}

function uniqueIssues(issues = []) {
  return [...new Set(issues.filter(Boolean))];
}

function autoSignalEligibilityIssues(section) {
  const issues = [...cardabilitySemanticIssues(section)];
  const sourceUrl = value(section, "source_url");
  const importanceType = value(section, "importance_type");
  const poolRoutes = value(section, "pool_routes");
  const text = `${poolTitle(section)} ${sourceUrl} ${value(section, "source_type")}`;
  if (/\bindex_only\b/iu.test(poolRoutes)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "pool_route_index_only_not_formal_card"));
  }
  if (!coreImportanceTypes.has(importanceType) && !allowsObservationSummaryEvidence(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, `unsupported_importance_type:${importanceType || "missing"}`));
  }
  if (inferSignalType(section) === "funding" && importanceType === "important_funding" && !isSingleCompanyFundingSignal(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "funding_not_single_company_round"));
  }
  const sourceEventTitle = cleanSourceEventTitle(originalSourceTitleFromSection(section));
  if (!sourceEventTitle) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "original_source_title_missing"));
  }
  if (isNonCommercialPolicyOrEthicsSignal(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "non_commercial_policy_or_ethics_signal"));
  }
  if (isCorporateCapexOrCommunityInvestment(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "corporate_capex_or_community_investment_not_signal_card"));
  }
  if (/aws\.amazon\.com\/marketplace|AWS Marketplace/iu.test(text)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "marketplace_directory_not_signal_card"));
  }
  if (/(learn\.microsoft\.com|\/docs?\/|documentation|README|readme-ov-file|model page|product catalog)/iu.test(text) || /why we.*re investing/iu.test(text)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "docs_or_catalog_or_investing_thesis"));
  }
  return uniqueIssues(issues);
}

function promotePriorityForIssues(issues = []) {
  if (issues.some((issue) => /valid_page_type|fact_type_constraints|stale_source_date|generic_report_or_list|index_only|user_feedback_not_fact_signal|text_indicates_index_only/iu.test(issue))) {
    return "low";
  }
  if (issues.some((issue) => /source_auditability|evidence_quality|missing_source_url|missing_source_material|summary_without_formal_event/iu.test(issue))) {
    return "medium";
  }
  return "review";
}

function repairSuggestionForIssues(issues = []) {
  const text = issues.join(" ");
  if (/stale_source_date/iu.test(text)) return "Find a fresh same-event source or keep as backend audit evidence.";
  if (/newsletter_roundup_requires_original_event_source/iu.test(text)) return "Use the newsletter only as discovery context; recapture the original dated event source before promoting.";
  if (/valid_page_type|generic_report_or_list_not_fact_signal|text_indicates_index_only|index_only|docs_or_catalog_or_investing_thesis/iu.test(text)) return "Resolve to a dated single company, product, funding, or customer event before promoting.";
  if (/source_title_translation_missing_or_contaminated/iu.test(text)) return "Add a direct Chinese source-title translation, or replace contaminated title evidence before promoting.";
  if (/fact_type_constraints:.*user_feedback|user_feedback_not_fact_signal/iu.test(text)) return "Replace feedback or commentary with original reporting or first-party evidence for the claimed business event.";
  if (/workforce_retraining_program_not_formal_signal_card/iu.test(text)) return "Keep workforce retraining or public funding programs as context; promote only single-company financing, product/service launch, or customer deployment evidence.";
  if (/research_benchmark_without_commercial_event/iu.test(text)) return "Keep research, benchmark, paper, dataset, or OCR material as backend technical context unless the same source proves a commercial launch, funding, customer deployment, procurement, or partnership event.";
  if (/generic_fde_explainer_or_service_page_without_customer_event/iu.test(text)) return "Keep generic FDE, service, role, or implementation pages as backend context unless the same source names a concrete customer deployment, procurement, launch, financing, partnership, or production rollout.";
  if (/sustainability_report_without_commercial_ai_event/iu.test(text)) return "Keep environmental, carbon, renewable-energy, or sustainability reports as backend market context unless the same source proves a commercial AI launch, customer deployment, procurement contract, financing, pricing, or partnership event.";
  if (/corporate_capex_or_community_investment_not_signal_card/iu.test(text)) return "Keep corporate regional capex, data-center, or community investment announcements as Pool context unless a separate product, customer, or financing event is sourced.";
  if (/funding_not_single_company_round/iu.test(text)) return "Use a single-company funding announcement with amount, round, investor, and date.";
  if (/source_auditability|evidence_quality|missing_source_url|missing_source_material/iu.test(text)) return "Repair Raw evidence extraction so source URL, snapshot, excerpts, and hashes are present.";
  if (/summary_without_formal_event/iu.test(text)) return "Keep as traceable summary unless it has a formal product, funding, case event, or the observation override is intentionally enabled.";
  if (/business_signal_scope/iu.test(text)) return "Recapture or reroute only product/service, funding, or case evidence into Signal Card generation.";
  if (/commercial_importance/iu.test(text)) return "Keep as Pool evidence unless the item has a clear commercial action, customer, funding, or deployment signal.";
  if (/duplicate_event_cluster/iu.test(text)) return "Keep as supporting evidence for the linked event instead of creating a duplicate Card.";
  return "Review evidence boundary and promote only if it can become a source-backed product, funding, or case Card.";
}

function notPromotedCandidateRow(poolRef, section, issues = []) {
  const finalIssues = uniqueIssues(issues);
  return {
    pool_ref: poolRef,
    title: poolTitle(section),
    source_url: value(section, "source_url"),
    issues: finalIssues,
    not_promoted_reason: finalIssues.join(", ") || "not_selected_for_signal_card",
    repair_suggestion: repairSuggestionForIssues(finalIssues),
    promote_priority: promotePriorityForIssues(finalIssues),
  };
}

function withAutoSignalId(spec, index) {
  return { ...spec, id: `SIG-${date.replaceAll("-", "")}-A${String(index).padStart(2, "0")}` };
}

function autoSignalsFromPool(sections, explicitSpecs) {
  if (!autoSignalEnabled) return { specs: [], notPromotedCandidates: [] };
  const selectedPoolRefs = new Set(explicitSpecs.map((spec) => spec.poolRef));
  const selectedClusterKeys = new Set(
    explicitSpecs
      .map((spec) => {
        const section = sections.get(spec.poolRef);
        return section ? signalClusterKey(spec, section) : "";
      })
      .filter(Boolean)
  );
  const candidates = [];
  const notPromotedCandidates = [];
  let index = 1;
  for (const [poolRef, section] of sections) {
    if (selectedPoolRefs.has(poolRef)) continue;
    const eligibilityIssues = autoSignalEligibilityIssues(section);
    if (eligibilityIssues.length) {
      notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, eligibilityIssues));
      continue;
    }
    const spec = autoSignalSpec(poolRef, section, index);
    if (!spec) {
      notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, ["auto_signal_spec_null"]));
      continue;
    }
    const clusterKey = signalClusterKey(spec, section);
    if (selectedClusterKeys.has(clusterKey)) {
      notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, ["duplicate_event_cluster"]));
      continue;
    }
    candidates.push({ spec, section, clusterKey, score: signalPriorityScore(spec, section) });
    index += 1;
  }

  const picked = [];
  const pickedPoolRefs = new Set();
  const pickedClusterKeys = new Set();
  const sorted = candidates.sort((a, b) => b.score - a.score || a.spec.poolRef.localeCompare(b.spec.poolRef));

  function pickWhere(predicate, count = Number.POSITIVE_INFINITY) {
    for (const item of sorted) {
      if (count <= 0) break;
      if (!predicate(item)) continue;
      if (pickedPoolRefs.has(item.spec.poolRef) || pickedClusterKeys.has(item.clusterKey)) continue;
      picked.push(item);
      pickedPoolRefs.add(item.spec.poolRef);
      pickedClusterKeys.add(item.clusterKey);
      count -= 1;
    }
  }

  pickWhere(() => true);
  const finalPicked = Number.isFinite(assetGenerationLimit)
    ? picked.slice(0, assetGenerationLimit)
    : picked;

  for (const item of finalPicked) {
    selectedPoolRefs.add(item.spec.poolRef);
    selectedClusterKeys.add(item.clusterKey);
  }
  if (args.get("debug-auto-signals") === "true") {
    console.log(JSON.stringify({
      auto_signal_candidate_count: candidates.length,
      auto_signal_picked_count: finalPicked.length,
      auto_signal_debug_rejects: notPromotedCandidates.map((item) => ({
        poolRef: item.pool_ref,
        title: item.title,
        issues: item.issues,
      })),
    }, null, 2));
  }
  return {
    specs: finalPicked.map((item, itemIndex) => withAutoSignalId(item.spec, itemIndex + 1)),
    notPromotedCandidates,
  };
}

function yamlList(items) {
  if (!items?.length) return "[]";
  return `[${items.map(yamlString).join(", ")}]`;
}

function yamlString(input = "") {
  return JSON.stringify(String(input || "").replace(/\s+/gu, " ").trim());
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function inferredTagsFromText(text = "") {
  const tags = {
    track: ["track-ai-agent"],
    function: [],
    scenario: [],
    customer: [],
    evidence: [],
    stage: [],
    region: [],
    source: [],
  };
  const add = (group, ...ids) => tags[group].push(...ids);
  const has = (pattern) => pattern.test(text);

  if (has(/coding|code|developer|github|sdk|api|工程|开发|编程/iu)) add("track", "track-ai-coding"), add("function", "function-engineering"), add("customer", "customer-developer-team");
  if (has(/workflow|agent|智能体|流程|enterprise|企业/iu)) add("track", "track-enterprise-workflow"), add("customer", "customer-enterprise");
  if (has(/data|snowflake|rag|知识库|数据/iu)) add("track", "track-enterprise-data"), add("scenario", "scenario-knowledge-base");
  if (has(/infra|inference|temporal|模型|推理|基础设施|算力/iu)) add("track", "track-ai-infra");
  if (has(/health|medical|clinical|医疗|医院|临床/iu)) add("track", "track-medical-ai"), add("customer", "customer-healthcare-provider"), add("scenario", "scenario-healthcare-operations");
  if (has(/imaging|影像|诊断/iu)) add("scenario", "scenario-clinical-imaging");
  if (has(/procurement|bidding|采购|投标|招标/iu)) add("function", "function-procurement-bidding"), add("scenario", "scenario-bidding-response");
  if (has(/finance|财务|贷款|理赔|保险/iu)) add("function", "function-finance");
  if (has(/insurance|claim|claims|理赔|保险/iu)) add("scenario", "scenario-insurance-claims");
  if (has(/logistics|supply chain|delivery|inventory|物流|配送|供应链|库存/iu)) add("scenario", "scenario-logistics-supply-chain");
  if (has(/construction|real estate|property|建筑|地产|工程贷款/iu)) add("scenario", "scenario-construction-real-estate");
  if (has(/revenue operations|revops|commercial brain|收入运营|销售运营|商业大脑/iu)) add("scenario", "scenario-revenue-operations");
  if (has(/customer|service|客服|售后|工单|voice|语音/iu)) add("track", "track-ai-customer-service"), add("function", "function-customer-service"), add("scenario", "scenario-customer-ticket");
  if (has(/sales|销售/iu)) add("function", "function-sales"), add("scenario", "scenario-sales-briefing");
  if (has(/governance|permission|audit|security|治理|权限|审计|安全/iu)) add("track", "track-ai-governance"), add("scenario", "scenario-agent-governance");
  if (has(/partnership|integration|integrates|合作|集成|接入/iu)) add("evidence", "evidence-partnership-integration");
  if (has(/acquisition|acquires|acquired|merger|收购|并购/iu)) add("evidence", "evidence-acquisition");
  if (has(/pricing|price|cost|usage limit|rate limit|推理成本|定价|价格|用量|限额|成本/iu)) add("evidence", "evidence-pricing-cost");
  if (has(/metric|reduced|increase|saved|效率|处理量|节省|提升|降低|指标/iu)) add("evidence", "evidence-customer-metric");

  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function formalTagsYaml(tags) {
  return [
    "formal_tags:",
    `  track: ${yamlList(tags.track)}`,
    `  function: ${yamlList(tags.function)}`,
    `  scenario: ${yamlList(tags.scenario)}`,
    `  customer: ${yamlList(tags.customer)}`,
    `  evidence: ${yamlList(tags.evidence)}`,
    `  stage: ${yamlList(tags.stage)}`,
    `  region: ${yamlList(tags.region)}`,
    `  source: ${yamlList(tags.source)}`,
  ].join("\n");
}

function formalTagsForSignal(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.eventLine} ${(spec.sourcePoints || []).join(" ")} ${spec.company}`);
  tags.evidence.push(spec.type === "funding" ? "evidence-funding" : spec.type === "case" ? "evidence-customer-adoption" : "evidence-product-launch");
  if (spec.type === "funding") tags.stage.push("stage-rising");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function opportunitySignalsForSignal(spec, sourceLevel, section) {
  return inferOpportunitySignals({
    category: spec.type,
    signalType: spec.type,
    title: spec.title,
    sourceTitle: spec.sourceTitle,
    sourceUrl: value(section, "source_url"),
    sourceLevel,
    keyExcerpts: spec.sourcePoints || [],
    rawText: [
      spec.eventLine,
      spec.whyWatch,
      spec.businessMeaning,
      spec.evidenceBoundary,
      spec.watchWindow,
      spec.sourceExcerpt,
      value(section, "key_excerpts"),
      value(section, "evidence_seed"),
    ].filter(Boolean).join("\n"),
  });
}

function formalTagsForScene(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.industry} ${spec.role} ${spec.workflow} ${spec.changedStep}`);
  tags.evidence.push("evidence-customer-adoption");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function formalTagsForTrend(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.hypothesis} ${spec.sourceTypes?.join(" ") || ""}`);
  tags.evidence.push("evidence-customer-adoption");
  tags.stage.push("stage-rising");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function poolRoutesForPrimaryRaw(section) {
  const routes = value(section, "pool_routes")
    .split(/[,，\s]+/u)
    .map((item) => item.trim())
    .filter(Boolean);
  if (isRawDirectSection(section)) routes.push("raw_direct");
  return uniq(routes.length ? routes : ["raw_direct"]);
}

function signalCard(spec, section) {
  const rawRef = value(section, "raw_ref");
  const rawArchive = value(section, "raw_archive");
  const rawJson = value(section, "raw_json");
  const sourceUrl = value(section, "source_url");
  const sourceLevel = value(section, "source_level");
  const hash = value(section, "raw_full_text_hash");
  const extractionQuality = value(section, "extraction_quality");
  const hasFullText = value(section, "has_full_text") === "true";
  const evidenceStrength = evidenceStrengthForSection(section);
  const importanceType = value(section, "importance_type");
  const importanceScore = value(section, "importance_score");
  const sourcePoints = (spec.sourcePoints?.length ? spec.sourcePoints : sourcePointsFromSection(section)).slice(0, 6);
  const sourceExcerpt = spec.sourceExcerpt || sourceExcerptFromSection(section, sourcePoints);
  const sourceFact = sourcePoints[0] || spec.title;
  const originalPoints = sourcePoints.filter((item, index) => index > 0 && !isSameSourcePoint(item, sourceFact));
  const valueSummary =
    [spec.businessMeaning, ...originalPoints].find((item) => item && !isSameSourcePoint(item, sourceFact)) ||
    generatedValueSummary(spec, section);
  const evidenceBoundary = spec.evidenceBoundary || value(section, "missing_information") || "未记录额外缺失项。";

  const yamlString = (input = "") => JSON.stringify(String(input || ""));
  const poolRoutes = poolRoutesForPrimaryRaw(section).map((route) => `    - ${route}`).join("\n");

  return `---
id: ${spec.id}
type: signal_card
signal_type: ${spec.type}
title: ${yamlString(spec.title)}
date: ${date}
status: published
${spec.sourceTitle ? `source_title: ${yamlString(spec.sourceTitle)}\n` : ""}asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: ${now}
updated_at: ${now}

raw_refs: ["${rawRef}"]
pool_refs: ["${spec.poolRef}"]
primary_raw:
  raw_ref: ${rawRef}
  raw_archive: ${yamlString(rawArchive)}
  raw_json: ${yamlString(rawJson)}
  source_url: ${yamlString(sourceUrl)}
  full_text_hash: ${yamlString(hash)}
  source_level: ${sourceLevel}
  extraction_quality: ${extractionQuality}
  has_full_text: ${hasFullText}
  evidence_strength: ${evidenceStrength}
  pool_routes:
${poolRoutes}
  raw_qc_decision: allow
  importance_type: ${importanceType}
  importance_score: ${importanceScore}

${formalTagsYaml(formalTagsForSignal(spec))}

${opportunitySignalsYaml(opportunitySignalsForSignal(spec, sourceLevel, section))}

signal_owner: ${yamlString(spec.company)}

frontend:
  displayTitle: ${yamlString(spec.title)}
  sourceLinks:
    - ${yamlString(sourceUrl)}
---

# ${spec.title}

## 新闻事实

${sourceFact}

## 原文要点

${originalPoints.length ? originalPoints.map((item) => `- ${item}`).join("\n") : `- ${sourceExcerpt || sourceFact}`}

## 价值描述

${valueSummary}

## 可见原文片段

${sourceExcerpt || sourceFact}

## 证据边界

${evidenceBoundary}
`;
}

function sceneCandidate(spec) {
  return `---
id: ${spec.id}
type: scene_candidate
title: "${spec.title}"
date: ${date}
status: draft
asset_level: candidate
fact_draft_gate: passed
source_evidence_gate: passed
candidate_regression_gate: passed
created_at: ${now}
updated_at: ${now}
industry_or_department: "${spec.industry}"
user_or_role: "${spec.role}"
workflow_or_task: "${spec.workflow}"
ai_changed_step: "${spec.changedStep}"
evidence_gap: "${spec.evidenceGap}"
related_signal_cards: ${yamlList(spec.relatedSignals)}
${formalTagsYaml(formalTagsForScene(spec))}
---

# ${spec.title}

## 场景底稿

行业或部门：${spec.industry}

岗位或使用者：${spec.role}

具体流程或任务：${spec.workflow}

AI 改变了哪一步：${spec.changedStep}

## 证据边界

${spec.evidenceGap}
`;
}

function trendCandidate(spec) {
  return `---
id: ${spec.id}
type: trend_candidate
title: "${spec.title}"
date: ${date}
status: draft
asset_level: candidate
trend_evidence_gate: threshold_pending
fact_draft_gate: passed
source_evidence_gate: passed
candidate_regression_gate: passed
created_at: ${now}
updated_at: ${now}
trend_hypothesis: "${spec.hypothesis}"
supporting_changes: []
supporting_scenes: ["SCN-20260520-01", "SCN-20260521-01"]
source_types: ${yamlList(spec.sourceTypes)}
risk_boundary: "${spec.riskBoundary}"
follow_up_variables: "${spec.followUpVariables}"
related_signal_cards: ${yamlList(spec.relatedSignals)}
${formalTagsYaml(formalTagsForTrend(spec))}
---

# ${spec.title}

## 趋势候选

${spec.hypothesis}

## 支撑材料

${spec.relatedSignals.map((item) => `- ${item}`).join("\n")}

## 风险边界与后续变量

${spec.riskBoundary}

${spec.followUpVariables}
`;
}

function writeSignalIndexes(specs) {
  const uniqueSpecs = dedupeSignalIndexSpecs(specs);
  const lines = [
    "---",
    `date: ${date}`,
    "stage: business-signals",
    "status: generated-by-asset-card-generator",
    `signal_count: ${uniqueSpecs.length}`,
    `generated_at: ${now}`,
    "---",
    "",
    `# ${date} 商业信号`,
    "",
    ...uniqueSpecs.map((spec) => `- ${spec.id}｜${spec.title}｜${spec.type}｜${spec.company}`),
  ];
  write(path.join(root, "01-SiteV2", "content", "04-business-signals", "signals", `${date}-signals.md`), lines.join("\n"));
}

function dedupeSignalIndexSpecs(specs) {
  const byFinalCard = new Map();
  for (const spec of specs) {
    const key = spec.id || `${spec.type}|${normalizedSignalText(spec.company)}|${normalizedSignalText(spec.title)}`;
    if (!byFinalCard.has(key)) byFinalCard.set(key, spec);
  }
  return [...byFinalCard.values()];
}

function writePoolToCardHandoff({ written, merged, skipped, clusterRows, frontstageSpecs, notPromotedCandidates = [] }) {
  const reportDir = path.join(root, "agent-workflow", "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const handoffPath = path.join(reportDir, `${date}-pool-to-card-handoff.md`);
  const manifestPath = path.join(reportDir, `${date}-frontstage-manifest.json`);
  const generatedAt = new Date().toISOString();
  const handoff = [
    `# ${date} Pool-to-Card Handoff`,
    "",
    `- generated_at: ${generatedAt}`,
    `- written_count: ${written.length}`,
    `- merged_count: ${merged.length}`,
    `- skipped_count: ${skipped.length}`,
    `- signal_asset_count: ${frontstageSpecs.length}`,
    `- not_promoted_candidate_count: ${notPromotedCandidates.length}`,
    `- asset_generation_limit: ${Number.isFinite(assetGenerationLimit) ? assetGenerationLimit : "all_cardable_raw_pool"}`,
    `- signal_asset_mode: all cardable Raw / Pool business signals`,
    "",
    "## Signal Card Assets",
    "",
    frontstageSpecs.length
      ? frontstageSpecs.map((spec) => `- ${spec.id}｜${spec.poolRef}｜${spec.title}`).join("\n")
      : "- none",
    "",
    "## Cluster / Dedupe Rows",
    "",
    clusterRows.length
      ? clusterRows.map((row) => `- ${row.poolRef}｜${row.clusterKey}｜${row.decision}${row.reason ? `｜${row.reason}` : ""}`).join("\n")
      : "- none",
    "",
    "## Written",
    "",
    written.length ? written.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Merged",
    "",
    merged.length ? merged.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Skipped",
    "",
    skipped.length ? skipped.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Not Promoted Candidates",
    "",
    notPromotedCandidates.length
      ? notPromotedCandidates.map((item) => `- ${item.pool_ref}: ${item.not_promoted_reason}; repair=${item.repair_suggestion}; priority=${item.promote_priority}; title=${item.title}`).join("\n")
      : "- none",
    "",
  ].join("\n");
  fs.writeFileSync(handoffPath, handoff, "utf8");
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    date,
    generated_at: generatedAt,
    signal_card_assets: frontstageSpecs.map((spec) => ({
      id: spec.id,
      pool_ref: spec.poolRef,
      title: spec.title,
      type: spec.type,
      company: spec.company,
    })),
    not_promoted_candidates: notPromotedCandidates,
    skipped,
    merged,
  }, null, 2)}\n`, "utf8");
  return {
    handoff: path.relative(root, handoffPath).replace(/\\/g, "/"),
    manifest: path.relative(root, manifestPath).replace(/\\/g, "/"),
  };
}

function updateDailyMonitorLogFrontSignalCounts(counts) {
  const reportsDir = path.join(root, "agent-workflow", "reports");
  if (!fs.existsSync(reportsDir)) return;
  const logFile = fs.readdirSync(reportsDir)
    .filter((name) => name.includes(date) && /daily.*log|guanlan-daily-monitor-log/u.test(name))
    .map((name) => path.join(reportsDir, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  if (!logFile) return;
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const line = `- front_signal_sab_source_count: S=${counts.S || 0}; A=${counts.A || 0}; B=${counts.B || 0}; total=${total}`;
  const text = fs.readFileSync(logFile, "utf8");
  const next = /- front_signal_sab_source_count:.*$/mu.test(text)
    ? text.replace(/- front_signal_sab_source_count:.*$/mu, line)
    : text.replace(/(- raw_count_by_source_type:.*(?:\r?\n)?)/u, `$1${line}\n`);
  fs.writeFileSync(logFile, next, "utf8");
}

function cleanSignalCardsForDate() {
  for (const dir of signalCardDirs()) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith(`${date}--signal--`) && name.endsWith(".md")) {
        fs.rmSync(path.join(dir, name), { force: true });
      }
    }
  }
}

function main() {
  runReadiness();

  const explicitSpecs = signalSpecs[date] || [];
  const candidates = candidateSpecs[date] || {};
  const sections = poolSections();
  const autoResult = autoSignalsFromPool(sections, explicitSpecs);
  const autoSpecs = autoResult.specs || [];
  const notPromotedCandidates = autoResult.notPromotedCandidates || [];
  const specs = [...explicitSpecs, ...autoSpecs].map(normalizeSignalSpec);
  const written = [];
  const skipped = [];
  const merged = [];
  const clusterRows = [];
  const frontSignalSourceLevels = { S: 0, A: 0, B: 0 };
  const signalIndexSpecs = [];
  const acceptedClusterKeys = new Set();

  cleanSignalCardsForDate();
  const existingSignalIndex = existingSignalCardIndex();

  for (const spec of specs) {
    const section = sections.get(spec.poolRef);
    if (!section) {
      skipped.push(`${spec.poolRef}: missing section`);
      continue;
    }
    const semanticIssues = cardabilitySemanticIssues(section);
    if (semanticIssues.length) {
      skipped.push(`${spec.poolRef}: semantic gate failed ${semanticIssues.join(",")}`);
      clusterRows.push({ poolRef: spec.poolRef, clusterKey: "blocked", decision: "skipped", reason: semanticIssues.join(",") });
      continue;
    }
    const clusterKey = signalClusterKey(spec, section);
    if (acceptedClusterKeys.has(clusterKey)) {
      skipped.push(`${spec.poolRef}: duplicate event cluster ${clusterKey}`);
      clusterRows.push({ poolRef: spec.poolRef, clusterKey, decision: "skipped", reason: "duplicate_event_cluster" });
      continue;
    }
    acceptedClusterKeys.add(clusterKey);
    clusterRows.push({ poolRef: spec.poolRef, clusterKey, decision: "accepted", reason: "" });
    const existing = findExistingSignalCard(existingSignalIndex, spec, section);
    if (existing) {
      const updated = upsertExistingSignalCard(existing, spec, section);
      const relative = path.relative(root, updated.file).replace(/\\/g, "/");
      merged.push(`${spec.poolRef}: merged into ${relative}`);
      written.push(relative);
      // Historical merges update existing Cards; they are not new same-date
      // Signal Cards and must not appear in today's signals index.
      continue;
    }
    const file = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", spec.dir, `${date}--signal--${spec.slug}.md`);
    write(file, signalCard(spec, section));
    for (const fingerprint of signalFingerprints(spec, section)) {
      existingSignalIndex.set(fingerprint, { file, id: spec.id, title: spec.title, type: spec.type, owner: spec.company });
    }
    const sourceLevel = value(section, "source_level").toUpperCase();
    if (sourceLevel in frontSignalSourceLevels) frontSignalSourceLevels[sourceLevel] += 1;
    written.push(path.relative(root, file).replace(/\\/g, "/"));
    signalIndexSpecs.push(spec);
  }

  if (candidates.scene) {
    const knowledgeFile = path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "scene", `${date}--scene--${candidates.scene.slug}.md`);
    const contentFile = path.join(root, "01-SiteV2", "content", "06-asset-candidates", "scene", `${date}--scene--${candidates.scene.slug}.md`);
    const text = sceneCandidate(candidates.scene);
    write(knowledgeFile, text);
    write(contentFile, text);
    written.push(path.relative(root, knowledgeFile).replace(/\\/g, "/"));
    written.push(path.relative(root, contentFile).replace(/\\/g, "/"));
  }

  if (candidates.trend && generateTrendCandidates) {
    const knowledgeFile = path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "trend", `${date}--trend-candidate--${candidates.trend.slug}.md`);
    const contentFile = path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend", `${date}--trend-candidate--${candidates.trend.slug}.md`);
    const text = trendCandidate(candidates.trend);
    write(knowledgeFile, text);
    write(contentFile, text);
    written.push(path.relative(root, knowledgeFile).replace(/\\/g, "/"));
    written.push(path.relative(root, contentFile).replace(/\\/g, "/"));
  } else if (candidates.trend) {
    skipped.push("trend_candidate: skipped; run agent-workflow/tools/run-trend-candidate-decision.mjs after Card generation");
  }

  writeSignalIndexes(signalIndexSpecs);
  updateDailyMonitorLogFrontSignalCounts(frontSignalSourceLevels);
  written.push(`01-SiteV2/content/04-business-signals/signals/${date}-signals.md`);
  const handoff = writePoolToCardHandoff({
    written,
    merged,
    skipped,
    clusterRows,
    frontstageSpecs: signalIndexSpecs,
    notPromotedCandidates,
  });
  written.push(handoff.handoff, handoff.manifest);

  console.log(JSON.stringify({ ok: true, date, written, merged, skipped, handoff }, null, 2));
}

main();
