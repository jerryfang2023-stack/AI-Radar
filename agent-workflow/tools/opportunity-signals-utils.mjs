import fs from "node:fs";
import path from "node:path";

export const OPPORTUNITY_SIGNAL_SCHEMA_VERSION = "opportunity-signals-v1";

export const OPPORTUNITY_SIGNAL_FIELDS = [
  "buyer_or_user",
  "team_or_function",
  "specific_task",
  "business_action",
  "product_form",
  "delivery_model",
  "pain_or_constraint",
  "adoption_evidence",
  "source_evidence_type",
];

const FIELD_ALIASES = {
  buyer_or_user: "buyerOrUser",
  team_or_function: "teamOrFunction",
  specific_task: "specificTask",
  business_action: "businessAction",
  product_form: "productForm",
  delivery_model: "deliveryModel",
  pain_or_constraint: "painOrConstraint",
  adoption_evidence: "adoptionEvidence",
  source_evidence_type: "sourceEvidenceType",
};

const FIELD_LIMITS = {
  buyer_or_user: 3,
  team_or_function: 3,
  specific_task: 3,
  business_action: 4,
  product_form: 3,
  delivery_model: 3,
  pain_or_constraint: 4,
  adoption_evidence: 3,
  source_evidence_type: 3,
};

const taxonomyCache = new Map();

export function loadOpportunitySignalTaxonomy(root = process.cwd()) {
  const file = path.join(root, "agent-workflow", "product", "opportunity-signal-taxonomy.json");
  if (!taxonomyCache.has(file)) {
    taxonomyCache.set(file, JSON.parse(fs.readFileSync(file, "utf8")));
  }
  return taxonomyCache.get(file);
}

export function opportunitySignalLabel(root, field, value) {
  return loadOpportunitySignalTaxonomy(root).fields?.[field]?.values?.[value] || value;
}

export function opportunitySignalsToCamelCase(signals = {}) {
  const out = {};
  for (const field of OPPORTUNITY_SIGNAL_FIELDS) {
    out[FIELD_ALIASES[field]] = Array.isArray(signals[field]) ? signals[field] : [];
  }
  out.schemaVersion = signals.schema_version || signals.schemaVersion || OPPORTUNITY_SIGNAL_SCHEMA_VERSION;
  out.evidenceBasis = signals.evidence_basis || signals.evidenceBasis || "";
  out.sourceExcerpt = signals.source_excerpt || signals.sourceExcerpt || "";
  out.missingFields = Array.isArray(signals.missing_fields) ? signals.missing_fields : (signals.missingFields || []);
  return out;
}

