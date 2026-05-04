import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultConfigPath = path.join(root, "04-Site", "config", "content-paths.json");
const configPath = process.env.WAVESIGHT_CONTENT_CONFIG
  ? path.resolve(root, process.env.WAVESIGHT_CONTENT_CONFIG)
  : defaultConfigPath;
const contentConfig = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : {};
const configuredPath = (key, fallback, envName) => {
  const value = process.env[envName] || contentConfig[key] || fallback;
  return path.isAbsolute(value) ? value : path.resolve(root, value);
};

const outDir = configuredPath("outDir", path.join("04-Site", "data"), "WAVESIGHT_OUT_DIR");
const signalDir = configuredPath("signalDir", "01-Signals", "WAVESIGHT_SIGNAL_DIR");
const scoringDir = configuredPath("scoringDir", "02-Scoring", "WAVESIGHT_SCORING_DIR");
const trendsFile = configuredPath("trendsFile", path.join("03-Trends", "AI趋势总表.md"), "WAVESIGHT_TRENDS_FILE");
const pointDir = configuredPath("pointDir", "05-Point", "WAVESIGHT_POINT_DIR");
const opportunitiesDir = configuredPath(
  "opportunitiesDir",
  "07-Opportunities",
  "WAVESIGHT_OPPORTUNITIES_DIR"
);

const read = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

const listMarkdown = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
        .map((name) => path.join(dir, name))
        .sort()
    : [];

const listMarkdownRecursive = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdownRecursive(full);
      return entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_") ? [full] : [];
    })
    .sort();
};

const plain = (text = "") =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/[🔥👀📈📊⬆➡⚠]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const flattenValues = (value) => {
  if (Array.isArray(value)) return value.flatMap(flattenValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenValues);
  return [value];
};

const tagAliases = new Map(
  Object.entries({
    "AI-Agent": "AI Agent",
    "AI Agent基础设施": "AI Agent",
    "企业Agent": "AI Agent",
    "企业级Agent": "AI Agent",
    "AI编程": "AI Coding",
    "AI-Coding": "AI Coding",
    AICoding: "AI Coding",
    "AI增长": "AI营销",
    VoiceAI: "AI客服",
    "Voice-AI": "AI客服",
    "语音Agent": "AI客服",
    "AI客服/语音Agent": "AI客服",
    "企业数据": "企业数据智能",
    "企业知识库": "企业数据智能",
    RAG: "企业数据智能",
    "AI数据智能": "企业数据智能",
    "AI企业服务": "企业工作流",
    "企业AI工作流": "企业工作流",
    "AI治理与安全": "AI治理",
    "Agent治理": "AI治理",
    "营销增长": "市场营销",
    增长: "市场营销",
    "销售/客服": "客服售后",
    客服: "客服售后",
    售后: "客服售后",
    运营: "运营流程",
    "运营效率": "运营流程",
    "投标支持": "采购投标",
    投标: "采购投标",
    招投标: "采购投标",
    "合规风控": "法务合规",
    合规: "法务合规",
    "产品研发": "工程研发",
    "技术/工程": "工程研发",
    数据分析: "企业数据智能",
    技术: "工程研发",
    IT: "工程研发",
    产品: "工程研发",
    研发: "工程研发",
    安全: "法务合规",
    质量: "客服售后",
    售前: "销售",
    融资: "融资证据",
    "融资与估值": "融资证据",
    投资: "融资证据",
    部署: "客户采用",
    合作: "客户采用",
    "合作/生态": "客户采用",
    生态: "客户采用",
    企业客户: "客户采用",
    客户案例: "客户采用",
    "企业采用": "客户采用",
    "商业化验证": "收入增长",
    监管: "监管政策",
    政策: "监管政策",
    采购: "招投标 / 采购",
    并购: "融资证据",
    收购并购: "融资证据",
    开源: "产品发布",
    成熟期: "成熟化",
    增长期: "升温",
    "增长期（有客户）": "升温",
    "早期（无收入）": "新出现",
    早期: "新出现",
    海外: "全球",
    中国: "中国适配",
    本地: "中国适配",
    中大型: "大中型企业",
    中大型企业: "大中型企业",
    大型: "大中型企业",
    "AI Native": "AI营销",
  })
);

const normalizeTagTerm = (term = "") => {
  const cleaned = plain(term);
  if (!cleaned) return "";
  const compact = cleaned.replace(/\s+/g, "");
  return tagAliases.get(cleaned) || tagAliases.get(compact) || cleaned;
};

const splitTerms = (value = "") =>
  flattenValues(value)
    .flatMap((item) => String(item || "").split(/[\/｜|,，、;；\n]/))
    .map(normalizeTagTerm)
    .filter((item) => item && !["-", "无", "暂无", "待补充"].includes(item));

