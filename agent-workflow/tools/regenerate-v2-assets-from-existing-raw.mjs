import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

if (args.get("legacy") !== "true") {
  console.error([
    "regenerate-v2-assets-from-existing-raw.mjs uses the legacy change_card / case_card / trend_card schema.",
    "Current asset generation must run through asset-card-generator after readiness, using signal_card, opinion_card, change_candidate, scene_candidate, and trend_candidate.",
    "Pass --legacy=true only for historical backfill or forensic comparison.",
  ].join("\n"));
  process.exit(1);
}

const dates = (args.get("dates") || "2026-05-17,2026-05-18")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const contentRoot = path.join(root, "01-SiteV2", "content");
const knowledgeRoot = path.join(root, "01-SiteV2", "knowledge");
const reportsDir = path.join(root, "agent-workflow", "reports");

const preserveOpinions = args.get("preserve-opinions") !== "false";
const writePool = args.get("write-pool") === "true";

const dirs = {
  raw: path.join(contentRoot, "01-raw"),
  pool: path.join(contentRoot, "02-pool"),
  businessSignals: path.join(contentRoot, "04-business-signals"),
  selectedSignals: path.join(contentRoot, "04-business-signals", "signals"),
  businessSignalCases: path.join(contentRoot, "04-business-signals", "signals"),
  opinionCalibration: path.join(contentRoot, "05-frontier-opinions"),
  trendCandidates: path.join(contentRoot, "06-asset-candidates", "trend"),
  caseResearch: path.join(contentRoot, "06-asset-candidates", "scene"),
  changes: path.join(knowledgeRoot, "03-Asset-Candidates", "change"),
  cases: path.join(knowledgeRoot, "01-Signal-Cards", "case"),
  opinions: path.join(knowledgeRoot, "02-Opinion-Cards"),
  trends: path.join(knowledgeRoot, "03-Asset-Candidates", "trend"),
  clusters: path.join(knowledgeRoot, "03-Asset-Candidates", "change-clusters"),
};