export function inferOpportunitySignals(input = {}) {
  const category = String(input.category || input.signalType || "").trim();
  const sourceLevel = String(input.sourceLevel || "").trim();
  const sourceUrl = String(input.sourceUrl || "");
  const sourceText = sourceTextForInference(input);
  const text = `${input.title || ""} ${input.sourceTitle || ""} ${sourceText}`.replace(/\s+/gu, " ").trim();
  const lc = text.toLowerCase();
  const signals = Object.fromEntries(OPPORTUNITY_SIGNAL_FIELDS.map((field) => [field, []]));
  const add = (field, value) => {
    if (!signals[field] || !value || signals[field].includes(value)) return;
    if (signals[field].length >= (FIELD_LIMITS[field] || 3)) return;
    signals[field].push(value);
  };
  const has = (pattern) => pattern.test(text);

  if (category === "funding" || has(/\b(raised|raises|funding|financing|seed|series\s+[a-z]|valuation|investor|led by)\b|融资|投资|估值/iu)) {
    add("business_action", "funding_round");
    add("source_evidence_type", "funding_news");
  }
  if (has(/\b(case study|customer story|deployed|deployment|rollout|implemented|used by|pilot|poc|proof of concept|adopted by|production)\b|客户案例|部署|上线|落地|试点|采用/iu)) {
    add("business_action", "customer_deployment");
  }
  if (has(/\b(launches|launched|introduces|introduced|announces|released|general availability|beta|new product|new platform|new feature)\b|发布|推出|开放/iu)) {
    add("business_action", "product_launch");
  }
  if (has(/\b(partnership|partner|integration|integrates|ecosystem|marketplace)\b|合作|集成|生态|接入/iu)) add("business_action", "partnership_integration");
  if (has(/\b(procurement|tender|rfp|bid|bidding|public contract|request for proposal)\b|采购|招标|投标|标书|中标/iu)) add("business_action", "procurement_signal");
  if (has(/\b(pricing|price|cost|usage limit|rate limit|billing|invoice|metered)\b|定价|价格|成本|账单|用量|限额/iu)) add("business_action", "pricing_change");
  if (has(/\b(acquires|acquired|acquisition|merger|buys)\b|收购|并购/iu)) add("business_action", "acquisition");
  if (has(/\b(open source|github|repository|repo|apache 2|mit license)\b|开源/iu)) add("business_action", "open_source_release");
  if (has(/\b(benchmark|evaluation|eval|paper|research|dataset|leaderboard)\b|基准|评测|论文|研究|数据集|排行榜/iu)) add("business_action", "research_benchmark");
  if (has(/\b(governance|compliance|permission|audit|security|regulation|policy|risk management)\b|治理|合规|权限|审计|安全|监管/iu)) add("business_action", "governance_requirement");
  if (has(/\b(forward deployed|fde|solution engineer|solutions engineer|customer[- ]embedded|implementation engineer)\b/iu)) add("business_action", "hiring_fde");
  if (has(/\b(shutdown|shut down|incident|failure|postmortem|rollout failed|cancelled|canceled)\b|关闭|失败|事故|复盘|叫停/iu)) add("business_action", "failure_postmortem");

  if (has(/\b(sales(?!force)|revenue operations|revops|account executive|pipeline|crm|lead)\b|销售|收入运营|线索|客户拜访|商机/iu)) {
    add("buyer_or_user", "sales_team");
    add("team_or_function", "sales");
    add("specific_task", has(/\b(brief|briefing|call prep|meeting prep)\b|简报|拜访准备/iu) ? "sales_briefing" : "sales_lead_research");
  }
  if (has(/\b(customer support|customer service|contact center|call center|ticket|zendesk|intercom|voice agent)\b|客服|售后|工单|呼叫中心|语音客服/iu)) {
    add("buyer_or_user", "customer_support_team");
    add("team_or_function", "customer_support");
    add("specific_task", "customer_ticket_triage");
  }
  if (has(/\b(developer|engineering|code|coding|github|pull request|ide|software engineer|devtools?)\b|开发者|工程师|代码|编程|研发/iu)) {
    add("buyer_or_user", "engineering_team");
    add("team_or_function", "engineering");
    add("specific_task", has(/\b(code review|pull request|pr review)\b|代码审查/iu) ? "code_review" : "internal_tool_building");
  }
  if (has(/\b(contract review|legal document|law firm|lawyer|compliance review|clause extraction|clause)\b|合同审阅|合同审核|法务文档|法务|律师|条款|合规审查/iu)) {
    add("buyer_or_user", "legal_team");
    add("team_or_function", "legal_compliance");
    add("specific_task", "contract_review");
  }
  if (has(/\b(finance|accounting|billing|invoice|reconciliation|expense|payments?)\b|财务|会计|发票|报销|付款|对账/iu)) {
    add("buyer_or_user", "finance_team");
    add("team_or_function", "finance");
  }
  if (has(/\b(procurement workflow|procurement intake|sourcing workflow|supplier screening|tender|rfp|bid|bidding)\b|采购流程|采购入口|供应商筛选|招标|投标|标书/iu)) {
    add("buyer_or_user", "procurement_team");
    add("team_or_function", "procurement");
    add("specific_task", has(/\b(rfp|proposal|bid|tender)\b|标书|投标|招标/iu) ? "rfp_response" : "procurement_supplier_screening");
  }
  if (has(/\b(healthcare|hospital|clinic|clinical|medical|doctor|patient|payer|radiology|imaging)\b|医疗|医院|临床|患者|影像|医生/iu)) {
    add("buyer_or_user", "healthcare_provider");
    add("team_or_function", "healthcare_operations");
    add("specific_task", "medical_documentation");
  }
  if (has(/\b(insurance|claim|claims|underwriting|policy administration)\b|保险|理赔|核保|保单/iu)) {
    add("buyer_or_user", "insurance_team");
    add("team_or_function", "insurance_operations");
    add("specific_task", "insurance_claim_review");
  }
  if (has(/\b(logistics|freight|shipment|carrier|warehouse|inventory|supply chain|dispatch)\b|物流|货运|仓储|库存|供应链|配送/iu)) {
    add("buyer_or_user", "operations_team");
    add("team_or_function", "operations");
    add("specific_task", "logistics_coordination");
  }
  if (has(/\b(cms|content workflow|content operations|publisher workflow|media workflow|creative operations)\b|内容工作流|内容运营|发布流程|素材流程/iu)) {
    add("buyer_or_user", "content_team");
    add("team_or_function", "marketing_content");
    add("specific_task", "content_workflow");
  }
  if (has(/\b(enterprise|business process|workflow|internal operations|back office)\b|企业|业务流程|内部流程|后台运营/iu)) add("buyer_or_user", "enterprise_ai_owner");
  if (has(/\b(security team|it team|platform team|cio|cto|ciso|permission|audit|governance|compliance|admin console|access control)\b|安全团队|平台团队|权限|审计|治理|合规|访问控制/iu)) {
    add("buyer_or_user", "it_security_team");
    add("team_or_function", "it_security");
  }
  if (has(/\b(smb|small business|small team|founder-led)\b|中小企业|小团队|小商家/iu)) add("buyer_or_user", "smb_owner");

  addProductFormAndConstraints({ add, has });
  addAdoptionEvidence({ add, has });
  addSourceEvidenceType({ add, sourceUrl, sourceLevel, text: lc });

  if (signals.product_form.includes("api")) add("delivery_model", "api_usage_based");
  if (signals.product_form.includes("fde_service")) add("delivery_model", "fde_delivery");
  if (signals.product_form.includes("managed_service")) add("delivery_model", "managed_service");

  return {
    schema_version: OPPORTUNITY_SIGNAL_SCHEMA_VERSION,
    ...signals,
    evidence_basis: sourceText ? "raw_source_text" : "card_text_fallback",
    source_excerpt: sourceExcerpt(text, signals),
    missing_fields: missingFieldsFor(signals),
  };
}

