import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readTagTaxonomy, toSiteTag } from "../../../agent-workflow/tools/tag-taxonomy-utils.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const projectRoot = path.resolve(siteRoot, "..", "..");
const contentRoot = path.join(projectRoot, "01-SiteV2", "content");
const knowledgeRoot = path.join(projectRoot, "01-SiteV2", "knowledge");
const dataDir = path.join(siteRoot, "data");
const requestedDate = process.argv.find((arg) => arg.startsWith("--date="))?.slice("--date=".length);
const publicSiteStartDate = "2026-05-20";

function publicDate(date) {
  return date && date >= publicSiteStartDate ? date : "";
}

function withoutFrontmatter(markdown) {
  return markdown.replace(/^\uFEFF?/u, "").replace(/^---[\s\S]*?---\s*/u, "");
}

function splitSections(markdown) {
  const sections = [];
  const pattern = /^##\s+(.+)$/gmu;
  const matches = [...markdown.matchAll(pattern)];
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    sections.push({ heading: match[1].trim(), body: markdown.slice(start, end).trim() });
  });
  return sections;
}

function field(body, name) {
  const match = body.match(new RegExp(`^- ${name}[：:]\\s*(.+)$`, "mu"));
  return match?.[1]?.replaceAll("`", "").trim() || "";
}

function paragraphAfterFields(body) {
  return body
    .replace(/^- .+$/gmu, "")
    .split(/\n{2,}/u)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join("\n\n");
}

function slugify(text) {
  return cleanPublicText(text)
    .toLowerCase()
    .replace(/[｜|].*$/u, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 80);
}

function cleanPublicText(text = "") {
  return text
    .replace(/后台流程/g, "企业流程")
    .replace(/后台/g, "企业流程")
    .replace(/JSON/g, "结构化数据")
    .replace(/同步/g, "更新")
    .replace(/字段/g, "信息项")
    .replace(/证据链/g, "来源与事实")
    .replace(/强证据/g, "较强信号")
    .replace(/中证据/g, "补充信号")
    .replace(/下一步验证/g, "观察变量")
    .replace(/机会确定/g, "机会判断")
    .replace(/确定性/g, "证据状态")
    .replace(/Builders?\s*观点/giu, "前沿观点")
    .replace(/builder\s*观点/giu, "前沿观点")
    .replace(/一线观点/g, "前沿观点")
    .replace(/观点校准/g, "前沿观点")
    .replace(/趋势背景/g, "趋势线索")
    .replace(/判断资产/g, "观察")
    .replace(/判断链/g, "观察线索")
    .replace(/证据积累/g, "信息增加")
    .replace(/背景输入/g, "观察背景")
    .replace(/高热三元组/g, "主要变化")
    .replace(/赋能/g, "支持")
    .replace(/生态闭环/g, "平台协作")
    .replace(/闭环/g, "连续流程")
    .replace(/生态/g, "平台环境")
    .replace(/demo/g, "演示")
    .replace(/AI商业/g, "AI 商业")
    .trim();
}

function parseRelationTokens(text = "") {
  const tokens = [];
  let currentType = "";
  const normalizeType = (value) => ({
    signals: "signal",
    trends: "trend",
    points: "point",
    cases: "case",
    trendReports: "trendReport",
  }[value.trim()] || value.trim());
  text
    .replaceAll("`", "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((part) => {
      const [maybeType, ...rest] = part.split(":");
      if (rest.length) {
        currentType = normalizeType(maybeType);
        rest.join(":").split(/[，,]/u).map((value) => value.trim()).filter(Boolean).forEach((value) => {
          tokens.push(`${currentType}:${value}`);
        });
      } else if (currentType) {
        tokens.push(`${currentType}:${part}`);
      }
    });
  return tokens;
}

function extractReferenceIds(text = "", prefixes = []) {
  const allowed = prefixes.length ? prefixes.join("|") : "CHG|CASE|OPN|BP|TRD|PUB";
  const pattern = new RegExp(`\\b(?:${allowed})-\\d{8}-\\d{2}\\b`, "gu");
  return [...new Set(String(text).replaceAll("`", "").match(pattern) || [])];
}

function relationFieldFromSelectedCards(caseText = "", opinionText = "") {
  const cases = extractReferenceIds(caseText, ["CASE"]);
  const points = extractReferenceIds(opinionText, ["OPN", "BP"]);
  return [
    cases.length ? `cases:${cases.join(",")}` : "",
    points.length ? `points:${points.join(",")}` : "",
  ].filter(Boolean).join(",");
}

const tagTaxonomy = readTagTaxonomy(projectRoot).map(toSiteTag);

const tagById = new Map(tagTaxonomy.map((tag) => [tag.id, tag]));

function tagsFromIds(ids) {
  const seen = new Set();
  return ids
    .map((id) => tagById.get(id))
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag.id)) return false;
      seen.add(tag.id);
      return true;
    });
}

function inferTags(item = {}, type = "signal") {
  const text = [
    item.title,
    item.brief,
    item.judgment,
    item.oneLine,
    item.interpretation,
    item.calibrates,
    item.usage,
    item.sourceUrl,
    item.relationFields,
    ...(item.relations || []),
  ].filter(Boolean).join(" ");
  const ids = [];
  const add = (...next) => ids.push(...next);
  const has = (pattern) => pattern.test(text);

  if (type === "signal") add("source-first-party", "evidence-product-launch");
  if (type === "case") add("source-first-party", "evidence-customer-adoption");
  if (type === "trend") add("stage-rising");
  if (type === "trendReport") add("function-operations", "stage-watch", "region-china");
  if (type === "point") {
    add("scenario-frontier-opinion", "evidence-frontier-opinion", "source-social");
    if (has(/Coding|代码|编程|工程/u)) add("opinion-ai-coding");
    else if (has(/安全|治理|权限|审计/u)) add("opinion-ai-safety-governance");
    else if (has(/模型|算力|memory|记忆|Infra/u)) add("opinion-model-infra");
    else add("opinion-agent-workflow");
  }

  if (has(/Coding|代码|编程|开发|IDE|仓库|CI|工程/u)) add("track-ai-coding", "function-engineering", "customer-developer-team");
  if (has(/Agent|智能体|控制平面|权限|审计|治理|工作流|执行/u)) add("track-ai-agent", "track-ai-governance", "scenario-agent-governance");
  if (has(/企业|工作流|流程|交付链|采购|财务|审批/u)) add("track-enterprise-workflow", "customer-enterprise");
  if (has(/数据|RAG|知识库|记忆|memory/u)) add("track-enterprise-data");
  if (has(/模型|算力|推理|Infra|基础设施|API/u)) add("track-ai-infra");
  if (has(/咨询|服务|法务|专业/u)) add("track-professional-services-ai");
  if (has(/客服|工单|质检|售后|语音/u)) add("track-ai-customer-service", "function-customer-service", "scenario-customer-ticket");
  if (has(/采购|应付|投标|招标/u)) add("function-procurement-bidding", "evidence-procurement");
  if (has(/融资|投资|估值|ARR|收入|营收|Series|轮/u)) add("evidence-funding");
  if (has(/客户|部署|采用|上线|合作|采购/u)) add("evidence-customer-adoption");
  if (has(/发布|推出|launch|平台|产品/u)) add("evidence-product-launch");
  if (has(/风险|反证|安全|合规/u)) add("stage-risk");
  if (has(/升温|预算|值得关注|开始|进入/u)) add("stage-rising");
  if (has(/观察|证据积累|缺口/u)) add("stage-watch");
  if (has(/中国|本土|迁移/u)) add("region-china");
  if (has(/美国|US|Anthropic|OpenAI|Snowflake|Okta|PwC|Collibra/u)) add("region-us", "region-global");
  if (has(/https?:\/\/|官网|官方|press|blog/u)) add("source-first-party");
  if (has(/youtube|访谈|playlist/u)) add("source-podcast");
  if (has(/x\.com|twitter|社区/u)) add("source-social");

  return tagsFromIds(ids).slice(0, 12);
}

function sectionText(body, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = body.match(new RegExp(`^###\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^###\\s+|(?![\\s\\S]))`, "mu"));
  return cleanPublicText(match?.[1]?.trim() || "");
}

function splitSubsections(body) {
  const sections = [];
  const pattern = /^###\s+(.+)$/gmu;
  const matches = [...body.matchAll(pattern)];
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    sections.push([cleanPublicText(match[1].trim()), cleanPublicText(body.slice(start, end).trim())]);
  });
  return sections;
}

function parseNumberedList(text) {
  const blocks = [...String(text || "").matchAll(/^\d+\.\s*([^\n]+)\n([\s\S]*?)(?=^\d+\.|(?![\s\S]))/gmu)];
  return blocks
    .map((match) => {
      const rawHead = cleanPublicText(match[1].trim());
      const rawBody = match[2] || "";
      const split = rawHead.split(/[：:]/u);
      const label = normalizeDimensionLabel((split[0] || "").replace(/[？?]\s*$/u, "").trim());
      const inline = split.length > 1 ? split.slice(1).join(":").trim() : "";
      const value = cleanPublicText(`${inline}\n${rawBody}`.replace(/\n+/g, " ").trim());
      return [label, value];
    })
    .filter(([, value]) => value);
}

function normalizeDimensionLabel(label) {
  return {
    "目标客户": "首要感受者",
    "替代流程": "流程变化",
    "商业模式": "价值来源",
    "为什么现在": "触发信号",
    "中国市场迁移": "成立边界",
    "解决什么具体问题？": "具体问题",
    "目标客户是谁？": "首要感受者",
    "替代或优化什么流程？": "流程变化",
    "商业模式怎么赚钱？": "价值来源",
    "为什么现在值得关注？": "触发信号",
    "是否可迁移中国市场？": "成立边界",
  }[label.trim()] || label.trim();
}

