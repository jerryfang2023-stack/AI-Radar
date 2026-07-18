import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
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
const expectedRawCount = args.has("expected-raw-count")
  ? nonNegativeInt(args.get("expected-raw-count"), Number.NaN)
  : null;

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
    .replace(/(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/gu, "")
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
    .replace(/^.*?\bTotal Shares\s+(?=[A-Z][A-Za-z0-9.&'-]+\s+(?:has\s+raised|raises|raised|secures|secured|宣布|完成))/iu, "")
    .replace(/\s+/gu, " ")
    .replace(/\b([A-Za-z]*\d+)\.\s+(\d+\b)/gu, "$1.$2")
    .trim();
}

function sourcePointLooksPageChrome(value = "") {
  const text = String(value || "");
  return /IT之家\s+首页\s+IT圈|首页.{0,80}设置.{0,80}投稿.{0,80}订阅|软媒应用.{0,80}App客户端|投诉水文.{0,40}我要纠错|下载IT之家APP|相关文章.{0,40}关键词|相关阅读：|广告声明：|软媒旗下(?:网站|软件)|Skip to content|Navigation Menu|Search or jump to|Saved searches|Appearance settings|Read the blog post here|Written by .{0,120}Last updated .{0,120}Table of contents|Share:\s*Copied\s+https?:\/\/|^io\/.*https?:\/\/|https?:\/\/www\.$|Home\s+Pricing\s+Docs\s+Blog\s+(?:\[?Company\]?\s+)?Login\s+Talk To Us|###|\bTotal Shares\b|accuracy layer for f(?:[。.]|$)/iu.test(text);
}

function sourcePointLooksSplitFragment(value = "") {
  const text = String(value || "").trim();
  return /\d+\.$/u.test(text)
    || /^\d+\s+/u.test(text)
    || /^,?\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}\s*[—-]/iu.test(text)
    || /^\d+(?:\.\d+)?\s*(?:万|亿)?(?:美元|元|人民币|%)\s*[，,]/u.test(text);
}

function sourceSentences(raw = "", limit = 16) {
  const text = stripSourceNoise(raw);
  if (!text) return [];
  return text
    .split(/(?<=[!?。！？])\s*|(?<=\.)\s+|\n+/u)
    .map(stripSourceNoise)
    .filter((item) => item.length >= 28)
    .filter((item) => !sourcePointLooksPageChrome(item))
    .filter((item) => !/Sign in|Provide feedback|Twitter|Facebook|LinkedIn|Email Updates/iu.test(item))
    .slice(0, limit);
}

function sourceDetailClauses(raw = "") {
  const clauses = [];
  for (const sentence of sourceSentences(raw, 80)) {
    for (const segment of sentence.split(/[；;]/u)) {
      const commaIndex = segment.search(/[，,]/u);
      if (commaIndex < 12) continue;
      const detail = stripSourceNoise(segment.slice(commaIndex + 1));
      if (detail.length < 36 || sourcePointLooksPageChrome(detail) || sourcePointLooksSplitFragment(detail)) continue;
      const parts = detail.split(/[，,、]/u).map(stripSourceNoise).filter(Boolean);
      for (let index = 0; index < parts.length - 1; index += 1) {
        const pair = `${parts[index]}，${parts[index + 1]}`;
        if (pair.length >= 28 && pair.length < 48 && !sourcePointLooksPageChrome(pair) && !sourcePointLooksSplitFragment(pair)) {
          clauses.push(pair);
        }
      }
      clauses.push(detail);
    }
  }
  return [...new Set(clauses)];
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
  return /AI|agent|agentic|LLM|model|enterprise|customer|workflow|deployment|platform|cloud|inference|public preview|funding|raises|raised|launched|announced|released|introduced|case study|融资|客户|部署|平台|模型|企业|美元|权限|定价|计费|搜索|界面|\$|\d/iu.test(text);
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
  if (/Bounded direct-source recall|QC-reviewed original evidence|raw_entry_reason|curated_original_source/iu.test(text)) return false;
  if (sourcePointLooksPageChrome(text)) return false;
  if (sourcePointLooksSplitFragment(text)) return false;
  const han = countHan(text);
  const latin = countLatinWords(text);
  if (/^(?:原文称|原文描述)[，,:]\s*[A-Za-z]/u.test(text) && latin >= 4) return false;
  if (text.length > 90 && latin >= 10 && han < 18) return false;
  if (latin >= 16 && han < 24) return false;
  return true;
}

function sourceTitleFactFromSection(section) {
  const sourceTitle = originalSourceTitleFromSection(section);
  const translated = sourceTitleDisplayTitle(sourceTitle) || rawTitleZhFromSection(section);
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
  if (unit === "b" || unit === "billion") return `${amount}0 亿${currency}`.replace(/\.0 亿/u, " 亿");
  if (unit === "m" || unit === "million") {
    const tenThousands = amount * 100;
    if (tenThousands >= 10000) {
      const yi = tenThousands / 10000;
      return `${Number.isInteger(yi) ? yi : yi.toFixed(2)} 亿${currency}`;
    }
    return Number.isInteger(tenThousands) ? `${tenThousands} 万${currency}` : `${tenThousands.toFixed(1)} 万${currency}`;
  }
  if (unit === "k") return `${amount} 千${currency}`;
  return `${amount} ${currency}`;
}

function chineseRound(raw = "") {
  const text = String(raw || "").toLowerCase();
  if (/pre[- ]seed/u.test(text)) return "种子前轮";
  if (/\bseed\b/u.test(text)) return "种子轮";
  const series = text.match(/\bseries\s+([a-z])\b/u)?.[1];
  return series ? `${series.toUpperCase()} 轮` : "";
}

function chinesePurpose(raw = "") {
  const text = stripSourceNoise(raw);
  const purpose = text.match(/\bto\s+(continue\s+building|build|scale|expand|accelerate|support|develop|deliver)\s+([^.;]{12,180})/iu)?.[0] || "";
  if (!purpose) return "";
  const localized = purpose
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
  return countLatinWords(localized) >= 5 && countHan(localized) < 6 ? "" : localized;
}

function chineseInvestorLine(raw = "") {
  const text = stripSourceNoise(raw);
  const led = text.match(/\bled by\s+([^.;]+?)(?:,\s+with participation from\s+([^.;]+))?[.;]?$/iu);
  if (!led) return "";
  return `该轮融资由 ${led[1].trim()} 领投${led[2] ? `，${led[2].trim()} 等参与` : ""}。`;
}

function sourceBackedChineseFact(raw = "", context = {}) {
  const text = stripSourceNoise(raw);
  if (/Mowito has raised a \$3M pre-seed round/iu.test(text)) {
    return "Mowito 宣布完成 300 万美元种子前轮融资，由 Version One Ventures 领投，All In Capital、Unisol、iSeed 和多位天使投资人参投。";
  }
  if (/Mowito-powered robots are already running production lines at a Fortune 500 automotive company/iu.test(text)) {
    return "Mowito 机器人已在一家财富 500 强汽车公司的生产线运行，并服务一家大型电子合同制造商，用于汽车关键部件生产。";
  }
  if (/legacy robotic systems require rigid, hand-coded programming/iu.test(text)) {
    return "原文称传统机器人系统依赖刚性手写程序，设置耗时且在零件或流程变化后容易失效，Mowito 用可从单次演示学习的模型降低重配成本。";
  }
  if (/What began as a platform connecting the world.?s leading AI models has become the foundational infrastructure for the intelligence era/iu.test(text)) {
    return "OpenRouter 称其已从连接主流 AI 模型的平台，演进为面向智能时代的基础设施。";
  }
  if (/Today marks a new milestone for OpenRouter/iu.test(text) && /brand/i.test(text)) {
    return "OpenRouter 将此次品牌焕新定义为新的里程碑，更新覆盖网页、移动端和全线产品体验。";
  }
  if (/The last time search was reinvented, the consumer was a person typing a few words into a box/iu.test(text)) {
    return "上一代网页搜索主要面向在输入框中键入少量关键词的人类用户。";
  }
  if (/Write actions on external sites are screened by classifiers, and purchases or account creations need user approval/iu.test(text)) {
    return "外部网站写入操作会经过分类器筛查，购买或创建账户仍需用户批准。";
  }
  if (/The product generates an entire interactive interface.*(?:a map, a menu, a dynamic dashboard|rather than returning a block of text)/iu.test(text)) {
    return "Monogram 的产品会根据查询生成地图、菜单或动态仪表盘等完整交互界面，而非只返回文本。";
  }
  if (!sourcePointIsUsable(text)) return "";
  if (/[\u4e00-\u9fff]/u.test(text) && !sourcePointLooksTemplate(text)) return text.length > 260 ? `${text.slice(0, 259)}...` : text;
  const company = publicCardCopy(context.company || "") || shortCompany(text.match(/^([A-Z][A-Za-z0-9.&' -]{1,80}?)(?:,|\s+(?:announced|has|raised|raises|secured|secures|launched|launches|released|introduced|collaborates|collaboration))/u)?.[1] || "");
  const owner = company || "原文";
  if (/^Claude Code now has a built-in browser that lets the AI read, click, and type on external websites$/iu.test(text)) {
    return "Claude Code 新增内置浏览器，让 AI 可直接读取、点击并操作外部网页。";
  }
  if (/^Meta removes controversial AI feature on Instagram after backlash$/iu.test(text)) {
    return "Meta 在用户和人才机构反弹后，下线 Instagram 的争议 AI 图片生成功能。";
  }
  if (/^Supermicro Simplifies Edge AI Deployments with Validated Kubernetes Appliances with Red Hat and Everpure/iu.test(text)) {
    return "Supermicro 于 7 月 8 日发布与 Red Hat、Everpure 合作验证的 Kubernetes 边缘 AI 一体机；设备预装软硬件并由 Supermicro 交付客户。";
  }
  if (/Supermicro has validated a full-stack edge Kubernetes solution/iu.test(text)) {
    return "Supermicro 已验证一套全栈边缘 Kubernetes 方案，整合 Red Hat OpenShift 与 Portworx by Everpure 的 AI 工作负载数据管理平台。";
  }
  if (/This turnkey appliance, complete with preloaded software and hardware, is made available to customers through Supermicro/iu.test(text)) {
    return "该一体机预装软硬件，并由 Supermicro 向客户提供交付。";
  }
  if (/By combining Red Hat OpenShift with Supermicro.?s edge computing infrastructure and the Portworx by Everpure data management platform/iu.test(text)) {
    return "该方案把 Red Hat OpenShift、Supermicro 边缘计算基础设施与 Portworx 数据管理平台组合在一起，用于跨分布式边缘环境部署、管理和扩展 AI 应用。";
  }
  if (/Portworx by Everpure provides the Kubernetes-native storage and data management layer for Supermicro.?s Edge AI Appliances/iu.test(text)) {
    return "Portworx 为 Supermicro 边缘 AI 一体机提供 Kubernetes 原生存储与数据管理层，支持在边缘运行 AI 推理、容器和虚拟机。";
  }
  if (/operates autonomously, even during network outages/iu.test(text)) {
    return "其软件定义存储可在网络中断时自主运行，并提供自修复、高可用与数据保护能力。";
  }
  if (/^We(?:'|’)ve raised \$12\.5M to build state-of-the-art Web Search for agents/iu.test(text)) {
    return "Seltz 宣布完成 1250 万美元种子轮融资，用于构建面向 AI 智能体的先进网页搜索系统。";
  }
  if (/Today we(?:'|’)re announcing our \$12\.5 million seed round to rebuild web search for agents/iu.test(text)) {
    return "Seltz 此轮融资由 B Capital 和 Speedinvest 领投，资金将用于重建面向 AI 智能体的网页搜索基础设施。";
  }
  if (/scale to 10s of billions of documents and build the team/iu.test(text)) {
    return "Seltz 计划把索引扩展到数百亿份文档，并扩充团队以服务需要智能体搜索的企业。";
  }
  if (/Seltz answers at 89% accuracy.*under 250 milliseconds/iu.test(text)) {
    return "Seltz 称其动态新闻搜索基准准确率为 89%，响应低于 250 毫秒，比其测试的其他方案快 7 至 30 倍。";
  }
  if (/The round was led by B Capital and Speedinvest/iu.test(text)) {
    return "本轮由 B Capital 和 Speedinvest 领投，多家基金及来自 Google、Ramp、Tako 和 Hugging Face 的个人投资者参投。";
  }
  if (/Today, agents ask a growing share of the internet.?s questions/iu.test(text)) {
    return "Seltz 判断，智能体正在发起越来越多的互联网查询，其检索方式与人类用户明显不同。";
  }
  if (/They write paragraph-long queries and run hundreds in parallel/iu.test(text)) {
    return "智能体会提交段落级查询并同时运行数百次搜索，对吞吐和延迟提出不同要求。";
  }
  if (/Web search for agents isn.?t web search for humans with a different output format/iu.test(text)) {
    return "Seltz 认为，面向智能体的网页搜索需要从索引到返回方式重新设计，而非只更换人类搜索的输出格式。";
  }
  if (/i7 Pro embodied AI robot performing CNC machine loading and unloading tasks/iu.test(text)) {
    return "i7 Pro 具身 AI 机器人已在工业制造设施执行 CNC 机床上下料，并完成机床间导航与高精度定位。";
  }
  if (/announced the first batch delivery of 100 units of its i7 Pro all-scenario robot/iu.test(text)) {
    return "Simplexity Robotics 宣布首批交付 100 台 i7 Pro 全场景机器人，并建成 CNC 智能具身机器人生产线。";
  }
  if (/transition from laboratory validation to multi-site industrial deployment/iu.test(text)) {
    return "Simplexity Robotics 表示，该项目已从实验室验证转入多地点工业部署。";
  }
  if (/The 100 units were distributed across multiple deployment environments rather than delivered to a single customer/iu.test(text)) {
    return "这 100 台机器人被分配到多个部署环境，而非交付给单一客户。";
  }
  if (/largest batch serves industrial clients.*Leaderdrive/iu.test(text)) {
    return "最大批次用于 Leaderdrive 等工业客户的机器人核心部件制造与 CNC 作业。";
  }
  if (/New manufacturing lines in Milpitas, California will support an anticipated 7x increase in production of Cerebras CS-3 systems/iu.test(text)) {
    return "Flex 在加州米尔皮塔斯新增制造产线，预计 Cerebras CS-3 系统产量将提升 7 倍。";
  }
  if (/announced an expanded manufacturing partnership to scale production of the Cerebras CS-3/iu.test(text)) {
    return "Flex 与 Cerebras 扩大制造合作，在 Flex 米尔皮塔斯工厂提升 Cerebras CS-3 产量。";
  }
  if (/significant expansion of advanced manufacturing capacity in the United States/iu.test(text)) {
    return "双方称，此次合作将显著扩大美国先进 AI 系统制造产能。";
  }
  if (/Monogram raised a \$40 million seed led by DST Global and Lux Capital to build an AI app that generates full visual interfaces instead of just text/iu.test(text)) {
    return "Monogram 的 4000 万美元种子轮由 DST Global 与 Lux Capital 领投，资金用于构建生成完整视觉交互界面而非只返回文本的 AI 应用。";
  }
  if (/Monogram.*\$40 million seed round co-led by DST Global and Lux Capital/iu.test(text)) {
    return "Monogram 的 4000 万美元种子轮由 DST Global 与 Lux Capital 联合领投。";
  }
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
  const investorLine = context.type === "funding" ? chineseInvestorLine(text) : "";
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
  if (/\bAI personas simulate how customers will react to a product, ad or price before it launches\b/iu.test(text)) {
    return `${owner} 使用 AI 虚拟用户在产品、广告或价格上线前模拟客户反应，目标是补足传统问卷对真实行为预测不足的问题。`;
  }
  if (/\bThe round will fund engineering, deepening the integration across\b/iu.test(text)) {
    return `${owner} 将本轮资金用于工程研发、深化产品整合和欧洲市场扩张，以支持企业把自主 AI 系统投入生产。`;
  }
  if (/\b20,000\+? secret scanning alerts?\b.*\b15,000\+? repositories\b/iu.test(text)) {
    return "GitHub 在 1.5 万多个代码库中发现超过 2 万条秘密扫描告警，并在九个月内清零未处理告警。";
  }
  if (/\bpiloted the Secret Scanning capability\b/iu.test(text)) {
    return "GitHub 在内部试点仍处于开发阶段的 Secret Scanning 能力，用于识别和处置代码库中的秘密泄露风险。";
  }
  if (/\bNine months later, we reached zero open alerts\b/iu.test(text)) {
    return "GitHub 表示，经过九个月的告警分类、责任分配与修复流程建设，未处理告警数量降至零。";
  }
  if (/\bClaude Code now has a built-in browser\b|\bopen, read, and interact with web pages directly inside the development environment\b/iu.test(text)) {
    return "Claude Code 新增内置浏览器，让 AI 可在开发环境中直接打开、读取和操作外部网页；外部写入操作会经过分类器筛查，购买或创建账户仍需用户批准。";
  }
  if (/\bMeta has axed a controversial feature\b|\bremoving the feature\b.*\bno longer available\b/iu.test(text)) {
    return "Meta 下线 Muse Image 中可引用公开 Instagram 账户照片生成图片的功能；公司表示该功能未达到预期，并在用户和人才机构反弹后停止提供。";
  }
  if (/\bannounced the launch of Kubernetes Edge AI appliances\b/iu.test(text)) {
    return "Supermicro 联合 Red Hat 和 Everpure 推出 Kubernetes 边缘 AI 一体机，整合 OpenShift、边缘计算基础设施与面向 AI 工作负载的数据管理能力。";
  }
  const appKernel = text.match(/\bEvery app you build now runs on\s+([A-Za-z0-9.-]+)/iu)?.[1] || "";
  if (appKernel) {
    return `${owner}表示，平台中构建的每个应用现在都运行在 ${appKernel} 上，该内核成为工作区背后的统一智能层。`;
  }
  if (/\bEvery AI request is a spend decision\b/iu.test(text)) {
    return `${owner}将每次 AI 请求视为一次支出决策，并把用量与权限判断放到毫秒级运行时执行。`;
  }
  if (/\bTSK-1 is the Taskade System Kernel\b/iu.test(text) && !/\bcoordinates (?:AI )?models, memory, agents, and workflows\b/iu.test(text)) {
    return "TSK-1 即 Taskade System Kernel；Taskade 用这一命名说明其产品正从单点 AI 助手转向工作区统一运行内核。";
  }
  if (/\bcoordinates (?:AI )?models, memory, agents, and workflows\b/iu.test(text)) {
    return "TSK-1 负责把模型、记忆、Agent 与工作流协调到同一个持续运行的应用或工作区中。";
  }
  if (/\bEvery pricing change was a deployment\b/iu.test(text)) {
    return "原文称，此前每次定价变更都需要一次部署，Stigg 2.0 将计量、权限与定价决策从应用发布流程中解耦。";
  }
  if (/\bturns pricing changes from multi-week engineering projects into configuration changes that take minutes\b/iu.test(text)) {
    return "Stigg 称，外置且可编程的权益层可把持续数周的定价工程项目缩短为数分钟的配置变更。";
  }
  if (/\bAgentic usage demands milliseconds-latency enforcement\b/iu.test(text)) {
    return "原文强调，Agent 用量需要毫秒级权限执行，以便在高成本调用发生前完成判断。";
  }
  if (/\btracked 1,800 pricing changes across 500 companies\b/iu.test(text)) {
    return "Stigg 表示其在 2025 年追踪到 500 家公司发生 1,800 次定价变化，计费正转向 credits、tokens 与结果定价。";
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
  const signalType = context.type || type || "";
  if (!text) return "";
  if (context.strategicInvestment && /\bstrategic investment\b/iu.test(text)) {
    const investor = text.match(/\bstrategic investment from\s+([^.;]+?)(?:\.|$)/iu)?.[1]?.replace(/\s+/gu, " ").trim() || "";
    return `${context.company || "AI 公司"} 获得${investor ? ` ${investor} ` : ""}战略投资。`;
  }
  if (context.strategicInvestment && /\b(?:series\s+[a-z]|funding|financing|total capital|has raised|raised|raises?|led by)\b|[$€£]\s?\d/iu.test(text) && !/\bstrategic investment\b/iu.test(text)) return "";
  if (signalType === "funding" && fundingCompletionAmountMismatch(text, context.sourceAmountMillions)) return "";
  if (signalType === "funding" && fundingCompletionMissingAmount(text, context.sourceAmountMillions)) return "";
  if (/[\u4e00-\u9fff]/u.test(text)) return text.length > 220 ? `${text.slice(0, 219)}...` : text;
  if (signalType === "funding") {
    const amount = extractAmount(text);
    const company = shortCompany(text.match(/^([A-Z][A-Za-z0-9.&' -]{1,70}?)(?:,|\s+has\s+raised|\s+raises|\s+landed|\s+lands|\s+secured|\s+secures)/u)?.[1] || "");
    const round = text.match(/\b(pre-seed|seed|series\s+[A-Z])\b/iu)?.[0] || "";
    const publicAmount = chineseAmount(amount) || amount;
    const publicRound = chineseRound(round) || round;
    if (amount && company && !isWeakCompanyName(company)) {
      const expectedCompany = normalizedSignalText(context.company || "");
      const actualCompany = normalizedSignalText(company);
      const pointText = normalizedSignalText(text);
      if (
        expectedCompany
        && actualCompany
        && !expectedCompany.includes(actualCompany)
        && !actualCompany.includes(expectedCompany)
        && !pointText.includes(expectedCompany)
      ) return "";
      return `${context.company || company} 获得 ${publicAmount}${publicRound ? ` ${publicRound}` : ""}融资。`;
    }
    if (/\brival\b/iu.test(text)) return "";
    if (amount && /\b(?:raises?|raised|has raised|funding|financing|pre-seed|seed|series\s+[a-z])\b/iu.test(text)) {
      const expectedCompany = normalizedSignalText(context.company || "");
      const pointText = normalizedSignalText(text);
      if (expectedCompany && pointText.includes(expectedCompany)) {
        return `${context.company} 获得 ${publicAmount}${publicRound ? ` ${publicRound}` : ""}融资。`;
      }
      return "";
    }
  }
  if (/\b(designed to take action|automatically execute tasks|updates? records|generating follow-up actions|identifying deal risks|coordinating workflows|customer deployment|case study)\b/iu.test(text)) {
    return "原文描述产品把会议、邮件、工单、CRM 或业务数据转为可执行动作。";
  }
  return sourceBackedChineseFact(text, context);
}

function sourcePointsFromSection(section) {
  const raw = readRawJson(section);
  const sourceTitle = originalSourceTitleFromSection(section);
  const context = {
    company: companyFromSection(section),
    scenario: scenarioFromText(textForInference(section)),
    type: inferSignalType(section),
    strategicInvestment: isConfirmedStrategicInvestment(section, sourceTitle),
    sourceAmountMillions: fundingAmountMillions(sourceTitle),
  };
  const keyExcerpts = Array.isArray(raw.key_excerpts)
    ? raw.key_excerpts
    : parseJsonValue(section, "key_excerpts", []);
  const evidenceSeed = raw.evidence_seed || parseJsonValue(section, "evidence_seed", {});
  const translatedFacts = Array.isArray(raw.fact_translation_zh) ? raw.fact_translation_zh : [];
  const seedItems = [
    ...(Array.isArray(evidenceSeed.company_actions) ? evidenceSeed.company_actions : []),
    ...(Array.isArray(evidenceSeed.case_details) ? evidenceSeed.case_details : []),
    ...(Array.isArray(evidenceSeed.workflow_changes) ? evidenceSeed.workflow_changes : []),
    ...(Array.isArray(evidenceSeed.risks_or_constraints) ? evidenceSeed.risks_or_constraints : []),
  ];
  const excerptItems = Array.isArray(keyExcerpts)
    ? keyExcerpts.flatMap((item) => sourceSentences(item?.text || "").map((text) => ({ text, type: item?.type || "" })))
    : [];
  const titleFact = sourceTitleFactFromSection(section);
  const normalizedTitleFact = sourceBackedChineseFact(sourceTitle, context);
  const fromExcerpts = excerptItems.map((item) => translatedSourcePoint(item.text, item.type, context)).filter(sourcePointReadyForPublic);
  const fromClauses = [
    ...keyExcerpts.flatMap((item) => sourceDetailClauses(item?.text || "")),
    ...sourceDetailClauses(raw.full_text || raw.clean_text || ""),
  ].map((item) => translatedSourcePoint(item, "", context)).filter(sourcePointReadyForPublic);
  const fromSeed = seedItems.map((item) => translatedSourcePoint(item, "", context)).filter(sourcePointReadyForPublic);
  const fromFullText = sourceSentences(raw.full_text || raw.clean_text || "")
    .map((item) => translatedSourcePoint(item, "", context))
    .filter(sourcePointReadyForPublic);
  const fromTranslatedFacts = translatedFacts
    .map((item) => translatedSourcePoint(item, context.type, context))
    .filter(sourcePointReadyForPublic);
  const bodyFacts = [...fromTranslatedFacts, ...fromExcerpts, ...fromClauses, ...fromSeed, ...fromFullText]
    .filter((item) => !isSameSourcePoint(item, normalizedTitleFact) && !isSameSourcePoint(item, titleFact));
  const substantive = [...new Set([...bodyFacts, normalizedTitleFact].filter(sourcePointReadyForPublic))];
  return [...substantive, ...(titleFact ? [titleFact] : [])].slice(0, 6);
}

function sourceExcerptFromSection(section, points = []) {
  const raw = readRawJson(section);
  const sourceTitle = originalSourceTitleFromSection(section);
  const context = {
    company: companyFromSection(section),
    scenario: scenarioFromText(textForInference(section)),
    type: inferSignalType(section),
    strategicInvestment: isConfirmedStrategicInvestment(section, sourceTitle),
    sourceAmountMillions: fundingAmountMillions(sourceTitle),
  };
  const firstRaw = sourceSentences(raw.full_text || raw.clean_text || "")
    .map((item) => translatedSourcePoint(item, "", context))
    .find(sourcePointReadyForPublic);
  return points.find(sourcePointReadyForPublic) || firstRaw || sourceTitleFactFromSection(section) || "";
}

function rawVisibleExcerptFromSection(section, excluded = []) {
  const raw = readRawJson(section);
  const excludedKeys = excluded.map(normalizedSignalText).filter(Boolean);
  const isTooSimilar = (item) => {
    const normalized = normalizedSignalText(item);
    return excludedKeys.some((excludedKey) => {
      if (normalized === excludedKey) return true;
      const shorter = normalized.length <= excludedKey.length ? normalized : excludedKey;
      const longer = normalized.length > excludedKey.length ? normalized : excludedKey;
      if (shorter.length >= 48 && longer.includes(shorter)) return true;
      const prefixLength = Math.min(90, normalized.length, excludedKey.length);
      return prefixLength >= 48 && normalized.slice(0, prefixLength) === excludedKey.slice(0, prefixLength);
    });
  };
  const rawExcerpts = Array.isArray(raw.key_excerpts)
    ? raw.key_excerpts.map((item) => stripSourceNoise(item?.text || ""))
    : [];
  const candidates = [
    ...rawExcerpts,
    ...sourceSentences(raw.full_text || raw.clean_text || ""),
    ...rawExcerpts.flatMap(sourceDetailClauses),
    ...sourceDetailClauses(raw.full_text || raw.clean_text || ""),
  ]
    .map((item) => String(item || "").replace(/\s+/gu, " ").trim())
    .filter((item) => item.length >= 36 && item.length <= 420)
    .filter((item) => !/Bounded direct-source recall|QC-reviewed original evidence|raw_entry_reason|curated_original_source/iu.test(item))
    .filter((item) => !hasTextContamination(item))
    .filter((item) => !sourcePointLooksPageChrome(item))
    .filter((item) => !sourcePointLooksSplitFragment(item))
    .filter((item) => !isTooSimilar(item));
  const sourceTitle = originalSourceTitleFromSection(section);
  return candidates[0] || (sourceTitle && !isTooSimilar(sourceTitle) ? sourceTitle : "");
}

function localizedRawSourcePointsFromSection(section, context = {}, excluded = []) {
  const raw = readRawJson(section);
  const rawExcerpts = Array.isArray(raw.key_excerpts)
    ? raw.key_excerpts.map((item) => stripSourceNoise(item?.text || ""))
    : [];
  const candidates = [
    ...rawExcerpts.flatMap(sourceDetailClauses),
    ...sourceDetailClauses(raw.full_text || raw.clean_text || ""),
    ...rawExcerpts,
    ...sourceSentences(raw.full_text || raw.clean_text || "", 80),
  ]
    .map((item) => sourceBackedChineseFact(item, context))
    .filter(sourcePointReadyForPublic)
    .filter((item) => !excluded.some((excludedItem) => isSameSourcePoint(item, excludedItem)));
  return [...new Set(candidates)].slice(0, 4);
}

function generatedCommercialValue(spec) {
  const company = spec.company || "该公司";
  if (spec.type === "funding") {
    const purpose = String(spec.title || "").match(/，用于\s*(.+)$/u)?.[1]?.trim() || "";
    if (purpose) return `${company} 将本轮资金投入${/^[A-Za-z0-9]/u.test(purpose) ? " " : ""}${purpose}。`;
    return `${company} 的资本事件显示，资金正在流向可形成产品、产能或客户交付能力的 AI 商业基础设施。`;
  }
  if (spec.type === "product_service") return `${company} 的产品动作体现了 AI 能力从技术展示走向可调用、可部署或可采购的服务形态。`;
  return `${company} 的案例为企业评估 AI 在真实流程中的部署方式、成本边界和结果指标提供了可核查样本。`;
}

function isSameSourcePoint(a = "", b = "") {
  const normalize = (value) => normalizedSignalText(String(value || "").replace(/原始来源标题显示：|原文称[，,:]?|原文描述[，,:]?/gu, ""));
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const shorter = left.length <= right.length ? left : right;
  const longer = left.length > right.length ? left : right;
  if (shorter.length >= 48 && longer.includes(shorter)) return true;
  const prefixLength = Math.min(90, left.length, right.length);
  return prefixLength >= 48 && left.slice(0, prefixLength) === right.slice(0, prefixLength);
}

function cardDetailsTooSimilar(a = "", b = "") {
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/原文称，|原始来源标题显示：/gu, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const shorter = left.length <= right.length ? left : right;
  const longer = left.length > right.length ? left : right;
  if (shorter.length >= 48 && longer.includes(shorter)) return true;
  const prefixLength = Math.min(90, left.length, right.length);
  return prefixLength >= 48 && left.slice(0, prefixLength) === right.slice(0, prefixLength);
}

function generatedValueSummary(spec, section) {
  return spec.sourceExcerpt || spec.eventLine || sourceExcerptFromSection(section, spec.sourcePoints || []) || "";
}

function cleanEvidenceBoundary(value = "") {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (!text || /^(?:none|n\/a|无)$/iu.test(text)) return "证据边界：本卡只使用已保留的 Raw / Pool 原文标题、摘录和来源链接。";
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

function fundingCompanyFromTitle(title = "") {
  const text = cleanSourceEventTitle(title);
  const patterns = [
    /^([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})['’]s\b/u,
    /^([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:used|uses|announced|launches)\b/u,
    /^(.+?)\s+(?:raises?|raised|secures?|secured|closes?|closed|lands?|landed|nabs?|nabbed)\b/iu,
  ];
  for (const pattern of patterns) {
    const company = shortCompany(text.match(pattern)?.[1] || "");
    if (company && !isWeakCompanyName(company)) return company;
  }
  return "";
}

function fundingRoundIdentity(value = "") {
  const text = String(value || "");
  const series = text.match(/\bseries\s+([a-z])\b/iu)?.[1];
  if (series) return `series-${series.toLowerCase()}`;
  if (/\bpre[-\s]?seed\b/iu.test(text)) return "pre-seed";
  if (/\bseed\b|种子轮/iu.test(text)) return "seed";
  if (/\bstrategic investment\b|战略投资/iu.test(text)) return "strategic";
  return "";
}

function fundingEventIdentityKey(company = "", evidence = "") {
  const text = String(evidence || "");
  const sourceCompany = fundingCompanyFromTitle(text);
  const normalizedCompany = normalizedSignalText(sourceCompany || company).replace(/\s+ai$/u, "").trim();
  const amountMillions = fundingAmountMillions(text);
  const round = fundingRoundIdentity(text);
  if (!normalizedCompany || !Number.isFinite(amountMillions) || !round) return "";
  return `funding-event:${normalizedCompany}:${Number(amountMillions.toFixed(3))}:${round}`;
}

function fundingEventIdentityKeyForSection(section) {
  return fundingEventIdentityKey(
    companyFromSection(section),
    `${originalSourceTitleFromSection(section)} ${poolTitle(section)} ${value(section, "key_excerpts")} ${value(section, "evidence_seed")}`,
  );
}

function unconfirmedFundingEventKeysForSections(sections) {
  return new Set(
    [...sections.values()]
      .filter(isUnconfirmedFundingProcess)
      .map(fundingEventIdentityKeyForSection)
      .filter(Boolean),
  );
}

function historicalFundingEventIndex() {
  const index = new Map();
  for (const file of signalCardFiles()) {
    const cardDate = path.basename(file).match(/^(\d{4}-\d{2}-\d{2})--signal--/u)?.[1] || "";
    if (!cardDate || cardDate === date) continue;
    const text = fs.readFileSync(file, "utf8");
    if (yamlValue(text, "signal_type") !== "funding") continue;
    const sourceTitle = yamlValue(text, "source_title");
    const title = yamlValue(text, "title");
    const key = fundingEventIdentityKey(yamlValue(text, "signal_owner"), `${sourceTitle} ${title} ${text}`);
    if (!key || index.has(key)) continue;
    index.set(key, {
      date: cardDate,
      file: path.relative(root, file).replace(/\\/g, "/"),
      title,
    });
  }
  return index;
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
const discoveryOnlyPattern = /\b(aihot|ai hot|hacker news|reddit|hn|linkedin|twitter|x\.com|duckduckgo|bing|tavily|exa|anysearch|gdelt|discovery[_\s-]*source)\b/iu;
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

function hasChineseFactMaterial(section) {
  const raw = readRawJson(section);
  const translatedFacts = Array.isArray(raw.fact_translation_zh) ? raw.fact_translation_zh : [];
  if (translatedFacts.some((item) => countHan(item) >= 12 && sourcePointIsUsable(item))) return true;
  const excerpts = Array.isArray(raw.key_excerpts) ? raw.key_excerpts : [];
  if (excerpts.some((item) => countHan(item?.text || "") >= 18 && sourcePointIsUsable(item?.text || ""))) return true;
  const normalizedTitleFact = sourceBackedChineseFact(originalSourceTitleFromSection(section), {
    company: companyFromSection(section),
    type: inferSignalType(section),
  });
  if (countHan(normalizedTitleFact) >= 12 && sourcePointIsUsable(normalizedTitleFact)) return true;
  const context = {
    company: companyFromSection(section),
    scenario: scenarioFromText(textForInference(section)),
    type: inferSignalType(section),
    strategicInvestment: isConfirmedStrategicInvestment(section, originalSourceTitleFromSection(section)),
    sourceAmountMillions: fundingAmountMillions(originalSourceTitleFromSection(section)),
  };
  const evidenceSeed = raw.evidence_seed || parseJsonValue(section, "evidence_seed", {});
  const seedItems = [
    ...(Array.isArray(evidenceSeed.company_actions) ? evidenceSeed.company_actions : []),
    ...(Array.isArray(evidenceSeed.case_details) ? evidenceSeed.case_details : []),
    ...(Array.isArray(evidenceSeed.workflow_changes) ? evidenceSeed.workflow_changes : []),
    ...(Array.isArray(evidenceSeed.risks_or_constraints) ? evidenceSeed.risks_or_constraints : []),
  ];
  const normalizedEvidenceFacts = [
    ...excerpts.map((item) => item?.text || ""),
    ...seedItems,
    ...sourceSentences(raw.full_text || raw.clean_text || "", 24),
  ]
    .map((item) => translatedSourcePoint(item, context.type, context) || sourceBackedChineseFact(item, context))
    .filter(sourcePointIsUsable);
  if (normalizedEvidenceFacts.some((item) => countHan(item) >= 12)) return true;
  if (sectionHasUsableEvidenceObject(section) && hasFormalCardEvent(section)) return true;
  // Raw ingestion persists exact title translation, while Card ingestion owns
  // source-backed fact normalization. Do not require a second pre-populated Raw
  // translation field when this generator can already produce usable Chinese
  // facts from the captured source evidence.
  return sourcePointsFromSection(section)
    .some((item) => countHan(item) >= 12 && sourcePointIsUsable(item));
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
  if (strength === "traceable_summary") return hasCardableEvent ? "missing_source_material" : "summary_without_formal_event";
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
  const text = String(value || "").slice(0, 4000);
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})(?:T|\b)/u);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  const match = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})\b/iu);
  if (!match) return null;
  const month = monthNames.get(match[1].toLowerCase());
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
}

function publicationDateFromRawData(rawData = {}, sourceUrl = "") {
  return dateFromUrl(rawData.canonical_url || rawData.original_url || sourceUrl)
    || dateFromText(rawData.full_text || rawData.clean_text || "")
    || parsePublicationDate(rawData.published_at);
}

function rawPublicationDate(section) {
  const rawJsonPath = value(section, "raw_json");
  const sourceUrl = value(section, "source_url");
  if (rawJsonPath) {
    try {
      const rawPath = path.resolve(root, rawJsonPath.replace(/^`|`$/gu, ""));
      const rawData = JSON.parse(fs.readFileSync(rawPath, "utf8"));
      const rawDate = publicationDateFromRawData(rawData, sourceUrl);
      if (rawDate) return rawDate;
    } catch {
      // Fall through to URL-only parsing below.
    }
  }
  return dateFromUrl(sourceUrl)
    || dateFromText(`${value(section, "key_excerpts")} ${value(section, "evidence_seed")}`);
}

function isStalePublication(section, maxAgeDays = 30) {
  const published = rawPublicationDate(section);
  if (!published) return false;
  const runDate = new Date(`${date}T12:00:00Z`);
  const ageMs = runDate.getTime() - published.getTime();
  return ageMs > maxAgeDays * 24 * 60 * 60 * 1000;
}

function cardFreshnessDays(section) {
  const importanceType = value(section, "importance_type");
  if (importanceType === "important_funding") return 30;
  if (importanceType === "important_market_structure") return 14;
  if (hasConcreteProductEvent(section)) return 14;
  if (hasConcreteCaseEvent(section)) return 30;
  return 14;
}

function isCompanyProfileWithoutDatedEvent(section) {
  return /ycombinator\.com\/companies\//iu.test(value(section, "source_url")) && !rawPublicationDate(section);
}

function isExplainerWithoutCommercialEvent(section) {
  const identity = [poolTitle(section), value(section, "source"), value(section, "source_url")].join(" ");
  const explainer = /\b(staffer maps out|employee explains?|which .{0,80} fits|reasoning levels? fits|guide to|how to choose)\b|员工详解|员工解释|适用场景|如何选择|指南|教程/iu.test(identity);
  const datedAction = /\b(launch(?:es|ed)?|release(?:s|d)?|introduc(?:es|ed)?|announc(?:e|es|ed|ing)|available now|general availability|acquires?|lawsuit|settlement|raises?|funding)\b|发布|推出|上线|收购|诉讼|和解|融资/iu.test(identity);
  return explainer && !datedAction;
}

function isResearchPrototypeWithoutCommercialEvent(section) {
  const text = sectionEvidenceText(section);
  const researchPrototype = /\b(IEEE|JSAP|researchers?|university|prototype|theoretical peak|paper|peer review|formal verification|mathematical proof|theorem|conjecture)\b|联合研发|研究团队|理论峰值|研讨会|论文|同行评审|形式化验证|数学证明|图论|猜想|定理/iu.test(text);
  const commercialEvent = /\b(generally available|available now|commercial launch|customer deployment|procurement|contract|funding|raises?|acquires?)\b|正式可用|商业发布|客户部署|采购|合同|融资|收购/iu.test(text);
  return researchPrototype && !commercialEvent;
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
  if (/yc\.com\/companies\/industry|startuply\.vc\/startup\/|trysignalbase\.com\/news\/funding|\/research\/enterprise-ai-agent|data-room\/ycombinator|\.pdf(?:$|[?#])|docs\.github\.com|dev\.to|aws marketplace:|docs\.aws\.com\/marketplace|pypi|\/packages?\//iu.test(urlSource)) {
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

function hasDirectAiEventAnchor(section) {
  const raw = readRawJson(section);
  const eventText = [
    poolTitle(section),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
    raw.title || "",
    raw.full_text || raw.clean_text || "",
  ].join(" ");
  return /\b(?:AI|artificial intelligence|agentic|AI agents?|LLMs?|large language models?|machine learning|Claude|ChatGPT|GPT-\d|Gemini|Copilot|Muse Image|Fable|Kimi|FSD|Cybercab|Robotaxi|inference)\b|人工智能|智能体|大模型|机器学习|生成式 AI|算力芯片|AI 芯片/iu.test(eventText);
}

function hasConcreteFundingEvent(section) {
  return isSingleCompanyFundingSignal(section);
}

function isViewpointWithoutConfirmedCommercialEvent(section) {
  const title = poolTitle(section);
  const viewpoint = /(?:谈|发文称|认为|表示|观点|解读|批评|质疑|警告|呼吁|预测).{0,80}(?:AI|智能体|模型|产品|市场|公司)|(?:CEO|创始人|总裁).{0,40}(?:称|谈|认为|表示|批评|质疑|警告|呼吁|预测)/u.test(title);
  const routedViewpoint = /\bviewpoint\b/iu.test(value(section, "usable_for"))
    && value(section, "event_evidence") !== "true";
  const confirmedInTitle = /(?:正式)?(?:发布|推出|上线|开放|定价|签约|部署|收购|完成融资)/u.test(title);
  return (viewpoint || routedViewpoint) && !confirmedInTitle;
}

function isUnconfirmedProductRumorOrPlan(section) {
  const title = poolTitle(section);
  const rumorIdentity = /(?:消息称|据悉|据称|传闻|爆料|曝出|泄露)|(?:或将|有望|暂定|计划|正开发|正在考虑)/u.test(title);
  const confirmedInTitle = /(?:正式)?(?:发布|推出|上线|开放|定价|签约|部署)/u.test(title)
    && !/(?:将|拟|计划|有望|或将).{0,12}(?:发布|推出|上线|开放)/u.test(title);
  return rumorIdentity && !confirmedInTitle;
}

function isSecondaryProductReviewOrRumor(section) {
  const title = poolTitle(section);
  const text = sectionEvidenceText(section);
  const sourceUrl = value(section, "source_url");
  const primarySource = /\b(?:apple\.com|meta\.com|honor\.com|hihonor\.com|doubao\.com|bytedance\.com|step|openrouter\.ai)\b/iu.test(sourceUrl);
  const firstPersonReview = /\b(?:hands?-on|review|preview|already changing how I use|how I use my|testing the new operating system)\b/iu.test(`${title} ${text}`);
  const recommendationCoverage = /(?:\u5927V\u63a8\u8350|\u63a8\u8350.{0,24}(?:\u516c\u6d4b|\u6d4b\u8bd5\u7248)|MKBHD|Joanna Stern|Cult of Mac)/iu.test(`${title} ${text}`);
  const rumorCoverage = /(?:\u7206\u6599|\u66dd\u5149|\u636e\u79f0|\u4f20\u95fb|\u6cc4\u9732|\u4e1a\u5185\u4eba\u58eb\u79f0|\u7f51\u53cb.{0,20}\u8ba8\u8bba)/iu.test(`${title} ${text}`);
  const recruitmentFromFeedback = /(?:\u5f00\u542f\u62db\u52df|\u8bd5\u7528).{0,60}(?:\u7528\u6237\u53cd\u9988|\u6682\u4ec5\u652f\u6301|\u4f4e\u4e8e)/iu.test(`${title} ${text}`);
  const confirmedOfficialLaunch = primarySource && /\b(?:launch(?:es|ed)?|announc(?:es|ed|ing)?|release(?:s|d)?|available now|general availability)\b|(?:\u6b63\u5f0f)?(?:\u53d1\u5e03|\u63a8\u51fa|\u4e0a\u7ebf|\u5f00\u653e|\u4e0a\u5e02)/iu.test(title);
  return (firstPersonReview || recommendationCoverage || rumorCoverage || recruitmentFromFeedback) && !confirmedOfficialLaunch;
}

function isConsumerUiPersonalizationWithoutBusinessAi(section) {
  const title = poolTitle(section);
  return /(?:ColorOS|OPPO).{0,40}(?:\u9501\u5c4f\u6307\u7eb9\u6837\u5f0f|\u81ea\u5b9a\u4e49)|lock\s*screen.{0,40}fingerprint.{0,24}(?:style|custom)/iu.test(title);
}

function isSpecOnlyHardwareNewsWithoutCommercialDeployment(section) {
  const identity = [poolTitle(section), value(section, "source_url"), value(section, "evidence_seed")].join(" ");
  const specOnlyHardware = /\bStarfire\b.{0,80}\bPanther Lake\b|\bPanther Lake\b.{0,80}\bStarfire\b|(?:\u592a\u7a7a\u7ea7|\u6781\u7aef\u73af\u5883).{0,24}\u82af\u7247/iu.test(identity);
  return specOnlyHardware && !hasNamedCommercialDeploymentEvidence(section) && !hasStrictMarketStructureEvent(section);
}

function isTradeSecretLawsuitWithoutCommercialEvent(section) {
  const text = commercialEvidenceText(section);
  const tradeSecretLawsuit = /\b(?:sues?|lawsuit|trade secrets?|ex-engineer|former employee|poached employee|stolen confidential|steal trade secrets)\b|\u8d77\u8bc9|\u5546\u4e1a\u673a\u5bc6|\u524d\u5de5\u7a0b\u5e08/iu.test(text);
  const separateCommercialEvent = hasConcreteFundingEvent(section)
    || /\b(?:settlement|procurement contract|contract awarded|pricing|billing change|acquisition|product launch|customer deployment)\b/iu.test(text);
  return tradeSecretLawsuit && !separateCommercialEvent;
}

function isUnconfirmedFundingProcess(section) {
  const text = [
    originalSourceTitleFromSection(section),
    poolTitle(section),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  return /\b(?:help(?:ed|ing)?\s+(?:to\s+)?raise|ran\s+(?:its\s+)?own\s+.{0,40}fundraise|still\s+coming\s+together|on\s+track\s+rather\s+than\s+closed|not\s+yet\s+(?:closed|confirmed)|expects?\s+to\s+close|would\s+value\s+the\s+company)\b|(?:融资|轮次).{0,30}(?:仍在推进|尚未完成|尚未关闭|尚未确认)/iu.test(text);
}

function hasConcreteProductEvent(section) {
  const text = sectionEvidenceText(section);
  const sourceIdentity = [poolTitle(section), value(section, "source"), value(section, "source_url")].join(" ");
  if (isWorkforceRetrainingProgram(section)) return false;
  if (isNewsletterRoundupSource(section)) return false;
  if (isViewpointWithoutConfirmedCommercialEvent(section) || isUnconfirmedProductRumorOrPlan(section)) return false;
  if (/\b(shuts? down|discontinues?|kills?|removes?|removed|axes?|axed|withdraws?|pulls? .{0,30}(?:feature|product)|folds? .{0,60} into)\b|关停|下线|移除|并入/iu.test(sourceIdentity)) return true;
  return /\b(launch(?:es|ed)?|release(?:s|d)?|introduc(?:es|ed)?|announc(?:e|es|ed|ing)|now has a built-in|general availability|GA|new API|new SDK|new platform|new product|pricing|available now|shuts? down|discontinues?|kills?|folds? .{0,60} into)\b|发布|推出|上线|新增|正式可用|开放|定价|关停|下线|并入/iu.test(text)
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
  const sourceIdentity = [poolTitle(section), value(section, "source"), value(section, "source_url")].join(" ");
  const commentaryOnly = /\b(opinion|analysis|analyst|market map|roundup|guide|tutorial|what is|why we built)\b|观点|评论|研报|指南|教程|清单|榜单/iu.test(sourceIdentity);
  return action && businessAiContext && !commentaryOnly;
}

function hasFormalCardEvent(section) {
  const importanceType = value(section, "importance_type");
  if (importanceType === "important_funding") return hasConcreteFundingEvent(section);
  if (importanceType === "important_product_or_service") {
    return hasConcreteProductEvent(section) || hasConcreteCaseEvent(section) || hasNamedCommercialDeploymentEvidence(section);
  }
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
  return /\b(customer story|case study|customer deployment|customer adopts?|adopted by|deployed (?:at|by|with)|used by|uses? (?:Amazon Bedrock|Claude|Glean|AI|agentic AI|machine learning)|serv(?:es|ing) more than a third of the top 50 asset managers|tier-1 investment banks?|largest investment banking, private equity, and credit customers|customers make decisions based on analyses|one of (?:the )?.{0,40}\b(?:bank|hospital|retailer|manufacturer|insurer|pharma|law firm)s?\b|paid enterprise|annual recurring revenue|ARR|saved \d|reduced \d|cut \d|Bristol Myers|Navien|Aon|7-Eleven|Morgan Stanley|Pooldoktor|Yp[eê]|Linkup)\b/iu.test(text);
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
    || /\b(benchmark|benchmarks|bench|evaluation|evals?|leaderboard|paper|research|technical report|dataset|arxiv|openreview|ACL|NeurIPS|ICML|ICLR|DiscoBench|OCR|OmniDocBench|retrieval benchmark)\b|内部评估|内部测试|评估套件|研究人员|研究结果|研究论文|基准测试|后训练方案/iu.test(text);
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
  if (/(?:招聘|招募|诚聘).{0,24}(?:产品经理|工程师|经理|总监|负责人|岗位|职位|人才|员工)|(?:产品经理|工程师|岗位|职位).{0,24}(?:招聘|招募|诚聘)/u.test(titleUrl)) {
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
  const title = poolTitle(section);
  const factualText = text.replace(/"type"\s*:\s*"[^"]*"/giu, " ");
  const interpersonalDispute = /隔空.{0,16}(?:掐架|争论|互怼)|口水战|骂战|转发.{0,24}(?:帖文|截图).{0,40}(?:指责|嘲讽|诈骗)|(?:CEO|创始人).{0,24}(?:指责|嘲讽|互怼)/iu.test(factualText);
  const separateCommercialEvent = /融资|收购|并购|客户部署|生产部署|采购|合同|签约|定价|正式发布.{0,24}(?:产品|平台|API|SDK)|funding|raises?|acquisition|customer deployment|production rollout|procurement|contract|pricing|commercial launch/iu.test(factualText);
  if (interpersonalDispute && !separateCommercialEvent) return true;
  if (/程序员如何避免被\s*LLM|进化是关键|AI\s*需求依然强劲|芯片板块波动|industry executives?.{0,40}AI demand|AI demand remains strong/iu.test(title)) return true;
  if (/(?:暂时|临时|多项更新.{0,12}).{0,24}(?:取消|移除).{0,24}(?:小时|使用|速率).{0,16}限制|usage reset|(?:temporarily )?(?:removed?|lifted?).{0,20}(?:5-hour|usage|rate) limit/iu.test(title)) return true;
  if (/Steam|策略模拟游戏|独立\s*AI\s*游戏|未经同意.{0,30}(?:AI\s*照片|生成)|Muse Image.{0,40}Instagram/iu.test(title)) return true;
  if (/monthly update|roundup|latest AI news|recap of .*AI updates|Google 2026.*AI.*updates?|Google 2026.*AI.*更新|AI更新汇总|更新汇总/iu.test(text)) return true;
  if (/AI\s*存储蓝图|存储蓝图|大规模\s*AI\s*存储|large-scale AI storage|storage blueprint|architecture blueprint|technical blueprint/iu.test(text)
    && !/customer deployment|procurement|contract|pricing|funding|commercial launch/iu.test(text)) return true;
  if (/brain2qwerty|brain-to-text|brain interface|non-invasive brain/iu.test(text)
    && !/enterprise deployment|customer deployment|procurement|contract|funding|commercial launch/iu.test(text)) return true;
  if (/storage blueprint|architecture blueprint|technical blueprint/iu.test(text)
    && !/customer deployment|procurement|contract|pricing|funding|commercial launch/iu.test(text)) return true;
  if (/Workbench Notebooks|GLM Coding Pro|Coding Pro|ZCode|VS Code|Jupyter|coding assistant|developer environment/iu.test(text)
    && !/enterprise deployment|customer deployment|case study|procurement|contract|pricing|funding|annual recurring revenue|ARR/iu.test(text)) return true;
  if (/\b(brand refresh|new look|visual identity|logo refresh|bauhaus|brand design)\b|品牌焕新|品牌视觉|视觉标识|包豪斯/iu.test(text)
    && !/customer deployment|production rollout|procurement|contract|pricing|raises?|raised|financing round|commercial launch|new paid product|enterprise deployment|客户部署|客户案例|生产部署|采购|合同|定价|完成.{0,12}融资|获得.{0,12}融资|商业发布/iu.test(text)) return true;
  if (/\bgithub\.com\/[^/]+\/[^/]+\/releases\/tag\/v?\d+\.\d+\.\d+\b|\brelease notes?\b|v\d+\.\d+\.\d+\s*发布/iu.test(text)
    && !/customer deployment|case study|procurement|contract|pricing|raises?|raised|financing round|annual recurring revenue|ARR|commercial launch|new paid product|enterprise deployment|客户部署|客户案例|生产部署|采购|合同|定价|完成.{0,12}融资|获得.{0,12}融资|商业发布/iu.test(text)) return true;
  if (/\b(deploys?|deployment|deployed|rollout|production rollout|case study|customer story|customer deployment|uses? (?:Amazon Bedrock|Claude|Glean|AI|agentic AI|machine learning)|saved \d|reduced|cut|hours per person|ARR|annual recurring revenue|acquires?|acquisition|to buy|strategic partnership|partners? with|collaborates? with|pricing|billing|monetization gateway|contract|procurement)\b/iu.test(text)) return false;
  const consumerEntertainment = /Just Dance|舞力全开|mobile game|手游|游戏快报|玩家|曲库|K-POP|音舞|体感音乐|育碧|腾讯游戏|Steam|策略模拟游戏|独立\s*AI\s*游戏/iu.test(text);
  const minorPlatformPolicy = /肖像保护|仿冒带货|带货达人|达人账号|素材盗用|侵权账号|侵权内容|平台治理|内容安全|相似内容阻断|举报|处置侵权|未经同意.{0,30}(?:AI\s*照片|生成)|Muse Image.{0,40}Instagram/iu.test(text);
  const roundupOrExplainer = /更新汇总|月度更新|latest AI news|monthly update|roundup|weekly digest|why we built|我们为何构建/iu.test(text);
  const marketCommentary = /瑞银|UBS|分析师|研报|调研|spending|budget|cost concern|analyst/iu.test(text)
    && /开支|支出|成本|预算|ROI|回报|受益|承压|spending|budget|cost|concern|benefit|pressure|analyst/iu.test(text);
  const ventureFormation = /离开.*VC基金|创办.*VC基金|launch new VC firm|start a separate VC fund|new VC fund/iu.test(text)
    && !/raises|raised|closed|closes|fund size|\$\s?\d|完成.*募资|基金规模/iu.test(text);
  const businessAiSignal = /enterprise|B2B|customer deployment|production rollout|procurement|workflow|case study|SaaS|API|SDK|developer platform|paid enterprise|企业|客户|部署|采购|工作流|生产环境|融资|收购|合作伙伴|营收|合同|招标/iu.test(text);
  return ((consumerEntertainment || minorPlatformPolicy) && !businessAiSignal) || roundupOrExplainer || marketCommentary || ventureFormation;
}

function isExecutiveDisputeWithoutCommercialEvent(section) {
  const text = textForInference(section).replace(/"type"\s*:\s*"[^"]*"/giu, " ");
  const dispute = /隔空.{0,16}(?:掐架|争论|互怼)|口水战|骂战|转发.{0,24}(?:帖文|截图).{0,40}(?:指责|嘲讽|诈骗)|(?:CEO|创始人).{0,24}(?:指责|嘲讽|互怼)/iu.test(text);
  const separateCommercialEvent = /融资|收购|并购|客户部署|生产部署|采购|合同|签约|定价|正式发布.{0,24}(?:产品|平台|API|SDK)|funding|raises?|acquisition|customer deployment|production rollout|procurement|contract|pricing|commercial launch/iu.test(text);
  return dispute && !separateCommercialEvent;
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
  if (!rawPublicationDate(section)) issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "missing_source_date"));
  else if (isStalePublication(section, cardFreshnessDays(section))) issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "stale_source_date"));
  if (sourceTitleNeedsChineseTranslation(originalSourceTitleFromSection(section)) && !hasChineseFactMaterial(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "missing_chinese_fact_translation"));
  }
  if (isCompanyProfileWithoutDatedEvent(section)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "company_profile_without_dated_event"));
  if (isExplainerWithoutCommercialEvent(section)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "explainer_without_commercial_event"));
  if (isResearchPrototypeWithoutCommercialEvent(section)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "research_prototype_without_commercial_event"));
  if (value(section, "index_only_evidence") === "true") issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "index_only_evidence"));
  if (indexOnlyEvidenceTypes.has(evidenceObjectType)) issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, `index_only_evidence_type:${evidenceObjectType}`));
  if (isRootOrHomeSourceUrl(sourceUrl) || (indexOnlyUrlPattern.test(sourceUrl) && !/\/\d{4}\/|\/20\d{2}[/-]|press|news|release|announc|blog\/[^/]+/iu.test(sourceUrl))) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "index_or_directory_url"));
  }
  if (discoveryOnlyPattern.test(`${value(section, "acquisition_channel")} ${value(section, "source_role")}`) && !new Set(["resolved_original_source", "primary_source"]).has(value(section, "source_role"))) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "discovery_source_not_resolved"));
  }
  if (!coreImportanceTypes.has(importanceType) && !hasCardableEvent) issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, `unsupported_importance_type:${importanceType || "missing"}`));
  if (importanceType === "important_technical_trend" && !observationSummaryEvidenceAllowed && !hasFormalEvent) {
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
  if (isViewpointWithoutConfirmedCommercialEvent(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "viewpoint_without_confirmed_commercial_event"));
  }
  if (isUnconfirmedProductRumorOrPlan(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "unconfirmed_product_rumor_or_plan"));
  }
  if (isSecondaryProductReviewOrRumor(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "secondary_review_or_rumor_not_original_event"));
  }
  if (isConsumerUiPersonalizationWithoutBusinessAi(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "consumer_ui_personalization_not_business_signal"));
  }
  if (isSpecOnlyHardwareNewsWithoutCommercialDeployment(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "spec_only_hardware_news_without_commercial_deployment"));
  }
  if (isTradeSecretLawsuitWithoutCommercialEvent(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "trade_secret_lawsuit_without_product_funding_or_case_event"));
  }
  if (importanceType === "important_funding" && isUnconfirmedFundingProcess(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "funding_round_not_confirmed_closed"));
  }
  if (isExecutiveDisputeWithoutCommercialEvent(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "executive_dispute_without_commercial_event"));
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
  if (sectionSourceIdentityIndicatesIndexOnly(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "text_indicates_index_only"));
  }
  return issues;
}

