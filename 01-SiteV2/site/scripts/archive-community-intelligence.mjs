import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(siteRoot, "..", "..");
const inputPath = path.join(siteRoot, "data", "community-intelligence.json");
const archiveRoot = path.join(projectRoot, "01-SiteV2", "content", "07-community-intelligence");

const typeConfig = {
  industry_case: {
    label: "行业案例",
    file: "Industry Cases.md",
    intro: "垂直行业、商业场景和可复用案例。",
  },
  tool_tip: {
    label: "工具技巧",
    file: "Tool Tips.md",
    intro: "AI 工具、Agent 工作流、自动化方法和提示词实践。",
  },
  opportunity: {
    label: "商业机会",
    file: "Opportunities.md",
    intro: "需求、痛点、可收费场景和潜在产品化方向。",
  },
  links: {
    label: "资料链接",
    file: "Resource Links.md",
    intro: "含飞书、文档、资料包或可进一步阅读的帖子。",
  },
};

function clean(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value = "", limit = 180) {
  const text = clean(value);
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function escapeMd(value = "") {
  return clean(value).replace(/\|/g, "\\|");
}

function slugDate(value = "") {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function displayDate(value = "") {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return clean(value) || "未知时间";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function normalize(value = "") {
  return clean(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, "")
    .slice(0, 96);
}

function itemLinks(item) {
  return Array.isArray(item.links) ? item.links : [];
}

function canonicalUrl(item, sources = {}) {
  const url = clean(item.url);
  if (!url) return "";
  const sourceUrl = sources[item.source]?.url || "";
  if (url === sourceUrl) return "";
  if (item.source === "scys" && /^https:\/\/scys\.com\/?(?:\?.*)?$/.test(url)) return "";
  if (item.source === "aipoju" && /^https:\/\/aipoju\.com\/(?:index|search)?(?:\?.*)?$/.test(url)) return "";
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function dedupeKey(item, sources = {}) {
  const url = canonicalUrl(item, sources);
  if (url) return `${item.source}:url:${url}`;
  const titleKey = normalize(item.title);
  if (titleKey.length > 12) return `${item.source}:title:${titleKey}`;
  return `${item.source}:body:${normalize([item.summary, item.evidence, item.excerpt].join(" "))}`;
}

function uniq(values = []) {
  return [...new Set(values.flat().map(clean).filter(Boolean))];
}

function valueScore(item) {
  if (Number.isFinite(Number(item.valueScore))) return Number(item.valueScore);
  const text = [
    item.title,
    item.summary,
    item.evidence,
    item.resultSignal,
    ...(item.painPoints || []),
    ...(item.reusableMethod || []),
  ].join(" ");
  let score = 18;
  score += Math.min(18, itemLinks(item).length * 7);
  score += Math.min(16, (item.tools || []).length * 4);
  score += Math.min(12, (item.painPoints || []).length * 5);
  score += Math.min(18, (item.reusableMethod || []).length * 7);
  if (item.resultSignal) score += 16;
  if (/月入|收入|营收|订单|成交|GMV|付费|复购|省下|降本|提效|增长|线索/i.test(text)) score += 14;
  if (/SOP|流程|模板|参数|清单|复盘|实操|教程|案例|方法论|开源|提示词/i.test(text)) score += 12;
  if (/求助|需求|怎么做|有没有|痛点|卡点|招募|合作|资源对接/i.test(text)) score += 8;
  if (item.insightType === "opportunity") score += 8;
  if (item.insightType === "tool_tip") score += 5;
  if (/预告一下|即将上线|待确认/.test(text) && !itemLinks(item).length && !item.resultSignal) score -= 10;
  if (clean(text).length < 80) score -= 8;
  return Math.max(0, Math.min(score, 100));
}

function mergeItems(items = [], sources = {}) {
  const groups = new Map();
  for (const item of items) {
    const key = dedupeKey(item, sources);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()].map((group) => {
    const sorted = [...group].sort((a, b) => valueScore(b) - valueScore(a) || itemLinks(b).length - itemLinks(a).length);
    const base = { ...sorted[0] };
    const linkMap = new Map();
    for (const item of group) {
      for (const link of itemLinks(item)) {
        if (link?.href) linkMap.set(link.href, link);
      }
    }
    const keywords = uniq(group.flatMap((item) => item.matchedKeywords || item.collection?.keywords || item.collection?.keyword || []));
    base.links = [...linkMap.values()];
    base.tools = uniq(group.flatMap((item) => item.tools || []));
    base.painPoints = uniq(group.flatMap((item) => item.painPoints || []));
    base.reusableMethod = uniq(group.flatMap((item) => item.reusableMethod || []));
    base.matchedKeywords = keywords;
    base.duplicateCount = group.length;
    base.valueScore = Math.min(100, Math.max(...group.map(valueScore)) + Math.min(10, Math.max(0, keywords.length - 1) * 2));
    base.collection = {
      ...base.collection,
      keyword: keywords.length > 1 ? keywords.join(" / ") : (keywords[0] || base.collection?.keyword || ""),
      keywords,
    };
    return base;
  }).sort((a, b) => valueScore(b) - valueScore(a));
}

function sourceLabel(item, sources = {}) {
  return sources[item.source]?.name || item.source || "未知来源";
}

function markdownLink(label, href) {
  if (!href) return escapeMd(label);
  return `[${escapeMd(label)}](${href})`;
}

function frontMatter({ title, date, type }) {
  return [
    "---",
    `title: ${title}`,
    `date: ${date}`,
    "status: active",
    `type: ${type}`,
    "source: community-intelligence",
    "---",
    "",
  ].join("\n");
}

function itemBlock(item, index, sources = {}) {
  const originalUrl = canonicalUrl(item, sources);
  const links = itemLinks(item).slice(0, 5);
  const tags = uniq([item.scene, item.industry, ...(item.tools || []), item.monetization]).slice(0, 8);
  const reasons = [
    item.resultSignal && `结果信号：${item.resultSignal}`,
    item.reusableMethod?.length && `可复用方法：${item.reusableMethod.join(" / ")}`,
    item.painPoints?.length && `痛点：${item.painPoints.join(" / ")}`,
    links.length && `资料链接：${links.length} 个`,
  ].filter(Boolean);

  return [
    `### ${index}. ${escapeMd(item.title || "未命名帖子")}`,
    "",
    `- 来源：${escapeMd(sourceLabel(item, sources))}${item.relativeTime || item.publishedAt ? `｜${escapeMd(item.relativeTime || item.publishedAt)}` : ""}`,
    `- 分类：${escapeMd(typeConfig[item.insightType]?.label || item.insightType || "未分类")}${item.scene ? `｜${escapeMd(item.scene)}` : ""}`,
    item.collection?.keyword ? `- 命中关键词：${escapeMd(item.collection.keyword)}` : "",
    tags.length ? `- 标签：${tags.map((tag) => `#${escapeMd(tag).replace(/\s+/g, "-")}`).join(" ")}` : "",
    originalUrl ? `- 原帖：${markdownLink("打开原帖", originalUrl)}` : "",
    "",
    compact(item.summary || item.evidence || item.excerpt || "", 280),
    "",
    reasons.length ? `- 价值判断：${escapeMd(reasons.join("；"))}` : "",
    links.length ? `- 资料：${links.map((link, linkIndex) => markdownLink(`资料 ${linkIndex + 1}`, link.href)).join(" · ")}` : "",
    "",
  ].filter(Boolean).join("\n");
}

function tableRows(items, sources = {}, limit = 20) {
  return items.slice(0, limit).map((item) => {
    const originalUrl = canonicalUrl(item, sources);
    const linkCount = itemLinks(item).length;
    return `| ${escapeMd(item.title || "未命名帖子")} | ${escapeMd(sourceLabel(item, sources))} | ${escapeMd(item.scene || "未分类")} | ${linkCount} | ${originalUrl ? markdownLink("原帖", originalUrl) : ""} |`;
  }).join("\n");
}

function typeItems(items, type) {
  if (type === "links") return items.filter((item) => itemLinks(item).length > 0);
  return items.filter((item) => item.insightType === type);
}

async function writeMarkdown(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${content.trimEnd()}\n`, "utf8");
}

async function main() {
  const payload = JSON.parse(readFileSync(inputPath, "utf8"));
  const date = slugDate(payload.meta?.generatedAt);
  const generatedAt = displayDate(payload.meta?.generatedAt);
  const sources = payload.sources || {};
  const items = mergeItems(payload.items || [], sources);
  const selectedKeywords = (payload.meta?.selectedKeywords || []).map((item) => item.keyword).filter(Boolean);

  const byType = Object.fromEntries(Object.keys(typeConfig).map((type) => [type, typeItems(items, type)]));
  const topItems = items.slice(0, 12);

  const readme = [
    frontMatter({ title: "社群情报库", date, type: "community-intelligence-index" }),
    "# 社群情报库",
    "",
    "本目录用于沉淀生财有术、AI破局等社群中出现的行业案例、工具技巧、商业机会和资料链接。",
    "",
    "归档原则：",
    "",
    "- 原始抓取数据仍保留在网页数据文件中；Obsidian 只保存去重后的可读摘要和链接索引。",
    "- 每天生成一篇日报，适合回看当天社群讨论重点。",
    "- 分类索引只保留最新一次运行的高价值条目，避免知识库被低价值重复帖子淹没。",
    "- 真正值得长期跟踪的案例，再升级到正式 Signal Card 或场景候选资产。",
    "",
    "## 入口",
    "",
    "- [[Community Intelligence Index]]",
    "- [[Industry Cases]]",
    "- [[Tool Tips]]",
    "- [[Opportunities]]",
    "- [[Resource Links]]",
    "",
  ].join("\n");

  const index = [
    frontMatter({ title: "Community Intelligence Index", date, type: "community-intelligence-index" }),
    "# Community Intelligence Index｜社群情报总索引",
    "",
    `最近归档：[[${date} Community Intelligence]]`,
    "",
    "## 分类入口",
    "",
    "- [[Industry Cases]]",
    "- [[Tool Tips]]",
    "- [[Opportunities]]",
    "- [[Resource Links]]",
    "",
    "## 今日概览",
    "",
    `- 生成时间：${generatedAt}`,
    `- 去重后条目：${items.length}`,
    `- 行业案例：${byType.industry_case.length}`,
    `- 工具技巧：${byType.tool_tip.length}`,
    `- 商业机会：${byType.opportunity.length}`,
    `- 资料链接：${byType.links.length}`,
    selectedKeywords.length ? `- 本轮搜索词：${selectedKeywords.join("、")}` : "",
    "",
    "## 今日高价值条目",
    "",
    "| 标题 | 来源 | 场景 | 资料数 | 链接 |",
    "|---|---|---:|---:|---|",
    tableRows(topItems, sources, 12),
    "",
  ].filter(Boolean).join("\n");

  const daily = [
    frontMatter({ title: `${date} Community Intelligence`, date, type: "community-intelligence-daily" }),
    `# ${date} 社群情报`,
    "",
    `生成时间：${generatedAt}`,
    "",
    "## 今日统计",
    "",
    `- 去重后条目：${items.length}`,
    `- 行业案例：${byType.industry_case.length}`,
    `- 工具技巧：${byType.tool_tip.length}`,
    `- 商业机会：${byType.opportunity.length}`,
    `- 资料链接：${byType.links.length}`,
    selectedKeywords.length ? `- 本轮搜索词：${selectedKeywords.join("、")}` : "",
    "",
    "## 值得优先看的内容",
    "",
    topItems.map((item, index) => itemBlock(item, index + 1, sources)).join("\n"),
    "",
    "## 分类入口",
    "",
    "- [[Industry Cases]]",
    "- [[Tool Tips]]",
    "- [[Opportunities]]",
    "- [[Resource Links]]",
    "",
  ].filter(Boolean).join("\n");

  await writeMarkdown(path.join(archiveRoot, "README.md"), readme);
  await writeMarkdown(path.join(archiveRoot, "Community Intelligence Index.md"), index);
  await writeMarkdown(path.join(archiveRoot, "daily", `${date} Community Intelligence.md`), daily);

  for (const [type, config] of Object.entries(typeConfig)) {
    const typeNote = [
      frontMatter({ title: config.file.replace(".md", ""), date, type: `community-intelligence-${type}` }),
      `# ${config.label}`,
      "",
      config.intro,
      "",
      `最新归档：[[${date} Community Intelligence]]`,
      "",
      `## 高价值条目（${byType[type].length} 条）`,
      "",
      byType[type].slice(0, 30).map((item, index) => itemBlock(item, index + 1, sources)).join("\n"),
      "",
      "## Related",
      "",
      "- [[Community Intelligence Index]]",
    ].join("\n");
    await writeMarkdown(path.join(archiveRoot, "views", config.file), typeNote);
  }

  console.log(JSON.stringify({
    ok: true,
    archiveRoot,
    date,
    items: items.length,
    files: [
      "README.md",
      "Community Intelligence Index.md",
      `daily/${date} Community Intelligence.md`,
      ...Object.values(typeConfig).map((config) => `views/${config.file}`),
    ],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
