#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const cardRoot = path.join(root, "01-SiteV2/knowledge/01-Signal-Cards");
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const outputJson = path.join(dataRoot, "legacy-card-event-mappings.json");
const outputMd = path.join(dataRoot, "legacy-card-event-mappings.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function normalize(value) {
  return String(value ?? "").replace(/^['"]|['"]$/gu, "").trim();
}

function normalizeUrl(value) {
  const text = normalize(value);
  if (!text) return "";
  try {
    const url = new URL(text);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase().replace(/^www\./u, "");
    url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
    return url.toString().replace(/\/$/u, "");
  } catch {
    return text.replace(/#.*$/u, "").replace(/\/$/u, "");
  }
}

function relative(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(file, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [file] : [];
  }).sort();
}

function frontmatter(text) {
  return text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
}

function scalar(block, key) {
  return normalize(block.match(new RegExp(`^${key}:\\s*(.+)$`, "mu"))?.[1] || "");
}

function values(block, key) {
  return [...block.matchAll(new RegExp(`^\\s*${key}:\\s*(.+)$`, "gmu"))].map((match) => normalize(match[1])).filter(Boolean);
}

function arrayValues(block, key) {
  const raw = block.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "mu"))?.[1] || "";
  return raw.split(",").map(normalize).filter(Boolean);
}

function addIndex(map, key, value) {
  if (!key || !value) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function dates() {
  if (!fs.existsSync(dataRoot)) return [];
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name).sort();
}

