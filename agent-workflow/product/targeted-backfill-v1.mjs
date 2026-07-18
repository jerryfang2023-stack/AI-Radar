import crypto from "node:crypto";

export const TARGETED_BACKFILL_VERSION = "BACKFILL-V1.0";

const TASK_ORDER = new Map([
  ["funding_detail", 0],
  ["deployment_case", 1],
  ["company_history", 2],
  ["product_history", 3]
]);

const BLOCKED_EVIDENCE = [
  "search_result_snippet",
  "discovery_summary",
  "publisher_name",
  "query_text",
  "legacy_card_copy",
  "frontstage_copy"
];

const clean = (value = "") => String(value || "").replace(/\s+/gu, " ").trim();
const disclosed = (value = "") => /^(?:未披露|unknown|n\/a|null)$/iu.test(clean(value)) ? "" : clean(value);
const dateOnly = (value = "") => clean(value).slice(0, 10);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const hash = (value) => crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 16);

function shiftMonths(value, months) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

function shiftDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function quoted(value) {
  return `"${clean(value).replace(/"/gu, "")}"`;
}

function knownDomains(events = []) {
  return unique(events.flatMap((event) => event.sources || []).map((source) => {
    try {
      return new URL(source.url).hostname.replace(/^www\./u, "");
    } catch {
      return "";
    }
  })).slice(0, 3);
}

function acceptedEvent(event = {}) {
  return !["quarantined", "withdrawn", "disputed"].includes(event.publicationStatus);
}

function fundingEvidenceIsExplicit(event = {}) {
  const text = [event.originalTitle, event.subject, event.action, event.object, ...(event.claims || []).map((claim) => claim.quote)].map(clean).join(" ");
  return /(?:\braises?\b|\braised\b|\bfunding\b|\bfinancing\b|\binvestment\b|\bseries\s+[a-z]\b|\bpre[- ]?seed\b|\bseed round\b|\bvaluation\b|\bbacked by\b|融资|募资|筹集|新一轮|种子轮|天使轮|[A-Ha-h]\s*轮|估值|领投|参投)/iu.test(text);
}

function recurringEntityNameIsSpecific(name = "", type = "company_history") {
  const normalized = clean(name);
  if (normalized.length < 2 || normalized.length > 100) return false;
  if (/^(?:ai|app|api|assistant|blog|build|chatbot|company|developer|model|platform|product|sdk|service|software|solution|startup|tool|website)$/iu.test(normalized)) return false;
  if (type === "product_history" && /^(?:javascript|power|release|yc|launch yc|mozilla\s+20\d{2}|advance mainstream robotics)$/iu.test(normalized)) return false;
  return true;
}