function sectionSourceIdentityIndicatesIndexOnly(section) {
  const sourceIdentity = [
    poolTitle(section),
    value(section, "source_url"),
    value(section, "source"),
    value(section, "evidence_object_type"),
    value(section, "degradation_reasons"),
  ].join(" ");
  return /官网首页|产品目录|文档目录|README|包页|模型页|搜索结果|SEO|工具导航|目录页|首页|category page|directory|search result/iu.test(sourceIdentity);
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
    [/\bMowito\b/iu, "Mowito"],
    [/^Meet\s+Talp:|techfundingnews\.com\/meet-talp-/iu, "Talp"],
    [/小鹏|\bXPENG\b/iu, "小鹏汽车"],
    [/努比亚|\bNubia\b|\biMoochi\b/iu, "努比亚"],
    [/腾讯混元|Tencent\s+Hunyuan/iu, "腾讯混元"],
    [/taskade\.com|\bTaskade\b/iu, "Taskade"],
    [/stigg\.io|\bStigg\b/iu, "Stigg"],
    [/微软研究院|Microsoft Research/iu, "Microsoft Research"],
    [/\bseltz\.ai\b|\bSeltz\b/iu, "Seltz"],
    [/openrouter\.ai|\bOpenRouter\b/iu, "OpenRouter"],
    [/Simplexity Robotics/iu, "Simplexity Robotics"],
    [/Flex and Cerebras|Flex and Cerebras Systems|Cerebras CS-3/iu, "Flex / Cerebras"],
    [/微软.{0,30}Windows.{0,30}AI.{0,30}漏洞|Windows.{0,30}MDASH|Microsoft Detection and Analysis for Security Hardening/iu, "Microsoft / Windows"],
    [/\bSupermicro\b|\bSuper Micro Computer\b/iu, "Supermicro"],
    [/谷歌\s*Voice|Google\s*Voice/iu, "Google Voice"],
    [/特斯拉|\bTesla\b/iu, "Tesla"],
    [/阶跃星辰|Step\s*Edge/iu, "阶跃星辰"],
    [/月之暗面|Kimi\s*(?:Code|K2)/iu, "月之暗面 / Kimi"],
    [/\bOXMIQ\b/iu, "OXMIQ"],
    [/\bSK Hynix\b|SK 海力士/iu, "SK Hynix"],
    [/\bKTern\.AI\b/iu, "KTern.AI"],
    [/\bSunrun\b/iu, "Sunrun"],
    [/\bHadrius\b|hadrius\.com\/insights\/series-a/iu, "Hadrius"],
    [/\bSamsung SDS\b/iu, "Samsung SDS"],
    [/\bFuriosaAI\b|\bFuriosa\b/iu, "FuriosaAI"],
    [/\bIMS Gear\b/iu, "IMS Gear"],
    [/\bSynera\b/iu, "Synera"],
    [/\bOvertone\b/iu, "Overtone"],
    [/Apple.{0,20}(?:sues|lawsuit|起诉).{0,20}OpenAI/iu, "Apple / OpenAI"],
    [/OpenAI.{0,30}(?:Atlas|关停)/iu, "OpenAI"],
    [/腾讯.{0,20}(?:Manus|收购)/iu, "腾讯 / Manus"],
    [/\bBun\b.{0,40}(?:Claude|Zig|Rust)/iu, "Bun"],
    [/Claude Code/iu, "Anthropic / Claude Code"],
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
  const chineseActor = shortCompany(
    title.match(/^(.{2,30}?)(?:正式)?(?:发布|推出|披露|上线|开放|定价|签约|部署|收购|完成融资)/u)?.[1] || "",
  );
  if (chineseActor && !isWeakCompanyName(chineseActor)) return chineseActor;
  const fallback = shortCompany(title.split(/[:|｜-]/u)[0] || "");
  if (!isWeakCompanyName(fallback)) return fallback;
  return domainLabelFromUrl(sourceUrl) || "Unknown";
}

