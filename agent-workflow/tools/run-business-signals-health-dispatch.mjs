#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
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
const waitForCompletion = args.get("wait") === "true";
const waitTimeoutMs = Math.max(1, Number(args.get("wait-timeout-minutes") || 35)) * 60_000;
const waitPollMs = Math.max(1, Number(args.get("wait-poll-seconds") || 15)) * 1_000;
const passScore = args.get("pass-score") || "85";
const workflowFile = "daily-persistent-assets-pr.yml";

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

function runOptional(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
}

function sleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readJsonText(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function readOriginJson(file, fallback = null) {
  const normalized = String(file).replace(/\\/gu, "/");
  const result = runOptional("git", ["show", `origin/main:${normalized}`]);
  return result.ok ? readJsonText(result.stdout, fallback) : fallback;
}

function v4Assets() {
  const fetch = runOptional("git", ["fetch", "origin", "main", "--quiet"]);
  const manifestPath = `01-SiteV2/content/11-databases/data-center-v4/${date}/manifest.json`;
  const gatePath = `agent-workflow/reports/${date}-data-center-v4-integrity-gate.json`;
  const frontstagePath = "01-SiteV2/site/data/data-center-v4-frontstage.json";
  const telemetryPath = "01-SiteV2/site/data/collection-telemetry-v1.json";
  const manifest = readOriginJson(manifestPath, {});
  const gate = readOriginJson(gatePath, {});
  const frontstage = readOriginJson(frontstagePath, {});
  const telemetry = readOriginJson(telemetryPath, {});
  const eventCount = Number(gate?.counts?.canonical_events || manifest?.counts?.canonical_events || 0);
  return {
    ready: fetch.ok
      && manifest?.date === date
      && gate?.date === date
      && gate?.ok === true
      && telemetry?.meta?.data_date === date
      && telemetry?.v4_gate?.status === "passed"
      && [frontstage?.meta?.latestDataDate, frontstage?.meta?.currentDate].includes(date),
    fetch_ok: fetch.ok,
    manifest_date: manifest?.date || "",
    gate_date: gate?.date || "",
    gate_ok: gate?.ok === true,
    canonical_events: eventCount,
    frontstage_date: frontstage?.meta?.latestDataDate || "",
    telemetry_date: telemetry?.meta?.data_date || "",
    telemetry_gate_status: telemetry?.v4_gate?.status || "",
  };
}

function workflowRuns() {
  const result = runOptional("gh", [
    "run",
    "list",
    "--workflow",
    workflowFile,
    "--limit",
    "30",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch,displayTitle",
  ]);
  if (!result.ok) {
    return {
      available: false,
      error: [result.stdout, result.stderr].filter(Boolean).join("\n").trim() || "gh run list failed",
      sameDateRuns: [],
    };
  }
  try {
    const runs = JSON.parse(result.stdout || "[]");
    return {
      available: true,
      error: "",
      sameDateRuns: runs.filter((run) => shanghaiDate(run.createdAt) === date),
    };
  } catch (error) {
    return {
      available: false,
      error: `Unable to parse gh run list JSON: ${error.message}`,
      sameDateRuns: [],
    };
  }
}

function publicationState() {
  const branch = `automation/business-signals-${date}`;
  const prResult = runOptional("gh", [
    "pr", "list", "--base", "main", "--head", branch, "--state", "open",
    "--json", "number,url,mergeStateStatus,isDraft",
  ]);
  let pullRequest = null;
  if (prResult.ok) {
    try {
      pullRequest = JSON.parse(prResult.stdout || "[]")[0] || null;
    } catch {
      pullRequest = null;
    }
  }
  const branchResult = runOptional("git", ["ls-remote", "--exit-code", "--heads", "origin", branch]);
  return {
    branch,
    branch_exists: branchResult.ok,
    pull_request: pullRequest,
    waiting: Boolean(pullRequest || branchResult.ok),
  };
}

function reusableFailedRun(sameDateRuns) {
  // Collection and monitor success establish reusable accepted input. The
  // workflow reruns the handoff and private evidence boundary after restore.
  const requiredSteps = [
    "Collect source raw artifacts",
    "Run Daily Monitor with QC",
  ];
  for (const run of sameDateRuns.filter((candidate) => candidate.conclusion === "failure")) {
    const view = runOptional("gh", [
      "run", "view", String(run.databaseId),
      "--json", "workflowName,conclusion,jobs",
    ]);
    if (!view.ok) continue;
    const detail = readJsonText(view.stdout, {});
    const steps = (detail.jobs || []).flatMap((job) => job.steps || []);
    const evidenceReady = detail.workflowName === "WaveSight Business Signals PR"
      && detail.conclusion === "failure"
      && requiredSteps.every((name) => steps.some((step) => step.name === name && step.conclusion === "success"));
    if (!evidenceReady) continue;

    const artifacts = runOptional("gh", [
      "api", `repos/{owner}/{repo}/actions/runs/${run.databaseId}/artifacts`,
    ]);
    const artifactPayload = artifacts.ok ? readJsonText(artifacts.stdout, {}) : {};
    const artifactName = `wavesight-business-signals-pr-${date}`;
    const artifactReady = (artifactPayload.artifacts || []).some((artifact) => artifact.name === artifactName && artifact.expired !== true);
    if (artifactReady) return { ...run, artifact_name: artifactName };
  }
  return null;
}

export function selectBusinessSignalsRun(sameDateRuns, { knownRunIds = new Set(), targetRunId = null } = {}) {
  const candidates = sameDateRuns
    .filter((run) => run.event === "workflow_dispatch")
    .filter((run) => targetRunId ? run.databaseId === targetRunId : !knownRunIds.has(run.databaseId))
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)));
  return candidates[0] || null;
}

