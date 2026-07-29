#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readSourceIntake } from "./lib/source-intake-v1.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || new Date().toISOString().slice(0, 10);
const stage = args.get("stage") || "post-monitor";
const blockStale = args.get("block-stale") === "true" || stage === "pre-commit";
const reportsDir = path.join(root, "agent-workflow", "reports");

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  } catch {
    return fallback;
  }
}

function mtime(file) {
  return exists(file) ? fs.statSync(file).mtimeMs : 0;
}

function parseLineValue(text = "", key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return text.match(new RegExp(`^-\\s*${escaped}\\s*[:=]\\s*(.+)$`, "imu"))?.[1]?.trim() || "";
}

function parseNumber(text = "", key) {
  const value = Number(String(parseLineValue(text, key)).replace(/[^\d.-]/gu, ""));
  return Number.isFinite(value) ? value : null;
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

function latestTime(files) {
  return files.reduce((max, file) => Math.max(max, mtime(file)), 0);
}

function markdownList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- none";
}

const intake = readSourceIntake(root, date);
const intakeFile = intake?.file || "";
const rawOriginals = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
const monitorLog = path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`);
const qualityGate = path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`);
const finalQc = path.join(reportsDir, `${date}-guanlan-daily-monitor-qc.md`);
const manifestFile = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date, "manifest.json");
const telemetryFile = path.join(root, "01-SiteV2", "site", "data", "collection-telemetry-v1.json");
const logText = read(monitorLog);
const gateText = read(qualityGate);
const finalQcText = read(finalQc);
const manifest = readJson(manifestFile, {});
const telemetry = readJson(telemetryFile, {});
const rawDocuments = intake?.payload?.raw_documents || [];
const rawCount = rawDocuments.length;
const poolCount = rawDocuments.filter((item) => item.intake_diagnostics?.pooled).length;
const loggedRawCount = parseNumber(logText, "raw_count");
const loggedPoolCount = parseNumber(logText, "pool_count");
const qualityStatus = String(parseLineValue(gateText, "status")).toLowerCase();
const finalQcDecision = (
  parseLineValue(finalQcText, "Downstream decision")
  || parseLineValue(finalQcText, "downstream_decision")
  || parseLineValue(finalQcText, "decision")
).toLowerCase();

const activeDuplicateCount = rawDocuments.filter((document) => {
  const raw = readJson(path.resolve(root, document.body_ref || ""), {});
  return raw.duplicate_status === "duplicate" || Boolean(String(raw.duplicate_of || "").trim());
}).length;

const upstreamFiles = [
  intakeFile,
  ...listFiles(rawOriginals, (file) => file.endsWith(".json")),
].filter(Boolean);
const downstreamGroups = {
  v4_materialization: [manifestFile].filter(exists),
  application_projection: [
    path.join(root, "01-SiteV2", "site", "data", "opportunity-evidence-v2.json"),
    path.join(root, "01-SiteV2", "site", "data", "trend-radar-v1.json"),
    path.join(root, "01-SiteV2", "site", "data", "funding-insights-v1.json"),
  ].filter(exists),
  operations: [telemetryFile].filter(exists),
};
const upstreamMtime = latestTime(upstreamFiles);
const staleGroups = Object.entries(downstreamGroups)
  .map(([name, files]) => ({ name, files, stale: upstreamMtime > 0 && files.length > 0 && latestTime(files) < upstreamMtime }))
  .filter((group) => group.stale);
const blockedStaleGroups = blockStale ? staleGroups : [];

const problems = [];
if (!intake) problems.push(`missing structured source intake for ${date}`);
if (!exists(rawOriginals)) problems.push(`missing immutable source snapshots: ${rel(rawOriginals)}`);
if (!rawCount) problems.push("structured source intake has no RawDocuments");
if (loggedRawCount !== null && loggedRawCount !== rawCount) problems.push(`logged raw_count ${loggedRawCount} does not match structured intake ${rawCount}`);
if (loggedPoolCount !== null && loggedPoolCount !== poolCount) problems.push(`logged pool_count ${loggedPoolCount} does not match structured intake ${poolCount}`);
if (activeDuplicateCount) problems.push(`structured intake contains ${activeDuplicateCount} active historical duplicate marker(s)`);
if (gateText && qualityStatus && qualityStatus !== "passed") problems.push(`monitor quality gate status is ${qualityStatus}`);
if (stage !== "post-monitor" && finalQcText && /^block/u.test(finalQcDecision)) problems.push(`final monitor QC decision is ${finalQcDecision}`);
if (stage === "pre-commit" && manifest?.status !== "passed") problems.push(`V4 manifest status is ${manifest?.status || "missing"}`);
if (stage === "pre-commit" && telemetry?.schema_version !== "COLLECTION-TELEMETRY-V1.0") problems.push("collection telemetry is missing or invalid");
if (blockedStaleGroups.length) problems.push(`downstream assets are stale: ${blockedStaleGroups.map((group) => group.name).join(", ")}`);

fs.mkdirSync(reportsDir, { recursive: true });
const reportFile = path.join(reportsDir, `${date}-daily-production-chain-readiness.md`);
const report = [
  `# ${date} Daily Production Chain Readiness`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- stage: ${stage}`,
  `- status: ${problems.length ? "blocked" : "passed"}`,
  `- source_intake_version: ${intake?.payload?.schema_version || "missing"}`,
  `- source_artifact_count: ${intake?.payload?.source_artifacts?.length || 0}`,
  `- raw_document_count: ${rawCount}`,
  `- pooled_document_count: ${poolCount}`,
  `- logged_raw_count: ${loggedRawCount ?? "missing"}`,
  `- logged_pool_count: ${loggedPoolCount ?? "missing"}`,
  `- active_historical_duplicate_count: ${activeDuplicateCount}`,
  `- monitor_quality_gate_status: ${qualityStatus || "missing"}`,
  `- v4_manifest_status: ${manifest?.status || "not_required"}`,
  `- collection_telemetry_status: ${telemetry?.schema_version === "COLLECTION-TELEMETRY-V1.0" ? "ready" : "not_required"}`,
  `- downstream_assets_stale: ${staleGroups.length ? "true" : "false"}`,
  `- block_stale: ${blockStale ? "true" : "false"}`,
  "",
  "## Stale Groups",
  "",
  markdownList(staleGroups.map((group) => `${group.name}: ${group.files.map(rel).join(", ")}`)),
  "",
  "## Problems",
  "",
  markdownList(problems),
  "",
].join("\n");
fs.writeFileSync(reportFile, report, "utf8");

console.log(JSON.stringify({
  ok: problems.length === 0,
  date,
  stage,
  report: rel(reportFile),
  source_intake_version: intake?.payload?.schema_version || null,
  source_artifact_count: intake?.payload?.source_artifacts?.length || 0,
  raw_document_count: rawCount,
  pooled_document_count: poolCount,
  logged_raw_count: loggedRawCount,
  logged_pool_count: loggedPoolCount,
  active_historical_duplicate_count: activeDuplicateCount,
  monitor_quality_gate_status: qualityStatus || null,
  v4_manifest_status: manifest?.status || null,
  downstream_assets_stale: staleGroups.length > 0,
  stale_groups: staleGroups.map((group) => group.name),
  blocked_stale_groups: blockedStaleGroups.map((group) => group.name),
  problems,
}, null, 2));
if (problems.length) process.exit(2);
