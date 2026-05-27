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
const stage = args.get("stage") || "post-monitor";
const rawMin = numberArg("raw-min", 80);
const poolMin = numberArg("pool-min", 15);
const allowMonitorQualityGaps = args.get("allow-monitor-quality-gaps") === "true";
const blockStale = args.get("block-stale") === "true" || ["pre-trend", "pre-daily-observation", "pre-site", "pre-commit"].includes(stage);
const reportsDir = path.join(root, "agent-workflow", "reports");
const allowedMonitorQualityGapFailures = new Set([
  "importance_coverage_gaps_must_be_none",
  "pool_importance_coverage_gaps_must_be_none",
]);

const staleBlockGroupsByStage = new Map([
  ["post-monitor", []],
  ["pre-trend", ["signal_cards", "opinion_cards"]],
  ["pre-daily-observation", ["signal_cards", "opinion_cards", "trend_candidates"]],
  ["pre-site", ["signal_cards", "opinion_cards", "trend_candidates", "daily_observation"]],
  ["pre-commit", ["signal_cards", "opinion_cards", "trend_candidates", "daily_observation", "site_data"]],
]);

function numberArg(name, fallback) {
  const value = Number(args.get(name));
  return Number.isFinite(value) ? value : fallback;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

function mtime(file) {
  return exists(file) ? fs.statSync(file).mtimeMs : 0;
}

function parseLineValue(text = "", key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp(`^-\\s*${escaped}\\s*[:=]\\s*(.+)$`, "im"))?.[1]?.trim() || "";
}