export function waitForHealthyV4({
  deadline,
  run = null,
  inspectV4 = v4Assets,
  pause = sleep,
  now = Date.now,
} = {}) {
  let observedV4 = null;
  while (now() < deadline) {
    observedV4 = inspectV4();
    if (observedV4.fetch_ok && observedV4.ready) {
      return {
        ok: true,
        action: "completed",
        reason: run
          ? `Business Signals run completed and same-date V4 assets are healthy on origin/main: ${run.url}`
          : "same-date V4 assets are healthy on origin/main after publication completed",
        run,
        v4: observedV4,
      };
    }
    pause(waitPollMs);
  }
  const inspectionNote = observedV4?.fetch_ok === false
    ? "; the final origin/main fetch was unsuccessful"
    : "";
  return {
    ok: false,
    action: "publication_wait_timeout",
    reason: run
      ? `Timed out waiting for Business Signals publication to make same-date V4 assets healthy on origin/main${inspectionNote}: ${run.url}`
      : `Timed out waiting for same-date V4 assets to become healthy on origin/main${inspectionNote}`,
    run,
    v4: observedV4,
  };
}

function waitForBusinessSignalsRun({ knownRunIds = new Set(), targetRunId = null } = {}) {
  const deadline = Date.now() + waitTimeoutMs;
  let observedRun = null;
  while (Date.now() < deadline) {
    const runs = workflowRuns();
    if (!runs.available) return { ok: false, action: "inspection_failed", reason: runs.error, run: observedRun, v4: null };
    observedRun = selectBusinessSignalsRun(runs.sameDateRuns, { knownRunIds, targetRunId }) || observedRun;
    if (observedRun?.status === "completed") {
      if (observedRun.conclusion !== "success") {
        return { ok: false, action: "downstream_failed", reason: `Business Signals run concluded ${observedRun.conclusion}: ${observedRun.url}`, run: observedRun, v4: null };
      }
      return waitForHealthyV4({ deadline, run: observedRun });
    }
    sleep(waitPollMs);
  }
  return {
    ok: false,
    action: "downstream_wait_timeout",
    reason: observedRun
      ? `Timed out waiting for Business Signals run ${observedRun.url}`
      : "Timed out waiting for the dispatched Business Signals run to appear",
    run: observedRun,
    v4: null,
  };
}

