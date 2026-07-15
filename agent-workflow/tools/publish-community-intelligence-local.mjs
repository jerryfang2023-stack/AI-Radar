#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const merge = args.get("merge") !== "false";
const pollSeconds = Number.parseInt(args.get("poll-seconds") || "120", 10);
const branch = `automation/community-intelligence-${date}`;
const reportsDir = path.join(root, "agent-workflow", "reports");
const reportFile = path.join(reportsDir, `${date}-community-intelligence-local-publish.md`);

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

function commandLabel(command, commandArgs) {
  return `${command} ${commandArgs.join(" ")}`;
}

function resultDetail(result) {
  return [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n").trim();
}

function run(command, commandArgs, options = {}) {
  const { label = commandLabel(command, commandArgs), ...spawnOptions } = options;
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    ...spawnOptions,
  });
  if (result.error || result.status !== 0) {
    const detail = resultDetail(result);
    throw new Error(`${label} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout.trim();
}

function tryRun(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    ...options,
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
}

function writeReport(lines) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportFile, `${lines.join("\n")}\n`, "utf8");
}

function appendReport(lines) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.appendFileSync(reportFile, `${lines.join("\n")}\n`, "utf8");
}

function stageIfExists(file) {
  if (fs.existsSync(path.join(root, file))) {
    run("git", ["add", "-f", file]);
  }
}

function stageViewFiles() {
  const dir = path.join(root, "01-SiteV2", "content", "07-community-intelligence", "views");
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      stageIfExists(`01-SiteV2/content/07-community-intelligence/views/${entry.name}`);
    }
  }
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

function openOrUpdatePr() {
  const bodyFile = path.join(os.tmpdir(), `wavesight-community-${date}-pr.md`);
  fs.writeFileSync(bodyFile, [
    `Community Intelligence update for ${date}.`,
    "",
    "This PR was created by the local collector after data and Obsidian archive gates passed.",
    "",
    "- validated `community-intelligence.json`;",
    "- included the daily snapshot and Obsidian archive files;",
    "- passed `assert-community-intelligence-data.mjs`;",
    "- no business-signal Cards, relationship graph data, trend candidates, or first-line viewpoint data.",
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
      `Community Intelligence update ${date}`,
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
    `Community Intelligence update ${date}`,
    "--body-file",
    bodyFile,
  ]);
  const created = ghJson(["pr", "view", branch, "--json", "number,url"], null);
  return created || { number: "", url };
}

function mergePr(prNumber) {
  const subject = `Update community intelligence for ${date}`;
  const body = "Automated Community Intelligence update after local collection and data gate passed.";
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

  throw new Error(`Unable to merge Community Intelligence PR:\n${autoMerge.stderr}\n${directMerge.stderr}`.trim());
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

export function syncLocalMainAfterPublish(originalBranch, commandRunner = tryRun) {
  const sync = {
    attempted: false,
    ok: true,
    warning: "",
    checkoutOk: false,
    pulled: false,
    dirtyFiles: 0,
  };

  if (originalBranch !== "main") {
    sync.warning = `Skipped local main sync because the run started on ${originalBranch}.`;
    return sync;
  }

  sync.attempted = true;
  const checkout = commandRunner("git", ["checkout", "main"]);
  sync.checkoutOk = checkout.ok;
  if (!checkout.ok) {
    sync.ok = false;
    sync.warning = `Publication completed, but local checkout back to main failed:\n${resultDetail(checkout)}`;
    return sync;
  }

  const dirty = commandRunner("git", ["status", "--porcelain"]);
  if (!dirty.ok) {
    sync.ok = false;
    sync.warning = `Publication completed, but local workspace status could not be checked:\n${resultDetail(dirty)}`;
    return sync;
  }

  const dirtyFiles = dirty.stdout.split(/\r?\n/u).filter(Boolean);
  sync.dirtyFiles = dirtyFiles.length;
  if (dirtyFiles.length > 0) {
    sync.ok = false;
    sync.warning = `Publication completed, but local main pull was skipped because the workspace has ${dirtyFiles.length} dirty file(s).`;
    return sync;
  }

  const pull = commandRunner("git", ["pull", "--ff-only", "origin", "main"]);
  if (!pull.ok) {
    sync.ok = false;
    sync.warning = `Publication completed, but local main fast-forward failed:\n${resultDetail(pull)}`;
    return sync;
  }

  sync.pulled = true;
  return sync;
}

function main() {
  const originalBranch = run("git", ["branch", "--show-current"]) || "main";
  const summary = [
    `# ${date} Community Intelligence Local Publish`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- source_branch: ${originalBranch}`,
    `- publish_branch: ${branch}`,
  ];

  run("node", ["agent-workflow/tools/assert-community-intelligence-data.mjs", `--date=${date}`]);

  const stagedBefore = run("git", ["diff", "--cached", "--name-only"]);
  if (stagedBefore) {
    throw new Error(`Refusing to publish with pre-existing staged changes:\n${stagedBefore}`);
  }

  run("git", ["fetch", "origin", "main"]);
  run("git", ["config", "user.name", "github-actions[bot]"]);
  run("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  run("git", ["checkout", "-B", branch]);

  writeReport(summary);

  stageIfExists(`agent-workflow/reports/${date}-community-intelligence-local-publish.md`);
  stageIfExists(`agent-workflow/reports/${date}-community-intelligence-gate.md`);
  stageIfExists("agent-workflow/reports/community-intelligence-gate-latest.md");
  stageIfExists("01-SiteV2/site/data/community-intelligence.json");
  stageIfExists("01-SiteV2/site/data/community-intelligence-daily/index.json");
  stageIfExists(`01-SiteV2/site/data/community-intelligence-daily/${date}.json`);
  stageIfExists("01-SiteV2/content/07-community-intelligence/Community Intelligence Index.md");
  stageIfExists("01-SiteV2/content/07-community-intelligence/README.md");
  stageIfExists(`01-SiteV2/content/07-community-intelligence/daily/${date} Community Intelligence.md`);
  stageViewFiles();

  const staged = run("git", ["diff", "--cached", "--name-only"]);
  if (!staged) {
    console.log(JSON.stringify({
      ok: true,
      changed: false,
      message: "No Community Intelligence changes to publish.",
      branch,
    }, null, 2));
    return;
  }

  run("git", ["commit", "-m", `Update community intelligence for ${date}`]);
  run("git", ["push", "--force-with-lease", "origin", branch]);
  const pr = openOrUpdatePr();
  const mergeStatus = merge ? mergePr(pr.number) : "skipped";
  const merged = merge ? waitForMerge(pr.number) : null;

  if (merge && !merged) {
    throw new Error(`Community Intelligence PR #${pr.number} was opened but not merged within ${pollSeconds}s: ${pr.url}`);
  }

  const localSync = merge ? syncLocalMainAfterPublish(originalBranch) : { attempted: false, ok: true, warning: "Skipped because merge was disabled." };
  const warnings = localSync.warning && !localSync.ok ? [localSync.warning] : [];

  appendReport([
    "",
    "## Publish Result",
    "",
    `- pr: ${pr.url || pr.number || ""}`,
    `- merge_status: ${mergeStatus}`,
    `- merged_at: ${merged?.mergedAt || ""}`,
    `- merge_commit: ${merged?.mergeCommit?.oid || ""}`,
    `- local_sync_attempted: ${localSync.attempted}`,
    `- local_sync_ok: ${localSync.ok}`,
    `- local_sync_warning: ${localSync.warning || ""}`,
  ]);

  console.log(JSON.stringify({
    ok: true,
    changed: true,
    branch,
    pr,
    mergeStatus,
    mergedAt: merged?.mergedAt || "",
    mergeCommit: merged?.mergeCommit?.oid || "",
    localSync,
    warnings,
    report: rel(reportFile),
  }, null, 2));
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase();
if (isDirectRun) {
  try {
    main();
  } catch (error) {
    console.log(JSON.stringify({
      ok: false,
      error: error?.message || String(error),
    }, null, 2));
    process.exit(1);
  }
}