function parseStructured(markdown) {
  const map = new Map();
  splitSections(withoutFrontmatter(markdown)).forEach(({ heading, body }) => {
    const [id, title] = heading.split("｜");
    const analysis = parseNumberedList(sectionText(body, "六维分析"));
    map.set(field(body, "stable_id") || id.trim(), {
      id: field(body, "stable_id") || id.trim(),
      title: title?.trim() || heading.trim(),
      sourcePath: field(body, "source_path"),
      rawRefs: field(body, "raw_refs"),
      relationFields: field(body, "relation_fields"),
      analysis,
      counter: sectionText(body, "Evidence Gaps") || sectionText(body, "HeatEvidence"),
    });
  });
  return map;
}

function parseFrontSignals(frontMarkdown, structuredMap, currentDate) {
  return splitSections(withoutFrontmatter(frontMarkdown)).map(({ heading, body }, index) => {
    if (/^入选结论|^未进入前台/u.test(heading)) return null;
    let title = heading
      .replace(/^Signal\s+\d+\s*[｜|]\s*/u, "")
      .replace(/^Signal\s+/u, "")
      .replace(/^FS-\d+-\d+\s*[｜|]\s*/u, "")
      .replace(/^\w+-\d+-\d+\s*/u, "")
      .trim();
    if (!title) title = field(body, "标题");
    if (!title) return null;
    const structuredRefs = field(body, "structured_refs").split(",").map((item) => item.trim()).filter(Boolean);
    const structuredRef = structuredRefs[0];
    const structured = structuredMap.get(structuredRef) || {};
    const stableId = field(body, "stable_id") || heading.match(/FS-\d+-\d+/u)?.[0] || `FS-${currentDate.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const relationFields = field(body, "relation_fields");
    const brief = paragraphAfterFields(body).split("\n\n")[0] || body.match(/^- 观澜解读[：:]\s*(.+)$/mu)?.[1] || "";
    const judgment = paragraphAfterFields(body).split("\n\n")[1] || body.match(/^- 观澜解读[：:]\s*(.+)$/mu)?.[1] || brief;
    const sourceCount = [...body.matchAll(/https?:\/\//gu)].length;
    const signal = {
      id: stableId,
      slug: slugify(title) || `signal-${index + 1}`,
      title: cleanPublicText(title),
      date: currentDate,
      brief: cleanPublicText(brief),
      judgment: cleanPublicText(judgment),
      sources: structured.rawRefs ? `${structured.rawRefs.split(",").length} 条原始线索` : (sourceCount ? `${sourceCount} 条来源线索` : "来源已归档"),
      sourcePath: field(body, "source_paths"),
      audience: structured.analysis?.find(([label]) => label === "首要感受者")?.[1] || "商业决策者 / 产品负责人 / 企业服务创业者",
      coordinates: relationFields.split(",").map((item) => item.split(":")[1]?.trim() || item.trim()).filter(Boolean).slice(0, 3),
      structuredRefs,
      relations: parseRelationTokens(relationFields),
      relationFields,
      analysis: structured.analysis?.length ? structured.analysis : [],
      calibration: "这些观点可作为补充视角，不替代事实来源。",
      counter: cleanPublicText(field(body, "evidence_gaps") || body.match(/^- 反证 \/ 风险[：:]\s*(.+)$/mu)?.[1] || structured.counter || "仍需继续观察客户采用、预算归属和部署周期。"),
      link: `signal-detail.html?id=${slugify(title) || `signal-${index + 1}`}`,
    };
    return { ...signal, tags: inferTags(signal, "signal") };
  }).filter(Boolean);
}

function parseInsights(markdown) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => ({
    id: field(body, "stable_id"),
    title: cleanPublicText(heading.replace(/^I-\d+-\d+\s*[｜|]\s*/u, "").trim()),
    judgment: cleanPublicText(body.match(/^判断[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
    relatedSignals: field(body, "related_signals"),
  }));
}

function parseTrends(markdown, currentDate) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => {
    const trend = {
      id: field(body, "stable_id"),
      title: cleanPublicText(heading.replace(/^T-\d+-\d+\s*[｜|]\s*/u, "").trim()),
      date: currentDate,
      judgment: cleanPublicText(body.match(/^趋势判断[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      relationFields: field(body, "relation_fields"),
      relations: parseRelationTokens(field(body, "relation_fields")),
      evidenceGaps: field(body, "evidence_gaps"),
    };
    return { ...trend, tags: inferTags(trend, "trend") };
  }).filter((item) => !/^今日趋势判断/u.test(item.title));
}

function parseTrendReport(markdown, currentDate, sourcePath = "") {
  const h1Title = withoutFrontmatter(markdown).match(/^#\s+(.+)$/mu)?.[1]?.trim() || "";
  const sectionsAll = splitSections(withoutFrontmatter(markdown));
  const kind = frontmatterField(markdown, "kind") || "";
  const frontStatus = frontmatterField(markdown, "front_status") || "visible";
  if (frontStatus === "hidden") return null;
  if (kind === "no_report_decision") return null;
  const first = sectionsAll.find((section) => !/^摘要$/u.test(section.heading)) || sectionsAll[0];
  if (!first) return null;
  const sectionTitle = first.heading.replace(/^TRD-(?:FLASH|FULL)?-?\d+-\d+\s*[｜|]\s*/u, "").replace(/｜.+$/u, "").trim();
  const rawTitle = /^一、|^机会定义|^事件背景/u.test(sectionTitle)
    ? h1Title.replace(/^\d{4}-\d{2}-\d{2}\s*/u, "").replace(/深挖机会卡/u, "AI 客服 Agent 运营控制层").trim()
    : (frontmatterField(markdown, "title") || h1Title || sectionTitle);
  const title = cleanPublicText(rawTitle);
  const six = parseNumberedList(sectionText(first.body, "六维分析"));
  const fallbackSections = sectionsAll
    .filter((section) => section !== first && !/^摘要$/u.test(section.heading))
    .slice(0, 14)
    .map((section) => [cleanPublicText(section.heading.replace(/^第?[一二三四五六七八九十]+[、.]/u, "")), cleanPublicText(section.body)]);
  const deepSections = splitSubsections(first.body)
    .filter(([sectionName]) => !["机会判断", "六维分析", "风险边界", "风险边界与证据缺口", "下一步验证"].includes(sectionName))
    .slice(0, 18);
  const sections = [
    ["机会判断", sectionText(first.body, "机会判断") || sectionText(withoutFrontmatter(markdown), "摘要")],
    ["老板先看", h2SectionText(sectionsAll, ["老板先看"])],
    ["今天为什么突然升温", h2SectionText(sectionsAll, ["今天为什么突然升温"])],
    ["变化背景", h2SectionText(sectionsAll, ["变化背景"])],
    ...six,
    ["技术路线的商业含义", h2SectionText(sectionsAll, ["技术路线"])],
    ["同类产品与竞品", h2SectionText(sectionsAll, ["同类产品", "市面上谁在动"])],
    ["趋势线索", h2SectionText(sectionsAll, ["关联信号", "变化背景"], "相关趋势说明这条变化并非孤立出现。")],
    ["观点参照", h2SectionText(sectionsAll, ["关联信号与观点", "观点"], "相关观点可作为补充视角，不替代事实来源。")],
    ["风险边界与证据缺口", sectionText(first.body, "风险边界与证据缺口") || h2SectionText(sectionsAll, ["风险边界", "风险", "信息缺口"])],
    ["观察变量", sectionText(first.body, "下一步验证") || h2SectionText(sectionsAll, ["后续观察", "30 天后看什么"])],
    ...deepSections,
    ...fallbackSections,
  ].filter(([sectionName, text], index, arr) => text && arr.findIndex(([titleKey]) => titleKey === sectionName) === index);

  const paragraphs = introParagraphs(markdown, 3);
  const firstJudgment =
    h2SectionText(sectionsAll, ["老板先看"]).split(/\n/u).find((line) => line.trim()) ||
    h2SectionText(sectionsAll, ["今天为什么突然升温", "变化背景"]).split("。")[0] ||
    sectionText(first.body, "机会判断") ||
    sectionText(withoutFrontmatter(markdown), "摘要") ||
    paragraphs[0] ||
    paragraphAfterFields(first.body);
  const reportId = frontmatterField(markdown, "id") ||
    field(first.body, "stable_id") ||
    field(withoutFrontmatter(markdown), "trend_report_id") ||
    `TRD-${currentDate.replaceAll("-", "")}-01`;
  const status = frontmatterField(markdown, "status") || "watching";
  const reportKind = kind || (reportId.includes("FLASH") ? "flash" : (reportId.includes("FULL") ? "full" : "legacy"));
  const evidenceGaps = field(first.body, "evidence_gaps") ||
    h2SectionText(sectionsAll, ["反证", "风险", "信息缺口"]) ||
    (frontmatterField(markdown, "has_boundary_note") === "true"
      ? "报告已包含反证，详见正文。"
      : "仍需继续观察客户采用、付费意愿和交付成本。");
  const relationFields = field(first.body, "relation_fields") || frontmatterField(markdown, "relation_fields");
  const trendReport = {
    id: reportId,
    slug: frontmatterField(markdown, "slug") || slugify(title),
    title,
    kind: reportKind,
    status,
    frontStatus,
    oneLine: cleanPublicText(firstJudgment.endsWith("。") ? firstJudgment : `${firstJudgment}。`),
    score: reportKind === "flash" ? "趋势快报" : (reportKind === "full" ? "深度报告" : "继续观察"),
    stage: status === "upgraded" ? "已升级为深度报告" : (reportKind === "flash" ? "继续观察" : "证据正在增强"),
    date: frontmatterField(markdown, "date") || currentDate,
    updated: (frontmatterField(markdown, "date") || currentDate).replaceAll("-", "."),
    sourcePath: sourcePath || field(first.body, "source_paths"),
    urgentCandidateId: frontmatterField(markdown, "urgent_candidate_id"),
    upgradeTarget: frontmatterField(markdown, "upgrade_target"),
    upgradedFrom: frontmatterField(markdown, "upgraded_from"),
    sourceCount: frontmatterField(markdown, "source_count"),
    primarySourceCount: frontmatterField(markdown, "primary_source_count"),
    hasBoundaryNote: frontmatterField(markdown, "has_boundary_note"),
    relationFields,
    relations: parseRelationTokens(relationFields),
    evidenceGaps: cleanPublicText(evidenceGaps),
    sections,
    link: "trend-detail.html",
  };
  return { ...trendReport, tags: inferTags(trendReport, "trendReport") };
}

function hasPublishReady(body) {
  return /^- publish_decision[：:]\s*publish-ready\b/mu.test(body);
}

function refinedItemDate(body, fallbackDate) {
  return field(body, "original_date") || fallbackDate;
}

function refinedDateRefs(body, fallbackDate) {
  const sourcePaths = field(body, "source_paths");
  const refs = [
    refinedItemDate(body, fallbackDate),
    ...[...sourcePaths.matchAll(/\d{4}-\d{2}-\d{2}/gu)].map((match) => match[0]),
  ].filter(Boolean);
  return [...new Set(refs)].sort();
}

function parseRefinedSignals(markdown, currentDate) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }, index) => {
    if (!hasPublishReady(body)) return null;
    const title = cleanPublicText(heading.replace(/^LS-\d+-\d+\s*[｜|]\s*/u, "").trim());
    const stableId = field(body, "stable_id") || `LS-${currentDate.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const relationFields = field(body, "relation_fields");
    const itemDate = refinedItemDate(body, currentDate);
    const signal = {
      id: stableId,
      slug: slugify(title) || `legacy-signal-${index + 1}`,
      title,
      date: itemDate,
      dateRefs: refinedDateRefs(body, itemDate),
      brief: sectionText(body, "导语") || paragraphAfterFields(body),
      judgment: sectionText(body, "导语") || paragraphAfterFields(body),
      sources: "历史归档 + V2.2.1 精修",
      sourcePath: field(body, "source_paths"),
      audience: "商业决策者 / 产品负责人 / 企业服务创业者",
      coordinates: relationFields.split(",").map((item) => item.split(":")[1]?.trim() || item.trim()).filter(Boolean).slice(0, 3),
      structuredRefs: [stableId],
      relations: parseRelationTokens(relationFields),
      relationFields,
      analysis: parseNumberedList(sectionText(body, "六维分析")),
      calibration: "这些观点可作为补充视角，不替代事实来源。",
      counter: sectionText(body, "反证与边界") || field(body, "evidence_gaps") || "仍需继续观察客户采用、预算归属和部署周期。",
      link: `signal-detail.html?id=${slugify(title) || `legacy-signal-${index + 1}`}`,
      legacy: true,
    };
    return { ...signal, tags: inferTags(signal, "signal") };
  }).filter(Boolean);
}

function parseRefinedTrends(markdown, currentDate) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => {
    if (!hasPublishReady(body)) return null;
    const itemDate = refinedItemDate(body, currentDate);
    const trend = {
      id: field(body, "stable_id"),
      title: cleanPublicText(heading.replace(/^LT-\d+-\d+\s*[｜|]\s*/u, "").trim()),
      date: itemDate,
      dateRefs: refinedDateRefs(body, itemDate),
      judgment: cleanPublicText(body.match(/^趋势判断[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      sourcePath: field(body, "source_paths"),
      relationFields: field(body, "relation_fields"),
      relations: parseRelationTokens(field(body, "relation_fields")),
      evidenceGaps: field(body, "evidence_gaps"),
      legacy: true,
    };
    return { ...trend, tags: inferTags(trend, "trend") };
  }).filter(Boolean);
}

function parseRefinedTrendReports(markdown, currentDate) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }, index) => {
    if (!hasPublishReady(body)) return null;
    const title = cleanPublicText(heading.replace(/^LEGACY-TRD-\d+-\d+\s*[｜|]\s*/u, "").trim());
    const stableId = field(body, "stable_id") || `LEGACY-TRD-${currentDate.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    const relationFields = field(body, "relation_fields");
    const itemDate = refinedItemDate(body, currentDate);
    const six = parseNumberedList(sectionText(body, "六维分析"));
    const sections = [
      ["机会判断", sectionText(body, "机会判断")],
      ...six,
      ["趋势线索", sectionText(body, "趋势背景")],
      ["观点参照", sectionText(body, "观点校准")],
      ["反证与限制", sectionText(body, "反证与限制")],
      ["观察变量", sectionText(body, "观察变量")],
    ].filter(([, text]) => text);
    const trendReport = {
      id: stableId,
      slug: slugify(title),
      title,
      oneLine: cleanPublicText((sectionText(body, "机会判断") || paragraphAfterFields(body)).split("。")[0] + "。"),
      score: field(body, "evidence_status") === "supported" ? "观察偏上" : "观察",
      stage: field(body, "evidence_status") === "supported" ? "信息增加中" : "观察中",
      date: itemDate,
      dateRefs: refinedDateRefs(body, itemDate),
      updated: itemDate.replaceAll("-", "."),
      sourcePath: field(body, "source_paths"),
      relationFields,
      relations: parseRelationTokens(relationFields),
      evidenceGaps: field(body, "evidence_gaps"),
      sections,
      link: "trend-detail.html",
      legacy: true,
    };
    return { ...trendReport, tags: inferTags(trendReport, "trendReport") };
  }).filter(Boolean);
}

function parseRisks(markdown) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => ({
    id: field(body, "stable_id") || heading.trim(),
    title: cleanPublicText(heading.trim()),
    reason: cleanPublicText(field(body, "conversion_reason")),
    relationFields: field(body, "relation_fields"),
  }));
}

async function readMarkdown(file) {
  return readFile(file, "utf8");
}

async function readOptional(file) {
  try {
    return await readMarkdown(file);
  } catch {
    return "";
  }
}

async function readOptionalDirMarkdown(dir) {
  try {
    const names = await readdir(dir);
    const markdownFiles = names.filter((name) => name.endsWith(".md")).sort();
    const contents = await Promise.all(markdownFiles.map((name) => readOptional(path.join(dir, name))));
    return contents.filter(Boolean).join("\n\n");
  } catch {
    return "";
  }
}

async function rawTitleForSignalCard(markdown = "") {
  const rawArchive = nestedFrontmatterField(markdown, "raw_archive");
  if (!rawArchive) return "";
  const rawPath = path.isAbsolute(rawArchive)
    ? rawArchive
    : path.join(projectRoot, rawArchive.replace(/^01-SiteV2[\\/]/u, "01-SiteV2/"));
  const rawMarkdown = await readOptional(rawPath);
  return publicCardText(frontmatterField(rawMarkdown, "title"));
}

async function markdownNames(dir) {
  try {
    const names = await readdir(dir);
    return names.filter((name) => name.endsWith(".md")).sort();
  } catch {
    return [];
  }
}

async function readDateMarkdown(dir, currentDate, includes = []) {
  const names = await markdownNames(dir);
  const matches = names.filter((name) => {
    if (!name.startsWith(currentDate)) return false;
    return includes.length ? includes.some((token) => name.includes(token)) : true;
  });
  const preferred = await preferredMarkdownName(dir, matches);
  return preferred ? readOptional(path.join(dir, preferred)) : "";
}

async function readDateMarkdownFromDirs(dirs, currentDate, includes = []) {
  for (const dir of dirs) {
    const names = await markdownNames(dir);
    const matches = names.filter((name) => {
      if (!name.startsWith(currentDate)) return false;
      return includes.length ? includes.some((token) => name.includes(token)) : true;
    });
    const preferred = await preferredMarkdownName(dir, matches);
    if (preferred) {
      return {
        markdown: await readOptional(path.join(dir, preferred)),
        sourcePath: path.relative(projectRoot, path.join(dir, preferred)).replaceAll("\\", "/"),
      };
    }
  }
  return { markdown: "", sourcePath: "" };
}

async function preferredMarkdownName(dir, names = []) {
  if (!names.length) return "";
  const scored = await Promise.all(names.map(async (name, index) => {
    const markdown = await readOptional(path.join(dir, name));
    const status = frontmatterField(markdown, "status").toLowerCase();
    const quality = Number(frontmatterField(markdown, "quality_score") || 0);
    const updated = frontmatterField(markdown, "updated_at") || frontmatterField(markdown, "last_reviewed") || "";
    const statusScore = /published|live|qc_passed|approved/u.test(status)
      ? 40
      : /revise|review/u.test(status)
        ? 10
        : /draft/u.test(status)
          ? -20
          : 0;
    return {
      name,
      score: statusScore + quality,
      updated,
      index,
    };
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.updated !== a.updated) return b.updated.localeCompare(a.updated);
    return a.index - b.index;
  });
  return scored[0]?.name || names[0];
}

function trendReportDirs() {
  const root = path.join(contentRoot, "08-trend-reports");
  return {
    full: path.join(root, "full"),
    flash: path.join(root, "flash"),
    legacy: root,
    noReportDecisions: path.join(root, "no-report-decisions"),
  };
}

async function readTrendReportMarkdown(currentDate) {
  const dirs = trendReportDirs();
  return readDateMarkdownFromDirs([dirs.full, dirs.flash, dirs.legacy], currentDate);
}

async function readTrendCandidateMarkdowns(dir, currentDate) {
  const names = (await markdownNames(dir))
    .filter((name) => name.startsWith(currentDate) && name.includes("trend-candidate"));
  return Promise.all(names.map(async (name) => ({
    markdown: await readOptional(path.join(dir, name)),
    sourcePath: path.relative(projectRoot, path.join(dir, name)).replaceAll("\\", "/"),
  })));
}

function frontmatterField(markdown, name) {
  const frontmatter = markdown.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"));
  return cleanPublicText(match?.[1]?.trim().replace(/^["']|["']$/gu, "") || "");
}

function frontmatterBlock(markdown) {
  return markdown.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
}

function inlineArrayField(markdown, name) {
  const frontmatter = frontmatterBlock(markdown);
  const value = frontmatter.match(new RegExp(`^${name}:\\s*\\[(.*)\\]`, "mu"))?.[1] || "";
  return parseInlineArrayValue(value);
}

function parseInlineArrayValue(value = "") {
  return value
    .split(",")
    .map((item) => cleanPublicText(item.trim().replace(/^["']|["']$/gu, "")))
    .filter(Boolean);
}

function nestedInlineArrayFields(markdown, blockName) {
  const lines = frontmatterBlock(markdown).split(/\r?\n/u);
  const result = {};
  let inBlock = false;
  for (const line of lines) {
    if (new RegExp(`^${blockName}:\\s*$`, "u").test(line)) {
      inBlock = true;
      continue;
    }
    if (inBlock && /^\S/u.test(line)) break;
    if (!inBlock) continue;
    const match = line.match(/^\s+([A-Za-z0-9_]+):\s*\[(.*)\]\s*$/u);
    if (!match) continue;
    result[match[1]] = parseInlineArrayValue(match[2]);
  }
  return result;
}

function nestedFrontmatterField(markdown, name) {
  const frontmatter = frontmatterBlock(markdown);
  const match = frontmatter.match(new RegExp(`^\\s+${name}:\\s*(.+)$`, "mu"));
  return cleanPublicText(frontmatterScalar(match?.[1] || ""));
}

function frontmatterScalar(raw = "") {
  const value = String(raw || "").trim();
  if (!value) return "";
  try {
    if (/^["']/.test(value)) return JSON.parse(value);
  } catch {
    // Keep a permissive fallback for hand-written frontmatter.
  }
  return value.replace(/^["']|["']$/gu, "").replace(/\\n/gu, "\n");
}

function frontendBlock(markdown) {
  const frontmatter = frontmatterBlock(markdown);
  const lines = frontmatter.split(/\r?\n/u);
  const result = {};
  let inFrontend = false;
  for (const line of lines) {
    if (/^frontend:\s*$/u.test(line)) {
      inFrontend = true;
      continue;
    }
    if (inFrontend && /^\S/u.test(line)) break;
    if (!inFrontend) continue;
    const match = line.match(/^\s+([A-Za-z0-9_]+):\s*(.*)$/u);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = cleanPublicText(frontmatterScalar(rawValue));
    if (value && value !== "[]" && value !== "{}") result[key] = value;
  }
  return result;
}

function hasUsableFrontend(card = {}, required = ["displayTitle"]) {
  if (!card.frontend) return false;
  return required.every((fieldName) => Boolean(card.frontend[fieldName]));
}

function hasPublicOpinionTranslation(value = "") {
  const text = cleanPublicText(String(value || "")).trim();
  return Boolean(text)
    && /\p{Script=Han}/u.test(text)
    && !/(pending|todo|missing|not translated|translation pending)/iu.test(text);
}

function isXSourceUrl(value = "") {
  return /\bx\.com\b|\btwitter\.com\b/iu.test(String(value || ""));
}

function hasCompleteOpinionTranslation(source = "", translation = "", sourceUrl = "") {
  if (!hasPublicOpinionTranslation(translation)) return false;
  if (!isXSourceUrl(sourceUrl)) return true;
  const sourceLength = cleanPublicText(String(source || "").replace(/https?:\/\/\S+/gu, "")).length;
  if (sourceLength < 500) return true;
  const translationLength = cleanPublicText(translation).length;
  const minimumLength = Math.min(260, Math.floor(sourceLength * 0.28));
  return translationLength >= minimumLength;
}

async function parseChangeKnowledgeCards(currentDate) {
  const dir = path.join(knowledgeRoot, "03-Asset-Candidates", "change");
  const names = (await markdownNames(dir)).filter((name) => name.startsWith(currentDate));
  const entries = await Promise.all(names.map(async (name) => {
    const markdown = await readOptional(path.join(dir, name));
    const id = frontmatterField(markdown, "id");
    if (!id) return null;
    const missing = inlineArrayField(markdown, "missing_information");
    const relatedCases = inlineArrayField(markdown, "related_case_cards");
    const relatedOpinions = inlineArrayField(markdown, "related_opinion_cards");
    const sourceUrl = nestedFrontmatterField(markdown, "source_url") || (markdown.match(/https?:\/\/[^\s)"]+/u)?.[0] || "");
    const sourceName = markdown.match(/name:\s*["']?([^"'\n]+)["']?/u)?.[1] || "";
    return [id, {
      id,
      status: frontmatterField(markdown, "status"),
      factDraftGate: frontmatterField(markdown, "fact_draft_gate"),
      frontendCopyGate: frontmatterField(markdown, "frontend_copy_gate"),
      cardcopyGate: frontmatterField(markdown, "cardcopy_gate"),
      frontendState: frontmatterField(markdown, "frontend_state"),
      assetLevel: frontmatterField(markdown, "asset_level"),
      event: frontmatterField(markdown, "event"),
      businessMeaning: frontmatterField(markdown, "business_meaning"),
      whySelected: frontmatterField(markdown, "why_selected"),
      technicalRoute: frontmatterField(markdown, "technical_route_business_meaning"),
      frontend: frontendBlock(markdown),
      evidenceBoundary: frontmatterField(markdown, "evidence_boundary") || nestedFrontmatterField(markdown, "evidence_boundary") || missing.join("；"),
      missingInformation: missing,
      relatedCases,
      relatedOpinions,
      sourceUrl,
      sourceName: cleanPublicText(sourceName),
      sourceLevel: nestedFrontmatterField(markdown, "source_level") || frontmatterField(markdown, "source_level"),
      extractionQuality: nestedFrontmatterField(markdown, "extraction_quality"),
      hasFullText: nestedFrontmatterField(markdown, "has_full_text"),
      sourcePath: path.relative(projectRoot, path.join(dir, name)).replaceAll("\\", "/"),
    }];
  }));
  return new Map(entries.filter(Boolean));
}

async function parseCaseKnowledgeCards(currentDate) {
  const dir = path.join(knowledgeRoot, "01-Signal-Cards", "case");
  const names = (await markdownNames(dir)).filter((name) => name.startsWith(currentDate));
  const entries = await Promise.all(names.map(async (name) => {
    const markdown = await readOptional(path.join(dir, name));
    const id = frontmatterField(markdown, "id");
    if (!id) return null;
    return [id, {
      id,
      status: frontmatterField(markdown, "status"),
      factDraftGate: frontmatterField(markdown, "fact_draft_gate"),
      frontendCopyGate: frontmatterField(markdown, "frontend_copy_gate"),
      cardcopyGate: frontmatterField(markdown, "cardcopy_gate"),
      assetLevel: frontmatterField(markdown, "asset_level"),
      frontend: frontendBlock(markdown),
    }];
  }));
  return new Map(entries.filter(Boolean));
}

function publicCardText(text = "") {
  return cleanPublicText(text)
    .replace(/后台流程/g, "企业流程")
    .replace(/后台/g, "内部流程")
    .replace(/入库/g, "进入资料库")
    .replace(/补证/g, "补充验证")
    .replace(/强证据/g, "较强信号");
}

async function parseSignalKnowledgeCards(currentDate) {
  const dirs = ["funding", "case", "product-service"].map((name) => path.join(knowledgeRoot, "01-Signal-Cards", name));
  const entries = (await Promise.all(dirs.map(async (dir) => {
    const names = (await markdownNames(dir)).filter((name) => name.startsWith(currentDate));
    return Promise.all(names.map(async (name) => {
      const markdown = await readOptional(path.join(dir, name));
      const frontend = frontendBlock(markdown);
      const sourceUrl = nestedFrontmatterField(markdown, "source_url") || markdown.match(/https?:\/\/[^\s)"']+/u)?.[0] || "";
      const sourceName = sourceLabelFromUrl(sourceUrl) || "原文出处";
      const sourceTitle = await rawTitleForSignalCard(markdown);
      const slug = name.replace(/\.md$/u, "").replace(new RegExp(`^${currentDate}--signal--`, "u"), "");
      const card = {
        id: frontmatterField(markdown, "id"),
        type: frontmatterField(markdown, "type"),
        signalType: frontmatterField(markdown, "signal_type"),
        title: frontmatterField(markdown, "title"),
        date: frontmatterField(markdown, "date") || currentDate,
        status: frontmatterField(markdown, "status"),
        assetLevel: frontmatterField(markdown, "asset_level"),
        evidenceGate: frontmatterField(markdown, "evidence_gate"),
        factDraftGate: frontmatterField(markdown, "fact_draft_gate"),
        frontendCopyGate: frontmatterField(markdown, "frontend_copy_gate"),
        cardcopyGate: frontmatterField(markdown, "cardcopy_gate"),
        event: frontmatterField(markdown, "event"),
        businessMeaning: frontmatterField(markdown, "business_meaning"),
        whySelected: frontmatterField(markdown, "why_selected"),
        signalOwner: frontmatterField(markdown, "signal_owner"),
        evidenceBoundary: frontend.evidenceBoundary || frontmatterField(markdown, "evidence_boundary"),
        watchReason: frontend.watchWindow || frontmatterField(markdown, "watch_reason"),
        frontend,
        sourceUrl,
        sourceName,
        sourceTitle,
        sourceLevel: nestedFrontmatterField(markdown, "source_level") || sourceLevelFromUrl(sourceUrl),
        sourcePath: path.relative(projectRoot, path.join(dir, name)).replaceAll("\\", "/"),
      };
      if (!card.id || !frontstageSignalReady(card)) return null;
      const title = publicCardText(frontend.displayTitle || card.title);
      const eventLine = publicCardText(frontend.eventLine || card.event);
      const whyWatch = publicCardText(frontend.whyWatch || card.whySelected);
      const businessMeaning = publicCardText(frontend.businessMeaning || card.businessMeaning);
      const evidenceBoundary = publicCardText(frontend.evidenceBoundary || card.evidenceBoundary || "当前材料能确认事件方向，具体客户效果仍需继续观察。");
      const signal = {
        id: card.id,
        slug: slugify(title) || slug,
        title,
        date: card.date,
        signalType: card.signalType,
        brief: businessMeaning || eventLine || whyWatch,
        judgment: whyWatch || businessMeaning || eventLine,
        event: eventLine,
        businessMeaning,
        sourceUrl,
        sourceTitle,
        sources: sourceUrl ? `原文出处：${sourceName}` : "原文出处已记录",
        sourcePath: card.sourcePath,
        audience: "企业决策者 / 业务负责人 / AI 产品与运营负责人",
        coordinates: [card.signalType].filter(Boolean),
        structuredRefs: [card.id],
        relations: [],
        relationFields: "",
        analysis: [
          ["发生了什么", eventLine],
          ["为什么值得看", whyWatch],
          ["影响谁", businessMeaning],
          ["证据边界", evidenceBoundary],
        ].filter(([, value]) => value),
        calibration: "观点只能作为判断参照，不替代事实来源。",
        counter: evidenceBoundary,
        link: `signal-detail.html?id=${slugify(title) || slug}`,
        frontend: {
          displayTitle: title,
          sourceTitle,
          eventLine,
          whyWatch,
          businessMeaning,
          evidenceNote: sourceUrl ? `${card.sourceLevel} 级来源，当前材料来自 ${sourceName}。` : "来源仍在整理，不能作为单独结论。",
          sourceLinks: sourceUrl ? [{ label: sourceName, url: sourceUrl, level: card.sourceLevel, note: eventLine }] : [],
          watchWindow: card.watchReason ? [{ label: "继续观察", text: card.watchReason }] : watchWindowForSignal({ ...card, event: eventLine, businessMeaning }),
          evidenceBoundary: compactEvidenceBoundary(evidenceBoundary),
        },
      };
      return { ...signal, tags: inferTags(signal, "signal") };
    }));
  }))).flat().filter(Boolean);
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

async function hasOpinionKnowledgeCards(currentDate) {
  const dir = path.join(knowledgeRoot, "02-Opinion-Cards");
  const names = (await markdownNames(dir)).filter((name) => name.startsWith(currentDate) && !name.includes("index"));
  return names.length > 0;
}

async function parseOpinionKnowledgeCards(currentDate) {
  const dir = path.join(knowledgeRoot, "02-Opinion-Cards");
  const names = (await markdownNames(dir)).filter((name) => name.startsWith(currentDate));
  const entries = await Promise.all(names.map(async (name) => {
    const markdown = await readOptional(path.join(dir, name));
    const frontend = frontendBlock(markdown);
    const sourceUrl = frontmatterField(markdown, "canonical_url")
      || frontmatterField(markdown, "original_url")
      || nestedFrontmatterField(markdown, "source_url")
      || markdown.match(/https?:\/\/[^\s)"']+/u)?.[0]
      || "";
    const card = {
      id: frontmatterField(markdown, "id"),
      type: frontmatterField(markdown, "type"),
      title: frontmatterField(markdown, "title"),
      date: frontmatterField(markdown, "date") || currentDate,
      status: frontmatterField(markdown, "status"),
      factDraftGate: frontmatterField(markdown, "fact_draft_gate"),
      frontendCopyGate: frontmatterField(markdown, "frontend_copy_gate"),
      cardcopyGate: frontmatterField(markdown, "cardcopy_gate"),
      opinionTier: frontmatterField(markdown, "opinion_tier"),
      displayLane: frontmatterField(markdown, "display_lane"),
      selectionReason: frontmatterField(markdown, "selection_reason"),
      ratingScore: Number(frontmatterField(markdown, "opinion_rating_score") || 0),
      publishStatus: frontmatterField(markdown, "publish_status"),
      translationStatus: frontmatterField(markdown, "translation_status"),
      originalTranslation: publicCardText(frontend.originalTranslation || frontend.translationZh || frontmatterField(markdown, "original_translation") || ""),
      frontend,
      sourceUrl,
      personName: frontmatterField(markdown, "person_name"),
      organization: frontmatterField(markdown, "organization"),
      publishedAt: frontmatterField(markdown, "published_at"),
      sourcePath: path.relative(projectRoot, path.join(dir, name)).replaceAll("\\", "/"),
    };
    if (!card.id || !frontstageOpinionReady(card)) return null;
    const point = {
      id: card.id,
      slug: slugify(frontend.displayTitle || card.title) || card.id.toLowerCase(),
      title: publicCardText(frontend.displayTitle || card.title),
      date: card.date,
      sourcePath: card.sourcePath,
      sourceUrl,
      originalDate: publicDate(card.publishedAt),
      speakerLine: publicCardText(frontend.speakerLine || [card.personName, card.organization].filter(Boolean).join(" / ")),
      originalView: publicCardText(frontend.originalQuote || ""),
      originalTranslation: card.originalTranslation,
      interpretation: publicCardText(frontend.interpretation),
      calibrates: publicCardText(frontend.factBoundary),
      opinionTier: card.opinionTier,
      displayLane: card.displayLane,
      selectionReason: publicCardText(card.selectionReason),
      ratingScore: card.ratingScore,
      publishStatus: card.publishStatus,
      usage: "可作为读者理解企业采购讨论的观点参照；涉及公司事实时，还需要合同、产品或客户案例支持。",
      relations: [],
      relatedSignals: [],
      relatedTrends: [],
      relatedTrendReports: [],
    };
    return { ...point, tags: inferTags(point, "point") };
  }));
  const laneOrder = { daily_feature: 0, signal_sidebar: 1, archive_only: 2, hidden: 3 };
  return entries.filter(Boolean).sort((a, b) => {
    const laneDelta = (laneOrder[a.displayLane] ?? 9) - (laneOrder[b.displayLane] ?? 9);
    if (laneDelta) return laneDelta;
    const scoreDelta = Number(b.ratingScore || 0) - Number(a.ratingScore || 0);
    return scoreDelta || a.id.localeCompare(b.id);
  });
}

function frontstageAssetReady(card = {}) {
  return card.factDraftGate === "passed"
    && card.frontendCopyGate === "passed"
    && card.cardcopyGate === "passed"
    && card.assetLevel
    && !["candidate", "draft"].includes(card.assetLevel)
    && card.status !== "draft"
    && card.frontendState !== "hidden"
    && hasUsableFrontend(card);
}

function frontstageSignalReady(card = {}) {
  return card.type === "signal_card"
    && card.factDraftGate === "passed"
    && card.frontendCopyGate === "passed"
    && card.cardcopyGate === "passed"
    && card.evidenceGate === "core_evidence_passed"
    && card.status !== "hidden"
    && card.frontendState !== "hidden"
    && hasUsableFrontend(card, ["displayTitle", "eventLine", "whyWatch", "businessMeaning"]);
}

function frontstageOpinionReady(card = {}) {
  const tier = card.opinionTier || "";
  const lane = card.displayLane || "";
  const publishStatus = card.publishStatus || "";
  const translationStatus = card.translationStatus || "";
  const translation = card.originalTranslation || card.frontend?.originalTranslation || card.frontend?.translationZh || "";
  return card.type === "opinion_card"
    && card.factDraftGate === "passed"
    && card.frontendCopyGate === "passed"
    && card.cardcopyGate === "passed"
    && ["feature", "sidebar"].includes(tier)
    && ["daily_feature", "signal_sidebar"].includes(lane)
    && ["frontstage_feature", "frontstage_sidebar"].includes(publishStatus)
    && translationStatus !== "pending_translation"
    && hasCompleteOpinionTranslation(card.frontend?.originalQuote || "", translation, card.sourceUrl)
    && card.status !== "hidden"
    && card.frontendState !== "hidden"
    && hasUsableFrontend(card, ["displayTitle", "interpretation", "factBoundary"]);
}

function compactEvidenceBoundary(text = "") {
  return cleanPublicText(text)
    .split(/[；;。\n]/u)
    .map((item) => cleanPublicText(item))
    .filter(Boolean)
    .slice(0, 4);
}

function watchWindowForSignal(signal = {}) {
  const text = `${signal.title || ""} ${signal.event || ""} ${signal.businessMeaning || ""}`;
  if (/知识库|Obsidian|Claude Code|工作台/u.test(text)) {
    return [
      { label: "7D", text: "看是否出现更多一手用法、产品教程或开源脚本。" },
      { label: "30D", text: "看小团队是否把它放进真实研究、写作或交付流程。" },
      { label: "90D", text: "看它是否沉淀为 AI 工作台和知识库集成趋势。" },
    ];
  }
  if (/权限|网关|沙箱|数据库|治理|审计/u.test(text)) {
    return [
      { label: "7D", text: "看官方是否补充权限、日志和停用边界。" },
      { label: "30D", text: "看是否出现客户试点、采购讨论或部署案例。" },
      { label: "90D", text: "看治理、沙箱和回滚是否变成企业采购门槛。" },
    ];
  }
  return [
    { label: "7D", text: "看是否出现更多一手材料。" },
    { label: "30D", text: "看是否影响客户采用、预算或渠道合作。" },
    { label: "90D", text: "看它是否进入变化簇，升级为趋势追踪。" },
  ];
}

function buildSignalFrontend(signal, knowledge = {}) {
  const frontend = knowledge.frontend || {};
  const sourceUrl = knowledge.sourceUrl || signal.sourceUrl || "";
  const sourceLabel = knowledge.sourceName || sourceLabelFromUrl(sourceUrl) || "原始出处";
  const sourceLevel = knowledge.sourceLevel || sourceLevelFromUrl(sourceUrl);
  const eventLine = frontend.eventLine || knowledge.event || "";
  const whyWatch = frontend.whyWatch || knowledge.whySelected || "";
  const businessMeaning = frontend.businessMeaning || knowledge.businessMeaning || "";
  const evidenceBoundary = compactEvidenceBoundary(frontend.evidenceBoundary || knowledge.evidenceBoundary || signal.counter);
  return {
    displayTitle: frontend.displayTitle || signal.title,
    eventLine,
    whyWatch,
    businessMeaning,
    techRouteMeaning: frontend.techRouteMeaning || knowledge.technicalRoute || "",
    evidenceNote: sourceUrl
      ? `${sourceLevel} 级来源，当前材料来自 ${sourceLabel}。`
      : "来源仍在整理，不能作为单独结论。",
    sourceLinks: sourceUrl ? [{
      label: sourceLabel,
      url: sourceUrl,
      level: sourceLevel,
      note: eventLine,
    }] : [],
    relatedCases: knowledge.relatedCases?.length ? knowledge.relatedCases : extractReferenceIds(signal.relationFields, ["CASE"]),
    relatedOpinions: knowledge.relatedOpinions?.length ? knowledge.relatedOpinions : extractReferenceIds(signal.relationFields, ["OPN", "BP"]),
    watchWindow: watchWindowForSignal({ ...signal, event: eventLine, businessMeaning }),
    evidenceBoundary: evidenceBoundary.length ? evidenceBoundary : ["暂无公开客户采用数据", "仍需继续观察付费、成本和复核材料"],
  };
}

function firstHeading(markdown) {
  return cleanPublicText(withoutFrontmatter(markdown).match(/^#\s+(.+)$/mu)?.[1] || "");
}

function dailyArticleTitle(markdown, currentDate) {
  return cleanPublicText(frontmatterField(markdown, "title") || firstHeading(markdown) || `${currentDate} 今日观察`)
    .replace(/^(?:今日观察|每日观察)\s*[｜|:：]\s*/u, "")
    .replace(/^(?:今日观察|每日观察)\s+/u, "")
    .trim();
}

function h2SectionText(sections, names, fallback = "") {
  const found = sections.find((section) => names.some((name) => section.heading.includes(name)));
  return cleanPublicText(found?.body || fallback);
}

function introParagraphs(markdown, limit = 2) {
  const body = withoutFrontmatter(markdown)
    .replace(/^#\s+.+$/mu, "")
    .split(/^##\s+/mu)[0] || "";
  return body
    .split(/\n{2,}/u)
    .map((item) => cleanPublicText(item.replace(/\s+/gu, " ").trim()))
    .filter(Boolean)
    .slice(0, limit);
}

function isDailyDisplaySection(heading = "") {
  return /^(?:网站展示内容|首页与栏目页内容|前台展示内容|Frontstage Content)$/iu.test(String(heading).trim());
}

function splitListText(text = "") {
  return cleanPublicText(text)
    .split(/[，,、/｜|]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMarkdownTable(text = "") {
  const lines = String(text || "")
    .split(/\n/u)
    .map((line) => line.trim())
    .filter((line) => /^\|.+\|$/u.test(line));
  if (lines.length < 2) return [];
  const cells = (line) => line
    .replace(/^\|/u, "")
    .replace(/\|$/u, "")
    .split("|")
    .map((cell) => cleanPublicText(cell.trim()));
  const headers = cells(lines[0]).map((header) => header.toLowerCase());
  return lines
    .slice(2)
    .map(cells)
    .filter((row) => row.some(Boolean))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function dailyDisplayContent(markdown, title, paragraphs) {
  const sections = splitSections(withoutFrontmatter(markdown));
  const display = sections.find((section) => isDailyDisplaySection(section.heading));
  const subsections = display ? splitSubsections(display.body) : [];
  const subBody = (names = [], fallback = "") => {
    const found = subsections.find(([heading]) => names.some((name) => heading.includes(name)));
    return cleanPublicText(found?.[1] || fallback);
  };
  const homeCards = parseMarkdownTable(subBody(["首页右侧卡片", "首页卡片"]))
    .map((item) => ({
      label: item.label || item["类别"] || item.category || "",
      title: item.title || item["标题"] || "",
      body: item.body || item["正文"] || item.copy || "",
    }))
    .filter((item) => item.title && item.body)
    .slice(0, 3);
  const watchItems = parseMarkdownTable(subBody(["栏目页观察项", "观察项"]))
    .map((item) => ({
      period: item.period || item["周期"] || "",
      title: item.title || item["标题"] || "",
      body: item.body || item["正文"] || item.copy || "",
    }))
    .filter((item) => item.title && item.body)
    .slice(0, 3);
  const riskItems = parseMarkdownTable(subBody(["栏目页风险", "风险边界"]))
    .map((item) => ({
      title: item.title || item["标题"] || "",
      body: item.body || item["正文"] || item.copy || "",
    }))
    .filter((item) => item.title && item.body)
    .slice(0, 3);
  return {
    homeTitle: subBody(["首页主标题", "首页标题"], title),
    homeSummary: subBody(["首页左侧摘要", "首页摘要"], paragraphs.slice(0, 2).join("\n\n")),
    homeCards,
    columnPage: {
      title: subBody(["栏目页标题"], title),
      thesis: subBody(["栏目页主判断", "栏目页看点"], paragraphs[0] || title),
      body: subBody(["栏目页正文一", "栏目页第一段"], paragraphs[1] || paragraphs[0] || ""),
      impact: subBody(["栏目页正文二", "栏目页影响"], paragraphs[2] || paragraphs[1] || ""),
      note: subBody(["栏目页侧记", "栏目页边界"], ""),
      keywords: splitListText(subBody(["栏目页标签", "标签"])).slice(0, 6),
      strength: subBody(["判断强度"], ""),
      state: subBody(["当前状态"], ""),
      trendTitle: subBody(["栏目页市场读标题", "市场读标题"], ""),
      trendBody: subBody(["栏目页市场读正文", "市场读正文"], ""),
      watchItems,
      riskItems,
    },
  };
}

function parseDailyObservation(markdown, currentDate) {
  if (!markdown) return null;
  const title = dailyArticleTitle(markdown, currentDate);
  const paragraphs = introParagraphs(markdown, 3);
  const displayContent = dailyDisplayContent(markdown, title, paragraphs);
  const sections = splitSections(withoutFrontmatter(markdown))
    .filter(({ heading }) => !isDailyDisplaySection(heading))
    .map(({ heading, body }) => ({
      title: cleanPublicText(heading),
      body: cleanPublicText(body),
    }));
  return {
    id: `daily-${currentDate}`,
    slug: `daily-${currentDate}`,
    title,
    issue: frontmatterField(markdown, "issue"),
    period: frontmatterField(markdown, "period"),
    contentType: frontmatterField(markdown, "type"),
    judgment: paragraphs[0] || "今日观察已发布，请结合公开来源继续阅读。",
    dek: paragraphs.slice(0, 2).join("\n\n") || "今日观察已发布，请结合公开来源继续阅读。",
    summary: paragraphs,
    sections,
    ...displayContent,
  };
}

function sourceLabelFromUrl(url = "") {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

function sourceLevelFromUrl(url = "") {
  const lower = String(url || "").toLowerCase();
  if (!lower) return "待补";
  if (/the-decoder|techcrunch|wired|bloomberg|wsj|ft\.com|axios|reuters|cnbc|theinformation/u.test(lower)) return "A";
  if (/news\.ycombinator|reddit|x\.com|twitter|youtube/u.test(lower)) return "C";
  return "S";
}

function parseSelectedChangeCards(markdown, currentDate, knowledgeCards = new Map()) {
  if (!markdown) return [];
  const body = withoutFrontmatter(markdown);
  const matches = [...body.matchAll(/(?:^|\n)- `([^`]+)`[｜|]([^\n]+)\n([\s\S]*?)(?=\n- `|\n## |\n# |$)/gu)];
  return matches.map((match, index) => {
    const id = match[1].trim();
    const title = cleanPublicText(match[2].trim());
    const block = match[3] || "";
    const reason = cleanPublicText(block.match(/^\s*入选理由[：:]\s*(.+)$/mu)?.[1] || "这条变化被选入今日观察，适合继续跟踪它影响的客户、场景和预算变化。");
    const event = cleanPublicText(block.match(/^\s*事件[：:]\s*(.+)$/mu)?.[1] || "");
    const businessMeaning = cleanPublicText(block.match(/^\s*商业含义[：:]\s*(.+)$/mu)?.[1] || "");
    const rawRef = cleanPublicText(block.match(/^\s*(?:Raw|来源档案)[：:]\s*(.+)$/mu)?.[1] || "");
    const relatedCases = cleanPublicText(block.match(/^\s*关联案例[：:]\s*(.+)$/mu)?.[1]?.replaceAll("`", "") || "");
    const relatedOpinions = cleanPublicText(block.match(/^\s*关联观点[：:]\s*(.+)$/mu)?.[1]?.replaceAll("`", "") || "");
    const relationFields = relationFieldFromSelectedCards(relatedCases, relatedOpinions);
    const sourceUrl = block.match(/^\s*来源[：:]\s*(https?:\/\/\S+)/mu)?.[1] || "";
    const analysis = [
      ["为什么值得看", reason],
      ["发生了什么", event],
      ["影响谁", businessMeaning],
      ["来源依据", rawRef || (sourceUrl ? `原文：${sourceUrl}` : "来源见今日观察原文与变化卡")],
    ].filter(([, text]) => text);
    const knowledgeCandidate = knowledgeCards.get(id);
    if (!frontstageAssetReady(knowledgeCandidate)) return null;
    const knowledge = knowledgeCandidate;
    const signal = {
      id,
      slug: slugify(title) || `change-${index + 1}`,
      title,
      date: currentDate,
      brief: businessMeaning || event || reason,
      judgment: knowledge.whySelected || reason,
      event: knowledge.event || event,
      businessMeaning: knowledge.businessMeaning || businessMeaning,
      technicalRouteMeaning: knowledge.technicalRoute || "",
      sourceUrl: knowledge.sourceUrl || sourceUrl,
      sources: (knowledge.sourceUrl || sourceUrl) ? "原始出处已记录" : "来源见今日观察原文与商业信号卡",
      rawRef,
      sourcePath: knowledge.sourcePath || `01-SiteV2/content/04-business-signals/signals/${currentDate}-selected-change-cards.md#${id}`,
      audience: "商业决策者 / 产品负责人 / 企业服务创业者",
      coordinates: [],
      structuredRefs: [id],
      relations: parseRelationTokens(relationFields),
      relationFields,
      analysis,
      calibration: "观点只作判断参照，不替代事实来源。",
      counter: relatedCases
        ? `已关联 ${relatedCases}；仍需继续补客户采用、ROI、复核成本和反证材料。`
        : "暂无公开信息补足反证边界，后续由案例与信号研究线程继续补证。",
      link: `signal-detail.html?id=${slugify(title) || `change-${index + 1}`}`,
    };
    const withFrontend = { ...signal, frontend: buildSignalFrontend(signal, knowledge) };
    return { ...withFrontend, tags: inferTags(withFrontend, "signal") };
  }).filter(Boolean);
}

function parseCaseResearch(markdown, currentDate, sourcePath = "", knowledgeCards = new Map()) {
  if (!markdown) return [];
  const body = withoutFrontmatter(markdown);
  const matches = [...body.matchAll(/^- `?(CASE-\d{8}-\d{2})`?\s*（(.+?)）[：:]\s*(.+)$/gmu)];
  return matches.map((match, index) => {
    const id = match[1].trim();
    if (!frontstageAssetReady(knowledgeCards.get(id))) return null;
    const caseDate = `${id.slice(5, 9)}-${id.slice(9, 11)}-${id.slice(11, 13)}`;
    const title = cleanPublicText(match[2].trim());
    const summary = cleanPublicText(match[3].trim());
    const item = {
      id,
      slug: slugify(title) || `case-${currentDate}-${index + 1}`,
      title,
      date: caseDate || currentDate,
      dateRefs: [caseDate || currentDate, currentDate].filter(Boolean),
      brief: summary,
      judgment: summary,
      sourcePath,
      sourceUrl: "",
      relationFields: "",
      relations: [],
      link: "",
    };
    return { ...item, tags: inferTags(item, "case") };
  }).filter(Boolean);
}

function uniqueById(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.id || item.slug || item.title;
    if (!key) return;
    map.set(key, { ...(map.get(key) || {}), ...item });
  });
  return [...map.values()];
}