const uniqueTerms = (items = []) => {
  const seen = new Set();
  return flattenValues(items)
    .flatMap(splitTerms)
    .filter((item) => {
      const key = item.toLowerCase().replace(/\s+/g, "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const eventTypeRules = [
  { label: "融资", patterns: [/融资|投资|领投|估值|资本|轮\b|Series/i] },
  { label: "客户采用", patterns: [/企业采用|客户采用|客户案例|部署|签约|落地|央国企|医院|金融机构/] },
  { label: "收入验证", patterns: [/收入|营收|ARR|续费|复购|付费|商业化|盈利/] },
  { label: "平台数据", patterns: [/平台数据|每周|日活|月活|注册|对话|使用量|规模证据/] },
  { label: "产品发布", patterns: [/产品发布|发布|推出|上线|API|模型发布|功能发布/] },
  { label: "监管/政策", patterns: [/监管|政策|合规|身份治理|安全治理|受阻|限制/] },
  { label: "采购/招标", patterns: [/采购|招标|投标|中标|政府采购/] },
  { label: "并购整合", patterns: [/并购|收购|合并|整合|退出/] },
];

const eventTypePriority = new Map(eventTypeRules.map((rule, index) => [rule.label, index]));

const normalizeEventTypes = (...values) => {
  const explicitTerms = String(values[0] || "")
    .split(/[\/｜|,，、;；\n]/)
    .map(plain)
    .filter(Boolean);
  for (const term of explicitTerms) {
    const hit = eventTypeRules.find((rule) => rule.patterns.some((pattern) => pattern.test(term)));
    if (hit) return [hit.label];
  }
  const text = textFromValues(values.slice(1));
  for (const rule of eventTypeRules) {
    if (rule.patterns.some((pattern) => pattern.test(text))) return [rule.label];
  }
  return [];
};

const textFromValues = (...values) => plain(flattenValues(values).join(" "));

const slugify = (value = "", fallback = "item") => {
  const slug = plain(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || fallback;
};

const cleanOpportunityTitle = (value = "") => {
  const title = plain(value);
  const cleaned = title.replace(/\s*[-–—－]\s*[^-–—－]+$/, "").trim();
  return cleaned || title;
};

const extractParenthetical = (value = "") => plain(value).match(/[（(]([^）)]+)[）)]/)?.[1] || "";

const cleanScoringOpportunityName = (value = "") => {
  const title = plain(value)
    .replace(/[（(][^）)]+[）)]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleanOpportunityTitle(title) || plain(value);
};

const extractUrls = (text = "") => [...text.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);

const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const field = (block, label) => {
  const lines = block.split("\n");
  const labels = Array.isArray(label) ? label : [label];
  const patterns = labels.map((item) => new RegExp(`^-\\s*${escapeRegExp(item)}(?:[（(][^）)]*[）)])?\\s*[:：]?\\s*`));
  const start = lines.findIndex((line) => patterns.some((pattern) => pattern.test(line)));
  if (start === -1) return "";
  const pattern = patterns.find((item) => item.test(lines[start]));
  const first = lines[start].replace(pattern, "").trim();
  const collected = first ? [first] : [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("- ") || line.startsWith("### ") || line === "---") break;
    if (line.trim()) collected.push(line.trim());
  }
  return collected.join("\n").trim();
};

const fieldV4 = (block, label) => {
  const lines = block.split("\n");
  const labels = Array.isArray(label) ? label : [label];
  const patterns = labels.map((item) => new RegExp(`^-\\s*${escapeRegExp(item)}(?:[（(][^）)]*[）)])?\\s*[：:]\\s*`));
  const start = lines.findIndex((line) => patterns.some((pattern) => pattern.test(line)));
  if (start === -1) return "";
  const pattern = patterns.find((item) => item.test(lines[start]));
  const first = lines[start].replace(pattern, "").trim();
  const collected = first ? [first] : [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^-\s*[^：:]+[：:]/.test(line) || line.startsWith("### ") || line.startsWith("## ") || line === "---") break;
    if (line.trim()) collected.push(line.trim());
  }
  return collected.join("\n").trim();
};

const anyField = (block, labels) => fieldV4(block, labels) || field(block, labels);

const numberFrom = (value = "") => {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const splitSignalTags = (value = "") =>
  String(value || "")
    .split(/[\/|｜,，、;；\n]/)
    .map(plain)
    .filter(Boolean);

const parseDate = (text, fallback) => {
  const fmDate = text.match(/^date:\s*([0-9-]+)/m)?.[1];
  const fileDate = path.basename(fallback).match(/(\d{4})[-.](\d{2})[-.](\d{2})/);
  if (fmDate) return fmDate;
  if (fileDate) return `${fileDate[1]}-${fileDate[2]}-${fileDate[3]}`;
  return "";
};

const productFromTitle = (title) => {
  const fixed = [
    ["OpenAI Workspace Agents", /OpenAI.*Workspace Agents/i],
    ["Amazon Quick", /Amazon Quick/i],
    ["Scout AI", /Scout AI/i],
    ["Haast", /Haast/i],
    ["Cognizant \u6536\u8d2d Astreya", /Cognizant.*Astreya/i],
    ["Parallel Web Systems", /Parallel Web Systems/i],
    ["LeapMind Growth", /LeapMind Growth/i],
    ["Hightouch", /Hightouch/i],
    ["Avoca", /Avoca/i],
    ["Netomi", /Netomi/i],
    ["Factory", /Factory/i],
    ["Mizzen Insight", /Mizzen Insight|\u89c5\u6df1\u79d1\u6280/i],
    ["Loopit", /Loopit/i],
    ["\u661f\u52a8\u7eaa\u5143", /\u661f\u52a8\u7eaa\u5143/i],
    ["JuliaHub", /JuliaHub/i],
    ["Vanta", /Vanta/i],
    ["Box Automate", /Box Automate/i],
    ["Manus", /Manus/i],
    ["ARI", /Assured Robot Intelligence|\bARI\b/i],
    ["\u539f\u7c92\u534a\u5bfc\u4f53", /\u539f\u7c92\u534a\u5bfc\u4f53/i],
    ["\u4e2d\u6570\u777f\u667a", /\u4e2d\u6570\u777f\u667a/i],
    ["MemoraX AI", /MemoraX/i],
  ];
  const hit = fixed.find(([, re]) => re.test(title));
  if (hit) return hit[0];
  const latinStart = title.match(/^([A-Za-z][A-Za-z0-9]*(?:\s+[A-Za-z][A-Za-z0-9]*){0,2})/);
  if (latinStart) return latinStart[1].trim();
  const chineseStart = title.match(/^([\u4e00-\u9fa5A-Za-z0-9]+?)(?:\u5b8c\u6210|\u83b7|\u83b7\u5f97|\u878d\u8d44|\u4e0a\u7ebf|\u53d1\u5e03|\u5ba3\u5e03|\u4ee5|\u518d\u83b7|\u6536\u8d2d|\u63a8\u51fa)/);
  if (chineseStart) return chineseStart[1].trim();
  return title.split(/[ \uFF0C,\uFF1A:]/)[0].trim();
};

const parseOpportunity = (block) => {
  const part = block.split(/###\s*【机会拆解[^】]*】/)[1] || "";
  const trimmed = part.split(/\n---\n/)[0] || "";
  const matches = [...trimmed.matchAll(/\n?(\d+)\.\s*([^\n]+)\n([\s\S]*?)(?=\n\d+\.\s*[^\n]+\n|$)/g)];
  return matches.map((m) => ({
    id: Number(m[1]),
    question: plain(m[2]),
    answer: m[3].trim(),
  }));
};

const dedupeKey = (signal = {}) => {
  const product = plain(signal.product || "");
  const value = product && product.length <= 40 ? product : signal.title || product;
  return plain(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
};

const joinUniqueText = (...values) => {
  const seen = new Set();
  return values
    .flatMap((value) => String(value || "").split(/\n+/))
    .map((item) => item.trim())
    .filter((item) => {
      const key = plain(item).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n");
};

const mergeLongText = (base = "", incoming = "", label = "\u8865\u5145") => {
  if (!base) return incoming || "";
  if (!incoming) return base;
  const baseKey = plain(base).toLowerCase();
  const incomingKey = plain(incoming).toLowerCase();
  if (baseKey.includes(incomingKey.slice(0, 80))) return base.length >= incoming.length ? base : incoming;
  if (incomingKey.includes(baseKey.slice(0, 80))) return incoming.length >= base.length ? incoming : base;
  return base + "\n\n" + label + ": " + incoming;
};

const mergeOpportunity = (base = [], incoming = []) => {
  const byQuestion = new Map();
  for (const item of [...base, ...incoming]) {
    const key = plain(item.question || item.id || "");
    if (!key) continue;
    const existing = byQuestion.get(key);
    byQuestion.set(key, existing ? { ...existing, answer: mergeLongText(existing.answer, item.answer) } : item);
  }
  return [...byQuestion.values()].map((item, index) => ({ ...item, id: index + 1 }));
};

const mergeSignal = (base, incoming) => {
  const incomingNewer = (incoming.date || "") > (base.date || "") || ((incoming.date || "") === (base.date || "") && (incoming.number || 0) >= (base.number || 0));
  const latest = incomingNewer ? incoming : base;
  return {
    ...base,
    title: latest.title || base.title,
    publishedAt: latest.publishedAt || base.publishedAt,
    product: base.product.length <= incoming.product.length ? base.product : incoming.product,
    tags: [...new Set([...(base.tags || []), ...(incoming.tags || [])])],
    source: joinUniqueText(base.source, incoming.source),
    urls: [...new Set([...(base.urls || []), ...(incoming.urls || [])])],
    newsType: joinUniqueText(base.newsType, incoming.newsType).replace(/\n/g, " / "),
    eventTypes: [...new Set([...(base.eventTypes || []), ...(incoming.eventTypes || []), ...normalizeEventTypes(base.newsType, incoming.newsType, base.summary, incoming.summary)])],
    summary: mergeLongText(base.summary, incoming.summary),
    evidence: mergeLongText(base.evidence, incoming.evidence),
    opportunity: mergeOpportunity(base.opportunity, incoming.opportunity),
    sourceFiles: [...new Set([...(base.sourceFiles || [base.sourceFile]).filter(Boolean), ...(incoming.sourceFiles || [incoming.sourceFile]).filter(Boolean)])],
    mergedSignalIds: [...new Set([...(base.mergedSignalIds || [base.id]), ...(incoming.mergedSignalIds || [incoming.id])])],
  };
};

const mergeDuplicateSignals = (signals) => {
  const merged = new Map();
  const passthrough = [];
  for (const signal of signals) {
    const key = dedupeKey(signal);
    if (!key || key.length < 3) {
      passthrough.push(signal);
      continue;
    }
    merged.set(key, merged.has(key) ? mergeSignal(merged.get(key), signal) : signal);
  }
  return [...merged.values(), ...passthrough].sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.number || 0) - (b.number || 0));
};

const parseSignals = () => {
  const files = listMarkdown(signalDir);
  const signals = [];
  for (const file of files) {
    const text = read(file);
    const date = parseDate(text, file);
    const title = text.match(/^title:\s*(.+)$/m)?.[1] || path.basename(file, ".md");
    const headings = [...text.matchAll(/^###\s*Signal\s+(\d+)(?:\s*[\uFF5C|:\uFF1A\-\u2014\u2013]\s*)?(.+)$/gm)];
    for (let i = 0; i < headings.length; i += 1) {
      const h = headings[i];
      const start = h.index;
      const nextSignal = i + 1 < headings.length ? headings[i + 1].index : -1;
      const nextSection = text.indexOf("\n## ", start + 1);
      const end = nextSignal !== -1 ? nextSignal : nextSection !== -1 ? nextSection : text.length;
      const block = text.slice(start, end);
      const signalTitle = plain(h[2]);
      const tags = splitSignalTags(anyField(block, ["\u6807\u7b7e", "\u5173\u952e\u8bcd"]));
      const source = anyField(block, ["\u65b0\u95fb\u6765\u6e90", "\u6765\u6e90", "\u539f\u59cb\u94fe\u63a5"]);
      const sourceTier = anyField(block, ["\u6765\u6e90\u5c42\u7ea7"]);
      const publishedAt = anyField(block, ["\u53d1\u5e03\u65f6\u95f4", "\u53d1\u5e03\u65e5\u671f", "\u4e8b\u4ef6\u65f6\u95f4"]);
      const newsType = anyField(block, ["\u65b0\u95fb\u7c7b\u578b", "\u4fe1\u53f7\u7c7b\u578b", "\u4e8b\u4ef6\u7c7b\u578b"]);
      const summary = anyField(block, ["\u5185\u5bb9\u7b80\u4ecb", "\u65b0\u95fb\u7b80\u4ecb", "\u65b0\u95fb\u5185\u5bb9\u7b80\u4ecb", "\u8981\u95fb", "\u6982\u8ff0"]);
      const evidence = anyField(block, ["\u8bc1\u636e\u5f3a\u5ea6", "\u8bc1\u636e\u8bf4\u660e"]);
      const operatingStatus = anyField(block, ["\u8fd0\u8425\u72b6\u6001"]);
      const signalScore = numberFrom(anyField(block, ["Signal Score", "\u4fe1\u53f7\u5206\u6570"]));
      const scoreBreakdown = {
        evidence: numberFrom(anyField(block, ["\u5546\u4e1a\u8bc1\u636e\u5f3a\u5ea6"])),
        meaning: numberFrom(anyField(block, ["\u5546\u4e1a\u542b\u4e49\u6e05\u6670\u5ea6"])),
        source: numberFrom(anyField(block, ["\u6765\u6e90\u53ef\u4fe1\u5ea6"])),
        relevance: numberFrom(anyField(block, ["\u8d5b\u9053\u76f8\u5173\u6027"])),
        novelty: numberFrom(anyField(block, ["\u65b0\u53d8\u5316\u7a0b\u5ea6"])),
        relation: numberFrom(anyField(block, ["\u5173\u8054\u4ef7\u503c"])),
        risk: numberFrom(anyField(block, ["\u53cd\u8bc1\u4e0e\u98ce\u9669\u63d0\u793a"])),
      };
      const relatedOpportunities = splitSignalTags(anyField(block, ["\u76f8\u5173\u673a\u4f1a"]));
      const relatedTrends = splitSignalTags(anyField(block, ["\u76f8\u5173\u8d8b\u52bf"]));
      const track = tags[0] || "";
      const product = productFromTitle(signalTitle);
      const id = date + "-signal-" + h[1];
      const eventTypes = normalizeEventTypes(newsType, signalTitle, summary, evidence, tags);
      signals.push({
        id,
        slug: slugify(date + "-" + product + "-" + track, id),
        number: Number(h[1]),
        date,
        documentTitle: title,
        sourceFile: path.relative(root, file).replaceAll("\\", "/"),
        title: signalTitle,
        displayTitle: signalTitle,
        product,
        entity: product,
        track,
        tags,
        source,
        sourceTier,
        urls: extractUrls(source || block),
        publishedAt,
        newsType,
        eventTypes,
        summary,
        evidence,
        signalScore,
        scoreBreakdown,
        operatingStatus,
        relatedOpportunityNames: relatedOpportunities,
        relatedTrendNames: relatedTrends,
        opportunity: parseOpportunity(block),
      });
    }
  }
  return mergeDuplicateSignals(signals);
};

const parseTableRows = (text) =>
  text
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*-+/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => plain(cell)));

const parseScoring = () => {
  const files = listMarkdown(scoringDir);
  const scoreRows = [];
  const details = {};
  for (const file of files) {
    const text = read(file);
    const date = parseDate(text, file);
    const table = text.split("## 二、逐条评分说明")[0] || text;
    const rows = parseTableRows(table).filter((row) => /^\d+$/.test(row[0]));
    for (const row of rows) {
      const [rank, signalTrack, funding, commercialization, growth, demand, replicability, competition, total, verdict] = row;
      const [product, track = ""] = signalTrack.split("｜");
      const rawProduct = plain(product);
      scoreRows.push({
        id: `${date}-${rawProduct}`,
        date,
        rank: Number(rank),
        product: rawProduct,
        rawName: rawProduct,
        opportunityName: cleanScoringOpportunityName(rawProduct),
        representativeCase: extractParenthetical(rawProduct),
        track: plain(track),
        funding: Number(funding),
        commercialization: Number(commercialization),
        growth: Number(growth),
        demand: Number(demand),
        replicability: Number(replicability),
        competition: Number(competition),
        total: Number(total),
        verdict: plain(verdict),
      });
    }

    const sections = [...text.matchAll(/^###\s+\d+\.\s+(.+)$/gm)];
    for (let i = 0; i < sections.length; i += 1) {
      const start = sections[i].index;
      const end = i + 1 < sections.length ? sections[i + 1].index : text.indexOf("\n## 三", start);
      const body = text.slice(start, end === -1 ? undefined : end);
      const product = plain(sections[i][1].split("｜")[0]);
      const detail = {
        product,
        opportunityName: cleanScoringOpportunityName(product),
        representativeCase: extractParenthetical(product),
        scoreText: plain(body.match(/- 总分[:：]\s*([^\n]+)/)?.[1] || ""),
        verdict: plain(body.match(/- 判断[:：]\s*([^\n]+)/)?.[1] || ""),
        upside: collectList(body, "加分点"),
        downside: collectList(body, "扣分点"),
        change: plain(body.match(/- 评分变化[:：]\s*([\s\S]*?)(?=\n---|\n###|\n##|$)/)?.[1] || ""),
      };
      details[`${date}::${product}`] = detail;
      if (!details[product]) details[product] = detail;
    }
  }
  return { rows: scoreRows, details };
};

function collectList(body, title) {
  const part = body.match(new RegExp(`- ${title}[:：]\\s*\\n([\\s\\S]*?)(?=\\n- [^\\n]+[:：]|\\n---|$)`))?.[1] || "";
  return part
    .split("\n")
    .map((line) => plain(line.replace(/^\s*-\s*/, "")))
    .filter(Boolean);
}

const parseTrends = () => {
  if (!fs.existsSync(trendsFile)) return [];
  const text = read(trendsFile);
  const headings = [...text.matchAll(/^##\s+(.+)$/gm)];
  const trends = [];
  for (let i = 0; i < headings.length; i += 1) {
    const track = plain(headings[i][1]);
    if (!track || track.includes("汇总") || track.includes("总观") || track.includes("总览")) continue;
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : text.length;
    const body = text.slice(start, end);
    const scoreRows = parseTableRows(body).filter((row) => row.length === 2 && /^\d{2}-\d{2}$/.test(row[0]));
    const productsTable = body.split("### 具体产品")[1] || "";
    const products = parseTableRows(productsTable)
      .filter((row) => row.length >= 4 && row[0] !== "产品")
      .map(([product, score, verdict, basis]) => ({
        product: plain(product),
        score: plain(score),
        verdict: plain(verdict),
        basis: plain(basis),
      }));
    trends.push({
      track,
      scores: scoreRows.map(([date, score]) => ({ date, score: Number(score) || null })),
      sevenDay: plain(body.match(/\*\*7天趋势\*\*[:：]\s*([^\n]+)/)?.[1] || ""),
      thirtyDay: plain(body.match(/\*\*30天趋势\*\*[:：]\s*([^\n]+)/)?.[1] || ""),
      verdict: plain(body.match(/\*\*判断\*\*[:：]\s*([^\n]+)/)?.[1] || ""),
      products,
    });
  }
  return trends;
};

const parseFrontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const lines = match[1].split("\n");
  const data = {};
  let currentKey = "";
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const raw = kv[2].trim();
      data[currentKey] = raw.replace(/^"|"$/g, "");
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = data[currentKey] ? [data[currentKey]] : [];
      data[currentKey].push(item[1].replace(/^"|"$/g, ""));
    }
  }
  return data;
};

const section = (text, heading) => {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, "m");
  const match = text.match(re);
  if (!match) return "";
  const start = match.index + match[0].length;
  const next = text.slice(start).search(/\n##\s+/);
  return text.slice(start, next === -1 ? undefined : start + next).trim();
};

const labeledBullets = (text) => {
  const rows = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^-\s+\*\*([^：:]+)[：:]\*\*\s*([\s\S]*)$/);
    if (match) rows[plain(match[1])] = plain(match[2]);
  }
  return rows;
};

const simpleBullets = (text) =>
  text
    .split("\n")
    .map((line) => line.match(/^-\s+(.+)$/)?.[1])
    .filter(Boolean)
    .map(plain);

const parseTagSection = (text) => {
  const rows = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^-\s+([^：:]+)[：:]\s*(.+)$/);
    if (match) {
      rows[plain(match[1])] = plain(match[2]);
    }
  }
  return rows;
};

const parseOpportunities = () => {
  if (!fs.existsSync(opportunitiesDir)) return [];
  return listMarkdown(opportunitiesDir)
    .filter((file) => !path.basename(file).startsWith("_"))
    .map((file) => {
      const text = read(file);
      const fm = parseFrontmatter(text);
      const sourceTitle = path.basename(file, ".md");
      const title = cleanOpportunityTitle(sourceTitle);
      const summary = labeledBullets(section(text, "机会摘要"));
      const tags = parseTagSection(section(text, "标签"));
      const problem = labeledBullets(section(text, "问题与解决方案"));
      const roi = labeledBullets(section(text, "ROI假设"));
      const cases = labeledBullets(section(text, "代表性案例"));
      const suppliers = labeledBullets(section(text, "典型供给方"));
      const risks = labeledBullets(section(text, "风险与反证"));
      const actions = labeledBullets(section(text, "行动建议"));
      const frontmatterTags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
      const fallbackTags = [
        fm.industry,
        fm.business_function,
        fm.scenario,
        fm.enterprise_size,
        fm.priority ? `${fm.priority}优先级` : "",
        fm.evidence_level ? `证据${fm.evidence_level}` : "",
        tags["行业"],
        tags["业务职能"],
        tags["场景"],
        tags["企业规模"],
      ];
      const tagList = uniqueTerms(frontmatterTags.length ? frontmatterTags : fallbackTags);

      return {
        id: `${fm.opportunity_id || "opportunity"}-${sourceTitle}`,
        slug: fm.slug || slugify(`${fm.opportunity_id || "opportunity"}-${title}`, fm.opportunity_id || "opportunity"),
        opportunityId: fm.opportunity_id || "",
        title,
        sourceTitle,
        status: fm.status || "",
        priority: fm.priority || actions["建议优先级"] || "",
        evidenceLevel: fm.evidence_level || "",
        created: fm.created || "",
        updated: fm.updated || "",
        industry: fm.industry || tags["行业"] || "",
        businessFunction: fm.business_function || tags["业务职能"] || "",
        scenario: fm.scenario || tags["场景"] || "",
        enterpriseSize: fm.enterprise_size || tags["企业规模"] || "",
        maturity: Number(fm.maturity || tags["成熟度"]) || null,
        chinaFit: Number(fm.china_fit || tags["中国适配度"]) || null,
        urgency: Number(fm.urgency || tags["决策紧迫度"]) || null,
        estimatedRoi: fm.estimated_roi || roi["回本周期假设"] || "",
        nextReview: fm.next_review || actions["复盘日期"] || "",
        sourceReports: Array.isArray(fm.source_reports) ? fm.source_reports : [],
        sourceFile: path.relative(root, file).replaceAll("\\", "/"),
        tags: [...new Set(tagList)],
        summary,
        problem,
        roi,
        cases,
        suppliers,
        risks,
        actions,
        columns: {
          "机会摘要": summary,
          "标签": tags,
          "问题与解决方案": problem,
          "ROI假设": roi,
          "代表性案例": cases,
          "典型供给方": suppliers,
          "风险与反证": risks,
          "行动建议": actions,
        },
        rawBullets: simpleBullets(text),
      };
    })
    .sort((a, b) => {
      const rank = { 高: 1, 中: 2, 低: 3 };
      return (rank[a.priority] || 9) - (rank[b.priority] || 9) || (b.urgency || 0) - (a.urgency || 0);
    });
};

const pointField = (block, labels) => {
  const value = anyField(block, labels);
  return value ? plain(value) : "";
};

const pointLongField = (block, labels) => {
  const value = anyField(block, labels);
  return value
    ? String(value)
        .replace(/\s*https?:\/\/t\.co\/\S+/gi, "")
        .replace(/[*_`>#]/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .trim()
    : "";
};

const cleanPointSourceText = (value = "") =>
  String(value || "")
    .replace(/(^|\n)\s*(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\s*\n?/gi, "$1")
    .replace(/\s*(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\s*/gi, " ")
    .replace(/\s*https?:\/\/t\.co\/\S+/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const parsePointBlock = (block, heading, index, file, docFm, docDate) => {
  const title = plain(heading || pointField(block, ["观点标题", "标题"]));
  const date = docFm.date || docDate || parseDate(block, file);
  const person = pointField(block, ["人物", "建造者", "作者", "来源人物"]);
  const source = pointField(block, ["来源", "平台", "出处"]) || docFm.source || "follow-builders";
  const originalUrl = pointField(block, ["原文链接", "链接", "URL"]) || extractUrls(block)[0] || "";
  const originalText = pointLongField(block, ["原文全文", "原始发言段", "原始段落", "原文段落", "原文摘录", "原文", "Original"]);
  const originalTranslation = pointLongField(block, ["中文译文全文", "发言段译文", "原始段落译文", "中文译文段落", "中文译文", "原文翻译", "翻译", "Translation"]);
  const sourceNoteId = pointField(block, ["素材笔记", "站内素材", "sourceNoteId"]);
  const summary = pointField(block, ["观点摘要", "原始观点摘要", "摘要"]);
  const interpretation = pointField(block, ["观澜解读", "简要解读", "解读"]);
  const commercialMeaning = pointField(block, ["商业含义", "商业意义"]);
  const boundary = pointField(block, ["观点边界", "边界", "风险与反证", "反证"]);
  const score = numberFrom(pointField(block, ["分数", "Point Score", "观点分数"])) || 0;
  const topics = uniqueTerms([pointField(block, ["主题", "Topics", "标签"]), docFm.topics || [], docFm.tags || []]).slice(0, 10);
  const relatedSignalIds = splitTerms(pointField(block, ["关联Signals", "关联 Signal", "relatedSignalIds"]));
  const relatedTrendIds = splitTerms(pointField(block, ["关联Trends", "关联 Trend", "relatedTrendIds", "关联趋势"]));
  const relatedOpportunityIds = splitTerms(pointField(block, ["关联Opportunities", "关联 Opportunity", "relatedOpportunityIds", "关联机会"]));
  const fallbackId = `${date || "undated"}-point-${index}`;
  const id = index === 1 && docFm.point_id ? docFm.point_id : fallbackId;
  return {
    id,
    slug: docFm.slug && index === 1 ? docFm.slug : slugify(`${date}-${title || id}`, id),
    date,
    rank: index,
    title: title || summary || `Point ${index}`,
    person,
    source,
    originalUrl,
    originalText,
    originalTranslation,
    pointSummary: summary,
    interpretation,
    commercialMeaning,
    boundary,
    pointScore: score,
    topics,
    relatedSignalIds,
    relatedTrendIds,
    relatedOpportunityIds,
    sourceNoteId,
    sourceFile: path.relative(root, file).replaceAll("\\", "/"),
  };
};

const parsePoints = () => {
  if (!fs.existsSync(pointDir)) return [];
  const points = [];
  for (const file of listMarkdown(pointDir)) {
    const text = read(file);
    const docFm = parseFrontmatter(text);
    const date = parseDate(text, file);
    const headings = [...text.matchAll(/^###\s+(?:Point\s*)?(\d+)[\.、\s｜|-]*(.+)$/gim)];
    if (!headings.length) {
      const body = text.replace(/^---\n[\s\S]*?\n---/, "");
      const single = parsePointBlock(body, docFm.title || path.basename(file, ".md"), 1, file, docFm, date);
      if (single.title || single.pointSummary) points.push(single);
      continue;
    }
    for (let i = 0; i < headings.length; i += 1) {
      const start = headings[i].index;
      const end = i + 1 < headings.length ? headings[i + 1].index : text.length;
      const block = text.slice(start, end);
      points.push(parsePointBlock(block, headings[i][2], Number(headings[i][1]) || i + 1, file, docFm, date));
    }
  }
  return points.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.pointScore || 0) - (a.pointScore || 0));
};

const stripFrontmatter = (text = "") => text.replace(/^---\n[\s\S]*?\n---\n?/, "");

const parsePointSources = () => {
  const sourceRoot = path.join(pointDir, "sources");
  return listMarkdownRecursive(sourceRoot).map((file) => {
    const text = read(file);
    const fm = parseFrontmatter(text);
    const body = stripFrontmatter(text);
    const title = fm.title || body.match(/^#\s+(.+)$/m)?.[1] || path.basename(file, ".md");
    const id = fm.source_id || slugify(title, path.basename(file, ".md"));
    return {
      id,
      slug: fm.slug || slugify(title, id),
      title: plain(title),
      date: fm.date || parseDate(text, file),
      sourceType: fm.source_type || "",
      sourceName: fm.source_name || "",
      sourceUrl: fm.source_url || "",
      relatedPointIds: splitTerms(fm.related_points || ""),
      sourceFile: path.relative(root, file).replaceAll("\\", "/"),
      sourcePolicy: cleanPointSourceText(section(body, "来源与版权")),
      fullText: cleanPointSourceText(section(body, "全文文档")),
      fullTranslation: cleanPointSourceText(section(body, "全文译文")),
      readingSummary: cleanPointSourceText(section(body, "站内阅读摘要")),
      structure: cleanPointSourceText(section(body, "内容结构")),
      keySegments: cleanPointSourceText(section(body, "高价值原文段")),
      interpretation: cleanPointSourceText(section(body, "长期知识沉淀")),
    };
  });
};

const normalize = (value = "") => plain(value).toLowerCase().replace(/\s+/g, "");
const aliasesOf = (value = "") => {
  const text = plain(value);
  const aliases = [text];
  const parens = [...text.matchAll(/[（(]([^）)]+)[）)]/g)].map((match) => match[1]);
  aliases.push(...parens);
  aliases.push(text.replace(/[（(][^）)]+[）)]/g, ""));
  return aliases.map(normalize).filter(Boolean);
};

const sameProduct = (left = "", right = "") => {
  const leftAliases = aliasesOf(left);
  const rightAliases = aliasesOf(right);
  return leftAliases.some((a) => rightAliases.some((b) => a.includes(b) || b.includes(a)));
};

const taxonomyKeys = [
  "tracks",
  "industries",
  "functions",
  "scenarios",
  "capabilities",
  "stages",
  "geos",
  "signals",
  "actions",
  "priorities",
  "scoreBands",
  "topics",
  "products",
];

const taxonomyRules = [
  { key: "tracks", label: "AI营销", patterns: [/AI\s*营销/i, "CRM", "CDP", "用户分群", "投放触达", "转化优化", "收入系统"] },
  { key: "tracks", label: "AI客服", patterns: [/AI\s*客服/i, "客服", "客户支持", "呼叫中心", "语音机器人", "Avoca", "Netomi"] },
  { key: "tracks", label: "AI Agent", patterns: [/AI\s*Agent/i, "智能体", "Agent", "代理型", "自主执行"] },
  { key: "tracks", label: "AI Coding", patterns: [/AI\s*Coding/i, /AI\s*编程/i, "代码生成", "开发者工具", "一人公司", "编程", "IDE"] },
  { key: "tracks", label: "企业工作流", patterns: ["企业服务", "企业客户", "B2B", "SaaS", "工作流", "办公协作"] },
  { key: "tracks", label: "企业数据智能", patterns: ["数据分析", "数据资产", "BI", "用户研究", "用户洞察", "Mizzen", "Insight"] },
  { key: "tracks", label: "AI治理", patterns: ["AI治理", "模型治理", "安全平台", "数据安全", "风控平台"] },
  { key: "tracks", label: "AI营销", patterns: ["多模态", "视频生成", "图像生成", "素材生成", "AI Native"] },
  { key: "tracks", label: "专业服务AI", patterns: ["搜索", "研究", "情报", "报告生成", "信息检索"] },
  { key: "tracks", label: "AI基础设施", patterns: ["基础设施", "模型平台", "算力", "推理", "API平台"] },

  { key: "industries", label: "企业服务", patterns: ["企业服务", "企业客户", "B2B", "SaaS", "工作流"] },
  { key: "industries", label: "消费品牌", patterns: ["消费品牌", "品牌", "电商", "零售", "新零售", "PetSmart", "HelloFresh", "DraftKings"] },
  { key: "industries", label: "互联网", patterns: ["互联网", "平台型", "订阅制业务", "在线服务"] },
  { key: "industries", label: "建筑工程", patterns: ["建筑", "工程", "招投标", "标书", "应标"] },
  { key: "industries", label: "制造业", patterns: ["制造", "工业", "汽车", "智能硬件"] },
  { key: "industries", label: "政企与公共服务", patterns: ["政企", "政府", "公共服务", "招标采购"] },

  { key: "functions", label: "市场营销", patterns: ["营销", "投放", "转化", "CRM", "客户数据"] },
  { key: "functions", label: "销售", patterns: ["销售", "线索", "商机"] },
  { key: "functions", label: "客服售后", patterns: ["客服", "客户支持", "售后", "质检", "工单"] },
  { key: "functions", label: "工程研发", patterns: ["产品研发", "研发团队", "开发者", "代码", "Coding", "编程"] },
  { key: "functions", label: "采购投标", patterns: ["招投标", "投标", "标书", "应标", "资质审查"] },
  { key: "functions", label: "市场营销", patterns: ["用户研究", "用户访谈", "用户洞察", "产品调研", "NPS"] },
  { key: "functions", label: "法务合规", patterns: ["合规", "审计", "风控", "治理", "安全"] },
  { key: "functions", label: "运营流程", patterns: ["流程", "自动化", "工作流", "一人公司", "效率"] },
  { key: "functions", label: "运营流程", patterns: ["机会评分", "商业判断", "资源方", "机会库"] },

  { key: "scenarios", label: "用户分群与触达", patterns: ["用户分群", "触达", "一方数据", "私域", "客户数据平台"] },
  { key: "scenarios", label: "客服自动化", patterns: ["客服自动化", "客户支持", "售后", "呼叫中心"] },
  { key: "scenarios", label: "销售线索转化", patterns: ["销售线索", "商机", "转化动作", "客户转化"] },
  { key: "scenarios", label: "招投标响应", patterns: ["招投标", "标书解析", "应标响应", "资质审查"] },
  { key: "scenarios", label: "用户洞察", patterns: ["用户访谈", "用户洞察", "产品调研", "NPS", "品牌定位研究"] },
  { key: "scenarios", label: "代码生成与交付", patterns: ["代码生成", "开发自动化", "工具链", "AI Coding"] },
  { key: "scenarios", label: "企业知识工作流", patterns: ["知识库", "企业知识", "文档处理", "工作流"] },
  { key: "scenarios", label: "趋势监测", patterns: ["趋势", "持续上升", "30天", "7天"] },
  { key: "scenarios", label: "机会验证", patterns: ["机会验证", "值得验证", "下一步验证", "复盘"] },

  { key: "capabilities", label: "Agent工作流", patterns: [/Agent/i, "智能体", "自主执行", "任务分解"] },
  { key: "capabilities", label: "数据连接", patterns: ["数据连接", "一方数据", "CRM", "CDP", "API", "系统集成"] },
  { key: "capabilities", label: "RAG知识库", patterns: ["RAG", "知识库", "检索增强", "文档问答"] },
  { key: "capabilities", label: "语音交互", patterns: ["语音", "电话", "呼叫", "对话"] },
  { key: "capabilities", label: "代码生成", patterns: ["代码生成", "Coding", "编程", "开发者工具"] },
  { key: "capabilities", label: "评分模型", patterns: ["评分", "优先级", "总分", "机会评分"] },
  { key: "capabilities", label: "自动化执行", patterns: ["自动化", "执行", "流程", "动作"] },
  { key: "capabilities", label: "多模态生成", patterns: ["多模态", "视频生成", "图像生成"] },
  { key: "capabilities", label: "研究分析", patterns: ["研究", "分析", "洞察", "情报"] },

  { key: "stages", label: "早期", patterns: ["早期", "初创", "种子轮", "天使轮"] },
  { key: "stages", label: "增长期", patterns: ["增长期", "高速增长", "扩张", "A轮", "B轮"] },
  { key: "stages", label: "成熟期", patterns: ["成熟期", "ARR", "企业客户", "估值"] },
  { key: "stages", label: "商业化验证", patterns: ["商业化", "付费客户", "收入", "回本周期"] },

  { key: "geos", label: "海外", patterns: ["海外", "美国", "北美", "Global"] },
  { key: "geos", label: "中国", patterns: ["中国", "国内", "中国适配", "本土"] },
  { key: "geos", label: "全球", patterns: ["全球", "跨境", "国际化"] },

  { key: "signals", label: "融资", patterns: ["融资", "投资", "领投", "估值"] },
  { key: "signals", label: "收入增长", patterns: ["收入增长", "ARR", "营收", "回本"] },
  { key: "signals", label: "企业客户", patterns: ["企业客户", "客户案例", "标杆客户"] },
  { key: "signals", label: "产品发布", patterns: ["产品发布", "发布", "上线", "推出"] },
  { key: "signals", label: "合作/生态", patterns: ["合作", "生态", "伙伴", "渠道"] },
  { key: "signals", label: "收购并购", patterns: ["收购", "并购", "M&A"] },
  { key: "signals", label: "开源", patterns: ["开源", "GitHub"] },
];

const emptyTaxonomy = () => Object.fromEntries(taxonomyKeys.map((key) => [key, []]));

const addTaxonomy = (taxonomy, key, values) => {
  if (!taxonomy[key]) taxonomy[key] = [];
  taxonomy[key] = uniqueTerms([...taxonomy[key], values]);
};

const compactTaxonomy = (taxonomy = {}) => {
  const compact = emptyTaxonomy();
  for (const key of taxonomyKeys) compact[key] = uniqueTerms(taxonomy[key] || []);
  return compact;
};

const mergeTaxonomies = (...taxonomies) => {
  const merged = emptyTaxonomy();
  for (const taxonomy of taxonomies.filter(Boolean)) {
    for (const key of taxonomyKeys) addTaxonomy(merged, key, taxonomy[key] || []);
  }
  return compactTaxonomy(merged);
};

const patternMatches = (text, lower, pattern) => {
  if (pattern instanceof RegExp) return pattern.test(text);
  return lower.includes(String(pattern).toLowerCase());
};

const inferTaxonomy = (input = {}) => {
  const taxonomy = emptyTaxonomy();
  addTaxonomy(taxonomy, "tracks", [input.track, input.scoreTrack]);
  addTaxonomy(taxonomy, "industries", input.industry);
  addTaxonomy(taxonomy, "functions", input.businessFunction);
  addTaxonomy(taxonomy, "scenarios", input.scenario);
  addTaxonomy(taxonomy, "signals", input.eventTypes || normalizeEventTypes(input.newsType, input.title, input.summary, input.evidence, input.extra));
  addTaxonomy(taxonomy, "topics", input.tags);
  addTaxonomy(taxonomy, "products", input.product);

  if (input.priority) addTaxonomy(taxonomy, "priorities", `${input.priority}优先级`);
  if (input.evidenceLevel) addTaxonomy(taxonomy, "topics", `证据${input.evidenceLevel}`);

  const text = textFromValues(input);
  const lower = text.toLowerCase();
  for (const rule of taxonomyRules) {
    if (rule.key === "signals" && !["signal", "scoring"].includes(input.kind)) continue;
    if (rule.key === "stages" && input.kind === "opportunity") continue;
    if (rule.patterns.some((pattern) => patternMatches(text, lower, pattern))) addTaxonomy(taxonomy, rule.key, rule.label);
  }

  const total = Number(input.total || input.score?.total || 0);
  if (total >= 27) addTaxonomy(taxonomy, "scoreBands", "高分信号");
  else if (total >= 24) addTaxonomy(taxonomy, "scoreBands", "中高分信号");
  else if (total > 0) addTaxonomy(taxonomy, "scoreBands", "观察信号");

  const verdict = textFromValues(input.verdict, input.priority, input.actions);
  if (/做多|高优先|值得|优先|强/.test(verdict)) {
    addTaxonomy(taxonomy, "actions", "优先验证");
    addTaxonomy(taxonomy, "priorities", "高关注");
  }
  if (/观察|跟踪|复盘|中优先/.test(verdict)) {
    addTaxonomy(taxonomy, "actions", "进入观察池");
    addTaxonomy(taxonomy, "priorities", "持续跟踪");
  }
  if (/谨慎|回避|暂缓|低优先|风险/.test(verdict)) {
    addTaxonomy(taxonomy, "actions", "暂缓投入");
    addTaxonomy(taxonomy, "priorities", "低优先级");
  }
  if (/持续上升|强上升|升温|上升/.test(text)) addTaxonomy(taxonomy, "actions", "趋势升温");
  if (/回落|降温|下滑/.test(text)) addTaxonomy(taxonomy, "actions", "趋势降温");

  const maturity = Number(input.maturity || 0);
  if (input.kind === "opportunity" && maturity) {
    if (maturity <= 2) addTaxonomy(taxonomy, "stages", "观察");
    else if (maturity >= 4) addTaxonomy(taxonomy, "stages", "成熟化");
    else addTaxonomy(taxonomy, "stages", "新出现");
  }

  return compactTaxonomy(taxonomy);
};

const publicTaxonomyTagKeys = new Set(["tracks", "functions", "stages", "geos", "signals"]);

const taxonomyTags = (taxonomy = {}, options = {}) => {
  const keys = new Set(publicTaxonomyTagKeys);
  if (options.includeTopics) keys.add("topics");
  return uniqueTerms(Object.entries(taxonomy).filter(([key]) => keys.has(key)).flatMap(([, values]) => values || []));
};

const officialPublicTags = new Set([
  "AI Agent",
  "AI Coding",
  "企业工作流",
  "企业数据智能",
  "AI营销",
  "AI客服",
  "AI治理",
  "AI基础设施",
  "具身智能",
  "医疗AI",
  "专业服务AI",
  "销售",
  "市场营销",
  "客服售后",
  "运营流程",
  "财务",
  "法务合规",
  "采购投标",
  "工程研发",
  "文档流程",
  "知识库问答",
  "工单与质检",
  "销售日报",
  "标书响应",
  "临床影像辅助",
  "Agent 权限治理",
  "建造者观点",
  "中小企业",
  "大中型企业",
  "政府 / 国企",
  "开发团队",
  "医疗机构",
  "重资产行业",
  "融资证据",
  "客户采用",
  "产品发布",
  "收入增长",
  "监管政策",
  "招投标 / 采购",
  "新出现",
  "升温",
  "分化",
  "成熟化",
  "风险变量",
  "观察",
  "全球",
  "中国适配",
  "美国",
  "欧洲",
  "一手来源",
  "商业媒体",
  "产业数据",
  "社媒线索",
  "播客",
  "技术博客",
  "AI Coding 观点",
  "Agent 工作流观点",
  "模型基础设施观点",
  "产品策略观点",
  "AI 安全治理观点",
]);

const publicTagsOnly = (items = []) => uniqueTerms(items).filter((tag) => officialPublicTags.has(tag));

const applyItemTaxonomy = (item, seed, ...relatedTaxonomies) => {
  const taxonomy = mergeTaxonomies(inferTaxonomy(seed), ...relatedTaxonomies);
  item.taxonomy = taxonomy;
  item.tags = publicTagsOnly([item.tags || [], taxonomyTags(taxonomy, { includeTopics: seed?.kind === "point" })]).slice(0, 28);
  return taxonomy;
};

const trackAliases = [
  ["AI Agent", "AI Agent基础设施", "企业Agent", "企业级Agent", "企业桌面端 Agent 执行层", "Agentic AI"],
  ["AI客服/语音Agent", "AI客服", "AI客服Agent", "AI企业客服执行Agent", "语音Agent", "客服Agent"],
  ["AI治理", "AI治理与安全", "Agent治理", "Agent治理与权限审计", "合规引擎/Agent 治理", "企业AI治理"],
  ["AI用户研究", "AI数据智能", "用户研究", "AI用户研究Agent"],
  ["具身智能/机器人", "具身智能", "具身智能物流", "机器人", "具身智能脑层"],
  ["AI编程", "AI Coding", "AICoding", "AI编程Agent"],
  ["AI增长", "AI增长Agent", "增长Agent"],
  ["AI工具类", "AI Native", "AI Native互动内容", "互动内容"],
  ["企业数据/RAG", "企业数据", "企业数据智能体控制平面", "RAG"],
  ["AI基础设施", "AI基础设施服务并购", "AI基础设施服务", "端侧推理", "工程仿真"],
  ["AI营销", "AI营销平台", "中小商家AI营销", "商家AI对话"],
  ["专业服务AI", "法律AI", "专业服务AI工作流"],
  ["医疗AI", "临床影像AI", "临床AI"],
];

const canonicalTrack = (value = "") => {
  const normalized = normalize(value);
  if (!normalized) return "";
  const group = trackAliases.find((aliases) => aliases.some((item) => normalize(item) === normalized));
  return normalize(group?.[0] || value);
};

const sameTrack = (left = "", right = "") => canonicalTrack(left) === canonicalTrack(right);

const associationTerms = (taxonomy = {}) =>
  new Set(["tracks", "industries", "functions", "scenarios", "capabilities"].flatMap((key) => taxonomy[key] || []).map(normalize).filter(Boolean));

const overlapScore = (left = {}, right = {}) => {
  const a = associationTerms(left);
  const b = associationTerms(right);
  return [...a].filter((term) => b.has(term)).length;
};

const matchOpportunityIdsByName = (names = [], opportunities = []) => {
  const values = uniqueTerms(names).map(normalize).filter(Boolean);
  if (!values.length) return [];
  return opportunities
    .filter((opportunity) => {
      const candidates = [opportunity.id, opportunity.opportunityId, opportunity.title, opportunity.sourceTitle, opportunity.slug]
        .map(normalize)
        .filter(Boolean);
      return values.some((value) =>
        candidates.some((candidate) => candidate === value || candidate.includes(value) || value.includes(candidate))
      );
    })
    .map((opportunity) => opportunity.id);
};

const opportunityMatchRules = [
  { match: [/Legora/i, /专业服务AI/i, /法律\s*AI/i], title: /专业服务AI工作流平台/ },
  { match: [/Aidoc/i, /临床影像/i, /医疗AI/i], title: /临床影像AI辅助诊断平台/ },
  { match: [/Snowflake/i, /企业数据\/RAG/i, /数据智能体控制平面/i], title: /企业数据智能体控制平面/ },
  { match: [/Meta Business AI/i, /商家AI对话/i, /中小商家AI营销/i], title: /中小商家AI营销对话平台/ },
  { match: [/ASAPP/i], title: /AI企业客服执行Agent/ },
  { match: [/Hightouch/i, /AI\s*营销/i, /收入系统/], title: /AI营销Agent/ },
  { match: [/LeapMind/i, /AI\s*增长/i], title: /AI增长Agent/ },
  { match: [/Avoca/i, /语音Agent/i, /语音客服/i], title: /AI语音客服首轮分流助手/ },
  { match: [/MemoraX/i, /记忆层/i], title: /AI记忆层基础设施/ },
  { match: [/Loopit/i, /互动内容/i], title: /AI互动内容平台/ },
  { match: [/Netomi/i, /AI\s*客服/i, /客服Agent/], title: /AI企业客服执行Agent/ },
  { match: [/Factory/i, /AI\s*编程/i, /AI\s*Coding/i, /一人公司/], title: /AICoding驱动一人公司工具链/ },
  { match: [/Parallel Web Systems/i, /AI\s*Agent基础设施/i], title: /AI Agent基础设施服务/ },
  { match: [/Amazon Quick/i, /Workspace Agents/i, /企业桌面端\s*Agent/i, /企业级智能体/i, /中数睿智/i], title: /企业Agent工作平台/ },
  { match: [/Vanta/i, /Haast/i, /合规引擎/i, /Agent\s*治理/i, /Manus.*并购受阻/i, /监管变量/i], title: /Agent治理与权限审计服务/ },
  { match: [/Mizzen/i, /用户研究/i, /用户洞察/i], title: /AI用户研究Agent/ },
  { match: [/星动纪元/i, /物流机器人/i], title: /具身智能物流机器人/ },
  { match: [/JuliaHub/i, /工程仿真/i], title: /AI工程仿真软件/ },
  { match: [/Box Automate/i, /文档.*Agent/i, /财务流程/i], title: /企业文档与财务流程Agent/ },
  { match: [/Cognizant/i, /Astreya/i, /基础设施.*托管/i], title: /AI基础设施托管服务/ },
  { match: [/Scout AI/i, /国防无人系统/i, /无人系统任务/i], title: /无人系统任务执行智能体平台/ },
  { match: [/原粒半导体/i, /端侧推理芯片/i], title: /端侧推理芯片与软件栈/ },
  { match: [/Meta.*ARI/i, /Assured Robot Intelligence/i, /具身智能.*脑/i, /控制栈/i, /评测平台/i], title: /具身智能控制栈与评测平台/ },
];

const scoreMatchText = (row = {}, signal = {}) =>
  textFromValues(
    row.product,
    row.opportunityName,
    row.representativeCase,
    row.track,
    row.verdict,
    (signal || {}).title,
    (signal || {}).product,
    (signal || {}).summary,
    (signal || {}).newsType,
    row.taxonomy
  );

const opportunityMatchText = (opportunity = {}) =>
  textFromValues(
    opportunity.title,
    opportunity.sourceTitle,
    opportunity.industry,
    opportunity.businessFunction,
    opportunity.scenario,
    opportunity.summary,
    opportunity.problem,
    opportunity.cases,
    opportunity.suppliers,
    opportunity.tags,
    opportunity.taxonomy
  );

const ruleMatchOpportunity = (row, signal, opportunities) => {
  const text = scoreMatchText(row, signal);
  const rule = opportunityMatchRules.find((item) => {
    const hits = item.match.filter((pattern) => pattern.test(text));
    return item.match.length === 1 ? hits.length === 1 : hits.length >= 2;
  });
  if (!rule) return null;
  const opportunity = opportunities.find((item) => rule.title.test(item.title) || rule.title.test(item.sourceTitle));
  return opportunity ? { opportunity, score: 100, reason: "rule" } : null;
};

const textInclusionScore = (left = "", right = "") => {
  const a = normalize(left);
  const b = normalize(right);
  if (!a || !b) return 0;
  if (a === b) return 80;
  if (a.includes(b) || b.includes(a)) return 55;
  return 0;
};

const findOpportunityForScore = (row, signal, opportunities) => {
  const rule = ruleMatchOpportunity(row, signal, opportunities);
  if (rule) return rule;
  const scoreText = scoreMatchText(row, signal);
  const candidates = opportunities
    .map((opportunity) => {
      const opportunityText = opportunityMatchText(opportunity);
      const titleScore = Math.max(
        textInclusionScore(row.opportunityName, opportunity.title),
        textInclusionScore(row.product, opportunity.title),
        textInclusionScore(row.representativeCase, opportunityText)
      );
      const taxonomyScore = overlapScore(row.taxonomy, opportunity.taxonomy) * 12;
      const trackScore =
        row.track && (opportunity.taxonomy?.tracks || []).some((track) => normalize(track) === normalize(row.track)) ? 20 : 0;
      const textScore = sameProduct(row.opportunityName, opportunity.title) || sameProduct(row.product, opportunity.title) ? 35 : 0;
      const total = titleScore + taxonomyScore + trackScore + textScore;
      return {
        opportunity,
        score: total,
        reason: titleScore >= 55 ? "title" : trackScore || taxonomyScore ? "taxonomy" : "weak",
        scoreText,
        opportunityText,
      };
    })
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.score >= 42 ? candidates[0] : null;
};

const linkPriorityEngine = (data) => {
  const signalById = new Map(data.signals.map((signal) => [signal.id, signal]));
  for (const row of data.scoring.rows) {
    const signal = signalById.get(row.relatedSignalId) || null;
    const match = findOpportunityForScore(row, signal, data.opportunities);
    if (match?.opportunity) {
      row.relatedOpportunityId = match.opportunity.id;
      row.opportunityId = match.opportunity.opportunityId;
      row.opportunitySlug = match.opportunity.slug;
      row.opportunityTitle = match.opportunity.title;
      row.opportunityMatchScore = match.score;
      row.opportunityMatchReason = match.reason;
      row.opportunityMatchStatus = "matched";
    } else {
      row.relatedOpportunityId = "";
      row.opportunityId = "";
      row.opportunitySlug = "";
      row.opportunityTitle = row.opportunityName || cleanScoringOpportunityName(row.product);
      row.opportunityMatchScore = 0;
      row.opportunityMatchReason = "unmatched";
      row.opportunityMatchStatus = "needs-opportunity";
    }
  }

  for (const opportunity of data.opportunities) {
    const rows = data.scoring.rows
      .filter((row) => row.relatedOpportunityId === opportunity.id)
      .sort((a, b) => (b.total || 0) - (a.total || 0) || String(b.date || "").localeCompare(String(a.date || "")));
    opportunity.relatedScoringIds = rows.map((row) => row.id);
    opportunity.priorityRows = rows.map((row) => ({
      id: row.id,
      date: row.date,
      score: row.total,
      verdict: row.verdict,
      rank: row.rank,
      representativeCase: row.representativeCase,
    }));
    const primary = rows[0];
    opportunity.priorityScore = primary?.total || null;
    opportunity.priorityScoreDate = primary?.date || "";
    opportunity.priorityVerdict = primary?.verdict || "";
    opportunity.priorityRowId = primary?.id || "";
    opportunity.representativeCases = uniqueTerms([opportunity.cases?.["案例公司"], rows.map((row) => row.representativeCase)]).slice(0, 8);
  }

  data.opportunities
    .filter((opportunity) => opportunity.priorityScore != null)
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0) || String(b.priorityScoreDate || "").localeCompare(String(a.priorityScoreDate || "")))
    .forEach((opportunity, index) => {
      opportunity.priorityRank = index + 1;
    });

  data.relations = {
    scoringOpportunity: {
      matched: data.scoring.rows.filter((row) => row.opportunityMatchStatus === "matched").length,
      unmatched: data.scoring.rows.filter((row) => row.opportunityMatchStatus !== "matched").length,
      total: data.scoring.rows.length,
      unmatchedScoreIds: data.scoring.rows.filter((row) => row.opportunityMatchStatus !== "matched").map((row) => row.id),
      opportunitiesWithScore: data.opportunities.filter((opportunity) => opportunity.relatedScoringIds?.length).length,
      opportunitiesWithoutScore: data.opportunities.filter((opportunity) => !opportunity.relatedScoringIds?.length).length,
    },
  };
};

const avgScore = (rows = [], key) => {
  const values = rows.map((row) => Number(row[key] || 0)).filter(Boolean);
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null;
};

const latestByDate = (items = [], dateKey = "date") =>
  [...items].sort((a, b) => String(b[dateKey] || "").localeCompare(String(a[dateKey] || "")))[0] || null;

const trendStatusFrom = (trend = {}, rows = []) => {
  const text = textFromValues(trend.sevenDay, trend.thirtyDay, trend.verdict, rows.map((row) => row.verdict));
  const latest = latestByDate(rows)?.total || 0;
  if (/回避|不成立|反证增强/.test(text)) return "invalidating";
  if (/监管|合规|地缘|风险|谨慎|不确定/.test(text) && latest < 20) return "risk";
  if (/下降|降温|回落/.test(text)) return "cooling";
  if (/震荡|分化|不均衡|拥挤|红海/.test(text)) return "splitting";
  if (/新赛道|新建|启动|新出现|首次/.test(text)) return "emerging";
  if (/成熟|规模化|标配|ARR|盈利|复购/.test(text) && latest >= 24) return "mature";
  if (/上升|升温|持续|做多/.test(text)) return "rising";
  return "splitting";
};

const trendStatusLabel = (status = "") =>
  ({
    rising: "持续升温",
    splitting: "分化观察",
    cooling: "降温观察",
    emerging: "新出现",
    mature: "成熟化",
    risk: "风险变量",
    invalidating: "反证增强",
  })[status] || "观察中";

const adoptionStageFrom = (trend = {}, rows = []) => {
  const text = textFromValues(trend.verdict, trend.products, rows);
  const latest = latestByDate(rows)?.total || 0;
  if (/ARR|盈利|复购|头部客户|客户覆盖|规模/.test(text) && latest >= 24) return "主流扩散";
  if (/融资|领投|客户|Preview|预览|试点|部署/.test(text) && latest >= 20) return "先锋采用";
  if (/红海|拥挤|大厂|竞争/.test(text)) return "成熟竞争";
  if (/回避|下降|降温|反证/.test(text)) return "红海分化";
  return "早期探索";
};

const evidenceLadderFrom = (trend = {}, rows = []) => {
  const text = textFromValues(trend.verdict, trend.products, rows);
  const avgCommercial = avgScore(rows, "commercialization") || 0;
  const avgGrowth = avgScore(rows, "growth") || 0;
  return [
    { label: "概念出现", active: true },
    { label: "产品发布", active: /发布|上线|推出|Preview|预览|产品/.test(text) || rows.length > 0 },
    { label: "融资验证", active: /融资|领投|估值|并购|收购/.test(text) || (avgScore(rows, "funding") || 0) >= 4 },
    { label: "客户采用", active: /客户|部署|采用|覆盖|试点/.test(text) || (avgScore(rows, "demand") || 0) >= 4 },
    { label: "收入增长", active: /ARR|收入|营收|盈利|复购|增长/.test(text) || avgCommercial >= 4 || avgGrowth >= 4 },
    { label: "行业标配", active: /标配|主流|规模化|生态/.test(text) && avgCommercial >= 4 },
  ];
};

const temperatureFromRows = (trend = {}, rows = []) => {
  const avg = (key, fallback = null) => avgScore(rows, key) ?? fallback;
  const text = textFromValues(trend.verdict, trend.products, rows);
  const regulationPenalty = /监管|合规|地缘|安全|风险|受阻/.test(text) ? 2 : 4;
  const chinaFit = /中国|央国企|国内|本土/.test(text) ? 4 : /海外|美国|Global/.test(text) ? 3 : 3;
  return {
    funding: avg("funding", 2),
    customer: Number((((avg("demand", 2) || 2) + (avg("growth", 2) || 2)) / 2).toFixed(1)),
    product: avg("commercialization", 2),
    competitionRoom: avg("competition", 2),
    regulation: regulationPenalty,
    chinaFit,
  };
};

const counterEvidenceFrom = (trend = {}, rows = []) => {
  const text = textFromValues(trend.verdict, trend.products, rows);
  const list = [];
  if (/客户|部署|采用|ARR|盈利|收入/.test(text)) list.push("后续需要继续观察客户采用、续费或收入证据是否延续。");
  else list.push("当前仍缺客户采用和收入证据，不能只按热度判断趋势强弱。");
  if (/融资|估值|资本/.test(text)) list.push("融资只能说明资本关注，仍需等待产品交付和商业化验证。");
  if (/大厂|平台|Microsoft|Google|OpenAI|AWS|Meta/.test(text)) list.push("平台内置能力可能压缩独立产品空间。");
  if (/监管|合规|地缘|安全|受阻/.test(text)) list.push("监管、合规或地缘变量可能改变落地节奏。");
  if (/硬件|芯片|机器人|无人系统|具身/.test(text)) list.push("硬件、交付和运维周期可能拉长商业化验证。");
  return uniqueTerms(list).slice(0, 4);
};

const trendClaimFrom = (trend = {}, rows = []) => {
  const verdict = plain(trend.verdict || trend.thirtyDay || trend.sevenDay || "");
  const status = trendStatusLabel(trend.status);
  if (verdict) return verdict.replace(/^做多[。.\s]*/, "").replace(/^观察[。.\s]*/, "").replace(/^谨慎[。.\s]*/, "").replace(/^回避[。.\s]*/, "");
  const latest = latestByDate(rows);
  return latest ? `${trend.track} 当前处于${status}，最新评分 ${latest.total}/30。` : `${trend.track} 当前处于${status}。`;
};

const scoreRowsForTrend = (trend = {}, rows = []) => {
  return rows
    .filter((row) => {
      const trackHit = sameTrack(row.track, trend.track);
      const productHit = (trend.products || []).some(
        (product) =>
          sameProduct(row.product, product.product) ||
          sameProduct(row.representativeCase, product.product) ||
          sameProduct(row.opportunityName, product.product)
      );
      return trackHit || productHit;
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.total || 0) - (a.total || 0));
};

const linkTrendEngine = (data) => {
  for (const trend of data.trends) {
    const rows = scoreRowsForTrend(trend, data.scoring.rows);
    const latest = latestByDate(rows);
    const rowSignalIds = rows.map((row) => row.relatedSignalId).filter(Boolean);
    const productSignalIds = data.signals
      .filter((signal) =>
        (trend.products || []).some(
          (product) =>
            sameProduct(signal.product, product.product) ||
            sameProduct(signal.title, product.product) ||
            sameProduct(signal.score?.product, product.product) ||
            sameProduct(signal.score?.representativeCase, product.product) ||
            sameProduct(signal.score?.opportunityName, product.product)
        )
      )
      .map((signal) => signal.id);
    const trackSignalIds = data.signals
      .filter((signal) => sameTrack(signal.score?.track || signal.track, trend.track))
      .map((signal) => signal.id);
    trend.relatedSignalIds = uniqueTerms([trend.relatedSignalIds || [], rowSignalIds, productSignalIds, trackSignalIds]).slice(0, 12);
    trend.relatedScoringIds = rows.map((row) => row.id);
    trend.latestScore = latest?.total || trend.scores?.filter((item) => item.score != null).at(-1)?.score || null;
    trend.latestScoreDate = latest?.date || "";
    trend.status = trendStatusFrom(trend, rows);
    trend.statusLabel = trendStatusLabel(trend.status);
    trend.adoptionStage = adoptionStageFrom(trend, rows);
    trend.evidenceLadder = evidenceLadderFrom(trend, rows);
    trend.opportunityTemperature = temperatureFromRows(trend, rows);
    trend.counterEvidence = counterEvidenceFrom(trend, rows);
    trend.summary = trendClaimFrom(trend, rows);
    trend.topScoringRows = rows.slice(0, 5).map((row) => ({
      id: row.id,
      date: row.date,
      score: row.total,
      verdict: row.verdict,
      opportunityTitle: row.opportunityTitle,
      opportunitySlug: row.opportunitySlug,
      representativeCase: row.representativeCase,
    }));
    const scoreOpportunityIds = rows.map((row) => row.relatedOpportunityId).filter(Boolean);
    trend.relatedOpportunityIds = uniqueTerms([trend.relatedOpportunityIds || [], scoreOpportunityIds]).slice(0, 10);
  }
};

const resolvePointRelations = (data) => {
  for (const point of data.points || []) {
    const pointText = textFromValues(point.title, point.pointSummary, point.interpretation, point.commercialMeaning, point.topics);
    const providedTrendNames = new Set(point.relatedTrendIds || []);
    const inferredTrends = data.trends
      .filter((trend) => sameTrack(trend.track, pointText) || (trend.taxonomy && overlapScore(trend.taxonomy, point.taxonomy) >= 3))
      .map((trend) => trend.track);
    point.relatedTrendIds = uniqueTerms(point.relatedTrendIds?.length ? point.relatedTrendIds : inferredTrends)
      .filter((track) => data.trends.some((trend) => trend.track === track))
      .slice(0, 4);
    const inferredSignals = data.signals
      .filter((signal) => point.relatedTrendIds.some((track) => sameTrack(signal.track || signal.score?.track, track)) || overlapScore(signal.taxonomy, point.taxonomy) >= 3)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 4)
      .map((signal) => signal.id);
    point.relatedSignalIds = uniqueTerms(point.relatedSignalIds?.length ? point.relatedSignalIds : inferredSignals)
      .filter((id) => data.signals.some((signal) => signal.id === id))
      .slice(0, 5);
    const inferredOpportunities = data.opportunities
      .filter((opportunity) => sameProduct(pointText, opportunity.title) || overlapScore(opportunity.taxonomy, point.taxonomy) >= 3)
      .slice(0, 4)
      .map((opportunity) => opportunity.id);
    point.relatedOpportunityIds = uniqueTerms(point.relatedOpportunityIds?.length ? point.relatedOpportunityIds : inferredOpportunities)
      .filter((id) => data.opportunities.some((opportunity) => opportunity.id === id))
      .slice(0, 5);
  }
};

const buildPointTopics = (points = []) => {
  const latestDate = points.map((point) => point.date).filter(Boolean).sort().at(-1) || "";
  const latestTime = latestDate ? new Date(`${latestDate}T00:00:00Z`).getTime() : Date.now();
  const daysBetween = (date) => {
    const value = new Date(`${date}T00:00:00Z`).getTime();
    return Number.isFinite(value) ? Math.max(0, Math.round((latestTime - value) / 86400000)) : 999;
  };
  const map = new Map();
  for (const point of points) {
    for (const topic of point.topics || []) {
      const key = slugify(topic, "topic");
      if (!map.has(key)) {
        map.set(key, {
          topic_id: key,
          name: topic,
          heat_7d: 0,
          heat_30d: 0,
          pointCount: 0,
          topPoints: [],
          relatedTrends: new Set(),
        });
      }
      const item = map.get(key);
      const age = daysBetween(point.date);
      const score = Math.max(1, Math.round((point.pointScore || 50) / 10));
      item.pointCount += 1;
      if (age <= 7) item.heat_7d += score;
      if (age <= 30) item.heat_30d += score;
      item.topPoints.push({ id: point.id, title: point.title, date: point.date, score: point.pointScore || 0 });
      for (const track of point.relatedTrendIds || []) item.relatedTrends.add(track);
    }
  }
  return [...map.values()]
    .map((item) => ({
      ...item,
      momentum: item.heat_7d >= Math.max(6, item.heat_30d * 0.45) ? "rising" : "stable",
      topPoints: item.topPoints.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5),
      relatedTrends: [...item.relatedTrends].slice(0, 8),
    }))
    .sort((a, b) => (b.heat_7d || 0) - (a.heat_7d || 0) || (b.heat_30d || 0) - (a.heat_30d || 0));
};

const enrichTaxonomy = (data) => {
  const signalScoreForRow = (row, signal) => {
    const productHit =
      sameProduct(row.product, signal.product) ||
      sameProduct(row.product, signal.title) ||
      sameProduct(row.representativeCase, signal.product) ||
      sameProduct(row.representativeCase, signal.title) ||
      sameProduct(row.opportunityName, signal.title);
    if (!productHit) return 0;
    const rowTime = new Date(`${row.date}T00:00:00Z`).getTime();
    const signalTime = new Date(`${signal.date}T00:00:00Z`).getTime();
    const dayDistance = Number.isFinite(rowTime) && Number.isFinite(signalTime) ? Math.abs(rowTime - signalTime) / 86400000 : 99;
    const sameDateBonus = row.date === signal.date ? 10 : 0;
    const priorOrSameBonus = signal.date <= row.date ? 5 : 0;
    const trackBonus = sameTrack(row.track, signal.track) || sameTrack(row.track, signal.score?.track) ? 3 : 0;
    return 30 + sameDateBonus + priorOrSameBonus + trackBonus - dayDistance;
  };

  const findSignalForScore = (row) =>
    data.signals
      .map((signal) => ({ signal, score: signalScoreForRow(row, signal) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || String(b.signal.date || "").localeCompare(String(a.signal.date || "")))[0]?.signal || null;

  for (const signal of data.signals) {
    applyItemTaxonomy(signal, {
      kind: "signal",
      product: signal.product,
      track: signal.score?.track || signal.track,
      title: signal.title,
      tags: signal.tags,
      newsType: signal.newsType,
      eventTypes: signal.eventTypes,
      summary: signal.summary,
      evidence: signal.evidence,
      verdict: signal.score?.verdict,
      total: signal.score?.total,
    });
  }

  for (const row of data.scoring.rows) {
    const signal = findSignalForScore(row);
    if (!row.track && signal?.track) row.track = signal.track;
    row.relatedSignalId = signal?.id || "";
    applyItemTaxonomy(
      row,
      {
        kind: "scoring",
        product: row.representativeCase || row.product,
        scoreTrack: row.opportunityName,
        track: row.track || signal?.track,
        title: row.opportunityName || row.product,
        tags: [row.verdict],
        verdict: row.verdict,
        total: row.total,
        extra: [signal?.title, signal?.summary, signal?.newsType, signal?.evidence],
      },
      signal?.taxonomy
    );
  }

  for (const trend of data.trends) {
    const relatedSignals = data.signals.filter((signal) => sameTrack(signal.score?.track || signal.track, trend.track)).slice(0, 8);
    const taxonomy = mergeTaxonomies(
      inferTaxonomy({
        kind: "trend",
        track: trend.track,
        title: trend.track,
        verdict: trend.verdict,
        tags: [trend.sevenDay, trend.thirtyDay],
        extra: trend.products,
      }),
      ...relatedSignals.map((signal) => signal.taxonomy)
    );
    addTaxonomy(taxonomy, "products", trend.products.map((product) => product.product));
    trend.taxonomy = compactTaxonomy(taxonomy);
    trend.tags = publicTagsOnly([trend.tags || [], taxonomyTags(trend.taxonomy)]).slice(0, 28);
    trend.relatedSignalIds = relatedSignals.map((signal) => signal.id);
  }

  for (const opportunity of data.opportunities) {
    applyItemTaxonomy(opportunity, {
      kind: "opportunity",
      product: opportunity.title,
      title: opportunity.title,
      tags: opportunity.tags,
      priority: opportunity.priority,
      evidenceLevel: opportunity.evidenceLevel,
      maturity: opportunity.maturity,
      industry: opportunity.industry,
      businessFunction: opportunity.businessFunction,
      scenario: opportunity.scenario,
      summary: opportunity.summary,
      problem: opportunity.problem,
      roi: opportunity.roi,
      cases: opportunity.cases,
      suppliers: opportunity.suppliers,
      actions: opportunity.actions,
    });
  }

  for (const point of data.points || []) {
    applyItemTaxonomy(point, {
      kind: "point",
      title: point.title,
      tags: point.topics,
      summary: point.pointSummary,
      verdict: point.interpretation,
      extra: [point.person, point.source, point.commercialMeaning, point.boundary],
    });
  }

  linkPriorityEngine(data);

  for (const signal of data.signals) {
    const scoreOpportunityIds = signal.score?.relatedOpportunityId ? [signal.score.relatedOpportunityId] : [];
    const explicitOpportunityIds = matchOpportunityIdsByName(signal.relatedOpportunityNames || [], data.opportunities);
    signal.relatedOpportunityIds = uniqueTerms(scoreOpportunityIds.length ? scoreOpportunityIds : explicitOpportunityIds).slice(0, 1);
  }

  for (const opportunity of data.opportunities) {
    const scoringSignalIds = data.scoring.rows
      .filter((row) => row.relatedOpportunityId === opportunity.id)
      .map((row) => row.relatedSignalId)
      .filter(Boolean);
    const explicitSignalIds = data.signals
      .filter((signal) => (signal.relatedOpportunityIds || []).includes(opportunity.id))
      .map((signal) => signal.id);
    opportunity.relatedSignalIds = uniqueTerms([scoringSignalIds, explicitSignalIds]).slice(0, 8);
    opportunity.relatedTrendTracks = data.trends
      .map((trend) => ({ trend, score: overlapScore(opportunity.taxonomy, trend.taxonomy) }))
      .filter((item) => item.score >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.trend.track);
  }

  for (const trend of data.trends) {
    trend.relatedOpportunityIds = data.opportunities
      .map((opportunity) => ({ opportunity, score: overlapScore(trend.taxonomy, opportunity.taxonomy) }))
      .filter((item) => item.score >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.opportunity.id);
  }

  linkTrendEngine(data);
  resolvePointRelations(data);
  data.pointTopics = buildPointTopics(data.points || []);
};

const data = {
  generatedAt: new Date().toISOString(),
  signals: parseSignals(),
  scoring: parseScoring(),
  trends: parseTrends(),
  points: parsePoints(),
  pointSources: parsePointSources(),
  pointTopics: [],
  opportunities: parseOpportunities(),
};

for (const row of data.scoring.rows) {
  if (row.track) continue;
  const signal = data.signals.find((item) => item.date === row.date && (sameProduct(row.product, item.product) || sameProduct(row.product, item.title)));
  if (signal?.track) row.track = signal.track;
}

for (const signal of data.signals) {
  const signalKey = normalize(signal.product + signal.title);
  const matchesSignal = (row) =>
    sameProduct(row.product, signal.product) ||
    sameProduct(row.product, signal.title) ||
    sameProduct(row.representativeCase, signal.product) ||
    sameProduct(row.representativeCase, signal.title) ||
    signalKey.includes(normalize(row.product)) ||
    (row.representativeCase && signalKey.includes(normalize(row.representativeCase))) ||
    normalize(row.product).includes(normalize(signal.product));
  signal.score =
    data.scoring.rows.find((row) => row.date === signal.date && matchesSignal(row)) ||
    data.scoring.rows.find((row) => matchesSignal(row)) ||
    null;
  signal.scoringDetail = signal.score ? data.scoring.details[`${signal.score.date}::${signal.score.product}`] || data.scoring.details[signal.score.product] || null : null;
  signal.trend = data.trends.find((trend) => normalize(trend.track) === normalize(signal.score?.track || signal.track)) || null;
}

enrichTaxonomy(data);

fs.mkdirSync(outDir, { recursive: true });
const payload = JSON.stringify(data, null, 2);
fs.writeFileSync(path.join(outDir, "radar-data.js"), `window.AI_RADAR_DATA = ${payload};\n`, "utf8");
fs.writeFileSync(path.join(outDir, "radar-data.json"), `${payload}\n`, "utf8");

console.log(
  `Synced ${data.signals.length} signals, ${data.scoring.rows.length} score rows, ${data.trends.length} trends, ${data.points.length} points, ${data.pointSources.length} point sources, ${data.opportunities.length} opportunities.`
);