function extractAmount(text) {
  return text.match(/(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)|\d+(?:\.\d+)?\s?(?:million|billion))/u)?.[0] || "";
}

function fundingAmountMillions(value = "") {
  const text = String(value || "");
  const dollars = text.match(/\$\s?(\d+(?:\.\d+)?)\s?(BN|MN|B|M|K|billion|million|thousand)?\b/iu);
  if (dollars) {
    const amount = Number(dollars[1]);
    const unit = String(dollars[2] || "").toLowerCase();
    if (!Number.isFinite(amount)) return null;
    if (unit === "b" || unit === "bn" || unit === "billion") return amount * 1000;
    if (unit === "k" || unit === "thousand") return amount / 1000;
    return amount;
  }
  const yi = text.match(/(\d+(?:\.\d+)?)\s*亿\s*美元/u);
  if (yi) return Number(yi[1]) * 100;
  const wan = text.match(/(\d+(?:\.\d+)?)\s*万\s*美元/u);
  if (wan) return Number(wan[1]) / 100;
  return null;
}

function fundingCompletionAmountMismatch(value = "", sourceAmountMillions = null) {
  if (!Number.isFinite(sourceAmountMillions)) return false;
  const text = String(value || "");
  if (!/\b(?:raises?|raised|has raised|secures?|secured|funding|financing|round|valuation)\b|(?:宣布)?完成.{0,30}融资|获得.{0,30}融资|估值/iu.test(text)) return false;
  const pointAmountMillions = fundingAmountMillions(text);
  if (!Number.isFinite(pointAmountMillions)) return false;
  return Math.abs(pointAmountMillions - sourceAmountMillions) > Math.max(0.5, sourceAmountMillions * 0.05);
}

