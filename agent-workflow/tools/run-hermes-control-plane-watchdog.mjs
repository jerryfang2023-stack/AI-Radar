#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

const date = args.get("date") || shanghaiDate();
const force = args.get("force") === "true";
const reportsDir = path.resolve(root, args.get("reports-dir") || path.join("agent-workflow", "reports"));
const incidentDir = path.resolve(root, args.get("incident-dir") || path.join("agent-workflow", "inbox", "production-incidents"));
const phases = ["morning", "recovery", "closure"];

function shanghaiDate(value = new Date()) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function shanghaiTimestamp(value = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value).replace(" ", "T") + "+08:00";
}

function hasWindowPassed(targetDate, time) {
  const now = new Date();
  const cutoff = new Date(`${targetDate}T${time}:00+08:00`);
  return !Number.isNaN(cutoff.getTime()) && now >= cutoff;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function inspectPhase(phase) {
  const file = path.join(reportsDir, `${date}-daily-automation-${phase}.json`);
  const report = readJson(file);
  if (!report) {
    return {
      phase,
      observable: false,
      report: rel(file),
      controller_status: "missing",
      note: `${phase} controller report is missing or unreadable`,
    };
  }

  const validIdentity = report.date === date && report.phase === phase;
  const hasActions = Array.isArray(report.actions) && report.actions.length > 0;
  return {
    phase,
    observable: validIdentity && hasActions,
    report: rel(file),
    controller_status: report.status || "unknown",
    controller_ok: report.ok === true,
    note: !validIdentity
      ? `report identity mismatch (date=${report.date || "missing"}, phase=${report.phase || "missing"})`
      : !hasActions
        ? "controller report has no recorded actions"
        : "controller executed; downstream status remains owned by Closure/Codex",
  };
}

function writeReport(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-hermes-control-plane-watchdog.json`);
  const mdFile = path.join(reportsDir, `${date}-hermes-control-plane-watchdog.md`);
  const rows = payload.controllers.map((item) => (
    `| ${item.phase} | ${item.observable ? "yes" : "no"} | ${item.controller_status} | \`${item.report}\` | ${item.note} |`
  ));
  const md = [
    `# Hermes Control Plane Watchdog - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- scope: controller liveness only`,
    "",
    "| Controller | Observable | Controller status | Report | Note |",
    "|---|---|---|---|---|",
    ...rows,
    "",
    "Hermes does not evaluate lane data quality, compatibility Card counts, or downstream repair results.",
  ].join("\n");
  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdFile, `${md}\n`, "utf8");
  return { jsonFile, mdFile };
}

function writeIncident(payload, reportFile) {
  if (!payload.missing_or_invalid.length) return "";
  fs.mkdirSync(incidentDir, { recursive: true });
  const file = path.join(incidentDir, `${date}-automation-control-plane-liveness.md`);
  const now = shanghaiTimestamp();
  const evidence = payload.missing_or_invalid.map((item) => (
    `- ${item.phase}: ${item.note}; expected report: ${item.report}`
  ));
  const md = [
    "status: open",
    "priority: urgent",
    "lane: automation",
    "category: control_plane_liveness",
    "failed_gate: hermes_control_plane_watchdog",
    `report_path: ${rel(reportFile)}`,
    "data_generated: unknown",
    "needed_action: inspect the missing controller task or report writer; do not rerun production from Hermes",
    `created_at: ${now}`,
    `updated_at: ${now}`,
    "source: hermes-control-plane-watchdog",
    "",
    `# Control Plane Liveness Incident - ${date}`,
    "",
    "## Evidence",
    "",
    ...evidence,
    "",
    "## Expected Action",
    "",
    "1. Verify the scheduled controller task and its local execution result.",
    "2. Restore the missing controller or report-writing path.",
    "3. Let Closure/Codex own any downstream data repair.",
    "4. Do not inspect V3 Card counts or lower V4 evidence gates.",
  ].join("\n");
  fs.writeFileSync(file, `${md}\n`, "utf8");
  return rel(file);
}

function main() {
  if (!date) throw new Error("Unable to resolve Asia/Shanghai production date.");
  const inWindow = force || hasWindowPassed(date, "10:20");
  const controllers = phases.map(inspectPhase);
  const missingOrInvalid = inWindow ? controllers.filter((item) => !item.observable) : [];
  const status = !inWindow ? "waiting" : missingOrInvalid.length ? "manual_required" : "passed";
  const payload = {
    ok: status === "passed" || status === "waiting",
    status,
    date,
    generated_at: new Date().toISOString(),
    check_window: "10:20 Asia/Shanghai",
    controllers,
    missing_or_invalid: missingOrInvalid,
  };
  const report = writeReport(payload);
  const incident = writeIncident(payload, report.mdFile);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(report.jsonFile),
    markdown: rel(report.mdFile),
    incident,
  }, null, 2));
  if (!payload.ok) process.exit(1);
}

main();