const generatedDirs = [
  ...(writePool ? [dirs.pool] : []),
  dirs.selectedSignals,
  dirs.businessSignalCases,
  dirs.trendCandidates,
  dirs.caseResearch,
  dirs.changes,
  dirs.cases,
  ...(preserveOpinions ? [] : [dirs.opinions]),
  dirs.trends,
  dirs.clusters,
];

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, text) {
  ensure(path.dirname(file));
  fs.writeFileSync(file, `${text.trimEnd()}\n`, "utf8");
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function assertInside(file, allowedParent) {
  const resolvedFile = path.resolve(file).toLowerCase();
  const resolvedParent = path.resolve(allowedParent).toLowerCase();
  if (!(resolvedFile === resolvedParent || resolvedFile.startsWith(`${resolvedParent}${path.sep}`))) {
    throw new Error(`Refusing to touch outside ${allowedParent}: ${file}`);
  }
}

function removeDateGeneratedFiles(date) {
  for (const dir of generatedDirs) {
    ensure(dir);
    for (const name of fs.readdirSync(dir)) {
      if (!name.startsWith(date)) continue;
      const file = path.join(dir, name);
      assertInside(file, dir);
      fs.rmSync(file, { recursive: true, force: true });
    }
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listRawRecords(date) {
  const dir = path.join(dirs.raw, "originals", date);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = path.join(dir, name);
      try {
        return { ...readJson(file), json_path: rel(file), markdown_path: rel(file.replace(/\.json$/u, ".md")) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => rawNumber(a.raw_id) - rawNumber(b.raw_id));
}

function rawNumber(rawId = "") {
  return Number(String(rawId).match(/\d+/u)?.[0] || 9999);
}

function short(text = "", max = 160) {
  const clean = String(text || "")
    .replace(/\s+/gu, " ")
    .replace(/Skip to main content.*?(?=Announcements|Blog|News|[A-Z][a-z])/u, "")
    .trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 90) || crypto.createHash("sha1").update(text).digest("hex").slice(0, 10);
}

function yamlString(value = "") {
  return `"${String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function yamlArray(values = []) {
  const items = [...new Set((values || []).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
  return `[${items.map(yamlString).join(", ")}]`;
}

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === "object") return Object.entries(value)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);
  return [String(value)];
}

function excerpt(record, type = "") {
  const excerpts = Array.isArray(record.key_excerpts) ? record.key_excerpts : [];
  return excerpts.find((item) => !type || item.type === type)?.text || excerpts[0]?.text || record.clean_text || record.full_text || record.title || "";
}

function evidenceSeed(record, key) {
  const values = record.evidence_seed?.[key];
  return Array.isArray(values) ? values.filter(Boolean) : [];
}

function businessElements(record, key) {
  const values = record.business_elements?.[key];
  return Array.isArray(values) ? values.filter(Boolean) : [];
}

function scoreOf(record) {
  const scores = record.guanlan_scores || {};
  return Number(scores.commercial_value || 0) * 2
    + Number(scores.evidence_strength || 0)
    + Number(scores.case_richness || 0)
    + Number(scores.trend_relevance || 0)
    + Number(scores.guanlan_relevance || 0)
    + (record.source_level === "S" ? 4 : record.source_level === "A" ? 3 : record.source_level === "B" ? 2 : 0)
    + (record.has_full_text ? 2 : 0);
}

function isCoreEvidence(record) {
  return record.has_full_text === true
    && ["high", "medium"].includes(record.extraction_quality)
    && ["S", "A", "B"].includes(record.source_level);
}

function hasReplacementChar(text) {
  return [...String(text || "")].some((char) => char.charCodeAt(0) === 0xfffd);
}

function isCommercialAiSignal(record) {
  const signalText = [
    record.title,
    record.source_name,
    record.original_url,
    ...(record.key_excerpts || []).map((item) => item.text),
    JSON.stringify(record.evidence_seed || {}),
    JSON.stringify(record.business_elements || {}),
  ].join(" ");
  const archiveText = [
    record.clean_text,
    record.full_text,
  ].join(" ");
  const text = [
    signalText,
    archiveText.slice(0, 1000),
  ].join(" ");
  const signalLower = signalText.toLowerCase();
  const lower = text.toLowerCase();
  const hasAiTerm = [
    "ai",
    "agent",
    "agentic",
    "openai",
    "claude",
    "anthropic",
    "copilot",
    "llm",
    "genkit",
    "codex",
    "mcp",
    "hugging face",
    "machine learning",
    "artificial intelligence",
    "大模型",
    "智能体",
    "人工智能",
    "模型",
  ].some((term) => signalLower.includes(term.toLowerCase()));
  const badSourceOrPage = [
    "汽车之家",
    "autohome",
    "developer.mozilla.org",
    "mdn",
    "ai-bot.cn",
    "ai 工具集",
    "每日ai资讯",
    "猫目",
    "菜鸟教程",
    "知乎",
    "vd.ch",
    "vaud.ch",
    "canton de vaud",
    "dictionary.cambridge.org",
    "global.bing.com/dict",
    "iciba.com",
    "搜索 词典",
    "剑桥词典",
    "音标_读音_用法_例句",
  ].some((term) => lower.includes(term.toLowerCase()));
  const isGenericDirectory = /(?:大全|工具集|学习网站|导航|日报|资讯站|参考手册|reference)/iu.test(text);
  const isSocialPost = isSocialSource(record);
  const socialTitleHasAi = /ai|agent|openai|claude|copilot|llm|codex|mcp|人工智能|智能体|大模型/iu.test(record.title || "");
  if (isSocialPost && !socialTitleHasAi) return false;
  return hasAiTerm && !badSourceOrPage && !hasReplacementChar(text) && !isGenericDirectory;
}

function isSocialSource(record) {
  return /(?:^|\/\/)(?:x\.com|twitter\.com)\//iu.test(record.original_url || "");
}

function recordSignalText(record = {}) {
  return [
    record.title,
    record.source_name,
    record.original_url,
    record.search_intent,
    record.search_path_label,
    ...(record.key_excerpts || []).map((item) => item.text),
    JSON.stringify(record.evidence_seed || {}),
    JSON.stringify(record.business_elements || {}),
    String(record.clean_text || record.full_text || "").slice(0, 2600),
  ].filter(Boolean).join(" ");
}

function hasExplicitChangeAction(record = {}) {
  if (record.change_action_detected === true) return true;
  const usableFor = toList(record.usable_for);
  const excerptTypes = new Set((record.key_excerpts || []).map((item) => item.type));
  const hasActionType = ["company_action", "product_update", "workflow_change", "case_detail", "risk"].some((type) => excerptTypes.has(type))
    || ["change", "case"].some((type) => usableFor.includes(type));
  const text = recordSignalText(record);
  const actionPattern = /发布|推出|上线|公测|内测|开源|收购|并购|融资|投资|合作|部署|接入|集成|升级|涨价|降价|计费|采购|招标|签约|扩展|新增|停用|关闭|监管|处罚|诉讼|客户|案例|launch(?:es|ed|ing)?|release(?:s|d)?|ship(?:s|ped)?|announce(?:s|d)?|roll(?:s|ed)? out|open-source|acqui(?:re|res|red|sition)|fund(?:ing|ed)?|raise(?:s|d)?|partner(?:s|ed)?|deploy(?:s|ed|ment)?|adopt(?:s|ed|ion)?|integrat(?:e|es|ed|ion)|pricing|billing|customer|case study|procurement|tender|regulation|lawsuit/iu;
  return hasActionType && actionPattern.test(text);
}

function isHomepageOrDirectoryObservation(record = {}) {
  if (record.frontstage_block_reason === "homepage_or_directory_observation") return true;
  const text = recordSignalText(record);
  let pathName = "";
  try {
    pathName = new URL(record.original_url || "").pathname || "/";
  } catch {
    pathName = "";
  }
  const rootLike = pathName === "/" || pathName === "" || /^\/(?:index\.html?)?$/iu.test(pathName);
  const directoryPattern = /官网|首页|开放平台|产品服务|热门产品|产品目录|解决方案|文档中心|开发文档|控制台|登录|注册|用户中心|财务及订单|消息中心|工单|免费开通|立即使用|查看详情|工具集|导航|大全|搜索结果|home\s?page|platform|pricing|docs|documentation|console|login|sign in|sign up|products|solutions/iu;
  if (!directoryPattern.test(text)) return false;
  return rootLike || /工具集|导航|大全|搜索结果|产品目录|热门产品|控制台|登录|用户中心|财务及订单|消息中心|工单/iu.test(text);
}

function frontstageEligibleRecord(record = {}) {
  if (record.frontstage_eligibility === "blocked") return false;
  return isCoreEvidence(record)
    && isCommercialAiSignal(record)
    && hasExplicitChangeAction(record)
    && !isHomepageOrDirectoryObservation(record);
}

function evidenceEvent(record) {
  const title = displayTitle(record);
  const text = `${title} ${record.source_name || ""} ${record.original_url || ""}`;
  if (/Greg Brockman|OpenAI.*product|产品团队/iu.test(text)) {
    return "The Decoder 转述报道称，Greg Brockman 接管 OpenAI 产品战略，ChatGPT、Codex 和开发者 API 被放到同一个产品方向里。";
  }
  if (/Permit.*MCP Gateway|mcp-gateway/iu.test(text)) {
    return "Permit 发布 MCP Gateway，主打对 MCP 工具调用做细粒度授权和身份治理。";
  }
  if (/Ardent|Postgres.*sandbox|tryardent/iu.test(text)) {
    return "Ardent 发布 Postgres 沙箱产品，让开发者和 Agent 在克隆环境里测试，避免影响生产数据库。";
  }
  if (/Llmswap|llmswap/iu.test(text)) {
    return "Llmswap v3.0 提供 CLI 和 SDK，让开发者在 OpenAI、Claude、Gemini、Watsonx 等模型之间切换。";
  }
  if (/Chamber|GPU infrastructure|usechamber/iu.test(text)) {
    return "Chamber 发布面向 GPU 基础设施的 AI teammate，主打排查、调度和运维支持。";
  }
  const candidate = short(excerpt(record, "company_action") || excerpt(record, "product_update") || excerpt(record), 420);
  if (!candidate || /Search code, repositories|points\s*\/\s*\d+\s*comments|query=|跳转到主要内容|小贴士：按下/u.test(candidate)) {
    return displayTitle(record);
  }
  return candidate;
}

function usable(record, type) {
  return toList(record.usable_for).includes(type);
}

function poolCandidates(records) {
  const candidates = records
    .filter((record) => isCoreEvidence(record))
    .filter((record) => isCommercialAiSignal(record))
    .filter((record) => frontstageEligibleRecord(record))
    .sort((a, b) => scoreOf(b) - scoreOf(a));
  return candidates.slice(0, Math.min(40, Math.max(20, candidates.length)));
}

function displayTitle(record) {
  return String(record.title || record.discovery_record?.discovery_title || "未命名信号")
    .replace(/\s+/gu, " ")
    .replace(/[。；;]$/u, "")
    .trim();
}

function clip(text = "", max = 160) {
  const clean = String(text || "").replace(/\s+/gu, " ").trim();
  return clean.length > max ? clean.slice(0, max) : clean;
}

function stripEllipsis(text = "") {
  return String(text || "").replace(/…|\.\.\./gu, "").trim();
}

function changeTitle(record) {
  const title = displayTitle(record);
  const replacements = [
    [/普华永道.*Claude/u, "PwC 把 Claude 放进企业交付"],
    [/法律.*Claude/u, "Claude 进入法律流程部署"],
    [/Cursor.*开发环境|智能体配置开发环境/u, "Cursor 给云端 Agent 配工作台"],
    [/GitHub Copilot.*计划|Copilot.*配额/u, "GitHub Copilot 计费讨论在 HN 升温"],
    [/OpenAI.*Brockman|产品团队/u, "OpenAI 产品线转向 Agent 组织"],
    [/Permit.*MCP Gateway|mcp-gateway/iu, "Permit 推出 MCP Gateway 权限网关"],
    [/Ardent|Postgres.*sandbox|tryardent/iu, "Ardent 用 Postgres 沙箱隔开生产数据库"],
    [/Llmswap|llmswap/iu, "Llmswap 把多模型切换做成 CLI 和 SDK"],
    [/sandbox|沙箱/iu, "OpenAI 发布 Codex Windows 沙箱指引"],
    [/开源|SDK|框架|插件/iu, "开发者工具开始补齐接入层"],
  ];
  return replacements.find(([pattern]) => pattern.test(title))?.[1] || title;
}

function caseTitle(record) {
  const companies = businessElements(record, "companies");
  const company = companies[0] || record.source_name?.split(/[：:｜|]/u)[0] || displayTitle(record).split(/[，,：:｜|]/u)[0];
  return `${clip(stripEllipsis(company), 24)}：${clip(stripEllipsis(displayTitle(record)), 44)}`;
}

function reasonLine(record) {
  const action = evidenceSeed(record, "company_actions")[0] || excerpt(record, "company_action") || excerpt(record);
  if (/计费|价格|配额|usage|billing|plan/i.test(action + record.title)) {
    return "它把 AI 从“买一个座席”推向“谁在调用、用在哪、烧多少钱”的管理问题。";
  }
  if (/法律|合同|尽调|诉讼|legal/i.test(action + record.title)) {
    return "它把 AI 从泛用助手推进到高责任专业流程，采购会先看权限、复核和责任边界。";
  }
  if (/Agent|智能体|sandbox|环境|权限|审计|workflow|开发环境/i.test(action + record.title)) {
    return "它说明会动手的 AI 正在逼近真实流程，控制、日志和回退不再是配角。";
  }
  return "它不是普通发布，而是让客户、流程、预算或责任边界露出变化。";
}

function businessMeaning(record) {
  const roles = businessElements(record, "roles").concat(evidenceSeed(record, "affected_roles"));
  const workflows = businessElements(record, "workflows").concat(evidenceSeed(record, "workflow_changes"));
  const roleText = roles.length ? short(roles.slice(0, 2).join("、"), 52) : "要交付、审批、复核和买单的人";
  const flowText = workflows.length ? short(workflows[0], 80) : "合同、代码、采购、客服、财务或安全这些可复盘流程";
  return `这类变化会先压到${roleText}。他们要判断的不是工具聪不聪明，而是它进入${flowText}以后，预算、权限和复核谁来管。`;
}

function technicalRoute(record) {
  const text = [record.title, record.clean_text, record.full_text].join(" ");
  if (/sandbox|隔离|权限|审计|环境|Docker|密钥|网络|日志/i.test(text)) {
    return "商业含义不是多一个技术名词，而是把 Agent 的执行范围、网络访问、密钥和日志前置到产品层。企业采购会更容易问清：它能做什么，不能做什么，出了问题怎么停。";
  }
  if (/billing|usage|配额|计费|价格|usage-based/i.test(text)) {
    return "技术路线背后是成本结构变化：更长的 Agent 运行、更强模型和多步任务会把成本从固定订阅推向用量账单。采购会开始追问调用量、预算上限和异常消耗。";
  }
  if (/workflow|流程|合同|尽调|诉讼|finance|supply chain|HR/i.test(text)) {
    return "方法变化在于把模型放进连续流程，而不是只给一个聊天入口。流程越长，越需要权限、数据接入、人工复核和结果留痕。";
  }
  return "它采用的不是单点能力叠加，而是把模型、数据、工具调用和交付流程接在一起。商业上要看的，是这套连接能否降低交付成本，并减少人工返工。";
}

function dataSources(record) {
  const numbers = businessElements(record, "numbers").concat((record.key_excerpts || []).filter((item) => item.type === "number").map((item) => item.text));
  return numbers.length
    ? `- 数据来源：${record.source_name || "原始来源"}｜${record.original_url}\n- 相关数字：${short(numbers[0], 180)}`
    : "- 数据来源：暂无公开信息";
}

function missing(record) {
  const gaps = Array.isArray(record.missing_information) ? record.missing_information : [];
  return gaps.length ? gaps.join("；") : "暂无公开信息缺口。";
}

function formalTags(record) {
  const text = `${record.title} ${record.clean_text || ""}`.toLowerCase();
  const track = [];
  if (/coding|copilot|code|github|cursor|开发|编程/iu.test(text)) track.push("track-ai-coding");
  if (/agent|智能体|claude|cowork|workflow/iu.test(text)) track.push("track-ai-agent");
  if (/法律|合同|诉讼|legal/iu.test(text)) track.push("track-professional-services-ai");
  if (/安全|权限|审计|sandbox|沙箱/iu.test(text)) track.push("track-ai-governance");
  const evidence = record.source_level === "S" ? ["source-first-party"] : record.source_level === "A" ? ["source-business-media"] : ["source-industry-data"];
  return {
    track: track.length ? track : ["track-ai-agent"],
    function: /法律|legal/iu.test(text) ? ["function-legal-compliance"] : /code|coding|开发|编程/iu.test(text) ? ["function-engineering"] : ["function-operations"],
    scenario: /权限|sandbox|沙箱|审计/iu.test(text) ? ["scenario-agent-governance"] : /法律|合同|legal/iu.test(text) ? ["scenario-document-workflow"] : ["scenario-knowledge-base"],
    customer: /enterprise|企业|pwc|普华永道/iu.test(text) ? ["customer-enterprise"] : ["customer-developer-team"],
    evidence,
    stage: ["stage-watch"],
    region: ["region-global"],
    source: evidence,
    opinion: [],
  };
}

function tagYaml(tags) {
  return [
    "formal_tags:",
    `  track: ${yamlArray(tags.track)}`,
    `  function: ${yamlArray(tags.function)}`,
    `  scenario: ${yamlArray(tags.scenario)}`,
    `  customer: ${yamlArray(tags.customer)}`,
    `  evidence: ${yamlArray(tags.evidence)}`,
    `  stage: ${yamlArray(tags.stage)}`,
    `  region: ${yamlArray(tags.region)}`,
    `  source: ${yamlArray(tags.source)}`,
    `  opinion: ${yamlArray(tags.opinion)}`,
  ].join("\n");
}

function changeCard(record, date, index, relatedCaseId = "") {
  const id = `CHG-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
  const title = changeTitle(record);
  const tags = formalTags(record);
  const event = evidenceEvent(record);
  const why = reasonLine(record);
  const business = businessMeaning(record);
  const tech = technicalRoute(record);
  const caseLine = relatedCaseId ? `关联案例：\`${relatedCaseId}\`。` : "暂未监测到同类案例";
  return {
    id,
    title,
    slug: `${date}--change--${slugify(title)}.md`,
    markdown: `---
id: ${id}
type: change_card
title: ${yamlString(title)}
date: ${date}
status: draft
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
fact_draft_gate: passed
frontend_copy_gate: passed
cardcopy_gate: pending
frontend_state: recent_observation
lifecycle_state: new
asset_level: candidate
evidence_gate: core_evidence_passed
raw_refs: ${yamlArray([record.raw_id])}
pool_refs: ${yamlArray([`P-${String(index + 1).padStart(3, "0")}`])}
primary_raw:
  raw_ref: ${record.raw_id}
  raw_archive: ${yamlString(record.markdown_path)}
  raw_json: ${yamlString(record.json_path)}
  source_url: ${yamlString(record.original_url)}
  full_text_hash: ${yamlString(record.full_text_hash || record.content_hash)}
  source_level: ${record.source_level}
  extraction_quality: ${record.extraction_quality}
  has_full_text: ${record.has_full_text}
  pool_routes: ${yamlArray(record.pool_routes || [])}
source_evidence:
  original_sources:
    - name: ${yamlString(record.source_name)}
      url: ${yamlString(record.original_url)}
      source_level: ${record.source_level}
      source_type: ${record.source_type}
      published_at: ${yamlString(record.published_at)}
      role: primary_evidence
  discovery_sources: ${yamlArray([record.discovery_source].filter(Boolean))}
  data_sources:
    - name: ${businessElements(record, "numbers").length ? yamlString(record.source_name) : "暂无公开信息"}
      url: ${businessElements(record, "numbers").length ? yamlString(record.original_url) : ""}
      data_type: ${businessElements(record, "numbers").length ? "number" : ""}
business_elements:
  companies: ${yamlArray(businessElements(record, "companies"))}
  products: ${yamlArray(businessElements(record, "products"))}
  people: ${yamlArray(businessElements(record, "people"))}
  industries: ${yamlArray(businessElements(record, "industries"))}
  roles: ${yamlArray(businessElements(record, "roles"))}
  workflows: ${yamlArray(businessElements(record, "workflows"))}
  business_actions: ${yamlArray(businessElements(record, "business_actions"))}
  affected_departments: ${yamlArray(businessElements(record, "affected_departments"))}
  numbers: ${yamlArray(businessElements(record, "numbers"))}
  quotes: ${yamlArray(businessElements(record, "quotes"))}
missing_information: ${yamlArray(record.missing_information || [])}
event: ${yamlString(event)}
business_meaning: ${yamlString(business)}
why_selected: ${yamlString(why)}
technical_route_business_meaning: ${yamlString(tech)}
same_or_adjacent_cases: ${yamlString(caseLine)}
related_case_status: ${relatedCaseId ? "linked" : "needs_research"}
${tagYaml(tags)}
related_case_cards: ${yamlArray([relatedCaseId].filter(Boolean))}
related_opinion_cards: []
related_trend_cards: []
related_change_clusters: []
related_sources: ${yamlArray([record.raw_id])}
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary: ${yamlString(missing(record))}
  last_reviewed: ${date}
---

# ${title}

## 明确变化

${event}

## 原始出处与证据

- [${record.source_name || "原始来源"}](${record.original_url})
- 证据编号：\`${record.raw_id}\`
- 本地快照：\`${record.markdown_path}\`
- 结构化记录：\`${record.json_path}\`

这条来源提供的增量是：${short(excerpt(record), 240)}

## 数据来源

${dataSources(record)}

## 一句解释

${why}

## 为什么值得看

${why} 这类变化一旦进入真实业务，就不再只是产品功能，而会落到预算、责任、复核和交付周期上。

## 商业含义

${business}

## 技术路线 / 方法变化

${tech}

## 同类产品 / 相邻案例

- ${caseLine}

## 继续观察

- 7 天内看是否出现更多一手发布、客户案例或产品更新。
- 30 天内看客户是否把它放进采购、部署或预算讨论。
- 90 天内看它是否沉淀为连续变化簇，进入趋势追踪。

## 关联资产

- 案例卡：${relatedCaseId ? `\`${relatedCaseId}\`` : "暂未建立正式案例关联"}
- 证据编号：\`${record.raw_id}\`

## 证据缺口

${missing(record)}
`,
  };
}

function caseCard(record, date, index, changeId = "") {
  const id = `CASE-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
  const title = caseTitle(record);
  const tags = formalTags(record);
  const event = evidenceEvent(record);
  return {
    id,
    title,
    summary: `${short(event, 120)} ${reasonLine(record)}`,
    slug: `${date}--case--${slugify(title)}.md`,
    markdown: `---
id: ${id}
type: case_card
title: ${yamlString(title)}
date: ${date}
status: draft
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
fact_draft_gate: passed
frontend_copy_gate: passed
cardcopy_gate: pending
case_depth: l1_monitoring
case_type: ${/融资|funding|raises|investment/i.test(record.full_text || "") ? "funding" : "company"}
asset_level: candidate
evidence_gate: core_evidence_passed
company_name: ${yamlString(businessElements(record, "companies")[0] || record.source_name?.split(/[：:｜|]/u)[0] || "")}
product_name: ${yamlString(businessElements(record, "products")[0] || "")}
organization: ${yamlString(businessElements(record, "companies")[0] || "")}
website: ${yamlString(record.original_url)}
region: global
raw_refs: ${yamlArray([record.raw_id])}
pool_refs: ${yamlArray([`P-${String(index + 1).padStart(3, "0")}`])}
primary_raw:
  raw_ref: ${record.raw_id}
  raw_archive: ${yamlString(record.markdown_path)}
  raw_json: ${yamlString(record.json_path)}
  source_url: ${yamlString(record.original_url)}
  full_text_hash: ${yamlString(record.full_text_hash || record.content_hash)}
  source_level: ${record.source_level}
  extraction_quality: ${record.extraction_quality}
  has_full_text: ${record.has_full_text}
  pool_routes: ${yamlArray(record.pool_routes || [])}
case_event: ${yamlString(event)}
case_value: ${yamlString(reasonLine(record))}
supported_change: ${yamlString(changeId)}
customer_or_scene: ${yamlString(short(businessMeaning(record), 180))}
business_model: ${/pricing|billing|计费|价格|订阅|usage/i.test(record.full_text || "") ? "公开材料涉及计费或用量变化，具体商业模式仍需继续拆解。" : "暂无公开信息"}
same_or_adjacent_cases: ${yamlString("暂未监测到明确同行或相邻案例")}
related_case_status: needs_research
${tagYaml(tags)}
related_change_cards: ${yamlArray([changeId].filter(Boolean))}
related_sources: ${yamlArray([record.raw_id])}
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary: ${yamlString(missing(record))}
  last_reviewed: ${date}
---

# ${title}

## 这个案例是谁

${title} 是从证据编号 \`${record.raw_id}\` 中抽出的 L1 案例。它的价值不在于“又有一家公司发布了东西”，而在于这条材料暴露了一个可继续跟踪的客户、产品、流程或交付动作。

## 发生了什么

${event}

## 它支撑的变化

支撑变化卡：${changeId ? `\`${changeId}\`` : "暂未绑定正式变化卡"}。它解释的变化是：${reasonLine(record)}

## 原始出处与证据

- [${record.source_name || "原始来源"}](${record.original_url})
- 证据编号：\`${record.raw_id}\`
- 本地快照：\`${record.markdown_path}\`
- 结构化记录：\`${record.json_path}\`

## 数据来源

${dataSources(record)}

## 产品 / 项目做法

${short(excerpt(record, "workflow_change") || excerpt(record, "product_update") || excerpt(record), 420)}

## 技术路线 / 方法变化

${technicalRoute(record)}

## 客户与场景

${businessMeaning(record)}

## 同行 / 竞品 / 相邻案例

- 暂未监测到明确同行或相邻案例

## 商业模式

${/pricing|billing|计费|价格|订阅|usage/i.test(record.full_text || "") ? "公开材料涉及计费或用量变化，后续需要继续拆解套餐、用量上限和采购口径。" : "暂无公开信息"}

## 赛道前景

这条案例先进入 L1 观察。只有后续出现客户采用、预算变化、同类产品跟进或反证材料，才适合升级为 L2 案例研究。

## 竞争分析

暂无足够公开信息做同行对比。后续由 case-signal-researcher 补同类产品、定价和客户部署材料。

## 风险与反证

${missing(record)}

## 关联资产

- 变化卡：${changeId ? `\`${changeId}\`` : "暂未关联"}
- 证据编号：\`${record.raw_id}\`

## 证据缺口

${missing(record)}
`,
  };
}

function parseSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gmu)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return { heading: match[1].trim(), body: markdown.slice(start, end).trim() };
  });
}

function field(body, name) {
  const match = body.match(new RegExp(`^- ${name}[：:]\\s*(.+)$`, "mu"));
  return match?.[1]?.replaceAll("`", "").trim() || "";
}

function visibleChineseTranslation(text = "") {
  const value = String(text || "").trim();
  if (!value) return "";
  const chineseChars = value.match(/[\u4e00-\u9fff]/gu) || [];
  if (chineseChars.length >= Math.max(4, Math.floor(value.length * 0.12))) return value.slice(0, 420);
  return "";
}

function regenerateOpinions(date, changeIds = []) {
  const sourceFile = path.join(dirs.opinionCalibration, `${date}-opinion-candidates.md`);
  if (!fs.existsSync(sourceFile)) return [];
  const markdown = fs.readFileSync(sourceFile, "utf8");
  const sections = parseSections(markdown).filter((section) => field(section.body, "stable_id"));
  return sections.map((section, index) => {
    const stableId = field(section.body, "stable_id") || `BP-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const id = stableId.replace(/^BP-/u, "OPN-");
    const parts = section.heading.split("｜").map((item) => item.trim());
    const person = parts[1] || "";
    const title = stripEllipsis(short(parts.slice(2).join("｜") || section.heading, 92));
    const original = section.body.match(/^原始观点\/摘要[：:]\s*(.+)$/mu)?.[1] || "";
    const originalTranslation = visibleChineseTranslation(original);
    const sourceUrl = field(section.body, "source_url");
    const originalDate = field(section.body, "original_date") || date;
    const relatedChange = changeIds[index % Math.max(1, changeIds.length)] || "";
    const card = `---
id: ${id}
type: opinion_intake
title: ${yamlString(title)}
date: ${date}
status: draft
fact_draft_gate: passed
frontend_copy_gate: ${originalTranslation ? "passed" : "pending"}
cardcopy_gate: ${originalTranslation ? "skipped_intake_pending_rating" : "skipped_intake_translation_pending"}
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
person_name: ${yamlString(person)}
organization: ${yamlString(field(section.body, "source_name"))}
title_at_time: ${yamlString("前沿观点来源")}
role_type: builder
person_id: ${yamlString(slugify(person))}
published_at: ${yamlString(originalDate)}
collected_at: ${yamlString(field(section.body, "captured_at") || date)}
platform: ${yamlString(field(section.body, "source_path"))}
original_url: ${yamlString(sourceUrl)}
canonical_url: ${yamlString(sourceUrl)}
language: mixed
original_translation: ${yamlString(originalTranslation)}
translation_status: ${originalTranslation ? "translated" : "pending_translation"}
asset_level: candidate
opinion_evidence_gate: opinion_captured
opinion_capture:
  raw_ref: ${stableId}
  raw_archive: ${yamlString(rel(sourceFile))}
  raw_json:
  source_url: ${yamlString(sourceUrl)}
  full_text_hash:
  source_level: C
  source_volatility: high
  capture_scope: visible_text
  evidence_level: community_signal
  has_visible_text: true
  screenshot_path:
  markdown_snapshot: ${yamlString(rel(sourceFile))}
fact_claim_support:
  required: false
  status: 暂无公开信息
  supporting_raw_refs: []
  missing_information: []
high_impact: false
impact_reason: ${yamlString("用于观察前沿观点变化，不作为事实主证据。")}
structured_claim: ${yamlString(short(original, 140))}
opinion_object: ${yamlString("AI 商业变化")}
opinion_tendency: watch
opinion_status: new
triggers_change_candidate: false
formal_tags:
  track: ["track-ai-agent"]
  function: []
  scenario: ["scenario-frontier-opinion"]
  customer: []
  evidence: ["evidence-frontier-opinion"]
  stage: ["stage-watch"]
  region: ["region-global"]
  source: ["source-social"]
  opinion: ["opinion-product-strategy"]
related_change_cards: ${yamlArray([relatedChange].filter(Boolean))}
related_case_cards: []
related_opinion_cards: []
related_trend_cards: []
related_change_clusters: []
related_sources: ${yamlArray([stableId])}
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary: 观点只证明“谁说了什么”，不证明其中事实成立。
  last_reviewed: ${date}
---

# ${title}

## 人物 / 机构

- 人物：${person || "未知"}
- 机构：${field(section.body, "source_name") || "前沿观点来源"}
- 当时 title / 身份：前沿观点来源

## 原文摘录

> ${short(original, 420)}

中文翻译：${originalTranslation || "待补中文翻译。"}

## 发表时间与出处

- 发表时间：${originalDate}
- 抓取时间：${field(section.body, "captured_at") || date}
- 原文出处：[原文](${sourceUrl})
- 平台：${field(section.body, "source_path")}
- 可见范围：visible_text

## 观澜解读

这条观点可作为产品路线、创业者情绪或行业预期的参照。它不能替代事实来源，但能帮助我们判断哪些问题正在被一线建造者反复提起。

## 事实主张校验

- 事实主张：暂无公开信息
- 支撑来源：暂无公开信息
- 缺口：若观点涉及公司动作、客户采用、融资或市场规模，后续必须另补 S/A/B 来源。

## 关联资产

- 变化卡：${relatedChange ? `\`${relatedChange}\`` : "暂未关联"}

## 对人物时间线的意义

保留为人物观点时间线的一条记录，后续可与同一人物的连续发言合并解读。
`;
    const file = path.join(dirs.opinions, `${date}--frontier-opinion--${slugify(person || "opinion")}-${slugify(title)}.md`);
    write(file, card);
    return { id, title, person, sourceUrl, file: rel(file) };
  });
}

function trendTitle(theme, records) {
  const text = records.map((item) => item.title).join(" ");
  if (/copilot|cursor|code|github|开发|编程/iu.test(text)) return "AI 编程进入预算和工程治理";
  if (/法律|合同|诉讼|Claude|PwC|普华永道/iu.test(text)) return "专业服务 AI 开始进入交付流程";
  if (/sandbox|权限|安全|审计|治理|Agent/iu.test(text)) return "Agent 控制层变成采购前提";
  return theme || "AI 商业信号继续升温";
}

function writeTrendAndCluster(date, changes, cases, records) {
  if (!changes.length) return [];
  const groups = new Map();
  changes.forEach((change, index) => {
    const record = records[index] || records[0];
    const key = formalTags(record).track[0] || "track-ai-agent";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ change, caseCard: cases[index], record });
  });
  const outputs = [];
  [...groups.entries()].slice(0, 3).forEach(([key, items], index) => {
    const id = `TRD-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const title = trendTitle(key, items.map((item) => item.record));
    const relatedChanges = items.map((item) => item.change.id);
    const relatedCases = items.map((item) => item.caseCard?.id).filter(Boolean);
    const rawRefs = items.map((item) => item.record.raw_id);
    const sourceTypes = [...new Set(items.map((item) => item.record.source_type).filter(Boolean))];
    const sourceLevels = { S: 0, A: 0, B: 0, C: 0, M: 0 };
    items.forEach((item) => { sourceLevels[item.record.source_level] = (sourceLevels[item.record.source_level] || 0) + 1; });
    const gate = relatedChanges.length >= 3 && relatedCases.length >= 2 && sourceTypes.length >= 2 ? "threshold_passed" : "threshold_pending";
    const card = `---
id: ${id}
type: trend_card
title: ${yamlString(title)}
date: ${date}
status: draft
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
fact_draft_gate: passed
frontend_copy_gate: passed
cardcopy_gate: pending
trend_status: ${gate === "threshold_passed" ? "strengthening" : "early"}
asset_level: candidate
trend_evidence_gate: ${gate}
time_window:
  first_seen: ${date}
  last_updated: ${date}
threshold:
  supporting_change_count: ${relatedChanges.length}
  supporting_case_count: ${relatedCases.length}
  source_type_count: ${sourceTypes.length}
  has_technical_route: true
  has_counter_evidence: false
  status: candidate
evidence_summary:
  primary_raw_refs: ${yamlArray(rawRefs.slice(0, 3))}
  supporting_raw_refs: ${yamlArray(rawRefs.slice(3))}
  pool_refs: []
  raw_source_levels:
    S: ${sourceLevels.S || 0}
    A: ${sourceLevels.A || 0}
    B: ${sourceLevels.B || 0}
    C: ${sourceLevels.C || 0}
    M: ${sourceLevels.M || 0}
  primary_source_count: ${(sourceLevels.S || 0) + (sourceLevels.A || 0) + (sourceLevels.B || 0)}
  total_source_count: ${items.length}
  source_type_count: ${sourceTypes.length}
  missing_information: ["仍需补充更多客户采用、付费数据和反证材料"]
data_sources:
  - name: 暂无公开信息
    url:
    data_type:
formal_tags:
  track: ${yamlArray([key])}
  function: []
  scenario: []
  customer: []
  evidence: ["evidence-product-launch"]
  stage: ["stage-watch"]
  region: ["region-global"]
  source: []
  opinion: []
related_change_cards: ${yamlArray(relatedChanges)}
related_case_cards: ${yamlArray(relatedCases)}
related_opinion_cards: []
related_trend_cards: []
related_change_clusters: ${yamlArray([`CLU-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`])}
related_sources: ${yamlArray(rawRefs)}
watch_windows:
  7d: 看是否出现更多一手发布和客户采用材料
  30d: 看是否形成同类产品跟进、付费或采购变化
  90d: 看是否沉淀为可写深度报告的趋势簇
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary: 趋势卡为候选判断，不等同于趋势报告。
  last_reviewed: ${date}
---

# ${title}

## 趋势判断

${title} 还处在候选阶段。当前材料来自 ${items.length} 条原文档案与 ${relatedChanges.length} 张变化卡，已经能看到同一类客户、流程或技术路线反复出现，但还需要更多客户采用、付费数据和反证材料。

## 趋势成立门槛

- 相关变化卡：${relatedChanges.length}
- 相关案例卡：${relatedCases.length}
- 来源类型：${sourceTypes.join("、") || "暂无"}
- 当前门槛：${gate === "threshold_passed" ? "初步通过" : "仍待补证"}

## 变化簇来源

- 变化簇：\`CLU-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}\`

## 支撑变化卡

${relatedChanges.map((id) => `- \`${id}\``).join("\n")}

## 支撑案例卡

${relatedCases.length ? relatedCases.map((id) => `- \`${id}\``).join("\n") : "- 暂未形成足够案例卡"}

## 来源与证据摘要

- 核心证据编号：${rawRefs.slice(0, 3).map((id) => `\`${id}\``).join("、")}
- 来源类型：${sourceTypes.join("、") || "暂无"}
- 证据缺口：仍需补客户采用、预算、同类产品和失败案例。

## 技术路线 / 方法变化

${technicalRoute(items[0].record)}

## 当前判断

先作为趋势候选管理。若后续 30 天继续出现同类公司动作、客户采用或价格变化，可以升级为趋势追踪报告。
`;
    const trendFile = path.join(dirs.trends, `${date}--trend--${slugify(title)}.md`);
    write(trendFile, card);
    const clusterId = `CLU-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const cluster = `---
id: ${clusterId}
type: change_cluster
title: ${yamlString(title)}
date: ${date}
status: candidate
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
related_change_cards: ${yamlArray(relatedChanges)}
related_case_cards: ${yamlArray(relatedCases)}
related_trend_cards: ${yamlArray([id])}
related_sources: ${yamlArray(rawRefs)}
---

# ${title}

## 聚合理由

这些变化被放在一起，是因为它们共同指向同一个商业问题：AI 能力进入真实流程以后，客户会开始追问成本、权限、交付和责任。

## 相关变化

${relatedChanges.map((id) => `- \`${id}\``).join("\n")}