export function opportunitySignalsYaml(signals = {}) {
  const normalized = normalizeOpportunitySignals(signals);
  return [
    "opportunity_signals:",
    `  schema_version: ${yamlString(normalized.schema_version)}`,
    ...OPPORTUNITY_SIGNAL_FIELDS.map((field) => `  ${field}: ${yamlList(normalized[field])}`),
    `  evidence_basis: ${yamlString(normalized.evidence_basis || "")}`,
    `  source_excerpt: ${yamlString(normalized.source_excerpt || "")}`,
    `  missing_fields: ${yamlList(normalized.missing_fields)}`,
  ].join("\n");
}

export function normalizeOpportunitySignals(signals = {}) {
  const out = { schema_version: signals.schema_version || OPPORTUNITY_SIGNAL_SCHEMA_VERSION };
  for (const field of OPPORTUNITY_SIGNAL_FIELDS) {
    out[field] = uniq(Array.isArray(signals[field]) ? signals[field] : []);
  }
  out.evidence_basis = signals.evidence_basis || "";
  out.source_excerpt = signals.source_excerpt || "";
  out.missing_fields = uniq(Array.isArray(signals.missing_fields) ? signals.missing_fields : []);
  return out;
}

function addProductFormAndConstraints({ add, has }) {
  if (has(/\b(agent workbench|multi-agent|agent platform|ai teammate|orchestrate agents|agentic workflow)\b|智能体工作台|多智能体|Agent 工作台/iu)) add("product_form", "agent_workbench");
  if (has(/\b(copilot|assistant|ai assistant)\b|助手|副驾驶/iu)) add("product_form", "copilot");
  if (has(/\b(api|sdk|developer platform|endpoint)\b/iu)) add("product_form", "api");
  if (has(/\b(model gateway|router|routing|proxy|inference gateway|llm gateway)\b|模型网关|路由|代理|推理网关/iu)) add("product_form", "model_gateway");
  if (has(/\b(rag|knowledge base|enterprise search|memory layer|context layer)\b|知识库|企业搜索|记忆层|上下文层/iu)) {
    add("product_form", "rag_knowledge_base");
    add("specific_task", "knowledge_base_qa");
  }
  if (has(/\b(vertical ai|vertical saas|industry-specific|for healthcare|for insurance|for legal|for construction)\b|垂直|行业专用/iu)) add("product_form", "vertical_saas");
  if (has(/\b(developer tool|coding agent|ide|github|software development lifecycle)\b|开发者工具|编码 Agent|研发工具/iu)) add("product_form", "developer_tool");
  if (has(/\b(workflow automation|orchestration|process automation|automate operations)\b|工作流自动化|流程编排|流程自动化/iu)) add("product_form", "workflow_automation");
  if (has(/\b(forward deployed|fde|implementation service|solution delivery)\b/iu)) add("product_form", "fde_service");
  if (has(/\b(managed service|done-for-you|outsourced operations)\b|托管服务|代运营/iu)) add("product_form", "managed_service");
  if (has(/\b(eval|evaluation platform|benchmarking|observability|testing platform|red team)\b|评测平台|可观测|测试平台|红队/iu)) add("product_form", "evaluation_platform");
  if (has(/\b(browser extension|desktop app|local app|chrome extension)\b|浏览器插件|桌面应用|本地应用/iu)) add("product_form", "browser_or_desktop_tool");

  if (has(/\b(self-serve|free trial|signup|starter plan)\b|自助|免费试用/iu)) add("delivery_model", "self_serve_saas");
  if (has(/\b(enterprise plan|enterprise subscription|seat-based|annual contract)\b|企业版|订阅|年费|席位/iu)) add("delivery_model", "enterprise_subscription");
  if (has(/\b(usage-based|per token|per call|api pricing|metered)\b|按量|调用计费|token 计费/iu)) add("delivery_model", "api_usage_based");
  if (has(/\b(implementation|deployment project|professional services|project-based)\b|实施项目|交付项目|专业服务/iu)) add("delivery_model", "project_based_service");
  if (has(/\b(forward deployed|fde|embedded engineer|customer-embedded)\b/iu)) add("delivery_model", "fde_delivery");
  if (has(/\b(open source|commercial license|enterprise license)\b|开源商业化|企业许可证/iu)) add("delivery_model", "open_source_commercial");
  if (has(/\b(audit|diagnostic|assessment|workshop|consulting)\b|诊断|审计|咨询|工作坊/iu)) add("delivery_model", "consulting_diagnostic");
  if (has(/\b(template|playbook|workflow pack|starter kit)\b|模板|手册|流程包/iu)) add("delivery_model", "template_pack");

  if (has(/\b(integrat|workflow|legacy system|crm|erp|service now|salesforce|snowflake)\b|集成|工作流|旧系统|CRM|ERP/iu)) add("pain_or_constraint", "workflow_integration");
  if (has(/\b(cost|pricing|billing|usage limit|rate limit|inference cost|token cost)\b|成本|价格|账单|限额|推理成本/iu)) add("pain_or_constraint", "api_cost_spike");
  if (has(/\b(permission|access control|authorization|least privilege|data access)\b|权限|访问控制|授权|数据访问/iu)) add("pain_or_constraint", "permission_boundary");
  if (has(/\b(audit log|traceability|logging|compliance record)\b|审计日志|留痕|可追溯/iu)) add("pain_or_constraint", "audit_log_required");
  if (has(/\b(data silo|fragmented data|context layer|knowledge base|enterprise data)\b|数据孤岛|上下文|企业数据|知识库/iu)) add("pain_or_constraint", "data_silo");
  if (has(/\b(hallucination|accuracy|trust|reliability|wrong answer)\b|幻觉|准确性|可信|可靠性/iu)) add("pain_or_constraint", "hallucination_risk");
  if (has(/\b(human in the loop|human review|approval|expert review|human recruiter|doctor review)\b|人工审核|人工确认|专家复核/iu)) add("pain_or_constraint", "human_review_required");
  if (has(/\b(latency|real-time|uptime|sla|production reliability)\b|延迟|实时|稳定性|SLA/iu)) add("pain_or_constraint", "latency_sensitive");
  if (has(/\b(model routing|multi-model|vendor selection|model selection|orchestration)\b|模型路由|多模型|模型选择/iu)) add("pain_or_constraint", "model_routing_complexity");
  if (has(/\b(security|privacy|compliance|soc 2|hipaa|gdpr)\b|安全|隐私|合规/iu)) add("pain_or_constraint", "security_compliance");
  if (has(/\b(deployment failed|rollout failure|failed rollout|shutdown|pilot failed)\b|部署失败|上线失败|试点失败/iu)) add("pain_or_constraint", "deployment_failure");
  if (has(/\b(context management|memory|state|long context)\b|上下文管理|记忆|状态管理/iu)) add("pain_or_constraint", "context_management");
  if (has(/\b(evaluation gap|evals?|benchmark|quality assurance|qa|test coverage)\b|评测|质量保障|测试/iu)) add("pain_or_constraint", "evaluation_gap");
}

