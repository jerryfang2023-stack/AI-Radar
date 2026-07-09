#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];
  const rows = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(file, predicate));
    else if (predicate(file)) rows.push(file);
  }
  return rows;
}

function frontmatter(text = "") {
  return text.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
}

function field(text = "", name) {
  const raw = frontmatter(text);
  return raw.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
}

function nestedField(text = "", name) {
  const raw = frontmatter(text);
  return raw.match(new RegExp(`^\\s+${name}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
}

function bodyValue(text = "", label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp(`^[-*]?\\s*${escaped}\\s*[：:]\\s*(.+)$`, "imu"))?.[1]?.trim() || "";
}

function arrayField(text = "", name) {
  const raw = field(text, name);
  const inline = raw.match(/^\[(.*)\]$/u)?.[1];
  if (inline !== undefined) {
    return inline.split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  const block = frontmatter(text).match(new RegExp(`^${name}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "mu"))?.[1] || "";
  return block.split(/\r?\n/u).map((line) => line.replace(/^\s+-\s+/u, "").trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

function normalize(value = "") {
  const raw = String(value || "").trim();
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./u, "").toLowerCase();
    const dockey = /(^|\.)markets\.ft\.com$/iu.test(host) ? url.searchParams.get("dockey") : "";
    return `${host} ${url.pathname}${dockey ? ` dockey ${dockey}` : ""}`
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, " ")
      .trim()
      .replace(/\s+/gu, " ");
  } catch {
    // Non-URL values are normalized as text below.
  }
  return raw
    .toLowerCase()
    .replace(/https?:\/\/(www\.)?/u, "")
    .replace(/[?#].*$/u, "")
    .replace(/\/+$/u, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, " ")
    .trim()
    .replace(/\s+/gu, " ");
}

const monthNames = new Map([
  ["january", 0],
  ["february", 1],
  ["march", 2],
  ["april", 3],
  ["may", 4],
  ["june", 5],
  ["july", 6],
  ["august", 7],
  ["september", 8],
  ["october", 9],
  ["november", 10],
  ["december", 11],
]);

function parsePublicationDate(value = "") {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateFromUrl(value = "") {
  const match = String(value || "").match(/\/(20\d{2})\/(0?\d{1,2})\/(0?\d{1,2})(?:\/|$)/u);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function dateFromText(value = "") {
  const match = String(value || "").slice(0, 2000).match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})\b/iu);
  if (!match) return null;
  const month = monthNames.get(match[1].toLowerCase());
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
}

function rawPublicationDate(rawJsonRel = "", sourceUrl = "") {
  if (rawJsonRel) {
    const rawJson = path.join(root, rawJsonRel);
    if (exists(rawJson)) {
      try {
        const data = JSON.parse(fs.readFileSync(rawJson, "utf8"));
        return parsePublicationDate(data.published_at)
          || dateFromUrl(data.canonical_url || data.original_url || sourceUrl)
          || dateFromText(data.full_text || data.clean_text || "");
      } catch {
        // Fall through to URL-only parsing.
      }
    }
  }
  return dateFromUrl(sourceUrl);
}

function isStaleSource(rawJsonRel = "", sourceUrl = "", maxAgeDays = 14) {
  const published = rawPublicationDate(rawJsonRel, sourceUrl);
  if (!published) return false;
  const runDate = new Date(`${date}T12:00:00Z`);
  return runDate.getTime() - published.getTime() > maxAgeDays * 24 * 60 * 60 * 1000;
}

function pushKey(map, key, card) {
  if (!key || /^(no-url|unknown|none|null)$/iu.test(key)) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(card);
}

const signalDir = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards");
const cardFiles = listFiles(signalDir, (file) => path.basename(file).startsWith(`${date}--signal--`) && file.endsWith(".md"));
const cards = cardFiles.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const rawRefs = arrayField(text, "raw_refs");
  const poolRefs = arrayField(text, "pool_refs");
  const sourceUrl = nestedField(text, "source_url") || field(text, "canonical_url");
  const rawJson = nestedField(text, "raw_json");
  const fullTextHash = nestedField(text, "full_text_hash");
  const owner = field(text, "signal_owner");
  const title = field(text, "title");
  const signalType = field(text, "signal_type");
  const eventLine = field(text, "event_line") || bodyValue(text, "eventLine") || bodyValue(text, "事件");
  const publishedAt = field(text, "published_at") || nestedField(text, "published_at") || date;
  return {
    file,
    id: field(text, "id") || path.basename(file, ".md"),
    title,
    owner,
    signalType,
    rawRefs,
    poolRefs,
    sourceUrl,
    rawJson,
    fullTextHash,
    eventLine,
    publishedAt,
  };
});

