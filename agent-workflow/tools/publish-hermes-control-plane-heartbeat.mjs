#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

const date = args.get("date") || shanghaiDate();
const reportsDir = path.resolve(root, args.get("reports-dir") || path.join("agent-workflow", "reports"));
const repository = args.get("repo") || "jerryfang2023-stack/AI-Radar";
const ghExecutable = args.get("gh-executable") || "gh";
const dryRun = args.get("dry-run") === "true";
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

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function controllerHeartbeat(phase) {
  const report = readJson(path.join(reportsDir, `${date}-daily-automation-${phase}.json`));
  const identityValid = report?.date === date && report?.phase === phase;
  const actionCount = Array.isArray(report?.actions) ? report.actions.length : 0;
  return {
    phase,
    observable: Boolean(identityValid && actionCount > 0),
    status: typeof report?.status === "string" ? report.status : "missing",
    generated_at: typeof report?.generated_at === "string" ? report.generated_at : null,
    action_count: actionCount,
  };
}

function buildHeartbeat() {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
    throw new Error(`Invalid production date: ${date}`);
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)) {
    throw new Error(`Invalid GitHub repository: ${repository}`);
  }

  const controllers = phases.map(controllerHeartbeat);
  const watchdog = readJson(path.join(reportsDir, `${date}-hermes-control-plane-watchdog.json`));
  const watchdogValid = watchdog?.date === date
    && typeof watchdog?.generated_at === "string"
    && ["passed", "manual_required"].includes(watchdog?.status);
  const allObservable = controllers.every((item) => item.observable);
  const status = watchdogValid && watchdog.status === "passed" && allObservable
    ? "passed"
    : "manual_required";

  return {
    schema_version: "HERMES-HEARTBEAT-V1",
    contract_version: "HERMES-V4.0-control-plane-watchdog",
    date,
    published_at: new Date().toISOString(),
    status,
    watchdog: {
      observable: Boolean(watchdogValid),
      status: watchdogValid ? watchdog.status : "missing",
      generated_at: watchdogValid ? watchdog.generated_at : null,
    },
    controllers,
  };
}

function dispatchHeartbeat(heartbeat) {
  const request = {
    event_type: "wavesight_control_plane_heartbeat",
    client_payload: heartbeat,
  };
  if (dryRun) return { dispatched: false, request };

  const result = spawnSync(
    ghExecutable,
    ["api", `repos/${repository}/dispatches`, "--method", "POST", "--input", "-"],
    {
      cwd: root,
      encoding: "utf8",
      input: `${JSON.stringify(request)}\n`,
      windowsHide: true,
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`GitHub heartbeat dispatch failed: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  }
  return { dispatched: true };
}

function main() {
  const heartbeat = buildHeartbeat();
  const dispatch = dispatchHeartbeat(heartbeat);
  console.log(JSON.stringify({
    ok: true,
    repository,
    dispatched: dispatch.dispatched,
    heartbeat,
    ...(dryRun ? { dispatch_request: dispatch.request } : {}),
  }, null, 2));
}

main();
