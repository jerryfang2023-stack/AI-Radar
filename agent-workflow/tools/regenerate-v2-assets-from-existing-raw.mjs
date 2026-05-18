import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

const dates = (args.get("dates") || "2026-05-17,2026-05-18")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const contentRoot = path.join(root, "01-SiteV2", "content");
const knowledgeRoot = path.join(root, "01-SiteV2", "knowledge");
const reportsDir = path.join(root, "agent-workflow", "reports");

const dirs = {
  raw: path.join(contentRoot, "01-raw"),
  pool: path.join(contentRoot, "02-pool"),
  businessSignals: path.join(contentRoot, "04-business-signals"),
  caseResearch: path.join(contentRoot, "05-case-research"),
  changes: path.join(knowledgeRoot, "01-Change-Cards"),
  cases: path.join(knowledgeRoot, "02-Case-Cards"),
  opinions: path.join(knowledgeRoot, "03-Opinion-Cards"),
  trends: path.join(knowledgeRoot, "04-Trend-Cards"),
  clusters: path.join(knowledgeRoot, "05-Change-Clusters"),
};

const generatedDirs = [dirs.pool, dirs.businessSignals, dirs.caseResearch, dirs.changes, dirs.cases, dirs.opinions, dirs.trends, dirs.clusters];

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
      if (dir === dirs.businessSignals && name.endsWith("-opinion-candidates.md")) continue;
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

function usable(record, type) {
  return toList(record.usable_for).includes(type);
}

function poolCandidates(records) {
  const candidates = records
    .filter((record) => isCoreEvidence(record))
    .sort((a, b) => scoreOf(b) - scoreOf(a));
  return candidates.slice(0, Math.min(40, Math.max(20, candidates.length)));
}

function displayTitle(record) {
  return short(record.title || record.discovery_record?.discovery_title || "未命名信号", 52).replace(/[。；;]$/u, "");
}

function changeTitle(record) {
  const title = displayTitle(record);
  const replacements = [
    [/普华永道.*Claude/u, "PwC 把 Claude 放进企业交付"],
    [/法律.*Claude/u, "Claude 进入法律流程部署"],
    [/Cursor.*开发环境|智能体配置开发环境/u, "Cursor 给云端 Agent 配工作台"],
    [/GitHub Copilot.*计划|Copilot.*配额/u, "Copilot 计费开始按用量重算"],
    [/OpenAI.*Brockman|产品团队/u, "OpenAI 产品线转向 Agent 组织"],
    [/sandbox|沙箱/iu, "Agent 沙箱变成企业门槛"],
    [/开源|SDK|框架|插件/iu, "开发者生态继续扩张"],
  ];
  return replacements.find(([pattern]) => pattern.test(title))?.[1] || title;
}

function caseTitle(record) {
  const companies = businessElements(record, "companies");
  const company = companies[0] || record.source_name?.split(/[：:｜|]/u)[0] || displayTitle(record).split(/[，,：:｜|]/u)[0];
  return `${short(company, 24)}：${short(displayTitle(record), 44)}`;
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
  const roleText = roles.length ? `受影响的人会先落在${short(roles.slice(0, 3).join("、"), 60)}。` : "受影响的不是泛泛的企业用户，而是要交付、审批、复核和买单的人。";
  const flowText = workflows.length ? `流程变化集中在：${short(workflows[0], 140)}。` : "真正要看的，是它是否进入合同、代码、采购、客服、财务或安全这些可复盘流程。";
  return `${roleText}${flowText}`;
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
    point: [],
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
    `  point: ${yamlArray(tags.point)}`,
  ].join("\n");
}

function changeCard(record, date, index, relatedCaseId = "") {
  const id = `CHG-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
  const title = changeTitle(record);
  const tags = formalTags(record);
  const event = short(excerpt(record, "company_action") || excerpt(record, "product_update") || excerpt(record), 420);
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

## 发生了什么

${event}

## 原始出处与证据

- [${record.source_name || "原始来源"}](${record.original_url})
- Raw：\`${record.raw_id}\`
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
- Raw：\`${record.raw_id}\`

## 证据缺口

${missing(record)}
`,
  };
}

function caseCard(record, date, index, changeId = "") {
  const id = `CASE-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
  const title = caseTitle(record);
  const tags = formalTags(record);
  const event = short(excerpt(record, "case_detail") || excerpt(record), 380);
  return {
    id,
    title,
    slug: `${date}--case--${slugify(title)}.md`,
    markdown: `---
id: ${id}
type: case_card
title: ${yamlString(title)}
date: ${date}
status: draft
created_at: ${new Date().toISOString()}
updated_at: ${new Date().toISOString()}
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

${title} 是从 Raw \`${record.raw_id}\` 中抽出的 L1 案例。它的价值不在于“又有一家公司发布了东西”，而在于这条材料暴露了一个可继续跟踪的客户、产品、流程或交付动作。

## 发生了什么

${event}

## 它支撑的变化

支撑变化卡：${changeId ? `\`${changeId}\`` : "暂未绑定正式变化卡"}。它解释的变化是：${reasonLine(record)}

## 原始出处与证据

