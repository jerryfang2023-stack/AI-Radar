#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sourceTitleNeedsChineseTranslation } from "./source-title-translation-generator.mjs";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);
const outputDir = path.resolve(root, args.get("output-dir") || path.join("agent-workflow", "reports"));

const date = args.get("date") || shanghaiDate();
const githubMode = args.get("github") || "auto";
const taskMode = args.get("scheduled-task") || "auto";
const forceAfternoonWindow = args.get("force-afternoon-window") === "true";

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

function shanghaiTime(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateValue);
}

function minutesSinceMidnight(value = shanghaiTime()) {
  const [hour, minute] = String(value).split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

export function localPublicationSyncBlocked(localSync = {}) {
  return Boolean(localSync.available && !localSync.clean && !localSync.fastForwarded);
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

function parseFields(text = "") {
  const fields = {};
  for (const line of text.split(/\r?\n/u)) {
    const match = line.match(/^(?:-\s*)?([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!match) {
      continue;
    }
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function statusFromGate(file) {
  return statusFromGateText(readText(file));
}

function statusFromGateText(text = "") {
  if (!text) return "missing";
  const match = text.match(/^- status:\s*([^\r\n]+)/mu);
  return match ? match[1].trim() : "unknown";
}

function readTextFromGit(ref, file, fallback = "") {
  const result = runOptional("git", ["show", `${ref}:${rel(file)}`], 8000);
  return result.ok ? result.stdout : fallback;
}

function readJsonFromGit(ref, file, fallback = null) {
  try {
    return JSON.parse(readTextFromGit(ref, file));
  } catch {
    return fallback;
  }
}

function countFiles(dir, pattern) {
  if (!exists(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countFiles(file, pattern);
    return count + (pattern.test(entry.name) ? 1 : 0);
  }, 0);
}

function listFiles(dir, pattern) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(file, pattern);
    return pattern.test(entry.name) ? [file] : [];
  });
}

function normalizeSourceTitle(value = "") {
  return String(value).trim().replace(/^["']|["']$/gu, "").replace(/\s+/gu, " ");
}

function extractSourceTitle(markdown = "") {
  const match = markdown.match(/^source_title:\s*(.+)$/mu);
  return normalizeSourceTitle(match?.[1] || "");
}

function sourceTitleTranslationDiagnostics(cardFiles = []) {
  const dbFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
  const db = readJson(dbFile, {});
  const translations = new Set((Array.isArray(db.translations) ? db.translations : [])
    .filter((item) => item?.generatedBy !== "mymemory_title_translation")
    .map((item) => normalizeSourceTitle(item.sourceTitle))
    .filter(Boolean));
  const missing = [];
  for (const file of cardFiles) {
    const sourceTitle = extractSourceTitle(readText(file));
    if (!sourceTitleNeedsChineseTranslation(sourceTitle)) continue;
    if (!translations.has(sourceTitle)) missing.push(sourceTitle);
  }
  return {
    translationDb: exists(dbFile) ? rel(dbFile) : "missing",
    missingCount: missing.length,
    missingSourceTitles: [...new Set(missing)].slice(0, 8),
  };
}

function laneStatus(problems, warnings, waiting = []) {
  if (problems.some((item) => item.severity === "manual_required")) return "manual_required";
  if (problems.length) return "failed";
  if (waiting.length) return "waiting";
  if (warnings.length) return "warning";
  return "passed";
}

export function classifyCommunityStages({
  communityDataHealthy,
  dataWaiting = false,
  localWindowPassed,
  published,
  publicationWaiting,
  publishWindowPassed,
  taskAvailable,
  lastTaskResult,
  taskState,
  loginState,
  publicationConfirmed = false,
}) {
  return {
    data: communityDataHealthy ? "healthy" : dataWaiting ? "waiting" : localWindowPassed ? "failed" : "pre_window_waiting",
    publication: published
      ? "published"
      : publicationWaiting
        ? "waiting"
        : !communityDataHealthy && localWindowPassed
          ? "blocked_on_data"
          : publishWindowPassed ? "failed" : "not_due",
    task_execution: !taskAvailable
      ? "unavailable"
      : ["Queued", "Running"].includes(taskState)
        ? taskState.toLowerCase()
      : Number.isFinite(lastTaskResult) && lastTaskResult !== 0
        ? publicationConfirmed ? "passed" : communityDataHealthy ? "anomaly_after_data_success" : "failed"
        : ["Ready", "Running"].includes(taskState) ? "passed" : "failed",
    login: loginState,
  };
}

export function classifyCommunityPublication({
  targetDate,
  originGeneratedDate = "",
  latestRun = null,
  mergedPr = null,
  openPr = null,
}) {
  const publishedOnOriginMain = originGeneratedDate === targetDate;
  return {
    publishedOnOriginMain,
    ready: Boolean(latestRun || mergedPr || openPr || publishedOnOriginMain),
    confirmed: Boolean(
      mergedPr
      || publishedOnOriginMain
      || latestRun?.conclusion === "success"
    ),
  };
}

function addProblem(list, message, severity = "failed") {
  list.push({ message, severity });
}

function addWaiting(list, message) {
  list.push({ message, severity: "waiting" });
}

function repairDataGenerated(lane) {
  if (lane.id === "skill_ops") return "not_applicable";
  if (lane.id === "follow_builders_skill") {
    return Number(lane.evidence?.itemCount || 0) > 0 ? "yes" : "no";
  }
  const category = lane.evidence?.diagnosis?.category || "";
  if (category === "no_run_or_stale_assets") return "no_or_stale";
  if (["raw_card_ingestion_fields", "frontstage_card_contract", "publication", "local_sync", "supervision_observability"].includes(category)) return "yes";
  if (lane.problems.some((item) => /date is|missing .*data file/iu.test(item.message))) return "no_or_stale";
  if (lane.problems.some((item) => /workflow is queued|workflow is in_progress|wait for/iu.test(item.message))) return "unknown";
  return "yes";
}

function repairGate(lane) {
  return lane.evidence.gateReport
    || lane.evidence.qualityGateStatus
    || lane.evidence.readinessReport
    || `${lane.id} daily supervision`;
}

function repairNeededAction(lane) {
  if (lane.evidence?.diagnosis?.neededAction) return lane.evidence.diagnosis.neededAction;
  const action = lane.actions.find((item) => /repair|rerun|manual|wait|dispatch|send codex/iu.test(item))
    || lane.actions[0]
    || "inspect and classify";
  if (/manual dispatch/iu.test(action)) return "manual dispatch";
  if (/wait/iu.test(action)) return "wait and rerun supervision";
  if (/rerun/iu.test(action)) return "rerun gate";
  if (/repair rule/iu.test(action)) return "repair rule";
  return action;
}

function markdownList(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${typeof item === "string" ? item : item.message}`).join("\n");
}

function isTodayOrPast(targetDate) {
  return targetDate <= shanghaiDate();
}

function hasWindowPassed(targetDate, hhmm) {
  if (targetDate < shanghaiDate()) return true;
  if (targetDate > shanghaiDate()) return false;
  const current = minutesSinceMidnight();
  const target = minutesSinceMidnight(hhmm);
  return current !== null && target !== null && current >= target;
}

function runOptional(command, argsList, timeoutMs = 20000) {
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  if (result.error || result.status !== 0) {
    return {
      ok: false,
      stdout: result.stdout || "",
      stderr: result.stderr || result.error?.message || "",
    };
  }
  return { ok: true, stdout: result.stdout || "", stderr: result.stderr || "" };
}

function parseGhJson(result, fallback) {
  if (!result.ok) return fallback;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return fallback;
  }
}

function parseCommandJson(result, fallback = null) {
  try {
    return JSON.parse(result.stdout || "");
  } catch {
    return fallback;
  }
}

function githubWorkflowState(workflowFile, branchHead = "") {
  if (githubMode === "false" || githubMode === "off") {
    return { available: false, skipped: true, warning: "GitHub check skipped by flag" };
  }

  const runResult = runOptional("gh", [
    "run",
    "list",
    "--workflow",
    workflowFile,
    "--limit",
    "20",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch",
  ]);
  if (!runResult.ok) {
    return { available: false, warning: `GitHub CLI unavailable or unauthenticated: ${runResult.stderr.trim() || "unknown error"}` };
  }

  const runs = parseGhJson(runResult, []);
  const sameDateRuns = runs.filter((run) => shanghaiDate(run.createdAt) === date);
  const latest = sameDateRuns[0] || null;

  const prResult = branchHead
    ? runOptional("gh", [
      "pr",
      "list",
      "--state",
      "all",
      "--head",
      branchHead,
      "--json",
      "number,state,isDraft,mergedAt,url,updatedAt",
      "--limit",
      "5",
    ])
    : { ok: true, stdout: "[]" };
  const prs = branchHead ? parseGhJson(prResult, []) : [];

  return {
    available: true,
    latest_run: latest,
    same_date_run_count: sameDateRuns.length,
    prs,
    pr_warning: prResult.ok ? "" : `PR check unavailable: ${prResult.stderr.trim() || "unknown error"}`,
  };
}

function isSupervisionReportStatusLine(line) {
  const file = line.slice(3).trim().split(" -> ").pop().replace(/\\/gu, "/");
  return /^agent-workflow\/reports\/(?:daily-supervision-report-latest|\d{4}-\d{2}-\d{2}-daily-supervision-report)\.(?:json|md)$/u.test(file);
}

function localGitSyncState() {
  const status = runOptional("git", ["status", "--porcelain"], 8000);
  const head = runOptional("git", ["rev-parse", "HEAD"], 8000);
  const origin = runOptional("git", ["rev-parse", "origin/main"], 8000);
  const dirtyLines = status.ok ? status.stdout.split(/\r?\n/u).filter((line) => line.trim()) : [];
  const blockingDirtyLines = dirtyLines.filter((line) => !isSupervisionReportStatusLine(line));
  return {
    available: status.ok && head.ok && origin.ok,
    clean: status.ok ? blockingDirtyLines.length === 0 : null,
    dirtyFiles: status.ok ? blockingDirtyLines.length : null,
    ignoredReportFiles: status.ok ? dirtyLines.length - blockingDirtyLines.length : null,
    head: head.ok ? head.stdout.trim() : "",
    originMain: origin.ok ? origin.stdout.trim() : "",
    fastForwarded: head.ok && origin.ok ? head.stdout.trim() === origin.stdout.trim() : null,
    warning: status.ok ? "" : status.stderr.trim(),
  };
}

function scheduledTaskState(taskName) {
  if (taskMode === "false" || taskMode === "off") {
    return { available: false, skipped: true, warning: "Scheduled task check skipped by flag" };
  }
  if (process.platform !== "win32") {
    return { available: false, warning: "Scheduled task check is Windows-only" };
  }
  const command = [
    "$taskName = '",
    taskName.replace(/'/gu, "''"),
    "';",
    "$task = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop;",
    "$info = Get-ScheduledTaskInfo -TaskName $taskName -ErrorAction Stop;",
    "[pscustomobject]@{",
    "State=$task.State;",
    "LastTaskResult=$info.LastTaskResult;",
    "LastRunTime=$info.LastRunTime;",
    "NextRunTime=$info.NextRunTime",
    "} | ConvertTo-Json -Compress",
  ].join("");
  const result = runOptional("powershell", ["-NoProfile", "-Command", command], 8000);
  if (!result.ok) {
    return { available: false, warning: `Scheduled task unavailable: ${result.stderr.trim() || "unknown error"}` };
  }
  return { available: true, task: parseGhJson(result, null) };
}

function scheduledTaskStateName(value) {
  const map = new Map([
    [0, "Unknown"],
    [1, "Disabled"],
    [2, "Queued"],
    [3, "Ready"],
    [4, "Running"],
  ]);
  const numeric = Number(value);
  if (map.has(numeric)) return map.get(numeric);
  return String(value || "");
}

export function buildBusinessSignalsLane() {
  const problems = [];
  const waiting = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = hasWindowPassed(date, "09:50");

  const dataCenterManifestFile = path.join(root, "01-SiteV2", "site", "data", "data-center-v4", "manifest.json");
  const telemetryFile = path.join(root, "01-SiteV2", "site", "data", "collection-telemetry-v1.json");
  const dataCenterGateFile = path.join(reportsDir, `${date}-data-center-v4-integrity-gate.json`);
  const manifestFile = path.join(reportsDir, `${date}-persistent-asset-manifest.json`);
  const qualityGateFile = path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`);
  const readinessFile = path.join(reportsDir, `${date}-daily-production-chain-readiness.md`);
  const dataCenterManifest = readJson(dataCenterManifestFile, {});
  const telemetry = readJson(telemetryFile, {});
  const dataCenterGate = readJson(dataCenterGateFile, {});
  const persistentManifest = readJson(manifestFile, {});
  const dataCenterDate = dataCenterManifest?.currentDate || "";
  const materializedEventCount = Number(dataCenterManifest?.counts?.events || 0);
  const canonicalEventCount = Number(dataCenterGate?.counts?.canonical_events || 0);
  const dataCenterGatePassed =
    dataCenterGate?.date === date
    && dataCenterGate?.ok === true
    && Array.isArray(dataCenterGate?.failures)
    && dataCenterGate.failures.length === 0;
  const dataCenterPipelinePassed =
    (
      persistentManifest?.date === date
      && persistentManifest?.outcomes?.data_center_v4_build === "success"
      && persistentManifest?.outcomes?.data_center_v4_gate === "success"
      && persistentManifest?.outcomes?.data_center_v4_materialize === "success"
    )
    || (
      telemetry?.meta?.data_date === date
      && telemetry?.v4_gate?.status === "passed"
    );
  const titleTranslations = { missingSourceTitles: [] };
  const gh = githubWorkflowState("daily-persistent-assets-pr.yml", `automation/business-signals-${date}`);
  const pages = githubWorkflowState("github-pages.yml");
  const mergedPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.mergedAt) : null;
  const businessWorkflowActive = gh.latest_run?.status === "queued" || gh.latest_run?.status === "in_progress";
  const pagesActive = pages.latest_run?.status === "queued" || pages.latest_run?.status === "in_progress";
  const publicationClosureWindowPassed = hasWindowPassed(date, "09:50");
  const vaultSync = readJson(path.join(outputDir, `${date}-guanlan-vault-sync.json`), {});
  const localSync = localGitSyncState();

  evidence.titleTranslations = titleTranslations;
  evidence.manifest = exists(manifestFile) ? rel(manifestFile) : "missing";
  evidence.qualityGateStatus = statusFromGate(qualityGateFile);
  evidence.readinessReport = exists(readinessFile) ? rel(readinessFile) : "missing";
  evidence.dataCenterV4 = {
    manifest: exists(dataCenterManifestFile) ? rel(dataCenterManifestFile) : "missing",
    currentDate: dataCenterDate,
    materializedEventCount,
    integrityGate: exists(dataCenterGateFile) ? rel(dataCenterGateFile) : "missing",
    integrityGatePassed: dataCenterGatePassed,
    canonicalEventCount,
    pipelinePassed: dataCenterPipelinePassed,
    telemetry: exists(telemetryFile) ? rel(telemetryFile) : "missing",
    telemetryDate: telemetry?.meta?.data_date || "",
    telemetryGateStatus: telemetry?.v4_gate?.status || "",
  };
  evidence.compatibility = {
    status: "retired_archive",
    production_write: "disabled",
    active_consumers: 0,
    blocking: false,
  };
  evidence.github = gh;
  evidence.publicationClosure = {
    checkpoint: "09:50",
    businessDataSameDate: dataCenterDate === date,
    businessPrMerged: Boolean(mergedPr),
    businessPrUrl: mergedPr?.url || "",
    pagesSuccess: pages.latest_run?.conclusion === "success",
    pagesActive,
    pagesRunUrl: pages.latest_run?.url || "",
    vaultSync: {
      status: vaultSync?.status || "missing",
      sourceCommit: vaultSync?.source_commit || "",
      current: vaultSync?.status === "passed" && vaultSync?.source_commit === localSync.originMain,
    },
    localSync,
  };
  const businessDataHealthy =
    exists(dataCenterManifestFile)
    && dataCenterDate === date
    && exists(dataCenterGateFile)
    && dataCenterGatePassed
    && dataCenterPipelinePassed
    && telemetry?.meta?.data_date === date
    && telemetry?.v4_gate?.status === "passed";
  const failedWorkflowSupersededByPublication = Boolean(
    businessDataHealthy &&
    gh.latest_run?.conclusion &&
    gh.latest_run.conclusion !== "success" &&
    pages.latest_run?.conclusion === "success" &&
    Date.parse(pages.latest_run.createdAt || "") > Date.parse(gh.latest_run.updatedAt || gh.latest_run.createdAt || ""),
  );
  evidence.failedWorkflowSupersededByPublication = failedWorkflowSupersededByPublication;
  evidence.dataHealth = {
    contract: "SITE-V4.3.0 / Data Center V4 canonical production",
    manifestDateMatches: dataCenterDate === date,
    materializedEventCount,
    integrityGatePassed: dataCenterGatePassed,
    canonicalEventCount,
    pipelinePassed: dataCenterPipelinePassed,
    compatibilityStatus: evidence.compatibility.status,
    healthy: businessDataHealthy,
  };
  evidence.diagnosis = {
    category: businessDataHealthy ? "passed" : "supervision_observability",
    reason: businessDataHealthy ? "same-date Data Center V4 canonical data, integrity gate, and materialization are healthy" : "not classified yet",
    neededAction: businessDataHealthy ? "none" : "inspect and classify",
    preRerunChecklist: {
      dataCenterDate,
      materializedEventCount,
      canonicalEventCount,
      dataCenterGatePassed,
      dataCenterPipelinePassed,
      sourceArtifactFreshness: "not_checked_by_daily_supervision",
      missingSourceTitleTranslations: titleTranslations.missingSourceTitles,
      businessPrMerged: Boolean(mergedPr),
      pagesState: pages.latest_run?.conclusion || pages.latest_run?.status || "unknown",
      localDirtyFiles: evidence.publicationClosure.localSync.dirtyFiles,
      localFastForwarded: evidence.publicationClosure.localSync.fastForwarded,
    },
  };

  if (windowPassed) {
    const waitingForBusinessRun = businessWorkflowActive;
    const recordDataProblem = (message) => {
      if (waitingForBusinessRun) warnings.push(`${message}; Business Signals workflow is ${gh.latest_run.status}`);
      else addProblem(problems, message);
    };
    if (!exists(dataCenterManifestFile)) recordDataProblem(`missing Data Center V4 manifest: ${rel(dataCenterManifestFile)}`);
    if (dataCenterDate !== date) recordDataProblem(`Data Center V4 currentDate is ${dataCenterDate || "missing"}, expected ${date}`);
    if (!exists(dataCenterGateFile)) recordDataProblem(`missing Data Center V4 integrity gate: ${rel(dataCenterGateFile)}`);
    if (exists(dataCenterGateFile) && !dataCenterGatePassed) recordDataProblem(`Data Center V4 integrity gate did not pass for ${date}`);
    if (!dataCenterPipelinePassed) recordDataProblem("Data Center V4 build, gate, and materialization outcomes are not all successful");
    if (!exists(telemetryFile)) recordDataProblem(`missing collection telemetry: ${rel(telemetryFile)}`);
    if (exists(telemetryFile) && telemetry?.meta?.data_date !== date) recordDataProblem(`collection telemetry date is ${telemetry?.meta?.data_date || "missing"}, expected ${date}`);
    if (exists(telemetryFile) && telemetry?.v4_gate?.status !== "passed") recordDataProblem(`collection telemetry V4 gate status is ${telemetry?.v4_gate?.status || "missing"}`);
    if (!exists(manifestFile)) warnings.push(`missing same-date persistent asset manifest: ${rel(manifestFile)}`);
    if (evidence.qualityGateStatus === "failed") addProblem(problems, `quality gate failed: ${rel(qualityGateFile)}`);
    if (evidence.qualityGateStatus === "missing") warnings.push(`missing quality gate report: ${rel(qualityGateFile)}`);
    if (evidence.readinessReport === "missing") warnings.push(`missing readiness report: ${rel(readinessFile)}`);
  }

  if (publicationClosureWindowPassed) {
    if (gh.available && !evidence.publicationClosure.businessPrMerged && !gh.latest_run) {
      warnings.push("09:50 publication closure found no merged Business Signals PR and no same-date workflow run");
    }
    if (pagesActive) {
      addWaiting(waiting, `GitHub Pages workflow is ${pages.latest_run.status}; publication closure should wait`);
      actions.push("wait for GitHub Pages workflow completion before declaring publication missing");
    } else if (pages.available && pages.latest_run?.conclusion && pages.latest_run.conclusion !== "success") {
      warnings.push(`latest same-date GitHub Pages workflow conclusion is ${pages.latest_run.conclusion}`);
    } else if (pages.available && !pages.latest_run) {
      warnings.push("09:50 publication closure found no same-date GitHub Pages run");
    }
    if (
      localPublicationSyncBlocked(evidence.publicationClosure.localSync)
      && !evidence.publicationClosure.vaultSync.current
    ) {
      warnings.push(`local main sync is blocked by ${evidence.publicationClosure.localSync.dirtyFiles} dirty file(s); Guanlan Vault refresh remains isolated from the workspace`);
    }
  }

  if (gh.available) {
    if (!gh.latest_run && hasWindowPassed(date, "09:50")) {
      addProblem(problems, "no same-date Business Signals GitHub run after the morning production window", "manual_required");
      actions.push("inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-persistent-assets-pr.yml` only if targeted diagnosis proves no reusable same-date artifacts exist");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addWaiting(waiting, `Business Signals workflow is ${gh.latest_run.status}; downstream tasks should wait`);
      actions.push("wait for Business Signals workflow completion before declaring data missing");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      if (!failedWorkflowSupersededByPublication) {
        if (mergedPr) {
          warnings.push(`latest Business Signals workflow conclusion is ${gh.latest_run.conclusion}, but same-date PR already merged: ${mergedPr.url}`);
        } else if (businessDataHealthy) {
          warnings.push(`latest Business Signals workflow conclusion is ${gh.latest_run.conclusion}, but same-date data and gates are healthy; repair branch / PR / publication only`);
        } else {
          addProblem(problems, `Business Signals workflow conclusion is ${gh.latest_run.conclusion}`);
        }
      }
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (!gh.available && isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (!businessDataHealthy) {
    if (businessWorkflowActive || pagesActive) {
      evidence.diagnosis.category = "supervision_observability";
      evidence.diagnosis.reason = "workflow or Pages is still queued/in_progress";
      evidence.diagnosis.neededAction = "wait for active workflow completion and rerun supervision";
    } else if (!exists(dataCenterManifestFile) || dataCenterDate !== date) {
      evidence.diagnosis.category = "no_run_or_stale_assets";
      evidence.diagnosis.reason = `Data Center V4 currentDate is ${dataCenterDate || "missing"}, expected ${date}`;
      evidence.diagnosis.neededAction = "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow";
    } else if (!dataCenterGatePassed || canonicalEventCount < 1) {
      evidence.diagnosis.category = "data_center_v4_integrity";
      evidence.diagnosis.reason = `Data Center V4 integrity gate passed=${dataCenterGatePassed}, canonical events=${canonicalEventCount}`;
      evidence.diagnosis.neededAction = "repair the failed Data Center V4 claim/event integrity stage and rerun only the owning build/gate/materialization path";
    } else if (!dataCenterPipelinePassed) {
      evidence.diagnosis.category = "data_center_v4_materialization";
      evidence.diagnosis.reason = "persistent manifest does not confirm successful V4 build, gate, and materialization";
      evidence.diagnosis.neededAction = "repair the first unsuccessful V4 pipeline outcome; do not rerun compatibility Card production";
    } else if (evidence.publicationClosure.localSync.available && !evidence.publicationClosure.localSync.clean) {
      evidence.diagnosis.category = "local_sync";
      evidence.diagnosis.reason = `local workspace has ${evidence.publicationClosure.localSync.dirtyFiles} dirty file(s)`;
      evidence.diagnosis.neededAction = "clean or isolate local sync blockers; do not rerun Business generated assets";
    }
  } else if (
    waiting.some((item) => /workflow is queued|workflow is in_progress|Pages workflow is/iu.test(item.message))
    || warnings.some((item) => /workflow conclusion|Pages|publication|manifest|Guanlan Vault|dirty/iu.test(item))
  ) {
    evidence.diagnosis.category = warnings.some((item) => /Guanlan Vault|dirty/iu.test(item)) ? "local_sync" : "publication";
    evidence.diagnosis.reason = "same-date data is healthy; remaining issue is publication/local sync closure";
    evidence.diagnosis.neededAction = "repair publication/local sync closure only; do not rerun Raw/Pool/Card generation";
  }

  if (problems.length && !problems.every((item) => item.severity === "waiting")) {
    actions.push("send Codex a business_signals repair request with failed gate and report path");
  }

  return {
    id: "business_signals",
    label: "Data Center V4 / Business Signals Operations",
    schedule: "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback",
    status: laneStatus(problems, warnings, waiting),
    evidence,
    problems,
    waiting,
    warnings,
    actions: [...new Set(actions)],
  };
}

export function buildFirstLineLane({ github = null } = {}) {
  const problems = [];
  const waiting = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = hasWindowPassed(date, "09:50");
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  const gateFile = path.join(reportsDir, `${date}-follow-builders-data-gate.md`);
  const manifestFile = path.join(reportsDir, `${date}-first-line-viewpoints-manifest.md`);
  const localData = readJson(dataFile, {});
  const localGeneratedDate = shanghaiDate(localData?.meta?.generatedAt || "");
  const publishedData = localGeneratedDate === date ? null : readJsonFromGit("origin/main", dataFile, null);
  const publishedGeneratedDate = shanghaiDate(publishedData?.meta?.generatedAt || "");
  const usePublishedData = localGeneratedDate !== date && publishedGeneratedDate === date;
  const data = usePublishedData ? publishedData : localData;
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const localGateText = readText(gateFile);
  const publishedGateText = usePublishedData || !localGateText ? readTextFromGit("origin/main", gateFile) : "";
  const gateText = usePublishedData ? publishedGateText : localGateText || publishedGateText;
  const localManifestText = readText(manifestFile);
  const publishedManifestText = usePublishedData || !localManifestText ? readTextFromGit("origin/main", manifestFile) : "";
  const manifestText = usePublishedData ? publishedManifestText : localManifestText || publishedManifestText;
  const manifestFields = parseFields(manifestText);
  const manifestHealthy = [
    manifestFields.builders_data,
    manifestFields.builders_gate,
  ].every((value) => value === "success");
  const historicalEvidenceHealthy = date < shanghaiDate() && manifestHealthy && statusFromGateText(gateText) === "passed";
  const gh = github || githubWorkflowState("daily-first-line-viewpoints-pr.yml", `automation/first-line-viewpoints-${date}`);
  const workflowActive = gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued";

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.dataSource = usePublishedData ? "origin/main" : "working_tree";
  evidence.localGeneratedDate = localGeneratedDate;
  evidence.feedGeneratedAt = data?.meta?.feedGeneratedAt || "";
  evidence.remarks = data?.stats?.remarks ?? (Array.isArray(data.remarks) ? data.remarks.length : 0);
  evidence.builders = data?.stats?.builders ?? (Array.isArray(data.builders) ? data.builders.length : 0);
  evidence.gateStatus = statusFromGateText(gateText);
  evidence.gateReport = usePublishedData && publishedGateText
    ? `origin/main:${rel(gateFile)}`
    : localGateText
    ? rel(gateFile)
    : publishedGateText ? `origin/main:${rel(gateFile)}` : "missing";
  evidence.manifest = usePublishedData && publishedManifestText
    ? `origin/main:${rel(manifestFile)}`
    : localManifestText
    ? rel(manifestFile)
    : publishedManifestText ? `origin/main:${rel(manifestFile)}` : "not_required_for_same_day_local_gate";
  evidence.manifestHealthy = manifestHealthy;
  evidence.manifestRequired = date < shanghaiDate();
  evidence.manifestStatus = manifestHealthy
    ? "passed"
    : evidence.manifestRequired ? "missing" : "not_required_for_same_day_local_gate";
  evidence.historicalEvidenceHealthy = historicalEvidenceHealthy;
  evidence.github = gh;

  if (windowPassed) {
    const recordDataProblem = (message) => {
      if (workflowActive) warnings.push(`${message}; First-Line Viewpoints workflow is ${gh.latest_run.status}`);
      else addProblem(problems, message);
    };
    if (!historicalEvidenceHealthy && !exists(dataFile) && !usePublishedData) recordDataProblem(`missing first-line data file: ${rel(dataFile)}`);
    if (!historicalEvidenceHealthy && generatedDate !== date) recordDataProblem(`first-line data date is ${generatedDate || "missing"}, expected ${date}`);
    if (!historicalEvidenceHealthy && Number(evidence.remarks) < 12) recordDataProblem(`remarks count ${evidence.remarks} below 12`);
    if (!historicalEvidenceHealthy && Number(evidence.builders) < 6) recordDataProblem(`builders count ${evidence.builders} below 6`);
    if (evidence.gateStatus === "failed") addProblem(problems, `follow-builders gate failed: ${rel(gateFile)}`);
    if (evidence.gateStatus === "missing") warnings.push(`missing follow-builders gate report: ${rel(gateFile)}`);
  }

  const localDataHealthy = historicalEvidenceHealthy || (
    (exists(dataFile) || usePublishedData) &&
    generatedDate === date &&
    Number(evidence.remarks) >= 12 &&
    Number(evidence.builders) >= 6 &&
    evidence.gateStatus !== "failed"
  );
  evidence.localDataHealthy = localDataHealthy;

  if (gh.available && !localDataHealthy) {
    if (!gh.latest_run && hasWindowPassed(date, "09:50")) {
      addProblem(problems, "no same-date First-Line Viewpoints RSS run after the morning production window", "manual_required");
      actions.push("inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` only after targeted diagnosis");
    } else if (workflowActive) {
      addWaiting(waiting, `First-Line Viewpoints workflow is ${gh.latest_run.status}; data checks should wait`);
      actions.push("wait for First-Line Viewpoints workflow completion before declaring data missing");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      addProblem(problems, `First-Line Viewpoints workflow conclusion is ${gh.latest_run.conclusion}`);
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (gh.available && localDataHealthy && gh.pr_warning) {
    warnings.push(gh.pr_warning);
  } else if (!gh.available && isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (problems.length) {
    actions.push("send Codex a first_line_viewpoints repair request with gate report path");
  }

  return {
    id: "first_line_viewpoints",
    label: "First-Line Viewpoints",
    schedule: "08:30 local RSS collection + page build; 09:15 conditional fallback; 09:50 consolidated closure",
    status: laneStatus(problems, warnings, waiting),
    evidence,
    problems,
    waiting,
    warnings,
    actions: [...new Set(actions)],
  };
}

export function buildFollowBuildersSkillLane() {
  const problems = [];
  const waiting = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = forceAfternoonWindow || hasWindowPassed(date, "16:30");
  const outputFile = path.join(root, "01-SiteV2", "content", "07-points", `${date}-builders-viewpoints.md`);
  const reportFile = path.join(reportsDir, `${date}-follow-builders-skill-local-publish.md`);
  const localOutputText = readText(outputFile);
  const localReportText = readText(reportFile);
  const publishedOutputText = localOutputText ? "" : readTextFromGit("origin/main", outputFile);
  const publishedReportText = localReportText ? "" : readTextFromGit("origin/main", reportFile);
  const outputText = localOutputText || publishedOutputText;
  const reportText = localReportText || publishedReportText;
  const outputExists = Boolean(outputText);
  const reportExists = Boolean(reportText);
  const reportFields = parseFields(reportText);
  const itemCount = (outputText.match(/^## BP-\d{8}-\d{2}\b/mgu) || []).length;
  const outputFrontmatterCount = Number((outputText.match(/^builder_items_count:\s*(\d+)/mu) || [])[1] || 0);
  const reportCount = Number(reportFields.builder_items_count || 0);
  const publishStatus = reportFields.publish_status || "";
  let publishError = reportFields.publish_error || "";
  try {
    publishError = publishError ? JSON.parse(publishError) : "";
  } catch {
    publishError = String(publishError || "").replace(/^["']|["']$/gu, "");
  }

  evidence.outputFile = localOutputText
    ? rel(outputFile)
    : publishedOutputText ? `origin/main:${rel(outputFile)}` : "missing";
  evidence.reportFile = localReportText
    ? rel(reportFile)
    : publishedReportText ? `origin/main:${rel(reportFile)}` : "missing";
  evidence.dataSource = localOutputText || localReportText
    ? "working_tree"
    : publishedOutputText || publishedReportText ? "origin/main" : "missing";
  evidence.itemCount = itemCount;
  evidence.outputFrontmatterCount = outputFrontmatterCount;
  evidence.reportCount = reportCount;
  evidence.publishStatus = publishStatus || (reportExists ? "not_recorded" : "missing");
  evidence.publishError = publishError;
  evidence.guanlanVaultProjection = reportFields.guanlan_vault_projection || "local_after_main_sync";

  if (windowPassed) {
    if (!outputExists) addProblem(problems, `missing follow-builders skill output file: ${rel(outputFile)}`);
    if (itemCount <= 0) addProblem(problems, `follow-builders skill output item count ${itemCount} below 1`);
    if (reportExists && reportCount <= 0) {
      addProblem(problems, `follow-builders skill report count ${reportCount} below 1`);
    }
    if (outputExists && outputFrontmatterCount > 0 && outputFrontmatterCount !== itemCount) {
      addProblem(problems, `follow-builders skill output frontmatter count ${outputFrontmatterCount} does not match heading count ${itemCount}`);
    }
    if (reportExists && reportCount > 0 && itemCount > 0 && reportCount !== itemCount) {
      addProblem(problems, `follow-builders skill report count ${reportCount} does not match output count ${itemCount}`);
    }
    if (reportExists && publishStatus === "failed") {
      const category = /prepare-digest|generate-builders|terminated|skill script|feed/iu.test(publishError)
        ? "afternoon_skill_runner"
        : "afternoon_publication_failure";
      addProblem(problems, `follow-builders skill publish failed: ${publishError || rel(reportFile)}`);
      evidence.diagnosis = {
        category,
        reason: publishError || "publish report recorded publish_status: failed",
        neededAction: category === "afternoon_skill_runner"
          ? "repair the local follow-builders skill runner or feed preparation before rerunning afternoon publish"
          : "repair branch / PR / merge / Pages publication closure before rerunning afternoon publish",
      };
    }
  }
  if (!reportExists && windowPassed) {
    addProblem(problems, "no same-date follow-builders skill publish report after 16:30 watchdog", "manual_required");
    actions.push("run `powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-follow-builders-skill.ps1` locally");
    evidence.diagnosis = {
      category: "afternoon_skill_runner",
      reason: "same-date local publish report is missing after the afternoon watchdog window",
      neededAction: "run the local follow-builders skill publisher and inspect the generated publish report",
    };
  }
  if (windowPassed && !reportExists) {
    warnings.push("follow-builders skill publish report is missing before Hermes record time");
  }
  if (!windowPassed && (!outputExists || !reportExists)) {
    addWaiting(waiting, "awaiting the 16:10 follow-builders skill publish and 16:30 Hermes record window");
  }

  if (problems.length) {
    if (!evidence.diagnosis) {
      evidence.diagnosis = {
        category: problems.some((item) => /publish failed|publish_status|PR|merge|branch|Pages/iu.test(item.message))
          ? "afternoon_publication_failure"
          : "afternoon_count_mismatch",
        reason: problems[0]?.message || "follow-builders skill lane failed",
        neededAction: "inspect the afternoon publish report, output count, and publication status",
      };
    }
    actions.push("send Codex a follow_builders_skill repair request with publish report path");
  }

  return {
    id: "follow_builders_skill",
    label: "First-Line Viewpoints Skill",
    schedule: "16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45",
    status: laneStatus(problems, warnings, waiting),
    evidence,
    problems,
    waiting,
    warnings,
    actions: [...new Set(actions)],
  };
}

export function classifyCommunityTaskResult({ lastResult, dataHealthy, publicationConfirmed, taskState = "" }) {
  if (taskState === "Running") return "running";
  if (!Number.isFinite(lastResult) || lastResult === 0) return "passed";
  if (!dataHealthy) return "problem";
  return publicationConfirmed ? "published" : "warning";
}

function scheduledTaskRunDate(value) {
  const serializedDate = String(value || "");
  const powershellDate = serializedDate.match(/^\/Date\((\d+)(?:[+-]\d+)?\)\/$/u);
  return shanghaiDate(powershellDate ? Number(powershellDate[1]) : value);
}

export function communityTaskPending({
  targetDate,
  currentDate = shanghaiDate(),
  taskAvailable,
  taskState,
  lastRunTime,
}) {
  if (!taskAvailable || targetDate !== currentDate) return false;
  if (taskState === "Queued") return true;
  return taskState === "Running" && scheduledTaskRunDate(lastRunTime) === targetDate;
}

export function communityPublicationMissingIsProblem({
  communityDataHealthy,
  publicationReady,
  publishWindowPassed,
  taskPending,
}) {
  return communityDataHealthy && !publicationReady && publishWindowPassed && !taskPending;
}

export function buildCommunityLane({ scheduledTask = null, github = null } = {}) {
  const problems = [];
  const waiting = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const localWindowPassed = hasWindowPassed(date, "08:45");
  const publishWindowPassed = hasWindowPassed(date, "09:50");
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
  const gateFile = path.join(outputDir, `${date}-community-intelligence-gate.md`);
  const communityLogFile = path.join(
    outputDir,
    "community-intelligence",
    `community-intelligence-${date.replaceAll("-", "")}.log`,
  );
  const communityLog = readText(communityLogFile);
  const lastLoginRequiredAt = Math.max(
    communityLog.lastIndexOf("COMMUNITY_LOGIN_REQUIRED"),
    communityLog.lastIndexOf("MANUAL_ACTION_REQUIRED"),
  );
  const lastCompletedAt = communityLog.lastIndexOf("Community intelligence run completed.");
  const loginRequired = lastLoginRequiredAt >= 0 && lastLoginRequiredAt > lastCompletedAt;
  const localData = readJson(dataFile, {});
  const localGeneratedDate = shanghaiDate(localData?.meta?.generatedAt || "");
  const publishedData = readJsonFromGit("origin/main", dataFile, null);
  const publishedGeneratedDate = shanghaiDate(publishedData?.meta?.generatedAt || "");
  const usePublishedData = localGeneratedDate !== date && publishedGeneratedDate === date;
  const data = usePublishedData ? publishedData : localData;
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const task = scheduledTask || scheduledTaskState("WaveSight Community Intelligence Daily");
  const taskState = task.available ? scheduledTaskStateName(task.task?.State) : "";
  const taskPending = communityTaskPending({
    targetDate: date,
    taskAvailable: task.available,
    taskState,
    lastRunTime: task.task?.LastRunTime,
  });
  const gh = github || githubWorkflowState("daily-community-intelligence-pr.yml", `automation/community-intelligence-${date}`);
  const mergedPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.mergedAt) : null;
  const openPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.state === "OPEN") : null;
  const publication = classifyCommunityPublication({
    targetDate: date,
    originGeneratedDate: publishedGeneratedDate,
    latestRun: gh.latest_run,
    mergedPr,
    openPr,
  });
  const publicationReady = publication.ready;
  const publicationConfirmed = publication.confirmed;
  const publishedGateText = usePublishedData ? readTextFromGit("origin/main", gateFile) : "";

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.dataSource = usePublishedData ? "origin/main" : "working_tree";
  evidence.localGeneratedDate = localGeneratedDate;
  evidence.items = Array.isArray(data.items) ? data.items.length : 0;
  evidence.links = Array.isArray(data.links) ? data.links.length : 0;
  evidence.selectedKeywords = Array.isArray(data?.meta?.selectedKeywords) ? data.meta.selectedKeywords.length : 0;
  evidence.collectorErrors = Array.isArray(data?.meta?.errors) ? data.meta.errors.length : 0;
  evidence.gateStatus = usePublishedData ? statusFromGateText(publishedGateText) : statusFromGate(gateFile);
  evidence.gateReport = usePublishedData && publishedGateText
    ? `origin/main:${rel(gateFile)}`
    : exists(gateFile) ? rel(gateFile) : "missing";
  evidence.scheduledTask = task;
  evidence.scheduledTask.stateName = taskState;
  evidence.scheduledTask.pendingSameDate = taskPending;
  evidence.github = gh;
  evidence.publication = {
    communityPrMerged: Boolean(mergedPr),
    communityPrOpen: Boolean(openPr),
    communityPrUrl: mergedPr?.url || openPr?.url || "",
    publishedOnOriginMain: publication.publishedOnOriginMain,
  };
  const communityDataHealthy =
    (exists(dataFile) || usePublishedData) &&
    generatedDate === date &&
    evidence.items >= 12 &&
    evidence.links >= 3 &&
    evidence.collectorErrors === 0 &&
    evidence.gateStatus === "passed";
  evidence.login = {
    state: loginRequired ? "manual_relogin_required" : communityDataHealthy ? "healthy" : "unknown",
    log: exists(communityLogFile) ? rel(communityLogFile) : "missing",
  };

  if (usePublishedData) {
    warnings.push(`local community data is ${localGeneratedDate || "missing"}; using passed ${date} publication from origin/main`);
  }

  if (localWindowPassed && !taskPending) {
    if (!exists(dataFile) && !usePublishedData) addProblem(problems, `missing community data file: ${rel(dataFile)}`);
    if (generatedDate !== date) addProblem(problems, `community data date is ${generatedDate || "missing"}, expected ${date}`);
    if (evidence.items < 12) addProblem(problems, `community item count ${evidence.items} below 12`);
    if (evidence.links < 3) addProblem(problems, `community deduped links ${evidence.links} below 3`);
    if (evidence.collectorErrors > 0) addProblem(problems, `community collector recorded ${evidence.collectorErrors} blocking error(s)`);
    if (evidence.gateStatus !== "passed") {
      addProblem(problems, `community gate ${evidence.gateStatus}: ${rel(gateFile)}`);
      actions.push("repair the local community gate report and rerun validation before publication");
    }
  }

  if (task.available) {
    const lastResult = Number(task.task?.LastTaskResult);
    if (taskPending) {
      const pendingState = taskState.toLowerCase();
      evidence.scheduledTask.lastResultStatus = pendingState;
      addWaiting(waiting, `Community Intelligence same-date scheduled task is ${pendingState}`);
      actions.push("wait for the same-date Community Intelligence task to finish, then rerun supervision");
    } else {
      if (taskState !== "Ready") {
        addProblem(problems, `community scheduled task state is ${taskState || "unknown"}`, "manual_required");
      }
      const taskResultStatus = classifyCommunityTaskResult({
        lastResult,
        dataHealthy: communityDataHealthy,
        publicationConfirmed,
      });
      evidence.scheduledTask.lastResultStatus = taskResultStatus;
      if (taskResultStatus === "warning") {
        warnings.push(`community scheduled task last result is ${lastResult}, but same-date data and gate are healthy`);
      } else if (taskResultStatus === "problem") {
        addProblem(problems, `community scheduled task last result is ${lastResult}`, "manual_required");
      }
    }
  } else {
    warnings.push(task.warning || "scheduled task state unavailable");
  }

  if (loginRequired) {
    const message = "Community Intelligence login expired; open the dedicated Chrome profile, complete QR/login verification, then rerun the local collector";
    if (communityDataHealthy) {
      warnings.push(message);
    } else {
      addProblem(problems, message, "manual_required");
    }
    actions.push("打开社群情报专用 Chrome 配置完成扫码/登录验证，再重新运行本地社群情报任务；不要阻断其他栏目");
  }

  if (gh.available) {
    if (communityPublicationMissingIsProblem({
      communityDataHealthy,
      publicationReady,
      publishWindowPassed,
      taskPending,
    })) {
      addProblem(problems, "no same-date Community Intelligence publish workflow after the morning publication window", "manual_required");
      actions.push("inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass");
    } else if (!gh.latest_run && openPr) {
      addWaiting(waiting, `Community Intelligence publication PR is open: ${openPr.url}`);
      actions.push("wait for Community Intelligence PR merge before declaring publication missing");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addWaiting(waiting, `Community Intelligence publish workflow is ${gh.latest_run.status}`);
      actions.push("wait for Community Intelligence publish workflow completion");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      if (mergedPr) {
        warnings.push(`latest Community Intelligence publish workflow conclusion is ${gh.latest_run.conclusion}, but same-date PR already merged: ${mergedPr.url}`);
      } else if (communityDataHealthy) {
        addProblem(problems, `Community Intelligence publish workflow conclusion is ${gh.latest_run.conclusion} after healthy same-date data; repair publish workflow only`);
      } else {
        addProblem(problems, `Community Intelligence publish workflow conclusion is ${gh.latest_run.conclusion}`);
      }
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  const lastTaskResult = task.available ? Number(task.task?.LastTaskResult) : null;
  evidence.stageStatus = classifyCommunityStages({
    communityDataHealthy,
    dataWaiting: taskPending,
    localWindowPassed,
    published: publicationConfirmed,
    publicationWaiting: Boolean(taskPending || openPr || ["queued", "in_progress"].includes(gh.latest_run?.status)),
    publishWindowPassed,
    taskAvailable: task.available,
    lastTaskResult,
    taskState,
    loginState: evidence.login.state,
    publicationConfirmed,
  });

  if (localWindowPassed && generatedDate !== date && !taskPending) {
    actions.push("rerun `agent-workflow/tools/run-community-intelligence.ps1` locally");
  }
  if (problems.length) {
    actions.push("send Codex a community_intelligence repair request with log and gate report path");
  }

  return {
    id: "community_intelligence",
    label: "Community Intelligence",
    schedule: "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure",
    status: laneStatus(problems, warnings, waiting),
    evidence,
    problems,
    waiting,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildSkillOpsLane() {
  const problems = [];
  const warnings = [];
  const actions = [];
  const runtimeDashboard = path.join(outputDir, "local-skill-store-data.js");
  const dashboardArgs = args.has("output-dir") && exists(runtimeDashboard)
    ? [`--dashboard=${runtimeDashboard}`]
    : [];
  const result = runOptional("node", ["agent-workflow/tools/check-skill-ops.mjs", "--json", ...dashboardArgs], 20000);
  const check = parseCommandJson(result, null);
  const summary = check?.summary || {};
  const evidence = {
    command: "npm run check:skill-ops",
    dashboardPath: dashboardArgs.length ? rel(runtimeDashboard) : "01-SiteV2/site/data/local-skill-store-data.js",
    registryState: summary.registryState || "unknown",
    governed: summary.governed ?? null,
    current: summary.current ?? null,
    laneOwners: summary.laneOwners ?? null,
    syncDrift: summary.syncDrift ?? null,
    dashboardState: summary.dashboardState || "unknown",
    dashboardErrors: Array.isArray(check?.dashboard?.errors) ? check.dashboard.errors : [],
    evalCoverage: summary.evalCoverage ?? null,
    exampleCoverage: summary.exampleCoverage ?? null,
    memoryRequiredMissing: summary.memoryRequiredMissing ?? null,
    discoveryState: summary.discoveryState || "unknown",
    discoveryAvailable: summary.discoveryAvailable ?? false,
    discoveredSkills: summary.discoveredSkills ?? null,
    enabledSkills: summary.enabledSkills ?? null,
    disabledSkills: summary.disabledSkills ?? null,
    invalidSkillManifests: summary.invalidSkillManifests ?? null,
    enabledDuplicateSkillNames: summary.enabledDuplicateSkillNames ?? null,
    discoveryErrors: Array.isArray(check?.discovery?.errors) ? check.discovery.errors : [],
  };

  if (!check) {
    addProblem(problems, `Skill Ops check did not return JSON: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`, "manual_required");
  } else if (!check.ok) {
    for (const error of check.errors || []) addProblem(problems, error, "manual_required");
  }
  if (!result.ok && check?.ok) warnings.push(result.stderr.trim() || "Skill Ops check returned a non-zero status without blocking errors");

  if (problems.length) {
    actions.push("repair the owning Guanlan skill metadata, evals, examples, registry, repo runtime, discovery config, or compatibility mirror");
    if (summary.syncDrift) {
      actions.push("run `npm run repair:skills` after confirming the project copy is the source of truth");
    } else {
      actions.push("run `npm run audit:skills` after the repair");
    }
  }

  return {
    id: "skill_ops",
    label: "Skill Ops Governance",
    schedule: "daily supervision preflight",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function aggregateStatus(lanes) {
  if (lanes.some((lane) => lane.status === "failed")) return "failed";
  if (lanes.some((lane) => lane.status === "manual_required")) return "manual_required";
  if (lanes.some((lane) => lane.status === "waiting")) return "waiting";
  if (lanes.some((lane) => lane.status === "warning")) return "warning";
  return "passed";
}

function repairRequest(lane) {
  if (!lane.problems.length) return "none";
  return [
    `lane: ${lane.id}`,
    `failed_gate: ${repairGate(lane)}`,
    `report_path: ${path.join(outputDir, `${date}-daily-supervision-report.md`)}`,
    `data_generated: ${repairDataGenerated(lane)}`,
    `needed_action: ${repairNeededAction(lane)}`,
  ].join("\n");
}

function writeReports(payload) {
  fs.mkdirSync(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, `${date}-daily-supervision-report.json`);
  const mdPath = path.join(outputDir, `${date}-daily-supervision-report.md`);
  const latestJsonPath = path.join(outputDir, "daily-supervision-report-latest.json");
  const latestMdPath = path.join(outputDir, "daily-supervision-report-latest.md");

  const tableRows = payload.lanes.map((lane) => (
    `| ${lane.label} | ${lane.schedule} | ${lane.status} | ${lane.problems.length} | ${lane.waiting?.length || 0} | ${lane.warnings.length} |`
  ));
  const laneBlocks = payload.lanes.map((lane) => [
    `## ${lane.label}`,
    "",
    `- status: ${lane.status}`,
    `- schedule: ${lane.schedule}`,
    "",
    "### Problems",
    "",
    markdownList(lane.problems),
    "",
    "### Waiting",
    "",
    markdownList(lane.waiting || []),
    "",
    "### Warnings",
    "",
    markdownList(lane.warnings),
    "",
    "### Actions",
    "",
    markdownList(lane.actions),
    "",
    "### Repair Request",
    "",
    "```text",
    repairRequest(lane),
    "```",
  ].join("\n"));

  const md = [
    `# WaveSight Daily Supervision - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- github_mode: ${githubMode}`,
    `- scheduled_task_mode: ${taskMode}`,
    "",
    "| Lane | Timeline | Status | Problems | Waiting | Warnings |",
    "|---|---|---|---:|---:|---:|",
    ...tableRows,
    "",
    ...laneBlocks,
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  if (!["false", "off"].includes(String(githubMode).toLowerCase())) {
    runOptional("git", ["fetch", "origin", "main"], 20000);
  }
  const lanes = [
    buildSkillOpsLane(),
    buildCommunityLane(),
    buildBusinessSignalsLane(),
    buildFirstLineLane(),
    buildFollowBuildersSkillLane(),
  ];
  const status = aggregateStatus(lanes);
  const payload = {
    ok: status === "passed" || status === "warning" || status === "waiting",
    status,
    date,
    generated_at: new Date().toISOString(),
    timezone: "Asia/Shanghai",
    lanes,
  };
  const { jsonPath, mdPath } = writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(jsonPath),
    markdown: rel(mdPath),
  }, null, 2));
  if (status === "failed") process.exit(1);
}

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (executedFile === fileURLToPath(import.meta.url)) {
  main();
}