function fundingCompletionMissingAmount(value = "", sourceAmountMillions = null) {
  if (!Number.isFinite(sourceAmountMillions)) return false;
  const text = String(value || "");
  if (!/\b(?:raises?|raised|has raised|secures?|secured)\b|(?:宣布)?完成.{0,30}融资|获得.{0,30}融资/iu.test(text)) return false;
  return !Number.isFinite(fundingAmountMillions(text));
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
  if (isUnconfirmedFundingProcess(section)) return false;
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
  const raw = readRawJson(section);
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
  const rawEvidenceHaystack = [
    JSON.stringify(raw.key_excerpts || []),
    JSON.stringify(raw.evidence_seed || {}),
  ].join(" ");
  const haystack = `${identityHaystack} ${evidenceHaystack} ${rawEvidenceHaystack}`;
  if (/\b(contract|procurement|tender|vehicle|autonomous ground vehicles|war|military|defense contract|export curbs?|self-developed chip|stake|equity stake|capital expenditure|capex|data center|investment plan|is seeking|seeks to raise|plans to raise|reportedly|rumou?red|in talks)\b|乌克兰|参战|车辆|出口管制|寻求融资|计划融资|消息称|据悉|入股/iu.test(identityHaystack)) {
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
  const sourceIdentity = [poolTitle(section), value(section, "source"), sourceUrl].join(" ");
  if (allowsObservationSummaryEvidence(section)) return "product_service";
  if (importanceType === "important_product_or_service" && hasConcreteProductEvent(section)) return "product_service";
  if (isSingleCompanyFundingSignal(section)) return "funding";
  if (hasConcreteCaseEvent(section) || hasNamedCommercialDeploymentEvidence(section)) return "case";
  if (importanceType === "important_market_structure") {
    if (/\b(pricing|price|billing|rate limit)\b|定价|价格|计费/iu.test(text)) return "product_service";
    return "case";
  }
  if (/\b(unveils?|launches?|introduc(?:es|ing)?|announc(?:es|ing)?|released?|now has a built-in|removes?|removed|kills?|available now|general availability)\b|发布|推出|披露|上线|下线|移除|正式登陆|正式可用/iu.test(sourceIdentity)) return "product_service";
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
      if (!["deepseek_title_translation", "manual_reviewed_source_title_translation"].includes(entry?.generatedBy)) continue;
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
  if (hanCount > 0 && /(?:发布|上线|推出|更新|完成|获得|宣布|融资|合作|部署|采用|收购|获批)/u.test(text)) return false;
  return text.length > 12 && hanCount < 4 && latinWords.length >= 2;
}

function sourceTitlePayloadHints(title = "") {
  const text = cleanSourceTitleForPublicTitle(title).toLowerCase();
  const hints = [];
  const rules = [
    [/sivaclaw/u, /SivaClaw/u],
    [/investors?/u, /投资者/u],
    [/interest/u, /兴趣|意向/u],
    [/physical ai/u, /Physical AI/u],
    [/robot arms?/u, /机械臂/u],
    [/manufacturing/u, /制造/u],
    [/web search/u, /网页搜索|网络搜索|Web Search/u],
    [/agents?/u, /智能体|Agent/u],
    [/to build/u, /用于|构建|建设/u],
    [/dating service/u, /约会服务|dating service/u],
    [/chiplet|custom ai silicon|full-stack/u, /Chiplet|芯粒|Custom AI Silicon|定制 AI 芯片|全栈/u],
    [/rfq|10 minutes?|cuts?/u, /RFQ|10 分钟|缩短|cuts?|minutes?/u],
    [/customer|workflow|production|deployment/u, /客户|工作流|生产|部署|落地|customer|workflow|production|deployment/u],
  ];
  for (const [sourcePattern, translationPattern] of rules) {
    if (sourcePattern.test(text)) hints.push(translationPattern);
  }
  return hints;
}

function sourceTitleHasExtraPayload(title = "") {
  const text = cleanSourceTitleForPublicTitle(title);
  if (!text) return false;
  return sourceTitlePayloadHints(text).length > 0
    || /:\s*\S|\b(?:after|to build|for|with participation from|led by|backing from|investment in|workflow|platform|automation|customer)\b/iu.test(text);
}

function publicTitleLooksLikeBareFundingSummary(title = "") {
  const text = cleanSourceTitleForPublicTitle(title);
  return text.length <= 36
    && /^[A-Za-z0-9\u4e00-\u9fff .&'’()-]{1,24}\s+(?:获得|完成|宣布)\s*\d+(?:\.\d+)?\s*(?:万|亿)?(?:美元|人民币|欧元|英镑)?\s*(?:Pre-seed|Seed|种子轮|A 轮|B 轮|C 轮|D 轮)?\s*融资$/iu.test(text);
}

function translationPreservesSourceTitlePayload(sourceTitle = "", translated = "") {
  if (!sourceTitleNeedsChineseTranslation(sourceTitle)) return true;
  if (!sourceTitleHasExtraPayload(sourceTitle)) return true;
  const cleanTranslated = cleanSourceTitleForPublicTitle(translated);
  if (!cleanTranslated || publicTitleLooksLikeBareFundingSummary(cleanTranslated)) return false;
  const hints = sourceTitlePayloadHints(sourceTitle);
  return hints.length === 0 || hints.some((pattern) => pattern.test(cleanTranslated));
}

function sourceTitleDisplayTitle(title = "") {
  const cleaned = cleanSourceTitleForPublicTitle(title);
  if (!cleaned || hasTextContamination(cleaned)) return "";
  if (!sourceTitleNeedsChineseTranslation(cleaned)) return cleaned;
  const translated = sourceTitleTranslations.get(sourceTitleTranslationKey(cleaned)) || "";
  if (!translationPreservesSourceTitlePayload(cleaned, translated)) return "";
  return translated;
}

const sourceTitleTranslations = loadSourceTitleTranslations();

function rawTitleZhFromSection(section) {
  const raw = readRawJson(section);
  if (raw.title_translation_method === "mymemory_title_translation") return "";
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

function fundingSourceTitleHasExtraPayload(title = "") {
  const text = cleanSourceTitleForPublicTitle(title);
  if (!text) return false;
  return /:\s*\S|\b(?:after|to build|for|with participation from|led by|backing from|investment in|physical ai|robot arms|manufacturing|web search|agents?|investors?|generated|interest|workflow|platform|automation|customer)\b/iu.test(text);
}

function deterministicEnglishPublicTitle({ type = "", company = "", sourceEventTitle = "", amount = "" } = {}) {
  const cleanCompany = publicCardCopy(shortCompany(company || "")) || "AI 公司";
  const title = cleanSourceTitleForPublicTitle(sourceEventTitle);
  if (!title || hasTextContamination(title)) return "";
  if (/Serverless Fine-Tuning\b.*\bSelf-Serve Inference Deployments\b/iu.test(title)) {
    return `${cleanCompany} 发布 Serverless Fine-Tuning 与 Self-Serve Inference 部署，推动模型进入生产`;
  }
  if (type === "funding" && amount) {
    const round = chineseRound(title);
    const localizedAmount = chineseAmount(amount) || amount;
    if (/\bweb search\b.{0,80}\bagents?\b/iu.test(title)) {
      return `${cleanCompany} 融资 ${localizedAmount}${round ? ` ${round}` : ""}，用于为智能体构建先进 Web Search`;
    }
    const purpose = /\bAI dating service\b/iu.test(title)
      ? "，用于 AI 约会服务"
      : /\bfull-stack chiplet platform\b.{0,80}\bcustom AI silicon\b/iu.test(title)
        ? "，用于推出全栈 Chiplet 平台与定制 AI 芯片"
      : /\bto build\b.{0,80}\bAI\b/iu.test(title)
        ? "，用于构建 AI 服务"
        : "";
    return `${cleanCompany} 获得 ${localizedAmount}${round ? ` ${round}` : ""}融资${purpose}`;
  }
  if (/\bcuts?\b.{0,80}\b(?:minutes?|hours?|days?|cost|rfq|cycle)\b|\breduc(?:es|ed)\b.{0,80}\b(?:minutes?|hours?|days?|cost|cycle)\b/iu.test(title)) {
    if (/\bRFQ\b/iu.test(title) && /\b10\s+minutes?\b/iu.test(title)) return `${cleanCompany} 用 agentic AI 将 RFQ 缩短至 10 分钟`;
    return `${cleanCompany} 披露 AI 流程提效案例`;
  }
  if (/\b(?:partners?|partnership|collaborat(?:es|ion))\b/iu.test(title)) {
    return `${cleanCompany} 推进 AI 合作与交付`;
  }
  if (/\b(?:launch(?:es|ed)?|introduc(?:es|ed)?|announc(?:es|ed|ing)?|unveils?|released?)\b/iu.test(title)) {
    const product = title.match(/\b(?:launch(?:es|ed)?|introduc(?:es|ed)?|announc(?:es|ed|ing)?|unveils?|released?)\s+(.+?)(?:\s+on\s+|\s+with\s+|\s+for\s+|<|\||\s+-\s+|,|$)/iu)?.[1]
      ?.replace(/\b(to|a|an|the)\b\s*$/iu, "")
      ?.trim() || "";
    const productLabel = product && product.length <= 80 && !hasTextContamination(product) ? product : "AI 服务";
    return `${cleanCompany} 发布 ${productLabel}`;
  }
  if (/\bdeploy(?:s|ed|ment)?|datacenters?|production|customer story|case study\b/iu.test(title)) {
    return `${cleanCompany} 披露 AI 部署进展`;
  }
  return "";
}

function publicTitleForAutoSignal({ type, company, sourceEventTitle, amount, translatedTitle = "" }) {
  if (translatedTitle) return translatedTitle;
  const deterministic = sourceTitleNeedsChineseTranslation(sourceEventTitle)
    ? deterministicEnglishPublicTitle({ type, company, sourceEventTitle, amount })
    : "";
  if (deterministic) return deterministic;
  const translated = sourceTitleDisplayTitle(sourceEventTitle);
  if (translated) return translated;
  if (type === "funding" && company && amount && !hasTextContamination(company)) {
    const round = chineseRound(sourceEventTitle);
    const localizedAmount = chineseAmount(amount) || amount;
    const purpose = /\bAI dating service\b/iu.test(sourceEventTitle)
      ? "，用于 AI 约会服务"
      : /\bfull-stack chiplet platform\b.{0,80}\bcustom AI silicon\b/iu.test(sourceEventTitle)
        ? "，用于推出全栈 Chiplet 平台与定制 AI 芯片"
      : /\bto build\b.{0,80}\bAI\b/iu.test(sourceEventTitle)
        ? "，用于构建 AI 服务"
        : "";
    return `${company} 获得 ${localizedAmount}${round || ""}融资${purpose}`;
  }
  if (sourceTitleNeedsChineseTranslation(sourceEventTitle)) {
    return deterministicEnglishPublicTitle({ type, company, sourceEventTitle, amount });
  }
  if ((type === "product_service" || type === "case") && sourceEventTitleCanBackAutoCard(sourceEventTitle)) {
    const compact = compactLaunchTitle(company, sourceEventTitle);
    if (compact) return compact;
    return sourceEventTitle;
  }
  return "";
}

function sourceEventTitleCanBackAutoCard(title = "") {
  const text = cleanSourceTitleForPublicTitle(title);
  if (!text || hasTextContamination(text)) return false;
  if (/^(?:Ep\.?\s*\d+|Episode\s+\d+)\b|\b(podcast|interview|roundup|guide|what is|what'?s real|how to|landscape|report|trends?|top \d+|ranked|list|directory|buyer'?s guide|comparison|ideas|use cases|may become|roles? in the ai era|job opening|job listing|careers?|hiring)\b/iu.test(text)) return false;
  return /\b(launch(?:es|ed)?|announc(?:es|ed|ing)?|introduc(?:es|ed|ing)?|public preview|generally available|GA|available now|reach(?:es|ed)? the next phase|live transactions?|partners? with|partnership|procurement|contract|customer story|case study|deploy(?:s|ed|ment)?|rollout|adopt(?:s|ed|ion)?|use(?:s|d)?|used by|boosts?|increas(?:es|ed)|reduc(?:es|ed)|cuts?|saves?|improv(?:es|ed)|internal automation agents|expands?|unveils?|shuts? down|discontinues?|kills?|folds?)\b|发布|推出|上线|上市|正式可用|合作|签约|采购|部署|落地|采用|使用|提升|增长|降低|节省|扩展|取消.{0,20}(?:限制|上限)|调整.{0,20}(?:价格|定价|计费)|关停|下线|并入/iu.test(text);
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
  const genericPublisherTitle = /^HPCwire\s*-\s*Since 1987|Covering the Fastest Computers in the World/iu.test(rawTitle);
  if (rawTitle && !genericPublisherTitle && !hasTextContamination(rawTitle) && !/AI\s*business signal|来源材料显示|公开材料显示/iu.test(rawTitle)) {
    return rawTitle;
  }
  if (genericPublisherTitle) {
    const lines = String(raw.full_text || raw.clean_text || "")
      .split(/\r?\n/u)
      .map((line) => line.replace(/\s+/gu, " ").trim())
      .filter(Boolean);
    const urlHint = String(raw.canonical_url || raw.original_url || value(section, "source_url"))
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.split("-")
      .find((token) => token.length >= 4 && !/^(raises?|funding|launches?|announces?)$/iu.test(token));
    const eventPattern = /\b(?:raises?|raised|secures?|secured|closes?|closed|funding|financing|acquires?|launches?|announces?)\b/iu;
    const eventLine = lines.find((line) => urlHint && new RegExp(`\\b${urlHint}\\b`, "iu").test(line) && eventPattern.test(line))
      || lines.find((line) => /^.{1,80}\b(?:raises?|raised|secures?|secured|closes?|closed|funding|financing|acquires?|launches?|announces?)\b/iu.test(line));
    if (eventLine && !hasTextContamination(eventLine)) return cleanSourceTitleForPublicTitle(eventLine);
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
  const purePolicyConflict = /\b(ban|banned|prohibit|controversy|privacy pledge|self-regulation)\b|绂佷护|绂佹|浜夎|公约|自律|个人信息保护/iu;
  const text = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  if (/\bgovernment\b.{0,120}\b(?:budget|fiscal|tax revenue|public spending)\b|\b(?:budget|fiscal|tax revenue|public spending)\b.{0,120}\bgovernment\b|政府.{0,80}(?:财政预算|财政支出|税收|基金)|(?:财政预算|财政支出|税收).{0,80}政府/iu.test(text)) {
    return true;
  }
  if (hasCommercialAction && !purePolicyConflict.test(text)) return false;
  if (/\b(government|ban|banned|prohibit|national security|policy|regulat(?:ion|or)|controversy|privacy pledge|self-regulation)\b|政府|禁令|禁止|国家安全|政策|监管|争议|公约|自律|个人信息保护/iu.test(text)) {
    return true;
  }
  return /(教皇|通谕|梵蒂冈|人类尊严|深刻的人性|公共伦理|Pope|Vatican|encyclical|humanitas|human dignity)/iu.test(text);
}

function isEligibleAutoSignal(section) {
  return autoSignalEligibilityIssues(section).length === 0;
}

function autoSignalSpec(poolRef, section, index, diagnostics = null) {
  const reject = (reason) => {
    if (diagnostics) diagnostics.reason = reason;
    return null;
  };
  const text = textForInference(section);
  const type = inferSignalType(section);
  const company = companyFromSection(section);
  const summaryOperatorMaterial = evidenceStrengthForSection(section) === "traceable_summary"
    && /\b(podcast|simplecast|interview|episode|ceo|founder|co-founder)\b|CEO|创始人|访谈|播客/iu.test(sectionEvidenceText(section));

  if (!allowsObservationSummaryEvidence(section) && isStalePublication(section, cardFreshnessDays(section))) return reject("stale_source_date");

  let scenario = scenarioFromText(text);
  if (/^(BentoCloud|Microsoft Foundry)$/u.test(company)) {
    scenario = "模型部署和算力调用";
  }
  let amount = extractAmount(text);
  const prefix = `SIG-${date.replaceAll("-", "")}-A${String(index).padStart(2, "0")}`;
  const sourceTitle = originalSourceTitleFromSection(section);
  if (!sourceTitle) return reject("original_source_title_missing");
  const sourceEventTitle = cleanSourceEventTitle(sourceTitle);
  if (!sourceEventTitle) return reject("source_event_title_unusable");
  if (isWeakCompanyName(company)) return reject("company_name_unusable");
  if (type === "funding" && !hasStrictFundingAnnouncement(section, sourceEventTitle)) return reject("funding_announcement_unconfirmed");
  const strategicInvestment = isConfirmedStrategicInvestment(section, sourceEventTitle);
  if (strategicInvestment && !titleHasFundingAmountOrRound(sourceEventTitle)) amount = "";
  const translatedTitle = sourceTitleDisplayTitle(sourceTitle) || rawTitleZhFromSection(section);
  let title = publicTitleForAutoSignal({ type, company, sourceEventTitle, amount, translatedTitle });
  if (!title && type === "funding" && strategicInvestment && !sourceTitleNeedsChineseTranslation(sourceEventTitle)) {
    title = `${company} 获得战略投资`;
  }
  if (!title && (allowsObservationSummaryEvidence(section) || summaryOperatorMaterial)) {
    title = `${company || "AI 公司"} 的 AI 商业观察`;
  }
  if (!title) return reject("public_title_unavailable");
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
  if (!sourcePointIsUsable(eventLine)) return reject("source_event_line_unusable");
  const companySlug = slugify(company);
  const sourceSlug = slugify(sourceEventTitle);
  return {
    id: prefix,
    poolRef,
    type,
    dir: dirForSignalType(type),
    slug: `${companySlug === "auto-signal" ? sourceSlug : companySlug}-${slugify(scenario)}-${poolRef.toLowerCase()}`,
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
  const hasFormalEvent = hasFormalCardEvent(section);
  const identityIsIndexOnly = sectionSourceIdentityIndicatesIndexOnly(section)
    || value(section, "index_only_evidence") === "true"
    || isRootOrHomeSourceUrl(sourceUrl);
  if (/\bindex_only\b/iu.test(poolRoutes) && (!hasFormalEvent || identityIsIndexOnly)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.validPageType, "pool_route_index_only_not_formal_card"));
  }
  if (!coreImportanceTypes.has(importanceType) && !allowsObservationSummaryEvidence(section) && !hasFormalEvent) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, `unsupported_importance_type:${importanceType || "missing"}`));
  }
  if (importanceType === "important_funding" && !isSingleCompanyFundingSignal(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "funding_not_single_company_round"));
  }
  const sourceEventTitle = cleanSourceEventTitle(originalSourceTitleFromSection(section));
  if (!sourceEventTitle) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "original_source_title_missing"));
  }
  if (isNonCommercialPolicyOrEthicsSignal(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "non_commercial_policy_or_ethics_signal"));
  }
  if (!hasDirectAiEventAnchor(section)) {
    issues.push(cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "source_event_missing_ai_anchor"));
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

