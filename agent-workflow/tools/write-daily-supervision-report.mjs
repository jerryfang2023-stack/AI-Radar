#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const inboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const githubMode = args.get("github") || "auto";
const taskMode = args.get("scheduled-task") || "auto";

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
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!match) {
      if (line.trim().startsWith("#")) break;
      continue;
    }
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function statusFromGate(file) {
  const text = readText(file);
  if (!text) return "missing";
  const match = text.match(/^- status:\s*([^\r\n]+)/mu);
  return match ? match[1].trim() : "unknown";
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
    .map((item) => normalizeSourceTitle(item.sourceTitle))
    .filter(Boolean));
  const missing = [];
  for (const file of cardFiles) {
    const sourceTitle = extractSourceTitle(readText(file));
    if (!sourceTitle || !/[A-Za-z]{3}/u.test(sourceTitle)) continue;
    if (!translations.has(sourceTitle)) missing.push(sourceTitle);
  }
  return {
    translationDb: exists(dbFile) ? rel(dbFile) : "missing",
    missingCount: missing.length,
    missingSourceTitles: [...new Set(missing)].slice(0, 8),
  };
}

function laneStatus(problems, warnings) {
  if (problems.some((item) => item.severity === "manual_required")) return "manual_required";
  if (problems.length && problems.every((item) => item.severity === "waiting")) return "waiting";
  if (problems.length) return "failed";
  if (warnings.length) return "warning";
  return "passed";
}

function addProblem(list, message, severity = "failed") {
  list.push({ message, severity });
}

function slug(value = "") {
  const text = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 80);
  return text || "repair";
}

