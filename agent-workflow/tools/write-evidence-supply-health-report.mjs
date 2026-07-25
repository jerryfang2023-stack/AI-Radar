#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateValue);
}

function addDays(dateText, offset) {
  const value = new Date(`${dateText}T00:00:00+08:00`);
  value.setUTCDate(value.getUTCDate() + offset);
  return shanghaiDate(value);
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file, fallback = "") {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return fallback;
  }
}

function host(value = "") {
  try {
    return new URL(value).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

const factTypes = {
  customer_case: new Set(["deployment"]),
  procurement: new Set(["procurement_contract"]),
  deployment: new Set(["deployment", "hardware_deployment"]),
  funding: new Set(["funding", "capital_investment"]),
};

function dateWindow(endDate, days) {
  return Array.from({ length: days }, (_, index) => addDays(endDate, index - days + 1));
}

function fdeWindow(databaseRoot, dates) {
  const rows = dates.flatMap((date) => {
    const file = path.join(databaseRoot, date, "fde-records.json");
    const records = readJson(file);
    return Array.isArray(records) ? [{ date, records }] : [];
  });
  const records = rows.flatMap((row) => row.records);
  const daysWithRecords = rows.filter((row) => row.records.length > 0).length;
  return {
    calendar_days: dates.length,
    observed_days: rows.length,
    days_with_records: daysWithRecords,
    records: records.length,
    observed_day_output_rate: rows.length ? Number((daysWithRecords / rows.length).toFixed(4)) : null,
    records_with_reported_outcomes: records.filter((record) => Array.isArray(record.reported_outcomes) && record.reported_outcomes.length > 0).length,
    records_without_reported_outcomes: records.filter((record) => !Array.isArray(record.reported_outcomes) || record.reported_outcomes.length === 0).length,
  };
}

function parseMonitorGaps(text = "") {
  const value = text.match(/^- pool_importance_coverage_gaps:\s*(.*)$/mu)?.[1]?.trim() || "";
  if (!value || /^(none|无)$/iu.test(value)) return [];
  return value.split(";").map((item) => item.trim()).filter(Boolean);
}

export function buildEvidenceSupplyHealth(root, endDate) {
  const databaseRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
  const dayRoot = path.join(databaseRoot, endDate);
  const events = readJson(path.join(dayRoot, "canonical-events.json"), []);
  const artifacts = readJson(path.join(dayRoot, "source-artifacts.json"), []);
  const registry = readJson(path.join(root, "01-SiteV2", "content", "11-databases", "source-registry-v2.json"), {});
  const originalHosts = new Set((registry.sources || [])
    .filter((source) => source.source_level === "S")
    .map((source) => host(source.endpoint_or_url))
    .filter(Boolean));
  const artifactById = new Map((Array.isArray(artifacts) ? artifacts : [])
    .map((artifact) => [artifact.source_artifact_id, artifact]));
  const canonicalSupply = {};
  const sourceGaps = [];

  for (const [name, eventTypes] of Object.entries(factTypes)) {
    const matching = (Array.isArray(events) ? events : []).filter((event) => eventTypes.has(event.event_type));
    const sourceBacked = matching.filter((event) => Array.isArray(event.source_refs) && event.source_refs.length > 0);
    const registryOriginal = matching.filter((event) => (event.source_refs || []).some((sourceRef) => {
      const artifact = artifactById.get(sourceRef);
      return originalHosts.has(host(artifact?.source_url || artifact?.canonical_url));
    }));
    canonicalSupply[name] = {
      events: matching.length,
      source_backed_events: sourceBacked.length,
      registry_s_level_original_events: registryOriginal.length,
    };
    if (matching.length === 0) sourceGaps.push(`${name}: no accepted canonical event`);
    if (matching.length > 0 && sourceBacked.length < matching.length) {
      sourceGaps.push(`${name}: ${matching.length - sourceBacked.length} event(s) missing source refs`);
    }
    if (matching.length > 0 && registryOriginal.length === 0) {
      sourceGaps.push(`${name}: no source URL matched an S-level original-source registry domain`);
    }
  }

  const monitorReport = path.join(root, "agent-workflow", "reports", `${endDate}-guanlan-monitor-quality-gate.md`);
  const monitorImportanceGaps = parseMonitorGaps(readText(monitorReport));
  sourceGaps.push(...monitorImportanceGaps.map((gap) => `monitor importance supply: ${gap}`));

  const fde7 = fdeWindow(databaseRoot, dateWindow(endDate, 7));
  const fde30 = fdeWindow(databaseRoot, dateWindow(endDate, 30));
  if (fde7.observed_days > 0 && fde7.days_with_records === 0) {
    sourceGaps.push("FDE: no accepted FDE record on any observed day in the 7-day window");
  }

  return {
    ok: true,
    status: sourceGaps.length ? "review" : "passed",
    date: endDate,
    generated_at: new Date().toISOString(),
    policy: {
      gate_effect: "diagnostic_only",
      missing_results: "preserve empty reported_outcomes and undisclosed_fields; never infer ROI or outcomes",
      original_source_metric: "conservative match against S-level source-registry domains",
    },
    canonical_fact_supply: canonicalSupply,
    monitor_importance_gaps: monitorImportanceGaps,
    fact_type_source_gaps: sourceGaps,
    fde_output_rate: {
      trailing_7_days: fde7,
      trailing_30_days: fde30,
    },
  };
}

function markdown(payload) {
  const rows = Object.entries(payload.canonical_fact_supply).map(([name, item]) => (
    `| ${name} | ${item.events} | ${item.source_backed_events} | ${item.registry_s_level_original_events} |`
  ));
  const fdeRows = Object.entries(payload.fde_output_rate).map(([window, item]) => (
    `| ${window} | ${item.observed_days}/${item.calendar_days} | ${item.days_with_records} | ${item.records} | ${item.observed_day_output_rate ?? "n/a"} | ${item.records_with_reported_outcomes} | ${item.records_without_reported_outcomes} |`
  ));
  return [
    `# Evidence Supply Health - ${payload.date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    "- gate_effect: diagnostic_only",
    "- missing_result_policy: keep undisclosed outcomes empty; never infer ROI or implementation results",
    "",
    "## Canonical Fact Supply",
    "",
    "| Fact type | Accepted events | Source-backed | Registry S-level original source |",
    "|---|---:|---:|---:|",
    ...rows,
    "",
    "## FDE Output Rate",
    "",
    "| Window | Observed/calendar days | Days with records | Records | Observed-day rate | With outcomes | Without outcomes |",
    "|---|---:|---:|---:|---:|---:|---:|",
    ...fdeRows,
    "",
    "## Fact-Type Source Gaps",
    "",
    ...(payload.fact_type_source_gaps.length ? payload.fact_type_source_gaps.map((item) => `- ${item}`) : ["- none"]),
    "",
  ].join("\n");
}

function main() {
  const root = process.cwd();
  const date = args.get("date") || shanghaiDate();
  const outputDir = path.resolve(args.get("output-dir") || path.join(root, "agent-workflow", "reports"));
  const payload = buildEvidenceSupplyHealth(root, date);
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, `${date}-evidence-supply-health.json`);
  const mdPath = path.join(outputDir, `${date}-evidence-supply-health.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, markdown(payload), "utf8");
  console.log(JSON.stringify({
    ok: true,
    status: payload.status,
    report: path.relative(root, jsonPath).replace(/\\/gu, "/"),
    markdown: path.relative(root, mdPath).replace(/\\/gu, "/"),
  }, null, 2));
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase();
if (isDirectRun) main();
