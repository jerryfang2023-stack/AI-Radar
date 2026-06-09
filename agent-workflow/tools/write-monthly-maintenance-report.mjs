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
const days = Number(args.get("days") || 30);
const staleAfterDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 30;

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(`${value}T00:00:00+08:00`);
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

function runOptional(command, argsList, timeoutMs = 10000) {
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
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

function dirSizeBytes(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSizeBytes(file);
    else {
      try {
        total += fs.statSync(file).size;
      } catch {
        // Ignore files that disappear during the scan.
      }
    }
  }
  return total;
}

function formatBytes(bytes) {
  const units = ["bytes", "KiB", "MiB", "GiB"];
  let value = Number(bytes) || 0;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function parseCountObjects(stdout) {
  const data = {};
  for (const line of stdout.split(/\r?\n/u)) {
    const match = line.match(/^([^:]+):\s*(.+)$/u);
    if (match) data[match[1]] = match[2];
  }
  return data;
}

function listTrackedLargeFiles() {
  const result = runOptional("git", ["ls-files"], 10000);
  if (!result.ok) return [];
  return result.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((file) => {
      const absolute = path.join(root, file);
      try {
        return { file, bytes: fs.statSync(absolute).size };
      } catch {
        return { file, bytes: 0 };
      }
    })
    .filter((item) => item.bytes >= 1024 * 1024)
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 20);
}

function listOldReportCandidates() {
  const cutoff = Date.now() - staleAfterDays * 24 * 60 * 60 * 1000;
  if (!fs.existsSync(reportsDir)) return [];
  const candidates = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (/latest|closeout|ledger|manifest/iu.test(entry.name)) continue;
      const stat = fs.statSync(file);
      if (stat.mtimeMs < cutoff) {
        candidates.push({ file: rel(file), bytes: stat.size, modified_at: stat.mtime.toISOString() });
      }
    }
  };
  walk(reportsDir);
  return candidates.sort((a, b) => b.bytes - a.bytes).slice(0, 50);
}

function listServiceResidue() {
  const fileResult = runOptional("rg", ["--files"], 10000);
  const files = fileResult.stdout
    .split(/\r?\n/u)
    .filter((file) => /netlify|vercel|artifact|artifacts|\.zip$/iu.test(file))
    .slice(0, 80);

  const contentResult = runOptional("rg", [
    "-n",
    "-i",
    "netlify|NETLIFY|netlify.toml|netlify deploy",
    ".",
    "-g",
    "!node_modules/**",
    "-g",
    "!.git/**",
  ], 10000);
  const contentMatches = contentResult.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .filter((line) => !/Netlify is retired|Netlify configuration|must not be used|Deployment path is GitHub Pages only/iu.test(line))
    .slice(0, 80);

  return { files, contentMatches };
}

function collectGitState() {
  const countObjects = runOptional("git", ["count-objects", "-vH"]);
  const status = runOptional("git", ["status", "--short", "--branch"]);
  const branches = runOptional("git", ["branch", "-vv"]);
  const worktrees = runOptional("git", ["worktree", "list", "--porcelain"]);
  const remotePrune = runOptional("git", ["remote", "prune", "origin", "--dry-run"]);
  const ahead = runOptional("git", ["log", "--oneline", "origin/main..main"]);
  const behind = runOptional("git", ["log", "--oneline", "main..origin/main"]);

  return {
    countObjects: parseCountObjects(countObjects.stdout),
    countObjectsRaw: countObjects.stdout.trim(),
    status: status.stdout.trim(),
    branches: branches.stdout.trim(),
    worktrees: worktrees.stdout.trim(),
    remotePrune: remotePrune.stdout.trim(),
    ahead: ahead.stdout.trim(),
    behind: behind.stdout.trim(),
    gitDirSize: formatBytes(dirSizeBytes(path.join(root, ".git"))),
  };
}

function collectRuntimeState() {
  const packageJson = readJson(path.join(root, "package.json"), {});
  const packageLock = readJson(path.join(root, "package-lock.json"), {});
  const workflows = fs.existsSync(path.join(root, ".github", "workflows"))
    ? fs.readdirSync(path.join(root, ".github", "workflows")).filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
    : [];
  const nodeVersion = runOptional("node", ["--version"]);
  const npmVersion = runOptional("npm", ["--version"]);
  return {
    packageVersion: packageJson.version || "",
    lockfileVersion: packageLock?.packages?.[""]?.version || "",
    scripts: Object.keys(packageJson.scripts || {}).sort(),
    workflows,
    nodeVersion: nodeVersion.stdout.trim(),
    npmVersion: npmVersion.stdout.trim(),
  };
}

