#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
const hardwareRoot = path.join(root, "01-SiteV2", "content", "10-ai-hardware");
const signalCardsRoot = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
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
  return match?.[1]?.trim().replace(/^"|"$/gu, "") || "";
}

function mdLink(fromFile, targetFile, label) {
  if (!targetFile) return "";
  return `[${label}](${path.relative(path.dirname(fromFile), targetFile).replace(/\\/gu, "/")})`;
}

function rawArchiveIndex(date) {
  const rawDir = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
  const byUrl = new Map();
  for (const file of walkFiles(rawDir, (entry) => entry.endsWith(".md"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const url of [frontmatterValue(text, "original_url"), frontmatterValue(text, "canonical_url")].filter(Boolean)) {
      const key = normalizeUrl(url);
      if (!byUrl.has(key)) byUrl.set(key, file);
    }
  }
  return byUrl;
}

function signalCardIndex(date) {
  const byId = new Map();
  const byUrl = new Map();
  for (const file of walkFiles(signalCardsRoot, (entry) => entry.endsWith(".md") && path.basename(entry).startsWith(`${date}--`))) {
    const text = fs.readFileSync(file, "utf8");
    const id = frontmatterValue(text, "id");
    if (id && !byId.has(id)) byId.set(id, file);
    const sourceUrl = frontmatterValue(text, "source_url");
    if (sourceUrl && !byUrl.has(normalizeUrl(sourceUrl))) byUrl.set(normalizeUrl(sourceUrl), file);
  }
  return { byId, byUrl };
}

function compact(value = "", limit = 420) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}

const payload = readJson(siteDataFile);
const date = args.get("date") || payload.meta?.activeDate;
if (!date) throw new Error("Missing --date and payload.meta.activeDate.");
const items = (payload.aiHardwareSignals || []).filter((item) => item.date === date);
const dailyFile = path.join(hardwareRoot, "daily", `${date} AI Hardware.md`);
const indexFile = path.join(hardwareRoot, "AI Hardware Index.md");
const rawByUrl = rawArchiveIndex(date);
const signalCards = signalCardIndex(date);
const missingRaw = [];

const enriched = items.map((item) => {
  const sourceUrl = item.sourceUrl || "";
  const rawFile = rawByUrl.get(normalizeUrl(sourceUrl)) || "";
  const signalCard = signalCards.byId.get(item.linkedCardId) || signalCards.byUrl.get(normalizeUrl(sourceUrl)) || "";
  if (!rawFile) missingRaw.push(item.id || sourceUrl);
  return { ...item, sourceUrl, rawFile, rawJson: rawFile.replace(/\.md$/u, ".json"), signalCard };
});

const dailyBody = [
  "---",
  "type: ai_hardware_daily",
  `date: ${date}`,
  "status: synced",
  "source: \"01-SiteV2/site/data/v3-data-observation-desk.json\"",
  `item_count: ${enriched.length}`,
  "---",
  "",
  `# ${date} AI Hardware`,
  "",
  "本页归档 Business Signals 的独立 AI 硬件观察镜头。它保留投资融资、场景服务和趋势创新的来源证据，不新增第四类正式 Signal Card。",
  "",
  ...enriched.map((item, index) => {
    const rawLink = item.rawFile ? mdLink(dailyFile, item.rawFile, "Raw 原文快照") : "未保留 Raw 原文快照（source-only 观察条目）";
    const rawJsonLink = item.rawJson && fs.existsSync(item.rawJson) ? mdLink(dailyFile, item.rawJson, "Raw JSON") : "";
    const cardLink = item.signalCard ? mdLink(dailyFile, item.signalCard, "Signal Card") : "lens-only，未生成正式 Signal Card";
    return [
      `## ${index + 1}. ${item.title}`,
      "",
      `- id: \`${item.id || ""}\``,
      `- linked_card_id: \`${item.linkedCardId || ""}\``,
      `- subject: ${item.subject || item.sourceName || ""}`,
      `- source_title: ${item.sourceTitle || item.originalTitle || item.title || ""}`,
      `- source_url: ${item.sourceUrl}`,
      `- source_name: ${item.sourceName || ""}`,
      `- observation_track: ${item.hardwareTrackLabel || item.hardwareTrack || "AI Hardware"}`,
      `- promotion_status: ${item.promotionStatus || "ai_hardware_lens_only"}`,
      `- fact: ${compact(item.translatedFact || item.visibleFragment || item.summary || "")}`,
      `- raw_archive: ${rawLink}${rawJsonLink ? ` / ${rawJsonLink}` : ""}`,
      `- signal_card: ${cardLink}`,
      "",
    ].join("\n");
  }),
  "",
].join("\n");

const dailyDir = path.join(hardwareRoot, "daily");
const dailyViews = fs.existsSync(dailyDir)
  ? fs.readdirSync(dailyDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2} AI Hardware\.md$/u.test(name))
    .map((name) => path.join(dailyDir, name))
  : [];
if (!dailyViews.includes(dailyFile)) dailyViews.push(dailyFile);
const indexBody = [
  "---",
  "type: ai_hardware_index",
  "status: current",
  `updated_at: ${new Date().toISOString()}`,
  "---",
  "",
  "# AI Hardware Index",
  "",
  "这个目录保存 Business Signals 的 AI 硬件独立观察镜头。正式商业信号仍限于 product / funding / case 三类 Signal Card。",
  "",
  "## Daily Views",
  "",
  ...dailyViews
    .sort((a, b) => path.basename(b).localeCompare(path.basename(a)))
    .map((file) => `- ${mdLink(indexFile, file, path.basename(file, ".md"))}`),
  "",
].join("\n");

writeText(dailyFile, dailyBody);
writeText(indexFile, indexBody);
console.log(JSON.stringify({
  ok: true,
  date,
  dryRun,
  items: enriched.length,
  missingRaw: missingRaw.length,
  dailyFile: rel(dailyFile),
  indexFile: rel(indexFile),
}, null, 2));
