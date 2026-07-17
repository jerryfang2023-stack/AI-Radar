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
  }),
);

const phase = args.get("phase") || "morning";
const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const invokeCodex = args.get("invoke-codex") !== "false";

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

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function run(label, command, commandArgs, timeoutMs = 180_000) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  return {
    label,
    ok: !result.error && result.status === 0,
    status: result.status,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    command: [command, ...commandArgs].join(" "),
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || result.error?.message || "").trim(),
  };
}

function workflowRuns(workflow) {
  const result = run("inspect workflow", "gh", [
    "run", "list", "--workflow", workflow, "--limit", "30",
    "--json", "databaseId,status,conclusion,createdAt,url",
  ]);
  if (!result.ok) return { available: false, result, runs: [] };
  try {
    const runs = JSON.parse(result.stdout || "[]")
      .filter((item) => shanghaiDate(item.createdAt) === date);
    return { available: true, result, runs };
  } catch (error) {
    return { available: false, result: { ...result, ok: false, stderr: error.message }, runs: [] };
  }
}

function dispatchWorkflow(workflow) {
  const commandArgs = ["workflow", "run", workflow, "-f", `date=${date}`];
  if (dryRun) {
    return {
      label: `dispatch ${workflow}`,
      ok: true,
      status: 0,
      command: `dry-run: gh ${commandArgs.join(" ")}`,
      stdout: "",
      stderr: "",
    };
  }
  return run(`dispatch ${workflow}`, "gh", commandArgs);
}

function morning() {
  const preflight = run("Skill Ops preflight", process.execPath, ["agent-workflow/tools/check-skill-ops.mjs"]);
  const business = run("Data Center V4 production dispatch", process.execPath, [
    "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
    `--date=${date}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ]);
  return {
    ok: business.ok,
    status: business.ok ? (preflight.ok ? "passed" : "passed_with_preflight_warning") : "failed",
    actions: [preflight, business],
    notes: preflight.ok ? [] : ["Skill Ops preflight failed but did not block production dispatch."],
  };
}

function firstLineRecovery() {
  const gate = run("First-Line Viewpoints gate", process.execPath, [
    "agent-workflow/tools/assert-follow-builders-data.mjs",
    `--date=${date}`,
  ]);
  if (gate.ok) return { ok: true, status: "healthy", actions: [gate] };

  const workflow = "daily-first-line-viewpoints-pr.yml";
  const inspected = workflowRuns(workflow);
  const active = inspected.runs.find((item) => ["queued", "in_progress"].includes(item.status));
  const successful = inspected.runs.find((item) => item.conclusion === "success");
  if (!inspected.available) return { ok: false, status: "inspection_failed", actions: [gate, inspected.result] };
  if (active) return { ok: true, status: "waiting", actions: [gate, inspected.result], run: active };
  if (successful) {
    return {
      ok: false,
      status: "publication_repair_required",
      actions: [gate, inspected.result],
      run: successful,
    };
  }
  const dispatch = dispatchWorkflow(workflow);
  return {
    ok: dispatch.ok,
    status: dispatch.ok ? "fallback_dispatched" : "dispatch_failed",
    actions: [gate, inspected.result, dispatch],
  };
}

function communityRecovery() {
  const gate = run("Community Intelligence gate", process.execPath, [
    "agent-workflow/tools/assert-community-intelligence-data.mjs",
    `--date=${date}`,
  ]);
  return {
    ok: gate.ok,
    status: gate.ok ? "healthy" : "local_repair_required",
    actions: [gate],
    note: gate.ok ? "" : "GitHub cannot replace the local logged-in collector; repair the local collection stage only.",
  };
}

function recovery() {
  const business = run("Data Center V4 recovery router", process.execPath, [
    "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
    `--date=${date}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ]);
  const firstLine = firstLineRecovery();
  const community = communityRecovery();
  const ok = business.ok && firstLine.ok && community.ok;
  return {
    ok,
    status: ok ? "passed_or_waiting" : "targeted_repair_required",
    lanes: { business, first_line_viewpoints: firstLine, community_intelligence: community },
    actions: [business, ...firstLine.actions, ...community.actions],
    notes: [community.note].filter(Boolean),
  };
}

function closure() {
  const coverage = run("Data Center projection coverage", process.execPath, [
    "agent-workflow/tools/assert-data-center-projection-coverage.mjs",
    `--date=${date}`,
  ]);
  const selfCheck = run("Daily self-check and safe repair", process.execPath, [
    "agent-workflow/tools/run-daily-self-check.mjs",
    `--date=${date}`,
    "--repair=safe",
  ], 300_000);
  const codex = run("Codex targeted repair handoff", process.execPath, [
    "agent-workflow/tools/run-codex-self-repair.mjs",
    `--date=${date}`,
    "--repair=safe",
    `--invoke=${invokeCodex ? "on" : "off"}`,
    "--codex-command=codex",
  ], 900_000);
  return {
    ok: coverage.ok && selfCheck.ok && codex.ok,
    status: coverage.ok && selfCheck.ok && codex.ok ? "closed" : "repair_required",
    actions: [coverage, selfCheck, codex],
    notes: [],
  };
}

function writeReport(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const base = `${date}-daily-automation-${phase}`;
  const jsonPath = path.join(reportsDir, `${base}.json`);
  const mdPath = path.join(reportsDir, `${base}.md`);
  const lines = [
    `# WaveSight Daily Automation ${phase} - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- ok: ${payload.ok}`,
    `- dry_run: ${dryRun}`,
    "",
    "## Actions",
    "",
    "| Action | Status | Command |",
    "|---|---|---|",
    ...payload.actions.map((item) => `| ${item.label} | ${item.ok ? "passed" : "failed"} | \`${item.command}\` |`),
    "",
    "## Notes",
    "",
    ...(payload.notes?.length ? payload.notes.map((item) => `- ${item}`) : ["- none"]),
    "",
  ];
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, lines.join("\n"), "utf8");
  return { jsonPath, mdPath };
}

function main() {
  if (!date) throw new Error("Unable to resolve Asia/Shanghai production date.");
  if (!new Set(["morning", "recovery", "closure"]).has(phase)) {
    throw new Error(`Unsupported phase: ${phase}`);
  }
  const result = phase === "morning" ? morning() : phase === "recovery" ? recovery() : closure();
  const payload = {
    ...result,
    phase,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
  };
  const report = writeReport(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status: payload.status,
    phase,
    date,
    report: rel(report.jsonPath),
    markdown: rel(report.mdPath),
  }, null, 2));
  if (!payload.ok) process.exit(1);
}

main();
