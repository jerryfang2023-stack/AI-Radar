import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const projectRoot = path.resolve(siteRoot, "..", "..");
const contentRoot = path.join(projectRoot, "01-SiteV2", "content");
const knowledgeRoot = path.join(projectRoot, "01-SiteV2", "knowledge");
const dataDir = path.join(siteRoot, "data");

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : fullPath;
  }));
  return nested.flat();
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

function parseFrontmatter(markdown) {
  const match = markdown.replace(/^\uFEFF/u, "").match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  const data = {};
  if (!match) return data;
  match[1].split(/\r?\n/u).forEach((line) => {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/u);
    if (!field) return;
    data[field[1]] = field[2].replace(/^["']|["']$/gu, "").trim();
  });
  return data;
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function addCount(target, key, count = 1) {
  const normalized = String(key || "").trim();
  if (!normalized) return;
  target[normalized] = (target[normalized] || 0) + count;
}

function parseCsvCounts(text, pattern) {
  const counts = {};
  for (const match of text.matchAll(pattern)) {
    match[1].split(",").map((item) => item.trim()).filter(Boolean).forEach((item) => addCount(counts, item));
  }
  return counts;
}

function frontNumber(frontmatter, key) {
  return Number(frontmatter[key]) || 0;
}

function formatDate(date) {
  return String(date || "").replaceAll("-", ".");
}

function shortDate(date) {
  return String(date || "").slice(5).replace("-", ".");
}

function normalizeAssetType(value) {
  return String(value || "unknown")
    .trim()
    .replace(/_/gu, "-")
    .toLowerCase() || "unknown";
}

function sumValues(obj = {}) {
  return Object.values(obj).reduce((total, value) => total + (Number(value) || 0), 0);
}

function dayFromFile(filePath) {
  return path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/u)?.[1] || "";
}

function ensureDay(days, date) {
  if (!date) return null;
  if (!days.has(date)) days.set(date, { date });
  return days.get(date);
}

function splitRawEntries(markdown) {
  const matches = [...markdown.matchAll(/^###\s+(R-\d+)\s*[｜|](.+)$/gmu)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return {
      ref: match[1],
      title: match[2].trim(),
      body: markdown.slice(start, end),
    };
  });
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function fieldValue(body, names) {
  for (const name of names) {
    const pattern = new RegExp(`^-\\s*${escapeRegex(name)}\\s*[：:]\\s*(.+)$`, "imu");
    const match = body.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function splitList(value) {
  return String(value || "")
    .split(/[,，、]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sourceUrl(source) {
  return String(source || "").match(/https?:\/\/[^\s`）)]+/iu)?.[0] || "";
}

function normalizeDuplicateKey(record) {
  const url = sourceUrl(record.source);
  if (url) {
    try {
      const parsed = new URL(url);
      parsed.hash = "";
      parsed.search = "";
      return parsed.toString().replace(/\/$/u, "").toLowerCase();
    } catch {
      return url.replace(/[?#].*$/u, "").replace(/\/$/u, "").toLowerCase();
    }
  }
  return record.title
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function parseRawRecords(markdown, date) {
  return splitRawEntries(markdown).map((entry) => {
    const source = fieldValue(entry.body, ["出处", "source"]);
    const channel = fieldValue(entry.body, ["采集通道", "channel"]);
    const searchPath = fieldValue(entry.body, ["搜索路径", "search_path", "分类", "category"]);
    return {
      date,
      ref: entry.ref,
      title: entry.title,
      source,
      channel,
      searchPath,
      sourceType: fieldValue(entry.body, ["来源类型", "source_type"]),
      sourceLevel: fieldValue(entry.body, ["来源等级", "source_level"]),
      publishedAt: fieldValue(entry.body, ["发布时间", "published_at", "publishedAt"]),
      rawStatus: fieldValue(entry.body, ["Raw 状态", "raw_status"]),
      poolRoutes: splitList(fieldValue(entry.body, ["Pool 分流", "pool_routes"])),
      usableFor: splitList(fieldValue(entry.body, ["可用方向", "usable_for"])),
      qcDecision: fieldValue(entry.body, ["raw_qc_decision", "Raw QC"]),
    };
  });
}

const engineDefinitions = [
  ["tavily", "Tavily"],
  ["exa", "Exa"],
  ["newsapi", "NewsAPI"],
  ["gdelt", "GDELT"],
  ["anysearch", "AnySearch"],
  ["firecrawl", "Firecrawl"],
  ["aihot", "AI HOT"],
  ["follow_builders", "Follow Builders"],
];

function detectEngines(record) {
  const text = [record.source, record.channel, record.searchPath].join(" ").toLowerCase();
  const engines = new Set();
  if (/\baihot\b|ai hot/u.test(text)) engines.add("aihot");
  if (/follow[-_\s]?builders/u.test(text)) engines.add("follow_builders");
  if (/\btavily\b/u.test(text)) engines.add("tavily");
  if (/\bexa\b/u.test(text)) engines.add("exa");
  if (/\bnewsapi\b|news api/u.test(text)) engines.add("newsapi");
  if (/\bgdelt\b|a_media_gdelt/u.test(text)) engines.add("gdelt");
  if (/\banysearch\b|any search/u.test(text)) engines.add("anysearch");
  if (/\bfirecrawl\b|fire crawl/u.test(text)) engines.add("firecrawl");
  return [...engines];
}

function parseDate(value) {
  const clean = String(value || "").replace(/^["']|["']$/gu, "").trim();
  if (!clean || /unknown|not_applicable|n\/a/i.test(clean)) return null;
  const parsed = new Date(clean);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dayEnd(date) {
  const parts = String(date || "").split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 23, 59, 59));
}

function isFresh(record) {
  const published = parseDate(record.publishedAt);
  const anchor = dayEnd(record.date);
  if (!published || !anchor) return null;
  const ageHours = (anchor.getTime() - published.getTime()) / 36e5;
  return ageHours >= -24 && ageHours <= 48;
}

function isOfficial(record) {
  record = { ...record, sourceLevel: "" };
  return record.sourceLevel.toUpperCase() === "S"
    || /official|官方/u.test(record.sourceType)
    || /official_original|\/official\//iu.test([record.source, record.searchPath].join(" "));
}

function isConvertible(record) {
  const routes = record.poolRoutes.map((route) => route.toLowerCase());
  const usable = record.usableFor.map((item) => item.toLowerCase());
  const status = record.rawStatus.toLowerCase();
  const positiveRoute = routes.some((route) => ["core_pool", "emerging_pool", "user_feedback_pool"].includes(route));
  const deadEnd = routes.length > 0 && routes.every((route) => ["index_only", "discard", "watchlist"].includes(route));
  const usableDirection = usable.some((item) => ["case", "change", "trend", "daily_observation", "briefing", "heatmap"].includes(item));
  return ["pooled", "candidate", "indexed"].includes(status)
    && !routes.includes("discard")
    && !deadEnd
    && (positiveRoute || usableDirection);
}

function rate(part, total) {
  return total ? Math.round((part / total) * 100) : null;
}

function buildEngineQuality(records) {
  const keyCounts = new Map();
  records.forEach((record) => {
    const key = normalizeDuplicateKey(record);
    if (!key) return;
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  });

  const stats = new Map(engineDefinitions.map(([id, label]) => [id, {
    id,
    label,
    total: 0,
    freshKnown: 0,
    fresh: 0,
    duplicates: 0,
    official: 0,
    convertible: 0,
  }]));

  records.forEach((record) => {
    const engines = detectEngines(record).filter((id) => stats.has(id));
    if (!engines.length) return;
    const fresh = isFresh(record);
    const duplicate = (keyCounts.get(normalizeDuplicateKey(record)) || 0) > 1;
    engines.forEach((engine) => {
      const row = stats.get(engine);
      row.total += 1;
      if (fresh !== null) row.freshKnown += 1;
      if (fresh === true) row.fresh += 1;
      if (duplicate) row.duplicates += 1;
      if (isOfficial(record)) row.official += 1;
      if (isConvertible(record)) row.convertible += 1;
    });
  });

  const rows = [...stats.values()].map((row) => ({
    ...row,
    freshnessRate: rate(row.fresh, row.freshKnown),
    duplicateRate: rate(row.duplicates, row.total),
    officialRate: rate(row.official, row.total),
    conversionRate: rate(row.convertible, row.total),
  }));

  return {
    updatedAt: new Date().toISOString(),
    sampleNote: "样本为 Raw 条目中的入口命中；同一条 Raw 可能被多个入口标记。",
    metricNote: "新鲜度按已知发布时间中 48 小时内比例计算；重复率按跨 Raw 归一化 URL / 标题计算；Raw Card 候选率按可进入 core / emerging / user_feedback 或具备卡片可用方向计算。",
    rows,
  };
}

function assetTypeFromFile(file, frontmatter, rootType) {
  if (rootType === "signal") {
    return normalizeAssetType(frontmatter.signal_type || path.basename(path.dirname(file)));
  }
  return normalizeAssetType(frontmatter.asset_type || frontmatter.signal_type || path.basename(path.dirname(file)));
}

function addAssetFieldCount(day, type, bucket, value) {
  const normalized = String(value || "unknown").trim() || "unknown";
  day[bucket] ||= {};
  day[bucket][type] ||= {};
  addCount(day[bucket][type], normalized);
}

async function collectOpinionTimelineStats() {
  const rootDir = path.join(knowledgeRoot, "02-Opinion-Timelines");
  const peopleDir = path.join(rootDir, "people");
  const timelineFiles = (await walk(peopleDir)).filter((file) => file.endsWith(".md") && path.basename(file) !== "README.md");
  const people = new Set();
  const byDate = {};
  let detailBlocks = 0;

  for (const file of timelineFiles) {
    const relative = path.relative(peopleDir, file);
    const person = relative.split(path.sep)[0];
    if (person) people.add(person);
    const markdown = await readText(file);
    const details = [...markdown.matchAll(/^#### 观点详情/gmu)].length;
    detailBlocks += details;
    for (const match of markdown.matchAll(/^###\s+(\d{4}-\d{2}-\d{2})\b/gmu)) {
      byDate[match[1]] = (byDate[match[1]] || 0) + 1;
    }
  }

  return {
    timelineFiles: timelineFiles.length,
    people: people.size,
    detailBlocks,
    byDate,
  };
}

async function collectPipelineData() {
  const days = new Map();
  const rawRecords = [];
  const rawFiles = (await walk(path.join(contentRoot, "01-raw")))
    .filter((file) => /raw-candidates\.md$/u.test(file));
  const poolFiles = (await walk(path.join(contentRoot, "02-pool")))
    .filter((file) => /pool-candidates\.md$/u.test(file));

  for (const file of rawFiles) {
    const markdown = await readText(file);
    const frontmatter = parseFrontmatter(markdown);
    const date = frontmatter.date || dayFromFile(file);
    const day = ensureDay(days, date);
    if (!day) continue;
    day.raw = frontNumber(frontmatter, "raw_count") || countMatches(markdown, /^###\s+R-\d+/gmu);
    day.rawChannels = {
      aihot: frontNumber(frontmatter, "aihot_count"),
      keyword_search: frontNumber(frontmatter, "keyword_search_count"),
      follow_builders: frontNumber(frontmatter, "follow_builders_count"),
    };
    day.aihotDiscovered = frontNumber(frontmatter, "aihot_discovered_count");
    day.externalSearch = frontmatter.external_search_activated === "true";
    rawRecords.push(...parseRawRecords(markdown, date));
  }

  for (const file of poolFiles) {
    const markdown = await readText(file);
    const frontmatter = parseFrontmatter(markdown);
    const date = frontmatter.date || dayFromFile(file);
    const day = ensureDay(days, date);
    if (!day) continue;
    day.pool = frontNumber(frontmatter, "pool_count") || countMatches(markdown, /^##\s+P-\d+/gmu);
    day.poolRoutes = parseCsvCounts(markdown, /^- pool_routes:\s*([^\r\n]+)/gmu);
    day.evidenceLevels = parseCsvCounts(markdown, /^- evidence_level:\s*([^\r\n]+)/gmu);
    day.sourceLevels = parseCsvCounts(markdown, /^- source_level:\s*([^\r\n]+)/gmu);
    day.sourceTypes = parseCsvCounts(markdown, /^- source_type:\s*([^\r\n]+)/gmu);
  }

  const assetRoots = [
    ["signal", path.join(knowledgeRoot, "01-Signal-Cards")],
    ["candidate", path.join(knowledgeRoot, "03-Asset-Candidates")],
  ];

  for (const [rootType, dir] of assetRoots) {
    const files = (await walk(dir)).filter((file) => file.endsWith(".md"));
    for (const file of files) {
      const date = dayFromFile(file);
      const day = ensureDay(days, date);
      if (!day) continue;
      const frontmatter = parseFrontmatter(await readText(file));
      const type = assetTypeFromFile(file, frontmatter, rootType);
      day.assets ||= {};
      day.assets[type] = (day.assets[type] || 0) + 1;
      addAssetFieldCount(day, type, "assetStatus", frontmatter.status);
      addAssetFieldCount(day, type, "assetLevels", frontmatter.asset_level);
      addAssetFieldCount(day, type, "assetEvidenceGates", frontmatter.evidence_gate);
      addAssetFieldCount(day, type, "assetCopyGates", frontmatter.cardcopy_gate || frontmatter.frontend_copy_gate);
    }
  }

  const opinionTimelines = await collectOpinionTimelineStats();
  for (const [date, count] of Object.entries(opinionTimelines.byDate)) {
    const day = ensureDay(days, date);
    if (!day) continue;
    day.assets ||= {};
    day.assets.opinion = (day.assets.opinion || 0) + count;
  }

  const orderedDays = [...days.values()]
    .map((day) => {
      const assets = day.assets || {};
      return {
        date: day.date,
        label: formatDate(day.date),
        shortLabel: shortDate(day.date),
        raw: day.raw || 0,
        pool: day.pool || 0,
        assets,
        cards: sumValues(assets),
        rawChannels: day.rawChannels || {},
        poolRoutes: day.poolRoutes || {},
        evidenceLevels: day.evidenceLevels || {},
        sourceLevels: day.sourceLevels || {},
        sourceTypes: day.sourceTypes || {},
        assetStatus: day.assetStatus || {},
        assetLevels: day.assetLevels || {},
        assetEvidenceGates: day.assetEvidenceGates || {},
        assetCopyGates: day.assetCopyGates || {},
      };
    })
    .filter((day) => day.raw || day.pool || day.cards)
    .sort((a, b) => b.date.localeCompare(a.date));

  const latest = orderedDays[0] || {};
  const totals = orderedDays.reduce((acc, day) => {
    acc.raw += day.raw;
    acc.pool += day.pool;
    Object.entries(day.assets || {}).forEach(([type, value]) => {
      acc.assets[type] = (acc.assets[type] || 0) + (Number(value) || 0);
    });
    return acc;
  }, { raw: 0, pool: 0, assets: {} });

  const latestRelation = await readLatestRelationIndex();
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      dateRange: orderedDays.length ? {
        start: orderedDays.at(-1).date,
        end: orderedDays[0].date,
      } : null,
      source: "01-SiteV2/content + 01-SiteV2/knowledge",
    },
    days: orderedDays.slice(0, 7),
    latest,
    totals,
    opinionTimelines: {
      timelineFiles: opinionTimelines.timelineFiles,
      people: opinionTimelines.people,
      detailBlocks: opinionTimelines.detailBlocks,
    },
    latestRelation,
    engineQuality: buildEngineQuality(rawRecords),
  };
}

async function readLatestRelationIndex() {
  const files = (await walk(path.join(knowledgeRoot, "00-MOC")))
    .filter((file) => /business-signal-relation-index\.md$/u.test(file))
    .sort((a, b) => dayFromFile(b).localeCompare(dayFromFile(a)));
  if (!files.length) return null;
  const markdown = await readText(files[0]);
  const frontmatter = parseFrontmatter(markdown);
  const mainLine = markdown.match(/## 今日(?:判断|主线)\s*([\s\S]*?)(?=\n## |\n# |$)/u)?.[1]?.trim() || "";
  const evidenceBoundary = markdown.match(/## 今日证据边界\s*([\s\S]*?)(?=\n## |\n# |$)/u)?.[1]?.trim() || "";
  return {
    date: frontmatter.date || dayFromFile(files[0]),
    mainLine: mainLine.replace(/\s+/gu, " "),
    evidenceBoundary: evidenceBoundary.replace(/\s+/gu, " "),
  };
}

const payload = await collectPipelineData();
await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "pipeline-dashboard.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
await writeFile(path.join(dataDir, "pipeline-dashboard.js"), `window.WaveSightPipelineDashboard = ${JSON.stringify(payload, null, 2)};\n`, "utf8");
console.log(`Generated ${path.relative(projectRoot, path.join(dataDir, "pipeline-dashboard.json"))}`);
