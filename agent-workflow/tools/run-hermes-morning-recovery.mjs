#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const maxAttempts = args.get("max-attempts") || "";
const laneArg = args.get("lanes") || "auto";
const node = process.execPath;

const recoveryLaneBySupervisionLane = {
  business_signals: "business_signals",
  first_line_viewpoints: "first_line_viewpoints",
  community_intelligence: "community_publish",
};

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateValue);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function runStep(name, command, commandArgs, { allowFailure = false } = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    timeout: 120_000,
  });
  const ok = !result.error && result.status === 0;
  if (!ok && !allowFailure) {
    const detail = [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n").trim();
    throw new Error(`${name} failed${detail ? `:\n${detail}` : ""}`);
  }
  return {
    name,
    ok,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
}

function readJsonFromStdout(stdout = "") {
  const text = String(stdout || "").trim();
  if (!text) return null;
  for (let start = text.indexOf("{"); start >= 0; start = text.indexOf("{", start + 1)) {
    try {
      return JSON.parse(text.slice(start));
    } catch {
      // Some subprocesses print log lines before JSON; keep scanning for the payload.
    }
  }
  return null;
}

function requestedSupervisionLaneIds(lanes = []) {
  if (laneArg === "auto") return lanes.map((lane) => lane.id).filter(Boolean);
  const requestedRecovery = new Set(laneArg.split(",").map((lane) => lane.trim()).filter(Boolean));
  const reverse = new Map(Object.entries(recoveryLaneBySupervisionLane).map(([supervision, recovery]) => [recovery, supervision]));
  return [...requestedRecovery].map((lane) => reverse.get(lane) || lane);
}

function lanesNeedingRecovery(supervision = {}) {
  const lanes = Array.isArray(supervision.lanes) ? supervision.lanes : [];
  const requested = new Set(requestedSupervisionLaneIds(lanes));
  return lanes
    .filter((lane) => requested.has(lane.id))
    .filter((lane) => ["failed", "manual_required"].includes(lane.status))
    .map((lane) => ({
      supervisionLane: lane.id,
      recoveryLane: recoveryLaneBySupervisionLane[lane.id],
      status: lane.status,
      problems: (lane.problems || []).map((item) => item.message || String(item)),
      actions: lane.actions || [],
      reportGate: lane.evidence?.gateReport || lane.evidence?.qualityGateStatus || lane.evidence?.readinessReport || "",
    }))
    .filter((lane) => lane.recoveryLane);
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-hermes-morning-recovery.json`);
  const mdFile = path.join(reportsDir, `${date}-hermes-morning-recovery.md`);
  const latestJsonFile = path.join(reportsDir, "hermes-morning-recovery-latest.json");
  const latestMdFile = path.join(reportsDir, "hermes-morning-recovery-latest.md");

  const laneRows = payload.lanes_needing_recovery.length
    ? payload.lanes_needing_recovery.map((lane) => (
      `| ${lane.supervisionLane} | ${lane.status} | ${lane.recoveryLane} | ${lane.problems.join("<br>") || "none"} | ${lane.actions.join("<br>") || "none"} |`
    ))
    : ["| none | passed | none | none | none |"];
  const recoveryRows = payload.recovery?.results?.length
    ? payload.recovery.results.map((item) => (
      `| ${item.lane} | ${item.action} | ${item.ok ? "yes" : "no"} | ${item.reason || ""} |`
    ))
    : ["| none | skipped | yes | no recovery needed |"];

  const md = [
    `# Hermes Morning Recovery - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- dry_run: ${payload.dry_run}`,
    `- supervision_status: ${payload.supervision_status}`,
    `- supervision_report: \`${payload.supervision_report || "missing"}\``,
    `- recovery_report: \`${payload.recovery_report || "not_run"}\``,
    "",
    "## Failed Or Manual Lanes",
    "",
    "| Supervision lane | Status | Recovery lane | Problems | Planned actions |",
    "|---|---|---|---|---|",
    ...laneRows,
    "",
    "## Recovery Actions",
    "",
    "| Lane | Action | OK | Reason |",
    "|---|---|---|---|",
    ...recoveryRows,
    "",
    "## Codex Repair Handoff",
    "",
    payload.hermes_inbox.length
      ? payload.hermes_inbox.map((file) => `- \`${file}\``).join("\n")
      : "- none",
    "",
    "If a lane remains failed after bounded recovery, Codex should start from the listed daily supervision report and Hermes inbox file, then repair the smallest failing rule, script, gate, or workflow.",
    "",
  ].join("\n");

  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdFile, `${md}\n`, "utf8");
  fs.writeFileSync(latestJsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdFile, `${md}\n`, "utf8");
  return { jsonFile, mdFile };
}

function main() {
  if (!date) throw new Error("Unable to resolve Hermes recovery date.");

  const supervisionStep = runStep("daily supervision", node, [
    "agent-workflow/tools/write-daily-supervision-report.mjs",
    `--date=${date}`,
  ], { allowFailure: true });
  const supervisionReportFile = path.join(reportsDir, `${date}-daily-supervision-report.json`);
  const supervision = readJson(supervisionReportFile, {});
  const supervisionOutput = readJsonFromStdout(supervisionStep.stdout) || {};
  const recoveryTargets = lanesNeedingRecovery(supervision);

  let recoveryStep = null;
  let recovery = null;
  if (recoveryTargets.length) {
    const recoveryArgs = [
      "agent-workflow/tools/dispatch-daily-recovery.mjs",
      "--mode=hermes_morning",
      `--date=${date}`,
      `--lanes=${recoveryTargets.map((lane) => lane.recoveryLane).join(",")}`,
    ];
    if (maxAttempts) recoveryArgs.push(`--max-attempts=${maxAttempts}`);
    if (dryRun) recoveryArgs.push("--dry-run=true");
    recoveryStep = runStep("daily recovery dispatch", node, recoveryArgs, { allowFailure: true });
    recovery = readJson(path.join(reportsDir, `${date}-daily-recovery-watchdog.json`), null);
  }

  const payload = {
    ok: Boolean(supervisionStep.ok || supervision.status),
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    supervision_status: supervision.status || "unknown",
    supervision_report: fs.existsSync(supervisionReportFile) ? rel(supervisionReportFile) : "",
    hermes_inbox: Array.isArray(supervisionOutput.hermes_inbox)
      ? supervisionOutput.hermes_inbox
      : [],
    lanes_needing_recovery: recoveryTargets,
    recovery_report: recovery ? `agent-workflow/reports/${date}-daily-recovery-watchdog.json` : "",
    recovery,
    steps: {
      supervision: {
        ok: supervisionStep.ok,
        status: supervisionStep.status,
        stderr: supervisionStep.stderr.trim(),
      },
      recovery: recoveryStep
        ? { ok: recoveryStep.ok, status: recoveryStep.status, stderr: recoveryStep.stderr.trim() }
        : null,
    },
  };

  const reports = writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    date,
    supervision_status: payload.supervision_status,
    recovery_actions: payload.recovery?.results || [],
    report: rel(reports.jsonFile),
    markdown: rel(reports.mdFile),
  }, null, 2));
}

main();