export function decideHealthState({ runsAvailable, runsError = "", v4Ready = false, assetsReady, activeRun, publication, successfulRun, reusableRun }) {
  if (!runsAvailable) return { ok: false, action: "failed", reason: `GitHub run inspection failed: ${runsError}`, dispatchRequired: false };
  if (v4Ready) {
    return {
      ok: true,
      action: "skipped",
      reason: "same-date Data Center V4 manifest, integrity gate, materialization, and OPS telemetry are healthy; compatibility writers are disabled",
      dispatchRequired: false,
    };
  }
  if (activeRun) return { ok: true, action: "waiting", reason: `same-date Business Signals workflow is already ${activeRun.status}`, dispatchRequired: false };
  if (publication?.waiting) {
    return {
      ok: true,
      action: "publication_waiting",
      reason: publication.pull_request
        ? `same-date production branch has open PR ${publication.pull_request.url}; repair or merge publication without rerunning collection`
        : `same-date production branch ${publication.branch} exists without healthy main assets; repair publication without rerunning collection`,
      dispatchRequired: false,
    };
  }
  if (successfulRun) {
    return {
      ok: true,
      action: "publication_waiting",
      reason: `same-date production run succeeded but main assets are not healthy yet; inspect publication state instead of rerunning collection: ${successfulRun.url}`,
      dispatchRequired: false,
    };
  }
  if (reusableRun) {
    return {
      ok: true,
      action: "resume_dispatch_required",
      reason: `same-date collection and V4 source-intake handoff already passed; resume downstream production from ${reusableRun.url}`,
      dispatchRequired: true,
      resumeRunId: reusableRun.databaseId,
    };
  }
  return { ok: true, action: "dispatch_required", reason: "no healthy same-date assets and no active/successful/publication-waiting run", dispatchRequired: true };
}

function runPolicyFixtures() {
  const base = { runsAvailable: true, runsError: "", v4Ready: false, assetsReady: false, activeRun: null, publication: { waiting: false }, successfulRun: null, reusableRun: null };
  assert.equal(decideHealthState({ ...base, assetsReady: true }).dispatchRequired, true);
  assert.equal(decideHealthState({ ...base, v4Ready: true }).action, "skipped");
  assert.equal(decideHealthState({ ...base, v4Ready: true }).dispatchRequired, false);
  assert.equal(decideHealthState({ ...base, activeRun: { status: "in_progress" } }).action, "waiting");
  assert.equal(decideHealthState({ ...base, publication: { waiting: true, branch: "automation/business-signals-fixture", pull_request: { url: "https://example.test/pr/1" } } }).action, "publication_waiting");
  assert.equal(decideHealthState({ ...base, successfulRun: { url: "https://example.test/run/1" } }).action, "publication_waiting");
  const resume = decideHealthState({ ...base, reusableRun: { databaseId: 42, url: "https://example.test/run/42" } });
  assert.equal(resume.action, "resume_dispatch_required");
  assert.equal(resume.resumeRunId, 42);
  assert.equal(decideHealthState(base).dispatchRequired, true);
  const selected = selectBusinessSignalsRun([
    { databaseId: 40, event: "workflow_dispatch", createdAt: "2026-08-09T00:00:00Z" },
    { databaseId: 41, event: "schedule", createdAt: "2026-08-09T00:05:00Z" },
    { databaseId: 42, event: "workflow_dispatch", createdAt: "2026-08-09T00:10:00Z" },
  ], { knownRunIds: new Set([40]) });
  assert.equal(selected.databaseId, 42);
  assert.equal(selectBusinessSignalsRun([selected], { targetRunId: 42 }).databaseId, 42);
  const publicationChecks = [
    { fetch_ok: true, ready: false },
    { fetch_ok: true, ready: true },
  ];
  const publication = waitForHealthyV4({
    deadline: 1,
    run: { url: "https://example.test/run/42" },
    inspectV4: () => publicationChecks.shift(),
    pause: () => {},
    now: () => 0,
  });
  assert.equal(publication.ok, true);
  assert.equal(publicationChecks.length, 0);
  const fetchChecks = [
    { fetch_ok: false, ready: false },
    { fetch_ok: true, ready: true },
  ];
  const fetchRecovery = waitForHealthyV4({
    deadline: 1,
    inspectV4: () => fetchChecks.shift(),
    pause: () => {},
    now: () => 0,
  });
  assert.equal(fetchRecovery.ok, true);
  assert.equal(fetchChecks.length, 0);
  console.log(JSON.stringify({ ok: true, fixture: "business-signals-health-state" }, null, 2));
}

