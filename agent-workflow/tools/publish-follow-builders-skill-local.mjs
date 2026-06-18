#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const skillRoot = path.join(os.homedir(), ".skill-store", "follow-builders");
const skillScript = path.join(skillRoot, "scripts", "prepare-digest.js");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const merge = args.get("merge") !== "false";
const pollSeconds = Number.parseInt(args.get("poll-seconds") || "120", 10);
const branch = `automation/follow-builders-skill-${date}`;
const outputFile = path.join(root, "01-SiteV2", "content", "07-points", `${date}-builders-viewpoints.md`);
const reportFile = path.join(reportsDir, `${date}-follow-builders-skill-local-publish.md`);

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

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    ...options,
  });
  if (result.error || result.status !== 0) {
    const detail = [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${commandArgs.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout.trim();
}

function tryRun(command, commandArgs) {
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

function ghJson(commandArgs, fallback = null) {
  const result = tryRun("gh", commandArgs);
  if (!result.ok) return fallback;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return fallback;
  }
}

function ensureSkillStore() {
  if (!fs.existsSync(skillRoot)) {
    throw new Error(`follow-builders skill store not found: ${skillRoot}`);
  }
  if (!fs.existsSync(skillScript)) {
    throw new Error(`follow-builders skill script not found: ${skillScript}`);
  }
}

function ensureCleanWorktree() {
  const status = run("git", ["status", "--porcelain"]);
  if (status) {
    throw new Error(`Refusing to publish with a dirty worktree:\n${status}`);
  }
}

function stageIfExists(file) {
  if (fs.existsSync(path.join(root, file))) {
    run("git", ["add", "-f", file]);
  }
}

function countGeneratedItems(file) {
  const text = fs.readFileSync(file, "utf8");
  const matches = text.match(/^## BP-\d{8}-\d{2}\b/mgu);
  return matches ? matches.length : 0;
}

function writeReport(lines) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportFile, `${lines.join("\n")}\n`, "utf8");
}

function appendReport(lines) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.appendFileSync(reportFile, `${lines.join("\n")}\n`, "utf8");
}

function openOrUpdatePr() {
  const bodyFile = path.join(os.tmpdir(), `wavesight-follow-builders-skill-${date}-pr.md`);
  fs.writeFileSync(bodyFile, [
    `Follow-builders skill update for ${date}.`,
    "",
    "This PR was created by the local afternoon skill task after the skill digest and file checks passed.",
    "",
    "- generated `01-SiteV2/content/07-points/${date}-builders-viewpoints.md` from the local follow-builders skill;",
    "- synced the generated skill viewpoints into `01-SiteV2/knowledge/02-Opinion-Timelines/`;",
    "- recorded the run in `agent-workflow/reports/${date}-follow-builders-skill-local-publish.md`;",
    "- auto-publishes through a branch and PR so Hermes can record the run from a durable report path.",
  ].join("\n"), "utf8");

  const existing = ghJson([
    "pr",
    "list",
    "--state",
    "open",
    "--head",
    branch,
    "--json",
    "number,url",
    "--limit",
    "1",
  ], []);

  if (Array.isArray(existing) && existing[0]?.number) {
    run("gh", [
      "pr",
      "edit",
      String(existing[0].number),
      "--title",
      `Follow-builders skill update ${date}`,
      "--body-file",
      bodyFile,
    ]);
    return existing[0];
  }

  const url = run("gh", [
    "pr",
    "create",
    "--base",
    "main",
    "--head",
    branch,
    "--title",
    `Follow-builders skill update ${date}`,
    "--body-file",
    bodyFile,
  ]);
  const created = ghJson(["pr", "view", branch, "--json", "number,url"], null);
  return created || { number: "", url };
}

function mergePr(prNumber) {
  const subject = `Update follow-builders skill for ${date}`;
  const body = "Automated follow-builders skill update after local generation and validation passed.";
  const autoMerge = tryRun("gh", [
    "pr",
    "merge",
    String(prNumber),
    "--squash",
    "--auto",
    "--delete-branch",
    "--subject",
    subject,
    "--body",
    body,
  ]);
  if (autoMerge.ok) return "auto_or_merged";

  const directMerge = tryRun("gh", [
    "pr",
    "merge",
    String(prNumber),
    "--squash",
    "--delete-branch",
    "--subject",
    subject,
    "--body",
    body,
  ]);
  if (directMerge.ok) return "merged";

  throw new Error(`Unable to merge follow-builders skill PR:\n${autoMerge.stderr}\n${directMerge.stderr}`.trim());
}