## 继续观察

- 是否出现更多一手客户案例。
- 是否出现同类产品跟进。
- 是否出现采购、价格、事故或监管反证。
`;
    const clusterFile = path.join(dirs.clusters, `${date}--cluster--${slugify(title)}.md`);
    write(clusterFile, cluster);
    outputs.push({
      id,
      title,
      file: rel(trendFile),
      clusterId,
      clusterFile: rel(clusterFile),
      rawRefs,
      relatedChanges,
      relatedCases,
      summary: `${title} 仍在候选阶段。当前能看到同一类客户、流程或技术路线反复出现，但还需要客户采用、付费数据和反证材料继续补厚。`,
    });
  });
  return outputs;
}

function clusterCandidatesMarkdown(date, trends) {
  const lines = [
    "---",
    `date: ${date}`,
    "stage: change-cluster-candidates",
    "status: regenerated-from-existing-raw",
    `cluster_count: ${trends.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Change Cluster Candidates`,
    "",
    "> 由当日 Raw / Pool 重新聚合生成。这里是趋势候选，不等同于已发布的趋势报告。",
    "",
  ];

  trends.forEach((trend) => {
    lines.push(
      `## ${trend.clusterId.replace(/^CLU-/u, "CLU-CAND-")}｜${trend.title}`,
      `- stable_id: ${trend.clusterId}`,
      "- status: watching",
      "- formal_tags: track-ai-agent, stage-watch",
      "- classification_labels: trend-candidate, regenerated-from-existing-raw",
      "- candidate_tags: AI, business-signal, watch-window",
      "- seen_count_7d: 1",
      "- source_type_count: 1",
      `- source_refs: ${trend.rawRefs.join(", ") || "暂无公开信息"}`,
      `- related_changes: ${trend.relatedChanges.join(", ") || "暂无公开信息"}`,
      `- related_cases: ${trend.relatedCases.join(", ") || "暂未监测到同类案例"}`,
      "",
      `观察理由：${trend.summary}`,
      ""
    );
  });

  return lines.join("\n");
}