function addAdoptionEvidence({ add, has }) {
  if (has(/\b(named customer|customers include|clients include|used by [A-Z]|deployed at [A-Z])\b|具名客户|客户包括/iu)) add("adoption_evidence", "named_customer");
  if (has(/\b(case study|customer story|case report)\b|案例研究|客户故事/iu)) add("adoption_evidence", "case_study");
  if (has(/\b\d+(?:\.\d+)?\s?(?:%|percent|x|times|hours?|days?|users?|customers?|employees?|stores?|calls?|tickets?|transactions?)\b|提升|降低|节省|处理量|效率/iu)) add("adoption_evidence", "customer_metric");
  if (has(/\b(\d+\s?(?:seats|users|employees|stores|locations|calls|tickets|transactions)|at scale|production scale)\b|规模化|席位|门店|用户|员工/iu)) add("adoption_evidence", "deployment_scale");
  if (has(/\b(partnership|integration|integrates|partnered with)\b|合作|集成/iu)) add("adoption_evidence", "partnership_announcement");
  if (has(/\b(procurement|contract award|tender|rfp|bid)\b|采购|中标|合同|招标/iu)) add("adoption_evidence", "procurement_contract");
  if (has(/\b(pricing page|pricing starts|starts at|\$\d+\/|per month|per user)\b|价格页|起价|每月|每用户/iu)) add("adoption_evidence", "pricing_page");
  if (has(/\b(enterprise plan|soc 2|sso|admin console|audit log|security package)\b|企业版|SSO|管理控制台|安全套餐/iu)) add("adoption_evidence", "enterprise_plan");
  if (has(/\b(arr|revenue growth|usage growth|customer growth|growing usage)\b|收入增长|使用增长|客户增长/iu)) add("adoption_evidence", "usage_growth");
  if (has(/\b(pilot|poc|proof of concept|trial)\b|试点|概念验证|试用/iu)) add("adoption_evidence", "pilot_or_poc");
  if (has(/\b(report|analyst|survey|world economic forum|weforum|gartner|mckinsey|forrester|deloitte)\b|报告|调研/iu)) add("adoption_evidence", "third_party_report");
}