function markdownList(items, formatter = (item) => item) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${formatter(item)}`).join("\n");
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-monthly-maintenance.json`);
  const mdPath = path.join(reportsDir, `${date}-monthly-maintenance.md`);
  const latestJsonPath = path.join(reportsDir, "monthly-maintenance-latest.json");
  const latestMdPath = path.join(reportsDir, "monthly-maintenance-latest.md");

  const md = [
    `# WaveSight Monthly Maintenance - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- stale_after_days: ${payload.stale_after_days}`,
    "",
    "## Git",
    "",
    `- .git size: ${payload.git.gitDirSize}`,
    `- count: ${payload.git.countObjects.count || "unknown"}`,
    `- prune-packable: ${payload.git.countObjects["prune-packable"] || "unknown"}`,
    `- garbage: ${payload.git.countObjects.garbage || "unknown"}`,
    `- size-pack: ${payload.git.countObjects["size-pack"] || "unknown"}`,
    "",
    "### Status",
    "",
    "```text",
    payload.git.status || "clean status unavailable",
    "```",
    "",
    "### Branches",
    "",
    "```text",
    payload.git.branches || "none",
    "```",
    "",
    "### Worktrees",
    "",
    "```text",
    payload.git.worktrees || "none",
    "```",
    "",
    "### Remote Prune Dry Run",
    "",
    "```text",
    payload.git.remotePrune || "none",
    "```",
    "",
    "## Large Tracked Files",
    "",
    markdownList(payload.largeFiles, (item) => `${item.file} (${formatBytes(item.bytes)})`),
    "",
    "## Old Report Cleanup Candidates",
    "",
    markdownList(payload.oldReports, (item) => `${item.file} (${formatBytes(item.bytes)}, modified ${item.modified_at})`),
    "",
    "## Service / Artifact Residue",
    "",
    "### Files",
    "",
    markdownList(payload.residue.files),
    "",
    "### Content Matches",
    "",
    markdownList(payload.residue.contentMatches),
    "",
    "## Runtime",
    "",
    `- package version: ${payload.runtime.packageVersion}`,
    `- lockfile version: ${payload.runtime.lockfileVersion}`,
    `- node: ${payload.runtime.nodeVersion}`,
    `- npm: ${payload.runtime.npmVersion}`,
    `- workflows: ${payload.runtime.workflows.join(", ") || "none"}`,
    "",
    "## Recommended Actions",
    "",
    markdownList(payload.actions),
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  const git = collectGitState();
  const runtime = collectRuntimeState();
  const largeFiles = listTrackedLargeFiles();
  const oldReports = listOldReportCandidates();
  const residue = listServiceResidue();
  const actions = [];

  if (!/^## main\.\.\.origin\/main\s*$/u.test(git.status)) {
    actions.push("Review local git status before running cleanup or release tasks.");
  }
  if (git.countObjects["prune-packable"] !== "0" || git.countObjects.garbage !== "0") {
    actions.push("Run git gc only after local commits are pushed or intentionally backed up.");
  }
  if (git.remotePrune) {
    actions.push("Review remote prune dry-run output and delete stale remote references intentionally.");
  }
  if (largeFiles.length) {
    actions.push("Review large tracked files and move generated artifacts out of repository history when possible.");
  }
  if (oldReports.length) {
    actions.push("Review old report cleanup candidates; keep closeouts, manifests, and version evidence.");
  }
  if (residue.files.length || residue.contentMatches.length) {
    actions.push("Review service / artifact residue and remove only active conflicts with the GitHub Pages deployment policy.");
  }
  if (!actions.length) actions.push("No monthly maintenance action required.");

  const status = actions.length === 1 && actions[0].startsWith("No ") ? "passed" : "review";
  const payload = {
    ok: true,
    status,
    generated_at: new Date().toISOString(),
    date,
    stale_after_days: staleAfterDays,
    git,
    runtime,
    largeFiles,
    oldReports,
    residue,
    actions,
  };

  const { jsonPath, mdPath } = writeReports(payload);
  console.log(JSON.stringify({ ok: true, status, report: rel(jsonPath), markdown: rel(mdPath) }, null, 2));
}

main();