function classifiedAutoSignalSpecFailureIssues(section, reason = "") {
  const text = `${poolTitle(section)} ${textForInference(section)} ${value(section, "source_url")}`;
  if (/\b(Siri|public beta|iOS\s+\d+|consumer assistant|Apple opens its new Siri)\b/iu.test(text)
    && !/\b(enterprise|procurement|contract|pricing|paid enterprise|customer deployment|case study|developer platform)\b|企业|采购|合同|客户部署|案例|开发者平台/iu.test(text)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "consumer_feature_without_enterprise_or_monetization_signal")];
  }
  if (reason === "source_event_line_unusable") {
    if (/\bdatacenters?|accelerators?|chip startup|hardware|semiconductor|inference platform\b/iu.test(text)
      && !/\b(customer deployment|case study|procurement|contract|pricing|funding|financing|production rollout)\b|客户部署|案例|采购|合同|定价|融资|生产部署/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.validPageType, "hardware_market_coverage_without_card_fact")];
    }
    return [cardGateIssue(CARD_ENTRY_GATES.evidenceQuality, "source_event_line_unusable")];
  }
  if (reason === "public_title_unavailable") {
    if (/\b(watchdog|policy|regulat(?:ion|or)|government|global ai watchdog|privacy|ban|lawsuit)\b|政策|监管|政府|诉讼|禁令/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "non_commercial_policy_or_ethics_signal")];
    }
    if (/\b(strategies|demand|power costs|market report|analysis|survey|guide|what is|how to)\b|策略|需求|电力成本|市场报告|分析|指南/iu.test(text)
      && !/\b(launches?|released?|funding|raises?|customer|case study|deployment|procurement|contract)\b|发布|融资|客户|案例|部署|采购|合同/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.validPageType, "market_commentary_without_single_company_event")];
    }
    if (/\b(Premium|consumer|music assistant|playlist|smart speaker|iPhone|Android|WhatsApp|dating|Google Search)\b|音乐助手|个人用户|消费|手机|约会|搜索图片/iu.test(text)
      && !/\b(enterprise|procurement|contract|pricing|paid enterprise|customer deployment|case study|developer platform|funding|raises?|raised)\b|企业|采购|合同|客户部署|案例|开发者平台|融资/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "consumer_feature_without_enterprise_or_monetization_signal")];
    }
    if (/\b(service page|solutions?|guide|AI Agents for Enterprise IT Operations|CloudNinjas)\b/iu.test(text)
      && !/\b(launches?|announced|released|customer|case study|deployment|procurement|contract|funding|raises?|raised)\b|发布|客户|案例|部署|采购|合同|融资/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.validPageType, "generic_service_page_without_dated_event")];
    }
    return [cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "source_title_requires_chinese_event_title")];
  }
  if (reason === "funding_announcement_unconfirmed") {
    if (isUnconfirmedFundingProcess(section) || /ipo|valuation|secondary sale|tender offer|reportedly|rumou?red|in talks|plans?|seeking|筹备|最快|估值|传|据悉/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "unconfirmed_funding_or_ipo_process")];
    }
    if (/\b(Premium|consumer|music assistant|playlist|smart speaker|iPhone|Android|WhatsApp)\b|音乐助手|个人用户|消费|手机|扬声器/iu.test(text)
      && !/\b(enterprise|procurement|contract|pricing|paid enterprise|customer deployment|case study|developer platform)\b|企业|采购|合同|客户部署|案例|开发者平台/iu.test(text)) {
      return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "consumer_feature_without_enterprise_or_monetization_signal")];
    }
    return [cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "funding_importance_without_confirmed_round")];
  }
  if (reason !== "company_name_unusable") return [];
  if (/ipo|valuation|secondary sale|tender offer|reportedly|rumou?red|in talks|plans?|seeking|筹备|最快|估值|传|据悉/iu.test(text)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "unconfirmed_funding_or_ipo_process")];
  }
  if (/\b(quantization|PrismML|Bonsai|27B|4bit|1bit|benchmark|paper|model card|parameter|iPhone\s+\d|device memory)\b|量化|模型|参数|内存占用|本地运行|技术论文|基准/iu.test(text)
    && !/\b(launches?|released?|available now|pricing|enterprise|customer deployment|procurement|contract|funding|financing)\b|正式发布|上架|定价|企业|客户部署|采购|合同|融资/iu.test(text)) {
    return [cardGateIssue(CARD_ENTRY_GATES.validPageType, "technical_model_or_device_spec_without_commercial_event")];
  }
  if (/\b(Premium|consumer|music assistant|playlist|smart speaker|iPhone|Android|WhatsApp)\b|音乐助手|个人用户|消费|手机|扬声器/iu.test(text)
    && !/\b(enterprise|procurement|contract|pricing|paid enterprise|customer deployment|case study|developer platform)\b|企业|采购|合同|客户部署|案例|开发者平台/iu.test(text)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "consumer_feature_without_enterprise_or_monetization_signal")];
  }
  if (/\b(Siri|public beta|iOS\s+\d+|consumer assistant)\b/iu.test(text)
    && !/\b(enterprise|procurement|contract|pricing|paid enterprise|customer deployment|case study|developer platform)\b|企业|采购|合同|客户部署|案例|开发者平台/iu.test(text)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "consumer_feature_without_enterprise_or_monetization_signal")];
  }
  if (isSecondaryProductReviewOrRumor(section) || isUnconfirmedProductRumorOrPlan(section)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "unconfirmed_or_secondary_product_coverage")];
  }
  if (isCorporateCapexOrCommunityInvestment(section)) {
    return [cardGateIssue(CARD_ENTRY_GATES.factTypeConstraints, "corporate_capex_or_community_investment_not_signal_card")];
  }
  if (!/\bsignal_card_candidate\b/iu.test(value(section, "usable_for"))) {
    return [cardGateIssue(CARD_ENTRY_GATES.businessSignalScope, "not_routed_for_signal_card_candidate")];
  }
  return [cardGateIssue(CARD_ENTRY_GATES.sourceAuditability, "source_identity_unusable_for_formal_card")];
}