function addSourceEvidenceType({ add, sourceUrl = "", sourceLevel = "", text = "" }) {
  let host = "";
  try {
    host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./u, "");
  } catch {
    host = "";
  }
  if (/github\.com|docs?\.|developer|engineering|blog/u.test(host) || /\b(technical blog|engineering blog|developer docs|sdk|api docs)\b/u.test(text)) add("source_evidence_type", "technical_blog");
  if (/arxiv|openreview|research|paperswithcode/u.test(host) || /\b(research paper|benchmark|dataset)\b/u.test(text)) add("source_evidence_type", "research_paper");
  if (/weforum|gartner|mckinsey|forrester|deloitte|pwc|cbinsights/u.test(host) || /\b(industry report|survey|analyst report)\b/u.test(text)) add("source_evidence_type", "industry_report");
  if (/gov|procurement|sam\.gov|ted\.europa/u.test(host) || /\b(tender|rfp|procurement|contract award)\b/u.test(text)) add("source_evidence_type", "regulatory_or_procurement");
  if (/x\.com|twitter|linkedin|reddit|news\.ycombinator/u.test(host)) add("source_evidence_type", "community_post");
  if (/\b(case study|customer story)\b/u.test(text)) add("source_evidence_type", "first_party_case");
  if (/\b(press release|announces|launches|company blog|official)\b/u.test(text)) add("source_evidence_type", "first_party_announcement");
  if (!signalsAlreadyBusinessMedia(text, host)) return;
  add("source_evidence_type", "business_media");
}