const keyMaps = {
  signal_id: new Map(),
  raw_ref: new Map(),
  pool_ref: new Map(),
  source_url: new Map(),
  full_text_hash: new Map(),
  fact_fingerprint: new Map(),
};

for (const card of cards) {
  pushKey(keyMaps.signal_id, card.id, card);
  for (const rawRef of card.rawRefs) pushKey(keyMaps.raw_ref, rawRef, card);
  for (const poolRef of card.poolRefs) pushKey(keyMaps.pool_ref, poolRef, card);
  pushKey(keyMaps.source_url, normalize(card.sourceUrl), card);
  pushKey(keyMaps.full_text_hash, card.fullTextHash, card);
  pushKey(keyMaps.fact_fingerprint, normalize(`${card.owner} ${card.title}`), card);
  pushKey(keyMaps.fact_fingerprint, normalize(`${card.owner} ${card.eventLine} ${card.publishedAt} ${card.title}`), card);
}

const duplicateGroups = [];
for (const [kind, map] of Object.entries(keyMaps)) {
  for (const [key, groupedCards] of map.entries()) {
    const uniqueFiles = [...new Set(groupedCards.map((card) => card.file))];
    if (uniqueFiles.length > 1) {
      duplicateGroups.push({
        kind,
        key,
        cards: groupedCards.map((card) => `${card.id} ${rel(card.file)}`),
      });
    }
  }
}

const signalIndexFile = path.join(root, "01-SiteV2", "content", "04-business-signals", "signals", `${date}-signals.md`);
if (exists(signalIndexFile)) {
  const text = fs.readFileSync(signalIndexFile, "utf8");
  const rows = text.split(/\r?\n/u)
    .map((line) => line.match(/^-\s*(SIG-[^｜|]+)[｜|](.+)$/u))
    .filter(Boolean)
    .map((match) => ({ id: match[1], row: match[0] }));
  const indexIds = new Map();
  for (const row of rows) pushKey(indexIds, row.id, row);
  for (const [id, groupedRows] of indexIds.entries()) {
    if (groupedRows.length > 1) {
      duplicateGroups.push({
        kind: "signal_index_id",
        key: id,
        cards: groupedRows.map((row) => row.row),
      });
    }
  }
  if (rows.length !== cards.length) {
    duplicateGroups.push({
      kind: "signal_index_count_mismatch",
      key: `index=${rows.length};cards=${cards.length}`,
      cards: [rel(signalIndexFile)],
    });
  }
}

for (const card of cards) {
  const maxAgeDays = card.signalType === "product_service" ? 14 : 180;
  if (isStaleSource(card.rawJson, card.sourceUrl, maxAgeDays)) {
    duplicateGroups.push({
      kind: "stale_source_date",
      key: card.sourceUrl,
      cards: [`${card.id} ${rel(card.file)}`],
    });
  }
}

const reportFile = path.join(reportsDir, `${date}-pool-to-card-dedupe-gate.md`);
fs.mkdirSync(reportsDir, { recursive: true });
const report = [
  `# ${date} Pool-to-Card Dedupe Gate`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- status: ${duplicateGroups.length ? "blocked" : "passed"}`,
  `- signal_card_count: ${cards.length}`,
  `- duplicate_group_count: ${duplicateGroups.length}`,
  "",
  "## Duplicate Groups",
  "",
  duplicateGroups.length
    ? duplicateGroups.map((group) => [
        `### ${group.kind}: ${group.key}`,
        "",
        ...group.cards.map((card) => `- ${card}`),
      ].join("\n")).join("\n\n")
    : "- none",
  "",
].join("\n");

fs.writeFileSync(reportFile, report, "utf8");

console.log(JSON.stringify({
  ok: duplicateGroups.length === 0,
  date,
  report: rel(reportFile),
  signal_card_count: cards.length,
  duplicate_group_count: duplicateGroups.length,
  duplicate_groups: duplicateGroups,
}, null, 2));

if (duplicateGroups.length) process.exit(2);