export function buildLegacyCardEventMappings() {
  const rawByPath = new Map();
  const rawByLegacyId = new Map();
  const rawByDatedUrl = new Map();
  const rawByUrl = new Map();
  const eventIds = new Set();
  const eventsByRaw = new Map();
  let generatedAt = "";

  for (const date of dates()) {
    const dir = path.join(dataRoot, date);
    const manifest = readJson(path.join(dir, "manifest.json"));
    generatedAt = manifest.generated_at || generatedAt;
    const raws = readJson(path.join(dir, "raw-documents.json"));
    const mappings = readJson(path.join(dir, "legacy-asset-mappings.json"));
    const events = readJson(path.join(dir, "canonical-events.json"));
    const rawIndex = new Map(raws.map((raw) => [raw.raw_id, raw]));
    for (const event of events) eventIds.add(event.event_id);
    for (const mapping of mappings) {
      const rawId = normalize(mapping.raw_id);
      const legacyPath = normalize(mapping.legacy_path).replace(/\\/gu, "/");
      addIndex(rawByPath, legacyPath, rawId);
      addIndex(rawByLegacyId, `${date}::${normalize(mapping.legacy_raw_id)}`, rawId);
      if (mapping.event_id) addIndex(eventsByRaw, rawId, mapping.event_id);
      const raw = rawIndex.get(rawId);
      for (const value of [raw?.source_url, raw?.canonical_url]) {
        const url = normalizeUrl(value);
        addIndex(rawByDatedUrl, `${date}::${url}`, rawId);
        addIndex(rawByUrl, url, rawId);
      }
    }
  }

  const cardFiles = listFiles(cardRoot, ".md").filter((file) => path.basename(file).toLowerCase() !== "readme.md");
  const idCounts = new Map();
  const parsedCards = cardFiles.map((file) => {
    const fm = frontmatter(fs.readFileSync(file, "utf8"));
    const legacyCardId = scalar(fm, "id") || scalar(fm, "card_id");
    idCounts.set(legacyCardId, (idCounts.get(legacyCardId) || 0) + 1);
    return { file, fm, legacyCardId };
  });

  const mappings = parsedCards.map(({ file, fm, legacyCardId }) => {
    const legacyPath = relative(file);
    const cardDate = scalar(fm, "date") || path.basename(file).match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
    const rawPaths = [...new Set([...values(fm, "raw_json"), ...values(fm, "raw_archive").map((value) => value.replace(/\.md$/iu, ".json"))])]
      .map((value) => value.replace(/\\/gu, "/"));
    const legacyRawIds = [...new Set([...arrayValues(fm, "raw_refs"), ...values(fm, "raw_ref")])];
    const sourceUrls = [...new Set(values(fm, "source_url").map(normalizeUrl).filter(Boolean))];
    const matchedRawIds = new Set();
    const methods = new Set();

    for (const rawPath of rawPaths) {
      for (const rawId of rawByPath.get(rawPath) || []) matchedRawIds.add(rawId);
      if (rawByPath.has(rawPath)) methods.add("legacy_path");
    }
    for (const rawRef of legacyRawIds) {
      for (const rawId of rawByLegacyId.get(`${cardDate}::${rawRef}`) || []) matchedRawIds.add(rawId);
      if (rawByLegacyId.has(`${cardDate}::${rawRef}`)) methods.add("legacy_raw_id");
    }
    for (const url of sourceUrls) {
      const dated = rawByDatedUrl.get(`${cardDate}::${url}`);
      const matches = dated?.size ? dated : rawByUrl.get(url);
      for (const rawId of matches || []) matchedRawIds.add(rawId);
      if (matches?.size) methods.add("source_url");
    }

    const mappedEventIds = new Set();
    for (const rawId of matchedRawIds) for (const eventId of eventsByRaw.get(rawId) || []) mappedEventIds.add(eventId);
    const eventList = [...mappedEventIds].sort();
    const rawList = [...matchedRawIds].sort();
    const mappingStatus = eventList.length === 1 ? "mapped" : eventList.length > 1 ? "ambiguous" : rawList.length ? "raw_only" : "unresolved";
    return {
      card_instance_id: `LC-${crypto.createHash("sha256").update(legacyPath).digest("hex").slice(0, 16)}`,
      legacy_card_id: legacyCardId,
      legacy_path: legacyPath,
      card_date: cardDate,
      card_type: scalar(fm, "signal_type") || scalar(fm, "type") || path.basename(path.dirname(file)),
      source_urls: sourceUrls,
      legacy_raw_ids: legacyRawIds,
      raw_ids: rawList,
      event_ids: eventList,
      mapping_status: mappingStatus,
      mapping_methods: [...methods].sort(),
      duplicate_legacy_id: (idCounts.get(legacyCardId) || 0) > 1
    };
  });

  const statusCounts = Object.fromEntries(["mapped", "ambiguous", "raw_only", "unresolved"].map((status) => [status, mappings.filter((item) => item.mapping_status === status).length]));
  const duplicateLegacyIds = [...idCounts.entries()].filter(([id, count]) => id && count > 1).map(([id, count]) => ({ legacy_card_id: id, instances: count }));
  const failures = [];
  if (new Set(mappings.map((item) => item.card_instance_id)).size !== mappings.length) failures.push("card_instance_id is not unique");
  for (const item of mappings) {
    for (const eventId of item.event_ids) if (!eventIds.has(eventId)) failures.push(`${item.card_instance_id}: event ${eventId} does not resolve`);
    if (!fs.existsSync(path.join(root, item.legacy_path.replace(/\//gu, path.sep)))) failures.push(`${item.card_instance_id}: legacy_path does not exist`);
  }

  return {
    schema_version: "LEGACY-CARD-EVENT-MAP-V1.0",
    generated_at: generatedAt,
    summary: {
      card_instances: mappings.length,
      logical_card_ids: idCounts.size,
      duplicate_legacy_ids: duplicateLegacyIds.length,
      ...statusCounts
    },
    duplicate_legacy_ids: duplicateLegacyIds,
    failures,
    mappings
  };
}

function markdown(result) {
  const s = result.summary;
  return [
    "# Legacy Signal Card → V4 Canonical Event Mapping",
    "",
    "> 旧 Signal Card 是兼容资产，不等于 V4 CanonicalEvent。一个 Card 可能没有正式事件，也可能因旧聚合逻辑对应多个事件；以本表的 `mapping_status` 为准。",
    "",
    `- schema: \`${result.schema_version}\``,
    `- card instances: ${s.card_instances}`,
    `- logical card ids: ${s.logical_card_ids}`,
    `- duplicate legacy ids: ${s.duplicate_legacy_ids}`,
    `- mapped to one event: ${s.mapped}`,
    `- ambiguous (multiple events): ${s.ambiguous}`,
    `- Raw found, no canonical event: ${s.raw_only}`,
    `- unresolved: ${s.unresolved}`,
    "",
    "## Status semantics",
    "",
    "| status | meaning |",
    "|---|---|",
    "| `mapped` | 该旧 Card 的来源可解析到一个 V4 商业事件。 |",
    "| `ambiguous` | 旧 Card 的聚合证据可解析到多个 V4 事件，不能视为同一个事件。 |",
    "| `raw_only` | 原始材料已纳入 V4，但未形成符合 V4 事实合同的商业事件。 |",
    "| `unresolved` | 当前无法可靠解析旧 Card 的原始材料。 |",
    "",
    "完整逐条映射见 [[legacy-card-event-mappings.json]]。",
    ""
  ].join("\n");
}

function main() {
  const result = buildLegacyCardEventMappings();
  fs.writeFileSync(outputJson, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(outputMd, markdown(result), "utf8");
  console.log(JSON.stringify({ output: relative(outputJson), summary: result.summary, failures: result.failures }, null, 2));
  if (result.failures.length) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main();