- [${record.source_name || "原始来源"}](${record.original_url})
- Raw：\`${record.raw_id}\`
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
- Raw：\`${record.raw_id}\`

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

function regenerateOpinions(date, changeIds = []) {
  const sourceFile = path.join(dirs.businessSignals, `${date}-opinion-candidates.md`);
  if (!fs.existsSync(sourceFile)) return [];
  const markdown = fs.readFileSync(sourceFile, "utf8");
  const sections = parseSections(markdown).filter((section) => field(section.body, "stable_id"));
  return sections.map((section, index) => {
    const stableId = field(section.body, "stable_id") || `BP-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const id = stableId.replace(/^BP-/u, "OPN-");
    const parts = section.heading.split("｜").map((item) => item.trim());
    const person = parts[1] || "";
    const title = short(parts.slice(2).join("｜") || section.heading, 92);
    const original = section.body.match(/^原始观点\/摘要[：:]\s*(.+)$/mu)?.[1] || "";
    const sourceUrl = field(section.body, "source_url");
    const originalDate = field(section.body, "original_date") || date;
    const relatedChange = changeIds[index % Math.max(1, changeIds.length)] || "";
    const card = `---
id: ${id}
type: opinion_card
title: ${yamlString(title)}
date: ${date}
status: draft
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
  scenario: ["scenario-builder-point"]
  customer: []
  evidence: ["evidence-builder-view"]
  stage: ["stage-watch"]
  region: ["region-global"]
  source: ["source-social"]
  point: ["point-product-strategy"]
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
  point: []
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

${title} 还处在候选阶段。当前材料来自 ${items.length} 条 Raw 和 ${relatedChanges.length} 张变化卡，已经能看到同一类客户、流程或技术路线反复出现，但还需要更多客户采用、付费数据和反证材料。

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

- 核心 Raw：${rawRefs.slice(0, 3).map((id) => `\`${id}\``).join("、")}
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
      `## ${trend.clusterId}｜${trend.title}`,
      `- stable_id: ${trend.clusterId}`,
      "- status: watching",
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
    `# ${date} Selected Change Cards`,
    "",
    "说明：精选变化基于当日 Pool 与 Raw 证据重建，用于今日观察和商业信号前台入口。",
    "",
  ];
  changes.forEach((change, index) => {
    const record = records[index];
    const caseId = cases[index]?.id || "";
    const opinionId = opinions[index]?.id || "";
    lines.push(
      `- \`${change.id}\`｜${change.title}`,
      `  事件：${short(excerpt(record, "company_action") || excerpt(record), 160)}`,
      `  入选理由：${reasonLine(record)}`,
      `  商业含义：${businessMeaning(record)}`,
      `  Raw：\`${record.raw_id}\`｜${record.markdown_path}`,
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
  write(path.join(dirs.pool, `${date}-pool-candidates.md`), poolMarkdown(date, pool));

  const caseRecords = pool.filter((record) => usable(record, "case")).slice(0, Math.min(6, pool.length));
  const changeRecords = pool.filter((record) => usable(record, "change")).slice(0, Math.min(8, Math.max(5, pool.length)));
  const caseCards = caseRecords.map((record, index) => caseCard(record, date, index));
  const changeCards = changeRecords.map((record, index) => changeCard(record, date, index, caseCards[index]?.id || ""));

  changeCards.forEach((item) => write(path.join(dirs.changes, item.slug), item.markdown));
  caseCards.forEach((item, index) => {
    const changeId = changeCards[index]?.id || "";
    const rebuilt = caseCard(caseRecords[index], date, index, changeId);
    item.markdown = rebuilt.markdown;
    write(path.join(dirs.cases, item.slug), item.markdown);
  });

  const opinions = regenerateOpinions(date, changeCards.map((item) => item.id));
  const trends = writeTrendAndCluster(date, changeCards, caseCards, changeRecords);
  write(path.join(dirs.businessSignals, `${date}-change-cluster-candidates.md`), clusterCandidatesMarkdown(date, trends));
  write(path.join(dirs.businessSignals, `${date}-selected-change-cards.md`), selectedMarkdown(date, changeCards, changeRecords, caseCards, opinions));
  write(path.join(dirs.caseResearch, `${date}--case-research--regenerated-l1-index.md`), caseResearchMarkdown(date, caseCards.map((item) => ({ id: item.id, title: item.title }))));

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
  "| date | raw | pool | change_cards | case_cards | opinion_cards | trend_cards |",
  "|---|---:|---:|---:|---:|---:|---:|",
  ...results.map((item) => `| ${item.date} | ${item.raw} | ${item.pool} | ${item.changes} | ${item.cases} | ${item.opinions} | ${item.trends} |`),
  "",
  "Notes:",
  "- Pool was rebuilt from existing Raw JSON files only.",
  "- Change / case / trend cards are L1 candidate assets, not final research reports.",
  "- Important frontstage usage still requires daily observation writer and case-signal-researcher review.",
  "",
].join("\n");
const reportPath = path.join(reportsDir, `v2-asset-regeneration-from-existing-raw-${dates.join("_")}.md`);
write(reportPath, report);
console.log(JSON.stringify({ results, report: rel(reportPath) }, null, 2));