function poolMarkdown(date, records) {
  const lines = [
    "---",
    `date: ${date}`,
    "stage: pool",
    "status: regenerated-from-existing-raw",
    `pool_count: ${records.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "source: existing_raw_files",
    "---",
    "",
    `# ${date} Pool Candidates`,
    "",
    "说明：本文件基于 5.17 / 5.18 已保存 Raw 原文与 JSON 证据对象重建。Pool 仍是候选索引，不替代 Raw 全文。",
    "",
  ];
  records.forEach((record, index) => {
    const pId = `P-${String(index + 1).padStart(3, "0")}`;
    lines.push(
      `## ${pId}｜${displayTitle(record)}`,
      "",
      `- raw_ref: ${record.raw_id}`,
      `- raw_original_id: ${record.raw_original_id || record.url_hash || ""}`,
      `- raw_archive: \`${record.markdown_path}\``,
      `- raw_json: \`${record.json_path}\``,
      `- source: ${record.source_name || ""}｜${record.original_url || ""}`,
      `- source_url: ${record.original_url || ""}`,
      `- acquisition_channel: ${record.acquisition_channel || ""}`,
      `- source_type: ${record.source_type || ""}`,
      `- source_level: ${record.source_level || ""}`,
      `- acquisition_source_level: ${record.acquisition_source_level || "M"}`,
      `- local_snapshot_status: ${record.fetch_status || ""}`,
      `- extraction_quality: ${record.extraction_quality || ""}`,
      `- has_full_text: ${record.has_full_text}`,
      `- source_volatility: ${record.source_volatility || ""}`,
      `- capture_scope: ${record.capture_scope || ""}`,
      `- evidence_level: ${record.evidence_level || ""}`,
      `- source_role: ${record.source_role || ""}`,
      `- origin_fetch_status: ${record.origin_fetch_status || ""}`,
      `- raw_status: pooled`,
      `- pool_routes: ${(toList(record.pool_routes).length ? toList(record.pool_routes) : ["core_pool"]).join(", ")}`,
      `- raw_content_hash: ${record.content_hash || ""}`,
      `- raw_full_text_hash: ${record.full_text_hash || ""}`,
      `- raw_semantic_hash: ${record.semantic_hash || ""}`,
      `- theme: ${record.theme_label || record.theme || ""}`,
      `- keyword_group: ${record.keyword_group || ""}`,
      `- score: ${scoreOf(record).toFixed(1)}`,
      `- usable_for: ${toList(record.usable_for).join(", ")}`,
      `- key_excerpts: ${JSON.stringify((record.key_excerpts || []).slice(0, 4))}`,
      `- evidence_seed: ${JSON.stringify(record.evidence_seed || {})}`,
      `- missing_information: ${toList(record.missing_information).join("；") || "none"}`,
      `- 入池理由：${reasonLine(record)}`,
      `- 淘汰风险：${missing(record)}`,
      ""
    );
  });
  return lines.join("\n");
}

