import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
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
const signalTarget = args.has("signal-target")
  ? nonNegativeInt(args.get("signal-target"), Number.POSITIVE_INFINITY)
  : Number.POSITIVE_INFINITY;
const generateTrendCandidates = args.get("trend-candidates") === "true";

const signalSpecs = {
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
      evidenceBoundary: "材料确认融资和产品方向，真实客户规模和部署深度仍需后续补充。",
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
      whyWatch: "大额融资说明资本仍在押注企业 Agent 的跨市场交付，而不只是模型能力。",
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
      whyWatch: "资本继续押注企业 Agent，但材料把重点放在安全、人类监督和组织知识沉淀，而不是单纯模型能力。",
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
      title: "Netomi 融资 1.1 亿美元，押注高风险客户体验智能体",
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

const opinionSpecs = {
  "2026-05-20": [
    {
      id: "OPN-20260520-01",
      stableId: "BP-20260520-33",
      slug: "aaron-levie-token-costs-will-become-enterprise-ai-topic",
      person: "Aaron Levie",
      organization: "Box",
      roleType: "executive_view",
      title: "Aaron Levie：Token 成本会成为企业 AI 的核心议题",
      sourceUrl: "https://x.com/levie/status/2056965292753146019",
      publishedAt: "2026-05-20",
      originalQuote: "Token costs",
      originalTranslation: "Token 成本。",
      interpretation: "这条观点说明企业 AI 采用正在从能力兴奋转向预算、用量分配和团队权限管理。",
      factBoundary: "这是人物观点，只能证明 Aaron Levie 发表了该判断；其中关于企业 CIO 讨论的事实仍需更多来源交叉确认。",
    },
  ],
  "2026-05-21": [
    {
      id: "OPN-20260521-01",
      stableId: "BP-20260521-42",
      slug: "sam-altman-customers-ask-for-capacity-certainty",
      person: "Sam Altman",
      organization: "OpenAI",
      roleType: "executive_view",
      title: "Sam Altman：客户开始要求提前锁定算力容量",
      sourceUrl: "https://x.com/sama/status/2056827105401614656",
      publishedAt: "2026-05-19",
      originalQuote: "certainty on capacity",
      originalTranslation: "对算力容量的确定性。",
      interpretation: "这条观点把企业 AI 采购从单次调用价格推向一年到三年容量承诺和供给保障。",
      factBoundary: "这是人物观点，不单独证明客户需求规模；涉及客户行为时应等待公司合同、产品或案例材料补证。",
    },
  ],
  "2026-05-22": [
    {
      id: "OPN-20260522-01",
      stableId: "BP-20260522-07",
      slug: "aaron-levie-fdes-will-remain-while-agents-change-workflows",
      person: "Aaron Levie",
      organization: "Box",
      roleType: "executive_view",
      title: "Aaron Levie：Agent 落地会让 FDE 这类角色长期存在",
      sourceUrl: "https://x.com/levie/status/2057315272156135501",
      publishedAt: "2026-05-21",
      originalQuote: "directly impact the underlying workflows",
      originalTranslation: "直接影响底层工作流。",
      interpretation: "这条观点把 Agent 落地从技术部署转向工作流改造和变更管理，能解释为什么企业 AI 仍需要懂现场的人。",
      factBoundary: "这是人物观点，只能证明 Aaron Levie 发表了该判断；关于岗位需求和客户采用规模，仍需招聘、客户案例或企业预算材料补证。",
    },
  ],
  "2026-05-23": [
    {
      id: "OPN-20260523-01",
      stableId: "BP-20260523-07",
      slug: "aaron-levie-enterprises-need-ai-finance-programs",
      person: "Aaron Levie",
      organization: "Box",
      roleType: "executive_view",
      title: "Aaron Levie：企业需要用新财务机制管理 AI 成本分层",
      sourceUrl: "https://x.com/levie/status/2057663408376516703",
      publishedAt: "2026-05-22",
      originalQuote: "Enterprises will need to put in programs, new finance teams, and technology solutions to manage this all.",
      originalTranslation: "企业需要建立相应机制，配置新的财务团队和技术方案，来管理这一切。",
      interpretation: "这条观点把 AI 成本问题从 token 价格推进到企业管理机制：由哪个团队审批、哪个团队控制用量、哪类预算承担不同模型层级的成本。",
      factBoundary: "这是人物观点，只能证明 Aaron Levie 发表了该判断；关于企业实际预算、团队设置和采购行为，还需要公司案例或采购材料补证。",
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
      sourceTypes: ["公司发布", "融资新闻", "客户案例", "builder 观点"],
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
      sourceTypes: ["公司发布", "融资新闻", "客户案例", "builder 观点"],
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
        index.set(fingerprint, { file, id: yamlValue(text, "id"), title, type, owner });
      }
    }
  }
  return index;
}