function shanghaiTimestamp(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(dateValue);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}+08:00`;
}

function incidentCategories(lane) {
  if (lane.id === "business_signals" && lane.evidence?.diagnosis?.category) {
    const categories = [lane.evidence.diagnosis.category];
    if (lane.evidence.diagnosis.category !== "monitor_or_gate_failure" && lane.problems.some((item) => /quality gate|workflow|gate failed/iu.test(item.message))) {
      categories.push("monitor_or_gate_failure");
    }
    return [...new Set(categories)];
  }

  const haystack = [
    lane.id,
    lane.status,
    ...lane.problems.map((item) => item.message || item),
    ...lane.warnings.map((item) => item.message || item),
    ...lane.actions,
  ].join("\n").toLowerCase();
  const categories = new Set();

  if (/top\s*10|top10|frontstage\s*selected|selected count/iu.test(haystack)) categories.add("business_signals_top10_missing");
  if (/source[_ -]?first|source_first|frontstage gate/iu.test(haystack)) categories.add("source_first_frontstage_gate");
  if (/title|标题|mojibake|乱码|untranslated|未翻译|translation/iu.test(haystack)) categories.add("frontstage_title_translation");
  if (/detail|详情|visible fragment|source-backed|内容不对|wrong content/iu.test(haystack)) categories.add("frontstage_detail_content");
  if (/quality gate|monitor|监测|workflow conclusion|failed|gate failed|manual dispatch|same-date .*run/iu.test(haystack)) categories.add("monitor_or_gate_failure");
  if (/obsidian|timeline|sync/iu.test(haystack)) categories.add("obsidian_sync");
  if (/community/iu.test(haystack)) categories.add("community_intelligence");
  if (/first-line|builders|follow-builders/iu.test(haystack)) categories.add("first_line_viewpoints");
  if (/skill[_ -]?ops|skill registry|skill-store|\.skill-store|guanlan skill|evals|examples/iu.test(haystack)) categories.add("skill_ops");

  if (!categories.size) categories.add(slug(lane.problems[0]?.message || lane.actions[0] || lane.id));
  return [...categories];
}

function repairDataGenerated(lane) {
  if (lane.id === "skill_ops") return "not_applicable";
  const category = lane.evidence?.diagnosis?.category || "";
  if (category === "no_run_or_stale_assets") return "no_or_stale";
  if (["translation_title", "top10_contract", "publication", "local_sync", "supervision_observability"].includes(category)) return "yes";
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

function buildBusinessSignalsLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = hasWindowPassed(date, "09:45");

  const dataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
  const graphFile = path.join(root, "01-SiteV2", "site", "data", "intelligence-graph-index.json");
  const manifestFile = path.join(reportsDir, `${date}-persistent-asset-manifest.json`);
  const qualityGateFile = path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`);
  const readinessFile = path.join(reportsDir, `${date}-daily-production-chain-readiness.md`);
  const data = readJson(dataFile, {});
  const activeDate = data?.meta?.activeDate || "";
  const selection = Array.isArray(data.frontstageSelection)
    ? data.frontstageSelection.find((item) => item.date === date)
    : null;
  const top10 = Array.isArray(data.top10) ? data.top10 : [];
  const sameDateTop10 = top10.filter((card) => !card?.date || card.date === date);
  const sameDateCards = Array.isArray(data.frontstageCards)
    ? data.frontstageCards.filter((card) => card.date === date)
    : [];
  const signalCardRoot = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards");
  const cardFileList = listFiles(signalCardRoot, new RegExp(`^${date}--signal--.*\\.md$`, "u"));
  const cardFiles = cardFileList.length;
  const titleTranslations = sourceTitleTranslationDiagnostics(cardFileList);
  const gh = githubWorkflowState("daily-persistent-assets-pr.yml", `automation/business-signals-${date}`);
  const pages = githubWorkflowState("github-pages.yml");
  const mergedPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.mergedAt) : null;
  const pagesActive = pages.latest_run?.status === "queued" || pages.latest_run?.status === "in_progress";
  const publicationClosureWindowPassed = hasWindowPassed(date, "10:50");

  evidence.activeDate = activeDate;
  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.publicTop10Count = sameDateTop10.length;
  evidence.frontstageSelected = selection?.selectedCount ?? sameDateCards.length;
  evidence.supplyConstrained = selection?.supplyConstrained ?? null;
  evidence.coreCandidateCount = selection?.coreCandidateCount ?? null;
  evidence.qualifiedCount = selection?.qualifiedCount ?? null;
  evidence.signalCardFiles = cardFiles;
  evidence.titleTranslations = titleTranslations;
  evidence.manifest = exists(manifestFile) ? rel(manifestFile) : "missing";
  evidence.qualityGateStatus = statusFromGate(qualityGateFile);
  evidence.readinessReport = exists(readinessFile) ? rel(readinessFile) : "missing";
  evidence.github = gh;
  evidence.publicationClosure = {
    checkpoint: "10:50",
    businessDataSameDate: activeDate === date,
    top10Count: selection?.selectedCount ?? sameDateCards.length,
    businessPrMerged: Boolean(mergedPr),
    businessPrUrl: mergedPr?.url || "",
    pagesSuccess: pages.latest_run?.conclusion === "success",
    pagesActive,
    pagesRunUrl: pages.latest_run?.url || "",
    localSync: localGitSyncState(),
  };
  const selectedCount = selection?.selectedCount ?? sameDateCards.length;
  const businessDataHealthy =
    exists(dataFile) &&
    exists(graphFile) &&
    activeDate === date &&
    sameDateTop10.length === 10 &&
    cardFiles >= 10 &&
    evidence.qualityGateStatus === "passed";
  evidence.dataHealth = {
    dataFile: exists(dataFile) ? rel(dataFile) : "missing",
    graphFile: exists(graphFile) ? rel(graphFile) : "missing",
    activeDateMatches: activeDate === date,
    publicTop10Count: sameDateTop10.length,
    frontstageSelected: selectedCount,
    signalCardFiles: cardFiles,
    qualityGateStatus: evidence.qualityGateStatus,
    healthy: businessDataHealthy,
  };
  evidence.diagnosis = {
    category: businessDataHealthy ? "passed" : "supervision_observability",
    reason: businessDataHealthy ? "same-date Business data, public Top10, Cards, graph, and gate are healthy" : "not classified yet",
    neededAction: businessDataHealthy ? "none" : "inspect and classify",
    preRerunChecklist: {
      activeDate,
      publicTop10Count: sameDateTop10.length,
      frontstageSelected: selectedCount,
      signalCardFiles: cardFiles,
      rawCount: null,
      poolCount: null,
      routedPoolCount: null,
      corePoolCount: evidence.coreCandidateCount,
      nonLargeCorePoolCount: null,
      sourceArtifactFreshness: "not_checked_by_daily_supervision",
      missingSourceTitleTranslations: titleTranslations.missingSourceTitles,
      businessPrMerged: Boolean(mergedPr),
      pagesState: pages.latest_run?.conclusion || pages.latest_run?.status || "unknown",
      localDirtyFiles: evidence.publicationClosure.localSync.dirtyFiles,
      localFastForwarded: evidence.publicationClosure.localSync.fastForwarded,
    },
  };

  if (windowPassed) {
    if (!exists(dataFile)) addProblem(problems, `missing business-signal data file: ${rel(dataFile)}`);
    if (activeDate !== date) addProblem(problems, `business-signal activeDate is ${activeDate || "missing"}, expected ${date}`);
    if (!exists(graphFile)) addProblem(problems, `missing intelligence map data: ${rel(graphFile)}`);
    if (sameDateTop10.length !== 10) {
      addProblem(problems, `public Top10 count is ${sameDateTop10.length}, expected 10`);
    }
    if (selection?.supplyConstrained) {
      if (selectedCount !== 10 || evidence.qualityGateStatus !== "passed") {
        addProblem(problems, "frontstage selection is supply constrained");
      } else {
        warnings.push("frontstage selection reported supply constrained after a valid Top10 and passed gates; treat as supply warning, not data failure");
      }
    }
    if (cardFiles < 10) addProblem(problems, `signal card files ${cardFiles} below 10`);
    if (!exists(manifestFile)) warnings.push(`missing same-date persistent asset manifest: ${rel(manifestFile)}`);
    if (evidence.qualityGateStatus === "failed") addProblem(problems, `quality gate failed: ${rel(qualityGateFile)}`);
    if (evidence.qualityGateStatus === "missing") warnings.push(`missing quality gate report: ${rel(qualityGateFile)}`);
    if (evidence.readinessReport === "missing") warnings.push(`missing readiness report: ${rel(readinessFile)}`);
  }

  if (publicationClosureWindowPassed) {
    if (gh.available && !evidence.publicationClosure.businessPrMerged && !gh.latest_run) {
      warnings.push("10:50 publication closure found no merged Business Signals PR and no same-date workflow run");
    }
    if (pagesActive) {
      addProblem(problems, `GitHub Pages workflow is ${pages.latest_run.status}; publication closure should wait`, "waiting");
      actions.push("wait for GitHub Pages workflow completion before declaring publication missing");
    } else if (pages.available && pages.latest_run?.conclusion && pages.latest_run.conclusion !== "success") {
      warnings.push(`latest same-date GitHub Pages workflow conclusion is ${pages.latest_run.conclusion}`);
    } else if (pages.available && !pages.latest_run) {
      warnings.push("10:50 publication closure found no same-date GitHub Pages run");
    }
    if (evidence.publicationClosure.localSync.available && !evidence.publicationClosure.localSync.clean) {
      warnings.push(`local Obsidian sync may be blocked by ${evidence.publicationClosure.localSync.dirtyFiles} dirty file(s)`);
    }
  }

  if (gh.available) {
    if (!gh.latest_run && hasWindowPassed(date, "09:55")) {
      addProblem(problems, "no same-date Business Signals GitHub run after 09:55 Hermes early handoff", "manual_required");
      actions.push("run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-persistent-assets-pr.yml` for the production date");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `Business Signals workflow is ${gh.latest_run.status}; downstream tasks should wait`, "waiting");
      actions.push("wait for Business Signals workflow completion before declaring data missing");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      if (mergedPr) {
        warnings.push(`latest Business Signals workflow conclusion is ${gh.latest_run.conclusion}, but same-date PR already merged: ${mergedPr.url}`);
      } else if (businessDataHealthy) {
        warnings.push(`latest Business Signals workflow conclusion is ${gh.latest_run.conclusion}, but same-date data and gates are healthy; repair branch / PR / publication only`);
      } else {
        addProblem(problems, `Business Signals workflow conclusion is ${gh.latest_run.conclusion}`);
      }
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (!gh.available && isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (!businessDataHealthy) {
    if (!exists(dataFile) || activeDate !== date) {
      evidence.diagnosis.category = "no_run_or_stale_assets";
      evidence.diagnosis.reason = `activeDate is ${activeDate || "missing"}, expected ${date}`;
      evidence.diagnosis.neededAction = "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow";
    } else if (cardFiles >= 10 && sameDateTop10.length !== 10 && titleTranslations.missingCount > 0) {
      evidence.diagnosis.category = "translation_title";
      evidence.diagnosis.reason = `${titleTranslations.missingCount} active-date Signal Card source title(s) lack approved Chinese translations`;
      evidence.diagnosis.neededAction = "repair source-title translations or upstream title sync, rebuild Business frontstage JSON, rerun the unified Business gate only";
    } else if (sameDateTop10.length !== 10) {
      evidence.diagnosis.category = "top10_contract";
      evidence.diagnosis.reason = `public Top10 count is ${sameDateTop10.length}, expected 10`;
      evidence.diagnosis.neededAction = "repair Top10/frontstage build contract; do not recollect Raw unless supply counts prove a specific source/channel shortage";
    } else if (cardFiles < 10) {
      evidence.diagnosis.category = "core_supply_shortfall";
      evidence.diagnosis.reason = `signal Card files ${cardFiles} below 10`;
      evidence.diagnosis.neededAction = "diagnose Raw/Pool/Core/non-large Core counts and refill only the deficient source/channel";
    } else if (evidence.qualityGateStatus === "failed") {
      evidence.diagnosis.category = "source_first_frontstage_gate";
      evidence.diagnosis.reason = `quality gate failed: ${rel(qualityGateFile)}`;
      evidence.diagnosis.neededAction = "repair the failed source-first/frontstage gate and rerun that gate";
    } else if (problems.some((item) => /workflow is queued|workflow is in_progress|Pages workflow is/iu.test(item.message))) {
      evidence.diagnosis.category = "publication";
      evidence.diagnosis.reason = "workflow or Pages is still queued/in_progress";
      evidence.diagnosis.neededAction = "wait for publication workflow completion and rerun supervision";
    } else if (evidence.publicationClosure.localSync.available && !evidence.publicationClosure.localSync.clean) {
      evidence.diagnosis.category = "local_sync";
      evidence.diagnosis.reason = `local workspace has ${evidence.publicationClosure.localSync.dirtyFiles} dirty file(s)`;
      evidence.diagnosis.neededAction = "clean or isolate local sync blockers; do not rerun Business generated assets";
    }
  } else if (
    problems.some((item) => /workflow is queued|workflow is in_progress|Pages workflow is/iu.test(item.message))
    || warnings.some((item) => /workflow conclusion|Pages|publication|manifest|Obsidian|dirty/iu.test(item))
  ) {
    evidence.diagnosis.category = warnings.some((item) => /Obsidian|dirty/iu.test(item)) ? "local_sync" : "publication";
    evidence.diagnosis.reason = "same-date data is healthy; remaining issue is publication/local sync closure";
    evidence.diagnosis.neededAction = "repair publication/local sync closure only; do not rerun Raw/Pool/Card generation";
  }

  if (problems.length) {
    actions.push("send Codex a business_signals repair request with failed gate and report path");
  }

  return {
    id: "business_signals",
    label: "Business Signals / Intelligence Map / Dashboard",
    schedule: "08:57 primary production; 09:27 conditional health dispatch; Hermes early handoff 09:45 / 09:55",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildFirstLineLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = hasWindowPassed(date, "09:55");
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  const gateFile = path.join(reportsDir, `${date}-follow-builders-data-gate.md`);
  const data = readJson(dataFile, {});
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const gh = githubWorkflowState("daily-first-line-viewpoints-pr.yml", `automation/first-line-viewpoints-${date}`);

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.feedGeneratedAt = data?.meta?.feedGeneratedAt || "";
  evidence.remarks = data?.stats?.remarks ?? (Array.isArray(data.remarks) ? data.remarks.length : 0);
  evidence.builders = data?.stats?.builders ?? (Array.isArray(data.builders) ? data.builders.length : 0);
  evidence.gateStatus = statusFromGate(gateFile);
  evidence.gateReport = exists(gateFile) ? rel(gateFile) : "missing";
  evidence.github = gh;

  if (windowPassed) {
    if (!exists(dataFile)) addProblem(problems, `missing first-line data file: ${rel(dataFile)}`);
    if (generatedDate !== date) addProblem(problems, `first-line data date is ${generatedDate || "missing"}, expected ${date}`);
    if (Number(evidence.remarks) < 12) addProblem(problems, `remarks count ${evidence.remarks} below 12`);
    if (Number(evidence.builders) < 6) addProblem(problems, `builders count ${evidence.builders} below 6`);
    if (evidence.gateStatus === "failed") addProblem(problems, `follow-builders gate failed: ${rel(gateFile)}`);
    if (evidence.gateStatus === "missing") warnings.push(`missing follow-builders gate report: ${rel(gateFile)}`);
  }

  const localDataHealthy =
    exists(dataFile) &&
    generatedDate === date &&
    Number(evidence.remarks) >= 12 &&
    Number(evidence.builders) >= 6 &&
    evidence.gateStatus !== "failed";
  evidence.localDataHealthy = localDataHealthy;

  if (gh.available && !localDataHealthy) {
    if (!gh.latest_run && hasWindowPassed(date, "09:30")) {
      addProblem(problems, "no same-date First-Line Viewpoints RSS run after 09:30 Hermes handoff", "manual_required");
      actions.push("run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `First-Line Viewpoints workflow is ${gh.latest_run.status}`, "waiting");
      actions.push("wait for First-Line Viewpoints workflow completion");
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
    schedule: "08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Hermes RSS handoff 09:30",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildFollowBuildersSkillLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const windowPassed = hasWindowPassed(date, "16:30");
  const outputFile = path.join(root, "01-SiteV2", "content", "07-points", `${date}-builders-viewpoints.md`);
  const reportFile = path.join(reportsDir, `${date}-follow-builders-skill-local-publish.md`);
  const outputText = readText(outputFile);
  const reportText = readText(reportFile);
  const itemCount = (outputText.match(/^## BP-\d{8}-\d{2}\b/mgu) || []).length;
  const reportCount = Number((reportText.match(/^- builder_items_count:\s*(\d+)/mu) || [])[1] || 0);

  evidence.outputFile = exists(outputFile) ? rel(outputFile) : "missing";
  evidence.reportFile = exists(reportFile) ? rel(reportFile) : "missing";
  evidence.itemCount = itemCount;
  evidence.reportCount = reportCount;

  if (windowPassed) {
    if (!exists(outputFile)) addProblem(problems, `missing follow-builders skill output file: ${rel(outputFile)}`);
    if (itemCount <= 0) addProblem(problems, `follow-builders skill output item count ${itemCount} below 1`);
    if (exists(reportFile) && reportCount > 0 && reportCount !== itemCount) {
      addProblem(problems, `follow-builders skill report count ${reportCount} does not match output count ${itemCount}`);
    }
  }
  if (!exists(reportFile) && windowPassed) {
    addProblem(problems, "no same-date follow-builders skill publish report after 16:30 watchdog", "manual_required");
    actions.push("run `powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-follow-builders-skill.ps1` locally");
  }
  if (windowPassed && !exists(reportFile)) {
    warnings.push("follow-builders skill publish report is missing before Hermes record time");
  }

  if (problems.length) {
    actions.push("send Codex a follow_builders_skill repair request with publish report path");
  }

  return {
    id: "follow_builders_skill",
    label: "First-Line Viewpoints Skill",
    schedule: "16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildCommunityLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const localWindowPassed = hasWindowPassed(date, "08:45");
  const publishWindowPassed = hasWindowPassed(date, "09:30");
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
  const gateFile = path.join(reportsDir, `${date}-community-intelligence-gate.md`);
  const data = readJson(dataFile, {});
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const task = scheduledTaskState("WaveSight Community Intelligence Daily");
  const gh = githubWorkflowState("daily-community-intelligence-pr.yml", `automation/community-intelligence-${date}`);
  const mergedPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.mergedAt) : null;
  const openPr = Array.isArray(gh.prs) ? gh.prs.find((pr) => pr.state === "OPEN") : null;
  const publicationReady = Boolean(gh.latest_run || mergedPr || openPr);

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.items = Array.isArray(data.items) ? data.items.length : 0;
  evidence.links = Array.isArray(data.links) ? data.links.length : 0;
  evidence.selectedKeywords = Array.isArray(data?.meta?.selectedKeywords) ? data.meta.selectedKeywords.length : 0;
  evidence.collectorErrors = Array.isArray(data?.meta?.errors) ? data.meta.errors.length : 0;
  evidence.gateStatus = statusFromGate(gateFile);
  evidence.gateReport = exists(gateFile) ? rel(gateFile) : "missing";
  evidence.scheduledTask = task;
  evidence.github = gh;
  evidence.publication = {
    communityPrMerged: Boolean(mergedPr),
    communityPrOpen: Boolean(openPr),
    communityPrUrl: mergedPr?.url || openPr?.url || "",
  };
  const communityDataHealthy =
    exists(dataFile) &&
    generatedDate === date &&
    evidence.items >= 12 &&
    evidence.links >= 3 &&
    evidence.collectorErrors === 0 &&
    evidence.gateStatus === "passed";

  if (localWindowPassed) {
    if (!exists(dataFile)) addProblem(problems, `missing community data file: ${rel(dataFile)}`);
    if (generatedDate !== date) addProblem(problems, `community data date is ${generatedDate || "missing"}, expected ${date}`);
    if (evidence.items < 12) addProblem(problems, `community item count ${evidence.items} below 12`);
    if (evidence.links < 3) addProblem(problems, `community deduped links ${evidence.links} below 3`);
    if (evidence.collectorErrors > 0) addProblem(problems, `community collector recorded ${evidence.collectorErrors} blocking error(s)`);
    if (evidence.gateStatus === "failed") addProblem(problems, `community gate failed: ${rel(gateFile)}`);
    if (evidence.gateStatus === "missing") warnings.push(`missing community gate report: ${rel(gateFile)}`);
  }

  if (task.available) {
    const lastResult = Number(task.task?.LastTaskResult);
    const state = scheduledTaskStateName(task.task?.State);
    evidence.scheduledTask.stateName = state;
    if (!["Ready", "Running"].includes(state)) {
      addProblem(problems, `community scheduled task state is ${state || "unknown"}`, "manual_required");
    }
    if (Number.isFinite(lastResult) && lastResult !== 0) {
      if (communityDataHealthy) {
        warnings.push(`community scheduled task last result is ${lastResult}, but same-date data and gate are healthy`);
      } else {
        addProblem(problems, `community scheduled task last result is ${lastResult}`, "manual_required");
      }
    }
  } else {
    warnings.push(task.warning || "scheduled task state unavailable");
  }

  if (gh.available) {
    if (!publicationReady && publishWindowPassed) {
      addProblem(problems, "no same-date Community Intelligence publish workflow after 09:30 Hermes handoff", "manual_required");
      actions.push("run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass");
    } else if (!gh.latest_run && mergedPr) {
      warnings.push(`same-date Community Intelligence automation PR already merged: ${mergedPr.url}`);
    } else if (!gh.latest_run && openPr) {
      addProblem(problems, `Community Intelligence publication PR is open: ${openPr.url}`, "waiting");
      actions.push("wait for Community Intelligence PR merge before declaring publication missing");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `Community Intelligence publish workflow is ${gh.latest_run.status}`, "waiting");
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

  if (localWindowPassed && generatedDate !== date) {
    actions.push("rerun `agent-workflow/tools/run-community-intelligence.ps1` locally");
  }
  if (problems.length) {
    actions.push("send Codex a community_intelligence repair request with log and gate report path");
  }

  return {
    id: "community_intelligence",
    label: "Community Intelligence",
    schedule: "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Hermes publish handoff 09:30",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildSkillOpsLane() {
  const problems = [];
  const warnings = [];
  const actions = [];
  const result = runOptional("node", ["agent-workflow/tools/check-skill-ops.mjs", "--json"], 20000);
  const check = parseCommandJson(result, null);
  const summary = check?.summary || {};
  const evidence = {
    command: "npm run check:skill-ops",
    registryState: summary.registryState || "unknown",
    governed: summary.governed ?? null,
    current: summary.current ?? null,
    laneOwners: summary.laneOwners ?? null,
    syncDrift: summary.syncDrift ?? null,
    evalCoverage: summary.evalCoverage ?? null,
    exampleCoverage: summary.exampleCoverage ?? null,
    memoryRequiredMissing: summary.memoryRequiredMissing ?? null,
  };

  if (!check) {
    addProblem(problems, `Skill Ops check did not return JSON: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`, "manual_required");
  } else if (!check.ok) {
    for (const error of check.errors || []) addProblem(problems, error, "manual_required");
  }
  if (!result.ok && check?.ok) warnings.push(result.stderr.trim() || "Skill Ops check returned a non-zero status without blocking errors");

  if (problems.length) {
    actions.push("repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror");
    actions.push("run `npm run audit:skills` after the repair");
    if (summary.syncDrift) actions.push("run `npm run sync:skill-store` after confirming the project copy is the source of truth");
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
  if (!lane.problems.length && !lane.actions.length) return "none";
  return [
    `lane: ${lane.id}`,
    `failed_gate: ${repairGate(lane)}`,
    `report_path: agent-workflow/reports/${date}-daily-supervision-report.md`,
    `data_generated: ${repairDataGenerated(lane)}`,
    `needed_action: ${repairNeededAction(lane)}`,
  ].join("\n");
}

function existingOpenIncident(file) {
  if (!fs.existsSync(file)) return false;
  const fields = parseFields(readText(file));
  return !["resolved", "manual_archive"].includes(fields.status || "open");
}

function uniqueInboxFile(baseFile) {
  if (!fs.existsSync(baseFile) || existingOpenIncident(baseFile)) return baseFile;
  const parsed = path.parse(baseFile);
  let index = 2;
  while (true) {
    const candidate = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    if (!fs.existsSync(candidate) || existingOpenIncident(candidate)) return candidate;
    index += 1;
  }
}

function writeHermesInbox(payload, mdPath) {
  fs.mkdirSync(inboxDir, { recursive: true });
  const created = [];

  for (const lane of payload.lanes) {
    if (lane.status === "waiting") continue;
    if (!lane.problems.length) continue;
    const categories = incidentCategories(lane);
    const primaryCategory = categories[0] || "repair";
    const baseFile = path.join(inboxDir, `${date}-${lane.id}-${slug(primaryCategory)}.md`);
    const file = uniqueInboxFile(baseFile);
    const priority = lane.status === "failed" ? "urgent" : "normal";
    const fields = fs.existsSync(file) && existingOpenIncident(file) ? parseFields(readText(file)) : {};
    const createdAt = fields.created_at || shanghaiTimestamp();
    const content = [
      "status: open",
      `priority: ${priority}`,
      `lane: ${lane.id}`,
      `category: ${primaryCategory}`,
      `failed_gate: ${repairGate(lane)}`,
      `report_path: ${rel(mdPath)}`,
      `data_generated: ${repairDataGenerated(lane)}`,
      `needed_action: ${repairNeededAction(lane)}`,
      `created_at: ${createdAt}`,
      `updated_at: ${shanghaiTimestamp()}`,
      "source: hermes-auto",
      "",
      `# Hermes Repair Request: ${lane.label}`,
      "",
      "## Evidence",
      "",
      ...lane.problems.map((item) => `- problem: ${item.message || item}`),
      ...lane.warnings.map((item) => `- warning: ${item.message || item}`),
      `- supervision_report: \`${rel(mdPath)}\``,
      `- categories: ${categories.join(", ")}`,
      "",
      "## Expected Codex Action",
      "",
      ...lane.actions.map((item) => `- ${item}`),
      "- Repair the smallest script, rule, gate, eval, or memory path needed to prevent recurrence.",
      "- Rerun the failed gate or the smallest relevant validation.",
      "- Record the repair with `npm run record:action`.",
      "",
      "## User Escalation Needed",
      "",
      "- no, unless Codex needs GitHub permission, login state, or business judgment.",
      "",
    ].join("\n");

    fs.writeFileSync(file, content, "utf8");
    created.push(rel(file));
  }

  return created;
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-daily-supervision-report.json`);
  const mdPath = path.join(reportsDir, `${date}-daily-supervision-report.md`);
  const latestJsonPath = path.join(reportsDir, "daily-supervision-report-latest.json");
  const latestMdPath = path.join(reportsDir, "daily-supervision-report-latest.md");

  const tableRows = payload.lanes.map((lane) => (
    `| ${lane.label} | ${lane.schedule} | ${lane.status} | ${lane.problems.length} | ${lane.warnings.length} |`
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
    "| Lane | Timeline | Status | Problems | Warnings |",
    "|---|---|---|---:|---:|",
    ...tableRows,
    "",
    ...laneBlocks,
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  const inboxFiles = writeHermesInbox(payload, mdPath);
  return { jsonPath, mdPath, inboxFiles };
}

function main() {
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
  const { jsonPath, mdPath, inboxFiles } = writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(jsonPath),
    markdown: rel(mdPath),
    hermes_inbox: inboxFiles,
  }, null, 2));
  if (status === "failed") process.exit(1);
}

main();
