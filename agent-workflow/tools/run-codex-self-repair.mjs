#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { formatRecordedCommand } from "./lib/report-command.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);
const reportsDir = path.resolve(root, args.get("runtime-dir") || path.join("agent-workflow", "reports"));

const date = args.get("date") || shanghaiDate();
const repairMode = args.get("repair") || "safe";
const githubMode = args.get("github") || "auto";
const taskMode = args.get("scheduled-task") || "auto";
const invokeMode = String(args.get("invoke") || "off").toLowerCase();
const maxTasks = Number.parseInt(args.get("max-tasks") || "1", 10);
const codexCommand = args.get("codex-command") || "codex";
const codexLastMessagePath = path.join(reportsDir, `${date}-codex-self-repair-last-message.md`);
const reuseSelfCheck = ["true", "1", "yes", "on"].includes(String(args.get("reuse-self-check") || "").toLowerCase());
const allowSkillStoreSync = ["true", "1", "yes", "on"].includes(String(args.get("allow-skill-store-sync") || "").toLowerCase());

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

function parseArgList(value) {
  const result = [];
  let current = "";
  let quote = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote) {
        quote = "";
      } else {
        current += char;
      }
      continue;
    }
    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }
    if (/\s/u.test(char)) {
      if (current) {
        result.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (current) result.push(current);
  return result;
}

function enforceRepairWorktree(argsList, repairPath) {
  const result = [];
  let replaced = false;
  for (let index = 0; index < argsList.length; index += 1) {
    const value = argsList[index];
    if (value === "--cd") {
      result.push("--cd", repairPath);
      index += 1;
      replaced = true;
    } else if (value.startsWith("--cd=")) {
      result.push(`--cd=${repairPath}`);
      replaced = true;
    } else {
      result.push(value);
    }
  }
  if (!replaced) {
    const inputIndex = result.lastIndexOf("-");
    result.splice(inputIndex >= 0 ? inputIndex : result.length, 0, "--cd", repairPath);
  }
  return result;
}

function runCommand(label, command, argsList, options = {}) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    input: options.input || undefined,
    timeout: options.timeoutMs || 120000,
    windowsHide: true,
  });
  return {
    label,
    command: formatRecordedCommand(command, argsList),
    ok: !result.error && result.status === 0,
    status: result.status,
    error: result.error?.message || "",
    stdout: String(result.stdout || "").trim().slice(0, 12000),
    stderr: String(result.stderr || "").trim().slice(0, 12000),
    started_at: startedAt,
    finished_at: new Date().toISOString(),
  };
}

function runDailySelfCheck() {
  const commandArgs = [
    "agent-workflow/tools/run-daily-self-check.mjs",
    `--date=${date}`,
    `--repair=${repairMode}`,
    `--github=${githubMode}`,
    `--scheduled-task=${taskMode}`,
    `--runtime-dir=${reportsDir}`,
  ];
  if (allowSkillStoreSync) commandArgs.push("--allow-skill-store-sync=true");
  return runCommand("daily self-check", process.execPath, commandArgs, { timeoutMs: 240000 });
}

function reusedSelfCheckCommand() {
  return {
    label: "reuse daily self-check",
    command: `reuse ${path.join(reportsDir, `${date}-daily-self-check.json`)}`,
    ok: true,
    status: 0,
    error: "",
    stdout: "",
    stderr: "",
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
  };
}

function prepareRepairWorktree() {
  const repairRoot = path.resolve(
    args.get("repair-worktree")
      || path.join(process.env.LOCALAPPDATA || path.dirname(root), "WaveSight", "repair-worktrees", date),
  );
  const branch = `automation/codex-self-repair-${date}`;
  if (fs.existsSync(path.join(repairRoot, ".git"))) {
    const status = runCommand("inspect repair worktree", "git", ["-C", repairRoot, "status", "--porcelain"], { timeoutMs: 30000 });
    if (!status.ok || status.stdout) {
      return { ok: false, path: repairRoot, branch, command: status, reason: status.stdout ? "Existing repair worktree is dirty." : "Could not inspect repair worktree." };
    }
    return { ok: true, path: repairRoot, branch, command: status };
  }
  fs.mkdirSync(path.dirname(repairRoot), { recursive: true });
  const fetch = runCommand("fetch repair base", "git", ["fetch", "origin", "main"], { timeoutMs: 120000 });
  if (!fetch.ok) return { ok: false, path: repairRoot, branch, command: fetch, reason: "Could not fetch origin/main." };
  const branchExists = runCommand("inspect repair branch", "git", ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], { timeoutMs: 30000 });
  const worktreeArgs = branchExists.ok
    ? ["worktree", "add", repairRoot, branch]
    : ["worktree", "add", "-b", branch, repairRoot, "origin/main"];
  const created = runCommand("create isolated repair worktree", "git", worktreeArgs, { timeoutMs: 120000 });
  return { ok: created.ok, path: repairRoot, branch, command: created, reason: created.ok ? "" : "Could not create isolated repair worktree." };
}