function parseOpinionCandidates(markdown, currentDate) {
  if (!markdown) return [];
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => {
    const relations = parseRelationTokens(field(body, "relation_fields"));
    const point = {
      id: field(body, "stable_id") || heading.split("｜")[0]?.trim(),
      title: cleanPublicText(heading.replace(/^BP-\d+-\d+\s*[｜|]\s*/u, "").trim()),
      date: currentDate,
      sourcePath: field(body, "source_path"),
      sourceUrl: field(body, "source_url"),
      originalDate: publicDate(field(body, "original_date")),
      originalView: cleanPublicText(body.match(/^原始观点\/摘要[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      originalTranslation: cleanPublicText(body.match(/^中文翻译[：:]\s*(.+)$/mu)?.[1] || field(body, "original_translation")),
      interpretation: cleanPublicText(body.match(/^原始观点\/摘要[：:]\s*(.+)$/mu)?.[1] || "暂无可用公开摘录，保留为观点线索。"),
      calibrates: "用于观察建造者观点变化，不作为事实主证据。",
      usage: "用于今日观察或趋势追踪中的前沿观点参照。",
      relations,
      relatedSignals: [],
      relatedTrends: [],
      relatedTrendReports: [],
    };
    return { ...point, tags: inferTags(point, "point") };
  }).filter((item) => item.id && item.title);
}

function parseChangeClusterCandidates(markdown, currentDate) {
  if (!markdown) return [];
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }, index) => {
    const title = cleanPublicText(heading.replace(/^CLU-CAND-\d+-\d+\s*[｜|]\s*/u, "").trim());
    const trend = {
      id: field(body, "stable_id") || heading.split("｜")[0]?.trim() || `TREND-CAND-${currentDate.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`,
      title,
      date: currentDate,
      judgment: cleanPublicText(body.match(/^观察理由[：:]\s*(.+)$/mu)?.[1] || "暂未形成正式趋势结论，继续观察来源、客户和场景变化。"),
      sourcePath: field(body, "source_refs"),
      relationFields: "",
      relations: [],
      evidenceGaps: "暂未形成正式趋势结论，需补足 S/A/B 来源和同类案例。",
    };
    return { ...trend, tags: inferTags(trend, "trend") };
  }).filter((item) => item.title);
}