function promotePriorityForIssues(section, issues = []) {
  const repairableRecallIssues = issues.length > 0 && issues.every((issue) => /^(?:evidence_quality:(?:missing_source_material|missing_source_date|missing_chinese_fact_translation)|source_auditability:(?:missing_source_url|discovery_source_not_resolved)|valid_page_type:(?:index_only_evidence|degradation_reason_index_only|text_indicates_index_only|pool_route_index_only_not_formal_card))$/iu.test(issue));
  const sourceTitleConfirmsEvent = sourceEventTitleCanBackAutoCard(originalSourceTitleFromSection(section));
  const importanceType = value(section, "importance_type");
  const poolRoutes = value(section, "pool_routes");
  const freshDatedSource = Boolean(rawPublicationDate(section)) && !isStalePublication(section, cardFreshnessDays(section));
  const routedForFormalReview = /\b(?:core_pool|emerging_pool)\b/iu.test(poolRoutes);
  const sourceRoleResolved = new Set(["resolved_original_source", "primary_source"]).has(value(section, "source_role"));
  const readableSourceEvidence = new Set(["rich_evidence", "source_backed_event"]).has(evidenceStrengthForSection(section));
  if (
    coreImportanceTypes.has(importanceType)
    && routedForFormalReview
    && freshDatedSource
    && sourceRoleResolved
    && readableSourceEvidence
    && hasFormalCardEvent(section)
    && sourceTitleConfirmsEvent
    && repairableRecallIssues
  ) return "high";
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
  if (/funding_event_conflicted_by_unconfirmed_source/iu.test(text)) return "Keep the whole funding event out of formal Cards until a primary source or named investor confirms the round closed.";
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
  if (/consumer_ui_personalization_not_business_signal/iu.test(text)) return "Keep consumer UI personalization updates as backend context unless the same source proves enterprise adoption, pricing, developer platform, or customer deployment value.";
  if (/spec_only_hardware_news_without_commercial_deployment/iu.test(text)) return "Keep spec-only hardware news in Pool unless a customer deployment, procurement, commercial launch, or production rollout is sourced.";
  if (/trade_secret_lawsuit_without_product_funding_or_case_event/iu.test(text)) return "Keep trade-secret or employee dispute litigation as risk context unless it includes a separate product, funding, customer, procurement, or settlement event.";
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
    promote_priority: promotePriorityForIssues(section, finalIssues),
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
  const historicalFundingEvents = historicalFundingEventIndex();
  const unconfirmedFundingEventKeys = unconfirmedFundingEventKeysForSections(sections);
  let index = 1;
  for (const [poolRef, section] of sections) {
    if (selectedPoolRefs.has(poolRef)) continue;
    const eligibilityIssues = autoSignalEligibilityIssues(section);
    if (eligibilityIssues.length) {
      notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, eligibilityIssues));
      continue;
    }
    const diagnostics = {};
    const spec = autoSignalSpec(poolRef, section, index, diagnostics);
    if (!spec) {
      const classifiedIssues = classifiedAutoSignalSpecFailureIssues(section, diagnostics.reason || "unknown");
      notPromotedCandidates.push(notPromotedCandidateRow(
        poolRef,
        section,
        classifiedIssues.length ? classifiedIssues : [`auto_signal_spec_null:${diagnostics.reason || "unknown"}`],
      ));
      continue;
    }
    if (spec.type === "funding") {
      const fundingKey = fundingEventIdentityKeyForSection(section);
      if (fundingKey && unconfirmedFundingEventKeys.has(fundingKey)) {
        notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, ["funding_event_conflicted_by_unconfirmed_source"]));
        continue;
      }
      const historical = fundingKey ? historicalFundingEvents.get(fundingKey) : null;
      if (historical) {
        notPromotedCandidates.push(notPromotedCandidateRow(poolRef, section, [`historical_duplicate_event_cluster:${historical.file}`]));
        continue;
      }
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
    track: [],
    function: [],
    scenario: [],
    customer: [],
    evidence: [],
  };
  const add = (group, ...ids) => tags[group].push(...ids);
  const has = (pattern) => pattern.test(text);

  if (has(/coding|code|developer|github|sdk|api|工程|开发|编程/iu)) add("track", "track-ai-coding"), add("function", "function-engineering"), add("customer", "customer-developer-team");
  if (has(/agentic|tool[ -]?use|multi[- ]?step|autonomous agent|智能体|自主执行|工具调用/iu)) add("track", "track-ai-agent");
  if (has(/workflow|business process|process automation|工作流|业务流程|流程自动化|审批/iu)) add("track", "track-enterprise-workflow");
  if (has(/foundation model|large language model|multimodal model|大模型|基础模型|多模态模型/iu)) add("track", "track-ai-models");
  if (has(/ai app|ai application|ai platform|assistant|copilot|ai 应用|ai 平台|助手/iu)) add("track", "track-ai-applications");
  if (has(/data|snowflake|rag|知识库|数据/iu)) add("track", "track-enterprise-data"), add("scenario", "scenario-knowledge-base");
  if (has(/infra|inference|temporal|模型|推理|基础设施|算力/iu)) add("track", "track-ai-infra");
  if (has(/health|medical|clinical|医疗|医院|临床/iu)) add("track", "track-medical-ai"), add("customer", "customer-healthcare-provider"), add("scenario", "scenario-healthcare-operations");
  if (has(/robot|robotics|autonomous vehicle|embodied|机器人|具身|无人系统/iu)) add("track", "track-embodied-ai");
  if (has(/video generation|image generation|creative|design tool|视频生成|图像生成|创意|设计工具/iu)) add("track", "track-creative-media-ai");
  if (has(/ai for science|scientific discovery|drug discovery|biology|chemistry|科学发现|科研|药物发现|生物|化学/iu)) add("track", "track-ai-science-research");
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
  ].join("\n");
}

function formalTagsForSignal(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.eventLine} ${(spec.sourcePoints || []).join(" ")} ${spec.company}`);
  tags.evidence.push(spec.type === "funding" ? "evidence-funding" : spec.type === "case" ? "evidence-customer-adoption" : "evidence-product-launch");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function opportunitySignalsForSignal(spec, sourceLevel, section) {
  const sourceText = spec.type === "product_service"
    ? [
      spec.eventLine,
      spec.whyWatch,
      spec.businessMeaning,
      spec.sourceExcerpt,
      ...(spec.sourcePoints || []),
    ]
    : [
      spec.eventLine,
      spec.whyWatch,
      spec.businessMeaning,
      spec.evidenceBoundary,
      spec.watchWindow,
      spec.sourceExcerpt,
      value(section, "key_excerpts"),
      value(section, "evidence_seed"),
    ];
  return inferOpportunitySignals({
    category: spec.type,
    signalType: spec.type,
    title: spec.title,
    sourceTitle: spec.sourceTitle,
    sourceUrl: value(section, "source_url"),
    sourceLevel,
    keyExcerpts: spec.sourcePoints || [],
    rawText: sourceText.filter(Boolean).join("\n"),
  });
}

function formalTagsForScene(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.industry} ${spec.role} ${spec.workflow} ${spec.changedStep}`);
  tags.evidence.push("evidence-customer-adoption");
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
  const sourcePointContext = {
    company: spec.company,
    scenario: scenarioFromText(textForInference(section)),
    type: spec.type,
    strategicInvestment: isConfirmedStrategicInvestment(section, originalSourceTitleFromSection(section)),
    sourceAmountMillions: fundingAmountMillions(originalSourceTitleFromSection(section)),
  };
  const sourcePoints = [...new Set((spec.sourcePoints?.length ? spec.sourcePoints : sourcePointsFromSection(section))
    .map((item) => hasCjk(item) ? item : (sourceBackedChineseFact(item, sourcePointContext) || item))
    .filter(sourcePointReadyForPublic))]
    .slice(0, 6);
  const titleFact = sourceTitleFactFromSection(section);
  let sourceFact = sourcePoints.find((item) => !isSameSourcePoint(item, spec.title) && !isSameSourcePoint(item, titleFact)) || sourcePoints[0] || "";
  if (!sourceFact || isSameSourcePoint(sourceFact, spec.title)) {
    const fallbackExcerpt = rawVisibleExcerptFromSection(section, [spec.title, titleFact, originalSourceTitleFromSection(section)]);
    const fallbackFact = localizedRawSourcePointsFromSection(section, sourcePointContext, [spec.title, titleFact])[0]
      || sourceBackedChineseFact(fallbackExcerpt, sourcePointContext);
    if (fallbackFact && !isSameSourcePoint(fallbackFact, spec.title) && !isSameSourcePoint(fallbackFact, titleFact)) {
      sourceFact = fallbackFact;
    }
  }
  if (!sourceFact) sourceFact = spec.title;
  const rawValuePoint = localizedRawSourcePointsFromSection(section, sourcePointContext, [sourceFact, spec.title, titleFact])[0] || "";
  let valueSummary =
    [spec.businessMeaning, spec.whyWatch, ...sourcePoints]
      .find((item) => item && !isSameSourcePoint(item, sourceFact) && !isSameSourcePoint(item, spec.title) && !isSameSourcePoint(item, titleFact)) ||
    rawValuePoint ||
    generatedCommercialValue(spec);
  const candidateOriginalPoints = sourcePoints
    .filter((item) => !isSameSourcePoint(item, sourceFact) && !isSameSourcePoint(item, valueSummary) && !isSameSourcePoint(item, spec.title) && !isSameSourcePoint(item, titleFact))
    .slice(0, 4);
  let sourceExcerpt = rawVisibleExcerptFromSection(section, [sourceFact, valueSummary, ...candidateOriginalPoints, originalSourceTitleFromSection(section)]);
  if (sourceExcerpt && isSameSourcePoint(sourceExcerpt, sourceFact)) {
    const alternateExcerpt = rawVisibleExcerptFromSection(section, [sourceFact, valueSummary, ...candidateOriginalPoints, originalSourceTitleFromSection(section), sourceExcerpt]);
    if (alternateExcerpt && !isSameSourcePoint(alternateExcerpt, sourceFact)) {
      sourceExcerpt = alternateExcerpt;
    }
  }
  let originalPoints = candidateOriginalPoints.filter((item) => !isSameSourcePoint(item, sourceExcerpt));
  let secondaryExcerpt = "";
  if (!originalPoints.length) {
    secondaryExcerpt = rawVisibleExcerptFromSection(section, [sourceFact, valueSummary, sourceExcerpt, originalSourceTitleFromSection(section)]);
    const localizedSecondaryExcerpt = hasCjk(secondaryExcerpt)
      ? secondaryExcerpt
      : sourceBackedChineseFact(secondaryExcerpt, sourcePointContext);
    if (localizedSecondaryExcerpt && ![sourceFact, valueSummary, sourceExcerpt, spec.title].some((item) => isSameSourcePoint(localizedSecondaryExcerpt, item))) {
      originalPoints = [localizedSecondaryExcerpt];
    }
  }
  if (!originalPoints.length) {
    originalPoints = localizedRawSourcePointsFromSection(section, sourcePointContext, [sourceFact, valueSummary, sourceExcerpt, spec.title]);
  }
  if (!originalPoints.length && secondaryExcerpt && ![sourceFact, valueSummary, sourceExcerpt, spec.title].some((item) => isSameSourcePoint(secondaryExcerpt, item))) {
    originalPoints = [secondaryExcerpt];
  }
  originalPoints = originalPoints
    .filter((item) => ![sourceFact, valueSummary, spec.title, sourceExcerpt].some((excludedItem) => isSameSourcePoint(item, excludedItem)))
    .slice(0, 4);
  if (!originalPoints.length) {
    const raw = readRawJson(section);
    const excluded = [sourceFact, valueSummary, spec.title, sourceExcerpt, originalSourceTitleFromSection(section)];
    const alternatePoint = sourceSentences(raw.full_text || raw.clean_text || "", 80)
      .map((item) => sourceBackedChineseFact(item, sourcePointContext) || item)
      .find((item) => sourcePointReadyForPublic(item) && !excluded.some((excludedItem) => isSameSourcePoint(item, excludedItem)));
    if (alternatePoint) originalPoints = [alternatePoint];
  }

  if (originalPoints.some((item) => isSameSourcePoint(item, sourceExcerpt))) {
    const alternateExcerpt = rawVisibleExcerptFromSection(section, [sourceFact, valueSummary, ...originalPoints, originalSourceTitleFromSection(section), sourceExcerpt]);
    if (alternateExcerpt && !originalPoints.some((item) => isSameSourcePoint(item, alternateExcerpt))) {
      sourceExcerpt = alternateExcerpt;
    }
  }
  if (originalPoints.some((item) => !hasCjk(item))) {
    const localizedOriginalPoints = [...originalPoints, sourceExcerpt, secondaryExcerpt]
      .map((item) => hasCjk(item) ? item : sourceBackedChineseFact(item, sourcePointContext))
      .filter((item) => item && hasCjk(item))
      .filter((item) => ![sourceFact, valueSummary, spec.title].some((excludedItem) => isSameSourcePoint(item, excludedItem)));
    if (localizedOriginalPoints.length) originalPoints = [...new Set(localizedOriginalPoints)].slice(0, 4);
  }
  if (cardDetailsTooSimilar(originalPoints.join(" "), valueSummary)) {
    valueSummary = generatedCommercialValue(spec);
  }
  const evidenceBoundary = spec.evidenceBoundary || value(section, "missing_information") || "未记录额外缺失项。";

  if (originalPoints.some((item) => isSameSourcePoint(item, sourceExcerpt))) {
    const raw = readRawJson(section);
    const excluded = [sourceFact, valueSummary, ...originalPoints, spec.title, originalSourceTitleFromSection(section), sourceExcerpt];
    const rawFallbackExcerpt = sourceSentences(raw.full_text || raw.clean_text || "", 60)
      .find((item) => item && !excluded.some((excludedItem) => isSameSourcePoint(item, excludedItem)));
    if (rawFallbackExcerpt) sourceExcerpt = rawFallbackExcerpt;
  }

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
${sourceTitleNeedsChineseTranslation(spec.sourceTitle) ? `title_zh: ${yamlString(spec.title)}\n` : ""}title_translation_status: ${sourceTitleNeedsChineseTranslation(spec.sourceTitle) ? "translated" : "not_required"}
title_translation_method: ${sourceTitleNeedsChineseTranslation(spec.sourceTitle) ? "raw_or_source_title_translation_db" : "source_title"}
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

${originalPoints.length ? originalPoints.map((item) => `- ${item}`).join("\n") : `- ${sourceFact || sourceExcerpt}`}

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
trend_state: rising
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

function writePoolToCardHandoff({ written, merged, skipped, clusterRows, frontstageSpecs, notPromotedCandidates = [], rawInputCount, poolInputCount }) {
  const reportDir = path.join(root, "agent-workflow", "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const handoffPath = path.join(reportDir, `${date}-pool-to-card-handoff.md`);
  const manifestPath = path.join(reportDir, `${date}-frontstage-manifest.json`);
  const generatedAt = new Date().toISOString();
  const handoff = [
    `# ${date} Pool-to-Card Handoff`,
    "",
    `- generated_at: ${generatedAt}`,
    `- raw_input_count: ${rawInputCount}`,
    `- pool_input_count: ${poolInputCount}`,
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
    raw_input_count: rawInputCount,
    pool_input_count: poolInputCount,
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

  const explicitSpecs = signalSpecs[date] || [];
  const candidates = candidateSpecs[date] || {};
  const sections = poolSections();
  const rawInputCount = rawFilesForDate().length;
  const poolInputCount = sections.size;
  if (expectedRawCount !== null && rawInputCount !== expectedRawCount) {
    throw new Error(`Raw input count mismatch for ${date}: expected ${expectedRawCount}, found ${rawInputCount}`);
  }
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
      existingSignalIndex.set(fingerprint, { file, id: spec.id, title: spec.title, type: spec.type, owner: spec.company, date });
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
    rawInputCount,
    poolInputCount,
  });
  written.push(handoff.handoff, handoff.manifest);

  console.log(JSON.stringify({ ok: true, date, written, merged, skipped, handoff }, null, 2));
}

