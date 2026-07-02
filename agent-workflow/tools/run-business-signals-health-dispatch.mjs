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

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function badBusinessTitle(title = "") {
  return /用处见原文|原文 AI 事件|原文事件标题|原文业务场景|linkedin\s+融资|github\s+original title|purpose see original/iu.test(String(title || ""));
}

function businessAssets() {
  const file = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
  const data = readJson(file, {});
  const activeDate = data?.meta?.activeDate || "";
  const cards = Array.isArray(data.frontstageCards) ? data.frontstageCards : (Array.isArray(data.cards) ? data.cards : []);
  const sameDateCards = cards.filter((item) => !item?.date || item.date === date);
  const badTitleCount = sameDateCards.filter((item) => badBusinessTitle(item.title || item.displayTitle || "")).length;
  return {
    ready: activeDate === date && sameDateCards.length > 0 && badTitleCount === 0,
    file: rel(file),
    activeDate,
    cards: sameDateCards.length,
    badTitleCount,
    generatedAt: data?.meta?.generatedAt || "",
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

function dispatchWorkflow() {
  const commandArgs = [
    "workflow",
    "run",
    workflowFile,
    "-f",
    `date=${date}`,
    "-f",
    `pass_score=${passScore}`,
  ];
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
    `- workflow: ${workflowFile}`,
    `- assets: \`${JSON.stringify(payload.assets)}\``,
    `- active_run: ${payload.active_run?.url || "none"}`,
    `- successful_run: ${payload.successful_run?.url || "none"}`,
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
  const assets = businessAssets();
  const runs = workflowRuns();
  const activeRun = runs.sameDateRuns.find((run) => run.status === "queued" || run.status === "in_progress") || null;
  const successfulRun = runs.sameDateRuns.find((run) => run.conclusion === "success") || null;
  let action = "skipped";
  let reason = "same-date Business Signals assets are already healthy";
  let ok = true;
  let dispatch = null;

  if (!runs.available) {
    action = "failed";
    reason = `GitHub run inspection failed: ${runs.error}`;
    ok = false;
  } else if (assets.ready) {
    action = "skipped";
  } else if (activeRun) {
    action = "waiting";
    reason = `same-date Business Signals workflow is already ${activeRun.status}`;
  } else if (successfulRun) {
    action = "skipped";
    reason = `same-date successful Business Signals workflow already exists: ${successfulRun.url}`;
  } else {
    dispatch = dispatchWorkflow();
    ok = dispatch.ok;
    action = dryRun ? "dry_run_dispatch" : dispatch.ok ? "dispatched" : "dispatch_failed";
    reason = dispatch.ok
      ? "no healthy same-date assets and no active/successful run; dispatched primary Business Signals workflow"
      : `failed to dispatch primary Business Signals workflow: ${dispatch.output || "unknown error"}`;
  }

  const payload = {
    ok,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    action,
    reason,
    workflow: workflowFile,
    pass_score: passScore,
    assets,
    active_run: activeRun,
    successful_run: successfulRun,
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

main();