function trendCandidateRelationFields(markdown) {
  const signals = inlineArrayField(markdown, "related_signal_cards");
  const opinions = inlineArrayField(markdown, "related_opinion_cards");
  const scenes = inlineArrayField(markdown, "supporting_scenes");
  return [
    signals.length ? `signals:${signals.join(",")}` : "",
    opinions.length ? `points:${opinions.join(",")}` : "",
    scenes.length ? `scenes:${scenes.join(",")}` : "",
  ].filter(Boolean).join(",");
}

function trendCandidateJudgment(markdown) {
  const raw = frontmatterField(markdown, "trend_hypothesis") ||
    withoutFrontmatter(markdown).match(/^##\s+趋势候选\s*\n([\s\S]*?)(?=^##\s+|$)/mu)?.[1]?.trim() ||
    paragraphAfterFields(withoutFrontmatter(markdown));
  return cleanPublicText(raw
    .replace(/^两天材料共同指向一个候选方向[：:]\s*/u, "")
    .replace(/^\d+\s*月\s*\d+\s*日的.+?信号指向同一个问题[：:]\s*/u, ""));
}

function parseTrendCandidate(markdown, currentDate, sourcePath = "") {
  if (!markdown || frontmatterField(markdown, "type") !== "trend_candidate") return null;
  const id = frontmatterField(markdown, "id");
  const title = frontmatterField(markdown, "title") ||
    withoutFrontmatter(markdown).match(/^#\s+(.+)$/mu)?.[1]?.trim() ||
    id;
  const formalTags = nestedInlineArrayFields(markdown, "formal_tags");
  const formalTagIds = Object.values(formalTags).flat();
  const relationFields = trendCandidateRelationFields(markdown);
  const date = frontmatterField(markdown, "date") || currentDate;
  const updatedAt = frontmatterField(markdown, "updated_at");
  const relatedSignalCards = inlineArrayField(markdown, "related_signal_cards");
  const relatedOpinionCards = inlineArrayField(markdown, "related_opinion_cards");
  const supportingScenes = inlineArrayField(markdown, "supporting_scenes");
  const frontend = frontendBlock(markdown);
  const candidate = {
    id,
    type: "trend_candidate",
    title: cleanPublicText(title),
    date,
    updated: (updatedAt || date).slice(0, 10).replaceAll("-", "."),
    status: frontmatterField(markdown, "status"),
    assetLevel: frontmatterField(markdown, "asset_level") || "candidate",
    trendEvidenceGate: frontmatterField(markdown, "trend_evidence_gate"),
    stage: "正在形成的趋势",
    score: "材料正在累积",
    oneLine: trendCandidateJudgment(markdown),
    judgment: trendCandidateJudgment(markdown),
    nextObservation: cleanPublicText(frontmatterField(markdown, "next_observation")),
    boundaryNotes: cleanPublicText(frontmatterField(markdown, "boundary_notes")),
    frontend,
    whyForming: publicCardText(frontend.whyForming || frontend.why_forming || ""),
    relationSummary: publicCardText(frontend.relationSummary || frontend.relation_summary || ""),
    publicBoundary: publicCardText(frontend.publicBoundary || frontend.public_boundary || ""),
    sourceTypes: inlineArrayField(markdown, "source_types"),
    relatedSignalCards,
    relatedOpinionCards,
    supportingScenes,
    formalTags,
    sourcePath,
    relationFields,
    relations: parseRelationTokens(relationFields),
    link: "trend-tracking.html",
  };
  return { ...candidate, tags: formalTagIds.length ? tagsFromIds(formalTagIds) : inferTags(candidate, "trend") };
}

function parseTrendCandidates(entries = [], currentDate) {
  return entries
    .map((entry) => parseTrendCandidate(entry.markdown, currentDate, entry.sourcePath))
    .filter(Boolean);
}

async function discoverDates() {
  const trendDirs = trendReportDirs();
  const dirs = [
    path.join(contentRoot, "03-daily-observation"),
    path.join(contentRoot, "04-business-signals", "signals"),
    path.join(contentRoot, "05-frontier-opinions"),
    path.join(contentRoot, "06-asset-candidates", "scene"),
    path.join(contentRoot, "06-asset-candidates", "trend"),
    trendDirs.full,
    trendDirs.flash,
    trendDirs.legacy,
    path.join(contentRoot, "09-business-briefs"),
  ];
  const names = (await Promise.all(dirs.map(markdownNames))).flat();
  return [...new Set(names
    .map((name) => name.match(/^(\d{4}-\d{2}-\d{2})/u)?.[1])
    .filter((date) => date && date >= publicSiteStartDate)
  )].sort();
}

function dateFiles(currentDate) {
  return {
    dailyDir: path.join(contentRoot, "03-daily-observation"),
    businessSignalsDir: path.join(contentRoot, "04-business-signals", "signals"),
    opinionCalibrationDir: path.join(contentRoot, "05-frontier-opinions"),
    trendCandidatesDir: path.join(contentRoot, "06-asset-candidates", "trend"),
    caseResearchDir: path.join(contentRoot, "06-asset-candidates", "scene"),
    businessBriefsDir: path.join(contentRoot, "09-business-briefs"),
    risks: path.join(contentRoot, "11-databases", "risks", `${currentDate}-risk-database-update.md`),
  };
}

async function buildDay(currentDate) {
  const files = dateFiles(currentDate);
  const [dailyObservation, selectedChangeCards, opinionCandidates, clusterCandidates, trendCandidateEntries, caseResearch, trendReportEntry, businessBrief, risks, changeKnowledgeCards, caseKnowledgeCards, signalKnowledgeCards, opinionKnowledgeCards, hasOpinionKnowledge] = await Promise.all([
    readDateMarkdown(files.dailyDir, currentDate, ["daily-observation"]),
    readDateMarkdown(files.businessSignalsDir, currentDate, ["selected-change-cards"]),
    readDateMarkdown(files.opinionCalibrationDir, currentDate, ["opinion-candidates"]),
    readDateMarkdown(files.trendCandidatesDir, currentDate, ["change-cluster-candidates"]),
    readTrendCandidateMarkdowns(files.trendCandidatesDir, currentDate),
    readDateMarkdownFromDirs([files.businessSignalsDir, files.caseResearchDir], currentDate, ["cases", "case-research"]),
    readTrendReportMarkdown(currentDate),
    readDateMarkdown(files.businessBriefsDir, currentDate),
    readOptional(files.risks),
    parseChangeKnowledgeCards(currentDate),
    parseCaseKnowledgeCards(currentDate),
    parseSignalKnowledgeCards(currentDate),
    parseOpinionKnowledgeCards(currentDate),
    hasOpinionKnowledgeCards(currentDate),
  ]);
  const dailyArticle = parseDailyObservation(dailyObservation, currentDate);
  const signals = signalKnowledgeCards.length
    ? signalKnowledgeCards
    : (selectedChangeCards ? parseSelectedChangeCards(selectedChangeCards, currentDate, changeKnowledgeCards) : []);
  const parsedInsights = dailyArticle
    ? [{ id: dailyArticle.id, title: dailyArticle.title, judgment: dailyArticle.judgment, relatedSignals: signals.map((item) => item.id).join(", ") }]
    : [];
  const parsedOpinions = hasOpinionKnowledge
    ? opinionKnowledgeCards
    : (opinionCandidates ? parseOpinionCandidates(opinionCandidates, currentDate) : []);
  const parsedCases = caseResearch.markdown ? parseCaseResearch(caseResearch.markdown, currentDate, caseResearch.sourcePath, caseKnowledgeCards) : [];
  const trendCandidates = parseTrendCandidates(trendCandidateEntries, currentDate);
  const parsedTrends = trendCandidates.length
    ? trendCandidates
    : (trendReportEntry.markdown
      ? [parseDailyObservation(trendReportEntry.markdown, currentDate)].filter(Boolean).map((item) => ({ ...item, tags: inferTags(item, "trend") }))
      : (clusterCandidates ? parseChangeClusterCandidates(clusterCandidates, currentDate) : []));
  const parsedTrendReport = parseTrendReport(trendReportEntry.markdown, currentDate, trendReportEntry.sourcePath);
  const parsedRisks = risks ? parseRisks(risks).map((item) => ({ ...item, date: currentDate })) : [];
  const title = dailyArticle?.title || parsedInsights[0]?.title || signals[0]?.title || parsedTrendReport?.title || `${currentDate} 观澜判断`;
  const dek = dailyArticle?.dek || parsedInsights[0]?.judgment || signals[0]?.judgment || parsedTrendReport?.oneLine || "当日内容仍在整理，暂以已整理信号作为观察样本。";
  return {
    date: currentDate,
    label: currentDate.replaceAll("-", "."),
    title,
    dek,
    article: dailyArticle,
    businessBrief: parseDailyObservation(businessBrief, currentDate),
    signals,
    insights: parsedInsights,
    points: parsedOpinions,
    cases: parsedCases,
    trends: parsedTrends,
    trendReport: parsedTrendReport,
    risks: parsedRisks,
  };
}

function buildContentDateIndex(dayPackages, assets) {
  const byDate = new Map();
  const ensure = (date) => {
    if (!date) return null;
    if (!byDate.has(date)) {
      byDate.set(date, {
        date,
        label: date.replaceAll("-", "."),
        title: `${date} 观澜判断`,
        dek: "已整理内容可作为当前判断网络的时间线索。",
        signalCount: 0,
        pointCount: 0,
        trendCount: 0,
        hasTrendReport: false,
      });
    }
    return byDate.get(date);
  };
  const itemDates = (item) => (item.dateRefs?.length ? item.dateRefs : [item.date]).filter(Boolean);

  dayPackages.forEach((day) => {
    byDate.set(day.date, {
      date: day.date,
      label: day.label,
      title: day.title,
      dek: day.dek,
      signalCount: 0,
      pointCount: 0,
      trendCount: 0,
      hasTrendReport: false,
    });
  });

  assets.signals.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.signalCount += 1;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^已整理内容/u.test(row.dek)) row.dek = item.judgment || item.brief || row.dek;
    });
  });
  assets.points.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.pointCount += 1;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^已整理内容/u.test(row.dek)) row.dek = item.interpretation || item.calibrates || row.dek;
    });
  });
  assets.trends.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.trendCount += 1;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^已整理内容/u.test(row.dek)) row.dek = item.judgment || row.dek;
    });
  });
  assets.trendReports.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.hasTrendReport = true;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^已整理内容/u.test(row.dek)) row.dek = item.oneLine || row.dek;
    });
  });

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

