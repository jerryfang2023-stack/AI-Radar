#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
const fdeRoot = path.join(root, "01-SiteV2", "content", "09-fde");
const signalCardsRoot = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards");
const enterpriseAiLensVersion = "EAI-V1.2.0-raw-card-ingestion-boundary";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const dryRun = args.get("dry-run") === "true";

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(file, text) {
  ensure(path.dirname(file));
  if (!dryRun) fs.writeFileSync(file, `${String(text).trimEnd()}\n`, "utf8");
}

function walkFiles(dir, matcher = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(file, matcher));
    else if (matcher(file)) out.push(file);
  }
  return out;
}

function normalizeUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.replace(/^www\./iu, "");
    return url.toString().replace(/\/$/u, "");
  } catch {
    return String(value || "").trim().replace(/\/$/u, "");
  }
}

function frontmatterValue(text = "", key = "") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.+)$`, "mu"));
  if (!match) return "";
  return match[1].trim().replace(/^"|"$/gu, "");
}

function yamlQuote(value = "") {
  return JSON.stringify(String(value || ""));
}

function mdLink(fromFile, targetFile, label) {
  if (!targetFile) return "";
  const relative = path.relative(path.dirname(fromFile), targetFile).replace(/\\/gu, "/");
  return `[${label}](${relative})`;
}

function rawArchiveIndex(date) {
  const rawDir = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
  const files = walkFiles(rawDir, (file) => file.endsWith(".md"));
  const byUrl = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const urls = [
      frontmatterValue(text, "original_url"),
      frontmatterValue(text, "canonical_url"),
    ].filter(Boolean);
    for (const url of urls) {
      const key = normalizeUrl(url);
      if (!byUrl.has(key)) byUrl.set(key, file);
    }
  }
  return byUrl;
}

function signalCardIndex(date) {
  const files = walkFiles(
    signalCardsRoot,
    (file) => file.endsWith(".md") && path.basename(file).startsWith(`${date}--`)
  );
  const byId = new Map();
  const byPoolRef = new Map();
  const byUrl = new Map();
  for (const file of files.sort()) {
    const text = fs.readFileSync(file, "utf8");
    const id = frontmatterValue(text, "id");
    if (id && !byId.has(id)) byId.set(id, file);
    const sourceUrl = frontmatterValue(text, "source_url");
    if (sourceUrl) {
      const urlKey = normalizeUrl(sourceUrl);
      if (!byUrl.has(urlKey)) byUrl.set(urlKey, file);
    }
    const poolMatch = text.match(/^pool_refs:\s*\[(.*?)\]/mu);
    if (poolMatch) {
      const refs = [...poolMatch[1].matchAll(/"([^"]+)"/gu)].map((item) => item[1]);
      for (const ref of refs) {
        if (!byPoolRef.has(ref)) byPoolRef.set(ref, file);
      }
    }
  }
  return { byId, byPoolRef, byUrl };
}

function detailMap(payload) {
  const map = new Map();
  for (const item of payload.cards || []) {
    if (item.id) map.set(item.id, item);
  }
  for (const item of [...(payload.enterpriseAiFdePool || []), ...(payload.enterpriseAiLensCandidates || [])]) {
    if (item.id) map.set(item.id, item);
    if (item.linkedCardId) map.set(item.linkedCardId, item);
    if (item.cardId) map.set(item.cardId, item);
  }
  return map;
}

function compactText(value = "", limit = 420) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

function compact(value = "", limit = 420) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

function cleanSourceTitle(value = "", fallback = "") {
  const title = String(value || "").replace(/\s+/gu, " ").trim();
  if (!title || /^Skip to content\b|^Loading\b|^Topics?\b/iu.test(title)) return fallback;
  return title;
}

function compactSafe(value = "", limit = 420) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 3))}...`;
}

function repairFdeSyncCopy(text = "") {
  return String(text || "")
    .replace(/^.*Business Signals.*Obsidian.*$/mu, "本页是 Business Signals「企业 AI / FDE」二级镜头的 Obsidian 索引。原文不复制到本页，保留在 Raw 原文快照中；本页负责把前台条目、原文快照、JSON 快照和正式 Signal Card 串起来。")
    .replace(/^.*Business Signals.*Signal Card.*FDE.*Card.*$/mu, "这个目录保存 Business Signals「企业 AI / FDE」二级镜头的 Obsidian 入口。正式 product / funding / case Signal Card 仍保存在 `01-SiteV2/knowledge/01-Signal-Cards/`；FDE 镜头只做实施、部署、客户嵌入和工作流证据的聚合视图，不新增第四类 Card。")
    .replace(/Raw 鍘熸枃蹇収/gu, "Raw 原文快照")
    .replace(/缂哄け Raw 鍘熸枃蹇収/gu, "缺失 Raw 原文快照")
    .replace(/lens-only锛屾湭鐢熸垚姝ｅ紡 Signal Card/gu, "lens-only，未生成正式 Signal Card");
}

const payload = readJson(siteDataFile);
const date = args.get("date") || payload.meta?.activeDate;
if (!date) {
  console.error("Missing --date and payload.meta.activeDate.");
  process.exit(1);
}

const details = detailMap(payload);
const rawByUrl = rawArchiveIndex(date);
const signalCards = signalCardIndex(date);
const items = (payload.enterpriseAiTransformation || []).filter((item) => {
  const itemDate = item.date || payload.meta?.activeDate;
  return itemDate === date;
});

const dailyFile = path.join(fdeRoot, "daily", `${date} Enterprise AI FDE.md`);
const indexFile = path.join(fdeRoot, "Enterprise AI FDE Index.md");
const missingRaw = [];

