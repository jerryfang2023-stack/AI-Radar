#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEntityCollections,
  buildEventRecords
} from "../../01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs";
import { buildEntityHistoryService } from "../product/entity-history-v1.mjs";
import { buildTargetedBackfillQueue } from "../product/targeted-backfill-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const outputDir = path.join(root, "01-SiteV2/content/11-databases/targeted-backfill-v1");
const queueFile = path.join(outputDir, "queue.json");

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

function collectRows(stem, idKey = "") {
  if (!fs.existsSync(canonicalRoot)) return [];
  const rows = [];
  const dates = fs.readdirSync(canonicalRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  for (const date of dates) {
    const file = path.join(canonicalRoot, date, `${stem}.json`);
    const values = readJson(file, []);
    if (!Array.isArray(values)) continue;
    for (const value of values) rows.push({ data_date: date, ...value });
  }
  if (!idKey) return rows;
  const deduped = new Map();
  for (const row of rows) deduped.set(row[idKey] || JSON.stringify(row), row);
  return [...deduped.values()];
}

function projectFdeRows(rows, eventsById) {
  return rows.filter((row) => eventsById.has(row.event_id)).map((row) => ({
    id: row.fde_id,
    eventId: row.event_id,
    customer: row.customer || "",
    vendor: row.vendor || "",
    industry: row.industry || "",
    useCase: row.use_case || "",
    stage: row.deployment_stage || "",
    reportedNeed: row.reported_need || "",
    deliveryComponents: row.reported_delivery_components || [],
    outcomes: row.reported_outcomes || [],
    undisclosedFields: row.undisclosed_fields || []
  }));
}

if (!fs.existsSync(canonicalRoot)) throw new Error("Canonical daily bundles are missing. Run the Data Center V4 build first.");
const entityRows = collectRows("entities", "entity_id");
const eventRecords = buildEventRecords({
  events: collectRows("canonical-events", "event_id"),
  claims: collectRows("claims", "claim_id"),
  rawDocuments: collectRows("raw-documents", "raw_id"),
  sourceArtifacts: collectRows("source-artifacts", "source_artifact_id"),
  entities: entityRows,
  tagAssertions: [],
  facetAssertions: [],
  tagNames: new Map(),
  facetNames: new Map()
});
const eventsById = new Map(eventRecords.map((event) => [event.id, event]));
const fde = projectFdeRows(collectRows("fde-records", "fde_id"), eventsById);
const entityHistory = buildEntityHistoryService({ entityRows, events: eventRecords, fdeRecords: fde, hardwareRecords: [] });
const collections = buildEntityCollections(entityHistory, eventsById);
const currentDate = eventRecords.map((event) => event.dataDate).filter(Boolean).sort().at(-1) || "";
const data = {
  meta: { productVersion: "SITE-V4.2.0-entity-history", currentDate },
  entityHistoryManifest: entityHistory.manifest,
  events: eventRecords,
  companies: collections.companies,
  products: collections.products,
  fde
};
const previousQueue = readJson(queueFile, {});
const queue = buildTargetedBackfillQueue({
  data,
  previousQueue,
  generatedAt: args.get("generated-at") || new Date().toISOString(),
  windowMonths: Number(args.get("months") || 6)
});

writeJsonAtomic(queueFile, queue);
console.log(JSON.stringify({
  ok: true,
  queueVersion: queue.manifest.queueVersion,
  coverageWindow: queue.manifest.coverageWindow,
  counts: queue.manifest.counts,
  output: path.relative(root, queueFile).replace(/\\/gu, "/")
}, null, 2));