const dates = await discoverDates();
const activeDate = requestedDate || dates.at(-1) || "2026-05-07";
const dayPackages = await Promise.all(dates.map(buildDay));
const activeDay = dayPackages.find((item) => item.date === activeDate) || dayPackages.at(-1);
const signals = activeDay.signals;
const parsedInsights = activeDay.insights;
const parsedOpinions = activeDay.points;
const parsedTrends = activeDay.trends;
const parsedTrendReport = activeDay.trendReport;
const parsedRisks = activeDay.risks;
const allTrendReports = dayPackages.map((item) => item.trendReport).filter(Boolean).reverse();
const visibleTrendReports = allTrendReports;
const allSignals = dayPackages.flatMap((item) => item.signals);
const allCases = uniqueById(dayPackages.flatMap((item) => item.cases || []).reverse());
const allDailyArticles = dayPackages.map((item) => item.article).filter(Boolean).reverse();
const opinionLaneOrder = { daily_feature: 0, signal_sidebar: 1, archive_only: 2, hidden: 3 };
const allOpinions = dayPackages.flatMap((item) => item.points).sort((a, b) => {
  const dateDelta = String(b.date || "").localeCompare(String(a.date || ""));
  if (dateDelta) return dateDelta;
  const laneDelta = (opinionLaneOrder[a.displayLane] ?? 9) - (opinionLaneOrder[b.displayLane] ?? 9);
  if (laneDelta) return laneDelta;
  const scoreDelta = Number(b.ratingScore || 0) - Number(a.ratingScore || 0);
  return scoreDelta || String(a.id || "").localeCompare(String(b.id || ""));
});
const allTrends = dayPackages.flatMap((item) => item.trends).reverse();
const currentDisplayTrend = parsedTrendReport || parsedTrends[0] || allTrends[0] || null;
const contentDates = buildContentDateIndex(dayPackages, {
  signals: allSignals,
  cases: allCases,
  points: allOpinions,
  trends: allTrends,
  trendReports: visibleTrendReports,
});

