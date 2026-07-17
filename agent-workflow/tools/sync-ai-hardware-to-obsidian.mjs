#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const outputRoot = path.join(root, "01-SiteV2/content/10-ai-hardware");
const args = new Map(process.argv.slice(2).map((value) => {
  const [key, ...rest] = value.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const dryRun = args.get("dry-run") === "true";
const skipIndex = args.get("skip-index") === "true";

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function read(name, date) {
  return JSON.parse(fs.readFileSync(path.join(dataRoot, date, `${name}.json`), "utf8"));
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (dryRun) return;
  const content = `${text.trimEnd()}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return;
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      fs.writeFileSync(file, content, "utf8");
      return;
    } catch (error) {
      if (!["UNKNOWN", "EBUSY", "EPERM"].includes(error.code) || attempt === 24) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
}

function shown(value) {
  return value === "" || value === null || value === undefined ? "未披露" : String(value).trim();
}

function availableDates() {
  return fs.readdirSync(dataRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name)).map((entry) => entry.name).sort();
}

const date = args.get("date") || availableDates().at(-1);
if (!date) throw new Error("Missing --date and no V4 bundle is available.");
const records = read("hardware-records", date);
const eventById = new Map(read("canonical-events", date).map((item) => [item.event_id, item]));
const sourceById = new Map(read("source-artifacts", date).map((item) => [item.source_artifact_id, item]));
const manifest = read("manifest", date);
const items = records.map((record) => ({
  record,
  event: eventById.get(record.event_id) || {},
  source: sourceById.get(record.source_refs?.[0]) || {}
}));
const dailyDir = path.join(outputRoot, "daily");
const dailyFile = path.join(dailyDir, `${date} AI Hardware.md`);
const indexFile = path.join(outputRoot, "AI Hardware Index.md");

const daily = [
  "---",
  "type: ai_hardware_daily",
  `date: ${date}`,
  "hardware_version: HARDWARE-V1.0",
  "status: current",
  `source: ${JSON.stringify(rel(path.join(dataRoot, date, "hardware-records.json")))}`,
  `item_count: ${items.length}`,
  "---",
  "",
  `# ${date} AI Hardware`,
  "",
  "> 本页直接投影自 Data Center V4 的 HardwareRecord，只记录来源支持的硬件事实。",
  "",
  `- [当日 V4 CanonicalEvent](../../11-databases/data-center-v4/${date}/canonical-events.json)`,
  "",
  ...items.flatMap(({ record, event, source }, index) => [
    `## ${index + 1}. ${event.display_title_zh || event.object || record.hardware_record_id}`,
    "",
    `- hardware_record_id: \`${record.hardware_record_id}\``,
    `- event_id: \`${record.event_id}\``,
    `- event_time: ${event.event_time || "未披露"}`,
    `- event_type: ${shown(record.hardware_event_type)}`,
    `- hardware_type: ${shown(record.component_type)}`,
    `- compute_layer: ${shown(record.compute_layer)}`,
    `- supplier: ${shown(record.supplier)}`,
    `- customer: ${shown(record.customer)}`,
    `- process_node: ${shown(record.process_node)}`,
    `- capacity: ${shown(record.capacity)} ${record.capacity_unit || ""}`.trimEnd(),
    `- site: ${shown(record.deployment_site)}`,
    `- region: ${shown(record.region)}`,
    `- contract_value: ${shown(record.contract_value)}`,
    `- shipment_date: ${shown(record.shipment_date)}`,
    `- source: ${source.canonical_url || source.source_url ? `[${source.publisher || source.canonical_url || source.source_url}](${source.canonical_url || source.source_url})` : "未披露"}`,
    ""
  ])
].join("\n");
write(dailyFile, daily);

const files = fs.existsSync(dailyDir) ? fs.readdirSync(dailyDir).filter((name) => /^\d{4}-\d{2}-\d{2} AI Hardware\.md$/u.test(name)).sort().reverse() : [];
if (!files.includes(path.basename(dailyFile))) files.unshift(path.basename(dailyFile));
const index = [
  "---",
  "type: ai_hardware_index",
  "status: current",
  "hardware_version: HARDWARE-V1.0",
  `updated_at: ${manifest.generated_at}`,
  "---",
  "",
  "# AI Hardware Index",
  "",
  "> Data Center V4 的硬件事实索引。旧 Business Signals 仅为兼容资产，不再作为本目录的数据源。",
  "",
  "- [[../11-databases/data-center-v4/Data Center V4 Index|Data Center V4 Index]]",
  "",
  "## Daily Views",
  "",
  ...[...new Set(files)].map((name) => `- [[daily/${path.basename(name, ".md")}|${path.basename(name, ".md")}]]`),
  ""
].join("\n");
if (!skipIndex) write(indexFile, index);

console.log(JSON.stringify({ ok: true, date, dryRun, items: items.length, missingRaw: 0, dailyFile: rel(dailyFile), indexFile: rel(indexFile) }, null, 2));