function findExistingSignalCard(index, spec, section) {
  for (const fingerprint of signalFingerprints(spec, section)) {
    const existing = index.get(fingerprint);
    if (existing) return existing;
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

function value(section, key) {
  return section.match(new RegExp(`^- ${key}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^`|`$/g, "") || "";
}

function nonNegativeInt(raw, fallback) {
  const value = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, value);
}

function poolTitle(section) {
  const heading = section.match(/^##\s+P-\d+(.*)$/mu)?.[1] || "";
  return heading.replace(/^[^\p{L}\p{N}$]+/u, "").trim();
}

function textForInference(section) {
  return [
    poolTitle(section),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
    value(section, "missing_information"),
  ].join(" ");
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
    .replace(/^the\s+/iu, "")
    .replace(/\s+\|\s+.*$/u, "")
    .replace(/\s+-\s+.*$/u, "")
    .trim()
    .slice(0, 56);
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
    ]);
    return known.get(primary) || primary.replace(/(^|-)([a-z])/gu, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);
  } catch {
    return "";
  }
}

function isWeakCompanyName(value = "") {
  const text = String(value || "").trim();
  if (!text) return true;
  const hanChars = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  return text.length > 42
    || hanChars > 18
    || /[？?。；;！!]/u.test(text)
    || /(报告|研究|论文|引用|大型语言模型|替代的搜索引擎|right answers|state of)/iu.test(text);
}

function companyFromSection(section) {
  const title = poolTitle(section);
  const text = textForInference(section);
  const sourceUrl = value(section, "source_url");
  const specialCases = [
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
  const patterns = [
    /\bstartup\s+([A-Z][A-Za-z0-9.&-]+)\s+(?:raises|raised|said|announced)\b/iu,
    /\bseed\s+for\s+([A-Z][A-Za-z0-9.&-]+)\s+to\b/iu,
    /\b([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:on\s+\w+\s+)?(?:today\s+)?(?:announced|said|revealed|has raised|raised|will use|pulls in|pitches)\b/u,
    /\b([A-Z][A-Za-z0-9.&-]*(?:\.ai)?)(?:\s+Inc\.)?,\s+a\s+/u,
    /#\s*([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})\s+(?:raises|raised|pulls|launches|announces|deploys|uses)\b/iu,
    /^(.+?)\s+(?:raises|raised|pulls in|launches|announces|deploys|uses|wins|partners)\b/iu,
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
  if (/\b(raises|raised|funding|seed|series|round|pulls in|investing|ventures?)\b|融资|种子轮|A轮|B轮/iu.test(text)) return "funding";
  if (/c\.h\.\s*robinson|snaplogic|pwc|deployment|deploys|automates|orders automated|customer case/iu.test(`${text} ${sourceUrl}`)) return "case";
  if (/aws\.amazon\.com\/marketplace|github\.com|marketplace|vscode|superclaude|conversion agents|deepagents|api|sdk|platform/iu.test(`${text} ${sourceUrl}`)) return "product_service";
  if (value(section, "importance_type") === "important_case" || value(section, "importance_type") === "important_vertical_solution") return "case";
  if (value(section, "importance_type") === "important_product_or_service" || /\b(launch|release|introduced|deploy|marketplace|platform|api)\b|发布|推出|上线/iu.test(text)) return "product_service";
  return "case";
}

function dirForSignalType(type) {
  if (type === "funding") return "funding";
  if (type === "product_service") return "product-service";
  return "case";
}

function isNonCommercialPolicyOrEthicsSignal(section) {
  const text = [
    poolTitle(section),
    value(section, "source"),
    value(section, "source_url"),
    value(section, "key_excerpts"),
    value(section, "evidence_seed"),
  ].join(" ");
  return /(教皇|通谕|梵蒂冈|人类尊严|深刻的人性|公共伦理|Pope|Vatican|encyclical|humanitas|human dignity)/iu.test(text);
}

function isEligibleAutoSignal(section) {
  const sourceUrl = value(section, "source_url");
  const sourceLevel = value(section, "source_level");
  const text = `${poolTitle(section)} ${sourceUrl} ${value(section, "source_type")}`;
  return /core_pool/u.test(value(section, "pool_routes"))
    && value(section, "raw_qc_decision") === "allow"
    && value(section, "has_full_text") === "true"
    && /^(S|A|B)$/u.test(sourceLevel)
    && sourceUrl
    && sourceUrl !== "no-url"
    && !isNonCommercialPolicyOrEthicsSignal(section)
    && !/(learn\.microsoft\.com|\/docs?\/|documentation|README|readme-ov-file|model page|product catalog|why we(?:'|’)re investing)/iu.test(text);
}

function autoSignalSpec(poolRef, section, index) {
  const text = textForInference(section);
  const type = inferSignalType(section);
  const company = companyFromSection(section);
  let scenario = scenarioFromText(text);
  if (/^(BentoCloud|Microsoft Foundry)$/u.test(company)) {
    scenario = "模型部署和算力调用";
  }
  const amount = extractAmount(text);
  const prefix = `SIG-${date.replaceAll("-", "")}-A${String(index).padStart(2, "0")}`;
  const title = type === "funding"
    ? `${company} 融资，押注${scenario}`
    : type === "product_service"
      ? `${company} 发布面向${scenario}的 AI 能力`
      : `${company} 部署 AI 到${scenario}`;
  const eventLine = type === "funding"
    ? `${company} 宣布${amount ? `${amount} ` : ""}融资，材料把资金用途指向${scenario}。`
    : type === "product_service"
      ? `${company} 发布新的 AI 能力，材料显示它面向${scenario}。`
      : `${company} 把 AI 放进${scenario}，材料显示它已经对应到具体任务或客户环境。`;
  return {
    id: prefix,
    poolRef,
    type,
    dir: dirForSignalType(type),
    slug: `${slugify(company)}-${slugify(scenario)}-${poolRef.toLowerCase()}`,
    company,
    title,
    eventLine,
    whyWatch: `这条材料把 AI 从通用能力拉回到${scenario}，可以观察客户是否愿意为流程结果、交付速度或团队协作付费。`,
    businessMeaning: `后续判断重点不是模型参数，而是客户流程、采购预算、交付责任和团队岗位是否因此调整。`,
    evidenceBoundary: "当前材料保留了原始链接、全文和哈希；真实客户规模、长期留存和效果指标仍需要继续补证。",
    watchWindow: "未来 30 到 90 天观察是否出现客户名单、部署指标、定价变化或二次融资信号。",
    autoGenerated: true,
  };
}

function autoSignalsFromPool(sections, explicitSpecs) {
  if (!autoSignalEnabled) return [];
  const selectedPoolRefs = new Set(explicitSpecs.map((spec) => spec.poolRef));
  const need = Math.max(0, signalTarget - explicitSpecs.length);
  if (!need) return [];
  const autoSpecs = [];
  let index = 1;
  for (const [poolRef, section] of sections) {
    if (selectedPoolRefs.has(poolRef)) continue;
    if (!isEligibleAutoSignal(section)) continue;
    autoSpecs.push(autoSignalSpec(poolRef, section, index));
    selectedPoolRefs.add(poolRef);
    index += 1;
    if (autoSpecs.length >= need) break;
  }
  return autoSpecs;
}

function yamlList(items) {
  if (!items?.length) return "[]";
  return `[${items.map((item) => `"${item}"`).join(", ")}]`;
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function sourceTagFromLevel(sourceLevel) {
  if (sourceLevel === "S") return "source-first-party";
  if (sourceLevel === "A") return "source-business-media";
  if (sourceLevel === "B") return "source-industry-data";
  return "source-social";
}

function inferredTagsFromText(text = "") {
  const tags = {
    track: ["track-ai-agent"],
    function: [],
    scenario: [],
    customer: [],
    evidence: [],
    stage: ["stage-watch"],
    region: [],
    source: [],
    opinion: [],
  };
  const add = (group, ...ids) => tags[group].push(...ids);
  const has = (pattern) => pattern.test(text);

  if (has(/coding|code|developer|github|sdk|api|工程|开发|编程/iu)) add("track", "track-ai-coding"), add("function", "function-engineering"), add("customer", "customer-developer-team");
  if (has(/workflow|agent|智能体|流程|enterprise|企业/iu)) add("track", "track-enterprise-workflow"), add("customer", "customer-enterprise");
  if (has(/data|snowflake|rag|知识库|数据/iu)) add("track", "track-enterprise-data"), add("scenario", "scenario-knowledge-base");
  if (has(/infra|inference|temporal|模型|推理|基础设施|算力/iu)) add("track", "track-ai-infra");
  if (has(/health|medical|clinical|医疗|医院|临床/iu)) add("track", "track-medical-ai"), add("customer", "customer-healthcare-provider"), add("scenario", "scenario-clinical-imaging");
  if (has(/procurement|bidding|采购|投标|招标/iu)) add("function", "function-procurement-bidding"), add("scenario", "scenario-bidding-response");
  if (has(/finance|财务|贷款|理赔|保险/iu)) add("function", "function-finance");
  if (has(/customer|service|客服|售后|工单|voice|语音/iu)) add("track", "track-ai-customer-service"), add("function", "function-customer-service"), add("scenario", "scenario-customer-ticket");
  if (has(/sales|销售/iu)) add("function", "function-sales"), add("scenario", "scenario-sales-briefing");
  if (has(/governance|permission|audit|security|治理|权限|审计|安全/iu)) add("track", "track-ai-governance"), add("scenario", "scenario-agent-governance");

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
    `  opinion: ${yamlList(tags.opinion)}`,
  ].join("\n");
}

function formalTagsForSignal(spec, sourceLevel) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.eventLine} ${spec.businessMeaning} ${spec.company}`);
  tags.evidence.push(spec.type === "funding" ? "evidence-funding" : spec.type === "case" ? "evidence-customer-adoption" : "evidence-product-launch");
  tags.source.push(sourceTagFromLevel(sourceLevel));
  if (spec.type === "funding") tags.stage.push("stage-rising");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function formalTagsForOpinion(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.interpretation} ${spec.organization}`);
  tags.scenario.push("scenario-frontier-opinion");
  tags.evidence.push("evidence-frontier-opinion");
  tags.source.push("source-social");
  if (/coding|code|developer|编程|开发|工程/iu.test(`${spec.title} ${spec.interpretation}`)) tags.opinion.push("opinion-ai-coding");
  else if (/infra|模型|推理|记忆|capacity|算力/iu.test(`${spec.title} ${spec.interpretation}`)) tags.opinion.push("opinion-model-infra");
  else if (/governance|安全|权限|治理/iu.test(`${spec.title} ${spec.interpretation}`)) tags.opinion.push("opinion-ai-safety-governance");
  else tags.opinion.push("opinion-agent-workflow");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function formalTagsForScene(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.industry} ${spec.role} ${spec.workflow} ${spec.changedStep}`);
  tags.evidence.push("evidence-customer-adoption");
  tags.stage.push("stage-watch");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function formalTagsForTrend(spec) {
  const tags = inferredTagsFromText(`${spec.title} ${spec.hypothesis} ${spec.sourceTypes?.join(" ") || ""}`);
  tags.evidence.push("evidence-customer-adoption");
  tags.stage.push("stage-rising");
  return Object.fromEntries(Object.entries(tags).map(([group, values]) => [group, uniq(values)]));
}

function signalCard(spec, section) {
  const rawRef = value(section, "raw_ref");
  const rawArchive = value(section, "raw_archive");
  const rawJson = value(section, "raw_json");
  const sourceUrl = value(section, "source_url");
  const sourceLevel = value(section, "source_level");
  const hash = value(section, "raw_full_text_hash");
  const extractionQuality = value(section, "extraction_quality");
  const importanceType = value(section, "importance_type");
  const importanceScore = value(section, "importance_score");

  return `---
id: ${spec.id}
type: signal_card
signal_type: ${spec.type}
title: "${spec.title}"
date: ${date}
status: published
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
frontend_copy_gate: passed
cardcopy_gate: passed
created_at: ${now}
updated_at: ${now}

raw_refs: ["${rawRef}"]
pool_refs: ["${spec.poolRef}"]
primary_raw:
  raw_ref: ${rawRef}
  raw_archive: "${rawArchive}"
  raw_json: "${rawJson}"
  source_url: "${sourceUrl}"
  full_text_hash: "${hash}"
  source_level: ${sourceLevel}
  extraction_quality: ${extractionQuality}
  has_full_text: true
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: ${importanceType}
  importance_score: ${importanceScore}

${formalTagsYaml(formalTagsForSignal(spec, sourceLevel))}

event: "${spec.eventLine}"
business_meaning: "${spec.businessMeaning}"
why_selected: "${spec.whyWatch}"
signal_owner: "${spec.company}"
watch_reason: "${spec.watchWindow}"

frontend:
  displayTitle: "${spec.title}"
  eventLine: "${spec.eventLine}"
  whyWatch: "${spec.whyWatch}"
  businessMeaning: "${spec.businessMeaning}"
  evidenceBoundary: "${spec.evidenceBoundary}"
  watchWindow: "${spec.watchWindow}"
  sourceLinks:
    - "${sourceUrl}"
---

# ${spec.title}

## 信号底稿

谁：${spec.company}。

做了什么：${spec.eventLine}

证据是什么：来源为 ${sourceUrl}，对应本地证据 ${rawRef}，材料已保留全文、哈希和出处。

缺什么：${spec.evidenceBoundary}

## 发生了什么

${spec.eventLine}

## 为什么值得看

${spec.whyWatch}

## 商业含义

${spec.businessMeaning}

## 证据边界

${spec.evidenceBoundary}

## 继续观察

${spec.watchWindow}
`;
}

function opinionCard(spec) {
  const translationReady = Boolean(String(spec.originalTranslation || "").trim());
  const isXSource = /\bx\.com\b|\btwitter\.com\b/iu.test(String(spec.sourceUrl || ""));
  const captureScope = isXSource ? "x_full_visible_text" : "visible_text";
  return `---
id: ${spec.id}
type: opinion_intake
title: "${spec.title}"
date: ${date}
status: draft
fact_draft_gate: passed
frontend_copy_gate: ${translationReady ? "passed" : "pending"}
cardcopy_gate: ${translationReady ? "skipped_intake_pending_rating" : "skipped_intake_translation_pending"}
created_at: ${now}
updated_at: ${now}

person_name: "${spec.person}"
organization: "${spec.organization}"
title_at_time: "${spec.organization}"
role_type: ${spec.roleType}
published_at: "${spec.publishedAt}"
collected_at: "${now}"
platform: follow-builders
original_url: "${spec.sourceUrl}"
canonical_url: "${spec.sourceUrl}"
language: en
asset_level: candidate
opinion_evidence_gate: opinion_captured
opinion_capture:
  raw_ref: ${spec.stableId}
  raw_archive: "01-SiteV2/content/05-frontier-opinions/${date}-opinion-candidates.md"
  source_url: "${spec.sourceUrl}"
  source_level: C
  source_volatility: high
  capture_scope: ${captureScope}
  evidence_level: community_signal
  has_visible_text: true
fact_claim_support:
  required: false
  status: 暂无公开补证
  supporting_raw_refs: []
  missing_information: []
high_impact: true
impact_reason: "${spec.interpretation}"
structured_claim: "${spec.interpretation}"
opinion_object: "企业 AI 采用"
opinion_tendency: watch
opinion_status: new
opinion_tier: archive
display_lane: archive_only
selection_reason: "入库初始状态，等待统一观点分级治理脚本评级。"
opinion_rating_score: 0
opinion_rating_version: 2026-05-22-v1
publish_status: internal_archive
translation_status: ${translationReady ? "translated" : "pending_translation"}
triggers_change_candidate: true
${formalTagsYaml(formalTagsForOpinion(spec))}
frontend:
  displayTitle: "${spec.title}"
  speakerLine: "${spec.person} / ${spec.organization}"
  originalQuote: "${spec.originalQuote}"
  originalTranslation: "${spec.originalTranslation || ""}"
  interpretation: "${spec.interpretation}"
  factBoundary: "${spec.factBoundary}"
  sourceLinks:
    - "${spec.sourceUrl}"
---

# ${spec.title}

## 观点底稿

谁：${spec.person}，${spec.organization}。

原文：见下方原文摘录。

观点说了什么：${spec.interpretation}

事实边界：${spec.factBoundary}

## 原文摘录

> ${spec.originalQuote}

中文翻译：${spec.originalTranslation || "待补中文翻译。"}

## 观澜解读

${spec.interpretation}

## 事实主张校验

${spec.factBoundary}
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
frontend_copy_gate: passed
cardcopy_gate: passed
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
frontend_copy_gate: passed
cardcopy_gate: passed
created_at: ${now}
updated_at: ${now}
trend_hypothesis: "${spec.hypothesis}"
supporting_changes: []
supporting_scenes: ["SCN-20260520-01", "SCN-20260521-01"]
source_types: ${yamlList(spec.sourceTypes)}
risk_boundary: "${spec.riskBoundary}"
follow_up_variables: "${spec.followUpVariables}"
related_signal_cards: ${yamlList(spec.relatedSignals)}
related_opinion_cards: ${yamlList(spec.relatedOpinions)}
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
  const lines = [
    "---",
    `date: ${date}`,
    "stage: business-signals",
    "status: generated-by-asset-card-generator",
    `signal_count: ${specs.length}`,
    `generated_at: ${now}`,
    "---",
    "",
    `# ${date} 商业信号`,
    "",
    ...specs.map((spec) => `- ${spec.id}｜${spec.title}｜${spec.type}｜${spec.company}`),
  ];
  write(path.join(root, "01-SiteV2", "content", "04-business-signals", "signals", `${date}-signals.md`), lines.join("\n"));
}

function writeOpinionIndex(specs) {
  runOpinionGovernance();
  return;
  if (!specs.length) return;
  const lines = [
    "---",
    `date: ${date}`,
    "stage: frontier-opinions",
    "status: generated-by-asset-card-generator",
    `opinion_count: ${specs.length}`,
    `generated_at: ${now}`,
    "---",
    "",
    `# ${date} 前沿观点`,
    "",
    ...specs.map((spec) => `- ${spec.id}｜${spec.title}｜${spec.person}`),
  ];
  write(path.join(root, "01-SiteV2", "content", "05-frontier-opinions", `${date}-opinion-cards.md`), lines.join("\n"));
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

function runOpinionGovernance() {
  const result = spawnSync(process.execPath, ["agent-workflow/tools/govern-opinion-card-ratings.mjs", `--date=${date}`], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error("Opinion governance failed; frontstage opinion index was not refreshed.");
    process.exit(result.status || 1);
  }
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
  const opinions = opinionSpecs[date] || [];
  const candidates = candidateSpecs[date] || {};
  const sections = poolSections();
  const autoSpecs = autoSignalsFromPool(sections, explicitSpecs);
  const specs = [...explicitSpecs, ...autoSpecs];
  const written = [];
  const skipped = [];
  const merged = [];
  const frontSignalSourceLevels = { S: 0, A: 0, B: 0 };
  const signalIndexSpecs = [];

  cleanSignalCardsForDate();
  const existingSignalIndex = existingSignalCardIndex();

  for (const spec of specs) {
    const section = sections.get(spec.poolRef);
    if (!section) {
      skipped.push(`${spec.poolRef}: missing section`);
      continue;
    }
    const required = [
      ["pool_routes", /core_pool/u],
      ["raw_qc_decision", /^allow$/u],
      ["has_full_text", /^true$/u],
      ["source_url", /^(?!no-url).+/u],
    ];
    const failed = required.filter(([field, pattern]) => !pattern.test(value(section, field)));
    if (failed.length) {
      skipped.push(`${spec.poolRef}: failed ${failed.map(([field]) => field).join(",")}`);
      continue;
    }
    const existing = findExistingSignalCard(existingSignalIndex, spec, section);
    if (existing) {
      const updated = upsertExistingSignalCard(existing, spec, section);
      const relative = path.relative(root, updated.file).replace(/\\/g, "/");
      merged.push(`${spec.poolRef}: merged into ${relative}`);
      written.push(relative);
      signalIndexSpecs.push({
        ...spec,
        id: updated.id || spec.id,
        title: updated.title || spec.title,
        type: updated.type || spec.type,
        company: updated.owner || spec.company,
      });
      const sourceLevel = value(section, "source_level").toUpperCase();
      if (sourceLevel in frontSignalSourceLevels) frontSignalSourceLevels[sourceLevel] += 1;
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

  for (const spec of opinions) {
    const file = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards", `${date}--frontier-opinion--${spec.slug}.md`);
    write(file, opinionCard(spec));
    written.push(path.relative(root, file).replace(/\\/g, "/"));
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
    skipped.push("trend_candidate: skipped; run agent-workflow/tools/run-trend-candidate-decision.mjs after Card / Opinion generation");
  }

  writeSignalIndexes(signalIndexSpecs);
  updateDailyMonitorLogFrontSignalCounts(frontSignalSourceLevels);
  runOpinionGovernance();
  written.push(`01-SiteV2/content/04-business-signals/signals/${date}-signals.md`);
  written.push(`01-SiteV2/content/05-frontier-opinions/${date}-opinion-cards.md`);

  console.log(JSON.stringify({ ok: true, date, written, merged, skipped }, null, 2));
}

main();