function parseNumber(text = "", key) {
  const raw = parseLineValue(text, key);
  const value = Number(String(raw).replace(/[^\d.-]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function countSections(text = "", prefix) {
  return (text.match(new RegExp(`^#{2,6}\\s+${prefix}-\\d+\\b`, "gmu")) || []).length;
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

function datedMarkdown(dir, matcher) {
  return listFiles(dir, (file) => path.basename(file).startsWith(date) && (!matcher || matcher(file)));
}

function latestTime(files) {
  return files.reduce((max, file) => Math.max(max, mtime(file)), 0);
}

function markdownList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- none";
}

function splitReportList(value = "") {
  return String(value)
    .split(/[;,]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function failedHardGates(text = "") {
  const fromRiskLine = splitReportList(parseLineValue(text, "hard_gates_failed"));
  if (fromRiskLine.length) return fromRiskLine;
  return [...text.matchAll(/^- ([a-z0-9_]+): failed\b/gimu)].map((match) => match[1]);
}

function staleBlockGroupNames() {
  if (!blockStale) return [];
  const explicit = args.get("stale-groups");
  if (explicit) {
    return explicit.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return staleBlockGroupsByStage.get(stage) || ["signal_cards", "opinion_cards", "trend_candidates", "daily_observation", "site_data"];
}

const files = {
  raw: path.join(root, "01-SiteV2", "content", "01-raw", `${date}-raw-candidates.md`),
  rawOriginals: path.join(root, "01-SiteV2", "content", "01-raw", "originals", date),
  pool: path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`),
  monitorLog: path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`),
  qualityGate: path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`),
  finalQc: path.join(reportsDir, `${date}-guanlan-daily-monitor-qc.md`),
};

const rawText = read(files.raw);
const poolText = read(files.pool);
const logText = read(files.monitorLog);
const gateText = read(files.qualityGate);
const finalQcText = read(files.finalQc);

const rawCountFromFile = countSections(rawText, "R");
const poolCountFromFile = countSections(poolText, "P");
const rawCountFromLog = parseNumber(logText, "raw_count");
const poolCountFromLog = parseNumber(logText, "pool_count");
const rawCount = rawCountFromFile;
const poolCount = poolCountFromFile;
const historicalDedupeEnabled = /historical_dedupe_enabled:\s*true/iu.test(logText);
const historicalChecked = parseNumber(logText, "historical_raw_records_checked") ?? 0;
const historicalPreFetchRemoved = parseNumber(logText, "historical_duplicates_removed_before_fetch") ?? 0;
const historicalPostFetchRemoved = parseNumber(logText, "historical_duplicates_removed_after_fetch") ?? 0;
const activeRawHistoricalDuplicateCount = [
  ...(rawText.match(/^-\s*duplicate_status:\s*duplicate\b/gmu) || []),
  ...(rawText.match(/^-\s*duplicate_of:\s*(?!\s*$).+/gmu) || []),
].length;
const activePoolHistoricalDuplicateCount = [
  ...(poolText.match(/^-\s*duplicate_status:\s*duplicate\b/gmu) || []),
  ...(poolText.match(/^-\s*duplicate_of:\s*(?!\s*$).+/gmu) || []),
].length;
const activeHistoricalDuplicateCount = activeRawHistoricalDuplicateCount + activePoolHistoricalDuplicateCount;
const activeRawDuplicateMarkers = (rawText.match(/^-\s*duplicate_status:\s*(?!unique\b|merged_provider_duplicates\b).+/gmu) || []).length;
const activePoolDuplicateMarkers = (poolText.match(/^-\s*duplicate_status:\s*(?!unique\b|merged_provider_duplicates\b).+/gmu) || []).length;
const gateStatus = String(parseLineValue(gateText, "status")).toLowerCase();
const monitorQualityGateHardFailures = failedHardGates(gateText);
const monitorQualityGateOverride = Boolean(
  allowMonitorQualityGaps &&
  stage === "post-monitor" &&
  gateText &&
  gateStatus &&
  gateStatus !== "passed" &&
  monitorQualityGateHardFailures.length > 0 &&
  monitorQualityGateHardFailures.every((gate) => allowedMonitorQualityGapFailures.has(gate))
);
const monitorQualityGateOverrideReason = monitorQualityGateOverride
  ? `cards-only review artifact mode allows monitor coverage gap(s): ${monitorQualityGateHardFailures.join(", ")}`
  : "";
const finalQcDecision = (
  parseLineValue(finalQcText, "Downstream decision") ||
  parseLineValue(finalQcText, "downstream_decision") ||
  parseLineValue(finalQcText, "decision")
).toLowerCase();

const upstreamFiles = [files.raw, files.pool].filter(exists);
const upstreamMtime = latestTime(upstreamFiles);
const downstreamGroups = {
  signal_cards: [
    ...datedMarkdown(path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"), (file) => /--signal--.+\.md$/u.test(path.basename(file))),
    ...datedMarkdown(path.join(root, "01-SiteV2", "content", "04-business-signals")),
  ],
  opinion_cards: [
    ...datedMarkdown(path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards"), (file) => /--frontier-opinion.+\.md$/u.test(path.basename(file))),
    ...datedMarkdown(path.join(root, "01-SiteV2", "content", "05-frontier-opinions")),
  ],
  trend_candidates: [
    ...datedMarkdown(path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend")),
    ...datedMarkdown(path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "trend")),
    path.join(reportsDir, `${date}-no-trend-candidate-decision.md`),
  ].filter(exists),
  daily_observation: [
    ...datedMarkdown(path.join(root, "01-SiteV2", "content", "03-daily-observation")),
    ...datedMarkdown(reportsDir, (file) => /daily-observation/iu.test(path.basename(file))),
  ],
  site_data: [
    path.join(root, "01-SiteV2", "site", "data", "site-content.json"),
    path.join(root, "01-SiteV2", "site", "data", "site-content.js"),
  ].filter(exists),
};

const staleGroups = Object.entries(downstreamGroups)
  .map(([name, groupFiles]) => ({
    name,
    files: groupFiles,
    stale: upstreamMtime > 0 && groupFiles.length > 0 && latestTime(groupFiles) < upstreamMtime,
  }))
  .filter((group) => group.stale);
const blockedStaleGroupNames = staleBlockGroupNames();
const blockedStaleGroups = staleGroups.filter((group) => blockedStaleGroupNames.includes(group.name));

const problems = [];
if (!exists(files.raw)) problems.push(`missing Raw file: ${rel(files.raw)}`);
if (!exists(files.pool)) problems.push(`missing Pool file: ${rel(files.pool)}`);
if (!exists(files.monitorLog)) problems.push(`missing monitor log: ${rel(files.monitorLog)}`);
if (!exists(files.qualityGate)) problems.push(`missing quality gate report: ${rel(files.qualityGate)}`);
if (rawCount < rawMin) problems.push(`active Raw count ${rawCount} below ${rawMin}`);
if (poolCount < poolMin) problems.push(`Pool count ${poolCount} below ${poolMin}`);
if (!historicalDedupeEnabled) problems.push("historical Raw dedupe is not enabled");
if (historicalChecked <= 0) problems.push("historical Raw dedupe checked zero records");
if (rawCountFromLog !== null && rawCountFromLog !== rawCountFromFile) problems.push(`logged raw_count ${rawCountFromLog} does not match final active Raw count ${rawCountFromFile}`);
if (poolCountFromLog !== null && poolCountFromLog !== poolCountFromFile) problems.push(`logged pool_count ${poolCountFromLog} does not match final active Pool count ${poolCountFromFile}`);
if (activeHistoricalDuplicateCount > 0) problems.push(`active Raw / Pool still contains ${activeHistoricalDuplicateCount} historical duplicate marker(s)`);
if (activeRawDuplicateMarkers > 0) problems.push(`active Raw contains ${activeRawDuplicateMarkers} non-unique duplicate marker(s)`);
if (activePoolDuplicateMarkers > 0) problems.push(`active Pool contains ${activePoolDuplicateMarkers} non-unique duplicate marker(s)`);
if (gateText && gateStatus && gateStatus !== "passed" && !monitorQualityGateOverride) problems.push(`monitor quality gate status is ${gateStatus}`);
if (stage !== "post-monitor" && finalQcText && /^block/u.test(finalQcDecision)) problems.push(`final monitor QC decision is ${finalQcDecision}`);
if (blockStale && blockedStaleGroups.length) problems.push(`downstream assets are stale: ${blockedStaleGroups.map((group) => group.name).join(", ")}`);

const reportFile = path.join(reportsDir, `${date}-daily-production-chain-readiness.md`);
fs.mkdirSync(reportsDir, { recursive: true });
const staleMarkerFile = path.join(reportsDir, `${date}-downstream-assets-stale.md`);
if (staleGroups.length) {
  fs.writeFileSync(staleMarkerFile, [
    `# ${date} Downstream Assets Stale`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    "- downstream_assets_stale: true",
    `- upstream_files: ${upstreamFiles.map(rel).join(", ")}`,
    `- stale_groups: ${staleGroups.map((group) => group.name).join(", ")}`,
    "",
    "## Required Action",
    "",
    "- Regenerate same-date Card / Opinion / Trend / Daily Observation / site data before site sync or commit mode.",
    "",
  ].join("\n"), "utf8");
} else if (exists(staleMarkerFile)) {
  fs.rmSync(staleMarkerFile);
}
const report = [
  `# ${date} Daily Production Chain Readiness`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- stage: ${stage}`,
  `- status: ${problems.length ? "blocked" : "passed"}`,
  `- final_active_raw_count: ${rawCount}`,
  `- final_active_pool_count: ${poolCount}`,
  `- logged_raw_count: ${rawCountFromLog ?? "missing"}`,
  `- logged_pool_count: ${poolCountFromLog ?? "missing"}`,
  `- historical_dedupe_enabled: ${historicalDedupeEnabled ? "true" : "false"}`,
  `- historical_raw_records_checked: ${historicalChecked}`,
  `- historical_duplicates_removed_before_fetch: ${historicalPreFetchRemoved}`,
  `- historical_duplicates_removed_after_fetch: ${historicalPostFetchRemoved}`,
  `- active_historical_duplicate_count: ${activeHistoricalDuplicateCount}`,
  `- active_raw_historical_duplicate_count: ${activeRawHistoricalDuplicateCount}`,
  `- active_pool_historical_duplicate_count: ${activePoolHistoricalDuplicateCount}`,
  `- monitor_quality_gate_status: ${gateStatus || "missing"}`,
  `- monitor_quality_gate_hard_failures: ${monitorQualityGateHardFailures.length ? monitorQualityGateHardFailures.join(", ") : "none"}`,
  `- monitor_quality_gate_override: ${monitorQualityGateOverride ? "cards_only_review_artifact" : "false"}`,
  `- monitor_quality_gate_override_reason: ${monitorQualityGateOverrideReason || "none"}`,
  `- review_only: ${monitorQualityGateOverride ? "true" : "false"}`,
  `- downstream_assets_stale: ${staleGroups.length ? "true" : "false"}`,
  `- block_stale: ${blockStale ? "true" : "false"}`,
  `- block_stale_groups: ${blockedStaleGroupNames.length ? blockedStaleGroupNames.join(", ") : "none"}`,
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
  raw_active_count: rawCount,
  pool_count: poolCount,
  final_active_raw_count: rawCount,
  final_active_pool_count: poolCount,
  logged_raw_count: rawCountFromLog,
  logged_pool_count: poolCountFromLog,
  historical_raw_records_checked: historicalChecked,
  historical_duplicates_removed_before_fetch: historicalPreFetchRemoved,
  historical_duplicates_removed_after_fetch: historicalPostFetchRemoved,
  active_historical_duplicate_count: activeHistoricalDuplicateCount,
  active_raw_historical_duplicate_count: activeRawHistoricalDuplicateCount,
  active_pool_historical_duplicate_count: activePoolHistoricalDuplicateCount,
  monitor_quality_gate_status: gateStatus || null,
  monitor_quality_gate_hard_failures: monitorQualityGateHardFailures,
  monitor_quality_gate_override: monitorQualityGateOverride ? "cards_only_review_artifact" : false,
  monitor_quality_gate_override_reason: monitorQualityGateOverrideReason || null,
  review_only: monitorQualityGateOverride,
  downstream_assets_stale: staleGroups.length > 0,
  stale_marker: staleGroups.length ? rel(staleMarkerFile) : null,
  stale_groups: staleGroups.map((group) => group.name),
  blocked_stale_groups: blockedStaleGroups.map((group) => group.name),
  problems,
}, null, 2));

if (problems.length) process.exit(2);