function selectedTasks(selfCheckReport) {
  const tasks = selfCheckReport?.codex_repair_tasks || [];
  if (!Number.isFinite(maxTasks) || maxTasks <= 0) return tasks;
  return tasks.slice(0, maxTasks);
}

function buildPrompt(selfCheckReport, tasks, promptPath) {
  const dailySelfCheckMd = path.join(reportsDir, `${date}-daily-self-check.md`);
  const dailySupervisionMd = path.join(reportsDir, `${date}-daily-supervision-report.md`);
  const taskLines = tasks.map((task, index) => {
    const failedGate = task.failed_gate ? `\n- failed_gate: ${task.failed_gate}` : "";
    return [
      `## Task ${index + 1}: ${task.lane || "unknown"}`,
      "",
      `- severity: ${task.severity || "unknown"}`,
      `- report_path: ${task.report_path || dailySelfCheckMd}`,
      failedGate,
      "",
      task.instruction || "Inspect the linked report and repair the smallest failing path.",
    ].filter(Boolean).join("\n");
  }).join("\n\n");

  return [
    `# WaveSight Codex Self Repair Request - ${date}`,
    "",
    "You are Codex working in the WaveSight repo.",
    "",
    "Goal: repair the unresolved daily monitoring problem(s) from the non-Hermes self-check, using the smallest safe code/rule/gate change and the smallest relevant validation.",
    "",
    "Context:",
    "",
    "1. Read `AGENTS.md` first.",
    "2. Read the current task context in `context/08-automation.md` and the linked report files.",
    `3. Read \`${dailySelfCheckMd}\` and \`${dailySupervisionMd}\`.`,
    "4. Work only on the task(s) below unless a directly required dependency blocks them.",
    "",
    "Hard boundaries:",
    "",
    "- Do not lower evidence gates or promote weak Business Signal evidence.",
    "- Do not use First-Line Viewpoints or Community Intelligence as Business Signal facts.",
    "- Do not blindly rerun the full Business Signals chain.",
    "- Do not deploy directly from an automation branch.",
    "- Do not force pull, reset, stash, or overwrite local uncommitted work.",
    "- If a same-date workflow is queued or in progress, classify it as waiting instead of missing data.",
    "- If code changes are made, run the exact failed gate or the smallest relevant validation.",
    "",
    "Completion:",
    "",
    `- This run starts in isolated branch \`automation/codex-self-repair-${date}\`; do not switch branches.`,
    "- Stage only files required for the repair and prevention artifact.",
    "- Commit after validation passes.",
    "- Push the branch and open or update a PR when `gh` credentials permit it.",
    "- If branch, push, or PR creation is blocked, leave the validated local diff and report the exact blocker.",
    "",
    "Repair task(s):",
    "",
    taskLines || "- none",
    "",
    "Finish with changed files, validation performed, and remaining risk. Leave generated report artifacts out of the final diff unless they are required prevention artifacts.",
    "",
    `Prompt file: ${rel(promptPath)}`,
    `Self-check status: ${selfCheckReport?.status || "unknown"}`,
  ].join("\n");
}

function writePrompt(prompt) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const promptPath = path.join(reportsDir, `${date}-codex-self-repair-prompt.md`);
  fs.writeFileSync(promptPath, prompt, "utf8");
  return promptPath;
}