function signalsAlreadyBusinessMedia(text = "", host = "") {
  return !host
    || ["pulse2.com", "theaiinsider.tech", "techcrunch.com", "venturebeat.com", "the-decoder.com"].some((domain) => host.endsWith(domain))
    || /\b(news|media|reported|article)\b/u.test(text);
}

function sourceTextForInference(input = {}) {
  return [
    ...(Array.isArray(input.keyExcerpts) ? input.keyExcerpts.map(excerptText) : []),
    clip(input.rawText, 1800),
    clip(input.cleanText, 1000),
    clip(input.fullText, 1000),
    clip(input.cardText, 800),
  ].filter(Boolean).join("\n");
}

function missingFieldsFor(signals = {}) {
  const missing = [];
  if (!signals.buyer_or_user?.length) missing.push("buyer_or_user");
  if (!signals.specific_task?.length) missing.push("specific_task");
  if (!signals.product_form?.length) missing.push("product_form");
  if (!signals.adoption_evidence?.length) missing.push("adoption_evidence");
  if (!signals.delivery_model?.length) missing.push("delivery_model");
  return missing;
}

function sourceExcerpt(text = "", signals = {}) {
  const needles = [
    ...signals.business_action,
    ...signals.specific_task,
    ...signals.product_form,
    ...signals.pain_or_constraint,
  ].join(" ");
  const sentences = String(text || "")
    .replace(/\s+/gu, " ")
    .split(/(?<=[.!?。！？])\s+/u)
    .map((item) => item.trim())
    .filter((item) => item.length >= 24);
  const matched = sentences.find((sentence) => {
    const lc = sentence.toLowerCase();
    return /funding|raised|launch|deploy|customer|workflow|agent|sales|support|procurement|governance|pricing|cost|case study|pilot|poc|融资|发布|推出|部署|客户|流程|采购|治理|成本|试点/u.test(lc)
      || needles.split(/\s+/u).some((needle) => needle && lc.includes(needle));
  }) || sentences[0] || String(text || "");
  return short(matched, 220);
}

function yamlString(input = "") {
  return JSON.stringify(String(input || ""));
}

function yamlList(items = []) {
  const values = uniq(items);
  return values.length ? `[${values.map(yamlString).join(", ")}]` : "[]";
}

function uniq(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function short(text = "", limit = 220) {
  const clean = String(text || "").replace(/\s+/gu, " ").trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1)}...` : clean;
}

function clip(text = "", limit = 1800) {
  const clean = String(text || "").replace(/\s+/gu, " ").trim();
  return clean.length > limit ? clean.slice(0, limit) : clean;
}

function excerptText(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item !== "object") return String(item);
  return item.text || item.excerpt || item.quote || item.content || item.summary || "";
}