function dispatchWorkflow(resumeRunId = null) {
  const commandArgs = [
    "workflow",
    "run",
    workflowFile,
    "-f",
    `date=${date}`,
    "-f",
    `pass_score=${passScore}`,
  ];
  if (resumeRunId) commandArgs.push("-f", `resume_run_id=${resumeRunId}`);
  if (dryRun) {
    return { ok: true, output: `dry-run: gh ${commandArgs.join(" ")}` };
  }
  const result = runOptional("gh", commandArgs);
  return {
    ok: result.ok,
    output: result.ok ? result.stdout.trim() : [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  };
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-business-signals-health-dispatch.json`);
  const mdFile = path.join(reportsDir, `${date}-business-signals-health-dispatch.md`);
  const latestJsonFile = path.join(reportsDir, "business-signals-health-dispatch-latest.json");
  const latestMdFile = path.join(reportsDir, "business-signals-health-dispatch-latest.md");
  const md = [
    `# Business Signals Health Dispatch - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- ok: ${payload.ok}`,
    `- action: ${payload.action}`,
    `- reason: ${payload.reason}`,
    `- dry_run: ${payload.dry_run}`,
    `- wait_for_completion: ${payload.wait_for_completion}`,
    `- workflow: ${workflowFile}`,
    `- v4: \`${JSON.stringify(payload.v4)}\``,
    `- assets: \`${JSON.stringify(payload.assets)}\``,
    `- active_run: ${payload.active_run?.url || "none"}`,
    `- successful_run: ${payload.successful_run?.url || "none"}`,
    `- reusable_run: ${payload.reusable_run?.url || "none"}`,
    `- completed_run: ${payload.completed_run?.url || "none"}`,
    `- publication: \`${JSON.stringify(payload.publication)}\``,
    `- dispatch_output: ${payload.dispatch_output || "none"}`,
    "",
  ].join("\n");
  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdFile, md, "utf8");
  fs.writeFileSync(latestJsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdFile, md, "utf8");
  return { jsonFile, mdFile };
}

function main() {
  if (!date) throw new Error("Unable to resolve production date.");
  const v4 = v4Assets();
  const assets = { status: "retired_archive", production_write: "disabled", blocking: false };
  const runs = workflowRuns();
  const publication = publicationState();
  const activeRun = runs.sameDateRuns.find((run) => run.status === "queued" || run.status === "in_progress") || null;
  const successfulRun = runs.sameDateRuns.find((run) => run.conclusion === "success") || null;
  const reusableRun = activeRun || successfulRun || publication.waiting
    ? null
    : reusableFailedRun(runs.sameDateRuns);
  const decision = decideHealthState({
    runsAvailable: runs.available,
    runsError: runs.error,
    v4Ready: v4.ready,
    assetsReady: assets.ready,
    activeRun,
    publication,
    successfulRun,
    reusableRun,
  });
  let { action, reason, ok } = decision;
  let dispatch = null;
  let completion = null;
  const knownRunIds = new Set(runs.sameDateRuns.map((run) => run.databaseId));

  if (decision.dispatchRequired) {
    dispatch = dispatchWorkflow(decision.resumeRunId);
    ok = dispatch.ok;
    action = dryRun ? "dry_run_dispatch" : dispatch.ok ? "dispatched" : "dispatch_failed";
    reason = dispatch.ok
      ? decision.resumeRunId
        ? `same-date source intake is reusable; dispatched downstream recovery from run ${decision.resumeRunId} without recollection`
        : "no reusable same-date source intake exists; dispatched primary Business Signals workflow with fresh collection"
      : `failed to dispatch primary Business Signals workflow: ${dispatch.output || "unknown error"}`;
    if (dispatch.ok && waitForCompletion && !dryRun) {
      completion = waitForBusinessSignalsRun({ knownRunIds });
      ({ ok, action, reason } = completion);
    }
  } else if (waitForCompletion && decision.action === "waiting" && activeRun) {
    completion = waitForBusinessSignalsRun({ targetRunId: activeRun.databaseId });
    ({ ok, action, reason } = completion);
  } else if (waitForCompletion && decision.action === "publication_waiting") {
    completion = waitForHealthyV4({
      deadline: Date.now() + waitTimeoutMs,
      run: successfulRun,
    });
    ({ ok, action, reason } = completion);
  }

  const payload = {
    ok,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    wait_for_completion: waitForCompletion,
    action,
    reason,
    workflow: workflowFile,
    pass_score: passScore,
    v4,
    assets,
    active_run: activeRun,
    successful_run: successfulRun,
    reusable_run: reusableRun,
    completed_run: completion?.run || null,
    completion_v4: completion?.v4 || null,
    publication,
    same_date_runs: runs.sameDateRuns,
    dispatch_output: dispatch?.output || "",
  };
  const reports = writeReports(payload);
  console.log(JSON.stringify({
    ok,
    date,
    action,
    reason,
    report: rel(reports.jsonFile),
    markdown: rel(reports.mdFile),
  }, null, 2));
  if (!ok) process.exit(1);
}

if (args.get("policy-fixtures") === "true") runPolicyFixtures();
else main();