const siteData = {
  meta: {
    date: activeDate.replaceAll("-", "."),
    sourceLabel: `Generated from 01-SiteV2/content (${contentDates.length} dates)`,
    brand: "观澜AI",
    version: "V2.2.1",
    generatedAt: new Date().toISOString(),
    contentRoot: "01-SiteV2/content",
  },
  tagTaxonomy,
  contentIndex: {
    activeDate,
    dates: contentDates,
    signals: allSignals,
    cases: allCases,
    dailyArticles: allDailyArticles,
    points: allOpinions,
    trends: allTrends,
    trendReports: visibleTrendReports,
  },
  signals,
  daily: {
    ...(activeDay.article || {}),
    slug: `daily-${activeDate}`,
    title: activeDay.title || parsedInsights[0]?.title || signals[0]?.title || `${activeDate} 观澜判断`,
    dek: parsedInsights[0]?.judgment || "今天的主线是企业 AI 从能力试点进入治理、交付和可运营阶段。",
    points: parsedInsights.slice(0, 3).map((item) => item.judgment),
    risk: parsedRisks.map((item) => item.reason).filter(Boolean).slice(0, 3).join("；") || "客户采用、预算归属和部署周期仍需继续观察。",
    calibration: parsedOpinions.slice(0, 2),
    link: "daily-detail.html",
  },
  trendReport: currentDisplayTrend,
  brief: {
    issue: activeDay.businessBrief?.issue || "Preview.001",
    period: activeDay.businessBrief?.period || activeDate.replaceAll("-", "."),
    title: activeDay.businessBrief?.title || activeDay.title || parsedInsights[0]?.title || signals[0]?.title || `${activeDate.replaceAll("-", ".")} 主题摘要`,
    summary: activeDay.businessBrief?.summary?.length
      ? activeDay.businessBrief.summary.slice(0, 3)
      : (parsedInsights.length ? parsedInsights : activeDay.signals).slice(0, 3).map((item) => item.judgment || item.brief),
    heat: parsedTrends.slice(0, 3).map((item) => [item.title, item.title.includes("Coding") ? "争议" : "升温", item.judgment]),
    evidence: {
      points: parsedOpinions.slice(0, 3),
      risks: parsedRisks.slice(0, 3),
      trends: parsedTrends.slice(0, 4),
    },
    member: {
      publicSample: "公开样张只展示本期主题、核心判断和少量热力摘要。",
      loginPreview: "登录后可阅读目录、部分试读和往期入口，但完整证据展开仍留在会员层。",
      fullNote: "会员层展示主要变化、来源摘要、观点参照、趋势线索和反向信息。",
    },
    link: "brief.html",
  },
  archives: dayPackages.map((item) => item.label).reverse(),
};

await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "site-content.json"), `${JSON.stringify(siteData, null, 2)}\n`, "utf8");
await writeFile(path.join(dataDir, "site-content.js"), `window.WaveSightContent = ${JSON.stringify(siteData, null, 2)};\n`, "utf8");

console.log(`Generated ${path.relative(projectRoot, path.join(dataDir, "site-content.json"))}`);