const enriched = items.map((item) => {
  const detail = details.get(item.cardId) || {};
  const sourceUrl = item.sourceUrl || detail.sourceUrl || (detail.sourceLinks || [])[0] || "";
  const sourceRef = detail.sourceRef || "";
  const rawFile = rawByUrl.get(normalizeUrl(sourceUrl)) || "";
  const signalCard =
    signalCards.byPoolRef.get(sourceRef) ||
    signalCards.byUrl.get(normalizeUrl(sourceUrl)) ||
    signalCards.byId.get(item.cardId) ||
    "";
  if (!rawFile) missingRaw.push(`${item.cardId || "unknown"} ${sourceUrl}`);
  return {
    ...item,
    detail,
    sourceUrl,
    sourceRef,
    sourceTitle: cleanSourceTitle(detail.sourceTitle || detail.originalTitle, item.title || detail.title || ""),
    rawFile,
    rawJson: rawFile ? rawFile.replace(/\.md$/u, ".json") : "",
    signalCard,
  };
});

const dailyBody = [
  "---",
  "type: enterprise_ai_fde_daily",
  `date: ${date}`,
  `enterprise_ai_lens_version: ${enterpriseAiLensVersion}`,
  "status: synced",
  `source: ${yamlQuote("01-SiteV2/site/data/v3-data-observation-desk.json")}`,
  `item_count: ${enriched.length}`,
  "---",
  "",
  `# ${date} Enterprise AI / FDE`,
  "",
  "本页是 Business Signals「企业 AI 化」二级镜头的 Obsidian 索引。原文不复制到本页，保留在 Raw 原文快照中；本页负责把前台条目、原文快照、JSON 快照和正式 Signal Card 串起来。",
  "",
  ...enriched.map((item, index) => {
    const rawLink = item.rawFile ? mdLink(dailyFile, item.rawFile, "Raw 原文快照") : "缺失 Raw 原文快照";
    const rawJsonLink = item.rawJson && fs.existsSync(item.rawJson) ? mdLink(dailyFile, item.rawJson, "Raw JSON") : "";
    const cardLink = item.signalCard ? mdLink(dailyFile, item.signalCard, "Signal Card") : "lens-only，未生成正式 Signal Card";
    return [
      `## ${index + 1}. ${item.title}`,
      "",
      `- card_id: \`${item.cardId || ""}\``,
      `- subject: ${item.subject || item.detail.subject || ""}`,
      `- source_title: ${item.sourceTitle}`,
      `- source_url: ${item.sourceUrl}`,
      `- source_ref: ${item.sourceRef || "n/a"}`,
      `- title_translation_status: ${item.detail.titleTranslationStatus || item.detail.title_translation_status || "not_recorded"}`,
      `- title_translation_method: ${item.detail.titleTranslationMethod || item.detail.title_translation_method || "not_recorded"}`,
      `- fact_extraction_status: ${item.detail.factExtractionStatus || item.detail.fact_extraction_status || "not_recorded"}`,
      `- fact_extraction_method: ${item.detail.factExtractionMethod || item.detail.fact_extraction_method || "not_recorded"}`,
      `- raw_archive: ${rawLink}${rawJsonLink ? ` / ${rawJsonLink}` : ""}`,
      `- signal_card: ${cardLink}`,
      `- stage: ${item.stageLabel || item.stage || ""}`,
      `- scenario: ${item.scenario || ""}`,
      `- workflow: ${item.workflow || ""}`,
      `- demand: ${compactSafe(item.implementationAnalysis?.demand || "")}`,
      `- services: ${compactSafe(item.implementationAnalysis?.services || "")}`,
      `- result: ${compactSafe(item.implementationAnalysis?.result || "")}`,
      `- source_basis: ${compactSafe(item.implementationAnalysis?.sourceBasis || "")}`,
      `- evidence_boundary: ${compactSafe(item.evidenceBoundary || "")}`,
      "",
    ].join("\n");
  }),
  "",
].join("\n");

const dailyViews = fs.existsSync(path.join(fdeRoot, "daily"))
  ? fs.readdirSync(path.join(fdeRoot, "daily"))
    .filter((name) => /^\d{4}-\d{2}-\d{2} Enterprise AI FDE\.md$/u.test(name))
    .map((name) => path.join(fdeRoot, "daily", name))
  : [];
if (!dailyViews.includes(dailyFile)) dailyViews.push(dailyFile);

const indexBody = [
  "---",
  "type: enterprise_ai_fde_index",
  "status: current",
  `enterprise_ai_lens_version: ${enterpriseAiLensVersion}`,
  `updated_at: ${new Date().toISOString()}`,
  "---",
  "",
  "# Enterprise AI / FDE Index",
  "",
  "这个目录保存 Business Signals「企业 AI 化」二级镜头的 Obsidian 入口。正式 product / funding / case Signal Card 仍保存在 `01-SiteV2/knowledge/01-Signal-Cards/`；FDE 镜头只做实施、部署、客户嵌入和工作流证据的聚合视图，不新增第四类 Card。",
  "",
  "## Daily Views",
  "",
  ...dailyViews
    .sort((a, b) => path.basename(b).localeCompare(path.basename(a)))
    .map((file) => `- ${mdLink(indexFile, file, path.basename(file, ".md"))}`),
  "",
].join("\n");

writeText(dailyFile, repairFdeSyncCopy(dailyBody));
writeText(indexFile, repairFdeSyncCopy(indexBody));

console.log(JSON.stringify({
  ok: true,
  date,
  dryRun,
  items: enriched.length,
  missingRaw: missingRaw.length,
  dailyFile: rel(dailyFile),
  indexFile: rel(indexFile),
}, null, 2));