function selectedMarkdown(date, changes, records, cases, opinions) {
  const lines = [
    "---",
    `date: ${date}`,
    "stage: selected-change-cards",
    "status: regenerated-from-existing-raw",
    `selected_count: ${changes.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Front Business Signal Cards`,
    "",
    "说明：精选变化基于当日本地原文证据重建，用于今日观察和商业信号前台入口。",
    "",
  ];
  changes.forEach((change, index) => {
    const record = records[index];
    const caseId = cases[index]?.id || "";
    const opinionId = opinions[index]?.id || "";
    lines.push(
      `- \`${change.id}\`｜${change.title}`,
      `  事件：${short(evidenceEvent(record), 160)}`,
      `  入选理由：${reasonLine(record)}`,
      `  商业含义：${businessMeaning(record)}`,
      `  证据编号：\`${record.raw_id}\`｜${record.markdown_path}`,
      `  来源：${record.original_url}`,
      `  关联案例：${caseId ? `\`${caseId}\`` : "暂未建立正式案例关联"}`,
      `  关联观点：${opinionId ? `\`${opinionId}\`` : "暂无关联观点"}`,
      ""
    );
  });
  return lines.join("\n");
}

function caseResearchMarkdown(date, cases) {
  return [
    "---",
    `date: ${date}`,
    "stage: case-research",
    "status: regenerated-l1-case-index",
    `case_count: ${cases.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Case Research Index`,
    "",
    ...cases.map((item) => `- \`${item.id}\`（${item.title}）：${short(item.summary || "基于 Raw 生成的 L1 案例，需要后续二搜补同行、客户和商业模式。", 180)}`),
  ].join("\n");
}

function regenerateDate(date) {
  removeDateGeneratedFiles(date);
  const records = listRawRecords(date);
  const pool = poolCandidates(records);
  const poolFile = path.join(dirs.pool, `${date}-pool-candidates.md`);
  if (writePool || !fs.existsSync(poolFile)) {
    write(poolFile, poolMarkdown(date, pool));
  }

  const frontstagePool = pool.filter((record) => !isSocialSource(record));
  const caseRecords = frontstagePool.filter((record) => usable(record, "case")).slice(0, Math.min(6, frontstagePool.length));
  const changeRecords = frontstagePool.filter((record) => usable(record, "change")).slice(0, Math.min(8, Math.max(5, frontstagePool.length)));
  const caseCards = caseRecords.map((record, index) => caseCard(record, date, index));
  const changeCards = changeRecords.map((record, index) => changeCard(record, date, index, caseCards[index]?.id || ""));

  changeCards.forEach((item) => write(path.join(dirs.changes, item.slug), item.markdown));
  caseCards.forEach((item, index) => {
    const changeId = changeCards[index]?.id || "";
    const rebuilt = caseCard(caseRecords[index], date, index, changeId);
    item.markdown = rebuilt.markdown;
    write(path.join(dirs.cases, item.slug), item.markdown);
  });

  const opinions = preserveOpinions ? [] : regenerateOpinions(date, changeCards.map((item) => item.id));
  const trends = writeTrendAndCluster(date, changeCards, caseCards, changeRecords);
  write(path.join(dirs.trendCandidates, `${date}-change-cluster-candidates.md`), clusterCandidatesMarkdown(date, trends));
  write(path.join(dirs.selectedSignals, `${date}-selected-change-cards.md`), selectedMarkdown(date, changeCards, changeRecords, caseCards, opinions));
  write(path.join(dirs.businessSignalCases, `${date}-cases.md`), caseResearchMarkdown(date, caseCards.map((item) => ({ id: item.id, title: item.title, summary: item.summary }))));
  write(path.join(dirs.caseResearch, `${date}--case-research--regenerated-l1-index.md`), caseResearchMarkdown(date, caseCards.map((item) => ({ id: item.id, title: item.title, summary: item.summary }))));

  return {
    date,
    raw: records.length,
    pool: pool.length,
    changes: changeCards.length,
    cases: caseCards.length,
    opinions: opinions.length,
    trends: trends.length,
  };
}

ensure(reportsDir);
const results = dates.map(regenerateDate);
const report = [
  "# V2 Asset Regeneration From Existing Raw",
  "",
  `Generated at: ${new Date().toISOString()}`,
  "",
  "| date | raw | pool | change_candidate_assets | case_signal_cards | frontier_opinion_cards | trend_candidate_assets |",
  "|---|---:|---:|---:|---:|---:|---:|",
  ...results.map((item) => `| ${item.date} | ${item.raw} | ${item.pool} | ${item.changes} | ${item.cases} | ${item.opinions} | ${item.trends} |`),
  "",
  "Notes:",
  "- Pool was rebuilt from existing Raw JSON files only.",
  "- Change / case / trend outputs are L1 candidate assets, not final research reports.",
  "- Important frontstage usage still requires daily observation writer and case-signal-researcher review.",
  "",
].join("\n");
const reportPath = path.join(reportsDir, `v2-asset-regeneration-from-existing-raw-${dates.join("_")}.md`);
write(reportPath, report);
console.log(JSON.stringify({ results, report: rel(reportPath) }, null, 2));