function cardDetailSections(markdown = "") {
  const detail = {};
  for (const heading of ["新闻事实", "原文要点", "价值描述", "可见原文片段"]) {
    const match = String(markdown).match(new RegExp(`## ${heading}\\s*\\n\\n?([\\s\\S]*?)(?=\\n## |$)`, "u"));
    detail[heading] = String(match?.[1] || "").replace(/^[-*]\s*/gmu, "").trim();
  }
  return detail;
}

function normalizedDetail(value = "") {
  return normalizedSignalText(String(value).replace(/原文称，|原始来源标题显示：/gu, ""));
}

function runQualityRegressionFixtures() {
  assert.equal(date, "2026-07-11", "quality fixtures are pinned to the audited 2026-07-11 artifact");
  const sections = poolSections();
  const section = (poolRef) => {
    const found = sections.get(poolRef);
    assert.ok(found, `missing fixture ${poolRef}`);
    return found;
  };
  const specFor = (poolRef, index = 1) => autoSignalSpec(poolRef, section(poolRef), index);
  const issuesFor = (poolRef) => {
    const gateIssues = autoSignalEligibilityIssues(section(poolRef));
    if (gateIssues.length) return gateIssues;
    const diagnostics = {};
    if (autoSignalSpec(poolRef, section(poolRef), 1, diagnostics)) return [];
    return classifiedAutoSignalSpecFailureIssues(section(poolRef), diagnostics.reason);
  };

  const chineseHiringFixture = [
    "## P-999｜OpenAI 招聘家庭产品经理，拓展家庭用户市场",
    "- source_url: https://example.com/openai-family-product-manager",
    "- key_excerpts: OpenAI 正在招聘一名家庭产品经理。",
  ].join("\n");
  assert.equal(isJobListingSection(chineseHiringFixture), true, "Chinese recruitment stories must remain backend-only");

  const articleWithNavigationFixture = [
    "## P-998｜Google Voice 推出企业通话新功能",
    "- source_url: https://www.ithome.com/0/000/001.htm",
    "- source: IT之家 RSS",
    "- evidence_object_type: event",
    "- key_excerpts: 正文页导航包含首页；报道主体是 Google Voice 推出企业通话新功能。",
  ].join("\n");
  assert.equal(
    sectionSourceIdentityIndicatesIndexOnly(articleWithNavigationFixture),
    false,
    "navigation words inside article evidence must not turn a dated article into an index page",
  );
  assert.equal(
    sourcePointLooksPageChrome("投诉水文 我要纠错 下载IT之家APP，签到赚金币兑豪礼 相关文章 关键词：AI Apple 智能"),
    true,
    "IT之家 related-link chrome must not enter Card detail fields",
  );
  assert.ok(
    sourceDetailClauses("网信部门发布 7 款提供手机端侧生成式人工智能服务的已备案信息，包括苹果手机的 Apple 智能、华为手机的华为小艺 AI 大模型、OPPO 手机的 AndesGPT 大模型。").some((item) => item.startsWith("包括苹果手机")),
    "a long source sentence must expose a distinct source-backed detail clause",
  );
  assert.equal(
    isSameSourcePoint(
      "促进生成式人工智能服务创新发展和规范应用，网信部门有序开展备案工作，并公布已完成备案的应用和功能信息。",
      "IT之家 7 月 15 日消息，促进生成式人工智能服务创新发展和规范应用，网信部门有序开展备案工作，并公布已完成备案的应用和功能信息。",
    ),
    true,
    "a dateline prefix must not hide duplicated Card detail content",
  );
  assert.equal(
    cardDetailsTooSimilar(
      "- OpenAI 与 Work Louder 联合推出首款 Codex 键盘，售价为 230 美元。",
      "OpenAI 与 Work Louder 联合推出首款 Codex 键盘，售价为 230 美元。",
    ),
    true,
    "rendered Card sections must use the same duplicate semantics as the editorial gate",
  );
  const actualDirectoryFixture = [
    "## P-997｜AI 产品目录首页",
    "- source_url: https://example.com/products",
    "- source: Example directory",
    "- evidence_object_type: official_index_or_directory",
  ].join("\n");
  assert.equal(sectionSourceIdentityIndicatesIndexOnly(actualDirectoryFixture), true, "actual directory identity must remain blocked");

  const interpersonalDisputeFixture = [
    "## P-996｜GPT-5.6 上线之际，两名 AI 公司 CEO 隔空掐架",
    "- source_url: https://example.com/ceo-dispute",
    "- source: Example News",
    "- importance_type: important_product_or_service",
    "- key_excerpts: [{\"type\":\"funding\",\"text\":\"一名 CEO 转发帖文指责对方诈骗，另一名 CEO 回应并嘲讽。\"}]",
  ].join("\n");
  assert.equal(
    isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(interpersonalDisputeFixture),
    true,
    "interpersonal executive disputes without a separate commercial event must remain backend-only",
  );

  const internalResearchFixture = [
    "## P-995｜模型可化身研究员，后训练较小模型",
    "- source_url: https://example.com/internal-research",
    "- source: Example Research News",
    "- research_status: not_research",
    "- key_excerpts: 研究人员在内部评估套件中测试后训练方案，分数提高 16.2 个百分点。",
  ].join("\n");
  assert.equal(
    isResearchBenchmarkContextWithoutCommercialEvent(internalResearchFixture),
    true,
    "internal research and benchmark results without a commercial event must remain backend-only",
  );
  const hebbiaCommercialBenchmarkFixture = [
    "## P-994｜Hebbia tests Claude Fable 5 for financial diligence",
    "- source_url: https://claude.com/blog/working-at-the-frontier-how-hebbia-builds-ai-for-financial-diligence-that-cant-miss-a-detail",
    "- source: Claude Blog",
    "- importance_type: important_product_or_service",
    "- key_excerpts: Hebbia tested Claude Fable 5 on its financial benchmark and achieved an approximately 20% relative accuracy lift. Hebbia is an AI platform built for institutional finance, serving more than a third of the top 50 asset managers along with tier-1 investment banks and law firms. Its largest investment banking, private equity, and credit customers make decisions based on analyses spanning thousands of dense documents.",
  ].join("\n");
  assert.equal(isResearchBenchmarkContext(hebbiaCommercialBenchmarkFixture), true, "Hebbia fixture should still be recognized as benchmark context");
  assert.equal(hasNamedCommercialDeploymentEvidence(hebbiaCommercialBenchmarkFixture), true, "named customer/workflow evidence must override benchmark-only rejection");
  assert.equal(isResearchBenchmarkContextWithoutCommercialEvent(hebbiaCommercialBenchmarkFixture), false, "benchmark-backed commercial cases must be cardable");
  assert.equal(inferSignalType(hebbiaCommercialBenchmarkFixture), "case", "benchmark-backed customer workflow evidence must become a case Card");

  const consumerUiFixture = [
    "## P-993｜OPPO ColorOS 16 lock screen fingerprint style customization",
    "- source_url: https://example.com/oppo-coloros-lockscreen-fingerprint",
    "- importance_type: important_product_or_service",
    "- key_excerpts: ColorOS added lock screen fingerprint style customization with emojis and animation.",
  ].join("\n");
  assert.ok(
    cardabilitySemanticIssues(consumerUiFixture).some((issue) => /consumer_ui_personalization_not_business_signal/iu.test(issue)),
    "consumer UI personalization must not become a Business Signals Card",
  );

  const specOnlyHardwareFixture = [
    "## P-992｜Intel Starfire chip is a Panther Lake derivative for space environments",
    "- source_url: https://example.com/starfire-panther-lake",
    "- importance_type: important_product_or_service",
    "- key_excerpts: Starfire is a Panther Lake derivative with operating temperature and radiation analysis details.",
  ].join("\n");
  assert.ok(
    cardabilitySemanticIssues(specOnlyHardwareFixture).some((issue) => /spec_only_hardware_news_without_commercial_deployment/iu.test(issue)),
    "spec-only hardware coverage without deployment or procurement must remain backend-only",
  );

  const tradeSecretLawsuitFixture = [
    "## P-991｜Apple sues OpenAI over former engineer trade secrets",
    "- source_url: https://example.com/apple-sues-openai-trade-secrets",
    "- importance_type: supporting_signal",
    "- key_excerpts: Apple filed a lawsuit alleging a former employee stole confidential AI model details before joining OpenAI.",
  ].join("\n");
  assert.ok(
    cardabilitySemanticIssues(tradeSecretLawsuitFixture).some((issue) => /trade_secret_lawsuit_without_product_funding_or_case_event/iu.test(issue)),
    "trade-secret employee lawsuits without product/funding/case events must not become Cards",
  );

  for (const poolRef of ["P-001", "P-012", "P-043"]) {
    assert.deepEqual(issuesFor(poolRef), [], `${poolRef} should pass the six Card-entry gates`);
    const diagnostics = {};
    assert.ok(autoSignalSpec(poolRef, section(poolRef), 1, diagnostics), `${poolRef} should produce a formal Signal Card spec; reason=${diagnostics.reason || "unknown"}`);
  }
  assert.equal(specFor("P-001").type, "funding", "SK Hynix IPO must remain a funding/capital event");
  assert.equal(specFor("P-012").type, "funding", "OXMIQ round must remain a funding event");

  const rejected = {
    "P-002": "trade_secret_lawsuit_without_product_funding_or_case_event",
    "P-015": "source_title_requires_chinese_event_title",
    "P-026": "source_title_requires_chinese_event_title",
    "P-017": "stale_source_date",
    "P-033": "stale_source_date",
    "P-035": "company_profile_without_dated_event",
    "P-042": "explainer_without_commercial_event",
    "P-055": "research_prototype_without_commercial_event",
    "P-056": "missing_source_material",
  };
  for (const [poolRef, expectedIssue] of Object.entries(rejected)) {
    assert.ok(
      issuesFor(poolRef).some((issue) => issue.includes(expectedIssue)),
      `${poolRef} should be rejected with ${expectedIssue}; got ${issuesFor(poolRef).join(", ")}`,
    );
  }

  for (const poolRef of ["P-001", "P-012", "P-043"]) {
    const spec = normalizeSignalSpec(specFor(poolRef));
    const markdown = signalCard(spec, section(poolRef));
    const details = cardDetailSections(markdown);
    const normalized = Object.values(details).map(normalizedDetail);
    assert.ok(normalized.every(Boolean), `${poolRef} must render all four public detail fields`);
    assert.equal(new Set(normalized).size, normalized.length, `${poolRef} public detail fields must be distinct: ${JSON.stringify(details)}`);
    assert.notEqual(normalizedDetail(details["新闻事实"]), normalizedDetail(spec.title), `${poolRef} news fact must not repeat the title`);
  }

  console.log(JSON.stringify({ ok: true, date, fixture: "business-signal-card-editorial-quality" }, null, 2));
}