function writeReport(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-codex-self-repair.json`);
  const mdPath = path.join(reportsDir, `${date}-codex-self-repair.md`);
  const latestJsonPath = path.join(reportsDir, "codex-self-repair-latest.json");
  const latestMdPath = path.join(reportsDir, "codex-self-repair-latest.md");
  const taskRows = payload.tasks.map((task) => (
    `| ${task.lane || "unknown"} | ${task.severity || "unknown"} | ${String(task.failed_gate || "").replace(/\|/gu, "\\|")} | ${String(task.report_path || "").replace(/\|/gu, "\\|")} |`
  ));
  const md = [
    `# WaveSight Codex Self Repair - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- invoke_mode: ${payload.invoke_mode}`,
    `- self_check_report: ${payload.self_check_report}`,
    `- prompt: ${payload.prompt}`,
    "",
    "## Tasks",
    "",
    "| Lane | Severity | Failed Gate | Report |",
    "|---|---|---|---|",
    ...(taskRows.length ? taskRows : ["| none | none | none | none |"]),
    "",
    "## Self Check Command",
    "",
    `- ok: ${payload.self_check_command.ok}`,
    `- command: \`${payload.self_check_command.command}\``,
    "",
    "## Codex Invocation",
    "",
    payload.codex_invocation
      ? [
        `- ok: ${payload.codex_invocation.ok}`,
        `- command: \`${payload.codex_invocation.command}\``,
        `- status: ${payload.codex_invocation.status}`,
      ].join("\n")
      : "- none",
    ...(payload.block_reason ? ["", "## Block Reason", "", payload.block_reason] : []),
  ].join("\n") + "\n";

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  const selfCheckCommand = reuseSelfCheck ? reusedSelfCheckCommand() : runDailySelfCheck();
  const selfCheckJsonPath = path.join(reportsDir, `${date}-daily-self-check.json`);
  const selfCheckReport = readJson(selfCheckJsonPath, null);
  const tasks = selectedTasks(selfCheckReport);
  const promptPath = path.join(reportsDir, `${date}-codex-self-repair-prompt.md`);
  const prompt = buildPrompt(selfCheckReport, tasks, promptPath);
  writePrompt(prompt);

  let status = "prompt_ready";
  let blockReason = "";
  let codexInvocation = null;

  if (!selfCheckReport) {
    status = "self_check_missing";
    blockReason = `Daily self-check report not found: ${rel(selfCheckJsonPath)}`;
  } else if (!tasks.length) {
    status = "no_action";
  } else if (["on", "true", "1", "yes"].includes(invokeMode)) {
    const repairWorktree = prepareRepairWorktree();
    if (!repairWorktree.ok) {
      status = "blocked_repair_worktree";
      blockReason = `${repairWorktree.reason} ${repairWorktree.command?.stderr || repairWorktree.command?.error || ""}`.trim();
    } else {
      const defaultCodexArgs = `exec --sandbox danger-full-access --ask-for-approval never --output-last-message "${codexLastMessagePath}" --cd "${repairWorktree.path}" -`;
      const codexArgs = enforceRepairWorktree(parseArgList(args.get("codex-args") || defaultCodexArgs), repairWorktree.path);
      codexInvocation = runCommand("codex self repair", codexCommand, codexArgs, {
        input: prompt,
        timeoutMs: Number.parseInt(args.get("codex-timeout-ms") || "1800000", 10),
      });
      status = codexInvocation.ok ? "invoked" : "invoke_failed";
      if (!codexInvocation.ok) blockReason = codexInvocation.stderr || codexInvocation.error || "Codex command failed.";
    }
  }

  const payload = {
    ok: ["no_action", "prompt_ready", "invoked"].includes(status),
    status,
    date,
    generated_at: new Date().toISOString(),
    invoke_mode: invokeMode,
    repair_mode: repairMode,
    github_mode: githubMode,
    scheduled_task_mode: taskMode,
    self_check_report: rel(selfCheckJsonPath),
    prompt: rel(promptPath),
    tasks,
    self_check_command: selfCheckCommand,
    codex_command: codexCommand,
    codex_last_message: codexLastMessagePath,
    codex_invocation: codexInvocation,
    block_reason: blockReason,
  };
  const report = writeReport(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(report.jsonPath),
    markdown: rel(report.mdPath),
    prompt: rel(promptPath),
    tasks: tasks.length,
    block_reason: blockReason,
  }, null, 2));
  if (!payload.ok) process.exit(1);
}

main();