function normalizeFundingTarget(value = "") {
  return clean(value)
    .replace(/^(?:[A-Za-z]+-based|YC alum|Transformer Chip Startup)\s+/iu, "")
    .replace(/^Raja Koduri[’']s\s+/iu, "")
    .replace(/^.*\bstartup\s+/iu, "")
    .replace(/^Y Combinator-backed\s+/iu, "")
    .replace(/^.*(?:开发商|初创公司|创业公司)\s+/u, "")
    .replace(/^([A-Z][A-Za-z0-9&.'_-]{1,40})\s+与.*$/u, "$1")
    .replace(/\s+(?:Gets?|Exits? Stealth|new round|新一轮|\d+(?:\.\d+)?\s*(?:亿|万)?(?:美元|欧元|人民币)?估值).*$/iu, "")
    .replace(/\s+\d+(?:\.\d+)?\s*(?:亿|万)?(?:美元|欧元|人民币).*$/iu, "")
    .replace(/[，,：:]$/u, "")
    .trim();
}

function fundingTargetIsSpecific(value = "") {
  const target = clean(value);
  return recurringEntityNameIsSpecific(target, "company_history")
    && !/^(?:ex-|former\b|how\b|he\b|she\b|the founder\b|this ceo\b|pymnts\b|of\b|we(?:'ve| have)\b|enterprise ai$)/iu.test(target)
    && !/(?:researchers?|founder|developer of|teammates that)$/iu.test(target);
}

function deploymentEvidenceIsExplicit(event = {}, record = null) {
  if (["planned", "unconfirmed", "withdrawn"].includes(clean(event.status))) return false;
  const displayTitle = clean(event.title);
  if (!displayTitle || /(?:完成部署：\s*(?:[:,，]|\$)|\|)/u.test(displayTitle)) return false;
  const customer = disclosed(record?.customer);
  const vendor = disclosed(record?.vendor);
  const text = [event.originalTitle, event.subject, event.action, event.object, record?.reportedNeed, record?.useCase, ...(event.claims || []).map((claim) => claim.quote)].map(clean).join(" ");
  const action = /(?:deploy(?:ed|ment)?|implement(?:ed|ation)?|adopt(?:ed|ion)?|rollout|roll out|select(?:ed|ion)?|integrat(?:ed|ion)?|procure(?:d|ment)?|purchas(?:e|ed|ing)|\bbuy\b|uses?\b|部署|落地|采用|接入|集成|采购|购买|中标|投产|生产环境)/iu.test(text);
  const organizationContext = /(?:enterprise|company|customer|client|bank|hospital|university|government|agency|ministry|employees?|workforce|workflow|企业|公司|客户|银行|医院|大学|高校|政府|部门|员工|团队|工作流|业务流程)/iu.test(text);
  const consumerOnly = /(?:高考|志愿填报|个人用户|iPhone 用户|免费咨询|折扣|打折|优惠券)/iu.test(text) && !organizationContext;
  const distinctParties = unique(event.entityIds || []).length >= 2;
  const customerVendorPair = Boolean(customer && vendor && customer.toLocaleLowerCase() !== vendor.toLocaleLowerCase());
  const deployedAtNamedSite = /(?:deploy(?:ed|s)?\s+(?:at|to|for)|delivered?\s+to|部署于|交付(?:给|至)|向.{1,80}交付)/iu.test(text);
  const internalOperationalUse = Boolean(customer) && /(?:employees?|workforce|operations?|production line|customer service|finance function|deals?|software development|员工|团队|业务流程|生产线|企业职能|交易|内部软件)/iu.test(text);
  return action && !consumerOnly && organizationContext && (customerVendorPair || distinctParties || deployedAtNamedSite || internalOperationalUse);
}

function fundingMissingFields(event = {}) {
  const claims = (event.claims || []).map((claim) => claim.quote).join(" ");
  const text = [event.title, event.originalTitle, event.action, event.object, claims, ...(event.metrics || [])].map(clean).join(" ");
  const missing = [];
  if (!/(?:[$€£¥₹]\s?\d|\b(?:USD|EUR|GBP|CNY|RMB|INR)\b|\d+(?:\.\d+)?\s?(?:million|billion|mn|bn)|\d+(?:\.\d+)?\s?(?:万|亿)(?:美元|人民币|元)?)/iu.test(text)) missing.push("funding_amount");
  const publicOrDebtFinancing = /(?:equity|stock offering|share sale|convertible|credit facility|line of credit|bond|secondary|tender|\bIPO\b|股权|股票|配售|可转债|信贷|债券|公开发行)/iu.test(text);
  if (!publicOrDebtFinancing && !/(?:pre[- ]?seed|seed|series\s+[a-z]|angel|strategic|debt|grant|种子轮|天使轮|[A-Ha-h]轮|战略融资|债权融资)/iu.test(text)) missing.push("funding_round");
  if (!publicOrDebtFinancing && !/(?:led by|co-led|participat(?:ed|ion)|investor|backed by|领投|参投|投资方|投资者)/iu.test(claims)) missing.push("investors");
  return missing;
}

function eventTargetName(event = {}, companiesById = new Map()) {
  const candidates = (event.entityIds || []).map((id) => companiesById.get(id)).filter(Boolean);
  const titleText = [event.title, event.originalTitle, event.subject].map(clean).join(" ").toLocaleLowerCase();
  const exact = candidates.filter((company) => titleText.includes(clean(company.name).toLocaleLowerCase())).sort((a, b) => b.name.length - a.name.length)[0];
  return clean(exact?.name || candidates[0]?.name || event.subject || event.entityNames?.[0] || event.title);
}

function fundingTargetName(event = {}, companiesById = new Map()) {
  const originalTitle = clean(event.originalTitle);
  const namedAfterMeet = originalTitle.match(/\bMeet\s+([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})/u);
  if (namedAfterMeet?.[1]) return normalizeFundingTarget(namedAfterMeet[1]);
  const namedService = originalTitle.match(/\bservice,\s+([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})/u);
  if (namedService?.[1]) return normalizeFundingTarget(namedService[1]);
  const fundingSegment = originalTitle.match(/(?:^|[,;|])\s*([^,;|]{2,100}?)\s+(?:raises?|raised|closes?|closed|secures?|secured|lands?|gets?)\b/iu);
  if (fundingSegment?.[1]) {
    const normalized = normalizeFundingTarget(fundingSegment[1]);
    if (fundingTargetIsSpecific(normalized)) return normalized;
    return "";
  }
  const rawSubject = clean(event.subject);
  if (rawSubject) {
    const afterFor = rawSubject.match(/(?:为\s*|back(?:ed)?\s+)([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})/iu);
    if (afterFor?.[1]) return clean(afterFor[1].replace(/[’']s$/u, ""));
    const chineseCompany = rawSubject.match(/(?:初创公司|创业公司|科技公司|公司)\s*([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})/u);
    if (chineseCompany?.[1]) return clean(chineseCompany[1]);
    const startupName = rawSubject.match(/(?:startup|company|maker|developer|platform)\s+([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})(?:\b|$)/iu);
    if (startupName?.[1]) return clean(startupName[1]);
    const commaParts = rawSubject.split(",").map(clean).filter(Boolean);
    const commaCandidate = commaParts.length > 1 && /(?:backed by|insiders|developer|startup)/iu.test(rawSubject) ? commaParts.at(-1) : commaParts[0];
    const actionTrimmed = clean(commaCandidate
      .replace(/^(?:exclusive:\s*|消息称|报道称|传闻称)/iu, "")
      .replace(/(?:完成|获得|获|融资|寻求|洽谈|计划|拟|将|正以|估值).*$/u, "")
      .replace(/^(?:Jeff Bezos|贝佐斯|谷歌|亚马逊|微软|英伟达)\s*(?:的|旗下)\s*/iu, ""));
    const normalized = normalizeFundingTarget(actionTrimmed);
    if (fundingTargetIsSpecific(normalized) && normalized.length <= 80 && !/^(?:[$€£¥₹]|\d)/u.test(normalized)) return normalized;
  }
  const title = clean(event.title || event.originalTitle);
  const descriptorMatch = title.match(/(?:初创公司|创业公司|科技公司|公司)\s+([A-Z][A-Za-z0-9&.'_-]*(?:\s+[A-Z][A-Za-z0-9&.'_-]*){0,3})/u);
  if (descriptorMatch?.[1]) return clean(descriptorMatch[1]);
  const englishMatch = title.match(/^(.{2,80}?)\s+(?:raises?|raised|closes?|closed|secures?|secured|seeks?|lands?|gets?)\b/iu);
  if (englishMatch?.[1]) return normalizeFundingTarget(englishMatch[1]);
  const chineseMatch = title.match(/^(.{2,80}?)(?:完成|获得|获|宣布|筹集|融资|寻求|计划|拟)(?=\s*\d|融资|新一轮|种子|天使|战略|股权|债权|估值)/u);
  if (chineseMatch?.[1]) return clean(chineseMatch[1]);
  for (const claim of event.claims || []) {
    const quoteMatch = clean(claim.quote).match(/^([A-Z][A-Za-z0-9&.' -]{1,60}?)(?:,\s+(?:an?|the)\s+[^,]{1,100},)?\s+(?:has\s+)?(?:raised|secured|closed)\b/iu);
    if (quoteMatch?.[1]) return clean(quoteMatch[1]);
  }
  return normalizeFundingTarget(eventTargetName(event, companiesById));
}

function deploymentQueries({ event, record, subject, vendor, domains, timeClause }) {
  const pair = [quoted(subject), vendor ? quoted(vendor) : "AI"].join(" ");
  const missing = new Set(record ? deploymentMissingFields(record) : ["fde_projection_source"]);
  const queries = [
    `${pair} ("case study" OR deployed OR implementation OR production) ${timeClause}`,
    `${quoted(event.title)} (customer OR deployment OR implementation OR outcome)`
  ];
  if (["workflow_before", "workflow_after", "systems_integrated"].some((field) => missing.has(field))) queries.push(`${pair} (workflow OR integration OR system) ${timeClause}`);
  if (["data_requirements", "governance_controls"].some((field) => missing.has(field))) queries.push(`${pair} (data OR security OR governance OR compliance) ${timeClause}`);
  if (["delivery_model", "team_composition"].some((field) => missing.has(field))) queries.push(`${pair} (implementation partner OR rollout OR team OR services) ${timeClause}`);
  if (missing.has("reported_outcomes")) queries.push(`${pair} (result OR outcome OR metric OR ROI OR productivity) ${timeClause}`);
  queries.push(...domains.map((domain) => `site:${domain} ${quoted(subject)} (AI OR deployment OR customer OR implementation) ${timeClause}`));
  return queries;
}

function deploymentMissingFields(record = {}) {
  const missing = new Set(record.undisclosedFields || []);
  if (!clean(record.customer) || clean(record.customer) === "未披露") missing.add("customer");
  if (!clean(record.vendor) || clean(record.vendor) === "未披露") missing.add("vendor");
  if (!clean(record.useCase) || clean(record.useCase) === "未披露") missing.add("use_case");
  if (!clean(record.stage)) missing.add("deployment_stage");
  if (!clean(record.reportedNeed) || clean(record.reportedNeed) === "未披露") missing.add("reported_need");
  if (!(record.deliveryComponents || []).length) missing.add("reported_delivery_components");
  if (!(record.outcomes || []).length) missing.add("reported_outcomes");
  return [...missing].sort();
}

function baseState(previousState = {}) {
  return {
    status: previousState.status || "open",
    worker: previousState.worker || "",
    leaseExpiresAt: previousState.leaseExpiresAt || "",
    attempts: Array.isArray(previousState.attempts) ? previousState.attempts : [],
    candidateSources: Array.isArray(previousState.candidateSources) ? previousState.candidateSources : [],
    captureRefs: Array.isArray(previousState.captureRefs) ? previousState.captureRefs : [],
    acceptedRefs: Array.isArray(previousState.acceptedRefs) ? previousState.acceptedRefs : [],
    runRefs: Array.isArray(previousState.runRefs) ? previousState.runRefs : [],
    lastAttemptAt: previousState.lastAttemptAt || "",
    nextReviewOn: previousState.nextReviewOn || ""
  };
}

function makeTask({
  type,
  target,
  gapKind,
  missingFields = [],
  detectedFromRefs = [],
  queries,
  paths,
  domains = [],
  window,
  previousById,
  generatedAt
}) {
  const taskId = `BFQ-${hash([type, target.kind, target.id].join("|"))}`;
  const previous = previousById.get(taskId);
  const state = baseState(previous?.state);
  const today = dateOnly(generatedAt);
  if (["resolved", "retired"].includes(state.status)) state.status = "open";
  if (state.status === "accepted_pending_rebuild" && gapKind === "missing_fields") state.status = "open";
  if (state.status === "accepted_pending_rebuild" && gapKind === "coverage_sweep" && (!state.nextReviewOn || state.nextReviewOn <= today)) state.status = "open";
  if (state.status === "no_findings" && state.nextReviewOn && state.nextReviewOn <= today) state.status = "open";
  return {
    taskId,
    taskType: type,
    target,
    detection: {
      gapKind,
      missingFields: unique(missingFields).sort(),
      detectedFromRefs: unique(detectedFromRefs),
      detectedAt: previous?.detection?.detectedAt || generatedAt,
      lastObservedAt: generatedAt
    },
    coverageWindow: window,
    searchPlan: {
      paths,
      queries: unique(queries),
      knownSourceDomains: unique(domains),
      preferredSourceClasses: type === "funding_detail" ? ["official", "investor", "A", "B"] : ["official", "A", "B"],
      forbiddenAsFactEvidence: BLOCKED_EVIDENCE
    },
    completion: {
      requiredArtifacts: ["SourceArtifact", "RawDocument", "Claim"],
      targetProjection: type === "deployment_case" ? "FDE-V2.0" : type === "funding_detail" ? "EVENT-V1.1" : "ENTITY-V1.0 timeline",
      rule: gapKind === "coverage_sweep"
        ? "Complete every query with an auditable discovery run. Any candidate must be captured from its original page before factual use. A no-findings run closes only this review cycle."
        : "Capture an original source, extract an exact-span Claim, rebuild the responsible canonical object, and close only after the detected gap disappears."
    },
    state
  };
}

export function buildTargetedBackfillQueue({ data = {}, previousQueue = {}, generatedAt = new Date().toISOString(), windowMonths = 6 } = {}) {
  const endDate = dateOnly(data.entityHistoryManifest?.coverage?.endDate || data.meta?.currentDate || generatedAt);
  const window = { startDate: shiftMonths(endDate, -windowMonths), endDate, months: windowMonths };
  const events = (data.events || []).filter(acceptedEvent);
  const eventsById = new Map(events.map((event) => [event.id, event]));
  const companiesById = new Map((data.companies || []).map((company) => [company.id, company]));
  const currentEntityIds = new Set([...(data.companies || []), ...(data.products || [])].map((entity) => entity.id));
  const previousActiveTasks = previousQueue.tasks || [];
  const previousResolvedTasks = previousQueue.resolvedTasks || [];
  const previousRetiredTasks = previousQueue.retiredTasks || [];
  const previousTasks = [...previousActiveTasks, ...previousResolvedTasks, ...previousRetiredTasks];
  const previousById = new Map(previousTasks.map((task) => [task.taskId, task]));
  const tasks = [];

  for (const company of data.companies || []) {
    if (!recurringEntityNameIsSpecific(company.name, "company_history")) continue;
    const companyEvents = (company.eventIds || []).map((id) => eventsById.get(id)).filter(Boolean);
    if (!companyEvents.length) continue;
    const domains = knownDomains(companyEvents);
    const timeClause = `after:${window.startDate} before:${shiftDays(window.endDate, 1)}`;
    tasks.push(makeTask({
      type: "company_history",
      target: { kind: "entity", id: company.id, name: company.name },
      gapKind: "coverage_sweep",
      detectedFromRefs: companyEvents.map((event) => event.id),
      paths: ["official_original", "capital_startup", "industry_landing"],
      domains,
      queries: [
        `${quoted(company.name)} (AI OR "artificial intelligence") (launch OR funding OR partnership OR customer OR deployment) ${timeClause}`,
        ...domains.map((domain) => `site:${domain} ${quoted(company.name)} (AI OR launch OR funding OR customer OR deployment) ${timeClause}`)
      ],
      window,
      previousById,
      generatedAt
    }));
  }

  for (const product of data.products || []) {
    if (!recurringEntityNameIsSpecific(product.name, "product_history")) continue;
    const productEvents = (product.eventIds || []).map((id) => eventsById.get(id)).filter(Boolean);
    if (!productEvents.length) continue;
    const domains = knownDomains(productEvents);
    const publisher = eventTargetName(productEvents[0], companiesById);
    const context = publisher && publisher !== product.name ? ` ${quoted(publisher)}` : "";
    const timeClause = `after:${window.startDate} before:${shiftDays(window.endDate, 1)}`;
    tasks.push(makeTask({
      type: "product_history",
      target: { kind: "entity", id: product.id, name: product.name },
      gapKind: "coverage_sweep",
      detectedFromRefs: productEvents.map((event) => event.id),
      paths: ["official_original", "developer_ecosystem", "industry_landing"],
      domains,
      queries: [
        `${quoted(product.name)}${context} (launch OR release OR update OR pricing OR customer OR deployment) ${timeClause}`,
        ...domains.map((domain) => `site:${domain} ${quoted(product.name)}${context} (launch OR release OR update OR pricing) ${timeClause}`)
      ],
      window,
      previousById,
      generatedAt
    }));
  }

  for (const event of events.filter((item) => item.eventType === "funding" && fundingEvidenceIsExplicit(item))) {
    const missingFields = fundingMissingFields(event);
    if (!missingFields.length) continue;
    const subject = fundingTargetName(event, companiesById);
    if (!fundingTargetIsSpecific(subject)) continue;
    const year = dateOnly(event.date || event.dataDate).slice(0, 4);
    const domains = knownDomains([event]);
    tasks.push(makeTask({
      type: "funding_detail",
      target: { kind: "event", id: event.id, name: subject, eventId: event.id },
      gapKind: "missing_fields",
      missingFields,
      detectedFromRefs: [event.id, ...(event.claims || []).map((claim) => claim.id), ...(event.sources || []).map((source) => source.id)],
      paths: ["official_original", "capital_startup", "a_media_gdelt"],
      domains,
      queries: [
        `${quoted(subject)} (funding OR raised OR financing OR "Series") ${year}`,
        `${quoted(subject)} (investor OR "led by" OR valuation OR round) ${year}`,
        ...domains.map((domain) => `site:${domain} ${quoted(subject)} (funding OR raised OR financing) ${year}`)
      ],
      window,
      previousById,
      generatedAt
    }));
  }

  const fdeByEvent = new Map((data.fde || []).map((record) => [record.eventId, record]));
  for (const event of events.filter((item) => ["deployment", "procurement_contract", "hardware_deployment"].includes(item.eventType))) {
    const record = fdeByEvent.get(event.id);
    if (!deploymentEvidenceIsExplicit(event, record)) continue;
    const missingFields = record ? deploymentMissingFields(record) : ["fde_projection_source"];
    if (!missingFields.length) continue;
    const subject = disclosed(record?.customer) || eventTargetName(event, companiesById);
    const vendor = disclosed(record?.vendor);
    const domains = knownDomains([event]);
    const timeClause = `after:${window.startDate} before:${shiftDays(window.endDate, 1)}`;
    tasks.push(makeTask({
      type: "deployment_case",
      target: { kind: "event", id: event.id, name: event.title, eventId: event.id, fdeId: record?.id || "" },
      gapKind: "missing_fields",
      missingFields,
      detectedFromRefs: [event.id, record?.id, ...(event.claims || []).map((claim) => claim.id), ...(event.sources || []).map((source) => source.id)],
      paths: ["official_original", "industry_landing", "procurement_marketplace"],
      domains,
      queries: deploymentQueries({ event, record, subject, vendor, domains, timeClause }),
      window,
      previousById,
      generatedAt
    }));
  }

  tasks.sort((a, b) => (TASK_ORDER.get(a.taskType) - TASK_ORDER.get(b.taskType)) || a.target.name.localeCompare(b.target.name, "zh-CN") || a.taskId.localeCompare(b.taskId));
  const activeIds = new Set(tasks.map((task) => task.taskId));
  const targetStillCanonical = (task) => task.target.kind === "event" ? eventsById.has(task.target.eventId || task.target.id) : currentEntityIds.has(task.target.id);
  const disappeared = previousActiveTasks.filter((task) => !activeIds.has(task.taskId));
  const newlyResolved = disappeared.filter((task) => task.detection.gapKind === "missing_fields" && targetStillCanonical(task)).map((task) => ({
    ...task,
    state: { ...baseState(task.state), status: "resolved", resolvedAt: task.state?.resolvedAt || generatedAt }
  }));
  const newlyRetired = disappeared.filter((task) => task.detection.gapKind !== "missing_fields" || !targetStillCanonical(task)).map((task) => ({
    ...task,
    state: { ...baseState(task.state), status: "retired", retiredAt: task.state?.retiredAt || generatedAt, retirementReason: "target_no_longer_canonical" }
  }));
  const resolvedTasks = [...previousResolvedTasks.filter((task) => !activeIds.has(task.taskId)), ...newlyResolved];
  const retiredTasks = [...previousRetiredTasks.filter((task) => !activeIds.has(task.taskId)), ...newlyRetired];
  const countsByType = Object.fromEntries([...TASK_ORDER.keys()].map((type) => [type, tasks.filter((task) => task.taskType === type).length]));
  const countsByStatus = Object.fromEntries(unique(tasks.map((task) => task.state.status)).sort().map((status) => [status, tasks.filter((task) => task.state.status === status).length]));

  return {
    manifest: {
      queueVersion: TARGETED_BACKFILL_VERSION,
      generatedAt,
      sourceProductVersion: data.meta?.productVersion || "",
      sourceEntityVersion: data.entityHistoryManifest?.entityVersion || "",
      coverageWindow: window,
      counts: { active: tasks.length, resolved: resolvedTasks.length, retired: retiredTasks.length, byType: countsByType, byStatus: countsByStatus }
    },
    tasks,
    resolvedTasks,
    retiredTasks
  };
}

export function claimTargetedBackfillTask(queue, { taskId, worker, at = new Date().toISOString(), leaseHours = 4 } = {}) {
  const task = (queue.tasks || []).find((item) => item.taskId === taskId);
  if (!task) throw new Error(`Unknown targeted backfill task: ${taskId}`);
  if (!clean(worker)) throw new Error("A worker name is required to claim a targeted backfill task.");
  if (!["open", "no_findings", "blocked"].includes(task.state.status)) throw new Error(`Task ${taskId} is not claimable from status ${task.state.status}.`);
  task.state.status = "in_progress";
  task.state.worker = clean(worker);
  task.state.leaseExpiresAt = new Date(Date.parse(at) + leaseHours * 3600000).toISOString();
  return task;
}

export function recordTargetedBackfillRun(queue, { taskId, report = {}, at = new Date().toISOString() } = {}) {
  const task = (queue.tasks || []).find((item) => item.taskId === taskId);
  if (!task) throw new Error(`Unknown targeted backfill task: ${taskId}`);
  if (task.state.status !== "in_progress" || !task.state.worker) throw new Error(`Task ${taskId} must be claimed before recording a discovery run.`);
  const attemptedQueries = unique((report.attemptedQueries || report.attempted_queries || []).map(clean));
  if (!attemptedQueries.length) throw new Error("A discovery run must record at least one attempted query.");
  const candidates = (report.candidates || []).map((candidate) => {
    const url = clean(candidate.url);
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`Invalid candidate URL: ${url}`);
    }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`Unsupported candidate URL protocol: ${url}`);
    return {
      url: parsed.href,
      title: clean(candidate.title),
      publisher: clean(candidate.publisher || parsed.hostname.replace(/^www\./u, "")),
      sourceClass: clean(candidate.sourceClass || candidate.source_class || "unclassified"),
      discoveryMethod: clean(candidate.discoveryMethod || candidate.discovery_method || "targeted_search"),
      discoveredAt: clean(candidate.discoveredAt || candidate.discovered_at || at)
    };
  });
  const runId = `BFR-${hash(`${taskId}|${at}|${JSON.stringify({ attemptedQueries, candidates })}`)}`;
  const existingUrls = new Set(task.state.candidateSources.map((candidate) => candidate.url));
  task.state.candidateSources.push(...candidates.filter((candidate) => !existingUrls.has(candidate.url)));
  task.state.attempts.push({
    runId,
    attemptedAt: at,
    attemptedQueries,
    candidateCount: candidates.length,
    errors: (report.errors || []).map(clean).filter(Boolean)
  });
  task.state.runRefs = unique([...task.state.runRefs, runId]);
  task.state.lastAttemptAt = at;
  task.state.worker = "";
  task.state.leaseExpiresAt = "";
  task.state.status = candidates.length ? "candidates_found" : "no_findings";
  task.state.nextReviewOn = shiftDays(dateOnly(at), task.detection.gapKind === "coverage_sweep" ? 30 : 14);
  return { task, run: { runId, taskId, attemptedAt: at, attemptedQueries, candidates, errors: (report.errors || []).map(clean).filter(Boolean) } };
}

export function attachTargetedBackfillEvidence(queue, { taskId, sourceArtifactId, rawId, claimIds = [], at = new Date().toISOString() } = {}) {
  const task = (queue.tasks || []).find((item) => item.taskId === taskId);
  if (!task) throw new Error(`Unknown targeted backfill task: ${taskId}`);
  if (!clean(sourceArtifactId) || !clean(rawId)) throw new Error("Both SourceArtifact and RawDocument references are required.");
  const capture = { sourceArtifactId: clean(sourceArtifactId), rawId: clean(rawId), claimIds: unique(claimIds.map(clean)), attachedAt: at };
  task.state.captureRefs = [...task.state.captureRefs, capture];
  task.state.status = capture.claimIds.length ? "accepted_pending_rebuild" : "evidence_captured";
  if (task.detection.gapKind === "coverage_sweep" && capture.claimIds.length) task.state.nextReviewOn = shiftDays(dateOnly(at), 30);
  task.state.acceptedRefs = unique([...task.state.acceptedRefs, ...capture.claimIds]);
  return task;
}