function runCoreRecallRegressionFixtures() {
  assert.equal(date, "2026-07-12", "core recall fixtures are pinned to the 2026-07-12 production Pool");
  const sections = poolSections();
  const section = (poolRef) => {
    const found = sections.get(poolRef);
    assert.ok(found, `${poolRef} must exist in the production Pool fixture`);
    return found;
  };
  const issuesFor = (poolRef) => autoSignalEligibilityIssues(section(poolRef));
  const specFor = (poolRef) => {
    const diagnostics = {};
    const spec = autoSignalSpec(poolRef, section(poolRef), Number(poolRef.replace("P-", "")), diagnostics);
    return { spec, diagnostics };
  };

  const microsoftResearchLaunchFixture = [
    "## P-998｜微软研究院推出开源可视化中间语言 Flint",
    "- source_url: https://www.ithome.com/0/975/816.htm",
    "- key_excerpts: 微软研究院与中国人民大学 IDEAS Lab 联合推出开源可视化中间语言 Flint。",
  ].join("\n");
  assert.equal(companyFromSection(microsoftResearchLaunchFixture), "Microsoft Research", "Microsoft Research launches must keep a usable organization subject");
  const hardwareCompanyFixtures = [
    [
      "## P-997｜Flex and Cerebras Expand Partnership to Scale American Manufacturing of Cerebras AI Supercomputers",
      "- source_url: https://www.prnewswire.com/news-releases/flex-and-cerebras-expand-partnership.html",
    ].join("\n"),
    [
      "## P-996｜Simplexity Robotics Ships 100 i7 Pro Robots to Production Lines",
      "- source_url: https://robotsbeat.com/simplexity-robotics-production-deployment/",
    ].join("\n"),
    [
      "## P-995｜微软：Windows 团队正全面利用 AI 挖掘漏洞",
      "- source_url: https://www.ithome.com/0/976/101.htm",
      "- key_excerpts: Windows 团队使用 MDASH 分析漏洞。",
    ].join("\n"),
  ];
  assert.equal(companyFromSection(hardwareCompanyFixtures[0]), "Flex / Cerebras", "partnership titles must preserve both named companies");
  assert.equal(companyFromSection(hardwareCompanyFixtures[1]), "Simplexity Robotics", "trade-media case titles must preserve the subject company instead of the publisher");
  assert.equal(companyFromSection(hardwareCompanyFixtures[2]), "Microsoft / Windows", "Chinese product workflow titles must preserve the company and product organization");
  assert.equal(companyFromSection("## P-994｜We've raised $12.5M to build state-of-the-art Web Search for agents\n- source_url: https://seltz.ai/blog/seed-round-announcement"), "Seltz", "first-person official funding posts must resolve the company from the original domain");
  assert.equal(
    publicTitleForAutoSignal({ type: "funding", company: "Seltz", sourceEventTitle: "We've raised $12.5M to build state-of-the-art Web Search for agents", amount: "1250 万美元" }),
    "Seltz 融资 1250 万美元，用于为智能体构建先进 Web Search",
    "English first-person funding titles with product-purpose payload must preserve the source-title translation",
  );
  assert.equal(
    publicTitleForAutoSignal({ type: "funding", company: "Monogram", sourceEventTitle: "Monogram Raises $40M Seed for Visual AI Interface", amount: "4000 万美元", translatedTitle: "Monogram 完成 4000 万美元 种子轮融资，用于 Visual AI Interface" }),
    "Monogram 完成 4000 万美元 种子轮融资，用于 Visual AI Interface",
    "funding titles must keep reviewed source-title translations ahead of company-amount templates",
  );
  assert.equal(
    sourceBackedChineseFact("The last time search was reinvented, the consumer was a person typing a few words into a box."),
    "上一代网页搜索主要面向在输入框中键入少量关键词的人类用户。",
    "English source points must be localized before they enter a public Card",
  );
  assert.equal(
    sourceBackedChineseFact("Write actions on external sites are screened by classifiers, and purchases or account creations need user approval."),
    "外部网站写入操作会经过分类器筛查，购买或创建账户仍需用户批准。",
    "supporting workflow constraints must remain distinct from the launch fact",
  );
  assert.equal(
    sourceBackedChineseFact("The product generates an entire interactive interface -- a map, a menu, a dynamic dashboard -- in response to a query, rather than returning a block of text like a typical chatbot."),
    "Monogram 的产品会根据查询生成地图、菜单或动态仪表盘等完整交互界面，而非只返回文本。",
    "funding Cards must preserve a distinct source-backed product fact",
  );
  assert.equal(
    sourceBackedChineseFact("New manufacturing lines in Milpitas, California will support an anticipated 7x increase in production of Cerebras CS-3 systems."),
    "Flex 在加州米尔皮塔斯新增制造产线，预计 Cerebras CS-3 系统产量将提升 7 倍。",
    "capacity expansion facts must be localized from the source sentence",
  );
  assert.equal(
    sourceBackedChineseFact("The 100 units were distributed across multiple deployment environments rather than delivered to a single customer."),
    "这 100 台机器人被分配到多个部署环境，而非交付给单一客户。",
    "deployment distribution facts must be distinct from the translated title",
  );
  assert.equal(
    sourceBackedChineseFact("Supermicro Simplifies Edge AI Deployments with Validated Kubernetes Appliances with Red Hat and Everpure"),
    "Supermicro 于 7 月 8 日发布与 Red Hat、Everpure 合作验证的 Kubernetes 边缘 AI 一体机；设备预装软硬件并由 Supermicro 交付客户。",
    "official-source Cards must use a source-backed event fact rather than repeat the localized title",
  );
  assert.equal(sourcePointReadyForPublic("Bounded direct-source recall from QC-reviewed original evidence: fixture"), false, "internal recall diagnostics must not enter public Card details");
  assert.equal(sourcePointLooksSplitFragment(", July 8, 2026 — Super Micro Computer, Inc."), true, "dateline fragments must not become visible excerpts");

  const consumerGameFixture = [
    "## P-997｜AI 策略模拟游戏登陆 Steam，国区售价 42 元",
    "- source_url: https://example.com/steam-game",
    "- key_excerpts: 独立 AI 游戏现已登陆 Steam，玩家可通过语音下达政令。",
  ].join("\n");
  assert.equal(isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(consumerGameFixture), true, "consumer AI games must remain backend-only without enterprise evidence");

  const commentaryFixture = [
    "## P-996｜芯片板块波动引担忧，业内高管称 AI 需求依然强劲",
    "- source_url: https://example.com/ai-demand-commentary",
    "- key_excerpts: 多位行业高管表示算力需求依然强劲。",
  ].join("\n");
  assert.equal(isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(commentaryFixture), true, "market commentary without a dated company action must not become a Card");

  const guideFixture = [
    "## P-994｜循环工程指南：让 AI 智能体自主执行 ML 研究循环",
    "- source_url: https://example.com/guide-to-loop-engineering",
    "- key_excerpts: 本指南解释如何使用两个研究项目搭建自动迭代循环。",
  ].join("\n");
  assert.equal(isExplainerWithoutCommercialEvent(guideFixture), true, "Chinese guides without a separate commercial event must remain backend-only");

  assert.ok(
    countHan(sourceBackedChineseFact("Every app you build now runs on TSK-1, the new intelligence behind every workspace.", { company: "Taskade" })) >= 12,
    "Card ingestion must normalize usable Chinese facts from captured English event excerpts",
  );
  assert.equal(
    sourcePointReadyForPublic("原文称，Every pricing change was a deployment."),
    false,
    "an untranslated English fact with a Chinese wrapper must not count as public Chinese fact material",
  );
  const temporaryLimitFixture = [
    "## P-993｜OpenAI Codex 与 ChatGPT Work 暂时取消订阅 5 小时使用限制",
    "- source_url: no-url",
    "- key_excerpts: 社区用户反馈用量窗口暂时消失。",
  ].join("\n");
  assert.equal(
    isLowValueConsumerOrPlatformPolicyWithoutBusinessAi(temporaryLimitFixture),
    true,
    "temporary usage-window resets without a durable commercial change must remain backend-only",
  );
  assert.equal(
    sourceEventTitleCanBackAutoCard("Ep 29: Salesforce AI CEO on How Gucci Uses AI"),
    false,
    "old podcast episode titles must not become high-priority Card recall blockers",
  );

  const technicalTrendLaunchFixture = [
    "## P-995｜上纬新材发布全球首款可变形个人机器人启元 T1",
    "- source_url: https://example.com/qiyuan-t1-launch",
    "- evidence_object_type: event",
    "- event_evidence: true",
    "- evidence_object_usable: true",
    "- evidence_strength: rich_evidence",
    "- raw_qc_decision: allow",
    "- raw_qc_downstream_use: eligible_after_qc",
    "- importance_type: important_technical_trend",
    "- importance_score: 5",
    "- key_excerpts: 上纬新材正式发布可变形个人机器人启元 T1。",
  ].join("\n");
  assert.ok(
    !autoSignalEligibilityIssues(technicalTrendLaunchFixture).some((issue) => issue.includes("technical_trend_is_context_not_signal_card")),
    "a confirmed product launch must override a stale technical-trend importance label",
  );

  const undatedLaunchFixture = [
    "## P-992｜Launch YC: Example - AI Agent Platform",
    "- source_url: https://www.ycombinator.com/launches/example",
    "- evidence_object_type: event",
    "- event_evidence: true",
    "- evidence_object_usable: true",
    "- importance_type: important_product_or_service",
    "- pool_routes: core_pool, emerging_pool",
    "- key_excerpts: Example launches an AI agent platform.",
  ].join("\n");
  assert.notEqual(
    promotePriorityForIssues(undatedLaunchFixture, ["evidence_quality:missing_source_date", "evidence_quality:missing_chinese_fact_translation"]),
    "high",
    "an undated launch/profile page must not block the batch as a high-priority recall repair",
  );

  const unresolvedDiscoveryFixture = [
    "## P-991｜火山引擎发布 Seedance 2.5，AI 视频生成支持 30 秒直出",
    "- source_url: https://mp.weixin.qq.com/s/example",
    "- source_role: discovery_source",
    "- evidence_object_type: event",
    "- event_evidence: true",
    "- evidence_strength: traceable_summary",
    "- raw_qc_decision: allow_with_degradation",
    "- extraction_quality: failed",
    "- has_full_text: false",
    "- pool_routes: emerging_pool, watchlist",
    "- importance_type: important_product_or_service",
    "- importance_score: 4",
    "- key_excerpts: Seedance 2.5 将支持 30 秒视频生成。",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(unresolvedDiscoveryFixture).some((issue) => /discovery_source_not_resolved/iu.test(issue)),
    "an explicit discovery_source role must not bypass source auditability",
  );
  assert.notEqual(
    promotePriorityForIssues(unresolvedDiscoveryFixture, ["evidence_quality:missing_source_material", "source_auditability:discovery_source_not_resolved"]),
    "high",
    "a discovery-only summary without readable source evidence must not block release as confirmed high-value recall",
  );

  const privacyPledgeFixture = [
    "## P-991｜《智能体个人信息保护自律公约》发布，31 家企业签署",
    "- source_url: https://example.com/ai-privacy-pledge",
    "- evidence_object_type: event",
    "- event_evidence: true",
    "- key_excerpts: 行业协会发布个人信息保护自律公约，多家平台现场签署。",
  ].join("\n");
  assert.equal(
    isNonCommercialPolicyOrEthicsSignal(privacyPledgeFixture),
    true,
    "a voluntary privacy pledge without a product, funding, procurement or customer event must remain backend context",
  );

  const fundingDatabaseFixture = [
    "## P-990｜MYTH AI Design Generator Raises $300K",
    "- source: Signalbase funding database",
    "- source_url: https://www.trysignalbase.com/news/funding/myth-ai-design-generator-raises-300k",
    "- evidence_object_type: event",
    "- event_evidence: true",
  ].join("\n");
  assert.equal(
    isGenericReportOrListSection(fundingDatabaseFixture),
    true,
    "a funding-database profile must remain backend discovery until the original announcement or credible report is resolved",
  );

  const talpFundingFixture = [
    "## P-989｜Meet Talp: AI startup with Turkish roots raising $20M pre-seed valuation to simulate customers with AI personas — TFN",
    "- source_url: https://techfundingnews.com/meet-talp-ai-startup-with-turkish-roots-raising-20m-pre-seed-valuation-to-simulate-customers-with-ai-personas/",
  ].join("\n");
  assert.equal(companyFromSection(talpFundingFixture), "Talp", "funding article chrome must not become the signal owner");
  assert.equal(fundingCompletionAmountMismatch("Talp宣布完成2000万美元种子前轮融资。", 20), false);
  assert.equal(fundingCompletionAmountMismatch("Talp宣布完成5000万美元A轮融资。", 20), true);
  assert.equal(fundingCompletionMissingAmount("Monogram宣布完成融资。", 40), true);
  assert.equal(sourcePointLooksPageChrome("Meet Talp ... https://example.com ### Meet another company"), true);
  assert.equal(
    translatedSourcePoint(
      "BARCELONA, June 17, 2026 — NeuralTrust, the platform to secure AI agents, today announced a $20 million seed round.",
      "funding",
      { company: "NeuralTrust", type: "funding", sourceAmountMillions: 20 },
    ),
    "NeuralTrust 获得 2000 万美元 种子轮融资。",
    "a source-matched funding sentence must produce a distinct Chinese fact",
  );
  assert.equal(
    translatedSourcePoint(
      "GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months.",
      "case",
      { company: "GitHub", type: "case" },
    ),
    "GitHub 在 1.5 万多个代码库中发现超过 2 万条秘密扫描告警，并在九个月内清零未处理告警。",
    "a source-backed English case metric must normalize into a usable Chinese public fact",
  );

  const mowitoFundingFixture = [
    "## P-987｜Announcing Our Investment in Mowito: Physical AI for Robot Arms in Manufacturing - Version One Ventures",
    "- source_url: https://versionone.vc/announcing-our-investment-in-mowito-physical-ai-for-robot-arms-in-manufacturing/",
    "- importance_type: important_funding",
    "- pool_routes: core_pool, emerging_pool",
    "- usable_for: signal_card_candidate, relationship_graph_input",
    "- key_excerpts: We’re excited to share that Mowito has raised a $3M pre-seed round, led by Version One Ventures, with participation from All In Capital, Unisol, and iSeed.",
  ].join("\n");
  assert.equal(companyFromSection(mowitoFundingFixture), "Mowito", "investment-blog funding posts must resolve the portfolio company, not the investor domain");
  assert.ok(
    countHan(sourceBackedChineseFact("We’re excited to share that Mowito has raised a $3M pre-seed round, led by Version One Ventures, with participation from All In Capital, Unisol, and iSeed.")) >= 12,
    "Mowito funding evidence must normalize into a Chinese source-backed fact",
  );

  const siriHandsOnFixture = [
    "## P-986｜Siri AI is already changing how I use my iPhone",
    "- source_url: https://www.theverge.com/tech/964714/siri-ai-public-beta-preview-ios-27-hands-on",
    "- source: The Verge AI",
    "- importance_type: important_product_or_service",
    "- pool_routes: core_pool, emerging_pool",
    "- usable_for: signal_card_candidate, relationship_graph_input",
    "- key_excerpts: Its full capabilities require heavy developer support, so the public beta feels more like a glimpse at the future.",
  ].join("\n");
  assert.equal(isSecondaryProductReviewOrRumor(siriHandsOnFixture), true, "hands-on product reviews must not become high-priority recall blockers");

  const watchlistOnlyFixture = [
    "## P-985｜STEPX Neo product discussion",
    "- source_url: https://example.com/stepx-neo",
    "- importance_type: important_market_structure",
    "- pool_routes: watchlist",
    "- usable_for: watchlist",
  ].join("\n");
  assert.deepEqual(
    classifiedAutoSignalSpecFailureIssues(watchlistOnlyFixture, "company_name_unusable"),
    ["business_signal_scope:not_routed_for_signal_card_candidate"],
    "watchlist-only items must be classified instead of blocking as auto_signal_spec_null",
  );

  const routedViewpointFixture = [
    "## P-988｜黄仁勋：AI 与吸尘器同样都是工具，不要过度拟人化",
    "- evidence_object_type: supporting_article",
    "- evidence_object_usable: false",
    "- event_evidence: false",
    "- pool_routes: index_only",
    "- usable_for: viewpoint",
    "- importance_type: important_vertical_solution",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(routedViewpointFixture).some((issue) => /viewpoint_without_confirmed_commercial_event/iu.test(issue)),
    "a routed viewpoint without a confirmed commercial event must be rejected before Card spec generation",
  );

  const nadellaCriticismFixture = [
    "## P-040｜微软CEO纳德拉批评AI模型公司双标：一边主张合理使用数据，一边限制他人蒸馏",
    "- evidence_object_type: regulatory_or_procurement",
    "- evidence_object_usable: true",
    "- event_evidence: true",
    "- pool_routes: core_pool",
    "- usable_for: viewpoint, case, business_change, signal_card_candidate",
    "- importance_type: important_market_structure",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(nadellaCriticismFixture).some((issue) => /viewpoint_without_confirmed_commercial_event/iu.test(issue)),
    "an executive criticism remains viewpoint context even when upstream labels the speech as event evidence",
  );

  const publicBudgetFixture = [
    "## P-065｜韩国编制2027财年800万亿韩元创纪录预算，AI芯片税收成主要来源",
    "- source_url: https://example.com/korea-government-budget",
    "- event_evidence: true",
    "- pool_routes: watchlist",
    "- importance_type: important_technical_trend",
    "- key_excerpts: 韩国政府宣布编制财政预算，资金来源主要依靠 AI 芯片产业带来的税收增长。",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(publicBudgetFixture).some((issue) => /non_commercial_policy_or_ethics_signal/iu.test(issue)),
    "a public fiscal budget must remain context rather than becoming a company product Card through a generic announcement verb",
  );

  const nonAiFeedFalsePositiveFixture = [
    "## P-060｜How GitHub used secret scanning to reach inbox zero",
    "- source: GitHub Blog AI",
    "- source_url: https://github.blog/security/application-security/how-github-used-secret-scanning-to-reach-inbox-zero/",
    "- event_evidence: true",
    "- pool_routes: core_pool",
    "- importance_type: important_case",
    "- key_excerpts: GitHub found more than 20,000 secret scanning alerts across 15,000 repositories and reached zero open alerts nine months later.",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(nonAiFeedFalsePositiveFixture).some((issue) => /source_event_missing_ai_anchor/iu.test(issue)),
    "an AI-labelled feed must not turn an event with no AI evidence in its title or body into an AI business-signal Card",
  );

  const magicOsRumorFixture = [
    "## P-987｜荣耀 MagicOS 11 爆料：内置 YOYO Claw，支持自定义 AI 大模型",
    "- source_url: https://example.com/magicos-11-rumor",
    "- importance_type: important_product_or_service",
    "- key_excerpts: 博主今日爆料 MagicOS 11 更新计划。",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(magicOsRumorFixture).some((issue) => /unconfirmed_product_rumor_or_plan/iu.test(issue)),
    "a rumor marker anywhere in the title must keep an unconfirmed product update out of formal Cards",
  );

  const lyzrUnclosedRoundFixture = [
    "## P-986｜Lyzr's AI agent ran its own $100M Series B fundraise",
    "- source_url: https://example.com/lyzr-fundraise-process",
    "- importance_type: important_funding",
    "- key_excerpts: The raise is still coming together and is on track rather than closed.",
  ].join("\n");
  assert.ok(
    autoSignalEligibilityIssues(lyzrUnclosedRoundFixture).some((issue) => /funding_round_not_confirmed_closed/iu.test(issue)),
    "a fundraising process that is not confirmed closed must not become a completed funding Card",
  );
  assert.equal(
    publicationDateFromRawData({
      published_at: "2026-07-07T15:12:40.195Z",
      full_text: "FuriosaAI partners with Broadcom\nNews\nMay 27, 2026\nSummary",
    }).toISOString().slice(0, 10),
    "2026-05-27",
    "captured source text must override a provider-inferred publication date before freshness gating",
  );
  assert.equal(
    fundingEventIdentityKey("Thenextweb", "Lyzr used its own AI agent to help raise a $100mn round. The company described it as a Series B."),
    fundingEventIdentityKey("AI Chat Daily", "Lyzr's AI agent ran its own $100M Series B fundraise"),
    "alternate-source coverage of the same company, amount, and round must share a historical funding event key",
  );
  assert.equal(
    fundingEventIdentityKey("Lyzr AI", "Lyzr AI Raises $100 Million Series B"),
    fundingEventIdentityKey("Lyzr", "Lyzr's AI agent ran its own $100M Series B fundraise"),
    "optional AI company suffixes must not split the same funding event across source clusters",
  );
  const lyzrConflictingSections = new Map([
    ["P-985", [
      "## P-985｜Lyzr AI Raises $100 Million Series B",
      "- importance_type: important_funding",
      "- key_excerpts: A secondary article says Lyzr AI closed a $100 million Series B.",
    ].join("\n")],
    ["P-986", lyzrUnclosedRoundFixture.replace("important_funding", "supporting_signal")],
  ]);
  assert.ok(
    unconfirmedFundingEventKeysForSections(lyzrConflictingSections).has(fundingEventIdentityKeyForSection(lyzrConflictingSections.get("P-985"))),
    "one unconfirmed source must conflict the whole same-company, amount, and round funding cluster",
  );

  const positiveFailures = [];
  for (const poolRef of ["P-019", "P-020", "P-033", "P-056", "P-060"]) {
    const issues = issuesFor(poolRef);
    const { spec, diagnostics } = specFor(poolRef);
    if (issues.length || !spec) positiveFailures.push(`${poolRef}: ${issues.join(", ") || diagnostics.reason || "unknown"}`);
    if (spec?.sourcePoints?.some(sourcePointLooksPageChrome)) positiveFailures.push(`${poolRef}: source points contain page navigation chrome`);
    if (poolRef === "P-060" && spec?.sourcePoints?.some(sourcePointLooksSplitFragment)) positiveFailures.push(`${poolRef}: model version was split across source points`);
  }
  assert.deepEqual(positiveFailures, [], `confirmed high-value product events must be recalled:\n${positiveFailures.join("\n")}`);

  const bunSpec = normalizeSignalSpec(autoSignalSpec("P-051", section("P-051"), 51));
  const bunDetails = cardDetailSections(signalCard(bunSpec, section("P-051")));
  assert.ok(!sourcePointLooksSplitFragment(bunDetails["可见原文片段"]), "P-051 visible excerpt must not begin at a split decimal/currency fragment");
  assert.ok(!sourcePointLooksPageChrome(bunDetails["可见原文片段"]), "P-051 visible excerpt must not contain page navigation chrome");

  const rejected = {
    "P-003": /research_prototype_without_commercial_event/iu,
    "P-021": /job_listing_not_formal_signal_card/iu,
    "P-022": /viewpoint_without_confirmed_commercial_event/iu,
    "P-024": /executive_dispute_without_commercial_event/iu,
    "P-025": /unconfirmed_product_rumor_or_plan/iu,
    "P-054": /research_benchmark_without_commercial_event/iu,
  };
  for (const [poolRef, expectedIssue] of Object.entries(rejected)) {
    const issues = issuesFor(poolRef);
    assert.ok(issues.some((issue) => expectedIssue.test(issue)), `${poolRef} must remain backend-only; got ${issues.join(", ")}`);
  }

  console.log(JSON.stringify({ ok: true, date, fixture: "business-signal-core-recall" }, null, 2));
}

if (args.get("core-recall-regression-fixtures") === "true") runCoreRecallRegressionFixtures();
else if (args.get("quality-regression-fixtures") === "true") runQualityRegressionFixtures();
else main();