function waitForMerge(prNumber) {
  const deadline = Date.now() + Math.max(15, pollSeconds) * 1000;
  while (Date.now() < deadline) {
    const pr = ghJson(["pr", "view", String(prNumber), "--json", "mergedAt,mergeCommit,url"], null);
    if (pr?.mergedAt) return pr;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
  }
  return null;
}

function main() {
  if (!date) throw new Error("Unable to resolve production date.");
  ensureSkillStore();
  ensureCleanWorktree();

  const originalBranch = run("git", ["branch", "--show-current"]) || "main";

  run("node", ["--check", "agent-workflow/tools/generate-builders-viewpoints-from-follow-builders-skill.mjs"]);
  run("node", ["agent-workflow/tools/generate-builders-viewpoints-from-follow-builders-skill.mjs", `--date=${date}`]);

  if (!fs.existsSync(outputFile)) {
    throw new Error(`Builders viewpoints file was not generated: ${outputFile}`);
  }

  const itemCount = countGeneratedItems(outputFile);
  if (itemCount <= 0) {
    throw new Error(`Builders viewpoints output has no items: ${outputFile}`);
  }

  run("node", ["--check", "agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs"]);
  const obsidianSyncRaw = run("node", [
    "agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs",
    `--points-file=${rel(outputFile)}`,
  ]);
  let obsidianSync = {};
  try {
    obsidianSync = JSON.parse(obsidianSyncRaw);
  } catch {
    throw new Error(`Unable to parse Obsidian sync output:\n${obsidianSyncRaw}`);
  }
  if (!obsidianSync.ok) {
    throw new Error(`Obsidian sync did not report ok:\n${obsidianSyncRaw}`);
  }

  writeReport([
    `# ${date} Follow-Builders Skill Local Publish`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- generated_at_shanghai: ${shanghaiTimestamp()}`,
    `- source_branch: ${originalBranch}`,
    `- publish_branch: ${branch}`,
    `- skill_root: ${rel(skillRoot)}`,
    `- skill_script: ${rel(skillScript)}`,
    `- output_file: ${rel(outputFile)}`,
    `- builder_items_count: ${itemCount}`,
    `- obsidian_sync_added: ${obsidianSync.added ?? 0}`,
    `- obsidian_sync_groups: ${obsidianSync.groups ?? 0}`,
    `- obsidian_sync_files: ${Array.isArray(obsidianSync.files) ? obsidianSync.files.length : 0}`,
    `- hermes_record: ${rel(reportFile)}`,
  ]);

  run("git", ["fetch", "origin", "main"]);
  run("git", ["config", "user.name", "github-actions[bot]"]);
  run("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  run("git", ["checkout", "-B", branch, "origin/main"]);

  stageIfExists(`agent-workflow/reports/${date}-follow-builders-skill-local-publish.md`);
  stageIfExists(`01-SiteV2/content/07-points/${date}-builders-viewpoints.md`);
  stageIfExists("01-SiteV2/knowledge/02-Opinion-Timelines");

  const staged = run("git", ["diff", "--cached", "--name-only"]);
  if (!staged) {
    console.log(JSON.stringify({
      ok: true,
      changed: false,
      message: "No follow-builders skill changes to publish.",
      branch,
      report: rel(reportFile),
    }, null, 2));
    return;
  }

  run("git", ["commit", "-m", `Update follow-builders skill for ${date}`]);
  run("git", ["push", "--force-with-lease", "origin", branch]);
  const pr = openOrUpdatePr();
  const mergeStatus = merge ? mergePr(pr.number) : "skipped";
  const merged = merge ? waitForMerge(pr.number) : null;

  if (merge && !merged) {
    throw new Error(`follow-builders skill PR #${pr.number} was opened but not merged within ${pollSeconds}s: ${pr.url}`);
  }

  if (merge && originalBranch === "main") {
    run("git", ["checkout", "main"]);
    run("git", ["pull", "--ff-only", "origin", "main"]);
  }

  console.log(JSON.stringify({
    ok: true,
    changed: true,
    branch,
    pr,
    mergeStatus,
    mergedAt: merged?.mergedAt || "",
    mergeCommit: merged?.mergeCommit?.oid || "",
    report: rel(reportFile),
    output: rel(outputFile),
  }, null, 2));
}

try {
  main();
} catch (error) {
  const message = String(error?.message || error || "unknown error").replace(/\r?\n/gu, " | ");
  if (fs.existsSync(reportFile)) {
    appendReport([
      "",
      "## Publish Failure",
      "",
      `- publish_status: failed`,
      `- failed_at: ${new Date().toISOString()}`,
      `- failed_at_shanghai: ${shanghaiTimestamp()}`,
      `- publish_error: ${JSON.stringify(message)}`,
    ]);
  }
  throw error;
}
