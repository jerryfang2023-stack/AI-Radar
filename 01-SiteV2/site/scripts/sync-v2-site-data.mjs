import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const projectRoot = path.resolve(siteRoot, "..", "..");
const contentRoot = path.join(projectRoot, "01-SiteV2", "content");
const dataDir = path.join(siteRoot, "data");
const requestedDate = process.argv.find((arg) => arg.startsWith("--date="))?.slice("--date=".length);

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

const tagTaxonomy = [
  { id: "track-ai-agent", name: "AI Agent", group: "track", aliases: ["AI-Agent", "智能体"] },
  { id: "track-ai-coding", name: "AI Coding", group: "track", aliases: ["AI-Coding", "AI编程"] },
  { id: "track-enterprise-workflow", name: "企业工作流", group: "track", aliases: ["企业AI工作流", "工作流自动化"] },
  { id: "track-enterprise-data", name: "企业数据智能", group: "track", aliases: ["企业数据", "RAG", "企业知识库"] },
  { id: "track-ai-marketing", name: "AI营销", group: "track", aliases: ["AI增长", "销售赋能"] },
  { id: "track-ai-customer-service", name: "AI客服", group: "track", aliases: ["Voice-AI", "语音客服"] },
  { id: "track-ai-governance", name: "AI治理", group: "track", aliases: ["Agent治理", "权限审计"] },
  { id: "track-ai-infra", name: "AI基础设施", group: "track", aliases: ["AI Infra", "模型基础设施"] },
  { id: "track-embodied-ai", name: "具身智能", group: "track", aliases: ["机器人", "无人系统"] },
  { id: "track-medical-ai", name: "医疗AI", group: "track", aliases: ["临床AI", "影像AI"] },
  { id: "track-professional-services-ai", name: "专业服务AI", group: "track", aliases: ["法务AI", "咨询AI", "专家知识Agent"] },
  { id: "function-sales", name: "销售", group: "function", aliases: ["销售赋能", "CRM"] },
  { id: "function-marketing", name: "市场营销", group: "function", aliases: ["增长", "投放"] },
  { id: "function-customer-service", name: "客服售后", group: "function", aliases: ["客服", "售后", "质检"] },
  { id: "function-operations", name: "运营流程", group: "function", aliases: ["运营", "流程"] },
  { id: "function-finance", name: "财务", group: "function", aliases: ["票据", "报销", "财务流程"] },
  { id: "function-legal-compliance", name: "法务合规", group: "function", aliases: ["合规", "审计"] },
  { id: "function-procurement-bidding", name: "采购投标", group: "function", aliases: ["招投标", "采购"] },
  { id: "function-engineering", name: "工程研发", group: "function", aliases: ["开发", "仿真", "工程"] },
  { id: "scenario-document-workflow", name: "文档流程", group: "scenario", aliases: ["文档处理", "合同提取"] },
  { id: "scenario-knowledge-base", name: "知识库问答", group: "scenario", aliases: ["RAG", "企业知识库"] },
  { id: "scenario-customer-ticket", name: "工单与质检", group: "scenario", aliases: ["工单", "质检", "智能派单"] },
  { id: "scenario-sales-briefing", name: "销售日报", group: "scenario", aliases: ["销售周报", "线索跟进"] },
  { id: "scenario-bidding-response", name: "标书响应", group: "scenario", aliases: ["标书解析", "应标响应"] },
  { id: "scenario-clinical-imaging", name: "临床影像辅助", group: "scenario", aliases: ["影像诊断"] },
  { id: "scenario-agent-governance", name: "Agent 权限治理", group: "scenario", aliases: ["审计", "权限", "风险控制"] },
  { id: "scenario-builder-point", name: "前沿观点", group: "scenario", aliases: ["The Point", "观点证据", "建造者观点"] },
  { id: "customer-smb", name: "中小企业", group: "customer", aliases: ["SMB", "中小商家"] },
  { id: "customer-enterprise", name: "大中型企业", group: "customer", aliases: ["企业客户"] },
  { id: "customer-public-sector", name: "政府 / 国企", group: "customer", aliases: ["政府", "央国企"] },
  { id: "customer-developer-team", name: "开发团队", group: "customer", aliases: ["工程团队"] },
  { id: "customer-healthcare-provider", name: "医疗机构", group: "customer", aliases: ["医院", "诊所"] },
  { id: "customer-heavy-industry", name: "重资产行业", group: "customer", aliases: ["能源", "电力", "制造", "建筑"] },
  { id: "evidence-funding", name: "融资证据", group: "evidence", aliases: ["投资", "种子轮"] },
  { id: "evidence-customer-adoption", name: "客户采用", group: "evidence", aliases: ["部署", "上线", "合作"] },
  { id: "evidence-product-launch", name: "产品发布", group: "evidence", aliases: ["功能发布", "平台发布"] },
  { id: "evidence-revenue", name: "收入增长", group: "evidence", aliases: ["ARR", "营收"] },
  { id: "evidence-regulation", name: "监管政策", group: "evidence", aliases: ["政策", "合规"] },
  { id: "evidence-procurement", name: "招投标 / 采购", group: "evidence", aliases: ["招标", "政府采购"] },
  { id: "evidence-builder-view", name: "前沿观点", group: "evidence", aliases: ["The Point", "观点", "建造者观点"] },
  { id: "stage-emerging", name: "新出现", group: "stage", aliases: ["emerging"] },
  { id: "stage-rising", name: "升温", group: "stage", aliases: ["rising"] },
  { id: "stage-splitting", name: "分化", group: "stage", aliases: ["splitting"] },
  { id: "stage-mature", name: "成熟化", group: "stage", aliases: ["mature"] },
  { id: "stage-risk", name: "风险变量", group: "stage", aliases: ["risk"] },
  { id: "stage-watch", name: "观察", group: "stage", aliases: ["watch"] },
  { id: "region-global", name: "全球", group: "region", aliases: ["海外"] },
  { id: "region-china", name: "中国适配", group: "region", aliases: ["中国", "本土"] },
  { id: "region-us", name: "美国", group: "region", aliases: ["US"] },
  { id: "region-eu", name: "欧洲", group: "region", aliases: ["EU"] },
  { id: "source-first-party", name: "一手来源", group: "source", aliases: ["官网", "官方博客"] },
  { id: "source-business-media", name: "商业媒体", group: "source", aliases: ["高质量媒体"] },
  { id: "source-industry-data", name: "产业数据", group: "source", aliases: ["数据库", "招投标"] },
  { id: "source-social", name: "社媒线索", group: "source", aliases: ["X", "社区"] },
  { id: "source-podcast", name: "播客", group: "source", aliases: ["YouTube", "访谈"] },
  { id: "source-blog", name: "技术博客", group: "source", aliases: ["Blog"] },
  { id: "point-ai-coding", name: "AI Coding 观点", group: "point", aliases: ["编程", "开发者工具"] },
  { id: "point-agent-workflow", name: "Agent 工作流观点", group: "point", aliases: ["多 Agent", "工作流"] },
  { id: "point-model-infra", name: "模型基础设施观点", group: "point", aliases: ["Infra", "推理", "记忆"] },
  { id: "point-product-strategy", name: "产品策略观点", group: "point", aliases: ["PM", "产品"] },
  { id: "point-ai-safety-governance", name: "AI 安全治理观点", group: "point", aliases: ["安全", "权限", "治理"] },
];

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
    add("scenario-builder-point", "evidence-builder-view", "source-social");
    if (has(/Coding|代码|编程|工程/u)) add("point-ai-coding");
    else if (has(/安全|治理|权限|审计/u)) add("point-ai-safety-governance");
    else if (has(/模型|算力|memory|记忆|Infra/u)) add("point-model-infra");
    else add("point-agent-workflow");
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

