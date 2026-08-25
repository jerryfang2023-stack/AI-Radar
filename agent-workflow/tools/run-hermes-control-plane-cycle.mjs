#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { resolveAutomationNetworkEnv } from "./lib/automation-network-env.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

const date = args.get("date") || shanghaiDate();
const reportsDir = path.resolve(root, args.get("reports-dir") || path.join("agent-workflow", "reports"));
const watchdogRunner = path.join(root, "agent-workflow", "tools", "run-hermes-control-plane-watchdog.mjs");
const heartbeatRunner = path.join(root, "agent-workflow", "tools", "publish-hermes-control-plane-heartbeat.mjs");
const automationNetwork = await resolveAutomationNetworkEnv();

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

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function run(script, scriptArgs) {
  return spawnSync(process.execPath, [script, ...scriptArgs], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    env: automationNetwork.env,
  });
}

function forwarded(name) {
  return args.has(name) ? [`--${name}=${args.get(name)}`] : [];
}

function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
    throw new Error(`Invalid production date: ${date}`);
  }

  const watchdog = run(watchdogRunner, [
    `--date=${date}`,
    ...forwarded("force"),
    ...forwarded("reports-dir"),
    ...forwarded("incident-dir"),
  ]);
  const watchdogReport = readJson(path.join(reportsDir, `${date}-hermes-control-plane-watchdog.json`));
  const watchdogReportValid = watchdogReport?.date === date
    && typeof watchdogReport?.generated_at === "string"
    && ["passed", "manual_required"].includes(watchdogReport?.status);

  const heartbeat = run(heartbeatRunner, [
    `--date=${date}`,
    ...forwarded("reports-dir"),
    ...forwarded("repo"),
    ...forwarded("gh-executable"),
    ...forwarded("dry-run"),
  ]);
  const heartbeatOutput = (() => {
    try {
      return JSON.parse(heartbeat.stdout || "");
    } catch {
      return null;
    }
  })();
  const heartbeatOk = !heartbeat.error && heartbeat.status === 0 && heartbeatOutput?.ok === true;
  const ok = watchdogReportValid && heartbeatOk;
  const status = watchdogReportValid ? watchdogReport.status : "report_generation_failed";

  console.log(JSON.stringify({
    ok,
    status,
    date,
    network_mode: automationNetwork.mode,
    watchdog: {
      exit_status: watchdog.status,
      report_valid: watchdogReportValid,
      status: watchdogReportValid ? watchdogReport.status : "missing_or_invalid",
    },
    heartbeat: {
      exit_status: heartbeat.status,
      status: heartbeatOutput?.heartbeat?.status || "not_published",
      dispatched: heartbeatOutput?.dispatched === true,
    },
  }, null, 2));

  if (!ok) process.exit(1);
}

main();