function parsePoints(markdown) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => {
    const relations = parseRelationTokens(field(body, "relation_fields"));
    const point = {
      id: field(body, "stable_id"),
      title: cleanPublicText(heading.replace(/^PT-\d+-\d+\s*[｜|]\s*/u, "").trim()),
      sourcePath: field(body, "source_path"),
      sourceUrl: field(body, "source_url"),
      originalDate: field(body, "original_date"),
      convertedAt: field(body, "converted_at"),
      originalView: cleanPublicText(field(body, "conversion_reason")),
      interpretation: cleanPublicText(body.match(/^Point[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      calibrates: cleanPublicText(body.match(/^Point[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      usage: cleanPublicText(body.match(/^V2 用法[：:]\s*(.+)$/mu)?.[1] || ""),
      relations,
      relatedSignals: relations.filter((item) => item.startsWith("signal:")).map((item) => item.split(":")[1]),
      relatedTrends: relations.filter((item) => item.startsWith("trend:")).map((item) => item.split(":")[1]),
      relatedTrendReports: relations.filter((item) => item.startsWith("trendReport:")).map((item) => item.split(":")[1]),
    };
    return { ...point, tags: inferTags(point, "point") };
  });
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
    .filter(([sectionName]) => !["机会判断", "六维分析", "风险与反证", "下一步验证"].includes(sectionName))
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
    ["反证与限制", sectionText(first.body, "风险与反证") || h2SectionText(sectionsAll, ["反证", "风险", "信息缺口"])],
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
    (frontmatterField(markdown, "has_counter_evidence") === "true"
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
    hasCounterEvidence: frontmatterField(markdown, "has_counter_evidence"),
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
      sources: "历史归档 + V2.1 精修",
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

function parseRefinedPoints(markdown, currentDate) {
  return splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => {
    if (!hasPublishReady(body)) return null;
    const relations = parseRelationTokens(field(body, "relation_fields"));
    const itemDate = refinedItemDate(body, currentDate);
    const point = {
      id: field(body, "stable_id"),
      title: cleanPublicText(heading.replace(/^LPT-\d+-\d+\s*[｜|]\s*/u, "").trim()),
      date: itemDate,
      dateRefs: refinedDateRefs(body, itemDate),
      sourceUrl: field(body, "source_url"),
      originalView: cleanPublicText(field(body, "conversion_reason")),
      interpretation: cleanPublicText(body.match(/^Point[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      calibrates: cleanPublicText(body.match(/^Point[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
      usage: cleanPublicText(body.match(/^V2 用法[：:]\s*(.+)$/mu)?.[1] || "用于修正判断边界，不作为事实主证据。"),
      relations,
      relatedSignals: relations.filter((item) => item.startsWith("signal:")).map((item) => item.split(":")[1]),
      relatedTrends: relations.filter((item) => item.startsWith("trend:")).map((item) => item.split(":")[1]),
      relatedTrendReports: relations.filter((item) => item.startsWith("trendReport:")).map((item) => item.split(":")[1]),
      legacy: true,
    };
    return { ...point, tags: inferTags(point, "point") };
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
  const preferred = matches[0];
  return preferred ? readOptional(path.join(dir, preferred)) : "";
}

async function readDateMarkdownFromDirs(dirs, currentDate, includes = []) {
  for (const dir of dirs) {
    const names = await markdownNames(dir);
    const matches = names.filter((name) => {
      if (!name.startsWith(currentDate)) return false;
      return includes.length ? includes.some((token) => name.includes(token)) : true;
    });
    const preferred = matches[0];
    if (preferred) {
      return {
        markdown: await readOptional(path.join(dir, preferred)),
        sourcePath: path.relative(projectRoot, path.join(dir, preferred)).replaceAll("\\", "/"),
      };
    }
  }
  return { markdown: "", sourcePath: "" };
}

function trendReportDirs() {
  const root = path.join(contentRoot, "06-trend-reports");
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

function frontmatterField(markdown, name) {
  const frontmatter = markdown.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"));
  return cleanPublicText(match?.[1]?.trim().replace(/^["']|["']$/gu, "") || "");
}

function firstHeading(markdown) {
  return cleanPublicText(withoutFrontmatter(markdown).match(/^#\s+(.+)$/mu)?.[1] || "");
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

function parseDailyObservation(markdown, currentDate) {
  if (!markdown) return null;
  const title = frontmatterField(markdown, "title") || firstHeading(markdown) || `${currentDate} 今日观察`;
  const paragraphs = introParagraphs(markdown, 3);
  const sections = splitSections(withoutFrontmatter(markdown)).map(({ heading, body }) => ({
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
    judgment: paragraphs[0] || "今日观察已发布，市场主线仍需结合来源继续阅读。",
    dek: paragraphs.slice(0, 2).join("\n\n") || "今日观察已发布，市场主线仍需结合来源继续阅读。",
    summary: paragraphs,
    sections,
  };
}

function parseSelectedChangeCards(markdown, currentDate) {
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
    const rawRef = cleanPublicText(block.match(/^\s*Raw[：:]\s*(.+)$/mu)?.[1] || "");
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
    const signal = {
      id,
      slug: slugify(title) || `change-${index + 1}`,
      title,
      date: currentDate,
      brief: businessMeaning || event || reason,
      judgment: reason,
      event,
      businessMeaning,
      sourceUrl,
      sources: sourceUrl ? "原始出处已记录" : "来源见今日观察原文与变化卡",
      rawRef,
      sourcePath: `01-SiteV2/content/04-business-signals/${currentDate}-selected-change-cards.md#${id}`,
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
    return { ...signal, tags: inferTags(signal, "signal") };
  });
}

function parseCaseResearch(markdown, currentDate, sourcePath = "") {
  if (!markdown) return [];
  const body = withoutFrontmatter(markdown);
  const matches = [...body.matchAll(/^- `?(CASE-\d{8}-\d{2})`?\s*（(.+?)）[：:]\s*(.+)$/gmu)];
  return matches.map((match, index) => {
    const id = match[1].trim();
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
  });
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
      originalDate: field(body, "original_date"),
      originalView: cleanPublicText(body.match(/^原始观点\/摘要[：:]\s*(.+)$/mu)?.[1] || paragraphAfterFields(body)),
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

async function discoverDates() {
  const trendDirs = trendReportDirs();
  const dirs = [
    path.join(contentRoot, "03-daily-observation"),
    path.join(contentRoot, "04-business-signals"),
    path.join(contentRoot, "05-case-research"),
    trendDirs.full,
    trendDirs.flash,
    trendDirs.legacy,
    path.join(contentRoot, "07-business-briefs"),
  ];
  const names = (await Promise.all(dirs.map(markdownNames))).flat();
  return [...new Set(names
    .map((name) => name.match(/^(\d{4}-\d{2}-\d{2})/u)?.[1])
    .filter(Boolean)
  )].sort();
}

function dateFiles(currentDate) {
  return {
    dailyDir: path.join(contentRoot, "03-daily-observation"),
    businessSignalsDir: path.join(contentRoot, "04-business-signals"),
    caseResearchDir: path.join(contentRoot, "05-case-research"),
    businessBriefsDir: path.join(contentRoot, "07-business-briefs"),
    risks: path.join(contentRoot, "09-databases", "risks", `${currentDate}-risk-database-update.md`),
  };
}

async function buildDay(currentDate) {
  const files = dateFiles(currentDate);
  const [dailyObservation, selectedChangeCards, opinionCandidates, clusterCandidates, caseResearch, trendReportEntry, businessBrief, risks] = await Promise.all([
    readDateMarkdown(files.dailyDir, currentDate, ["daily-observation"]),
    readDateMarkdown(files.businessSignalsDir, currentDate, ["selected-change-cards"]),
    readDateMarkdown(files.businessSignalsDir, currentDate, ["opinion-candidates"]),
    readDateMarkdown(files.businessSignalsDir, currentDate, ["change-cluster-candidates"]),
    readDateMarkdownFromDirs([files.caseResearchDir], currentDate, ["case-research"]),
    readTrendReportMarkdown(currentDate),
    readDateMarkdown(files.businessBriefsDir, currentDate),
    readOptional(files.risks),
  ]);
  const dailyArticle = parseDailyObservation(dailyObservation, currentDate);
  const signals = selectedChangeCards ? parseSelectedChangeCards(selectedChangeCards, currentDate) : [];
  const parsedInsights = dailyArticle
    ? [{ id: dailyArticle.id, title: dailyArticle.title, judgment: dailyArticle.judgment, relatedSignals: signals.map((item) => item.id).join(", ") }]
    : [];
  const parsedPoints = opinionCandidates ? parseOpinionCandidates(opinionCandidates, currentDate) : [];
  const parsedCases = caseResearch.markdown ? parseCaseResearch(caseResearch.markdown, currentDate, caseResearch.sourcePath) : [];
  const parsedTrends = trendReportEntry.markdown
    ? [parseDailyObservation(trendReportEntry.markdown, currentDate)].filter(Boolean).map((item) => ({ ...item, tags: inferTags(item, "trend") }))
    : (clusterCandidates ? parseChangeClusterCandidates(clusterCandidates, currentDate) : []);
  const parsedTrendReport = parseTrendReport(trendReportEntry.markdown, currentDate, trendReportEntry.sourcePath);
  const parsedRisks = risks ? parseRisks(risks).map((item) => ({ ...item, date: currentDate })) : [];
  const title = dailyArticle?.title || parsedInsights[0]?.title || signals[0]?.title || parsedTrendReport?.title || `${currentDate} 观澜判断`;
  const dek = dailyArticle?.dek || parsedInsights[0]?.judgment || signals[0]?.judgment || parsedTrendReport?.oneLine || "当日内容仍在整理，暂以已入库信号作为观察样本。";
  return {
    date: currentDate,
    label: currentDate.replaceAll("-", "."),
    title,
    dek,
    article: dailyArticle,
    businessBrief: parseDailyObservation(businessBrief, currentDate),
    signals,
    insights: parsedInsights,
    points: parsedPoints,
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
        dek: "历史内容已完成 V2 化整理，可作为当前判断网络的时间线索。",
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
      if (!row.dek || /^历史内容已完成/u.test(row.dek)) row.dek = item.judgment || item.brief || row.dek;
    });
  });
  assets.points.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.pointCount += 1;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^历史内容已完成/u.test(row.dek)) row.dek = item.interpretation || item.calibrates || row.dek;
    });
  });
  assets.trends.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.trendCount += 1;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^历史内容已完成/u.test(row.dek)) row.dek = item.judgment || row.dek;
    });
  });
  assets.trendReports.forEach((item) => {
    itemDates(item).forEach((date) => {
      const row = ensure(date);
      if (!row) return;
      row.hasTrendReport = true;
      if (!row.title || /观澜判断$/u.test(row.title)) row.title = item.title;
      if (!row.dek || /^历史内容已完成/u.test(row.dek)) row.dek = item.oneLine || row.dek;
    });
  });

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function fallbackTrendReportFromDay(day, currentDate) {
  const base = day.trends[0] || day.signals[0] || {};
  const title = base.title ? `${base.title}｜继续观察` : `${currentDate} 趋势追踪仍在补证`;
  const oneLine = base.judgment || base.brief || "今日暂无足够公开信息支撑深度趋势报告，先保留为继续观察方向。";
  const trendReport = {
    id: `TRD-WATCH-${currentDate.replaceAll("-", "")}`,
    slug: slugify(title) || `trend-watch-${currentDate}`,
    title: cleanPublicText(title),
    oneLine: cleanPublicText(oneLine),
    score: "继续观察",
    stage: "暂无公开信息补足深挖条件",
    date: currentDate,
    updated: currentDate.replaceAll("-", "."),
    sourcePath: base.sourcePath || "",
    relationFields: "",
    relations: [],
    evidenceGaps: "暂未监测到足够同类案例、客户付费信息或多源证据，不能写成正式趋势结论。",
    sections: [
      ["机会判断", "今日暂无公开信息支撑完整机会判断，保留为趋势追踪候选。"],
      ["同类产品", "暂未监测到同类案例。"],
      ["后续观察", "继续看客户采用、预算归属、真实部署、定价变化和同类公司进展。"],
    ],
    link: "trend-detail.html",
  };
  return { ...trendReport, tags: inferTags(trendReport, "trendReport") };
}

const dates = await discoverDates();
const activeDate = requestedDate || dates.at(-1) || "2026-05-07";
const dayPackages = await Promise.all(dates.map(buildDay));
const activeDay = dayPackages.find((item) => item.date === activeDate) || dayPackages.at(-1);
const signals = activeDay.signals;
const parsedInsights = activeDay.insights;
const parsedPoints = activeDay.points;
const parsedTrends = activeDay.trends;
const parsedTrendReport = activeDay.trendReport;
const parsedRisks = activeDay.risks;
const allTrendReports = dayPackages.map((item) => item.trendReport).filter(Boolean).reverse();
const visibleTrendReports = allTrendReports.length ? allTrendReports : [fallbackTrendReportFromDay(activeDay, activeDate)];
const allSignals = dayPackages.flatMap((item) => item.signals);
const allCases = uniqueById(dayPackages.flatMap((item) => item.cases || []).reverse());
const allPoints = dayPackages.flatMap((item) => item.points).reverse();
const allTrends = dayPackages.flatMap((item) => item.trends).reverse();
const contentDates = buildContentDateIndex(dayPackages, {
  signals: allSignals,
  cases: allCases,
  points: allPoints,
  trends: allTrends,
  trendReports: visibleTrendReports,
});

const siteData = {
  meta: {
    date: activeDate.replaceAll("-", "."),
    sourceLabel: `Generated from 01-SiteV2/content (${contentDates.length} dates)`,
    brand: "观澜AI",
    version: "V2.1",
    generatedAt: new Date().toISOString(),
    contentRoot: "01-SiteV2/content",
  },
  tagTaxonomy,
  contentIndex: {
    activeDate,
    dates: contentDates,
    signals: allSignals,
    cases: allCases,
    points: allPoints,
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
    calibration: parsedPoints.slice(0, 2),
    link: "daily-detail.html",
  },
  trendReport: parsedTrendReport || visibleTrendReports[0],
  brief: {
    issue: activeDay.businessBrief?.issue || "Preview.001",
    period: activeDay.businessBrief?.period || activeDate.replaceAll("-", "."),
    title: activeDay.businessBrief?.title || activeDay.title || parsedInsights[0]?.title || signals[0]?.title || `${activeDate.replaceAll("-", ".")} 主题摘要`,
    summary: activeDay.businessBrief?.summary?.length
      ? activeDay.businessBrief.summary.slice(0, 3)
      : (parsedInsights.length ? parsedInsights : activeDay.signals).slice(0, 3).map((item) => item.judgment || item.brief),
    heat: parsedTrends.slice(0, 3).map((item) => [item.title, item.title.includes("Coding") ? "争议" : "升温", item.judgment]),
    evidence: {
      points: parsedPoints.slice(0, 3),
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
